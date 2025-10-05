import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getPlanPricing } from '../services/paystackService';
import { motion } from 'framer-motion';
import InvoiceManager from '../components/InvoiceManager';
import BillingAnalytics from '../components/BillingAnalytics';
import PaystackPayment from '../components/PaystackPayment';
import {
  CreditCard,
  Download,
  RefreshCw,
  ChevronDown,
  Shield,
  Zap,
  Crown,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Eye,
  Plus,
  Trash2,
  Edit3,
  Star,
  Award,
  BarChart3,
  PieChart,
  Receipt,
  Wallet,
  Bell,
  Search,
  ArrowUpDown,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

const Billing = () => {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview'); // overview, history, payment-methods, settings, upgrade
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [billingStats, setBillingStats] = useState({
    totalSpent: 0,
    avgMonthly: 0,
    nextBilling: null,
    savedAmount: 0
  });
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all'); // all, completed, pending, failed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc, asc
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    isDefault: false
  });

  // Handle plan upgrades
  const handleUpgrade = async (planType) => {
    const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';
    
    try {
      setLoading(true);
      
      if (isSuperAdmin) {
        // Super admin can change plans instantly
        toast.success(`Super admin: Switching to ${planType} plan instantly...`);
        
        const response = await api.admin.changePlan(user.id, planType, true);
        
        if (response.error) {
          toast.error(`Failed to change plan: ${response.error}`);
        } else {
          toast.success(`Successfully switched to ${planType} plan!`);
          // Update local state and refresh
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        // Regular users go through Paystack payment
        console.log('💳 Initiating Paystack payment for:', planType);
        setSelectedPlanForPayment({ plan: planType, cycle: billingCycle });
        setShowPaymentModal(true);
        setLoading(false);
        return; // Don't continue - payment modal will handle
      }
      
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to initiate upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Currency configuration
  const CURRENCIES = {
    USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
    GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    GHS: { symbol: 'GH¢', name: 'Ghanaian Cedi', flag: '🇬🇭' },
    NGN: { symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' }
  };

  // Get plan pricing (using GHS as base currency)
  const getPlanPrice = (planId, cycle = 'monthly') => {
    const pricing = getPlanPricing();
    return pricing[planId]?.[cycle] || 0;
  };

  // Handle adding new payment method
  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true);
      
      // Validate card number (basic validation)
      const cardNumber = newPaymentMethod.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        toast.error('Please enter a valid card number');
        return;
      }

      // Validate expiry date
      const [month, year] = newPaymentMethod.expiryDate.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }

      // Validate CVV
      if (newPaymentMethod.cvv.length < 3 || newPaymentMethod.cvv.length > 4) {
        toast.error('Please enter a valid CVV');
        return;
      }

      // In a real application, you would send the payment method data to your backend
      // For now, we'll simulate adding it to the local state
      const newMethod = {
        id: Date.now().toString(),
        type: 'VISA', // You could detect this from card number
        last4: cardNumber.slice(-4),
        expiryDate: newPaymentMethod.expiryDate,
        cardholderName: newPaymentMethod.cardholderName,
        isDefault: newPaymentMethod.isDefault,
        addedAt: new Date().toISOString()
      };

      // Add to payment methods list
      setPaymentMethods(prev => {
        // If this is set as default, remove default from others
        if (newPaymentMethod.isDefault) {
          return [newMethod, ...prev.map(method => ({ ...method, isDefault: false }))];
        }
        return [...prev, newMethod];
      });

      // Reset form
      setNewPaymentMethod({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
      });

      // Close modal
      setShowAddPaymentModal(false);

      toast.success('Payment method added successfully!');
      
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingData = useCallback(async () => {
    if (!user) {
      console.log('❌ No user found, skipping billing data fetch');
      setLoading(false);
      return;
    }

    console.log('🔄 Fetching billing data for user:', user.id);
    setLoading(true);
    
    try {
      // Check if subscription_history table exists and is accessible
      console.log('📊 Testing subscription_history table access...');
      const { error: testError } = await supabase
        .from('subscription_history')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Table access error:', testError);
        toast.error(`Database error: ${testError.message}`);
        setLoading(false);
      return;
    }

      console.log('✅ Table access successful');

      // Fetch subscription data (don't fail if no active subscription)
      console.log('📋 Fetching active subscription...');
      const { data: subscriptionData, error: subError } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      // Don't treat "no rows" as an error for single()
      if (subError && subError.code !== 'PGRST116') {
        console.error('❌ Subscription fetch error:', subError);
        toast.error(`Failed to load subscription: ${subError.message}`);
      } else {
        console.log('📋 Subscription data:', subscriptionData);
        setSubscription(subscriptionData?.[0] || null);
      }

      // Fetch billing history
      console.log('📝 Fetching billing history...');
      const { data: historyData, error: historyError } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (historyError) {
        console.error('❌ History fetch error:', historyError);
        toast.error(`Failed to load billing history: ${historyError.message}`);
        setBillingHistory([]);
      } else {
        console.log('📝 History data:', historyData?.length || 0, 'records');
        setBillingHistory(historyData || []);
      }

      // Fetch real payment methods from Paystack
      try {
        console.log('💳 Fetching payment methods from Paystack...');
        const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!paymentMethodsError && paymentMethodsData) {
          console.log('✅ Payment methods loaded:', paymentMethodsData.length);
          setPaymentMethods(paymentMethodsData);
        } else {
          console.log('⚠️ No payment methods found or error:', paymentMethodsError?.message);
          setPaymentMethods([]);
        }
      } catch (error) {
        console.error('❌ Error fetching payment methods:', error);
        setPaymentMethods([]);
      }

      // Calculate billing stats
      const totalSpent = (historyData || []).reduce((sum, item) => sum + (item.price || 0), 0);
      setBillingStats({
        totalSpent,
        avgMonthly: totalSpent / Math.max(1, (historyData || []).length),
        nextBilling: subscriptionData?.[0]?.ends_at || null,
        savedAmount: subscriptionData?.[0]?.savings || 0 // Real savings from subscription
      });

      console.log('✅ Billing data loaded successfully');

    } catch (error) {
      console.error('❌ Unexpected error fetching billing data:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user, fetchBillingData]);

  // Handle navigation state from pricing page
  useEffect(() => {
    if (location.state?.selectedPlan) {
      const { selectedPlan, billingCycle } = location.state;
      
      // Set billing cycle if provided
      if (billingCycle) {
        setBillingCycle(billingCycle);
      }
      
      // Switch to upgrade tab and trigger upgrade
      setActiveTab('upgrade');
      
      // Show a message and trigger upgrade after a short delay
      toast.success(`Ready to upgrade to ${selectedPlan} plan! 💳`);
      
      setTimeout(() => {
        handleUpgrade(selectedPlan);
      }, 1000);
      
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleUpgrade]);

  const formatCurrency = (amount, currency = selectedCurrency) => {
    // Default to USD if currency is undefined or not valid
    const validCurrency = currency && CURRENCIES[currency] ? currency : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free': return <Star className="w-5 h-5" />;
      case 'pro': return <Zap className="w-5 h-5" />;
      case 'enterprise': return <Crown className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'free': return 'from-gray-400 to-gray-600';
      case 'pro': return 'from-blue-500 to-purple-600';
      case 'enterprise': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = billingHistory
    .filter(item => {
      if (historyFilter === 'all') return true;
      return item.status === historyFilter;
    })
    .filter(item => {
      if (!searchTerm) return true;
      return item.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.plan_id?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'upgrade', label: 'Upgrade Plan', icon: Crown },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'history', label: 'Billing History', icon: Receipt },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Billing Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
          <div className="mt-4">
            <a 
              href="/app/billing-debug" 
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Having trouble? Try debug mode
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view billing information</p>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
        <motion.div 
      initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
              <p className="text-gray-600 mt-1">Manage your subscription, payments, and billing preferences</p>
            </div>
            
              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border hover:shadow-md transition-all"
                >
                  <span className="text-lg">{CURRENCIES[selectedCurrency]?.flag}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {CURRENCIES[selectedCurrency]?.symbol} {selectedCurrency}
                  </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {showCurrencyDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                    {Object.entries(CURRENCIES).map(([code, currency]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setSelectedCurrency(code);
                          setShowCurrencyDropdown(false);
                        }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          selectedCurrency === code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{currency.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium">{currency.symbol} {code}</p>
                        <p className="text-xs text-gray-500">{currency.name}</p>
                      </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-xl px-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            </div>
          </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 border"
              >
                <div className="flex items-center justify-between">
            <div>
                    <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(billingStats.totalSpent)}
                    </p>
            </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border"
              >
                <div className="flex items-center justify-between">
            <div>
                    <p className="text-gray-600 text-sm font-medium">Monthly Average</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(billingStats.avgMonthly)}
                    </p>
            </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
            </div>
        </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border"
              >
                <div className="flex items-center justify-between">
              <div>
                    <p className="text-gray-600 text-sm font-medium">Next Billing</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {billingStats.nextBilling ? formatDate(billingStats.nextBilling) : 'N/A'}
                    </p>
              </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Saved</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {formatCurrency(billingStats.savedAmount)}
                </p>
              </div>
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
            </div>

            {/* Current Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Current Subscription</h2>
                <p className="text-gray-600 text-sm">Your active plan and billing details</p>
            </div>

              <div className="p-6">
                {subscription ? (
                  <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${getPlanColor(subscription.plan_id)} text-white`}>
                        {getPlanIcon(subscription.plan_id)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {subscription.plan_name} Plan
                        </h3>
                        <p className="text-gray-600">
                          {formatCurrency(subscription.price)} / {subscription.billing_cycle || 'month'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Since {formatDate(subscription.starts_at)}
                          </span>
                    </div>
                  </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Free Plan</h3>
                    <p className="text-gray-600 mb-4">You're currently on the free plan</p>
                    <button 
                      onClick={() => setActiveTab('upgrade')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Upgrade Now
                    </button>
                </div>
                )}
            </div>
          </motion.div>

            {/* Upgrade Prompt for Free Users */}
            {(!userProfile?.plan || userProfile?.plan === 'free') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
                    <p className="text-blue-100 mb-4">
                      Upgrade to Pro for unlimited surveys, advanced analytics, and custom branding
                    </p>
                    <button
                      onClick={() => setActiveTab('upgrade')}
                      className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      View Upgrade Options
                    </button>
                    </div>
                  <Crown className="w-16 h-16 text-blue-200 hidden md:block" />
                  </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Receipt className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Download Invoices</h3>
                  </div>
                <p className="text-gray-600 text-sm mb-4">Get PDF copies of all your invoices</p>
                <button 
                  onClick={() => setActiveTab('invoices')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All Invoices →
                </button>
                </div>

              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                  <h3 className="font-semibold text-gray-900">Payment Methods</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Manage your cards and payment options</p>
                <button 
                  onClick={() => setActiveTab('payment-methods')}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Manage Methods →
                </button>
                </div>

              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Billing Alerts</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">Set up notifications for payments</p>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Configure Alerts →
                </button>
              </div>
            </motion.div>
        </div>
        )}

        {activeTab === 'analytics' && (
          <BillingAnalytics />
        )}

        {activeTab === 'invoices' && (
          <InvoiceManager />
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
            </div>

            <div className="flex items-center space-x-3">
            <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sort by Date</span>
            </button>
                  
                <button
                    onClick={fetchBillingData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
              </div>
            </div>
        </div>

            {/* Billing History Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
                <p className="text-gray-600 text-sm">All your billing transactions and payments</p>
            </div>
              
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-600">Your billing history will appear here</p>
                  </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredHistory.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlanColor(transaction.plan_id)} text-white mr-3`}>
                                {getPlanIcon(transaction.plan_id)}
                    </div>
            <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {transaction.plan_name} Plan
                                </p>
                                <p className="text-sm text-gray-500">
                                  {transaction.billing_cycle || 'Monthly'} billing
                                </p>
            </div>
                  </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(transaction.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(transaction.price)}
                            </p>
                            <p className="text-sm text-gray-500">{transaction.currency || selectedCurrency}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center space-x-3">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Eye className="w-4 h-4" />
            </button>
                              <button className="text-green-600 hover:text-green-700">
                                <Download className="w-4 h-4" />
                </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <ExternalLink className="w-4 h-4" />
                              </button>
                  </div>
                          </td>
                        </motion.tr>
              ))}
                    </tbody>
                  </table>
            </div>
              )}
            </div>
          </div>
            )}
            
        {activeTab === 'payment-methods' && (
          <div className="space-y-6">
            {/* Add Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                  <p className="text-gray-600 text-sm">Manage your cards and payment options</p>
                </div>
                <button 
                  onClick={() => setShowAddPaymentModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </button>
            </div>

              {/* Payment Methods List */}
              {paymentMethods.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                  <p className="text-gray-600 mb-4">Add a payment method to manage your subscriptions</p>
                  <button 
                    onClick={() => setShowAddPaymentModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Card
                  </button>
            </div>
          ) : (
            <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <CreditCard className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            •••• •••• •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-600">
                            {method.brand.toUpperCase()} • Expires {method.expMonth}/{method.expYear}
                          </p>
                          <p className="text-sm text-gray-500">{method.name}</p>
                        </div>
                        {method.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            Default
                    </span>
                        )}
                  </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                    </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
              </button>
            </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
                </div>
              )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Billing Preferences */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Preferences</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Receipts</p>
                    <p className="text-sm text-gray-600">Receive email receipts for all payments</p>
              </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
            </div>
            
                <div className="flex items-center justify-between">
              <div>
                    <p className="font-medium text-gray-900">Payment Reminders</p>
                    <p className="text-sm text-gray-600">Get notified before your next billing date</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Failed Payment Alerts</p>
                    <p className="text-sm text-gray-600">Get immediate alerts for failed payments</p>
              </div>
                  <label className="relative inline-flex items-centers cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                    <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                    </div>
                
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                    </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                    </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Ghana</option>
                    <option>Nigeria</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                      </button>
                  </div>
                </div>
            </div>
          )}

        {activeTab === 'upgrade' && (
          <div className="space-y-8">
            {/* Super Admin Plan Control */}
            {(user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin') && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                      <Crown className="w-6 h-6" />
                      <span>Super Admin Plan Control</span>
                    </h2>
                    <p className="text-purple-100">
                      Instantly switch between any plan without payment restrictions
                      </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                    onClick={() => handleUpgrade('free')}
                    disabled={loading || userProfile?.plan === 'free'}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Star className="w-4 h-4" />
                    <span>Switch to Free</span>
                      </button>
                  
                  <button
                    onClick={() => handleUpgrade('pro')}
                    disabled={loading || userProfile?.plan === 'pro'}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Switch to Pro</span>
                  </button>
                  
                  <button
                    onClick={() => handleUpgrade('enterprise')}
                    disabled={loading || userProfile?.plan === 'enterprise'}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Switch to Enterprise</span>
                  </button>
                  </div>
                
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-purple-100">
                    ⚡ Super Admin Privilege: Plan changes are instant and bypass payment processing
                  </p>
                </div>
            </div>
          )}

            {/* Current Plan Status */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Current Plan: {userProfile?.plan || 'Free'}</h2>
                  <p className="text-blue-100">
                    {userProfile?.plan === 'free' && "Upgrade to unlock powerful features and grow your survey capabilities"}
                    {userProfile?.plan === 'pro' && "You're on our Pro plan! Consider Enterprise for advanced features"}
                    {userProfile?.plan === 'enterprise' && "You're on our top-tier Enterprise plan with all features"}
                  </p>
                </div>
                <div className="hidden md:block">
                  {userProfile?.plan === 'free' && <Star className="w-16 h-16 text-blue-200" />}
                  {userProfile?.plan === 'pro' && <Zap className="w-16 h-16 text-blue-200" />}
                  {userProfile?.plan === 'enterprise' && <Crown className="w-16 h-16 text-blue-200" />}
                </div>
              </div>
            </div>

            {/* Available Plans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl border-2 p-6 ${
                  userProfile?.plan === 'free' ? 'border-gray-300 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                } transition-all duration-200`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-gray-600" />
                </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₵0</div>
                  <p className="text-gray-600 mb-6">per month</p>
                  
                  <ul className="text-left space-y-3 mb-6">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Up to 5 surveys</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">100 responses per survey</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Basic analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Standard templates</span>
                    </li>
                  </ul>
                  
                  {userProfile?.plan === 'free' ? (
                    <button className="w-full py-2 px-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                      Current Plan
                    </button>
                  ) : (
                    <button className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Downgrade to Free
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-white rounded-xl border-2 p-6 ${
                  userProfile?.plan === 'pro' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-blue-200 hover:border-blue-300 hover:shadow-lg'
                } transition-all duration-200 relative`}
              >
                {userProfile?.plan !== 'pro' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
              </div>
            )}
            
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₵{getPlanPrice('pro', 'monthly')}</div>
                  <p className="text-gray-600 mb-6">per month</p>
                  
                  <ul className="text-left space-y-3 mb-6">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Unlimited surveys</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">10,000 responses per survey</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Advanced analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Custom branding</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Team collaboration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">API access</span>
                    </li>
                  </ul>
                  
                  {userProfile?.plan === 'pro' ? (
                    <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg cursor-not-allowed">
                      Current Plan
                    </button>
                  ) : (
              <button
                      onClick={() => handleUpgrade('pro')}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                      Upgrade to Pro
              </button>
                  )}
                </div>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-white rounded-xl border-2 p-6 ${
                  userProfile?.plan === 'enterprise' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-purple-200 hover:border-purple-300 hover:shadow-lg'
                } transition-all duration-200`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₵{getPlanPrice('enterprise', 'monthly')}</div>
                  <p className="text-gray-600 mb-6">per month</p>
                  
                  <ul className="text-left space-y-3 mb-6">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Everything in Pro</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Unlimited responses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Advanced team collaboration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Custom development</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Enterprise security</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">24/7 priority support</span>
                    </li>
                  </ul>
                  
                  {userProfile?.plan === 'enterprise' ? (
                    <button className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg cursor-not-allowed">
                      Current Plan
                    </button>
                  ) : (
              <button
                      onClick={() => handleUpgrade('enterprise')}
                      className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                      Upgrade to Enterprise
              </button>
                  )}
            </div>
              </motion.div>
          </div>

            {/* Upgrade Benefits */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Upgrade?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 text-sm">Get deeper insights with advanced reporting and real-time analytics</p>
            </div>
            
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Branding</h3>
                  <p className="text-gray-600 text-sm">Brand your surveys with custom logos, colors, and styling</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
              </div>
                  <h3 className="font-semibold text-gray-900 mb-2">API Access</h3>
                  <p className="text-gray-600 text-sm">Integrate with your existing tools and automate workflows</p>
                  </div>
                </div>
              </div>

            {/* Billing Cycle Options */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Options</h2>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Monthly
              </button>
              <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    billingCycle === 'annual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Annual (Save 17%)
              </button>
            </div>

              {billingCycle === 'annual' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Annual Savings</span>
          </div>
                  <p className="text-green-700 text-sm mt-1">
                    Save 2 months when you pay annually. That's over $100 in savings on Pro plan!
                  </p>
        </div>
      )}
    </div>

            {/* Payment Security */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Cancel Anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-700">No Setup Fees</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Billing Preferences */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Preferences</h2>
              
              <div className="space-y-6">
                {/* Billing Cycle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Billing Cycle</h3>
                    <p className="text-sm text-gray-600">Choose your preferred billing frequency</p>
                  </div>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        billingCycle === 'monthly'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('annually')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        billingCycle === 'annually'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Annually
                    </button>
                  </div>
                </div>

                {/* Currency */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Display Currency</h3>
                    <p className="text-sm text-gray-600">Choose your preferred currency for billing</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                      className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                      <span className="text-lg">{CURRENCIES[selectedCurrency]?.flag}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {CURRENCIES[selectedCurrency]?.symbol} {selectedCurrency}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {showCurrencyDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                        {Object.entries(CURRENCIES).map(([code, currency]) => (
                          <button
                            key={code}
                            onClick={() => {
                              setSelectedCurrency(code);
                              setShowCurrencyDropdown(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                              selectedCurrency === code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-xl">{currency.flag}</span>
                            <div className="flex-1">
                              <p className="font-medium">{currency.symbol} {code}</p>
                              <p className="text-xs text-gray-500">{currency.name}</p>
                            </div>
                            {selectedCurrency === code && (
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto-renewal */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Auto-renewal</h3>
                    <p className="text-sm text-gray-600">Automatically renew your subscription</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive billing and payment notifications</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tax ID"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter billing address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Ghana</option>
                    <option>Nigeria</option>
                    <option>Kenya</option>
                    <option>South Africa</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-6">Danger Zone</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Cancel Subscription</h3>
                    <p className="text-sm text-gray-600">Cancel your subscription and lose access to premium features</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Cancel Subscription
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Paystack Payment Modal */}
      {showPaymentModal && selectedPlanForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <PaystackPayment
              plan={selectedPlanForPayment.plan}
              billingCycle={selectedPlanForPayment.cycle}
              userEmail={user.email}
              userId={user.id}
              onSuccess={(reference) => {
                console.log('Payment successful:', reference);
                setShowPaymentModal(false);
                setSelectedPlanForPayment(null);
                toast.success('Plan upgraded successfully! Reloading...');
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              }}
              onCancel={() => {
                setShowPaymentModal(false);
                setSelectedPlanForPayment(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddPaymentMethod();
              }} className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={newPaymentMethod.cardNumber}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod,
                      cardNumber: e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
                    })}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={newPaymentMethod.cardholderName}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod,
                      cardholderName: e.target.value
                    })}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={newPaymentMethod.expiryDate}
                      onChange={(e) => setNewPaymentMethod({
                        ...newPaymentMethod,
                        expiryDate: e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/')
                      })}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={newPaymentMethod.cvv}
                      onChange={(e) => setNewPaymentMethod({
                        ...newPaymentMethod,
                        cvv: e.target.value.replace(/\D/g, '')
                      })}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Default Payment Method */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newPaymentMethod.isDefault}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod,
                      isDefault: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    Set as default payment method
                  </label>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Billing; 