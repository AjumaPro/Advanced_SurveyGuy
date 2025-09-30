/**
 * Test script to verify event creation functionality
 * Run this with: node test-event-creation.js
 */

const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEventCreation() {
  console.log('🧪 Testing event creation...');
  
  try {
    // Test 1: Check if events table exists and is accessible
    console.log('1. Checking events table access...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('events')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table access error:', tableError);
      return;
    }
    console.log('✅ Events table is accessible');

    // Test 2: Check table schema
    console.log('2. Checking table schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'events' });
    
    if (schemaError) {
      console.log('⚠️ Could not get schema via RPC, checking with sample insert...');
    } else {
      console.log('✅ Table schema:', schemaData);
    }

    // Test 3: Try to create a test event
    console.log('3. Creating test event...');
    const testEvent = {
      user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      title: 'Test Event - ' + new Date().toISOString(),
      description: 'Test event created for debugging',
      event_type: 'standard',
      start_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      location: 'Test Location',
      capacity: 10,
      registration_required: true,
      is_public: false,
      status: 'draft',
      metadata: {}
    };

    console.log('📝 Test event data:', testEvent);

    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert(testEvent)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      console.error('Error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
    } else {
      console.log('✅ Test event created successfully:', insertData);
      
      // Clean up test event
      console.log('4. Cleaning up test event...');
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', insertData.id);
      
      if (deleteError) {
        console.error('⚠️ Could not delete test event:', deleteError);
      } else {
        console.log('✅ Test event cleaned up');
      }
    }

  } catch (error) {
    console.error('💥 Test failed with exception:', error);
  }
}

// Run the test
testEventCreation().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});

