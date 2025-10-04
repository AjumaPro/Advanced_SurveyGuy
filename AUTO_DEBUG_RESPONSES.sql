-- Auto-debug script that finds the most recent user automatically
-- This script will debug the most recently created user

DO $$
DECLARE
    user_id_to_check UUID;
    user_email TEXT;
    survey_count INTEGER;
    response_count INTEGER;
    rec RECORD;
BEGIN
    -- Find the most recent user
    SELECT u.id, u.email INTO user_id_to_check, user_email
    FROM auth.users u
    ORDER BY u.created_at DESC
    LIMIT 1;
    
    IF user_id_to_check IS NULL THEN
        RAISE NOTICE 'No users found in the system';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Debugging user: % (%)', user_email, user_id_to_check;
    
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
    
    -- Check for potential issues
    IF response_count > survey_count * 100 THEN
        RAISE NOTICE 'WARNING: Very high response count detected! This might indicate duplicate data.';
    END IF;
    
END $$;

-- Check for duplicate responses across all users
DO $$
DECLARE
    duplicate_count INTEGER;
    total_responses INTEGER;
BEGIN
    -- Check for exact duplicates (same survey_id, responses, submitted_at)
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT survey_id, responses, submitted_at, COUNT(*)
        FROM survey_responses
        GROUP BY survey_id, responses, submitted_at
        HAVING COUNT(*) > 1
    ) duplicates;
    
    -- Get total responses
    SELECT COUNT(*) INTO total_responses FROM survey_responses;
    
    RAISE NOTICE 'Total responses in system: %', total_responses;
    RAISE NOTICE 'Potential duplicate responses: %', duplicate_count;
    
    IF duplicate_count > 0 THEN
        RAISE NOTICE 'Duplicates found! Consider running cleanup script.';
    END IF;
END $$;

-- Check for orphaned responses
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
    
    IF orphaned_count > 0 THEN
        RAISE NOTICE 'Orphaned responses found! These should be cleaned up.';
    END IF;
END $$;
