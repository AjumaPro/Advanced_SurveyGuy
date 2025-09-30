import React from 'react';

const PublishedEventsTest = () => {
  return (
    <div className="p-8 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
      <h1 className="text-2xl font-bold text-yellow-800 mb-4">
        🧪 Published Events Test Component
      </h1>
      <p className="text-yellow-700 mb-4">
        If you can see this, the routing and component loading is working correctly.
      </p>
      <div className="bg-yellow-200 p-4 rounded">
        <h3 className="font-semibold text-yellow-800">Debug Information:</h3>
        <ul className="text-yellow-700 mt-2 space-y-1">
          <li>✅ Component is rendering</li>
          <li>✅ Routing is working</li>
          <li>✅ Import is successful</li>
        </ul>
      </div>
    </div>
  );
};

export default PublishedEventsTest;

