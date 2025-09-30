-- =============================================
-- COMPLETE CONNECTED DATABASE SETUP
-- All tables with proper relationships and connections
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. PROFILES TABLE (User profiles)
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- 2. SUBSCRIPTION PLANS TABLE (First - Referenced by others)
-- =============================================

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    features JSONB DEFAULT '[]'::jsonb,
    limits JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans
    FOR SELECT USING (is_active = TRUE);

-- =============================================
-- 3. SUBSCRIPTION HISTORY TABLE (Connected to plans)
-- =============================================

CREATE TABLE IF NOT EXISTS public.subscription_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id TEXT REFERENCES public.subscription_plans(name) ON DELETE RESTRICT NOT NULL,
    plan_name TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own subscription history" ON public.subscription_history;
CREATE POLICY "Users can view own subscription history" ON public.subscription_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscription history" ON public.subscription_history;
CREATE POLICY "Users can insert own subscription history" ON public.subscription_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all subscription history" ON public.subscription_history;
CREATE POLICY "Admins can manage all subscription history" ON public.subscription_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- 4. SURVEYS TABLE
-- =============================================

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
    version INTEGER DEFAULT 1,
    is_template BOOLEAN DEFAULT FALSE,
    template_category TEXT,
    template_industry TEXT,
    estimated_time INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage own surveys" ON public.surveys;
CREATE POLICY "Users can manage own surveys" ON public.surveys
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public surveys" ON public.surveys;
CREATE POLICY "Anyone can view public surveys" ON public.surveys
    FOR SELECT USING (is_public = TRUE AND is_active = TRUE);

DROP POLICY IF EXISTS "Anyone can view templates" ON public.surveys;
CREATE POLICY "Anyone can view templates" ON public.surveys
    FOR SELECT USING (is_template = TRUE);

-- =============================================
-- 5. SURVEY RESPONSES TABLE (Connected to surveys)
-- =============================================

CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
    respondent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- =============================================
-- 6. INVOICES TABLE (Connected to subscriptions)
-- =============================================

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.subscription_history(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    due_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    payment_reference TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all invoices" ON public.invoices;
CREATE POLICY "Admins can manage all invoices" ON public.invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- 7. ANALYTICS TABLE (Enhanced with validation)
-- =============================================

CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('survey', 'response', 'user', 'subscription', 'invoice')),
    entity_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 8. NOTIFICATIONS TABLE
-- =============================================

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

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 9. PAYMENT METHODS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL DEFAULT 'card',
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    last_four TEXT,
    brand TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage own payment methods" ON public.payment_methods;
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 10. SUPER ADMIN TRIGGER FUNCTION
-- =============================================

-- Function to automatically set super admin role
CREATE OR REPLACE FUNCTION set_super_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'infoajumapro@gmail.com' THEN
    NEW.role = 'super_admin';
    NEW.is_active = TRUE;
    NEW.is_verified = TRUE;
    NEW.plan = 'enterprise';
    
    RAISE NOTICE 'Super admin role automatically assigned to: %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_super_admin ON public.profiles;
CREATE TRIGGER trigger_set_super_admin
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_super_admin_role();

-- =============================================
-- 11. ANALYTICS VALIDATION FUNCTION
-- =============================================

-- Function to validate analytics entity references
CREATE OR REPLACE FUNCTION validate_analytics_entity()
RETURNS TRIGGER AS $$
BEGIN
  CASE NEW.entity_type
    WHEN 'survey' THEN
      IF NOT EXISTS (SELECT 1 FROM public.surveys WHERE id = NEW.entity_id) THEN
        RAISE EXCEPTION 'Invalid survey entity_id: %', NEW.entity_id;
      END IF;
    WHEN 'response' THEN
      IF NOT EXISTS (SELECT 1 FROM public.survey_responses WHERE id = NEW.entity_id) THEN
        RAISE EXCEPTION 'Invalid response entity_id: %', NEW.entity_id;
      END IF;
    WHEN 'user' THEN
      IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = NEW.entity_id) THEN
        RAISE EXCEPTION 'Invalid user entity_id: %', NEW.entity_id;
      END IF;
    WHEN 'subscription' THEN
      IF NOT EXISTS (SELECT 1 FROM public.subscription_history WHERE id = NEW.entity_id) THEN
        RAISE EXCEPTION 'Invalid subscription entity_id: %', NEW.entity_id;
      END IF;
    WHEN 'invoice' THEN
      IF NOT EXISTS (SELECT 1 FROM public.invoices WHERE id = NEW.entity_id) THEN
        RAISE EXCEPTION 'Invalid invoice entity_id: %', NEW.entity_id;
      END IF;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create analytics validation trigger
DROP TRIGGER IF EXISTS trigger_validate_analytics_entity ON public.analytics;
CREATE TRIGGER trigger_validate_analytics_entity
  BEFORE INSERT OR UPDATE ON public.analytics
  FOR EACH ROW
  EXECUTE FUNCTION validate_analytics_entity();

-- =============================================
-- 12. INSERT DEFAULT DATA
-- =============================================

-- Insert subscription plans
INSERT INTO public.subscription_plans (name, display_name, description, price, features, limits, is_active) VALUES
('free', 'Free', 'Perfect for getting started', 0.00, 
 '["Basic survey creation", "Up to 5 surveys", "100 responses per survey", "Basic analytics", "Standard templates"]',
 '{"surveys": 5, "responses_per_survey": 100, "team_members": 1}', true),
 
('pro', 'Pro', 'For growing businesses', 49.99,
 '["Unlimited surveys", "10,000 responses per survey", "Advanced analytics", "Custom branding", "Team collaboration", "API access", "Priority support"]',
 '{"surveys": -1, "responses_per_survey": 10000, "team_members": 10}', true),
 
('enterprise', 'Enterprise', 'For large organizations', 149.99,
 '["Everything in Pro", "Unlimited responses", "Advanced team collaboration", "Custom development", "Enterprise security", "SSO integration", "24/7 priority support", "White label solution"]',
 '{"surveys": -1, "responses_per_survey": -1, "team_members": -1}', true)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =============================================
-- 13. VERIFICATION QUERIES
-- =============================================

-- Check table relationships
SELECT 
  'Table Relationships Verification:' as info,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- Check subscription plans
SELECT 
  'Subscription Plans:' as info,
  name,
  display_name,
  price,
  is_active
FROM public.subscription_plans
ORDER BY price;

-- Success message
SELECT 'Complete connected database setup finished! All relationships properly established.' as final_status;
