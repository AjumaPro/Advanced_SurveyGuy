-- Advanced Question Features Database Schema
-- This script adds support for advanced question types, templates, and library functionality

-- Add new columns to surveys table for advanced features
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS advanced_features JSONB DEFAULT '{}';
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS question_library_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS auto_save_enabled BOOLEAN DEFAULT true;

-- Create question_library table for saved questions
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

-- Create question_templates table for pre-built templates
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

-- Create question_favorites table for user favorites
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

-- RLS Policies for question_library
CREATE POLICY "Users can view their own questions and public questions" ON public.question_library
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert their own questions" ON public.question_library
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own questions" ON public.question_library
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own questions" ON public.question_library
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for question_templates (read-only for users)
CREATE POLICY "Everyone can view question templates" ON public.question_templates
  FOR SELECT USING (true);

-- RLS Policies for question_favorites
CREATE POLICY "Users can manage their own favorites" ON public.question_favorites
  FOR ALL USING (user_id = auth.uid());

-- Insert pre-built question templates
INSERT INTO public.question_templates (template_id, name, description, question_data, category, tags, is_popular, plan_required) VALUES

-- Customer Feedback Templates
('customer-satisfaction-rating', 'Customer Satisfaction Rating', 'Rate your overall satisfaction with our product or service', '{
  "type": "rating",
  "title": "How satisfied are you with our service?",
  "description": "Rate your overall satisfaction with our product or service",
  "settings": {"maxRating": 5, "labels": {"1": "Very Dissatisfied", "5": "Very Satisfied"}},
  "required": false
}', 'customer', '{"satisfaction","rating","customer"}', true, 'free'),

('nps-question', 'Net Promoter Score', 'Measure customer loyalty and likelihood to recommend', '{
  "type": "nps",
  "title": "How likely are you to recommend us to a friend or colleague?",
  "description": "Measure customer loyalty and likelihood to recommend",
  "settings": {"labels": {"0": "Not at all likely", "10": "Extremely likely"}},
  "required": false
}', 'customer', '{"nps","recommendation","loyalty"}', true, 'free'),

('improvement-suggestions', 'Improvement Suggestions', 'Gather detailed feedback on potential improvements', '{
  "type": "textarea",
  "title": "What improvements would you suggest?",
  "description": "Gather detailed feedback on potential improvements",
  "settings": {"placeholder": "Please share your suggestions for improvement...", "rows": 4},
  "required": false
}', 'customer', '{"feedback","improvement","suggestions"}', false, 'free'),

('customer-support-rating', 'Customer Support Rating', 'Rate the quality of customer support interaction', '{
  "type": "emoji_scale",
  "title": "How would you rate your customer support experience?",
  "description": "Rate the quality of customer support interaction",
  "settings": {"scaleType": "experience", "showLabels": true},
  "required": false
}', 'customer', '{"support","experience","emoji"}', false, 'free'),

-- Employee Survey Templates
('job-satisfaction', 'Job Satisfaction', 'Measure employee satisfaction with their job', '{
  "type": "rating",
  "title": "How satisfied are you with your current role?",
  "description": "Measure employee satisfaction with their job",
  "settings": {"maxRating": 10, "labels": {"1": "Very Dissatisfied", "10": "Very Satisfied"}},
  "required": false
}', 'employee', '{"satisfaction","job","employee"}', true, 'pro'),

('work-life-balance', 'Work-Life Balance', 'Assess employee work-life balance satisfaction', '{
  "type": "emoji_scale",
  "title": "How do you feel about your work-life balance?",
  "description": "Assess employee work-life balance satisfaction",
  "settings": {"scaleType": "satisfaction", "showLabels": true},
  "required": false
}', 'employee', '{"balance","wellbeing","employee"}', false, 'pro'),

('manager-feedback', 'Manager Effectiveness', 'Evaluate manager communication effectiveness', '{
  "type": "multiple_choice",
  "title": "How would you describe your manager''s communication style?",
  "description": "Evaluate manager communication effectiveness",
  "settings": {"options": ["Very clear and helpful", "Generally clear", "Sometimes unclear", "Often confusing", "Very poor communication"], "allowOther": false},
  "required": false
}', 'employee', '{"manager","communication","leadership"}', false, 'pro'),

('career-development', 'Career Development Opportunities', 'Identify employee development preferences', '{
  "type": "checkbox",
  "title": "Which career development opportunities interest you most?",
  "description": "Identify employee development preferences",
  "settings": {"options": ["Leadership training", "Technical skills training", "Mentoring program", "Cross-functional projects", "External courses", "Conference attendance"], "minSelections": 1, "maxSelections": 3},
  "required": false
}', 'employee', '{"development","training","career"}', false, 'pro'),

-- Product Research Templates
('feature-priority', 'Feature Priority Ranking', 'Prioritize product features based on user needs', '{
  "type": "ranking",
  "title": "Please rank these features in order of importance to you",
  "description": "Prioritize product features based on user needs",
  "settings": {"options": ["Feature A", "Feature B", "Feature C", "Feature D", "Feature E"], "maxRank": 5},
  "required": false
}', 'product', '{"features","priority","ranking"}', false, 'pro'),

('product-usage-frequency', 'Product Usage Frequency', 'Understand product usage patterns', '{
  "type": "multiple_choice",
  "title": "How often do you use our product?",
  "description": "Understand product usage patterns",
  "settings": {"options": ["Daily", "Several times a week", "Weekly", "Monthly", "Rarely", "Never"], "allowOther": false},
  "required": false
}', 'product', '{"usage","frequency","behavior"}', true, 'free'),

('price-sensitivity', 'Price Sensitivity', 'Gauge customer price expectations', '{
  "type": "slider",
  "title": "What would you consider a fair price for this product?",
  "description": "Gauge customer price expectations",
  "settings": {"min": 0, "max": 500, "step": 10, "showValue": true},
  "required": false
}', 'product', '{"pricing","value","economics"}', false, 'pro'),

-- Event Feedback Templates
('event-overall-rating', 'Overall Event Rating', 'General event satisfaction rating', '{
  "type": "rating",
  "title": "How would you rate the overall event experience?",
  "description": "General event satisfaction rating",
  "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}},
  "required": false
}', 'event', '{"event","overall","rating"}', true, 'free'),

('session-feedback', 'Session Feedback', 'Detailed feedback on individual event sessions', '{
  "type": "matrix",
  "title": "Please rate each session you attended",
  "description": "Detailed feedback on individual event sessions",
  "settings": {"rows": ["Keynote Presentation", "Workshop A", "Panel Discussion", "Networking Session"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"], "scaleType": "radio"},
  "required": false
}', 'event', '{"sessions","matrix","detailed"}', false, 'pro'),

('event-recommendation', 'Event Recommendation', 'Simple recommendation question', '{
  "type": "thumbs",
  "title": "Would you recommend this event to colleagues?",
  "description": "Simple recommendation question",
  "settings": {"labels": {"up": "Yes, I would recommend", "down": "No, I would not recommend"}},
  "required": false
}', 'event', '{"recommendation","simple","thumbs"}', false, 'free'),

-- Education Templates
('course-difficulty', 'Course Difficulty', 'Assess course difficulty from student perspective', '{
  "type": "emoji_scale",
  "title": "How would you rate the difficulty level of this course?",
  "description": "Assess course difficulty from student perspective",
  "settings": {"scaleType": "difficulty", "showLabels": true},
  "required": false
}', 'education', '{"difficulty","course","education"}', false, 'free'),

('learning-objectives', 'Learning Objectives Achievement', 'Measure learning objective achievement', '{
  "type": "likert",
  "title": "The course helped me achieve the stated learning objectives",
  "description": "Measure learning objective achievement",
  "settings": {"points": 5, "labels": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]},
  "required": false
}', 'education', '{"objectives","learning","achievement"}', false, 'free'),

('instructor-feedback', 'Instructor Effectiveness', 'Identify effective teaching methods', '{
  "type": "multiple_choice",
  "title": "Which aspect of the instructor''s teaching was most effective?",
  "description": "Identify effective teaching methods",
  "settings": {"options": ["Clear explanations", "Interactive activities", "Real-world examples", "Responsive to questions", "Organized presentation"], "allowOther": true},
  "required": false
}', 'education', '{"instructor","teaching","effectiveness"}', false, 'free'),

-- Healthcare Templates
('pain-scale', 'Pain Level Assessment', 'Standardized pain assessment scale', '{
  "type": "scale",
  "title": "On a scale of 1-10, how would you rate your current pain level?",
  "description": "Standardized pain assessment scale",
  "settings": {"minScale": 1, "maxScale": 10, "step": 1, "labels": {"1": "No Pain", "10": "Worst Pain"}},
  "required": false
}', 'healthcare', '{"pain","assessment","medical"}', false, 'pro'),

('appointment-satisfaction', 'Appointment Satisfaction', 'Patient satisfaction with medical appointment', '{
  "type": "emoji_scale",
  "title": "How satisfied were you with your appointment today?",
  "description": "Patient satisfaction with medical appointment",
  "settings": {"scaleType": "satisfaction", "showLabels": true},
  "required": false
}', 'healthcare', '{"appointment","satisfaction","patient"}', false, 'pro'),

-- Market Research Templates
('brand-awareness', 'Brand Awareness', 'Measure brand recognition and awareness', '{
  "type": "multiple_choice",
  "title": "Which of these brands are you familiar with?",
  "description": "Measure brand recognition and awareness",
  "settings": {"options": ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"], "allowMultiple": true},
  "required": false
}', 'market', '{"brand","awareness","recognition"}', false, 'pro'),

('purchase-intent', 'Purchase Intent', 'Measure customer purchase intention', '{
  "type": "scale",
  "title": "How likely are you to purchase this product in the next 6 months?",
  "description": "Measure customer purchase intention",
  "settings": {"minScale": 1, "maxScale": 7, "step": 1, "labels": {"1": "Very Unlikely", "7": "Very Likely"}},
  "required": false
}', 'market', '{"purchase","intent","likelihood"}', false, 'pro'),

-- Contact Information Templates
('email-address', 'Email Address', 'Collect respondent email for follow-up', '{
  "type": "email",
  "title": "What is your email address?",
  "description": "Collect respondent email for follow-up",
  "settings": {"placeholder": "your@email.com"},
  "required": false
}', 'contact', '{"email","contact","communication"}', false, 'free'),

('phone-number', 'Phone Number', 'Collect phone number for contact purposes', '{
  "type": "phone",
  "title": "What is your phone number?",
  "description": "Collect phone number for contact purposes",
  "settings": {"placeholder": "+1 (555) 123-4567", "format": "international"},
  "required": false
}', 'contact', '{"phone","contact","communication"}', false, 'free'),

('company-info', 'Company Information', 'Collect professional affiliation information', '{
  "type": "text",
  "title": "What company do you work for?",
  "description": "Collect professional affiliation information",
  "settings": {"placeholder": "Enter your company name"},
  "required": false
}', 'contact', '{"company","professional","business"}', false, 'free');

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

CREATE OR REPLACE FUNCTION public.get_user_question_stats(user_uuid UUID)
RETURNS TABLE(
  total_saved INTEGER,
  total_favorites INTEGER,
  most_used_category TEXT,
  total_usage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM public.question_library WHERE user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM public.question_favorites WHERE user_id = user_uuid),
    (SELECT category FROM public.question_library WHERE user_id = user_uuid GROUP BY category ORDER BY COUNT(*) DESC LIMIT 1),
    (SELECT SUM(usage_count)::INTEGER FROM public.question_library WHERE user_id = user_uuid);
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

CREATE TRIGGER update_question_library_updated_at
  BEFORE UPDATE ON public.question_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_question_templates_updated_at
  BEFORE UPDATE ON public.question_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add sample saved questions for demonstration
INSERT INTO public.question_library (user_id, name, description, question_data, category, tags, is_public, usage_count) VALUES
('00000000-0000-0000-0000-000000000000', 'Standard Satisfaction Question', 'A commonly used customer satisfaction rating question', '{
  "type": "rating",
  "title": "How satisfied are you with our service?",
  "description": "Please rate your overall satisfaction",
  "settings": {"maxRating": 5, "labels": {"1": "Very Poor", "5": "Excellent"}},
  "required": true
}', 'customer', '{"satisfaction","rating","standard"}', true, 0),

('00000000-0000-0000-0000-000000000000', 'Open Feedback Question', 'General purpose feedback collection question', '{
  "type": "textarea",
  "title": "Please share any additional feedback or comments",
  "description": "Your feedback helps us improve our service",
  "settings": {"placeholder": "Enter your feedback here...", "rows": 4, "maxLength": 1000},
  "required": false
}', 'general', '{"feedback","comments","general"}', true, 0),

('00000000-0000-0000-0000-000000000000', 'Emoji Satisfaction Scale', 'Fun emoji-based satisfaction rating', '{
  "type": "emoji_scale",
  "title": "How do you feel about your experience?",
  "description": "Express your satisfaction using emojis",
  "settings": {"scaleType": "satisfaction", "showLabels": true},
  "required": false
}', 'general', '{"emoji","satisfaction","fun"}', true, 0);

-- Success message
SELECT 'Advanced question features database schema created successfully!' as result;
SELECT 'Added ' || COUNT(*) || ' question templates to the database.' as templates_added 
FROM public.question_templates;
