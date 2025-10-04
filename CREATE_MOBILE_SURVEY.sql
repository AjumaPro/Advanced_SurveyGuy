-- Create Mobile Survey for QR Code
-- This creates the exact survey ID that's failing on mobile: 5d8ac494-c631-45e8-9305-e23b55e95cc9

-- Step 1: Check if the survey already exists
SELECT 'Checking if survey exists...' as step;
SELECT id, title, status, created_at FROM surveys WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 2: Create the mobile survey with the exact ID from the error
SELECT 'Creating mobile survey...' as step;

-- Get a user ID to assign the survey to (simplified approach)
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
    'This survey was created to fix the mobile QR code scanning issue. It contains test questions to verify that survey access works correctly on mobile devices.',
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
        },
        {
            "id": "q5",
            "type": "emoji_scale",
            "title": "How satisfied are you?",
            "description": "Select your satisfaction level",
            "required": true,
            "options": [
                {"value": "very-satisfied", "label": "Very Satisfied", "emoji": "😊"},
                {"value": "satisfied", "label": "Satisfied", "emoji": "🙂"},
                {"value": "neutral", "label": "Neutral", "emoji": "😐"},
                {"value": "dissatisfied", "label": "Dissatisfied", "emoji": "😞"},
                {"value": "very-dissatisfied", "label": "Very Dissatisfied", "emoji": "😢"}
            ]
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

-- Step 3: Verify the mobile survey was created/updated successfully
SELECT 'Verifying mobile survey creation...' as step;
SELECT 
    id, 
    title, 
    status, 
    created_at,
    updated_at,
    user_id,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9';

-- Step 4: Test the exact query that the API uses
SELECT 'Testing API query...' as step;
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

-- Step 5: Show all published surveys for reference
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

-- Step 6: Final verification
SELECT 'Final verification complete!' as step;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM surveys 
            WHERE id = '5d8ac494-c631-45e8-9305-e23b55e95cc9' 
            AND status = 'published'
        ) 
        THEN '✅ Mobile survey exists and is published' 
        ELSE '❌ Mobile survey not found or not published' 
    END as mobile_survey_status;
