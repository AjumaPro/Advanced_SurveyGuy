// DEBUG NAVIGATION ISSUES
// Run this in the browser console to debug navigation problems

function debugNavigation() {
  console.log('🔍 Starting Navigation Debug...');
  
  // Check if React Router is available
  if (typeof window !== 'undefined' && window.location) {
    console.log('📍 Current URL:', window.location.href);
    console.log('📍 Current Path:', window.location.pathname);
    console.log('📍 Current Hash:', window.location.hash);
    console.log('📍 Current Search:', window.location.search);
  }
  
  // Check if navigation functions are available
  try {
    // Try to access React Router hooks (this might not work in console)
    console.log('⚠️ React Router hooks not accessible from console');
  } catch (error) {
    console.log('⚠️ Cannot access React Router from console:', error.message);
  }
  
  // Test direct navigation
  console.log('🧪 Testing direct navigation...');
  
  // Test 1: Navigate to Published Events
  console.log('Test 1: Navigating to /app/events/published');
  try {
    window.location.href = '/app/events/published';
  } catch (error) {
    console.error('❌ Direct navigation failed:', error);
  }
  
  // Test 2: Check if route exists
  console.log('Test 2: Checking if route exists...');
  fetch('/app/events/published')
    .then(response => {
      console.log('✅ Route accessible, status:', response.status);
    })
    .catch(error => {
      console.log('❌ Route not accessible:', error);
    });
}

// Test dropdown navigation specifically
function testDropdownNavigation() {
  console.log('🎯 Testing Dropdown Navigation...');
  
  // Check if Events dropdown exists
  const eventsDropdown = document.querySelector('[data-testid="events-dropdown"]') || 
                        document.querySelector('button:contains("Events")') ||
                        Array.from(document.querySelectorAll('button')).find(btn => 
                          btn.textContent.includes('Events')
                        );
  
  if (eventsDropdown) {
    console.log('✅ Events dropdown found:', eventsDropdown);
    
    // Try to click it
    eventsDropdown.click();
    console.log('🖱️ Clicked Events dropdown');
    
    // Wait a bit and look for Published Events option
    setTimeout(() => {
      const publishedEventsOption = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Published Events')
      );
      
      if (publishedEventsOption) {
        console.log('✅ Published Events option found:', publishedEventsOption);
        publishedEventsOption.click();
        console.log('🖱️ Clicked Published Events option');
      } else {
        console.log('❌ Published Events option not found');
      }
    }, 500);
    
  } else {
    console.log('❌ Events dropdown not found');
  }
}

// Test sidebar navigation
function testSidebarNavigation() {
  console.log('🎯 Testing Sidebar Navigation...');
  
  // Look for sidebar
  const sidebar = document.querySelector('[data-testid="sidebar"]') ||
                 document.querySelector('nav') ||
                 document.querySelector('.sidebar');
  
  if (sidebar) {
    console.log('✅ Sidebar found:', sidebar);
    
    // Look for Published Events link
    const publishedEventsLink = Array.from(sidebar.querySelectorAll('a, button')).find(el => 
      el.textContent.includes('Published Events')
    );
    
    if (publishedEventsLink) {
      console.log('✅ Published Events link found:', publishedEventsLink);
      publishedEventsLink.click();
      console.log('🖱️ Clicked Published Events link');
    } else {
      console.log('❌ Published Events link not found in sidebar');
    }
    
  } else {
    console.log('❌ Sidebar not found');
  }
}

// Auto-run if on app page
if (window.location.pathname.includes('/app/')) {
  console.log('🚀 Auto-running Navigation Debug...');
  debugNavigation();
} else {
  console.log('📝 To debug navigation, run: debugNavigation()');
  console.log('📝 To test dropdown navigation, run: testDropdownNavigation()');
  console.log('📝 To test sidebar navigation, run: testSidebarNavigation()');
}

// Make functions available globally
window.debugNavigation = debugNavigation;
window.testDropdownNavigation = testDropdownNavigation;
window.testSidebarNavigation = testSidebarNavigation;

