import React, { useState } from 'react';
import api from '../utils/axios';

const TestConnection = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setTestResult('Testing login...');
    
    try {
      console.log('🧪 Starting login test...');
      const response = await api.post('/auth/login', {
        email: 'demo@surveyguy.com',
        password: 'demo123456'
      });
      
      console.log('✅ Test successful:', response.data);
      setTestResult(`✅ Login successful! User: ${response.data.user.email}`);
    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResult(`❌ Login failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testHealth = async () => {
    setLoading(true);
    setTestResult('Testing health endpoint...');
    
    try {
      const response = await api.get('/health');
      setTestResult(`✅ Health check successful: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setTestResult(`❌ Health check failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">API Connection Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={testHealth}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Health Endpoint
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Login API
          </button>
        </div>
        
        {testResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Current API URL:</strong> {api.defaults.baseURL}</p>
          <p><strong>Check browser console</strong> for detailed logs</p>
        </div>
      </div>
    </div>
  );
};

export default TestConnection; 