import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

const BackendConnectionTest = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const testHealthEndpoint = async () => {
    try {
      const response = await api.get('/health/');
      setHealthStatus({
        success: true,
        data: response.data,
        message: 'Health check successful'
      });
    } catch (error) {
      setHealthStatus({
        success: false,
        error: error.message,
        message: 'Health check failed'
      });
    }
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login/', {
        email: 'admin@surveyguy.com',
        password: 'admin123'
      });
      setAuthStatus({
        success: true,
        data: response.data,
        message: 'Authentication successful'
      });
    } catch (error) {
      setAuthStatus({
        success: false,
        error: error.message,
        message: 'Authentication failed'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    testHealthEndpoint();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Backend Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Health Check</h3>
        {healthStatus ? (
          <div style={{ 
            padding: '10px', 
            backgroundColor: healthStatus.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${healthStatus.success ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px'
          }}>
            <strong>{healthStatus.message}</strong>
            {healthStatus.success && (
              <pre style={{ marginTop: '10px', fontSize: '12px' }}>
                {JSON.stringify(healthStatus.data, null, 2)}
              </pre>
            )}
            {!healthStatus.success && (
              <p style={{ color: '#721c24', marginTop: '10px' }}>
                Error: {healthStatus.error}
              </p>
            )}
          </div>
        ) : (
          <p>Testing health endpoint...</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Authentication Test</h3>
        <button 
          onClick={testAuthEndpoint}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Authentication'}
        </button>
        
        {authStatus && (
          <div style={{ 
            marginTop: '10px',
            padding: '10px', 
            backgroundColor: authStatus.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${authStatus.success ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px'
          }}>
            <strong>{authStatus.message}</strong>
            {authStatus.success && (
              <div style={{ marginTop: '10px' }}>
                <p><strong>User:</strong> {authStatus.data.user.email}</p>
                <p><strong>Role:</strong> {authStatus.data.user.role}</p>
                <p><strong>Token:</strong> {authStatus.data.tokens.access.substring(0, 50)}...</p>
              </div>
            )}
            {!authStatus.success && (
              <p style={{ color: '#721c24', marginTop: '10px' }}>
                Error: {authStatus.error}
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <h4>Connection Summary</h4>
        <ul>
          <li><strong>Frontend URL:</strong> http://localhost:3000</li>
          <li><strong>Backend URL:</strong> http://localhost:8000/api</li>
          <li><strong>Health Status:</strong> {healthStatus?.success ? '✅ Connected' : '❌ Failed'}</li>
          <li><strong>Auth Status:</strong> {authStatus?.success ? '✅ Working' : authStatus ? '❌ Failed' : '⏳ Not Tested'}</li>
        </ul>
      </div>
    </div>
  );
};

export default BackendConnectionTest; 