-- WORKING CUSTOMER FEEDBACK TEMPLATES
-- This version works with your existing database structure
-- Run this in Supabase SQL Editor

-- First, let's create one simple customer satisfaction survey template
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
    auth.uid(),
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

-- Create a Quick NPS Survey Template
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
    auth.uid(),
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

-- Verify the surveys were created
SELECT 
    id, 
    title, 
    JSON_ARRAY_LENGTH(questions) as question_count, 
    status,
    'Customer Feedback Templates Created Successfully!' as message
FROM surveys 
WHERE title LIKE '[TEMPLATE]%' 
AND user_id = auth.uid() 
ORDER BY created_at DESC;
