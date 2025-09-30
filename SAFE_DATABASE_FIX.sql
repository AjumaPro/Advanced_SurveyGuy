-- =============================================
-- SAFE DATABASE FIX - HANDLES EXISTING TABLES
-- =============================================
-- This script safely fixes database issues by checking for existing columns first
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. SAFELY CREATE SURVEYS TABLE IF IT DOESN'T EXIST
-- =============================================
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Survey',
    description TEXT,
    questions JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft',
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    max_responses INTEGER DEFAULT 0,
    allow_anonymous BOOLEAN DEFAULT true,
    require_email BOOLEAN DEFAULT false,
    custom_thank_you_message TEXT,
    redirect_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. SAFELY CREATE SURVEY_RESPONSES TABLE IF IT DOESN'T EXIST
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    completion_time INTEGER,
    is_complete BOOLEAN DEFAULT true,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. SAFELY ADD MISSING COLUMNS TO SURVEYS TABLE
-- =============================================
DO $$
BEGIN
    -- Add user_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'user_id') THEN
        ALTER TABLE surveys ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add title if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'title') THEN
        ALTER TABLE surveys ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Untitled Survey';
    END IF;
    
    -- Add description if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'description') THEN
        ALTER TABLE surveys ADD COLUMN description TEXT;
    END IF;
    
    -- Add questions if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'questions') THEN
        ALTER TABLE surveys ADD COLUMN questions JSONB DEFAULT '[]';
    END IF;
    
    -- Add settings if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'settings') THEN
        ALTER TABLE surveys ADD COLUMN settings JSONB DEFAULT '{}';
    END IF;
    
    -- Add status if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'status') THEN
        ALTER TABLE surveys ADD COLUMN status VARCHAR(20) DEFAULT 'draft';
    END IF;
    
    -- Add is_active if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'is_active') THEN
        ALTER TABLE surveys ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add published_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'published_at') THEN
        ALTER TABLE surveys ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add expires_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'expires_at') THEN
        ALTER TABLE surveys ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add max_responses if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'max_responses') THEN
        ALTER TABLE surveys ADD COLUMN max_responses INTEGER DEFAULT 0;
    END IF;
    
    -- Add allow_anonymous if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'allow_anonymous') THEN
        ALTER TABLE surveys ADD COLUMN allow_anonymous BOOLEAN DEFAULT true;
    END IF;
    
    -- Add require_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'require_email') THEN
        ALTER TABLE surveys ADD COLUMN require_email BOOLEAN DEFAULT false;
    END IF;
    
    -- Add custom_thank_you_message if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'custom_thank_you_message') THEN
        ALTER TABLE surveys ADD COLUMN custom_thank_you_message TEXT;
    END IF;
    
    -- Add redirect_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'redirect_url') THEN
        ALTER TABLE surveys ADD COLUMN redirect_url VARCHAR(500);
    END IF;
    
    -- Add created_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'created_at') THEN
        ALTER TABLE surveys ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'updated_at') THEN
        ALTER TABLE surveys ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =============================================
-- 4. SAFELY ADD MISSING COLUMNS TO SURVEY_RESPONSES TABLE
-- =============================================
DO $$
BEGIN
    -- Add survey_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'survey_id') THEN
        ALTER TABLE survey_responses ADD COLUMN survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE;
    END IF;
    
    -- Add user_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'user_id') THEN
        ALTER TABLE survey_responses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Add responses if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'responses') THEN
        ALTER TABLE survey_responses ADD COLUMN responses JSONB DEFAULT '{}';
    END IF;
    
    -- Add ip_address if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'ip_address') THEN
        ALTER TABLE survey_responses ADD COLUMN ip_address INET;
    END IF;
    
    -- Add user_agent if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'user_agent') THEN
        ALTER TABLE survey_responses ADD COLUMN user_agent TEXT;
    END IF;
    
    -- Add session_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'session_id') THEN
        ALTER TABLE survey_responses ADD COLUMN session_id VARCHAR(255);
    END IF;
    
    -- Add completion_time if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'completion_time') THEN
        ALTER TABLE survey_responses ADD COLUMN completion_time INTEGER;
    END IF;
    
    -- Add is_complete if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'is_complete') THEN
        ALTER TABLE survey_responses ADD COLUMN is_complete BOOLEAN DEFAULT true;
    END IF;
    
    -- Add submitted_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'submitted_at') THEN
        ALTER TABLE survey_responses ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add created_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'created_at') THEN
        ALTER TABLE survey_responses ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'updated_at') THEN
        ALTER TABLE survey_responses ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- =============================================
-- 5. CREATE MISSING TABLES (SAFELY)
-- =============================================

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
    max_surveys INTEGER DEFAULT 0,
    max_responses INTEGER DEFAULT 0,
    max_questions INTEGER DEFAULT 0,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending',
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_method_id UUID,
    stripe_invoice_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    last_four VARCHAR(4),
    brand VARCHAR(20),
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    permissions JSONB DEFAULT '{}',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SSO configurations table
CREATE TABLE IF NOT EXISTS sso_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    provider_name VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider, provider_id)
);

-- Survey branding table
CREATE TABLE IF NOT EXISTS survey_branding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#1E40AF',
    font_family VARCHAR(100) DEFAULT 'Inter',
    custom_css TEXT,
    footer_text TEXT,
    show_branding BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_provider VARCHAR(20) DEFAULT 'supabase',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. INSERT DEFAULT DATA
-- =============================================

-- Insert default subscription plans if they don't exist
INSERT INTO subscription_plans (name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features) 
SELECT 'Free', 'Basic survey creation and management', 0.00, 'monthly', 3, 100, 10, '{"analytics": false, "export": false, "custom_branding": false, "api_access": false}'
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Free');

INSERT INTO subscription_plans (name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features) 
SELECT 'Pro', 'Advanced features for professional users', 29.99, 'monthly', 50, 5000, 100, '{"analytics": true, "export": true, "custom_branding": true, "api_access": true}'
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Pro');

INSERT INTO subscription_plans (name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features) 
SELECT 'Enterprise', 'Full-featured solution for large organizations', 149.99, 'monthly', 0, 0, 0, '{"analytics": true, "export": true, "custom_branding": true, "api_access": true, "sso": true, "priority_support": true}'
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Enterprise');

-- =============================================
-- 7. CREATE INDEXES
-- =============================================

-- Surveys indexes
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(is_active);
CREATE INDEX IF NOT EXISTS idx_surveys_published_at ON surveys(published_at);

-- Survey responses indexes
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at);

-- Other table indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_sso_user_id ON sso_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_branding_user_id ON survey_branding(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);

-- =============================================
-- 8. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE sso_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 9. CREATE BASIC RLS POLICIES
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can insert their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON surveys;

DROP POLICY IF EXISTS "Users can view survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can insert survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can update survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can delete survey responses" ON survey_responses;

-- Create new policies
CREATE POLICY "Users can view their own surveys" ON surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own surveys" ON surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" ON surveys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys" ON surveys
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view survey responses" ON survey_responses
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert survey responses" ON survey_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.status = 'published'
        )
    );

CREATE POLICY "Users can update survey responses" ON survey_responses
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete survey responses" ON survey_responses
    FOR DELETE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM surveys s 
            WHERE s.id = survey_responses.survey_id 
            AND s.user_id = auth.uid()
        )
    );

-- =============================================
-- 10. REFRESH SCHEMA CACHE
-- =============================================

NOTIFY pgrst, 'reload schema';

-- =============================================
-- 11. VERIFICATION
-- =============================================

DO $$
DECLARE
    survey_count INTEGER;
    response_count INTEGER;
    plan_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO survey_count FROM surveys;
    SELECT COUNT(*) INTO response_count FROM survey_responses;
    SELECT COUNT(*) INTO plan_count FROM subscription_plans;
    
    RAISE NOTICE '✅ Database setup completed successfully!';
    RAISE NOTICE '📊 Surveys: % records', survey_count;
    RAISE NOTICE '📊 Survey responses: % records', response_count;
    RAISE NOTICE '📊 Subscription plans: % records', plan_count;
    RAISE NOTICE '🔗 Schema relationships have been established';
    RAISE NOTICE '🔐 Row Level Security enabled on all tables';
END $$;
