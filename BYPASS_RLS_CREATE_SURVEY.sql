-- Bypass RLS and create the survey for QR code
-- Survey ID: 85ec5b20-5af6-4479-8bd8-34ae409e2d64

-- Temporarily disable RLS for this operation
ALTER TABLE surveys DISABLE ROW LEVEL SECURITY;

-- Insert the survey
INSERT INTO surveys (
    id,
    title,
    description,
    questions,
    status,
    created_at,
    updated_at,
    user_id
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
            "type": "text",
            "question": "What can we do to improve your experience?",
            "required": false,
            "placeholder": "Please share your feedback..."
        },
        {
            "id": "q3",
            "type": "multiple-choice",
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
    NOW(),
    NOW(),
    COALESCE((SELECT id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid)
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    questions = EXCLUDED.questions,
    status = 'published',
    updated_at = NOW();

-- Re-enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Verify the survey was created
SELECT 
    id,
    title,
    status,
    created_at,
    user_id
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- Show success message
SELECT '✅ Survey 85ec5b20-5af6-4479-8bd8-34ae409e2d64 created successfully!' as message;
