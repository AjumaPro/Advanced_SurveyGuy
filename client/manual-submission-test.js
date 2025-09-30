// Manual Survey Submission Test
// Copy and paste this into your browser console when on the survey page

// Test submission function
async function testSurveySubmission() {
  console.log('🧪 Starting manual survey submission test...');
  
  const surveyId = '72e29f4f-78f9-429f-8bae-9f3074675ff6'; // From your URL
  
  // Test data matching your survey
  const testResponses = {
    // Based on what I can see from your survey
    'q1': 'Test Name', // Assuming first question is name
    'q2': 'Very Satisfied', // Satisfaction question
    'q3': 'Option 1' // The checkbox option you selected
  };
  
  const submissionData = {
    responses: testResponses,
    sessionId: `manual_test_${Date.now()}`,
    completionTime: 60,
    userAgent: navigator.userAgent
  };
  
  console.log('📋 Test data:', submissionData);
  
  try {
    // Method 1: Direct Supabase call
    console.log('🔄 Trying direct Supabase insertion...');
    
    const { supabase } = await import('./src/lib/supabase.js');
    
    const responseRecord = {
      survey_id: surveyId,
      responses: testResponses,
      session_id: submissionData.sessionId,
      submitted_at: new Date().toISOString(),
      completion_time: submissionData.completionTime,
      user_agent: submissionData.userAgent
    };
    
    console.log('📝 Inserting record:', responseRecord);
    
    const { data, error } = await supabase
      .from('survey_responses')
      .insert(responseRecord)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Direct insertion failed:', error);
      
      // Method 2: Check if table exists
      console.log('🔍 Checking if table exists...');
      const { data: tableCheck, error: tableError } = await supabase
        .from('survey_responses')
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.error('❌ Table does not exist or is not accessible:', tableError);
        
        // Method 3: Try to create the table
        console.log('🛠️ Attempting to create table...');
        try {
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS survey_responses (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              survey_id UUID NOT NULL,
              responses JSONB NOT NULL,
              session_id TEXT,
              submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              completion_time INTEGER,
              user_agent TEXT
            );
            
            ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
            
            DROP POLICY IF EXISTS "Allow public survey response submission" ON survey_responses;
            CREATE POLICY "Allow public survey response submission" 
            ON survey_responses FOR INSERT 
            TO public 
            WITH CHECK (true);
          `;
          
          const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
          
          if (createError) {
            console.error('❌ Could not create table:', createError);
            console.log('💡 You need to manually create the table in Supabase SQL editor');
            console.log('📋 Use this SQL:');
            console.log(createTableSQL);
          } else {
            console.log('✅ Table created, retrying submission...');
            
            const { data: retryData, error: retryError } = await supabase
              .from('survey_responses')
              .insert(responseRecord)
              .select()
              .single();
              
            if (retryError) {
              console.error('❌ Retry after table creation failed:', retryError);
            } else {
              console.log('✅ SUCCESS! Response submitted after creating table:', retryData);
              return retryData;
            }
          }
        } catch (createTableError) {
          console.error('❌ Exception during table creation:', createTableError);
        }
      } else {
        console.log('✅ Table exists, checking policies...');
        console.log('Table sample data:', tableCheck);
      }
    } else {
      console.log('✅ SUCCESS! Response submitted directly:', data);
      return data;
    }
    
  } catch (error) {
    console.error('💥 Exception during test:', error);
  }
  
  console.log('❌ All methods failed. Check Supabase dashboard for table and RLS policies.');
  
  // Show instructions
  console.log(`
  📋 MANUAL FIX INSTRUCTIONS:
  
  1. Go to your Supabase dashboard
  2. Navigate to SQL Editor
  3. Run this SQL:
  
  CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID NOT NULL,
    responses JSONB NOT NULL,
    session_id TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_time INTEGER,
    user_agent TEXT
  );
  
  ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Allow public survey response submission" ON survey_responses;
  CREATE POLICY "Allow public survey response submission" 
  ON survey_responses FOR INSERT 
  TO public 
  WITH CHECK (true);
  
  4. Then try submitting the survey again
  `);
}

// Run the test
testSurveySubmission();
