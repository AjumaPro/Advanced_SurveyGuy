-- =============================================
-- TEST DATABASE CONNECTION AND PROFILES TABLE
-- =============================================
-- Run this in Supabase SQL Editor to test your database setup

-- 1. Test basic connection
SELECT 'Database connection test' as test_name, NOW() as current_time;

-- 2. Check if profiles table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles')
        THEN '✅ Profiles table exists'
        ELSE '❌ Profiles table does not exist'
    END as table_status;

-- 3. Check current authenticated user
SELECT 
    CASE 
        WHEN auth.uid() IS NOT NULL 
        THEN '✅ User authenticated: ' || auth.uid()::text
        ELSE '❌ No authenticated user'
    END as auth_status;

-- 4. Check if current user has a profile
SELECT 
    CASE 
        WHEN auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
        THEN '✅ User has profile record'
        WHEN auth.uid() IS NOT NULL
        THEN '❌ User has no profile record'
        ELSE '❌ Cannot check - no authenticated user'
    END as profile_status;

-- 5. Test profile table permissions
DO $$
DECLARE
    profile_count INTEGER;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE '❌ No authenticated user - cannot test permissions';
        RETURN;
    END IF;
    
    BEGIN
        SELECT COUNT(*) INTO profile_count FROM profiles WHERE id = current_user_id;
        RAISE NOTICE '✅ Can read profiles table - found % records for current user', profile_count;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Cannot read profiles table - Error: %', SQLERRM;
    END;
    
    BEGIN
        -- Test if we can update (without actually updating)
        PERFORM id FROM profiles WHERE id = current_user_id FOR UPDATE;
        RAISE NOTICE '✅ Can update profiles table';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Cannot update profiles table - Error: %', SQLERRM;
    END;
END $$;

-- 6. Show RLS policies on profiles table
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 7. Test profile data for current user (if exists)
SELECT 
    id,
    email,
    full_name,
    role,
    plan,
    is_active,
    created_at
FROM profiles 
WHERE id = auth.uid();

RAISE NOTICE '🔍 Database connection test completed!';
