-- SIMPLE CUSTOMER FEEDBACK TEMPLATES (Compatible with existing table)
-- This works with your current surveys table structure

-- First, let's check what columns exist in your surveys table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'surveys' 
ORDER BY ordinal_position;

-- Get your user ID first
SELECT 
    id as your_user_id,
    email,
    'Copy this user_id and replace YOUR_USER_ID below' as instruction
FROM profiles 
ORDER BY created_at DESC 
LIMIT 3;

-- Template 1: Basic Customer Satisfaction Survey
INSERT INTO surveys (
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
    'YOUR_USER_ID'::UUID, -- Replace with your actual user ID from above
    'Customer Satisfaction Survey Template',
    'A simple 5-question survey to measure customer satisfaction and gather improvement suggestions.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How satisfied are you with our product/service?",
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
            "question": "Email (optional - for follow-up)",
            "required": false,
            "placeholder": "your.email@example.com"
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": true,
        "allowBack": true,
        "thankYouMessage": "Thank you for your feedback!",
        "estimatedTime": "2-3 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Template 2: Quick NPS Survey
INSERT INTO surveys (
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
    'YOUR_USER_ID'::UUID, -- Replace with your actual user ID
    'Quick NPS Survey Template',
    'A brief Net Promoter Score survey to measure customer loyalty.',
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
            "question": "What could we do to improve your experience?",
            "required": false,
            "placeholder": "Your suggestions for improvement..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": true,
        "allowBack": true,
        "thankYouMessage": "Thank you for your feedback!",
        "estimatedTime": "1-2 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Template 3: Post-Purchase Feedback
INSERT INTO surveys (
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
    'YOUR_USER_ID'::UUID, -- Replace with your actual user ID
    'Post-Purchase Feedback Template',
    'Collect feedback about the purchase experience and product satisfaction.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How easy was it to find what you were looking for?",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How was the checkout process?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "How satisfied are you with your purchase?",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How would you rate the value for money?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Fair", "Good", "Excellent"]
        },
        {
            "id": "q5",
            "type": "multiple-choice",
            "question": "Will you purchase from us again?",
            "required": false,
            "options": ["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"]
        },
        {
            "id": "q6",
            "type": "text",
            "question": "What did we do well?",
            "required": false,
            "placeholder": "Tell us what you liked..."
        },
        {
            "id": "q7",
            "type": "text",
            "question": "What could we improve?",
            "required": false,
            "placeholder": "Your suggestions..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your purchase and feedback!",
        "estimatedTime": "3-4 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Template 4: Customer Service Feedback
INSERT INTO surveys (
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
    'YOUR_USER_ID'::UUID, -- Replace with your actual user ID
    'Customer Service Feedback Template',
    'Evaluate customer service interactions to improve support quality.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "How did you contact our support?",
            "required": true,
            "options": ["Phone", "Email", "Live chat", "Website form", "Social media", "In-person"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How easy was it to reach support?",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "Quality of service received",
            "required": true,
            "scale": 5,
            "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How well was your issue resolved?",
            "required": true,
            "scale": 5,
            "labels": ["Not resolved", "Partially resolved", "Adequately resolved", "Well resolved", "Completely resolved"]
        },
        {
            "id": "q5",
            "type": "rating",
            "question": "Overall satisfaction with support",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q6",
            "type": "text",
            "question": "How can we improve our support?",
            "required": false,
            "placeholder": "Your suggestions..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for helping us improve our support!",
        "estimatedTime": "2-3 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Verify surveys were created
SELECT 
    id,
    title,
    JSON_ARRAY_LENGTH(questions) as question_count,
    status,
    'Survey template created successfully!' as message
FROM surveys 
WHERE user_id = 'YOUR_USER_ID'::UUID  -- Replace with your actual user ID
AND title LIKE '%Template%'
ORDER BY created_at DESC;

-- Show the public URLs
SELECT 
    title,
    CONCAT('http://localhost:3000/survey/', id) as public_url,
    JSON_ARRAY_LENGTH(questions) as questions,
    'Ready to use!' as status
FROM surveys 
WHERE user_id = 'YOUR_USER_ID'::UUID  -- Replace with your actual user ID
AND title LIKE '%Template%'
AND status = 'published'
ORDER BY created_at DESC;
