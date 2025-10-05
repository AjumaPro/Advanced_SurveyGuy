-- Create payment-related tables for real payment processing
-- Simplified version to avoid syntax errors

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    paystack_customer_id TEXT,
    paystack_authorization_code TEXT,
    type TEXT NOT NULL, -- 'card', 'bank', 'mobile_money', etc.
    brand TEXT, -- 'visa', 'mastercard', 'mtn', 'vodafone', etc.
    last4 TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    cardholder_name TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_payments table
CREATE TABLE IF NOT EXISTS event_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    registration_id UUID,
    paystack_reference TEXT UNIQUE,
    paystack_transaction_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    payment_method TEXT,
    discount_code TEXT,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    processing_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    payer_email TEXT,
    payer_name TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_payments table
CREATE TABLE IF NOT EXISTS form_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL,
    paystack_reference TEXT UNIQUE,
    paystack_transaction_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payer_email TEXT,
    payer_name TEXT,
    form_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table (general purpose)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    paystack_reference TEXT UNIQUE,
    paystack_transaction_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payment_type TEXT, -- 'subscription', 'form_payment', 'event_payment', 'manual'
    entity_type TEXT, -- 'subscription', 'form', 'event'
    entity_id UUID,
    description TEXT,
    payer_email TEXT,
    payer_name TEXT,
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_methods
DROP POLICY IF EXISTS "Users can view their own payment methods" ON payment_methods;
CREATE POLICY "Users can view their own payment methods" ON payment_methods FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own payment methods" ON payment_methods;
CREATE POLICY "Users can insert their own payment methods" ON payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own payment methods" ON payment_methods;
CREATE POLICY "Users can update their own payment methods" ON payment_methods FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own payment methods" ON payment_methods;
CREATE POLICY "Users can delete their own payment methods" ON payment_methods FOR DELETE USING (auth.uid() = user_id);

-- Create policies for event_payments
DROP POLICY IF EXISTS "Event payments are viewable by event owners" ON event_payments;
CREATE POLICY "Event payments are viewable by event owners" ON event_payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM events 
        WHERE events.id = event_payments.event_id 
        AND events.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Event payments can be inserted by anyone" ON event_payments;
CREATE POLICY "Event payments can be inserted by anyone" ON event_payments FOR INSERT WITH CHECK (true);

-- Create policies for form_payments
DROP POLICY IF EXISTS "Form payments are viewable by form owners" ON form_payments;
CREATE POLICY "Form payments are viewable by form owners" ON form_payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM forms 
        WHERE forms.id = form_payments.form_id 
        AND forms.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Form payments can be inserted by anyone" ON form_payments;
CREATE POLICY "Form payments can be inserted by anyone" ON form_payments FOR INSERT WITH CHECK (true);

-- Create policies for payment_transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON payment_transactions;
CREATE POLICY "Users can view their own transactions" ON payment_transactions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all transactions" ON payment_transactions;
CREATE POLICY "Admins can view all transactions" ON payment_transactions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'super_admin')
    )
);

DROP POLICY IF EXISTS "Transactions can be inserted by system" ON payment_transactions;
CREATE POLICY "Transactions can be inserted by system" ON payment_transactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Transactions can be updated by system" ON payment_transactions;
CREATE POLICY "Transactions can be updated by system" ON payment_transactions FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default) WHERE is_default = true;

CREATE INDEX IF NOT EXISTS idx_event_payments_event_id ON event_payments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_payments_status ON event_payments(status);
CREATE INDEX IF NOT EXISTS idx_event_payments_reference ON event_payments(paystack_reference);

CREATE INDEX IF NOT EXISTS idx_form_payments_form_id ON form_payments(form_id);
CREATE INDEX IF NOT EXISTS idx_form_payments_status ON form_payments(status);
CREATE INDEX IF NOT EXISTS idx_form_payments_reference ON form_payments(paystack_reference);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(payment_type);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(paystack_reference);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_payments_updated_at ON event_payments;
CREATE TRIGGER update_event_payments_updated_at
    BEFORE UPDATE ON event_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_form_payments_updated_at ON form_payments;
CREATE TRIGGER update_form_payments_updated_at
    BEFORE UPDATE ON form_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
