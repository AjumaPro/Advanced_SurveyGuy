const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { query } = require('../database/connection');

// Advanced Event Templates
const advancedEventTemplates = [
  {
    id: 'tech-conference-2024',
    name: 'Tech Conference 2024',
    category: 'conference',
    description: 'Comprehensive tech conference with multiple tracks, workshops, and networking opportunities',
    icon: 'Building',
    template: 'conference',
    fields: [
      'name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees',
      'track_preference', 'workshop_selection', 'networking_goals', 'accommodation',
      'special_requirements', 'emergency_contact', 'social_media_handles'
    ],
    questions: [
      {
        type: 'text',
        question: 'Full Name',
        required: true,
        description: 'Your complete name as it should appear on your badge'
      },
      {
        type: 'email',
        question: 'Email Address',
        required: true,
        description: 'Primary email for conference communications'
      },
      {
        type: 'text',
        question: 'Phone Number',
        required: true,
        description: 'Contact number for emergency purposes'
      },
      {
        type: 'text',
        question: 'Company/Organization',
        required: true,
        description: 'Your current employer or organization'
      },
      {
        type: 'text',
        question: 'Job Title/Position',
        required: true,
        description: 'Your current role or position'
      },
      {
        type: 'multiple-choice',
        question: 'Which conference track interests you most?',
        required: true,
        options: [
          'Artificial Intelligence & Machine Learning',
          'Cloud Computing & DevOps',
          'Cybersecurity & Privacy',
          'Web Development & Frontend',
          'Mobile App Development',
          'Data Science & Analytics'
        ],
        description: 'Select your primary area of interest'
      },
      {
        type: 'multiple-choice',
        question: 'Which workshops would you like to attend?',
        required: false,
        options: [
          'Hands-on AI Workshop',
          'DevOps Pipeline Setup',
          'Security Best Practices',
          'React Advanced Patterns',
          'Mobile App Testing',
          'Data Visualization'
        ],
        description: 'Select all workshops you\'re interested in'
      },
      {
        type: 'multiple-choice',
        question: 'What are your networking goals?',
        required: false,
        options: [
          'Find job opportunities',
          'Connect with industry experts',
          'Learn about new technologies',
          'Share knowledge and experiences',
          'Build professional relationships',
          'Explore potential collaborations'
        ],
        description: 'Select all that apply'
      },
      {
        type: 'multiple-choice',
        question: 'Do you have any dietary restrictions?',
        required: false,
        options: [
          'None',
          'Vegetarian',
          'Vegan',
          'Gluten-Free',
          'Dairy-Free',
          'Nut-Free',
          'Halal',
          'Kosher',
          'Other'
        ],
        description: 'Help us accommodate your dietary needs'
      },
      {
        type: 'text',
        question: 'Any special requirements or accessibility needs?',
        required: false,
        description: 'Please let us know if you need any accommodations'
      }
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
  {
    id: 'luxury-wedding-celebration',
    name: 'Luxury Wedding Celebration',
    category: 'wedding',
    description: 'Premium wedding celebration with comprehensive planning and customization options',
    icon: 'Heart',
    template: 'wedding',
    fields: [
      'name', 'email', 'phone', 'plus_one', 'dietary', 'attendees',
      'relationship_to_couple', 'dress_code', 'transportation_needed',
      'accommodation_preference', 'special_dietary', 'allergies',
      'photography_consent', 'social_media_sharing', 'gift_preference'
    ],
    questions: [
      {
        type: 'text',
        question: 'Full Name',
        required: true,
        description: 'Your complete name as it should appear on the guest list'
      },
      {
        type: 'email',
        question: 'Email Address',
        required: true,
        description: 'Email for wedding updates and communications'
      },
      {
        type: 'text',
        question: 'Phone Number',
        required: true,
        description: 'Contact number for wedding day coordination'
      },
      {
        type: 'multiple-choice',
        question: 'Will you be bringing a plus one?',
        required: true,
        options: ['Yes', 'No'],
        description: 'Please indicate if you\'ll have a guest'
      },
      {
        type: 'text',
        question: 'Plus One Name (if applicable)',
        required: false,
        description: 'Full name of your guest'
      },
      {
        type: 'multiple-choice',
        question: 'What is your relationship to the couple?',
        required: true,
        options: [
          'Family - Bride\'s side',
          'Family - Groom\'s side',
          'Friend of Bride',
          'Friend of Groom',
          'Friend of Both',
          'Colleague',
          'Other'
        ],
        description: 'Help us with seating arrangements'
      },
      {
        type: 'multiple-choice',
        question: 'Do you have any dietary restrictions?',
        required: false,
        options: [
          'None',
          'Vegetarian',
          'Vegan',
          'Gluten-Free',
          'Dairy-Free',
          'Nut-Free',
          'Halal',
          'Kosher',
          'Other'
        ],
        description: 'Help us accommodate your dietary needs'
      },
      {
        type: 'text',
        question: 'Any food allergies or special dietary requirements?',
        required: false,
        description: 'Please specify any allergies or special needs'
      },
      {
        type: 'multiple-choice',
        question: 'Will you need transportation to/from the venue?',
        required: true,
        options: ['Yes', 'No'],
        description: 'Transportation service availability'
      },
      {
        type: 'multiple-choice',
        question: 'Do you consent to being photographed?',
        required: true,
        options: ['Yes', 'No'],
        description: 'Photography consent for wedding photos'
      },
      {
        type: 'text',
        question: 'Any special requirements or accessibility needs?',
        required: false,
        description: 'Please let us know if you need any accommodations'
      }
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
    questions: [
      {
        type: 'text',
        question: 'Full Name',
        required: true,
        description: 'Your complete name for program registration'
      },
      {
        type: 'email',
        question: 'Email Address',
        required: true,
        description: 'Primary email for program communications'
      },
      {
        type: 'text',
        question: 'Phone Number',
        required: true,
        description: 'Contact number for program coordination'
      },
      {
        type: 'text',
        question: 'Company/Organization',
        required: true,
        description: 'Your current employer or organization'
      },
      {
        type: 'text',
        question: 'Job Title/Position',
        required: true,
        description: 'Your current role or position'
      },
      {
        type: 'multiple-choice',
        question: 'What is your current leadership experience level?',
        required: true,
        options: [
          'New to leadership',
          '1-2 years experience',
          '3-5 years experience',
          '5-10 years experience',
          '10+ years experience'
        ],
        description: 'Help us tailor the program to your experience'
      },
      {
        type: 'multiple-choice',
        question: 'What are your primary leadership goals?',
        required: false,
        options: [
          'Develop team management skills',
          'Improve communication',
          'Strategic thinking',
          'Conflict resolution',
          'Change management',
          'Performance coaching',
          'Building high-performing teams',
          'Other'
        ],
        description: 'Select all that apply'
      },
      {
        type: 'text',
        question: 'What are your current leadership challenges?',
        required: false,
        description: 'Describe specific challenges you\'re facing'
      },
      {
        type: 'multiple-choice',
        question: 'What is the size of your team?',
        required: true,
        options: [
          '1-5 people',
          '6-10 people',
          '11-25 people',
          '26-50 people',
          '50+ people'
        ],
        description: 'Team size for context'
      },
      {
        type: 'multiple-choice',
        question: 'What is your preferred learning style?',
        required: false,
        options: [
          'Interactive workshops',
          'Case studies',
          'One-on-one coaching',
          'Group discussions',
          'Self-paced learning',
          'Mixed approach'
        ],
        description: 'Help us customize your learning experience'
      },
      {
        type: 'multiple-choice',
        question: 'Do you consent to leadership assessments?',
        required: true,
        options: ['Yes', 'No'],
        description: 'Assessment consent for personalized development'
      }
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
    questions: [
      {
        type: 'text',
        question: 'Full Name',
        required: true,
        description: 'Your complete name for summit registration'
      },
      {
        type: 'email',
        question: 'Email Address',
        required: true,
        description: 'Primary email for summit communications'
      },
      {
        type: 'text',
        question: 'Phone Number',
        required: false,
        description: 'Contact number (optional)'
      },
      {
        type: 'text',
        question: 'Company/Organization',
        required: true,
        description: 'Your current employer or organization'
      },
      {
        type: 'text',
        question: 'Job Title/Position',
        required: true,
        description: 'Your current role or position'
      },
      {
        type: 'multiple-choice',
        question: 'What is your timezone?',
        required: true,
        options: [
          'EST (Eastern Standard Time)',
          'PST (Pacific Standard Time)',
          'GMT (Greenwich Mean Time)',
          'CET (Central European Time)',
          'JST (Japan Standard Time)',
          'AEST (Australian Eastern Time)',
          'Other'
        ],
        description: 'Help us schedule sessions at convenient times'
      },
      {
        type: 'multiple-choice',
        question: 'What is your preferred language for sessions?',
        required: true,
        options: [
          'English',
          'Spanish',
          'French',
          'German',
          'Chinese',
          'Japanese',
          'Arabic'
        ],
        description: 'Language preference for summit content'
      },
      {
        type: 'multiple-choice',
        question: 'What is your experience with virtual platforms?',
        required: true,
        options: [
          'Beginner',
          'Intermediate',
          'Advanced',
          'Expert'
        ],
        description: 'Help us provide appropriate technical support'
      },
      {
        type: 'multiple-choice',
        question: 'What are your networking goals?',
        required: false,
        options: [
          'Connect with global professionals',
          'Learn about international markets',
          'Share knowledge across cultures',
          'Build international partnerships',
          'Explore career opportunities',
          'Other'
        ],
        description: 'Select all that apply'
      },
      {
        type: 'text',
        question: 'Any technical requirements or accessibility needs?',
        required: false,
        description: 'Please let us know if you need any accommodations'
      }
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
    questions: [
      {
        type: 'text',
        question: 'Full Name',
        required: true,
        description: 'Your complete name for retreat registration'
      },
      {
        type: 'email',
        question: 'Email Address',
        required: true,
        description: 'Primary email for retreat communications'
      },
      {
        type: 'text',
        question: 'Phone Number',
        required: true,
        description: 'Contact number for retreat coordination'
      },
      {
        type: 'number',
        question: 'Age',
        required: true,
        description: 'Your age for program customization'
      },
      {
        type: 'multiple-choice',
        question: 'What is your current fitness level?',
        required: true,
        options: [
          'Beginner',
          'Intermediate',
          'Advanced',
          'Mixed Level'
        ],
        description: 'Help us customize your wellness program'
      },
      {
        type: 'multiple-choice',
        question: 'What are your primary health goals?',
        required: false,
        options: [
          'Stress reduction',
          'Weight management',
          'Fitness improvement',
          'Mental wellness',
          'Better sleep',
          'Nutrition education',
          'Mindfulness practice',
          'Other'
        ],
        description: 'Select all that apply'
      },
      {
        type: 'multiple-choice',
        question: 'Do you have any dietary restrictions?',
        required: false,
        options: [
          'None',
          'Vegetarian',
          'Vegan',
          'Gluten-Free',
          'Dairy-Free',
          'Nut-Free',
          'Halal',
          'Kosher',
          'Other'
        ],
        description: 'Help us accommodate your dietary needs'
      },
      {
        type: 'text',
        question: 'Any food allergies or medical conditions?',
        required: false,
        description: 'Please specify any allergies or conditions'
      },
      {
        type: 'multiple-choice',
        question: 'What wellness activities interest you most?',
        required: false,
        options: [
          'Yoga & meditation',
          'Fitness classes',
          'Nutrition workshops',
          'Spa treatments',
          'Mindfulness training',
          'Outdoor activities',
          'Wellness consultations',
          'Other'
        ],
        description: 'Select all that apply'
      },
      {
        type: 'multiple-choice',
        question: 'What type of accommodation do you prefer?',
        required: true,
        options: [
          'Private Room',
          'Shared Room',
          'Glamping Tent',
          'Wellness Suite',
          'Eco-Friendly Cabin'
        ],
        description: 'Accommodation preference for your stay'
      },
      {
        type: 'text',
        question: 'Any special requirements or accessibility needs?',
        required: false,
        description: 'Please let us know if you need any accommodations'
      }
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
  }
];

// Advanced Survey Templates
const advancedSurveyTemplates = [
  {
    id: 'comprehensive-employee-engagement',
    name: 'Comprehensive Employee Engagement Survey',
    category: 'employee',
    description: 'In-depth employee engagement survey with culture assessment and organizational health evaluation',
    icon: 'Users',
    questions: [
      {
        type: 'rating',
        question: 'How satisfied are you with your current role at the company?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate your overall job satisfaction'
      },
      {
        type: 'rating',
        question: 'How would you rate the company culture and work environment?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the overall organizational culture'
      },
      {
        type: 'rating',
        question: 'How likely are you to recommend this company as a great place to work?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Employee Net Promoter Score assessment'
      },
      {
        type: 'multiple-choice',
        question: 'What aspects of the company culture do you value most?',
        required: false,
        options: ['Work-life balance', 'Professional development', 'Team collaboration', 'Innovation', 'Diversity & inclusion', 'Compensation & benefits', 'Leadership', 'Company mission'],
        description: 'Select all that apply'
      },
      {
        type: 'text',
        question: 'What suggestions do you have for improving the company culture?',
        required: false,
        description: 'Share your ideas for cultural enhancement'
      },
      {
        type: 'rating',
        question: 'How effective is communication within your team?',
        required: true,
        options: ['Very Ineffective', 'Ineffective', 'Neutral', 'Effective', 'Very Effective'],
        description: 'Rate team communication effectiveness'
      },
      {
        type: 'rating',
        question: 'How supported do you feel in your professional growth?',
        required: true,
        options: ['Not Supported', 'Somewhat Supported', 'Neutral', 'Well Supported', 'Very Well Supported'],
        description: 'Rate organizational support for career development'
      },
      {
        type: 'rating',
        question: 'How would you rate your relationship with your manager?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate your supervisor relationship quality'
      },
      {
        type: 'multiple-choice',
        question: 'What motivates you to come to work each day?',
        required: false,
        options: ['Meaningful work', 'Team collaboration', 'Career growth', 'Compensation', 'Company mission', 'Work-life balance', 'Recognition', 'Other'],
        description: 'Select all that apply'
      },
      {
        type: 'rating',
        question: 'How likely are you to stay with the company for the next 2 years?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Retention likelihood assessment'
      }
    ],
    estimatedTime: '10-12 minutes',
    responseCount: 0,
    targetAudience: 'All employees, HR teams, Management, Leadership',
    useCases: ['Employee engagement measurement', 'Culture assessment', 'Retention analysis', 'Organizational health evaluation'],
    insights: ['Engagement drivers', 'Retention risk factors', 'Cultural strengths', 'Improvement priorities']
  },
  {
    id: 'customer-journey-mapping',
    name: 'Customer Journey Mapping Survey',
    category: 'customer',
    description: 'Comprehensive customer experience and journey mapping survey to understand touchpoints and pain points',
    icon: 'Map',
    questions: [
      {
        type: 'multiple-choice',
        question: 'How did you first discover our product/service?',
        required: true,
        options: ['Social media', 'Search engine', 'Friend/family recommendation', 'Advertisement', 'Email marketing', 'Influencer', 'Trade show', 'Other'],
        description: 'Initial discovery channel'
      },
      {
        type: 'rating',
        question: 'How easy was it to get started with our product/service?',
        required: true,
        options: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy'],
        description: 'Rate the onboarding experience'
      },
      {
        type: 'rating',
        question: 'How satisfied are you with the onboarding process?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate onboarding satisfaction'
      },
      {
        type: 'multiple-choice',
        question: 'What challenges did you face during your customer journey?',
        required: false,
        options: ['Technical issues', 'Poor customer service', 'Confusing interface', 'Slow response times', 'Lack of features', 'Pricing concerns', 'Documentation gaps', 'None'],
        description: 'Select all that apply'
      },
      {
        type: 'rating',
        question: 'How likely are you to continue using our product/service?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Future usage likelihood'
      },
      {
        type: 'text',
        question: 'What would make your experience with us even better?',
        required: false,
        description: 'Suggestions for experience improvement'
      },
      {
        type: 'rating',
        question: 'How would you rate the overall customer experience?',
        required: true,
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Overall experience rating'
      },
      {
        type: 'multiple-choice',
        question: 'Which touchpoints were most important in your journey?',
        required: false,
        options: ['Website', 'Mobile app', 'Customer service', 'Documentation', 'Community forums', 'Email communications', 'Social media', 'Other'],
        description: 'Select all that apply'
      },
      {
        type: 'rating',
        question: 'How well did we meet your expectations throughout your journey?',
        required: true,
        options: ['Far Below Expectations', 'Below Expectations', 'Met Expectations', 'Exceeded Expectations', 'Far Exceeded Expectations'],
        description: 'Expectation fulfillment assessment'
      },
      {
        type: 'text',
        question: 'Describe your ideal customer experience with our product/service',
        required: false,
        description: 'Share your vision for the perfect experience'
      }
    ],
    estimatedTime: '8-10 minutes',
    responseCount: 0,
    targetAudience: 'Existing customers, Product users, UX teams, Marketing teams',
    useCases: ['Customer journey mapping', 'Experience optimization', 'Touchpoint analysis', 'Pain point identification'],
    insights: ['Journey touchpoints', 'Experience gaps', 'Improvement opportunities', 'Customer expectations']
  },
  {
    id: 'market-research-comprehensive',
    name: 'Comprehensive Market Research Survey',
    category: 'market-research',
    description: 'In-depth market research survey to understand customer needs, preferences, and market opportunities',
    icon: 'Target',
    questions: [
      {
        type: 'multiple-choice',
        question: 'What is your primary role in purchasing decisions?',
        required: true,
        options: ['Primary decision maker', 'Influencer', 'User', 'Budget holder', 'Technical evaluator', 'Other'],
        description: 'Your role in the buying process'
      },
      {
        type: 'rating',
        question: 'How important is this product/service category to your business?',
        required: true,
        options: ['Not Important', 'Somewhat Important', 'Important', 'Very Important', 'Critical'],
        description: 'Category importance assessment'
      },
      {
        type: 'multiple-choice',
        question: 'What are your primary needs in this product/service category?',
        required: false,
        options: ['Cost efficiency', 'Performance', 'Ease of use', 'Integration capabilities', 'Support quality', 'Innovation', 'Reliability', 'Other'],
        description: 'Select all that apply'
      },
      {
        type: 'rating',
        question: 'How satisfied are you with current solutions in the market?',
        required: true,
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Current market satisfaction'
      },
      {
        type: 'text',
        question: 'What problems do you face with current solutions?',
        required: false,
        description: 'Describe current pain points'
      },
      {
        type: 'multiple-choice',
        question: 'What features are most important to you?',
        required: false,
        options: ['Automation', 'Analytics', 'Mobile access', 'API integration', 'Customization', 'Security', 'Scalability', 'Other'],
        description: 'Select all that apply'
      },
      {
        type: 'rating',
        question: 'How much would you be willing to pay for an ideal solution?',
        required: true,
        options: ['Under $100', '$100-$500', '$500-$1000', '$1000-$5000', 'Over $5000'],
        description: 'Price sensitivity assessment'
      },
      {
        type: 'multiple-choice',
        question: 'How do you typically research and evaluate new products/services?',
        required: false,
        options: ['Online reviews', 'Industry reports', 'Peer recommendations', 'Trade shows', 'Vendor demos', 'Trial versions', 'Other'],
        description: 'Select all that apply'
      },
      {
        type: 'rating',
        question: 'How likely are you to switch to a new solution in the next 12 months?',
        required: true,
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Market opportunity assessment'
      },
      {
        type: 'text',
        question: 'What would be your ideal solution in this category?',
        required: false,
        description: 'Describe your perfect product/service'
      }
    ],
    estimatedTime: '10-12 minutes',
    responseCount: 0,
    targetAudience: 'Potential customers, Market researchers, Product teams, Business analysts',
    useCases: ['Market opportunity assessment', 'Product development', 'Competitive analysis', 'Customer needs identification'],
    insights: ['Market gaps', 'Customer needs', 'Price sensitivity', 'Purchase behavior']
  }
];

// Original survey templates
const surveyTemplates = [
  // Customer Feedback Templates
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction Survey',
    category: 'customer-feedback',
    description: 'Comprehensive customer satisfaction survey to measure overall experience and identify improvement opportunities',
    icon: 'Star',
    questions: [
      { 
        type: 'rating', 
        question: 'How satisfied are you with our product/service overall?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Please rate your overall satisfaction with our product or service'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the quality of our product/service?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the quality and reliability of our offering'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to recommend us to friends or colleagues?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'This helps us understand our Net Promoter Score'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of our product/service do you value most?', 
        required: false, 
        options: ['Quality', 'Price', 'Customer Service', 'Features', 'Ease of Use', 'Reliability', 'Innovation'],
        description: 'Select all that apply'
      },
      { 
        type: 'text', 
        question: 'What do you like most about our product/service?', 
        required: false,
        description: 'Please share specific features or aspects you appreciate'
      },
      { 
        type: 'text', 
        question: 'What could we improve to better meet your needs?', 
        required: false,
        description: 'Your feedback helps us enhance our offerings'
      },
      { 
        type: 'multiple-choice', 
        question: 'How did you first hear about us?', 
        required: false, 
        options: ['Social Media', 'Friend/Family Recommendation', 'Advertisement', 'Search Engine', 'Email Marketing', 'Influencer', 'Trade Show', 'Other'],
        description: 'This helps us understand our marketing effectiveness'
      },
      { 
        type: 'rating', 
        question: 'How would you rate our customer service experience?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate your experience with our support team'
      }
    ],
    estimatedTime: '5-7 minutes',
    responseCount: 0,
    targetAudience: 'Existing customers, Product users, Service recipients',
    useCases: ['Product feedback', 'Service evaluation', 'Customer experience improvement', 'NPS measurement'],
    insights: ['Customer satisfaction trends', 'Improvement opportunities', 'Brand perception', 'Service quality assessment']
  },
  {
    id: 'product-feedback',
    name: 'Product Feedback Survey',
    category: 'customer-feedback',
    description: 'Detailed product feedback survey to understand user experience and feature preferences',
    icon: 'ShoppingCart',
    questions: [
      { 
        type: 'rating', 
        question: 'How easy is our product to use and navigate?', 
        required: true, 
        options: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy'],
        description: 'Rate the user-friendliness of our product'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the overall product quality?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the quality and craftsmanship'
      },
      { 
        type: 'rating', 
        question: 'How well does our product meet your needs?', 
        required: true, 
        options: ['Not at all', 'Poorly', 'Somewhat', 'Well', 'Very Well'],
        description: 'Does the product solve your intended problem?'
      },
      { 
        type: 'multiple-choice', 
        question: 'Which features do you use most frequently?', 
        required: false, 
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E', 'All features equally'],
        description: 'Select all that apply'
      },
      { 
        type: 'multiple-choice', 
        question: 'Which features would you like to see improved?', 
        required: false, 
        options: ['User Interface', 'Performance', 'Mobile Experience', 'Integration Options', 'Customization', 'Documentation', 'None'],
        description: 'Select areas for improvement'
      },
      { 
        type: 'text', 
        question: 'What new features would you like to see in future updates?', 
        required: false,
        description: 'Share your ideas for new functionality'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the value for money?', 
        required: true, 
        options: ['Poor Value', 'Fair Value', 'Good Value', 'Very Good Value', 'Excellent Value'],
        description: 'Rate the cost-benefit ratio'
      },
      { 
        type: 'text', 
        question: 'What challenges do you face when using our product?', 
        required: false,
        description: 'Help us identify pain points'
      },
      { 
        type: 'multiple-choice', 
        question: 'How often do you use our product?', 
        required: true, 
        options: ['Daily', 'Weekly', 'Monthly', 'Occasionally', 'Rarely'],
        description: 'Usage frequency helps us understand engagement'
      }
    ],
    estimatedTime: '6-8 minutes',
    responseCount: 0,
    targetAudience: 'Product users, Beta testers, Early adopters',
    useCases: ['Product development', 'Feature prioritization', 'User experience improvement', 'Product roadmap planning'],
    insights: ['Feature usage patterns', 'User pain points', 'Improvement priorities', 'User engagement levels']
  },
  {
    id: 'service-quality',
    name: 'Service Quality Assessment',
    category: 'customer-feedback',
    description: 'Comprehensive service quality evaluation to measure customer support effectiveness',
    icon: 'Star',
    questions: [
      { 
        type: 'rating', 
        question: 'How would you rate the overall quality of our customer service?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate your overall service experience'
      },
      { 
        type: 'rating', 
        question: 'How quickly were your issues or questions resolved?', 
        required: true, 
        options: ['Very Slow', 'Slow', 'Average', 'Fast', 'Very Fast'],
        description: 'Response time evaluation'
      },
      { 
        type: 'rating', 
        question: 'How knowledgeable and helpful was our support team?', 
        required: true, 
        options: ['Not Helpful', 'Somewhat Helpful', 'Helpful', 'Very Helpful', 'Extremely Helpful'],
        description: 'Rate the expertise and assistance provided'
      },
      { 
        type: 'multiple-choice', 
        question: 'How did you contact our support team?', 
        required: false, 
        options: ['Phone', 'Email', 'Live Chat', 'Social Media', 'Help Center', 'In-Person', 'Other'],
        description: 'Select your preferred contact method'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with the resolution of your issue?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Were your problems fully resolved?'
      },
      { 
        type: 'text', 
        question: 'Describe your recent experience with our support team', 
        required: false,
        description: 'Share details about your interaction'
      },
      { 
        type: 'multiple-choice', 
        question: 'What type of issue did you contact us about?', 
        required: false, 
        options: ['Technical Problem', 'Billing Question', 'Product Information', 'Feature Request', 'Complaint', 'General Inquiry', 'Other'],
        description: 'Help us categorize support requests'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to contact our support again if needed?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Future support engagement likelihood'
      },
      { 
        type: 'text', 
        question: 'What could we improve in our customer service?', 
        required: false,
        description: 'Suggestions for service enhancement'
      }
    ],
    estimatedTime: '4-6 minutes',
    responseCount: 0,
    targetAudience: 'Customers who contacted support, Service users',
    useCases: ['Service quality improvement', 'Support team evaluation', 'Customer experience enhancement', 'Service training needs'],
    insights: ['Support effectiveness', 'Response time analysis', 'Customer satisfaction trends', 'Improvement opportunities']
  },

  // Employee Survey Templates
  {
    id: 'employee-satisfaction',
    name: 'Employee Satisfaction Survey',
    category: 'employee',
    description: 'Comprehensive employee satisfaction and engagement survey to understand workplace satisfaction',
    icon: 'Users',
    questions: [
      { 
        type: 'rating', 
        question: 'How satisfied are you with your current role and responsibilities?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate your satisfaction with your job'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the overall work environment and culture?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the workplace atmosphere'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with your compensation and benefits?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate your satisfaction with pay and benefits'
      },
      { 
        type: 'rating', 
        question: 'How would you rate your relationship with your manager?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate your supervisor relationship'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of your job do you find most rewarding?', 
        required: false, 
        options: ['Work-Life Balance', 'Professional Growth', 'Team Collaboration', 'Compensation', 'Job Security', 'Company Mission', 'Work Variety', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'text', 
        question: 'What would improve your work experience and satisfaction?', 
        required: false,
        description: 'Share suggestions for workplace improvement'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to recommend this company as a great place to work?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Employee Net Promoter Score'
      },
      { 
        type: 'multiple-choice', 
        question: 'How long have you been with the company?', 
        required: true, 
        options: ['Less than 1 year', '1-2 years', '3-5 years', '6-10 years', 'More than 10 years'],
        description: 'Tenure information'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with opportunities for career advancement?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate career growth opportunities'
      }
    ],
    estimatedTime: '7-10 minutes',
    responseCount: 0,
    targetAudience: 'All employees, HR teams, Management',
    useCases: ['Employee engagement measurement', 'Workplace improvement', 'Retention analysis', 'Culture assessment'],
    insights: ['Employee satisfaction trends', 'Engagement drivers', 'Retention risk factors', 'Improvement priorities']
  },
  {
    id: 'workplace-culture',
    name: 'Workplace Culture Survey',
    category: 'employee',
    description: 'In-depth workplace culture assessment to understand organizational values and team dynamics',
    icon: 'Users',
    questions: [
      { 
        type: 'rating', 
        question: 'How would you describe the overall company culture?', 
        required: true, 
        options: ['Toxic', 'Poor', 'Average', 'Good', 'Excellent'],
        description: 'Rate the overall organizational culture'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of our culture do you value most?', 
        required: false, 
        options: ['Work-life balance', 'Professional growth', 'Team collaboration', 'Innovation', 'Diversity & Inclusion', 'Transparency', 'Flexibility', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How well do teams collaborate and work together?', 
        required: true, 
        options: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
        description: 'Rate cross-team collaboration'
      },
      { 
        type: 'rating', 
        question: 'How would you rate communication within the organization?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate internal communication effectiveness'
      },
      { 
        type: 'multiple-choice', 
        question: 'What cultural improvements would you like to see?', 
        required: false, 
        options: ['Better Communication', 'More Recognition', 'Increased Flexibility', 'Enhanced Diversity', 'Improved Work-Life Balance', 'More Innovation', 'Better Leadership', 'Other'],
        description: 'Select areas for cultural improvement'
      },
      { 
        type: 'text', 
        question: 'How can we improve our workplace culture?', 
        required: false,
        description: 'Share specific suggestions for cultural enhancement'
      },
      { 
        type: 'rating', 
        question: 'How well does the company live up to its stated values?', 
        required: true, 
        options: ['Not at all', 'Poorly', 'Somewhat', 'Well', 'Very Well'],
        description: 'Rate alignment with company values'
      },
      { 
        type: 'multiple-choice', 
        question: 'How do you prefer to receive recognition for your work?', 
        required: false, 
        options: ['Public Recognition', 'Private Feedback', 'Monetary Rewards', 'Professional Development', 'Flexible Benefits', 'Other'],
        description: 'Select your preferred recognition methods'
      },
      { 
        type: 'rating', 
        question: 'How comfortable do you feel expressing your opinions at work?', 
        required: true, 
        options: ['Very Uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very Comfortable'],
        description: 'Rate psychological safety'
      }
    ],
    estimatedTime: '8-12 minutes',
    responseCount: 0,
    targetAudience: 'All employees, HR teams, Leadership',
    useCases: ['Culture assessment', 'Diversity & inclusion measurement', 'Team dynamics analysis', 'Organizational development'],
    insights: ['Cultural strengths', 'Improvement areas', 'Employee sentiment', 'Organizational health']
  },
  {
    id: 'performance-review',
    name: 'Performance Review Survey',
    category: 'employee',
    description: 'Comprehensive performance evaluation and feedback collection for professional development',
    icon: 'Users',
    questions: [
      { 
        type: 'rating', 
        question: 'How would you rate your overall performance this year?', 
        required: true, 
        options: ['Below Expectations', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding'],
        description: 'Self-assessment of your performance'
      },
      { 
        type: 'rating', 
        question: 'How well did you achieve your goals and objectives?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Goal achievement assessment'
      },
      { 
        type: 'text', 
        question: 'What are your key achievements and accomplishments this year?', 
        required: false,
        description: 'List your major successes and contributions'
      },
      { 
        type: 'text', 
        question: 'What challenges did you face and how did you overcome them?', 
        required: false,
        description: 'Share obstacles and your solutions'
      },
      { 
        type: 'multiple-choice', 
        question: 'Which areas would you like to develop or improve?', 
        required: false, 
        options: ['Technical Skills', 'Leadership Skills', 'Communication', 'Time Management', 'Problem Solving', 'Team Collaboration', 'Industry Knowledge', 'Other'],
        description: 'Select development priorities'
      },
      { 
        type: 'text', 
        question: 'What are your professional goals for the next year?', 
        required: false,
        description: 'Share your career and development objectives'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with the support and resources provided for your role?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate organizational support'
      },
      { 
        type: 'multiple-choice', 
        question: 'What type of training or development would be most valuable?', 
        required: false, 
        options: ['Technical Training', 'Leadership Development', 'Soft Skills', 'Industry Certifications', 'Mentoring', 'Conferences', 'Online Courses', 'Other'],
        description: 'Select preferred development methods'
      },
      { 
        type: 'text', 
        question: 'How can the organization better support your professional growth?', 
        required: false,
        description: 'Suggestions for organizational support'
      }
    ],
    estimatedTime: '10-15 minutes',
    responseCount: 0,
    targetAudience: 'Employees, Managers, HR teams',
    useCases: ['Performance evaluation', 'Professional development planning', 'Career pathing', 'Training needs assessment'],
    insights: ['Performance trends', 'Development needs', 'Career aspirations', 'Support requirements']
  },
  {
    id: 'exit-interview',
    name: 'Exit Interview Survey',
    category: 'employee',
    description: 'Comprehensive exit interview to understand reasons for departure and gather feedback for improvement',
    icon: 'Building',
    questions: [
      { 
        type: 'multiple-choice', 
        question: 'What is your primary reason for leaving the company?', 
        required: true, 
        options: ['Better opportunity', 'Career growth', 'Work-life balance', 'Compensation', 'Management issues', 'Company culture', 'Relocation', 'Personal reasons', 'Other'],
        description: 'Select the main factor influencing your decision'
      },
      { 
        type: 'rating', 
        question: 'How would you rate your overall experience working here?', 
        required: true, 
        options: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
        description: 'Rate your overall employment experience'
      },
      { 
        type: 'text', 
        question: 'What did you enjoy most about working here?', 
        required: false,
        description: 'Share positive aspects of your experience'
      },
      { 
        type: 'text', 
        question: 'What could we improve to make this a better workplace?', 
        required: false,
        description: 'Suggestions for workplace improvement'
      },
      { 
        type: 'rating', 
        question: 'How would you rate your relationship with your manager?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate your supervisor relationship'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of the job met your expectations?', 
        required: false, 
        options: ['Role responsibilities', 'Compensation', 'Benefits', 'Work environment', 'Career growth', 'Company culture', 'Work-life balance', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of the job did not meet your expectations?', 
        required: false, 
        options: ['Role responsibilities', 'Compensation', 'Benefits', 'Work environment', 'Career growth', 'Company culture', 'Work-life balance', 'Management', 'Other'],
        description: 'Select areas that fell short'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to recommend this company to others?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Would you recommend us to friends or colleagues?'
      },
      { 
        type: 'text', 
        question: 'Is there anything else you would like to share about your experience?', 
        required: false,
        description: 'Additional feedback or comments'
      }
    ],
    estimatedTime: '8-12 minutes',
    responseCount: 0,
    targetAudience: 'Departing employees, HR teams, Management',
    useCases: ['Retention analysis', 'Workplace improvement', 'Culture assessment', 'Management feedback'],
    insights: ['Departure reasons', 'Retention risk factors', 'Improvement opportunities', 'Employee satisfaction trends']
  },
  {
    id: 'course-evaluation',
    name: 'Course Evaluation Survey',
    category: 'academic',
    description: 'Comprehensive course evaluation to assess learning outcomes and teaching effectiveness',
    icon: 'GraduationCap',
    questions: [
      { 
        type: 'rating', 
        question: 'How would you rate the overall quality of this course?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the overall course quality'
      },
      { 
        type: 'rating', 
        question: 'How effective was the instructor in delivering the course content?', 
        required: true, 
        options: ['Very Ineffective', 'Ineffective', 'Average', 'Effective', 'Very Effective'],
        description: 'Rate the instructor\'s teaching effectiveness'
      },
      { 
        type: 'rating', 
        question: 'How well did the course materials support your learning?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the quality and relevance of course materials'
      },
      { 
        type: 'multiple-choice', 
        question: 'Which teaching methods were most effective for your learning?', 
        required: false, 
        options: ['Lectures', 'Group Discussions', 'Hands-on Activities', 'Case Studies', 'Online Resources', 'Guest Speakers', 'Projects', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'text', 
        question: 'What did you learn from this course?', 
        required: false,
        description: 'Share key takeaways and learning outcomes'
      },
      { 
        type: 'text', 
        question: 'How could this course be improved?', 
        required: false,
        description: 'Suggestions for course enhancement'
      },
      { 
        type: 'rating', 
        question: 'How well did the course meet your learning objectives?', 
        required: true, 
        options: ['Not at all', 'Poorly', 'Somewhat', 'Well', 'Very Well'],
        description: 'Did the course achieve your learning goals?'
      },
      { 
        type: 'multiple-choice', 
        question: 'What was your preferred learning format?', 
        required: false, 
        options: ['In-person', 'Online', 'Hybrid', 'Self-paced', 'Group-based', 'Individual'],
        description: 'Select your preferred learning method'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to recommend this course to others?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Course recommendation likelihood'
      }
    ],
    estimatedTime: '6-8 minutes',
    responseCount: 0,
    targetAudience: 'Students, Course participants, Educational institutions',
    useCases: ['Course evaluation', 'Teaching effectiveness assessment', 'Curriculum improvement', 'Student satisfaction measurement'],
    insights: ['Learning outcomes', 'Teaching effectiveness', 'Course improvement areas', 'Student satisfaction trends']
  },
  {
    id: 'student-satisfaction',
    name: 'Student Satisfaction Survey',
    category: 'academic',
    description: 'Comprehensive student satisfaction survey to evaluate educational experience and institutional support',
    icon: 'GraduationCap',
    questions: [
      { 
        type: 'rating', 
        question: 'How satisfied are you with your overall educational experience?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate your overall satisfaction with your education'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the quality of instruction and teaching?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the quality of teaching and instruction'
      },
      { 
        type: 'multiple-choice', 
        question: 'Which campus services do you use most frequently?', 
        required: false, 
        options: ['Library', 'Career Services', 'Student Health', 'Counseling', 'Academic Advising', 'Financial Aid', 'IT Support', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with campus facilities and resources?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate campus facilities and resources'
      },
      { 
        type: 'text', 
        question: 'What additional services would you like to see offered?', 
        required: false,
        description: 'Suggestions for new services or improvements'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to recommend this institution to others?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Institution recommendation likelihood'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of your education are most valuable?', 
        required: false, 
        options: ['Academic Quality', 'Career Preparation', 'Personal Growth', 'Networking', 'Research Opportunities', 'Extracurricular Activities', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How well does the institution support student success?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate institutional support for student success'
      },
      { 
        type: 'text', 
        question: 'What could the institution improve to better support students?', 
        required: false,
        description: 'Suggestions for institutional improvement'
      }
    ],
    estimatedTime: '7-10 minutes',
    responseCount: 0,
    targetAudience: 'Students, Educational institutions, Academic administrators',
    useCases: ['Student satisfaction measurement', 'Institutional improvement', 'Service evaluation', 'Retention analysis'],
    insights: ['Student satisfaction trends', 'Service effectiveness', 'Improvement priorities', 'Institutional strengths']
  },
  {
    id: 'faculty-feedback',
    name: 'Faculty Feedback Survey',
    category: 'academic',
    description: 'Comprehensive faculty feedback survey to assess institutional support and professional development needs',
    icon: 'GraduationCap',
    questions: [
      { 
        type: 'rating', 
        question: 'How satisfied are you with institutional support for your role?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate institutional support for faculty'
      },
      { 
        type: 'text', 
        question: 'What resources do you need most to be effective in your role?', 
        required: false,
        description: 'Share your resource needs and priorities'
      },
      { 
        type: 'rating', 
        question: 'How would you rate professional development opportunities?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate professional development offerings'
      },
      { 
        type: 'multiple-choice', 
        question: 'What type of professional development would be most valuable?', 
        required: false, 
        options: ['Teaching Methods', 'Research Support', 'Technology Training', 'Leadership Development', 'Grant Writing', 'Industry Collaboration', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How well does the institution support research and scholarship?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate research support and resources'
      },
      { 
        type: 'text', 
        question: 'How can we better support faculty in their professional growth?', 
        required: false,
        description: 'Suggestions for faculty support improvement'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with work-life balance at the institution?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate work-life balance support'
      },
      { 
        type: 'multiple-choice', 
        question: 'What challenges do you face in your role?', 
        required: false, 
        options: ['Workload', 'Resources', 'Administrative Support', 'Student Engagement', 'Research Funding', 'Technology', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to recommend this institution to other faculty?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Faculty recommendation likelihood'
      }
    ],
    estimatedTime: '8-12 minutes',
    responseCount: 0,
    targetAudience: 'Faculty members, Academic administrators, HR teams',
    useCases: ['Faculty satisfaction measurement', 'Professional development planning', 'Institutional improvement', 'Retention analysis'],
    insights: ['Faculty satisfaction trends', 'Support needs', 'Development priorities', 'Institutional challenges']
  },
  {
    id: 'patient-satisfaction',
    name: 'Patient Satisfaction Survey',
    category: 'health',
    description: 'Comprehensive patient satisfaction survey to evaluate healthcare experience and service quality',
    icon: 'Heart',
    questions: [
      { 
        type: 'rating', 
        question: 'How satisfied are you with the care you received?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate your overall satisfaction with care'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the professionalism of our staff?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate staff professionalism and courtesy'
      },
      { 
        type: 'text', 
        question: 'What was your experience like during your visit?', 
        required: false,
        description: 'Share details about your healthcare experience'
      },
      { 
        type: 'multiple-choice', 
        question: 'How likely are you to recommend this facility to others?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Healthcare facility recommendation likelihood'
      },
      { 
        type: 'rating', 
        question: 'How well did our staff communicate with you?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate communication clarity and effectiveness'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of your care were most important to you?', 
        required: false, 
        options: ['Medical Quality', 'Staff Courtesy', 'Wait Times', 'Facility Cleanliness', 'Communication', 'Cost', 'Convenience', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with the wait times?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate satisfaction with appointment and wait times'
      },
      { 
        type: 'text', 
        question: 'What could we improve to better serve our patients?', 
        required: false,
        description: 'Suggestions for healthcare service improvement'
      },
      { 
        type: 'multiple-choice', 
        question: 'How did you hear about our facility?', 
        required: false, 
        options: ['Doctor Referral', 'Friend/Family', 'Insurance Provider', 'Online Search', 'Advertisement', 'Other'],
        description: 'Help us understand patient acquisition'
      }
    ],
    estimatedTime: '5-7 minutes',
    responseCount: 0,
    targetAudience: 'Patients, Healthcare providers, Medical facilities',
    useCases: ['Patient satisfaction measurement', 'Healthcare quality improvement', 'Service evaluation', 'Patient experience enhancement'],
    insights: ['Patient satisfaction trends', 'Service quality assessment', 'Improvement opportunities', 'Patient experience drivers']
  },
  {
    id: 'healthcare-quality',
    name: 'Healthcare Quality Assessment',
    category: 'health',
    description: 'Comprehensive healthcare quality assessment to evaluate treatment effectiveness and patient outcomes',
    icon: 'Heart',
    questions: [
      { 
        type: 'rating', 
        question: 'How would you rate the quality of care you received?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate the overall quality of healthcare received'
      },
      { 
        type: 'rating', 
        question: 'How effective was the treatment for your condition?', 
        required: true, 
        options: ['Very Ineffective', 'Ineffective', 'Average', 'Effective', 'Very Effective'],
        description: 'Rate treatment effectiveness'
      },
      { 
        type: 'text', 
        question: 'What improvements would you suggest?', 
        required: false,
        description: 'Suggestions for healthcare quality improvement'
      },
      { 
        type: 'multiple-choice', 
        question: 'How long did you wait for care?', 
        required: false, 
        options: ['Less than 15 minutes', '15-30 minutes', '30-60 minutes', 'More than 1 hour'],
        description: 'Wait time assessment'
      },
      { 
        type: 'rating', 
        question: 'How well did your healthcare provider explain your treatment?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate treatment explanation clarity'
      },
      { 
        type: 'multiple-choice', 
        question: 'What type of care did you receive?', 
        required: false, 
        options: ['Primary Care', 'Specialist Care', 'Emergency Care', 'Surgical Care', 'Preventive Care', 'Diagnostic Testing', 'Other'],
        description: 'Care type classification'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with the follow-up care?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate follow-up care satisfaction'
      },
      { 
        type: 'text', 
        question: 'How has your health improved since receiving care?', 
        required: false,
        description: 'Share health outcome improvements'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to return to this facility for future care?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Future care likelihood'
      }
    ],
    estimatedTime: '6-8 minutes',
    responseCount: 0,
    targetAudience: 'Patients, Healthcare providers, Quality assurance teams',
    useCases: ['Healthcare quality measurement', 'Treatment effectiveness evaluation', 'Patient outcome assessment', 'Quality improvement'],
    insights: ['Treatment effectiveness', 'Quality metrics', 'Patient outcomes', 'Improvement areas']
  },
  {
    id: 'wellness-program',
    name: 'Wellness Program Evaluation',
    category: 'health',
    description: 'Comprehensive wellness program evaluation to assess program effectiveness and participant satisfaction',
    icon: 'Heart',
    questions: [
      { 
        type: 'rating', 
        question: 'How effective is the wellness program in meeting your health goals?', 
        required: true, 
        options: ['Very Ineffective', 'Ineffective', 'Average', 'Effective', 'Very Effective'],
        description: 'Rate program effectiveness for your goals'
      },
      { 
        type: 'multiple-choice', 
        question: 'Which wellness activities do you participate in?', 
        required: false, 
        options: ['Fitness classes', 'Nutrition counseling', 'Mental health support', 'Health screenings', 'Stress management', 'Smoking cessation', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'text', 
        question: 'What wellness services would you like to see offered?', 
        required: false,
        description: 'Suggestions for new wellness services'
      },
      { 
        type: 'rating', 
        question: 'How has the program impacted your health?', 
        required: true, 
        options: ['No impact', 'Slight improvement', 'Moderate improvement', 'Significant improvement'],
        description: 'Health impact assessment'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with the wellness program overall?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Overall program satisfaction'
      },
      { 
        type: 'multiple-choice', 
        question: 'What motivates you to participate in wellness activities?', 
        required: false, 
        options: ['Health improvement', 'Weight management', 'Stress reduction', 'Social connection', 'Incentives', 'Medical recommendation', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How accessible are the wellness program activities?', 
        required: true, 
        options: ['Very Inaccessible', 'Inaccessible', 'Somewhat Accessible', 'Accessible', 'Very Accessible'],
        description: 'Rate program accessibility'
      },
      { 
        type: 'text', 
        question: 'What barriers prevent you from participating more in wellness activities?', 
        required: false,
        description: 'Share participation barriers'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to continue participating in the wellness program?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Future participation likelihood'
      }
    ],
    estimatedTime: '7-10 minutes',
    responseCount: 0,
    targetAudience: 'Wellness program participants, Healthcare providers, HR teams',
    useCases: ['Wellness program evaluation', 'Health outcome measurement', 'Program improvement', 'Participation analysis'],
    insights: ['Program effectiveness', 'Participation patterns', 'Health outcomes', 'Improvement opportunities']
  },
  {
    id: 'event-feedback',
    name: 'Event Feedback Survey',
    category: 'event',
    description: 'Comprehensive event feedback survey to evaluate attendee experience and event success',
    icon: 'Calendar',
    questions: [
      { 
        type: 'rating', 
        question: 'How would you rate the event overall?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate your overall event experience'
      },
      { 
        type: 'text', 
        question: 'What did you enjoy most about the event?', 
        required: false,
        description: 'Share your favorite aspects of the event'
      },
      { 
        type: 'text', 
        question: 'What could be improved for future events?', 
        required: false,
        description: 'Suggestions for event enhancement'
      },
      { 
        type: 'multiple-choice', 
        question: 'How likely are you to attend future events?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Future event attendance likelihood'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the event organization and logistics?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate event planning and execution'
      },
      { 
        type: 'multiple-choice', 
        question: 'What aspects of the event were most valuable?', 
        required: false, 
        options: ['Networking', 'Content/Sessions', 'Speakers', 'Venue', 'Food & Refreshments', 'Entertainment', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with the event venue and facilities?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate venue and facility satisfaction'
      },
      { 
        type: 'multiple-choice', 
        question: 'How did you hear about this event?', 
        required: false, 
        options: ['Email', 'Social Media', 'Website', 'Friend/Colleague', 'Advertisement', 'Event Listing', 'Other'],
        description: 'Event marketing effectiveness'
      },
      { 
        type: 'text', 
        question: 'What topics or themes would you like to see at future events?', 
        required: false,
        description: 'Suggestions for future event content'
      }
    ],
    estimatedTime: '4-6 minutes',
    responseCount: 0,
    targetAudience: 'Event attendees, Event organizers, Marketing teams',
    useCases: ['Event evaluation', 'Attendee satisfaction measurement', 'Event improvement', 'Future planning'],
    insights: ['Event success metrics', 'Attendee preferences', 'Improvement areas', 'Marketing effectiveness']
  },
  {
    id: 'conference-evaluation',
    name: 'Conference Evaluation Survey',
    category: 'event',
    description: 'Comprehensive conference evaluation to assess session quality and overall conference experience',
    icon: 'Calendar',
    questions: [
      { 
        type: 'rating', 
        question: 'How would you rate the conference organization?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate overall conference organization'
      },
      { 
        type: 'rating', 
        question: 'How valuable were the conference sessions?', 
        required: true, 
        options: ['Not Valuable', 'Somewhat Valuable', 'Valuable', 'Very Valuable', 'Extremely Valuable'],
        description: 'Rate session value and relevance'
      },
      { 
        type: 'text', 
        question: 'Which sessions were most valuable?', 
        required: false,
        description: 'Share your favorite sessions'
      },
      { 
        type: 'text', 
        question: 'What topics would you like to see covered?', 
        required: false,
        description: 'Suggestions for future conference topics'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the quality of speakers?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate speaker quality and expertise'
      },
      { 
        type: 'multiple-choice', 
        question: 'What conference activities did you participate in?', 
        required: false, 
        options: ['Keynote Sessions', 'Breakout Sessions', 'Workshops', 'Networking Events', 'Exhibition Hall', 'Poster Sessions', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with networking opportunities?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate networking experience'
      },
      { 
        type: 'multiple-choice', 
        question: 'What was your primary reason for attending?', 
        required: false, 
        options: ['Professional Development', 'Networking', 'Learning New Skills', 'Industry Updates', 'Research Presentation', 'Career Opportunities', 'Other'],
        description: 'Conference attendance motivation'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to attend this conference again?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Future conference attendance likelihood'
      }
    ],
    estimatedTime: '5-7 minutes',
    responseCount: 0,
    targetAudience: 'Conference attendees, Event organizers, Professional associations',
    useCases: ['Conference evaluation', 'Session quality assessment', 'Speaker evaluation', 'Future planning'],
    insights: ['Conference success metrics', 'Session effectiveness', 'Attendee satisfaction', 'Improvement areas']
  },
  {
    id: 'workshop-feedback',
    name: 'Workshop Feedback Survey',
    category: 'event',
    description: 'Comprehensive workshop evaluation to assess learning outcomes and workshop effectiveness',
    icon: 'Calendar',
    questions: [
      { 
        type: 'rating', 
        question: 'How effective was the workshop?', 
        required: true, 
        options: ['Very Ineffective', 'Ineffective', 'Average', 'Effective', 'Very Effective'],
        description: 'Rate workshop effectiveness'
      },
      { 
        type: 'text', 
        question: 'What skills did you learn?', 
        required: false,
        description: 'Share specific skills and knowledge gained'
      },
      { 
        type: 'rating', 
        question: 'How well was the material presented?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate presentation quality'
      },
      { 
        type: 'text', 
        question: 'How could the workshop be improved?', 
        required: false,
        description: 'Suggestions for workshop enhancement'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with the workshop duration?', 
        required: true, 
        options: ['Too Short', 'Somewhat Short', 'Just Right', 'Somewhat Long', 'Too Long'],
        description: 'Rate workshop length appropriateness'
      },
      { 
        type: 'multiple-choice', 
        question: 'What workshop activities were most helpful?', 
        required: false, 
        options: ['Hands-on Exercises', 'Group Discussions', 'Case Studies', 'Presentations', 'Q&A Sessions', 'Individual Work', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How well did the workshop meet your learning objectives?', 
        required: true, 
        options: ['Not at all', 'Poorly', 'Somewhat', 'Well', 'Very Well'],
        description: 'Learning objective achievement'
      },
      { 
        type: 'multiple-choice', 
        question: 'What is your experience level in this topic?', 
        required: true, 
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        description: 'Experience level assessment'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to apply what you learned?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Knowledge application likelihood'
      }
    ],
    estimatedTime: '4-6 minutes',
    responseCount: 0,
    targetAudience: 'Workshop participants, Training organizers, Educational institutions',
    useCases: ['Workshop evaluation', 'Learning outcome assessment', 'Training effectiveness', 'Curriculum improvement'],
    insights: ['Learning effectiveness', 'Skill development', 'Training quality', 'Improvement opportunities']
  },
  {
    id: 'community-needs',
    name: 'Community Needs Assessment',
    category: 'community',
    description: 'Comprehensive community needs assessment to identify priorities and development opportunities',
    icon: 'Target',
    questions: [
      { 
        type: 'multiple-choice', 
        question: 'What are the most pressing community needs?', 
        required: true, 
        options: ['Education', 'Healthcare', 'Housing', 'Transportation', 'Safety', 'Employment', 'Recreation', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How satisfied are you with community services?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate community service satisfaction'
      },
      { 
        type: 'text', 
        question: 'What services are missing in your community?', 
        required: false,
        description: 'Identify gaps in community services'
      },
      { 
        type: 'text', 
        question: 'How can we better serve the community?', 
        required: false,
        description: 'Suggestions for community improvement'
      },
      { 
        type: 'rating', 
        question: 'How would you rate the quality of life in your community?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Overall quality of life assessment'
      },
      { 
        type: 'multiple-choice', 
        question: 'What community improvements would benefit you most?', 
        required: false, 
        options: ['Better Schools', 'Healthcare Facilities', 'Public Transportation', 'Parks & Recreation', 'Job Opportunities', 'Safety Programs', 'Cultural Activities', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How involved are you in community activities?', 
        required: true, 
        options: ['Not Involved', 'Rarely Involved', 'Sometimes Involved', 'Often Involved', 'Very Involved'],
        description: 'Community engagement level'
      },
      { 
        type: 'multiple-choice', 
        question: 'What barriers prevent you from participating in community activities?', 
        required: false, 
        options: ['Time Constraints', 'Transportation', 'Cost', 'Lack of Information', 'Health Issues', 'Family Responsibilities', 'None', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'text', 
        question: 'What would encourage you to participate more in community activities?', 
        required: false,
        description: 'Suggestions for increasing community participation'
      }
    ],
    estimatedTime: '6-8 minutes',
    responseCount: 0,
    targetAudience: 'Community members, Local government, Non-profit organizations',
    useCases: ['Community planning', 'Service development', 'Resource allocation', 'Program design'],
    insights: ['Community priorities', 'Service gaps', 'Quality of life factors', 'Engagement barriers']
  },
  {
    id: 'public-opinion',
    name: 'Public Opinion Survey',
    category: 'community',
    description: 'Comprehensive public opinion survey to gather community perspectives on important issues',
    icon: 'Target',
    questions: [
      { 
        type: 'multiple-choice', 
        question: 'What is your stance on the main issue?', 
        required: true, 
        options: ['Strongly Support', 'Support', 'Neutral', 'Oppose', 'Strongly Oppose'],
        description: 'Position on the primary issue'
      },
      { 
        type: 'text', 
        question: 'What factors influence your opinion?', 
        required: false,
        description: 'Share the factors that shape your perspective'
      },
      { 
        type: 'rating', 
        question: 'How important is this issue to you?', 
        required: true, 
        options: ['Not Important', 'Somewhat Important', 'Important', 'Very Important', 'Extremely Important'],
        description: 'Issue importance assessment'
      },
      { 
        type: 'text', 
        question: 'What solutions would you suggest?', 
        required: false,
        description: 'Share your proposed solutions'
      },
      { 
        type: 'multiple-choice', 
        question: 'How do you typically stay informed about community issues?', 
        required: false, 
        options: ['Local News', 'Social Media', 'Community Meetings', 'Word of Mouth', 'Government Communications', 'Online Sources', 'Other'],
        description: 'Information source preferences'
      },
      { 
        type: 'rating', 
        question: 'How confident are you in your understanding of this issue?', 
        required: true, 
        options: ['Not Confident', 'Somewhat Confident', 'Confident', 'Very Confident', 'Extremely Confident'],
        description: 'Issue understanding confidence'
      },
      { 
        type: 'multiple-choice', 
        question: 'What concerns do you have about this issue?', 
        required: false, 
        options: ['Economic Impact', 'Environmental Impact', 'Social Impact', 'Safety Concerns', 'Cost Implications', 'Implementation Challenges', 'None', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to participate in community discussions about this issue?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Community participation likelihood'
      },
      { 
        type: 'text', 
        question: 'What additional information would help you form a better opinion?', 
        required: false,
        description: 'Information needs for informed decision-making'
      }
    ],
    estimatedTime: '5-7 minutes',
    responseCount: 0,
    targetAudience: 'Community members, Local government, Advocacy groups',
    useCases: ['Public opinion measurement', 'Policy development', 'Community engagement', 'Issue awareness'],
    insights: ['Public sentiment', 'Issue priorities', 'Information needs', 'Engagement opportunities']
  },
  {
    id: 'volunteer-satisfaction',
    name: 'Volunteer Satisfaction Survey',
    category: 'community',
    description: 'Comprehensive volunteer satisfaction survey to evaluate volunteer experience and program effectiveness',
    icon: 'Target',
    questions: [
      { 
        type: 'rating', 
        question: 'How satisfied are you with your volunteer experience?', 
        required: true, 
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        description: 'Rate your overall volunteer satisfaction'
      },
      { 
        type: 'text', 
        question: 'What do you enjoy most about volunteering?', 
        required: false,
        description: 'Share your favorite aspects of volunteering'
      },
      { 
        type: 'rating', 
        question: 'How well are you supported as a volunteer?', 
        required: true, 
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
        description: 'Rate volunteer support and resources'
      },
      { 
        type: 'text', 
        question: 'How can we improve the volunteer program?', 
        required: false,
        description: 'Suggestions for program enhancement'
      },
      { 
        type: 'multiple-choice', 
        question: 'What volunteer activities do you participate in?', 
        required: false, 
        options: ['Direct Service', 'Administrative Support', 'Event Planning', 'Fundraising', 'Mentoring', 'Outreach', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How meaningful do you find your volunteer work?', 
        required: true, 
        options: ['Not Meaningful', 'Somewhat Meaningful', 'Meaningful', 'Very Meaningful', 'Extremely Meaningful'],
        description: 'Rate the meaningfulness of your work'
      },
      { 
        type: 'multiple-choice', 
        question: 'What motivates you to volunteer?', 
        required: false, 
        options: ['Helping Others', 'Community Impact', 'Skill Development', 'Social Connection', 'Personal Growth', 'Professional Experience', 'Other'],
        description: 'Select all that apply'
      },
      { 
        type: 'rating', 
        question: 'How likely are you to continue volunteering?', 
        required: true, 
        options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely'],
        description: 'Future volunteer commitment'
      },
      { 
        type: 'text', 
        question: 'What additional training or support would be helpful?', 
        required: false,
        description: 'Suggestions for volunteer development'
      }
    ],
    estimatedTime: '5-7 minutes',
    responseCount: 0,
    targetAudience: 'Volunteers, Non-profit organizations, Community groups',
    useCases: ['Volunteer satisfaction measurement', 'Program improvement', 'Retention analysis', 'Volunteer development'],
    insights: ['Volunteer satisfaction trends', 'Motivation factors', 'Support needs', 'Retention drivers']
  }
];

// GET /api/templates - Get all templates (surveys and events)
router.get('/', auth, async (req, res) => {
  try {
    // Combine all templates
    const allTemplates = [
      ...surveyTemplates,
      ...advancedSurveyTemplates,
      ...advancedEventTemplates
    ];

    res.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET /api/templates/surveys - Get only survey templates
router.get('/surveys', auth, async (req, res) => {
  try {
    const surveyTemplatesAll = [...surveyTemplates, ...advancedSurveyTemplates];
    res.json(surveyTemplatesAll);
  } catch (error) {
    console.error('Error fetching survey templates:', error);
    res.status(500).json({ error: 'Failed to fetch survey templates' });
  }
});

// GET /api/templates/events - Get only event templates
router.get('/events', auth, async (req, res) => {
  try {
    res.json(advancedEventTemplates);
  } catch (error) {
    console.error('Error fetching event templates:', error);
    res.status(500).json({ error: 'Failed to fetch event templates' });
  }
});

// GET /api/templates/:id - Get specific template
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Search in all template arrays
    const allTemplates = [
      ...surveyTemplates,
      ...advancedSurveyTemplates,
      ...advancedEventTemplates
    ];
    
    const template = allTemplates.find(t => t.id === id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// POST /api/templates - Create new template
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category, icon, questions, templateType, fields, features } = req.body;
    const userId = req.user.id;
    
    // Generate unique ID
    const id = `${category}-${Date.now()}`;
    
    const newTemplate = {
      id,
      name,
      description,
      category,
      icon,
      questions: questions || [],
      templateType: templateType || 'survey',
      fields: fields || [],
      features: features || [],
      createdBy: userId,
      createdAt: new Date().toISOString(),
      estimatedTime: '2-3 minutes',
      responseCount: 0
    };
    
    // In a real app, you'd save to database
    // For now, we'll return the template
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// PUT /api/templates/:id - Update template
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, icon, questions, fields, features } = req.body;
    const userId = req.user.id;
    
    // In a real app, you'd update in database
    // For now, we'll return the updated template
    const updatedTemplate = {
      id,
      name,
      description,
      category,
      icon,
      questions: questions || [],
      fields: fields || [],
      features: features || [],
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      estimatedTime: '2-3 minutes',
      responseCount: 0
    };
    
    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// POST /api/templates/:id/duplicate - Duplicate template
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    
    // Find original template
    const allTemplates = [
      ...surveyTemplates,
      ...advancedSurveyTemplates,
      ...advancedEventTemplates
    ];
    
    const originalTemplate = allTemplates.find(t => t.id === id);
    
    if (!originalTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Create duplicate
    const duplicatedTemplate = {
      ...originalTemplate,
      id: `${originalTemplate.id}-copy-${Date.now()}`,
      name: name || `${originalTemplate.name} (Copy)`,
      description: description || originalTemplate.description,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      responseCount: 0
    };
    
    res.status(201).json(duplicatedTemplate);
  } catch (error) {
    console.error('Error duplicating template:', error);
    res.status(500).json({ error: 'Failed to duplicate template' });
  }
});

// DELETE /api/templates/:id - Delete template
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // In a real app, you'd delete from database
    // For now, we'll just return success
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;
