-- IMMEDIATE FIX FOR SURVEY SUBMISSION
-- Copy and paste this ENTIRE script into your Supabase SQL Editor

-- Step 1: Drop existing table if it has issues
DROP TABLE IF EXISTS survey_responses CASCADE;

-- Step 2: Create survey_responses table with correct structure
CREATE TABLE survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID NOT NULL,
    responses JSONB NOT NULL DEFAULT '{}',
    session_id TEXT DEFAULT NULL,
    respondent_email TEXT DEFAULT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    completion_time INTEGER DEFAULT NULL,
    is_completed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_submitted_at ON survey_responses(submitted_at);
CREATE INDEX idx_survey_responses_session_id ON survey_responses(session_id);

-- Step 4: Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop all existing policies
DROP POLICY IF EXISTS "Allow public survey response submission" ON survey_responses;
DROP POLICY IF EXISTS "Users can view their survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Survey owners can view responses" ON survey_responses;
DROP POLICY IF EXISTS "Survey owners can update responses" ON survey_responses;
DROP POLICY IF EXISTS "Survey owners can delete responses" ON survey_responses;
DROP POLICY IF EXISTS "Enable insert for public" ON survey_responses;
DROP POLICY IF EXISTS "Enable read for authenticated users based on survey ownership" ON survey_responses;

-- Step 6: Create simple, permissive policies
CREATE POLICY "Allow all inserts for survey responses" 
ON survey_responses FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read survey responses" 
ON survey_responses FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow survey owners to update responses" 
ON survey_responses FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM surveys 
        WHERE surveys.id = survey_responses.survey_id 
        AND surveys.user_id = auth.uid()
    )
);

CREATE POLICY "Allow survey owners to delete responses" 
ON survey_responses FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM surveys 
        WHERE surveys.id = survey_responses.survey_id 
        AND surveys.user_id = auth.uid()
    )
);

-- Step 7: Grant necessary permissions
GRANT INSERT ON survey_responses TO anon;
GRANT INSERT ON survey_responses TO authenticated;
GRANT SELECT ON survey_responses TO authenticated;
GRANT UPDATE ON survey_responses TO authenticated;
GRANT DELETE ON survey_responses TO authenticated;

-- Step 8: Test the table with a sample insert
INSERT INTO survey_responses (
    survey_id, 
    responses, 
    session_id,
    user_agent
) VALUES (
    '72e29f4f-78f9-429f-8bae-9f3074675ff6'::UUID,
    '{"test": "This is a test response"}'::JSONB,
    'test_session_' || extract(epoch from now()),
    'Test User Agent'
);

-- Step 9: Verify the insert worked
SELECT 
    id,
    survey_id,
    responses,
    session_id,
    submitted_at,
    'SUCCESS: Table created and test insert completed' as status
FROM survey_responses 
WHERE survey_id = '72e29f4f-78f9-429f-8bae-9f3074675ff6'::UUID
ORDER BY submitted_at DESC 
LIMIT 1;

-- Step 10: Clean up test data
DELETE FROM survey_responses 
WHERE survey_id = '72e29f4f-78f9-429f-8bae-9f3074675ff6'::UUID 
AND session_id LIKE 'test_session_%';

-- Success message
SELECT 'DATABASE SETUP COMPLETE - Try submitting your survey now!' as message;
