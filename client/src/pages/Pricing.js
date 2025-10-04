import React, { useState, useEffect, useMemo } from 'react';
import { Check, Star, Crown, Zap, Users, BarChart3, Globe, ChevronDown, Sparkles, ArrowRight, QrCode, CreditCard, Calendar, Brain, Shield, Download, Eye, TrendingUp, Award, MessageSquare, FileText, Target, Gift, Heart, Clock, Lock, Database, Smartphone, Palette, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    userCurrency, 
    isDetected, 
    isLoading: currencyLoading,
    availableCurrencies,
    changeCurrency,
    getPlanPricing,
    formatPrice,
    getYearlySavings,
    getCurrencyConfig
  } = useCurrency();

  // Use userCurrency as selectedCurrency
  const selectedCurrency = userCurrency || 'GHS';

  // Currency configuration with GH¢ as default (matching billing page)
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

  // Base plans with GHS pricing (Premium removed, remaining upgraded)
  const basePlans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
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
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      name: 'Pro',
      monthlyPrice: 20.00, // Updated price
      yearlyPrice: 200.00, // 10 months price (2 months free)
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
      popular: true, // Now the most popular plan
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Enterprise',
      monthlyPrice: 99.99, // Updated price
      yearlyPrice: 999.99, // 10 months price (2 months free)
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
      popular: false,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

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
    const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    if (price === 0) return 'Free';
    const convertedPrice = convertCurrency(price, 'GHS', selectedCurrency);
    const currencyInfo = CURRENCIES[selectedCurrency];
    return `${currencyInfo.symbol}${convertedPrice.toFixed(currencyInfo.decimalPlaces)}/${billingCycle === 'yearly' ? 'year' : 'month'}`;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return null;
    if (billingCycle === 'yearly') {
      const monthlyTotal = convertCurrency(plan.monthlyPrice, 'GHS', selectedCurrency) * 12;
      const yearlyPrice = convertCurrency(plan.yearlyPrice, 'GHS', selectedCurrency);
      const savings = monthlyTotal - yearlyPrice;
      const currencyInfo = CURRENCIES[selectedCurrency];
      return savings > 0 ? `Save ${currencyInfo.symbol}${savings.toFixed(currencyInfo.decimalPlaces)}/year` : null;
    }
    return null;
  };

  const handleSelectPlan = (planName) => {
    if (isAuthenticated) {
      // Navigate to billing page with plan pre-selected
      navigate('/app/billing', { 
        state: { 
          selectedPlan: planName.toLowerCase(),
          billingCycle: billingCycle 
        } 
      });
    } else {
      // Navigate to registration page
      navigate('/register', { 
        state: { 
          selectedPlan: planName.toLowerCase(),
          billingCycle: billingCycle 
        } 
      });
    }
  };

  // Auto-detect user location for currency
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white">Simple, Transparent Pricing</h1>
            </div>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your needs. Start free and scale as you grow with our powerful survey platform.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <QrCode className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">QR Code Messages</h3>
                <p className="text-blue-100 text-sm">Create custom QR codes with personalized messages</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <BarChart3 className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-blue-100 text-sm">Real-time insights with beautiful charts and reports</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <CreditCard className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Payment Processing</h3>
                <p className="text-blue-100 text-sm">Seamless billing and subscription management</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Currency and Billing Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Currency Selector */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
              >
                <span className="text-xl">{CURRENCIES[selectedCurrency]?.flag}</span>
                <span className="text-sm font-semibold text-gray-700">
                  {CURRENCIES[selectedCurrency]?.symbol} {selectedCurrency}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {showCurrencyDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  {Object.entries(CURRENCIES).map(([code, currency]) => (
                    <button
                      key={code}
                      onClick={() => {
                        changeCurrency(code);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedCurrency === code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{currency.flag}</span>
                      <span className="font-semibold">{currency.symbol}</span>
                      <span className="text-sm text-gray-500">{currency.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-6 mb-12">
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Save up to 17%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {basePlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative rounded-3xl p-8 bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-2 border-purple-300 scale-105 ring-4 ring-purple-100' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : plan.name === 'Free'
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{getPrice(plan)}</span>
                  </div>
                  {getSavings(plan) && (
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {getSavings(plan)}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">What's included:</h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations && (
                    <>
                      <h4 className="font-bold text-gray-900 mb-4 text-lg mt-8">Limitations:</h4>
                      <ul className="space-y-4">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-red-600 text-sm font-bold">✕</span>
                            </div>
                            <span className="text-gray-500 font-medium">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-3 px-6 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl'
                      : plan.name === 'Free'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl'
                  }`}
                >
                  {plan.name === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
                  {plan.name !== 'Free' && <ArrowRight className="inline-block w-5 h-5 ml-2" />}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Services */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Need Something Custom?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our expert team can help you with custom development, data analysis, and consulting services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Custom Development</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Need custom features or integrations? Our development team can build exactly what you need.
              </p>
              <ul className="text-gray-600 space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Custom question types
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  API integrations
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  White-label solutions
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Custom reporting
                </li>
              </ul>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-3xl font-bold text-gray-900">From {formatCurrency(500)}</span>
                <span className="text-gray-600 ml-2">/project</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Data Analysis</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get professional insights from your survey data with our advanced analytics services.
              </p>
              <ul className="text-gray-600 space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Statistical analysis
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Custom reports
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Data visualization
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Trend analysis
                </li>
              </ul>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-3xl font-bold text-gray-900">From {formatCurrency(200)}</span>
                <span className="text-gray-600 ml-2">/report</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Consulting</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Expert guidance on survey design, best practices, and optimization strategies.
              </p>
              <ul className="text-gray-600 space-y-3 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Survey design review
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Best practices training
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Response rate optimization
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Strategy consulting
                </li>
              </ul>
              <div className="bg-gray-50 rounded-xl p-4">
                <span className="text-3xl font-bold text-gray-900">From {formatCurrency(150)}</span>
                <span className="text-gray-600 ml-2">/hour</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Got questions? We've got answers. Find everything you need to know about our pricing and plans.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Can I upgrade or downgrade my plan anytime?
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed ml-12">
                Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your billing cycle.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  What payment methods do you accept?
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed ml-12">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Gift className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Is there a free trial?
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed ml-12">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Can I cancel anytime?
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed ml-12">
                Absolutely. You can cancel your subscription at any time from your account settings. No long-term contracts or cancellation fees.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust SurveyGuy for their survey needs. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleSelectPlan('Pro')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-xl"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing; 