-- =============================================
-- PRODUCTION CLEANUP SCRIPT
-- =============================================
-- This script removes all demo/test data and prepares the database for production

-- 1. Remove all demo/test surveys
DELETE FROM surveys WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';

-- 2. Remove all demo/test events
DELETE FROM events WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';

-- 3. Remove all demo/test survey responses
DELETE FROM survey_responses WHERE responses::text ILIKE '%demo%' OR responses::text ILIKE '%test%' OR responses::text ILIKE '%sample%';

-- 4. Remove all demo/test event registrations
-- Handle different possible column names for registration data
DELETE FROM event_registrations WHERE 
  (additional_info::text ILIKE '%demo%' OR additional_info::text ILIKE '%test%' OR additional_info::text ILIKE '%sample%') OR
  (registration_data::text ILIKE '%demo%' OR registration_data::text ILIKE '%test%' OR registration_data::text ILIKE '%sample%') OR
  (attendee_name ILIKE '%demo%' OR attendee_name ILIKE '%test%' OR attendee_name ILIKE '%sample%') OR
  (attendee_email ILIKE '%demo%' OR attendee_email ILIKE '%test%' OR attendee_email ILIKE '%sample%');

-- 5. Remove all demo/test API keys
DELETE FROM api_keys WHERE name ILIKE '%demo%' OR name ILIKE '%test%' OR name ILIKE '%sample%';

-- 6. Remove all demo/test coupons
DELETE FROM coupons WHERE code ILIKE '%demo%' OR code ILIKE '%test%' OR code ILIKE '%sample%';

-- 7. Remove all demo/test contact submissions
DELETE FROM contact_submissions WHERE message ILIKE '%demo%' OR message ILIKE '%test%' OR message ILIKE '%sample%';

-- 8. Clean up any orphaned data
DELETE FROM survey_responses WHERE survey_id NOT IN (SELECT id FROM surveys);
DELETE FROM event_registrations WHERE event_id NOT IN (SELECT id FROM events);

-- 9. Reset any demo user accounts (optional - uncomment if needed)
-- DELETE FROM auth.users WHERE email ILIKE '%demo%' OR email ILIKE '%test%' OR email ILIKE '%sample%';

-- 10. Clean up question library (remove demo questions)
DELETE FROM question_library WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';

-- 11. Clean up survey templates (remove demo templates)
DELETE FROM survey_templates WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';

-- 12. Clean up event templates (remove demo templates)
DELETE FROM event_templates WHERE title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%sample%';

-- 13. Verify cleanup
SELECT 'Cleanup completed. Remaining data:' as status;
SELECT COUNT(*) as surveys_count FROM surveys;
SELECT COUNT(*) as events_count FROM events;
SELECT COUNT(*) as responses_count FROM survey_responses;
SELECT COUNT(*) as registrations_count FROM event_registrations;
SELECT COUNT(*) as api_keys_count FROM api_keys;
SELECT COUNT(*) as coupons_count FROM coupons;
SELECT COUNT(*) as contact_submissions_count FROM contact_submissions;
SELECT COUNT(*) as question_library_count FROM question_library;
SELECT COUNT(*) as survey_templates_count FROM survey_templates;
SELECT COUNT(*) as event_templates_count FROM event_templates;
