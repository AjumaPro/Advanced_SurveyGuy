import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { InlineSpinner, CardSkeleton } from '../components/LoadingSpinner';
import SuperAdminPlanSwitcher from '../components/SuperAdminPlanSwitcher';
import {
  Crown,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Rocket,
  Settings,
  Activity,
  ChevronDown
} from 'lucide-react';

// Lazy load heavy components
const UsageTracker = React.lazy(() => import('../components/UsageTracker'));
const SubscriptionManager = React.lazy(() => import('../components/SubscriptionManager'));
const PaymentFlow = React.lazy(() => import('../components/PaymentFlow'));

const Subscriptions = () => {
  const { user, userProfile, updateProfile, loading: authLoading } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(userProfile?.plan || 'free');
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annually'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeView, setActiveView] = useState('plans'); // 'plans', 'usage', 'manage'
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('GHS');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Currency configuration (matching pricing page)
  const CURRENCIES = useMemo(() => ({
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
  }), []);

  useEffect(() => {
    if (userProfile?.plan) {
      setCurrentPlan(userProfile.plan);
    }
  }, [userProfile]);

  // Auto-detect user location for currency (matching pricing page)
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Map country codes to currencies
        const countryCurrencyMap = {
          'GH': 'GHS',
          'US': 'USD',
          'GB': 'GBP',
          'NG': 'NGN',
          'KE': 'KES',
          'ZA': 'ZAR'
        };
        
        const detectedCurrency = countryCurrencyMap[data.country_code];
        if (detectedCurrency && CURRENCIES[detectedCurrency]) {
          setSelectedCurrency(detectedCurrency);
        }
    } catch (error) {
        console.log('Could not detect user location, using default currency');
      }
    };

    detectUserLocation();
  }, [CURRENCIES]);

  // Redirect free plan users to payment page
  useEffect(() => {
    if (user && userProfile && currentPlan === 'free') {
      // Show a toast message and redirect to payment page
      toast('Upgrade to a paid plan to access subscription management! 💳', {
        duration: 3000,
        icon: '💳',
      });
      
      // Redirect to payment page after a short delay
      setTimeout(() => {
        window.location.href = '/app/billing';
      }, 2000);
    }
  }, [user, userProfile, currentPlan]);

  // Base plans with GHS pricing (Premium removed, remaining upgraded)
  const basePlans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: <Star className="w-8 h-8" />,
      color: 'from-gray-400 to-gray-600',
      borderColor: 'border-gray-300',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      popular: false,
      description: 'Perfect for getting started with powerful features',
      features: [
        'Up to 5 surveys', // Upgraded from 3
        '100 responses per survey', // Upgraded from 50
        'All question types', // Upgraded from basic
        'File uploads', // New feature
        'Basic analytics',
        'Standard templates',
        'Email support',
        'QR code generation', // New feature
        'Export to PDF', // New feature
        '2 GB storage' // Upgraded from 1 GB
      ],
      limitations: [
        'No custom branding',
        'No API access',
        'No team collaboration',
        'Basic support only'
      ],
      buttonText: 'Current Plan',
      isCurrent: currentPlan === 'free',
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 20.00, // Updated price
      yearlyPrice: 499.99, // 10 months price (2 months free)
      icon: <Zap className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-600',
      borderColor: 'border-blue-500',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: true,
      description: 'For growing businesses and teams',
      features: [
        'Unlimited surveys',
        '10,000 responses per survey', // Upgraded to 10,000
        'All question types',
        'File uploads',
        'Custom branding',
        'Advanced analytics & reporting', // Enhanced
        'Team collaboration', // New feature from premium
        'Priority support',
        'API access', // New feature from premium
        'Export to PDF/Excel',
        'QR code generation',
        'Premium templates',
        'White-label options', // New feature from premium
        'Advanced security', // New feature from premium
        '20 GB storage', // Upgraded storage
        'Multi-language support' // New feature from premium
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      isCurrent: currentPlan === 'pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 99.99, // Updated price
      yearlyPrice: 1499.99, // 10 months price (2 months free)
      icon: <Crown className="w-8 h-8" />,
      color: 'from-yellow-400 to-orange-600',
      borderColor: 'border-yellow-500',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      popular: false,
      description: 'Complete solution for large organizations',
      features: [
        'Everything in Pro',
        'Unlimited responses',
        'Advanced team collaboration', // Enhanced
        'Custom development',
        'On-premise deployment',
        'Enterprise-grade security', // Enhanced
        'SLA guarantee',
        'Dedicated account manager',
        'Custom training & onboarding', // Enhanced
        'Advanced integrations & webhooks', // Enhanced
        'Compliance features (GDPR, HIPAA)', // Enhanced
        'Custom reporting & dashboards', // Enhanced
        'Single Sign-On (SSO)', // New feature
        'Advanced user management', // New feature
        'Custom workflows', // New feature
        'Unlimited storage',
        '24/7 phone & chat support', // Enhanced
        'Priority feature requests' // New feature
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      isCurrent: currentPlan === 'enterprise',
    },
  ];

  // Currency conversion functions (matching pricing page)
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const fromRate = CURRENCIES[fromCurrency]?.exchangeRate || 1;
    const toRate = CURRENCIES[toCurrency]?.exchangeRate || 1;
    return (amount / fromRate) * toRate;
  };

  const formatCurrency = (amount, currency = selectedCurrency) => {
    const currencyInfo = CURRENCIES[currency];
    if (!currencyInfo) return `${amount}`;
    
    const convertedAmount = convertCurrency(amount, 'GHS', currency);
    return `${currencyInfo.symbol}${convertedAmount.toFixed(currencyInfo.decimalPlaces)}`;
  };

  const getPrice = (plan) => {
    const price = billingCycle === 'annually' ? plan.yearlyPrice : plan.monthlyPrice;
    if (price === 0) return 'Free';
    return formatCurrency(price);
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return null;
    if (billingCycle === 'annually') {
      const monthlyTotal = convertCurrency(plan.monthlyPrice, 'GHS', selectedCurrency) * 12;
      const yearlyPrice = convertCurrency(plan.yearlyPrice, 'GHS', selectedCurrency);
      const savings = monthlyTotal - yearlyPrice;
      const currencyInfo = CURRENCIES[selectedCurrency];
      return savings > 0 ? `Save ${currencyInfo.symbol}${savings.toFixed(currencyInfo.decimalPlaces)}/year` : null;
    }
    return null;
  };

  // Get plans with converted prices for selected currency
  const plans = basePlans.map(plan => ({
    ...plan,
    displayPrice: plan.monthlyPrice === 0 ? 'Free' : getPrice(plan),
    originalPrice: billingCycle === 'annually' ? plan.yearlyPrice : plan.monthlyPrice,
    savings: getSavings(plan)
  }));

  const handlePlanChange = async (planId) => {
    if (!user) {
      toast.error('Please log in to change your plan.');
      return;
    }

    const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';

    if (planId === currentPlan) {
      toast('You are already on this plan!');
      return;
    }

    setLoading(true);
    try {
      if (isSuperAdmin) {
        // Super admin can switch to any plan instantly
        toast.success(`Super admin: Switching to ${planId} plan instantly...`);
        
        const response = await api.admin.changePlan(user.id, planId, true);
        
        if (response.error) {
          toast.error(`Failed to change plan: ${response.error}`);
        } else {
          setCurrentPlan(planId);
          toast.success(`Successfully switched to ${planId} plan!`);
          
          // Create a notification for the user
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: 'Plan Changed',
            message: `Your plan has been changed to ${planId} by super admin`,
            type: 'plan_change'
          });
        }
      } else {
        // Regular users
        if (planId === 'enterprise') {
          toast.info('Please contact sales for Enterprise plans.');
      return;
    }

        const { success, error } = await updateProfile({ plan: planId });
        if (success) {
          setCurrentPlan(planId);
          toast.success(`Successfully upgraded to ${planId} plan!`);
          
          // Create a notification for the user
          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'plan_change',
            title: 'Plan Updated',
            message: `Your plan has been updated to ${planId}.`,
            link: '/app/subscriptions'
          });
          
          // Track analytics
          await supabase.from('analytics').insert({
            user_id: user.id,
            entity_type: 'subscription',
            entity_id: user.id,
            event_type: 'plan_upgrade',
            metadata: { from_plan: currentPlan, to_plan: planId }
          });
        } else {
          toast.error(error || 'Failed to update plan.');
        }
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const openUpgradeModal = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentFlow(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh user data and show success message
    toast.success('🎉 Welcome to your new plan!');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loading state for free plan users being redirected
  if (user && userProfile && currentPlan === 'free') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Payment Page</h2>
          <p className="text-gray-600">Please wait while we redirect you to upgrade your plan...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Super Admin Plan Switcher */}
        <SuperAdminPlanSwitcher onPlanChange={(plan) => setCurrentPlan(plan)} />
        
        {/* Header */}
        <div className="text-center mb-12">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="text-center sm:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  Choose Your Perfect Plan
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl">
                  Unlock powerful features to supercharge your surveys, events, and analytics. 
                  Start free and scale as you grow.
                </p>
              </div>
              
              {/* Currency Selector */}
              <div className="relative mt-6 sm:mt-0">
              <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-lg border hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">{CURRENCIES[selectedCurrency]?.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{CURRENCIES[selectedCurrency]?.symbol} {selectedCurrency}</p>
                    <p className="text-xs text-gray-600">{CURRENCIES[selectedCurrency]?.name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

                {showCurrencyDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-50">
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
          </motion.div>
          
          {/* Current Plan Badge */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center px-6 py-3 rounded-full bg-white shadow-lg border-2 border-blue-200"
            >
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  {plans.find(p => p.id === currentPlan)?.icon}
              </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="font-bold text-gray-900 capitalize">{currentPlan} Plan</p>
            </div>
              </div>
            </motion.div>
          )}
            </div>
            
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 border">
            <div className="flex space-x-2">
              {[
                { id: 'plans', label: 'Plans & Pricing', icon: Star },
                { id: 'usage', label: 'Usage & Limits', icon: Activity },
                { id: 'manage', label: 'Manage Subscription', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
              <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeView === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
              </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'plans' && (
          <>
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-12">
              <div className="relative p-1 bg-white rounded-full shadow-lg border-2 border-gray-200">
                <button
                  className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    billingCycle === 'monthly' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    billingCycle === 'annually' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setBillingCycle('annually')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Annually</span>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      Save 2 months
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
        <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${
                plan.popular ? 'border-blue-500 ring-4 ring-blue-100' : plan.borderColor
              } ${plan.isCurrent ? 'ring-4 ring-green-100 border-green-500' : ''} relative`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                    </div>
              )}

              {/* Current Plan Badge */}
              {plan.isCurrent && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Current
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`bg-gradient-to-r ${plan.color} p-8 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    {plan.icon}
                  </div>
                  {plan.id === 'enterprise' && (
                    <Award className="w-6 h-6 text-yellow-300" />
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
                <p className="text-white text-opacity-90 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {plan.displayPrice === 'Free' ? 'Free' : plan.displayPrice}
                    </span>
                    {plan.displayPrice !== 'Free' && (
                      <span className="text-xl font-medium text-gray-600 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
            </div>

                  {plan.displayPrice === 'Free' && (
                    <p className="text-sm text-gray-600 font-medium mt-2 text-center">
                      Forever free
                    </p>
                  )}
                  
                  {plan.savings && (
                    <p className="text-sm text-green-600 font-medium mt-2 text-center">
                      {plan.savings}
                    </p>
                  )}
                  
                  {selectedCurrency !== 'GHS' && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {formatCurrency(plan.originalPrice, 'GHS')} GHS
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-6">
                      <h5 className="font-medium text-gray-600 mb-2 text-sm">Limitations:</h5>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-start">
                            <XCircle className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500 text-xs">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => plan.id === 'enterprise' ? openUpgradeModal(plan) : handlePlanChange(plan.id)}
                  disabled={plan.isCurrent || loading}
                  className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                    plan.isCurrent
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : `${plan.buttonColor} text-white hover:shadow-lg transform`
                  }`}
                >
                  {loading && !plan.isCurrent ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {plan.isCurrent ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
            </div>

            {/* Feature Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-16"
            >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Detailed Feature Comparison
          </h2>
          
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-yellow-600">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Surveys', 'Up to 5', 'Unlimited', 'Unlimited'],
                  ['Responses per Survey', '100', '10,000', 'Unlimited'],
                  ['Question Types', 'All types', 'All types', 'All types'],
                  ['File Uploads', '✓', '✓', '✓'],
                  ['Custom Branding', '✗', '✓', '✓'],
                  ['Analytics', 'Basic', 'Advanced + Reporting', 'Real-time + Custom'],
                  ['Support', 'Email', 'Priority + API', '24/7 + Dedicated Manager'],
                  ['API Access', '✗', '✓', 'Full + Webhooks'],
                  ['White-label', '✗', 'Options', 'Full'],
                  ['Team Collaboration', '✗', '✓', 'Advanced'],
                  ['Storage', '2 GB', '20 GB', 'Unlimited'],
                  ['Custom Development', '✗', '✗', '✓'],
                  ['SLA Guarantee', '✗', '✗', '✓'],
                  ['SSO Integration', '✗', '✗', '✓'],
                  ['Compliance Features', '✗', '✗', '✓'],
                  ['On-premise Deployment', '✗', '✗', '✓'],
                ].map(([feature, free, pro, enterprise], index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{free}</td>
                    <td className="py-4 px-6 text-center text-blue-600 font-medium">{pro}</td>
                    <td className="py-4 px-6 text-center text-yellow-600 font-medium">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
      <motion.div 
          initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans.'
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee for all new Pro and Enterprise subscriptions.'
              },
              {
                q: 'What happens if I exceed my plan limits?',
                a: 'We\'ll notify you when you\'re approaching your limits. You can upgrade anytime or we\'ll temporarily pause collection until next month.'
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely! We use enterprise-grade security, encryption, and comply with GDPR and other privacy regulations.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  {item.q}
                </h3>
                <p className="text-gray-700 leading-relaxed">{item.a}</p>
              </div>
            ))}
        </div>
      </motion.div>

        {/* Contact Sales CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-10 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <Rocket className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Contact our sales team for custom enterprise solutions, volume discounts, 
              and dedicated support tailored to your organization's needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:sales@surveyguy.com"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Sales
              </a>
              <a
                href="/demo"
                className="bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-800 transition-colors font-semibold flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
              </a>
                  </div>
                </div>
        </motion.div>
          </>
        )}

        {/* Usage View */}
        {activeView === 'usage' && user && (
          <Suspense fallback={<CardSkeleton count={3} />}>
            <UsageTracker 
              currentPlan={currentPlan} 
              onUpgradeClick={() => setActiveView('plans')} 
            />
          </Suspense>
        )}

        {/* Manage View */}
        {activeView === 'manage' && user && (
          <Suspense fallback={<CardSkeleton count={2} />}>
            <SubscriptionManager 
              currentPlan={currentPlan} 
              onPlanChange={handlePlanChange} 
            />
          </Suspense>
        )}
                  </div>

      {/* Payment Flow Modal */}
      {showPaymentFlow && selectedPlan && (
        <Suspense fallback={<InlineSpinner />}>
          <PaymentFlow
          selectedPlan={selectedPlan}
          billingCycle={billingCycle}
          onSuccess={handlePaymentSuccess}
          onCancel={() => {
            setShowPaymentFlow(false);
            setSelectedPlan(null);
          }}
          />
        </Suspense>
      )}

        </motion.div>
  );
};

export default Subscriptions; 