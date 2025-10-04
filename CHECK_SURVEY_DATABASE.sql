-- Check Survey Database Status
-- This script helps diagnose survey access issues

-- 1. Check if the specific survey exists
SELECT 
    id, 
    title, 
    status, 
    created_at,
    updated_at,
    user_id
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- 2. Check all surveys in the database
SELECT 
    id, 
    title, 
    status, 
    created_at,
    user_id
FROM surveys 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Check published surveys only
SELECT 
    id, 
    title, 
    status, 
    created_at,
    user_id
FROM surveys 
WHERE status = 'published'
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Check survey table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'surveys' 
ORDER BY ordinal_position;

-- 5. Check if surveys table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'surveys'
) as surveys_table_exists;

-- 6. Count total surveys
SELECT COUNT(*) as total_surveys FROM surveys;

-- 7. Count published surveys
SELECT COUNT(*) as published_surveys FROM surveys WHERE status = 'published';

-- 8. Check for any surveys with the specific ID pattern
SELECT 
    id, 
    title, 
    status, 
    created_at
FROM surveys 
WHERE id LIKE '%85ec5b20%' 
   OR id LIKE '%5af6%' 
   OR id LIKE '%8bd8%' 
   OR id LIKE '%34ae409e2d64%';
