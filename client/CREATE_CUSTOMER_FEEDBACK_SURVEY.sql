-- CREATE COMPREHENSIVE CUSTOMER FEEDBACK SURVEY
-- Run this in Supabase SQL Editor to create a professional customer feedback survey

-- Insert the complete Customer Feedback Survey
INSERT INTO surveys (
    id,
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_active,
    template_category,
    created_at,
    updated_at,
    published_at
) VALUES (
    gen_random_uuid(),
    auth.uid(), -- Your user ID
    'Comprehensive Customer Feedback Survey',
    'Help us improve our products and services by sharing your valuable feedback. This survey takes approximately 5-7 minutes to complete.',
    '[
        {
            "id": "q1",
            "type": "text",
            "question": "What is your name? (Optional)",
            "required": false,
            "placeholder": "Enter your full name",
            "description": "This helps us personalize our follow-up communication"
        },
        {
            "id": "q2",
            "type": "email",
            "question": "What is your email address?",
            "required": true,
            "placeholder": "your.email@example.com",
            "description": "We''ll use this to send you updates and follow up on your feedback"
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
            ],
            "description": "This helps us understand our most effective marketing channels"
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How would you rate your overall experience with our company?",
            "required": true,
            "scale": 5,
            "labels": ["Terrible", "Poor", "Average", "Good", "Excellent"],
            "description": "Consider all aspects of your interaction with us"
        },
        {
            "id": "q5",
            "type": "matrix",
            "question": "Please rate the following aspects of our service:",
            "required": true,
            "rows": [
                "Product/Service Quality",
                "Customer Service",
                "Value for Money",
                "Delivery/Timeliness",
                "Communication",
                "Problem Resolution"
            ],
            "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"],
            "description": "Rate each aspect based on your recent experience"
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How likely are you to recommend our company to a friend or colleague?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely (Net Promoter Score)"
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
            ],
            "description": "Understanding usage frequency helps us improve our offerings"
        },
        {
            "id": "q8",
            "type": "checkbox",
            "question": "What do you value most about our company? (Select all that apply)",
            "required": false,
            "options": [
                "High-quality products/services",
                "Competitive pricing",
                "Excellent customer service",
                "Fast delivery/response time",
                "Innovation and new features",
                "Reliability and consistency",
                "User-friendly experience",
                "Strong company reputation",
                "Personal relationship with staff",
                "Other"
            ],
            "description": "Help us understand what matters most to our customers"
        },
        {
            "id": "q9",
            "type": "checkbox",
            "question": "What challenges, if any, have you experienced with our product/service? (Select all that apply)",
            "required": false,
            "options": [
                "Difficult to use/understand",
                "Too expensive",
                "Poor customer service",
                "Slow delivery/response",
                "Technical issues/bugs",
                "Missing features I need",
                "Poor communication",
                "Billing/payment issues",
                "No challenges experienced",
                "Other"
            ],
            "description": "Identifying pain points helps us prioritize improvements"
        },
        {
            "id": "q10",
            "type": "ranking",
            "question": "Please rank these improvement areas by priority (most important first):",
            "required": false,
            "options": [
                "Product Quality Enhancement",
                "Customer Service Improvement", 
                "Pricing Optimization",
                "Faster Delivery/Response",
                "Better Communication",
                "More Product Features",
                "Easier User Experience",
                "Better Documentation/Support"
            ],
            "description": "Your priorities help us focus our improvement efforts"
        },
        {
            "id": "q11",
            "type": "multiple-choice",
            "question": "Compared to our competitors, how would you rate our company?",
            "required": false,
            "options": [
                "Much better than competitors",
                "Better than competitors", 
                "About the same as competitors",
                "Worse than competitors",
                "Much worse than competitors",
                "I haven''t used competitors",
                "I don''t know of any competitors"
            ],
            "description": "Competitive positioning helps us understand our market position"
        },
        {
            "id": "q12",
            "type": "slider",
            "question": "On a scale of 0-100, how satisfied are you with our customer support?",
            "required": false,
            "min": 0,
            "max": 100,
            "step": 5,
            "default": 50,
            "labels": {
                "0": "Extremely Dissatisfied",
                "25": "Dissatisfied", 
                "50": "Neutral",
                "75": "Satisfied",
                "100": "Extremely Satisfied"
            },
            "description": "Rate your support experience if you''ve contacted us"
        },
        {
            "id": "q13",
            "type": "multiple-choice",
            "question": "How likely are you to purchase from us again?",
            "required": false,
            "options": [
                "Definitely will purchase again",
                "Probably will purchase again",
                "Might or might not purchase again",
                "Probably will not purchase again", 
                "Definitely will not purchase again",
                "Not applicable/One-time purchase"
            ],
            "description": "Future purchase intent helps us predict customer retention"
        },
        {
            "id": "q14",
            "type": "textarea",
            "question": "What is the ONE thing we could do to improve your experience?",
            "required": false,
            "placeholder": "Please share your most important suggestion for improvement...",
            "maxLength": 500,
            "description": "Your top improvement suggestion helps us prioritize changes"
        },
        {
            "id": "q15",
            "type": "textarea",
            "question": "Is there anything else you would like us to know?",
            "required": false,
            "placeholder": "Any additional comments, suggestions, or feedback...",
            "maxLength": 1000,
            "description": "Share any other thoughts or feedback you have"
        },
        {
            "id": "q16",
            "type": "boolean",
            "question": "Would you be interested in participating in future product research or beta testing?",
            "required": false,
            "trueLabel": "Yes, I''m interested",
            "falseLabel": "No, thank you",
            "description": "Help us improve by participating in product development"
        },
        {
            "id": "q17",
            "type": "multiple-choice",
            "question": "What is your primary role/industry?",
            "required": false,
            "options": [
                "Business Owner/Executive",
                "Manager/Supervisor",
                "Individual Contributor/Employee",
                "Consultant/Freelancer",
                "Student",
                "Retired",
                "Technology/IT",
                "Healthcare",
                "Education",
                "Finance/Banking",
                "Retail/Sales",
                "Manufacturing",
                "Government/Non-profit",
                "Other"
            ],
            "description": "Understanding your background helps us tailor our services"
        },
        {
            "id": "q18",
            "type": "multiple-choice",
            "question": "What is the size of your organization?",
            "required": false,
            "options": [
                "Just me (sole proprietor)",
                "2-10 employees",
                "11-50 employees", 
                "51-200 employees",
                "201-1000 employees",
                "1000+ employees",
                "Not applicable"
            ],
            "description": "Organization size helps us understand your needs and scale"
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "randomizeQuestions": false,
        "collectIP": false,
        "requireCompletion": false,
        "thankYouMessage": "Thank you for your valuable feedback! Your responses help us continuously improve our products and services.",
        "redirectUrl": null,
        "estimatedTime": "5-7 minutes",
        "theme": {
            "primaryColor": "#3B82F6",
            "backgroundColor": "#F8FAFC",
            "textColor": "#1F2937"
        }
    }'::JSONB,
    'published',
    true,
    'customer-feedback',
    NOW(),
    NOW(),
    NOW()
);

-- Create a shorter version for quick feedback
INSERT INTO surveys (
    id,
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_active,
    template_category,
    created_at,
    updated_at,
    published_at
) VALUES (
    gen_random_uuid(),
    auth.uid(),
    'Quick Customer Feedback Survey',
    'A brief 3-minute survey to help us improve our service. Your feedback is valuable to us!',
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
                "Difficult to use",
                "Other"
            ]
        },
        {
            "id": "q4",
            "type": "text",
            "question": "What is the ONE thing we could do better?",
            "required": false,
            "placeholder": "Your most important suggestion...",
            "maxLength": 200
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
    true,
    'customer-feedback',
    NOW(),
    NOW(),
    NOW()
);

-- Create a post-purchase feedback survey
INSERT INTO surveys (
    id,
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_active,
    template_category,
    created_at,
    updated_at,
    published_at
) VALUES (
    gen_random_uuid(),
    auth.uid(),
    'Post-Purchase Feedback Survey',
    'We value your opinion! Please take a few minutes to tell us about your recent purchase experience.',
    '[
        {
            "id": "q1",
            "type": "text",
            "question": "Order number or reference (if available)",
            "required": false,
            "placeholder": "e.g., ORD-12345"
        },
        {
            "id": "q2",
            "type": "multiple-choice",
            "question": "How did you make your purchase?",
            "required": true,
            "options": [
                "Website",
                "Mobile app",
                "Phone call",
                "In-store",
                "Email",
                "Other"
            ]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "How easy was it to find what you were looking for?",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How would you rate the checkout/purchase process?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q5",
            "type": "rating",
            "question": "How satisfied are you with the product/service you received?",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How would you rate the value for money?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor Value", "Poor Value", "Fair Value", "Good Value", "Excellent Value"]
        },
        {
            "id": "q7",
            "type": "multiple-choice",
            "question": "How was the delivery/service timing?",
            "required": false,
            "options": [
                "Much faster than expected",
                "Faster than expected",
                "As expected",
                "Slower than expected",
                "Much slower than expected",
                "Not applicable"
            ]
        },
        {
            "id": "q8",
            "type": "rating",
            "question": "How likely are you to recommend us to friends or colleagues?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely"
        },
        {
            "id": "q9",
            "type": "multiple-choice",
            "question": "How likely are you to purchase from us again?",
            "required": false,
            "options": [
                "Definitely will",
                "Probably will",
                "Might or might not",
                "Probably will not",
                "Definitely will not"
            ]
        },
        {
            "id": "q10",
            "type": "textarea",
            "question": "What did you like most about your experience?",
            "required": false,
            "placeholder": "Tell us what we did well...",
            "maxLength": 500
        },
        {
            "id": "q11",
            "type": "textarea",
            "question": "What could we have done better?",
            "required": false,
            "placeholder": "Your suggestions help us improve...",
            "maxLength": 500
        },
        {
            "id": "q12",
            "type": "boolean",
            "question": "May we contact you about your feedback?",
            "required": false,
            "trueLabel": "Yes, you may contact me",
            "falseLabel": "No, please do not contact me"
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your purchase and feedback! We truly appreciate your business.",
        "estimatedTime": "4-5 minutes"
    }'::JSONB,
    'published',
    true,
    'customer-feedback',
    NOW(),
    NOW(),
    NOW()
);

-- Create a customer service feedback survey
INSERT INTO surveys (
    id,
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_active,
    template_category,
    created_at,
    updated_at,
    published_at
) VALUES (
    gen_random_uuid(),
    auth.uid(),
    'Customer Service Experience Survey',
    'Help us improve our customer service by sharing your recent support experience with us.',
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
                "In-person",
                "Other"
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
                "General information",
                "Other"
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
            "type": "multiple-choice",
            "question": "How long did you wait before speaking with someone?",
            "required": false,
            "options": [
                "No wait time",
                "Less than 2 minutes",
                "2-5 minutes",
                "5-10 minutes",
                "10-20 minutes",
                "More than 20 minutes",
                "I gave up waiting"
            ]
        },
        {
            "id": "q5",
            "type": "matrix",
            "question": "Please rate our customer service representative on:",
            "required": true,
            "rows": [
                "Friendliness and courtesy",
                "Knowledge and expertise", 
                "Listening and understanding",
                "Problem-solving ability",
                "Communication clarity"
            ],
            "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How well was your issue resolved?",
            "required": true,
            "scale": 5,
            "labels": ["Not Resolved", "Partially Resolved", "Adequately Resolved", "Well Resolved", "Completely Resolved"]
        },
        {
            "id": "q7",
            "type": "rating",
            "question": "How satisfied were you with the overall customer service experience?",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q8",
            "type": "rating",
            "question": "How likely are you to recommend our customer service to others?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely"
        },
        {
            "id": "q9",
            "type": "textarea",
            "question": "What did our customer service team do well?",
            "required": false,
            "placeholder": "Tell us what we did right...",
            "maxLength": 400
        },
        {
            "id": "q10",
            "type": "textarea",
            "question": "How could we improve our customer service?",
            "required": false,
            "placeholder": "Your suggestions for improvement...",
            "maxLength": 400
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
    true,
    'customer-feedback',
    NOW(),
    NOW(),
    NOW()
);

-- Create a website/digital experience feedback survey
INSERT INTO surveys (
    id,
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_active,
    template_category,
    created_at,
    updated_at,
    published_at
) VALUES (
    gen_random_uuid(),
    auth.uid(),
    'Website & Digital Experience Survey',
    'Help us improve your online experience by sharing feedback about our website and digital services.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "What was the primary purpose of your visit to our website?",
            "required": true,
            "options": [
                "Browse products/services",
                "Make a purchase",
                "Get customer support",
                "Find contact information",
                "Read blog/resources",
                "Compare pricing",
                "Download resources",
                "Other"
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
            "question": "How would you rate the overall design and layout of our website?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q4",
            "type": "matrix",
            "question": "Rate our website on the following aspects:",
            "required": true,
            "rows": [
                "Loading speed",
                "Navigation ease",
                "Visual design",
                "Content quality",
                "Mobile experience"
            ],
            "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
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
            "type": "checkbox",
            "question": "What prevented you from completing your task? (Select all that apply)",
            "required": false,
            "options": [
                "Could not find what I was looking for",
                "Website was too slow",
                "Navigation was confusing",
                "Technical errors/bugs",
                "Information was unclear",
                "Process was too complicated",
                "Required information I did not have",
                "Nothing prevented me - I completed my task"
            ],
            "conditionalOn": "q5",
            "showWhen": "false"
        },
        {
            "id": "q7",
            "type": "rating",
            "question": "How likely are you to visit our website again?",
            "required": false,
            "scale": 5,
            "labels": ["Very Unlikely", "Unlikely", "Neutral", "Likely", "Very Likely"]
        },
        {
            "id": "q8",
            "type": "textarea",
            "question": "What would improve your experience on our website?",
            "required": false,
            "placeholder": "Suggestions for website improvements...",
            "maxLength": 300
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
    true,
    'customer-feedback',
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
    'Customer Feedback Surveys Created Successfully!' as message
FROM surveys 
WHERE template_category = 'customer-feedback' 
AND user_id = auth.uid()
ORDER BY created_at DESC;
