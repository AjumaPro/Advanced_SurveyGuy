-- =============================================
-- VERIFY DATABASE FIXES
-- =============================================
-- This script verifies that the database relationship fixes are working
-- Run this after FIX_DATABASE_RELATIONSHIPS.sql

-- =============================================
-- 1. TEST PROFILES TABLE ACCESS
-- =============================================

DO $$
DECLARE
    profiles_count INTEGER;
    profiles_error TEXT;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO profiles_count FROM profiles;
        RAISE NOTICE '✅ Profiles table: % rows accessible', profiles_count;
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '❌ Profiles table error: %', SQLERRM;
    END;
END $$;

-- =============================================
-- 2. TEST SURVEYS TABLE ACCESS
-- =============================================

DO $$
DECLARE
    surveys_count INTEGER;
    surveys_error TEXT;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO surveys_count FROM surveys;
        RAISE NOTICE '✅ Surveys table: % rows accessible', surveys_count;
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '❌ Surveys table error: %', SQLERRM;
    END;
END $$;

-- =============================================
-- 3. TEST SURVEY_RESPONSES TABLE ACCESS
-- =============================================

DO $$
DECLARE
    responses_count INTEGER;
    responses_error TEXT;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO responses_count FROM survey_responses;
        RAISE NOTICE '✅ Survey responses table: % rows accessible', responses_count;
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '❌ Survey responses table error: %', SQLERRM;
    END;
END $$;

-- =============================================
-- 4. TEST SURVEYS-RESPONSES RELATIONSHIP
-- =============================================

DO $$
DECLARE
    relationship_works BOOLEAN;
    join_count INTEGER;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO join_count 
        FROM surveys s 
        LEFT JOIN survey_responses sr ON s.id = sr.survey_id;
        
        relationship_works := TRUE;
        RAISE NOTICE '✅ Surveys-Responses relationship: % joined rows', join_count;
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '❌ Surveys-Responses relationship error: %', SQLERRM;
        relationship_works := FALSE;
    END;
END $$;

-- =============================================
-- 5. TEST ANALYTICS FUNCTION
-- =============================================

DO $$
DECLARE
    function_works BOOLEAN;
    result_count INTEGER;
BEGIN
    BEGIN
        -- Test if we can call the analytics function (even with no data)
        SELECT COUNT(*) INTO result_count 
        FROM get_user_surveys_with_responses('00000000-0000-0000-0000-000000000000'::UUID);
        
        function_works := TRUE;
        RAISE NOTICE '✅ Analytics function: Working (tested with dummy UUID)';
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '❌ Analytics function error: %', SQLERRM;
        function_works := FALSE;
    END;
END $$;

-- =============================================
-- 6. FINAL VERIFICATION REPORT
-- =============================================

DO $$
DECLARE
    total_tables INTEGER := 3;
    working_tables INTEGER := 0;
    total_functions INTEGER := 2;
    working_functions INTEGER := 0;
BEGIN
    -- Count working tables
    BEGIN
        PERFORM 1 FROM profiles LIMIT 1;
        working_tables := working_tables + 1;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        PERFORM 1 FROM surveys LIMIT 1;
        working_tables := working_tables + 1;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        PERFORM 1 FROM survey_responses LIMIT 1;
        working_tables := working_tables + 1;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
    
    -- Count working functions
    BEGIN
        PERFORM 1 FROM get_user_surveys_with_responses('00000000-0000-0000-0000-000000000000'::UUID) LIMIT 1;
        working_functions := working_functions + 1;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        PERFORM 1 FROM get_survey_with_responses('00000000-0000-0000-0000-000000000000'::UUID) LIMIT 1;
        working_functions := working_functions + 1;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'FINAL VERIFICATION REPORT';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Tables Working: %/%', working_tables, total_tables;
    RAISE NOTICE 'Functions Working: %/%', working_functions, total_functions;
    
    IF working_tables = total_tables AND working_functions = total_functions THEN
        RAISE NOTICE '🎉 ALL DATABASE FIXES VERIFIED SUCCESSFULLY!';
        RAISE NOTICE 'Your Reports page should now work with real data.';
    ELSE
        RAISE NOTICE '⚠️ Some components still need attention.';
        RAISE NOTICE 'Check the individual test results above.';
    END IF;
    RAISE NOTICE '=============================================';
END $$;
