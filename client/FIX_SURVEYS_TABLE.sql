-- FIX SURVEYS TABLE AFTER IMMEDIATE_FIX.sql
-- Run this in Supabase SQL Editor to fix the published surveys loading issue

-- Step 1: Ensure surveys table exists with correct structure
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Survey',
    description TEXT,
    questions JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_template BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    template_category TEXT,
    template_industry TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_published_at ON surveys(published_at);
CREATE INDEX IF NOT EXISTS idx_surveys_is_template ON surveys(is_template);

-- Step 3: Enable Row Level Security on surveys
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can insert own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can delete own surveys" ON surveys;
DROP POLICY IF EXISTS "Public can view published surveys" ON surveys;
DROP POLICY IF EXISTS "Enable read access for all users" ON surveys;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON surveys;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON surveys;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON surveys;

-- Step 5: Create comprehensive RLS policies for surveys
CREATE POLICY "Users can view own surveys" 
ON surveys FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys" 
ON surveys FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys" 
ON surveys FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own surveys" 
ON surveys FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Step 6: Allow public access to published surveys (for survey responses)
CREATE POLICY "Public can view published surveys" 
ON surveys FOR SELECT 
TO public 
USING (status = 'published' AND is_active = true);

-- Step 7: Grant necessary permissions
GRANT SELECT ON surveys TO authenticated;
GRANT INSERT ON surveys TO authenticated;
GRANT UPDATE ON surveys TO authenticated;
GRANT DELETE ON surveys TO authenticated;
GRANT SELECT ON surveys TO anon;

-- Step 8: Create a test survey if none exist
DO $$
BEGIN
    -- Check if there are any surveys for testing
    IF NOT EXISTS (SELECT 1 FROM surveys LIMIT 1) THEN
        -- Create a test survey
        INSERT INTO surveys (
            id,
            user_id,
            title,
            description,
            questions,
            status,
            is_active,
            published_at,
            created_at,
            updated_at
        ) VALUES (
            '72e29f4f-78f9-429f-8bae-9f3074675ff6'::UUID,
            (SELECT auth.uid()),
            'Customer Satisfaction Survey',
            'A sample survey to test functionality',
            '[
                {
                    "id": "q1",
                    "type": "text",
                    "question": "What is your name?",
                    "required": true,
                    "placeholder": "Enter your name"
                },
                {
                    "id": "q2",
                    "type": "multiple-choice",
                    "question": "How satisfied are you with our service?",
                    "required": true,
                    "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
                },
                {
                    "id": "q3",
                    "type": "multiple-choice",
                    "question": "Which option do you prefer?",
                    "required": false,
                    "options": ["Option 1", "Option 2", "Option 3"]
                }
            ]'::JSONB,
            'published',
            true,
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Test survey created successfully';
    ELSE
        RAISE NOTICE 'Surveys table already has data';
    END IF;
END $$;

-- Step 9: Verify the setup
SELECT 
    COUNT(*) as total_surveys,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_surveys,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_surveys
FROM surveys;

-- Step 10: Test the published surveys query
SELECT 
    id,
    title,
    status,
    published_at,
    'Published surveys query working!' as message
FROM surveys 
WHERE status = 'published' 
ORDER BY updated_at DESC 
LIMIT 5;

-- Success message
SELECT 'SURVEYS TABLE FIXED - Try refreshing your published surveys page!' as result;
