-- CREATE COMPREHENSIVE SURVEY TEMPLATES
-- Run this in Supabase SQL Editor to create professional survey templates

-- First, ensure we have the correct table structure for templates
-- Templates are surveys with is_template = true

-- =============================================
-- CUSTOMER FEEDBACK TEMPLATES (5 Templates)
-- =============================================

-- Template 1: Basic Customer Satisfaction
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1), -- Use first available user as template owner
    'Basic Customer Satisfaction Survey',
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
            "options": [
                "Product quality",
                "Customer service",
                "Value for money",
                "Ease of use",
                "Fast delivery",
                "Professional staff",
                "Other"
            ]
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
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Template 2: Comprehensive Customer Experience
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Comprehensive Customer Experience Survey',
    'A detailed survey to understand all aspects of the customer journey and experience.',
    '[
        {
            "id": "q1",
            "type": "text",
            "question": "Name (Optional)",
            "required": false,
            "placeholder": "Your name"
        },
        {
            "id": "q2",
            "type": "email",
            "question": "Email Address",
            "required": true,
            "placeholder": "your.email@example.com"
        },
        {
            "id": "q3",
            "type": "multiple-choice",
            "question": "How did you discover our company?",
            "required": false,
            "options": [
                "Google search",
                "Social media",
                "Friend recommendation",
                "Online ad",
                "Blog/article",
                "Event/conference",
                "Email campaign",
                "Other"
            ]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "Overall experience rating",
            "required": true,
            "scale": 5,
            "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q5",
            "type": "multiple-choice",
            "question": "Rate our product quality",
            "required": true,
            "options": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q6",
            "type": "multiple-choice",
            "question": "Rate our customer service",
            "required": true,
            "options": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q7",
            "type": "multiple-choice",
            "question": "Rate our value for money",
            "required": true,
            "options": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q8",
            "type": "rating",
            "question": "Likelihood to recommend (NPS)",
            "required": true,
            "scale": 10,
            "description": "0 = Not likely, 10 = Extremely likely"
        },
        {
            "id": "q9",
            "type": "multiple-choice",
            "question": "How often do you use our service?",
            "required": false,
            "options": ["Daily", "Weekly", "Monthly", "Rarely", "First time"]
        },
        {
            "id": "q10",
            "type": "text",
            "question": "What should we improve?",
            "required": false,
            "placeholder": "Your improvement suggestions..."
        },
        {
            "id": "q11",
            "type": "text",
            "question": "Additional comments",
            "required": false,
            "placeholder": "Any other feedback..."
        },
        {
            "id": "q12",
            "type": "boolean",
            "question": "May we contact you about this feedback?",
            "required": false,
            "trueLabel": "Yes",
            "falseLabel": "No"
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your detailed feedback!",
        "estimatedTime": "5-6 minutes"
    }'::JSONB,
    'published',
    true,
    true,
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
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Post-Purchase Feedback Template',
    'Collect feedback immediately after a customer makes a purchase to understand their buying experience.',
    '[
        {
            "id": "q1",
            "type": "text",
            "question": "Order number (if available)",
            "required": false,
            "placeholder": "e.g., ORD-12345"
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How easy was it to find what you wanted?",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "How was the checkout process?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "Product/service satisfaction",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q5",
            "type": "rating",
            "question": "Value for money rating",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Fair", "Good", "Excellent"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "Likelihood to recommend",
            "required": true,
            "scale": 10,
            "description": "0 = Not likely, 10 = Extremely likely"
        },
        {
            "id": "q7",
            "type": "multiple-choice",
            "question": "Will you purchase from us again?",
            "required": false,
            "options": ["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"]
        },
        {
            "id": "q8",
            "type": "text",
            "question": "What did we do well?",
            "required": false,
            "placeholder": "Tell us what you liked..."
        },
        {
            "id": "q9",
            "type": "text",
            "question": "What could we improve?",
            "required": false,
            "placeholder": "Your improvement suggestions..."
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
    true,
    true,
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
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Customer Service Feedback Template',
    'Evaluate customer service interactions to improve support quality and customer satisfaction.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "How did you contact us?",
            "required": true,
            "options": ["Phone", "Email", "Live chat", "Website form", "Social media", "In-person"]
        },
        {
            "id": "q2",
            "type": "multiple-choice",
            "question": "Reason for contacting us?",
            "required": true,
            "options": ["Product question", "Technical issue", "Billing question", "Order inquiry", "Complaint", "Return/refund", "General info"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "Ease of reaching support",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "Quality of service received",
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
            "labels": ["Not resolved", "Partially resolved", "Adequately resolved", "Well resolved", "Completely resolved"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "Overall support satisfaction",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q7",
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
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Template 5: Website Experience Feedback
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Website Experience Feedback Template',
    'Gather feedback about website usability, design, and user experience to optimize digital presence.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "What brought you to our website?",
            "required": true,
            "options": ["Browse products", "Make purchase", "Get support", "Find contact info", "Read content", "Compare prices"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How easy was it to find what you needed?",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "Website design and layout rating",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "Website loading speed",
            "required": true,
            "scale": 5,
            "labels": ["Very Slow", "Slow", "Average", "Fast", "Very Fast"]
        },
        {
            "id": "q5",
            "type": "boolean",
            "question": "Did you complete what you came to do?",
            "required": true,
            "trueLabel": "Yes, completed successfully",
            "falseLabel": "No, could not complete"
        },
        {
            "id": "q6",
            "type": "text",
            "question": "How can we improve our website?",
            "required": false,
            "placeholder": "Your suggestions for improvement..."
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
    true,
    NOW(),
    NOW(),
    NOW()
);

-- =============================================
-- EMPLOYEE SURVEY TEMPLATES (3 Templates)
-- =============================================

-- Template 6: Employee Satisfaction Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Employee Satisfaction Survey Template',
    'Measure employee satisfaction, engagement, and identify areas for workplace improvement.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How satisfied are you with your current role?",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How would you rate your work-life balance?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Fair", "Good", "Excellent"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "How effective is your direct manager?",
            "required": false,
            "scale": 5,
            "labels": ["Very Ineffective", "Ineffective", "Neutral", "Effective", "Very Effective"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "How satisfied are you with career development opportunities?",
            "required": false,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q5",
            "type": "rating",
            "question": "How would you rate our company culture?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How likely are you to recommend this company as a great place to work?",
            "required": true,
            "scale": 10,
            "description": "0 = Not likely, 10 = Extremely likely"
        },
        {
            "id": "q7",
            "type": "text",
            "question": "What do you like most about working here?",
            "required": false,
            "placeholder": "What we do well..."
        },
        {
            "id": "q8",
            "type": "text",
            "question": "What should we improve?",
            "required": false,
            "placeholder": "Areas for improvement..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": false,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your feedback! Your input helps us create a better workplace.",
        "estimatedTime": "4-5 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- =============================================
-- EVENT FEEDBACK TEMPLATES (2 Templates)
-- =============================================

-- Template 7: Event Feedback Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Event Feedback Survey Template',
    'Collect attendee feedback to improve future events and measure event success.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "Overall event rating",
            "required": true,
            "scale": 5,
            "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "Content quality rating",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "Speaker effectiveness",
            "required": false,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q4",
            "type": "rating",
            "question": "Venue and logistics",
            "required": false,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q5",
            "type": "multiple-choice",
            "question": "Would you attend similar events?",
            "required": false,
            "options": ["Definitely yes", "Probably yes", "Maybe", "Probably no", "Definitely no"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "Likelihood to recommend this event",
            "required": true,
            "scale": 10,
            "description": "0 = Not likely, 10 = Extremely likely"
        },
        {
            "id": "q7",
            "type": "text",
            "question": "What was the most valuable part?",
            "required": false,
            "placeholder": "What you found most useful..."
        },
        {
            "id": "q8",
            "type": "text",
            "question": "Suggestions for future events",
            "required": false,
            "placeholder": "Ideas for improvement..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for attending and providing feedback!",
        "estimatedTime": "3-4 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- =============================================
-- PRODUCT RESEARCH TEMPLATES (2 Templates)
-- =============================================

-- Template 8: Product Feature Feedback
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Product Feature Feedback Template',
    'Understand how customers use your product features and what improvements they want.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "How often do you use our product?",
            "required": true,
            "options": ["Daily", "Weekly", "Monthly", "Rarely", "First time user"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "Overall product satisfaction",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "Ease of use rating",
            "required": true,
            "scale": 5,
            "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]
        },
        {
            "id": "q4",
            "type": "multiple-choice",
            "question": "Which feature do you use most?",
            "required": false,
            "options": ["Dashboard", "Reports", "Settings", "Integrations", "Mobile app", "API", "Other"]
        },
        {
            "id": "q5",
            "type": "multiple-choice",
            "question": "What feature would you like to see added?",
            "required": false,
            "options": ["Advanced analytics", "Better mobile app", "More integrations", "Automation tools", "Custom branding", "API improvements", "Other"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "How does our product compare to competitors?",
            "required": false,
            "scale": 5,
            "labels": ["Much worse", "Worse", "Same", "Better", "Much better"]
        },
        {
            "id": "q7",
            "type": "text",
            "question": "What is your biggest challenge with our product?",
            "required": false,
            "placeholder": "Describe your main challenge..."
        },
        {
            "id": "q8",
            "type": "text",
            "question": "What do you love most about our product?",
            "required": false,
            "placeholder": "What works best for you..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you! Your feedback helps us build better products.",
        "estimatedTime": "4-5 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- =============================================
-- EDUCATION TEMPLATES (2 Templates)
-- =============================================

-- Template 9: Course Evaluation
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Course Evaluation Template',
    'Evaluate course effectiveness, instructor performance, and gather suggestions for improvement.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "Overall course rating",
            "required": true,
            "scale": 5,
            "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How effective was the instructor?",
            "required": true,
            "scale": 5,
            "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]
        },
        {
            "id": "q3",
            "type": "rating",
            "question": "How relevant was the course content?",
            "required": true,
            "scale": 5,
            "labels": ["Not Relevant", "Slightly Relevant", "Moderately Relevant", "Very Relevant", "Extremely Relevant"]
        },
        {
            "id": "q4",
            "type": "multiple-choice",
            "question": "Course difficulty level",
            "required": false,
            "options": ["Too easy", "Slightly easy", "Just right", "Slightly difficult", "Too difficult"]
        },
        {
            "id": "q5",
            "type": "multiple-choice",
            "question": "Most valuable aspect of the course",
            "required": false,
            "options": ["Course content", "Instructor", "Materials", "Assignments", "Discussions", "Practical exercises"]
        },
        {
            "id": "q6",
            "type": "rating",
            "question": "Would you recommend this course?",
            "required": true,
            "scale": 10,
            "description": "0 = Not likely, 10 = Extremely likely"
        },
        {
            "id": "q7",
            "type": "text",
            "question": "Suggestions for improving this course",
            "required": false,
            "placeholder": "How can we make this course better..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": false,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your course evaluation!",
        "estimatedTime": "3-4 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- =============================================
-- GENERAL TEMPLATES (3 Templates)
-- =============================================

-- Template 10: Quick Poll Template
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Quick Poll Template',
    'A simple 3-question poll template for quick feedback collection.',
    '[
        {
            "id": "q1",
            "type": "boolean",
            "question": "Do you support this proposal?",
            "required": true,
            "trueLabel": "Yes, I support it",
            "falseLabel": "No, I do not support it"
        },
        {
            "id": "q2",
            "type": "multiple-choice",
            "question": "What is your main reason?",
            "required": false,
            "options": ["Benefits outweigh costs", "Good for the community", "Necessary change", "Concerns about implementation", "Too expensive", "Not needed", "Other"]
        },
        {
            "id": "q3",
            "type": "text",
            "question": "Additional comments",
            "required": false,
            "placeholder": "Share your thoughts..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": true,
        "allowBack": true,
        "thankYouMessage": "Thank you for participating in our poll!",
        "estimatedTime": "1-2 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Template 11: Contact Information Template
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Contact Information Collection Template',
    'Collect comprehensive contact information and preferences from customers or leads.',
    '[
        {
            "id": "q1",
            "type": "text",
            "question": "Full Name",
            "required": true,
            "placeholder": "First and Last Name"
        },
        {
            "id": "q2",
            "type": "email",
            "question": "Email Address",
            "required": true,
            "placeholder": "your.email@example.com"
        },
        {
            "id": "q3",
            "type": "text",
            "question": "Phone Number",
            "required": false,
            "placeholder": "+1 (555) 123-4567"
        },
        {
            "id": "q4",
            "type": "text",
            "question": "Company/Organization",
            "required": false,
            "placeholder": "Company name"
        },
        {
            "id": "q5",
            "type": "text",
            "question": "Job Title",
            "required": false,
            "placeholder": "Your role"
        },
        {
            "id": "q6",
            "type": "multiple-choice",
            "question": "Preferred contact method",
            "required": false,
            "options": ["Email", "Phone", "Text message", "No contact preference"]
        },
        {
            "id": "q7",
            "type": "boolean",
            "question": "Subscribe to our newsletter?",
            "required": false,
            "trueLabel": "Yes, subscribe me",
            "falseLabel": "No, thank you"
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you! We have saved your information.",
        "estimatedTime": "2-3 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Template 12: Market Research Template
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Market Research Survey Template',
    'Understand market preferences, buying behavior, and customer needs for product development.',
    '[
        {
            "id": "q1",
            "type": "multiple-choice",
            "question": "What is your age range?",
            "required": false,
            "options": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
        },
        {
            "id": "q2",
            "type": "multiple-choice",
            "question": "What is your annual household income?",
            "required": false,
            "options": ["Under $25,000", "$25,000-$49,999", "$50,000-$74,999", "$75,000-$99,999", "$100,000-$149,999", "$150,000+", "Prefer not to say"]
        },
        {
            "id": "q3",
            "type": "multiple-choice",
            "question": "How often do you purchase products in this category?",
            "required": true,
            "options": ["Weekly", "Monthly", "Every few months", "Annually", "Rarely", "Never"]
        },
        {
            "id": "q4",
            "type": "multiple-choice",
            "question": "What factors most influence your purchasing decisions?",
            "required": true,
            "options": ["Price", "Quality", "Brand reputation", "Reviews/recommendations", "Features", "Customer service", "Convenience"]
        },
        {
            "id": "q5",
            "type": "rating",
            "question": "How important is environmental sustainability in your purchasing decisions?",
            "required": false,
            "scale": 5,
            "labels": ["Not Important", "Slightly Important", "Moderately Important", "Very Important", "Extremely Important"]
        },
        {
            "id": "q6",
            "type": "multiple-choice",
            "question": "Where do you typically research products before buying?",
            "required": false,
            "options": ["Company websites", "Review sites", "Social media", "Friends/family", "Industry publications", "Comparison sites", "In-store"]
        },
        {
            "id": "q7",
            "type": "text",
            "question": "What product features are you looking for?",
            "required": false,
            "placeholder": "Describe your ideal product features..."
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for participating in our market research!",
        "estimatedTime": "4-5 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
);

-- Verify templates were created
SELECT 
    id,
    title,
    JSON_ARRAY_LENGTH(questions) as question_count,
    is_template,
    is_public,
    status,
    'Template created successfully!' as message
FROM surveys 
WHERE is_template = true 
ORDER BY created_at DESC;

-- Summary of templates created
SELECT 
    COUNT(*) as total_templates,
    COUNT(CASE WHEN title LIKE '%Customer%' THEN 1 END) as customer_feedback_templates,
    COUNT(CASE WHEN title LIKE '%Employee%' THEN 1 END) as employee_templates,
    COUNT(CASE WHEN title LIKE '%Event%' THEN 1 END) as event_templates,
    COUNT(CASE WHEN title LIKE '%Product%' THEN 1 END) as product_templates,
    'Survey Templates Created Successfully!' as status
FROM surveys 
WHERE is_template = true;
