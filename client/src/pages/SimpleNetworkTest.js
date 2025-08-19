import React, { useState } from 'react';

const SimpleNetworkTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailedLogs, setDetailedLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setDetailedLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing...');
    setDetailedLogs([]);

    try {
      addLog('🧪 Starting Django API connection test...', 'info');
      console.log('🧪 Testing Django API connection...');
      
      addLog('📡 Making request to: http://localhost:8001/api/health/', 'info');
      
      const response = await fetch('http://localhost:8001/api/health/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      addLog(`📊 Response status: ${response.status} ${response.statusText}`, 'info');

      if (response.ok) {
        const data = await response.json();
        setResult(`✅ SUCCESS! Server responded: ${JSON.stringify(data, null, 2)}`);
        addLog('✅ Connection successful!', 'success');
        console.log('✅ Connection successful:', data);
      } else {
        setResult(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        addLog(`❌ HTTP Error: ${response.status} ${response.statusText}`, 'error');
        console.error('❌ HTTP Error:', response.status, response.statusText);
      }
    } catch (error) {
      const errorMessage = `❌ Network Error: ${error.message}`;
      setResult(errorMessage);
      addLog(errorMessage, 'error');
      addLog(`🔍 Error type: ${error.name}`, 'error');
      addLog(`🔍 Error details: ${error.stack}`, 'error');
      console.error('❌ Network Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...');
    setDetailedLogs([]);

    try {
      addLog('🧪 Starting login API test...', 'info');
      console.log('🧪 Testing login API...');
      
      addLog('📡 Making request to: http://localhost:8001/api/auth/login/', 'info');
      
      const response = await fetch('http://localhost:8001/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'demo@surveyguy.com',
          password: 'demo123456'
        }),
      });

      addLog(`📊 Response status: ${response.status} ${response.statusText}`, 'info');

      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Login Test SUCCESS! User: ${data.user.email}`);
        addLog('✅ Login successful!', 'success');
        console.log('✅ Login successful:', data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = `❌ Login Error: ${response.status} - ${JSON.stringify(errorData)}`;
        setResult(errorMessage);
        addLog(errorMessage, 'error');
        console.error('❌ Login Error:', response.status, errorData);
      }
    } catch (error) {
      const errorMessage = `❌ Login Network Error: ${error.message}`;
      setResult(errorMessage);
      addLog(errorMessage, 'error');
      addLog(`🔍 Error type: ${error.name}`, 'error');
      addLog(`🔍 Error details: ${error.stack}`, 'error');
      console.error('❌ Login Network Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCORS = async () => {
    setLoading(true);
    setResult('Testing CORS...');
    setDetailedLogs([]);

    try {
      addLog('🧪 Testing CORS configuration...', 'info');
      
      const response = await fetch('http://localhost:8001/api/health/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3001'
        },
      });

      const corsHeaders = {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': response.headers.get('access-control-allow-headers')
      };

      addLog('📊 CORS Headers received:', 'info');
      Object.entries(corsHeaders).forEach(([key, value]) => {
        addLog(`  ${key}: ${value}`, 'info');
      });

      if (corsHeaders['access-control-allow-origin'] === 'http://localhost:3001') {
        setResult('✅ CORS is properly configured for localhost:3001');
        addLog('✅ CORS configuration is correct!', 'success');
      } else {
        setResult(`❌ CORS issue: Expected localhost:3001, got ${corsHeaders['access-control-allow-origin']}`);
        addLog('❌ CORS configuration issue detected', 'error');
      }
    } catch (error) {
      const errorMessage = `❌ CORS Test Error: ${error.message}`;
      setResult(errorMessage);
      addLog(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Network Connection Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Test Health Endpoint
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Login API
          </button>

          <button
            onClick={testCORS}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Test CORS
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="font-semibold text-lg mb-4">Test Result:</h3>
            <div className="bg-gray-50 p-4 rounded text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
              {result || 'Click a test button above to see results...'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="font-semibold text-lg mb-4">Detailed Logs:</h3>
            <div className="bg-gray-50 p-4 rounded text-sm font-mono max-h-64 overflow-y-auto">
              {detailedLogs.length === 0 ? (
                'No logs yet...'
              ) : (
                detailedLogs.map((log, index) => (
                  <div key={index} className={`mb-1 ${
                    log.type === 'error' ? 'text-red-600' : 
                    log.type === 'success' ? 'text-green-600' : 'text-gray-700'
                  }`}>
                    [{log.timestamp}] {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Current Configuration:</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• React App: Running on localhost:3001</li>
            <li>• Django Backend: Running on localhost:8001</li>
            <li>• CORS: Configured for localhost:3001</li>
            <li>• API Base URL: http://localhost:8001/api/</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleNetworkTest; 