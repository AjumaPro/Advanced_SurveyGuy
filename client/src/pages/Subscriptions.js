import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Mail,
  Calendar,
  Trash2,
  CheckCircle,
  Bell,
  Settings,
  Search,
  CreditCard,
  TrendingUp,
  XCircle,
  RefreshCw,
  Download,
  AlertCircle,
  Users,
  Globe,
  Shield,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Subscriptions = () => {
  const [surveySubscriptions, setSurveySubscriptions] = useState([]);
  const [paymentSubscriptions, setPaymentSubscriptions] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('surveys'); // 'surveys', 'payments', 'pending'
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    survey_updates: true,
    new_surveys: false
  });

  useEffect(() => {
    fetchAllSubscriptions();
  }, []);

  const fetchAllSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch survey subscriptions
      const surveyResponse = await axios.get('/api/subscriptions/user');
      setSurveySubscriptions(surveyResponse.data.subscriptions || []);
      
      // Fetch payment subscriptions
      const paymentResponse = await axios.get('/api/payments/subscription-status');
      setPaymentSubscriptions(paymentResponse.data.subscription ? [paymentResponse.data.subscription] : []);
      
      // Fetch pending payments
      const pendingResponse = await axios.get('/api/payments/pending-payments');
      setPendingPayments(pendingResponse.data.pendingPayments || []);
      
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to unsubscribe?')) {
      return;
    }

    try {
      await axios.delete(`/api/subscriptions/${subscriptionId}`);
      toast.success('Successfully unsubscribed');
      fetchAllSubscriptions();
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Failed to unsubscribe');
    }
  };

  const cancelPaymentSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your payment subscription?')) {
      return;
    }

    try {
      await axios.post('/api/payments/cancel-subscription');
      toast.success('Subscription cancelled successfully');
      fetchAllSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const continuePendingPayment = async (reference) => {
    try {
      const response = await axios.post('/api/payments/continue-payment', { reference });
      
      if (response.data.success) {
        const payment = response.data.payment;
        
        // Initialize Paystack payment
        if (window.PaystackPop) {
          const handler = window.PaystackPop.setup({
            key: response.data.publicKey,
            email: 'user@example.com',
            amount: Math.round(payment.amount * 100),
            currency: payment.currency,
            ref: payment.reference,
            callback: (response) => {
              handlePaymentSuccess(response, payment.planId, payment.planName, payment.amount);
            },
            onClose: () => {
              toast.error('Payment cancelled');
            },
            channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
          });

          handler.openIframe();
        } else {
          toast.error('Payment system not available');
        }
      }
    } catch (error) {
      console.error('Error continuing payment:', error);
      toast.error('Failed to continue payment');
    }
  };

  const cancelPendingPayment = async (reference) => {
    if (!window.confirm('Are you sure you want to cancel this pending payment?')) {
      return;
    }

    try {
      await axios.post('/api/payments/cancel-pending-payment', { reference });
      toast.success('Payment cancelled successfully');
      fetchAllSubscriptions();
    } catch (error) {
      console.error('Error cancelling pending payment:', error);
      toast.error('Failed to cancel payment');
    }
  };

  const handlePaymentSuccess = async (paymentResponse, planId, planName, amount) => {
    try {
      const response = await axios.post('/api/payments/verify-payment', {
        reference: paymentResponse.reference,
        planId,
        planName,
        amount
      });

      if (response.data.success) {
        toast.success('Payment successful! Subscription upgraded.');
        fetchAllSubscriptions();
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed');
    }
  };

  const updatePreferences = async () => {
    try {
      await axios.put(`/api/subscriptions/${selectedSubscription.id}`, preferences);
      toast.success('Preferences updated successfully');
      setShowPreferencesModal(false);
      fetchAllSubscriptions();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const openPreferencesModal = (subscription) => {
    setSelectedSubscription(subscription);
    setPreferences({
      email_notifications: subscription.email_notifications !== false,
      survey_updates: subscription.survey_updates !== false,
      new_surveys: subscription.new_surveys || false
    });
    setShowPreferencesModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'GHS') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free': return <Shield className="h-6 w-6" />;
      case 'basic': return <Zap className="h-6 w-6" />;
      case 'premium': return <Users className="h-6 w-6" />;
      case 'enterprise': return <Globe className="h-6 w-6" />;
      default: return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSurveySubscriptions = surveySubscriptions.filter(sub => {
    const matchesSearch = sub.survey_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || sub.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Subscriptions</h1>
              <p className="text-gray-600 mt-1">Manage your survey and payment subscriptions</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {surveySubscriptions.length + paymentSubscriptions.length} subscription{(surveySubscriptions.length + paymentSubscriptions.length) !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={fetchAllSubscriptions}
                className="btn-secondary"
                title="Refresh subscriptions"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
            <button
              onClick={() => setActiveTab('surveys')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'surveys'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Survey Subscriptions ({surveySubscriptions.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'payments'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="h-4 w-4 inline mr-2" />
              Payment Plans ({paymentSubscriptions.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Pending Payments ({pendingPayments.length})
            </button>
          </div>

          {/* Search and Filter */}
          {activeTab === 'surveys' && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search survey subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Subscriptions</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === 'surveys' && (
          <SurveySubscriptionsTab 
            subscriptions={filteredSurveySubscriptions}
            onUnsubscribe={unsubscribe}
            onEditPreferences={openPreferencesModal}
            onRefresh={fetchAllSubscriptions}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentSubscriptionsTab 
            subscriptions={paymentSubscriptions}
            onCancelSubscription={cancelPaymentSubscription}
            onRefresh={fetchAllSubscriptions}
          />
        )}

        {activeTab === 'pending' && (
          <PendingPaymentsTab 
            payments={pendingPayments}
            onContinuePayment={continuePendingPayment}
            onCancelPayment={cancelPendingPayment}
            onRefresh={fetchAllSubscriptions}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
      </div>

      {/* Preferences Modal */}
      {showPreferencesModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subscription Preferences
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedSubscription.survey_title || 'Survey'} preferences
            </p>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.email_notifications}
                  onChange={(e) => setPreferences(prev => ({ ...prev, email_notifications: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.survey_updates}
                  onChange={(e) => setPreferences(prev => ({ ...prev, survey_updates: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Survey Updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.new_surveys}
                  onChange={(e) => setPreferences(prev => ({ ...prev, new_surveys: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">New Survey Notifications</span>
              </label>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={updatePreferences}
                className="btn-primary"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Survey Subscriptions Tab Component
const SurveySubscriptionsTab = ({ subscriptions, onUnsubscribe, onEditPreferences, onRefresh }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (subscriptions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-xl shadow-sm"
      >
        <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No survey subscriptions</h3>
        <p className="text-gray-600 mb-4">
          You haven't subscribed to any surveys yet.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Bell className="h-4 w-4" />
          <span>Subscribe to surveys to receive updates and notifications</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {subscriptions.map((subscription, index) => (
        <motion.div
          key={subscription.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {subscription.survey_title || 'Untitled Survey'}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {subscription.email}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Subscribed {formatDate(subscription.subscribed_at)}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditPreferences(subscription)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit preferences"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onUnsubscribe(subscription.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Unsubscribe"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Preferences */}
            {subscription.preferences && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${subscription.email_notifications ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>Email Notifications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${subscription.survey_updates ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>Survey Updates</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Payment Subscriptions Tab Component
const PaymentSubscriptionsTab = ({ subscriptions, onCancelSubscription, onRefresh }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'GHS') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free': return <Shield className="h-6 w-6" />;
      case 'basic': return <Zap className="h-6 w-6" />;
      case 'premium': return <Users className="h-6 w-6" />;
      case 'enterprise': return <Globe className="h-6 w-6" />;
      default: return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (subscriptions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-xl shadow-sm"
      >
        <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No payment subscriptions</h3>
        <p className="text-gray-600 mb-4">
          You're currently on the free plan.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>Upgrade your plan to access premium features</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {subscriptions.map((subscription, index) => (
        <motion.div
          key={subscription.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getPlanIcon(subscription.plan_id)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subscription.plan_name} Plan
                    </h3>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(subscription.plan_id)}`}>
                      {subscription.plan_id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Started {formatDate(subscription.created_at)}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Transaction ID: {subscription.payment_transaction_id || 'N/A'}</p>
                  {subscription.next_billing_date && (
                    <p>Next billing: {formatDate(subscription.next_billing_date)}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {subscription.status === 'active' && (
                    <button
                      onClick={onCancelSubscription}
                      className="btn-secondary text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Pending Payments Tab Component
const PendingPaymentsTab = ({ payments, onContinuePayment, onCancelPayment, onRefresh, formatCurrency, formatDate }) => {
  if (payments.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-xl shadow-sm"
      >
        <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending payments</h3>
        <p className="text-gray-600 mb-4">
          All your payments have been completed.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <CheckCircle className="h-4 w-4" />
          <span>Your payment history is up to date</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {payments.map((payment, index) => (
        <motion.div
          key={payment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-yellow-400"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {payment.plan_name} Plan
                    </h3>
                    <p className="text-sm text-gray-600">Payment Pending</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {formatDate(payment.created_at)}</span>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
                <p className="text-sm text-gray-600">pending</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Reference: {payment.reference}</p>
                  <p>Currency: {payment.currency}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onContinuePayment(payment.reference)}
                    className="btn-primary"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Continue Payment
                  </button>
                  <button
                    onClick={() => onCancelPayment(payment.reference)}
                    className="btn-secondary"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Subscriptions; 