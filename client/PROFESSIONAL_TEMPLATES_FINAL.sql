-- =============================================
-- PROFESSIONAL SURVEY & EVENT TEMPLATES (FINAL)
-- Advanced SurveyGuy Template Library
-- =============================================

-- This script ensures proper table structure and creates comprehensive professional templates
-- for both surveys and events, organized by industry, use case, and complexity level

-- =============================================
-- STEP 1: ENSURE PROPER TABLE STRUCTURE
-- =============================================

-- Ensure surveys table has all required columns
DO $$
BEGIN
    -- Check and add missing columns to surveys table
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'is_template' AND table_schema = 'public') THEN
        ALTER TABLE public.surveys ADD COLUMN is_template BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_template column to surveys table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'is_public' AND table_schema = 'public') THEN
        ALTER TABLE public.surveys ADD COLUMN is_public BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_public column to surveys table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'template_category' AND table_schema = 'public') THEN
        ALTER TABLE public.surveys ADD COLUMN template_category TEXT;
        RAISE NOTICE 'Added template_category column to surveys table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'template_industry' AND table_schema = 'public') THEN
        ALTER TABLE public.surveys ADD COLUMN template_industry TEXT;
        RAISE NOTICE 'Added template_industry column to surveys table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'estimated_time' AND table_schema = 'public') THEN
        ALTER TABLE public.surveys ADD COLUMN estimated_time TEXT;
        RAISE NOTICE 'Added estimated_time column to surveys table';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'target_audience' AND table_schema = 'public') THEN
        ALTER TABLE public.surveys ADD COLUMN target_audience TEXT;
        RAISE NOTICE 'Added target_audience column to surveys table';
    END IF;
    
    RAISE NOTICE 'Surveys table structure verified and updated';
END $$;

-- =============================================
-- STEP 2: SURVEY TEMPLATES - BUSINESS & PROFESSIONAL
-- =============================================

-- 1. Customer Satisfaction Survey
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

-- 2. Employee Satisfaction Survey
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

-- 3. Event Feedback Survey
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

-- 4. Product Feature Feedback Survey
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

-- 5. Market Research Survey
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

-- 6. Course Evaluation Survey
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

-- 7. Comprehensive Customer Experience Survey
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

-- =============================================
-- STEP 3: ENSURE EVENTS TABLE HAS REQUIRED COLUMNS
-- =============================================

-- Safe: add is_template to events if missing, add index, then run verification queries
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'is_template'
    ) THEN
        ALTER TABLE public.events
        ADD COLUMN is_template boolean DEFAULT false;
        -- If you want NOT NULL, uncomment the next line after verifying the table rewrite cost
        -- ALTER TABLE public.events ALTER COLUMN is_template SET NOT NULL;
        RAISE NOTICE 'Added is_template column to public.events';
    ELSE
        RAISE NOTICE 'Column is_template already exists on public.events';
    END IF;
END $$;

-- Create index for faster filtering by is_template (safe to run repeatedly)
CREATE INDEX IF NOT EXISTS idx_events_is_template ON public.events(is_template);

-- =============================================
-- STEP 4: EVENT TEMPLATES - SIMPLIFIED APPROACH
-- =============================================

-- Create event templates using minimal required fields to avoid constraint issues
-- We'll create them as basic events and then users can customize them

-- 1. Professional Business Conference
INSERT INTO events (
    user_id,
    title,
    description,
    start_date,
    end_date,
    status,
    is_template,
    is_public,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Professional Business Conference',
    'Comprehensive business conference template with speakers, networking, workshops, and professional development sessions.',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days' + INTERVAL '8 hours',
    'published',
    true,
    true,
    NOW(),
    NOW()
);

-- 2. Corporate Team Building Event
INSERT INTO events (
    user_id,
    title,
    description,
    start_date,
    end_date,
    status,
    is_template,
    is_public,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Corporate Team Building Event',
    'Professional team building event template designed to strengthen team relationships and improve collaboration.',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '4 hours',
    'published',
    true,
    true,
    NOW(),
    NOW()
);

-- 3. Educational Workshop
INSERT INTO events (
    user_id,
    title,
    description,
    start_date,
    end_date,
    status,
    is_template,
    is_public,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Educational Workshop',
    'Hands-on learning workshop template with practical exercises, expert instruction, and skill development.',
    NOW() + INTERVAL '21 days',
    NOW() + INTERVAL '21 days' + INTERVAL '6 hours',
    'published',
    true,
    true,
    NOW(),
    NOW()
);

-- 4. Professional Webinar
INSERT INTO events (
    user_id,
    title,
    description,
    start_date,
    end_date,
    status,
    is_template,
    is_public,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Professional Webinar',
    'Virtual educational webinar template with live presentation, interactive Q&A, and digital resources.',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
    'published',
    true,
    true,
    NOW(),
    NOW()
);

-- 5. Professional Networking Event
INSERT INTO events (
    user_id,
    title,
    description,
    start_date,
    end_date,
    status,
    is_template,
    is_public,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM profiles LIMIT 1),
    'Professional Networking Event',
    'Structured networking event template for professionals to connect, share ideas, and build business relationships.',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '3 hours',
    'published',
    true,
    true,
    NOW(),
    NOW()
);

-- =============================================
-- STEP 5: VERIFICATION AND SUMMARY
-- =============================================

-- Verify survey templates were created
SELECT 
    'SURVEY TEMPLATES' AS template_type,
    COUNT(*) AS total_created,
    'Professional survey templates created successfully!' AS status
FROM surveys 
WHERE is_template = true;

-- Verification queries for events (safe because column now exists)
SELECT 
    'EVENT TEMPLATES' AS template_type,
    COUNT(*) AS total_created,
    'Professional event templates created successfully!' AS status
FROM public.events
WHERE is_template = true;

-- Summary of all templates by category
SELECT 
    'TEMPLATE SUMMARY' AS report_type,
    'Survey Templates' AS category,
    COUNT(*) AS count,
    STRING_AGG(title, ', ') AS templates
FROM surveys 
WHERE is_template = true
UNION ALL
SELECT 
    'TEMPLATE SUMMARY' AS report_type,
    'Event Templates' AS category,
    COUNT(*) AS count,
    STRING_AGG(title, ', ') AS templates
FROM public.events
WHERE is_template = true;

-- Final success message
SELECT 'Professional templates creation completed successfully!' AS final_status,
       'Both survey and event templates are now available in the system.' AS message;
