import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Globe,
  Users,
  Database,
  Lock
} from 'lucide-react';

const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [paystackConfig, setPaystackConfig] = useState(null);

  useEffect(() => {
    fetchSubscriptionStatus();
    fetchBillingHistory();
    initializePaystack();
  }, []);

  const initializePaystack = () => {
    // Initialize Paystack configuration
    setPaystackConfig({
      publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key',
      email: 'user@example.com', // This should come from user context
      amount: 0,
      currency: 'NGN',
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
    });
  };

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/payments/subscription-status');
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingHistory = async () => {
    try {
      const response = await axios.get('/api/payments/billing-history');
      setBillingHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching billing history:', error);
    }
  };

  const handlePaystackPayment = async (planId, planName, amount) => {
    try {
      setProcessing(true);
      
      // Create payment intent on backend
      const response = await axios.post('/api/payments/create-payment-intent', {
        planId,
        planName,
        amount,
        currency: 'NGN'
      });

      if (response.data.success) {
        // Initialize Paystack payment
        const handler = window.PaystackPop.setup({
          key: paystackConfig.publicKey,
          email: paystackConfig.email,
          amount: amount * 100, // Paystack expects amount in kobo
          currency: 'NGN',
          ref: response.data.reference,
          callback: function(response) {
            // Payment successful
            handlePaymentSuccess(response, planId, planName, amount);
          },
          onClose: function() {
            // Payment cancelled
            toast.error('Payment cancelled');
            setProcessing(false);
          }
        });
        handler.openIframe();
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment');
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse, planId, planName, amount) => {
    try {
      // Verify payment on backend
      const response = await axios.post('/api/payments/verify-payment', {
        reference: paymentResponse.reference,
        planId,
        planName,
        amount
      });

      if (response.data.success) {
        toast.success('Payment successful! Subscription upgraded.');
        fetchSubscriptionStatus();
        setShowUpgradeModal(false);
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.post('/api/payments/cancel-subscription');

      if (response.data.success) {
        toast.success('Subscription cancelled successfully');
        fetchSubscriptionStatus();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setProcessing(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Up to 3 surveys',
        '50 responses per survey',
        'Basic question types',
        'Email support'
      ],
      current: subscription?.plan_id === 'free',
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 5000, // 5000 NGN = ~$10
      features: [
        'Unlimited surveys',
        '1,000 responses per survey',
        'Advanced question types',
        'Analytics dashboard',
        'Priority support'
      ],
      current: subscription?.plan_id === 'pro',
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 'business',
      name: 'Business',
      price: 15000, // 15000 NGN = ~$30
      features: [
        'Everything in Pro',
        '5,000 responses per survey',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Dedicated support'
      ],
      current: subscription?.plan_id === 'business',
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 50000, // 50000 NGN = ~$100
      features: [
        'Everything in Business',
        'Unlimited responses',
        'White-label solution',
        'Custom integrations',
        'SLA guarantee',
        'Account manager'
      ],
      current: subscription?.plan_id === 'enterprise',
      icon: <Globe className="h-6 w-6" />
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
              <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {subscription?.plan_name || 'Free Plan'}
                </span>
              </div>
            </div>
          </div>

          {/* Current Subscription */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                <p className="text-gray-600">Your active subscription details</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="btn-primary"
                  disabled={processing}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {processing ? 'Processing...' : 'Upgrade Plan'}
                </button>
                {subscription && subscription.plan_id !== 'free' && (
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                    disabled={processing}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600 mb-1">Plan</h3>
                <p className="text-lg font-semibold text-blue-900">
                  {subscription?.plan_name || 'Free Plan'}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-600 mb-1">Status</h3>
                <p className="text-lg font-semibold text-green-900">
                  {subscription?.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-600 mb-1">Next Billing</h3>
                <p className="text-lg font-semibold text-purple-900">
                  {subscription?.next_billing_date 
                    ? formatDate(subscription.next_billing_date)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${
                plan.current ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                  {plan.current && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {!plan.current && (
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowUpgradeModal(true);
                    }}
                    className="w-full btn-primary"
                    disabled={processing}
                  >
                    {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
              <p className="text-gray-600">Your recent transactions and invoices</p>
            </div>
            <button
              onClick={fetchBillingHistory}
              className="btn-secondary"
              title="Refresh billing history"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          {billingHistory.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
              <p className="text-gray-600">Your billing transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {billingHistory.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {transaction.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                    <p className={`text-sm ${
                      transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Paystack Payment Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upgrade to {selectedPlan.name}
            </h3>
            <p className="text-gray-600 mb-4">
              You're about to upgrade to the {selectedPlan.name} plan for {formatCurrency(selectedPlan.price)}/month.
            </p>
            <div className="space-y-3 mb-6">
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePaystackPayment(selectedPlan.id, selectedPlan.name, selectedPlan.price)}
                disabled={processing}
                className="btn-primary"
              >
                {processing ? 'Processing...' : `Pay ${formatCurrency(selectedPlan.price)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing; 