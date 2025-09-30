// DEBUG PUBLISHED SURVEYS LOADING ISSUE
// Copy and paste this into your browser console on the published surveys page

async function debugPublishedSurveys() {
    console.log('🔍 Debugging published surveys loading issue...');
    
    try {
        // Import required modules
        const { supabase } = await import('./src/lib/supabase.js');
        const api = await import('./src/services/api.js');
        
        console.log('📦 Modules loaded successfully');
        
        // Test 1: Check if user is authenticated
        console.log('🔍 Step 1: Checking authentication...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('❌ Authentication failed:', authError);
            console.log('💡 Please make sure you are logged in');
            return;
        }
        
        console.log('✅ User authenticated:', user.id);
        
        // Test 2: Check if surveys table exists
        console.log('🔍 Step 2: Checking surveys table...');
        try {
            const { data: tableTest, error: tableError } = await supabase
                .from('surveys')
                .select('*')
                .limit(1);
                
            if (tableError) {
                console.error('❌ Surveys table issue:', tableError);
                console.log('💡 Run the FIX_SURVEYS_TABLE.sql script');
                return;
            }
            
            console.log('✅ Surveys table accessible');
        } catch (tableException) {
            console.error('❌ Surveys table exception:', tableException);
            return;
        }
        
        // Test 3: Check for any surveys by this user
        console.log('🔍 Step 3: Checking for user surveys...');
        try {
            const { data: allUserSurveys, error: allSurveysError } = await supabase
                .from('surveys')
                .select('*')
                .eq('user_id', user.id);
                
            if (allSurveysError) {
                console.error('❌ Error fetching user surveys:', allSurveysError);
                return;
            }
            
            console.log('✅ Total user surveys found:', allUserSurveys?.length || 0);
            console.log('📋 Survey statuses:', 
                allUserSurveys?.map(s => ({ id: s.id.slice(0, 8), title: s.title, status: s.status })) || []
            );
        } catch (allSurveysException) {
            console.error('❌ Exception fetching user surveys:', allSurveysException);
        }
        
        // Test 4: Check specifically for published surveys
        console.log('🔍 Step 4: Checking for published surveys...');
        try {
            const { data: publishedSurveys, error: publishedError } = await supabase
                .from('surveys')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'published');
                
            if (publishedError) {
                console.error('❌ Error fetching published surveys:', publishedError);
                return;
            }
            
            console.log('✅ Published surveys found:', publishedSurveys?.length || 0);
            
            if (publishedSurveys && publishedSurveys.length > 0) {
                console.log('📋 Published surveys:', 
                    publishedSurveys.map(s => ({ 
                        id: s.id.slice(0, 8), 
                        title: s.title, 
                        published_at: s.published_at 
                    }))
                );
            } else {
                console.log('⚠️ No published surveys found');
                console.log('💡 You may need to publish some surveys first');
            }
        } catch (publishedException) {
            console.error('❌ Exception fetching published surveys:', publishedException);
        }
        
        // Test 5: Test the API method
        console.log('🔍 Step 5: Testing API method...');
        try {
            const apiResult = await api.default.surveys.getSurveysByStatus(user.id, 'published');
            
            if (apiResult.error) {
                console.error('❌ API method failed:', apiResult.error);
            } else {
                console.log('✅ API method successful:', apiResult.surveys?.length || 0, 'surveys');
            }
        } catch (apiException) {
            console.error('❌ API method exception:', apiException);
        }
        
        // Test 6: Check survey_responses table
        console.log('🔍 Step 6: Checking survey_responses table...');
        try {
            const { data: responsesTest, error: responsesError } = await supabase
                .from('survey_responses')
                .select('*')
                .limit(1);
                
            if (responsesError) {
                console.warn('⚠️ Survey responses table issue:', responsesError);
                console.log('💡 This might affect response counts but not survey loading');
            } else {
                console.log('✅ Survey responses table accessible');
            }
        } catch (responsesException) {
            console.warn('⚠️ Survey responses table exception:', responsesException);
        }
        
        console.log('🎯 Debug complete! Check the results above for issues.');
        
    } catch (error) {
        console.error('💥 Debug script failed:', error);
    }
}

// Run the debug
debugPublishedSurveys();
