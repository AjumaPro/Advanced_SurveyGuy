-- =============================================
-- PROFESSIONAL SURVEY & EVENT TEMPLATES
-- Advanced SurveyGuy Template Library
-- =============================================

-- This script creates comprehensive professional templates for both surveys and events
-- Templates are organized by industry, use case, and complexity level

-- =============================================
-- SURVEY TEMPLATES - BUSINESS & PROFESSIONAL
-- =============================================

-- 1. CUSTOMER SATISFACTION & EXPERIENCE TEMPLATES

-- Basic Customer Satisfaction Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    template_category,
    template_industry,
    estimated_time,
    target_audience,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Customer Satisfaction Survey',
    'Professional customer satisfaction survey to measure overall experience and identify improvement opportunities.',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How satisfied are you with our product/service overall?",
            "required": true,
            "scale": 5,
            "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
        },
        {
            "id": "q2",
            "type": "rating",
            "question": "How likely are you to recommend us to a friend or colleague?",
            "required": true,
            "scale": 10,
            "description": "0 = Not at all likely, 10 = Extremely likely (NPS Score)"
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
            "type": "multiple-choice",
            "question": "How did you hear about us?",
            "required": false,
            "options": ["Google search", "Social media", "Friend recommendation", "Advertisement", "Blog/article", "Event", "Other"]
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your feedback! We appreciate your time and will use your input to improve our services.",
        "estimatedTime": "2-3 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    'customer-feedback',
    'general',
    '2-3 minutes',
    'All customers and clients',
    NOW(),
    NOW(),
    NOW()
);

-- Comprehensive Customer Experience Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    template_category,
    template_industry,
    estimated_time,
    target_audience,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Comprehensive Customer Experience Survey',
    'Detailed survey to understand all aspects of the customer journey and experience.',
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
            "options": ["Google search", "Social media", "Friend recommendation", "Online ad", "Blog/article", "Event/conference", "Email campaign", "Other"]
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
        }
    ]'::JSONB,
    '{
        "allowAnonymous": true,
        "showProgressBar": true,
        "oneQuestionPerPage": false,
        "allowBack": true,
        "thankYouMessage": "Thank you for your detailed feedback! We will use your input to enhance our services.",
        "estimatedTime": "5-6 minutes"
    }'::JSONB,
    'published',
    true,
    true,
    'customer-feedback',
    'general',
    '5-6 minutes',
    'Existing customers and clients',
    NOW(),
    NOW(),
    NOW()
);

-- 2. EMPLOYEE SURVEYS

-- Employee Satisfaction Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    template_category,
    template_industry,
    estimated_time,
    target_audience,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Employee Satisfaction Survey',
    'Comprehensive survey to measure employee satisfaction, engagement, and identify areas for workplace improvement.',
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
    'employee',
    'hr',
    '4-5 minutes',
    'All employees',
    NOW(),
    NOW(),
    NOW()
);

-- 3. EVENT FEEDBACK SURVEYS

-- Event Feedback Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    template_category,
    template_industry,
    estimated_time,
    target_audience,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Event Feedback Survey',
    'Comprehensive post-event evaluation to measure satisfaction, gather feedback, and improve future events.',
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
    'events',
    'general',
    '3-4 minutes',
    'Event attendees',
    NOW(),
    NOW(),
    NOW()
);

-- 4. PRODUCT RESEARCH SURVEYS

-- Product Feature Feedback Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    template_category,
    template_industry,
    estimated_time,
    target_audience,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Product Feature Feedback Survey',
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
    'product-research',
    'technology',
    '4-5 minutes',
    'Product users',
    NOW(),
    NOW(),
    NOW()
);

-- 5. MARKET RESEARCH SURVEYS

-- Market Research Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    template_category,
    template_industry,
    estimated_time,
    target_audience,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Market Research Survey',
    'Comprehensive market research survey to understand customer preferences, buying behavior, and market trends.',
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
    'market-research',
    'general',
    '4-5 minutes',
    'Target market demographics',
    NOW(),
    NOW(),
    NOW()
);

-- 6. EDUCATION & TRAINING SURVEYS

-- Course Evaluation Survey
INSERT INTO surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    status,
    is_template,
    is_public,
    template_category,
    template_industry,
    estimated_time,
    target_audience,
    created_at,
    updated_at,
    published_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Course Evaluation Survey',
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
    'education',
    'education',
    '3-4 minutes',
    'Course participants',
    NOW(),
    NOW(),
    NOW()
);

-- =============================================
-- EVENT TEMPLATES - PROFESSIONAL EVENT MANAGEMENT
-- =============================================

-- 1. BUSINESS CONFERENCE EVENT
INSERT INTO events (
    user_id,
    title,
    description,
    event_type,
    category,
    status,
    is_template,
    is_public,
    capacity,
    price,
    currency,
    location,
    venue,
    start_date,
    end_date,
    registration_fields,
    event_settings,
    features,
    target_audience,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Professional Business Conference',
    'Comprehensive business conference template with speakers, networking, workshops, and professional development sessions.',
    'conference',
    'business',
    'published',
    true,
    true,
    500,
    299.99,
    'USD',
    'Downtown Convention Center',
    'Main Conference Hall',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days' + INTERVAL '8 hours',
    '[
        {"id": "name", "type": "text", "label": "Full Name", "required": true},
        {"id": "email", "type": "email", "label": "Email Address", "required": true},
        {"id": "phone", "type": "text", "label": "Phone Number", "required": false},
        {"id": "company", "type": "text", "label": "Company/Organization", "required": true},
        {"id": "position", "type": "text", "label": "Job Title/Position", "required": true},
        {"id": "dietary", "type": "select", "label": "Dietary Restrictions", "required": false, "options": ["None", "Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher", "Other"]},
        {"id": "attendees", "type": "number", "label": "Number of Attendees", "required": true, "min": 1, "max": 5}
    ]'::JSONB,
    '{
        "allowWaitlist": true,
        "requireApproval": false,
        "sendConfirmation": true,
        "collectPayment": true,
        "earlyBirdDiscount": true,
        "groupDiscounts": true,
        "cancellationPolicy": "Full refund up to 7 days before event"
    }'::JSONB,
    '[
        "Professional keynote speakers",
        "Interactive workshop sessions",
        "Networking breaks and lunch",
        "Conference materials and swag",
        "Certificate of attendance",
        "Mobile app for agenda",
        "Post-event resources"
    ]'::JSONB,
    'Business professionals, executives, entrepreneurs, industry leaders',
    NOW(),
    NOW()
);

-- 2. CORPORATE TEAM BUILDING EVENT
INSERT INTO events (
    user_id,
    title,
    description,
    event_type,
    category,
    status,
    is_template,
    is_public,
    capacity,
    price,
    currency,
    location,
    venue,
    start_date,
    end_date,
    registration_fields,
    event_settings,
    features,
    target_audience,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Corporate Team Building Event',
    'Professional team building event template designed to strengthen team relationships and improve collaboration.',
    'team-building',
    'business',
    'published',
    true,
    true,
    100,
    0.00,
    'USD',
    'Company Headquarters',
    'Conference Center',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '4 hours',
    '[
        {"id": "name", "type": "text", "label": "Full Name", "required": true},
        {"id": "email", "type": "email", "label": "Email Address", "required": true},
        {"id": "phone", "type": "text", "label": "Phone Number", "required": false},
        {"id": "department", "type": "select", "label": "Department", "required": true, "options": ["HR", "Marketing", "Sales", "Engineering", "Finance", "Operations", "Other"]},
        {"id": "attendees", "type": "number", "label": "Number of Attendees", "required": true, "min": 1, "max": 1}
    ]'::JSONB,
    '{
        "allowWaitlist": false,
        "requireApproval": true,
        "sendConfirmation": true,
        "collectPayment": false,
        "earlyBirdDiscount": false,
        "groupDiscounts": false,
        "cancellationPolicy": "Notify HR 24 hours in advance"
    }'::JSONB,
    '[
        "Team building activities",
        "Leadership presentations",
        "Group problem-solving exercises",
        "Refreshments and lunch",
        "Team collaboration tools",
        "Professional facilitator"
    ]'::JSONB,
    'Employees, team members, department staff',
    NOW(),
    NOW()
);

-- 3. EDUCATIONAL WORKSHOP EVENT
INSERT INTO events (
    user_id,
    title,
    description,
    event_type,
    category,
    status,
    is_template,
    is_public,
    capacity,
    price,
    currency,
    location,
    venue,
    start_date,
    end_date,
    registration_fields,
    event_settings,
    features,
    target_audience,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Educational Workshop',
    'Hands-on learning workshop template with practical exercises, expert instruction, and skill development.',
    'workshop',
    'education',
    'published',
    true,
    true,
    50,
    99.99,
    'USD',
    'Training Center',
    'Workshop Room A',
    NOW() + INTERVAL '21 days',
    NOW() + INTERVAL '21 days' + INTERVAL '6 hours',
    '[
        {"id": "name", "type": "text", "label": "Full Name", "required": true},
        {"id": "email", "type": "email", "label": "Email Address", "required": true},
        {"id": "phone", "type": "text", "label": "Phone Number", "required": false},
        {"id": "experience", "type": "select", "label": "Experience Level", "required": true, "options": ["Beginner", "Intermediate", "Advanced"]},
        {"id": "goals", "type": "textarea", "label": "Learning Goals", "required": false},
        {"id": "attendees", "type": "number", "label": "Number of Attendees", "required": true, "min": 1, "max": 3}
    ]'::JSONB,
    '{
        "allowWaitlist": true,
        "requireApproval": false,
        "sendConfirmation": true,
        "collectPayment": true,
        "earlyBirdDiscount": true,
        "groupDiscounts": true,
        "cancellationPolicy": "Full refund up to 14 days before event"
    }'::JSONB,
    '[
        "Hands-on training sessions",
        "Expert instruction and guidance",
        "Practice materials and resources",
        "Certificate of completion",
        "Take-home learning materials",
        "Follow-up support"
    ]'::JSONB,
    'Students, professionals, hobbyists, skill learners',
    NOW(),
    NOW()
);

-- 4. WEBINAR EVENT
INSERT INTO events (
    user_id,
    title,
    description,
    event_type,
    category,
    status,
    is_template,
    is_public,
    capacity,
    price,
    currency,
    location,
    venue,
    start_date,
    end_date,
    registration_fields,
    event_settings,
    features,
    target_audience,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Professional Webinar',
    'Virtual educational webinar template with live presentation, interactive Q&A, and digital resources.',
    'webinar',
    'education',
    'published',
    true,
    true,
    500,
    49.99,
    'USD',
    'Online',
    'Virtual Platform',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
    '[
        {"id": "name", "type": "text", "label": "Full Name", "required": true},
        {"id": "email", "type": "email", "label": "Email Address", "required": true},
        {"id": "phone", "type": "text", "label": "Phone Number", "required": false},
        {"id": "meetingLink", "type": "text", "label": "Preferred Meeting Platform", "required": false},
        {"id": "platform", "type": "select", "label": "Platform Experience", "required": false, "options": ["Zoom", "Teams", "WebEx", "Other", "None"]},
        {"id": "attendees", "type": "number", "label": "Number of Attendees", "required": true, "min": 1, "max": 5}
    ]'::JSONB,
    '{
        "allowWaitlist": true,
        "requireApproval": false,
        "sendConfirmation": true,
        "collectPayment": true,
        "earlyBirdDiscount": true,
        "groupDiscounts": true,
        "cancellationPolicy": "Full refund up to 24 hours before event"
    }'::JSONB,
    '[
        "Live presentation and demonstration",
        "Interactive Q&A session",
        "Screen sharing capabilities",
        "Recording access for attendees",
        "Digital handouts and resources",
        "Follow-up materials"
    ]'::JSONB,
    'Remote learners, professionals, students, online audience',
    NOW(),
    NOW()
);

-- 5. NETWORKING EVENT
INSERT INTO events (
    user_id,
    title,
    description,
    event_type,
    category,
    status,
    is_template,
    is_public,
    capacity,
    price,
    currency,
    location,
    venue,
    start_date,
    end_date,
    registration_fields,
    event_settings,
    features,
    target_audience,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Professional Networking Event',
    'Structured networking event template for professionals to connect, share ideas, and build business relationships.',
    'networking',
    'business',
    'published',
    true,
    true,
    200,
    79.99,
    'USD',
    'Business District Hotel',
    'Grand Ballroom',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '3 hours',
    '[
        {"id": "name", "type": "text", "label": "Full Name", "required": true},
        {"id": "email", "type": "email", "label": "Email Address", "required": true},
        {"id": "phone", "type": "text", "label": "Phone Number", "required": false},
        {"id": "company", "type": "text", "label": "Company/Organization", "required": true},
        {"id": "position", "type": "text", "label": "Job Title", "required": true},
        {"id": "industry", "type": "select", "label": "Industry", "required": true, "options": ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Other"]},
        {"id": "attendees", "type": "number", "label": "Number of Attendees", "required": true, "min": 1, "max": 2}
    ]'::JSONB,
    '{
        "allowWaitlist": true,
        "requireApproval": false,
        "sendConfirmation": true,
        "collectPayment": true,
        "earlyBirdDiscount": true,
        "groupDiscounts": true,
        "cancellationPolicy": "Full refund up to 48 hours before event"
    }'::JSONB,
    '[
        "Structured networking sessions",
        "Speed networking activities",
        "Industry-specific breakout groups",
        "Cocktails and appetizers",
        "Business card exchange",
        "Professional photographer",
        "Follow-up networking platform"
    ]'::JSONB,
    'Business professionals, entrepreneurs, industry leaders, sales professionals',
    NOW(),
    NOW()
);

-- =============================================
-- VERIFICATION AND SUMMARY
-- =============================================

-- Verify survey templates were created
SELECT 
    'SURVEY TEMPLATES' as template_type,
    COUNT(*) as total_created,
    'Professional survey templates created successfully!' as status
FROM surveys 
WHERE is_template = true;

-- Verify event templates were created
SELECT 
    'EVENT TEMPLATES' as template_type,
    COUNT(*) as total_created,
    'Professional event templates created successfully!' as status
FROM events 
WHERE is_template = true;

-- Summary of all templates by category
SELECT 
    'TEMPLATE SUMMARY' as report_type,
    'Survey Templates' as category,
    COUNT(*) as count,
    STRING_AGG(title, ', ') as templates
FROM surveys 
WHERE is_template = true
UNION ALL
SELECT 
    'TEMPLATE SUMMARY' as report_type,
    'Event Templates' as category,
    COUNT(*) as count,
    STRING_AGG(title, ', ') as templates
FROM events 
WHERE is_template = true;

-- Final success message
SELECT 'Professional templates creation completed successfully!' as final_status,
       'Both survey and event templates are now available in the system.' as message;
