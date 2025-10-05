import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Receipt,
  Percent,
  Gift,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const EventPaymentSystem = ({ eventId }) => {
  const [paymentData, setPaymentData] = useState({
    transactions: [],
    revenue: {},
    pricing: {},
    discounts: [],
    refunds: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPaymentData();
  }, [eventId]);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      // Fetch real payment data from database
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('event_payments')
        .select(`
          *,
          event_registrations (
            attendee_name,
            email,
            ticket_type
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Error fetching payment data:', transactionsError);
        throw transactionsError;
      }

      // Calculate summary statistics
      const totalRevenue = transactionsData?.reduce((sum, txn) => sum + (txn.amount || 0), 0) || 0;
      const totalTransactions = transactionsData?.length || 0;
      const averageTicketPrice = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
      const completedPayments = transactionsData?.filter(txn => txn.status === 'completed').length || 0;
      const pendingPayments = transactionsData?.filter(txn => txn.status === 'pending').length || 0;
      const failedPayments = transactionsData?.filter(txn => txn.status === 'failed').length || 0;

      const paymentData = {
        transactions: transactionsData?.map(txn => ({
          id: txn.id,
          attendeeName: txn.event_registrations?.attendee_name || 'Unknown',
          email: txn.event_registrations?.email || 'Unknown',
          amount: txn.amount,
          status: txn.status,
          paymentMethod: txn.payment_method,
          transactionDate: txn.created_at,
          ticketType: txn.event_registrations?.ticket_type || 'Standard',
          discountApplied: txn.discount_code || null
        })) || [],
        revenue: {
          totalRevenue,
          netRevenue: totalRevenue * 0.95, // Assuming 5% processing fees
          processingFees: totalRevenue * 0.05,
          refunds: 0, // Would need separate refunds table
          pendingAmount: transactionsData?.filter(txn => txn.status === 'pending').reduce((sum, txn) => sum + (txn.amount || 0), 0) || 0,
          averageTicketPrice,
          conversionRate: totalTransactions > 0 ? (completedPayments / totalTransactions) * 100 : 0
        }
      };

      setPaymentData(paymentData);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: CheckCircle,
      pending: Clock,
      failed: AlertCircle,
      refunded: RefreshCw
    };
    return icons[status] || Clock;
  };

  const RevenueOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${paymentData.revenue.totalRevenue?.toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${paymentData.revenue.netRevenue?.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Ticket</p>
            <p className="text-2xl font-bold text-gray-900">
              ${paymentData.revenue.averageTicketPrice}
            </p>
          </div>
          <Receipt className="w-8 h-8 text-purple-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {paymentData.revenue.conversionRate}%
            </p>
          </div>
          <Users className="w-8 h-8 text-orange-600" />
        </div>
      </motion.div>
    </div>
  );

  const TransactionsTable = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentData.transactions.map((transaction) => {
              const StatusIcon = getStatusIcon(transaction.status);
              return (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.attendeeName}
                      </div>
                      <div className="text-sm text-gray-500">{transaction.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${transaction.amount}
                    {transaction.discountApplied && (
                      <div className="text-xs text-green-600">
                        Discount: {transaction.discountApplied}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.ticketType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {transaction.paymentMethod.replace('_', ' ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PricingTiers = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Ticket Pricing Tiers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentData.pricing.ticketTiers?.map((tier) => (
          <div key={tier.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{tier.name}</h4>
              {tier.price < tier.originalPrice && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Sale
                </span>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">${tier.price}</span>
                {tier.price < tier.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${tier.originalPrice}
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                {tier.sold} / {tier.available} sold
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(tier.sold / tier.available) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Valid until: {new Date(tier.validUntil).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DiscountCodes = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Discount Codes</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Create New Code
        </button>
      </div>
      
      <div className="space-y-4">
        {paymentData.discounts?.map((discount) => (
          <div key={discount.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Percent className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{discount.code}</div>
                <div className="text-sm text-gray-600">
                  {discount.value}% off • {discount.usedCount}/{discount.usageLimit} used
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Valid until {new Date(discount.validUntil).toLocaleDateString()}
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  discount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {discount.status}
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Track revenue, transactions, and pricing</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPaymentData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Revenue Overview */}
      <RevenueOverview />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'pricing', label: 'Pricing Tiers', icon: DollarSign },
            { id: 'discounts', label: 'Discount Codes', icon: Percent },
            { id: 'refunds', label: 'Refunds', icon: RefreshCw }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'transactions' && <TransactionsTable />}
        {activeTab === 'pricing' && <PricingTiers />}
        {activeTab === 'discounts' && <DiscountCodes />}
        {activeTab === 'refunds' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Management</h3>
            <p className="text-gray-600">Refund processing and tracking coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPaymentSystem;
