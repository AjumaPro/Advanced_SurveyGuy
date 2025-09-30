/**
 * Professional Templates Creation Script
 * Run this in the browser console to create professional templates
 * 
 * Usage:
 * 1. Open your SurveyGuy application
 * 2. Open browser developer tools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter to execute
 */

console.log('🚀 Professional Templates Creation Script Starting...');

// Professional Survey Templates Data
const surveyTemplates = [
  {
    title: 'Customer Satisfaction Survey',
    description: 'Professional customer satisfaction survey to measure overall experience and identify improvement opportunities.',
    category: 'customer-feedback',
    industry: 'general',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How satisfied are you with our product/service overall?',
        required: true,
        scale: 5,
        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        id: 'q2',
        type: 'rating',
        question: 'How likely are you to recommend us to a friend or colleague?',
        required: true,
        scale: 10,
        description: '0 = Not at all likely, 10 = Extremely likely (NPS Score)'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What did you like most about your experience?',
        required: false,
        options: ['Product quality', 'Customer service', 'Value for money', 'Ease of use', 'Fast delivery', 'Professional staff', 'Other']
      },
      {
        id: 'q4',
        type: 'text',
        question: 'What could we improve?',
        required: false,
        placeholder: 'Your suggestions help us get better...'
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'How did you hear about us?',
        required: false,
        options: ['Google search', 'Social media', 'Friend recommendation', 'Advertisement', 'Blog/article', 'Event', 'Other']
      }
    ],
    settings: {
      allowAnonymous: true,
      showProgressBar: true,
      oneQuestionPerPage: false,
      allowBack: true,
      thankYouMessage: 'Thank you for your feedback! We appreciate your time and will use your input to improve our services.',
      estimatedTime: '2-3 minutes'
    },
    estimatedTime: '2-3 minutes',
    targetAudience: 'All customers and clients'
  },
  {
    title: 'Employee Satisfaction Survey',
    description: 'Comprehensive survey to measure employee satisfaction, engagement, and identify areas for workplace improvement.',
    category: 'employee',
    industry: 'hr',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How satisfied are you with your current role?',
        required: true,
        scale: 5,
        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        id: 'q2',
        type: 'rating',
        question: 'How would you rate your work-life balance?',
        required: true,
        scale: 5,
        labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
      },
      {
        id: 'q3',
        type: 'rating',
        question: 'How effective is your direct manager?',
        required: false,
        scale: 5,
        labels: ['Very Ineffective', 'Ineffective', 'Neutral', 'Effective', 'Very Effective']
      },
      {
        id: 'q4',
        type: 'rating',
        question: 'How satisfied are you with career development opportunities?',
        required: false,
        scale: 5,
        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        id: 'q5',
        type: 'rating',
        question: 'How would you rate our company culture?',
        required: true,
        scale: 5,
        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
      },
      {
        id: 'q6',
        type: 'rating',
        question: 'How likely are you to recommend this company as a great place to work?',
        required: true,
        scale: 10,
        description: '0 = Not likely, 10 = Extremely likely'
      },
      {
        id: 'q7',
        type: 'text',
        question: 'What do you like most about working here?',
        required: false,
        placeholder: 'What we do well...'
      },
      {
        id: 'q8',
        type: 'text',
        question: 'What should we improve?',
        required: false,
        placeholder: 'Areas for improvement...'
      }
    ],
    settings: {
      allowAnonymous: false,
      showProgressBar: true,
      oneQuestionPerPage: false,
      allowBack: true,
      thankYouMessage: 'Thank you for your feedback! Your input helps us create a better workplace.',
      estimatedTime: '4-5 minutes'
    },
    estimatedTime: '4-5 minutes',
    targetAudience: 'All employees'
  },
  {
    title: 'Event Feedback Survey',
    description: 'Comprehensive post-event evaluation to measure satisfaction, gather feedback, and improve future events.',
    category: 'events',
    industry: 'general',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'Overall event rating',
        required: true,
        scale: 5,
        labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        id: 'q2',
        type: 'rating',
        question: 'Content quality rating',
        required: true,
        scale: 5,
        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
      },
      {
        id: 'q3',
        type: 'rating',
        question: 'Speaker effectiveness',
        required: false,
        scale: 5,
        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
      },
      {
        id: 'q4',
        type: 'rating',
        question: 'Venue and logistics',
        required: false,
        scale: 5,
        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'Would you attend similar events?',
        required: false,
        options: ['Definitely yes', 'Probably yes', 'Maybe', 'Probably no', 'Definitely no']
      },
      {
        id: 'q6',
        type: 'rating',
        question: 'Likelihood to recommend this event',
        required: true,
        scale: 10,
        description: '0 = Not likely, 10 = Extremely likely'
      },
      {
        id: 'q7',
        type: 'text',
        question: 'What was the most valuable part?',
        required: false,
        placeholder: 'What you found most useful...'
      },
      {
        id: 'q8',
        type: 'text',
        question: 'Suggestions for future events',
        required: false,
        placeholder: 'Ideas for improvement...'
      }
    ],
    settings: {
      allowAnonymous: true,
      showProgressBar: true,
      oneQuestionPerPage: false,
      allowBack: true,
      thankYouMessage: 'Thank you for attending and providing feedback!',
      estimatedTime: '3-4 minutes'
    },
    estimatedTime: '3-4 minutes',
    targetAudience: 'Event attendees'
  },
  {
    title: 'Product Feature Feedback Survey',
    description: 'Understand how customers use your product features and what improvements they want.',
    category: 'product-research',
    industry: 'technology',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'How often do you use our product?',
        required: true,
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'First time user']
      },
      {
        id: 'q2',
        type: 'rating',
        question: 'Overall product satisfaction',
        required: true,
        scale: 5,
        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
      },
      {
        id: 'q3',
        type: 'rating',
        question: 'Ease of use rating',
        required: true,
        scale: 5,
        labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which feature do you use most?',
        required: false,
        options: ['Dashboard', 'Reports', 'Settings', 'Integrations', 'Mobile app', 'API', 'Other']
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'What feature would you like to see added?',
        required: false,
        options: ['Advanced analytics', 'Better mobile app', 'More integrations', 'Automation tools', 'Custom branding', 'API improvements', 'Other']
      },
      {
        id: 'q6',
        type: 'rating',
        question: 'How does our product compare to competitors?',
        required: false,
        scale: 5,
        labels: ['Much worse', 'Worse', 'Same', 'Better', 'Much better']
      },
      {
        id: 'q7',
        type: 'text',
        question: 'What is your biggest challenge with our product?',
        required: false,
        placeholder: 'Describe your main challenge...'
      },
      {
        id: 'q8',
        type: 'text',
        question: 'What do you love most about our product?',
        required: false,
        placeholder: 'What works best for you...'
      }
    ],
    settings: {
      allowAnonymous: true,
      showProgressBar: true,
      oneQuestionPerPage: false,
      allowBack: true,
      thankYouMessage: 'Thank you! Your feedback helps us build better products.',
      estimatedTime: '4-5 minutes'
    },
    estimatedTime: '4-5 minutes',
    targetAudience: 'Product users'
  },
  {
    title: 'Market Research Survey',
    description: 'Comprehensive market research survey to understand customer preferences, buying behavior, and market trends.',
    category: 'market-research',
    industry: 'general',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is your age range?',
        required: false,
        options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What is your annual household income?',
        required: false,
        options: ['Under $25,000', '$25,000-$49,999', '$50,000-$74,999', '$75,000-$99,999', '$100,000-$149,999', '$150,000+', 'Prefer not to say']
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'How often do you purchase products in this category?',
        required: true,
        options: ['Weekly', 'Monthly', 'Every few months', 'Annually', 'Rarely', 'Never']
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'What factors most influence your purchasing decisions?',
        required: true,
        options: ['Price', 'Quality', 'Brand reputation', 'Reviews/recommendations', 'Features', 'Customer service', 'Convenience']
      },
      {
        id: 'q5',
        type: 'rating',
        question: 'How important is environmental sustainability in your purchasing decisions?',
        required: false,
        scale: 5,
        labels: ['Not Important', 'Slightly Important', 'Moderately Important', 'Very Important', 'Extremely Important']
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Where do you typically research products before buying?',
        required: false,
        options: ['Company websites', 'Review sites', 'Social media', 'Friends/family', 'Industry publications', 'Comparison sites', 'In-store']
      },
      {
        id: 'q7',
        type: 'text',
        question: 'What product features are you looking for?',
        required: false,
        placeholder: 'Describe your ideal product features...'
      }
    ],
    settings: {
      allowAnonymous: true,
      showProgressBar: true,
      oneQuestionPerPage: false,
      allowBack: true,
      thankYouMessage: 'Thank you for participating in our market research!',
      estimatedTime: '4-5 minutes'
    },
    estimatedTime: '4-5 minutes',
    targetAudience: 'Target market demographics'
  },
  {
    title: 'Course Evaluation Survey',
    description: 'Evaluate course effectiveness, instructor performance, and gather suggestions for improvement.',
    category: 'education',
    industry: 'education',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'Overall course rating',
        required: true,
        scale: 5,
        labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      {
        id: 'q2',
        type: 'rating',
        question: 'How effective was the instructor?',
        required: true,
        scale: 5,
        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
      },
      {
        id: 'q3',
        type: 'rating',
        question: 'How relevant was the course content?',
        required: true,
        scale: 5,
        labels: ['Not Relevant', 'Slightly Relevant', 'Moderately Relevant', 'Very Relevant', 'Extremely Relevant']
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Course difficulty level',
        required: false,
        options: ['Too easy', 'Slightly easy', 'Just right', 'Slightly difficult', 'Too difficult']
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'Most valuable aspect of the course',
        required: false,
        options: ['Course content', 'Instructor', 'Materials', 'Assignments', 'Discussions', 'Practical exercises']
      },
      {
        id: 'q6',
        type: 'rating',
        question: 'Would you recommend this course?',
        required: true,
        scale: 10,
        description: '0 = Not likely, 10 = Extremely likely'
      },
      {
        id: 'q7',
        type: 'text',
        question: 'Suggestions for improving this course',
        required: false,
        placeholder: 'How can we make this course better...'
      }
    ],
    settings: {
      allowAnonymous: false,
      showProgressBar: true,
      oneQuestionPerPage: false,
      allowBack: true,
      thankYouMessage: 'Thank you for your course evaluation!',
      estimatedTime: '3-4 minutes'
    },
    estimatedTime: '3-4 minutes',
    targetAudience: 'Course participants'
  }
];

// Professional Event Templates Data
const eventTemplates = [
  {
    title: 'Professional Business Conference',
    description: 'Comprehensive business conference template with speakers, networking, workshops, and professional development sessions.',
    eventType: 'conference',
    category: 'business',
    capacity: 500,
    price: 299.99,
    currency: 'USD',
    location: 'Downtown Convention Center',
    venue: 'Main Conference Hall',
    duration: 8,
    registrationFields: [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', required: false },
      { id: 'company', type: 'text', label: 'Company/Organization', required: true },
      { id: 'position', type: 'text', label: 'Job Title/Position', required: true },
      { id: 'dietary', type: 'select', label: 'Dietary Restrictions', required: false, options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Other'] },
      { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 5 }
    ],
    eventSettings: {
      allowWaitlist: true,
      requireApproval: false,
      sendConfirmation: true,
      collectPayment: true,
      earlyBirdDiscount: true,
      groupDiscounts: true,
      cancellationPolicy: 'Full refund up to 7 days before event'
    },
    features: [
      'Professional keynote speakers',
      'Interactive workshop sessions',
      'Networking breaks and lunch',
      'Conference materials and swag',
      'Certificate of attendance',
      'Mobile app for agenda',
      'Post-event resources'
    ],
    targetAudience: 'Business professionals, executives, entrepreneurs, industry leaders'
  },
  {
    title: 'Corporate Team Building Event',
    description: 'Professional team building event template designed to strengthen team relationships and improve collaboration.',
    eventType: 'team-building',
    category: 'business',
    capacity: 100,
    price: 0.00,
    currency: 'USD',
    location: 'Company Headquarters',
    venue: 'Conference Center',
    duration: 4,
    registrationFields: [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', required: false },
      { id: 'department', type: 'select', label: 'Department', required: true, options: ['HR', 'Marketing', 'Sales', 'Engineering', 'Finance', 'Operations', 'Other'] },
      { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 1 }
    ],
    eventSettings: {
      allowWaitlist: false,
      requireApproval: true,
      sendConfirmation: true,
      collectPayment: false,
      earlyBirdDiscount: false,
      groupDiscounts: false,
      cancellationPolicy: 'Notify HR 24 hours in advance'
    },
    features: [
      'Team building activities',
      'Leadership presentations',
      'Group problem-solving exercises',
      'Refreshments and lunch',
      'Team collaboration tools',
      'Professional facilitator'
    ],
    targetAudience: 'Employees, team members, department staff'
  },
  {
    title: 'Educational Workshop',
    description: 'Hands-on learning workshop template with practical exercises, expert instruction, and skill development.',
    eventType: 'workshop',
    category: 'education',
    capacity: 50,
    price: 99.99,
    currency: 'USD',
    location: 'Training Center',
    venue: 'Workshop Room A',
    duration: 6,
    registrationFields: [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', required: false },
      { id: 'experience', type: 'select', label: 'Experience Level', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
      { id: 'goals', type: 'textarea', label: 'Learning Goals', required: false },
      { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 3 }
    ],
    eventSettings: {
      allowWaitlist: true,
      requireApproval: false,
      sendConfirmation: true,
      collectPayment: true,
      earlyBirdDiscount: true,
      groupDiscounts: true,
      cancellationPolicy: 'Full refund up to 14 days before event'
    },
    features: [
      'Hands-on training sessions',
      'Expert instruction and guidance',
      'Practice materials and resources',
      'Certificate of completion',
      'Take-home learning materials',
      'Follow-up support'
    ],
    targetAudience: 'Students, professionals, hobbyists, skill learners'
  },
  {
    title: 'Professional Webinar',
    description: 'Virtual educational webinar template with live presentation, interactive Q&A, and digital resources.',
    eventType: 'webinar',
    category: 'education',
    capacity: 500,
    price: 49.99,
    currency: 'USD',
    location: 'Online',
    venue: 'Virtual Platform',
    duration: 2,
    registrationFields: [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', required: false },
      { id: 'meetingLink', type: 'text', label: 'Preferred Meeting Platform', required: false },
      { id: 'platform', type: 'select', label: 'Platform Experience', required: false, options: ['Zoom', 'Teams', 'WebEx', 'Other', 'None'] },
      { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 5 }
    ],
    eventSettings: {
      allowWaitlist: true,
      requireApproval: false,
      sendConfirmation: true,
      collectPayment: true,
      earlyBirdDiscount: true,
      groupDiscounts: true,
      cancellationPolicy: 'Full refund up to 24 hours before event'
    },
    features: [
      'Live presentation and demonstration',
      'Interactive Q&A session',
      'Screen sharing capabilities',
      'Recording access for attendees',
      'Digital handouts and resources',
      'Follow-up materials'
    ],
    targetAudience: 'Remote learners, professionals, students, online audience'
  },
  {
    title: 'Professional Networking Event',
    description: 'Structured networking event template for professionals to connect, share ideas, and build business relationships.',
    eventType: 'networking',
    category: 'business',
    capacity: 200,
    price: 79.99,
    currency: 'USD',
    location: 'Business District Hotel',
    venue: 'Grand Ballroom',
    duration: 3,
    registrationFields: [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'text', label: 'Phone Number', required: false },
      { id: 'company', type: 'text', label: 'Company/Organization', required: true },
      { id: 'position', type: 'text', label: 'Job Title', required: true },
      { id: 'industry', type: 'select', label: 'Industry', required: true, options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Other'] },
      { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 2 }
    ],
    eventSettings: {
      allowWaitlist: true,
      requireApproval: false,
      sendConfirmation: true,
      collectPayment: true,
      earlyBirdDiscount: true,
      groupDiscounts: true,
      cancellationPolicy: 'Full refund up to 48 hours before event'
    },
    features: [
      'Structured networking sessions',
      'Speed networking activities',
      'Industry-specific breakout groups',
      'Cocktails and appetizers',
      'Business card exchange',
      'Professional photographer',
      'Follow-up networking platform'
    ],
    targetAudience: 'Business professionals, entrepreneurs, industry leaders, sales professionals'
  }
];

// Function to create survey templates
async function createSurveyTemplates() {
  console.log('🌱 Creating survey templates...');
  
  try {
    // Check if supabase is available
    if (typeof window.supabase === 'undefined') {
      throw new Error('Supabase client not found. Please ensure you are on the SurveyGuy application page.');
    }
    
    // Get current user
    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found. Please log in first.');
    }
    
    let createdCount = 0;
    
    for (const template of surveyTemplates) {
      try {
        const { data, error } = await window.supabase
          .from('surveys')
          .insert({
            user_id: user.id,
            title: template.title,
            description: template.description,
            questions: template.questions,
            settings: template.settings,
            status: 'published',
            is_template: true,
            is_public: true,
            template_category: template.category,
            template_industry: template.industry,
            estimated_time: template.estimatedTime,
            target_audience: template.targetAudience,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            published_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error(`❌ Error creating survey template "${template.title}":`, error);
        } else {
          console.log(`✅ Created survey template: "${template.title}"`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Exception creating survey template "${template.title}":`, error);
      }
    }
    
    console.log(`🎉 Survey templates creation completed! Created ${createdCount}/${surveyTemplates.length} templates.`);
    return { success: true, created: createdCount, total: surveyTemplates.length };
    
  } catch (error) {
    console.error('💥 Error creating survey templates:', error);
    return { success: false, error: error.message };
  }
}

// Function to create event templates
async function createEventTemplates() {
  console.log('🌱 Creating event templates...');
  
  try {
    // Check if supabase is available
    if (typeof window.supabase === 'undefined') {
      throw new Error('Supabase client not found. Please ensure you are on the SurveyGuy application page.');
    }
    
    // Get current user
    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found. Please log in first.');
    }
    
    let createdCount = 0;
    
    for (const template of eventTemplates) {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 30); // 30 days from now
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + template.duration);
        
        const { data, error } = await window.supabase
          .from('events')
          .insert({
            user_id: user.id,
            title: template.title,
            description: template.description,
            event_type: template.eventType,
            category: template.category,
            status: 'published',
            is_template: true,
            is_public: true,
            capacity: template.capacity,
            price: template.price,
            currency: template.currency,
            location: template.location,
            venue: template.venue,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            registration_fields: template.registrationFields,
            event_settings: template.eventSettings,
            features: template.features,
            target_audience: template.targetAudience,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error(`❌ Error creating event template "${template.title}":`, error);
        } else {
          console.log(`✅ Created event template: "${template.title}"`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Exception creating event template "${template.title}":`, error);
      }
    }
    
    console.log(`🎉 Event templates creation completed! Created ${createdCount}/${eventTemplates.length} templates.`);
    return { success: true, created: createdCount, total: eventTemplates.length };
    
  } catch (error) {
    console.error('💥 Error creating event templates:', error);
    return { success: false, error: error.message };
  }
}

// Main function to create all templates
async function createAllTemplates() {
  console.log('🚀 Starting professional templates creation...');
  
  const surveyResult = await createSurveyTemplates();
  const eventResult = await createEventTemplates();
  
  console.log('\n📊 Creation Summary:');
  console.log(`📋 Survey Templates: ${surveyResult.created}/${surveyResult.total} created`);
  console.log(`🎪 Event Templates: ${eventResult.created}/${eventResult.total} created`);
  
  const totalCreated = surveyResult.created + eventResult.created;
  const totalTemplates = surveyResult.total + eventResult.total;
  
  if (totalCreated === totalTemplates) {
    console.log(`\n🎉 SUCCESS! All ${totalCreated} professional templates have been created successfully!`);
    console.log('✨ Your Advanced SurveyGuy platform now has a comprehensive library of professional templates.');
    console.log('🔄 Please refresh the page to see the new templates in your template library.');
  } else {
    console.log(`\n⚠️  PARTIAL SUCCESS: ${totalCreated}/${totalTemplates} templates were created.`);
    console.log('Please check the console for any error messages.');
  }
  
  return {
    success: totalCreated === totalTemplates,
    surveyResult,
    eventResult,
    totalCreated,
    totalTemplates
  };
}

// Auto-execute the template creation
console.log('🔧 Professional Templates Creation Script Loaded!');
console.log('📋 Available Functions:');
console.log('   - createAllTemplates() - Create all templates (RECOMMENDED)');
console.log('   - createSurveyTemplates() - Create survey templates only');
console.log('   - createEventTemplates() - Create event templates only');
console.log('');
console.log('🚀 Auto-executing template creation...');

// Execute the main function
createAllTemplates().then(result => {
  if (result.success) {
    console.log('✅ Template creation completed successfully!');
  } else {
    console.log('❌ Template creation completed with errors. Check console for details.');
  }
}).catch(error => {
  console.error('💥 Fatal error during template creation:', error);
});
