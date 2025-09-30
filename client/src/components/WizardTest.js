import React from 'react';
import { Link } from 'react-router-dom';

const WizardTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🧪 Wizard Test Page
        </h1>
        <p className="text-gray-600 mb-8">
          Testing the Template Creation Wizard
        </p>
        
        <div className="space-y-4">
          <Link
            to="/app/template-wizard"
            className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Template Wizard
          </Link>
          
          <Link
            to="/app/reports"
            className="block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Open Template Manager
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WizardTest;
