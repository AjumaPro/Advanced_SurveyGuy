import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  AlertTriangle,
  Crown,
  Shield,
  Copy,
  ExternalLink
} from 'lucide-react';

const DatabaseSetup = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tableStatus, setTableStatus] = useState({});
  const [setupComplete, setSetupComplete] = useState(false);

  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';

  const requiredTables = [
    'profiles',
    'surveys',
    'survey_responses',
    'analytics',
    'notifications',
    'subscription_plans',
    'subscription_history',
    'invoices',
    'payment_methods',
    'api_keys',
    'sso_configurations',
    'survey_branding',
    'team_members',
    'file_uploads'
  ];

  const checkTableExists = async (tableName) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      return false;
    }
  };

  const verifyTables = async () => {
    setLoading(true);
    const status = {};
    
    for (const table of requiredTables) {
      status[table] = await checkTableExists(table);
    }
    
    setTableStatus(status);
    
    const allTablesExist = Object.values(status).every(exists => exists);
    setSetupComplete(allTablesExist);
    
    if (allTablesExist) {
      toast.success('All required tables exist!');
    } else {
      const missingTables = Object.entries(status)
        .filter(([_, exists]) => !exists)
        .map(([table, _]) => table);
      toast.error(`Missing tables: ${missingTables.join(', ')}`);
    }
    
    setLoading(false);
  };

  const setupSuperAdmin = async () => {
    if (!isSuperAdmin) {
      toast.error('Super admin access required');
      return;
    }

    try {
      setLoading(true);
      
      // Update the current user's profile to ensure enterprise plan
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          role: 'super_admin',
          plan: 'enterprise',
          is_active: true,
          is_verified: true,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        toast.error(`Failed to update profile: ${error.message}`);
      } else {
        toast.success('Super admin profile updated to Enterprise plan!');
        
        // Also create a subscription history record
        await supabase.from('subscription_history').insert({
          user_id: user.id,
          plan_name: 'enterprise',
          plan_id: 'enterprise',
          price: 149.99,
          currency: 'USD',
          billing_cycle: 'monthly',
          status: 'active',
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        // Refresh the page to update the UI
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Super admin setup error:', error);
      toast.error('Failed to setup super admin');
    } finally {
      setLoading(false);
    }
  };

  const sqlSetupScript = `-- Run this in your Supabase SQL Editor
-- Complete Database Setup Script

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Update existing user to super admin with enterprise plan
UPDATE public.profiles 
SET 
  role = 'super_admin',
  plan = 'enterprise',
  is_active = TRUE,
  is_verified = TRUE,
  updated_at = NOW()
WHERE email = '${user?.email}';

-- Insert subscription history for super admin
INSERT INTO public.subscription_history (
  user_id,
  plan_name,
  plan_id,
  price,
  currency,
  billing_cycle,
  status,
  starts_at,
  ends_at
) VALUES (
  (SELECT id FROM public.profiles WHERE email = '${user?.email}'),
  'enterprise',
  'enterprise',
  149.99,
  'USD',
  'monthly',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
) ON CONFLICT DO NOTHING;`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Super admin privileges required for database setup</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Crown className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Database Setup & Verification</h1>
          </motion.div>
          <p className="text-gray-600">Verify and setup your Supabase database for SurveyGuy</p>
        </div>

        {/* Super Admin Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Super Admin Database Control</h2>
              <p className="text-purple-100">
                Verify database tables and setup super admin enterprise access
              </p>
            </div>
            <Crown className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Verify Tables</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Check if all required database tables exist in your Supabase project
            </p>
            <button
              onClick={verifyTables}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>Verify Database Tables</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Setup Super Admin</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Ensure your account has super admin role and enterprise plan
            </p>
            <button
              onClick={setupSuperAdmin}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Crown className="w-4 h-4" />
              )}
              <span>Setup Super Admin</span>
            </button>
          </motion.div>
        </div>

        {/* Table Status */}
        {Object.keys(tableStatus).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Database Tables Status</h3>
                <div className="flex items-center space-x-2">
                  {setupComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">All tables exist</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-yellow-600 font-medium">Missing tables</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requiredTables.map((table) => (
                  <div
                    key={table}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      tableStatus[table] 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {tableStatus[table] ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      tableStatus[table] ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {table}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Manual Setup Instructions */}
        {!setupComplete && Object.keys(tableStatus).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Manual Database Setup</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Some tables are missing. Run the complete setup script in your Supabase SQL Editor:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Complete Setup Script</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(sqlSetupScript)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href="/complete-supabase-setup.sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="View full script"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
{sqlSetupScript}
                </pre>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Instructions:</h4>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Copy the SQL script above</li>
                      <li>Go to your Supabase project dashboard</li>
                      <li>Navigate to SQL Editor</li>
                      <li>Paste and run the complete setup script</li>
                      <li>Return here and click "Verify Database Tables"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {setupComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Database Setup Complete!</h3>
            <p className="text-green-700 mb-4">
              All required tables exist. Your SurveyGuy platform is ready to use.
            </p>
            <button
              onClick={() => window.location.href = '/app/dashboard'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSetup;
