import React, { useState, useEffect } from 'react';

const SimpleTest = () => {
  const [status, setStatus] = useState('Loading...');
  const [apiStatus, setApiStatus] = useState('Not tested');

  useEffect(() => {
    setStatus('Frontend is working!');
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setApiStatus(`API Working: ${data.status}`);
    } catch (error) {
      setApiStatus(`API Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>SurveyGuy Frontend Test</h1>
      <div style={{ margin: '20px 0' }}>
        <h2>Frontend Status: {status}</h2>
        <h2>API Status: {apiStatus}</h2>
        <button onClick={testAPI} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Test API Connection
        </button>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Working Login Credentials:</h3>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          <p><strong>Super Admin:</strong></p>
          <p>Email: superadmin@test.com</p>
          <p>Password: SuperAdmin123!</p>
          <br/>
          <p><strong>Regular User:</strong></p>
          <p>Email: newuser@test.com</p>
          <p>Password: test123</p>
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>Quick Links:</h3>
        <a href="/login" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>
          → Go to Login Page
        </a>
        <a href="/register" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>
          → Go to Register Page
        </a>
        <a href="/admin/login" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>
          → Go to Admin Login
        </a>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>System Information:</h3>
        <p><strong>Backend URL:</strong> http://localhost:5000</p>
        <p><strong>Frontend URL:</strong> http://localhost:3000</p>
        <p><strong>Database:</strong> PostgreSQL (Connected)</p>
        <p><strong>Environment:</strong> Development</p>
      </div>
    </div>
  );
};

export default SimpleTest; 