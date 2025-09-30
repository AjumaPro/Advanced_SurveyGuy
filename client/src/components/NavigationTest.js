import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationTest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const testNavigation = (path) => {
    console.log('Testing navigation to:', path);
    try {
      navigate(path);
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="p-8 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-800 mb-4">
        🧪 Navigation Test Component
      </h1>
      <p className="text-yellow-700 mb-4">
        Current location: {location.pathname}
      </p>
      <div className="space-y-4">
        <button
          onClick={() => testNavigation('/app/events/published')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Test Navigate to Published Events
        </button>
        <button
          onClick={() => testNavigation('/app/events')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Test Navigate to Events Dashboard
        </button>
        <button
          onClick={() => testNavigation('/app/dashboard')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Test Navigate to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NavigationTest;

