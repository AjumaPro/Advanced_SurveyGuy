// Survey Templates Data
export const surveyTemplates = [
  // Customer Feedback Templates
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction Survey',
    category: 'customer-feedback',
    description: 'Measure customer satisfaction and identify areas for improvement',
    icon: 'Star',
    questions: [
      {
        type: 'rating',
        question: 'How satisfied are you with our product/service?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        type: 'rating',
        question: 'How likely are you to recommend us to others?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
      },
      {
        type: 'text',
        question: 'What did you like most about our product/service?',
        required: false
      },
      {
        type: 'text',
        question: 'What could we improve?',
        required: false
      },
      {
        type: 'multiple-choice',
        question: 'How did you hear about us?',
        required: false,
        options: ['Social Media', 'Friend/Family', 'Advertisement', 'Search Engine', 'Other']
      }
    ],
    estimatedTime: '2-3 minutes',
    responseCount: 0
  },
  {
    id: 'product-feedback',
    name: 'Product Feedback Survey',
    category: 'customer-feedback',
    description: 'Gather detailed feedback about your products',
    icon: 'ShoppingCart',
    questions: [
      {
        type: 'rating',
        question: 'How would you rate the quality of our product?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'rating',
        question: 'How would you rate the value for money?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'multiple-choice',
        question: 'Which features do you use most?',
        required: false,
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'All of them']
      },
      {
        type: 'text',
        question: 'What additional features would you like to see?',
        required: false
      },
      {
        type: 'yes-no',
        question: 'Would you purchase this product again?',
        required: true
      }
    ],
    estimatedTime: '3-4 minutes',
    responseCount: 0
  },

  // Employee Templates
  {
    id: 'employee-satisfaction',
    name: 'Employee Satisfaction Survey',
    category: 'employee',
    description: 'Measure employee satisfaction and engagement',
    icon: 'Users',
    questions: [
      {
        type: 'rating',
        question: 'How satisfied are you with your current role?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        type: 'rating',
        question: 'How would you rate your work-life balance?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'rating',
        question: 'How satisfied are you with your manager?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        type: 'multiple-choice',
        question: 'What would improve your job satisfaction?',
        required: false,
        options: ['Better compensation', 'More training', 'Flexible hours', 'Better benefits', 'Career growth']
      },
      {
        type: 'text',
        question: 'What suggestions do you have for improving the workplace?',
        required: false
      }
    ],
    estimatedTime: '5-7 minutes',
    responseCount: 0
  },

  // Education Templates
  {
    id: 'course-evaluation',
    name: 'Course Evaluation Survey',
    category: 'education',
    description: 'Evaluate course effectiveness and instructor performance',
    icon: 'GraduationCap',
    questions: [
      {
        type: 'rating',
        question: 'How would you rate the overall quality of this course?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'rating',
        question: 'How effective was the instructor?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'rating',
        question: 'How relevant was the course content?',
        required: true,
        options: ['Not Relevant', 'Somewhat Relevant', 'Relevant', 'Very Relevant', 'Extremely Relevant']
      },
      {
        type: 'multiple-choice',
        question: 'What was the most valuable aspect of this course?',
        required: false,
        options: ['Course content', 'Instructor', 'Materials', 'Assignments', 'Discussions']
      },
      {
        type: 'text',
        question: 'What suggestions do you have for improving this course?',
        required: false
      }
    ],
    estimatedTime: '3-4 minutes',
    responseCount: 0
  },

  // Healthcare Templates
  {
    id: 'patient-satisfaction',
    name: 'Patient Satisfaction Survey',
    category: 'healthcare',
    description: 'Measure patient satisfaction with healthcare services',
    icon: 'Heart',
    questions: [
      {
        type: 'rating',
        question: 'How satisfied are you with the care you received?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        type: 'rating',
        question: 'How would you rate the communication with your healthcare provider?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'rating',
        question: 'How would you rate the cleanliness of the facility?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'multiple-choice',
        question: 'How long did you wait to be seen?',
        required: false,
        options: ['Less than 15 minutes', '15-30 minutes', '30-60 minutes', 'More than 1 hour']
      },
      {
        type: 'text',
        question: 'What could we improve about your experience?',
        required: false
      }
    ],
    estimatedTime: '3-4 minutes',
    responseCount: 0
  },

  // Event Templates
  {
    id: 'event-feedback',
    name: 'Event Feedback Survey',
    category: 'events',
    description: 'Gather feedback from event attendees',
    icon: 'Calendar',
    questions: [
      {
        type: 'rating',
        question: 'How would you rate the overall event?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'rating',
        question: 'How would you rate the event organization?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'multiple-choice',
        question: 'What was your favorite part of the event?',
        required: false,
        options: ['Keynote speakers', 'Networking', 'Workshops', 'Food & refreshments', 'Venue']
      },
      {
        type: 'text',
        question: 'What would you like to see at future events?',
        required: false
      },
      {
        type: 'yes-no',
        question: 'Would you attend this event again?',
        required: true
      }
    ],
    estimatedTime: '2-3 minutes',
    responseCount: 0
  },

  // Market Research Templates
  {
    id: 'market-research',
    name: 'Market Research Survey',
    category: 'market-research',
    description: 'Conduct market research and understand customer preferences',
    icon: 'Target',
    questions: [
      {
        type: 'multiple-choice',
        question: 'What is your age group?',
        required: true,
        options: ['18-24', '25-34', '35-44', '45-54', '55+']
      },
      {
        type: 'multiple-choice',
        question: 'What is your household income?',
        required: false,
        options: ['Under $25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '$100k+']
      },
      {
        type: 'multiple-choice',
        question: 'How do you typically make purchasing decisions?',
        required: false,
        options: ['Online research', 'Recommendations', 'Advertising', 'In-store browsing', 'Social media']
      },
      {
        type: 'text',
        question: 'What factors are most important to you when choosing a product?',
        required: false
      },
      {
        type: 'rating',
        question: 'How likely are you to try new products?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
      }
    ],
    estimatedTime: '4-5 minutes',
    responseCount: 0
  }
];

// Event Templates Data
export const eventTemplates = [
  // Business Events
  {
    id: 'business-conference',
    name: 'Business Conference',
    category: 'business',
    description: 'Professional conference with speakers, networking, and workshops',
    icon: 'Building',
    template: 'conference',
    fields: ['name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees'],
    defaultCapacity: 500,
    defaultPrice: 299.99,
    features: [
      'Professional speakers',
      'Networking sessions',
      'Workshop tracks',
      'Lunch included',
      'Conference materials',
      'Certificate of attendance'
    ],
    estimatedDuration: '8 hours',
    targetAudience: 'Professionals, Executives, Entrepreneurs'
  },
  {
    id: 'corporate-meeting',
    name: 'Corporate Meeting',
    category: 'business',
    description: 'Internal company meeting or team building event',
    icon: 'Users',
    template: 'standard',
    fields: ['name', 'email', 'phone', 'department', 'attendees'],
    defaultCapacity: 100,
    defaultPrice: 0,
    features: [
      'Team building activities',
      'Presentations',
      'Group discussions',
      'Refreshments',
      'Meeting materials'
    ],
    estimatedDuration: '4 hours',
    targetAudience: 'Employees, Team Members'
  },

  // Educational Events
  {
    id: 'workshop',
    name: 'Educational Workshop',
    category: 'education',
    description: 'Hands-on learning workshop with practical exercises',
    icon: 'GraduationCap',
    template: 'workshop',
    fields: ['name', 'email', 'phone', 'experience', 'goals', 'attendees'],
    defaultCapacity: 50,
    defaultPrice: 99.99,
    features: [
      'Hands-on training',
      'Expert instruction',
      'Practice materials',
      'Certificate',
      'Take-home resources'
    ],
    estimatedDuration: '6 hours',
    targetAudience: 'Students, Professionals, Hobbyists'
  },
  {
    id: 'webinar',
    name: 'Online Webinar',
    category: 'education',
    description: 'Virtual educational session with live interaction',
    icon: 'GraduationCap',
    template: 'webinar',
    fields: ['name', 'email', 'phone', 'meetingLink', 'platform', 'attendees'],
    defaultCapacity: 500,
    defaultPrice: 49.99,
    features: [
      'Live presentation',
      'Interactive Q&A',
      'Screen sharing',
      'Recording access',
      'Digital materials'
    ],
    estimatedDuration: '2 hours',
    targetAudience: 'Remote learners, Professionals, Students'
  },

  // Social Events
  {
    id: 'wedding',
    name: 'Wedding Celebration',
    category: 'social',
    description: 'Wedding ceremony and reception celebration',
    icon: 'Heart',
    template: 'wedding',
    fields: ['name', 'email', 'phone', 'plusOne', 'dietary', 'attendees'],
    defaultCapacity: 150,
    defaultPrice: 0,
    features: [
      'Ceremony',
      'Reception',
      'Dinner service',
      'Entertainment',
      'Photography',
      'Wedding favors'
    ],
    estimatedDuration: '8 hours',
    targetAudience: 'Family, Friends, Colleagues'
  },
  {
    id: 'birthday-party',
    name: 'Birthday Party',
    category: 'social',
    description: 'Birthday celebration with friends and family',
    icon: 'Gift',
    template: 'standard',
    fields: ['name', 'email', 'phone', 'attendees'],
    defaultCapacity: 50,
    defaultPrice: 0,
    features: [
      'Party decorations',
      'Catering',
      'Entertainment',
      'Games & activities',
      'Party favors'
    ],
    estimatedDuration: '4 hours',
    targetAudience: 'Friends, Family, Children'
  },

  // Entertainment Events
  {
    id: 'concert',
    name: 'Concert or Music Event',
    category: 'entertainment',
    description: 'Live music performance or concert',
    icon: 'Music',
    template: 'standard',
    fields: ['name', 'email', 'phone', 'attendees'],
    defaultCapacity: 1000,
    defaultPrice: 79.99,
    features: [
      'Live performance',
      'Sound system',
      'Lighting effects',
      'Merchandise',
      'Food & beverages'
    ],
    estimatedDuration: '4 hours',
    targetAudience: 'Music lovers, General public'
  },
  {
    id: 'photography-workshop',
    name: 'Photography Workshop',
    category: 'entertainment',
    description: 'Photography skills workshop and photo shoot',
    icon: 'Camera',
    template: 'workshop',
    fields: ['name', 'email', 'phone', 'experience', 'goals', 'attendees'],
    defaultCapacity: 20,
    defaultPrice: 149.99,
    features: [
      'Equipment provided',
      'Expert instruction',
      'Outdoor shooting',
      'Photo editing',
      'Portfolio review'
    ],
    estimatedDuration: '8 hours',
    targetAudience: 'Photography enthusiasts, Beginners, Professionals'
  },

  // Health & Wellness
  {
    id: 'fitness-class',
    name: 'Fitness Class',
    category: 'health',
    description: 'Group fitness class or wellness session',
    icon: 'Heart',
    template: 'standard',
    fields: ['name', 'email', 'phone', 'experience', 'attendees'],
    defaultCapacity: 30,
    defaultPrice: 29.99,
    features: [
      'Professional instructor',
      'Equipment provided',
      'Workout plan',
      'Health tips',
      'Progress tracking'
    ],
    estimatedDuration: '1 hour',
    targetAudience: 'Fitness enthusiasts, Beginners, Health-conscious individuals'
  },

  // Awards & Recognition
  {
    id: 'awards-ceremony',
    name: 'Awards Ceremony',
    category: 'recognition',
    description: 'Awards ceremony and recognition event',
    icon: 'Award',
    template: 'conference',
    fields: ['name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees'],
    defaultCapacity: 300,
    defaultPrice: 199.99,
    features: [
      'Awards presentation',
      'Dinner service',
      'Entertainment',
      'Networking',
      'Photography',
      'Memorabilia'
    ],
    estimatedDuration: '4 hours',
    targetAudience: 'Professionals, Award winners, Industry leaders'
  }
];

// Template Categories
export const surveyCategories = [
  { id: 'all', name: 'All Templates', icon: 'FileText' },
  { id: 'customer-feedback', name: 'Customer Feedback', icon: 'Star' },
  { id: 'employee', name: 'Employee', icon: 'Users' },
  { id: 'education', name: 'Education', icon: 'GraduationCap' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart' },
  { id: 'events', name: 'Events', icon: 'Calendar' },
  { id: 'market-research', name: 'Market Research', icon: 'Target' },
  { id: 'digital', name: 'Digital', icon: 'Home' }
];

export const eventCategories = [
  { id: 'all', name: 'All Events', icon: 'Calendar' },
  { id: 'business', name: 'Business', icon: 'Building' },
  { id: 'education', name: 'Education', icon: 'GraduationCap' },
  { id: 'social', name: 'Social', icon: 'Heart' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Music' },
  { id: 'travel', name: 'Travel', icon: 'Plane' },
  { id: 'health', name: 'Health & Wellness', icon: 'Heart' },
  { id: 'recognition', name: 'Awards & Recognition', icon: 'Award' }
];

// Helper functions
export const getTemplateById = (id, type = 'survey') => {
  const templates = type === 'survey' ? surveyTemplates : eventTemplates;
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category, type = 'survey') => {
  const templates = type === 'survey' ? surveyTemplates : eventTemplates;
  if (category === 'all') return templates;
  return templates.filter(template => template.category === category);
};

export const searchTemplates = (searchTerm, type = 'survey') => {
  const templates = type === 'survey' ? surveyTemplates : eventTemplates;
  return templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
}; 