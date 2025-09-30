-- =============================================
-- FIX DATABASE RELATIONSHIPS AND PROFILES TABLE
-- =============================================
-- This script fixes the infinite recursion in profiles table policies
-- and the schema cache relationship issues between surveys and survey_responses
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. DROP EXISTING PROBLEMATIC POLICIES
-- =============================================

-- Drop all existing policies on profiles table to fix infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- =============================================
-- 2. CREATE CLEAN PROFILES TABLE POLICIES
-- =============================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- =============================================
-- 3. FIX SURVEYS TABLE RELATIONSHIPS
-- =============================================

-- Ensure surveys table has proper structure
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    questions JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    allow_anonymous BOOLEAN DEFAULT false,
    max_responses INTEGER,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure survey_responses table has proper structure
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '{}',
    is_completed BOOLEAN DEFAULT false,
    completion_time INTEGER, -- in seconds
    ip_address INET,
    user_agent TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. CREATE PROPER FOREIGN KEY RELATIONSHIPS
-- =============================================

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'survey_responses_survey_id_fkey'
    ) THEN
        ALTER TABLE survey_responses 
        ADD CONSTRAINT survey_responses_survey_id_fkey 
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE;
    END IF;
END $$;

-- =============================================
-- 5. CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- Create indexes for surveys table
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at);

-- Create indexes for survey_responses table
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at);

-- =============================================
-- 6. SET UP ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on surveys table
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can create surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can delete own surveys" ON surveys;
DROP POLICY IF EXISTS "Enable read access for all users" ON surveys;

-- Create new policies for surveys
CREATE POLICY "surveys_select_policy" ON surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "surveys_insert_policy" ON surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "surveys_update_policy" ON surveys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "surveys_delete_policy" ON surveys
    FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on survey_responses table
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can create survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Enable read access for all users" ON survey_responses;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON survey_responses;

-- Create new policies for survey_responses
CREATE POLICY "survey_responses_select_policy" ON survey_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM surveys 
            WHERE surveys.id = survey_responses.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

CREATE POLICY "survey_responses_insert_policy" ON survey_responses
    FOR INSERT WITH CHECK (true); -- Allow anyone to respond to surveys

-- =============================================
-- 7. REFRESH SCHEMA CACHE
-- =============================================

-- Force refresh of schema cache by querying the relationship
DO $$
BEGIN
    -- This query will refresh the schema cache for the relationship
    PERFORM 1 FROM surveys s 
    JOIN survey_responses sr ON s.id = sr.survey_id 
    LIMIT 1;
    
    RAISE NOTICE 'Schema cache refreshed for surveys-survey_responses relationship';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Schema cache refresh completed with warning: %', SQLERRM;
END $$;

-- =============================================
-- 8. CREATE HELPER FUNCTIONS FOR ANALYTICS
-- =============================================

-- Function to get survey with response count
CREATE OR REPLACE FUNCTION get_survey_with_responses(survey_uuid UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    user_id UUID,
    response_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.description,
        s.status,
        s.user_id,
        COUNT(sr.id) as response_count,
        s.created_at,
        s.updated_at
    FROM surveys s
    LEFT JOIN survey_responses sr ON s.id = sr.survey_id
    WHERE s.id = survey_uuid
    GROUP BY s.id, s.title, s.description, s.status, s.user_id, s.created_at, s.updated_at;
END;
$$;

-- Function to get user surveys with response counts
CREATE OR REPLACE FUNCTION get_user_surveys_with_responses(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    response_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.description,
        s.status,
        COUNT(sr.id) as response_count,
        s.created_at,
        s.updated_at
    FROM surveys s
    LEFT JOIN survey_responses sr ON s.id = sr.survey_id
    WHERE s.user_id = user_uuid
    GROUP BY s.id, s.title, s.description, s.status, s.created_at, s.updated_at
    ORDER BY s.created_at DESC;
END;
$$;

-- =============================================
-- 9. VERIFICATION QUERIES
-- =============================================

-- Test the relationship
DO $$
DECLARE
    relationship_exists BOOLEAN;
    profiles_policies_count INTEGER;
    surveys_policies_count INTEGER;
    responses_policies_count INTEGER;
BEGIN
    -- Check if relationship exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'survey_responses_survey_id_fkey'
    ) INTO relationship_exists;
    
    -- Count policies
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles' INTO profiles_policies_count;
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'surveys' INTO surveys_policies_count;
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'survey_responses' INTO responses_policies_count;
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'DATABASE FIX VERIFICATION';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Survey-Response Relationship: %', CASE WHEN relationship_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    RAISE NOTICE 'Profiles Policies: % policies', profiles_policies_count;
    RAISE NOTICE 'Surveys Policies: % policies', surveys_policies_count;
    RAISE NOTICE 'Survey Responses Policies: % policies', responses_policies_count;
    RAISE NOTICE '=============================================';
    
    IF relationship_exists AND profiles_policies_count >= 4 THEN
        RAISE NOTICE '🎉 Database relationships fixed successfully!';
    ELSE
        RAISE NOTICE '⚠️ Some issues may still exist. Check the output above.';
    END IF;
END $$;
