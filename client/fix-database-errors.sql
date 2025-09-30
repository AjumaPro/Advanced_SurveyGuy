-- Fix Database Errors - Supabase SQL Script
-- Run this in your Supabase SQL Editor

-- First, let's check what tables exist and fix any issues
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Add missing columns to surveys table if they don't exist
DO $$ 
BEGIN
    -- Add advanced_features column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'advanced_features') THEN
        ALTER TABLE public.surveys ADD COLUMN advanced_features JSONB DEFAULT '{}';
    END IF;
    
    -- Add question_library_enabled column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'question_library_enabled') THEN
        ALTER TABLE public.surveys ADD COLUMN question_library_enabled BOOLEAN DEFAULT true;
    END IF;
    
    -- Add auto_save_enabled column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'auto_save_enabled') THEN
        ALTER TABLE public.surveys ADD COLUMN auto_save_enabled BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Create question_library table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.question_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  question_data JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create question_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.question_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  question_data JSONB NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  plan_required TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create question_favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.question_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES question_library(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS on new tables
ALTER TABLE public.question_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own questions and public questions" ON public.question_library;
DROP POLICY IF EXISTS "Users can insert their own questions" ON public.question_library;
DROP POLICY IF EXISTS "Users can update their own questions" ON public.question_library;
DROP POLICY IF EXISTS "Users can delete their own questions" ON public.question_library;
DROP POLICY IF EXISTS "Everyone can view question templates" ON public.question_templates;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.question_favorites;

-- Create RLS Policies for question_library
CREATE POLICY "Users can view their own questions and public questions" ON public.question_library
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert their own questions" ON public.question_library
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own questions" ON public.question_library
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own questions" ON public.question_library
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS Policies for question_templates (read-only for users)
CREATE POLICY "Everyone can view question templates" ON public.question_templates
  FOR SELECT USING (true);

-- Create RLS Policies for question_favorites
CREATE POLICY "Users can manage their own favorites" ON public.question_favorites
  FOR ALL USING (user_id = auth.uid());

-- Insert basic question templates (avoiding duplicate key errors)
INSERT INTO public.question_templates (template_id, name, description, question_data, category, tags, is_popular, plan_required) VALUES

-- Customer Feedback Templates
('customer-satisfaction-rating', 'Customer Satisfaction Rating', 'Rate your overall satisfaction with our product or service', '{
  "type": "rating",
  "title": "How satisfied are you with our service?",
  "description": "Rate your overall satisfaction with our product or service",
  "settings": {"maxRating": 5, "labels": {"1": "Very Dissatisfied", "5": "Very Satisfied"}},
  "required": false
}', 'customer-feedback', '{"satisfaction","rating","customer"}', true, 'free'),

('nps-question', 'Net Promoter Score', 'Measure customer loyalty and likelihood to recommend', '{
  "type": "nps",
  "title": "How likely are you to recommend us to a friend or colleague?",
  "description": "Measure customer loyalty and likelihood to recommend",
  "settings": {"labels": {"0": "Not at all likely", "10": "Extremely likely"}},
  "required": false
}', 'customer-feedback', '{"nps","recommendation","loyalty"}', true, 'free'),

('improvement-suggestions', 'Improvement Suggestions', 'Gather detailed feedback on potential improvements', '{
  "type": "textarea",
  "title": "What improvements would you suggest?",
  "description": "Gather detailed feedback on potential improvements",
  "settings": {"placeholder": "Please share your suggestions for improvement...", "rows": 4},
  "required": false
}', 'customer-feedback', '{"feedback","improvement","suggestions"}', false, 'free')

ON CONFLICT (template_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_question_library_user_id ON public.question_library(user_id);
CREATE INDEX IF NOT EXISTS idx_question_library_category ON public.question_library(category);
CREATE INDEX IF NOT EXISTS idx_question_library_tags ON public.question_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_question_library_public ON public.question_library(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_question_templates_category ON public.question_templates(category);
CREATE INDEX IF NOT EXISTS idx_question_templates_popular ON public.question_templates(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_question_templates_plan ON public.question_templates(plan_required);

CREATE INDEX IF NOT EXISTS idx_question_favorites_user_id ON public.question_favorites(user_id);

-- Create functions for question library operations
CREATE OR REPLACE FUNCTION public.increment_question_usage(question_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.question_library 
  SET usage_count = usage_count + 1, updated_at = NOW()
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_question_library_updated_at ON public.question_library;
DROP TRIGGER IF EXISTS update_question_templates_updated_at ON public.question_templates;

-- Create triggers
CREATE TRIGGER update_question_library_updated_at
  BEFORE UPDATE ON public.question_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_question_templates_updated_at
  BEFORE UPDATE ON public.question_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
SELECT 'Database errors fixed successfully!' as result;
SELECT 'Question library tables created and configured.' as status;
