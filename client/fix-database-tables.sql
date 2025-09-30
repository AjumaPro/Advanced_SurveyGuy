-- =============================================
-- ESSENTIAL TABLES FIX FOR SURVEYGUY
-- Run this script in your Supabase SQL Editor
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. PROFILES TABLE (if not exists)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    subscription_end_date TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. SUBSCRIPTION_HISTORY TABLE (MAIN FIX)
-- =============================================
CREATE TABLE IF NOT EXISTS public.subscription_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_name TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on subscription_history
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Subscription history RLS policies
DROP POLICY IF EXISTS "Users can view own subscription history" ON public.subscription_history;
CREATE POLICY "Users can view own subscription history" ON public.subscription_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscription history" ON public.subscription_history;
CREATE POLICY "Users can insert own subscription history" ON public.subscription_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 3. OTHER ESSENTIAL TABLES
-- =============================================

-- Surveys table
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own surveys" ON public.surveys;
CREATE POLICY "Users can manage own surveys" ON public.surveys
    FOR ALL USING (auth.uid() = user_id);

-- Survey responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
    respondent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Survey owners can view responses" ON public.survey_responses;
CREATE POLICY "Survey owners can view responses" ON public.survey_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE id = survey_id AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Anyone can submit responses" ON public.survey_responses;
CREATE POLICY "Anyone can submit responses" ON public.survey_responses
    FOR INSERT WITH CHECK (true);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR ALL USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 4. SET UP SUPER ADMIN
-- =============================================

-- Function to automatically set super admin role for specific email
CREATE OR REPLACE FUNCTION set_super_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the super admin email
  IF NEW.email = 'infoajumapro@gmail.com' THEN
    NEW.role = 'super_admin';
    NEW.is_active = TRUE;
    NEW.is_verified = TRUE;
    NEW.plan = 'enterprise'; -- Give super admin the highest plan
    
    RAISE NOTICE 'Super admin role automatically assigned to: %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic super admin assignment
DROP TRIGGER IF EXISTS trigger_set_super_admin ON public.profiles;
CREATE TRIGGER trigger_set_super_admin
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_super_admin_role();

-- Update existing profile if it exists
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
) 
SELECT 
  auth.uid(),
  'infoajumapro@gmail.com',
  'super_admin',
  'enterprise',
  TRUE,
  TRUE,
  'Super Admin',
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'infoajumapro@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  plan = 'enterprise',
  is_active = TRUE,
  is_verified = TRUE,
  updated_at = NOW();

-- Create subscription history for super admin
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
) 
SELECT 
  auth.uid(),
  'enterprise',
  'enterprise',
  149.99,
  'USD',
  'monthly',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
FROM auth.users 
WHERE email = 'infoajumapro@gmail.com'
ON CONFLICT DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if tables exist
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'subscription_history', 'surveys', 'survey_responses', 'analytics', 'notifications')
ORDER BY tablename;

-- Check super admin profile
SELECT 
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
  user_id,
  plan_name,
  plan_id,
  status,
  starts_at
FROM public.subscription_history
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'infoajumapro@gmail.com'
);

-- Success message
SELECT 'Database setup completed successfully! All essential tables created.' as status;
