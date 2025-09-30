-- DIAGNOSE EVENTS TABLE SCHEMA
-- This script helps identify the exact schema and constraints of the events table

-- 1. Check all columns in the events table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'events' 
ORDER BY ordinal_position;

-- 2. Check for NOT NULL constraints specifically on date columns
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name IN ('start_date', 'end_date', 'starts_at', 'ends_at', 'created_at', 'updated_at')
ORDER BY column_name;

-- 3. Check table constraints
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'events'
ORDER BY tc.constraint_type, kcu.column_name;

-- 4. Check check constraints specifically
SELECT 
    conname AS constraint_name,
    consrc AS check_clause
FROM pg_constraint 
WHERE conrelid = 'public.events'::regclass 
    AND contype = 'c';

-- 5. Sample data to see what's currently in the table
SELECT 
    id,
    title,
    start_date,
    end_date,
    starts_at,
    ends_at,
    created_at,
    updated_at
FROM public.events 
LIMIT 5;

-- 6. Count records with null values in date columns
SELECT 
    COUNT(*) as total_records,
    COUNT(start_date) as start_date_count,
    COUNT(end_date) as end_date_count,
    COUNT(starts_at) as starts_at_count,
    COUNT(ends_at) as ends_at_count
FROM public.events;
