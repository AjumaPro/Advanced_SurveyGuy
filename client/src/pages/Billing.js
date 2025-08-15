import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Shield,
  Zap,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Paystack configuration
const PAYSTACK_CONFIG = {
  publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key',
  testMode: process.env.NODE_ENV === 'development',
  supportedCurrencies: ['GHS', 'NGN', 'USD', 'GBP', 'EUR', 'KES', 'ZAR'],
  webhookUrl: process.env.REACT_APP_PAYSTACK_WEBHOOK_URL || 'http://localhost:5000/api/payments/webhook'
};

// Currency configuration with GH¢ as default
const CURRENCIES = {
  GHS: {
    symbol: 'GH¢',
    name: 'Ghanaian Cedi',
    flag: '🇬🇭',
    exchangeRate: 1,
    decimalPlaces: 2
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    exchangeRate: 0.12, // 1 GHS = 0.12 USD (approximate)
    decimalPlaces: 2
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    exchangeRate: 0.11, // 1 GHS = 0.11 EUR (approximate)
    decimalPlaces: 2
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    exchangeRate: 0.095, // 1 GHS = 0.095 GBP (approximate)
    decimalPlaces: 2
  },
  NGN: {
    symbol: '₦',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    exchangeRate: 150, // 1 GHS = 150 NGN (approximate)
    decimalPlaces: 2
  },
  KES: {
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    exchangeRate: 18, // 1 GHS = 18 KES (approximate)
    decimalPlaces: 2
  },
  ZAR: {
    symbol: 'R',
    name: 'South African Rand',
    flag: '🇿🇦',
    exchangeRate: 2.2, // 1 GHS = 2.2 ZAR (approximate)
    decimalPlaces: 2
  }
};

const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paystackConfig, setPaystackConfig] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('GHS');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const [selectedHistoryItems, setSelectedHistoryItems] = useState([]);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [clearHistoryMode, setClearHistoryMode] = useState('all'); // 'all' or 'selective'
  const location = useLocation();



  const initializePaystack = useCallback(() => {
    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Paystack script loaded successfully');
        setPaystackConfig({
          publicKey: PAYSTACK_CONFIG.publicKey,
          email: 'user@example.com', // This should come from user context
          amount: 0,
          currency: selectedCurrency,
          channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
        });
      };
      script.onerror = () => {
        console.error('❌ Failed to load Paystack script');
        toast.error('Payment system temporarily unavailable');
      };
      document.head.appendChild(script);
    } else {
      // Script already loaded
      setPaystackConfig({
        publicKey: PAYSTACK_CONFIG.publicKey,
        email: 'user@example.com', // This should come from user context
        amount: 0,
        currency: selectedCurrency,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      });
    }
  }, [selectedCurrency]);

  const fetchSubscriptionStatus = useCallback(async () => {
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
  }, []);

  const fetchBillingHistory = useCallback(async () => {
    try {
      const response = await axios.get('/api/payments/billing-history');
      setBillingHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching billing history:', error);
    }
  }, []);

  const fetchPendingPayments = useCallback(async () => {
    try {
      const response = await axios.get('/api/payments/pending-payments');
      setPendingPayments(response.data.pendingPayments || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  }, []);

  // Handle plan selection from pricing page
  useEffect(() => {
    if (location.state?.selectedPlan) {
      const planId = location.state.selectedPlan;
      const billingCycle = location.state.billingCycle || 'monthly';
      
      // Find the plan in basePlans
      const plan = basePlans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
        setShowUpgradeModal(true);
        toast.success(`Selected ${plan.name} plan (${billingCycle} billing)`);
      }
    }
  }, [location.state]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchSubscriptionStatus();
    fetchBillingHistory();
    fetchPendingPayments();
    initializePaystack();
  }, [fetchSubscriptionStatus, fetchBillingHistory, fetchPendingPayments, initializePaystack]);

  const handlePaystackPayment = async (planId, planName, amount) => {
    try {
      if (!paystackConfig || !window.PaystackPop) {
        toast.error('Payment system not ready. Please try again.');
        return;
      }

      // Validate currency support
      if (!PAYSTACK_CONFIG.supportedCurrencies.includes(selectedCurrency)) {
        toast.error(`Currency ${selectedCurrency} is not supported for payments`);
        return;
      }

      setProcessing(true);
      
      // Create payment intent on backend
      const paymentIntentResponse = await axios.post('/api/payments/create-payment-intent', {
        planId,
        planName,
        amount,
        currency: selectedCurrency
      });

      const { reference } = paymentIntentResponse.data;

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: paystackConfig.publicKey,
        email: paystackConfig.email,
        amount: Math.round(amount * 100), // Paystack expects amount in smallest currency unit
        currency: selectedCurrency,
        ref: reference,
        callback: (response) => {
          console.log('Paystack callback response:', response);
          handlePaymentSuccess(response, planId, planName, amount);
        },
        onClose: () => {
          console.log('Payment modal closed');
          toast.error('Payment cancelled');
          setProcessing(false);
        },
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: {
          planId,
          planName,
          currency: selectedCurrency,
          amount: amount
        }
      });

      console.log('Opening Paystack payment modal...');
      handler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse, planId, planName, amount) => {
    try {
      console.log('Payment response:', paymentResponse);
      
      // Verify payment on backend
      const response = await axios.post('/api/payments/verify-payment', {
        reference: paymentResponse.reference,
        planId,
        planName,
        amount,
        currency: selectedCurrency
      });

      if (response.data.success) {
        toast.success('Payment successful! Subscription upgraded.');
        fetchSubscriptionStatus();
        setShowUpgradeModal(false);
        
        // Redirect to dashboard after successful payment
        setTimeout(() => {
          window.location.href = '/app/dashboard';
        }, 2000);
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

  const handleContinuePayment = async (reference) => {
    try {
      setProcessing(true);
      
      // Get payment details
      const response = await axios.post('/api/payments/continue-payment', { reference });
      
      if (response.data.success) {
        const payment = response.data.payment;
        
        // Initialize Paystack payment with existing reference
        const handler = window.PaystackPop.setup({
          key: paystackConfig.publicKey,
          email: 'user@example.com', // This should come from user context
          amount: Math.round(payment.amount * 100), // Paystack expects amount in smallest currency unit
          currency: payment.currency,
          ref: payment.reference,
          callback: (response) => {
            handlePaymentSuccess(response, payment.planId, payment.planName, payment.amount);
          },
          onClose: () => {
            toast.error('Payment cancelled');
            setProcessing(false);
          },
          channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
          metadata: {
            planId: payment.planId,
            planName: payment.planName,
            currency: payment.currency,
            amount: payment.amount
          }
        });

        handler.openIframe();
      } else {
        toast.error('Failed to continue payment');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Error continuing payment:', error);
      toast.error('Failed to continue payment');
      setProcessing(false);
    }
  };

  const handleCancelPendingPayment = async (reference) => {
    if (!window.confirm('Are you sure you want to cancel this pending payment?')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.post('/api/payments/cancel-pending-payment', { reference });

      if (response.data.success) {
        toast.success('Payment cancelled successfully');
        fetchPendingPayments();
      }
    } catch (error) {
      console.error('Error cancelling pending payment:', error);
      toast.error('Failed to cancel payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleClearAllHistory = async () => {
    if (!window.confirm('Are you sure you want to clear ALL payment history? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.delete('/api/payments/clear-history');

      if (response.data.success) {
        toast.success(`Payment history cleared successfully. ${response.data.deletedCount} entries removed.`);
        fetchBillingHistory();
        setShowClearHistoryModal(false);
      }
    } catch (error) {
      console.error('Error clearing payment history:', error);
      toast.error('Failed to clear payment history');
    } finally {
      setProcessing(false);
    }
  };

  const handleClearSelectedHistory = async () => {
    if (selectedHistoryItems.length === 0) {
      toast.error('Please select items to clear');
      return;
    }

    if (!window.confirm(`Are you sure you want to clear ${selectedHistoryItems.length} selected payment entries? This action cannot be undone.`)) {
      return;
    }

    try {
      setProcessing(true);
      const response = await axios.delete('/api/payments/clear-history-selective', {
        data: { paymentIds: selectedHistoryItems }
      });

      if (response.data.success) {
        toast.success(`Selected payment history cleared successfully. ${response.data.deletedCount} entries removed.`);
        fetchBillingHistory();
        setSelectedHistoryItems([]);
        setShowClearHistoryModal(false);
      }
    } catch (error) {
      console.error('Error clearing selected payment history:', error);
      toast.error('Failed to clear selected payment history');
    } finally {
      setProcessing(false);
    }
  };

  const handleHistoryItemSelect = (paymentId) => {
    setSelectedHistoryItems(prev => {
      if (prev.includes(paymentId)) {
        return prev.filter(id => id !== paymentId);
      } else {
        return [...prev, paymentId];
      }
    });
  };

  const handleSelectAllHistory = () => {
    if (selectedHistoryItems.length === billingHistory.length) {
      setSelectedHistoryItems([]);
    } else {
      setSelectedHistoryItems(billingHistory.map(item => item.id));
    }
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const fromRate = CURRENCIES[fromCurrency]?.exchangeRate || 1;
    const toRate = CURRENCIES[toCurrency]?.exchangeRate || 1;
    return (amount / fromRate) * toRate;
  };

  const formatCurrency = (amount, currency = selectedCurrency) => {
    const currencyInfo = CURRENCIES[currency];
    if (!currencyInfo) return `${amount}`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currencyInfo.decimalPlaces,
      maximumFractionDigits: currencyInfo.decimalPlaces
    }).format(amount);
  };

  // Plans with GH¢ as base currency
  const basePlans = [
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
      id: 'basic',
      name: 'Basic',
      price: 29.99,
      features: [
        'Unlimited surveys',
        '1,000 responses per survey',
        'Advanced question types',
        'Analytics dashboard',
        'Priority support'
      ],
      current: subscription?.plan_id === 'basic',
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 'basic-yearly',
      name: 'Basic (Yearly)',
      price: 299.99,
      features: [
        'Unlimited surveys',
        '1,000 responses per survey',
        'Advanced question types',
        'Analytics dashboard',
        'Priority support',
        '2 months free'
      ],
      current: subscription?.plan_id === 'basic-yearly',
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 79.99,
      features: [
        'Everything in Basic',
        '5,000 responses per survey',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Dedicated support'
      ],
      current: subscription?.plan_id === 'premium',
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 'premium-yearly',
      name: 'Premium (Yearly)',
      price: 799.99,
      features: [
        'Everything in Basic',
        '5,000 responses per survey',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Dedicated support',
        '2 months free'
      ],
      current: subscription?.plan_id === 'premium-yearly',
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      features: [
        'Everything in Premium',
        'Unlimited responses',
        'White-label solution',
        'Custom integrations',
        'SLA guarantee',
        'Account manager'
      ],
      current: subscription?.plan_id === 'enterprise',
      icon: <Globe className="h-6 w-6" />
    },
    {
      id: 'enterprise-yearly',
      name: 'Enterprise (Yearly)',
      price: 999.99,
      features: [
        'Everything in Premium',
        'Unlimited responses',
        'White-label solution',
        'Custom integrations',
        'SLA guarantee',
        'Account manager',
        '2 months free'
      ],
      current: subscription?.plan_id === 'enterprise-yearly',
      icon: <Globe className="h-6 w-6" />
    }
  ];

  // Get plans with converted prices for selected currency
  const getPlansWithPrices = () => {
    return basePlans.map(plan => ({
      ...plan,
      displayPrice: plan.price === 0 ? 0 : convertCurrency(plan.price, 'GHS', selectedCurrency),
      originalPrice: plan.price
    }));
  };

  const plans = getPlansWithPrices();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadInvoice = async (transactionId) => {
    try {
      const response = await axios.get(`/api/payments/invoice/${transactionId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
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
              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">{CURRENCIES[selectedCurrency]?.flag}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {CURRENCIES[selectedCurrency]?.symbol} {selectedCurrency}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {showCurrencyDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    {Object.entries(CURRENCIES).map(([code, currency]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setSelectedCurrency(code);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedCurrency === code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{currency.flag}</span>
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-sm text-gray-500">{currency.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {subscription?.plan_name || 'Free Plan'}
                </span>
              </div>
            </div>
          </div>



          {/* Paystack Configuration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-blue-900">Payment Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700 font-medium">Payment Provider:</p>
              <p className="text-blue-600">Paystack</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Environment:</p>
              <p className="text-blue-600">{PAYSTACK_CONFIG.testMode ? 'Test Mode' : 'Live Mode'}</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Supported Currencies:</p>
              <p className="text-blue-600">{PAYSTACK_CONFIG.supportedCurrencies.join(', ')}</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Current Currency:</p>
              <p className="text-blue-600">{selectedCurrency} ({CURRENCIES[selectedCurrency]?.symbol})</p>
            </div>
          </div>
          {!paystackConfig && (
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-yellow-800 text-xs">
                ⚠️ Payment system initializing... Please wait a moment.
              </p>
            </div>
          )}
        </motion.div>

        {/* Subscription Status */}
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

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pending Payments</h2>
                <p className="text-gray-600">Complete or cancel your pending payments</p>
              </div>
              <button
                onClick={fetchPendingPayments}
                className="btn-secondary"
                title="Refresh pending payments"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {pendingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-yellow-100">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{payment.plan_name}</h4>
                      <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                      <p className="text-xs text-gray-500">Reference: {payment.reference}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency || selectedCurrency)}
                      </p>
                      <p className="text-sm text-yellow-600">Pending</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContinuePayment(payment.reference)}
                        className="btn-primary text-sm px-3 py-1"
                        disabled={processing}
                      >
                        {processing ? 'Processing...' : 'Continue'}
                      </button>
                      <button
                        onClick={() => handleCancelPendingPayment(payment.reference)}
                        className="btn-secondary text-sm px-3 py-1"
                        disabled={processing}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
                      {plan.price === 0 ? 'Free' : formatCurrency(plan.displayPrice, selectedCurrency)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                  {plan.price > 0 && selectedCurrency !== 'GHS' && (
                    <p className="text-xs text-gray-500 mb-2">
                      {formatCurrency(plan.originalPrice, 'GHS')} GHS
                    </p>
                  )}
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
            <div className="flex items-center space-x-3">
            <button
              onClick={fetchBillingHistory}
              className="btn-secondary"
              title="Refresh billing history"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
              {billingHistory.length > 0 && (
                <button
                  onClick={() => setShowClearHistoryModal(true)}
                  className="btn-secondary text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  title="Clear payment history"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Clear History
                </button>
              )}
            </div>
          </div>

          {billingHistory.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
              <p className="text-gray-600">Your billing transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {billingHistory.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedHistoryItems.length === billingHistory.length && billingHistory.length > 0}
                      onChange={handleSelectAllHistory}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Select All ({selectedHistoryItems.length}/{billingHistory.length})
                    </span>
                  </div>
                  {selectedHistoryItems.length > 0 && (
                    <button
                      onClick={() => {
                        setClearHistoryMode('selective');
                        setShowClearHistoryModal(true);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Selected ({selectedHistoryItems.length})
                    </button>
                  )}
                </div>
              )}
              {billingHistory.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedHistoryItems.includes(transaction.id)}
                      onChange={() => handleHistoryItemSelect(transaction.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
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
                      {transaction.currency && (
                        <p className="text-xs text-gray-500">
                          Currency: {transaction.currency}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(transaction.amount, transaction.currency || selectedCurrency)}
                      </p>
                      <p className={`text-sm ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                    {transaction.status === 'completed' && (
                      <button
                        onClick={() => downloadInvoice(transaction.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Download invoice"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upgrade to {selectedPlan.name}
            </h3>
            <p className="text-gray-600 mb-4">
              You're about to upgrade to the {selectedPlan.name} plan for {formatCurrency(selectedPlan.displayPrice, selectedCurrency)}/month.
            </p>
            
            {selectedCurrency !== 'GHS' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Original price: {formatCurrency(selectedPlan.originalPrice, 'GHS')} GHS
                  </p>
                </div>
              </div>
            )}
            
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
                onClick={() => handlePaystackPayment(selectedPlan.id, selectedPlan.name, selectedPlan.displayPrice)}
                disabled={processing}
                className="btn-primary"
              >
                {processing ? 'Processing...' : `Pay ${formatCurrency(selectedPlan.displayPrice, selectedCurrency)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear History Modal */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Clear Payment History
              </h3>
            </div>
            
            {clearHistoryMode === 'all' ? (
              <div>
                <p className="text-gray-600 mb-4">
                  This will permanently delete ALL your payment history. This action cannot be undone.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-800 font-medium">
                      Warning: This will remove {billingHistory.length} payment entries
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  This will permanently delete the selected payment entries. This action cannot be undone.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-800 font-medium">
                      Warning: This will remove {selectedHistoryItems.length} selected payment entries
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowClearHistoryModal(false);
                  setClearHistoryMode('all');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={clearHistoryMode === 'all' ? handleClearAllHistory : handleClearSelectedHistory}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Clear History'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing; 