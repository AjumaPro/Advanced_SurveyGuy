-- Simple Events Table Check
-- Run this in Supabase SQL Editor to check your events table

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

-- Check if there are any other event-related tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%event%';

-- Check if events table exists at all
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'events' 
    AND table_schema = 'public'
) as events_table_exists;
