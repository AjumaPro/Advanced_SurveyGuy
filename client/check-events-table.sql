-- Check what columns actually exist in the events table
-- Run this in Supabase SQL Editor to see the actual schema

-- Check if events table exists and what columns it has
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check if there are any other event-related tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%event%';

-- Check the actual events table structure
-- Note: \d is not valid in SQL editor, use the query above instead
