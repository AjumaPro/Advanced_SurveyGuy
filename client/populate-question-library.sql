-- POPULATE QUESTION LIBRARY WITH SAMPLE QUESTIONS
-- Run this in Supabase SQL Editor to add sample questions to your library

-- First, ensure the question_library table exists
CREATE TABLE IF NOT EXISTS question_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    name TEXT NOT NULL,
    description TEXT,
    question_data JSONB NOT NULL,
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE question_library ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view public questions" ON question_library;
CREATE POLICY "Users can view public questions" 
ON question_library FOR SELECT 
TO authenticated 
USING (is_public = true OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own questions" ON question_library;
CREATE POLICY "Users can insert own questions" 
ON question_library FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Insert sample questions for General category
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Basic Name Question', 'Simple text input for collecting names', '{"type": "text", "question": "What is your name?", "required": true, "placeholder": "Enter your full name"}', 'general', '{"name", "text", "basic"}', true),

('Email Address', 'Email input with validation', '{"type": "email", "question": "What is your email address?", "required": true, "placeholder": "your.email@example.com"}', 'general', '{"email", "contact", "required"}', true),

('Phone Number', 'Phone number collection', '{"type": "text", "question": "What is your phone number?", "required": false, "placeholder": "+1 (555) 123-4567"}', 'general', '{"phone", "contact", "optional"}', true),

('Age Range', 'Multiple choice age demographics', '{"type": "multiple-choice", "question": "What is your age range?", "required": false, "options": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]}', 'general', '{"age", "demographics", "multiple-choice"}', true),

('Gender Identity', 'Inclusive gender identity question', '{"type": "multiple-choice", "question": "How do you identify?", "required": false, "options": ["Male", "Female", "Non-binary", "Prefer not to say", "Other"]}', 'general', '{"gender", "demographics", "inclusive"}', true);

-- Insert sample questions for Customer Feedback category
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Overall Satisfaction', 'Standard satisfaction rating', '{"type": "rating", "question": "How satisfied are you with our product/service?", "required": true, "scale": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 'customer-feedback', '{"satisfaction", "rating", "5-point"}', true),

('Net Promoter Score', 'Standard NPS question', '{"type": "rating", "question": "How likely are you to recommend us to a friend or colleague?", "required": true, "scale": 10, "description": "0 = Not at all likely, 10 = Extremely likely"}', 'customer-feedback', '{"nps", "recommendation", "10-point"}', true),

('Service Quality', 'Service quality assessment', '{"type": "multiple-choice", "question": "How would you rate the quality of service you received?", "required": true, "options": ["Excellent", "Good", "Average", "Poor", "Very Poor"]}', 'customer-feedback', '{"service", "quality", "rating"}', true),

('Improvement Suggestions', 'Open-ended feedback', '{"type": "text", "question": "What could we do to improve your experience?", "required": false, "placeholder": "Please share your suggestions..."}', 'customer-feedback', '{"improvement", "feedback", "suggestions"}', true),

('Purchase Intent', 'Purchase likelihood question', '{"type": "multiple-choice", "question": "How likely are you to purchase from us again?", "required": false, "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]}', 'customer-feedback', '{"purchase", "intent", "loyalty"}', true);

-- Insert sample questions for Employee Survey category
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Job Satisfaction', 'Employee job satisfaction rating', '{"type": "rating", "question": "How satisfied are you with your current role?", "required": true, "scale": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 'employee-survey', '{"job", "satisfaction", "employee"}', true),

('Work-Life Balance', 'Work-life balance assessment', '{"type": "rating", "question": "How would you rate your work-life balance?", "required": true, "scale": 5, "labels": ["Very Poor", "Poor", "Fair", "Good", "Excellent"]}', 'employee-survey', '{"work-life", "balance", "wellbeing"}', true),

('Manager Effectiveness', 'Manager performance rating', '{"type": "rating", "question": "How effective is your direct manager?", "required": false, "scale": 5, "labels": ["Very Ineffective", "Ineffective", "Neutral", "Effective", "Very Effective"]}', 'employee-survey', '{"manager", "leadership", "effectiveness"}', true),

('Career Development', 'Career growth opportunities', '{"type": "multiple-choice", "question": "How satisfied are you with career development opportunities?", "required": false, "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]}', 'employee-survey', '{"career", "development", "growth"}', true),

('Company Culture', 'Culture assessment question', '{"type": "text", "question": "How would you describe our company culture in three words?", "required": false, "placeholder": "e.g., collaborative, innovative, supportive"}', 'employee-survey', '{"culture", "values", "description"}', true);

-- Insert sample questions for Product Research category
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Feature Importance', 'Feature prioritization question', '{"type": "ranking", "question": "Rank these features by importance to you", "required": true, "options": ["User Interface", "Performance", "Security", "Price", "Customer Support"]}', 'product-research', '{"features", "prioritization", "ranking"}', true),

('Usage Frequency', 'Product usage frequency', '{"type": "multiple-choice", "question": "How often do you use our product?", "required": true, "options": ["Daily", "Weekly", "Monthly", "Rarely", "Never"]}', 'product-research', '{"usage", "frequency", "behavior"}', true),

('Pain Points', 'Identify customer pain points', '{"type": "checkbox", "question": "What challenges do you face with our product? (Select all that apply)", "required": false, "options": ["Too expensive", "Difficult to use", "Missing features", "Poor performance", "Lack of support", "Other"]}', 'product-research', '{"pain-points", "challenges", "checkbox"}', true),

('Feature Request', 'New feature suggestions', '{"type": "text", "question": "What new feature would be most valuable to you?", "required": false, "placeholder": "Describe the feature you would like to see..."}', 'product-research', '{"feature-request", "innovation", "suggestions"}', true),

('Competitor Comparison', 'Competitive analysis', '{"type": "multiple-choice", "question": "How does our product compare to competitors?", "required": false, "options": ["Much better", "Better", "About the same", "Worse", "Much worse", "No experience with competitors"]}', 'product-research', '{"competition", "comparison", "analysis"}', true);

-- Insert sample questions for Event Feedback category
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Event Rating', 'Overall event satisfaction', '{"type": "rating", "question": "How would you rate this event overall?", "required": true, "scale": 5, "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'event-feedback', '{"event", "rating", "overall"}', true),

('Content Quality', 'Event content assessment', '{"type": "rating", "question": "How would you rate the quality of the content presented?", "required": true, "scale": 5, "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]}', 'event-feedback', '{"content", "quality", "presentation"}', true),

('Venue Rating', 'Venue and logistics feedback', '{"type": "multiple-choice", "question": "How would you rate the venue and logistics?", "required": false, "options": ["Excellent", "Good", "Average", "Poor", "Very Poor"]}', 'event-feedback', '{"venue", "logistics", "location"}', true),

('Speaker Effectiveness', 'Speaker performance rating', '{"type": "rating", "question": "How effective were the speakers/presenters?", "required": false, "scale": 5, "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]}', 'event-feedback', '{"speaker", "presenter", "effectiveness"}', true),

('Future Attendance', 'Future event interest', '{"type": "multiple-choice", "question": "Would you attend similar events in the future?", "required": false, "options": ["Definitely yes", "Probably yes", "Maybe", "Probably no", "Definitely no"]}', 'event-feedback', '{"future", "attendance", "interest"}', true);

-- Insert sample questions for Education category
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Course Effectiveness', 'Course evaluation rating', '{"type": "rating", "question": "How effective was this course in meeting your learning objectives?", "required": true, "scale": 5, "labels": ["Not Effective", "Slightly Effective", "Moderately Effective", "Very Effective", "Extremely Effective"]}', 'education', '{"course", "effectiveness", "learning"}', true),

('Instructor Rating', 'Instructor performance assessment', '{"type": "rating", "question": "How would you rate the instructor?", "required": true, "scale": 5, "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'education', '{"instructor", "teacher", "performance"}', true),

('Course Difficulty', 'Course difficulty assessment', '{"type": "multiple-choice", "question": "How would you describe the difficulty level of this course?", "required": false, "options": ["Too easy", "Slightly easy", "Just right", "Slightly difficult", "Too difficult"]}', 'education', '{"difficulty", "level", "assessment"}', true),

('Learning Materials', 'Materials quality evaluation', '{"type": "checkbox", "question": "Which learning materials were most helpful? (Select all that apply)", "required": false, "options": ["Lecture slides", "Video content", "Reading materials", "Assignments", "Discussion forums", "Practice exercises"]}', 'education', '{"materials", "resources", "helpful"}', true),

('Course Recommendation', 'Course recommendation likelihood', '{"type": "rating", "question": "How likely are you to recommend this course to others?", "required": false, "scale": 10, "description": "0 = Not at all likely, 10 = Extremely likely"}', 'education', '{"recommendation", "nps", "course"}', true);

-- Insert sample questions for Healthcare category
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Care Quality', 'Healthcare service quality', '{"type": "rating", "question": "How would you rate the quality of care you received?", "required": true, "scale": 5, "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'healthcare', '{"care", "quality", "service"}', true),

('Wait Time', 'Waiting time satisfaction', '{"type": "multiple-choice", "question": "How satisfied were you with the wait time?", "required": true, "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]}', 'healthcare', '{"wait-time", "satisfaction", "efficiency"}', true),

('Staff Friendliness', 'Staff interaction rating', '{"type": "rating", "question": "How would you rate the friendliness of our staff?", "required": false, "scale": 5, "labels": ["Very Unfriendly", "Unfriendly", "Neutral", "Friendly", "Very Friendly"]}', 'healthcare', '{"staff", "friendliness", "interaction"}', true),

('Communication Clarity', 'Healthcare communication assessment', '{"type": "rating", "question": "How clearly did the healthcare provider explain your condition/treatment?", "required": false, "scale": 5, "labels": ["Very Unclear", "Unclear", "Somewhat Clear", "Clear", "Very Clear"]}', 'healthcare', '{"communication", "clarity", "explanation"}', true),

('Facility Cleanliness', 'Facility condition assessment', '{"type": "multiple-choice", "question": "How would you rate the cleanliness of our facility?", "required": false, "options": ["Excellent", "Good", "Average", "Poor", "Very Poor"]}', 'healthcare', '{"facility", "cleanliness", "environment"}', true);

-- Insert advanced question types and templates
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Emoji Scale Rating', 'Visual emoji-based rating scale', '{"type": "emoji-scale", "question": "How do you feel about our service?", "required": true, "emojis": ["😞", "😐", "🙂", "😊", "😍"], "labels": ["Very Unhappy", "Unhappy", "Neutral", "Happy", "Very Happy"]}', 'general', '{"emoji", "visual", "rating"}', true),

('Matrix Rating', 'Multiple attributes rating matrix', '{"type": "matrix", "question": "Please rate the following aspects of our service:", "required": true, "rows": ["Quality", "Speed", "Price", "Support"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'customer-feedback', '{"matrix", "multiple", "attributes"}', true),

('Slider Scale', 'Continuous slider rating', '{"type": "slider", "question": "On a scale of 0-100, how likely are you to recommend us?", "required": true, "min": 0, "max": 100, "step": 1, "default": 50}', 'customer-feedback', '{"slider", "continuous", "nps"}', true),

('Date Selection', 'Date picker for events', '{"type": "date", "question": "When would you prefer to schedule your appointment?", "required": true, "minDate": "today", "maxDate": "+30days"}', 'general', '{"date", "scheduling", "appointment"}', true),

('File Upload', 'Document upload question', '{"type": "file", "question": "Please upload any relevant documents", "required": false, "acceptedTypes": [".pdf", ".doc", ".docx", ".jpg", ".png"], "maxSize": "5MB"}', 'general', '{"file", "upload", "documents"}', true),

('Priority Ranking', 'Drag and drop ranking', '{"type": "ranking", "question": "Rank these priorities in order of importance to you:", "required": true, "options": ["Cost savings", "Time efficiency", "Quality improvement", "Customer service", "Innovation"]}', 'product-research', '{"ranking", "priorities", "drag-drop"}', true),

('Budget Range', 'Budget selection question', '{"type": "multiple-choice", "question": "What is your budget range for this project?", "required": true, "options": ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "Over $25,000"]}', 'general', '{"budget", "price", "range"}', true),

('Yes/No Decision', 'Simple boolean question', '{"type": "boolean", "question": "Would you be interested in receiving our newsletter?", "required": false, "trueLabel": "Yes, sign me up", "falseLabel": "No, thank you"}', 'general', '{"boolean", "newsletter", "subscription"}', true),

('Multi-Select Options', 'Multiple selection checkbox', '{"type": "checkbox", "question": "Which of the following services are you interested in? (Select all that apply)", "required": false, "options": ["Consulting", "Training", "Support", "Custom Development", "Maintenance"]}', 'product-research', '{"checkbox", "multi-select", "services"}', true),

('Open Feedback', 'Long-form text feedback', '{"type": "textarea", "question": "Please share any additional comments or feedback:", "required": false, "placeholder": "Your detailed feedback helps us improve...", "maxLength": 500}', 'customer-feedback', '{"feedback", "comments", "long-form"}', true);

-- Insert industry-specific questions
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Website Usability', 'Website user experience rating', '{"type": "rating", "question": "How easy was it to find what you were looking for on our website?", "required": true, "scale": 5, "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]}', 'customer-feedback', '{"website", "usability", "ux"}', true),

('Purchase Decision Factors', 'Factors influencing purchase decisions', '{"type": "checkbox", "question": "What factors influenced your purchase decision? (Select all that apply)", "required": false, "options": ["Price", "Quality", "Brand reputation", "Reviews", "Features", "Customer service", "Recommendations"]}', 'product-research', '{"purchase", "decision", "factors"}', true),

('Training Effectiveness', 'Training program evaluation', '{"type": "rating", "question": "How effective was the training program?", "required": true, "scale": 5, "labels": ["Not Effective", "Slightly Effective", "Moderately Effective", "Very Effective", "Extremely Effective"]}', 'education', '{"training", "effectiveness", "program"}', true),

('Event Format Preference', 'Event format preferences', '{"type": "multiple-choice", "question": "Which event format do you prefer?", "required": false, "options": ["In-person only", "Virtual only", "Hybrid (both options)", "No preference"]}', 'event-feedback', '{"format", "preference", "hybrid"}', true),

('Communication Preferences', 'Preferred communication channels', '{"type": "checkbox", "question": "How would you prefer to receive updates from us? (Select all that apply)", "required": false, "options": ["Email", "SMS/Text", "Phone call", "Mail", "Social media", "Mobile app notifications"]}', 'general', '{"communication", "preferences", "channels"}', true);

-- Insert creative and engaging question types
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Emoji Mood Check', 'Fun emoji-based mood assessment', '{"type": "emoji-scale", "question": "How are you feeling today?", "required": false, "emojis": ["😢", "😟", "😐", "🙂", "😄"], "labels": ["Sad", "Worried", "Neutral", "Happy", "Excited"]}', 'general', '{"mood", "emoji", "fun"}', true),

('Color Preference', 'Visual color selection', '{"type": "color", "question": "What color best represents your brand?", "required": false, "description": "Click to select your preferred color"}', 'product-research', '{"color", "visual", "brand"}', true),

('Star Rating', 'Classic star rating system', '{"type": "star-rating", "question": "Rate your experience with us:", "required": true, "maxStars": 5, "allowHalf": true}', 'customer-feedback', '{"stars", "rating", "classic"}', true),

('Image Selection', 'Visual preference selection', '{"type": "image-choice", "question": "Which design style do you prefer?", "required": false, "options": [{"image": "/images/modern.jpg", "label": "Modern"}, {"image": "/images/classic.jpg", "label": "Classic"}, {"image": "/images/minimalist.jpg", "label": "Minimalist"}]}', 'product-research', '{"image", "visual", "design"}', true),

('Timeline Question', 'Timeline or deadline selection', '{"type": "multiple-choice", "question": "When do you need this project completed?", "required": true, "options": ["Within 1 week", "Within 1 month", "Within 3 months", "Within 6 months", "No specific deadline"]}', 'general', '{"timeline", "deadline", "project"}', true);

-- Add question templates for quick access
INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES
('Quick Poll Template', 'Simple yes/no poll question', '{"type": "boolean", "question": "Do you support this proposal?", "required": true, "trueLabel": "Yes, I support it", "falseLabel": "No, I do not support it"}', 'general', '{"poll", "voting", "template"}', true),

('Contact Information Set', 'Complete contact info collection', '{"type": "group", "question": "Contact Information", "required": true, "fields": [{"type": "text", "label": "Full Name", "required": true}, {"type": "email", "label": "Email", "required": true}, {"type": "text", "label": "Phone", "required": false}]}', 'general', '{"contact", "information", "group"}', true),

('Demographic Profile', 'Basic demographic information', '{"type": "group", "question": "Demographic Information", "required": false, "fields": [{"type": "multiple-choice", "label": "Age Range", "options": ["18-24", "25-34", "35-44", "45-54", "55+"]}, {"type": "multiple-choice", "label": "Education Level", "options": ["High School", "Some College", "Bachelor''s", "Master''s", "PhD"]}]}', 'general', '{"demographics", "profile", "group"}', true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_question_library_category ON question_library(category);
CREATE INDEX IF NOT EXISTS idx_question_library_tags ON question_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_question_library_public ON question_library(is_public);
CREATE INDEX IF NOT EXISTS idx_question_library_usage ON question_library(usage_count DESC);

-- Update usage counts for popular questions
UPDATE question_library SET usage_count = floor(random() * 100) + 10 WHERE category IN ('general', 'customer-feedback');
UPDATE question_library SET usage_count = floor(random() * 50) + 5 WHERE category IN ('employee-survey', 'product-research');

-- Success message
SELECT 
    category,
    COUNT(*) as question_count,
    'Question Library populated successfully!' as status
FROM question_library 
GROUP BY category 
ORDER BY question_count DESC;
