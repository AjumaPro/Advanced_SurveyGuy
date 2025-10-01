-- =============================================
-- CREATE SURVEY INVITATIONS TABLE
-- For tracking survey invitations sent via email
-- =============================================

-- Drop existing table if exists (for clean setup)
DROP TABLE IF EXISTS survey_invitations CASCADE;

-- Create survey invitations table
CREATE TABLE survey_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Survey and sender information
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  sent_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Recipient information
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  
  -- Invitation details
  subject TEXT NOT NULL,
  message TEXT,
  custom_message TEXT,
  
  -- Unique invitation link
  invitation_token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  invitation_url TEXT,
  
  -- Tracking
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  -- Status values: 'pending', 'sent', 'opened', 'clicked', 'responded', 'bounced', 'failed'
  
  -- Email delivery tracking
  email_id TEXT, -- Resend email ID
  delivery_status TEXT,
  bounce_reason TEXT,
  
  -- Response tracking
  response_id UUID REFERENCES survey_responses(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_survey_invitations_survey ON survey_invitations(survey_id);
CREATE INDEX idx_survey_invitations_sender ON survey_invitations(sent_by);
CREATE INDEX idx_survey_invitations_email ON survey_invitations(recipient_email);
CREATE INDEX idx_survey_invitations_token ON survey_invitations(invitation_token);
CREATE INDEX idx_survey_invitations_status ON survey_invitations(status);
CREATE INDEX idx_survey_invitations_sent_at ON survey_invitations(sent_at DESC);

-- Enable Row Level Security
ALTER TABLE survey_invitations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own survey invitations" ON survey_invitations;
DROP POLICY IF EXISTS "Users can create invitations for own surveys" ON survey_invitations;
DROP POLICY IF EXISTS "Users can update own survey invitations" ON survey_invitations;
DROP POLICY IF EXISTS "Public can view invitation by token" ON survey_invitations;
DROP POLICY IF EXISTS "System can update invitation tracking" ON survey_invitations;

-- Policy 1: Users can view invitations for their own surveys
CREATE POLICY "Users can view own survey invitations"
ON survey_invitations 
FOR SELECT
TO authenticated
USING (
  sent_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = survey_invitations.survey_id 
    AND surveys.user_id = auth.uid()
  )
);

-- Policy 2: Users can create invitations for their own surveys
CREATE POLICY "Users can create invitations for own surveys"
ON survey_invitations 
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = survey_invitations.survey_id 
    AND surveys.user_id = auth.uid()
    AND surveys.status = 'published'
  )
);

-- Policy 3: Users can update invitations for their own surveys
CREATE POLICY "Users can update own survey invitations"
ON survey_invitations 
FOR UPDATE
TO authenticated
USING (
  sent_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM surveys 
    WHERE surveys.id = survey_invitations.survey_id 
    AND surveys.user_id = auth.uid()
  )
);

-- Policy 4: Anyone can view invitation by token (for accessing survey)
CREATE POLICY "Public can view invitation by token"
ON survey_invitations 
FOR SELECT
TO anon, authenticated
USING (invitation_token IS NOT NULL);

-- Policy 5: Service role can update tracking (for webhooks)
CREATE POLICY "System can update invitation tracking"
ON survey_invitations 
FOR UPDATE
TO service_role
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_survey_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_survey_invitations_updated_at ON survey_invitations;
CREATE TRIGGER update_survey_invitations_updated_at
  BEFORE UPDATE ON survey_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_survey_invitations_updated_at();

-- Create function to track invitation opens
CREATE OR REPLACE FUNCTION track_invitation_opened(token UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE survey_invitations
  SET 
    opened_at = COALESCE(opened_at, NOW()),
    status = CASE WHEN status = 'sent' THEN 'opened' ELSE status END
  WHERE invitation_token = token
  AND opened_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track invitation clicks
CREATE OR REPLACE FUNCTION track_invitation_clicked(token UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE survey_invitations
  SET 
    clicked_at = COALESCE(clicked_at, NOW()),
    status = CASE WHEN status IN ('sent', 'opened') THEN 'clicked' ELSE status END
  WHERE invitation_token = token
  AND clicked_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to link invitation to response
CREATE OR REPLACE FUNCTION link_invitation_to_response(token UUID, resp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE survey_invitations
  SET 
    responded_at = COALESCE(responded_at, NOW()),
    response_id = resp_id,
    status = 'responded'
  WHERE invitation_token = token
  AND response_id IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get invitation stats for a survey
CREATE OR REPLACE FUNCTION get_survey_invitation_stats(survey_uuid UUID)
RETURNS TABLE (
  total_sent BIGINT,
  total_opened BIGINT,
  total_clicked BIGINT,
  total_responded BIGINT,
  open_rate NUMERIC,
  click_rate NUMERIC,
  response_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_sent,
    COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::BIGINT as total_opened,
    COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::BIGINT as total_clicked,
    COUNT(*) FILTER (WHERE responded_at IS NOT NULL)::BIGINT as total_responded,
    CASE WHEN COUNT(*) > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as open_rate,
    CASE WHEN COUNT(*) > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as click_rate,
    CASE WHEN COUNT(*) > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE responded_at IS NOT NULL)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as response_rate
  FROM survey_invitations
  WHERE survey_id = survey_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON survey_invitations TO authenticated;
GRANT INSERT ON survey_invitations TO authenticated;
GRANT UPDATE ON survey_invitations TO authenticated, service_role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Survey invitations table created successfully!';
  RAISE NOTICE 'Indexes created for optimal query performance';
  RAISE NOTICE 'RLS policies enabled for security';
  RAISE NOTICE 'Tracking functions created (opens, clicks, responses)';
  RAISE NOTICE 'Statistics function available: get_survey_invitation_stats(survey_id)';
END $$;

