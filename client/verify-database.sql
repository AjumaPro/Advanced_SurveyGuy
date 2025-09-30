-- Database Verification Script
-- Run this in your Supabase SQL Editor to check database status

-- Check if all required tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('surveys', 'question_library', 'question_templates', 'question_favorites', 'profiles') 
    THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('surveys', 'question_library', 'question_templates', 'question_favorites', 'profiles')
ORDER BY table_name;

-- Check surveys table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'surveys' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled on key tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('surveys', 'question_library', 'question_templates', 'question_favorites')
ORDER BY tablename;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('surveys', 'question_library', 'question_templates', 'question_favorites')
ORDER BY tablename, policyname;

-- Check if we have any question templates
SELECT COUNT(*) as template_count FROM public.question_templates;

-- Check if we have any question library entries
SELECT COUNT(*) as library_count FROM public.question_library;

-- Check survey status
SELECT COUNT(*) as total_surveys FROM public.surveys;
SELECT COUNT(*) as published_surveys FROM public.surveys WHERE status = 'published';
SELECT COUNT(*) as draft_surveys FROM public.surveys WHERE status = 'draft';

-- Show any recent errors (if any)
SELECT 'Database verification complete!' as result;
