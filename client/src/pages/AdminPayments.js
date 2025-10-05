import React, { useState, useEffect } from 'react';
import {useAuth} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {supabase} from '../lib/supabase';
import toast from 'react-hot-toast';
import { useDashboardNavigation } from '../utils/navigationUtils';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  Search,
  Filter,
  Eye,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
const AdminPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { navigateToDashboard, isSignedIn } = useDashboardNavigation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: ''
  });
  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin' && !user?.super_admin) {
      navigate('/app/dashboard');
      return;
    }
    fetchPayments();
  }, [user, navigate, currentPage, filters]);
  const fetchPayments = async () => {
    try {
      // Fetch real payment transactions from database
      let query = supabase
        .from('payment_transactions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * 20, currentPage * 20 - 1);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data: paymentsData, error: paymentsError, count } = await query;

      if (paymentsError) {
        throw paymentsError;
      }

      setPayments(paymentsData || []);
      setTotalPages(Math.ceil((count || 0) / 20));
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };
  const handleApproval = async (paymentId, action, notes = '') => {
    try {
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: action === 'approve' ? 'completed' : 'failed',
          metadata: {
            admin_action: action,
            admin_notes: notes,
            processed_at: new Date().toISOString()
          },
          processed_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (updateError) {
        throw updateError;
      }

      toast.success(`Payment ${action}d successfully`);
      fetchPayments();
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error);
      toast.error(`Failed to ${action} payment`);
    }
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-3 h-3" />
      },
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-3 h-3" />
      },
      failed: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-3 h-3" />
      },
      refunded: {
        color: 'bg-gray-100 text-gray-800',
        icon: <RefreshCw className="w-3 h-3" />
      }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };
  const formatCurrency = (amount, currency = 'GHS') => {
    const symbols = {
      GHS: '₵',
      USD: '$',
      EUR: '€'
    };
    return `${symbols[currency] || ''}${parseFloat(amount).toFixed(2)}`;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Approvals</h1>
              <p className="text-gray-600 mt-2">Review and approve payment transactions</p>
            </div>
            <button
              onClick={navigateToDashboard}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to {isSignedIn ? 'Dashboard' : 'Home'}
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: '' });
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Transactions ({payments.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.plan_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.plan_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {payment.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(payment.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproval(payment.id, 'approve')}
                            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('Enter rejection reason (optional):');
                              if (notes !== null) {
                                handleApproval(payment.id, 'reject', notes);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {payment.status !== 'pending' && (
                        <div className="text-gray-500">
                          {payment.status === 'approved' ? 'Approved' : 'Rejected'}
                          {payment.admin_notes && (
                            <div className="text-xs text-gray-400 mt-1">
                              {payment.admin_notes}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Empty State */}
          {payments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-500">
                {filters.status ? 'No payments match your current filters.' : 'No payment transactions have been submitted yet.'}
              </p>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPayments; 