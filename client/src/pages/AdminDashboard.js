import React, { useState, useEffect } from 'react';
import {useAuth} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Users,
  CreditCard,
  Package,
  Activity,
  UserCheck,
  UserX,
  DollarSign,
  Crown
} from 'lucide-react';
const AdminDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingAccounts: 0,
    pendingPayments: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
    if (!user || !isAdmin) {
      navigate('/app/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, userProfile, navigate]);
  const fetchDashboardData = async () => {
    try {
      const response = await api.admin.getDashboardStats();
      if (response.error) {
        console.error('Admin dashboard error:', response.error);
        toast.error('Failed to load admin dashboard');
      } else {
        setStats(response.stats);
        setRecentActions(response.recentActions);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };
  const getActionIcon = (action) => {
    switch (action) {
      case 'account_approved':
      case 'account_rejected':
        return <UserCheck className="w-4 h-4" />;
      case 'payment_approved':
      case 'payment_rejected':
        return <CreditCard className="w-4 h-4" />;
      case 'package_created':
      case 'package_updated':
      case 'package_deleted':
        return <Package className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };
  const getActionColor = (action) => {
    if (action.includes('approved') || action.includes('created')) {
      return 'text-green-600 bg-green-100';
    }
    if (action.includes('rejected') || action.includes('deleted')) {
      return 'text-red-600 bg-red-100';
    }
    return 'text-blue-600 bg-blue-100';
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your application's users, packages, and payments</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Accounts */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserX className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAccounts}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/admin/accounts')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Review Accounts →
            </button>
          </div>
          {/* Pending Payments */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/admin/payments')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Review Payments →
            </button>
          </div>
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/admin/accounts')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Users →
            </button>
          </div>
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₵{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/admin/payments')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Payments →
            </button>
          </div>
        </div>
        {/* Super Admin Access */}
        {(user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin') && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Super Admin Access</h3>
                  <p className="text-gray-600">Access the complete Super Admin Dashboard for full system control</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/app/super-admin')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span>Super Admin Dashboard</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Manage Packages */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Package className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Manage Packages</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create, edit, and manage subscription packages for your users.
            </p>
            <button
              onClick={() => navigate('/app/admin/packages')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Packages
            </button>
          </div>
          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">User Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Approve new accounts and manage existing user permissions.
            </p>
            <button
              onClick={() => navigate('/app/admin/accounts')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Manage Users
            </button>
          </div>
          {/* Payment Approvals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Payment Approvals</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Review and approve pending payment transactions.
            </p>
            <button
              onClick={() => navigate('/app/admin/payments')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Review Payments
            </button>
          </div>
        </div>
        {/* Recent Admin Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Admin Actions</h3>
          </div>
          <div className="p-6">
            {recentActions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent actions</p>
            ) : (
              <div className="space-y-4">
                {recentActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getActionColor(action.action)}`}>
                        {getActionIcon(action.action)}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">
                          {action.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">
                          {action.target_type}: {action.target_id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(action.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {action.admin_name && (
                      <span className="text-sm text-gray-500">by {action.admin_name}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard; 