-- =============================================
-- MINIMAL SURVEY API FIX
-- =============================================
-- This script focuses specifically on fixing the survey API functions
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CREATE SURVEYS TABLE (IF NOT EXISTS)
-- =============================================
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Survey',
    description TEXT,
    questions JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CREATE SURVEY_RESPONSES TABLE (IF NOT EXISTS)
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. ADD MISSING COLUMNS TO EXISTING TABLES
-- =============================================

-- Add missing columns to surveys table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'user_id') THEN
        ALTER TABLE surveys ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'title') THEN
        ALTER TABLE surveys ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Untitled Survey';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'description') THEN
        ALTER TABLE surveys ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'questions') THEN
        ALTER TABLE surveys ADD COLUMN questions JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'settings') THEN
        ALTER TABLE surveys ADD COLUMN settings JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'status') THEN
        ALTER TABLE surveys ADD COLUMN status VARCHAR(20) DEFAULT 'draft';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'is_active') THEN
        ALTER TABLE surveys ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'published_at') THEN
        ALTER TABLE surveys ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'created_at') THEN
        ALTER TABLE surveys ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'updated_at') THEN
        ALTER TABLE surveys ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add missing columns to survey_responses table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'survey_id') THEN
        ALTER TABLE survey_responses ADD COLUMN survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'user_id') THEN
        ALTER TABLE survey_responses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'responses') THEN
        ALTER TABLE survey_responses ADD COLUMN responses JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'created_at') THEN
        ALTER TABLE survey_responses ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'updated_at') THEN
        ALTER TABLE survey_responses ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(is_active);

CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);

-- =============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 6. CREATE RLS POLICIES
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can insert their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON surveys;

DROP POLICY IF EXISTS "Users can view survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can insert survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can update survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can delete survey responses" ON survey_responses;

-- Create new policies for surveys
CREATE POLICY "Users can view their own surveys" ON surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own surveys" ON surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" ON surveys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys" ON surveys
    FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for survey_responses
CREATE POLICY "Users can view survey responses" ON survey_responses
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert survey responses" ON survey_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.status = 'published'
        )
    );

CREATE POLICY "Users can update survey responses" ON survey_responses
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete survey responses" ON survey_responses
    FOR DELETE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.user_id = auth.uid()
        )
    );

-- =============================================
-- 7. REFRESH SCHEMA CACHE
-- =============================================
NOTIFY pgrst, 'reload schema';

-- =============================================
-- 8. VERIFICATION
-- =============================================
DO $$
DECLARE
    survey_count INTEGER;
    response_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO survey_count FROM surveys;
    SELECT COUNT(*) INTO response_count FROM survey_responses;
    
    RAISE NOTICE '✅ Survey API fix completed successfully!';
    RAISE NOTICE '📊 Surveys table: % records', survey_count;
    RAISE NOTICE '📊 Survey responses table: % records', response_count;
    RAISE NOTICE '🔗 Schema relationships established';
    RAISE NOTICE '🔐 Row Level Security enabled';
    RAISE NOTICE '🚀 Survey API functions should now work!';
END $$;
