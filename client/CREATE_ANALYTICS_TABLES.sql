-- =============================================
-- ANALYTICS TABLES FOR AUTOMATIC SURVEY RESPONSE TRACKING
-- Run this script in your Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. SURVEY ANALYTICS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.survey_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_responses INTEGER DEFAULT 0,
    completed_responses INTEGER DEFAULT 0,
    average_completion_time DECIMAL(10,2) DEFAULT 0.00,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    last_response_at TIMESTAMPTZ,
    first_response_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(survey_id)
);

-- Enable RLS
ALTER TABLE public.survey_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for survey analytics
DROP POLICY IF EXISTS "Survey owners can view analytics" ON public.survey_analytics;
CREATE POLICY "Survey owners can view analytics" ON public.survey_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.surveys 
            WHERE id = survey_id AND user_id = auth.uid()
        )
    );

-- =============================================
-- 2. USER ANALYTICS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    total_surveys INTEGER DEFAULT 0,
    total_responses INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    average_completion_rate DECIMAL(5,2) DEFAULT 0.00,
    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user analytics
DROP POLICY IF EXISTS "Users can view own analytics" ON public.user_analytics;
CREATE POLICY "Users can view own analytics" ON public.user_analytics
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 3. ANALYTICS UPDATE TRIGGER FUNCTION
-- =============================================

-- Function to automatically update analytics when a survey response is inserted
CREATE OR REPLACE FUNCTION update_survey_analytics_on_response()
RETURNS TRIGGER AS $$
DECLARE
    survey_owner_id UUID;
    existing_analytics RECORD;
    response_count INTEGER;
    completion_time_avg DECIMAL(10,2);
BEGIN
    -- Get survey owner
    SELECT user_id INTO survey_owner_id
    FROM public.surveys
    WHERE id = NEW.survey_id;
    
    IF survey_owner_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Get current response count for this survey
    SELECT COUNT(*) INTO response_count
    FROM public.survey_responses
    WHERE survey_id = NEW.survey_id;
    
    -- Calculate average completion time
    SELECT COALESCE(AVG(completion_time), 0) INTO completion_time_avg
    FROM public.survey_responses
    WHERE survey_id = NEW.survey_id AND completion_time IS NOT NULL;
    
    -- Check if analytics record exists
    SELECT * INTO existing_analytics
    FROM public.survey_analytics
    WHERE survey_id = NEW.survey_id;
    
    IF existing_analytics IS NULL THEN
        -- Create new analytics record
        INSERT INTO public.survey_analytics (
            survey_id,
            user_id,
            total_responses,
            completed_responses,
            average_completion_time,
            completion_rate,
            last_response_at,
            first_response_at
        ) VALUES (
            NEW.survey_id,
            survey_owner_id,
            response_count,
            response_count, -- Assuming all responses are completed for now
            100.0, -- Default completion rate
            completion_time_avg,
            NEW.submitted_at,
            NEW.submitted_at
        );
    ELSE
        -- Update existing analytics record
        UPDATE public.survey_analytics SET
            total_responses = response_count,
            completed_responses = response_count,
            average_completion_time = completion_time_avg,
            completion_rate = CASE 
                WHEN response_count > 0 THEN 100.0 
                ELSE 0.0 
            END,
            last_response_at = NEW.submitted_at,
            updated_at = NOW()
        WHERE survey_id = NEW.survey_id;
    END IF;
    
    -- Update user analytics
    PERFORM update_user_analytics(survey_owner_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. USER ANALYTICS UPDATE FUNCTION
-- =============================================

-- Function to update user-level analytics
CREATE OR REPLACE FUNCTION update_user_analytics(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    survey_count INTEGER;
    response_count INTEGER;
    question_count INTEGER;
    existing_user_analytics RECORD;
BEGIN
    -- Count user's surveys
    SELECT COUNT(*) INTO survey_count
    FROM public.surveys
    WHERE user_id = target_user_id;
    
    -- Count total responses across all user's surveys
    SELECT COUNT(*) INTO response_count
    FROM public.survey_responses sr
    JOIN public.surveys s ON sr.survey_id = s.id
    WHERE s.user_id = target_user_id;
    
    -- Count total questions across all user's surveys
    SELECT COALESCE(SUM(jsonb_array_length(questions)), 0) INTO question_count
    FROM public.surveys
    WHERE user_id = target_user_id AND questions IS NOT NULL;
    
    -- Check if user analytics record exists
    SELECT * INTO existing_user_analytics
    FROM public.user_analytics
    WHERE user_id = target_user_id;
    
    IF existing_user_analytics IS NULL THEN
        -- Create new user analytics record
        INSERT INTO public.user_analytics (
            user_id,
            total_surveys,
            total_responses,
            total_questions,
            average_completion_rate,
            last_activity_at
        ) VALUES (
            target_user_id,
            survey_count,
            response_count,
            question_count,
            CASE WHEN response_count > 0 THEN 100.0 ELSE 0.0 END,
            NOW()
        );
    ELSE
        -- Update existing user analytics record
        UPDATE public.user_analytics SET
            total_surveys = survey_count,
            total_responses = response_count,
            total_questions = question_count,
            average_completion_rate = CASE WHEN response_count > 0 THEN 100.0 ELSE 0.0 END,
            last_activity_at = NOW(),
            updated_at = NOW()
        WHERE user_id = target_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. CREATE TRIGGER
-- =============================================

-- Create trigger to automatically update analytics on response insertion
DROP TRIGGER IF EXISTS trigger_update_survey_analytics ON public.survey_responses;
CREATE TRIGGER trigger_update_survey_analytics
    AFTER INSERT ON public.survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_survey_analytics_on_response();

-- =============================================
-- 6. INITIALIZE EXISTING DATA
-- =============================================

-- Initialize analytics for existing surveys
DO $$
DECLARE
    survey_record RECORD;
BEGIN
    FOR survey_record IN 
        SELECT id, user_id FROM public.surveys
    LOOP
        PERFORM update_user_analytics(survey_record.user_id);
    END LOOP;
END $$;

-- =============================================
-- 7. VERIFICATION QUERIES
-- =============================================

-- Check if analytics tables were created
SELECT 
    'Analytics Tables Status:' as info,
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('survey_analytics', 'user_analytics')
ORDER BY tablename;

-- Check if trigger was created
SELECT 
    'Analytics Trigger Status:' as info,
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_survey_analytics';

-- Success message
SELECT 'Analytics tables and triggers created successfully! Survey responses will now automatically update analytics.' as final_status;
