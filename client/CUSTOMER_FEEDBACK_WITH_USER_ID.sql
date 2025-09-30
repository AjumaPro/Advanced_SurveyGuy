-- CUSTOMER FEEDBACK SURVEY WITH MANUAL USER ID
-- First, get your user ID, then run the insert statements

-- Step 1: Find your user ID
SELECT 
    id as user_id,
    email,
    'Copy this user_id and use it in the INSERT statements below' as instruction
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Alternative: Check profiles table
SELECT 
    id as user_id,
    email,
    full_name,
    'Use this user_id in the surveys below' as instruction
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 2: Replace 'YOUR_USER_ID_HERE' with your actual user ID from above
-- Then run these INSERT statements:

-- Comprehensive Customer Feedback Survey
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
    'YOUR_USER_ID_HERE'::UUID, -- Replace with your actual user ID
    'Comprehensive Customer Feedback Survey',
    'Help us improve our products and services by sharing your valuable feedback. This survey takes approximately 5-7 minutes to complete.',
    '[
        {
            "id": "q1",
            "type": "text",
            "question": "What is your name? (Optional)",
            "required": false,
            "placeholder": "Enter your full name"
        },
        {
            "id": "q2",
            "type": "email",
            "question": "What is your email address?",
            "required": true,
            "placeholder": "your.email@example.com"
        },
        {
            "id": "q3",
            "type": "multiple-choice",
            "question": "How did you first hear about our company?",
            "required": false,
            "options": [
                "Search engine (Google, Bing, etc.)",
                "Social media (Facebook, Twitter, LinkedIn)",
                "Referral from friend/colleague",
                "Online advertisement",
                "Industry publication/blog",
                "Trade show/conference",
                "Direct mail/email campaign",
                "Other"
            ]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How would you rate your overall experience with our company?",
            "required": true,
            "scale": 5,
            "labels": ["Terrible", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q5",
            "type": "multiple-choice",
            "question": "Please rate our product/service quality:",
            "required": true,
            "options": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How likely are you to recommend our company to a friend or colleague?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely"
        },
        {
            "id": "q7",
            "type": "multiple-choice",
            "question": "How often do you use our product/service?",
            "required": true,
            "options": [
                "Daily",
                "Several times a week",
                "Weekly",
                "Monthly", 
                "Several times a year",
                "This is my first time",
                "I no longer use it"
            ]
        },
        {
            "id": "q8",
            "type": "multiple-choice",
            "question": "What do you value most about our company?",
            "required": false,
            "options": [
                "High-quality products/services",
                "Competitive pricing",
                "Excellent customer service",
                "Fast delivery/response time",
                "Innovation and new features",
                "Reliability and consistency",
                "User-friendly experience",
                "Strong company reputation"
            ]
        },
        {
            "id": "q9",
            "type": "multiple-choice",
            "question": "What challenges have you experienced?",
            "required": false,
            "options": [
                "Difficult to use/understand",
                "Too expensive",
                "Poor customer service",
                "Slow delivery/response",
                "Technical issues/bugs",
                "Missing features I need",
                "Poor communication",
                "No challenges experienced",
                "Other"
            ]
        },
        {
            "id": "q10",
            "type": "text",
            "question": "What is the ONE thing we could do to improve your experience?",
            "required": false,
            "placeholder": "Your most important suggestion..."
        },
        {
            "id": "q11",
            "type": "text",
            "question": "Any additional comments or feedback?",
            "required": false,
            "placeholder": "Share any other thoughts..."
        },
        {
            "id": "q12",
            "type": "boolean",
            "question": "Would you be interested in participating in future product research?",
            "required": false,
            "trueLabel": "Yes, I am interested",
            "falseLabel": "No, thank you"
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your valuable feedback!",
        "estimatedTime": "5-7 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Quick Customer Feedback Survey
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
    'YOUR_USER_ID_HERE'::UUID, -- Replace with your actual user ID
    'Quick Customer Feedback Survey',
    'A brief 3-minute survey to help us improve our service.',
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
            "question": "What is the main reason for your rating?",
            "required": false,
            "options": [
                "Excellent product quality",
                "Great customer service",
                "Good value for money",
                "Easy to use",
                "Fast delivery/service",
                "Met my expectations",
                "Product issues/problems",
                "Poor customer service",
                "Too expensive",
                "Difficult to use"
            ]
        },
        {
            "id": "q4",
            "type": "text",
            "question": "What is the ONE thing we could do better?",
            "required": false,
            "placeholder": "Your most important suggestion..."
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
        "oneQuestionPerPage": true,
        "allowBack": true,
        "thankYouMessage": "Thank you! Your feedback helps us improve.",
        "estimatedTime": "2-3 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Customer Service Experience Survey
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
    'YOUR_USER_ID_HERE'::UUID, -- Replace with your actual user ID
    'Customer Service Experience Survey',
    'Help us improve our customer service by sharing your recent support experience.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "How did you contact our customer service?",
            "required": true,
            "options": [
                "Phone call",
                "Email",
                "Live chat",
                "Contact form on website",
                "Social media",
                "In-person"
            ]
        },
        {
            "id": "q2",
            "type": "multiple-choice",
            "question": "What was the main reason for contacting us?",
            "required": true,
            "options": [
                "Product/service question",
                "Technical support",
                "Billing/payment issue",
                "Order status inquiry",
                "Complaint/problem",
                "Return/refund request",
                "General information"
            ]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "How easy was it to reach our customer service?",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How would you rate our customer service representative?",
            "required": true,
            "scale": 5,
            "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q5",
            "type": "rating",
            "question": "How well was your issue resolved?",
            "required": true,
            "scale": 5,
            "labels": ["Not Resolved", "Partially Resolved", "Adequately Resolved", "Well Resolved", "Completely Resolved"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How satisfied were you with the overall experience?",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q7",
            "type": "rating",
            "question": "How likely are you to recommend our customer service?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely"
        },
        {
            "id": "q8",
            "type": "text",
            "question": "What did our customer service team do well?",
            "required": false,
            "placeholder": "Tell us what we did right..."
        },
        {
            "id": "q9",
            "type": "text",
            "question": "How could we improve our customer service?",
            "required": false,
            "placeholder": "Your suggestions for improvement..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for helping us improve our customer service!",
        "estimatedTime": "3-4 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Website Experience Survey
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
    'YOUR_USER_ID_HERE'::UUID, -- Replace with your actual user ID
    'Website Experience Survey',
    'Help us improve your online experience by sharing feedback about our website.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "What was the primary purpose of your visit?",
            "required": true,
            "options": [
                "Browse products/services",
                "Make a purchase",
                "Get customer support",
                "Find contact information",
                "Read blog/resources",
                "Compare pricing"
            ]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How easy was it to find what you were looking for?",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "How would you rate our website design?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How would you rate our website loading speed?",
            "required": true,
            "scale": 5,
            "labels": ["Very Slow", "Slow", "Average", "Fast", "Very Fast"]
        },
        {
            "id": "q5",
            "type": "boolean",
            "question": "Did you successfully complete what you came to do?",
            "required": true,
            "trueLabel": "Yes, I completed my task",
            "falseLabel": "No, I could not complete my task"
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How likely are you to visit our website again?",
            "required": false,
            "scale": 5,
            "labels": ["Very Unlikely", "Unlikely", "Neutral", "Likely", "Very Likely"]
        },
        {
            "id": "q7",
            "type": "text",
            "question": "What would improve your website experience?",
            "required": false,
            "placeholder": "Suggestions for improvements..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": true,
        "allowBack": true,
        "thankYouMessage": "Thank you for helping us improve our website!",
        "estimatedTime": "2-3 minutes"
    }'::JSONB,
    'published',
    NOW(),
    NOW(),
    NOW()
);

-- Instructions for completion
SELECT 
    'INSTRUCTIONS:' as step,
    '1. Run the SELECT statements above to find your user_id' as instruction_1,
    '2. Copy your user_id from the results' as instruction_2,
    '3. Replace YOUR_USER_ID_HERE with your actual user_id in each INSERT' as instruction_3,
    '4. Run the INSERT statements to create your surveys' as instruction_4;
