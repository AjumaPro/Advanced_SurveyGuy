-- =============================================
-- FIX SCHEMA CACHE AND USER CREATION FUNCTIONS
-- =============================================
-- This script fixes the schema cache issue and ensures user creation functions work
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. DROP EXISTING FUNCTIONS (IF ANY)
-- =============================================

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.create_user_by_admin(text, text, text, text, text);
DROP FUNCTION IF EXISTS public.update_user_by_admin(uuid, text, text, text, text, boolean);
DROP FUNCTION IF EXISTS public.delete_user_by_admin(uuid);

-- =============================================
-- 2. CREATE ADMIN USER CREATION FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.create_user_by_admin(
    user_email text,
    user_password text,
    user_full_name text DEFAULT '',
    user_role text DEFAULT 'user',
    user_plan text DEFAULT 'free'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
    result json;
BEGIN
    -- Validate inputs
    IF user_email IS NULL OR user_email = '' THEN
        RETURN json_build_object('success', false, 'error', 'Email is required');
    END IF;
    
    IF user_password IS NULL OR user_password = '' THEN
        RETURN json_build_object('success', false, 'error', 'Password is required');
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
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        user_email,
        crypt(user_password, gen_salt('bf')),
        now(),
        null,
        null,
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        ('{"full_name": "' || COALESCE(user_full_name, '') || '"}')::jsonb,
        now(),
        now(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO new_user_id;
    
    -- Create profile
    INSERT INTO public.profiles (
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
        now(),
        now()
    );
    
    RETURN json_build_object(
        'success', true,
        'user_id', new_user_id,
        'message', 'User created successfully'
    );
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'User with this email already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create user: ' || SQLERRM);
END;
$$;

-- =============================================
-- 3. CREATE ADMIN USER UPDATE FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.update_user_by_admin(
    target_user_id uuid,
    user_email text DEFAULT NULL,
    user_full_name text DEFAULT NULL,
    user_role text DEFAULT NULL,
    user_plan text DEFAULT NULL,
    user_is_active boolean DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Validate target user exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update profile
    UPDATE public.profiles SET
        email = COALESCE(user_email, email),
        full_name = COALESCE(user_full_name, full_name),
        role = COALESCE(user_role, role),
        plan = COALESCE(user_plan, plan),
        is_active = COALESCE(user_is_active, is_active),
        updated_at = now()
    WHERE id = target_user_id;
    
    -- Update auth.users if email changed
    IF user_email IS NOT NULL THEN
        UPDATE auth.users SET
            email = user_email,
            updated_at = now()
        WHERE id = target_user_id;
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'User updated successfully'
    );
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Email already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update user: ' || SQLERRM);
END;
$$;

-- =============================================
-- 4. CREATE ADMIN USER DELETE FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.delete_user_by_admin(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Validate target user exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Delete profile first
    DELETE FROM public.profiles WHERE id = target_user_id;
    
    -- Delete from auth.users
    DELETE FROM auth.users WHERE id = target_user_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'User deleted successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete user: ' || SQLERRM);
END;
$$;

-- =============================================
-- 5. GRANT PERMISSIONS
-- =============================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_by_admin(text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_by_admin(uuid, text, text, text, text, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_by_admin(uuid) TO authenticated;

-- =============================================
-- 6. REFRESH SCHEMA CACHE
-- =============================================

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- =============================================
-- 7. VERIFY FUNCTIONS EXIST
-- =============================================

-- Check if functions were created successfully
DO $$
DECLARE
    func_count integer;
BEGIN
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('create_user_by_admin', 'update_user_by_admin', 'delete_user_by_admin');
    
    IF func_count = 3 THEN
        RAISE NOTICE '✅ All admin functions created successfully!';
        RAISE NOTICE '📊 Functions available: %', func_count;
    ELSE
        RAISE NOTICE '⚠️ Only % of 3 functions were created', func_count;
    END IF;
END $$;

-- =============================================
-- 8. TEST FUNCTION (OPTIONAL)
-- =============================================

-- Uncomment the following lines to test the function
-- SELECT public.create_user_by_admin(
--     'test@example.com',
--     'testpassword123',
--     'Test User',
--     'user',
--     'free'
-- );

-- =============================================
-- 9. FINAL STATUS
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '🎯 SCHEMA CACHE AND USER CREATION FIX COMPLETE';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '✅ Admin functions created and cached';
    RAISE NOTICE '✅ Schema cache refreshed';
    RAISE NOTICE '✅ Permissions granted';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '🚀 User creation should now work in the UI!';
END $$;
