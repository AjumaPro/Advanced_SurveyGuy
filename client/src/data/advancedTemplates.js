// Advanced Event Templates with Enhanced Features
export const advancedEventTemplates = [
  // Conference & Summit Templates
  {
    id: 'tech-conference-2024',
    name: 'Tech Conference 2024',
    category: 'conference',
    description: 'Comprehensive tech conference with multiple tracks, workshops, and networking',
    icon: 'Building',
    template: 'conference',
    fields: [
      'name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees',
      'track_preference', 'workshop_selection', 'networking_goals', 'accommodation',
      'special_requirements', 'emergency_contact', 'social_media_handles'
    ],
    defaultCapacity: 500,
    defaultPrice: 299.99,
    features: [
      'Keynote speakers',
      'Multiple track sessions',
      'Hands-on workshops',
      'Networking sessions',
      'Exhibition hall',
      'Lunch & refreshments',
      'Conference materials',
      'Certificate of attendance',
      'Mobile app access',
      'Virtual session recordings'
    ],
    estimatedDuration: '3 days',
    targetAudience: 'Tech professionals, Developers, IT Managers, Entrepreneurs',
    advancedFeatures: {
      trackSelection: [
        'Artificial Intelligence & Machine Learning',
        'Cloud Computing & DevOps',
        'Cybersecurity & Privacy',
        'Web Development & Frontend',
        'Mobile App Development',
        'Data Science & Analytics'
      ],
      workshopOptions: [
        'Hands-on AI Workshop',
        'DevOps Pipeline Setup',
        'Security Best Practices',
        'React Advanced Patterns',
        'Mobile App Testing',
        'Data Visualization'
      ],
      networkingEvents: [
        'Welcome Reception',
        'Speed Networking',
        'Industry Roundtables',
        'Mentor Sessions',
        'Startup Pitch Night'
      ]
    }
  },

  // Wedding & Celebration Templates
  {
    id: 'luxury-wedding-celebration',
    name: 'Luxury Wedding Celebration',
    category: 'wedding',
    description: 'Premium wedding celebration with comprehensive planning and customization',
    icon: 'Heart',
    template: 'wedding',
    fields: [
      'name', 'email', 'phone', 'plus_one', 'dietary', 'attendees',
      'relationship_to_couple', 'dress_code', 'transportation_needed',
      'accommodation_preference', 'special_dietary', 'allergies',
      'photography_consent', 'social_media_sharing', 'gift_preference'
    ],
    defaultCapacity: 200,
    defaultPrice: 0,
    features: [
      'Ceremony & reception',
      'Premium catering service',
      'Live entertainment',
      'Professional photography',
      'Wedding favors',
      'Transportation service',
      'Accommodation packages',
      'Wedding website access',
      'RSVP management',
      'Guest book & memories'
    ],
    estimatedDuration: '8 hours',
    targetAudience: 'Family, Friends, Colleagues, VIP Guests',
    advancedFeatures: {
      accommodationOptions: [
        'Luxury Hotel Package',
        'Boutique Hotel',
        'Airbnb Recommendations',
        'Transportation Included'
      ],
      dietaryOptions: [
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Halal',
        'Kosher',
        'Nut-Free',
        'Custom Requirements'
      ],
      entertainmentChoices: [
        'Live Band',
        'DJ',
        'String Quartet',
        'Jazz Ensemble',
        'Cultural Performances'
      ]
    }
  },

  // Corporate Training & Workshop Templates
  {
    id: 'leadership-development-program',
    name: 'Leadership Development Program',
    category: 'training',
    description: 'Comprehensive leadership training with assessments and follow-up coaching',
    icon: 'GraduationCap',
    template: 'workshop',
    fields: [
      'name', 'email', 'phone', 'company', 'position', 'experience_level',
      'leadership_goals', 'current_challenges', 'team_size', 'industry',
      'preferred_learning_style', 'coaching_preference', 'assessment_consent'
    ],
    defaultCapacity: 25,
    defaultPrice: 1499.99,
    features: [
      'Leadership assessments',
      'Interactive workshops',
      'One-on-one coaching',
      'Team building exercises',
      'Case study analysis',
      'Action planning',
      'Follow-up sessions',
      'Resource materials',
      'Certification',
      'Networking opportunities'
    ],
    estimatedDuration: '5 days',
    targetAudience: 'Managers, Team Leaders, Aspiring Leaders, HR Professionals',
    advancedFeatures: {
      assessmentTypes: [
        'Leadership Style Assessment',
        'Emotional Intelligence Test',
        'Team Dynamics Analysis',
        'Communication Skills Evaluation',
        'Strategic Thinking Assessment'
      ],
      coachingOptions: [
        'Individual Coaching Sessions',
        'Group Coaching Circles',
        'Peer Mentoring',
        'Executive Coaching',
        'Follow-up Check-ins'
      ],
      learningModules: [
        'Strategic Leadership',
        'Team Management',
        'Communication Excellence',
        'Change Management',
        'Conflict Resolution',
        'Performance Coaching'
      ]
    }
  },

  // Virtual Event Templates
  {
    id: 'global-virtual-summit',
    name: 'Global Virtual Summit',
    category: 'virtual',
    description: 'International virtual summit with multi-timezone support and interactive features',
    icon: 'Globe',
    template: 'virtual',
    fields: [
      'name', 'email', 'phone', 'company', 'position', 'timezone',
      'language_preference', 'platform_experience', 'technical_requirements',
      'interaction_preference', 'networking_goals', 'session_preferences'
    ],
    defaultCapacity: 1000,
    defaultPrice: 99.99,
    features: [
      'Multi-timezone sessions',
      'Interactive workshops',
      'Virtual networking rooms',
      'Live Q&A sessions',
      'Resource downloads',
      'Certificate of participation',
      'Mobile app access',
      'Session recordings',
      'Community platform',
      'Follow-up webinars'
    ],
    estimatedDuration: '2 days',
    targetAudience: 'Global professionals, Remote workers, International teams',
    advancedFeatures: {
      timezoneSupport: [
        'EST (Eastern Standard Time)',
        'PST (Pacific Standard Time)',
        'GMT (Greenwich Mean Time)',
        'CET (Central European Time)',
        'JST (Japan Standard Time)',
        'AEST (Australian Eastern Time)'
      ],
      languageOptions: [
        'English',
        'Spanish',
        'French',
        'German',
        'Chinese',
        'Japanese',
        'Arabic'
      ],
      virtualFeatures: [
        'Breakout Rooms',
        'Virtual Whiteboards',
        'Polls & Surveys',
        'Chat Functions',
        'Screen Sharing',
        'Recording Access'
      ]
    }
  },

  // Health & Wellness Event Templates
  {
    id: 'wellness-retreat-2024',
    name: 'Wellness Retreat 2024',
    category: 'wellness',
    description: 'Comprehensive wellness retreat with personalized health programs',
    icon: 'Heart',
    template: 'retreat',
    fields: [
      'name', 'email', 'phone', 'age', 'fitness_level', 'health_goals',
      'dietary_restrictions', 'allergies', 'medical_conditions',
      'preferred_activities', 'accommodation_type', 'wellness_focus'
    ],
    defaultCapacity: 50,
    defaultPrice: 899.99,
    features: [
      'Personalized wellness plans',
      'Yoga & meditation sessions',
      'Nutrition workshops',
      'Fitness assessments',
      'Spa treatments',
      'Mindfulness training',
      'Health consultations',
      'Wellness materials',
      'Follow-up support',
      'Community access'
    ],
    estimatedDuration: 'Weekend',
    targetAudience: 'Wellness enthusiasts, Health-conscious individuals, Stress relief seekers',
    advancedFeatures: {
      wellnessPrograms: [
        'Mindfulness & Meditation',
        'Yoga & Movement',
        'Nutrition & Healthy Eating',
        'Stress Management',
        'Sleep Optimization',
        'Energy Healing'
      ],
      accommodationTypes: [
        'Private Room',
        'Shared Room',
        'Glamping Tent',
        'Wellness Suite',
        'Eco-Friendly Cabin'
      ],
      activityLevels: [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Mixed Level',
        'Custom Program'
      ]
    }
  },

  // Educational Workshop Templates
  {
    id: 'creative-writing-masterclass',
    name: 'Creative Writing Masterclass',
    category: 'education',
    description: 'Intensive creative writing workshop with personalized feedback',
    icon: 'PenTool',
    template: 'workshop',
    fields: [
      'name', 'email', 'phone', 'writing_experience', 'genre_preference',
      'writing_goals', 'sample_work', 'feedback_preference', 'group_size_preference',
      'schedule_preference', 'materials_needed'
    ],
    defaultCapacity: 15,
    defaultPrice: 299.99,
    features: [
      'Personalized feedback',
      'Writing exercises',
      'Genre-specific guidance',
      'Peer review sessions',
      'Publishing insights',
      'Writing materials',
      'Resource library',
      'Community access',
      'Follow-up sessions',
      'Publication opportunities'
    ],
    estimatedDuration: '3 days',
    targetAudience: 'Aspiring writers, Published authors, Creative professionals',
    advancedFeatures: {
      writingGenres: [
        'Fiction',
        'Non-Fiction',
        'Poetry',
        'Screenwriting',
        'Children\'s Literature',
        'Science Fiction',
        'Romance',
        'Mystery/Thriller'
      ],
      feedbackOptions: [
        'One-on-one Sessions',
        'Group Workshops',
        'Written Feedback',
        'Video Reviews',
        'Peer Critiques'
      ],
      workshopModules: [
        'Character Development',
        'Plot Structure',
        'Dialogue Writing',
        'World Building',
        'Editing & Revision',
        'Publishing Process'
      ]
    }
  }
];

// Advanced Survey Templates
export const advancedSurveyTemplates = [
  // Employee Engagement & Culture Survey
  {
    id: 'comprehensive-employee-engagement',
    name: 'Comprehensive Employee Engagement Survey',
    category: 'employee',
    description: 'In-depth employee engagement survey with culture assessment',
    icon: 'Users',
    questions: [
      {
        type: 'rating',
        question: 'How satisfied are you with your current role at the company?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        type: 'rating',
        question: 'How would you rate the company culture and work environment?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        type: 'rating',
        question: 'How likely are you to recommend this company as a great place to work?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
      },
      {
        type: 'multiple-choice',
        question: 'What aspects of the company culture do you value most?',
        required: false,
        options: ['Work-life balance', 'Professional development', 'Team collaboration', 'Innovation', 'Diversity & inclusion', 'Compensation & benefits']
      },
      {
        type: 'text',
        question: 'What suggestions do you have for improving the company culture?',
        required: false
      },
      {
        type: 'rating',
        question: 'How effective is communication within your team?',
        required: true,
        options: ['Very Ineffective', 'Ineffective', 'Neutral', 'Effective', 'Very Effective']
      },
      {
        type: 'rating',
        question: 'How supported do you feel in your professional growth?',
        required: true,
        options: ['Not Supported', 'Somewhat Supported', 'Neutral', 'Well Supported', 'Very Well Supported']
      }
    ],
    estimatedTime: '8-10 minutes',
    targetAudience: 'All employees, HR teams, Management'
  },

  // Customer Experience & Journey Survey
  {
    id: 'customer-journey-mapping',
    name: 'Customer Journey Mapping Survey',
    category: 'customer',
    description: 'Comprehensive customer experience and journey mapping survey',
    icon: 'Map',
    questions: [
      {
        type: 'multiple-choice',
        question: 'How did you first discover our product/service?',
        required: true,
        options: ['Social media', 'Search engine', 'Friend/family recommendation', 'Advertisement', 'Email marketing', 'Influencer', 'Other']
      },
      {
        type: 'rating',
        question: 'How easy was it to get started with our product/service?',
        required: true,
        options: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
      },
      {
        type: 'rating',
        question: 'How satisfied are you with the onboarding process?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        type: 'multiple-choice',
        question: 'What challenges did you face during your customer journey?',
        required: false,
        options: ['Technical issues', 'Poor customer service', 'Confusing interface', 'Slow response times', 'Lack of features', 'Pricing concerns', 'None']
      },
      {
        type: 'rating',
        question: 'How likely are you to continue using our product/service?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
      },
      {
        type: 'text',
        question: 'What would make your experience with us even better?',
        required: false
      },
      {
        type: 'rating',
        question: 'How would you rate the overall customer experience?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      }
    ],
    estimatedTime: '5-7 minutes',
    targetAudience: 'Customers, Product teams, Customer success teams'
  },

  // Market Research & Competitive Analysis
  {
    id: 'competitive-analysis-survey',
    name: 'Competitive Analysis & Market Research Survey',
    category: 'market-research',
    description: 'Comprehensive market research and competitive analysis survey',
    icon: 'TrendingUp',
    questions: [
      {
        type: 'multiple-choice',
        question: 'Which companies do you consider our main competitors?',
        required: true,
        options: ['Competitor A', 'Competitor B', 'Competitor C', 'Competitor D', 'Competitor E', 'Other']
      },
      {
        type: 'rating',
        question: 'How do we compare to our competitors in terms of product quality?',
        required: true,
        options: ['Much Worse', 'Worse', 'About the Same', 'Better', 'Much Better']
      },
      {
        type: 'rating',
        question: 'How do we compare to our competitors in terms of pricing?',
        required: true,
        options: ['Much More Expensive', 'More Expensive', 'About the Same', 'Less Expensive', 'Much Less Expensive']
      },
      {
        type: 'multiple-choice',
        question: 'What factors are most important to you when choosing a product/service?',
        required: false,
        options: ['Price', 'Quality', 'Customer service', 'Features', 'Brand reputation', 'Ease of use', 'Support']
      },
      {
        type: 'text',
        question: 'What do our competitors do better than us?',
        required: false
      },
      {
        type: 'text',
        question: 'What unique value do we provide that our competitors don\'t?',
        required: false
      },
      {
        type: 'rating',
        question: 'How likely are you to switch to a competitor?',
        required: true,
        options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely']
      }
    ],
    estimatedTime: '6-8 minutes',
    targetAudience: 'Customers, Market researchers, Product managers'
  }
];

export default {
  advancedEventTemplates,
  advancedSurveyTemplates
}; 