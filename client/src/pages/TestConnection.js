import React, { useState } from 'react';
import api from '../utils/axios';

const TestConnection = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/auth/login');
      setTestResult('✅ Backend connection successful!');
    } catch (error) {
      setTestResult(`❌ Backend connection failed: ${error.message}`);
    }
    setLoading(false);
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        name: 'Test User'
      });
      setTestResult('✅ Registration API working!');
    } catch (error) {
      setTestResult(`❌ Registration failed: ${error.response?.data?.error || error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">API Connection Test</h2>
          <p className="mt-2 text-gray-600">Testing SurveyGuy backend connectivity</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>
          
          <button
            onClick={testRegistration}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Registration API'}
          </button>
        </div>
        
        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
        
        <div className="text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-500">
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestConnection; 