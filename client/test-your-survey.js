// DIRECT SURVEY SUBMISSION TEST FOR YOUR SPECIFIC SURVEY
// Copy and paste this into your browser console on the survey page

async function testYourSurveySubmission() {
    console.log('🚀 Testing submission for your specific survey...');
    
    const surveyId = '72e29f4f-78f9-429f-8bae-9f3074675ff6';
    
    // Import Supabase client
    const { supabase } = await import('./src/lib/supabase.js');
    
    console.log('📋 Supabase client loaded:', !!supabase);
    
    // Test 1: Check if table exists
    console.log('🔍 Step 1: Checking if survey_responses table exists...');
    try {
        const { data: tableCheck, error: tableError } = await supabase
            .from('survey_responses')
            .select('*')
            .limit(1);
            
        if (tableError) {
            console.error('❌ Table check failed:', tableError);
            console.log('💡 You need to run the SQL script in Supabase first!');
            return;
        } else {
            console.log('✅ Table exists and is accessible');
        }
    } catch (error) {
        console.error('❌ Exception checking table:', error);
        return;
    }
    
    // Test 2: Try direct insertion
    console.log('🔍 Step 2: Testing direct insertion...');
    
    const testData = {
        survey_id: surveyId,
        responses: {
            'q1': 'John Doe',  // Name field
            'q2': 'Very Satisfied',  // Satisfaction
            'q3': 'Option 1'  // The option you selected
        },
        session_id: `direct_test_${Date.now()}`,
        submitted_at: new Date().toISOString(),
        completion_time: 45,
        user_agent: navigator.userAgent
    };
    
    console.log('📝 Inserting test data:', testData);
    
    try {
        const { data: insertResult, error: insertError } = await supabase
            .from('survey_responses')
            .insert(testData)
            .select()
            .single();
            
        if (insertError) {
            console.error('❌ Direct insertion failed:', insertError);
            
            // Try minimal insertion
            console.log('🔄 Trying minimal insertion...');
            const minimalData = {
                survey_id: surveyId,
                responses: testData.responses
            };
            
            const { data: minimalResult, error: minimalError } = await supabase
                .from('survey_responses')
                .insert(minimalData)
                .select()
                .single();
                
            if (minimalError) {
                console.error('❌ Minimal insertion also failed:', minimalError);
                console.log('🛠️ Database needs to be set up. Run the SQL script first.');
            } else {
                console.log('✅ SUCCESS! Minimal insertion worked:', minimalResult);
                
                // Clean up
                await supabase.from('survey_responses').delete().eq('id', minimalResult.id);
                console.log('🧹 Test data cleaned up');
            }
        } else {
            console.log('✅ SUCCESS! Direct insertion worked:', insertResult);
            
            // Clean up
            await supabase.from('survey_responses').delete().eq('id', insertResult.id);
            console.log('🧹 Test data cleaned up');
        }
    } catch (error) {
        console.error('❌ Exception during insertion:', error);
    }
    
    // Test 3: Test the actual API method
    console.log('🔍 Step 3: Testing API method...');
    
    try {
        const api = await import('./src/services/api.js');
        
        const apiTestData = {
            responses: {
                'q1': 'Jane Doe',
                'q2': 'Satisfied', 
                'q3': 'Option 2'
            },
            sessionId: `api_test_${Date.now()}`,
            completionTime: 60,
            userAgent: navigator.userAgent
        };
        
        console.log('📡 Testing API submission:', apiTestData);
        
        const apiResult = await api.default.responses.submitResponse(surveyId, apiTestData);
        
        if (apiResult.error) {
            console.error('❌ API submission failed:', apiResult.error);
        } else {
            console.log('✅ SUCCESS! API submission worked:', apiResult);
            
            // Clean up
            if (apiResult.response?.id) {
                await supabase.from('survey_responses').delete().eq('id', apiResult.response.id);
                console.log('🧹 API test data cleaned up');
            }
        }
    } catch (error) {
        console.error('❌ Exception during API test:', error);
    }
    
    console.log('🎯 Test complete! Check the results above.');
}

// Run the test
testYourSurveySubmission();
