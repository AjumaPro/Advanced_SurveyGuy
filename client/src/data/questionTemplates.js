// Pre-built Question Templates for Common Survey Scenarios

export const questionTemplates = {
  // Customer Feedback Templates
  customerFeedback: [
    {
      id: 'customer-satisfaction-rating',
      name: 'Customer Satisfaction Rating',
      type: 'rating',
      title: 'How satisfied are you with our service?',
      description: 'Rate your overall satisfaction with our product or service',
      settings: { maxRating: 5, labels: { 1: 'Very Dissatisfied', 5: 'Very Satisfied' } },
      category: 'customer',
      tags: ['satisfaction', 'rating', 'customer'],
      popular: true
    },
    {
      id: 'nps-question',
      name: 'Net Promoter Score',
      type: 'nps',
      title: 'How likely are you to recommend us to a friend or colleague?',
      description: 'Measure customer loyalty and likelihood to recommend',
      settings: { labels: { 0: 'Not at all likely', 10: 'Extremely likely' } },
      category: 'customer',
      tags: ['nps', 'recommendation', 'loyalty'],
      popular: true
    },
    {
      id: 'improvement-suggestions',
      name: 'Improvement Suggestions',
      type: 'textarea',
      title: 'What improvements would you suggest?',
      description: 'Gather detailed feedback on potential improvements',
      settings: { placeholder: 'Please share your suggestions for improvement...', rows: 4 },
      category: 'customer',
      tags: ['feedback', 'improvement', 'suggestions']
    },
    {
      id: 'customer-support-rating',
      name: 'Customer Support Rating',
      type: 'emoji_scale',
      title: 'How would you rate your customer support experience?',
      description: 'Rate the quality of customer support interaction',
      settings: { scaleType: 'experience', showLabels: true },
      category: 'customer',
      tags: ['support', 'experience', 'emoji']
    }
  ],

  // Employee Survey Templates
  employeeSurvey: [
    {
      id: 'job-satisfaction',
      name: 'Job Satisfaction',
      type: 'rating',
      title: 'How satisfied are you with your current role?',
      description: 'Measure employee satisfaction with their job',
      settings: { maxRating: 10, labels: { 1: 'Very Dissatisfied', 10: 'Very Satisfied' } },
      category: 'employee',
      tags: ['satisfaction', 'job', 'employee'],
      popular: true
    },
    {
      id: 'work-life-balance',
      name: 'Work-Life Balance',
      type: 'emoji_scale',
      title: 'How do you feel about your work-life balance?',
      description: 'Assess employee work-life balance satisfaction',
      settings: { scaleType: 'satisfaction', showLabels: true },
      category: 'employee',
      tags: ['balance', 'wellbeing', 'employee']
    },
    {
      id: 'manager-feedback',
      name: 'Manager Effectiveness',
      type: 'multiple_choice',
      title: 'How would you describe your manager\'s communication style?',
      description: 'Evaluate manager communication effectiveness',
      settings: { 
        options: ['Very clear and helpful', 'Generally clear', 'Sometimes unclear', 'Often confusing', 'Very poor communication'],
        allowOther: false 
      },
      category: 'employee',
      tags: ['manager', 'communication', 'leadership']
    },
    {
      id: 'career-development',
      name: 'Career Development Opportunities',
      type: 'checkbox',
      title: 'Which career development opportunities interest you most?',
      description: 'Identify employee development preferences',
      settings: { 
        options: ['Leadership training', 'Technical skills training', 'Mentoring program', 'Cross-functional projects', 'External courses', 'Conference attendance'],
        minSelections: 1,
        maxSelections: 3
      },
      category: 'employee',
      tags: ['development', 'training', 'career']
    }
  ],

  // Product Research Templates
  productResearch: [
    {
      id: 'feature-priority',
      name: 'Feature Priority Ranking',
      type: 'ranking',
      title: 'Please rank these features in order of importance to you',
      description: 'Prioritize product features based on user needs',
      settings: { 
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'],
        maxRank: 5
      },
      category: 'product',
      tags: ['features', 'priority', 'ranking']
    },
    {
      id: 'product-usage-frequency',
      name: 'Product Usage Frequency',
      type: 'multiple_choice',
      title: 'How often do you use our product?',
      description: 'Understand product usage patterns',
      settings: { 
        options: ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely', 'Never'],
        allowOther: false 
      },
      category: 'product',
      tags: ['usage', 'frequency', 'behavior'],
      popular: true
    },
    {
      id: 'price-sensitivity',
      name: 'Price Sensitivity',
      type: 'slider',
      title: 'What would you consider a fair price for this product?',
      description: 'Gauge customer price expectations',
      settings: { min: 0, max: 500, step: 10, showValue: true },
      category: 'product',
      tags: ['pricing', 'value', 'economics']
    }
  ],

  // Event Feedback Templates
  eventFeedback: [
    {
      id: 'event-overall-rating',
      name: 'Overall Event Rating',
      type: 'rating',
      title: 'How would you rate the overall event experience?',
      description: 'General event satisfaction rating',
      settings: { maxRating: 5, labels: { 1: 'Poor', 5: 'Excellent' } },
      category: 'event',
      tags: ['event', 'overall', 'rating'],
      popular: true
    },
    {
      id: 'session-feedback',
      name: 'Session Feedback',
      type: 'matrix',
      title: 'Please rate each session you attended',
      description: 'Detailed feedback on individual event sessions',
      settings: { 
        rows: ['Keynote Presentation', 'Workshop A', 'Panel Discussion', 'Networking Session'],
        columns: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        scaleType: 'radio'
      },
      category: 'event',
      tags: ['sessions', 'matrix', 'detailed']
    },
    {
      id: 'event-recommendation',
      name: 'Event Recommendation',
      type: 'yes_no',
      title: 'Would you recommend this event to colleagues?',
      description: 'Simple recommendation question',
      settings: { 
        yesLabel: 'Yes, I would recommend',
        noLabel: 'No, I would not recommend'
      },
      category: 'event',
      tags: ['recommendation', 'simple', 'yes-no']
    }
  ],

  // Education Templates
  education: [
    {
      id: 'course-difficulty',
      name: 'Course Difficulty',
      type: 'emoji_scale',
      title: 'How would you rate the difficulty level of this course?',
      description: 'Assess course difficulty from student perspective',
      settings: { scaleType: 'difficulty', showLabels: true },
      category: 'education',
      tags: ['difficulty', 'course', 'education']
    },
    {
      id: 'learning-objectives',
      name: 'Learning Objectives Achievement',
      type: 'scale',
      title: 'The course helped me achieve the stated learning objectives',
      description: 'Measure learning objective achievement',
      settings: { 
        min: 1,
        max: 5,
        step: 1,
        minLabel: 'Strongly Disagree',
        maxLabel: 'Strongly Agree',
        labels: {
          1: 'Strongly Disagree',
          2: 'Disagree',
          3: 'Neutral',
          4: 'Agree',
          5: 'Strongly Agree'
        }
      },
      category: 'education',
      tags: ['objectives', 'learning', 'achievement']
    },
    {
      id: 'instructor-feedback',
      name: 'Instructor Effectiveness',
      type: 'multiple_choice',
      title: 'Which aspect of the instructor\'s teaching was most effective?',
      description: 'Identify effective teaching methods',
      settings: { 
        options: ['Clear explanations', 'Interactive activities', 'Real-world examples', 'Responsive to questions', 'Organized presentation'],
        allowOther: true
      },
      category: 'education',
      tags: ['instructor', 'teaching', 'effectiveness']
    }
  ],

  // Healthcare Templates
  healthcare: [
    {
      id: 'pain-scale',
      name: 'Pain Level Assessment',
      type: 'scale',
      title: 'On a scale of 1-10, how would you rate your current pain level?',
      description: 'Standardized pain assessment scale',
      settings: { minScale: 1, maxScale: 10, step: 1, labels: { 1: 'No Pain', 10: 'Worst Pain' } },
      category: 'healthcare',
      tags: ['pain', 'assessment', 'medical']
    },
    {
      id: 'appointment-satisfaction',
      name: 'Appointment Satisfaction',
      type: 'emoji_scale',
      title: 'How satisfied were you with your appointment today?',
      description: 'Patient satisfaction with medical appointment',
      settings: { scaleType: 'satisfaction', showLabels: true },
      category: 'healthcare',
      tags: ['appointment', 'satisfaction', 'patient']
    },
    {
      id: 'wait-time-feedback',
      name: 'Wait Time Feedback',
      type: 'multiple_choice',
      title: 'How long did you wait before being seen?',
      description: 'Track patient wait times',
      settings: { 
        options: ['Less than 10 minutes', '10-20 minutes', '20-30 minutes', '30-45 minutes', 'More than 45 minutes'],
        allowOther: false 
      },
      category: 'healthcare',
      tags: ['wait', 'time', 'appointment']
    }
  ],

  // Market Research Templates
  marketResearch: [
    {
      id: 'brand-awareness',
      name: 'Brand Awareness',
      type: 'multiple_choice',
      title: 'Which of these brands are you familiar with?',
      description: 'Measure brand recognition and awareness',
      settings: { 
        options: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'],
        allowMultiple: true
      },
      category: 'market',
      tags: ['brand', 'awareness', 'recognition']
    },
    {
      id: 'purchase-intent',
      name: 'Purchase Intent',
      type: 'scale',
      title: 'How likely are you to purchase this product in the next 6 months?',
      description: 'Measure customer purchase intention',
      settings: { minScale: 1, maxScale: 7, step: 1, labels: { 1: 'Very Unlikely', 7: 'Very Likely' } },
      category: 'market',
      tags: ['purchase', 'intent', 'likelihood']
    },
    {
      id: 'demographic-age',
      name: 'Age Demographics',
      type: 'multiple_choice',
      title: 'What is your age group?',
      description: 'Collect demographic information about age',
      settings: { 
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        allowOther: false 
      },
      category: 'market',
      tags: ['demographics', 'age', 'segmentation']
    }
  ],

  // Contact Information Templates
  contactInfo: [
    {
      id: 'email-address',
      name: 'Email Address',
      type: 'email',
      title: 'What is your email address?',
      description: 'Collect respondent email for follow-up',
      settings: { placeholder: 'your@email.com' },
      category: 'contact',
      tags: ['email', 'contact', 'communication']
    },
    {
      id: 'phone-number',
      name: 'Phone Number',
      type: 'phone',
      title: 'What is your phone number?',
      description: 'Collect phone number for contact purposes',
      settings: { placeholder: '+1 (555) 123-4567', format: 'international' },
      category: 'contact',
      tags: ['phone', 'contact', 'communication']
    },
    {
      id: 'company-info',
      name: 'Company Information',
      type: 'text',
      title: 'What company do you work for?',
      description: 'Collect professional affiliation information',
      settings: { placeholder: 'Enter your company name' },
      category: 'contact',
      tags: ['company', 'professional', 'business']
    }
  ]
};

// Get all templates as flat array
export const getAllQuestionTemplates = () => {
  return Object.values(questionTemplates).flat();
};

// Get templates by category
export const getQuestionTemplatesByCategory = (category) => {
  return questionTemplates[category] || [];
};

// Get popular templates
export const getPopularQuestionTemplates = () => {
  return getAllQuestionTemplates().filter(template => template.popular);
};

// Search templates
export const searchQuestionTemplates = (searchTerm, category = null) => {
  let templates = category ? getQuestionTemplatesByCategory(category) : getAllQuestionTemplates();
  
  if (!searchTerm) return templates;
  
  const term = searchTerm.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(term) ||
    template.title.toLowerCase().includes(term) ||
    template.description.toLowerCase().includes(term) ||
    template.tags.some(tag => tag.toLowerCase().includes(term))
  );
};

// Question template categories
export const questionTemplateCategories = [
  { id: 'all', name: 'All Templates', icon: 'Grid' },
  { id: 'customerFeedback', name: 'Customer Feedback', icon: 'Star' },
  { id: 'employeeSurvey', name: 'Employee Survey', icon: 'Users' },
  { id: 'productResearch', name: 'Product Research', icon: 'Target' },
  { id: 'eventFeedback', name: 'Event Feedback', icon: 'Calendar' },
  { id: 'education', name: 'Education', icon: 'GraduationCap' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart' },
  { id: 'marketResearch', name: 'Market Research', icon: 'TrendingUp' },
  { id: 'contactInfo', name: 'Contact Info', icon: 'Mail' }
];

export default questionTemplates;
