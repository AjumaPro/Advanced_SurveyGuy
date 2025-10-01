-- =============================================
-- DEBUG PROFILE CONNECTION
-- =============================================
-- Run this to debug profile loading issues

-- 1. Check if profiles table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles')
        THEN '✅ Profiles table exists'
        ELSE '❌ Profiles table does not exist'
    END as table_status;

-- 2. Check current user
SELECT 
    auth.uid() as current_user_id,
    auth.jwt() ->> 'email' as current_user_email;

-- 3. Check if current user has a profile
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
        THEN '✅ User has profile'
        ELSE '❌ User has no profile'
    END as profile_status;

-- 4. Show profile data for current user (if exists)
SELECT 
    id,
    email,
    full_name,
    role,
    plan,
    is_active,
    is_verified,
    created_at,
    updated_at
FROM profiles 
WHERE id = auth.uid();

-- 5. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Test direct profile access
DO $$
DECLARE
    profile_count INTEGER;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE '❌ No authenticated user found';
    ELSE
        RAISE NOTICE '✅ Authenticated user: %', current_user_id;
        
        SELECT COUNT(*) INTO profile_count FROM profiles WHERE id = current_user_id;
        
        IF profile_count > 0 THEN
            RAISE NOTICE '✅ User profile found in database';
        ELSE
            RAISE NOTICE '❌ No profile found for current user';
        END IF;
    END IF;
END $$;
