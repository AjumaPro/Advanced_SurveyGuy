import React from 'react';

const TemplateCreationWizardDebug = () => {
  console.log('TemplateCreationWizardDebug: Component loaded');
  
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          🚨 WIZARD DEBUG MODE
        </h1>
        <p className="text-red-600 mb-8">
          If you can see this, the wizard component is loading correctly!
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
          <ul className="text-left text-sm space-y-2">
            <li>✅ Component imported successfully</li>
            <li>✅ Route configured correctly</li>
            <li>✅ React rendering working</li>
            <li>✅ Styling applied</li>
          </ul>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/app/reports'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Template Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreationWizardDebug;
