import React, { useState } from 'react';
import api from '../utils/axios';

const NetworkTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    const results = [];

    // Test 1: Basic fetch to Django health endpoint
    try {
      console.log('🧪 Test 1: Basic fetch to Django health endpoint');
      const response = await fetch('http://localhost:8001/api/health/');
      const data = await response.json();
      results.push({
        test: 'Basic Fetch - Health Endpoint',
        status: '✅ SUCCESS',
        data: data
      });
    } catch (error) {
      results.push({
        test: 'Basic Fetch - Health Endpoint',
        status: '❌ FAILED',
        error: error.message
      });
    }

    // Test 2: Axios to Django health endpoint
    try {
      console.log('🧪 Test 2: Axios to Django health endpoint');
      const response = await api.get('health/');
      results.push({
        test: 'Axios - Health Endpoint',
        status: '✅ SUCCESS',
        data: response.data
      });
    } catch (error) {
      results.push({
        test: 'Axios - Health Endpoint',
        status: '❌ FAILED',
        error: error.message,
        details: error.response?.data || error.code
      });
    }

    // Test 3: Login API call
    try {
      console.log('🧪 Test 3: Login API call');
      const response = await api.post('auth/login/', {
        email: 'demo@surveyguy.com',
        password: 'demo123456'
      });
      results.push({
        test: 'Login API Call',
        status: '✅ SUCCESS',
        data: { message: response.data.message, user: response.data.user.email }
      });
    } catch (error) {
      results.push({
        test: 'Login API Call',
        status: '❌ FAILED',
        error: error.message,
        details: error.response?.data || error.code,
        statusCode: error.response?.status
      });
    }

    // Test 4: CORS test
    try {
      console.log('🧪 Test 4: CORS test');
      const response = await fetch('http://localhost:8001/api/health/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        }
      });
      const corsHeaders = {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
      };
      results.push({
        test: 'CORS Headers',
        status: '✅ SUCCESS',
        data: corsHeaders
      });
    } catch (error) {
      results.push({
        test: 'CORS Headers',
        status: '❌ FAILED',
        error: error.message
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Network Connection Test</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Network Tests'}
        </button>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow border">
              <h3 className="font-semibold text-lg mb-2">{result.test}</h3>
              <div className={`text-lg font-medium mb-2 ${
                result.status.includes('SUCCESS') ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.status}
              </div>
              
              {result.data && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}
              
              {result.error && (
                <div className="bg-red-50 p-3 rounded text-sm">
                  <div className="text-red-700 font-medium">Error: {result.error}</div>
                  {result.details && (
                    <div className="text-red-600 mt-1">Details: {JSON.stringify(result.details)}</div>
                  )}
                  {result.statusCode && (
                    <div className="text-red-600 mt-1">Status Code: {result.statusCode}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {testResults.length > 0 && (
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Summary:</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Total Tests: {testResults.length}</li>
              <li>• Successful: {testResults.filter(r => r.status.includes('SUCCESS')).length}</li>
              <li>• Failed: {testResults.filter(r => r.status.includes('FAILED')).length}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkTest; 