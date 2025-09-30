-- =============================================
-- DEBUG API KEYS FUNCTIONS
-- =============================================
-- This script helps debug API key function issues
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CHECK IF FUNCTIONS EXIST AT ALL
-- =============================================

SELECT 
    'Function Existence Check' as test_type,
    proname as function_name,
    pronargs as parameter_count,
    proargnames as parameter_names,
    proargtypes::regtype[] as parameter_types,
    prorettype::regtype as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname LIKE '%api_key%'
ORDER BY proname;

-- =============================================
-- 2. CHECK SPECIFIC FUNCTION SIGNATURES
-- =============================================

-- Check create_api_key function
SELECT 
    'Create API Key Function' as test_type,
    proname as function_name,
    pronargs as parameter_count,
    proargnames as parameter_names,
    proargtypes::regtype[] as parameter_types,
    prorettype::regtype as return_type,
    prosecdef as is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'create_api_key';

-- Check get_user_api_keys function
SELECT 
    'Get User API Keys Function' as test_type,
    proname as function_name,
    pronargs as parameter_count,
    proargnames as parameter_names,
    proargtypes::regtype[] as parameter_types,
    prorettype::regtype as return_type,
    prosecdef as is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'get_user_api_keys';

-- Check delete_api_key function
SELECT 
    'Delete API Key Function' as test_type,
    proname as function_name,
    pronargs as parameter_count,
    proargnames as parameter_names,
    proargtypes::regtype[] as parameter_types,
    prorettype::regtype as return_type,
    prosecdef as is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'delete_api_key';

-- Check update_api_key function
SELECT 
    'Update API Key Function' as test_type,
    proname as function_name,
    pronargs as parameter_count,
    proargnames as parameter_names,
    proargtypes::regtype[] as parameter_types,
    prorettype::regtype as return_type,
    prosecdef as is_security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'update_api_key';

-- =============================================
-- 3. CHECK FUNCTION PERMISSIONS
-- =============================================

SELECT 
    'Function Permissions' as test_type,
    p.proname as function_name,
    r.rolname as role_name,
    has_function_privilege(r.oid, p.oid, 'EXECUTE') as can_execute
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_roles r ON r.rolname = 'authenticated'
WHERE n.nspname = 'public'
AND p.proname LIKE '%api_key%'
ORDER BY p.proname;

-- =============================================
-- 4. CHECK IF TABLES EXIST
-- =============================================

SELECT 
    'Table Existence' as test_type,
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Table exists'
        ELSE '❌ Table missing'
    END as status
FROM (
    SELECT 'api_keys' as table_name
    UNION ALL
    SELECT 'api_key_usage' as table_name
) t
LEFT JOIN information_schema.tables it ON it.table_name = t.table_name AND it.table_schema = 'public'
ORDER BY t.table_name;

-- =============================================
-- 5. SIMPLE FUNCTION TEST
-- =============================================

-- Try to call get_user_api_keys (should work if function exists)
DO $$
DECLARE
    result json;
BEGIN
    BEGIN
        SELECT public.get_user_api_keys() INTO result;
        RAISE NOTICE '✅ get_user_api_keys() function works! Result: %', result;
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '❌ get_user_api_keys() function failed: %', SQLERRM;
    END;
END $$;

-- =============================================
-- 6. SUMMARY
-- =============================================

DO $$
DECLARE
    func_count integer;
    table_count integer;
BEGIN
    -- Count functions
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key');
    
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('api_keys', 'api_key_usage');
    
    RAISE NOTICE '📊 DEBUG SUMMARY';
    RAISE NOTICE '================';
    RAISE NOTICE 'API Key Functions: %/4', func_count;
    RAISE NOTICE 'API Key Tables: %/2', table_count;
    RAISE NOTICE '================';
    
    IF func_count = 0 THEN
        RAISE NOTICE '❌ No API key functions found! Run the fix script.';
    ELSIF func_count < 4 THEN
        RAISE NOTICE '⚠️ Only % of 4 functions found. Run the fix script.', func_count;
    ELSE
        RAISE NOTICE '✅ All API key functions found!';
    END IF;
    
    IF table_count = 0 THEN
        RAISE NOTICE '❌ No API key tables found! Run the fix script.';
    ELSIF table_count < 2 THEN
        RAISE NOTICE '⚠️ Only % of 2 tables found. Run the fix script.', table_count;
    ELSE
        RAISE NOTICE '✅ All API key tables found!';
    END IF;
END $$;
