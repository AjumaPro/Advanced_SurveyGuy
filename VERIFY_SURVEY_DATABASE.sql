-- Quick Survey Database Verification
-- Run this to check if surveys are working in production

-- 1. Check if surveys table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'surveys'
        ) 
        THEN '✅ Surveys table exists' 
        ELSE '❌ Surveys table missing' 
    END as table_status;

-- 2. Count total surveys
SELECT 
    COUNT(*) as total_surveys,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_surveys
FROM surveys;

-- 3. Check the specific survey ID from the URL
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64'
        ) 
        THEN '✅ Survey ID exists' 
        ELSE '❌ Survey ID not found' 
    END as survey_id_status;

-- 4. Check if the survey is published
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64' 
            AND status = 'published'
        ) 
        THEN '✅ Survey is published' 
        ELSE '❌ Survey not published' 
    END as survey_published_status;

-- 5. Show survey details if it exists
SELECT 
    id,
    title,
    status,
    created_at,
    updated_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- 6. Show all published surveys
SELECT 
    id,
    title,
    status,
    created_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 10;
