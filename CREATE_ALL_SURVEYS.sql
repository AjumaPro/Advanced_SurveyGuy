-- Create All Missing Surveys for QR Codes
-- This script creates surveys for all the IDs that are failing in production

-- Step 1: Check current surveys
SELECT 'Current surveys in database:' as step;
SELECT id, title, status, created_at FROM surveys ORDER BY created_at DESC LIMIT 10;

-- Step 2: Create survey for the original failing URL
SELECT 'Creating survey for original URL...' as step;
INSERT INTO surveys (
    id,
    title,
    description,
    status,
    questions,
    user_id,
    created_at,
    updated_at
) VALUES (
    '85ec5b20-5af6-4479-8bd8-34ae409e2d64'::uuid,
    'Production Test Survey - Original',
    'This survey was created to fix the original "Survey Not Found" error in production.',
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
        }
    ]'::jsonb,
    COALESCE((SELECT id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    questions = EXCLUDED.questions,
    updated_at = NOW();

-- Step 3: Create survey for the mobile QR code error
SELECT 'Creating survey for mobile QR code...' as step;
INSERT INTO surveys (
    id,
    title,
    description,
    status,
    questions,
    user_id,
    created_at,
    updated_at
) VALUES (
    '5d8ac494-c631-45e8-9305-e23b55e95cc9'::uuid,
    'Mobile QR Code Test Survey',
    'This survey was created to fix the mobile QR code scanning issue.',
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
            "title": "How did you access this survey?",
            "description": "Please select how you found this survey",
            "required": true,
            "options": [
                {"value": "qr-code", "label": "QR Code Scan"},
                {"value": "direct-link", "label": "Direct Link"},
                {"value": "social-media", "label": "Social Media"},
                {"value": "email", "label": "Email"},
                {"value": "other", "label": "Other"}
            ]
        },
        {
            "id": "q3",
            "type": "rating",
            "title": "Rate your experience (1-5 stars)",
            "description": "How would you rate your experience with this survey?",
            "required": true,
            "settings": {
                "max": 5
            },
            "options": []
        },
        {
            "id": "q4",
            "type": "paragraph",
            "title": "Any feedback or comments?",
            "description": "Please share any additional feedback about your experience",
            "required": false,
            "options": []
        }
    ]'::jsonb,
    COALESCE((SELECT id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    questions = EXCLUDED.questions,
    updated_at = NOW();

-- Step 4: Verify both surveys exist and are published
SELECT 'Verifying both surveys...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE id IN ('85ec5b20-5af6-4479-8bd8-34ae409e2d64', '5d8ac494-c631-45e8-9305-e23b55e95cc9')
ORDER BY created_at DESC;

-- Step 5: Test API queries for both surveys
SELECT 'Testing API queries...' as step;

-- Test original survey
SELECT 'Original survey API test:' as test_type;
SELECT 
    id,
    title,
    status
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64'
  AND status = 'published';

-- Test mobile survey
SELECT 'Mobile survey API test:' as test_type;
SELECT 
    id,
    title,
    status
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9'
  AND status = 'published';

-- Step 6: Show all published surveys
SELECT 'All published surveys:' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE status = 'published'
ORDER BY created_at DESC;

-- Step 7: Final status check
SELECT 'Final status check:' as step;
SELECT 
    'Original Survey' as survey_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64' 
            AND status = 'published'
        ) 
        THEN '✅ Ready' 
        ELSE '❌ Missing' 
    END as status
UNION ALL
SELECT 
    'Mobile Survey' as survey_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9' 
            AND status = 'published'
        ) 
        THEN '✅ Ready' 
        ELSE '❌ Missing' 
    END as status;
