// QUICK EVENT CREATION TEST
// Copy and paste this into browser console to test the fix

async function testEventCreation() {
    console.log('🧪 Testing Event Creation Fix...');
    
    try {
        // Import required modules
        const { supabase } = await import('./src/lib/supabase.js');
        const api = await import('./src/services/api.js');
        
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('❌ Please log in first');
            return;
        }
        
        console.log('✅ User authenticated:', user.email);
        
        // Test event data with correct column names
        const testEventData = {
            title: 'Test Event - ' + new Date().toLocaleString(),
            description: 'Test event to verify the fix',
            event_type: 'standard',
            starts_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            location: 'Test Location',
            capacity: 25,
            registration_required: true,
            is_public: false,
            status: 'draft',
            metadata: { test: true }
        };
        
        console.log('📝 Creating test event with data:', testEventData);
        
        // Test API method
        const response = await api.default.events.createEvent(user.id, testEventData);
        
        if (response.error) {
            console.error('❌ API Error:', response.error);
            
            // Try direct database insert as fallback
            console.log('🔄 Trying direct database insert...');
            const { data: directData, error: directError } = await supabase
                .from('events')
                .insert({
                    ...testEventData,
                    user_id: user.id
                })
                .select()
                .single();
                
            if (directError) {
                console.error('❌ Direct insert also failed:', directError);
                
                // Check table structure
                const { data: columns } = await supabase
                    .rpc('get_table_columns', { table_name: 'events' });
                console.log('📋 Table columns:', columns);
                
                alert('❌ Event creation still failing. Check console for details.');
                return;
            } else {
                console.log('✅ Direct insert successful:', directData);
                alert('✅ Event created successfully via direct insert!');
                
                // Clean up test event
                await supabase.from('events').delete().eq('id', directData.id);
                console.log('🗑️ Test event cleaned up');
                return;
            }
        }
        
        console.log('✅ API method successful:', response.event);
        alert('🎉 Event creation fix verified! API method working correctly.');
        
        // Clean up test event
        if (response.event?.id) {
            await api.default.events.deleteEvent(response.event.id);
            console.log('🗑️ Test event cleaned up');
        }
        
    } catch (error) {
        console.error('💥 Test failed:', error);
        alert('❌ Test failed: ' + error.message);
    }
}

// Auto-run the test
testEventCreation();

