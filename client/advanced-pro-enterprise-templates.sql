-- Advanced Pro and Enterprise Survey Templates
-- This script adds comprehensive templates for professional and enterprise users

-- Pro Plan Templates (Advanced Business Templates)
INSERT INTO public.survey_templates (
  user_id,
  title,
  description,
  questions,
  is_template,
  category,
  subcategory,
  estimated_time,
  is_public,
  status
) VALUES

-- Employee Engagement Survey (Pro)
(
  '00000000-0000-0000-0000-000000000000',
  'Employee Engagement Survey',
  'Comprehensive survey to measure employee satisfaction, motivation, and organizational commitment.',
  '[
    {
      "id": "q1",
      "type": "rating",
      "title": "How satisfied are you with your current role?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Very Dissatisfied", "10": "Very Satisfied"}}
    },
    {
      "id": "q2",
      "type": "emoji_scale",
      "title": "How do you feel about your work-life balance?",
      "required": true,
      "settings": {"scaleType": "satisfaction", "showLabels": true}
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "title": "What motivates you most at work?",
      "required": true,
      "settings": {
        "options": ["Career growth opportunities", "Recognition and rewards", "Challenging projects", "Team collaboration", "Work flexibility", "Compensation"],
        "allowMultiple": true,
        "maxSelections": 3
      }
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How likely are you to recommend this company as a great place to work?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not at all likely", "10": "Extremely likely"}}
    },
    {
      "id": "q5",
      "type": "multiple_choice",
      "title": "Which areas need the most improvement in our organization?",
      "required": true,
      "settings": {
        "options": ["Communication", "Leadership", "Training & Development", "Benefits", "Work environment", "Technology & tools", "Career advancement"],
        "allowMultiple": true,
        "maxSelections": 3
      }
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "What would make you more engaged and productive at work?",
      "required": false,
      "settings": {"placeholder": "Please share your thoughts and suggestions...", "rows": 4}
    },
    {
      "id": "q7",
      "type": "yes_no",
      "title": "Do you feel your opinions are valued by management?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q8",
      "type": "rating",
      "title": "How would you rate the quality of communication from leadership?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    }
  ]',
  true, 'hr', 'engagement', 12, true, 'published'
),

-- 360 Degree Feedback Survey (Pro)
(
  '00000000-0000-0000-0000-000000000000',
  '360 Degree Feedback Survey',
  'Multi-source feedback survey for comprehensive performance evaluation including self, peers, supervisors, and direct reports.',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "What is your relationship to the person being evaluated?",
      "required": true,
      "settings": {
        "options": ["Self-evaluation", "Direct supervisor", "Peer/colleague", "Direct report", "Internal customer", "External customer"],
        "allowOther": false
      }
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "Communication Skills - How effectively does this person communicate ideas and information?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Needs Improvement", "5": "Outstanding"}}
    },
    {
      "id": "q3",
      "type": "rating",
      "title": "Leadership - How well does this person lead and influence others?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Needs Improvement", "5": "Outstanding"}}
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "Problem Solving - How effectively does this person analyze and solve problems?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Needs Improvement", "5": "Outstanding"}}
    },
    {
      "id": "q5",
      "type": "rating",
      "title": "Teamwork - How well does this person collaborate with others?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Needs Improvement", "5": "Outstanding"}}
    },
    {
      "id": "q6",
      "type": "rating",
      "title": "Adaptability - How well does this person handle change and new situations?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Needs Improvement", "5": "Outstanding"}}
    },
    {
      "id": "q7",
      "type": "textarea",
      "title": "What are this person''s greatest strengths?",
      "required": true,
      "settings": {"placeholder": "Please provide specific examples...", "rows": 3}
    },
    {
      "id": "q8",
      "type": "textarea",
      "title": "What areas should this person focus on for development?",
      "required": true,
      "settings": {"placeholder": "Please provide constructive feedback...", "rows": 3}
    },
    {
      "id": "q9",
      "type": "multiple_choice",
      "title": "What development opportunities would benefit this person most?",
      "required": false,
      "settings": {
        "options": ["Leadership training", "Technical skills training", "Communication workshops", "Mentoring program", "Cross-functional projects", "External courses/certifications"],
        "allowMultiple": true,
        "maxSelections": 3
      }
    }
  ]',
  true, 'hr', 'performance', 15, true, 'published'
),

-- Training Evaluation Survey (Pro)
(
  '00000000-0000-0000-0000-000000000000',
  'Training Evaluation Survey',
  'Comprehensive training assessment using Kirkpatrick''s four-level evaluation model for measuring training effectiveness.',
  '[
    {
      "id": "q1",
      "type": "text",
      "title": "Training Program Name",
      "required": true,
      "settings": {"placeholder": "Enter the name of the training program"}
    },
    {
      "id": "q2",
      "type": "date",
      "title": "Training Date",
      "required": true,
      "settings": {}
    },
    {
      "id": "q3",
      "type": "rating",
      "title": "Overall, how would you rate this training program?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How relevant was the content to your job role?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Not relevant", "5": "Very relevant"}}
    },
    {
      "id": "q5",
      "type": "rating",
      "title": "How would you rate the trainer''s knowledge and expertise?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q6",
      "type": "multiple_choice",
      "title": "Which training methods were most effective for you?",
      "required": true,
      "settings": {
        "options": ["Lectures/presentations", "Hands-on exercises", "Group discussions", "Case studies", "Role-playing", "Interactive demos", "Q&A sessions"],
        "allowMultiple": true,
        "maxSelections": 3
      }
    },
    {
      "id": "q7",
      "type": "rating",
      "title": "How confident do you feel applying what you learned?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Not confident", "5": "Very confident"}}
    },
    {
      "id": "q8",
      "type": "yes_no",
      "title": "Will you be able to implement what you learned in your current role?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q9",
      "type": "textarea",
      "title": "What specific skills or knowledge will you apply from this training?",
      "required": false,
      "settings": {"placeholder": "Please be specific about what you will implement...", "rows": 3}
    },
    {
      "id": "q10",
      "type": "textarea",
      "title": "What improvements would you suggest for future training sessions?",
      "required": false,
      "settings": {"placeholder": "Your suggestions for improvement...", "rows": 3}
    }
  ]',
  true, 'training', 'evaluation', 10, true, 'published'
),

-- Customer Journey Mapping Survey (Pro)
(
  '00000000-0000-0000-0000-000000000000',
  'Customer Journey Mapping Survey',
  'Detailed survey to understand customer touchpoints, experiences, and pain points throughout their journey.',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "How did you first become aware of our company?",
      "required": true,
      "settings": {
        "options": ["Search engine", "Social media", "Word of mouth", "Advertisement", "Content/blog", "Email marketing", "Event/conference"],
        "allowOther": true
      }
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "How easy was it to find the information you needed on our website?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Very difficult", "5": "Very easy"}}
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "title": "Which touchpoints did you interact with during your research phase?",
      "required": true,
      "settings": {
        "options": ["Website", "Sales team", "Customer service", "Product demos", "Free trial", "Documentation", "Community forums", "Reviews/testimonials"],
        "allowMultiple": true
      }
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How would you rate your purchase/signup experience?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Very poor", "5": "Excellent"}}
    },
    {
      "id": "q5",
      "type": "textarea",
      "title": "What was the most frustrating part of your experience with us?",
      "required": false,
      "settings": {"placeholder": "Please describe any pain points...", "rows": 3}
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "What exceeded your expectations?",
      "required": false,
      "settings": {"placeholder": "Tell us what impressed you...", "rows": 3}
    },
    {
      "id": "q7",
      "type": "multiple_choice",
      "title": "How do you prefer to receive support when you need help?",
      "required": true,
      "settings": {
        "options": ["Email", "Phone", "Live chat", "Knowledge base/FAQ", "Video tutorials", "Community forums", "In-person"],
        "allowMultiple": true,
        "maxSelections": 3
      }
    },
    {
      "id": "q8",
      "type": "rating",
      "title": "How likely are you to continue using our product/service?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not at all likely", "10": "Extremely likely"}}
    }
  ]',
  true, 'customer-experience', 'journey', 8, true, 'published'
),

-- Brand Perception Survey (Pro)
(
  '00000000-0000-0000-0000-000000000000',
  'Brand Perception Survey',
  'Comprehensive brand awareness and perception study to understand how customers view your brand in the market.',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "Which of these brands are you familiar with?",
      "required": true,
      "settings": {
        "options": ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"],
        "allowMultiple": true,
        "note": "Customize with your brand and competitors"
      }
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "How would you rate our brand overall?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Very poor", "10": "Excellent"}}
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "title": "Which words best describe our brand?",
      "required": true,
      "settings": {
        "options": ["Innovative", "Trustworthy", "Affordable", "Premium", "Reliable", "Modern", "Traditional", "Customer-focused", "Expert", "Friendly"],
        "allowMultiple": true,
        "maxSelections": 5
      }
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How likely are you to recommend our brand to others?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not at all likely", "10": "Extremely likely"}}
    },
    {
      "id": "q5",
      "type": "multiple_choice",
      "title": "Compared to competitors, how do you perceive our brand?",
      "required": true,
      "settings": {
        "options": ["Much better", "Somewhat better", "About the same", "Somewhat worse", "Much worse", "Don''t know enough to compare"],
        "allowOther": false
      }
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "What is the first thing that comes to mind when you think of our brand?",
      "required": false,
      "settings": {"placeholder": "Please share your immediate thoughts...", "rows": 2}
    },
    {
      "id": "q7",
      "type": "multiple_choice",
      "title": "Where do you typically see or hear about our brand?",
      "required": true,
      "settings": {
        "options": ["Social media", "Online ads", "TV/radio", "Print ads", "Word of mouth", "Email", "Website", "Events", "Retail stores"],
        "allowMultiple": true
      }
    },
    {
      "id": "q8",
      "type": "rating",
      "title": "How well does our brand meet your needs?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Not at all", "5": "Completely"}}
    }
  ]',
  true, 'marketing', 'brand', 7, true, 'published'
);

-- Enterprise Plan Templates (Advanced Organizational Templates)
INSERT INTO public.survey_templates (
  user_id,
  title,
  description,
  questions,
  is_template,
  category,
  subcategory,
  estimated_time,
  is_public,
  status
) VALUES

-- Compliance Audit Survey (Enterprise)
(
  '00000000-0000-0000-0000-000000000000',
  'Compliance Audit Survey',
  'Comprehensive compliance assessment for regulatory requirements, internal policies, and industry standards.',
  '[
    {
      "id": "q1",
      "type": "text",
      "title": "Department/Division Being Audited",
      "required": true,
      "settings": {"placeholder": "Enter department name"}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "Which compliance frameworks apply to your area?",
      "required": true,
      "settings": {
        "options": ["SOX (Sarbanes-Oxley)", "GDPR", "HIPAA", "PCI DSS", "ISO 27001", "SOC 2", "NIST", "Industry-specific regulations"],
        "allowMultiple": true,
        "allowOther": true
      }
    },
    {
      "id": "q3",
      "type": "yes_no",
      "title": "Are all required compliance training programs up to date?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How would you rate the effectiveness of current compliance controls?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Ineffective", "5": "Highly effective"}}
    },
    {
      "id": "q5",
      "type": "multiple_choice",
      "title": "Which areas have identified compliance gaps?",
      "required": false,
      "settings": {
        "options": ["Data privacy", "Financial reporting", "Access controls", "Documentation", "Training records", "Incident response", "Vendor management", "Risk assessment"],
        "allowMultiple": true
      }
    },
    {
      "id": "q6",
      "type": "textarea",
      "title": "Describe any compliance incidents or near-misses in the past 12 months",
      "required": false,
      "settings": {"placeholder": "Please provide details of incidents and corrective actions taken...", "rows": 4}
    },
    {
      "id": "q7",
      "type": "rating",
      "title": "How confident are you in the organization''s ability to pass external audits?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Not confident", "5": "Very confident"}}
    },
    {
      "id": "q8",
      "type": "textarea",
      "title": "What compliance improvements are needed in your area?",
      "required": false,
      "settings": {"placeholder": "List specific improvements needed...", "rows": 3}
    },
    {
      "id": "q9",
      "type": "multiple_choice",
      "title": "What resources would help improve compliance in your department?",
      "required": false,
      "settings": {
        "options": ["Additional training", "Better documentation", "Technology solutions", "More staff", "Clearer policies", "Regular assessments", "External expertise"],
        "allowMultiple": true
      }
    }
  ]',
  true, 'compliance', 'audit', 20, true, 'published'
),

-- Risk Assessment Survey (Enterprise)
(
  '00000000-0000-0000-0000-000000000000',
  'Enterprise Risk Assessment Survey',
  'Comprehensive organizational risk assessment covering operational, financial, strategic, and compliance risks.',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "What is your role in risk management?",
      "required": true,
      "settings": {
        "options": ["Risk officer", "Department head", "Executive leadership", "Board member", "Process owner", "Auditor", "Other"],
        "allowOther": true
      }
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "Which risk categories are most relevant to your area?",
      "required": true,
      "settings": {
        "options": ["Operational risk", "Financial risk", "Strategic risk", "Compliance risk", "Technology risk", "Reputation risk", "Market risk", "Credit risk"],
        "allowMultiple": true
      }
    },
    {
      "id": "q3",
      "type": "rating",
      "title": "Rate the likelihood of significant operational disruptions in the next 12 months",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Very unlikely", "5": "Very likely"}}
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "Rate the potential impact if such disruptions occurred",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Minimal impact", "5": "Severe impact"}}
    },
    {
      "id": "q5",
      "type": "multiple_choice",
      "title": "What are the top risk factors facing your organization?",
      "required": true,
      "settings": {
        "options": ["Cybersecurity threats", "Economic uncertainty", "Regulatory changes", "Competition", "Technology disruption", "Talent shortage", "Supply chain issues", "Climate change"],
        "allowMultiple": true,
        "maxSelections": 5
      }
    },
    {
      "id": "q6",
      "type": "rating",
      "title": "How effective are current risk mitigation strategies?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Not effective", "5": "Very effective"}}
    },
    {
      "id": "q7",
      "type": "yes_no",
      "title": "Does your organization have a formal risk management framework?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q8",
      "type": "textarea",
      "title": "Describe the most significant risk your organization faces",
      "required": true,
      "settings": {"placeholder": "Please provide details about the risk and its potential impact...", "rows": 4}
    },
    {
      "id": "q9",
      "type": "multiple_choice",
      "title": "How frequently should risk assessments be conducted?",
      "required": true,
      "settings": {
        "options": ["Monthly", "Quarterly", "Semi-annually", "Annually", "As needed", "Continuously"],
        "allowOther": false
      }
    },
    {
      "id": "q10",
      "type": "rating",
      "title": "How well does leadership communicate about risks?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Very poorly", "5": "Very well"}}
    }
  ]',
  true, 'risk', 'assessment', 25, true, 'published'
),

-- Vendor Evaluation Survey (Enterprise)
(
  '00000000-0000-0000-0000-000000000000',
  'Vendor Evaluation Survey',
  'Comprehensive vendor assessment for procurement decisions, performance reviews, and relationship management.',
  '[
    {
      "id": "q1",
      "type": "text",
      "title": "Vendor/Supplier Name",
      "required": true,
      "settings": {"placeholder": "Enter vendor name"}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "What type of evaluation is this?",
      "required": true,
      "settings": {
        "options": ["Initial vendor selection", "Annual performance review", "Contract renewal", "Issue resolution", "Strategic partnership assessment"],
        "allowOther": false
      }
    },
    {
      "id": "q3",
      "type": "rating",
      "title": "Overall vendor performance rating",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "Quality of products/services delivered",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q5",
      "type": "rating",
      "title": "Timeliness of delivery/service",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q6",
      "type": "rating",
      "title": "Cost competitiveness",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q7",
      "type": "rating",
      "title": "Communication and responsiveness",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q8",
      "type": "yes_no",
      "title": "Does the vendor meet all contractual obligations?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q9",
      "type": "multiple_choice",
      "title": "Which areas need improvement?",
      "required": false,
      "settings": {
        "options": ["Quality control", "Delivery times", "Communication", "Pricing", "Innovation", "Technical support", "Account management", "Compliance"],
        "allowMultiple": true
      }
    },
    {
      "id": "q10",
      "type": "rating",
      "title": "How likely are you to recommend this vendor to other departments?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not at all likely", "10": "Extremely likely"}}
    },
    {
      "id": "q11",
      "type": "textarea",
      "title": "Additional comments and recommendations",
      "required": false,
      "settings": {"placeholder": "Please provide any additional feedback...", "rows": 4}
    }
  ]',
  true, 'procurement', 'vendor', 15, true, 'published'
),

-- Board Governance Survey (Enterprise)
(
  '00000000-0000-0000-0000-000000000000',
  'Board Governance Effectiveness Survey',
  'Assessment of board effectiveness, governance practices, and organizational oversight for board members and executives.',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "title": "What is your role in relation to the board?",
      "required": true,
      "settings": {
        "options": ["Board member", "Board chair", "CEO/Executive", "Board secretary", "Committee chair", "External advisor"],
        "allowOther": false
      }
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "How effective is the board in providing strategic oversight?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Not effective", "5": "Highly effective"}}
    },
    {
      "id": "q3",
      "type": "rating",
      "title": "How would you rate board meeting preparation and materials?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q4",
      "type": "yes_no",
      "title": "Does the board have the right mix of skills and expertise?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q5",
      "type": "multiple_choice",
      "title": "Which areas should the board focus more attention on?",
      "required": true,
      "settings": {
        "options": ["Strategy development", "Risk management", "Financial oversight", "Executive compensation", "Succession planning", "ESG/Sustainability", "Technology governance", "Stakeholder engagement"],
        "allowMultiple": true,
        "maxSelections": 4
      }
    },
    {
      "id": "q6",
      "type": "rating",
      "title": "How effective is communication between board and management?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q7",
      "type": "rating",
      "title": "How well does the board evaluate CEO/executive performance?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poorly", "5": "Very well"}}
    },
    {
      "id": "q8",
      "type": "yes_no",
      "title": "Are board committees functioning effectively?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q9",
      "type": "textarea",
      "title": "What changes would improve board effectiveness?",
      "required": false,
      "settings": {"placeholder": "Please suggest specific improvements...", "rows": 4}
    },
    {
      "id": "q10",
      "type": "rating",
      "title": "How satisfied are you with your overall board experience?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Very dissatisfied", "5": "Very satisfied"}}
    }
  ]',
  true, 'governance', 'board', 18, true, 'published'
);

-- Event Templates (All Plans)
INSERT INTO public.survey_templates (
  user_id,
  title,
  description,
  questions,
  is_template,
  category,
  subcategory,
  estimated_time,
  is_public,
  status
) VALUES

-- Pre-Event Survey
(
  '00000000-0000-0000-0000-000000000000',
  'Pre-Event Registration Survey',
  'Gather attendee information, expectations, and preferences before your event to ensure better planning and personalization.',
  '[
    {
      "id": "q1",
      "type": "text",
      "title": "What is your primary reason for attending this event?",
      "required": true,
      "settings": {"placeholder": "e.g., Learn new skills, network, stay updated..."}
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "title": "Which topics are you most interested in?",
      "required": true,
      "settings": {
        "options": ["Keynote presentations", "Technical workshops", "Networking sessions", "Panel discussions", "Product demos", "Industry trends"],
        "allowMultiple": true,
        "maxSelections": 3
      }
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "title": "What is your experience level with the event subject matter?",
      "required": true,
      "settings": {
        "options": ["Beginner", "Intermediate", "Advanced", "Expert"],
        "allowOther": false
      }
    },
    {
      "id": "q4",
      "type": "multiple_choice",
      "title": "How do you prefer to network at events?",
      "required": false,
      "settings": {
        "options": ["Structured networking sessions", "Informal meetups", "One-on-one meetings", "Group discussions", "Virtual networking", "Social events"],
        "allowMultiple": true
      }
    },
    {
      "id": "q5",
      "type": "textarea",
      "title": "Do you have any specific questions you hope will be addressed?",
      "required": false,
      "settings": {"placeholder": "Share any specific topics or questions...", "rows": 3}
    },
    {
      "id": "q6",
      "type": "multiple_choice",
      "title": "Do you have any dietary restrictions or accessibility needs?",
      "required": false,
      "settings": {
        "options": ["No restrictions", "Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher", "Wheelchair access needed", "Other accessibility needs"],
        "allowOther": true
      }
    }
  ]',
  true, 'events', 'pre-event', 5, true, 'published'
),

-- Post-Event Feedback Survey
(
  '00000000-0000-0000-0000-000000000000',
  'Post-Event Feedback Survey',
  'Comprehensive post-event evaluation to measure satisfaction, gather feedback, and improve future events.',
  '[
    {
      "id": "q1",
      "type": "rating",
      "title": "Overall, how would you rate this event?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "How well did the event meet your expectations?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Did not meet", "5": "Exceeded expectations"}}
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "title": "Which sessions did you find most valuable?",
      "required": true,
      "settings": {
        "options": ["Keynote presentations", "Technical workshops", "Panel discussions", "Networking sessions", "Product demos", "Q&A sessions"],
        "allowMultiple": true
      }
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How would you rate the quality of speakers/presenters?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q5",
      "type": "rating",
      "title": "How was the event organization and logistics?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q6",
      "type": "rating",
      "title": "How would you rate the networking opportunities?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q7",
      "type": "textarea",
      "title": "What was the most valuable takeaway from this event?",
      "required": false,
      "settings": {"placeholder": "Share your key learnings or insights...", "rows": 3}
    },
    {
      "id": "q8",
      "type": "textarea",
      "title": "What could be improved for future events?",
      "required": false,
      "settings": {"placeholder": "Your suggestions for improvement...", "rows": 3}
    },
    {
      "id": "q9",
      "type": "rating",
      "title": "How likely are you to attend future events from us?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not at all likely", "10": "Extremely likely"}}
    },
    {
      "id": "q10",
      "type": "rating",
      "title": "How likely are you to recommend this event to colleagues?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not at all likely", "10": "Extremely likely"}}
    }
  ]',
  true, 'events', 'post-event', 8, true, 'published'
),

-- Webinar Feedback Survey
(
  '00000000-0000-0000-0000-000000000000',
  'Webinar Feedback Survey',
  'Specialized feedback survey for webinars and virtual events to assess content quality, technical experience, and engagement.',
  '[
    {
      "id": "q1",
      "type": "rating",
      "title": "How would you rate the overall webinar experience?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q2",
      "type": "rating",
      "title": "How relevant was the content to your needs?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Not relevant", "5": "Very relevant"}}
    },
    {
      "id": "q3",
      "type": "rating",
      "title": "How would you rate the presenter''s delivery and expertise?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q4",
      "type": "rating",
      "title": "How was the technical quality (audio, video, platform)?",
      "required": true,
      "settings": {"maxRating": 5, "labels": {"1": "Poor", "5": "Excellent"}}
    },
    {
      "id": "q5",
      "type": "multiple_choice",
      "title": "What was the ideal length for this webinar?",
      "required": true,
      "settings": {
        "options": ["30 minutes", "45 minutes", "60 minutes", "90 minutes", "The current length was perfect"],
        "allowOther": false
      }
    },
    {
      "id": "q6",
      "type": "yes_no",
      "title": "Did you find the Q&A session helpful?",
      "required": true,
      "settings": {"yesLabel": "Yes", "noLabel": "No"}
    },
    {
      "id": "q7",
      "type": "multiple_choice",
      "title": "What additional resources would be helpful?",
      "required": false,
      "settings": {
        "options": ["Slide deck", "Recording", "Additional reading materials", "Follow-up webinar", "One-on-one consultation", "Related tools/templates"],
        "allowMultiple": true
      }
    },
    {
      "id": "q8",
      "type": "textarea",
      "title": "What topics would you like to see covered in future webinars?",
      "required": false,
      "settings": {"placeholder": "Suggest topics for future sessions...", "rows": 3}
    },
    {
      "id": "q9",
      "type": "rating",
      "title": "How likely are you to attend future webinars from us?",
      "required": true,
      "settings": {"maxRating": 10, "labels": {"1": "Not at all likely", "10": "Extremely likely"}}
    }
  ]',
  true, 'events', 'webinar', 6, true, 'published'
);

-- Update user plan restrictions for templates
UPDATE public.survey_templates 
SET 
  category = CASE 
    WHEN title IN ('Employee Engagement Survey', '360 Degree Feedback Survey', 'Training Evaluation Survey', 'Customer Journey Mapping Survey', 'Brand Perception Survey') THEN 'pro-business'
    WHEN title IN ('Compliance Audit Survey', 'Enterprise Risk Assessment Survey', 'Vendor Evaluation Survey', 'Board Governance Effectiveness Survey') THEN 'enterprise-governance'
    WHEN title IN ('Pre-Event Registration Survey', 'Post-Event Feedback Survey', 'Webinar Feedback Survey') THEN 'events'
    ELSE category
  END,
  subcategory = CASE
    WHEN title LIKE '%Employee%' OR title LIKE '%360%' OR title LIKE '%Training%' THEN 'hr-advanced'
    WHEN title LIKE '%Customer Journey%' OR title LIKE '%Brand%' THEN 'marketing-advanced'
    WHEN title LIKE '%Compliance%' OR title LIKE '%Risk%' OR title LIKE '%Vendor%' OR title LIKE '%Board%' THEN 'enterprise-only'
    WHEN title LIKE '%Event%' OR title LIKE '%Webinar%' THEN 'event-management'
    ELSE subcategory
  END
WHERE title IN (
  'Employee Engagement Survey',
  '360 Degree Feedback Survey', 
  'Training Evaluation Survey',
  'Customer Journey Mapping Survey',
  'Brand Perception Survey',
  'Compliance Audit Survey',
  'Enterprise Risk Assessment Survey',
  'Vendor Evaluation Survey',
  'Board Governance Effectiveness Survey',
  'Pre-Event Registration Survey',
  'Post-Event Feedback Survey',
  'Webinar Feedback Survey'
);

-- Add plan restrictions to the database schema
ALTER TABLE public.survey_templates ADD COLUMN IF NOT EXISTS plan_required TEXT DEFAULT 'free';
ALTER TABLE public.survey_templates ADD COLUMN IF NOT EXISTS enterprise_only BOOLEAN DEFAULT false;

-- Update plan requirements for new templates
UPDATE public.survey_templates 
SET 
  plan_required = CASE 
    WHEN title IN ('Employee Engagement Survey', '360 Degree Feedback Survey', 'Training Evaluation Survey', 'Customer Journey Mapping Survey', 'Brand Perception Survey') THEN 'pro'
    WHEN title IN ('Compliance Audit Survey', 'Enterprise Risk Assessment Survey', 'Vendor Evaluation Survey', 'Board Governance Effectiveness Survey') THEN 'enterprise'
    WHEN title IN ('Pre-Event Registration Survey', 'Post-Event Feedback Survey', 'Webinar Feedback Survey') THEN 'free'
    ELSE 'free'
  END,
  enterprise_only = CASE
    WHEN title IN ('Compliance Audit Survey', 'Enterprise Risk Assessment Survey', 'Vendor Evaluation Survey', 'Board Governance Effectiveness Survey') THEN true
    ELSE false
  END
WHERE title IN (
  'Employee Engagement Survey',
  '360 Degree Feedback Survey', 
  'Training Evaluation Survey',
  'Customer Journey Mapping Survey',
  'Brand Perception Survey',
  'Compliance Audit Survey',
  'Enterprise Risk Assessment Survey',
  'Vendor Evaluation Survey',
  'Board Governance Effectiveness Survey',
  'Pre-Event Registration Survey',
  'Post-Event Feedback Survey',
  'Webinar Feedback Survey'
);

-- Update the success message
SELECT 'Successfully added ' || COUNT(*) || ' advanced Pro and Enterprise templates!' as result 
FROM public.survey_templates 
WHERE title IN (
  'Employee Engagement Survey',
  '360 Degree Feedback Survey', 
  'Training Evaluation Survey',
  'Customer Journey Mapping Survey',
  'Brand Perception Survey',
  'Compliance Audit Survey',
  'Enterprise Risk Assessment Survey',
  'Vendor Evaluation Survey',
  'Board Governance Effectiveness Survey',
  'Pre-Event Registration Survey',
  'Post-Event Feedback Survey',
  'Webinar Feedback Survey'
);
