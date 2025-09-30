-- =============================================
-- ANALYTICS VERIFICATION AND HEALTH CHECK
-- Run this script in your Supabase SQL Editor to verify analytics integration
-- =============================================

-- =============================================
-- 1. CHECK DATABASE TABLES EXISTENCE
-- =============================================

DO $$
DECLARE
    table_exists BOOLEAN;
    table_count INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ANALYTICS DATABASE TABLES CHECK';
    RAISE NOTICE '=============================================';
    
    -- Check each required table
    FOR rec IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('surveys', 'survey_responses', 'survey_analytics', 'user_analytics')
        ORDER BY table_name
    LOOP
        -- Count records in each table
        EXECUTE format('SELECT COUNT(*) FROM %I', rec.table_name) INTO table_count;
        
        RAISE NOTICE 'Table: % - Records: %', rec.table_name, table_count;
    END LOOP;
    
    -- Check for missing tables
    RAISE NOTICE 'Missing tables:';
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'surveys' AND table_schema = 'public') THEN
        RAISE NOTICE '  - surveys (REQUIRED)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_responses' AND table_schema = 'public') THEN
        RAISE NOTICE '  - survey_responses (REQUIRED)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_analytics' AND table_schema = 'public') THEN
        RAISE NOTICE '  - survey_analytics (RECOMMENDED)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_analytics' AND table_schema = 'public') THEN
        RAISE NOTICE '  - user_analytics (RECOMMENDED)';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 2. CHECK ANALYTICS TRIGGERS
-- =============================================

DO $$
DECLARE
    trigger_count INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ANALYTICS TRIGGERS CHECK';
    RAISE NOTICE '=============================================';
    
    -- Check for analytics trigger
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_name = 'trigger_update_survey_analytics';
    
    IF trigger_count > 0 THEN
        RAISE NOTICE '✅ Analytics trigger exists';
        
        -- Show trigger details
        FOR rec IN 
            SELECT trigger_name, event_manipulation, action_timing, action_statement
            FROM information_schema.triggers 
            WHERE trigger_name = 'trigger_update_survey_analytics'
        LOOP
            RAISE NOTICE '  Trigger: %', rec.trigger_name;
            RAISE NOTICE '  Event: %', rec.event_manipulation;
            RAISE NOTICE '  Timing: %', rec.action_timing;
        END LOOP;
    ELSE
        RAISE NOTICE '❌ Analytics trigger NOT found';
        RAISE NOTICE '  Run CREATE_ANALYTICS_TABLES.sql to create triggers';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 3. CHECK DATA FLOW FROM RESPONSES TO ANALYTICS
-- =============================================

DO $$
DECLARE
    total_responses INTEGER;
    total_analytics INTEGER;
    responses_without_analytics INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'DATA FLOW CHECK: RESPONSES -> ANALYTICS';
    RAISE NOTICE '=============================================';
    
    -- Count total responses
    SELECT COUNT(*) INTO total_responses FROM survey_responses;
    
    -- Count total analytics records
    SELECT COUNT(*) INTO total_analytics FROM survey_analytics;
    
    -- Count surveys with responses but no analytics
    SELECT COUNT(*) INTO responses_without_analytics
    FROM surveys s
    WHERE EXISTS (SELECT 1 FROM survey_responses sr WHERE sr.survey_id = s.id)
    AND NOT EXISTS (SELECT 1 FROM survey_analytics sa WHERE sa.survey_id = s.id);
    
    RAISE NOTICE 'Total survey responses: %', total_responses;
    RAISE NOTICE 'Total analytics records: %', total_analytics;
    RAISE NOTICE 'Surveys with responses but no analytics: %', responses_without_analytics;
    
    -- Show specific surveys missing analytics
    IF responses_without_analytics > 0 THEN
        RAISE NOTICE 'Surveys missing analytics:';
        FOR rec IN 
            SELECT s.id, s.title, COUNT(sr.id) as response_count
            FROM surveys s
            JOIN survey_responses sr ON s.id = sr.survey_id
            WHERE NOT EXISTS (SELECT 1 FROM survey_analytics sa WHERE sa.survey_id = s.id)
            GROUP BY s.id, s.title
            LIMIT 5
        LOOP
            RAISE NOTICE '  - % (%) - % responses', rec.title, rec.id, rec.response_count;
        END LOOP;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 4. CHECK USER ANALYTICS COVERAGE
-- =============================================

DO $$
DECLARE
    total_users INTEGER;
    users_with_analytics INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'USER ANALYTICS COVERAGE CHECK';
    RAISE NOTICE '=============================================';
    
    -- Count users with surveys
    SELECT COUNT(DISTINCT user_id) INTO total_users FROM surveys;
    
    -- Count users with analytics
    SELECT COUNT(*) INTO users_with_analytics FROM user_analytics;
    
    RAISE NOTICE 'Users with surveys: %', total_users;
    RAISE NOTICE 'Users with analytics: %', users_with_analytics;
    
    -- Show users missing analytics
    IF total_users > users_with_analytics THEN
        RAISE NOTICE 'Users missing analytics:';
        FOR rec IN 
            SELECT p.email, p.full_name, COUNT(s.id) as survey_count
            FROM profiles p
            JOIN surveys s ON p.id = s.user_id
            WHERE NOT EXISTS (SELECT 1 FROM user_analytics ua WHERE ua.user_id = p.id)
            GROUP BY p.id, p.email, p.full_name
            LIMIT 5
        LOOP
            RAISE NOTICE '  - % (%) - % surveys', rec.email, rec.full_name, rec.survey_count;
        END LOOP;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 5. CHECK ANALYTICS FUNCTIONS
-- =============================================

DO $$
DECLARE
    function_exists BOOLEAN;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ANALYTICS FUNCTIONS CHECK';
    RAISE NOTICE '=============================================';
    
    -- Check for analytics update function
    SELECT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'update_survey_analytics_on_response'
        AND routine_schema = 'public'
    ) INTO function_exists;
    
    IF function_exists THEN
        RAISE NOTICE '✅ Analytics update function exists';
    ELSE
        RAISE NOTICE '❌ Analytics update function NOT found';
        RAISE NOTICE '  Run CREATE_ANALYTICS_TABLES.sql to create functions';
    END IF;
    
    -- Check for user analytics function
    SELECT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'update_user_analytics'
        AND routine_schema = 'public'
    ) INTO function_exists;
    
    IF function_exists THEN
        RAISE NOTICE '✅ User analytics function exists';
    ELSE
        RAISE NOTICE '❌ User analytics function NOT found';
        RAISE NOTICE '  Run CREATE_ANALYTICS_TABLES.sql to create functions';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 6. RECENT ACTIVITY CHECK
-- =============================================

DO $$
DECLARE
    recent_responses INTEGER;
    recent_analytics_updates INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'RECENT ACTIVITY CHECK (Last 24 hours)';
    RAISE NOTICE '=============================================';
    
    -- Count recent responses
    SELECT COUNT(*) INTO recent_responses 
    FROM survey_responses 
    WHERE submitted_at >= NOW() - INTERVAL '24 hours';
    
    -- Count recent analytics updates
    SELECT COUNT(*) INTO recent_analytics_updates 
    FROM survey_analytics 
    WHERE updated_at >= NOW() - INTERVAL '24 hours';
    
    RAISE NOTICE 'Recent responses (24h): %', recent_responses;
    RAISE NOTICE 'Recent analytics updates (24h): %', recent_analytics_updates;
    
    -- Show recent activity
    IF recent_responses > 0 THEN
        RAISE NOTICE 'Recent responses:';
        FOR rec IN 
            SELECT sr.id, s.title, sr.submitted_at
            FROM survey_responses sr
            JOIN surveys s ON sr.survey_id = s.id
            WHERE sr.submitted_at >= NOW() - INTERVAL '24 hours'
            ORDER BY sr.submitted_at DESC
            LIMIT 5
        LOOP
            RAISE NOTICE '  - % - %', rec.title, rec.submitted_at;
        END LOOP;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 7. ANALYTICS DATA QUALITY CHECK
-- =============================================

DO $$
DECLARE
    analytics_records INTEGER;
    zero_responses_analytics INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ANALYTICS DATA QUALITY CHECK';
    RAISE NOTICE '=============================================';
    
    SELECT COUNT(*) INTO analytics_records FROM survey_analytics;
    
    -- Check for analytics records with zero responses
    SELECT COUNT(*) INTO zero_responses_analytics
    FROM survey_analytics sa
    WHERE sa.total_responses = 0;
    
    RAISE NOTICE 'Total analytics records: %', analytics_records;
    RAISE NOTICE 'Analytics with zero responses: %', zero_responses_analytics;
    
    -- Show problematic analytics records
    IF zero_responses_analytics > 0 THEN
        RAISE NOTICE 'Analytics records with zero responses:';
        FOR rec IN 
            SELECT sa.survey_id, s.title, sa.total_responses, sa.updated_at
            FROM survey_analytics sa
            JOIN surveys s ON sa.survey_id = s.id
            WHERE sa.total_responses = 0
            LIMIT 5
        LOOP
            RAISE NOTICE '  - % (%) - Last updated: %', rec.title, rec.survey_id, rec.updated_at;
        END LOOP;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 8. GENERATE SUMMARY REPORT
-- =============================================

DO $$
DECLARE
    overall_status TEXT;
    issues_count INTEGER := 0;
    warnings_count INTEGER := 0;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ANALYTICS VERIFICATION SUMMARY';
    RAISE NOTICE '=============================================';
    
    -- Count issues and warnings
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_responses' AND table_schema = 'public') THEN
        issues_count := issues_count + 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_analytics' AND table_schema = 'public') THEN
        issues_count := issues_count + 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_update_survey_analytics') THEN
        issues_count := issues_count + 1;
    END IF;
    
    -- Determine overall status
    IF issues_count = 0 THEN
        overall_status := 'HEALTHY';
        RAISE NOTICE 'Status: ✅ %', overall_status;
        RAISE NOTICE 'All analytics components are working correctly!';
    ELSIF issues_count <= 2 THEN
        overall_status := 'WARNING';
        RAISE NOTICE 'Status: ⚠️  %', overall_status;
        RAISE NOTICE 'Some analytics components need attention.';
    ELSE
        overall_status := 'ERROR';
        RAISE NOTICE 'Status: ❌ %', overall_status;
        RAISE NOTICE 'Analytics system needs immediate attention.';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    IF issues_count > 0 THEN
        RAISE NOTICE '1. Run CREATE_ANALYTICS_TABLES.sql to set up missing components';
        RAISE NOTICE '2. Submit a test survey response to verify data flow';
        RAISE NOTICE '3. Check the analytics dashboard for real-time updates';
    ELSE
        RAISE NOTICE '1. Analytics system is working correctly';
        RAISE NOTICE '2. Monitor the dashboard for real-time updates';
        RAISE NOTICE '3. Regular health checks recommended';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;
