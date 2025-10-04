-- =============================================
-- IDENTIFY SAMPLE DATA IN DATABASE
-- =============================================
-- This script helps identify what sample data is still in your database

-- Check for sample surveys
SELECT 'SAMPLE SURVEYS FOUND:' as check_type;
SELECT id, title, description, created_at 
FROM surveys 
WHERE title ILIKE '%sample%' OR title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%example%'
ORDER BY created_at DESC;

-- Check for sample events
SELECT 'SAMPLE EVENTS FOUND:' as check_type;
SELECT id, title, description, created_at 
FROM events 
WHERE title ILIKE '%sample%' OR title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%example%'
ORDER BY created_at DESC;

-- Check for sample survey responses
SELECT 'SAMPLE SURVEY RESPONSES FOUND:' as check_type;
SELECT sr.id, s.title as survey_title, sr.responses, sr.submitted_at
FROM survey_responses sr
JOIN surveys s ON sr.survey_id = s.id
WHERE s.title ILIKE '%sample%' OR s.title ILIKE '%demo%' OR s.title ILIKE '%test%' OR s.title ILIKE '%example%'
   OR sr.responses::text ILIKE '%sample%' OR sr.responses::text ILIKE '%demo%' OR sr.responses::text ILIKE '%test%'
ORDER BY sr.submitted_at DESC;

-- Check for sample event registrations
SELECT 'SAMPLE EVENT REGISTRATIONS FOUND:' as check_type;
SELECT er.id, e.title as event_title, er.attendee_name, er.attendee_email, er.registered_at
FROM event_registrations er
JOIN events e ON er.event_id = e.id
WHERE e.title ILIKE '%sample%' OR e.title ILIKE '%demo%' OR e.title ILIKE '%test%' OR e.title ILIKE '%example%'
   OR er.attendee_name ILIKE '%sample%' OR er.attendee_name ILIKE '%demo%' OR er.attendee_name ILIKE '%test%'
   OR er.attendee_email ILIKE '%sample%' OR er.attendee_email ILIKE '%demo%' OR er.attendee_email ILIKE '%test%'
ORDER BY er.registered_at DESC;

-- Check for sample API keys
SELECT 'SAMPLE API KEYS FOUND:' as check_type;
SELECT id, name, created_at 
FROM api_keys 
WHERE name ILIKE '%sample%' OR name ILIKE '%demo%' OR name ILIKE '%test%' OR name ILIKE '%example%'
ORDER BY created_at DESC;

-- Check for sample contact submissions
SELECT 'SAMPLE CONTACT SUBMISSIONS FOUND:' as check_type;
SELECT id, name, email, message, created_at 
FROM contact_submissions 
WHERE name ILIKE '%sample%' OR name ILIKE '%demo%' OR name ILIKE '%test%' OR name ILIKE '%example%'
   OR email ILIKE '%sample%' OR email ILIKE '%demo%' OR email ILIKE '%test%' OR email ILIKE '%example%'
   OR message ILIKE '%sample%' OR message ILIKE '%demo%' OR message ILIKE '%test%' OR message ILIKE '%example%'
ORDER BY created_at DESC;

-- Check for sample question library entries
SELECT 'SAMPLE QUESTION LIBRARY ENTRIES FOUND:' as check_type;
SELECT id, title, description, created_at 
FROM question_library 
WHERE title ILIKE '%sample%' OR title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%example%'
   OR description ILIKE '%sample%' OR description ILIKE '%demo%' OR description ILIKE '%test%' OR description ILIKE '%example%'
ORDER BY created_at DESC;

-- Check for sample survey templates
SELECT 'SAMPLE SURVEY TEMPLATES FOUND:' as check_type;
SELECT id, title, description, created_at 
FROM survey_templates 
WHERE title ILIKE '%sample%' OR title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%example%'
   OR description ILIKE '%sample%' OR description ILIKE '%demo%' OR description ILIKE '%test%' OR description ILIKE '%example%'
ORDER BY created_at DESC;

-- Check for sample event templates
SELECT 'SAMPLE EVENT TEMPLATES FOUND:' as check_type;
SELECT id, title, description, created_at 
FROM event_templates 
WHERE title ILIKE '%sample%' OR title ILIKE '%demo%' OR title ILIKE '%test%' OR title ILIKE '%example%'
   OR description ILIKE '%sample%' OR description ILIKE '%demo%' OR description ILIKE '%test%' OR description ILIKE '%example%'
ORDER BY created_at DESC;

-- Summary count of all data
SELECT 'SUMMARY - TOTAL RECORDS:' as check_type;
SELECT 
    (SELECT COUNT(*) FROM surveys) as total_surveys,
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM survey_responses) as total_survey_responses,
    (SELECT COUNT(*) FROM event_registrations) as total_event_registrations,
    (SELECT COUNT(*) FROM api_keys) as total_api_keys,
    (SELECT COUNT(*) FROM contact_submissions) as total_contact_submissions,
    (SELECT COUNT(*) FROM question_library) as total_question_library,
    (SELECT COUNT(*) FROM survey_templates) as total_survey_templates,
    (SELECT COUNT(*) FROM event_templates) as total_event_templates;
