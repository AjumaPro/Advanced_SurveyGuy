-- Debug Mobile Survey Issue
-- This script helps diagnose why the mobile survey still isn't working

-- Step 1: Check if the survey was actually created
SELECT 'Step 1: Checking if survey exists...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    updated_at,
    user_id
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 2: Check if survey is published (this is what the API looks for)
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

-- Step 4: Check if there are any other surveys with similar IDs
SELECT 'Step 4: Checking for similar survey IDs...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at
FROM surveys 
WHERE id::text LIKE '%5d8ac494%' 
   OR id::text LIKE '%c631%' 
   OR id::text LIKE '%9305%' 
   OR id::text LIKE '%e23b55e95cc9%';

-- Step 5: Check all published surveys
SELECT 'Step 5: All published surveys...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE status = 'published'
ORDER BY created_at DESC;

-- Step 6: Force update the survey status to published (in case it's not)
SELECT 'Step 6: Force updating survey status...' as step;
UPDATE surveys 
SET status = 'published', updated_at = NOW()
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 7: Verify the update worked
SELECT 'Step 7: Verifying status update...' as step;
SELECT 
    id, 
    title, 
    status, 
    updated_at
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 8: Final API test
SELECT 'Step 8: Final API test...' as step;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9' 
            AND status = 'published'
        ) 
        THEN '✅ Survey exists and is published - should work!' 
        ELSE '❌ Survey still not found or not published' 
    END as final_status;
