-- =============================================
-- FIXED SURVEY SYSTEM UPDATE SCRIPT
-- =============================================
-- This script safely updates all existing surveys and ensures all sections work properly
-- Handles missing columns gracefully

-- =============================================
-- 1. BACKUP EXISTING DATA
-- =============================================

-- Create backup tables if they don't exist
CREATE TABLE IF NOT EXISTS surveys_backup AS SELECT * FROM surveys;
CREATE TABLE IF NOT EXISTS survey_responses_backup AS SELECT * FROM survey_responses;

-- =============================================
-- 2. ENSURE ALL REQUIRED TABLES EXIST
-- =============================================

-- Create surveys table if not exists with all required columns
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft',
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category VARCHAR(100) DEFAULT 'general',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- Create survey_responses table if not exists
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add completed_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'survey_responses' AND column_name = 'completed_at') THEN
        ALTER TABLE survey_responses ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'survey_responses' AND column_name = 'status') THEN
        ALTER TABLE survey_responses ADD COLUMN status VARCHAR(20) DEFAULT 'completed';
    END IF;
END $$;

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    subscription_plan_id UUID,
    subscription_status VARCHAR(20) DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    plan VARCHAR(50) DEFAULT 'free',
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true
);

-- =============================================
-- 3. SAFELY ADD MISSING COLUMNS
-- =============================================

-- Add missing columns to existing surveys table
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'category') THEN
        ALTER TABLE surveys ADD COLUMN category VARCHAR(100) DEFAULT 'general';
        RAISE NOTICE 'Added category column to surveys table';
    END IF;
    
    -- Add settings column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'settings') THEN
        ALTER TABLE surveys ADD COLUMN settings JSONB DEFAULT '{}';
        RAISE NOTICE 'Added settings column to surveys table';
    END IF;
    
    -- Add metadata column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'metadata') THEN
        ALTER TABLE surveys ADD COLUMN metadata JSONB DEFAULT '{}';
        RAISE NOTICE 'Added metadata column to surveys table';
    END IF;
END $$;

-- =============================================
-- 4. FIX EXISTING SURVEY DATA
-- =============================================

-- Update surveys with missing required fields (only if columns exist)
DO $$ 
BEGIN
    -- Check if we can update the surveys table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'surveys') THEN
        
        -- Update basic fields that should always exist
        UPDATE surveys SET 
            title = COALESCE(title, 'Untitled Survey'),
            description = COALESCE(description, ''),
            questions = COALESCE(questions, '[]'::jsonb),
            status = COALESCE(status, 'draft'),
            is_public = COALESCE(is_public, true),
            is_active = COALESCE(is_active, true),
            updated_at = NOW()
        WHERE title IS NULL OR questions IS NULL;
        
        RAISE NOTICE 'Updated basic survey fields';
        
        -- Update category if column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'category') THEN
            UPDATE surveys SET category = COALESCE(category, 'general') WHERE category IS NULL;
            RAISE NOTICE 'Updated survey categories';
        END IF;
        
        -- Update settings if column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'settings') THEN
            UPDATE surveys SET settings = COALESCE(settings, '{}'::jsonb) WHERE settings IS NULL;
            RAISE NOTICE 'Updated survey settings';
        END IF;
        
        -- Update metadata if column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'metadata') THEN
            UPDATE surveys SET metadata = COALESCE(metadata, '{}'::jsonb) WHERE metadata IS NULL;
            RAISE NOTICE 'Updated survey metadata';
        END IF;
        
    END IF;
END $$;

-- Fix survey questions structure
UPDATE surveys SET questions = (
    WITH numbered_questions AS (
        SELECT 
            question,
            row_number() OVER () as question_num
        FROM jsonb_array_elements(questions) AS question
    )
    SELECT jsonb_agg(
        CASE 
            WHEN question ? 'id' THEN question
            ELSE question || jsonb_build_object('id', 'q_' || question_num)
        END
    )
    FROM numbered_questions
)
WHERE questions IS NOT NULL;

-- =============================================
-- 5. CREATE SAMPLE SURVEYS FOR TESTING
-- =============================================

-- Get a user ID for sample surveys
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Try to get an existing user
    SELECT id INTO sample_user_id FROM profiles LIMIT 1;
    
    -- If no user exists, create a fallback
    IF sample_user_id IS NULL THEN
        sample_user_id := '00000000-0000-0000-0000-000000000000'::uuid;
    END IF;

    -- Create Customer Satisfaction Survey
    INSERT INTO surveys (id, title, description, questions, status, is_public, user_id, category, settings)
    VALUES (
        gen_random_uuid(),
        'Customer Satisfaction Survey',
        'Help us improve our service by sharing your feedback',
        '[
            {
                "id": "q1",
                "title": "How satisfied are you with our service?",
                "type": "rating",
                "required": true,
                "options": {
                    "min": 1,
                    "max": 5,
                    "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
                }
            },
            {
                "id": "q2",
                "title": "What can we improve?",
                "type": "textarea",
                "required": false,
                "placeholder": "Please share your suggestions..."
            },
            {
                "id": "q3",
                "title": "Which features do you use most?",
                "type": "multiple_choice",
                "required": true,
                "options": ["Mobile App", "Web Interface", "API Integration", "Customer Support"],
                "allowOther": true
            },
            {
                "id": "q4",
                "title": "How likely are you to recommend us?",
                "type": "nps",
                "required": true,
                "options": {
                    "min": 0,
                    "max": 10,
                    "labels": ["Not at all likely", "Extremely likely"]
                }
            }
        ]'::jsonb,
        'published',
        true,
        sample_user_id,
        'customer-feedback',
        '{"showProgress": true, "allowAnonymous": true, "collectEmail": false}'::jsonb
    ) ON CONFLICT (id) DO NOTHING;

    -- Create Employee Engagement Survey
    INSERT INTO surveys (id, title, description, questions, status, is_public, user_id, category, settings)
    VALUES (
        gen_random_uuid(),
        'Employee Engagement Survey',
        'Understanding employee satisfaction and engagement levels',
        '[
            {
                "id": "q1",
                "title": "How satisfied are you with your current role?",
                "type": "emoji_scale",
                "required": true,
                "options": {
                    "scale": "satisfaction",
                    "labels": ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"]
                }
            },
            {
                "id": "q2",
                "title": "How would you rate work-life balance?",
                "type": "rating",
                "required": true,
                "options": {
                    "min": 1,
                    "max": 5,
                    "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
                }
            },
            {
                "id": "q3",
                "title": "What motivates you most at work?",
                "type": "multiple_choice",
                "required": false,
                "options": ["Recognition", "Career Growth", "Salary", "Work Environment", "Team Collaboration"],
                "allowOther": true
            },
            {
                "id": "q4",
                "title": "Additional comments or suggestions",
                "type": "textarea",
                "required": false,
                "placeholder": "Share any additional feedback..."
            }
        ]'::jsonb,
        'published',
        true,
        sample_user_id,
        'employee-feedback',
        '{"showProgress": true, "allowAnonymous": true, "collectEmail": false}'::jsonb
    ) ON CONFLICT (id) DO NOTHING;

    -- Create Product Feedback Survey
    INSERT INTO surveys (id, title, description, questions, status, is_public, user_id, category, settings)
    VALUES (
        gen_random_uuid(),
        'Product Feedback Survey',
        'Gathering feedback on our latest product features',
        '[
            {
                "id": "q1",
                "title": "How would you rate the overall product quality?",
                "type": "star_rating",
                "required": true,
                "options": {
                    "max": 5,
                    "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
                }
            },
            {
                "id": "q2",
                "title": "Which features are most important to you?",
                "type": "checkbox",
                "required": false,
                "options": ["Performance", "User Interface", "Security", "Integration", "Support"],
                "allowOther": true
            },
            {
                "id": "q3",
                "title": "How easy is it to use our product?",
                "type": "linear_scale",
                "required": true,
                "options": {
                    "min": 1,
                    "max": 7,
                    "labels": ["Very Difficult", "Very Easy"]
                }
            },
            {
                "id": "q4",
                "title": "What improvements would you like to see?",
                "type": "textarea",
                "required": false,
                "placeholder": "Please describe any improvements..."
            }
        ]'::jsonb,
        'published',
        true,
        sample_user_id,
        'product-feedback',
        '{"showProgress": true, "allowAnonymous": true, "collectEmail": false}'::jsonb
    ) ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Created sample surveys for testing';

END $$;

-- =============================================
-- 6. CREATE SAMPLE RESPONSES
-- =============================================

-- Create sample responses for testing
DO $$
DECLARE
    survey_record RECORD;
    response_data JSONB;
BEGIN
    FOR survey_record IN SELECT id, questions FROM surveys WHERE status = 'published' LIMIT 3
    LOOP
        -- Create sample response
        response_data := '{}';
        
        -- Add responses for each question
        FOR i IN 1..jsonb_array_length(survey_record.questions)
        LOOP
            DECLARE
                question JSONB;
                question_id TEXT;
                question_type TEXT;
            BEGIN
                question := survey_record.questions->(i-1);
                question_id := question->>'id';
                question_type := question->>'type';
                
                -- Generate appropriate response based on question type
                CASE question_type
                    WHEN 'rating', 'emoji_scale' THEN
                        response_data := response_data || jsonb_build_object(question_id, floor(random() * 5 + 1));
                    WHEN 'star_rating' THEN
                        response_data := response_data || jsonb_build_object(question_id, floor(random() * 5 + 1));
                    WHEN 'nps' THEN
                        response_data := response_data || jsonb_build_object(question_id, floor(random() * 11));
                    WHEN 'linear_scale' THEN
                        response_data := response_data || jsonb_build_object(question_id, floor(random() * 7 + 1));
                    WHEN 'multiple_choice' THEN
                        response_data := response_data || jsonb_build_object(question_id, 
                            jsonb_build_array((question->'options'->>floor(random() * jsonb_array_length(question->'options'))::int)));
                    WHEN 'checkbox' THEN
                        response_data := response_data || jsonb_build_object(question_id, 
                            jsonb_build_array((question->'options'->>floor(random() * jsonb_array_length(question->'options'))::int)));
                    WHEN 'textarea' THEN
                        response_data := response_data || jsonb_build_object(question_id, 
                            'This is a sample text response for testing purposes.');
                    ELSE
                        response_data := response_data || jsonb_build_object(question_id, 'Sample response');
                END CASE;
            END;
        END LOOP;
        
        -- Insert sample responses
        INSERT INTO survey_responses (survey_id, responses, session_id, status)
        VALUES (
            survey_record.id,
            response_data,
            'sample_session_' || extract(epoch from now()),
            'completed'
        );
        
        -- Insert a few more responses for variety
        FOR j IN 1..2
        LOOP
            INSERT INTO survey_responses (survey_id, responses, session_id, status)
            VALUES (
                survey_record.id,
                response_data || jsonb_build_object('timestamp', now() + (j || ' minutes')::interval),
                'sample_session_' || extract(epoch from now()) || '_' || j,
                'completed'
            );
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Created sample responses for testing';
END $$;

-- =============================================
-- 7. UPDATE ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can insert own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can delete own surveys" ON surveys;
DROP POLICY IF EXISTS "Anyone can view published surveys" ON surveys;
DROP POLICY IF EXISTS "Users can view own responses" ON survey_responses;
DROP POLICY IF EXISTS "Anyone can insert responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can update own responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create updated policies
CREATE POLICY "Users can view own surveys" ON surveys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own surveys" ON surveys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own surveys" ON surveys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own surveys" ON surveys FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view published surveys" ON surveys FOR SELECT USING (status = 'published' AND is_public = true);

CREATE POLICY "Users can view own responses" ON survey_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert responses" ON survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own responses" ON survey_responses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_category ON surveys(category);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_status ON survey_responses(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);

-- =============================================
-- 9. VERIFICATION AND CLEANUP
-- =============================================

-- Verify tables exist and have data
SELECT 
    'surveys' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN status = 'published' THEN 1 ELSE NULL END) as published_count
FROM surveys
UNION ALL
SELECT 
    'survey_responses' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN status = 'completed' THEN 1 ELSE NULL END) as completed_count
FROM survey_responses
UNION ALL
SELECT 
    'profiles' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN is_active = true THEN 1 ELSE NULL END) as active_count
FROM profiles;

-- Show survey summary
SELECT 
    s.title,
    s.status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'category') 
        THEN s.category 
        ELSE 'N/A' 
    END as category,
    COUNT(sr.id) as response_count,
    s.created_at
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY s.id, s.title, s.status, s.category, s.created_at
ORDER BY s.created_at DESC;

-- =============================================
-- 10. SUCCESS MESSAGE
-- =============================================

SELECT '✅ Survey system update completed successfully!' as message,
       'All surveys have been updated and sample data created for testing.' as details;
