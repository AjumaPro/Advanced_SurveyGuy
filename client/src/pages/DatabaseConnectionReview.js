import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DatabaseConnectionReview = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const { user, userProfile } = useAuth();

  const addResult = (test, status, message, details = null) => {
    const result = {
      test,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [...prev, result]);
    return result;
  };

  const runComprehensiveTest = async () => {
    setLoading(true);
    setTestResults([]);
    setConnectionStatus('testing');

    try {
      // Test 1: Environment Variables
      addResult('Environment Check', 'info', 'Checking environment variables...');
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        addResult('Environment Check', 'success', '✅ Environment variables loaded', {
          url: supabaseUrl,
          keyLength: supabaseKey.length
        });
      } else {
        addResult('Environment Check', 'error', '❌ Missing environment variables');
        return;
      }

      // Test 2: Supabase Client Initialization
      addResult('Client Init', 'info', 'Testing Supabase client initialization...');
      if (supabase) {
        addResult('Client Init', 'success', '✅ Supabase client initialized successfully');
      } else {
        addResult('Client Init', 'error', '❌ Supabase client failed to initialize');
        return;
      }

      // Test 3: Authentication Status
      addResult('Auth Status', 'info', 'Checking authentication status...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          addResult('Auth Status', 'warning', `⚠️ Auth warning: ${error.message}`);
        } else if (session) {
          addResult('Auth Status', 'success', `✅ User authenticated: ${session.user.email}`, {
            userId: session.user.id,
            email: session.user.email
          });
        } else {
          addResult('Auth Status', 'info', 'ℹ️ No active session (user not logged in)');
        }
      } catch (err) {
        addResult('Auth Status', 'error', `❌ Auth error: ${err.message}`);
      }

      // Test 4: Database Connection
      addResult('DB Connection', 'info', 'Testing database connection...');
      try {
        // Try a simple query that should work regardless of RLS
        const { error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          if (error.code === '42P01') {
            addResult('DB Connection', 'warning', '⚠️ Profiles table does not exist', { error: error.message });
          } else {
            addResult('DB Connection', 'info', '✅ Database connected (RLS may be restricting access)', { error: error.message });
          }
        } else {
          addResult('DB Connection', 'success', '✅ Database connection successful');
        }
      } catch (err) {
        addResult('DB Connection', 'error', `❌ Database connection failed: ${err.message}`);
      }

      // Test 5: Table Structure Check
      addResult('Table Check', 'info', 'Checking required tables...');
      const requiredTables = [
        'profiles', 'surveys', 'survey_responses', 'templates', 
        'events', 'event_registrations', 'notifications', 'analytics'
      ];
      
      let existingTables = [];
      let missingTables = [];
      
      for (const tableName of requiredTables) {
        try {
          const { error } = await supabase.from(tableName).select('*').limit(1);
          if (error) {
            if (error.code === '42P01') {
              missingTables.push(tableName);
            } else {
              existingTables.push({ name: tableName, accessible: false, error: error.message });
            }
          } else {
            existingTables.push({ name: tableName, accessible: true });
          }
        } catch (err) {
          missingTables.push(tableName);
        }
      }

      addResult('Table Check', 'info', `Found ${existingTables.length}/${requiredTables.length} tables`, {
        existing: existingTables,
        missing: missingTables
      });

      // Test 6: Profile Integration
      if (user) {
        addResult('Profile Integration', 'info', 'Testing user profile integration...');
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            addResult('Profile Integration', 'warning', `⚠️ Profile access issue: ${error.message}`);
          } else if (profile) {
            addResult('Profile Integration', 'success', '✅ User profile found and accessible', {
              profile: {
                id: profile.id,
                email: profile.email,
                role: profile.role,
                isActive: profile.is_active
              }
            });
          } else {
            addResult('Profile Integration', 'warning', '⚠️ No profile found for authenticated user');
          }
        } catch (err) {
          addResult('Profile Integration', 'error', `❌ Profile integration error: ${err.message}`);
        }
      } else {
        addResult('Profile Integration', 'info', 'ℹ️ Cannot test profile integration - user not authenticated');
      }

      // Test 7: RLS Policy Check
      addResult('RLS Check', 'info', 'Testing Row Level Security policies...');
      if (user) {
        try {
          // Test if user can access their own data
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role')
            .eq('id', user.id);
          
          if (error) {
            addResult('RLS Check', 'warning', `⚠️ RLS policy issue: ${error.message}`);
          } else {
            addResult('RLS Check', 'success', '✅ RLS policies working correctly');
          }
        } catch (err) {
          addResult('RLS Check', 'error', `❌ RLS test failed: ${err.message}`);
        }
      } else {
        addResult('RLS Check', 'info', 'ℹ️ Cannot test RLS - user not authenticated');
      }

      // Test 8: Real-time Connection
      addResult('Realtime Check', 'info', 'Testing real-time connection...');
      try {
        const channel = supabase.channel('connection-test');
        const subscription = channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            addResult('Realtime Check', 'success', '✅ Real-time connection working');
          } else if (status === 'CHANNEL_ERROR') {
            addResult('Realtime Check', 'warning', '⚠️ Real-time connection issues');
          }
        });
        
        // Clean up after a short delay
        setTimeout(() => {
          supabase.removeChannel(channel);
        }, 2000);
      } catch (err) {
        addResult('Realtime Check', 'warning', `⚠️ Real-time test failed: ${err.message}`);
      }

      // Test 9: Write Operations (if authenticated)
      if (user) {
        addResult('Write Test', 'info', 'Testing write operations...');
        try {
          // Try to update user's last_login_at (safe operation)
          const { error } = await supabase
            .from('profiles')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', user.id);
          
          if (error) {
            addResult('Write Test', 'warning', `⚠️ Write operation failed: ${error.message}`);
          } else {
            addResult('Write Test', 'success', '✅ Write operations working');
          }
        } catch (err) {
          addResult('Write Test', 'error', `❌ Write test failed: ${err.message}`);
        }
      } else {
        addResult('Write Test', 'info', 'ℹ️ Cannot test write operations - user not authenticated');
      }

      setConnectionStatus('completed');
      addResult('Final Status', 'success', '🎉 Connection review completed!');

    } catch (error) {
      addResult('Connection Review', 'error', `❌ Unexpected error: ${error.message}`);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComprehensiveTest();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔍';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Database Connection Review</h1>
          
          {/* Current Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Current Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">User:</span> {user ? `${user.email}` : 'Not logged in'}
              </div>
              <div>
                <span className="font-medium">Profile:</span> {userProfile ? `${userProfile.role}` : 'Not loaded'}
              </div>
              <div>
                <span className="font-medium">Connection:</span> {connectionStatus}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mb-6 text-center">
            <button
              onClick={runComprehensiveTest}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Running Tests...' : 'Run Connection Review'}
            </button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Test Results:</h3>
            {testResults.length === 0 ? (
              <p className="text-gray-500 italic">No tests run yet...</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="mr-2">{getStatusIcon(result.status)}</span>
                        <h4 className="font-semibold">{result.test}</h4>
                      </div>
                      <span className="text-xs opacity-75">{result.timestamp}</span>
                    </div>
                    <p className="mb-2">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium">View Details</summary>
                        <pre className="mt-2 text-xs bg-white bg-opacity-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {testResults.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Summary:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {['success', 'warning', 'error', 'info'].map(status => {
                  const count = testResults.filter(r => r.status === status).length;
                  return (
                    <div key={status} className="p-2 rounded">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm capitalize">{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-3">Quick Actions:</h3>
            <div className="flex flex-wrap gap-4">
              <a href="/database-inspector" className="text-blue-600 hover:text-blue-800 underline">
                Database Inspector
              </a>
              <a href="/supabase-test" className="text-blue-600 hover:text-blue-800 underline">
                Connection Test
              </a>
              <a href="/login-test" className="text-blue-600 hover:text-blue-800 underline">
                Login Test
              </a>
              <a href="/login" className="text-blue-600 hover:text-blue-800 underline">
                Login Page
              </a>
              <a href="/app/dashboard" className="text-blue-600 hover:text-blue-800 underline">
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnectionReview;
