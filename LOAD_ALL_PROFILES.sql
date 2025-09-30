-- =============================================
-- LOAD ALL EXISTING PROFILES
-- =============================================
-- This script loads and displays all existing user profiles
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. LOAD ALL PROFILES WITH DETAILS
-- =============================================

-- Get all profiles with comprehensive information
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.plan,
    p.is_active,
    p.is_verified,
    p.company,
    p.phone,
    p.timezone,
    p.language,
    p.subscription_status,
    p.subscription_start_date,
    p.subscription_end_date,
    p.last_login,
    p.created_at,
    p.updated_at,
    -- Count related data
    (SELECT COUNT(*) FROM surveys s WHERE s.user_id = p.id) as survey_count,
    (SELECT COUNT(*) FROM survey_responses sr WHERE sr.user_id = p.id) as response_count,
    (SELECT COUNT(*) FROM events e WHERE e.user_id = p.id) as event_count
FROM profiles p
ORDER BY p.created_at DESC;

-- =============================================
-- 2. PROFILE SUMMARY STATISTICS
-- =============================================

-- Get summary statistics
SELECT 
    'Total Profiles' as metric,
    COUNT(*) as count
FROM profiles

UNION ALL

SELECT 
    'Active Profiles' as metric,
    COUNT(*) as count
FROM profiles 
WHERE is_active = true

UNION ALL

SELECT 
    'Verified Profiles' as metric,
    COUNT(*) as count
FROM profiles 
WHERE is_verified = true

UNION ALL

SELECT 
    'Super Admins' as metric,
    COUNT(*) as count
FROM profiles 
WHERE role = 'super_admin'

UNION ALL

SELECT 
    'Admins' as metric,
    COUNT(*) as count
FROM profiles 
WHERE role = 'admin'

UNION ALL

SELECT 
    'Regular Users' as metric,
    COUNT(*) as count
FROM profiles 
WHERE role = 'user'

UNION ALL

SELECT 
    'Free Plan Users' as metric,
    COUNT(*) as count
FROM profiles 
WHERE plan = 'free'

UNION ALL

SELECT 
    'Pro Plan Users' as metric,
    COUNT(*) as count
FROM profiles 
WHERE plan = 'pro'

UNION ALL

SELECT 
    'Enterprise Plan Users' as metric,
    COUNT(*) as count
FROM profiles 
WHERE plan = 'enterprise'

ORDER BY metric;

-- =============================================
-- 3. RECENT PROFILES (LAST 30 DAYS)
-- =============================================

-- Get profiles created in the last 30 days
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.plan,
    p.is_active,
    p.created_at,
    EXTRACT(DAYS FROM (NOW() - p.created_at)) as days_ago
FROM profiles p
WHERE p.created_at >= NOW() - INTERVAL '30 days'
ORDER BY p.created_at DESC;

-- =============================================
-- 4. PROFILES BY ROLE
-- =============================================

-- Group profiles by role
SELECT 
    p.role,
    COUNT(*) as count,
    COUNT(CASE WHEN p.is_active = true THEN 1 END) as active_count,
    COUNT(CASE WHEN p.is_verified = true THEN 1 END) as verified_count
FROM profiles p
GROUP BY p.role
ORDER BY count DESC;

-- =============================================
-- 5. PROFILES BY PLAN
-- =============================================

-- Group profiles by subscription plan
SELECT 
    p.plan,
    COUNT(*) as count,
    COUNT(CASE WHEN p.is_active = true THEN 1 END) as active_count,
    COUNT(CASE WHEN p.is_verified = true THEN 1 END) as verified_count
FROM profiles p
GROUP BY p.plan
ORDER BY count DESC;

-- =============================================
-- 6. PROFILES WITH MISSING DATA
-- =============================================

-- Find profiles with missing or incomplete data
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.plan,
    CASE 
        WHEN p.email IS NULL OR p.email = '' THEN 'Missing Email'
        WHEN p.full_name IS NULL OR p.full_name = '' THEN 'Missing Full Name'
        WHEN p.role IS NULL OR p.role = '' THEN 'Missing Role'
        WHEN p.plan IS NULL OR p.plan = '' THEN 'Missing Plan'
        ELSE 'Complete'
    END as data_status,
    p.created_at
FROM profiles p
WHERE 
    p.email IS NULL OR p.email = '' OR
    p.full_name IS NULL OR p.full_name = '' OR
    p.role IS NULL OR p.role = '' OR
    p.plan IS NULL OR p.plan = ''
ORDER BY p.created_at DESC;

-- =============================================
-- 7. PROFILES WITH ACTIVITY
-- =============================================

-- Get profiles with recent activity (surveys, responses, events)
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.plan,
    p.last_login,
    (SELECT COUNT(*) FROM surveys s WHERE s.user_id = p.id) as survey_count,
    (SELECT COUNT(*) FROM survey_responses sr WHERE sr.user_id = p.id) as response_count,
    (SELECT COUNT(*) FROM events e WHERE e.user_id = p.id) as event_count,
    (SELECT MAX(created_at) FROM surveys s WHERE s.user_id = p.id) as last_survey_created,
    (SELECT MAX(created_at) FROM survey_responses sr WHERE sr.user_id = p.id) as last_response_submitted
FROM profiles p
WHERE 
    EXISTS (SELECT 1 FROM surveys s WHERE s.user_id = p.id) OR
    EXISTS (SELECT 1 FROM survey_responses sr WHERE sr.user_id = p.id) OR
    EXISTS (SELECT 1 FROM events e WHERE e.user_id = p.id)
ORDER BY p.last_login DESC NULLS LAST;

-- =============================================
-- 8. EXPORT PROFILES DATA
-- =============================================

-- Export all profiles data for backup/analysis
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.plan,
    p.is_active,
    p.is_verified,
    p.company,
    p.phone,
    p.timezone,
    p.language,
    p.subscription_status,
    p.subscription_start_date,
    p.subscription_end_date,
    p.last_login,
    p.created_at,
    p.updated_at
FROM profiles p
ORDER BY p.created_at DESC;

-- =============================================
-- 9. VERIFICATION SUMMARY
-- =============================================

DO $$
DECLARE
    total_profiles INTEGER;
    active_profiles INTEGER;
    verified_profiles INTEGER;
    super_admins INTEGER;
    admins INTEGER;
    regular_users INTEGER;
BEGIN
    -- Get counts
    SELECT COUNT(*) INTO total_profiles FROM profiles;
    SELECT COUNT(*) INTO active_profiles FROM profiles WHERE is_active = true;
    SELECT COUNT(*) INTO verified_profiles FROM profiles WHERE is_verified = true;
    SELECT COUNT(*) INTO super_admins FROM profiles WHERE role = 'super_admin';
    SELECT COUNT(*) INTO admins FROM profiles WHERE role = 'admin';
    SELECT COUNT(*) INTO regular_users FROM profiles WHERE role = 'user';
    
    RAISE NOTICE '📊 PROFILE LOADING COMPLETE';
    RAISE NOTICE '================================';
    RAISE NOTICE '👥 Total Profiles: %', total_profiles;
    RAISE NOTICE '✅ Active Profiles: %', active_profiles;
    RAISE NOTICE '🔐 Verified Profiles: %', verified_profiles;
    RAISE NOTICE '👑 Super Admins: %', super_admins;
    RAISE NOTICE '🛡️ Admins: %', admins;
    RAISE NOTICE '👤 Regular Users: %', regular_users;
    RAISE NOTICE '================================';
    RAISE NOTICE '🎯 All profiles loaded successfully!';
END $$;
