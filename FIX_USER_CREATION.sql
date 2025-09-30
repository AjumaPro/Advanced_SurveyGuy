-- =============================================
-- FIX USER CREATION ISSUES
-- =============================================
-- This script fixes user creation and management issues
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CHECK AND FIX AUTH POLICIES
-- =============================================

-- Note: Auth configuration is managed through Supabase Dashboard
-- Go to Authentication > Settings to enable/disable signup if needed

-- =============================================
-- 2. CREATE ADMIN USER CREATION FUNCTION
-- =============================================

-- Function to create user by admin (bypasses normal signup restrictions)
CREATE OR REPLACE FUNCTION public.create_user_by_admin(
    user_email TEXT,
    user_password TEXT,
    user_full_name TEXT DEFAULT '',
    user_role TEXT DEFAULT 'user',
    user_plan TEXT DEFAULT 'free'
)
RETURNS JSONB AS $$
DECLARE
    new_user_id UUID;
    result JSONB;
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND (p.role = 'admin' OR p.role = 'super_admin')
    ) AND auth.jwt() ->> 'email' != 'infoajumapro@gmail.com' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Admin access required'
        );
    END IF;

    -- Create user in auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        last_sign_in_at,
        app_metadata,
        user_metadata,
        is_sso_user,
        deleted_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        user_email,
        crypt(user_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object(
            'full_name', user_full_name,
            'role', user_role,
            'plan', user_plan
        ),
        false,
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object(
            'full_name', user_full_name,
            'role', user_role,
            'plan', user_plan
        ),
        false,
        NULL
    ) RETURNING id INTO new_user_id;

    -- Create profile for the new user
    INSERT INTO profiles (
        id,
        email,
        full_name,
        role,
        plan,
        is_active,
        is_verified,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        user_email,
        user_full_name,
        user_role,
        user_plan,
        true,
        true,
        NOW(),
        NOW()
    );

    RETURN jsonb_build_object(
        'success', true,
        'user_id', new_user_id,
        'email', user_email,
        'message', 'User created successfully'
    );

EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User with this email already exists'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. CREATE USER UPDATE FUNCTION
-- =============================================

-- Function to update user by admin
CREATE OR REPLACE FUNCTION public.update_user_by_admin(
    target_user_id UUID,
    user_email TEXT DEFAULT NULL,
    user_full_name TEXT DEFAULT NULL,
    user_role TEXT DEFAULT NULL,
    user_plan TEXT DEFAULT NULL,
    user_is_active BOOLEAN DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND (p.role = 'admin' OR p.role = 'super_admin')
    ) AND auth.jwt() ->> 'email' != 'infoajumapro@gmail.com' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Admin access required'
        );
    END IF;

    -- Update profile
    UPDATE profiles 
    SET 
        email = COALESCE(user_email, email),
        full_name = COALESCE(user_full_name, full_name),
        role = COALESCE(user_role, role),
        plan = COALESCE(user_plan, plan),
        is_active = COALESCE(user_is_active, is_active),
        updated_at = NOW()
    WHERE id = target_user_id;

    -- Update auth.users if email is being changed
    IF user_email IS NOT NULL THEN
        UPDATE auth.users 
        SET 
            email = user_email,
            updated_at = NOW()
        WHERE id = target_user_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'User updated successfully'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. CREATE USER DELETE FUNCTION
-- =============================================

-- Function to delete user by admin
CREATE OR REPLACE FUNCTION public.delete_user_by_admin(
    target_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND (p.role = 'admin' OR p.role = 'super_admin')
    ) AND auth.jwt() ->> 'email' != 'infoajumapro@gmail.com' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Admin access required'
        );
    END IF;

    -- Prevent self-deletion
    IF target_user_id = auth.uid() THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Cannot delete your own account'
        );
    END IF;

    -- Delete user (cascade will handle related data)
    DELETE FROM auth.users WHERE id = target_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'User deleted successfully'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. UPDATE RLS POLICIES FOR PROFILES
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create new comprehensive policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'admin' OR p.role = 'super_admin')
        ) OR auth.jwt() ->> 'email' = 'infoajumapro@gmail.com'
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'admin' OR p.role = 'super_admin')
        ) OR auth.jwt() ->> 'email' = 'infoajumapro@gmail.com'
    );

CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'admin' OR p.role = 'super_admin')
        ) OR auth.jwt() ->> 'email' = 'infoajumapro@gmail.com'
    );

CREATE POLICY "Admins can delete profiles" ON profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'admin' OR p.role = 'super_admin')
        ) OR auth.jwt() ->> 'email' = 'infoajumapro@gmail.com'
    );

-- =============================================
-- 6. GRANT NECESSARY PERMISSIONS
-- =============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_by_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_by_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_by_admin TO authenticated;

-- =============================================
-- 7. REFRESH SCHEMA CACHE
-- =============================================
NOTIFY pgrst, 'reload schema';

-- =============================================
-- 8. VERIFICATION
-- =============================================
DO $$
DECLARE
    profile_count INTEGER;
    function_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM profiles;
    SELECT COUNT(*) INTO function_count 
    FROM pg_proc 
    WHERE proname IN ('create_user_by_admin', 'update_user_by_admin', 'delete_user_by_admin');
    
    RAISE NOTICE '✅ User creation fix completed successfully!';
    RAISE NOTICE '👥 Profiles: % records', profile_count;
    RAISE NOTICE '🔧 Admin functions: % created', function_count;
    RAISE NOTICE '🔐 RLS policies updated';
    RAISE NOTICE '🎯 Schema cache refreshed';
    RAISE NOTICE '🚀 User creation should now work!';
END $$;
