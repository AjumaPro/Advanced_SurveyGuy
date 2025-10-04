-- Simple Debug Mobile Survey
-- This script checks if the mobile survey exists and is working

-- Step 1: Check if the survey exists
SELECT 'Step 1: Checking if survey exists...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    updated_at
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 2: Check if survey is published
SELECT 'Step 2: Checking if survey is published...' as step;
SELECT 
    id,
    title,
    status,
    CASE 
        WHEN status = 'published' THEN '✅ Published' 
        ELSE '❌ Not Published' 
    END as publish_status
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 3: Test the exact API query that the app uses
SELECT 'Step 3: Testing API query...' as step;
SELECT 
    id,
    title,
    description,
    status,
    questions,
    user_id,
    created_at,
    updated_at
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9'
  AND status = 'published';

-- Step 4: Check all published surveys
SELECT 'Step 4: All published surveys...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE status = 'published'
ORDER BY created_at DESC;

-- Step 5: Check total survey count
SELECT 'Step 5: Survey counts...' as step;
SELECT 
    COUNT(*) as total_surveys,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_surveys
FROM surveys;

-- Step 6: Final verification
SELECT 'Step 6: Final verification...' as step;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9' 
            AND status = 'published'
        ) 
        THEN '✅ Survey exists and is published - should work!' 
        ELSE '❌ Survey not found or not published' 
    END as final_status;
