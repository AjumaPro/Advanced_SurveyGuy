import React, { useState } from 'react';
import axios from 'axios';

const AuthTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const email = `test${Date.now()}@example.com`;
      const response = await axios.post('/api/auth/register', {
        email,
        password: 'Test123!',
        name: 'Test User'
      });
      
      addResult('Registration', true, 'User registered successfully', {
        email,
        userId: response.data.user.id,
        token: response.data.token ? 'Token received' : 'No token'
      });
      
      return response.data.token;
    } catch (error) {
      addResult('Registration', false, error.response?.data?.error || error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });
      
      addResult('Login', true, 'User logged in successfully', {
        email,
        userId: response.data.user.id,
        role: response.data.user.role,
        token: response.data.token ? 'Token received' : 'No token'
      });
      
      return response.data.token;
    } catch (error) {
      addResult('Login', false, error.response?.data?.error || error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async (token) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      addResult('Auth Check', true, 'Authentication working', {
        user: response.data.user
      });
    } catch (error) {
      addResult('Auth Check', false, error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    // Test registration
    const token = await testRegistration();
    
    // Test login with the registered user
    if (token) {
      const email = `test${Date.now() - 1}@example.com`; // Use the email from registration
      await testLogin(email, 'Test123!');
    }
    
    // Test existing user login
    await testLogin('newuser@example.com', 'Test123!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>
        
        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
        
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{result.test}</h3>
                  <p className="text-sm">{result.message}</p>
                  {result.data && (
                    <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
                <div className="text-xs text-gray-500">{result.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
        
        {testResults.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Click "Run All Tests" to test authentication
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest; 