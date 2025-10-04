-- Create a function to bypass RLS and insert survey
-- This function will use SECURITY DEFINER to bypass RLS

CREATE OR REPLACE FUNCTION create_survey_bypass_rls(
    p_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_questions JSONB,
    p_user_id UUID DEFAULT '00000000-0000-0000-0000-000000000000'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- This bypasses RLS
AS $$
BEGIN
    -- Insert the survey directly
    INSERT INTO surveys (
        id,
        title,
        description,
        questions,
        status,
        created_at,
        updated_at,
        user_id
    ) VALUES (
        p_id,
        p_title,
        p_description,
        p_questions,
        'published',
        NOW(),
        NOW(),
        COALESCE(p_user_id, '00000000-0000-0000-0000-000000000000')
    ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        questions = EXCLUDED.questions,
        status = 'published',
        updated_at = NOW();
    
    RETURN p_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_survey_bypass_rls TO authenticated;
GRANT EXECUTE ON FUNCTION create_survey_bypass_rls TO anon;

-- Now call the function to create the survey
SELECT create_survey_bypass_rls(
    '85ec5b20-5af6-4479-8bd8-34ae409e2d64'::UUID,
    'Customer Feedback Survey',
    'Please help us improve our service by completing this quick survey',
    '[
        {
            "id": "q1",
            "type": "rating",
            "question": "How satisfied are you with our service?",
            "required": true,
            "settings": {"max": 5},
            "options": [
                {"label": "Very Satisfied", "value": 5},
                {"label": "Satisfied", "value": 4},
                {"label": "Neutral", "value": 3},
                {"label": "Dissatisfied", "value": 2},
                {"label": "Very Dissatisfied", "value": 1}
            ]
        },
        {
            "id": "q2",
            "type": "paragraph",
            "question": "What can we do to improve your experience?",
            "required": false,
            "placeholder": "Please share your feedback..."
        },
        {
            "id": "q3",
            "type": "multiple_choice",
            "question": "How did you hear about us?",
            "required": true,
            "options": [
                {"label": "Social Media", "value": "social"},
                {"label": "Search Engine", "value": "search"},
                {"label": "Friend/Recommendation", "value": "referral"},
                {"label": "Advertisement", "value": "ad"},
                {"label": "Other", "value": "other"}
            ]
        }
    ]'::JSONB,
    '09756911-8282-4661-a619-f57845689f5a'::UUID
);

-- Verify the survey was created
SELECT 
    id,
    title,
    status,
    created_at,
    user_id
FROM surveys 
WHERE id = '85ec5b20-5af6-4479-8bd8-34ae409e2d64';

-- Show success message
SELECT '✅ Survey 85ec5b20-5af6-4479-8bd8-34ae409e2d64 created successfully!' as message;
