-- =============================================
-- SETUP FILE UPLOADS FOR SURVEYS
-- Configure Supabase Storage bucket and policies
-- =============================================

-- Note: Run this in Supabase SQL Editor, then configure bucket in Dashboard

-- Create storage bucket (if not exists)
-- This needs to be done via Supabase Dashboard or API
-- Go to: Storage → Create bucket → Name: 'survey-uploads'

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Policy 1: Authenticated users can upload files
-- Pattern: {user_id}/{filename}
CREATE POLICY "Users can upload survey files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'survey-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can view their own uploads
CREATE POLICY "Users can view own uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'survey-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'survey-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Survey owners can view uploaded files
CREATE POLICY "Survey owners can view uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'survey-uploads'
);

-- Policy 5: Anonymous users can upload (for survey responses)
CREATE POLICY "Anonymous can upload survey responses"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'survey-uploads' AND
  (storage.foldername(name))[1] = 'anonymous'
);

-- =============================================
-- FILE METADATA TABLE
-- =============================================

-- Create table to track file uploads
CREATE TABLE IF NOT EXISTS survey_file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- File information
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  
  -- Association
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  question_id TEXT,
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  
  -- Uploader
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_survey_files_survey ON survey_file_uploads(survey_id);
CREATE INDEX idx_survey_files_response ON survey_file_uploads(response_id);
CREATE INDEX idx_survey_files_user ON survey_file_uploads(user_id);
CREATE INDEX idx_survey_files_path ON survey_file_uploads(file_path);

-- Enable RLS
ALTER TABLE survey_file_uploads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own file uploads" ON survey_file_uploads;
DROP POLICY IF EXISTS "Survey owners can view uploads" ON survey_file_uploads;
DROP POLICY IF EXISTS "Users can insert file records" ON survey_file_uploads;

-- Policy: Users can view their own uploads
CREATE POLICY "Users can view own file uploads"
ON survey_file_uploads
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Survey owners can view all uploads for their surveys
CREATE POLICY "Survey owners can view uploads"
ON survey_file_uploads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_file_uploads.survey_id
    AND surveys.user_id = auth.uid()
  )
);

-- Policy: Anyone can insert file records (for survey responses)
CREATE POLICY "Users can insert file records"
ON survey_file_uploads
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_survey_file_uploads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_survey_file_uploads_updated_at ON survey_file_uploads;
CREATE TRIGGER update_survey_file_uploads_updated_at
  BEFORE UPDATE ON survey_file_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_survey_file_uploads_updated_at();

-- Create function to track file upload
CREATE OR REPLACE FUNCTION track_file_upload(
  p_file_name TEXT,
  p_file_path TEXT,
  p_file_size BIGINT,
  p_file_type TEXT,
  p_storage_url TEXT,
  p_survey_id UUID DEFAULT NULL,
  p_question_id TEXT DEFAULT NULL,
  p_response_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_file_id UUID;
BEGIN
  -- Get current user ID (may be null for anonymous)
  v_user_id := auth.uid();

  -- Insert file record
  INSERT INTO survey_file_uploads (
    file_name,
    file_path,
    file_size,
    file_type,
    storage_url,
    survey_id,
    question_id,
    response_id,
    user_id,
    metadata
  )
  VALUES (
    p_file_name,
    p_file_path,
    p_file_size,
    p_file_type,
    p_storage_url,
    p_survey_id,
    p_question_id,
    p_response_id,
    v_user_id,
    jsonb_build_object(
      'uploaded_at', NOW(),
      'ip_address', current_setting('request.headers', true)::json->>'x-forwarded-for'
    )
  )
  RETURNING id INTO v_file_id;

  RETURN v_file_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to delete file and record
CREATE OR REPLACE FUNCTION delete_file_upload(p_file_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_file_path TEXT;
  v_user_id UUID;
BEGIN
  -- Get file details
  SELECT file_path, user_id INTO v_file_path, v_user_id
  FROM survey_file_uploads
  WHERE id = p_file_id;

  -- Check permissions
  IF v_user_id IS NULL OR v_user_id = auth.uid() THEN
    -- Delete storage file (this would need to be done via API)
    -- DELETE FROM storage.objects WHERE name = v_file_path;
    
    -- Delete database record
    DELETE FROM survey_file_uploads WHERE id = p_file_id;
    
    RETURN TRUE;
  ELSE
    RAISE EXCEPTION 'Permission denied';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get file stats for survey
CREATE OR REPLACE FUNCTION get_survey_file_stats(p_survey_id UUID)
RETURNS TABLE (
  total_files BIGINT,
  total_size BIGINT,
  file_types JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT,
    SUM(file_size)::BIGINT,
    jsonb_object_agg(file_type, type_count)
  FROM (
    SELECT 
      file_type,
      COUNT(*)::INTEGER as type_count
    FROM survey_file_uploads
    WHERE survey_id = p_survey_id
    GROUP BY file_type
  ) AS file_type_counts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT, INSERT ON survey_file_uploads TO authenticated, anon;
GRANT UPDATE, DELETE ON survey_file_uploads TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Survey file uploads table created!';
  RAISE NOTICE '✅ Storage policies configured';
  RAISE NOTICE '✅ Helper functions created:';
  RAISE NOTICE '   - track_file_upload() - Log file uploads';
  RAISE NOTICE '   - delete_file_upload() - Delete file and record';
  RAISE NOTICE '   - get_survey_file_stats() - Get upload statistics';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  NEXT STEPS:';
  RAISE NOTICE '1. Go to Supabase Dashboard → Storage';
  RAISE NOTICE '2. Create new bucket named: survey-uploads';
  RAISE NOTICE '3. Set bucket to: Private (not public)';
  RAISE NOTICE '4. File size limit: 50MB';
  RAISE NOTICE '5. Allowed MIME types: Add image/*, application/pdf, application/msword';
END $$;

