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
      // Mock payment data - replace with actual API calls
      const mockData = {
        transactions: [
          {
            id: 'txn_001',
            attendeeName: 'John Doe',
            email: 'john@example.com',
            amount: 299.99,
            status: 'completed',
            paymentMethod: 'credit_card',
            transactionDate: '2024-01-10T14:30:00Z',
            ticketType: 'VIP',
            discountApplied: null
          },
          {
            id: 'txn_002',
            attendeeName: 'Jane Smith',
            email: 'jane@example.com',
            amount: 199.99,
            status: 'completed',
            paymentMethod: 'paypal',
            transactionDate: '2024-01-09T16:45:00Z',
            ticketType: 'Standard',
            discountApplied: 'EARLY_BIRD_20'
          },
          {
            id: 'txn_003',
            attendeeName: 'Bob Johnson',
            email: 'bob@example.com',
            amount: 149.99,
            status: 'pending',
            paymentMethod: 'bank_transfer',
            transactionDate: '2024-01-08T11:20:00Z',
            ticketType: 'Student',
            discountApplied: 'STUDENT_50'
          }
        ],
        revenue: {
          totalRevenue: 125000,
          netRevenue: 118750,
          processingFees: 3750,
          refunds: 2500,
          pendingAmount: 5400,
          averageTicketPrice: 225,
          conversionRate: 15.8
        },
        pricing: {
          ticketTiers: [
            {
              id: 'early_bird',
              name: 'Early Bird',
              price: 199.99,
              originalPrice: 249.99,
              available: 50,
              sold: 45,
              validUntil: '2024-02-01T00:00:00Z'
            },
            {
              id: 'standard',
              name: 'Standard',
              price: 249.99,
              originalPrice: 249.99,
              available: 200,
              sold: 156,
              validUntil: '2024-03-15T00:00:00Z'
            },
            {
              id: 'vip',
              name: 'VIP',
              price: 399.99,
              originalPrice: 399.99,
              available: 50,
              sold: 32,
              validUntil: '2024-03-15T00:00:00Z'
            }
          ]
        },
        discounts: [
          {
            id: 'early_bird_20',
            code: 'EARLY_BIRD_20',
            type: 'percentage',
            value: 20,
            usageLimit: 100,
            usedCount: 45,
            validUntil: '2024-02-01T00:00:00Z',
            status: 'active'
          },
          {
            id: 'student_50',
            code: 'STUDENT_50',
            type: 'percentage',
            value: 50,
            usageLimit: 25,
            usedCount: 18,
            validUntil: '2024-03-15T00:00:00Z',
            status: 'active'
          }
        ],
        refunds: [
          {
            id: 'ref_001',
            transactionId: 'txn_004',
            amount: 249.99,
            reason: 'Event cancellation',
            status: 'processed',
            requestDate: '2024-01-05T10:00:00Z',
            processedDate: '2024-01-06T14:30:00Z'
          }
        ]
      };

      setPaymentData(mockData);
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
