// BUILD CUSTOMER FEEDBACK SURVEY VIA API
// Copy and paste this into your browser console when logged in

async function buildCustomerFeedbackSurvey() {
    console.log('🚀 Building Customer Feedback Survey...');
    
    try {
        // Import API and get user
        const api = await import('./src/services/api.js');
        const { supabase } = await import('./src/lib/supabase.js');
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('❌ Please log in first');
            return;
        }
        
        console.log('✅ User authenticated:', user.id);
        
        // Define the comprehensive customer feedback survey
        const customerFeedbackSurvey = {
            title: 'Comprehensive Customer Feedback Survey',
            description: 'Help us improve our products and services by sharing your valuable feedback. This survey takes approximately 5-7 minutes to complete.',
            questions: [
                {
                    id: 'q1',
                    type: 'text',
                    question: 'What is your name? (Optional)',
                    required: false,
                    placeholder: 'Enter your full name',
                    description: 'This helps us personalize our follow-up communication'
                },
                {
                    id: 'q2',
                    type: 'email',
                    question: 'What is your email address?',
                    required: true,
                    placeholder: 'your.email@example.com',
                    description: 'We\'ll use this to send you updates and follow up on your feedback'
                },
                {
                    id: 'q3',
                    type: 'multiple-choice',
                    question: 'How did you first hear about our company?',
                    required: false,
                    options: [
                        'Search engine (Google, Bing, etc.)',
                        'Social media (Facebook, Twitter, LinkedIn)',
                        'Referral from friend/colleague',
                        'Online advertisement',
                        'Industry publication/blog',
                        'Trade show/conference',
                        'Direct mail/email campaign',
                        'Other'
                    ],
                    description: 'This helps us understand our most effective marketing channels'
                },
                {
                    id: 'q4',
                    type: 'rating',
                    question: 'How would you rate your overall experience with our company?',
                    required: true,
                    scale: 5,
                    labels: ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'],
                    description: 'Consider all aspects of your interaction with us'
                },
                {
                    id: 'q5',
                    type: 'matrix',
                    question: 'Please rate the following aspects of our service:',
                    required: true,
                    rows: [
                        'Product/Service Quality',
                        'Customer Service',
                        'Value for Money',
                        'Delivery/Timeliness',
                        'Communication',
                        'Problem Resolution'
                    ],
                    columns: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
                    description: 'Rate each aspect based on your recent experience'
                },
                {
                    id: 'q6',
                    type: 'rating',
                    question: 'How likely are you to recommend our company to a friend or colleague?',
                    required: true,
                    scale: 10,
                    description: '0 = Not at all likely, 10 = Extremely likely (Net Promoter Score)'
                },
                {
                    id: 'q7',
                    type: 'multiple-choice',
                    question: 'How often do you use our product/service?',
                    required: true,
                    options: [
                        'Daily',
                        'Several times a week',
                        'Weekly',
                        'Monthly',
                        'Several times a year',
                        'This is my first time',
                        'I no longer use it'
                    ],
                    description: 'Understanding usage frequency helps us improve our offerings'
                },
                {
                    id: 'q8',
                    type: 'checkbox',
                    question: 'What do you value most about our company? (Select all that apply)',
                    required: false,
                    options: [
                        'High-quality products/services',
                        'Competitive pricing',
                        'Excellent customer service',
                        'Fast delivery/response time',
                        'Innovation and new features',
                        'Reliability and consistency',
                        'User-friendly experience',
                        'Strong company reputation',
                        'Personal relationship with staff',
                        'Other'
                    ],
                    description: 'Help us understand what matters most to our customers'
                },
                {
                    id: 'q9',
                    type: 'checkbox',
                    question: 'What challenges, if any, have you experienced with our product/service? (Select all that apply)',
                    required: false,
                    options: [
                        'Difficult to use/understand',
                        'Too expensive',
                        'Poor customer service',
                        'Slow delivery/response',
                        'Technical issues/bugs',
                        'Missing features I need',
                        'Poor communication',
                        'Billing/payment issues',
                        'No challenges experienced',
                        'Other'
                    ],
                    description: 'Identifying pain points helps us prioritize improvements'
                },
                {
                    id: 'q10',
                    type: 'ranking',
                    question: 'Please rank these improvement areas by priority (most important first):',
                    required: false,
                    options: [
                        'Product Quality Enhancement',
                        'Customer Service Improvement',
                        'Pricing Optimization',
                        'Faster Delivery/Response',
                        'Better Communication',
                        'More Product Features',
                        'Easier User Experience',
                        'Better Documentation/Support'
                    ],
                    description: 'Your priorities help us focus our improvement efforts'
                },
                {
                    id: 'q11',
                    type: 'multiple-choice',
                    question: 'Compared to our competitors, how would you rate our company?',
                    required: false,
                    options: [
                        'Much better than competitors',
                        'Better than competitors',
                        'About the same as competitors',
                        'Worse than competitors',
                        'Much worse than competitors',
                        'I haven\'t used competitors',
                        'I don\'t know of any competitors'
                    ],
                    description: 'Competitive positioning helps us understand our market position'
                },
                {
                    id: 'q12',
                    type: 'multiple-choice',
                    question: 'How likely are you to purchase from us again?',
                    required: false,
                    options: [
                        'Definitely will purchase again',
                        'Probably will purchase again',
                        'Might or might not purchase again',
                        'Probably will not purchase again',
                        'Definitely will not purchase again',
                        'Not applicable/One-time purchase'
                    ],
                    description: 'Future purchase intent helps us predict customer retention'
                },
                {
                    id: 'q13',
                    type: 'textarea',
                    question: 'What is the ONE thing we could do to improve your experience?',
                    required: false,
                    placeholder: 'Please share your most important suggestion for improvement...',
                    maxLength: 500,
                    description: 'Your top improvement suggestion helps us prioritize changes'
                },
                {
                    id: 'q14',
                    type: 'textarea',
                    question: 'Is there anything else you would like us to know?',
                    required: false,
                    placeholder: 'Any additional comments, suggestions, or feedback...',
                    maxLength: 1000,
                    description: 'Share any other thoughts or feedback you have'
                },
                {
                    id: 'q15',
                    type: 'boolean',
                    question: 'Would you be interested in participating in future product research or beta testing?',
                    required: false,
                    trueLabel: 'Yes, I\'m interested',
                    falseLabel: 'No, thank you',
                    description: 'Help us improve by participating in product development'
                }
            ],
            settings: {
                allowAnonymous: true,
                showProgressBar: true,
                oneQuestionPerPage: false,
                allowBack: true,
                randomizeQuestions: false,
                collectIP: false,
                requireCompletion: false,
                thankYouMessage: 'Thank you for your valuable feedback! Your responses help us continuously improve our products and services.',
                redirectUrl: null,
                estimatedTime: '5-7 minutes',
                theme: {
                    primaryColor: '#3B82F6',
                    backgroundColor: '#F8FAFC',
                    textColor: '#1F2937'
                }
            },
            status: 'published',
            is_active: true,
            template_category: 'customer-feedback'
        };
        
        console.log('📝 Creating comprehensive customer feedback survey...');
        
        // Create the survey
        const result = await api.default.surveys.createSurvey(user.id, customerFeedbackSurvey);
        
        if (result.error) {
            console.error('❌ Failed to create survey:', result.error);
            return;
        }
        
        console.log('✅ Survey created successfully!');
        console.log('📊 Survey Details:');
        console.log('- ID:', result.survey.id);
        console.log('- Title:', result.survey.title);
        console.log('- Questions:', result.survey.questions.length);
        console.log('- Status:', result.survey.status);
        
        // Publish the survey
        console.log('📤 Publishing survey...');
        const publishResult = await api.default.surveys.publishSurvey(result.survey.id);
        
        if (publishResult.error) {
            console.error('❌ Failed to publish survey:', publishResult.error);
        } else {
            console.log('✅ Survey published successfully!');
            
            const surveyUrl = `${window.location.origin}/survey/${result.survey.id}`;
            console.log('🌐 Public URL:', surveyUrl);
            
            // Copy URL to clipboard
            try {
                await navigator.clipboard.writeText(surveyUrl);
                console.log('📋 Survey URL copied to clipboard!');
            } catch (clipError) {
                console.log('⚠️ Could not copy to clipboard:', clipError);
            }
        }
        
        return {
            success: true,
            survey: result.survey,
            url: `${window.location.origin}/survey/${result.survey.id}`
        };
        
    } catch (error) {
        console.error('💥 Survey creation failed:', error);
        return { error: error.message };
    }
}

// Auto-run the function
buildCustomerFeedbackSurvey().then(result => {
    if (result.error) {
        console.log('❌ Failed to build survey:', result.error);
        alert('Failed to build Customer Feedback Survey. Check console for details.');
    } else if (result.success) {
        console.log('🎉 Customer Feedback Survey built successfully!');
        alert(`Customer Feedback Survey created!\n\nTitle: ${result.survey.title}\nQuestions: ${result.survey.questions.length}\nURL: ${result.url}\n\nURL has been copied to clipboard. Check your Published Surveys page!`);
    }
});
