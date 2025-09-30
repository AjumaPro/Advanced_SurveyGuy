import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Crown,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Database,
  User
} from 'lucide-react';

const SuperAdminFix = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fixSuperAdminPlan = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    setStatus('Checking current profile...');

    try {
      // First, check current profile
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        setStatus('Profile not found, creating new one...');
        
        // Create new profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            role: 'super_admin',
            plan: 'enterprise',
            is_active: true,
            is_verified: true,
            full_name: user.user_metadata?.full_name || 'Super Admin'
          })
          .select()
          .single();

        if (createError) {
          console.error('Create error:', createError);
          toast.error(`Failed to create profile: ${createError.message}`);
          setStatus('Failed to create profile');
        } else {
          toast.success('Super admin profile created with Enterprise plan!');
          setStatus('Profile created successfully');
        }
      } else {
        setStatus('Updating existing profile...');
        
        // Update existing profile
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'super_admin',
            plan: 'enterprise',
            is_active: true,
            is_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('Update error:', updateError);
          toast.error(`Failed to update profile: ${updateError.message}`);
          setStatus('Failed to update profile');
        } else {
          toast.success('Super admin profile updated to Enterprise plan!');
          setStatus('Profile updated successfully');
        }
      }

      // Create subscription history record
      setStatus('Creating subscription history...');
      
      const { error: subError } = await supabase
        .from('subscription_history')
        .upsert({
          user_id: user.id,
          plan_name: 'enterprise',
          plan_id: 'enterprise',
          price: 149.99,
          currency: 'USD',
          billing_cycle: 'monthly',
          status: 'active',
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }, {
          onConflict: 'user_id,plan_id'
        });

      if (subError) {
        console.log('Subscription history error (may be expected):', subError);
        setStatus('Profile updated, subscription history may need manual setup');
      } else {
        setStatus('Complete! Profile and subscription updated');
      }

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Fix error:', error);
      toast.error(`Error: ${error.message}`);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    setStatus('Testing database connection...');

    try {
      // Test profiles table
      const { data: profileTest, error: profileError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (profileError) {
        setStatus(`Profiles table error: ${profileError.message}`);
        toast.error('Profiles table not accessible');
        return;
      }

      // Test subscription_history table
      const { data: subTest, error: subError } = await supabase
        .from('subscription_history')
        .select('count')
        .limit(1);

      if (subError) {
        setStatus(`Subscription history table error: ${subError.message}`);
        toast.error('Subscription history table not accessible - this is the main issue!');
        return;
      }

      setStatus('All database tables accessible!');
      toast.success('Database connection successful');

    } catch (error) {
      setStatus(`Database test error: ${error.message}`);
      toast.error('Database test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Fix</h1>
          </div>
          <p className="text-gray-600">Fix super admin plan assignment and database issues</p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email || 'Not logged in'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Role:</span>
              <span className={`font-medium ${
                userProfile?.role === 'super_admin' ? 'text-purple-600' : 'text-gray-900'
              }`}>
                {userProfile?.role || 'Loading...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan:</span>
              <span className={`font-medium ${
                userProfile?.plan === 'enterprise' ? 'text-green-600' : 'text-red-600'
              }`}>
                {userProfile?.plan || 'Loading...'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Database className="w-5 h-5" />
              )}
              <span>Test Database Connection</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={fixSuperAdminPlan}
              disabled={loading || !user}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Crown className="w-5 h-5" />
              )}
              <span>Fix Super Admin Plan</span>
            </button>
          </motion.div>
        </div>

        {/* Status Display */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Status:</h3>
                <p className="text-gray-700">{status}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>First, click "Test Database Connection" to check if tables exist</li>
                <li>If database test fails, you need to run the complete SQL setup in Supabase</li>
                <li>Then click "Fix Super Admin Plan" to update your profile</li>
                <li>The page will refresh automatically after the fix</li>
                <li>Check the billing page to confirm Enterprise plan is showing</li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Database Setup Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <a
            href="/app/database-setup"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <Database className="w-4 h-4" />
            <span>Go to Database Setup Tool</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminFix;
