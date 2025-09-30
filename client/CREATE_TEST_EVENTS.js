// CREATE TEST EVENTS VIA API
// Run this in the browser console to create test events for the Published Events section

async function createTestEvents() {
  console.log('🚀 Creating test events...');
  
  try {
    // Check if API is available
    if (typeof api === 'undefined') {
      console.error('❌ API not available. Make sure you\'re on the app page.');
      return;
    }
    
    // Get current user
    const user = window.authContext?.user || window.user;
    if (!user) {
      console.error('❌ No user found. Make sure you\'re logged in.');
      return;
    }
    
    console.log('✅ User found:', user.email);
    
    // Test events data
    const testEvents = [
      {
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
        status: 'published',
        start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        starts_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        location: 'Convention Center, Downtown',
        capacity: 500,
        is_public: true,
        is_template: false
      },
      {
        title: 'Web Development Workshop',
        description: 'Hands-on workshop covering modern web development techniques and best practices.',
        status: 'published',
        start_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        starts_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        location: 'Tech Hub, Innovation District',
        capacity: 50,
        is_public: true,
        is_template: false
      },
      {
        title: 'Virtual Marketing Summit',
        description: 'Learn from marketing experts in this comprehensive online summit.',
        status: 'published',
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
        starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
        location: 'Online (Zoom)',
        capacity: 200,
        is_public: true,
        is_template: false
      },
      {
        title: 'Completed Workshop',
        description: 'A workshop that has already finished.',
        status: 'completed',
        start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        end_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        starts_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: 'Community Center',
        capacity: 25,
        is_public: true,
        is_template: false
      }
    ];
    
    console.log('📝 Creating events...');
    
    for (let i = 0; i < testEvents.length; i++) {
      const eventData = testEvents[i];
      console.log(`Creating event ${i + 1}: ${eventData.title}`);
      
      try {
        const response = await api.events.createEvent(user.id, eventData);
        
        if (response.error) {
          console.error(`❌ Failed to create "${eventData.title}":`, response.error);
        } else {
          console.log(`✅ Created "${eventData.title}" with ID:`, response.event.id);
        }
      } catch (error) {
        console.error(`❌ Error creating "${eventData.title}":`, error);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('🎉 Test events creation completed!');
    console.log('🔄 Refreshing the Published Events page to see the new events...');
    
    // Show success message
    alert('Test events created! Check the Published Events section to see them.');
    
  } catch (error) {
    console.error('❌ Failed to create test events:', error);
    alert('Failed to create test events. Check console for details.');
  }
}

// Auto-run if on events page
if (window.location.pathname.includes('/app/events')) {
  console.log('🎯 Auto-detected events page. Run createTestEvents() to create sample events.');
} else {
  console.log('📝 To create test events, run: createTestEvents()');
}

// Make function available globally
window.createTestEvents = createTestEvents;
