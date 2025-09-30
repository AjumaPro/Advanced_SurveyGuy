-- =============================================
-- FIX SCHEMA RELATIONSHIPS
-- =============================================
-- This script fixes the specific relationship issues between surveys and survey_responses
-- Run this in your Supabase SQL Editor after creating the missing tables

-- =============================================
-- 1. VERIFY AND FIX SURVEYS TABLE STRUCTURE
-- =============================================

-- Check if surveys table exists and has required columns
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'user_id') THEN
        ALTER TABLE surveys ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'status') THEN
        ALTER TABLE surveys ADD COLUMN status VARCHAR(20) DEFAULT 'draft';
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
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'created_at') THEN
        ALTER TABLE surveys ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'updated_at') THEN
        ALTER TABLE surveys ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =============================================
-- 2. VERIFY AND FIX SURVEY_RESPONSES TABLE STRUCTURE
-- =============================================

-- Check if survey_responses table exists and has required columns
DO $$
BEGIN
    -- Add missing columns if they don't exist
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
-- 3. ENSURE PROPER FOREIGN KEY RELATIONSHIPS
-- =============================================

-- Drop existing foreign key constraints if they exist and recreate them properly
DO $$
BEGIN
    -- Drop existing foreign key constraints
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'survey_responses_survey_id_fkey') THEN
        ALTER TABLE survey_responses DROP CONSTRAINT survey_responses_survey_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'survey_responses_user_id_fkey') THEN
        ALTER TABLE survey_responses DROP CONSTRAINT survey_responses_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'surveys_user_id_fkey') THEN
        ALTER TABLE surveys DROP CONSTRAINT surveys_user_id_fkey;
    END IF;
END $$;

-- Recreate foreign key constraints with proper relationships
ALTER TABLE surveys 
ADD CONSTRAINT surveys_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE survey_responses 
ADD CONSTRAINT survey_responses_survey_id_fkey 
FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE;

ALTER TABLE survey_responses 
ADD CONSTRAINT survey_responses_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- =============================================
-- 4. CREATE PROPER INDEXES FOR RELATIONSHIPS
-- =============================================

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);

CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);

-- =============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on surveys table
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Enable RLS on survey_responses table
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

-- Create new RLS policies for surveys
CREATE POLICY "Users can view their own surveys" ON surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own surveys" ON surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" ON surveys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys" ON surveys
    FOR DELETE USING (auth.uid() = user_id);

-- Create new RLS policies for survey_responses
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

-- Force refresh of the schema cache
NOTIFY pgrst, 'reload schema';

-- =============================================
-- 8. VERIFY RELATIONSHIPS
-- =============================================

-- Test the relationship by creating a simple query
DO $$
DECLARE
    survey_count INTEGER;
    response_count INTEGER;
BEGIN
    -- Count surveys
    SELECT COUNT(*) INTO survey_count FROM surveys;
    
    -- Count survey responses
    SELECT COUNT(*) INTO response_count FROM survey_responses;
    
    RAISE NOTICE 'Surveys table has % records', survey_count;
    RAISE NOTICE 'Survey responses table has % records', response_count;
    RAISE NOTICE 'Schema relationships have been fixed successfully!';
END $$;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================
-- The schema relationships between surveys and survey_responses have been fixed.
-- The error "Could not find a relationship between 'surveys' and 'survey_responses' in the schema cache" should now be resolved.
-- You can now test your survey functionality.
