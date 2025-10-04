-- Simple database table creation script
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    subscription_plan_id UUID,
    subscription_status VARCHAR(20) DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. SURVEYS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft',
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. SURVEY RESPONSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    responses JSONB DEFAULT '{}',
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. SUBSCRIPTION PLANS TABLE
-- =============================================
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

-- =============================================
-- 5. INSERT DEFAULT SUBSCRIPTION PLANS
-- =============================================
-- Insert Free plan (using DO block to handle existence check)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Free') THEN
        INSERT INTO subscription_plans (name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features) 
        VALUES ('Free', 'Basic survey creation and management', 0.00, 'monthly', 3, 100, 10, '{"analytics": false, "export": false, "custom_branding": false, "api_access": false}');
    END IF;
END $$;

-- Insert Pro plan
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Pro') THEN
        INSERT INTO subscription_plans (name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features) 
        VALUES ('Pro', 'Advanced features for professional users', 29.99, 'monthly', 50, 5000, 100, '{"analytics": true, "export": true, "custom_branding": true, "api_access": true}');
    END IF;
END $$;

-- Insert Enterprise plan
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'Enterprise') THEN
        INSERT INTO subscription_plans (name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features) 
        VALUES ('Enterprise', 'Full-featured solution for large organizations', 149.99, 'monthly', 0, 0, 0, '{"analytics": true, "export": true, "custom_branding": true, "api_access": true, "sso": true, "priority_support": true}');
    END IF;
END $$;

-- =============================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 7. CREATE BASIC RLS POLICIES
-- =============================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Surveys policies
DROP POLICY IF EXISTS "Users can view own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can insert own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can delete own surveys" ON surveys;
DROP POLICY IF EXISTS "Anyone can view published surveys" ON surveys;
CREATE POLICY "Users can view own surveys" ON surveys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own surveys" ON surveys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own surveys" ON surveys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own surveys" ON surveys FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view published surveys" ON surveys FOR SELECT USING (status = 'published' AND is_public = true);

-- Survey responses policies
DROP POLICY IF EXISTS "Users can view own responses" ON survey_responses;
DROP POLICY IF EXISTS "Anyone can insert responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can update own responses" ON survey_responses;
CREATE POLICY "Users can view own responses" ON survey_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert responses" ON survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own responses" ON survey_responses FOR UPDATE USING (auth.uid() = user_id);

-- Subscription plans policies
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT USING (is_active = true);

-- =============================================
-- 8. CREATE INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);

-- =============================================
-- 9. VERIFY TABLES CREATED
-- =============================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'surveys', 'survey_responses', 'subscription_plans')
ORDER BY table_name;

-- Show success message
SELECT '✅ Database tables created successfully!' as message;
SELECT '📋 Next step: Create the survey for QR code testing' as next_step;
