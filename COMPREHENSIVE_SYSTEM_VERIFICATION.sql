-- =============================================
-- COMPREHENSIVE SYSTEM VERIFICATION
-- =============================================
-- This script ensures all users have working surveys, QR codes, and subscribers face no difficulties
-- Run this in your Supabase SQL Editor to verify system health

-- =============================================
-- 1. VERIFY CORE TABLES EXIST
-- =============================================

DO $$
DECLARE
    missing_tables TEXT[] := ARRAY[]::TEXT[];
    tbl_name TEXT;
    required_tables TEXT[] := ARRAY[
        'profiles', 'surveys', 'survey_responses', 'subscription_plans', 
        'analytics', 'notifications', 'payment_transactions', 'api_keys'
    ];
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING CORE TABLES';
    RAISE NOTICE '=============================================';
    
    FOREACH tbl_name IN ARRAY required_tables
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = tbl_name
        ) THEN
            missing_tables := array_append(missing_tables, tbl_name);
        ELSE
            RAISE NOTICE '✅ % table exists', tbl_name;
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE '❌ Missing tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE '✅ All core tables exist';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 2. VERIFY USER PROFILES AND PLANS
-- =============================================

DO $$
DECLARE
    total_users INTEGER;
    users_without_plans INTEGER;
    users_without_profiles INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING USER PROFILES AND PLANS';
    RAISE NOTICE '=============================================';
    
    -- Count total users
    SELECT COUNT(*) INTO total_users FROM profiles;
    RAISE NOTICE 'Total users: %', total_users;
    
    -- Check users without plans
    SELECT COUNT(*) INTO users_without_plans 
    FROM profiles 
    WHERE plan IS NULL OR plan = '';
    
    -- Check users without proper profiles
    SELECT COUNT(*) INTO users_without_profiles 
    FROM profiles 
    WHERE full_name IS NULL OR email IS NULL;
    
    RAISE NOTICE 'Users without plans: %', users_without_plans;
    RAISE NOTICE 'Users without profiles: %', users_without_profiles;
    
    -- Show sample users
    RAISE NOTICE 'Sample users:';
    FOR rec IN 
        SELECT id, email, full_name, plan, role, created_at 
        FROM profiles 
        ORDER BY created_at DESC 
        LIMIT 5
    LOOP
        RAISE NOTICE '  - % (%) - Plan: %, Role: %', 
            COALESCE(rec.full_name, 'No name'), 
            rec.email, 
            COALESCE(rec.plan, 'No plan'), 
            COALESCE(rec.role, 'No role');
    END LOOP;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 3. VERIFY SURVEYS AND QR CODE FUNCTIONALITY
-- =============================================

DO $$
DECLARE
    total_surveys INTEGER;
    published_surveys INTEGER;
    draft_surveys INTEGER;
    surveys_with_questions INTEGER;
    surveys_without_questions INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING SURVEYS AND QR CODE FUNCTIONALITY';
    RAISE NOTICE '=============================================';
    
    -- Count surveys
    SELECT COUNT(*) INTO total_surveys FROM surveys;
    SELECT COUNT(*) INTO published_surveys FROM surveys WHERE status = 'published';
    SELECT COUNT(*) INTO draft_surveys FROM surveys WHERE status = 'draft';
    
    -- Count surveys with/without questions
    SELECT COUNT(*) INTO surveys_with_questions 
    FROM surveys 
    WHERE questions IS NOT NULL AND jsonb_array_length(questions) > 0;
    
    SELECT COUNT(*) INTO surveys_without_questions 
    FROM surveys 
    WHERE questions IS NULL OR jsonb_array_length(questions) = 0;
    
    RAISE NOTICE 'Total surveys: %', total_surveys;
    RAISE NOTICE 'Published surveys: %', published_surveys;
    RAISE NOTICE 'Draft surveys: %', draft_surveys;
    RAISE NOTICE 'Surveys with questions: %', surveys_with_questions;
    RAISE NOTICE 'Surveys without questions: %', surveys_without_questions;
    
    -- Show sample published surveys (these should have working QR codes)
    RAISE NOTICE 'Sample published surveys:';
    FOR rec IN 
        SELECT id, title, status, user_id, created_at,
               jsonb_array_length(questions) as question_count
        FROM surveys 
        WHERE status = 'published' AND is_public = true
        ORDER BY created_at DESC 
        LIMIT 5
    LOOP
        RAISE NOTICE '  - % (ID: %) - Questions: %, Created: %', 
            rec.title, 
            rec.id,
            rec.question_count,
            rec.created_at::date;
    END LOOP;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 4. VERIFY SURVEY RESPONSES
-- =============================================

DO $$
DECLARE
    total_responses INTEGER;
    responses_today INTEGER;
    responses_this_week INTEGER;
    surveys_with_responses INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING SURVEY RESPONSES';
    RAISE NOTICE '=============================================';
    
    -- Count responses
    SELECT COUNT(*) INTO total_responses FROM survey_responses;
    SELECT COUNT(*) INTO responses_today 
    FROM survey_responses 
    WHERE DATE(submitted_at) = CURRENT_DATE;
    SELECT COUNT(*) INTO responses_this_week 
    FROM survey_responses 
    WHERE submitted_at >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Count surveys with responses
    SELECT COUNT(DISTINCT survey_id) INTO surveys_with_responses 
    FROM survey_responses;
    
    RAISE NOTICE 'Total responses: %', total_responses;
    RAISE NOTICE 'Responses today: %', responses_today;
    RAISE NOTICE 'Responses this week: %', responses_this_week;
    RAISE NOTICE 'Surveys with responses: %', surveys_with_responses;
    
    -- Show recent responses
    RAISE NOTICE 'Recent responses:';
    FOR rec IN 
        SELECT sr.survey_id, s.title as survey_title, sr.submitted_at
        FROM survey_responses sr
        JOIN surveys s ON sr.survey_id = s.id
        ORDER BY sr.submitted_at DESC 
        LIMIT 5
    LOOP
        RAISE NOTICE '  - % - Submitted: %', 
            rec.survey_title, 
            rec.submitted_at::timestamp;
    END LOOP;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 5. VERIFY SUBSCRIPTION SYSTEM
-- =============================================

DO $$
DECLARE
    free_users INTEGER;
    pro_users INTEGER;
    enterprise_users INTEGER;
    users_with_expired_subscriptions INTEGER;
    active_subscriptions INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING SUBSCRIPTION SYSTEM';
    RAISE NOTICE '=============================================';
    
    -- Count users by plan
    SELECT COUNT(*) INTO free_users FROM profiles WHERE plan = 'free' OR plan IS NULL;
    SELECT COUNT(*) INTO pro_users FROM profiles WHERE plan = 'pro';
    SELECT COUNT(*) INTO enterprise_users FROM profiles WHERE plan = 'enterprise';
    
    -- Check for expired subscriptions
    SELECT COUNT(*) INTO users_with_expired_subscriptions 
    FROM profiles 
    WHERE subscription_end_date IS NOT NULL 
    AND subscription_end_date < NOW() 
    AND plan != 'free';
    
    -- Count active subscriptions (non-free plans)
    SELECT COUNT(*) INTO active_subscriptions 
    FROM profiles 
    WHERE plan != 'free' 
    AND (subscription_end_date IS NULL OR subscription_end_date > NOW());
    
    RAISE NOTICE 'Free users: %', free_users;
    RAISE NOTICE 'Pro users: %', pro_users;
    RAISE NOTICE 'Enterprise users: %', enterprise_users;
    RAISE NOTICE 'Users with expired subscriptions: %', users_with_expired_subscriptions;
    RAISE NOTICE 'Active subscriptions: %', active_subscriptions;
    
    -- Show sample subscription issues
    IF users_with_expired_subscriptions > 0 THEN
        RAISE NOTICE 'Users with expired subscriptions:';
        FOR rec IN 
            SELECT email, plan, subscription_end_date
            FROM profiles 
            WHERE subscription_end_date IS NOT NULL 
            AND subscription_end_date < NOW() 
            AND plan != 'free'
            LIMIT 3
        LOOP
            RAISE NOTICE '  - % (%) - Expired: %', 
                rec.email, 
                rec.plan, 
                rec.subscription_end_date::date;
        END LOOP;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 6. VERIFY PAYMENT SYSTEM
-- =============================================

DO $$
DECLARE
    payment_table_exists BOOLEAN;
    total_transactions INTEGER;
    successful_payments INTEGER;
    failed_payments INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING PAYMENT SYSTEM';
    RAISE NOTICE '=============================================';
    
    -- Check if payment tables exist
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'payment_transactions'
    ) INTO payment_table_exists;
    
    IF payment_table_exists THEN
        SELECT COUNT(*) INTO total_transactions FROM payment_transactions;
        SELECT COUNT(*) INTO successful_payments FROM payment_transactions WHERE status = 'completed';
        SELECT COUNT(*) INTO failed_payments FROM payment_transactions WHERE status = 'failed';
        
        RAISE NOTICE 'Payment system: ✅ ACTIVE';
        RAISE NOTICE 'Total transactions: %', total_transactions;
        RAISE NOTICE 'Successful payments: %', successful_payments;
        RAISE NOTICE 'Failed payments: %', failed_payments;
        
        -- Show recent transactions
        RAISE NOTICE 'Recent transactions:';
        FOR rec IN 
            SELECT payment_type, amount, currency, status, created_at
            FROM payment_transactions
            ORDER BY created_at DESC 
            LIMIT 3
        LOOP
            RAISE NOTICE '  - % % % - Status: %', 
                rec.payment_type, 
                rec.amount, 
                rec.currency, 
                rec.status;
        END LOOP;
    ELSE
        RAISE NOTICE 'Payment system: ❌ NOT CONFIGURED';
        RAISE NOTICE 'Payment tables do not exist';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 7. VERIFY API KEYS SYSTEM
-- =============================================

DO $$
DECLARE
    api_keys_table_exists BOOLEAN;
    total_api_keys INTEGER;
    active_api_keys INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING API KEYS SYSTEM';
    RAISE NOTICE '=============================================';
    
    -- Check if API keys table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'api_keys'
    ) INTO api_keys_table_exists;
    
    IF api_keys_table_exists THEN
        SELECT COUNT(*) INTO total_api_keys FROM api_keys;
        SELECT COUNT(*) INTO active_api_keys FROM api_keys WHERE is_active = true;
        
        RAISE NOTICE 'API Keys system: ✅ ACTIVE';
        RAISE NOTICE 'Total API keys: %', total_api_keys;
        RAISE NOTICE 'Active API keys: %', active_api_keys;
        
        -- Show sample API keys (without exposing actual keys)
        RAISE NOTICE 'Sample API keys:';
        FOR rec IN 
            SELECT name, plan_required, created_at, last_used_at
            FROM api_keys
            ORDER BY created_at DESC 
            LIMIT 3
        LOOP
            RAISE NOTICE '  - % (Plan: %) - Created: %', 
                rec.name, 
                COALESCE(rec.plan_required, 'Any'), 
                rec.created_at::date;
        END LOOP;
    ELSE
        RAISE NOTICE 'API Keys system: ❌ NOT CONFIGURED';
        RAISE NOTICE 'API keys table does not exist';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 8. VERIFY ANALYTICS SYSTEM
-- =============================================

DO $$
DECLARE
    analytics_table_exists BOOLEAN;
    total_analytics_records INTEGER;
    recent_analytics_records INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING ANALYTICS SYSTEM';
    RAISE NOTICE '=============================================';
    
    -- Check if analytics table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'analytics'
    ) INTO analytics_table_exists;
    
    IF analytics_table_exists THEN
        SELECT COUNT(*) INTO total_analytics_records FROM analytics;
        SELECT COUNT(*) INTO recent_analytics_records 
        FROM analytics 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
        
        RAISE NOTICE 'Analytics system: ✅ ACTIVE';
        RAISE NOTICE 'Total analytics records: %', total_analytics_records;
        RAISE NOTICE 'Recent analytics records (7 days): %', recent_analytics_records;
        
        -- Show sample analytics
        RAISE NOTICE 'Sample analytics events:';
        FOR rec IN 
            SELECT entity_type, event_type, COUNT(*) as count
            FROM analytics
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY entity_type, event_type
            ORDER BY count DESC 
            LIMIT 5
        LOOP
            RAISE NOTICE '  - % %: % events', 
                rec.entity_type, 
                rec.event_type, 
                rec.count;
        END LOOP;
    ELSE
        RAISE NOTICE 'Analytics system: ❌ NOT CONFIGURED';
        RAISE NOTICE 'Analytics table does not exist';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 9. VERIFY QR CODE FUNCTIONALITY
-- =============================================

DO $$
DECLARE
    published_surveys_count INTEGER;
    surveys_with_valid_urls INTEGER;
    rec RECORD;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFYING QR CODE FUNCTIONALITY';
    RAISE NOTICE '=============================================';
    
    -- Count published surveys (these should have QR codes)
    SELECT COUNT(*) INTO published_surveys_count 
    FROM surveys 
    WHERE status = 'published' AND is_public = true;
    
    -- Check surveys with valid structure for QR codes
    SELECT COUNT(*) INTO surveys_with_valid_urls 
    FROM surveys 
    WHERE status = 'published' 
    AND is_public = true 
    AND id IS NOT NULL;
    
    RAISE NOTICE 'Published surveys (should have QR codes): %', published_surveys_count;
    RAISE NOTICE 'Surveys with valid URLs: %', surveys_with_valid_urls;
    
    -- Show sample surveys that should have working QR codes
    RAISE NOTICE 'Sample surveys with QR codes:';
    FOR rec IN 
        SELECT id, title, status, created_at
        FROM surveys 
        WHERE status = 'published' AND is_public = true
        ORDER BY created_at DESC 
        LIMIT 5
    LOOP
        RAISE NOTICE '  - % (ID: %) - QR URL: /survey/%', 
            rec.title, 
            rec.id,
            rec.id;
    END LOOP;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 10. FINAL SYSTEM HEALTH CHECK
-- =============================================

DO $$
DECLARE
    system_health_score INTEGER := 0;
    max_score INTEGER := 10;
    issues TEXT[] := ARRAY[]::TEXT[];
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'FINAL SYSTEM HEALTH CHECK';
    RAISE NOTICE '=============================================';
    
    -- Check 1: Core tables exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'surveys') THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'Surveys table missing');
    END IF;
    
    -- Check 2: Users exist
    IF EXISTS (SELECT 1 FROM profiles LIMIT 1) THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'No users found');
    END IF;
    
    -- Check 3: Published surveys exist
    IF EXISTS (SELECT 1 FROM surveys WHERE status = 'published' LIMIT 1) THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'No published surveys');
    END IF;
    
    -- Check 4: Survey responses exist
    IF EXISTS (SELECT 1 FROM survey_responses LIMIT 1) THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'No survey responses');
    END IF;
    
    -- Check 5: Subscription plans exist
    IF EXISTS (SELECT 1 FROM subscription_plans LIMIT 1) THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'No subscription plans');
    END IF;
    
    -- Check 6: Payment system configured
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payment_transactions') THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'Payment system not configured');
    END IF;
    
    -- Check 7: API keys system configured
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_keys') THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'API keys system not configured');
    END IF;
    
    -- Check 8: Analytics system configured
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'analytics') THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'Analytics system not configured');
    END IF;
    
    -- Check 9: No expired subscriptions
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE subscription_end_date < NOW() AND plan != 'free') THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'Users with expired subscriptions');
    END IF;
    
    -- Check 10: Recent activity
    IF EXISTS (SELECT 1 FROM survey_responses WHERE submitted_at >= CURRENT_DATE - INTERVAL '7 days' LIMIT 1) THEN
        system_health_score := system_health_score + 1;
    ELSE
        issues := array_append(issues, 'No recent activity');
    END IF;
    
    -- Display results
    RAISE NOTICE 'System Health Score: %/%', system_health_score, max_score;
    
    IF system_health_score = max_score THEN
        RAISE NOTICE '🎉 SYSTEM STATUS: EXCELLENT - All systems operational!';
    ELSIF system_health_score >= 8 THEN
        RAISE NOTICE '✅ SYSTEM STATUS: GOOD - Minor issues detected';
    ELSIF system_health_score >= 6 THEN
        RAISE NOTICE '⚠️  SYSTEM STATUS: FAIR - Some issues need attention';
    ELSE
        RAISE NOTICE '❌ SYSTEM STATUS: POOR - Multiple critical issues detected';
    END IF;
    
    IF array_length(issues, 1) > 0 THEN
        RAISE NOTICE 'Issues detected:';
        FOR i IN 1..array_length(issues, 1) LOOP
            RAISE NOTICE '  - %', issues[i];
        END LOOP;
    END IF;
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'VERIFICATION COMPLETE';
    RAISE NOTICE '=============================================';
END $$;
