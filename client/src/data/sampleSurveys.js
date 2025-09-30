// Comprehensive sample surveys for different industries and use cases

export const sampleSurveys = [
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction Survey',
    description: 'Measure customer satisfaction with our products and services',
    category: 'Customer Experience',
    industry: 'General',
    estimatedTime: 5,
    questions: [
      {
        id: 'overall-satisfaction',
        type: 'emoji_scale',
        title: 'How satisfied are you with our service overall?',
        description: 'Please rate your overall experience with us',
        required: true,
        scaleType: 'satisfaction',
        showLabels: true
      },
      {
        id: 'product-quality',
        type: 'rating',
        title: 'How would you rate the quality of our products?',
        required: true,
        maxRating: 5,
        allowHalf: false
      },
      {
        id: 'service-aspects',
        type: 'checkbox',
        title: 'Which aspects of our service impressed you most?',
        required: false,
        options: [
          'Fast response time',
          'Helpful staff',
          'Product quality',
          'Competitive pricing',
          'Easy ordering process',
          'Reliable delivery'
        ],
        allowOther: true,
        maxSelections: 3
      },
      {
        id: 'improvement-areas',
        type: 'multiple_choice',
        title: 'What area needs the most improvement?',
        required: true,
        options: [
          'Customer service',
          'Product quality',
          'Delivery speed',
          'Website experience',
          'Pricing',
          'Product variety'
        ],
        allowOther: true
      },
      {
        id: 'recommendation',
        type: 'nps',
        title: 'How likely are you to recommend us to a friend or colleague?',
        description: 'On a scale of 0-10, where 0 is not likely at all and 10 is extremely likely',
        required: true
      },
      {
        id: 'feedback',
        type: 'textarea',
        title: 'Please share any additional feedback or suggestions',
        required: false,
        placeholder: 'Your detailed feedback helps us improve...',
        maxLength: 1000
      },
      {
        id: 'contact-permission',
        type: 'multiple_choice',
        title: 'May we contact you about your feedback?',
        required: true,
        options: ['Yes, please contact me', 'No, thank you']
      }
    ]
  },

  {
    id: 'employee-engagement',
    title: 'Employee Engagement Survey',
    description: 'Annual employee satisfaction and engagement assessment',
    category: 'Human Resources',
    industry: 'Corporate',
    estimatedTime: 10,
    questions: [
      {
        id: 'job-satisfaction',
        type: 'emoji_scale',
        title: 'How do you feel about your current role?',
        required: true,
        scaleType: 'mood',
        showLabels: true
      },
      {
        id: 'work-life-balance',
        type: 'scale',
        title: 'How would you rate your work-life balance?',
        required: true,
        minScale: 1,
        maxScale: 10,
        step: 1
      },
      {
        id: 'company-values',
        type: 'likert',
        title: 'I feel aligned with the company\'s values and mission',
        required: true,
        points: 5,
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'career-development',
        type: 'checkbox',
        title: 'What career development opportunities interest you most?',
        required: false,
        options: [
          'Leadership training',
          'Technical skills development',
          'Mentorship programs',
          'Cross-departmental projects',
          'External conferences',
          'Advanced education support'
        ],
        maxSelections: 3
      },
      {
        id: 'remote-work',
        type: 'multiple_choice',
        title: 'What is your preferred work arrangement?',
        required: true,
        options: [
          'Fully remote',
          'Hybrid (2-3 days in office)',
          'Mostly in-office',
          'Fully in-office',
          'Flexible based on projects'
        ]
      },
      {
        id: 'manager-feedback',
        type: 'rating',
        title: 'How would you rate your relationship with your direct manager?',
        required: true,
        maxRating: 5
      },
      {
        id: 'suggestions',
        type: 'textarea',
        title: 'What suggestions do you have to improve our workplace?',
        required: false,
        placeholder: 'Share your ideas for making our workplace better...',
        maxLength: 500
      }
    ]
  },

  {
    id: 'product-feedback',
    title: 'Product Feedback Survey',
    description: 'Help us improve our product with your valuable feedback',
    category: 'Product Development',
    industry: 'Technology',
    estimatedTime: 7,
    questions: [
      {
        id: 'usage-frequency',
        type: 'multiple_choice',
        title: 'How often do you use our product?',
        required: true,
        options: [
          'Daily',
          'Several times a week',
          'Weekly',
          'Monthly',
          'Rarely',
          'This is my first time'
        ]
      },
      {
        id: 'feature-satisfaction',
        type: 'matrix',
        title: 'Please rate your satisfaction with the following features:',
        required: true,
        rows: [
          'User interface',
          'Performance/Speed',
          'Reliability',
          'Customer support',
          'Documentation'
        ],
        columns: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
        scaleType: 'rating'
      },
      {
        id: 'most-valuable-feature',
        type: 'ranking',
        title: 'Rank these features by importance to you (drag to reorder)',
        required: true,
        options: [
          'Easy to use interface',
          'Fast performance',
          'Mobile compatibility',
          'Integration capabilities',
          'Customer support',
          'Regular updates'
        ]
      },
      {
        id: 'missing-features',
        type: 'checkbox',
        title: 'What features would you like to see added?',
        required: false,
        options: [
          'Better mobile app',
          'More integrations',
          'Advanced analytics',
          'Team collaboration tools',
          'API access',
          'Custom branding options'
        ],
        allowOther: true
      },
      {
        id: 'overall-experience',
        type: 'emoji_scale',
        title: 'How would you describe your overall experience?',
        required: true,
        scaleType: 'experience',
        showLabels: true
      },
      {
        id: 'detailed-feedback',
        type: 'textarea',
        title: 'Please provide any additional feedback about our product',
        required: false,
        placeholder: 'Tell us what you love, what frustrates you, or what you\'d like to see improved...',
        maxLength: 2000
      }
    ]
  },

  {
    id: 'event-registration',
    title: 'Conference Registration Form',
    description: 'Register for our annual technology conference',
    category: 'Event Management',
    industry: 'Events',
    estimatedTime: 8,
    questions: [
      {
        id: 'personal-info',
        type: 'text',
        title: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        type: 'email',
        title: 'Email Address',
        required: true,
        placeholder: 'your@email.com'
      },
      {
        id: 'phone',
        type: 'phone',
        title: 'Phone Number',
        required: true,
        placeholder: '+1 (555) 123-4567'
      },
      {
        id: 'company',
        type: 'text',
        title: 'Company/Organization',
        required: true,
        placeholder: 'Your company name'
      },
      {
        id: 'job-title',
        type: 'text',
        title: 'Job Title',
        required: false,
        placeholder: 'Your current position'
      },
      {
        id: 'attendance-days',
        type: 'checkbox',
        title: 'Which days will you attend?',
        required: true,
        options: [
          'Day 1 - Keynotes & Strategy (March 15)',
          'Day 2 - Technical Sessions (March 16)',
          'Day 3 - Workshops & Networking (March 17)'
        ],
        minSelections: 1
      },
      {
        id: 'session-interests',
        type: 'checkbox',
        title: 'Which session tracks interest you most?',
        required: false,
        options: [
          'Artificial Intelligence & Machine Learning',
          'Cloud Computing & DevOps',
          'Cybersecurity & Privacy',
          'Web Development & Frontend',
          'Mobile Development',
          'Data Science & Analytics',
          'Leadership & Management'
        ],
        maxSelections: 3
      },
      {
        id: 'dietary-requirements',
        type: 'multiple_choice',
        title: 'Do you have any dietary requirements?',
        required: true,
        options: [
          'No special requirements',
          'Vegetarian',
          'Vegan',
          'Gluten-free',
          'Halal',
          'Kosher',
          'Other dietary restriction'
        ],
        allowOther: true
      },
      {
        id: 'accessibility-needs',
        type: 'textarea',
        title: 'Do you have any accessibility requirements?',
        required: false,
        placeholder: 'Please describe any accommodations you need...',
        maxLength: 500
      },
      {
        id: 'networking-interest',
        type: 'thumbs',
        title: 'Are you interested in networking opportunities?',
        required: true,
        labels: { up: 'Yes, I\'d love to network', down: 'No, just attending sessions' }
      }
    ]
  },

  {
    id: 'market-research',
    title: 'Market Research Survey',
    description: 'Help us understand market trends and customer preferences',
    category: 'Market Research',
    industry: 'Business',
    estimatedTime: 12,
    questions: [
      {
        id: 'demographics-age',
        type: 'multiple_choice',
        title: 'What is your age group?',
        required: true,
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
      },
      {
        id: 'demographics-income',
        type: 'multiple_choice',
        title: 'What is your annual household income?',
        required: false,
        options: [
          'Under $25,000',
          '$25,000 - $49,999',
          '$50,000 - $74,999',
          '$75,000 - $99,999',
          '$100,000 - $149,999',
          '$150,000+'
        ]
      },
      {
        id: 'purchase-frequency',
        type: 'scale',
        title: 'How often do you purchase products in this category?',
        required: true,
        minScale: 1,
        maxScale: 7,
        step: 1
      },
      {
        id: 'brand-awareness',
        type: 'checkbox',
        title: 'Which brands in this category are you familiar with?',
        required: true,
        options: [
          'Brand A',
          'Brand B', 
          'Brand C',
          'Brand D',
          'Brand E',
          'None of the above'
        ]
      },
      {
        id: 'purchase-factors',
        type: 'ranking',
        title: 'Rank these factors by importance when making a purchase (drag to reorder)',
        required: true,
        options: [
          'Price',
          'Quality',
          'Brand reputation',
          'Customer reviews',
          'Features',
          'Customer service'
        ]
      },
      {
        id: 'spending-amount',
        type: 'currency',
        title: 'How much do you typically spend on this type of product?',
        required: false,
        currency: 'USD',
        min: 0,
        max: 10000
      },
      {
        id: 'additional-insights',
        type: 'textarea',
        title: 'Any additional insights about this market?',
        required: false,
        placeholder: 'Share your thoughts about trends, unmet needs, or market gaps...',
        maxLength: 1500
      }
    ]
  },

  {
    id: 'course-evaluation',
    title: 'Course Evaluation Form',
    description: 'Help us improve our training programs with your feedback',
    category: 'Education',
    industry: 'Education',
    estimatedTime: 6,
    questions: [
      {
        id: 'course-rating',
        type: 'emoji_scale',
        title: 'How would you rate this course overall?',
        required: true,
        scaleType: 'experience',
        showLabels: true
      },
      {
        id: 'content-quality',
        type: 'rating',
        title: 'Rate the quality of course content',
        required: true,
        maxRating: 5
      },
      {
        id: 'instructor-effectiveness',
        type: 'rating',
        title: 'Rate the instructor\'s effectiveness',
        required: true,
        maxRating: 5
      },
      {
        id: 'learning-objectives',
        type: 'likert',
        title: 'The course met its stated learning objectives',
        required: true,
        points: 5,
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'course-pace',
        type: 'multiple_choice',
        title: 'How was the pace of the course?',
        required: true,
        options: ['Too slow', 'Just right', 'Too fast']
      },
      {
        id: 'most-valuable',
        type: 'textarea',
        title: 'What was the most valuable part of this course?',
        required: false,
        placeholder: 'Describe what you found most helpful...',
        maxLength: 500
      },
      {
        id: 'improvements',
        type: 'textarea',
        title: 'How could this course be improved?',
        required: false,
        placeholder: 'Share your suggestions for improvement...',
        maxLength: 500
      },
      {
        id: 'recommend-course',
        type: 'thumbs',
        title: 'Would you recommend this course to others?',
        required: true,
        labels: { up: 'Yes, I would recommend it', down: 'No, I would not recommend it' }
      }
    ]
  },

  {
    id: 'website-usability',
    title: 'Website Usability Study',
    description: 'Help us improve our website user experience',
    category: 'User Experience',
    industry: 'Technology',
    estimatedTime: 8,
    questions: [
      {
        id: 'visit-purpose',
        type: 'multiple_choice',
        title: 'What was the primary purpose of your visit today?',
        required: true,
        options: [
          'Browse products/services',
          'Make a purchase',
          'Get customer support',
          'Learn about the company',
          'Apply for a job',
          'Other'
        ],
        allowOther: true
      },
      {
        id: 'task-completion',
        type: 'thumbs',
        title: 'Were you able to complete your intended task?',
        required: true,
        labels: { up: 'Yes, successfully', down: 'No, I had difficulties' }
      },
      {
        id: 'navigation-ease',
        type: 'emoji_scale',
        title: 'How easy was it to find what you were looking for?',
        required: true,
        scaleType: 'experience',
        showLabels: true
      },
      {
        id: 'website-aspects',
        type: 'matrix',
        title: 'Please rate the following aspects of our website:',
        required: true,
        rows: [
          'Design and appearance',
          'Ease of navigation',
          'Page loading speed',
          'Mobile experience',
          'Search functionality'
        ],
        columns: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        scaleType: 'rating'
      },
      {
        id: 'improvement-priorities',
        type: 'ranking',
        title: 'Rank these improvement areas by priority (drag to reorder)',
        required: true,
        options: [
          'Faster page loading',
          'Better mobile experience',
          'Improved search',
          'Clearer navigation',
          'Better product information',
          'Simplified checkout process'
        ]
      },
      {
        id: 'additional-comments',
        type: 'textarea',
        title: 'Any additional comments about your website experience?',
        required: false,
        placeholder: 'Share any other thoughts about our website...',
        maxLength: 1000
      }
    ]
  },

  {
    id: 'healthcare-patient',
    title: 'Patient Experience Survey',
    description: 'Help us improve our healthcare services',
    category: 'Healthcare',
    industry: 'Healthcare',
    estimatedTime: 9,
    questions: [
      {
        id: 'visit-type',
        type: 'multiple_choice',
        title: 'What type of visit was this?',
        required: true,
        options: [
          'Routine check-up',
          'Urgent care',
          'Specialist consultation',
          'Follow-up appointment',
          'Emergency visit',
          'Procedure/Surgery'
        ]
      },
      {
        id: 'appointment-scheduling',
        type: 'emoji_scale',
        title: 'How was your experience scheduling this appointment?',
        required: true,
        scaleType: 'satisfaction',
        showLabels: true
      },
      {
        id: 'wait-time',
        type: 'number',
        title: 'Approximately how long did you wait to see the provider? (minutes)',
        required: false,
        min: 0,
        max: 300,
        placeholder: 'Enter wait time in minutes'
      },
      {
        id: 'staff-interaction',
        type: 'rating',
        title: 'Rate your interaction with our staff',
        required: true,
        maxRating: 5
      },
      {
        id: 'provider-communication',
        type: 'likert',
        title: 'The healthcare provider explained things in a way I could understand',
        required: true,
        points: 5,
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'facility-cleanliness',
        type: 'rating',
        title: 'Rate the cleanliness of our facility',
        required: true,
        maxRating: 5
      },
      {
        id: 'overall-care',
        type: 'emoji_scale',
        title: 'How would you rate the overall quality of care you received?',
        required: true,
        scaleType: 'satisfaction',
        showLabels: true
      },
      {
        id: 'recommendation',
        type: 'nps',
        title: 'How likely are you to recommend our healthcare facility?',
        required: true
      },
      {
        id: 'additional-feedback',
        type: 'textarea',
        title: 'Please share any additional feedback about your visit',
        required: false,
        placeholder: 'Your feedback helps us provide better care...',
        maxLength: 1000
      }
    ]
  }
];

export const getSampleSurveyById = (id) => {
  return sampleSurveys.find(survey => survey.id === id);
};

export const getSampleSurveysByCategory = (category) => {
  return sampleSurveys.filter(survey => survey.category === category);
};

export const getSampleSurveysByIndustry = (industry) => {
  return sampleSurveys.filter(survey => survey.industry === industry);
};

export default sampleSurveys;
