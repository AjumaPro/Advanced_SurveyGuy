-- =============================================
-- ENABLE REALTIME FOR ANALYTICS MONITORING
-- Run this script in your Supabase SQL Editor to enable realtime subscriptions
-- =============================================

-- Enable Realtime for survey_responses table
ALTER PUBLICATION supabase_realtime ADD TABLE public.survey_responses;

-- Enable Realtime for survey_analytics table
ALTER PUBLICATION supabase_realtime ADD TABLE public.survey_analytics;

-- Enable Realtime for user_analytics table
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_analytics;

-- =============================================
-- VERIFY REALTIME ENABLED TABLES
-- =============================================

-- Check which tables have realtime enabled
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN ('survey_responses', 'survey_analytics', 'user_analytics')
AND schemaname = 'public';

-- Check realtime publication
SELECT 
    pubname,
    puballtables,
    pubinsert,
    pubupdate,
    pubdelete,
    pubtruncate
FROM pg_publication 
WHERE pubname = 'supabase_realtime';

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Make sure RLS policies allow realtime subscriptions
-- =============================================

-- Enable RLS on tables (if not already enabled)
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for survey_responses (allow users to see their own survey responses)
CREATE POLICY "Users can view their own survey responses" ON public.survey_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = survey_responses.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

-- Create policies for survey_analytics (allow users to see their own survey analytics)
CREATE POLICY "Users can view their own survey analytics" ON public.survey_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE surveys.id = survey_analytics.survey_id 
            AND surveys.user_id = auth.uid()
        )
    );

-- Create policies for user_analytics (allow users to see their own analytics)
CREATE POLICY "Users can view their own user analytics" ON public.user_analytics
    FOR SELECT USING (user_id = auth.uid());

-- =============================================
-- TEST REALTIME CONNECTION
-- =============================================

-- Test if realtime is working by checking publication tables
SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    CASE 
        WHEN c.relkind = 'r' THEN 'table'
        WHEN c.relkind = 'v' THEN 'view'
        ELSE 'other'
    END as object_type
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname IN ('survey_responses', 'survey_analytics', 'user_analytics')
AND n.nspname = 'public';

-- =============================================
-- ALTERNATIVE: DISABLE REALTIME IF NOT NEEDED
-- =============================================

-- If you don't want to use realtime, you can disable it:
-- ALTER PUBLICATION supabase_realtime DROP TABLE public.survey_responses;
-- ALTER PUBLICATION supabase_realtime DROP TABLE public.survey_analytics;
-- ALTER PUBLICATION supabase_realtime DROP TABLE public.user_analytics;

-- =============================================
-- NOTES
-- =============================================

/*
1. After running this script, restart your application to pick up the realtime changes
2. The polling fallback will automatically activate if realtime is not available
3. Check your Supabase dashboard > Settings > API > Realtime to ensure it's enabled
4. For production, consider rate limiting and proper RLS policies
5. The application will work fine without realtime - it will use polling instead
*/
