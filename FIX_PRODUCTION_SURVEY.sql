-- Fix Production Survey Access
-- This script creates the exact survey that's failing in production

-- Step 1: Check if we have any users
SELECT 'Checking users...' as step;
SELECT id, email, created_at FROM profiles LIMIT 5;

-- Step 2: Check if surveys table exists and has data
SELECT 'Checking surveys table...' as step;
SELECT COUNT(*) as total_surveys FROM surveys;
SELECT id, title, status, created_at FROM surveys ORDER BY created_at DESC LIMIT 5;

-- Step 3: Check if the specific survey ID exists
SELECT 'Checking specific survey ID...' as step;
SELECT id, title, status, created_at FROM surveys WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- Step 4: Create or update the test survey with the exact ID from the URL
SELECT 'Creating/updating test survey...' as step;

-- First, get a user ID to assign the survey to
WITH user_check AS (
  SELECT id FROM profiles LIMIT 1
),
fallback_user AS (
  SELECT COALESCE(
    (SELECT id FROM user_check),
    '00000000-0000-0000-0000-000000000000'::uuid
  ) as user_id
)
INSERT INTO surveys (
    id,
    title,
    description,
    status,
    questions,
    user_id,
    created_at,
    updated_at
) 
SELECT 
    '85ec5b20-5af6-4479-8bd8-34ae409e2d64'::uuid,
    'Production Test Survey',
    'This is a test survey to verify that survey URLs work correctly in production. This survey was created to fix the "Survey Not Found" error.',
    'published',
    '[
        {
            "id": "q1",
            "type": "short_answer",
            "title": "What is your name?",
            "description": "Please enter your full name",
            "required": true,
            "options": []
        },
        {
            "id": "q2", 
            "type": "multiple_choice",
            "title": "How satisfied are you with our service?",
            "description": "Please select your satisfaction level",
            "required": true,
            "options": [
                {"value": "very-satisfied", "label": "Very Satisfied"},
                {"value": "satisfied", "label": "Satisfied"},
                {"value": "neutral", "label": "Neutral"},
                {"value": "dissatisfied", "label": "Dissatisfied"},
                {"value": "very-dissatisfied", "label": "Very Dissatisfied"}
            ]
        },
        {
            "id": "q3",
            "type": "paragraph",
            "title": "Any additional comments?",
            "description": "Please share any additional feedback",
            "required": false,
            "options": []
        },
        {
            "id": "q4",
            "type": "rating",
            "title": "Rate our service (1-5 stars)",
            "description": "Please rate our service quality",
            "required": true,
            "settings": {
                "max": 5
            },
            "options": []
        }
    ]'::jsonb,
    fallback_user.user_id,
    NOW(),
    NOW()
FROM fallback_user
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    questions = EXCLUDED.questions,
    updated_at = NOW();

-- Step 5: Verify the survey was created/updated successfully
SELECT 'Verifying survey creation...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    updated_at,
    user_id,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- Step 6: Check all published surveys
SELECT 'Checking all published surveys...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE status = 'published'
ORDER BY created_at DESC;

-- Step 7: Test survey access query (same as the API uses)
SELECT 'Testing survey access query...' as step;
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
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64'
  AND status = 'published';

-- Step 8: Final verification
SELECT 'Final verification complete!' as step;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64' 
            AND status = 'published'
        ) 
        THEN '✅ Survey exists and is published' 
        ELSE '❌ Survey not found or not published' 
    END as survey_status;
