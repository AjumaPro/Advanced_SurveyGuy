import React from 'react';
import PublishedEventsSection from '../components/PublishedEventsSection';
import NavigationTest from '../components/NavigationTest';

const PublishedEvents = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTest />
        <div className="mt-8">
          <PublishedEventsSection />
        </div>
      </div>
    </div>
  );
};

export default PublishedEvents;
