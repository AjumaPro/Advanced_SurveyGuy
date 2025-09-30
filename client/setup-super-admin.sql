-- =============================================
-- SUPER ADMIN SETUP SCRIPT
-- Run this AFTER creating the tables and AFTER logging in once
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users
-- =============================================

-- First, check what users exist in auth.users
SELECT 
  'Current Auth Users:' as info,
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'infoajumapro@gmail.com';

-- If you see your user ID above, replace 'YOUR_USER_ID_HERE' below with that ID
-- If not, you need to sign up/login first

-- Method 1: Update existing profile (if profile already exists)
UPDATE public.profiles 
SET 
  role = 'super_admin',
  plan = 'enterprise',
  is_active = TRUE,
  is_verified = TRUE,
  updated_at = NOW()
WHERE email = 'infoajumapro@gmail.com';

-- Method 2: Insert new profile (if no profile exists yet)
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from auth.users
INSERT INTO public.profiles (
  id,
  email,
  role,
  plan,
  is_active,
  is_verified,
  full_name,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace this with your actual user ID
  'infoajumapro@gmail.com',
  'super_admin',
  'enterprise',
  TRUE,
  TRUE,
  'Super Admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  plan = 'enterprise',
  is_active = TRUE,
  is_verified = TRUE,
  updated_at = NOW();

-- Create subscription history for super admin
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from auth.users
INSERT INTO public.subscription_history (
  user_id,
  plan_name,
  plan_id,
  price,
  currency,
  billing_cycle,
  status,
  starts_at,
  ends_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace this with your actual user ID
  'enterprise',
  'enterprise',
  149.99,
  'USD',
  'monthly',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
) ON CONFLICT DO NOTHING;

-- Verify the setup
SELECT 
  'Super Admin Profile:' as info,
  id,
  email,
  role,
  plan,
  is_active,
  is_verified
FROM public.profiles 
WHERE email = 'infoajumapro@gmail.com';

-- Check subscription history
SELECT 
  'Subscription History:' as info,
  user_id,
  plan_name,
  plan_id,
  status,
  starts_at
FROM public.subscription_history
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'infoajumapro@gmail.com'
);

SELECT 'Super admin setup completed! Refresh your app to see changes.' as final_status;
