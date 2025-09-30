-- =============================================
-- DISCOUNT COUPON SYSTEM DATABASE SETUP
-- =============================================
-- This script creates the database tables for the discount coupon system
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. DISCOUNT COUPONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS discount_coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- percentage, fixed_amount
    discount_value DECIMAL(10,2) NOT NULL, -- percentage (0-100) or fixed amount
    min_order_amount DECIMAL(10,2) DEFAULT 0, -- minimum order amount to use coupon
    max_discount_amount DECIMAL(10,2), -- maximum discount amount (for percentage coupons)
    applicable_plans JSONB DEFAULT '[]', -- which subscription plans this applies to
    usage_limit INTEGER, -- total number of times this coupon can be used
    usage_count INTEGER DEFAULT 0, -- how many times it has been used
    user_usage_limit INTEGER DEFAULT 1, -- how many times a single user can use this coupon
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- super admin who created it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. COUPON USAGE TRACKING TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id UUID REFERENCES discount_coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    original_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    final_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Discount coupons indexes
CREATE INDEX IF NOT EXISTS idx_discount_coupons_code ON discount_coupons(code);
CREATE INDEX IF NOT EXISTS idx_discount_coupons_active ON discount_coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_coupons_valid_from ON discount_coupons(valid_from);
CREATE INDEX IF NOT EXISTS idx_discount_coupons_valid_until ON discount_coupons(valid_until);
CREATE INDEX IF NOT EXISTS idx_discount_coupons_created_by ON discount_coupons(created_by);

-- Coupon usage indexes
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_used_at ON coupon_usage(used_at);

-- =============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. CREATE RLS POLICIES
-- =============================================

-- Discount coupons policies
CREATE POLICY "Anyone can view active coupons" ON discount_coupons
    FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Super admins can manage all coupons" ON discount_coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'super_admin' OR auth.jwt() ->> 'email' = 'infoajumapro@gmail.com')
        )
    );

-- Coupon usage policies
CREATE POLICY "Users can view their own coupon usage" ON coupon_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage" ON coupon_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can view all coupon usage" ON coupon_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() 
            AND (p.role = 'super_admin' OR auth.jwt() ->> 'email' = 'infoajumapro@gmail.com')
        )
    );

-- =============================================
-- 6. CREATE HELPER FUNCTIONS
-- =============================================

-- Function to validate and apply coupon
CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code TEXT,
    user_id_param UUID,
    order_amount DECIMAL(10,2),
    plan_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    coupon_record discount_coupons%ROWTYPE;
    discount_amount DECIMAL(10,2) := 0;
    final_amount DECIMAL(10,2) := order_amount;
    user_usage_count INTEGER := 0;
    result JSONB;
BEGIN
    -- Get coupon details
    SELECT * INTO coupon_record 
    FROM discount_coupons 
    WHERE code = coupon_code 
    AND is_active = true
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (usage_limit IS NULL OR usage_count < usage_limit);
    
    -- Check if coupon exists and is valid
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Invalid or expired coupon code'
        );
    END IF;
    
    -- Check minimum order amount
    IF order_amount < coupon_record.min_order_amount THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Order amount does not meet minimum requirement'
        );
    END IF;
    
    -- Check if plan is applicable
    IF coupon_record.applicable_plans IS NOT NULL AND 
       jsonb_array_length(coupon_record.applicable_plans) > 0 AND
       plan_id IS NOT NULL THEN
        IF NOT (coupon_record.applicable_plans ? plan_id::text) THEN
            RETURN jsonb_build_object(
                'valid', false,
                'error', 'Coupon not applicable to selected plan'
            );
        END IF;
    END IF;
    
    -- Check user usage limit
    SELECT COUNT(*) INTO user_usage_count
    FROM coupon_usage
    WHERE coupon_id = coupon_record.id AND user_id = user_id_param;
    
    IF user_usage_count >= coupon_record.user_usage_limit THEN
        RETURN jsonb_build_object(
            'valid', false,
            'error', 'Coupon usage limit exceeded for this user'
        );
    END IF;
    
    -- Calculate discount
    IF coupon_record.discount_type = 'percentage' THEN
        discount_amount := (order_amount * coupon_record.discount_value / 100);
        IF coupon_record.max_discount_amount IS NOT NULL AND 
           discount_amount > coupon_record.max_discount_amount THEN
            discount_amount := coupon_record.max_discount_amount;
        END IF;
    ELSE -- fixed_amount
        discount_amount := coupon_record.discount_value;
    END IF;
    
    -- Ensure discount doesn't exceed order amount
    IF discount_amount > order_amount THEN
        discount_amount := order_amount;
    END IF;
    
    final_amount := order_amount - discount_amount;
    
    -- Return success result
    RETURN jsonb_build_object(
        'valid', true,
        'coupon_id', coupon_record.id,
        'coupon_name', coupon_record.name,
        'discount_type', coupon_record.discount_type,
        'discount_value', coupon_record.discount_value,
        'discount_amount', discount_amount,
        'original_amount', order_amount,
        'final_amount', final_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to apply coupon and record usage
CREATE OR REPLACE FUNCTION apply_coupon(
    coupon_code TEXT,
    user_id_param UUID,
    order_amount DECIMAL(10,2),
    plan_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    validation_result JSONB;
    coupon_record discount_coupons%ROWTYPE;
BEGIN
    -- Validate coupon first
    validation_result := validate_coupon(coupon_code, user_id_param, order_amount, plan_id);
    
    IF NOT (validation_result->>'valid')::boolean THEN
        RETURN validation_result;
    END IF;
    
    -- Get coupon record
    SELECT * INTO coupon_record 
    FROM discount_coupons 
    WHERE code = coupon_code;
    
    -- Record usage
    INSERT INTO coupon_usage (
        coupon_id,
        user_id,
        subscription_plan_id,
        original_amount,
        discount_amount,
        final_amount
    ) VALUES (
        coupon_record.id,
        user_id_param,
        plan_id,
        order_amount,
        (validation_result->>'discount_amount')::decimal,
        (validation_result->>'final_amount')::decimal
    );
    
    -- Update usage count
    UPDATE discount_coupons 
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = coupon_record.id;
    
    -- Return success with usage recorded
    validation_result := jsonb_set(validation_result, '{usage_recorded}', 'true');
    RETURN validation_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. CREATE UPDATED_AT TRIGGER
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for discount_coupons
CREATE TRIGGER update_discount_coupons_updated_at 
    BEFORE UPDATE ON discount_coupons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 8. INSERT SAMPLE COUPONS
-- =============================================

-- Insert some sample coupons for testing
INSERT INTO discount_coupons (code, name, description, discount_type, discount_value, applicable_plans, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome Discount', '10% off for new users', 'percentage', 10.00, '["free", "pro"]', 100, NOW() + INTERVAL '30 days'),
('SAVE50', 'Fixed Amount Discount', '$50 off any plan', 'fixed_amount', 50.00, '["pro", "enterprise"]', 50, NOW() + INTERVAL '60 days'),
('ENTERPRISE20', 'Enterprise Special', '20% off Enterprise plan', 'percentage', 20.00, '["enterprise"]', 25, NOW() + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 9. VERIFICATION
-- =============================================

DO $$
DECLARE
    coupon_count INTEGER;
    usage_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO coupon_count FROM discount_coupons;
    SELECT COUNT(*) INTO usage_count FROM coupon_usage;
    
    RAISE NOTICE '✅ Discount coupon system setup completed successfully!';
    RAISE NOTICE '🎫 Discount coupons: % records', coupon_count;
    RAISE NOTICE '📊 Coupon usage: % records', usage_count;
    RAISE NOTICE '🔧 Helper functions created';
    RAISE NOTICE '🔐 Row Level Security enabled';
    RAISE NOTICE '🎯 Sample coupons inserted';
END $$;
