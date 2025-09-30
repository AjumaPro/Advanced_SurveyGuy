-- =============================================
-- TEST PROFILES TABLE FIX
-- =============================================
-- Run this after FIX_PROFILES_INFINITE_RECURSION.sql to verify the fix

-- =============================================
-- 1. TEST BASIC QUERY
-- =============================================

DO $$
BEGIN
    -- Test if we can query profiles without infinite recursion
    PERFORM 1 FROM profiles LIMIT 1;
    RAISE NOTICE '✅ Basic profiles query: SUCCESS';
EXCEPTION
    WHEN OTHERS THEN
    RAISE NOTICE '❌ Basic profiles query: FAILED - %', SQLERRM;
END $$;

-- =============================================
-- 2. TEST POLICY ENFORCEMENT
-- =============================================

DO $$
DECLARE
    policy_count INTEGER;
    rls_enabled BOOLEAN;
BEGIN
    -- Check if RLS is enabled
    SELECT relrowsecurity INTO rls_enabled 
    FROM pg_class 
    WHERE relname = 'profiles';
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'profiles';
    
    RAISE NOTICE 'RLS Enabled: %', CASE WHEN rls_enabled THEN 'YES' ELSE 'NO' END;
    RAISE NOTICE 'Policies Count: %', policy_count;
    
    IF rls_enabled AND policy_count > 0 THEN
        RAISE NOTICE '✅ RLS and policies are properly configured';
    ELSE
        RAISE NOTICE '⚠️ RLS or policies may need attention';
    END IF;
END $$;

-- =============================================
-- 3. TEST USER-SPECIFIC QUERY (SIMULATED)
-- =============================================

DO $$
BEGIN
    -- Test the policy function
    BEGIN
        PERFORM public.is_own_profile('00000000-0000-0000-0000-000000000000'::UUID);
        RAISE NOTICE '✅ Policy function test: SUCCESS';
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '⚠️ Policy function test: %', SQLERRM;
    END;
END $$;

-- =============================================
-- 4. FINAL STATUS CHECK
-- =============================================

DO $$
DECLARE
    table_exists BOOLEAN;
    policies_exist BOOLEAN;
    rls_status BOOLEAN;
    function_exists BOOLEAN;
BEGIN
    -- Check table existence
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'profiles'
    ) INTO table_exists;
    
    -- Check policies
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles'
    ) INTO policies_exist;
    
    -- Check RLS status
    SELECT relrowsecurity INTO rls_status 
    FROM pg_class 
    WHERE relname = 'profiles';
    
    -- Check function
    SELECT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'is_own_profile'
    ) INTO function_exists;
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'PROFILES TABLE STATUS REPORT';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Table exists: %', CASE WHEN table_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'RLS enabled: %', CASE WHEN rls_status THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Policies exist: %', CASE WHEN policies_exist THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE 'Helper function: %', CASE WHEN function_exists THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE '=============================================';
    
    IF table_exists AND rls_status AND policies_exist THEN
        RAISE NOTICE '🎉 PROFILES TABLE IS READY!';
        RAISE NOTICE 'The infinite recursion error should be fixed.';
    ELSE
        RAISE NOTICE '⚠️ Some components need attention.';
        RAISE NOTICE 'Check the status above and run the fix script again if needed.';
    END IF;
END $$;
