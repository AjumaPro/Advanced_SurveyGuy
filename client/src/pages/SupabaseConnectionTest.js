import React, { useState, useEffect } from 'react';
import { supabase, authHelpers } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    addResult('Connection Test', 'info', 'Starting Supabase connection tests...');

    try {
      // Test 1: Basic connection
      addResult('Basic Connection', 'info', 'Testing basic Supabase client...');
      if (supabase) {
        addResult('Basic Connection', 'success', '✅ Supabase client initialized');
      } else {
        addResult('Basic Connection', 'error', '❌ Supabase client not initialized');
        return;
      }

      // Test 2: Environment variables
      addResult('Environment Check', 'info', 'Checking environment variables...');
      const url = process.env.REACT_APP_SUPABASE_URL;
      const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (url && key) {
        addResult('Environment Check', 'success', `✅ Environment variables loaded\nURL: ${url.substring(0, 30)}...\nKey: ${key.substring(0, 30)}...`);
      } else {
        addResult('Environment Check', 'error', '❌ Missing environment variables');
      }

      // Test 3: Database connection
      addResult('Database Connection', 'info', 'Testing database connection...');
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          addResult('Database Connection', 'warning', `⚠️ Database query failed: ${error.message}`);
        } else {
          addResult('Database Connection', 'success', '✅ Database connection successful');
        }
      } catch (err) {
        addResult('Database Connection', 'error', `❌ Database connection error: ${err.message}`);
      }

      // Test 4: Auth service
      addResult('Auth Service', 'info', 'Testing authentication service...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          addResult('Auth Service', 'warning', `⚠️ Auth service warning: ${error.message}`);
        } else {
          addResult('Auth Service', 'success', `✅ Auth service working${session ? ' (User logged in)' : ' (No session)'}`);
        }
      } catch (err) {
        addResult('Auth Service', 'error', `❌ Auth service error: ${err.message}`);
      }

      // Test 5: Check required tables
      addResult('Schema Check', 'info', 'Checking database schema...');
      const requiredTables = ['profiles', 'surveys', 'events', 'templates', 'notifications'];
      let schemaIssues = [];

      for (const table of requiredTables) {
        try {
          const { data, error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            schemaIssues.push(`${table}: ${error.message}`);
          }
        } catch (err) {
          schemaIssues.push(`${table}: ${err.message}`);
        }
      }

      if (schemaIssues.length === 0) {
        addResult('Schema Check', 'success', '✅ All required tables exist');
      } else {
        addResult('Schema Check', 'warning', `⚠️ Schema issues found:\n${schemaIssues.join('\n')}`);
      }

      // Test 6: RLS policies
      addResult('RLS Check', 'info', 'Testing Row Level Security...');
      if (user) {
        try {
          const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id);
          if (error) {
            addResult('RLS Check', 'warning', `⚠️ RLS policy issue: ${error.message}`);
          } else {
            addResult('RLS Check', 'success', '✅ RLS policies working (user can access own profile)');
          }
        } catch (err) {
          addResult('RLS Check', 'error', `❌ RLS test error: ${err.message}`);
        }
      } else {
        addResult('RLS Check', 'info', 'ℹ️ Cannot test RLS without authenticated user');
      }

      setConnectionStatus('completed');
      addResult('Final Status', 'success', '🎉 Connection tests completed!');

    } catch (error) {
      addResult('Connection Test', 'error', `❌ Unexpected error: ${error.message}`);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    const testEmail = 'test@surveyguy.com';
    const testPassword = 'TestPassword123!';

    try {
      addResult('User Creation', 'info', 'Creating test user...');
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });

      if (error) {
        addResult('User Creation', 'error', `❌ Failed to create user: ${error.message}`);
      } else {
        addResult('User Creation', 'success', `✅ Test user created: ${testEmail}`);
        toast.success('Test user created successfully!');
      }
    } catch (error) {
      addResult('User Creation', 'error', `❌ User creation error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setupDatabase = async () => {
    setLoading(true);
    addResult('Database Setup', 'info', 'Setting up database schema...');

    try {
      // Check if we can create a simple test record
      const testData = {
        id: crypto.randomUUID(),
        full_name: 'Test Profile',
        role: 'user',
        is_active: true,
        is_verified: true
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(testData)
        .select();

      if (error) {
        addResult('Database Setup', 'warning', `⚠️ Cannot insert test data: ${error.message}`);
        addResult('Database Setup', 'info', 'This might be normal if RLS policies are strict');
      } else {
        addResult('Database Setup', 'success', '✅ Database write test successful');
        
        // Clean up test data
        await supabase.from('profiles').delete().eq('id', testData.id);
        addResult('Database Setup', 'info', 'ℹ️ Test data cleaned up');
      }

    } catch (error) {
      addResult('Database Setup', 'error', `❌ Database setup error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Supabase Connection Test</h1>
          
          {/* Current Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Current Status</h3>
            <p className="text-blue-700">
              User: {user ? `${user.email} (Logged in)` : 'Not logged in'}
            </p>
            <p className="text-blue-700">
              Connection: {connectionStatus === 'testing' ? 'Testing...' : connectionStatus === 'completed' ? 'Tests completed' : 'Error occurred'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Run Connection Tests'}
            </button>
            
            <button
              onClick={createTestUser}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Test User'}
            </button>
            
            <button
              onClick={setupDatabase}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Database Setup'}
            </button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Test Results:</h3>
            {testResults.length === 0 ? (
              <p className="text-gray-500 italic">No tests run yet...</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{result.test}</h4>
                        <pre className="text-sm mt-1 whitespace-pre-wrap">{result.message}</pre>
                      </div>
                      <span className="text-xs opacity-75 ml-2">{result.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Quick Links:</h3>
            <div className="flex flex-wrap gap-4">
              <a href="/login-test" className="text-blue-600 hover:text-blue-800 underline">Login Test</a>
              <a href="/login" className="text-blue-600 hover:text-blue-800 underline">Login Page</a>
              <a href="/register" className="text-blue-600 hover:text-blue-800 underline">Register Page</a>
              <a href="/" className="text-blue-600 hover:text-blue-800 underline">Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;
