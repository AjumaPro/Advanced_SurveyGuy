import React, { useState } from 'react';
import ProductionQRCodeSystem from './ProductionQRCodeSystem';
import { getSurveyUrl } from '../utils/urlUtils';

/**
 * Simple QR Code Test Component
 * Use this to test QR code generation in production
 */
const QRCodeTest = () => {
  const [testUrl, setTestUrl] = useState('https://ajumapro.com/survey/85ec5b20-5af6-4479-8bd8-34ae409e2d64');
  const [customUrl, setCustomUrl] = useState('');

  const handleTestQR = () => {
    const url = customUrl || testUrl;
    console.log('🧪 Testing QR code with URL:', url);
    setTestUrl(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Code Test</h2>
      
      <div className="space-y-6">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test URL
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter URL to test QR code generation"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTestQR}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test QR
            </button>
          </div>
        </div>

        {/* Current URL Display */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Current URL:</p>
          <p className="font-mono text-sm text-gray-900 break-all">{testUrl}</p>
        </div>

        {/* QR Code Display */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <ProductionQRCodeSystem
            surveyId="test"
            surveyTitle="Test QR Code"
            surveyUrl={testUrl}
            size={200}
            onDownload={(filename) => console.log('Download clicked:', filename)}
            onCopy={() => console.log('Copy clicked')}
            onError={(error) => console.error('QR Error:', error)}
          />
        </div>

        {/* Debug Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Debug Information:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Current URL:</strong> {testUrl}</p>
            <p><strong>Base URL:</strong> {window.location.origin}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Clipboard API:</strong> {navigator.clipboard ? 'Available' : 'Not Available'}</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setTestUrl('https://ajumapro.com/survey/85ec5b20-5af6-4479-8bd8-34ae409e2d64')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Test Survey URL
          </button>
          <button
            onClick={() => setTestUrl('https://www.google.com')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Test Google URL
          </button>
          <button
            onClick={() => setTestUrl(window.location.origin)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Test Base URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeTest;
