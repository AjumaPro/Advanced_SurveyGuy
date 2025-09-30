-- =============================================
-- SIMPLE API KEYS FIX
-- =============================================
-- This script creates the API keys system step by step
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. DROP EXISTING FUNCTIONS (IF ANY)
-- =============================================

DROP FUNCTION IF EXISTS public.create_api_key(text, jsonb, integer, timestamptz);
DROP FUNCTION IF EXISTS public.get_user_api_keys();
DROP FUNCTION IF EXISTS public.delete_api_key(uuid);
DROP FUNCTION IF EXISTS public.update_api_key(uuid, text, jsonb, integer, boolean, timestamptz);

-- =============================================
-- 2. CREATE TABLES (IF NOT EXISTS)
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
-- 3. ENABLE RLS
-- =============================================

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_key_usage ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE BASIC RLS POLICIES
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can create their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON public.api_keys;

-- Create new policies
CREATE POLICY "Users can view their own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON public.api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 5. CREATE FUNCTIONS (ONE BY ONE)
-- =============================================

-- Function 1: get_user_api_keys (0 parameters)
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

-- Function 2: create_api_key (4 parameters)
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

-- Function 3: delete_api_key (1 parameter)
CREATE OR REPLACE FUNCTION public.delete_api_key(key_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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

-- Function 4: update_api_key (6 parameters)
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
-- 6. GRANT PERMISSIONS
-- =============================================

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT SELECT, INSERT ON public.api_key_usage TO authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION public.get_user_api_keys() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_api_key(text, jsonb, integer, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_api_key(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_api_key(uuid, text, jsonb, integer, boolean, timestamptz) TO authenticated;

-- =============================================
-- 7. REFRESH SCHEMA CACHE
-- =============================================

NOTIFY pgrst, 'reload schema';

-- =============================================
-- 8. VERIFICATION
-- =============================================

DO $$
DECLARE
    func_count integer;
    table_count integer;
BEGIN
    -- Count functions
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('create_api_key', 'get_user_api_keys', 'delete_api_key', 'update_api_key');
    
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('api_keys', 'api_key_usage');
    
    RAISE NOTICE '🎯 SIMPLE API KEYS FIX COMPLETE';
    RAISE NOTICE '===============================';
    RAISE NOTICE 'Functions created: %/4', func_count;
    RAISE NOTICE 'Tables created: %/2', table_count;
    RAISE NOTICE '===============================';
    
    IF func_count = 4 AND table_count = 2 THEN
        RAISE NOTICE '🎉 API keys system is ready!';
    ELSE
        RAISE NOTICE '⚠️ Some issues detected. Check the debug script.';
    END IF;
END $$;
