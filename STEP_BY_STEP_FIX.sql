-- =============================================
-- STEP BY STEP PROFILE FIX
-- =============================================
-- Run each command one by one in Supabase SQL Editor

-- COMMAND 1: Disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- COMMAND 2: Drop all policies (copy and paste all at once)
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

-- COMMAND 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- COMMAND 4: Create view policy
CREATE POLICY "users_view_own_profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- COMMAND 5: Create update policy
CREATE POLICY "users_update_own_profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- COMMAND 6: Create insert policy
CREATE POLICY "users_insert_own_profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- COMMAND 7: Add bio column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- COMMAND 8: Add website column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website VARCHAR(255);

-- COMMAND 9: Add location column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- COMMAND 10: Add notification preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false, "marketing": false}';

-- COMMAND 11: Refresh schema
NOTIFY pgrst, 'reload schema';

-- COMMAND 12: Test - check your profile
SELECT * FROM profiles WHERE id = auth.uid();
