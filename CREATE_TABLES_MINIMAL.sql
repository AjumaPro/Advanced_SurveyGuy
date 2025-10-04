-- Minimal database table creation script
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. SURVEYS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft',
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    user_id UUID DEFAULT '00000000-0000-0000-0000-000000000000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. SURVEY RESPONSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID DEFAULT NULL,
    responses JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE BASIC RLS POLICIES
-- =============================================

-- Surveys policies - Allow public access to published surveys
DROP POLICY IF EXISTS "Anyone can view published surveys" ON surveys;
CREATE POLICY "Anyone can view published surveys" ON surveys FOR SELECT USING (status = 'published' AND is_public = true);

-- Allow anyone to insert surveys (for testing)
DROP POLICY IF EXISTS "Anyone can insert surveys" ON surveys;
CREATE POLICY "Anyone can insert surveys" ON surveys FOR INSERT WITH CHECK (true);

-- Allow anyone to update surveys (for testing)
DROP POLICY IF EXISTS "Anyone can update surveys" ON surveys;
CREATE POLICY "Anyone can update surveys" ON surveys FOR UPDATE USING (true);

-- Survey responses policies - Allow anyone to insert responses
DROP POLICY IF EXISTS "Anyone can insert responses" ON survey_responses;
CREATE POLICY "Anyone can insert responses" ON survey_responses FOR INSERT WITH CHECK (true);

-- Allow anyone to view responses (for testing)
DROP POLICY IF EXISTS "Anyone can view responses" ON survey_responses;
CREATE POLICY "Anyone can view responses" ON survey_responses FOR SELECT USING (true);

-- =============================================
-- 5. CREATE INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);

-- =============================================
-- 6. VERIFY TABLES CREATED
-- =============================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('surveys', 'survey_responses')
ORDER BY table_name;

-- Show success message
SELECT '✅ Minimal database tables created successfully!' as message;
SELECT '📋 Next step: Create the survey for QR code testing' as next_step;
