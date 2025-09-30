import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminRoleChecker from '../components/AdminRoleChecker';
import { ArrowLeft, Shield, Crown, Settings, Lock } from 'lucide-react';

const AdminSetup = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  // Only allow super admin access
  if (user?.email !== 'infoajumapro@gmail.com' && userProfile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Lock size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This page is only accessible to super administrators.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Return to Dashboard
            </button>
            {user?.email === 'infoajumapro@gmail.com' && (
              <p className="text-sm text-blue-600">
                You are the super admin but your profile may not be loaded yet. Please refresh the page.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">
            Configure your admin privileges to access administration features
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Admin Role Checker */}
        <AdminRoleChecker />

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-purple-600" />
            Admin Features Available
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Admin Dashboard</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• User account management</li>
                <li>• System statistics overview</li>
                <li>• Platform monitoring tools</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">User Management</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View all user accounts</li>
                <li>• Update user roles and permissions</li>
                <li>• Account verification management</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Package Management</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create and edit subscription plans</li>
                <li>• Manage pricing and features</li>
                <li>• Monitor subscription analytics</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Payment Management</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View payment transactions</li>
                <li>• Manage billing issues</li>
                <li>• Generate financial reports</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            After setting your admin role, you can access admin features from the sidebar
          </p>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Settings className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
