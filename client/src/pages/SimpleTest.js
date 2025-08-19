import React, { useState } from 'react';
import api from '../utils/axios';

const SimpleTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      console.log('🧪 Testing API connection...');
      const response = await api.post('/auth/login', {
        email: 'demo@surveyguy.com',
        password: 'demo123456'
      });
      
      console.log('✅ Test successful:', response.data);
      setResult(`✅ SUCCESS! User: ${response.data.user.email}`);
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResult(`❌ FAILED: ${error.message}`);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setResult(`❌ FAILED: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Connection Test</h1>
      <p>Current API URL: {api.defaults.baseURL}</p>
      
      <button 
        onClick={testAPI} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Login API'}
      </button>
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: result.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('SUCCESS') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <strong>Result:</strong> {result}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Check browser console (F12) for detailed logs</p>
      </div>
    </div>
  );
};

export default SimpleTest; 