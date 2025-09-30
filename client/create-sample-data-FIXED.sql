-- Create Sample Surveys and Events - CORRECTED VERSION
-- This script creates comprehensive sample data for testing the survey builder and event management
-- FIXED: Updated to match actual database schema

-- First, let's create some sample surveys with different question types

-- Sample Survey 1: Customer Satisfaction Survey
INSERT INTO public.surveys (
  id, user_id, title, description, questions, settings, status, created_at, updated_at, published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Customer Satisfaction Survey',
  'A comprehensive survey to measure customer satisfaction with our products and services',
  '[
    {
      "id": "q1",
      "type": "text",
      "title": "What is your name?",
      "required": true,
      "settings": {
        "placeholder": "Enter your full name"
      }
    },
    {
      "id": "q2",
      "type": "email",
      "title": "What is your email address?",
      "required": true,
      "settings": {
        "placeholder": "your.email@example.com"
      }
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "title": "How satisfied are you with our service?",
      "required": true,
      "settings": {
        "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
        "allowOther": false,
        "randomizeOptions": false
      }
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "Rate our product quality (1-5 stars)",
      "required": true,
      "settings": {
        "maxRating": 5,
        "labels": {
          "1": "Poor",
          "5": "Excellent"
        },
        "allowHalf": false
      }
    },
    {
      "id": "q5",
      "type": "emoji_scale",
      "title": "How do you feel about our customer support?",
      "required": false,
      "settings": {
        "scaleType": "satisfaction",
        "showLabels": true,
        "showDescriptions": true
      }
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "What can we improve?",
      "required": false,
      "settings": {
        "placeholder": "Please share your suggestions...",
        "maxLength": 500
      }
    },
    {
      "id": "q7",
      "type": "checkbox",
      "title": "Which features do you use most? (Select all that apply)",
      "required": false,
      "settings": {
        "options": ["Feature A", "Feature B", "Feature C", "Feature D"],
        "allowOther": true,
        "otherLabel": "Other (please specify)"
      }
    }
  ]'::jsonb,
  '{
    "allowAnonymous": true,
    "collectEmail": true,
    "showProgress": true,
    "randomizeQuestions": false,
    "requireAll": false,
    "theme": "modern",
    "brandColor": "#3B82F6",
    "thankYouMessage": "Thank you for your feedback! We appreciate your time."
  }'::jsonb,
  'published',
  NOW(),
  NOW(),
  NOW()
);

-- Sample Survey 2: Employee Engagement Survey
INSERT INTO public.surveys (
  id, user_id, title, description, questions, settings, status, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Employee Engagement Survey',
  'Annual employee engagement and satisfaction survey',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "What department do you work in?",
      "required": true,
      "settings": {
        "options": ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"],
        "allowOther": true
      }
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "How satisfied are you with your current role?",
      "required": true,
      "settings": {
        "maxRating": 10,
        "labels": {
          "1": "Very Dissatisfied",
          "10": "Very Satisfied"
        }
      }
    },
    {
      "id": "q3",
      "type": "matrix",
      "title": "Rate the following aspects of your work environment:",
      "required": true,
      "settings": {
        "rows": ["Work-Life Balance", "Career Growth", "Team Collaboration", "Management Support", "Company Culture"],
        "columns": ["Poor", "Fair", "Good", "Very Good", "Excellent"],
        "scaleType": "radio"
      }
    },
    {
      "id": "q4",
      "type": "yes_no",
      "title": "Would you recommend this company as a place to work?",
      "required": true,
      "settings": {
        "yesLabel": "Yes, definitely",
        "noLabel": "No, probably not"
      }
    },
    {
      "id": "q5",
      "type": "textarea",
      "title": "What suggestions do you have for improving our workplace?",
      "required": false,
      "settings": {
        "placeholder": "Share your ideas...",
        "maxLength": 1000
      }
    }
  ]'::jsonb,
  '{
    "allowAnonymous": false,
    "collectEmail": true,
    "showProgress": true,
    "randomizeQuestions": false,
    "requireAll": false,
    "theme": "professional",
    "brandColor": "#10B981",
    "thankYouMessage": "Thank you for participating in our employee survey!"
  }'::jsonb,
  'draft',
  NOW(),
  NOW()
);

-- Sample Survey 3: Event Feedback Survey
INSERT INTO public.surveys (
  id, user_id, title, description, questions, settings, status, created_at, updated_at, published_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Conference Feedback Survey',
  'Post-conference feedback to improve future events',
  '[
    {
      "id": "q1",
      "type": "text",
      "title": "What is your name?",
      "required": true,
      "settings": {}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "How did you hear about this conference?",
      "required": true,
      "settings": {
        "options": ["Social Media", "Email", "Website", "Colleague", "Other"],
        "allowOther": true
      }
    },
    {
      "id": "q3",
      "type": "rating",
      "title": "Overall conference rating",
      "required": true,
      "settings": {
        "maxRating": 5,
        "labels": {
          "1": "Poor",
          "5": "Excellent"
        }
      }
    },
    {
      "id": "q4",
      "type": "checkbox",
      "title": "Which sessions did you attend? (Select all that apply)",
      "required": false,
      "settings": {
        "options": ["Keynote", "Panel Discussion", "Workshop A", "Workshop B", "Networking Session"],
        "allowOther": false
      }
    },
    {
      "id": "q5",
      "type": "emoji_scale",
      "title": "How was the venue?",
      "required": false,
      "settings": {
        "scaleType": "satisfaction",
        "showLabels": true
      }
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "What topics would you like to see covered in future events?",
      "required": false,
      "settings": {
        "placeholder": "Share your suggestions...",
        "maxLength": 300
      }
    }
  ]'::jsonb,
  '{
    "allowAnonymous": true,
    "collectEmail": false,
    "showProgress": true,
    "randomizeQuestions": false,
    "requireAll": false,
    "theme": "modern",
    "brandColor": "#8B5CF6",
    "thankYouMessage": "Thank you for your feedback! See you at our next event."
  }'::jsonb,
  'published',
  NOW(),
  NOW(),
  NOW()
);

-- Sample Survey 4: Market Research Survey
INSERT INTO public.surveys (
  id, user_id, title, description, questions, settings, status, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Product Market Research',
  'Research survey to understand market needs and preferences',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "What is your age range?",
      "required": true,
      "settings": {
        "options": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        "allowOther": false
      }
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "What is your occupation?",
      "required": true,
      "settings": {
        "options": ["Student", "Professional", "Business Owner", "Retired", "Other"],
        "allowOther": true
      }
    },
    {
      "id": "q3",
      "type": "checkbox",
      "title": "Which products are you interested in?",
      "required": false,
      "settings": {
        "options": ["Product A", "Product B", "Product C", "Service X", "Service Y"],
        "allowOther": true,
        "otherLabel": "Other products/services"
      }
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How important is price in your purchasing decision?",
      "required": true,
      "settings": {
        "maxRating": 5,
        "labels": {
          "1": "Not Important",
          "5": "Very Important"
        }
      }
    },
    {
      "id": "q5",
      "type": "matrix",
      "title": "Rate the importance of these factors:",
      "required": true,
      "settings": {
        "rows": ["Quality", "Price", "Brand Reputation", "Customer Service", "Innovation"],
        "columns": ["Not Important", "Somewhat Important", "Important", "Very Important"],
        "scaleType": "radio"
      }
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "What features would you like to see in our next product?",
      "required": false,
      "settings": {
        "placeholder": "Describe your ideal product features...",
        "maxLength": 500
      }
    }
  ]'::jsonb,
  '{
    "allowAnonymous": true,
    "collectEmail": true,
    "showProgress": true,
    "randomizeQuestions": true,
    "requireAll": false,
    "theme": "minimal",
    "brandColor": "#F59E0B",
    "thankYouMessage": "Thank you for participating in our market research!"
  }'::jsonb,
  'draft',
  NOW(),
  NOW()
);

-- Now let's create some sample events (CORRECTED SCHEMA)

-- Sample Event 1: Tech Conference 2024
INSERT INTO public.events (
  id, user_id, title, description, event_type, start_date, end_date, location, capacity, registration_required, is_public, is_active, status, metadata, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Tech Conference 2024',
  'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Join industry leaders for keynotes, workshops, and networking opportunities.',
  'conference',
  '2024-03-15 09:00:00+00',
  '2024-03-17 18:00:00+00',
  'San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103',
  500,
  true,
  true,
  true,
  'published',
  '{
    "registrationFee": 299.99,
    "allowWaitlist": true,
    "requireApproval": false,
    "collectDietaryRequirements": true,
    "collectEmergencyContact": true,
    "sendReminders": true,
    "customFields": [
      {
        "name": "company",
        "label": "Company Name",
        "type": "text",
        "required": true
      },
      {
        "name": "jobTitle",
        "label": "Job Title",
        "type": "text",
        "required": true
      },
      {
        "name": "experience",
        "label": "Years of Experience",
        "type": "select",
        "required": true,
        "options": ["0-2 years", "3-5 years", "6-10 years", "10+ years"]
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- Sample Event 2: Product Launch Webinar
INSERT INTO public.events (
  id, user_id, title, description, event_type, start_date, end_date, location, virtual_link, capacity, registration_required, is_public, is_active, status, metadata, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Product Launch Webinar',
  'Join us for an exclusive webinar announcing our revolutionary new product. Learn about features, pricing, and how it can transform your business.',
  'webinar',
  '2024-02-28 14:00:00+00',
  '2024-02-28 15:30:00+00',
  'Online - Zoom Webinar',
  'https://zoom.us/j/123456789',
  1000,
  true,
  true,
  true,
  'published',
  '{
    "registrationFee": 0.00,
    "allowWaitlist": false,
    "requireApproval": false,
    "collectDietaryRequirements": false,
    "collectEmergencyContact": false,
    "sendReminders": true,
    "customFields": [
      {
        "name": "industry",
        "label": "Industry",
        "type": "select",
        "required": true,
        "options": ["Technology", "Healthcare", "Finance", "Education", "Other"]
      },
      {
        "name": "companySize",
        "label": "Company Size",
        "type": "select",
        "required": false,
        "options": ["1-10 employees", "11-50 employees", "51-200 employees", "200+ employees"]
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- Sample Event 3: Team Building Workshop
INSERT INTO public.events (
  id, user_id, title, description, event_type, start_date, end_date, location, capacity, registration_required, is_public, is_active, status, metadata, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Team Building Workshop',
  'Interactive team building workshop designed to improve communication, collaboration, and team dynamics. Perfect for teams of all sizes.',
  'workshop',
  '2024-03-08 10:00:00+00',
  '2024-03-08 16:00:00+00',
  'Downtown Conference Center, 123 Business Ave, New York, NY 10001',
  50,
  true,
  true,
  true,
  'published',
  '{
    "registrationFee": 89.99,
    "allowWaitlist": true,
    "requireApproval": true,
    "collectDietaryRequirements": true,
    "collectEmergencyContact": true,
    "sendReminders": true,
    "customFields": [
      {
        "name": "teamSize",
        "label": "Your Team Size",
        "type": "select",
        "required": true,
        "options": ["2-5 people", "6-10 people", "11-20 people", "20+ people"]
      },
      {
        "name": "goals",
        "label": "What are your team goals for this workshop?",
        "type": "textarea",
        "required": false
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- Sample Event 4: Networking Mixer
INSERT INTO public.events (
  id, user_id, title, description, event_type, start_date, end_date, location, capacity, registration_required, is_public, is_active, status, metadata, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Startup Networking Mixer',
  'Connect with fellow entrepreneurs, investors, and industry professionals at our monthly networking mixer. Light refreshments provided.',
  'standard',
  '2024-03-22 18:00:00+00',
  '2024-03-22 21:00:00+00',
  'Innovation Hub, 456 Startup St, Austin, TX 78701',
  150,
  true,
  true,
  true,
  'published',
  '{
    "registrationFee": 25.00,
    "allowWaitlist": true,
    "requireApproval": false,
    "collectDietaryRequirements": true,
    "collectEmergencyContact": false,
    "sendReminders": true,
    "customFields": [
      {
        "name": "startupStage",
        "label": "Startup Stage",
        "type": "select",
        "required": true,
        "options": ["Idea Stage", "MVP", "Early Revenue", "Growth Stage", "Established"]
      },
      {
        "name": "funding",
        "label": "Funding Stage",
        "type": "select",
        "required": false,
        "options": ["Bootstrapped", "Angel Investors", "Seed Round", "Series A+", "Not Applicable"]
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- Create some sample event registrations (CORRECTED SCHEMA)
INSERT INTO public.event_registrations (
  id, event_id, user_id, attendee_name, attendee_email, attendee_phone, registration_data, status, registered_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.events WHERE title = 'Tech Conference 2024' LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'John Doe',
  'john.doe@example.com',
  '+1-555-0123',
  '{
    "company": "Tech Solutions Inc",
    "jobTitle": "Senior Developer",
    "experience": "6-10 years",
    "dietaryRequirements": "Vegetarian",
    "emergencyContact": "Jane Doe - +1-555-0124"
  }'::jsonb,
  'confirmed',
  NOW(),
  NOW()
);

INSERT INTO public.event_registrations (
  id, event_id, user_id, attendee_name, attendee_email, attendee_phone, registration_data, status, registered_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.events WHERE title = 'Product Launch Webinar' LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'Sarah Smith',
  'sarah.smith@example.com',
  '+1-555-0125',
  '{
    "industry": "Technology",
    "companySize": "51-200 employees"
  }'::jsonb,
  'confirmed',
  NOW(),
  NOW()
);

-- Create some sample survey responses
INSERT INTO public.survey_responses (
  id, survey_id, response_data, metadata, created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.surveys WHERE title = 'Customer Satisfaction Survey' LIMIT 1),
  '{
    "q1": "Alice Johnson",
    "q2": "alice.johnson@example.com",
    "q3": "Very Satisfied",
    "q4": 5,
    "q5": "😊",
    "q6": "Great service overall, maybe faster response times would be helpful.",
    "q7": ["Feature A", "Feature C"]
  }'::jsonb,
  '{
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ipAddress": "192.168.1.100",
    "timestamp": "2024-01-15T10:30:00Z"
  }'::jsonb,
  NOW()
);

INSERT INTO public.survey_responses (
  id, survey_id, response_data, metadata, created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.surveys WHERE title = 'Conference Feedback Survey' LIMIT 1),
  '{
    "q1": "Bob Wilson",
    "q2": "Social Media",
    "q3": 4,
    "q4": ["Keynote", "Panel Discussion", "Workshop A"],
    "q5": "😊",
    "q6": "More hands-on workshops would be great for next year!"
  }'::jsonb,
  '{
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "ipAddress": "192.168.1.101",
    "timestamp": "2024-01-16T14:45:00Z"
  }'::jsonb,
  NOW()
);

-- Success message
SELECT 'Sample data created successfully!' as result;
SELECT 'Created 4 sample surveys and 4 sample events with registrations and responses.' as details;
SELECT 'Surveys include: Customer Satisfaction, Employee Engagement, Event Feedback, and Market Research.' as surveys;
SELECT 'Events include: Tech Conference, Product Launch Webinar, Team Building Workshop, and Networking Mixer.' as events;
