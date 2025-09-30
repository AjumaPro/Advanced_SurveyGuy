// CREATE CUSTOMER FEEDBACK SURVEYS AS TEMPLATES
// Copy and paste this into your browser console when logged in
// This creates regular surveys that can be used as templates

async function createCustomerFeedbackTemplates() {
    console.log('🚀 Creating Customer Feedback Template Surveys...');
    
    try {
        // Import API and check authentication
        const api = await import('./src/services/api.js');
        const { supabase } = await import('./src/lib/supabase.js');
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('❌ Please log in first');
            alert('Please log in to your SurveyGuy app first, then run this script.');
            return;
        }
        
        console.log('✅ User authenticated:', user.email);
        
        // Define customer feedback template surveys
        const templates = [
            {
                title: '📊 Customer Satisfaction Survey Template',
                description: 'A comprehensive customer satisfaction survey template. Duplicate this to create your own customer feedback surveys.',
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
                        question: 'What did you like most about your experience?',
                        required: false,
                        options: ['Product quality', 'Customer service', 'Value for money', 'Ease of use', 'Fast delivery', 'Professional staff', 'Other']
                    },
                    {
                        id: 'q4',
                        type: 'multiple-choice',
                        question: 'How did you hear about us?',
                        required: false,
                        options: ['Google search', 'Social media', 'Friend referral', 'Advertisement', 'Blog/article', 'Other']
                    },
                    {
                        id: 'q5',
                        type: 'text',
                        question: 'What could we improve?',
                        required: false,
                        placeholder: 'Your suggestions help us get better...'
                    },
                    {
                        id: 'q6',
                        type: 'email',
                        question: 'Email (optional - for follow-up)',
                        required: false,
                        placeholder: 'your.email@example.com'
                    }
                ],
                estimatedTime: '3-4 minutes'
            },
            
            {
                title: '⚡ Quick NPS Survey Template',
                description: 'A simple Net Promoter Score survey template for measuring customer loyalty.',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'How likely are you to recommend our company to a friend or colleague?',
                        required: true,
                        scale: 10,
                        description: '0 = Not at all likely, 10 = Extremely likely'
                    },
                    {
                        id: 'q2',
                        type: 'text',
                        question: 'What is the primary reason for your score?',
                        required: false,
                        placeholder: 'Please explain your rating...'
                    },
                    {
                        id: 'q3',
                        type: 'text',
                        question: 'What could we do to improve your experience?',
                        required: false,
                        placeholder: 'Your suggestions for improvement...'
                    }
                ],
                estimatedTime: '1-2 minutes'
            },
            
            {
                title: '🛒 Post-Purchase Feedback Template',
                description: 'Collect feedback about the purchase experience and product satisfaction.',
                questions: [
                    {
                        id: 'q1',
                        type: 'text',
                        question: 'Order number (if available)',
                        required: false,
                        placeholder: 'e.g., ORD-12345'
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'How easy was it to find what you were looking for?',
                        required: true,
                        scale: 5,
                        labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'How was the checkout process?',
                        required: true,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
                    },
                    {
                        id: 'q4',
                        type: 'rating',
                        question: 'How satisfied are you with your purchase?',
                        required: true,
                        scale: 5,
                        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                    },
                    {
                        id: 'q5',
                        type: 'rating',
                        question: 'Value for money rating',
                        required: true,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
                    },
                    {
                        id: 'q6',
                        type: 'multiple-choice',
                        question: 'Will you purchase from us again?',
                        required: false,
                        options: ['Definitely', 'Probably', 'Maybe', 'Probably not', 'Definitely not']
                    },
                    {
                        id: 'q7',
                        type: 'text',
                        question: 'What did we do well?',
                        required: false,
                        placeholder: 'Tell us what you liked...'
                    },
                    {
                        id: 'q8',
                        type: 'text',
                        question: 'What could we improve?',
                        required: false,
                        placeholder: 'Your suggestions...'
                    }
                ],
                estimatedTime: '3-4 minutes'
            },
            
            {
                title: '📞 Customer Service Feedback Template',
                description: 'Evaluate customer service interactions to improve support quality.',
                questions: [
                    {
                        id: 'q1',
                        type: 'multiple-choice',
                        question: 'How did you contact our support?',
                        required: true,
                        options: ['Phone', 'Email', 'Live chat', 'Website form', 'Social media', 'In-person']
                    },
                    {
                        id: 'q2',
                        type: 'multiple-choice',
                        question: 'What was the main reason for contacting us?',
                        required: true,
                        options: ['Product question', 'Technical issue', 'Billing question', 'Order inquiry', 'Complaint', 'Return/refund', 'General info']
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'How easy was it to reach support?',
                        required: true,
                        scale: 5,
                        labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
                    },
                    {
                        id: 'q4',
                        type: 'rating',
                        question: 'Quality of service received',
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
                        labels: ['Not resolved', 'Partially resolved', 'Adequately resolved', 'Well resolved', 'Completely resolved']
                    },
                    {
                        id: 'q6',
                        type: 'rating',
                        question: 'Overall satisfaction with support',
                        required: true,
                        scale: 5,
                        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                    },
                    {
                        id: 'q7',
                        type: 'text',
                        question: 'How can we improve our support?',
                        required: false,
                        placeholder: 'Your suggestions...'
                    }
                ],
                estimatedTime: '3-4 minutes'
            },
            
            {
                title: '🌐 Website Experience Template',
                description: 'Collect feedback about website usability and user experience.',
                questions: [
                    {
                        id: 'q1',
                        type: 'multiple-choice',
                        question: 'What brought you to our website?',
                        required: true,
                        options: ['Browse products', 'Make purchase', 'Get support', 'Find contact info', 'Read content', 'Compare prices']
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'How easy was it to find what you needed?',
                        required: true,
                        scale: 5,
                        labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'Website design and layout rating',
                        required: true,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
                    },
                    {
                        id: 'q4',
                        type: 'rating',
                        question: 'Website loading speed',
                        required: true,
                        scale: 5,
                        labels: ['Very Slow', 'Slow', 'Average', 'Fast', 'Very Fast']
                    },
                    {
                        id: 'q5',
                        type: 'boolean',
                        question: 'Did you complete what you came to do?',
                        required: true,
                        trueLabel: 'Yes, completed successfully',
                        falseLabel: 'No, could not complete'
                    },
                    {
                        id: 'q6',
                        type: 'text',
                        question: 'How can we improve our website?',
                        required: false,
                        placeholder: 'Your suggestions for improvement...'
                    }
                ],
                estimatedTime: '2-3 minutes'
            }
        ];
        
        console.log(`📝 Creating ${templates.length} template surveys...`);\n        \n        const results = [];\n        \n        // Create each template as a regular survey\n        for (const template of templates) {\n            try {\n                console.log(`📋 Creating: ${template.title}`);\n                \n                const surveyData = {\n                    title: template.title,\n                    description: template.description,\n                    questions: template.questions,\n                    settings: {\n                        allowAnonymous: true,\n                        showProgressBar: true,\n                        oneQuestionPerPage: false,\n                        allowBack: true,\n                        thankYouMessage: `Thank you for completing the ${template.title}!`,\n                        estimatedTime: template.estimatedTime\n                    },\n                    status: 'published'\n                };\n                \n                const result = await api.surveys.createSurvey(user.id, surveyData);\n                \n                if (result.error) {\n                    console.error(`❌ Failed to create ${template.title}:`, result.error);\n                    results.push({ name: template.title, success: false, error: result.error });\n                } else {\n                    console.log(`✅ Created: ${template.title}`);\n                    \n                    // Publish the survey\n                    const publishResult = await api.surveys.publishSurvey(result.survey.id);\n                    \n                    if (publishResult.error) {\n                        console.error(`❌ Failed to publish ${template.title}`);\n                        results.push({ \n                            name: template.title, \n                            success: true, \n                            published: false, \n                            id: result.survey.id \n                        });\n                    } else {\n                        const surveyUrl = `${window.location.origin}/survey/${result.survey.id}`;\n                        results.push({ \n                            name: template.title, \n                            success: true, \n                            published: true, \n                            id: result.survey.id,\n                            url: surveyUrl,\n                            questions: result.survey.questions.length\n                        });\n                    }\n                }\n                \n                // Small delay between creations\n                await new Promise(resolve => setTimeout(resolve, 300));\n                \n            } catch (error) {\n                console.error(`💥 Exception creating ${template.title}:`, error);\n                results.push({ name: template.title, success: false, error: error.message });\n            }\n        }\n        \n        // Summary\n        console.log('🎯 Template creation complete!');\n        console.log('📊 Results:');\n        \n        const successCount = results.filter(r => r.success).length;\n        const publishedCount = results.filter(r => r.published).length;\n        \n        results.forEach(result => {\n            if (result.success) {\n                console.log(`✅ ${result.name}: ${result.questions} questions ${result.published ? '(Published)' : '(Draft)'}`);\n                if (result.url) {\n                    console.log(`   🌐 URL: ${result.url}`);\n                }\n            } else {\n                console.log(`❌ ${result.name}: ${result.error}`);\n            }\n        });\n        \n        if (successCount > 0) {\n            alert(`Customer Feedback Templates Created!\n\n✅ Created: ${successCount} template surveys\n📊 Published: ${publishedCount} surveys\n\nThese surveys can be used as templates by duplicating them.\nCheck your Published Surveys page to see them!`);\n        }\n        \n        return results;\n        \n    } catch (error) {\n        console.error('💥 Template creation failed:', error);\n        alert('Failed to create templates. Please ensure you are logged in and try again.');\n        return { error: error.message };\n    }\n}\n\n// Auto-run the function\ncreateCustomerFeedbackTemplates();
