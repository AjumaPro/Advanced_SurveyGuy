-- =============================================
-- ULTRA SAFE PRODUCTION CLEANUP SCRIPT
-- =============================================
-- This script safely removes all demo/test data and prepares the database for production
-- It checks for both table and column existence before attempting to delete data

-- 1. Remove all demo/test surveys (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'surveys') THEN
        DELETE FROM surveys WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo surveys';
    ELSE
        RAISE NOTICE 'Surveys table does not exist, skipping...';
    END IF;
END $$;

-- 2. Remove all demo/test events (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
        DELETE FROM events WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo events';
    ELSE
        RAISE NOTICE 'Events table does not exist, skipping...';
    END IF;
END $$;

-- 3. Remove all demo/test survey responses (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_responses') THEN
        DELETE FROM survey_responses WHERE responses::text ILIKE '%demo%' OR responses::text ILIKE '%test%' OR responses::text ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo survey responses';
    ELSE
        RAISE NOTICE 'Survey_responses table does not exist, skipping...';
    END IF;
END $$;

-- 4. Remove all demo/test event registrations (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_registrations') THEN
        -- Try to delete based on additional_info column (most common)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'additional_info') THEN
            DELETE FROM event_registrations WHERE additional_info::text ILIKE '%demo%' OR additional_info::text ILIKE '%test%' OR additional_info::text ILIKE '%sample%';
        END IF;
        
        -- Try to delete based on registration_data column
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'registration_data') THEN
            DELETE FROM event_registrations WHERE registration_data::text ILIKE '%demo%' OR registration_data::text ILIKE '%test%' OR registration_data::text ILIKE '%sample%';
        END IF;
        
        -- Delete based on attendee names/emails
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'attendee_name') THEN
            DELETE FROM event_registrations WHERE attendee_name ILIKE '%demo%' OR attendee_name ILIKE '%test%' OR attendee_name ILIKE '%sample%';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'attendee_email') THEN
            DELETE FROM event_registrations WHERE attendee_email ILIKE '%demo%' OR attendee_email ILIKE '%test%' OR attendee_email ILIKE '%sample%';
        END IF;
        
        -- Delete based on name/email columns (alternative schema)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'name') THEN
            DELETE FROM event_registrations WHERE name ILIKE '%demo%' OR name ILIKE '%test%' OR name ILIKE '%sample%';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'event_registrations' AND column_name = 'email') THEN
            DELETE FROM event_registrations WHERE email ILIKE '%demo%' OR email ILIKE '%test%' OR email ILIKE '%sample%';
        END IF;
        
        RAISE NOTICE 'Cleaned up demo event registrations';
    ELSE
        RAISE NOTICE 'Event_registrations table does not exist, skipping...';
    END IF;
END $$;

-- 5. Remove all demo/test API keys (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'api_keys') THEN
        DELETE FROM api_keys WHERE name ILIKE '%demo%' OR name ILIKE '%test%' OR name ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo API keys';
    ELSE
        RAISE NOTICE 'API_keys table does not exist, skipping...';
    END IF;
END $$;

-- 6. Remove all demo/test coupons (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coupons') THEN
        DELETE FROM coupons WHERE code ILIKE '%demo%' OR code ILIKE '%test%' OR code ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo coupons';
    ELSE
        RAISE NOTICE 'Coupons table does not exist, skipping...';
    END IF;
END $$;

-- 7. Remove all demo/test contact submissions (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions') THEN
        DELETE FROM contact_submissions WHERE message ILIKE '%demo%' OR message ILIKE '%test%' OR message ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo contact submissions';
    ELSE
        RAISE NOTICE 'Contact_submissions table does not exist, skipping...';
    END IF;
END $$;

-- 8. Clean up any orphaned data (if tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_responses') AND 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'surveys') THEN
        DELETE FROM survey_responses WHERE survey_id NOT IN (SELECT id FROM surveys);
        RAISE NOTICE 'Cleaned up orphaned survey responses';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_registrations') AND 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
        DELETE FROM event_registrations WHERE event_id NOT IN (SELECT id FROM events);
        RAISE NOTICE 'Cleaned up orphaned event registrations';
    END IF;
END $$;

-- 9. Reset any demo user accounts (optional - uncomment if needed)
-- DO $$
-- BEGIN
--     IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'auth') THEN
--         DELETE FROM auth.users WHERE email ILIKE '%demo%' OR email ILIKE '%test%' OR email ILIKE '%sample%';
--         RAISE NOTICE 'Cleaned up demo user accounts';
--     END IF;
-- END $$;

-- 10. Clean up question library (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'question_library') THEN
        DELETE FROM question_library WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo question library entries';
    ELSE
        RAISE NOTICE 'Question_library table does not exist, skipping...';
    END IF;
END $$;

-- 11. Clean up survey templates (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'survey_templates') THEN
        DELETE FROM survey_templates WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo survey templates';
    ELSE
        RAISE NOTICE 'Survey_templates table does not exist, skipping...';
    END IF;
END $$;

-- 12. Clean up event templates (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_templates') THEN
        DELETE FROM event_templates WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';
        RAISE NOTICE 'Cleaned up demo event templates';
    ELSE
        RAISE NOTICE 'Event_templates table does not exist, skipping...';
    END IF;
END $$;

-- 13. Verify cleanup - only check tables that exist
SELECT 'Ultra safe cleanup completed. Checking remaining data:' as status;

DO $$
DECLARE
    tbl_name TEXT;
    count_result INTEGER;
BEGIN
    -- Check each table and report counts
    FOR tbl_name IN SELECT unnest(ARRAY['surveys', 'events', 'survey_responses', 'event_registrations', 'api_keys', 'coupons', 'contact_submissions', 'question_library', 'survey_templates', 'event_templates']) LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl_name) THEN
            EXECUTE format('SELECT COUNT(*) FROM %I', tbl_name) INTO count_result;
            RAISE NOTICE '%: % records', tbl_name, count_result;
        ELSE
            RAISE NOTICE '%: table does not exist', tbl_name;
        END IF;
    END LOOP;
END $$;
