/**
 * Paystack Payment Service
 * Handles all Paystack payment operations
 */

// Get Paystack configuration
export const getPaystackConfig = () => {
  const isTestMode = process.env.REACT_APP_PAYMENT_MODE !== 'live';
  const publicKey = isTestMode
    ? process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_TEST || 'pk_test_xxxxx'
    : process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE || 'pk_live_xxxxx';

  return { publicKey, isTestMode };
};

// Initialize Paystack payment configuration
export const initializePayment = (amount, email, metadata = {}) => {
  const { publicKey } = getPaystackConfig();
  
  const config = {
    reference: `PS-${new Date().getTime().toString()}`,
    email,
    amount: Math.round(amount * 100), // Convert to kobo/pesewas (smallest currency unit)
    publicKey,
    currency: 'GHS', // Ghana Cedis
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
      custom_fields: [
        {
          display_name: 'Customer Email',
          variable_name: 'customer_email',
          value: email
        },
        ...(metadata.custom_fields || [])
      ]
    },
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'], // All available channels
  };

  return config;
};

// Verify payment on backend (call from Edge Function)
export const verifyPaymentReference = async (reference, secretKey) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Verification request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

// Get transaction details
export const getTransactionDetails = async (transactionId, secretKey) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting transaction:', error);
    throw error;
  }
};

// Get plan pricing in GHS
export const getPlanPricing = () => {
  return {
    free: {
      monthly: 0,
      yearly: 0
    },
    pro: {
      monthly: 600,      // GHS 600/month
      yearly: 6000,      // GHS 6000/year (2 months free)
      monthly_usd: 49.99,
      yearly_usd: 499.99
    },
    enterprise: {
      monthly: 1800,     // GHS 1800/month
      yearly: 18000,     // GHS 18000/year (2 months free)
      monthly_usd: 149.99,
      yearly_usd: 1499.99
    }
  };
};

// Calculate total with discounts
export const calculateTotal = (planId, billingCycle, promoCode = null) => {
  const pricing = getPlanPricing();
  let amount = pricing[planId]?.[billingCycle] || 0;

  // Apply promo code if any
  if (promoCode) {
    const promoCodes = {
      'SAVE20': { type: 'percentage', value: 20 },
      'WELCOME10': { type: 'percentage', value: 10 },
      'STUDENT50': { type: 'percentage', value: 50 }
    };

    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      if (promo.type === 'percentage') {
        amount = amount * (1 - promo.value / 100);
      } else if (promo.type === 'fixed') {
        amount = Math.max(0, amount - promo.value);
      }
    }
  }

  return Math.round(amount * 100) / 100;
};

// Format amount for display
export const formatAmount = (amount, currency = 'GHS') => {
  const symbols = {
    'GHS': '₵',
    'NGN': '₦',
    'USD': '$',
    'ZAR': 'R',
    'KES': 'KSh'
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

export default {
  getPaystackConfig,
  initializePayment,
  verifyPaymentReference,
  getTransactionDetails,
  getPlanPricing,
  calculateTotal,
  formatAmount
};

