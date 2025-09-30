-- =============================================
-- API ENDPOINTS SETUP FOR SURVEYGUY
-- =============================================
-- This script sets up the database tables and functions for API key management
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CREATE API KEYS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions TEXT[] DEFAULT ARRAY['read'],
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CREATE API USAGE LOGS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time INTEGER, -- in milliseconds
    request_size INTEGER, -- in bytes
    response_size INTEGER, -- in bytes
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. CREATE API DOCUMENTATION TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS api_documentation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint VARCHAR(255) UNIQUE NOT NULL,
    method VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    parameters JSONB DEFAULT '{}',
    responses JSONB DEFAULT '{}',
    examples JSONB DEFAULT '{}',
    category VARCHAR(100) DEFAULT 'general',
    requires_auth BOOLEAN DEFAULT true,
    rate_limit INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- API Keys indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at);

-- API Usage Logs indexes
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_id ON api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at);

-- API Documentation indexes
CREATE INDEX IF NOT EXISTS idx_api_documentation_endpoint ON api_documentation(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_documentation_category ON api_documentation(category);
CREATE INDEX IF NOT EXISTS idx_api_documentation_is_active ON api_documentation(is_active);

-- =============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_documentation ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 6. CREATE RLS POLICIES
-- =============================================

-- API Keys policies
CREATE POLICY "Users can view own API keys" ON api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys" ON api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- API Usage Logs policies
CREATE POLICY "Users can view own API usage logs" ON api_usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage logs" ON api_usage_logs
    FOR INSERT WITH CHECK (true); -- Allow system to log usage

-- API Documentation policies
CREATE POLICY "Anyone can view API documentation" ON api_documentation
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage API documentation" ON api_documentation
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- 7. CREATE API KEY MANAGEMENT FUNCTIONS
-- =============================================

-- Function to validate API key
CREATE OR REPLACE FUNCTION validate_api_key(api_key_hash TEXT)
RETURNS TABLE (
    is_valid BOOLEAN,
    user_id UUID,
    permissions TEXT[],
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ak.is_active AND (ak.expires_at IS NULL OR ak.expires_at > NOW()) as is_valid,
        ak.user_id,
        ak.permissions,
        ak.expires_at,
        ak.usage_count
    FROM api_keys ak
    WHERE ak.key_hash = api_key_hash;
END;
$$;

-- Function to log API usage
CREATE OR REPLACE FUNCTION log_api_usage(
    api_key_hash TEXT,
    endpoint_name TEXT,
    http_method TEXT,
    status_code INTEGER,
    response_time INTEGER DEFAULT NULL,
    request_size INTEGER DEFAULT NULL,
    response_size INTEGER DEFAULT NULL,
    client_ip INET DEFAULT NULL,
    user_agent_text TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    key_record RECORD;
BEGIN
    -- Get API key info
    SELECT user_id, id INTO key_record
    FROM api_keys 
    WHERE key_hash = api_key_hash;
    
    -- Log the usage
    INSERT INTO api_usage_logs (
        api_key_id,
        user_id,
        endpoint,
        method,
        status_code,
        response_time,
        request_size,
        response_size,
        ip_address,
        user_agent
    ) VALUES (
        key_record.id,
        key_record.user_id,
        endpoint_name,
        http_method,
        status_code,
        response_time,
        request_size,
        response_size,
        client_ip,
        user_agent_text
    );
    
    -- Update usage count
    UPDATE api_keys 
    SET 
        usage_count = usage_count + 1,
        last_used_at = NOW(),
        updated_at = NOW()
    WHERE key_hash = api_key_hash;
END;
$$;

-- Function to get API key statistics
CREATE OR REPLACE FUNCTION get_api_key_stats(user_uuid UUID)
RETURNS TABLE (
    total_keys INTEGER,
    active_keys INTEGER,
    total_usage BIGINT,
    last_used TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_keys,
        COUNT(*) FILTER (WHERE is_active = true)::INTEGER as active_keys,
        COALESCE(SUM(usage_count), 0) as total_usage,
        MAX(last_used_at) as last_used
    FROM api_keys
    WHERE user_id = user_uuid;
END;
$$;

-- Function to get API usage analytics
CREATE OR REPLACE FUNCTION get_api_usage_analytics(
    user_uuid UUID,
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    date DATE,
    total_requests BIGINT,
    successful_requests BIGINT,
    failed_requests BIGINT,
    avg_response_time NUMERIC,
    total_data_transferred BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(aul.created_at) as date,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE aul.status_code < 400) as successful_requests,
        COUNT(*) FILTER (WHERE aul.status_code >= 400) as failed_requests,
        ROUND(AVG(aul.response_time), 2) as avg_response_time,
        COALESCE(SUM(aul.request_size + aul.response_size), 0) as total_data_transferred
    FROM api_usage_logs aul
    JOIN api_keys ak ON aul.api_key_id = ak.id
    WHERE ak.user_id = user_uuid
    AND aul.created_at >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY DATE(aul.created_at)
    ORDER BY date DESC;
END;
$$;

-- =============================================
-- 8. INSERT DEFAULT API DOCUMENTATION
-- =============================================

INSERT INTO api_documentation (endpoint, method, title, description, parameters, responses, examples, category, requires_auth, rate_limit) VALUES
(
    '/api/v1/surveys',
    'GET',
    'List Surveys',
    'Retrieve a list of all surveys for the authenticated user',
    '{"query": {"page": "number", "limit": "number", "status": "string"}}',
    '{"200": {"description": "Success", "schema": {"type": "array", "items": {"$ref": "#/definitions/Survey"}}}}',
    '{"curl": "curl -H \"X-API-Key: sk_live_...\" https://api.surveyguy.com/v1/surveys"}',
    'surveys',
    true,
    1000
),
(
    '/api/v1/surveys',
    'POST',
    'Create Survey',
    'Create a new survey',
    '{"body": {"title": "string", "description": "string", "questions": "array"}}',
    '{"201": {"description": "Created", "schema": {"$ref": "#/definitions/Survey"}}}',
    '{"curl": "curl -X POST -H \"X-API-Key: sk_live_...\" -d \"{\\\"title\\\": \\\"My Survey\\\"}\" https://api.surveyguy.com/v1/surveys"}',
    'surveys',
    true,
    100
),
(
    '/api/v1/surveys/{id}',
    'GET',
    'Get Survey',
    'Retrieve a specific survey by ID',
    '{"path": {"id": "string"}}',
    '{"200": {"description": "Success", "schema": {"$ref": "#/definitions/Survey"}}}',
    '{"curl": "curl -H \"X-API-Key: sk_live_...\" https://api.surveyguy.com/v1/surveys/123"}',
    'surveys',
    true,
    1000
),
(
    '/api/v1/surveys/{id}/responses',
    'GET',
    'Get Survey Responses',
    'Retrieve all responses for a specific survey',
    '{"path": {"id": "string"}, "query": {"page": "number", "limit": "number"}}',
    '{"200": {"description": "Success", "schema": {"type": "array", "items": {"$ref": "#/definitions/Response"}}}}',
    '{"curl": "curl -H \"X-API-Key: sk_live_...\" https://api.surveyguy.com/v1/surveys/123/responses"}',
    'responses',
    true,
    500
),
(
    '/api/v1/responses',
    'POST',
    'Submit Response',
    'Submit a response to a survey',
    '{"body": {"survey_id": "string", "responses": "object"}}',
    '{"201": {"description": "Created", "schema": {"$ref": "#/definitions/Response"}}}',
    '{"curl": "curl -X POST -H \"X-API-Key: sk_live_...\" -d \"{\\\"survey_id\\\": \\\"123\\\", \\\"responses\\\": {}}\" https://api.surveyguy.com/v1/responses"}',
    'responses',
    false,
    1000
),
(
    '/api/v1/analytics/{survey_id}',
    'GET',
    'Get Survey Analytics',
    'Get analytics data for a specific survey',
    '{"path": {"survey_id": "string"}, "query": {"timeframe": "string"}}',
    '{"200": {"description": "Success", "schema": {"$ref": "#/definitions/Analytics"}}}',
    '{"curl": "curl -H \"X-API-Key: sk_live_...\" https://api.surveyguy.com/v1/analytics/123"}',
    'analytics',
    true,
    200
),
(
    '/api/v1/webhooks',
    'GET',
    'List Webhooks',
    'Retrieve all webhooks for the authenticated user',
    '{"query": {"page": "number", "limit": "number"}}',
    '{"200": {"description": "Success", "schema": {"type": "array", "items": {"$ref": "#/definitions/Webhook"}}}}',
    '{"curl": "curl -H \"X-API-Key: sk_live_...\" https://api.surveyguy.com/v1/webhooks"}',
    'webhooks',
    true,
    500
),
(
    '/api/v1/webhooks',
    'POST',
    'Create Webhook',
    'Create a new webhook',
    '{"body": {"url": "string", "events": "array", "secret": "string"}}',
    '{"201": {"description": "Created", "schema": {"$ref": "#/definitions/Webhook"}}}',
    '{"curl": "curl -X POST -H \"X-API-Key: sk_live_...\" -d \"{\\\"url\\\": \\\"https://example.com/webhook\\\"}\" https://api.surveyguy.com/v1/webhooks"}',
    'webhooks',
    true,
    100
);

-- =============================================
-- 9. CREATE TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_documentation_updated_at 
    BEFORE UPDATE ON api_documentation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 10. VERIFICATION QUERIES
-- =============================================

DO $$
DECLARE
    table_count INTEGER;
    function_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_name IN ('api_keys', 'api_usage_logs', 'api_documentation');
    
    -- Count functions
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_name IN ('validate_api_key', 'log_api_usage', 'get_api_key_stats', 'get_api_usage_analytics');
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename IN ('api_keys', 'api_usage_logs', 'api_documentation');
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'API ENDPOINTS SETUP VERIFICATION';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Tables created: %/3', table_count;
    RAISE NOTICE 'Functions created: %/4', function_count;
    RAISE NOTICE 'Policies created: %', policy_count;
    RAISE NOTICE 'API documentation entries: %', (SELECT COUNT(*) FROM api_documentation);
    RAISE NOTICE '=============================================';
    
    IF table_count = 3 AND function_count = 4 THEN
        RAISE NOTICE '🎉 API endpoints setup completed successfully!';
        RAISE NOTICE 'Your API system is ready for key generation and management.';
    ELSE
        RAISE NOTICE '⚠️ Some components may need attention.';
        RAISE NOTICE 'Check the counts above and review any errors.';
    END IF;
END $$;
