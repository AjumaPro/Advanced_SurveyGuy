// CREATE CUSTOMER FEEDBACK SURVEYS VIA BROWSER API
// This method automatically handles authentication
// Copy and paste this into your browser console when logged in to your app

async function createCustomerFeedbackSurveys() {
    console.log('🚀 Creating Customer Feedback Surveys via API...');
    
    try {
        // Import API and check authentication
        const api = await import('./src/services/api.js');
        const { supabase } = await import('./src/lib/supabase.js');
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('❌ Authentication failed. Please log in to your app first.');
            alert('Please log in to your SurveyGuy app first, then run this script.');
            return;
        }
        
        console.log('✅ User authenticated:', user.email, user.id);
        
        // Survey 1: Comprehensive Customer Feedback
        const comprehensiveSurvey = {
            title: 'Comprehensive Customer Feedback Survey',
            description: 'Help us improve our products and services by sharing your valuable feedback. This survey takes approximately 5-7 minutes to complete.',
            questions: [
                {
                    id: 'q1',
                    type: 'text',
                    question: 'What is your name? (Optional)',
                    required: false,
                    placeholder: 'Enter your full name'
                },
                {
                    id: 'q2',
                    type: 'email',
                    question: 'What is your email address?',
                    required: true,
                    placeholder: 'your.email@example.com'
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
                    ]
                },
                {
                    id: 'q4',
                    type: 'rating',
                    question: 'How would you rate your overall experience with our company?',
                    required: true,
                    scale: 5,
                    labels: ['Terrible', 'Poor', 'Average', 'Good', 'Excellent']
                },
                {
                    id: 'q5',
                    type: 'multiple-choice',
                    question: 'Please rate our product/service quality:',
                    required: true,
                    options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
                },
                {
                    id: 'q6',
                    type: 'rating',
                    question: 'How likely are you to recommend our company to a friend or colleague?',
                    required: true,
                    scale: 10,
                    description: '0 = Not at all likely, 10 = Extremely likely'
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
                    ]
                },
                {
                    id: 'q8',
                    type: 'multiple-choice',
                    question: 'What do you value most about our company?',
                    required: false,
                    options: [
                        'High-quality products/services',
                        'Competitive pricing',
                        'Excellent customer service',
                        'Fast delivery/response time',
                        'Innovation and new features',
                        'Reliability and consistency',
                        'User-friendly experience',
                        'Strong company reputation'
                    ]
                },
                {
                    id: 'q9',
                    type: 'text',
                    question: 'What is the ONE thing we could do to improve your experience?',
                    required: false,
                    placeholder: 'Your most important suggestion...'
                },
                {
                    id: 'q10',
                    type: 'text',
                    question: 'Any additional comments or feedback?',
                    required: false,
                    placeholder: 'Share any other thoughts...'
                }
            ],
            settings: {
                allowAnonymous: true,
                showProgressBar: true,
                oneQuestionPerPage: false,
                allowBack: true,
                thankYouMessage: 'Thank you for your valuable feedback!',
                estimatedTime: '5-7 minutes'
            },
            status: 'draft'
        };

        // Survey 2: Quick Feedback
        const quickSurvey = {
            title: 'Quick Customer Feedback Survey',
            description: 'A brief 3-minute survey to help us improve our service.',
            questions: [
                {
                    id: 'q1',
                    type: 'rating',
                    question: 'How satisfied are you with our product/service?',
                    required: true,
                    scale: 5,
                    labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                },
                {
                    id: 'q2',
                    type: 'rating',
                    question: 'How likely are you to recommend us to others?',
                    required: true,
                    scale: 10,
                    description: '0 = Not at all likely, 10 = Extremely likely'
                },
                {
                    id: 'q3',
                    type: 'multiple-choice',
                    question: 'What is the main reason for your rating?',
                    required: false,
                    options: [
                        'Excellent product quality',
                        'Great customer service',
                        'Good value for money',
                        'Easy to use',
                        'Fast delivery/service',
                        'Met my expectations',
                        'Product issues/problems',
                        'Poor customer service',
                        'Too expensive',
                        'Difficult to use'
                    ]
                },
                {
                    id: 'q4',
                    type: 'text',
                    question: 'What is the ONE thing we could do better?',
                    required: false,
                    placeholder: 'Your most important suggestion...'
                },
                {
                    id: 'q5',
                    type: 'email',
                    question: 'Email address (optional - for follow-up)',
                    required: false,
                    placeholder: 'your.email@example.com'
                }
            ],
            settings: {
                allowAnonymous: true,
                showProgressBar: true,
                oneQuestionPerPage: true,
                allowBack: true,
                thankYouMessage: 'Thank you! Your feedback helps us improve.',
                estimatedTime: '2-3 minutes'
            },
            status: 'draft'
        };

        // Survey 3: Customer Service
        const serviceSurvey = {
            title: 'Customer Service Experience Survey',
            description: 'Help us improve our customer service by sharing your recent support experience.',
            questions: [
                {
                    id: 'q1',
                    type: 'multiple-choice',
                    question: 'How did you contact our customer service?',
                    required: true,
                    options: ['Phone call', 'Email', 'Live chat', 'Contact form', 'Social media', 'In-person']
                },
                {
                    id: 'q2',
                    type: 'multiple-choice',
                    question: 'What was the main reason for contacting us?',
                    required: true,
                    options: ['Product question', 'Technical support', 'Billing issue', 'Order inquiry', 'Complaint', 'Return/refund', 'General info']
                },
                {
                    id: 'q3',
                    type: 'rating',
                    question: 'How easy was it to reach our customer service?',
                    required: true,
                    scale: 5,
                    labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
                },
                {
                    id: 'q4',
                    type: 'rating',
                    question: 'How would you rate our customer service representative?',
                    required: true,
                    scale: 5,
                    labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
                },
                {
                    id: 'q5',
                    type: 'rating',
                    question: 'How well was your issue resolved?',
                    required: true,
                    scale: 5,
                    labels: ['Not Resolved', 'Partially Resolved', 'Adequately Resolved', 'Well Resolved', 'Completely Resolved']
                },
                {
                    id: 'q6',
                    type: 'rating',
                    question: 'Overall customer service satisfaction?',
                    required: true,
                    scale: 5,
                    labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                },
                {
                    id: 'q7',
                    type: 'text',
                    question: 'How could we improve our customer service?',
                    required: false,
                    placeholder: 'Your suggestions for improvement...'
                }
            ],
            settings: {
                allowAnonymous: true,
                showProgressBar: true,
                oneQuestionPerPage: false,
                allowBack: true,
                thankYouMessage: 'Thank you for helping us improve our customer service!',
                estimatedTime: '3-4 minutes'
            },
            status: 'draft'
        };

        const surveys = [
            { name: 'Comprehensive', data: comprehensiveSurvey },
            { name: 'Quick', data: quickSurvey },
            { name: 'Customer Service', data: serviceSurvey }
        ];

        const results = [];

        // Create each survey
        for (const survey of surveys) {
            console.log(`📝 Creating ${survey.name} survey...`);
            
            try {
                const result = await api.default.surveys.createSurvey(user.id, survey.data);
                
                if (result.error) {
                    console.error(`❌ Failed to create ${survey.name}:`, result.error);
                    results.push({ name: survey.name, success: false, error: result.error });
                    continue;
                }
                
                console.log(`✅ ${survey.name} created successfully!`);
                
                // Publish the survey
                console.log(`📤 Publishing ${survey.name}...`);
                const publishResult = await api.default.surveys.publishSurvey(result.survey.id);
                
                if (publishResult.error) {
                    console.error(`❌ Failed to publish ${survey.name}:`, publishResult.error);
                    results.push({ 
                        name: survey.name, 
                        success: true, 
                        published: false, 
                        id: result.survey.id,
                        error: publishResult.error 
                    });
                } else {
                    console.log(`✅ ${survey.name} published successfully!`);
                    const surveyUrl = `${window.location.origin}/survey/${result.survey.id}`;
                    console.log(`🌐 Public URL: ${surveyUrl}`);
                    
                    results.push({ 
                        name: survey.name, 
                        success: true, 
                        published: true, 
                        id: result.survey.id,
                        url: surveyUrl,
                        questions: result.survey.questions.length
                    });
                }
                
                // Small delay between surveys
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`💥 Exception creating ${survey.name}:`, error);
                results.push({ name: survey.name, success: false, error: error.message });
            }
        }
        
        // Summary
        console.log('🎯 Survey creation complete!');
        console.log('📊 Results summary:');
        
        results.forEach(result => {
            if (result.success) {
                console.log(`✅ ${result.name}: Created (${result.questions} questions) ${result.published ? '& Published' : '- Draft only'}`);
                if (result.url) {
                    console.log(`   🌐 URL: ${result.url}`);
                }
            } else {
                console.log(`❌ ${result.name}: Failed - ${result.error}`);
            }
        });
        
        const successCount = results.filter(r => r.success).length;
        const publishedCount = results.filter(r => r.published).length;
        
        if (successCount > 0) {
            alert(`Customer Feedback Surveys Created!\n\nCreated: ${successCount} surveys\nPublished: ${publishedCount} surveys\n\nCheck your Published Surveys page to see them!`);
        }
        
        return results;
        
    } catch (error) {
        console.error('💥 Survey creation failed:', error);
        alert('Failed to create surveys. Make sure you are logged in and try again.');
        return { error: error.message };
    }
}

// Auto-run the function
createCustomerFeedbackSurveys();
