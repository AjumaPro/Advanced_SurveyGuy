// Comprehensive sample event templates for different types of events

export const sampleEvents = [
  {
    id: 'tech-conference',
    title: 'Annual Tech Conference 2025',
    description: 'Join industry leaders for cutting-edge technology insights and networking',
    category: 'Conference',
    industry: 'Technology',
    eventType: 'conference',
    duration: 3, // days
    maxAttendees: 500,
    registrationQuestions: [
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
        id: 'experience-level',
        type: 'multiple_choice',
        title: 'What is your experience level in technology?',
        required: true,
        options: [
          'Beginner (0-2 years)',
          'Intermediate (3-5 years)',
          'Advanced (6-10 years)',
          'Expert (10+ years)'
        ]
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
        id: 'networking-preference',
        type: 'emoji_scale',
        title: 'How excited are you about networking opportunities?',
        required: true,
        scaleType: 'mood',
        showLabels: true
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
          'Kosher'
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
      }
    ],
    feedbackQuestions: [
      {
        id: 'overall-rating',
        type: 'emoji_scale',
        title: 'How would you rate the conference overall?',
        required: true,
        scaleType: 'experience',
        showLabels: true
      },
      {
        id: 'session-quality',
        type: 'rating',
        title: 'Rate the quality of the sessions',
        required: true,
        maxRating: 5
      },
      {
        id: 'networking-value',
        type: 'rating',
        title: 'Rate the networking opportunities',
        required: true,
        maxRating: 5
      },
      {
        id: 'venue-facilities',
        type: 'rating',
        title: 'Rate the venue and facilities',
        required: true,
        maxRating: 5
      },
      {
        id: 'most-valuable',
        type: 'textarea',
        title: 'What was the most valuable part of the conference?',
        required: false,
        placeholder: 'Share what you found most valuable...',
        maxLength: 1000
      },
      {
        id: 'improvements',
        type: 'textarea',
        title: 'How could we improve future conferences?',
        required: false,
        placeholder: 'Your suggestions for improvement...',
        maxLength: 1000
      },
      {
        id: 'recommend',
        type: 'nps',
        title: 'How likely are you to recommend this conference to colleagues?',
        required: true
      }
    ]
  },

  {
    id: 'product-launch',
    title: 'Product Launch Event',
    description: 'Exclusive preview of our latest innovation',
    category: 'Product Launch',
    industry: 'Business',
    eventType: 'launch',
    duration: 0.5, // half day
    maxAttendees: 200,
    registrationQuestions: [
      {
        id: 'contact-info',
        type: 'text',
        title: 'Full Name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        title: 'Email Address',
        required: true
      },
      {
        id: 'phone',
        type: 'phone',
        title: 'Phone Number',
        required: true
      },
      {
        id: 'company-role',
        type: 'multiple_choice',
        title: 'What best describes your role?',
        required: true,
        options: [
          'CEO/Founder',
          'Product Manager',
          'Marketing Manager',
          'Sales Representative',
          'Developer/Engineer',
          'Designer',
          'Other'
        ],
        allowOther: true
      },
      {
        id: 'company-size',
        type: 'multiple_choice',
        title: 'What is your company size?',
        required: false,
        options: [
          '1-10 employees',
          '11-50 employees',
          '51-200 employees',
          '201-1000 employees',
          '1000+ employees'
        ]
      },
      {
        id: 'interest-level',
        type: 'emoji_scale',
        title: 'How interested are you in our new product?',
        required: true,
        scaleType: 'mood',
        showLabels: true
      },
      {
        id: 'current-solution',
        type: 'textarea',
        title: 'What solution are you currently using for this need?',
        required: false,
        placeholder: 'Describe your current approach or tools...',
        maxLength: 500
      }
    ],
    feedbackQuestions: [
      {
        id: 'product-impression',
        type: 'emoji_scale',
        title: 'What\'s your impression of the new product?',
        required: true,
        scaleType: 'experience',
        showLabels: true
      },
      {
        id: 'feature-interest',
        type: 'checkbox',
        title: 'Which features interest you most?',
        required: false,
        options: [
          'User-friendly interface',
          'Advanced analytics',
          'Integration capabilities',
          'Mobile compatibility',
          'Security features',
          'Customization options'
        ],
        maxSelections: 3
      },
      {
        id: 'purchase-likelihood',
        type: 'scale',
        title: 'How likely are you to purchase this product?',
        required: true,
        minScale: 1,
        maxScale: 10,
        step: 1
      },
      {
        id: 'pricing-feedback',
        type: 'multiple_choice',
        title: 'What do you think about the pricing?',
        required: false,
        options: [
          'Very reasonable',
          'Reasonable',
          'Slightly expensive',
          'Too expensive',
          'Need more information'
        ]
      },
      {
        id: 'additional-feedback',
        type: 'textarea',
        title: 'Any additional feedback about the product or event?',
        required: false,
        placeholder: 'Share your thoughts...',
        maxLength: 1000
      }
    ]
  },

  {
    id: 'workshop-training',
    title: 'Professional Development Workshop',
    description: 'Hands-on training to advance your skills',
    category: 'Workshop',
    industry: 'Education',
    eventType: 'workshop',
    duration: 1, // full day
    maxAttendees: 50,
    registrationQuestions: [
      {
        id: 'participant-name',
        type: 'text',
        title: 'Full Name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        title: 'Email Address',
        required: true
      },
      {
        id: 'current-skill-level',
        type: 'multiple_choice',
        title: 'What is your current skill level in this area?',
        required: true,
        options: [
          'Beginner - New to this topic',
          'Intermediate - Some experience',
          'Advanced - Significant experience',
          'Expert - Teaching/leading others'
        ]
      },
      {
        id: 'learning-goals',
        type: 'checkbox',
        title: 'What are your main learning goals for this workshop?',
        required: true,
        options: [
          'Learn new techniques',
          'Improve existing skills',
          'Network with peers',
          'Get hands-on practice',
          'Earn certification',
          'Apply knowledge to current projects'
        ],
        maxSelections: 3
      },
      {
        id: 'experience-background',
        type: 'textarea',
        title: 'Briefly describe your relevant experience or background',
        required: false,
        placeholder: 'Help us understand your background to tailor the workshop...',
        maxLength: 500
      },
      {
        id: 'special-requirements',
        type: 'textarea',
        title: 'Any special requirements or accommodations needed?',
        required: false,
        placeholder: 'Accessibility needs, dietary restrictions, etc...',
        maxLength: 300
      }
    ],
    feedbackQuestions: [
      {
        id: 'workshop-rating',
        type: 'emoji_scale',
        title: 'How would you rate this workshop overall?',
        required: true,
        scaleType: 'satisfaction',
        showLabels: true
      },
      {
        id: 'content-quality',
        type: 'rating',
        title: 'Rate the quality of the workshop content',
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
        id: 'hands-on-value',
        type: 'rating',
        title: 'Rate the value of hands-on activities',
        required: true,
        maxRating: 5
      },
      {
        id: 'learning-objectives',
        type: 'likert',
        title: 'The workshop met my learning objectives',
        required: true,
        points: 5,
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'pace-appropriateness',
        type: 'multiple_choice',
        title: 'How was the pace of the workshop?',
        required: true,
        options: ['Too slow', 'Just right', 'Too fast']
      },
      {
        id: 'most-valuable-part',
        type: 'textarea',
        title: 'What was the most valuable part of the workshop?',
        required: false,
        placeholder: 'Describe what you found most helpful...',
        maxLength: 500
      },
      {
        id: 'improvement-suggestions',
        type: 'textarea',
        title: 'How could this workshop be improved?',
        required: false,
        placeholder: 'Share your suggestions...',
        maxLength: 500
      },
      {
        id: 'recommend-workshop',
        type: 'thumbs',
        title: 'Would you recommend this workshop to others?',
        required: true,
        labels: { up: 'Yes, I would recommend it', down: 'No, I would not recommend it' }
      }
    ]
  },

  {
    id: 'networking-meetup',
    title: 'Monthly Networking Meetup',
    description: 'Connect with like-minded professionals in your industry',
    category: 'Networking',
    industry: 'Business',
    eventType: 'meetup',
    duration: 0.25, // 3 hours
    maxAttendees: 100,
    registrationQuestions: [
      {
        id: 'attendee-name',
        type: 'text',
        title: 'Full Name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        title: 'Email Address',
        required: true
      },
      {
        id: 'linkedin-profile',
        type: 'url',
        title: 'LinkedIn Profile (Optional)',
        required: false,
        placeholder: 'https://linkedin.com/in/yourprofile'
      },
      {
        id: 'professional-background',
        type: 'multiple_choice',
        title: 'What best describes your professional background?',
        required: true,
        options: [
          'Entrepreneur/Startup Founder',
          'Corporate Executive',
          'Sales & Marketing',
          'Technology & Engineering',
          'Finance & Investment',
          'Consulting',
          'Freelancer/Contractor',
          'Student/Recent Graduate'
        ],
        allowOther: true
      },
      {
        id: 'networking-goals',
        type: 'checkbox',
        title: 'What are your networking goals for this meetup?',
        required: false,
        options: [
          'Find potential business partners',
          'Discover new opportunities',
          'Learn from industry experts',
          'Share knowledge and experience',
          'Build professional relationships',
          'Explore career opportunities'
        ],
        maxSelections: 3
      },
      {
        id: 'first-time-attendee',
        type: 'thumbs',
        title: 'Is this your first time attending our meetup?',
        required: true,
        labels: { up: 'Yes, first time', down: 'No, I\'ve attended before' }
      },
      {
        id: 'topics-of-interest',
        type: 'textarea',
        title: 'What topics or trends would you like to discuss?',
        required: false,
        placeholder: 'Share topics you\'re passionate about or want to learn more about...',
        maxLength: 300
      }
    ],
    feedbackQuestions: [
      {
        id: 'event-satisfaction',
        type: 'emoji_scale',
        title: 'How satisfied were you with the meetup?',
        required: true,
        scaleType: 'satisfaction',
        showLabels: true
      },
      {
        id: 'networking-success',
        type: 'scale',
        title: 'How successful was your networking experience?',
        required: true,
        minScale: 1,
        maxScale: 10,
        step: 1
      },
      {
        id: 'venue-rating',
        type: 'rating',
        title: 'Rate the venue and facilities',
        required: true,
        maxRating: 5
      },
      {
        id: 'valuable-connections',
        type: 'number',
        title: 'How many valuable connections did you make?',
        required: false,
        min: 0,
        max: 50,
        placeholder: 'Number of connections'
      },
      {
        id: 'future-topics',
        type: 'textarea',
        title: 'What topics would you like to see at future meetups?',
        required: false,
        placeholder: 'Suggest topics for future events...',
        maxLength: 500
      },
      {
        id: 'likelihood-to-return',
        type: 'scale',
        title: 'How likely are you to attend future meetups?',
        required: true,
        minScale: 1,
        maxScale: 10,
        step: 1
      }
    ]
  },

  {
    id: 'webinar-series',
    title: 'Expert Webinar Series',
    description: 'Monthly webinars featuring industry experts and thought leaders',
    category: 'Webinar',
    industry: 'Education',
    eventType: 'webinar',
    duration: 0.08, // 2 hours
    maxAttendees: 1000,
    registrationQuestions: [
      {
        id: 'participant-name',
        type: 'text',
        title: 'Full Name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        title: 'Email Address',
        required: true
      },
      {
        id: 'time-zone',
        type: 'dropdown',
        title: 'Your Time Zone',
        required: true,
        options: [
          'Eastern Time (ET)',
          'Central Time (CT)',
          'Mountain Time (MT)',
          'Pacific Time (PT)',
          'Greenwich Mean Time (GMT)',
          'Central European Time (CET)',
          'Other'
        ],
        allowOther: true
      },
      {
        id: 'professional-role',
        type: 'multiple_choice',
        title: 'What is your professional role?',
        required: true,
        options: [
          'Business Owner/CEO',
          'Manager/Director',
          'Individual Contributor',
          'Consultant',
          'Student',
          'Retired',
          'Other'
        ],
        allowOther: true
      },
      {
        id: 'webinar-topics',
        type: 'ranking',
        title: 'Rank these topics by your interest level (drag to reorder)',
        required: false,
        options: [
          'Leadership & Management',
          'Digital Marketing',
          'Technology Trends',
          'Financial Planning',
          'Personal Development',
          'Industry Insights'
        ]
      },
      {
        id: 'participation-preference',
        type: 'multiple_choice',
        title: 'How do you prefer to participate?',
        required: true,
        options: [
          'Listen only',
          'Ask questions via chat',
          'Participate in polls',
          'Join discussion if possible'
        ]
      }
    ],
    feedbackQuestions: [
      {
        id: 'webinar-rating',
        type: 'emoji_scale',
        title: 'How would you rate this webinar?',
        required: true,
        scaleType: 'experience',
        showLabels: true
      },
      {
        id: 'content-relevance',
        type: 'rating',
        title: 'How relevant was the content to your needs?',
        required: true,
        maxRating: 5
      },
      {
        id: 'speaker-effectiveness',
        type: 'rating',
        title: 'Rate the speaker\'s effectiveness',
        required: true,
        maxRating: 5
      },
      {
        id: 'technical-quality',
        type: 'rating',
        title: 'Rate the technical quality (audio, video, platform)',
        required: true,
        maxRating: 5
      },
      {
        id: 'key-takeaways',
        type: 'textarea',
        title: 'What were your key takeaways from this webinar?',
        required: false,
        placeholder: 'Share what you learned...',
        maxLength: 500
      },
      {
        id: 'future-topics',
        type: 'textarea',
        title: 'What topics would you like to see in future webinars?',
        required: false,
        placeholder: 'Suggest topics for future sessions...',
        maxLength: 500
      },
      {
        id: 'recommend-series',
        type: 'nps',
        title: 'How likely are you to recommend our webinar series?',
        required: true
      }
    ]
  },

  {
    id: 'charity-fundraiser',
    title: 'Annual Charity Fundraising Gala',
    description: 'Join us for an elegant evening supporting a great cause',
    category: 'Fundraiser',
    industry: 'Non-Profit',
    eventType: 'gala',
    duration: 0.33, // evening event
    maxAttendees: 300,
    registrationQuestions: [
      {
        id: 'guest-name',
        type: 'text',
        title: 'Full Name',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        title: 'Email Address',
        required: true
      },
      {
        id: 'phone',
        type: 'phone',
        title: 'Phone Number',
        required: true
      },
      {
        id: 'guest-count',
        type: 'number',
        title: 'Number of guests (including yourself)',
        required: true,
        min: 1,
        max: 10
      },
      {
        id: 'ticket-type',
        type: 'multiple_choice',
        title: 'Select your ticket type',
        required: true,
        options: [
          'Individual Ticket - $150',
          'Couple Ticket - $275',
          'Corporate Table (8 seats) - $1,200',
          'Sponsor Table (10 seats) - $2,500'
        ]
      },
      {
        id: 'dietary-preferences',
        type: 'checkbox',
        title: 'Dietary preferences (select all that apply)',
        required: false,
        options: [
          'No restrictions',
          'Vegetarian',
          'Vegan',
          'Gluten-free',
          'Kosher',
          'Halal',
          'Dairy-free',
          'Nut allergies'
        ]
      },
      {
        id: 'support-level',
        type: 'emoji_scale',
        title: 'How passionate are you about our cause?',
        required: true,
        scaleType: 'mood',
        showLabels: true
      },
      {
        id: 'additional-donation',
        type: 'currency',
        title: 'Would you like to make an additional donation?',
        required: false,
        currency: 'USD',
        min: 0,
        max: 10000
      },
      {
        id: 'volunteer-interest',
        type: 'thumbs',
        title: 'Are you interested in volunteer opportunities?',
        required: false,
        labels: { up: 'Yes, I\'d like to help', down: 'Not at this time' }
      }
    ],
    feedbackQuestions: [
      {
        id: 'event-enjoyment',
        type: 'emoji_scale',
        title: 'How much did you enjoy the gala?',
        required: true,
        scaleType: 'mood',
        showLabels: true
      },
      {
        id: 'venue-atmosphere',
        type: 'rating',
        title: 'Rate the venue and atmosphere',
        required: true,
        maxRating: 5
      },
      {
        id: 'program-quality',
        type: 'rating',
        title: 'Rate the program and speakers',
        required: true,
        maxRating: 5
      },
      {
        id: 'food-service',
        type: 'rating',
        title: 'Rate the food and service',
        required: true,
        maxRating: 5
      },
      {
        id: 'cause-connection',
        type: 'likert',
        title: 'The event helped me feel more connected to the cause',
        required: true,
        points: 5,
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 'future-support',
        type: 'multiple_choice',
        title: 'How would you like to support us in the future?',
        required: false,
        options: [
          'Attend future events',
          'Make regular donations',
          'Volunteer time',
          'Spread awareness',
          'Corporate sponsorship',
          'Not interested in future involvement'
        ],
        allowOther: true
      },
      {
        id: 'event-improvements',
        type: 'textarea',
        title: 'How could we improve future events?',
        required: false,
        placeholder: 'Your suggestions help us create better experiences...',
        maxLength: 500
      }
    ]
  }
];

export const getSampleEventById = (id) => {
  return sampleEvents.find(event => event.id === id);
};

export const getSampleEventsByCategory = (category) => {
  return sampleEvents.filter(event => event.category === category);
};

export const getSampleEventsByIndustry = (industry) => {
  return sampleEvents.filter(event => event.industry === industry);
};

export const getEventCategories = () => {
  return [...new Set(sampleEvents.map(event => event.category))];
};

export const getEventIndustries = () => {
  return [...new Set(sampleEvents.map(event => event.industry))];
};

export default sampleEvents;
