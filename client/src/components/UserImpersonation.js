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
  Eye,
  ArrowLeft,
  User,
  Mail,
  X,
  ChevronDown,
  LogIn,
  Shield,
  Zap,
  Star
} from 'lucide-react';

const UserImpersonation = () => {
  const { user, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [impersonating, setImpersonating] = useState(null);

  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';

  // Check if currently impersonating
  useEffect(() => {
    const impersonationData = sessionStorage.getItem('admin_impersonation');
    if (impersonationData) {
      setImpersonating(JSON.parse(impersonationData));
    }
  }, []);

  // Fetch user accounts
  const fetchAccounts = async () => {
    if (!isSuperAdmin) return;

    try {
      setLoading(true);
      const response = await api.admin.getAllUsers({
        search: searchTerm,
        limit: 50
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

  // Start impersonation
  const startImpersonation = async (targetUser) => {
    try {
      // Store original user data
      const originalUserData = {
        id: user.id,
        email: user.email,
        profile: userProfile,
        timestamp: new Date().toISOString()
      };

      // Store impersonation data in session storage
      sessionStorage.setItem('admin_impersonation', JSON.stringify({
        originalUser: originalUserData,
        targetUser: targetUser,
        startedAt: new Date().toISOString()
      }));

      // Update the profile to temporarily switch context
      const tempProfile = {
        ...targetUser,
        _impersonated: true,
        _originalAdmin: originalUserData
      };

      setImpersonating({
        originalUser: originalUserData,
        targetUser: targetUser
      });

      toast.success(`Now viewing as: ${targetUser.email}`);
      setIsOpen(false);

      // Force a page refresh to update all contexts
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error starting impersonation:', error);
      toast.error('Failed to switch to user account');
    }
  };

  // Stop impersonation
  const stopImpersonation = () => {
    sessionStorage.removeItem('admin_impersonation');
    setImpersonating(null);
    toast.success('Returned to super admin account');
    
    // Refresh to restore original context
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Get plan styling
  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'enterprise': return <Crown className="w-3 h-3" />;
      case 'pro': return <Zap className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
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
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-pink-600 text-white p-3 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5" />
              <span className="font-bold">
                SUPER ADMIN MODE
              </span>
              <span className="text-red-100">•</span>
              <span>
                Viewing as: <strong>{impersonating.targetUser?.email}</strong>
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(impersonating.targetUser?.plan)}`}>
                {getPlanIcon(impersonating.targetUser?.plan)}
                <span className="ml-1">{impersonating.targetUser?.plan}</span>
              </span>
            </div>
            <button
              onClick={stopImpersonation}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Impersonation</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Switcher */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <Users className="w-4 h-4" />
          <span>Switch User</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span>User Accounts</span>
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Account List */}
              <div className="max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <RefreshCw className="w-5 h-5 animate-spin text-purple-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Loading accounts...</p>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="p-6 text-center">
                    <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No accounts found</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {accounts.map((account) => (
                      <div
                        key={account.id}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group"
                        onClick={() => startImpersonation(account)}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-gray-900 truncate text-sm">
                                {account.full_name || account.email}
                              </p>
                              {account.id === user?.id && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">{account.email}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(account.role)}`}>
                                {account.role}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPlanColor(account.plan)}`}>
                                {getPlanIcon(account.plan)}
                                <span className="ml-1">{account.plan}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {account.id !== user?.id && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <LogIn className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">Switch</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Super Admin Mode</span>
                  </span>
                  <button
                    onClick={fetchAccounts}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default UserImpersonation;
