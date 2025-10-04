-- Create the QR code survey (minimal version)
-- Run this AFTER running CREATE_TABLES_MINIMAL.sql

-- =============================================
-- CREATE THE QR CODE SURVEY
-- =============================================

-- Create the QR code survey
INSERT INTO surveys (
    id,
    title,
    description,
    questions,
    status,
    is_public,
    is_active,
    user_id,
    created_at,
    updated_at
) VALUES (
    '85ec5b20-5af6-4479-8bd8-34ae409e2d64',
    'Customer Feedback Survey',
    'Please help us improve our service by completing this quick survey',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How satisfied are you with our service?",
            "required": true,
            "settings": {"max": 5},
            "options": [
                {"label": "Very Satisfied", "value": 5},
                {"label": "Satisfied", "value": 4},
                {"label": "Neutral", "value": 3},
                {"label": "Dissatisfied", "value": 2},
                {"label": "Very Dissatisfied", "value": 1}
            ]
        },
        {
            "id": "q2",
            "type": "paragraph",
            "question": "What can we do to improve your experience?",
            "required": false,
            "placeholder": "Please share your feedback..."
        },
        {
            "id": "q3",
            "type": "multiple_choice",
            "question": "How did you hear about us?",
            "required": true,
            "options": [
                {"label": "Social Media", "value": "social"},
                {"label": "Search Engine", "value": "search"},
                {"label": "Friend/Recommendation", "value": "referral"},
                {"label": "Advertisement", "value": "ad"},
                {"label": "Other", "value": "other"}
            ]
        }
    ]'::jsonb,
    'published',
    true,
    true,
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    questions = EXCLUDED.questions,
    status = 'published',
    is_public = true,
    is_active = true,
    updated_at = NOW();

-- =============================================
-- VERIFY SURVEY CREATION
-- =============================================

-- Check if survey was created
SELECT 
    id,
    title,
    status,
    is_public,
    is_active,
    created_at,
    user_id
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- Count questions
SELECT 
    id,
    title,
    jsonb_array_length(questions) as question_count
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- Show success message
SELECT '✅ QR Code Survey created successfully!' as message;
SELECT '🎯 Survey URL: https://ajumapro.com/survey/85ec5b20-5af6-4479-8bd8-34ae409e2d64' as survey_url;
SELECT '📱 Now generate a QR code for this survey and test on your mobile device!' as next_step;
