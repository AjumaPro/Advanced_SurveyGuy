import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import { initializePayment, formatAmount } from '../services/paystackService';
import {
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Star,
  Gift,
  ArrowLeft,
  Zap,
  Crown,
  Smartphone,
  Banknote,
  Building,
  QrCode
} from 'lucide-react';

const PaymentFlow = ({ selectedPlan, billingCycle, onSuccess, onCancel }) => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState('plan-review'); // plan-review, payment-method, processing, success
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    card: {
      number: '',
      expiry: '',
      cvc: '',
      name: ''
    }
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  // Ghana Cedis pricing
  const planPrices = {
    free: { monthly: 0, yearly: 0 },
    pro: { monthly: 20.00, yearly: 200.00 },
    enterprise: { monthly: 99.99, yearly: 999.99 }
  };

  const currentPrice = planPrices[selectedPlan.id]?.[billingCycle === 'monthly' ? 'monthly' : 'yearly'] || 0;
  const savings = billingCycle === 'yearly' ? (planPrices[selectedPlan.id]?.monthly * 12) - currentPrice : 0;

  // Paystack payment methods
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Verve'
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: Smartphone,
      description: 'MTN, Vodafone, AirtelTigo'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building,
      description: 'Direct bank transfer'
    },
    {
      id: 'ussd',
      name: 'USSD',
      icon: QrCode,
      description: 'Dial *170# for payment'
    }
  ];

  // Initialize Paystack config
  const config = initializePayment(currentPrice, user?.email || '', {
    plan_id: selectedPlan.id,
    billing_cycle: billingCycle,
    user_id: user?.id,
    channels: [selectedPaymentMethod, 'card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
  });

  const initializePaystack = usePaystackPayment(config);

  useEffect(() => {
    // Initialize payment processor
    initializePaymentProcessor();
  }, []);

  const initializePaymentProcessor = async () => {
    try {
      // In a real app, you would initialize Stripe or another payment processor here
      console.log('Payment processor initialized');
    } catch (error) {
      console.error('Failed to initialize payment processor:', error);
      toast.error('Payment system unavailable. Please try again later.');
    }
  };


  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setLoading(true);
    try {
      // Mock promo code validation
      const validPromoCodes = {
        'SAVE20': { type: 'percentage', value: 20, description: '20% off first year' },
        'WELCOME10': { type: 'percentage', value: 10, description: '10% off' },
        'STUDENT50': { type: 'percentage', value: 50, description: '50% student discount' }
      };

      const promo = validPromoCodes[promoCode.toUpperCase()];
      
      if (promo) {
        setDiscount(promo);
        toast.success(`Promo code applied! ${promo.description}`);
      } else {
        toast.error('Invalid promo code');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast.error('Failed to apply promo code');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let total = currentPrice;
    
    if (discount) {
      if (discount.type === 'percentage') {
        total = total * (1 - discount.value / 100);
      } else if (discount.type === 'fixed') {
        total = Math.max(0, total - discount.value);
      }
    }
    
    return total;
  };

  // Paystack payment success handler
  const handlePaymentSuccess = async (reference) => {
    setLoading(true);
    setCurrentStep('processing');

    try {
      console.log('💳 Payment successful:', reference);

      // Verify payment on backend
      const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
        body: { reference: reference.reference }
      });

      if (error || !data?.success) {
        throw new Error(data?.message || 'Payment verification failed');
      }

      console.log('✅ Payment verified:', data);

      // Update user's plan in database
      const subscriptionEndDate = new Date();
      if (billingCycle === 'yearly') {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan: selectedPlan.id,
          subscription_end_date: subscriptionEndDate.toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      toast.success(`🎉 Payment successful! Welcome to ${selectedPlan.name}.`);
      setCurrentStep('success');
      
      if (onSuccess) {
        onSuccess(reference);
      }

    } catch (error) {
      console.error('Payment processing failed:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
      setCurrentStep('payment-method');
      toast.error('Payment failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Paystack payment close handler
  const handlePaymentClose = () => {
    console.log('Payment modal closed');
    // Don't show error if user just closed the modal
  };

  const processPayment = () => {
    console.log('🚀 Processing payment with config:', config);
    console.log('💰 Amount:', currentPrice);
    console.log('📧 Email:', user?.email);
    
    try {
      // Initialize Paystack payment
      initializePaystack({
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose
      });
      
      console.log('✅ Paystack payment initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Paystack payment:', error);
      setPaymentError('Failed to initialize payment. Please try again.');
    }
  };


  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free': return <Star className="w-6 h-6" />;
      case 'pro': return <Zap className="w-6 h-6" />;
      case 'enterprise': return <Crown className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep !== 'success' && (
                <button
                  onClick={currentStep === 'plan-review' ? onCancel : () => setCurrentStep('plan-review')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentStep === 'success' ? 'Welcome to ' + selectedPlan.name + '!' : 'Upgrade to ' + selectedPlan.name}
                </h2>
                <p className="text-gray-600">
                  {currentStep === 'plan-review' && 'Review your plan details'}
                  {currentStep === 'payment-method' && 'Enter your payment information'}
                  {currentStep === 'processing' && 'Processing your payment...'}
                  {currentStep === 'success' && 'Your subscription is now active'}
                </p>
              </div>
            </div>
            {currentStep !== 'processing' && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {['plan-review', 'payment-method', 'processing', 'success'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : ['plan-review', 'payment-method', 'processing', 'success'].indexOf(currentStep) > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {['plan-review', 'payment-method', 'processing', 'success'].indexOf(currentStep) > index ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    ['plan-review', 'payment-method', 'processing', 'success'].indexOf(currentStep) > index
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {currentStep === 'plan-review' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Plan Summary */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      {getPlanIcon(selectedPlan.id)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedPlan.name} Plan</h3>
                      <p className="text-blue-100">Perfect for growing teams</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">
                      ${currentPrice}
                    </p>
                    <p className="text-blue-100">
                      per {billingCycle === 'monthly' ? 'month' : 'year'}
                    </p>
                    {billingCycle === 'annually' && (
                      <p className="text-sm text-green-200">
                        Save ${savings} per year
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Billing Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{selectedPlan.name} ({billingCycle})</span>
                      <span>${currentPrice}</span>
                    </div>
                    {discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount.description})</span>
                        <span>-${(currentPrice * discount.value / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatAmount(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Gift className="w-4 h-4 mr-2 text-purple-500" />
                  Have a promo code?
                </h4>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={loading || !promoCode.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('payment-method')}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Continue to Payment
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </button>
            </motion.div>
          )}

          {currentStep === 'payment-method' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Choose Payment Method
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${
                          selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                        <div className="font-medium text-sm">{method.name}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </button>
                    );
                  })}
                  </div>
                  
                {/* Payment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Secure Payment</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your payment is secure. We use Paystack's industry-standard encryption to protect your payment information.
                  </p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Your payment is secure</p>
                    <p>We use industry-standard encryption to protect your payment information. Your card details are never stored on our servers.</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{selectedPlan.name} Plan ({billingCycle})</span>
                    <span>{formatAmount(currentPrice)}</span>
                  </div>
                  {discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${(currentPrice * discount.value / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatAmount(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{paymentError}</span>
                  </div>
                </div>
              )}

              {/* Payment Redirect Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Secure Payment:</strong> You will be redirected to Paystack's secure payment page to complete your purchase.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={processPayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Complete Payment ({formatAmount(calculateTotal())})
                  </>
                )}
              </button>
            </motion.div>
          )}

          {currentStep === 'processing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Your Payment
              </h3>
              <p className="text-gray-600 mb-4">
                Please don't close this window. This may take a few moments.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Welcome to {selectedPlan.name}! Your subscription is now active and you have access to all premium features.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="text-left space-y-1">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• All premium features are now unlocked</li>
                    <li>• Your next billing date is {new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    onSuccess();
                    onCancel();
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start Using {selectedPlan.name}
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFlow;
