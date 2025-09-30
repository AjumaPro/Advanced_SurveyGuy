// INSTANT CUSTOMER FEEDBACK TEMPLATES - BROWSER METHOD
// This bypasses all database structure issues
// Copy and paste this into your browser console when logged in

async function createInstantCustomerTemplates() {
    console.log('🚀 Creating Customer Feedback Templates (Browser Method)...');
    
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
        
        console.log('✅ User authenticated:', user.id);
        
        // Define 5 customer feedback templates
        const customerFeedbackTemplates = [
            {
                title: '📊 [TEMPLATE] Customer Satisfaction Survey',
                description: '⭐ TEMPLATE: Basic customer satisfaction survey. Duplicate this to create your own surveys. Measures satisfaction, NPS, and collects improvement suggestions.',
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
                        type: 'text',
                        question: 'What could we improve?',
                        required: false,
                        placeholder: 'Your suggestions help us get better...'
                    },
                    {
                        id: 'q5',
                        type: 'email',
                        question: 'Email (optional - for follow-up)',
                        required: false,
                        placeholder: 'your.email@example.com'
                    }
                ]
            },
            
            {
                title: '⚡ [TEMPLATE] Quick NPS Survey',
                description: '⭐ TEMPLATE: Simple Net Promoter Score survey. Perfect for measuring customer loyalty quickly.',
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
                        question: 'What could we do to improve?',
                        required: false,
                        placeholder: 'Your suggestions for improvement...'
                    }
                ]
            },
            
            {
                title: '🛒 [TEMPLATE] Post-Purchase Feedback',
                description: '⭐ TEMPLATE: Post-purchase experience survey. Collect feedback about the buying process and product satisfaction.',
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
                ]
            },
            
            {
                title: '📞 [TEMPLATE] Customer Service Feedback',
                description: '⭐ TEMPLATE: Customer service evaluation survey. Measure support quality and identify improvement areas.',
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
                ]
            },
            
            {
                title: '🌐 [TEMPLATE] Website Experience Survey',
                description: '⭐ TEMPLATE: Website usability and user experience survey. Optimize your digital presence.',
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
                ]
            }
        ];
        
        console.log(`📝 Creating ${customerFeedbackTemplates.length} customer feedback templates...`);
        
        const results = [];
        
        // Create each template as a regular survey
        for (const template of customerFeedbackTemplates) {
            try {
                console.log(`📋 Creating: ${template.title}`);
                
                const surveyData = {
                    title: template.title,
                    description: template.description,
                    questions: template.questions,
                    settings: {
                        allowAnonymous: true,
                        showProgressBar: true,
                        oneQuestionPerPage: false,
                        allowBack: true,
                        thankYouMessage: 'Thank you for your feedback! This helps us improve our services.',
                        estimatedTime: '3-4 minutes'
                    },
                    status: 'draft' // Create as draft first
                };
                
                const result = await api.default.surveys.createSurvey(user.id, surveyData);
                
                if (result.error) {
                    console.error(`❌ Failed to create ${template.title}:`, result.error);
                    results.push({ name: template.title, success: false, error: result.error });
                } else {
                    console.log(`✅ Created: ${template.title}`);
                    
                    // Publish the template survey
                    const publishResult = await api.default.surveys.publishSurvey(result.survey.id);
                    
                    if (publishResult.error) {
                        console.warn(`⚠️ Created but could not publish ${template.title}`);
                        results.push({ 
                            name: template.title, 
                            success: true, 
                            published: false, 
                            id: result.survey.id,
                            questions: result.survey.questions.length,
                            status: 'draft'
                        });
                    } else {
                        const surveyUrl = `${window.location.origin}/survey/${result.survey.id}`;
                        console.log(`🌐 Published: ${surveyUrl}`);
                        
                        results.push({ 
                            name: template.title, 
                            success: true, 
                            published: true, 
                            id: result.survey.id,
                            url: surveyUrl,
                            questions: result.survey.questions.length,
                            status: 'published'
                        });
                    }
                }
                
                // Small delay between creations
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`💥 Exception creating ${template.title}:`, error);
                results.push({ name: template.title, success: false, error: error.message });
            }
        }
        
        // Summary
        console.log('🎯 Customer Feedback Template creation complete!');
        console.log('📊 Results Summary:');
        
        const successCount = results.filter(r => r.success).length;
        const publishedCount = results.filter(r => r.published).length;
        const draftCount = results.filter(r => r.success && !r.published).length;
        
        console.log(`✅ Successfully created: ${successCount} templates`);
        console.log(`📊 Published: ${publishedCount} templates`);
        console.log(`📝 Drafts: ${draftCount} templates`);
        
        console.log('\n📋 Template Details:');
        results.forEach((result, index) => {
            if (result.success) {
                console.log(`${index + 1}. ✅ ${result.name}`);
                console.log(`   📊 Questions: ${result.questions}`);
                console.log(`   📋 Status: ${result.status}`);
                if (result.url) {
                    console.log(`   🌐 URL: ${result.url}`);
                }
                console.log('');
            } else {
                console.log(`${index + 1}. ❌ ${result.name}: ${result.error}`);
            }
        });
        
        // Instructions for use
        console.log('📖 HOW TO USE THESE TEMPLATES:');
        console.log('1. Go to your Published Surveys page');
        console.log('2. Find surveys with [TEMPLATE] in the title');
        console.log('3. Click "Duplicate" to create a copy');
        console.log('4. Edit the copy to customize for your needs');
        console.log('5. Publish when ready for customers');
        
        if (successCount > 0) {
            alert(`🎉 Customer Feedback Templates Created!\n\n✅ Created: ${successCount} template surveys\n📊 Published: ${publishedCount} surveys\n📝 Drafts: ${draftCount} surveys\n\nThese surveys are marked with [TEMPLATE] in their titles.\nGo to Published Surveys page to see them.\n\nTo use: Click "Duplicate" on any template to create your own copy!`);
        }
        
        return {
            success: successCount,
            published: publishedCount,
            drafts: draftCount,
            results: results
        };
        
    } catch (error) {
        console.error('💥 Template creation failed:', error);
        alert('Failed to create templates. Please ensure you are logged in and try again.');
        return { error: error.message };
    }
}

// Auto-run the function
createInstantCustomerTemplates();
