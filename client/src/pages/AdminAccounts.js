import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Mail,
  Calendar,
  Package,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Crown,
  RefreshCw
} from 'lucide-react';

const AdminAccounts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalReason, setApprovalReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [editForm, setEditForm] = useState({});
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subscription_plan: 'free',
    subscription_status: 'active'
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin' && user?.role !== 'super_admin' && !user?.super_admin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(`/api/admin/accounts?${params}`);
      setAccounts(response.data.accounts);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, searchTerm, statusFilter, fetchAccounts]);

  const handleApproval = async () => {
    try {
      await axios.post(`/api/admin/accounts/${selectedAccount.id}/approve`, {
        action: approvalAction,
        reason: approvalReason,
        notes: approvalNotes
      });

      toast.success(`Account ${approvalAction}d successfully`);
      setShowApprovalModal(false);
      setSelectedAccount(null);
      setApprovalAction('');
      setApprovalReason('');
      setApprovalNotes('');
      fetchAccounts();
    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error('Failed to process approval');
    }
  };

  const handleEditAccount = async () => {
    try {
      await axios.put(`/api/admin/accounts/${selectedAccount.id}`, editForm);
      toast.success('Account updated successfully');
      setShowEditModal(false);
      setSelectedAccount(null);
      setEditForm({});
      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/admin/accounts/${selectedAccount.id}`);
      toast.success('Account deleted successfully');
      setShowDeleteModal(false);
      setSelectedAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleCreateUser = async () => {
    try {
      // Validate form
      if (!createForm.name || !createForm.email || !createForm.password) {
        toast.error('Name, email, and password are required');
        return;
      }

      if (createForm.password !== createForm.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (createForm.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      await axios.post('/api/admin/accounts', {
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        subscription_plan: createForm.subscription_plan,
        subscription_status: createForm.subscription_status
      });

      toast.success('User account created successfully');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        subscription_plan: 'free',
        subscription_status: 'active'
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create user account');
      }
    }
  };

  const openApprovalModal = (account, action) => {
    setSelectedAccount(account);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    setEditForm({
      name: account.name || '',
      email: account.email || '',
      subscription_plan: account.subscription_plan || '',
      subscription_status: account.subscription_status || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (account) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const openCreateModal = () => {
    setCreateForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      subscription_plan: 'free',
      subscription_status: 'active'
    });
    setShowCreateModal(true);
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <UserX className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'super_admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Crown className="w-3 h-3 mr-1" />
          Super Admin
        </span>
      );
    } else if (role === 'admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Users className="w-3 h-3 mr-1" />
          User
        </span>
      );
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'super_admin' && !user?.super_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Accounts Management</h1>
              <p className="mt-2 text-gray-600">Manage user accounts, approvals, and subscriptions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Users className="w-4 h-4 mr-2" />
                Create User
              </button>
              <button
                onClick={fetchAccounts}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading accounts...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role & Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accounts.map((account) => (
                      <motion.tr
                        key={account.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {account.name?.charAt(0)?.toUpperCase() || account.email?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{account.name || 'No name'}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {account.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {getRoleBadge(account.role)}
                            {getStatusBadge(account.is_approved)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Package className="w-3 h-3 mr-1 text-gray-400" />
                              {account.subscription_plan || 'No plan'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Status: {account.subscription_status || 'Unknown'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(account.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Approve/Reject buttons - show for all accounts */}
                            {!account.is_approved && (
                              <>
                                <button
                                  onClick={() => openApprovalModal(account, 'approve')}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                                >
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => openApprovalModal(account, 'reject')}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                  <UserX className="w-3 h-3 mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            {account.is_approved && (
                              <>
                                <button
                                  onClick={() => openApprovalModal(account, 'reject')}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200"
                                >
                                  <UserX className="w-3 h-3 mr-1" />
                                  Revoke
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => openEditModal(account)}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            {/* Delete button - only for super admin and not for super admin accounts */}
                            {(user?.role === 'super_admin' || user?.super_admin) && account.role !== 'super_admin' && (
                              <button
                                onClick={() => openDeleteModal(account)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedAccount && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {approvalAction === 'approve' ? 'Approve' : 'Reject'} Account
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {approvalAction === 'approve' ? 'Approve' : 'Reject'} account for{' '}
                    <span className="font-medium">{selectedAccount.name || selectedAccount.email}</span>?
                  </p>
                </div>
                {approvalAction === 'reject' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for rejection</label>
                    <textarea
                      value={approvalReason}
                      onChange={(e) => setApprovalReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin notes</label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Optional admin notes..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApproval}
                    className={`px-4 py-2 text-white rounded-lg ${
                      approvalAction === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {approvalAction === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedAccount && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                    <select
                      value={editForm.subscription_plan || ''}
                      onChange={(e) => setEditForm({ ...editForm, subscription_plan: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select plan</option>
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Status</label>
                    <select
                      value={editForm.subscription_status || ''}
                      onChange={(e) => setEditForm({ ...editForm, subscription_status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditAccount}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedAccount && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Delete Account</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 text-center">
                    Are you sure you want to delete the account for{' '}
                    <span className="font-medium">{selectedAccount.name || selectedAccount.email}</span>?
                  </p>
                  <p className="text-sm text-red-600 text-center mt-2">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Create New User</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter password (min 6 characters)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      value={createForm.confirmPassword}
                      onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Confirm password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                    <select
                      value={createForm.subscription_plan}
                      onChange={(e) => setCreateForm({ ...createForm, subscription_plan: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Status</label>
                    <select
                      value={createForm.subscription_status}
                      onChange={(e) => setCreateForm({ ...createForm, subscription_status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Create User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccounts; 