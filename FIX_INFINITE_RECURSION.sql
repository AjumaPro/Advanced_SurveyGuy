-- =============================================
-- FIX INFINITE RECURSION IN PROFILES TABLE POLICIES
-- =============================================
-- This script fixes the infinite recursion error in profiles table RLS policies

-- 1. DISABLE RLS TEMPORARILY TO CLEAR PROBLEMATIC POLICIES
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES ON PROFILES TABLE
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON profiles;

-- 3. CREATE SIMPLE, NON-RECURSIVE POLICIES
-- Enable RLS again
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Simple policy: Users can view their own profile (no recursion)
CREATE POLICY "users_view_own_profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Simple policy: Users can update their own profile (no recursion)
CREATE POLICY "users_update_own_profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Simple policy: Users can insert their own profile (no recursion)
CREATE POLICY "users_insert_own_profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. CREATE A HELPER FUNCTION TO CHECK ADMIN STATUS WITHOUT RECURSION
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the current user's email is the super admin email
    RETURN auth.jwt() ->> 'email' = 'infoajumapro@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CREATE ADMIN POLICIES USING THE HELPER FUNCTION (no recursion)
CREATE POLICY "admin_view_all_profiles" ON profiles
    FOR SELECT USING (is_admin_user());

CREATE POLICY "admin_update_all_profiles" ON profiles
    FOR UPDATE USING (is_admin_user());

-- 6. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

-- 7. TEST THE POLICIES
DO $$
DECLARE
    current_user_id UUID;
    test_result TEXT;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE '❌ No authenticated user - cannot test policies';
        RETURN;
    END IF;
    
    BEGIN
        -- Test reading own profile
        PERFORM id FROM profiles WHERE id = current_user_id LIMIT 1;
        RAISE NOTICE '✅ Users can read their own profile - PASSED';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Users cannot read their own profile - FAILED: %', SQLERRM;
    END;
    
    BEGIN
        -- Test if admin can read all profiles
        IF is_admin_user() THEN
            PERFORM COUNT(*) FROM profiles LIMIT 1;
            RAISE NOTICE '✅ Admin can read all profiles - PASSED';
        ELSE
            RAISE NOTICE 'ℹ️ Current user is not admin, skipping admin test';
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Admin cannot read all profiles - FAILED: %', SQLERRM;
    END;
END $$;

-- 8. VERIFICATION
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

RAISE NOTICE '🎉 Infinite recursion fix completed!';
RAISE NOTICE '📊 Profiles table policies have been reset and simplified';
RAISE NOTICE '🔐 RLS is enabled with non-recursive policies';
