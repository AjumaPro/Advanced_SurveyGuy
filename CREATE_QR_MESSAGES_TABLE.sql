-- Create QR Messages table
CREATE TABLE IF NOT EXISTS qr_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'thank_you',
    is_public BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    qr_code_url TEXT NOT NULL,
    scan_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qr_messages_user_id ON qr_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_messages_type ON qr_messages(type);
CREATE INDEX IF NOT EXISTS idx_qr_messages_is_public ON qr_messages(is_public);
CREATE INDEX IF NOT EXISTS idx_qr_messages_expires_at ON qr_messages(expires_at);
CREATE INDEX IF NOT EXISTS idx_qr_messages_created_at ON qr_messages(created_at);

-- Enable Row Level Security
ALTER TABLE qr_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own messages
CREATE POLICY "Users can view their own QR messages" ON qr_messages
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own messages
CREATE POLICY "Users can create their own QR messages" ON qr_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages
CREATE POLICY "Users can update their own QR messages" ON qr_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own QR messages" ON qr_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Public messages can be viewed by anyone (for QR code scanning)
CREATE POLICY "Public QR messages can be viewed by anyone" ON qr_messages
    FOR SELECT USING (is_public = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_qr_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_qr_messages_updated_at
    BEFORE UPDATE ON qr_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_qr_messages_updated_at();

-- Insert some sample data (optional)
INSERT INTO qr_messages (user_id, title, content, type, is_public, qr_code_url) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    'Thank You for Your Business!',
    'We truly appreciate your support and trust in our services. Your feedback helps us improve and serve you better. Thank you for being an amazing customer!',
    'thank_you',
    true,
    'https://example.com/qr-message/1-abc123'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Special 20% Off Offer',
    'As a valued customer, enjoy 20% off your next purchase! Use code: SAVE20. Valid until the end of this month. Thank you for your continued support!',
    'special_offer',
    true,
    'https://example.com/qr-message/2-def456'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Appointment Confirmation',
    'Your appointment has been confirmed for tomorrow at 2:00 PM. Please arrive 10 minutes early. If you need to reschedule, please contact us at least 24 hours in advance.',
    'appointment',
    true,
    'https://example.com/qr-message/3-ghi789'
);

-- Grant necessary permissions
GRANT ALL ON qr_messages TO authenticated;
GRANT USAGE ON SEQUENCE qr_messages_id_seq TO authenticated;
