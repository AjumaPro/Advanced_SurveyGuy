-- =============================================
-- CREATE QUESTION LIBRARY TABLE
-- For storing reusable questions
-- =============================================

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS question_library CASCADE;

-- Create question library table
CREATE TABLE question_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Ownership
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Question details
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  
  -- Categorization
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Template & Sharing
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  parent_question_id UUID REFERENCES question_library(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_question_library_user ON question_library(user_id);
CREATE INDEX idx_question_library_type ON question_library(type);
CREATE INDEX idx_question_library_category ON question_library(category);
CREATE INDEX idx_question_library_tags ON question_library USING GIN(tags);
CREATE INDEX idx_question_library_template ON question_library(is_template) WHERE is_template = TRUE;
CREATE INDEX idx_question_library_public ON question_library(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_question_library_usage ON question_library(usage_count DESC);

-- Enable Row Level Security
ALTER TABLE question_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage own questions" ON question_library;
DROP POLICY IF EXISTS "Users can view public questions" ON question_library;
DROP POLICY IF EXISTS "Users can view template questions" ON question_library;

-- Policy 1: Users can manage their own questions
CREATE POLICY "Users can manage own questions"
ON question_library
FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Anyone can view public questions
CREATE POLICY "Users can view public questions"
ON question_library
FOR SELECT
TO authenticated, anon
USING (is_public = TRUE);

-- Policy 3: Anyone can view template questions
CREATE POLICY "Users can view template questions"
ON question_library
FOR SELECT
TO authenticated, anon
USING (is_template = TRUE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_question_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_question_library_updated_at ON question_library;
CREATE TRIGGER update_question_library_updated_at
  BEFORE UPDATE ON question_library
  FOR EACH ROW
  EXECUTE FUNCTION update_question_library_updated_at();

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION increment_question_usage(question_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE question_library
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to search questions
CREATE OR REPLACE FUNCTION search_questions(
  search_term TEXT,
  filter_type TEXT DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  user_only BOOLEAN DEFAULT FALSE
)
RETURNS SETOF question_library AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM question_library
  WHERE
    (NOT user_only OR user_id = auth.uid())
    AND (search_term IS NULL OR 
         title ILIKE '%' || search_term || '%' OR
         description ILIKE '%' || search_term || '%' OR
         search_term = ANY(tags))
    AND (filter_type IS NULL OR type = filter_type)
    AND (filter_category IS NULL OR category = filter_category)
  ORDER BY usage_count DESC, created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get popular questions
CREATE OR REPLACE FUNCTION get_popular_questions(limit_count INTEGER DEFAULT 10)
RETURNS SETOF question_library AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM question_library
  WHERE is_public = TRUE OR is_template = TRUE
  ORDER BY usage_count DESC, created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to duplicate question
CREATE OR REPLACE FUNCTION duplicate_question(source_question_id UUID)
RETURNS UUID AS $$
DECLARE
  new_question_id UUID;
  source_question question_library;
BEGIN
  -- Get source question
  SELECT * INTO source_question
  FROM question_library
  WHERE id = source_question_id
  AND (user_id = auth.uid() OR is_public = TRUE OR is_template = TRUE);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Question not found or access denied';
  END IF;

  -- Create duplicate
  INSERT INTO question_library (
    user_id,
    type,
    title,
    description,
    settings,
    category,
    tags,
    parent_question_id,
    metadata
  )
  VALUES (
    auth.uid(),
    source_question.type,
    source_question.title || ' (Copy)',
    source_question.description,
    source_question.settings,
    source_question.category,
    source_question.tags,
    source_question_id,
    source_question.metadata
  )
  RETURNING id INTO new_question_id;

  RETURN new_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON question_library TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON question_library TO authenticated;

-- Insert some default template questions
INSERT INTO question_library (user_id, type, title, description, settings, category, tags, is_template, is_public)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'infoajumapro@gmail.com' LIMIT 1),
  type,
  title,
  description,
  settings,
  category,
  tags,
  TRUE,
  TRUE
FROM (VALUES
  ('rating', 'How satisfied are you overall?', 'General satisfaction rating', '{"scale": 5, "labels": {"1": "Very Dissatisfied", "5": "Very Satisfied"}}'::jsonb, 'general', ARRAY['satisfaction', 'rating'], TRUE, TRUE),
  ('nps', 'How likely are you to recommend us?', 'Net Promoter Score', '{"minLabel": "Not at all likely", "maxLabel": "Extremely likely"}'::jsonb, 'general', ARRAY['nps', 'recommendation'], TRUE, TRUE),
  ('text', 'What did you like most?', 'Positive feedback', '{"placeholder": "Share what you enjoyed..."}'::jsonb, 'feedback', ARRAY['feedback', 'positive'], TRUE, TRUE),
  ('textarea', 'What could we improve?', 'Improvement suggestions', '{"placeholder": "Share your suggestions...", "rows": 4}'::jsonb, 'feedback', ARRAY['feedback', 'improvement'], TRUE, TRUE),
  ('email', 'What is your email address?', 'Contact information', '{"placeholder": "your@email.com"}'::jsonb, 'contact', ARRAY['email', 'contact'], TRUE, TRUE),
  ('yes_no', 'Would you use this again?', 'Repeat usage intent', '{"yesLabel": "Yes, definitely", "noLabel": "No, probably not"}'::jsonb, 'intent', ARRAY['intent', 'usage'], TRUE, TRUE)
) AS defaults(type, title, description, settings, category, tags, is_template, is_public)
WHERE (SELECT id FROM auth.users WHERE email = 'infoajumapro@gmail.com' LIMIT 1) IS NOT NULL;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Question library table created successfully!';
  RAISE NOTICE '✅ Indexes created for fast searching';
  RAISE NOTICE '✅ RLS policies enabled';
  RAISE NOTICE '✅ Helper functions created:';
  RAISE NOTICE '   - increment_question_usage(question_id)';
  RAISE NOTICE '   - search_questions(term, type, category, user_only)';
  RAISE NOTICE '   - get_popular_questions(limit)';
  RAISE NOTICE '   - duplicate_question(question_id)';
  RAISE NOTICE '✅ Default template questions added';
END $$;

