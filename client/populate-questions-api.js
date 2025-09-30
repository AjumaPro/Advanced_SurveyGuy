// POPULATE QUESTION LIBRARY VIA API
// Copy and paste this into your browser console when logged in

async function populateQuestionLibrary() {
    console.log('🚀 Starting Question Library population...');
    
    try {
        // Import API
        const api = await import('./src/services/api.js');
        const { useAuth } = await import('./src/contexts/AuthContext.js');
        
        // Get current user (you need to be logged in)
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('❌ Please log in first');
            return;
        }
        
        console.log('✅ User authenticated:', user.id);
        
        // Define sample questions
        const sampleQuestions = [
            // General Questions
            {
                name: 'Basic Name Question',
                description: 'Simple text input for collecting names',
                category: 'general',
                tags: ['name', 'text', 'basic'],
                isPublic: true,
                type: 'text',
                question: 'What is your name?',
                required: true,
                placeholder: 'Enter your full name'
            },
            {
                name: 'Email Address',
                description: 'Email input with validation',
                category: 'general',
                tags: ['email', 'contact', 'required'],
                isPublic: true,
                type: 'email',
                question: 'What is your email address?',
                required: true,
                placeholder: 'your.email@example.com'
            },
            {
                name: 'Age Range',
                description: 'Multiple choice age demographics',
                category: 'general',
                tags: ['age', 'demographics', 'multiple-choice'],
                isPublic: true,
                type: 'multiple-choice',
                question: 'What is your age range?',
                required: false,
                options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
            },
            
            // Customer Feedback Questions
            {
                name: 'Overall Satisfaction',
                description: 'Standard satisfaction rating',
                category: 'customer-feedback',
                tags: ['satisfaction', 'rating', '5-point'],
                isPublic: true,
                type: 'rating',
                question: 'How satisfied are you with our product/service?',
                required: true,
                scale: 5,
                labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
            },
            {
                name: 'Net Promoter Score',
                description: 'Standard NPS question',
                category: 'customer-feedback',
                tags: ['nps', 'recommendation', '10-point'],
                isPublic: true,
                type: 'rating',
                question: 'How likely are you to recommend us to a friend or colleague?',
                required: true,
                scale: 10,
                description: '0 = Not at all likely, 10 = Extremely likely'
            },
            {
                name: 'Service Quality',
                description: 'Service quality assessment',
                category: 'customer-feedback',
                tags: ['service', 'quality', 'rating'],
                isPublic: true,
                type: 'multiple-choice',
                question: 'How would you rate the quality of service you received?',
                required: true,
                options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
            },
            
            // Employee Survey Questions
            {
                name: 'Job Satisfaction',
                description: 'Employee job satisfaction rating',
                category: 'employee-survey',
                tags: ['job', 'satisfaction', 'employee'],
                isPublic: true,
                type: 'rating',
                question: 'How satisfied are you with your current role?',
                required: true,
                scale: 5,
                labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
            },
            {
                name: 'Work-Life Balance',
                description: 'Work-life balance assessment',
                category: 'employee-survey',
                tags: ['work-life', 'balance', 'wellbeing'],
                isPublic: true,
                type: 'rating',
                question: 'How would you rate your work-life balance?',
                required: true,
                scale: 5,
                labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
            },
            
            // Product Research Questions
            {
                name: 'Feature Importance',
                description: 'Feature prioritization question',
                category: 'product-research',
                tags: ['features', 'prioritization', 'ranking'],
                isPublic: true,
                type: 'ranking',
                question: 'Rank these features by importance to you',
                required: true,
                options: ['User Interface', 'Performance', 'Security', 'Price', 'Customer Support']
            },
            {
                name: 'Usage Frequency',
                description: 'Product usage frequency',
                category: 'product-research',
                tags: ['usage', 'frequency', 'behavior'],
                isPublic: true,
                type: 'multiple-choice',
                question: 'How often do you use our product?',
                required: true,
                options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']
            },
            
            // Event Feedback Questions
            {
                name: 'Event Rating',
                description: 'Overall event satisfaction',
                category: 'event-feedback',
                tags: ['event', 'rating', 'overall'],
                isPublic: true,
                type: 'rating',
                question: 'How would you rate this event overall?',
                required: true,
                scale: 5,
                labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
            },
            {
                name: 'Speaker Effectiveness',
                description: 'Speaker performance rating',
                category: 'event-feedback',
                tags: ['speaker', 'presenter', 'effectiveness'],
                isPublic: true,
                type: 'rating',
                question: 'How effective were the speakers/presenters?',
                required: false,
                scale: 5,
                labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
            },
            
            // Education Questions
            {
                name: 'Course Effectiveness',
                description: 'Course evaluation rating',
                category: 'education',
                tags: ['course', 'effectiveness', 'learning'],
                isPublic: true,
                type: 'rating',
                question: 'How effective was this course in meeting your learning objectives?',
                required: true,
                scale: 5,
                labels: ['Not Effective', 'Slightly Effective', 'Moderately Effective', 'Very Effective', 'Extremely Effective']
            },
            {
                name: 'Instructor Rating',
                description: 'Instructor performance assessment',
                category: 'education',
                tags: ['instructor', 'teacher', 'performance'],
                isPublic: true,
                type: 'rating',
                question: 'How would you rate the instructor?',
                required: true,
                scale: 5,
                labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
            },
            
            // Healthcare Questions
            {
                name: 'Care Quality',
                description: 'Healthcare service quality',
                category: 'healthcare',
                tags: ['care', 'quality', 'service'],
                isPublic: true,
                type: 'rating',
                question: 'How would you rate the quality of care you received?',
                required: true,
                scale: 5,
                labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
            },
            {
                name: 'Wait Time Satisfaction',
                description: 'Waiting time satisfaction',
                category: 'healthcare',
                tags: ['wait-time', 'satisfaction', 'efficiency'],
                isPublic: true,
                type: 'multiple-choice',
                question: 'How satisfied were you with the wait time?',
                required: true,
                options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']
            }
        ];
        
        console.log('📝 Saving', sampleQuestions.length, 'questions to library...');
        
        let successCount = 0;
        let errorCount = 0;
        
        // Save each question
        for (const questionData of sampleQuestions) {
            try {
                const result = await api.default.questions.saveQuestion(user.id, questionData);
                
                if (result.error) {
                    console.error('❌ Failed to save:', questionData.name, result.error);
                    errorCount++;
                } else {
                    console.log('✅ Saved:', questionData.name);
                    successCount++;
                }
                
                // Small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error('❌ Exception saving:', questionData.name, error);
                errorCount++;
            }
        }
        
        console.log('🎯 Population complete!');
        console.log('✅ Success:', successCount);
        console.log('❌ Errors:', errorCount);
        console.log('📊 Total:', sampleQuestions.length);
        
        if (successCount > 0) {
            console.log('🎉 Question Library populated successfully!');
            console.log('💡 Refresh the Question Library page to see the new questions');
        }
        
        return {
            success: successCount,
            errors: errorCount,
            total: sampleQuestions.length
        };
        
    } catch (error) {
        console.error('💥 Population failed:', error);
        return { error: error.message };
    }
}

// Run the population
populateQuestionLibrary().then(result => {
    if (result.error) {
        console.log('❌ Failed to populate Question Library:', result.error);
    } else {
        console.log('🎉 Question Library populated!', result);
        alert(`Question Library populated successfully!\n\nAdded: ${result.success} questions\nErrors: ${result.errors}\n\nRefresh the Question Library page to see the new questions.`);
    }
});
