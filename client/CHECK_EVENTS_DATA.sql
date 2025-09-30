-- CHECK EVENTS DATA
-- This script helps debug why Published Events section is not showing

-- 1. Check total count of events
SELECT 'Total Events' AS category, COUNT(*) AS count FROM public.events;

-- 2. Check events by status
SELECT 
    status,
    COUNT(*) AS count
FROM public.events 
GROUP BY status
ORDER BY count DESC;

-- 3. Check events by user (if any)
SELECT 
    user_id,
    COUNT(*) AS event_count,
    STRING_AGG(title, ', ') AS event_titles
FROM public.events 
GROUP BY user_id
ORDER BY event_count DESC;

-- 4. Show sample events with all details
SELECT 
    id,
    title,
    description,
    status,
    is_template,
    is_public,
    start_date,
    starts_at,
    end_date,
    ends_at,
    location,
    capacity,
    created_at,
    updated_at
FROM public.events 
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check if any events have status = 'published'
SELECT 
    'Published Events' AS category,
    COUNT(*) AS count
FROM public.events 
WHERE status = 'published';

-- 6. Check all possible status values
SELECT DISTINCT status FROM public.events ORDER BY status;

-- 7. Check if events table exists and has data
SELECT 
    'Table Info' AS info,
    COUNT(*) AS total_rows,
    MIN(created_at) AS earliest_event,
    MAX(created_at) AS latest_event
FROM public.events;
