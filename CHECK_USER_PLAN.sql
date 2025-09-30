-- =============================================
-- CHECK USER PLAN AND API ACCESS
-- =============================================
-- This script helps debug user plan issues
-- Run this in your Supabase SQL Editor

-- Check if profiles table exists and has data
DO $$
DECLARE
    profile_count INTEGER;
    api_access_count INTEGER;
    rec RECORD;
BEGIN
    -- Count profiles
    SELECT COUNT(*) INTO profile_count FROM profiles;
    
    -- Count users with Pro/Enterprise plans
    SELECT COUNT(*) INTO api_access_count 
    FROM profiles 
    WHERE plan IN ('pro', 'enterprise') OR role IN ('admin', 'super_admin');
    
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'USER PLAN CHECK';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Total profiles: %', profile_count;
    RAISE NOTICE 'Users with API access: %', api_access_count;
    RAISE NOTICE '=============================================';
    
    -- Show sample profiles
    RAISE NOTICE 'Sample profiles:';
    FOR rec IN 
        SELECT id, email, plan, role, created_at 
        FROM profiles 
        ORDER BY created_at DESC 
        LIMIT 5
    LOOP
        RAISE NOTICE '  - % (%) - Plan: %, Role: %', 
            rec.email, 
            rec.id, 
            rec.plan, 
            rec.role;
    END LOOP;
    
    RAISE NOTICE '=============================================';
END $$;

-- Check if api_keys table exists
DO $$
DECLARE
    table_exists BOOLEAN;
    key_count INTEGER;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'api_keys' AND table_schema = 'public'
    ) INTO table_exists;
    
    IF table_exists THEN
        SELECT COUNT(*) INTO key_count FROM api_keys;
        RAISE NOTICE 'API Keys table: EXISTS';
        RAISE NOTICE 'Total API keys: %', key_count;
    ELSE
        RAISE NOTICE 'API Keys table: DOES NOT EXIST';
        RAISE NOTICE 'Please run CREATE_API_KEYS_TABLE.sql first';
    END IF;
END $$;
