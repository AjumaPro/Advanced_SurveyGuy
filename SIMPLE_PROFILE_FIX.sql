-- =============================================
-- SIMPLE PROFILE FIX - NO ERRORS
-- =============================================
-- Run this step by step in Supabase SQL Editor

-- STEP 1: Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop all existing policies (this removes any conflicts)
DROP POLICY IF EXISTS "users_view_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON profiles;

-- STEP 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create simple policies (no recursion)
CREATE POLICY "users_view_own_profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- STEP 5: Add missing columns if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false, "marketing": false}';

-- STEP 6: Refresh schema
NOTIFY pgrst, 'reload schema';

-- STEP 7: Test - show current profile
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
    role,
    plan
FROM profiles 
WHERE id = auth.uid();

-- STEP 8: Success message
SELECT 'Profile editing setup completed successfully!' as status;
