-- =============================================
-- UPDATE PAYMENT TABLES FOR PAYSTACK
-- Make database schema compatible with Paystack
-- =============================================

-- =============================================
-- 1. UPDATE SUBSCRIPTION_HISTORY TABLE
-- =============================================

-- Add Paystack-specific columns
ALTER TABLE subscription_history 
ADD COLUMN IF NOT EXISTS paystack_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT,
ADD COLUMN IF NOT EXISTS payment_channel TEXT,
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'paystack';

-- Rename Stripe columns to be provider-agnostic (if they exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'subscription_history' AND column_name = 'stripe_invoice_id') THEN
    ALTER TABLE subscription_history RENAME COLUMN stripe_invoice_id TO payment_provider_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscription_history' AND column_name = 'payment_provider_id') THEN
    ALTER TABLE subscription_history ADD COLUMN payment_provider_id TEXT;
  END IF;
END $$;

-- Create indexes for Paystack lookups
CREATE INDEX IF NOT EXISTS idx_subscription_paystack_tx 
ON subscription_history(paystack_transaction_id);

CREATE INDEX IF NOT EXISTS idx_subscription_payment_ref 
ON subscription_history(payment_reference);

CREATE INDEX IF NOT EXISTS idx_subscription_provider 
ON subscription_history(payment_provider);

-- =============================================
-- 2. UPDATE PAYMENT_METHODS TABLE  
-- =============================================

-- Add Paystack-specific columns
ALTER TABLE payment_methods
ADD COLUMN IF NOT EXISTS paystack_authorization_code TEXT,
ADD COLUMN IF NOT EXISTS paystack_card_type TEXT,
ADD COLUMN IF NOT EXISTS paystack_bank TEXT,
ADD COLUMN IF NOT EXISTS paystack_country_code TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'paystack';

-- Rename Stripe column (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'payment_methods' AND column_name = 'stripe_payment_method_id') THEN
    ALTER TABLE payment_methods RENAME COLUMN stripe_payment_method_id TO provider_payment_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'payment_methods' AND column_name = 'provider_payment_id') THEN
    ALTER TABLE payment_methods ADD COLUMN provider_payment_id TEXT;
  END IF;
END $$;

-- Create indexes for Paystack
CREATE INDEX IF NOT EXISTS idx_payment_methods_provider 
ON payment_methods(provider, provider_payment_id);

CREATE INDEX IF NOT EXISTS idx_payment_methods_authorization 
ON payment_methods(paystack_authorization_code);

-- =============================================
-- 3. CREATE OR UPDATE INVOICES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES subscription_history(id) ON DELETE SET NULL,
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Dates
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment info
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  payment_provider_id TEXT,
  paystack_transaction_id TEXT,
  
  -- PDF
  pdf_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;

-- Policy: Users can view their own invoices
CREATE POLICY "Users can view own invoices"
ON invoices FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create index
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_paystack ON invoices(paystack_transaction_id);

-- =============================================
-- 4. CREATE HELPER FUNCTIONS
-- =============================================

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  invoice_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM invoices
  WHERE invoice_number LIKE 'INV-%';
  
  invoice_num := 'INV-' || LPAD(next_num::TEXT, 6, '0');
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Function to create invoice from payment
CREATE OR REPLACE FUNCTION create_invoice_from_payment(
  p_user_id UUID,
  p_subscription_id UUID,
  p_amount DECIMAL,
  p_currency TEXT,
  p_paystack_transaction_id TEXT
)
RETURNS UUID AS $$
DECLARE
  v_invoice_id UUID;
  v_invoice_number TEXT;
BEGIN
  -- Generate invoice number
  v_invoice_number := generate_invoice_number();
  
  -- Create invoice
  INSERT INTO invoices (
    user_id,
    subscription_id,
    invoice_number,
    amount,
    currency,
    status,
    paid_at,
    paystack_transaction_id
  )
  VALUES (
    p_user_id,
    p_subscription_id,
    v_invoice_number,
    p_amount,
    p_currency,
    'paid',
    NOW(),
    p_paystack_transaction_id
  )
  RETURNING id INTO v_invoice_id;
  
  RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user payment stats
CREATE OR REPLACE FUNCTION get_user_payment_stats(p_user_id UUID)
RETURNS TABLE (
  total_spent DECIMAL,
  total_payments BIGINT,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  current_plan TEXT,
  subscription_end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(sh.amount), 0) as total_spent,
    COUNT(sh.id)::BIGINT as total_payments,
    MAX(sh.created_at) as last_payment_date,
    p.plan as current_plan,
    p.subscription_end_date
  FROM profiles p
  LEFT JOIN subscription_history sh ON sh.user_id = p.id AND sh.status = 'completed'
  WHERE p.id = p_user_id
  GROUP BY p.plan, p.subscription_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON invoices TO authenticated;
GRANT INSERT, UPDATE ON invoices TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Payment tables updated for Paystack!';
  RAISE NOTICE '✅ Added Paystack-specific columns';
  RAISE NOTICE '✅ Renamed provider-specific columns to generic names';
  RAISE NOTICE '✅ Created indexes for performance';
  RAISE NOTICE '✅ Helper functions created:';
  RAISE NOTICE '   - generate_invoice_number()';
  RAISE NOTICE '   - create_invoice_from_payment()';
  RAISE NOTICE '   - get_user_payment_stats()';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '1. Set PAYSTACK_SECRET_KEY in Supabase secrets';
  RAISE NOTICE '2. Deploy verify-paystack-payment Edge Function';
  RAISE NOTICE '3. npm install react-paystack';
  RAISE NOTICE '4. Test payment flow';
END $$;

