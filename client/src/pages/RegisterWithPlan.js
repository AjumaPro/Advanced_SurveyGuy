import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Crown, 
  ArrowRight,
  Lock,
  Users,
  BarChart3,
  Shield,
  ArrowLeft,
  ChevronDown,
  Globe
} from 'lucide-react';

const RegisterWithPlan = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free'); // 'free' or 'pro'
  const [currentStep, setCurrentStep] = useState('plan'); // 'plan' or 'details'
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const { register } = useAuth();
  const { 
    userCurrency, 
    isDetected, 
    isLoading: currencyLoading,
    availableCurrencies,
    changeCurrency,
    getPlanPricing,
    formatPrice,
    getCurrencyConfig
  } = useCurrency();
  const navigate = useNavigate();

  // Use userCurrency as selectedCurrency
  const selectedCurrency = userCurrency || 'GHS';

  // Currency configuration
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
      exchangeRate: 60, // 1 GHS = 60 NGN (approximate)
      decimalPlaces: 2
    },
    KES: {
      symbol: 'KSh',
      name: 'Kenyan Shilling',
      flag: '🇰🇪',
      exchangeRate: 12, // 1 GHS = 12 KES (approximate)
      decimalPlaces: 2
    },
    ZAR: {
      symbol: 'R',
      name: 'South African Rand',
      flag: '🇿🇦',
      exchangeRate: 1.48, // 1 GHS = 1.48 ZAR (approximate)
      decimalPlaces: 2
    },
    EGP: {
      symbol: 'E£',
      name: 'Egyptian Pound',
      flag: '🇪🇬',
      exchangeRate: 2.46, // 1 GHS = 2.46 EGP (approximate)
      decimalPlaces: 2
    }
  }), []);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting registration...');
      const result = await register(formData.email, formData.password, formData.name, selectedPlan);
      
      if (result.success) {
        console.log('✅ Registration successful, redirecting...');
        
        if (selectedPlan === 'pro' || selectedPlan === 'enterprise') {
          // Redirect to payment flow for Pro/Enterprise plans
          navigate('/app/subscriptions');
        } else {
          // Redirect to dashboard for Free plan
          navigate('/app/dashboard');
        }
      } else {
        console.log('❌ Registration failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleNextStep = () => {
    if (currentStep === 'plan') {
      setCurrentStep('details');
    }
  };

  const handleBackStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('plan');
    }
  };

  const planFeatures = useMemo(() => ({
    free: {
      name: 'Free Plan',
      icon: Star,
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 surveys',
        'Basic analytics',
        'Email support',
        'Standard templates'
      ],
      limitations: [
        'Cannot edit published surveys',
        'Cannot delete published surveys',
        'Limited to 5 surveys total'
      ]
    },
    pro: {
      name: 'Pro Plan',
      icon: Zap,
      price: `${formatCurrency(20.00)}/month`,
      description: 'For growing businesses',
      features: [
        'Unlimited surveys',
        'Advanced analytics',
        'Priority support',
        'All templates',
        'Export capabilities',
        'Team collaboration'
      ],
      popular: true
    },
    enterprise: {
      name: 'Enterprise Plan',
      icon: Crown,
      price: `${formatCurrency(99.99)}/month`,
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'White-label solution',
        'Custom integrations',
        'Dedicated support',
        'Advanced security',
        'Custom branding',
        'API access',
        'Multi-team management'
      ]
    }
  }), [selectedCurrency, formatCurrency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentStep === 'plan' ? 'Choose Your Plan' : 'Create Your Account'}
          </h2>
          <p className="text-gray-600 text-sm">
            {currentStep === 'plan' 
              ? 'Start with free or upgrade to Pro for unlimited surveys' 
              : 'Complete your registration to get started'
            }
          </p>
        </div>

        {currentStep === 'plan' ? (
          <>
            {/* Currency Selector */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
                >
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="text-xl">{CURRENCIES[selectedCurrency]?.flag}</span>
                  <span className="text-xs font-semibold text-gray-700">
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
                        <span className="text-base">{currency.flag}</span>
                        <span className="font-semibold text-sm">{currency.symbol}</span>
                        <span className="text-xs text-gray-500">{currency.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
            {Object.entries(planFeatures).map(([planKey, plan]) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={planKey}
                  whileHover={{ scale: 1.02 }}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 cursor-pointer transition-all ${
                    selectedPlan === planKey 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlanSelect(planKey)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                      selectedPlan === planKey ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        selectedPlan === planKey ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-6">{plan.price}</div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {plan.limitations && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-xs font-semibold text-red-800 mb-2">Limitations:</h4>
                        <ul className="text-xs text-red-700 space-y-1">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-center">
                              <Lock className="w-3 h-3 mr-2" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-8">
            <button
              onClick={handleNextStep}
              disabled={!selectedPlan}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center mx-auto"
            >
              Continue to Account Details
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Plan Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800">Selected Plan:</h4>
                    <p className="text-blue-700">{planFeatures[selectedPlan].name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Plan
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}


        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithPlan;
