import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginDebugger = () => {
  const [email, setEmail] = useState('demo@surveyguy.com');
  const [password, setPassword] = useState('demo123456');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { user, userProfile, login } = useAuth();

  const testDirectSupabaseLogin = async () => {
    setLoading(true);
    setResult('Testing direct Supabase login...');
    
    try {
      console.log('🧪 Direct Supabase test - Email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('❌ Direct Supabase error:', error);
        setResult(`❌ Direct Supabase Error: ${error.message}`);
        toast.error(error.message);
      } else {
        console.log('✅ Direct Supabase success:', data);
        setResult(`✅ Direct Supabase Success! User: ${data.user.email}`);
        toast.success('Direct login successful!');
      }
    } catch (err) {
      console.error('❌ Direct Supabase exception:', err);
      setResult(`❌ Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthContextLogin = async () => {
    setLoading(true);
    setResult('Testing AuthContext login...');
    
    try {
      console.log('🧪 AuthContext test - Email:', email);
      const result = await login(email, password);
      
      if (result.success) {
        console.log('✅ AuthContext success:', result);
        setResult(`✅ AuthContext Success! User: ${result.user?.email || 'Unknown'}`);
        toast.success('AuthContext login successful!');
      } else {
        console.error('❌ AuthContext error:', result.error);
        setResult(`❌ AuthContext Error: ${result.error}`);
        toast.error(result.error);
      }
    } catch (err) {
      console.error('❌ AuthContext exception:', err);
      setResult(`❌ Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentSession = async () => {
    setResult('Checking current session...');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult(`❌ Session Error: ${error.message}`);
      } else if (session) {
        setResult(`✅ Active Session: ${session.user.email}`);
      } else {
        setResult('❌ No active session');
      }
    } catch (err) {
      setResult(`❌ Session Exception: ${err.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-lg mb-4">🔧 Login Debugger</h3>
      
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={testDirectSupabaseLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '⏳ Testing...' : '🧪 Test Direct Supabase'}
        </button>
        
        <button
          onClick={testAuthContextLogin}
          disabled={loading}
          className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? '⏳ Testing...' : '🔧 Test AuthContext'}
        </button>
        
        <button
          onClick={checkCurrentSession}
          disabled={loading}
          className="w-full bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
        >
          🔍 Check Session
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-2 rounded text-xs mb-3">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      <div className="text-xs text-gray-600 space-y-1">
        <div><strong>Current User:</strong> {user?.email || 'None'}</div>
        <div><strong>User Profile:</strong> {userProfile?.role || 'None'}</div>
        <div><strong>Supabase URL:</strong> {supabase.supabaseUrl}</div>
      </div>
    </div>
  );
};

export default LoginDebugger;
