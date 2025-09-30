-- Create survey_responses table if it doesn't exist
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID NOT NULL,
    responses JSONB NOT NULL,
    session_id TEXT,
    respondent_email TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    completion_time INTEGER,
    is_completed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at);

-- Add foreign key constraint to surveys table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'surveys') THEN
        ALTER TABLE survey_responses 
        ADD CONSTRAINT fk_survey_responses_survey_id 
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create RLS policies for survey_responses
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert responses (for anonymous survey submissions)
CREATE POLICY IF NOT EXISTS "Allow public survey response submission" 
ON survey_responses FOR INSERT 
TO public 
WITH CHECK (true);

-- Policy: Allow users to view their own survey responses
CREATE POLICY IF NOT EXISTS "Users can view their survey responses" 
ON survey_responses FOR SELECT 
TO authenticated 
USING (
    survey_id IN (
        SELECT id FROM surveys WHERE user_id = auth.uid()
    )
);

-- Policy: Allow survey owners to view all responses to their surveys
CREATE POLICY IF NOT EXISTS "Survey owners can view responses" 
ON survey_responses FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM surveys 
        WHERE surveys.id = survey_responses.survey_id 
        AND surveys.user_id = auth.uid()
    )
);

-- Policy: Allow survey owners to update responses (for moderation)
CREATE POLICY IF NOT EXISTS "Survey owners can update responses" 
ON survey_responses FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM surveys 
        WHERE surveys.id = survey_responses.survey_id 
        AND surveys.user_id = auth.uid()
    )
);

-- Policy: Allow survey owners to delete responses
CREATE POLICY IF NOT EXISTS "Survey owners can delete responses" 
ON survey_responses FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM surveys 
        WHERE surveys.id = survey_responses.survey_id 
        AND surveys.user_id = auth.uid()
    )
);
