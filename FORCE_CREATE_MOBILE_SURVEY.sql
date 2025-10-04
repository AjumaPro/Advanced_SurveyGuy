-- Force Create Mobile Survey
-- This script forcefully creates/updates the mobile survey to ensure it works

-- Step 1: Delete the survey if it exists (to start fresh)
SELECT 'Step 1: Removing existing survey...' as step;
DELETE FROM surveys WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 2: Create the survey fresh
SELECT 'Step 2: Creating fresh mobile survey...' as step;
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
    (SELECT id FROM profiles LIMIT 1),
    NOW(),
    NOW()
);

-- Step 3: Verify creation
SELECT 'Step 3: Verifying survey creation...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    updated_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 4: Test the exact API query
SELECT 'Step 4: Testing API query...' as step;
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

-- Step 5: Check survey count
SELECT 'Step 5: Survey count...' as step;
SELECT COUNT(*) as total_surveys FROM surveys;
SELECT COUNT(*) as published_surveys FROM surveys WHERE status = 'published';

-- Step 6: Final verification
SELECT 'Step 6: Final verification...' as step;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9' 
            AND status = 'published'
        ) 
        THEN '✅ Mobile survey is ready for QR code scanning!' 
        ELSE '❌ Mobile survey creation failed' 
    END as result;
