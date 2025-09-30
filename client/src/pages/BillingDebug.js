import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const BillingDebug = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const debugBilling = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Debugging billing page...');
        console.log('👤 User:', user);
        
        if (!user) {
          setError('No user found');
          setLoading(false);
          return;
        }
        
        console.log('📊 Fetching subscription history...');
        
        // Test basic connection
        const { data: testData, error: testError } = await supabase
          .from('subscription_history')
          .select('count')
          .eq('user_id', user.id);
          
        console.log('🧪 Test query result:', { testData, testError });
        
        // Fetch subscription data
        const { data: subscriptionData, error: subError } = await supabase
          .from('subscription_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        console.log('📋 Subscription query:', { subscriptionData, subError });

        // Fetch billing history
        const { data: historyData, error: historyError } = await supabase
          .from('subscription_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        console.log('📝 History query:', { historyData, historyError });

        setDebugInfo({
          user: {
            id: user.id,
            email: user.email,
          },
          testQuery: {
            data: testData,
            error: testError?.message
          },
          subscription: {
            data: subscriptionData,
            error: subError?.message
          },
          history: {
            data: historyData,
            error: historyError?.message,
            count: historyData?.length || 0
          },
          supabaseUrl: supabase.supabaseUrl,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('❌ Debug error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      debugBilling();
    } else {
      setLoading(false);
      setError('No authenticated user');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Debugging billing page...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing Debug Information</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold mb-2">User Information</h3>
              <pre className="text-sm text-blue-700 overflow-x-auto">
                {JSON.stringify(debugInfo.user, null, 2)}
              </pre>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">Test Query</h3>
              <pre className="text-sm text-green-700 overflow-x-auto">
                {JSON.stringify(debugInfo.testQuery, null, 2)}
              </pre>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-purple-800 font-semibold mb-2">Subscription Data</h3>
              <pre className="text-sm text-purple-700 overflow-x-auto">
                {JSON.stringify(debugInfo.subscription, null, 2)}
              </pre>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-800 font-semibold mb-2">History Data</h3>
              <pre className="text-sm text-yellow-700 overflow-x-auto">
                {JSON.stringify(debugInfo.history, null, 2)}
              </pre>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-gray-800 font-semibold mb-2">System Info</h3>
              <pre className="text-sm text-gray-700 overflow-x-auto">
                {JSON.stringify({
                  supabaseUrl: debugInfo.supabaseUrl,
                  timestamp: debugInfo.timestamp
                }, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh Debug
            </button>
            
            <button
              onClick={() => window.location.href = '/app/billing'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Try Billing Page
            </button>
            
            <button
              onClick={() => console.log('Debug Info:', debugInfo)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Log to Console
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BillingDebug;
