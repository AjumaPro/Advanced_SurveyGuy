import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AuthTest = () => {
  const [loginData, setLoginData] = useState({
    email: 'demo@surveyguy.com',
    password: 'demo123456'
  });
  const [registerData, setRegisterData] = useState({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'test123456',
    confirmPassword: 'test123456'
  });
  const [loginResult, setLoginResult] = useState('');
  const [registerResult, setRegisterResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();

  const testLogin = async () => {
    setLoading(true);
    setLoginResult('Testing login...');
    
    try {
      console.log('🧪 Testing login with:', loginData);
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        setLoginResult(`✅ LOGIN SUCCESS! User: ${result.user?.email || 'Unknown'}`);
      } else {
        setLoginResult(`❌ LOGIN FAILED: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Login test error:', error);
      setLoginResult(`❌ LOGIN ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setRegisterResult('Testing registration...');
    
    try {
      console.log('🧪 Testing registration with:', registerData);
      const result = await register(registerData.email, registerData.password, registerData.name);
      
      if (result.success) {
        setRegisterResult(`✅ REGISTRATION SUCCESS! User: ${result.user?.email || 'Unknown'}`);
      } else {
        setRegisterResult(`❌ REGISTRATION FAILED: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Registration test error:', error);
      setRegisterResult(`❌ REGISTRATION ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setLoginResult('Testing direct API...');
    
    try {
      console.log('🧪 Testing direct API call...');
      const response = await api.post('/auth/login', {
        email: 'demo@surveyguy.com',
        password: 'demo123456'
      });
      
      console.log('✅ Direct API response:', response.data);
      setLoginResult(`✅ DIRECT API SUCCESS! User: ${response.data.user.email}`);
    } catch (error) {
      console.error('❌ Direct API error:', error);
      setLoginResult(`❌ DIRECT API ERROR: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setLoginResult('');
    setRegisterResult('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔐 Authentication Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <h3>Current Status:</h3>
        <p><strong>API URL:</strong> {api.defaults.baseURL}</p>
        <p><strong>Current User:</strong> {user ? `${user.email} (ID: ${user.id})` : 'Not logged in'}</p>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Not found'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Login Test */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>🔑 Login Test</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <button
            onClick={testLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '10px'
            }}
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
          
          <button
            onClick={testDirectAPI}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Testing...' : 'Test Direct API'}
          </button>
          
          {loginResult && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: loginResult.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${loginResult.includes('SUCCESS') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              <strong>Result:</strong> {loginResult}
            </div>
          )}
        </div>

        {/* Registration Test */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>📝 Registration Test</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
            <input
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          
          <button
            onClick={testRegister}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: loading ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Testing...' : 'Test Registration'}
          </button>
          
          {registerResult && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: registerResult.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${registerResult.includes('SUCCESS') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              <strong>Result:</strong> {registerResult}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Use the login test with the demo account: demo@surveyguy.com / demo123456</li>
          <li>Use the registration test with a new email address</li>
          <li>Check browser console (F12) for detailed logs</li>
          <li>The "Test Direct API" button bypasses the AuthContext for direct testing</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthTest; 