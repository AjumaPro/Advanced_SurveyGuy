-- =============================================
-- CREATE CONTACT SUBMISSIONS TABLE
-- For storing contact form submissions
-- =============================================

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS contact_submissions CASCADE;

-- Create contact submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'new',
  
  -- Optional fields
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_priority ON contact_submissions(priority);
CREATE INDEX idx_contact_category ON contact_submissions(category);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_user ON contact_submissions(user_id);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON contact_submissions;

-- Policy 1: Anyone (including anonymous users) can submit contact form
CREATE POLICY "Anyone can submit contact form"
ON contact_submissions 
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 2: Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON contact_submissions 
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Policy 3: Admins can update submissions
CREATE POLICY "Admins can update submissions"
ON contact_submissions 
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Policy 4: Users can view their own submissions (if logged in)
CREATE POLICY "Users can view own submissions"
ON contact_submissions 
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_submissions_updated_at();

-- Create helper function to get submission stats
CREATE OR REPLACE FUNCTION get_contact_submission_stats()
RETURNS TABLE (
  total_submissions BIGINT,
  new_submissions BIGINT,
  in_progress_submissions BIGINT,
  resolved_submissions BIGINT,
  high_priority_submissions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_submissions,
    COUNT(*) FILTER (WHERE status = 'new')::BIGINT as new_submissions,
    COUNT(*) FILTER (WHERE status = 'in_progress')::BIGINT as in_progress_submissions,
    COUNT(*) FILTER (WHERE status = 'resolved')::BIGINT as resolved_submissions,
    COUNT(*) FILTER (WHERE priority IN ('high', 'urgent'))::BIGINT as high_priority_submissions
  FROM contact_submissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON contact_submissions TO anon, authenticated;
GRANT INSERT ON contact_submissions TO anon, authenticated;
GRANT UPDATE ON contact_submissions TO authenticated;

-- Insert sample data for testing (optional)
-- INSERT INTO contact_submissions (name, email, subject, message, category, priority)
-- VALUES 
--   ('Test User', 'test@example.com', 'Test Submission', 'This is a test message', 'general', 'low'),
--   ('Admin Test', 'admin@example.com', 'Urgent Issue', 'This needs immediate attention', 'support', 'urgent');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Contact submissions table created successfully!';
  RAISE NOTICE 'Indexes created for optimal query performance';
  RAISE NOTICE 'RLS policies enabled for security';
  RAISE NOTICE 'Triggers set up for automatic timestamp updates';
END $$;

