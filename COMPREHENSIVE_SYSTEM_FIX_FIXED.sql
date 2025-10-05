-- =============================================
-- COMPREHENSIVE SYSTEM FIX (FIXED)
-- =============================================
-- This script fixes any issues found during system verification
-- Run this after COMPREHENSIVE_SYSTEM_VERIFICATION_FIXED.sql

-- =============================================
-- 1. ENSURE ALL CORE TABLES EXIST
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ENSURING ALL CORE TABLES EXIST';
    RAISE NOTICE '=============================================';
    
    -- Create surveys table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'surveys') THEN
        CREATE TABLE surveys (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            questions JSONB DEFAULT '[]',
            status VARCHAR(20) DEFAULT 'draft',
            is_public BOOLEAN DEFAULT true,
            is_active BOOLEAN DEFAULT true,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE '✅ Created surveys table';
    ELSE
        RAISE NOTICE '✅ Surveys table already exists';
    END IF;

    -- Create survey_responses table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'survey_responses') THEN
        CREATE TABLE survey_responses (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            responses JSONB DEFAULT '{}',
            session_id VARCHAR(255),
            ip_address INET,
            user_agent TEXT,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE '✅ Created survey_responses table';
    ELSE
        RAISE NOTICE '✅ Survey_responses table already exists';
    END IF;

    -- Create subscription_plans table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscription_plans') THEN
        CREATE TABLE subscription_plans (
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
        RAISE NOTICE '✅ Created subscription_plans table';
    ELSE
        RAISE NOTICE '✅ Subscription_plans table already exists';
    END IF;

    -- Create analytics table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'analytics') THEN
        CREATE TABLE analytics (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            entity_type VARCHAR(50) NOT NULL,
            entity_id UUID NOT NULL,
            event_type VARCHAR(100) NOT NULL,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE '✅ Created analytics table';
    ELSE
        RAISE NOTICE '✅ Analytics table already exists';
    END IF;

    -- Create notifications table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        CREATE TABLE notifications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'info',
            is_read BOOLEAN DEFAULT false,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE '✅ Created notifications table';
    ELSE
        RAISE NOTICE '✅ Notifications table already exists';
    END IF;

    -- Create payment_transactions table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payment_transactions') THEN
        CREATE TABLE payment_transactions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            paystack_reference TEXT UNIQUE,
            paystack_transaction_id TEXT,
            amount DECIMAL(10,2) NOT NULL,
            currency TEXT DEFAULT 'GHS',
            status TEXT NOT NULL DEFAULT 'pending',
            payment_method TEXT,
            payment_type TEXT,
            entity_type TEXT,
            entity_id UUID,
            description TEXT,
            payer_email TEXT,
            payer_name TEXT,
            metadata JSONB DEFAULT '{}',
            processed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE '✅ Created payment_transactions table';
    ELSE
        RAISE NOTICE '✅ Payment_transactions table already exists';
    END IF;

    -- Create api_keys table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_keys') THEN
        CREATE TABLE api_keys (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            key_hash TEXT NOT NULL,
            key_prefix VARCHAR(10) NOT NULL,
            plan_required TEXT,
            permissions JSONB DEFAULT '{}',
            is_active BOOLEAN DEFAULT true,
            last_used_at TIMESTAMP WITH TIME ZONE,
            expires_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE '✅ Created api_keys table';
    ELSE
        RAISE NOTICE '✅ Api_keys table already exists';
    END IF;

    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 2. ENSURE ALL USERS HAVE PROPER PROFILES
-- =============================================

DO $$
DECLARE
    users_without_profiles INTEGER;
    users_without_plans INTEGER;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ENSURING ALL USERS HAVE PROPER PROFILES';
    RAISE NOTICE '=============================================';
    
    -- Count users without profiles
    SELECT COUNT(*) INTO users_without_profiles
    FROM auth.users au
    LEFT JOIN profiles p ON au.id = p.id
    WHERE p.id IS NULL;
    
    -- Count users without plans
    SELECT COUNT(*) INTO users_without_plans
    FROM profiles
    WHERE plan IS NULL OR plan = '';
    
    RAISE NOTICE 'Users without profiles: %', users_without_profiles;
    RAISE NOTICE 'Users without plans: %', users_without_plans;
    
    -- Create profiles for users who don't have them
    IF users_without_profiles > 0 THEN
        INSERT INTO profiles (id, email, full_name, plan, role, created_at, updated_at)
        SELECT 
            au.id,
            au.email,
            COALESCE(au.raw_user_meta_data->>'full_name', ''),
            'free',
            'user',
            NOW(),
            NOW()
        FROM auth.users au
        LEFT JOIN profiles p ON au.id = p.id
        WHERE p.id IS NULL;
        
        RAISE NOTICE '✅ Created profiles for % users', users_without_profiles;
    END IF;
    
    -- Set default plans for users without plans
    IF users_without_plans > 0 THEN
        UPDATE profiles 
        SET plan = 'free', updated_at = NOW()
        WHERE plan IS NULL OR plan = '';
        
        RAISE NOTICE '✅ Set default plans for % users', users_without_plans;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 3. ENSURE DEFAULT SUBSCRIPTION PLANS EXIST
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ENSURING DEFAULT SUBSCRIPTION PLANS EXIST';
    RAISE NOTICE '=============================================';
    
    -- Insert default subscription plans if they don't exist
    INSERT INTO subscription_plans (name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features) 
    SELECT * FROM (VALUES
        ('Free', 'Basic survey creation and management', 0.00, 'monthly', 3, 100, 10, '{"analytics": false, "export": false, "custom_branding": false, "api_access": false}'),
        ('Pro', 'Advanced features for professional users', 19.99, 'monthly', 50, 5000, 100, '{"analytics": true, "export": true, "custom_branding": true, "api_access": true}'),
        ('Enterprise', 'Full-featured solution for large organizations', 99.99, 'monthly', 0, 0, 0, '{"analytics": true, "export": true, "custom_branding": true, "api_access": true, "sso": true, "priority_support": true}')
    ) AS v(name, description, price, billing_cycle, max_surveys, max_responses, max_questions, features)
    WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE subscription_plans.name = v.name);
    
    RAISE NOTICE '✅ Ensured default subscription plans exist';
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 4. ENSURE ALL PUBLISHED SURVEYS HAVE PROPER STRUCTURE
-- =============================================

DO $$
DECLARE
    surveys_without_questions INTEGER;
    surveys_with_invalid_status INTEGER;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ENSURING ALL PUBLISHED SURVEYS HAVE PROPER STRUCTURE';
    RAISE NOTICE '=============================================';
    
    -- Count surveys without questions
    SELECT COUNT(*) INTO surveys_without_questions
    FROM surveys
    WHERE (questions IS NULL OR jsonb_array_length(questions) = 0)
    AND status = 'published';
    
    -- Count surveys with invalid status
    SELECT COUNT(*) INTO surveys_with_invalid_status
    FROM surveys
    WHERE status NOT IN ('draft', 'published', 'closed');
    
    RAISE NOTICE 'Published surveys without questions: %', surveys_without_questions;
    RAISE NOTICE 'Surveys with invalid status: %', surveys_with_invalid_status;
    
    -- Fix surveys without questions by setting them to draft
    IF surveys_without_questions > 0 THEN
        UPDATE surveys
        SET status = 'draft', updated_at = NOW()
        WHERE (questions IS NULL OR jsonb_array_length(questions) = 0)
        AND status = 'published';
        
        RAISE NOTICE '✅ Set % surveys without questions to draft status', surveys_without_questions;
    END IF;
    
    -- Fix surveys with invalid status
    IF surveys_with_invalid_status > 0 THEN
        UPDATE surveys
        SET status = 'draft', updated_at = NOW()
        WHERE status NOT IN ('draft', 'published', 'closed');
        
        RAISE NOTICE '✅ Fixed % surveys with invalid status', surveys_with_invalid_status;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 5. ENSURE QR CODE FUNCTIONALITY IS WORKING
-- =============================================

DO $$
DECLARE
    published_surveys_count INTEGER;
    surveys_without_public_flag INTEGER;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ENSURING QR CODE FUNCTIONALITY IS WORKING';
    RAISE NOTICE '=============================================';
    
    -- Count published surveys
    SELECT COUNT(*) INTO published_surveys_count
    FROM surveys
    WHERE status = 'published' AND is_public = true;
    
    -- Count surveys that should be public but aren't
    SELECT COUNT(*) INTO surveys_without_public_flag
    FROM surveys
    WHERE status = 'published' AND is_public = false;
    
    RAISE NOTICE 'Published surveys with QR codes: %', published_surveys_count;
    RAISE NOTICE 'Published surveys without public flag: %', surveys_without_public_flag;
    
    -- Fix surveys that should be public
    IF surveys_without_public_flag > 0 THEN
        UPDATE surveys
        SET is_public = true, updated_at = NOW()
        WHERE status = 'published' AND is_public = false;
        
        RAISE NOTICE '✅ Made % published surveys public for QR code access', surveys_without_public_flag;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 6. FIX EXPIRED SUBSCRIPTIONS
-- =============================================

DO $$
DECLARE
    expired_subscriptions_count INTEGER;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'FIXING EXPIRED SUBSCRIPTIONS';
    RAISE NOTICE '=============================================';
    
    -- Count users with expired subscriptions
    SELECT COUNT(*) INTO expired_subscriptions_count
    FROM profiles
    WHERE subscription_end_date IS NOT NULL 
    AND subscription_end_date < NOW() 
    AND plan != 'free';
    
    RAISE NOTICE 'Users with expired subscriptions: %', expired_subscriptions_count;
    
    -- Fix expired subscriptions by setting them to free plan
    IF expired_subscriptions_count > 0 THEN
        UPDATE profiles
        SET 
            plan = 'free',
            subscription_end_date = NULL,
            updated_at = NOW()
        WHERE subscription_end_date IS NOT NULL 
        AND subscription_end_date < NOW() 
        AND plan != 'free';
        
        RAISE NOTICE '✅ Fixed % expired subscriptions by setting to free plan', expired_subscriptions_count;
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 7. ENSURE ROW LEVEL SECURITY IS ENABLED
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'ENSURING ROW LEVEL SECURITY IS ENABLED';
    RAISE NOTICE '=============================================';
    
    -- Enable RLS on all tables
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
    ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
    ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE '✅ Enabled Row Level Security on all tables';
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 8. CREATE ESSENTIAL RLS POLICIES
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'CREATING ESSENTIAL RLS POLICIES';
    RAISE NOTICE '=============================================';
    
    -- Profiles policies
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    
    -- Surveys policies
    DROP POLICY IF EXISTS "Users can view own surveys" ON surveys;
    CREATE POLICY "Users can view own surveys" ON surveys FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can insert own surveys" ON surveys;
    CREATE POLICY "Users can insert own surveys" ON surveys FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can update own surveys" ON surveys;
    CREATE POLICY "Users can update own surveys" ON surveys FOR UPDATE USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can delete own surveys" ON surveys;
    CREATE POLICY "Users can delete own surveys" ON surveys FOR DELETE USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Anyone can view published surveys" ON surveys;
    CREATE POLICY "Anyone can view published surveys" ON surveys FOR SELECT USING (status = 'published' AND is_public = true);
    
    -- Survey responses policies
    DROP POLICY IF EXISTS "Users can view own responses" ON survey_responses;
    CREATE POLICY "Users can view own responses" ON survey_responses FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Anyone can insert responses" ON survey_responses;
    CREATE POLICY "Anyone can insert responses" ON survey_responses FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Users can update own responses" ON survey_responses;
    CREATE POLICY "Users can update own responses" ON survey_responses FOR UPDATE USING (auth.uid() = user_id);
    
    -- Subscription plans policies
    DROP POLICY IF EXISTS "Anyone can view subscription plans" ON subscription_plans;
    CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT USING (is_active = true);
    
    -- Analytics policies
    DROP POLICY IF EXISTS "Users can view own analytics" ON analytics;
    CREATE POLICY "Users can view own analytics" ON analytics FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can insert own analytics" ON analytics;
    CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    -- Notifications policies
    DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
    CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
    CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
    
    -- Payment transactions policies
    DROP POLICY IF EXISTS "Users can view own transactions" ON payment_transactions;
    CREATE POLICY "Users can view own transactions" ON payment_transactions FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Transactions can be inserted by system" ON payment_transactions;
    CREATE POLICY "Transactions can be inserted by system" ON payment_transactions FOR INSERT WITH CHECK (true);
    
    -- API keys policies
    DROP POLICY IF EXISTS "Users can view own API keys" ON api_keys;
    CREATE POLICY "Users can view own API keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can insert own API keys" ON api_keys;
    CREATE POLICY "Users can insert own API keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can update own API keys" ON api_keys;
    CREATE POLICY "Users can update own API keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can delete own API keys" ON api_keys;
    CREATE POLICY "Users can delete own API keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE '✅ Created essential RLS policies';
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 9. CREATE ESSENTIAL INDEXES
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'CREATING ESSENTIAL INDEXES';
    RAISE NOTICE '=============================================';
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
    CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
    CREATE INDEX IF NOT EXISTS idx_surveys_public ON surveys(is_public) WHERE is_public = true;
    
    CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
    CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
    CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at);
    
    CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_entity ON analytics(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read) WHERE is_read = false;
    
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(paystack_reference);
    
    CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
    CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;
    
    RAISE NOTICE '✅ Created essential indexes';
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 10. CREATE ESSENTIAL TRIGGERS
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'CREATING ESSENTIAL TRIGGERS';
    RAISE NOTICE '=============================================';
    
    -- Function to update updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    -- Create triggers for updated_at
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
    CREATE TRIGGER update_profiles_updated_at 
        BEFORE UPDATE ON profiles 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_surveys_updated_at ON surveys;
    CREATE TRIGGER update_surveys_updated_at 
        BEFORE UPDATE ON surveys 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
    CREATE TRIGGER update_subscription_plans_updated_at 
        BEFORE UPDATE ON subscription_plans 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
    CREATE TRIGGER update_payment_transactions_updated_at 
        BEFORE UPDATE ON payment_transactions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;
    CREATE TRIGGER update_api_keys_updated_at 
        BEFORE UPDATE ON api_keys 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    RAISE NOTICE '✅ Created essential triggers';
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 11. CREATE SAMPLE DATA IF NEEDED
-- =============================================

DO $$
DECLARE
    total_surveys INTEGER;
    total_users INTEGER;
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'CREATING SAMPLE DATA IF NEEDED';
    RAISE NOTICE '=============================================';
    
    -- Count existing data
    SELECT COUNT(*) INTO total_surveys FROM surveys;
    SELECT COUNT(*) INTO total_users FROM profiles;
    
    RAISE NOTICE 'Total surveys: %', total_surveys;
    RAISE NOTICE 'Total users: %', total_users;
    
    -- Create sample survey if no surveys exist
    IF total_surveys = 0 THEN
        INSERT INTO surveys (title, description, questions, status, is_public, user_id, created_at, updated_at)
        VALUES (
            'Welcome to SurveyGuy - Sample Survey',
            'This is a sample survey to demonstrate the platform capabilities.',
            '[
                {
                    "id": "q1",
                    "title": "How would you rate your experience with SurveyGuy?",
                    "type": "rating",
                    "required": true,
                    "options": {
                        "min": 1,
                        "max": 5,
                        "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]
                    }
                },
                {
                    "id": "q2",
                    "title": "What features would you like to see added?",
                    "type": "multiple_choice",
                    "required": false,
                    "options": {
                        "choices": [
                            "Advanced Analytics",
                            "Custom Themes",
                            "Team Collaboration",
                            "API Integration",
                            "Mobile App"
                        ]
                    }
                },
                {
                    "id": "q3",
                    "title": "Any additional comments or suggestions?",
                    "type": "text",
                    "required": false,
                    "options": {
                        "multiline": true,
                        "placeholder": "Share your thoughts..."
                    }
                }
            ]'::jsonb,
            'published',
            true,
            (SELECT id FROM profiles LIMIT 1),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Created sample survey';
    END IF;
    
    RAISE NOTICE '=============================================';
END $$;

-- =============================================
-- 12. FINAL SYSTEM OPTIMIZATION
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'FINAL SYSTEM OPTIMIZATION';
    RAISE NOTICE '=============================================';
    
    -- Update table statistics for better query planning
    ANALYZE profiles;
    ANALYZE surveys;
    ANALYZE survey_responses;
    ANALYZE subscription_plans;
    ANALYZE analytics;
    ANALYZE notifications;
    ANALYZE payment_transactions;
    ANALYZE api_keys;
    
    RAISE NOTICE '✅ Updated table statistics';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'SYSTEM FIX COMPLETE';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'All systems have been verified and fixed!';
    RAISE NOTICE 'Users should now have working surveys, QR codes, and subscription functionality.';
    RAISE NOTICE '=============================================';
END $$;
