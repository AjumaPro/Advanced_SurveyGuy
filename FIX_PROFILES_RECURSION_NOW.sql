-- =============================================
-- IMMEDIATE FIX FOR INFINITE RECURSION ERROR
-- Run this NOW in Supabase SQL Editor
-- =============================================

-- Step 1: Disable RLS to clear the problem
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (removes recursion)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create SIMPLE policies (NO RECURSION)

-- Policy 1: Users can view their own profile
CREATE POLICY "users_select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy 2: Users can update their own profile  
CREATE POLICY "users_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Policy 3: Users can insert their own profile
CREATE POLICY "users_insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Step 5: Create helper function for admin check (NO TABLE ACCESS)
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check email directly from JWT token (NO TABLE ACCESS)
    RETURN (auth.jwt() ->> 'email') = 'infoajumapro@gmail.com';
END;
$$;

-- Step 6: Admin policies using helper function (NO RECURSION)
CREATE POLICY "admin_select_all_profiles"
ON profiles FOR SELECT
TO authenticated
USING (is_super_admin());

CREATE POLICY "admin_update_all_profiles"
ON profiles FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

CREATE POLICY "admin_insert_profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (is_super_admin());

-- Step 7: Force schema cache refresh
NOTIFY pgrst, 'reload schema';

-- Step 8: Verify policies are correct
SELECT 
    policyname,
    cmd as operation,
    qual as using_expression,
    with_check as check_expression
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Infinite recursion FIXED!';
    RAISE NOTICE '✅ RLS policies recreated without recursion';
    RAISE NOTICE '✅ Schema cache refreshed';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next steps:';
    RAISE NOTICE '1. Refresh your browser (Ctrl+R or Cmd+R)';
    RAISE NOTICE '2. Navigate to /app/account';
    RAISE NOTICE '3. Profile should load without errors';
END $$;

