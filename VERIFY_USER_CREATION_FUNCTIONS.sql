-- =============================================
-- VERIFY USER CREATION FUNCTIONS
-- =============================================
-- This script verifies that the user creation functions are working properly
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CHECK FUNCTION EXISTENCE
-- =============================================

SELECT 
    'Function Check' as test_type,
    proname as function_name,
    pronargs as argument_count,
    prorettype::regtype as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('create_user_by_admin', 'update_user_by_admin', 'delete_user_by_admin')
ORDER BY proname;

-- =============================================
-- 2. CHECK FUNCTION PERMISSIONS
-- =============================================

SELECT 
    'Permission Check' as test_type,
    p.proname as function_name,
    r.rolname as role_name,
    has_function_privilege(r.oid, p.oid, 'EXECUTE') as can_execute
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_roles r ON r.rolname = 'authenticated'
WHERE n.nspname = 'public'
AND p.proname IN ('create_user_by_admin', 'update_user_by_admin', 'delete_user_by_admin');

-- =============================================
-- 3. CHECK AUTH.USERS COLUMN TYPES
-- =============================================

SELECT
    'Column Type Check' as test_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
  AND column_name IN ('raw_user_meta_data', 'raw_app_meta_data')
ORDER BY column_name;

-- =============================================
-- 4. TEST FUNCTION SIGNATURE
-- =============================================

-- Test if we can call the function (without actually creating a user)
SELECT 
    'Signature Test' as test_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public'
            AND p.proname = 'create_user_by_admin'
            AND p.pronargs = 5
        ) THEN '✅ Function signature correct'
        ELSE '❌ Function signature incorrect'
    END as result;

-- =============================================
-- 5. CHECK SCHEMA CACHE STATUS
-- =============================================

-- Check if PostgREST can see the functions
SELECT 
    'Schema Cache Check' as test_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'create_user_by_admin'
            AND routine_type = 'FUNCTION'
        ) THEN '✅ Function visible in schema cache'
        ELSE '❌ Function not visible in schema cache'
    END as result;

-- =============================================
-- 6. COMPREHENSIVE STATUS REPORT
-- =============================================

DO $$
DECLARE
    func_count integer;
    perm_count integer;
    cache_count integer;
BEGIN
    -- Count functions
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('create_user_by_admin', 'update_user_by_admin', 'delete_user_by_admin');
    
    -- Count permissions
    SELECT COUNT(*) INTO perm_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    JOIN pg_roles r ON r.rolname = 'authenticated'
    WHERE n.nspname = 'public'
    AND p.proname IN ('create_user_by_admin', 'update_user_by_admin', 'delete_user_by_admin')
    AND has_function_privilege(r.oid, p.oid, 'EXECUTE');
    
    -- Count in schema cache
    SELECT COUNT(*) INTO cache_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('create_user_by_admin', 'update_user_by_admin', 'delete_user_by_admin')
    AND routine_type = 'FUNCTION';
    
    RAISE NOTICE '📊 VERIFICATION RESULTS';
    RAISE NOTICE '======================';
    RAISE NOTICE 'Functions created: %/3', func_count;
    RAISE NOTICE 'Permissions granted: %/3', perm_count;
    RAISE NOTICE 'In schema cache: %/3', cache_count;
    RAISE NOTICE '======================';
    
    IF func_count = 3 AND perm_count = 3 AND cache_count = 3 THEN
        RAISE NOTICE '🎉 ALL CHECKS PASSED! User creation should work.';
    ELSE
        RAISE NOTICE '⚠️ Some issues detected. Please run the fix script again.';
    END IF;
END $$;
