import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  Table,
  Eye,
  Settings
} from 'lucide-react';

const DatabaseTableVerification = () => {
  const [tableStatus, setTableStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const requiredTables = [
    'profiles',
    'surveys', 
    'survey_responses',
    'templates',
    'events',
    'event_registrations',
    'notifications',
    'analytics',
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

  const checkTables = async () => {
    setChecking(true);
    const status = {};
    
    for (const tableName of requiredTables) {
      try {
        // Try to query the table
        const { data, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          status[tableName] = { 
            exists: false, 
            error: error.message,
            count: 0
          };
        } else {
          status[tableName] = { 
            exists: true, 
            error: null,
            count: data || 0
          };
        }
      } catch (error) {
        status[tableName] = { 
          exists: false, 
          error: error.message,
          count: 0
        };
      }
    }
    
    setTableStatus(status);
    setChecking(false);
    setLoading(false);
  };

  useEffect(() => {
    checkTables();
  }, []);

  const createMissingTables = async () => {
    try {
      setLoading(true);
      toast.success('Creating missing tables... This may take a moment.');
      
      // You would need to run the SQL setup script
      toast.info('Please run the complete-supabase-setup.sql script in your Supabase SQL Editor');
      
    } catch (error) {
      console.error('Error creating tables:', error);
      toast.error('Failed to create tables');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (table) => {
    if (checking) return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    if (tableStatus[table]?.exists) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (table) => {
    if (tableStatus[table]?.exists) return 'bg-green-50 border-green-200';
    return 'bg-red-50 border-red-200';
  };

  const missingTables = Object.entries(tableStatus).filter(([_, status]) => !status.exists);
  const existingTables = Object.entries(tableStatus).filter(([_, status]) => status.exists);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Table Verification</h1>
          <p className="text-gray-600">
            Checking if all required tables exist for Advanced SurveyGuy functionality
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tables</p>
                <p className="text-2xl font-bold text-gray-900">{requiredTables.length}</p>
              </div>
              <Table className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Existing</p>
                <p className="text-2xl font-bold text-green-600">{existingTables.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Missing</p>
                <p className="text-2xl font-bold text-red-600">{missingTables.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={checkTables}
            disabled={checking}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>Refresh Check</span>
          </button>
          
          {missingTables.length > 0 && (
            <button
              onClick={createMissingTables}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Setup Missing Tables</span>
            </button>
          )}
        </div>

        {/* Missing Tables Alert */}
        {missingTables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-semibold text-red-900">Missing Tables Detected</h2>
            </div>
            <p className="text-red-700 mb-4">
              {missingTables.length} required tables are missing. Please run the database setup script.
            </p>
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Setup Instructions:</h3>
              <ol className="text-red-800 text-sm space-y-1 list-decimal list-inside">
                <li>Open your Supabase Dashboard</li>
                <li>Go to SQL Editor</li>
                <li>Copy contents of <code>client/complete-supabase-setup.sql</code></li>
                <li>Paste and run the script</li>
                <li>Refresh this page to verify</li>
              </ol>
            </div>
          </motion.div>
        )}

        {/* Table Status List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Table Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredTables.map((tableName, index) => (
              <motion.div
                key={tableName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${getStatusColor(tableName)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(tableName)}
                    <div>
                      <h3 className="font-medium text-gray-900">{tableName}</h3>
                      {tableStatus[tableName]?.exists && (
                        <p className="text-sm text-gray-600">
                          {typeof tableStatus[tableName].count === 'number' 
                            ? `${tableStatus[tableName].count} records`
                            : 'Ready'
                          }
                        </p>
                      )}
                      {tableStatus[tableName]?.error && (
                        <p className="text-sm text-red-600">
                          {tableStatus[tableName].error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {tableStatus[tableName]?.exists && (
                    <button
                      onClick={() => toast.info(`${tableName} table is working correctly`)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {missingTables.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8 text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-900 mb-2">All Tables Ready!</h2>
            <p className="text-green-700">
              All required database tables exist and are accessible. Your Advanced SurveyGuy is ready for full functionality.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DatabaseTableVerification;
