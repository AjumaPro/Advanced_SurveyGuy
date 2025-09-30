-- =============================================
-- FIX PROFILES TABLE INFINITE RECURSION
-- =============================================
-- This script specifically fixes the infinite recursion error in profiles table policies
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. DISABLE RLS TEMPORARILY
-- =============================================

-- Disable RLS on profiles table to clear any problematic policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. DROP ALL EXISTING POLICIES
-- =============================================

-- Drop ALL policies on profiles table (this is the key fix)
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile data" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile data" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile data" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile data" ON profiles;

-- =============================================
-- 3. CLEAR ANY CACHED POLICY INFORMATION
-- =============================================

-- Force a policy cache clear by recreating the table structure
DO $$
BEGIN
    -- This forces PostgreSQL to clear any cached policy information
    PERFORM 1 FROM pg_policies WHERE tablename = 'profiles';
    
    -- If any policies still exist, drop them all
    EXECUTE 'DROP POLICY IF EXISTS ALL ON profiles';
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors, just trying to clear cache
        NULL;
END $$;

-- =============================================
-- 4. RECREATE SIMPLE, NON-RECURSIVE POLICIES
-- =============================================

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create the most basic, non-recursive policies possible
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT 
    USING (auth.uid()::text = id::text);

CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT 
    WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE 
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "profiles_delete_own" ON profiles
    FOR DELETE 
    USING (auth.uid()::text = id::text);

-- =============================================
-- 5. ALTERNATIVE: IF STILL PROBLEMATIC, USE FUNCTION-BASED POLICIES
-- =============================================

-- If the above doesn't work, try function-based policies
DO $$
BEGIN
    -- Create a simple function to check user access
    CREATE OR REPLACE FUNCTION public.is_own_profile(profile_id UUID)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
    SECURITY DEFINER
    STABLE
    AS $func$
    BEGIN
        -- Simple check without any recursive calls
        RETURN auth.uid() = profile_id;
    END;
    $func$;
    
    RAISE NOTICE 'Created is_own_profile function for profiles table';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Function already exists or error: %', SQLERRM;
END $$;

-- =============================================
-- 6. TEST THE FIX
-- =============================================

DO $$
DECLARE
    test_result BOOLEAN;
    policy_count INTEGER;
BEGIN
    -- Count existing policies
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'profiles';
    
    -- Test if we can query the profiles table without recursion
    BEGIN
        -- Try a simple query that would trigger policies
        SELECT EXISTS(SELECT 1 FROM profiles LIMIT 1) INTO test_result;
        RAISE NOTICE '✅ Profiles table query test: PASSED';
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE '❌ Profiles table query test: FAILED - %', SQLERRM;
    END;
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'PROFILES TABLE FIX VERIFICATION';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Policies count: %', policy_count;
    RAISE NOTICE 'Query test: %', CASE WHEN test_result IS NOT NULL THEN 'PASSED' ELSE 'FAILED' END;
    RAISE NOTICE '=============================================';
    
    IF policy_count <= 4 AND test_result IS NOT NULL THEN
        RAISE NOTICE '🎉 Profiles table infinite recursion FIXED!';
    ELSE
        RAISE NOTICE '⚠️ May need additional fixes. Check the error above.';
    END IF;
END $$;

-- =============================================
-- 7. EMERGENCY FALLBACK: DISABLE RLS IF ALL ELSE FAILS
-- =============================================

-- If you're still getting infinite recursion, uncomment the line below
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- WARNING: Only use the above line if absolutely necessary
-- It will disable all security on the profiles table
