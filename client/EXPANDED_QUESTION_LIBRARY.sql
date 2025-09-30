-- EXPANDED QUESTION LIBRARY - 10 QUESTION SETS PER CATEGORY
-- Run this in Supabase SQL Editor to add 70+ professional questions

-- Clear existing sample data if needed (optional)
-- DELETE FROM question_library WHERE is_public = true;

-- =============================================
-- GENERAL CATEGORY - 10 Question Sets
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Set 1: Basic Contact Information
('Full Name Collection', 'Professional name input with validation', '{"type": "text", "question": "What is your full name?", "required": true, "placeholder": "First and Last Name", "minLength": 2, "maxLength": 100}', 'general', '{"name", "contact", "required"}', true),

('Primary Email', 'Email with business validation', '{"type": "email", "question": "What is your primary email address?", "required": true, "placeholder": "name@company.com", "validation": "business"}', 'general', '{"email", "business", "primary"}', true),

('Phone Number with Format', 'Formatted phone number input', '{"type": "text", "question": "What is your phone number?", "required": false, "placeholder": "+1 (555) 123-4567", "pattern": "phone", "format": "US"}', 'general', '{"phone", "formatted", "contact"}', true),

-- Set 2: Demographics & Personal Info
('Detailed Age Range', 'Comprehensive age demographics', '{"type": "multiple-choice", "question": "Please select your age group:", "required": false, "options": ["Under 18", "18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70+"]}', 'general', '{"age", "demographics", "detailed"}', true),

('Gender Identity Inclusive', 'Comprehensive gender options', '{"type": "multiple-choice", "question": "How do you identify your gender?", "required": false, "options": ["Man", "Woman", "Non-binary", "Genderfluid", "Agender", "Two-spirit", "Prefer to self-describe", "Prefer not to answer"]}', 'general', '{"gender", "inclusive", "identity"}', true),

('Education Level', 'Educational background assessment', '{"type": "multiple-choice", "question": "What is your highest level of education?", "required": false, "options": ["Less than high school", "High school diploma/GED", "Some college", "Associate degree", "Bachelor''s degree", "Master''s degree", "Doctoral degree", "Professional degree"]}', 'general', '{"education", "background", "level"}', true),

-- Set 3: Location & Geography
('Country Selection', 'Country dropdown with search', '{"type": "dropdown", "question": "Which country are you located in?", "required": false, "options": ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "Other"], "searchable": true}', 'general', '{"country", "location", "geography"}', true),

('City Input', 'City location with autocomplete', '{"type": "text", "question": "What city are you located in?", "required": false, "placeholder": "Enter your city", "autocomplete": "city"}', 'general', '{"city", "location", "autocomplete"}', true),

('Time Zone', 'Time zone selection for scheduling', '{"type": "dropdown", "question": "What is your time zone?", "required": false, "options": ["Eastern (EST/EDT)", "Central (CST/CDT)", "Mountain (MST/MDT)", "Pacific (PST/PDT)", "Alaska (AKST/AKDT)", "Hawaii (HST)", "Other"]}', 'general', '{"timezone", "scheduling", "location"}', true),

-- Set 4: Preferences & Interests
('Communication Preference', 'Preferred contact methods', '{"type": "checkbox", "question": "How would you prefer to be contacted? (Select all that apply)", "required": false, "options": ["Email", "Phone call", "Text message", "Video call", "In-person meeting", "Mail", "Social media"]}', 'general', '{"communication", "preferences", "contact"}', true);

-- =============================================
-- CUSTOMER FEEDBACK CATEGORY - 10 Question Sets
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Set 1: Satisfaction Metrics
('Overall Experience Rating', 'Comprehensive experience assessment', '{"type": "rating", "question": "How would you rate your overall experience with us?", "required": true, "scale": 5, "labels": ["Terrible", "Poor", "Average", "Good", "Excellent"], "description": "Consider all aspects of your interaction"}', 'customer-feedback', '{"experience", "overall", "rating"}', true),

('Service Quality Assessment', 'Detailed service evaluation', '{"type": "matrix", "question": "Please rate the following aspects of our service:", "required": true, "rows": ["Responsiveness", "Professionalism", "Knowledge", "Helpfulness", "Efficiency"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'customer-feedback', '{"service", "quality", "matrix"}', true),

('Product Satisfaction Scale', 'Product-specific satisfaction', '{"type": "slider", "question": "On a scale of 0-100, how satisfied are you with our product?", "required": true, "min": 0, "max": 100, "step": 5, "default": 50, "labels": {"0": "Not Satisfied", "50": "Neutral", "100": "Extremely Satisfied"}}', 'customer-feedback', '{"product", "satisfaction", "slider"}', true),

-- Set 2: Loyalty & Recommendation
('Net Promoter Score Detailed', 'Comprehensive NPS with follow-up', '{"type": "rating", "question": "How likely are you to recommend our company to a friend or colleague?", "required": true, "scale": 10, "description": "0 = Not at all likely, 10 = Extremely likely", "followUp": true}', 'customer-feedback', '{"nps", "recommendation", "loyalty"}', true),

('Customer Loyalty Index', 'Multi-faceted loyalty assessment', '{"type": "matrix", "question": "Please indicate your agreement with the following statements:", "required": true, "rows": ["I am satisfied with this company", "I would recommend this company", "I will continue using this company", "This company meets my expectations"], "columns": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]}', 'customer-feedback', '{"loyalty", "satisfaction", "agreement"}', true),

('Repeat Purchase Intent', 'Future purchase likelihood', '{"type": "multiple-choice", "question": "How likely are you to purchase from us again?", "required": false, "options": ["Definitely will", "Probably will", "Might or might not", "Probably will not", "Definitely will not", "Not applicable"]}', 'customer-feedback', '{"purchase", "intent", "future"}', true),

-- Set 3: Improvement & Feedback
('Improvement Priority Areas', 'Areas needing improvement', '{"type": "ranking", "question": "Rank these areas by improvement priority (most important first):", "required": false, "options": ["Customer Service", "Product Quality", "Pricing", "Delivery Speed", "Website Experience", "Communication"]}', 'customer-feedback', '{"improvement", "priority", "ranking"}', true),

('Specific Feedback Request', 'Detailed improvement suggestions', '{"type": "textarea", "question": "What specific improvements would you like to see?", "required": false, "placeholder": "Please be as detailed as possible in your suggestions...", "maxLength": 1000}', 'customer-feedback', '{"feedback", "improvement", "detailed"}', true),

('Problem Resolution', 'Issue resolution effectiveness', '{"type": "rating", "question": "If you experienced any issues, how effectively were they resolved?", "required": false, "scale": 5, "labels": ["Not Resolved", "Poorly Resolved", "Adequately Resolved", "Well Resolved", "Excellently Resolved"], "includeNA": true}', 'customer-feedback', '{"resolution", "problems", "effectiveness"}', true),

-- Set 4: Value & Pricing
('Value for Money', 'Price-value relationship assessment', '{"type": "rating", "question": "How would you rate the value for money of our product/service?", "required": false, "scale": 5, "labels": ["Very Poor Value", "Poor Value", "Fair Value", "Good Value", "Excellent Value"]}', 'customer-feedback', '{"value", "pricing", "money"}', true);

-- =============================================
-- EMPLOYEE SURVEY CATEGORY - 10 Question Sets
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Set 1: Job Satisfaction & Engagement
('Role Satisfaction Detailed', 'Comprehensive role satisfaction', '{"type": "matrix", "question": "How satisfied are you with the following aspects of your role?", "required": true, "rows": ["Job responsibilities", "Workload", "Autonomy", "Recognition", "Growth opportunities"], "columns": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 'employee-survey', '{"job", "satisfaction", "detailed"}', true),

('Employee Engagement Scale', 'Engagement level assessment', '{"type": "rating", "question": "How engaged do you feel in your work?", "required": true, "scale": 10, "description": "1 = Not engaged at all, 10 = Extremely engaged"}', 'employee-survey', '{"engagement", "motivation", "scale"}', true),

('Work Motivation Factors', 'What motivates employees', '{"type": "ranking", "question": "Rank these factors by how much they motivate you at work:", "required": true, "options": ["Meaningful work", "Good compensation", "Recognition", "Career advancement", "Work-life balance", "Team collaboration"]}', 'employee-survey', '{"motivation", "factors", "ranking"}', true),

-- Set 2: Management & Leadership
('Manager Support Rating', 'Manager effectiveness detailed', '{"type": "matrix", "question": "Rate your direct manager on the following:", "required": false, "rows": ["Provides clear direction", "Offers constructive feedback", "Supports professional development", "Recognizes good work", "Is approachable"], "columns": ["Never", "Rarely", "Sometimes", "Often", "Always"]}', 'employee-survey', '{"manager", "support", "leadership"}', true),

('Leadership Trust', 'Trust in company leadership', '{"type": "rating", "question": "How much do you trust the senior leadership of this company?", "required": false, "scale": 5, "labels": ["No Trust", "Little Trust", "Some Trust", "High Trust", "Complete Trust"]}', 'employee-survey', '{"leadership", "trust", "senior"}', true),

('Feedback Quality', 'Quality of feedback received', '{"type": "multiple-choice", "question": "How would you describe the feedback you receive from your manager?", "required": false, "options": ["Very helpful and constructive", "Somewhat helpful", "Basic/minimal", "Not very helpful", "Rarely receive feedback"]}', 'employee-survey', '{"feedback", "quality", "manager"}', true),

-- Set 3: Work Environment & Culture
('Company Culture Rating', 'Culture assessment detailed', '{"type": "matrix", "question": "How would you rate our company culture on:", "required": true, "rows": ["Inclusivity", "Innovation", "Collaboration", "Transparency", "Work-life balance"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'employee-survey', '{"culture", "environment", "assessment"}', true),

('Team Collaboration', 'Team dynamics evaluation', '{"type": "rating", "question": "How effective is collaboration within your team?", "required": true, "scale": 5, "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]}', 'employee-survey', '{"team", "collaboration", "dynamics"}', true),

('Workplace Stress Level', 'Stress and wellbeing assessment', '{"type": "slider", "question": "What is your current stress level at work? (0 = No stress, 100 = Extremely stressed)", "required": false, "min": 0, "max": 100, "step": 10, "default": 30}', 'employee-survey', '{"stress", "wellbeing", "health"}', true),

-- Set 4: Career & Development
('Career Growth Satisfaction', 'Career development assessment', '{"type": "rating", "question": "How satisfied are you with your career growth opportunities?", "required": false, "scale": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 'employee-survey', '{"career", "growth", "development"}', true);

-- =============================================
-- PRODUCT RESEARCH CATEGORY - 10 Question Sets
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Set 1: Feature Analysis
('Feature Usage Frequency', 'How often features are used', '{"type": "matrix", "question": "How often do you use the following features?", "required": true, "rows": ["Dashboard", "Reports", "Settings", "Integrations", "Mobile App"], "columns": ["Never", "Rarely", "Sometimes", "Often", "Always"]}', 'product-research', '{"features", "usage", "frequency"}', true),

('Feature Satisfaction Matrix', 'Satisfaction with each feature', '{"type": "matrix", "question": "How satisfied are you with these features?", "required": true, "rows": ["User Interface", "Performance", "Reliability", "Documentation", "Customer Support"], "columns": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 'product-research', '{"features", "satisfaction", "matrix"}', true),

('Missing Features Priority', 'Most wanted new features', '{"type": "ranking", "question": "Rank these potential new features by priority:", "required": false, "options": ["Advanced Analytics", "Mobile App", "API Access", "Third-party Integrations", "Automation Tools", "Custom Branding"]}', 'product-research', '{"features", "missing", "priority"}', true),

-- Set 2: User Experience & Usability
('Ease of Use Rating', 'Product usability assessment', '{"type": "rating", "question": "How easy is our product to use?", "required": true, "scale": 5, "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]}', 'product-research', '{"usability", "ease", "ux"}', true),

('Navigation Clarity', 'Website/app navigation assessment', '{"type": "multiple-choice", "question": "How would you describe our product navigation?", "required": true, "options": ["Very confusing", "Somewhat confusing", "Neutral", "Fairly clear", "Very clear and intuitive"]}', 'product-research', '{"navigation", "clarity", "ux"}', true),

('Learning Curve', 'Product adoption difficulty', '{"type": "multiple-choice", "question": "How long did it take you to become comfortable using our product?", "required": false, "options": ["Less than 1 hour", "1-4 hours", "1-3 days", "1-2 weeks", "More than 2 weeks", "Still learning"]}', 'product-research', '{"learning", "adoption", "time"}', true),

-- Set 3: Performance & Technical
('Performance Satisfaction', 'Product performance rating', '{"type": "rating", "question": "How satisfied are you with our product performance (speed, reliability)?", "required": true, "scale": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 'product-research', '{"performance", "speed", "reliability"}', true),

('Technical Issues Frequency', 'How often users encounter problems', '{"type": "multiple-choice", "question": "How often do you experience technical issues?", "required": false, "options": ["Never", "Rarely (less than once a month)", "Sometimes (1-3 times a month)", "Often (weekly)", "Very often (daily)"]}', 'product-research', '{"technical", "issues", "frequency"}', true),

('Mobile Experience', 'Mobile app/site experience', '{"type": "rating", "question": "How would you rate your mobile experience with our product?", "required": false, "scale": 5, "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"], "includeNA": true}', 'product-research', '{"mobile", "experience", "responsive"}', true),

-- Set 4: Competitive Analysis
('Competitor Comparison Detailed', 'Detailed competitive analysis', '{"type": "matrix", "question": "How do we compare to competitors on:", "required": false, "rows": ["Features", "Pricing", "Customer Service", "Ease of Use", "Reliability"], "columns": ["Much Worse", "Worse", "Same", "Better", "Much Better", "No Opinion"]}', 'product-research', '{"competitor", "comparison", "detailed"}', true);

-- =============================================
-- EVENT FEEDBACK CATEGORY - 10 Question Sets
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Set 1: Overall Event Assessment
('Event Satisfaction Comprehensive', 'Complete event evaluation', '{"type": "matrix", "question": "Please rate the following aspects of the event:", "required": true, "rows": ["Overall organization", "Content quality", "Speaker quality", "Venue", "Catering", "Networking opportunities"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'event-feedback', '{"event", "comprehensive", "assessment"}', true),

('Event Value Rating', 'Value proposition of the event', '{"type": "rating", "question": "How valuable was this event for you?", "required": true, "scale": 5, "labels": ["Not Valuable", "Slightly Valuable", "Moderately Valuable", "Very Valuable", "Extremely Valuable"]}', 'event-feedback', '{"value", "proposition", "worth"}', true),

('Event Recommendation', 'Event recommendation likelihood', '{"type": "rating", "question": "How likely are you to recommend this event to colleagues?", "required": true, "scale": 10, "description": "0 = Not at all likely, 10 = Extremely likely"}', 'event-feedback', '{"recommendation", "nps", "colleagues"}', true),

-- Set 2: Content & Speakers
('Content Relevance', 'Relevance of event content', '{"type": "rating", "question": "How relevant was the event content to your work/interests?", "required": true, "scale": 5, "labels": ["Not Relevant", "Slightly Relevant", "Moderately Relevant", "Very Relevant", "Extremely Relevant"]}', 'event-feedback', '{"content", "relevance", "applicable"}', true),

('Speaker Effectiveness Matrix', 'Individual speaker ratings', '{"type": "matrix", "question": "Rate each speaker on the following:", "required": false, "rows": ["Speaker 1: [Name]", "Speaker 2: [Name]", "Speaker 3: [Name]"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent", "Did not attend"]}', 'event-feedback', '{"speakers", "individual", "effectiveness"}', true),

('Session Preferences', 'Preferred session types', '{"type": "checkbox", "question": "Which types of sessions did you find most valuable? (Select all that apply)", "required": false, "options": ["Keynote presentations", "Panel discussions", "Workshops", "Networking sessions", "Q&A sessions", "Breakout groups", "Demo sessions"]}', 'event-feedback', '{"sessions", "preferences", "types"}', true),

-- Set 3: Logistics & Venue
('Venue Satisfaction Detailed', 'Comprehensive venue assessment', '{"type": "matrix", "question": "Rate the venue on the following aspects:", "required": false, "rows": ["Location/accessibility", "Room comfort", "Audio/visual quality", "Wi-Fi connectivity", "Restroom facilities", "Parking"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'event-feedback', '{"venue", "logistics", "detailed"}', true),

('Event Timing', 'Timing and duration feedback', '{"type": "multiple-choice", "question": "How was the timing and duration of the event?", "required": false, "options": ["Too short", "Just right", "Slightly too long", "Much too long", "Poor timing (day/time)"]}', 'event-feedback', '{"timing", "duration", "schedule"}', true),

('Registration Process', 'Registration experience rating', '{"type": "rating", "question": "How would you rate the event registration process?", "required": false, "scale": 5, "labels": ["Very Difficult", "Difficult", "Neutral", "Easy", "Very Easy"]}', 'event-feedback', '{"registration", "process", "ease"}', true),

-- Set 4: Future Events
('Future Event Interest', 'Interest in upcoming events', '{"type": "checkbox", "question": "What types of future events would interest you? (Select all that apply)", "required": false, "options": ["Similar topic events", "Advanced level sessions", "Beginner workshops", "Virtual events", "Multi-day conferences", "Local meetups", "Online webinars"]}', 'event-feedback', '{"future", "interest", "types"}', true);

-- =============================================
-- EDUCATION CATEGORY - 10 Question Sets
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Set 1: Course Evaluation
('Learning Objectives Achievement', 'How well objectives were met', '{"type": "matrix", "question": "How well did this course help you achieve the following learning objectives?", "required": true, "rows": ["Understand key concepts", "Apply knowledge practically", "Develop relevant skills", "Gain confidence in subject"], "columns": ["Not at all", "Slightly", "Moderately", "Significantly", "Completely"]}', 'education', '{"objectives", "achievement", "learning"}', true),

('Course Content Quality', 'Content assessment detailed', '{"type": "matrix", "question": "Rate the course content on:", "required": true, "rows": ["Clarity of explanations", "Depth of coverage", "Practical relevance", "Up-to-date information", "Organization/structure"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'education', '{"content", "quality", "comprehensive"}', true),

('Course Difficulty Appropriateness', 'Difficulty level assessment', '{"type": "multiple-choice", "question": "The difficulty level of this course was:", "required": true, "options": ["Much too easy", "Somewhat too easy", "Just right", "Somewhat too difficult", "Much too difficult"]}', 'education', '{"difficulty", "appropriate", "level"}', true),

-- Set 2: Instructor Evaluation
('Instructor Effectiveness Detailed', 'Comprehensive instructor rating', '{"type": "matrix", "question": "Rate your instructor on the following:", "required": true, "rows": ["Knowledge of subject", "Teaching clarity", "Responsiveness to questions", "Enthusiasm", "Preparation"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'education', '{"instructor", "effectiveness", "detailed"}', true),

('Teaching Methods Effectiveness', 'Evaluation of teaching approaches', '{"type": "checkbox", "question": "Which teaching methods were most effective for your learning? (Select all that apply)", "required": false, "options": ["Lectures", "Group discussions", "Hands-on exercises", "Case studies", "Video content", "Reading assignments", "Peer collaboration"]}', 'education', '{"teaching", "methods", "effective"}', true),

('Instructor Communication', 'Communication style assessment', '{"type": "rating", "question": "How clear and understandable was the instructor''s communication?", "required": true, "scale": 5, "labels": ["Very Unclear", "Unclear", "Neutral", "Clear", "Very Clear"]}', 'education', '{"communication", "clarity", "instructor"}', true),

-- Set 3: Materials & Resources
('Learning Materials Quality', 'Assessment of course materials', '{"type": "matrix", "question": "Rate the quality of the following materials:", "required": false, "rows": ["Textbook/readings", "Lecture slides", "Online resources", "Assignments", "Practice exercises"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent", "Not Used"]}', 'education', '{"materials", "resources", "quality"}', true),

('Technology Tools Effectiveness', 'Educational technology assessment', '{"type": "rating", "question": "How effective were the technology tools used in this course?", "required": false, "scale": 5, "labels": ["Very Ineffective", "Ineffective", "Neutral", "Effective", "Very Effective"], "includeNA": true}', 'education', '{"technology", "tools", "effectiveness"}', true),

('Resource Accessibility', 'Ease of accessing course materials', '{"type": "multiple-choice", "question": "How easy was it to access course materials and resources?", "required": false, "options": ["Very easy", "Easy", "Neutral", "Difficult", "Very difficult"]}', 'education', '{"resources", "accessibility", "ease"}', true),

-- Set 4: Course Improvement
('Course Improvement Suggestions', 'Specific improvement areas', '{"type": "textarea", "question": "What specific improvements would you suggest for this course?", "required": false, "placeholder": "Please provide detailed suggestions for improvement...", "maxLength": 800}', 'education', '{"improvement", "suggestions", "course"}', true);

-- =============================================
-- HEALTHCARE CATEGORY - 10 Question Sets
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Set 1: Patient Care Quality
('Care Quality Comprehensive', 'Complete care assessment', '{"type": "matrix", "question": "Please rate the quality of care in the following areas:", "required": true, "rows": ["Medical expertise", "Bedside manner", "Pain management", "Communication", "Follow-up care"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'healthcare', '{"care", "quality", "comprehensive"}', true),

('Treatment Effectiveness', 'How effective was the treatment', '{"type": "rating", "question": "How effective was your treatment?", "required": true, "scale": 5, "labels": ["Not Effective", "Slightly Effective", "Moderately Effective", "Very Effective", "Completely Effective"]}', 'healthcare', '{"treatment", "effectiveness", "outcome"}', true),

('Pain Management', 'Pain management assessment', '{"type": "slider", "question": "Rate your pain level before and after treatment (0 = No pain, 10 = Severe pain)", "required": false, "min": 0, "max": 10, "step": 1, "description": "Move slider to indicate pain level"}', 'healthcare', '{"pain", "management", "scale"}', true),

-- Set 2: Staff & Service
('Healthcare Staff Rating', 'Staff performance across roles', '{"type": "matrix", "question": "Rate the performance of our healthcare staff:", "required": true, "rows": ["Doctors", "Nurses", "Reception staff", "Technical staff", "Support staff"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent", "No Interaction"]}', 'healthcare', '{"staff", "performance", "roles"}', true),

('Communication Quality', 'Healthcare communication assessment', '{"type": "matrix", "question": "Rate the communication quality:", "required": true, "rows": ["Explanation of condition", "Treatment options discussed", "Risks/benefits explained", "Questions answered", "Instructions clarity"], "columns": ["Very Poor", "Poor", "Average", "Good", "Excellent"]}', 'healthcare', '{"communication", "quality", "explanation"}', true),

('Appointment Scheduling', 'Scheduling process evaluation', '{"type": "rating", "question": "How satisfied were you with the appointment scheduling process?", "required": false, "scale": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}', 'healthcare', '{"appointment", "scheduling", "process"}', true),

-- Set 3: Facility & Environment
('Facility Quality Assessment', 'Healthcare facility evaluation', '{"type": "matrix", "question": "Rate our facility on the following:", "required": false, "rows": ["Cleanliness", "Comfort", "Privacy", "Safety", "Accessibility", "Parking"], "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}', 'healthcare', '{"facility", "environment", "quality"}', true),

('Wait Time Experience', 'Detailed wait time assessment', '{"type": "multiple-choice", "question": "How long was your total wait time?", "required": false, "options": ["Less than 15 minutes", "15-30 minutes", "30-45 minutes", "45-60 minutes", "1-2 hours", "More than 2 hours"]}', 'healthcare', '{"wait-time", "duration", "experience"}', true),

('Privacy and Confidentiality', 'Privacy protection assessment', '{"type": "rating", "question": "How well did we protect your privacy and confidentiality?", "required": false, "scale": 5, "labels": ["Very Poor", "Poor", "Average", "Good", "Excellent"]}', 'healthcare', '{"privacy", "confidentiality", "protection"}', true),

-- Set 4: Overall Healthcare Experience
('Healthcare Recommendation', 'Likelihood to recommend facility', '{"type": "rating", "question": "How likely are you to recommend our healthcare facility to family and friends?", "required": true, "scale": 10, "description": "0 = Not at all likely, 10 = Extremely likely"}', 'healthcare', '{"recommendation", "nps", "healthcare"}', true);

-- =============================================
-- FAVORITES CATEGORY - Popular/Template Questions
-- =============================================

INSERT INTO question_library (name, description, question_data, category, tags, is_public) VALUES

-- Popular question templates
('Quick Satisfaction Check', 'Fast 3-question satisfaction survey', '{"type": "group", "question": "Quick Satisfaction Survey", "required": true, "fields": [{"type": "rating", "question": "Overall satisfaction?", "scale": 5}, {"type": "boolean", "question": "Would you recommend us?"}, {"type": "text", "question": "One improvement suggestion?", "required": false}]}', 'favorites', '{"quick", "satisfaction", "template"}', true),

('Complete Contact Form', 'Full contact information collection', '{"type": "group", "question": "Contact Information", "required": true, "fields": [{"type": "text", "question": "Full Name", "required": true}, {"type": "email", "question": "Email Address", "required": true}, {"type": "text", "question": "Phone Number", "required": false}, {"type": "text", "question": "Company", "required": false}, {"type": "text", "question": "Job Title", "required": false}]}', 'favorites', '{"contact", "complete", "form"}', true),

('Event Registration Info', 'Event registration questions', '{"type": "group", "question": "Event Registration", "required": true, "fields": [{"type": "text", "question": "Full Name", "required": true}, {"type": "email", "question": "Email", "required": true}, {"type": "multiple-choice", "question": "Dietary restrictions?", "options": ["None", "Vegetarian", "Vegan", "Gluten-free", "Other"], "required": false}, {"type": "checkbox", "question": "Sessions interested in", "options": ["Morning keynote", "Afternoon workshops", "Networking lunch", "Panel discussion"], "required": false}]}', 'favorites', '{"event", "registration", "template"}', true),

('Product Feedback Template', 'Complete product feedback survey', '{"type": "group", "question": "Product Feedback", "required": true, "fields": [{"type": "rating", "question": "Overall satisfaction", "scale": 5, "required": true}, {"type": "rating", "question": "Likelihood to recommend", "scale": 10, "required": true}, {"type": "checkbox", "question": "What do you like most?", "options": ["Features", "Design", "Performance", "Support", "Price"], "required": false}, {"type": "textarea", "question": "Suggestions for improvement", "required": false}]}', 'favorites', '{"product", "feedback", "complete"}', true),

('Employee Onboarding Survey', 'New employee experience assessment', '{"type": "group", "question": "Onboarding Experience", "required": true, "fields": [{"type": "rating", "question": "Overall onboarding experience", "scale": 5, "required": true}, {"type": "rating", "question": "Clarity of role expectations", "scale": 5, "required": true}, {"type": "rating", "question": "Quality of training materials", "scale": 5, "required": false}, {"type": "text", "question": "What could we improve?", "required": false}]}', 'favorites', '{"onboarding", "employee", "experience"}', true);

-- Update usage counts to simulate popularity
UPDATE question_library SET usage_count = 
    CASE 
        WHEN category = 'general' THEN floor(random() * 150) + 50
        WHEN category = 'customer-feedback' THEN floor(random() * 200) + 75
        WHEN category = 'employee-survey' THEN floor(random() * 100) + 25
        WHEN category = 'product-research' THEN floor(random() * 120) + 30
        WHEN category = 'event-feedback' THEN floor(random() * 80) + 20
        WHEN category = 'education' THEN floor(random() * 90) + 25
        WHEN category = 'healthcare' THEN floor(random() * 70) + 15
        WHEN category = 'favorites' THEN floor(random() * 300) + 100
        ELSE floor(random() * 50) + 10
    END
WHERE is_public = true;

-- Final summary
SELECT 
    category,
    COUNT(*) as total_questions,
    AVG(usage_count) as avg_usage,
    MAX(usage_count) as max_usage,
    'Question Library fully populated!' as status
FROM question_library 
WHERE is_public = true
GROUP BY category 
ORDER BY total_questions DESC;

-- Show total count
SELECT 
    COUNT(*) as total_questions,
    COUNT(DISTINCT category) as categories,
    'COMPLETE: Question Library ready for use!' as message
FROM question_library 
WHERE is_public = true;
