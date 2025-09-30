// CREATE SURVEY TEMPLATES VIA BROWSER API
// Copy and paste this into your browser console when logged in

async function createSurveyTemplates() {
    console.log('🚀 Creating Survey Templates...');
    
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
        
        // Define survey templates
        const templates = [
            // Customer Feedback Templates
            {
                title: 'Basic Customer Satisfaction Survey',
                description: 'A simple 5-question survey to measure customer satisfaction and gather improvement suggestions.',
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
                ],
                category: 'customer-feedback',
                estimatedTime: '2-3 minutes'
            },
            
            {
                title: 'Post-Purchase Feedback Survey',
                description: 'Collect feedback immediately after purchase to understand the buying experience and product satisfaction.',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'How easy was it to find what you were looking for?',
                        required: true,
                        scale: 5,
                        labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'How was the checkout process?',
                        required: true,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'Product/service satisfaction',
                        required: true,
                        scale: 5,
                        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                    },
                    {
                        id: 'q4',
                        type: 'rating',
                        question: 'Value for money',
                        required: true,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
                    },
                    {
                        id: 'q5',
                        type: 'rating',
                        question: 'Likelihood to recommend',
                        required: true,
                        scale: 10,
                        description: '0 = Not likely, 10 = Extremely likely'
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
                category: 'customer-feedback',
                estimatedTime: '3-4 minutes'
            },
            
            {
                title: 'Customer Service Experience Survey',
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
                        type: 'rating',
                        question: 'Ease of reaching support',
                        required: true,
                        scale: 5,
                        labels: ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'Quality of service received',
                        required: true,
                        scale: 5,
                        labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
                    },
                    {
                        id: 'q4',
                        type: 'rating',
                        question: 'How well was your issue resolved?',
                        required: true,
                        scale: 5,
                        labels: ['Not resolved', 'Partially resolved', 'Adequately resolved', 'Well resolved', 'Completely resolved']
                    },
                    {
                        id: 'q5',
                        type: 'rating',
                        question: 'Overall satisfaction with support',
                        required: true,
                        scale: 5,
                        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                    },
                    {
                        id: 'q6',
                        type: 'text',
                        question: 'How can we improve our support?',
                        required: false,
                        placeholder: 'Your suggestions...'
                    }
                ],
                category: 'customer-feedback',
                estimatedTime: '2-3 minutes'
            },
            
            // Employee Survey Template
            {
                title: 'Employee Satisfaction Survey',
                description: 'Measure employee satisfaction, engagement, and workplace culture.',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'Job satisfaction rating',
                        required: true,
                        scale: 5,
                        labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'Work-life balance rating',
                        required: true,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'Manager effectiveness',
                        required: false,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
                    },
                    {
                        id: 'q4',
                        type: 'rating',
                        question: 'Company culture rating',
                        required: true,
                        scale: 5,
                        labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
                    },
                    {
                        id: 'q5',
                        type: 'rating',
                        question: 'Likelihood to recommend as workplace',
                        required: true,
                        scale: 10,
                        description: '0 = Not likely, 10 = Extremely likely'
                    },
                    {
                        id: 'q6',
                        type: 'text',
                        question: 'What do you like most about working here?',
                        required: false,
                        placeholder: 'What we do well...'
                    },
                    {
                        id: 'q7',
                        type: 'text',
                        question: 'What should we improve?',
                        required: false,
                        placeholder: 'Areas for improvement...'
                    }
                ],
                category: 'employee-survey',
                estimatedTime: '3-4 minutes'
            },
            
            // Event Feedback Template
            {
                title: 'Event Feedback Survey',
                description: 'Collect attendee feedback to improve future events and measure event success.',
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
                        question: 'Content quality',
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
                        type: 'text',
                        question: 'Suggestions for future events',
                        required: false,
                        placeholder: 'Ideas for improvement...'
                    }
                ],
                category: 'event-feedback',
                estimatedTime: '2-3 minutes'
            }
        ];
        
        console.log(`📝 Creating ${templates.length} survey templates...`);
        
        const results = [];
        
        // Create each template
        for (const template of templates) {
            try {
                console.log(`📋 Creating: ${template.title}`);
                
                // Prepare template data
                const templateData = {
                    title: template.title,
                    description: template.description,
                    questions: template.questions,
                    settings: {
                        allowAnonymous: true,
                        showProgressBar: true,
                        oneQuestionPerPage: false,
                        allowBack: true,
                        thankYouMessage: `Thank you for completing the ${template.title}!`,
                        estimatedTime: template.estimatedTime
                    },
                    is_template: true,
                    is_public: true,
                    template_category: template.category || 'general'
                };
                
                // Create template using the template API
                const result = await api.default.templates.createTemplate(user.id, templateData);
                
                if (result.error) {
                    console.error(`❌ Failed to create ${template.title}:`, result.error);
                    results.push({ name: template.title, success: false, error: result.error });
                } else {
                    console.log(`✅ Created: ${template.title}`);
                    results.push({ 
                        name: template.title, 
                        success: true, 
                        id: result.template.id,
                        questions: result.template.questions.length,
                        category: template.category
                    });
                }
                
                // Small delay between creations
                await new Promise(resolve => setTimeout(resolve, 300));
                
            } catch (error) {
                console.error(`💥 Exception creating ${template.title}:`, error);
                results.push({ name: template.title, success: false, error: error.message });
            }
        }
        
        // Summary
        console.log('🎯 Template creation complete!');
        console.log('📊 Results:');
        
        const successCount = results.filter(r => r.success).length;
        const customerFeedbackCount = results.filter(r => r.success && r.category === 'customer-feedback').length;
        
        results.forEach(result => {
            if (result.success) {
                console.log(`✅ ${result.name}: ${result.questions} questions (${result.category})`);
            } else {
                console.log(`❌ ${result.name}: ${result.error}`);
            }
        });
        
        console.log(`\n🎉 Created ${successCount} templates successfully!`);
        console.log(`📊 Customer Feedback Templates: ${customerFeedbackCount}`);
        
        if (successCount > 0) {
            alert(`Survey Templates Created!\n\n✅ Total: ${successCount} templates\n📊 Customer Feedback: ${customerFeedbackCount} templates\n\nRefresh the Survey Templates page to see them!`);
        }
        
        return results;
        
    } catch (error) {
        console.error('💥 Template creation failed:', error);
        alert('Failed to create templates. Please ensure you are logged in and try again.');
        return { error: error.message };
    }
}

// Auto-run the function
createSurveyTemplates();
