import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2, Shield, Smartphone, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { initializePayment, formatAmount } from '../services/paystackService';
import { motion } from 'framer-motion';

const PaystackPayment = ({ 
  plan, 
  billingCycle, 
  userEmail, 
  userId, 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Plan pricing in GHS
  const planPrices = {
    pro: {
      monthly: 600,
      yearly: 6000
    },
    enterprise: {
      monthly: 1800,
      yearly: 18000
    }
  };

  const amount = planPrices[plan]?.[billingCycle] || 0;
  const savings = billingCycle === 'yearly' ? (planPrices[plan]?.monthly * 12) - amount : 0;

  // Initialize Paystack config
  const config = initializePayment(amount, userEmail, {
    plan_id: plan,
    billing_cycle: billingCycle,
    user_id: userId
  });

  const initializePaystack = usePaystackPayment(config);

  const handlePaymentSuccess = async (reference) => {
    setProcessing(true);
    
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
          plan: plan,
          subscription_end_date: subscriptionEndDate.toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      toast.success('🎉 Payment successful! Your plan has been upgraded.');
      
      if (onSuccess) {
        onSuccess(reference);
      }

      // Reload to update UI
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('❌ Payment processing error:', error);
      toast.error('Payment verification failed. Please contact support with your reference: ' + reference.reference);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    console.log('Payment window closed by user');
    toast.info('Payment cancelled');
    if (onCancel) {
      onCancel();
    }
  };

  const handleInitiatePayment = () => {
    setLoading(true);
    try {
      console.log('🚀 Initiating Paystack payment...');
      initializePaystack({
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Upgrade to {plan.charAt(0).toUpperCase() + plan.slice(1)}</h3>
        <p className="text-blue-100">Secure payment powered by Paystack</p>
      </div>

      <div className="p-6">
        {/* Payment Summary */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h4>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Plan:</span>
              <span className="font-semibold text-gray-900 capitalize">{plan} Plan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Billing Cycle:</span>
              <span className="font-semibold text-gray-900 capitalize">{billingCycle}</span>
            </div>
            {savings > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>You Save:</span>
                <span className="font-semibold">{formatAmount(savings, 'GHS')}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-gray-700 font-medium text-lg">Total Amount:</span>
              <span className="text-3xl font-bold text-blue-600">{formatAmount(amount, 'GHS')}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Available Payment Methods</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <CreditCard className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-xs text-gray-600 text-center">Card</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Building className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-xs text-gray-600 text-center">Bank</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Smartphone className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-xs text-gray-600 text-center">Mobile Money</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>Instant plan activation</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>Secure payment with Paystack</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>Cancel anytime, no commitment</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>Automatic renewal (can be disabled)</span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handleInitiatePayment}
          disabled={loading || processing || !amount}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay {formatAmount(amount, 'GHS')} Securely</span>
            </>
          )}
        </button>

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={processing}
            className="w-full mt-3 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}

        {/* Security Notice */}
        <div className="mt-6 flex items-start space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Secure Payment Processing</p>
            <p className="text-xs text-blue-800">
              Your payment is processed securely by Paystack, Africa's leading payment gateway.
              We never store your card details. All transactions are encrypted and PCI DSS compliant.
            </p>
          </div>
        </div>

        {/* Paystack Logo */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-gray-500">
          <span className="text-xs">Powered by</span>
          <span className="text-sm font-bold text-gray-700">Paystack</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaystackPayment;

