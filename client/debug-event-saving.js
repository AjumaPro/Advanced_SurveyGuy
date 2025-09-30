// EVENT SAVING DEBUG SCRIPT
// Copy and paste this into your browser console (F12) while logged into your app

async function debugEventSaving() {
    console.log('🔍 Starting Event Saving Debug...');
    
    try {
        // 1. Check Authentication
        console.log('1️⃣ Checking Authentication...');
        const { supabase } = await import('./src/lib/supabase.js');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('❌ Authentication failed:', authError);
            alert('Please log in first!');
            return;
        }
        
        console.log('✅ User authenticated:', user.id, user.email);
        
        // 2. Check Database Connection
        console.log('2️⃣ Testing Database Connection...');
        const { data: testData, error: testError } = await supabase
            .from('events')
            .select('count')
            .limit(1);
        
        if (testError) {
            console.error('❌ Database connection failed:', testError);
            console.log('🛠️ Try running the FIX_EVENT_SAVING.sql script in Supabase');
            return;
        }
        
        console.log('✅ Database connection successful');
        
        // 3. Test Table Structure
        console.log('3️⃣ Checking Table Structure...');
        const { data: tableData, error: tableError } = await supabase
            .from('events')
            .select('*')
            .limit(1);
        
        if (tableError) {
            console.error('❌ Table structure issue:', tableError);
            if (tableError.code === '42P01') {
                console.log('🛠️ Events table does not exist. Run FIX_EVENT_SAVING.sql');
            }
            return;
        }
        
        console.log('✅ Table structure looks good');
        
        // 4. Test Direct Insert
        console.log('4️⃣ Testing Direct Insert...');
        const testEvent = {
            user_id: user.id,
            title: 'Debug Test Event - ' + new Date().toISOString(),
            description: 'Test event created by debug script',
            event_type: 'standard',
            start_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            location: 'Debug Location',
            capacity: 10,
            registration_required: true,
            is_public: false,
            status: 'draft',
            metadata: { debug: true }
        };
        
        console.log('📝 Inserting test event:', testEvent);
        
        const { data: insertData, error: insertError } = await supabase
            .from('events')
            .insert(testEvent)
            .select()
            .single();
        
        if (insertError) {
            console.error('❌ Direct insert failed:', insertError);
            
            // Common error diagnosis
            if (insertError.code === '23503') {
                console.log('🔍 Foreign key constraint failed - user_id issue');
            } else if (insertError.code === '42501') {
                console.log('🔍 Permission denied - RLS policy issue');
            } else if (insertError.code === '23502') {
                console.log('🔍 Not null constraint - missing required field');
            }
            
            return;
        }
        
        console.log('✅ Direct insert successful:', insertData);
        
        // 5. Test API Method
        console.log('5️⃣ Testing API Method...');
        const api = await import('./src/services/api.js');
        
        const apiTestEvent = {
            title: 'API Test Event - ' + new Date().toISOString(),
            description: 'Test event created via API',
            event_type: 'standard',
            start_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            location: 'API Test Location',
            capacity: 20,
            registration_required: true,
            is_public: false,
            metadata: { apiTest: true }
        };
        
        console.log('📡 Testing API createEvent method...');
        const apiResponse = await api.default.events.createEvent(user.id, apiTestEvent);
        
        if (apiResponse.error) {
            console.error('❌ API method failed:', apiResponse.error);
            return;
        }
        
        console.log('✅ API method successful:', apiResponse.event);
        
        // 6. Test Fetch Events
        console.log('6️⃣ Testing Fetch Events...');
        const fetchResponse = await api.default.events.getEvents(user.id);
        
        if (fetchResponse.error) {
            console.error('❌ Fetch events failed:', fetchResponse.error);
            return;
        }
        
        console.log('✅ Fetch events successful:', fetchResponse.events.length, 'events found');
        
        // 7. Clean up test events
        console.log('7️⃣ Cleaning up test events...');
        const testEventIds = [insertData.id, apiResponse.event.id];
        
        for (const eventId of testEventIds) {
            const deleteResponse = await api.default.events.deleteEvent(eventId);
            if (deleteResponse.success) {
                console.log('🗑️ Cleaned up test event:', eventId);
            }
        }
        
        console.log('🎉 ALL TESTS PASSED! Event saving should work properly.');
        alert('✅ Event saving debug complete! All tests passed. Event creation should work now.');
        
    } catch (error) {
        console.error('💥 Debug script failed:', error);
        
        // Provide specific guidance based on error
        if (error.message.includes('Cannot resolve module')) {
            console.log('🔍 Module import issue - make sure you\'re running this in the app context');
        } else if (error.message.includes('supabase')) {
            console.log('🔍 Supabase connection issue - check your environment variables');
        }
        
        alert('❌ Debug failed: ' + error.message);
    }
}

// Auto-run the debug
console.log('🚀 Event Saving Debugger Ready!');
console.log('Run debugEventSaving() to start diagnosis');

// Uncomment the next line to auto-run
debugEventSaving();

