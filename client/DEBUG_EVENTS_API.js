// DEBUG EVENTS API
// Run this in the browser console to debug events API

async function debugEventsAPI() {
  console.log('🔍 Starting Events API Debug...');
  
  try {
    // Check if api is available
    if (typeof api === 'undefined') {
      console.error('❌ API not available. Make sure you\'re on the app page.');
      return;
    }
    
    console.log('✅ API available');
    
    // Get current user
    const user = window.authContext?.user || window.user;
    if (!user) {
      console.error('❌ No user found. Make sure you\'re logged in.');
      return;
    }
    
    console.log('✅ User found:', user.id);
    
    // Test getting all events
    console.log('📡 Fetching all events...');
    const allEvents = await api.events.getEvents(user.id);
    console.log('📊 All events response:', allEvents);
    
    if (allEvents.error) {
      console.error('❌ Error fetching all events:', allEvents.error);
    } else {
      console.log(`✅ Found ${allEvents.events?.length || 0} total events`);
      
      if (allEvents.events && allEvents.events.length > 0) {
        console.log('📋 Event details:');
        allEvents.events.forEach((event, index) => {
          console.log(`${index + 1}. ${event.title} - Status: ${event.status} - Template: ${event.is_template}`);
        });
        
        // Check status distribution
        const statusCounts = {};
        allEvents.events.forEach(event => {
          statusCounts[event.status] = (statusCounts[event.status] || 0) + 1;
        });
        console.log('📊 Status distribution:', statusCounts);
      }
    }
    
    // Test getting published events specifically
    console.log('📡 Fetching published events...');
    const publishedEvents = await api.events.getEvents(user.id, { status: 'published' });
    console.log('📊 Published events response:', publishedEvents);
    
    if (publishedEvents.error) {
      console.error('❌ Error fetching published events:', publishedEvents.error);
    } else {
      console.log(`✅ Found ${publishedEvents.events?.length || 0} published events`);
    }
    
    // Test different status values
    const statuses = ['draft', 'published', 'active', 'completed', 'archived'];
    console.log('📡 Testing different status values...');
    
    for (const status of statuses) {
      try {
        const response = await api.events.getEvents(user.id, { status });
        console.log(`📊 Events with status '${status}':`, response.events?.length || 0);
      } catch (error) {
        console.log(`❌ Error fetching '${status}' events:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Auto-run if on the right page
if (window.location.pathname.includes('/app/events') || window.location.pathname.includes('/app/')) {
  console.log('🚀 Auto-running Events API Debug...');
  debugEventsAPI();
} else {
  console.log('📝 To debug events API, run: debugEventsAPI()');
}

// Make function available globally
window.debugEventsAPI = debugEventsAPI;

