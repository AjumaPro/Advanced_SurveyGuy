// FINAL EVENT SAVING FIX - Browser Script
// This will check your table structure and fix the code accordingly
// Copy and paste this into your browser console (F12)

async function finalEventFix() {
    console.log('🔧 Final Event Saving Fix - Starting...');
    
    try {
        // Import required modules
        const { supabase } = await import('./src/lib/supabase.js');
        
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('❌ Please log in first');
            alert('Please log in first!');
            return;
        }
        
        console.log('✅ User authenticated:', user.email);
        
        // 1. Check actual table structure
        console.log('🔍 Checking table structure...');
        
        const { data: tableInfo, error: tableError } = await supabase
            .rpc('exec', {
                sql: `
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'events' 
                AND table_schema = 'public'
                ORDER BY ordinal_position;
                `
            });
        
        if (tableError) {
            // Fallback: try to insert a test record to see what columns are expected
            console.log('⚠️ Could not check table structure, trying test insert...');
            
            const testData = {
                user_id: user.id,
                title: 'Test Event Structure Check',
                description: 'Testing column structure',
                event_type: 'standard',
                // Try both possible column names
                start_date: new Date().toISOString(),
                starts_at: new Date().toISOString(),
                location: 'Test Location',
                capacity: 10,
                registration_required: true,
                is_public: false,
                status: 'draft',
                metadata: {}
            };
            
            const { data: testResult, error: testError } = await supabase
                .from('events')
                .insert(testData)
                .select()
                .single();
                
            if (testError) {
                console.error('❌ Test insert failed:', testError);
                
                // Try with just starts_at
                delete testData.start_date;
                console.log('🔄 Trying with starts_at only...');
                
                const { data: testResult2, error: testError2 } = await supabase
                    .from('events')
                    .insert(testData)
                    .select()
                    .single();
                    
                if (testError2) {
                    console.error('❌ starts_at test failed:', testError2);
                    
                    // Try with just start_date
                    delete testData.starts_at;
                    testData.start_date = new Date().toISOString();
                    console.log('🔄 Trying with start_date only...');
                    
                    const { data: testResult3, error: testError3 } = await supabase
                        .from('events')
                        .insert(testData)
                        .select()
                        .single();
                        
                    if (testError3) {
                        console.error('❌ All tests failed:', testError3);
                        alert('❌ Cannot determine correct table structure. Please check your database setup.');
                        return;
                    } else {
                        console.log('✅ start_date column works!');
                        await supabase.from('events').delete().eq('id', testResult3.id);
                        alert('✅ Your table uses start_date column. The code should work now.');
                        return;
                    }
                } else {
                    console.log('✅ starts_at column works!');
                    await supabase.from('events').delete().eq('id', testResult2.id);
                    
                    // Update the modal code to use starts_at
                    console.log('🔧 Your table uses starts_at. You need to update the code...');
                    alert('✅ Found the issue! Your table uses "starts_at" column. Check console for fix code.');
                    
                    // Provide the fix code
                    console.log(`
🔧 COPY THIS FIX CODE:

In your EnhancedCreateEventModal.js file, change line ~106 from:
    start_date: startDateTime.toISOString(),

TO:
    starts_at: startDateTime.toISOString(),

And change line ~108 from:
    end_date: data.endDate && data.endTime ? 

TO:
    ends_at: data.endDate && data.endTime ? 

Also update your API service (api.js) line ~1209 from:
    .order('start_date', { ascending: true });

TO:
    .order('starts_at', { ascending: true });
                    `);
                    return;
                }
            } else {
                console.log('✅ Test insert successful with both columns');
                await supabase.from('events').delete().eq('id', testResult.id);
                console.log('✅ Your table has both columns, using start_date should work');
                return;
            }
        }
        
        console.log('📋 Table structure:', tableInfo);
        
        // Check which date column exists
        const hasStartDate = tableInfo.some(col => col.column_name === 'start_date');
        const hasStartsAt = tableInfo.some(col => col.column_name === 'starts_at');
        
        console.log('🔍 Column analysis:');
        console.log('- has start_date:', hasStartDate);
        console.log('- has starts_at:', hasStartsAt);
        
        if (hasStartsAt && !hasStartDate) {
            console.log('🎯 Your table uses starts_at column');
            alert('Found the issue! Your table uses "starts_at" column. Check console for the fix code.');
            
            console.log(`
🔧 APPLY THIS FIX:

1. In EnhancedCreateEventModal.js, change:
   start_date: startDateTime.toISOString(),
   TO:
   starts_at: startDateTime.toISOString(),

2. In the same file, change:
   end_date: data.endDate && data.endTime ? 
   TO:
   ends_at: data.endDate && data.endTime ? 

3. In api.js, change:
   .order('start_date', { ascending: true });
   TO:
   .order('starts_at', { ascending: true });
            `);
        } else if (hasStartDate && !hasStartsAt) {
            console.log('✅ Your table uses start_date column - code should work');
            alert('✅ Your table structure looks correct. Try creating an event now.');
        } else if (hasStartDate && hasStartsAt) {
            console.log('⚠️ Your table has both columns - using start_date');
            alert('⚠️ Your table has both date columns. Using start_date. Try creating an event now.');
        } else {
            console.log('❌ No date columns found');
            alert('❌ No date columns found in your events table. Please check your database setup.');
        }
        
    } catch (error) {
        console.error('💥 Fix script failed:', error);
        alert('❌ Fix script failed: ' + error.message);
    }
}

// Auto-run the fix
console.log('🚀 Final Event Fix Script Ready!');
finalEventFix();

