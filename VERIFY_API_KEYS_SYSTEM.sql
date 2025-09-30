-- =============================================
-- VERIFY API KEYS SYSTEM
-- =============================================
-- This script verifies that the API keys system is working properly
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CHECK TABLE EXISTENCE
-- =============================================

SELECT 
    'Table Check' as test_type,
    t.table_name,
    CASE 
        WHEN it.table_name IS NOT NULL THEN '✅ Table exists'
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
-- 2. CHECK TABLE STRUCTURE
-- =============================================

-- Check api_keys table structure
SELECT 
    'API Keys Table Structure' as test_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'api_keys'
ORDER BY ordinal_position;

-- Check api_key_usage table structure
SELECT 
    'API Key Usage Table Structure' as test_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'api_key_usage'
ORDER BY ordinal_position;

-- =============================================
-- 3. CHECK INDEXES
-- =============================================

SELECT 
    'Index Check' as test_type,
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('api_keys', 'api_key_usage')
ORDER BY tablename, indexname;

-- =============================================
-- 4. CHECK RLS POLICIES
-- =============================================

SELECT 
    'RLS Policy Check' as test_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('api_keys', 'api_key_usage')
ORDER BY tablename, policyname;

-- =============================================
-- 5. CHECK FUNCTIONS
-- =============================================

SELECT 
    'Function Check' as test_type,
    proname as function_name,
    pronargs as argument_count,
    prorettype::regtype as return_type,
    CASE 
        WHEN prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key')
ORDER BY proname;

-- =============================================
-- 6. CHECK FUNCTION PERMISSIONS
-- =============================================

SELECT 
    'Function Permission Check' as test_type,
    p.proname as function_name,
    r.rolname as role_name,
    has_function_privilege(r.oid, p.oid, 'EXECUTE') as can_execute
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_roles r ON r.rolname = 'authenticated'
WHERE n.nspname = 'public'
AND p.proname IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key')
ORDER BY p.proname;

-- =============================================
-- 7. CHECK TRIGGERS
-- =============================================

SELECT 
    'Trigger Check' as test_type,
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('api_keys', 'api_key_usage')
ORDER BY event_object_table, trigger_name;

-- =============================================
-- 8. TEST FUNCTION SIGNATURES
-- =============================================

-- Test create_api_key function signature
SELECT 
    'Create API Key Signature Test' as test_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public'
            AND p.proname = 'create_api_key'
            AND p.pronargs = 4
        ) THEN '✅ Function signature correct'
        ELSE '❌ Function signature incorrect'
    END as result;

-- Test get_user_api_keys function signature
SELECT 
    'Get User API Keys Signature Test' as test_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public'
            AND p.proname = 'get_user_api_keys'
            AND p.pronargs = 0
        ) THEN '✅ Function signature correct'
        ELSE '❌ Function signature incorrect'
    END as result;

-- =============================================
-- 9. CHECK SCHEMA CACHE STATUS
-- =============================================

-- Check if PostgREST can see the functions
SELECT 
    'Schema Cache Check' as test_type,
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name IS NOT NULL THEN '✅ Function visible in schema cache'
        ELSE '❌ Function not visible in schema cache'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key')
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- =============================================
-- 10. COMPREHENSIVE STATUS REPORT
-- =============================================

DO $$
DECLARE
    table_count integer;
    function_count integer;
    policy_count integer;
    index_count integer;
    trigger_count integer;
    cache_count integer;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('api_keys', 'api_key_usage');
    
    -- Count functions
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key');
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('api_keys', 'api_key_usage');
    
    -- Count indexes
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename IN ('api_keys', 'api_key_usage');
    
    -- Count triggers
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    AND event_object_table IN ('api_keys', 'api_key_usage');
    
    -- Count in schema cache
    SELECT COUNT(*) INTO cache_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key')
    AND routine_type = 'FUNCTION';
    
    RAISE NOTICE '📊 API KEYS SYSTEM VERIFICATION RESULTS';
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'Tables created: %/2', table_count;
    RAISE NOTICE 'Functions created: %/4', function_count;
    RAISE NOTICE 'RLS policies: %', policy_count;
    RAISE NOTICE 'Indexes created: %', index_count;
    RAISE NOTICE 'Triggers created: %', trigger_count;
    RAISE NOTICE 'In schema cache: %/4', cache_count;
    RAISE NOTICE '=========================================';
    
    IF table_count = 2 AND function_count = 4 AND cache_count = 4 THEN
        RAISE NOTICE '🎉 API KEYS SYSTEM IS READY!';
        RAISE NOTICE '✅ API key creation should work in the UI';
    ELSE
        RAISE NOTICE '⚠️ Some issues detected. Please run the fix script again.';
        IF table_count < 2 THEN
            RAISE NOTICE '❌ Missing tables: %/2', table_count;
        END IF;
        IF function_count < 4 THEN
            RAISE NOTICE '❌ Missing functions: %/4', function_count;
        END IF;
        IF cache_count < 4 THEN
            RAISE NOTICE '❌ Functions not in schema cache: %/4', cache_count;
        END IF;
    END IF;
END $$;
