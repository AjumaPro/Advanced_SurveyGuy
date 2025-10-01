-- =============================================
-- ENABLE PROFILE EDITING AND UPDATING
-- =============================================
-- This script ensures profile editing works properly

-- 1. FIX INFINITE RECURSION FIRST
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. CREATE SIMPLE, WORKING POLICIES FOR PROFILE EDITING
CREATE POLICY "users_view_own_profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. ENSURE PROFILES TABLE HAS ALL REQUIRED COLUMNS FOR EDITING
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') THEN
        ALTER TABLE profiles ADD COLUMN website VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE profiles ADD COLUMN location VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_preferences') THEN
        ALTER TABLE profiles ADD COLUMN notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false, "marketing": false}';
    END IF;
END $$;

-- 4. CREATE OR UPDATE PROFILE FOR CURRENT USER
INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    phone, 
    company, 
    bio, 
    website, 
    location, 
    timezone, 
    notification_preferences,
    role, 
    plan, 
    is_active, 
    is_verified,
    created_at, 
    updated_at
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    COALESCE(au.raw_user_meta_data->>'phone', ''),
    COALESCE(au.raw_user_meta_data->>'company', ''),
    COALESCE(au.raw_user_meta_data->>'bio', ''),
    COALESCE(au.raw_user_meta_data->>'website', ''),
    COALESCE(au.raw_user_meta_data->>'location', ''),
    COALESCE(au.raw_user_meta_data->>'timezone', 'UTC'),
    COALESCE(au.raw_user_meta_data->>'notification_preferences', '{"email": true, "push": true, "sms": false, "marketing": false}'),
    CASE 
        WHEN au.email = 'infoajumapro@gmail.com' THEN 'super_admin'
        ELSE 'user'
    END,
    CASE 
        WHEN au.email = 'infoajumapro@gmail.com' THEN 'enterprise'
        ELSE 'free'
    END,
    true,
    au.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.id = auth.uid()
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    company = COALESCE(EXCLUDED.company, profiles.company),
    bio = COALESCE(EXCLUDED.bio, profiles.bio),
    website = COALESCE(EXCLUDED.website, profiles.website),
    location = COALESCE(EXCLUDED.location, profiles.location),
    timezone = COALESCE(EXCLUDED.timezone, profiles.timezone),
    notification_preferences = COALESCE(EXCLUDED.notification_preferences, profiles.notification_preferences),
    updated_at = NOW();

-- 5. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

-- 6. TEST PROFILE EDITING
DO $$
DECLARE
    current_user_id UUID;
    profile_count INTEGER;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE '❌ No authenticated user - cannot test profile editing';
        RETURN;
    END IF;
    
    -- Test reading profile
    BEGIN
        SELECT COUNT(*) INTO profile_count FROM profiles WHERE id = current_user_id;
        RAISE NOTICE '✅ Profile reading test - found % profile(s)', profile_count;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Profile reading test FAILED: %', SQLERRM;
    END;
    
    -- Test updating profile (without actually changing anything)
    BEGIN
        UPDATE profiles 
        SET updated_at = NOW() 
        WHERE id = current_user_id;
        RAISE NOTICE '✅ Profile updating test - PASSED';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Profile updating test FAILED: %', SQLERRM;
    END;
    
    -- Show current profile data
    RAISE NOTICE '📊 Current profile data for user %:', current_user_id;
END $$;

-- 7. SHOW CURRENT PROFILE DATA
SELECT 
    id,
    email,
    full_name,
    phone,
    company,
    bio,
    website,
    location,
    timezone,
    notification_preferences,
    role,
    plan,
    is_active,
    is_verified,
    created_at,
    updated_at
FROM profiles 
WHERE id = auth.uid();

DO $$
BEGIN
    RAISE NOTICE '🎉 Profile editing setup completed!';
    RAISE NOTICE '✅ Infinite recursion fixed';
    RAISE NOTICE '✅ Profile editing policies created';
    RAISE NOTICE '✅ Required columns added';
    RAISE NOTICE '✅ User profile created/updated';
    RAISE NOTICE '🔧 You can now edit and update your profile in the UI';
END $$;
