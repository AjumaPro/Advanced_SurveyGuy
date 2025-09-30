-- =============================================
-- COMPLETE SUPABASE SETUP FOR SURVEYGUY
-- Updated with all fixes and improvements
-- Run this script in your Supabase SQL Editor
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

-- Admin policies for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- 2. SURVEYS TABLE
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
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for surveys
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
-- 3. SURVEY RESPONSES TABLE
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

-- RLS Policies for survey responses
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
-- 4. ANALYTICS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 5. NOTIFICATIONS TABLE
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

-- RLS Policies for notifications
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 6. SUBSCRIPTION PLANS TABLE
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

-- RLS Policies for subscription plans
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans
    FOR SELECT USING (is_active = TRUE);

-- =============================================
-- 7. SUBSCRIPTION HISTORY TABLE (MAIN FIX)
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

-- Enable RLS
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription history
DROP POLICY IF EXISTS "Users can view own subscription history" ON public.subscription_history;
CREATE POLICY "Users can view own subscription history" ON public.subscription_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscription history" ON public.subscription_history;
CREATE POLICY "Users can insert own subscription history" ON public.subscription_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies for subscription history
DROP POLICY IF EXISTS "Admins can view all subscription history" ON public.subscription_history;
CREATE POLICY "Admins can view all subscription history" ON public.subscription_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- 8. INVOICES TABLE
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

-- RLS Policies for invoices
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all invoices" ON public.invoices;
CREATE POLICY "Admins can view all invoices" ON public.invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

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

-- RLS Policies for payment methods
DROP POLICY IF EXISTS "Users can manage own payment methods" ON public.payment_methods;
CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 10. API KEYS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    key_prefix TEXT NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for API keys
DROP POLICY IF EXISTS "Users can manage own api keys" ON public.api_keys;
CREATE POLICY "Users can manage own api keys" ON public.api_keys
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 11. SSO CONFIGURATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.sso_configurations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    provider_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sso_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for SSO configurations
DROP POLICY IF EXISTS "Users can manage own sso configs" ON public.sso_configurations;
CREATE POLICY "Users can manage own sso configs" ON public.sso_configurations
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 12. SURVEY BRANDING TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.survey_branding (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#1F2937',
    font_family TEXT DEFAULT 'Inter',
    custom_css TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.survey_branding ENABLE ROW LEVEL SECURITY;

-- RLS Policies for survey branding
DROP POLICY IF EXISTS "Users can manage own branding" ON public.survey_branding;
CREATE POLICY "Users can manage own branding" ON public.survey_branding
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 13. TEAM MEMBERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
    permissions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_owner_id, member_id)
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team members
DROP POLICY IF EXISTS "Team owners can manage members" ON public.team_members;
CREATE POLICY "Team owners can manage members" ON public.team_members
    FOR ALL USING (auth.uid() = team_owner_id);

DROP POLICY IF EXISTS "Members can view team info" ON public.team_members;
CREATE POLICY "Members can view team info" ON public.team_members
    FOR SELECT USING (auth.uid() = member_id OR auth.uid() = team_owner_id);

-- =============================================
-- 14. FILE UPLOADS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    purpose TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for file uploads
DROP POLICY IF EXISTS "Users can manage own files" ON public.file_uploads;
CREATE POLICY "Users can manage own files" ON public.file_uploads
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public files" ON public.file_uploads;
CREATE POLICY "Anyone can view public files" ON public.file_uploads
    FOR SELECT USING (is_public = TRUE);

-- =============================================
-- 15. EVENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'standard' CHECK (event_type IN ('standard', 'conference', 'workshop', 'webinar', 'custom')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    virtual_link TEXT,
    capacity INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
DROP POLICY IF EXISTS "Users can manage own events" ON public.events;
CREATE POLICY "Users can manage own events" ON public.events
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public events" ON public.events;
CREATE POLICY "Anyone can view public events" ON public.events
    FOR SELECT USING (is_public = TRUE AND is_active = TRUE);

-- =============================================
-- 16. EVENT REGISTRATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attendee_name TEXT NOT NULL,
    attendee_email TEXT NOT NULL,
    attendee_phone TEXT,
    registration_data JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'attended')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, attendee_email)
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event registrations
DROP POLICY IF EXISTS "Event owners can view registrations" ON public.event_registrations;
CREATE POLICY "Event owners can view registrations" ON public.event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE id = event_id AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Anyone can register for public events" ON public.event_registrations;
CREATE POLICY "Anyone can register for public events" ON public.event_registrations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE id = event_id AND is_public = TRUE AND is_active = TRUE
        )
    );

DROP POLICY IF EXISTS "Users can manage own registrations" ON public.event_registrations;
CREATE POLICY "Users can manage own registrations" ON public.event_registrations
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 17. SUPER ADMIN TRIGGER FUNCTION
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
    NEW.plan = 'enterprise';
    
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

-- =============================================
-- 16. UTILITY FUNCTIONS
-- =============================================

-- Function to get sample surveys by category
CREATE OR REPLACE FUNCTION get_sample_surveys_by_category(category_name TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  industry TEXT,
  estimated_time INTEGER,
  questions JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.description,
    s.template_category,
    s.template_industry,
    s.estimated_time,
    s.questions
  FROM public.surveys s
  WHERE s.is_template = TRUE
    AND s.is_active = TRUE
    AND (category_name IS NULL OR s.template_category = category_name)
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clone a template survey
CREATE OR REPLACE FUNCTION clone_template_survey(
  template_id UUID,
  new_title TEXT,
  target_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_survey_id UUID;
  template_data RECORD;
BEGIN
  -- Get template data
  SELECT * INTO template_data
  FROM public.surveys
  WHERE id = template_id AND is_template = TRUE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found';
  END IF;
  
  -- Create new survey from template
  INSERT INTO public.surveys (
    user_id,
    title,
    description,
    questions,
    settings,
    is_public,
    is_active,
    status
  ) VALUES (
    target_user_id,
    new_title,
    template_data.description,
    template_data.questions,
    template_data.settings,
    FALSE,
    TRUE,
    'draft'
  ) RETURNING id INTO new_survey_id;
  
  RETURN new_survey_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 17. INSERT DEFAULT SUBSCRIPTION PLANS
-- =============================================

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
-- 18. INSERT SAMPLE SURVEY TEMPLATES
-- =============================================

-- Customer Satisfaction Survey
INSERT INTO public.surveys (
  id, user_id, title, description, questions, is_template, template_category, template_industry, estimated_time, is_public, is_active
) VALUES (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'Customer Satisfaction Survey',
  'Measure customer satisfaction and gather feedback',
  '[
    {
      "id": "q1",
      "type": "rating",
      "question": "How satisfied are you with our service?",
      "required": true,
      "options": {"scale": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "question": "How did you hear about us?",
      "required": true,
      "options": ["Social Media", "Google Search", "Friend/Family", "Advertisement", "Other"]
    },
    {
      "id": "q3",
      "type": "text",
      "question": "What can we improve?",
      "required": false,
      "options": {"multiline": true}
    }
  ]',
  true, 'feedback', 'general', 3, true, true
) ON CONFLICT DO NOTHING;

-- Employee Engagement Survey
INSERT INTO public.surveys (
  id, user_id, title, description, questions, is_template, template_category, template_industry, estimated_time, is_public, is_active
) VALUES (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'Employee Engagement Survey',
  'Assess employee satisfaction and engagement levels',
  '[
    {
      "id": "q1",
      "type": "rating",
      "question": "How satisfied are you with your current role?",
      "required": true,
      "options": {"scale": 10}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "question": "What motivates you most at work?",
      "required": true,
      "options": ["Career Growth", "Recognition", "Compensation", "Work-Life Balance", "Team Environment"]
    },
    {
      "id": "q3",
      "type": "yes_no",
      "question": "Would you recommend this company as a great place to work?",
      "required": true
    }
  ]',
  true, 'hr', 'corporate', 5, true, true
) ON CONFLICT DO NOTHING;

-- Product Feedback Survey
INSERT INTO public.surveys (
  id, user_id, title, description, questions, is_template, template_category, template_industry, estimated_time, is_public, is_active
) VALUES (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000',
  'Product Feedback Survey',
  'Collect valuable feedback about your product',
  '[
    {
      "id": "q1",
      "type": "rating",
      "question": "How would you rate our product overall?",
      "required": true,
      "options": {"scale": 5}
    },
    {
      "id": "q2",
      "type": "checkbox",
      "question": "Which features do you use most? (Select all that apply)",
      "required": false,
      "options": ["Feature A", "Feature B", "Feature C", "Feature D", "Feature E"]
    },
    {
      "id": "q3",
      "type": "text",
      "question": "What new features would you like to see?",
      "required": false,
      "options": {"multiline": true}
    }
  ]',
  true, 'product', 'technology', 4, true, true
) ON CONFLICT DO NOTHING;

-- Additional editable template surveys
INSERT INTO public.surveys (
  user_id, title, description, questions, 
  is_template, template_category, template_industry, 
  estimated_time, is_public, status
) VALUES 
-- Employee Satisfaction Template
(
  '00000000-0000-0000-0000-000000000000',
  'Employee Satisfaction Survey',
  'Comprehensive template to measure employee satisfaction and engagement levels.',
  '[
    {
      "id": "q1",
      "type": "rating",
      "title": "How satisfied are you with your current role?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Very Dissatisfied", "5": "Very Satisfied"}}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "What motivates you most at work?",
      "required": true,
      "settings": {
        "options": ["Career growth", "Recognition", "Work-life balance", "Compensation", "Team collaboration"],
        "allowOther": true
      }
    },
    {
      "id": "q3",
      "type": "emoji_scale",
      "title": "How do you feel about your workload?",
      "required": true,
      "settings": {"scaleType": "satisfaction", "showLabels": true}
    },
    {
      "id": "q4",
      "type": "textarea",
      "title": "What improvements would you suggest for our workplace?",
      "required": false,
      "settings": {"placeholder": "Share your suggestions...", "rows": 4}
    }
  ]',
  true, 'employee-survey', 'general', 7, true, 'published'
),
-- Event Feedback Template
(
  '00000000-0000-0000-0000-000000000000',
  'Event Feedback Survey',
  'Perfect template for gathering feedback after conferences, workshops, or corporate events.',
  '[
    {
      "id": "q1",
      "type": "rating",
      "title": "Overall, how would you rate this event?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "Which session did you find most valuable?",
      "required": true,
      "settings": {
        "options": ["Keynote presentation", "Panel discussion", "Breakout sessions", "Networking", "Q&A session"],
        "allowOther": true
      }
    },
    {
      "id": "q3",
      "type": "emoji_scale",
      "title": "How satisfied were you with the venue and facilities?",
      "required": true,
      "settings": {"scaleType": "satisfaction", "showLabels": true}
    },
    {
      "id": "q4",
      "type": "yes_no",
      "title": "Would you attend future events from us?",
      "required": true,
      "settings": {}
    },
    {
      "id": "q5",
      "type": "textarea",
      "title": "Any additional comments or suggestions?",
      "required": false,
      "settings": {"placeholder": "Your feedback helps us improve...", "rows": 3}
    }
  ]',
  true, 'event-feedback', 'events', 5, true, 'published'
),
-- Market Research Template
(
  '00000000-0000-0000-0000-000000000000',
  'Market Research Survey',
  'Comprehensive market research template to understand customer preferences and market trends.',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "What is your age group?",
      "required": true,
      "settings": {
        "options": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        "allowOther": false
      }
    },
    {
      "id": "q2",
      "type": "checkbox",
      "title": "Which of these products/services are you currently using?",
      "required": true,
      "settings": {
        "options": ["Product A", "Product B", "Product C", "Product D", "None of the above"],
        "minSelections": 1
      }
    },
    {
      "id": "q3",
      "type": "scale",
      "title": "How important is price when making purchasing decisions?",
      "required": true,
      "settings": {"minScale": 1, "maxScale": 10, "labels": {"1": "Not Important", "10": "Very Important"}}
    },
    {
      "id": "q4",
      "type": "multiple_choice",
      "title": "Where do you typically research products before purchasing?",
      "required": true,
      "settings": {
        "options": ["Google search", "Social media", "Company website", "Reviews sites", "Friends/family"],
        "allowOther": true
      }
    },
    {
      "id": "q5",
      "type": "textarea",
      "title": "What features would you like to see in future products?",
      "required": false,
      "settings": {"placeholder": "Describe your ideal features...", "rows": 4}
    }
  ]',
  true, 'market-research', 'business', 8, true, 'published'
),
-- Healthcare Patient Satisfaction Template
(
  '00000000-0000-0000-0000-000000000000',
  'Patient Satisfaction Survey',
  'Healthcare template for measuring patient satisfaction with medical services and facilities.',
  '[
    {
      "id": "q1",
      "type": "rating",
      "title": "How would you rate the quality of care you received?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q2",
      "type": "emoji_scale",
      "title": "How satisfied were you with the wait time?",
      "required": true,
      "settings": {"scaleType": "satisfaction", "showLabels": true}
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "title": "How did you schedule your appointment?",
      "required": true,
      "settings": {
        "options": ["Phone call", "Online portal", "Mobile app", "Walk-in", "Referral"],
        "allowOther": false
      }
    },
    {
      "id": "q4",
      "type": "yes_no",
      "title": "Did the healthcare provider explain your condition and treatment clearly?",
      "required": true,
      "settings": {}
    },
    {
      "id": "q5",
      "type": "rating",
      "title": "How likely are you to recommend our facility to others?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not Likely", "10": "Very Likely"}}
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "Please share any additional feedback or suggestions:",
      "required": false,
      "settings": {"placeholder": "Your feedback helps us improve patient care...", "rows": 4}
    }
  ]',
  true, 'healthcare', 'healthcare', 6, true, 'published'
),
-- Education Course Evaluation Template
(
  '00000000-0000-0000-0000-000000000000',
  'Course Evaluation Survey',
  'Educational template for students to evaluate courses, instructors, and learning materials.',
  '[
    {
      "id": "q1",
      "type": "rating",
      "title": "Overall, how would you rate this course?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "How would you rate the instructor''s teaching effectiveness?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q3",
      "type": "emoji_scale",
      "title": "How challenging was the course content?",
      "required": true,
      "settings": {"scaleType": "agreement", "showLabels": true}
    },
    {
      "id": "q4",
      "type": "checkbox",
      "title": "Which learning materials were most helpful?",
      "required": true,
      "settings": {
        "options": ["Lectures", "Reading materials", "Assignments", "Group projects", "Online resources"],
        "minSelections": 1
      }
    },
    {
      "id": "q5",
      "type": "yes_no",
      "title": "Would you recommend this course to other students?",
      "required": true,
      "settings": {}
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "What improvements would you suggest for this course?",
      "required": false,
      "settings": {"placeholder": "Your suggestions help us improve the learning experience...", "rows": 4}
    }
  ]',
  true, 'education', 'education', 6, true, 'published'
) ON CONFLICT DO NOTHING;

-- =============================================
-- 19. VERIFICATION QUERIES
-- =============================================

-- Check if all tables exist
SELECT 
  'Database Tables Status:' as info,
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 'surveys', 'survey_responses', 'analytics', 'notifications',
    'subscription_plans', 'subscription_history', 'invoices', 'payment_methods',
    'api_keys', 'sso_configurations', 'survey_branding', 'team_members', 'file_uploads',
    'events', 'event_registrations'
  )
ORDER BY tablename;

-- Check subscription plans
SELECT 
  'Subscription Plans:' as info,
  name,
  display_name,
  price,
  currency
FROM public.subscription_plans
ORDER BY price;

-- Check sample surveys
SELECT 
  'Sample Survey Templates:' as info,
  title,
  template_category,
  template_industry,
  estimated_time
FROM public.surveys
WHERE is_template = TRUE
ORDER BY template_category;

-- Success message
SELECT 'Complete SurveyGuy database setup completed successfully! All 16 tables created with proper RLS policies and sample data.' as final_status;