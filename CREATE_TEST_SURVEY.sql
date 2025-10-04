-- Create a test survey for production testing
-- This ensures there's at least one published survey available

-- First, check if we have any users
SELECT id, email, created_at FROM profiles LIMIT 5;

-- Create a test survey (replace 'your-user-id' with an actual user ID from profiles table)
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
    '85ec5b20-5af6-4479-8bd8-34ae409e2d64', -- The exact ID from the URL
    'Test Survey for Production',
    'This is a test survey to verify that survey URLs work correctly in production.',
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
    (SELECT id FROM profiles LIMIT 1), -- Use the first available user
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    questions = EXCLUDED.questions,
    updated_at = NOW();

-- Verify the survey was created/updated
SELECT 
    id, 
    title, 
    status, 
    created_at,
    user_id,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- Check all published surveys
SELECT 
    id, 
    title, 
    status, 
    created_at,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE status = 'published'
ORDER BY created_at DESC;
