-- =============================================
-- REMOVE MOCK DATA FROM REPORTS PAGE
-- =============================================
-- This script identifies and removes any remaining sample data that might be showing on the reports page

-- First, let's see what data exists that might be showing as "sample data"
SELECT 'CHECKING FOR SAMPLE DATA IN DATABASE:' as status;

-- Check surveys with sample-like titles
SELECT 'Surveys with sample-like titles:' as check_type;
SELECT id, title, description, created_at, user_id
FROM surveys 
WHERE title ILIKE '%customer%' OR title ILIKE '%satisfaction%' OR title ILIKE '%feedback%' 
   OR title ILIKE '%employee%' OR title ILIKE '%engagement%' OR title ILIKE '%product%'
   OR title ILIKE '%market%' OR title ILIKE '%research%' OR title ILIKE '%event%'
   OR title ILIKE '%conference%' OR title ILIKE '%workshop%' OR title ILIKE '%webinar%'
ORDER BY created_at DESC;

-- Check survey responses that might be sample data
SELECT 'Survey responses that might be sample data:' as check_type;
SELECT sr.id, s.title as survey_title, sr.responses, sr.submitted_at
FROM survey_responses sr
JOIN surveys s ON sr.survey_id = s.id
WHERE s.title ILIKE '%customer%' OR s.title ILIKE '%satisfaction%' OR s.title ILIKE '%feedback%'
   OR s.title ILIKE '%employee%' OR s.title ILIKE '%engagement%' OR s.title ILIKE '%product%'
   OR s.title ILIKE '%market%' OR s.title ILIKE '%research%' OR s.title ILIKE '%event%'
   OR s.title ILIKE '%conference%' OR s.title ILIKE '%workshop%' OR s.title ILIKE '%webinar%'
ORDER BY sr.submitted_at DESC
LIMIT 10;

-- Check events with sample-like titles
SELECT 'Events with sample-like titles:' as check_type;
SELECT id, title, description, created_at, user_id
FROM events 
WHERE title ILIKE '%tech%' OR title ILIKE '%conference%' OR title ILIKE '%workshop%'
   OR title ILIKE '%webinar%' OR title ILIKE '%launch%' OR title ILIKE '%summit%'
   OR title ILIKE '%meetup%' OR title ILIKE '%training%' OR title ILIKE '%demo%'
ORDER BY created_at DESC;

-- Check event registrations that might be sample data
SELECT 'Event registrations that might be sample data:' as check_type;
SELECT er.id, e.title as event_title, er.attendee_name, er.attendee_email, er.registered_at
FROM event_registrations er
JOIN events e ON er.event_id = e.id
WHERE e.title ILIKE '%tech%' OR e.title ILIKE '%conference%' OR e.title ILIKE '%workshop%'
   OR e.title ILIKE '%webinar%' OR e.title ILIKE '%launch%' OR e.title ILIKE '%summit%'
   OR e.title ILIKE '%meetup%' OR e.title ILIKE '%training%' OR e.title ILIKE '%demo%'
ORDER BY er.registered_at DESC
LIMIT 10;

-- Summary of what might be showing as sample data
SELECT 'SUMMARY - Data that might appear as sample data:' as status;
SELECT 
    (SELECT COUNT(*) FROM surveys WHERE title ILIKE '%customer%' OR title ILIKE '%satisfaction%' OR title ILIKE '%feedback%' OR title ILIKE '%employee%' OR title ILIKE '%engagement%' OR title ILIKE '%product%' OR title ILIKE '%market%' OR title ILIKE '%research%' OR title ILIKE '%event%' OR title ILIKE '%conference%' OR title ILIKE '%workshop%' OR title ILIKE '%webinar%') as sample_like_surveys,
    (SELECT COUNT(*) FROM events WHERE title ILIKE '%tech%' OR title ILIKE '%conference%' OR title ILIKE '%workshop%' OR title ILIKE '%webinar%' OR title ILIKE '%launch%' OR title ILIKE '%summit%' OR title ILIKE '%meetup%' OR title ILIKE '%training%' OR title ILIKE '%demo%') as sample_like_events,
    (SELECT COUNT(*) FROM survey_responses sr JOIN surveys s ON sr.survey_id = s.id WHERE s.title ILIKE '%customer%' OR s.title ILIKE '%satisfaction%' OR s.title ILIKE '%feedback%' OR s.title ILIKE '%employee%' OR s.title ILIKE '%engagement%' OR s.title ILIKE '%product%' OR s.title ILIKE '%market%' OR s.title ILIKE '%research%' OR s.title ILIKE '%event%' OR s.title ILIKE '%conference%' OR s.title ILIKE '%workshop%' OR s.title ILIKE '%webinar%') as sample_like_responses,
    (SELECT COUNT(*) FROM event_registrations er JOIN events e ON er.event_id = e.id WHERE e.title ILIKE '%tech%' OR e.title ILIKE '%conference%' OR e.title ILIKE '%workshop%' OR e.title ILIKE '%webinar%' OR e.title ILIKE '%launch%' OR e.title ILIKE '%summit%' OR e.title ILIKE '%meetup%' OR e.title ILIKE '%training%' OR e.title ILIKE '%demo%') as sample_like_registrations;
