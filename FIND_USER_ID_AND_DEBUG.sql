-- Step 1: Find your user ID first
-- Run this query to get all users and their IDs

SELECT 
    u.id as user_id,
    u.email,
    u.created_at as user_created,
    p.full_name,
    p.plan,
    p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Step 2: Once you have your user ID, replace it in the debug script below
-- Copy your user ID from the results above and paste it in the script below

-- DEBUG SCRIPT (replace 'PASTE_YOUR_USER_ID_HERE' with actual UUID)
DO $$
DECLARE
    user_id_to_check UUID := 'PASTE_YOUR_USER_ID_HERE'; -- Replace with actual user ID from Step 1
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

-- Step 3: Check for duplicate responses
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

-- Step 4: Check for responses with invalid survey_ids
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

-- Step 5: Check for test/development data
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






