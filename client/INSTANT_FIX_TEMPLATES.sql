-- INSTANT FIX - Customer Feedback Templates
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID

-- First, let's get your user ID
SELECT auth.uid() as your_user_id;

-- If the above returns null, find your user ID this way:
SELECT id as your_user_id FROM auth.users WHERE email = 'your.email@example.com';

-- OR find it from existing surveys:
SELECT DISTINCT user_id FROM surveys LIMIT 5;

-- Once you have your user ID, replace 'YOUR_USER_ID_HERE' below with it
-- Example: '12345678-1234-1234-1234-123456789012'

INSERT INTO surveys (
    id,
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    created_at,
    updated_at,
    published_at
) VALUES (
    gen_random_uuid(),
    'YOUR_USER_ID_HERE',  -- Replace this with your actual user ID
    '[TEMPLATE] Customer Satisfaction Survey',
    'Professional customer satisfaction survey template. Duplicate this to create your own customer feedback surveys.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How satisfied are you with our product or service?",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How likely are you to recommend us to others?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely"
        },
        {
            "id": "q3",
            "type": "multiple-choice",
            "question": "What did you like most about your experience?",
            "required": false,
            "options": ["Product quality", "Customer service", "Value for money", "Ease of use", "Fast delivery", "Professional staff", "Other"]
        },
        {
            "id": "q4",
            "type": "text",
            "question": "What could we improve?",
            "required": false,
            "placeholder": "Your suggestions help us get better..."
        },
        {
            "id": "q5",
            "type": "email",
            "question": "Email address (optional - for follow-up)",
            "required": false,
            "placeholder": "your.email@example.com"
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your feedback! This helps us improve our services.",
        "estimatedTime": "3-4 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Create Quick NPS Template
INSERT INTO surveys (
    id,
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    created_at,
    updated_at,
    published_at
) VALUES (
    gen_random_uuid(),
    'YOUR_USER_ID_HERE',  -- Replace this with your actual user ID
    '[TEMPLATE] Quick NPS Survey',
    'Simple Net Promoter Score survey template. Perfect for measuring customer loyalty quickly.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How likely are you to recommend our company to a friend or colleague?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely"
        },
        {
            "id": "q2",
            "type": "text",
            "question": "What is the primary reason for your score?",
            "required": false,
            "placeholder": "Please explain your rating..."
        },
        {
            "id": "q3",
            "type": "text",
            "question": "What could we do to improve?",
            "required": false,
            "placeholder": "Your suggestions for improvement..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your feedback!",
        "estimatedTime": "2 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Verify the templates were created
SELECT 
    id, 
    title, 
    JSON_ARRAY_LENGTH(questions) as question_count, 
    status,
    'Templates Created Successfully!' as message
FROM surveys 
WHERE title LIKE '[TEMPLATE]%' 
ORDER BY created_at DESC;
