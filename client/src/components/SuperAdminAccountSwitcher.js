import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Crown,
  RefreshCw,
  LogOut,
  Eye,
  ArrowLeft,
  Shield,
  User,
  Mail,
  Calendar,
  Zap,
  Star,
  X,
  ChevronDown
} from 'lucide-react';

const SuperAdminAccountSwitcher = () => {
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [impersonating, setImpersonating] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);

  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';

  // Fetch all user accounts
  const fetchAccounts = async () => {
    if (!isSuperAdmin) return;

    try {
      setLoading(true);
      const response = await api.admin.getAllUsers({
        search: searchTerm,
        limit: 20
      });

      if (response.error) {
        toast.error('Failed to load accounts');
      } else {
        setAccounts(response.users || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isSuperAdmin) {
      fetchAccounts();
    }
  }, [isOpen, searchTerm, isSuperAdmin]);

  // Impersonate user (view as user)
  const impersonateUser = async (targetUser) => {
    try {
      // Store original user info if not already impersonating
      if (!impersonating) {
        setOriginalUser({
          id: user.id,
          email: user.email,
          profile: userProfile
        });
      }

      // Set impersonation state
      setImpersonating(targetUser);
      setIsOpen(false);

      toast.success(`Now viewing as: ${targetUser.email}`);
      
      // Refresh the page to update the UI with the new user context
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error impersonating user:', error);
      toast.error('Failed to switch to user account');
    }
  };

  // Stop impersonation and return to original account
  const stopImpersonation = () => {
    setImpersonating(null);
    setOriginalUser(null);
    toast.success('Returned to super admin account');
    
    // Refresh to restore original context
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Get plan icon and color
  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'enterprise': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'pro': return <Zap className="w-4 h-4 text-blue-600" />;
      default: return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (!isSuperAdmin) return null;

  return (
    <>
      {/* Impersonation Banner */}
      {impersonating && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5" />
              <span className="font-medium">
                Super Admin Mode: Viewing as {impersonating.email}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(impersonating.plan)}`}>
                {impersonating.plan}
              </span>
            </div>
            <button
              onClick={stopImpersonation}
              className="bg-red-700 hover:bg-red-800 px-4 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Switcher Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          <span>Switch Account</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <span>Super Admin Account Switcher</span>
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Current User */}
              <div className="p-4 bg-purple-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Crown className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {user?.email} {impersonating && '(Original)'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                        Super Admin
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
                        Enterprise
                      </span>
                    </div>
                  </div>
                  <div className="text-green-600 text-sm font-medium">Current</div>
                </div>
              </div>

              {/* Account List */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Loading accounts...</p>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="p-6 text-center">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
                      {searchTerm ? 'No accounts found' : 'No accounts available'}
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {accounts
                      .filter(account => account.id !== user?.id) // Don't show current user
                      .map((account) => (
                      <div
                        key={account.id}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => impersonateUser(account)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-gray-900 truncate">
                                {account.full_name || 'No name'}
                              </p>
                              {impersonating?.id === account.id && (
                                <Eye className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{account.email}</span>
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(account.role)}`}>
                                {account.role}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPlanColor(account.plan)}`}>
                                {getPlanIcon(account.plan)}
                                <span className="ml-1">{account.plan}</span>
                              </span>
                              <span className="text-xs text-gray-500 flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(account.created_at).toLocaleDateString()}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">View as</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Super Admin Privileges</span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={fetchAccounts}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SuperAdminAccountSwitcher;
