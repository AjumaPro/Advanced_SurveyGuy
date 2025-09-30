import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginTest = () => {
  const [email, setEmail] = useState('infoajumapro@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { user, login } = useAuth();

  const testDirectLogin = async () => {
    setLoading(true);
    setResult('Testing direct Supabase login...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setResult(`❌ Direct login failed: ${error.message}`);
        return;
      }

      setResult(`✅ Direct login successful! User: ${data.user.email}`);
      toast.success('Direct login successful!');

    } catch (error) {
      setResult(`❌ Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthContextLogin = async () => {
    setLoading(true);
    setResult('Testing AuthContext login...');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setResult(`✅ AuthContext login successful! User: ${result.user?.email}`);
        toast.success('AuthContext login successful!');
      } else {
        setResult(`❌ AuthContext login failed: ${result.error}`);
      }

    } catch (error) {
      setResult(`❌ AuthContext error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestAccount = async () => {
    setLoading(true);
    setResult('Creating test account...');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });

      if (error) {
        setResult(`❌ Account creation failed: ${error.message}`);
        return;
      }

      setResult(`✅ Account created! User: ${data.user?.email}. Check email for confirmation.`);
      toast.success('Account created successfully!');

    } catch (error) {
      setResult(`❌ Creation error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Login Test & Debug</h1>
          
          {/* Current User Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Current User Status</h3>
            <p className="text-blue-700">
              {user ? `Logged in as: ${user.email}` : 'Not logged in'}
            </p>
          </div>

          {/* Login Form */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Test Login</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={createTestAccount}
              disabled={loading || !email || !password}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Test Account'}
            </button>
            
            <button
              onClick={testDirectLogin}
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Direct Supabase Login'}
            </button>
            
            <button
              onClick={testAuthContextLogin}
              disabled={loading || !email || !password}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test AuthContext Login'}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Enter your email and password</li>
              <li>2. Click "Create Test Account" if you don't have one</li>
              <li>3. Click "Test Direct Supabase Login" to test authentication</li>
              <li>4. If that works, test "AuthContext Login"</li>
            </ol>
          </div>

          {/* Navigation */}
          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTest;