-- Debug script to investigate response counting issue
-- This script will help identify why there are 2000+ responses for 1 survey

-- 1. Check total surveys for a specific user (replace with actual user ID)
DO $$
DECLARE
    user_id_to_check UUID := 'your-user-id-here'; -- Replace with actual user ID
    survey_count INTEGER;
    response_count INTEGER;
    rec RECORD;
BEGIN
    -- Count surveys for the user
    SELECT COUNT(*) INTO survey_count 
    FROM surveys 
    WHERE user_id = user_id_to_check;
    
    RAISE NOTICE 'Total surveys for user: %', survey_count;
    
    -- Count total responses across all user's surveys
    SELECT COUNT(*) INTO response_count
    FROM survey_responses sr
    INNER JOIN surveys s ON sr.survey_id = s.id
    WHERE s.user_id = user_id_to_check;
    
    RAISE NOTICE 'Total responses for user: %', response_count;
    
    -- Show breakdown by survey
    RAISE NOTICE 'Response breakdown by survey:';
    FOR rec IN 
        SELECT s.title, s.id, COUNT(sr.id) as response_count
        FROM surveys s
        LEFT JOIN survey_responses sr ON s.id = sr.survey_id
        WHERE s.user_id = user_id_to_check
        GROUP BY s.id, s.title
        ORDER BY response_count DESC
    LOOP
        RAISE NOTICE 'Survey: % (ID: %) - Responses: %', rec.title, rec.id, rec.response_count;
    END LOOP;
END $$;

-- 2. Check for duplicate responses
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- Check for exact duplicates (same survey_id, responses, submitted_at)
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT survey_id, responses, submitted_at, COUNT(*)
        FROM survey_responses
        GROUP BY survey_id, responses, submitted_at
        HAVING COUNT(*) > 1
    ) duplicates;
    
    RAISE NOTICE 'Potential duplicate responses: %', duplicate_count;
END $$;

-- 3. Check for responses with invalid survey_ids
DO $$
DECLARE
    orphaned_count INTEGER;
BEGIN
    -- Check for responses that don't have a valid survey
    SELECT COUNT(*) INTO orphaned_count
    FROM survey_responses sr
    LEFT JOIN surveys s ON sr.survey_id = s.id
    WHERE s.id IS NULL;
    
    RAISE NOTICE 'Orphaned responses (no valid survey): %', orphaned_count;
END $$;

-- 4. Check for test/development data
DO $$
DECLARE
    test_response_count INTEGER;
BEGIN
    -- Check for responses that might be test data
    SELECT COUNT(*) INTO test_response_count
    FROM survey_responses
    WHERE 
        responses::text LIKE '%test%' OR
        responses::text LIKE '%demo%' OR
        responses::text LIKE '%sample%' OR
        submitted_at < '2024-01-01'; -- Very old responses
    
    RAISE NOTICE 'Potential test/old responses: %', test_response_count;
END $$;

-- 5. Clean up duplicate responses (if found)
-- Uncomment and run only if duplicates are found
/*
DELETE FROM survey_responses 
WHERE id IN (
    SELECT id FROM (
        SELECT id, 
               ROW_NUMBER() OVER (
                   PARTITION BY survey_id, responses, submitted_at 
                   ORDER BY created_at
               ) as rn
        FROM survey_responses
    ) t
    WHERE rn > 1
);
*/

-- 6. Clean up orphaned responses (if found)
-- Uncomment and run only if orphaned responses are found
/*
DELETE FROM survey_responses 
WHERE survey_id NOT IN (SELECT id FROM surveys);
*/

-- 7. Update user analytics with correct counts
DO $$
DECLARE
    user_id_to_update UUID := 'your-user-id-here'; -- Replace with actual user ID
    correct_survey_count INTEGER;
    correct_response_count INTEGER;
BEGIN
    -- Get correct counts
    SELECT COUNT(*) INTO correct_survey_count 
    FROM surveys 
    WHERE user_id = user_id_to_update;
    
    SELECT COUNT(*) INTO correct_response_count
    FROM survey_responses sr
    INNER JOIN surveys s ON sr.survey_id = s.id
    WHERE s.user_id = user_id_to_update;
    
    -- Update or insert user analytics
    INSERT INTO user_analytics (user_id, total_surveys, total_responses, updated_at)
    VALUES (user_id_to_update, correct_survey_count, correct_response_count, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        total_surveys = correct_survey_count,
        total_responses = correct_response_count,
        updated_at = NOW();
    
    RAISE NOTICE 'Updated user analytics - Surveys: %, Responses: %', correct_survey_count, correct_response_count;
END $$;
