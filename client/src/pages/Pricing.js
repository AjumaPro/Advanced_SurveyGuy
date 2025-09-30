import React, { useState, useEffect, useMemo } from 'react';
import { Check, Star, Crown, Zap, Users, BarChart3, Globe, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedCurrency, setSelectedCurrency] = useState('GHS');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
      monthlyPrice: 49.99, // Upgraded price with more features
      yearlyPrice: 499.99, // 10 months price (2 months free)
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
      monthlyPrice: 149.99, // Upgraded price with premium features
      yearlyPrice: 1499.99, // 10 months price (2 months free)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include a 14-day free trial.
          </p>
          
          {/* Currency Selector */}
          <div className="flex items-center justify-center mb-6">
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
          </div>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="text-sm text-green-600 font-medium">Save up to 17%</span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {basePlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-purple-300 scale-105' 
                    : `${plan.borderColor}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${plan.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">{getPrice(plan)}</span>
                  </div>
                  {getSavings(plan) && (
                    <span className="text-sm text-green-600 font-medium">{getSavings(plan)}</span>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-gray-900">Features:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations && (
                    <>
                      <h4 className="font-medium text-gray-900 mt-6">Limitations:</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <div className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0">✕</div>
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                      : plan.name === 'Free'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Additional Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Custom Development</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Need custom features or integrations? Our development team can build exactly what you need.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Custom question types</li>
                <li>• API integrations</li>
                <li>• White-label solutions</li>
                <li>• Custom reporting</li>
              </ul>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">From {formatCurrency(500)}</span>
                <span className="text-gray-600">/project</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Data Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get professional insights from your survey data with our advanced analytics services.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Statistical analysis</li>
                <li>• Custom reports</li>
                <li>• Data visualization</li>
                <li>• Trend analysis</li>
              </ul>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">From {formatCurrency(200)}</span>
                <span className="text-gray-600">/report</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Globe className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Consulting</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Expert guidance on survey design, best practices, and optimization strategies.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Survey design review</li>
                <li>• Best practices training</li>
                <li>• Response rate optimization</li>
                <li>• Strategy consulting</li>
              </ul>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">From {formatCurrency(150)}</span>
                <span className="text-gray-600">/hour</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your billing cycle.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time from your account settings. No long-term contracts or cancellation fees.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing; 