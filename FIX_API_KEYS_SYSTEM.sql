-- =============================================
-- FIX API KEYS SYSTEM
-- =============================================
-- This script creates the necessary tables and functions for API key management
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. CREATE API_KEYS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.api_keys (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    key_hash text NOT NULL UNIQUE,
    key_prefix text NOT NULL,
    permissions jsonb NOT NULL DEFAULT '{}',
    rate_limit integer DEFAULT 10000,
    is_active boolean DEFAULT true,
    last_used_at timestamptz,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 2. CREATE API_KEY_USAGE TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.api_key_usage (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id uuid NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
    endpoint text NOT NULL,
    method text NOT NULL,
    status_code integer,
    response_time_ms integer,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- =============================================
-- 3. CREATE INDEXES
-- =============================================

-- Indexes for api_keys table
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON public.api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON public.api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON public.api_keys(expires_at);

-- Indexes for api_key_usage table
CREATE INDEX IF NOT EXISTS idx_api_key_usage_api_key_id ON public.api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_created_at ON public.api_key_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_endpoint ON public.api_key_usage(endpoint);

-- =============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_key_usage ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. CREATE RLS POLICIES
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can create their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can view their own API key usage" ON public.api_key_usage;
DROP POLICY IF EXISTS "Users can create API key usage records" ON public.api_key_usage;

-- Create new policies
CREATE POLICY "Users can view their own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON public.api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own API key usage" ON public.api_key_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.api_keys 
            WHERE api_keys.id = api_key_usage.api_key_id 
            AND api_keys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create API key usage records" ON public.api_key_usage
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.api_keys 
            WHERE api_keys.id = api_key_usage.api_key_id 
            AND api_keys.user_id = auth.uid()
        )
    );

-- =============================================
-- 6. CREATE API KEY FUNCTIONS
-- =============================================

-- Function to create API key
CREATE OR REPLACE FUNCTION public.create_api_key(
    key_name text,
    key_permissions jsonb DEFAULT '{"read": true, "write": true, "delete": true, "analytics": true}',
    rate_limit integer DEFAULT 10000,
    expires_at timestamptz DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_key_id uuid;
    key_value text;
    key_hash text;
    key_prefix text;
    result json;
BEGIN
    -- Validate inputs
    IF key_name IS NULL OR key_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Key name is required');
    END IF;
    
    -- Generate API key
    key_value := 'sk_' || encode(gen_random_bytes(32), 'base64');
    key_hash := encode(digest(key_value, 'sha256'), 'hex');
    key_prefix := left(key_value, 8) || '...';
    
    -- Insert API key
    INSERT INTO public.api_keys (
        user_id,
        name,
        key_hash,
        key_prefix,
        permissions,
        rate_limit,
        expires_at
    ) VALUES (
        auth.uid(),
        key_name,
        key_hash,
        key_prefix,
        key_permissions,
        rate_limit,
        expires_at
    ) RETURNING id INTO new_key_id;
    
    RETURN json_build_object(
        'success', true,
        'api_key_id', new_key_id,
        'key_value', key_value,
        'key_prefix', key_prefix,
        'message', 'API key created successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create API key: ' || SQLERRM);
END;
$$;

-- Function to list user's API keys
CREATE OR REPLACE FUNCTION public.get_user_api_keys()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', id,
            'name', name,
            'key_prefix', key_prefix,
            'permissions', permissions,
            'rate_limit', rate_limit,
            'is_active', is_active,
            'last_used_at', last_used_at,
            'expires_at', expires_at,
            'created_at', created_at
        )
    ) INTO result
    FROM public.api_keys
    WHERE user_id = auth.uid()
    ORDER BY created_at DESC;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Function to delete API key
CREATE OR REPLACE FUNCTION public.delete_api_key(key_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Validate key belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM public.api_keys 
        WHERE id = key_id AND user_id = auth.uid()
    ) THEN
        RETURN json_build_object('success', false, 'error', 'API key not found');
    END IF;
    
    -- Delete API key
    DELETE FROM public.api_keys WHERE id = key_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'API key deleted successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete API key: ' || SQLERRM);
END;
$$;

-- Function to update API key
CREATE OR REPLACE FUNCTION public.update_api_key(
    key_id uuid,
    key_name text DEFAULT NULL,
    key_permissions jsonb DEFAULT NULL,
    rate_limit integer DEFAULT NULL,
    is_active boolean DEFAULT NULL,
    expires_at timestamptz DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Validate key belongs to user
    IF NOT EXISTS (
        SELECT 1 FROM public.api_keys 
        WHERE id = key_id AND user_id = auth.uid()
    ) THEN
        RETURN json_build_object('success', false, 'error', 'API key not found');
    END IF;
    
    -- Update API key
    UPDATE public.api_keys SET
        name = COALESCE(key_name, name),
        permissions = COALESCE(key_permissions, permissions),
        rate_limit = COALESCE(rate_limit, rate_limit),
        is_active = COALESCE(is_active, is_active),
        expires_at = COALESCE(expires_at, expires_at),
        updated_at = now()
    WHERE id = key_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'API key updated successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update API key: ' || SQLERRM);
END;
$$;

-- =============================================
-- 7. GRANT PERMISSIONS
-- =============================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT SELECT, INSERT ON public.api_key_usage TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.create_api_key(text, jsonb, integer, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_api_keys() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_api_key(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_api_key(uuid, text, jsonb, integer, boolean, timestamptz) TO authenticated;

-- =============================================
-- 8. CREATE TRIGGERS
-- =============================================

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to api_keys table
DROP TRIGGER IF EXISTS update_api_keys_updated_at ON public.api_keys;
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 9. REFRESH SCHEMA CACHE
-- =============================================

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- =============================================
-- 10. VERIFICATION
-- =============================================

DO $$
DECLARE
    table_count integer;
    function_count integer;
BEGIN
    -- Check tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('api_keys', 'api_key_usage');
    
    -- Check functions
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key');
    
    RAISE NOTICE '🎯 API KEYS SYSTEM SETUP COMPLETE';
    RAISE NOTICE '================================';
    RAISE NOTICE 'Tables created: %/2', table_count;
    RAISE NOTICE 'Functions created: %/4', function_count;
    RAISE NOTICE '================================';
    
    IF table_count = 2 AND function_count = 4 THEN
        RAISE NOTICE '🎉 API key creation should now work!';
    ELSE
        RAISE NOTICE '⚠️ Some issues detected. Please check the setup.';
    END IF;
END $$;
