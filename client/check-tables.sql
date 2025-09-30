-- =============================================
-- QUICK TABLE CHECK FOR SUPABASE
-- Run this first to see what tables exist
-- =============================================

-- Check which tables exist in public schema
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check if specific required tables exist
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') 
    THEN '✅ profiles table exists'
    ELSE '❌ profiles table missing'
  END as profiles_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscription_history') 
    THEN '✅ subscription_history table exists'
    ELSE '❌ subscription_history table missing'
  END as subscription_history_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'surveys') 
    THEN '✅ surveys table exists'
    ELSE '❌ surveys table missing'
  END as surveys_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'survey_responses') 
    THEN '✅ survey_responses table exists'
    ELSE '❌ survey_responses table missing'
  END as survey_responses_status;

-- Check if super admin profile exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE email = 'infoajumapro@gmail.com') 
    THEN '✅ Super admin profile exists'
    ELSE '❌ Super admin profile missing'
  END as super_admin_status;

-- If profiles table exists, show super admin details
SELECT 
  'Super Admin Details:' as info,
  email,
  role,
  plan,
  is_active,
  is_verified
FROM public.profiles 
WHERE email = 'infoajumapro@gmail.com';
