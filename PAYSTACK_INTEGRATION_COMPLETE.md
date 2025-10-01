# Paystack Payment Integration - Complete Implementation

## 🎯 Current Status: ⚠️ NOT IMPLEMENTED

The application currently has:
- ❌ No Paystack integration
- ❌ Mock payment flows only
- ❌ References to Stripe (not Paystack)
- ⚠️ Payment forms that don't actually process payments

---

## 🚨 Critical Issues Found

### Issue #1: No Payment Processor Configured
**Location:** `client/src/pages/Billing.js` (Lines 85-92)

```javascript
// Regular users go through payment process
toast.success(`Initiating upgrade to ${planType} plan...`);

// In a real implementation, this would:
// 1. Create a checkout session with your payment processor
// 2. Redirect to payment page
// 3. Handle successful payment callback
// 4. Update user's plan in database

// For now, simulate the upgrade process  // ❌ SIMULATION ONLY
```

**Impact:** 🔴 **CRITICAL** - Users cannot actually pay!

---

### Issue #2: Payment Components Reference Stripe
**Location:** `client/src/components/PaymentIntegration.js` (Line 129)

```javascript
<p className="text-sm text-slate-600">
  Accept payments with your surveys using Stripe  // ❌ Wrong provider
</p>
```

**Impact:** 🟡 **MEDIUM** - Misleading users

---

### Issue #3: No Payment Tables Configured for Paystack
**Location:** Database schema

Current tables reference Stripe:
- `stripe_payment_method_id`
- `stripe_invoice_id`

**Impact:** 🟡 **MEDIUM** - Database not ready for Paystack

---

## ✅ Complete Paystack Implementation

### Step 1: Install Paystack React Library

```bash
cd client
npm install react-paystack
```

---

### Step 2: Add Paystack Environment Variables

Update `env.example`:

```bash
# ==================
# PAYSTACK PAYMENT
# ==================
REACT_APP_PAYSTACK_PUBLIC_KEY_TEST=pk_test_xxxxxxxxxxxxx
REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE=pk_live_xxxxxxxxxxxxx
REACT_APP_PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
REACT_APP_PAYMENT_MODE=test  # test or live
```

Create `.env.local` in client folder:

```bash
REACT_APP_PAYSTACK_PUBLIC_KEY_TEST=your_test_public_key
REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE=your_live_public_key  
REACT_APP_PAYMENT_MODE=test
```

---

### Step 3: Create Paystack Service

**File:** `client/src/services/paystackService.js` (NEW)

```javascript
import { usePaystackPayment } from 'react-paystack';

// Paystack configuration
export const getPaystackConfig = () => {
  const isTestMode = process.env.REACT_APP_PAYMENT_MODE === 'test';
  const publicKey = isTestMode
    ? process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_TEST
    : process.env.REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE;

  return { publicKey, isTestMode };
};

// Initialize Paystack payment
export const initializePayment = (amount, email, metadata = {}) => {
  const { publicKey } = getPaystackConfig();
  
  return {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo (Nigerian currency smallest unit)
    publicKey,
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: 'Customer Email',
          variable_name: 'customer_email',
          value: email
        }
      ]
    }
  };
};

// Verify payment on backend
export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ reference })
    });

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

export default {
  getPaystackConfig,
  initializePayment,
  verifyPayment
};
```

---

### Step 4: Create Paystack Payment Component

**File:** `client/src/components/PaystackPayment.js` (NEW)

```javascript
import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { initializePayment } from '../services/paystackService';

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

  // Calculate amount based on plan and billing cycle
  const planPrices = {
    pro: {
      monthly: 49.99,
      yearly: 499.99,
      monthly_ghs: 600,    // GHS pricing
      yearly_ghs: 6000
    },
    enterprise: {
      monthly: 149.99,
      yearly: 1499.99,
      monthly_ghs: 1800,   // GHS pricing
      yearly_ghs: 18000
    }
  };

  const amount = planPrices[plan]?.[`${billingCycle}_ghs`] || planPrices[plan]?.[billingCycle] || 0;

  // Initialize Paystack payment
  const config = initializePayment(amount, userEmail, {
    plan_id: plan,
    billing_cycle: billingCycle,
    user_id: userId
  });

  const initializePaystack = usePaystackPayment(config);

  const handlePaymentSuccess = async (reference) => {
    setProcessing(true);
    
    try {
      console.log('Payment successful:', reference);

      // Verify payment on backend
      const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
        body: { reference: reference.reference }
      });

      if (error) {
        throw new Error('Payment verification failed');
      }

      // Update user's plan in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan: plan,
          subscription_end_date: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Record transaction
      await supabase.from('subscription_history').insert({
        user_id: userId,
        plan_id: plan,
        amount: amount,
        currency: 'GHS',
        billing_cycle: billingCycle,
        payment_method: 'paystack',
        payment_reference: reference.reference,
        status: 'completed'
      });

      toast.success('Payment successful! Your plan has been upgraded.');
      
      if (onSuccess) {
        onSuccess(reference);
      }

      // Reload to update UI
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment verification failed. Please contact support.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    console.log('Payment window closed');
    toast.info('Payment cancelled');
    if (onCancel) {
      onCancel();
    }
  };

  const handleInitiatePayment = () => {
    setLoading(true);
    try {
      initializePaystack({
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Payment Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Payment Summary</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Secure Payment</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Plan:</span>
            <span className="font-semibold text-gray-900 capitalize">{plan}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Billing Cycle:</span>
            <span className="font-semibold text-gray-900 capitalize">{billingCycle}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-700 font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">GHS {amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Paystack Secure Checkout</p>
            <p className="text-sm text-gray-600">Pay with card, bank transfer, or mobile money</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Instant plan activation</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Secure payment processing</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Cancel anytime</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handleInitiatePayment}
        disabled={loading || processing}
        className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
            <span>Pay GHS {amount.toFixed(2)} Securely</span>
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-800">
          Your payment is processed securely by Paystack. We never store your card details.
          Powered by Paystack - Africa's leading payment gateway.
        </p>
      </div>
    </div>
  );
};

export default PaystackPayment;
```

---

### Step 5: Create Backend Payment Verification

**File:** `supabase/functions/verify-paystack-payment/index.ts` (NEW)

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()

    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Payment reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify payment with Paystack
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Payment system not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!verifyResponse.ok) {
      throw new Error('Payment verification failed')
    }

    const verificationData = await verifyResponse.json()

    if (verificationData.status === true && verificationData.data.status === 'success') {
      // Payment is valid
      const transaction = verificationData.data

      // Initialize Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Get user from metadata
      const userId = transaction.metadata?.user_id

      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Invalid payment metadata' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update user plan
      const subscriptionEndDate = new Date()
      if (transaction.metadata?.billing_cycle === 'yearly') {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1)
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1)
      }

      await supabase
        .from('profiles')
        .update({
          plan: transaction.metadata?.plan_id,
          subscription_end_date: subscriptionEndDate.toISOString()
        })
        .eq('id', userId)

      // Record payment in subscription_history
      await supabase
        .from('subscription_history')
        .insert({
          user_id: userId,
          plan_id: transaction.metadata?.plan_id,
          amount: transaction.amount / 100, // Convert back from kobo
          currency: transaction.currency,
          billing_cycle: transaction.metadata?.billing_cycle || 'monthly',
          payment_method: 'paystack',
          payment_reference: reference,
          paystack_transaction_id: transaction.id,
          status: 'completed',
          metadata: {
            customer: transaction.customer,
            authorization: transaction.authorization,
            channel: transaction.channel
          }
        })

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment verified successfully',
          transaction: {
            reference: transaction.reference,
            amount: transaction.amount / 100,
            currency: transaction.currency,
            status: transaction.status
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment verification failed',
          status: verificationData.data?.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({
        error: 'Payment verification failed',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

### Step 6: Update Database Tables for Paystack

**File:** `UPDATE_PAYMENT_TABLES_FOR_PAYSTACK.sql` (NEW)

```sql
-- =============================================
-- UPDATE PAYMENT TABLES FOR PAYSTACK
-- =============================================

-- Add Paystack-specific columns to subscription_history
ALTER TABLE subscription_history 
ADD COLUMN IF NOT EXISTS paystack_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT,
ADD COLUMN IF NOT EXISTS payment_channel TEXT; -- card, bank, ussd, qr, mobile_money

-- Add Paystack columns to payment_methods
ALTER TABLE payment_methods
ADD COLUMN IF NOT EXISTS paystack_authorization_code TEXT,
ADD COLUMN IF NOT EXISTS paystack_card_type TEXT,
ADD COLUMN IF NOT EXISTS paystack_bank TEXT,
ADD COLUMN IF NOT EXISTS paystack_country_code TEXT;

-- Rename Stripe columns to be provider-agnostic
ALTER TABLE subscription_history RENAME COLUMN stripe_invoice_id TO payment_provider_id;
ALTER TABLE payment_methods RENAME COLUMN stripe_payment_method_id TO provider_payment_id;

-- Add provider column
ALTER TABLE subscription_history ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'paystack';
ALTER TABLE payment_methods ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'paystack';

-- Create index for Paystack lookups
CREATE INDEX IF NOT EXISTS idx_subscription_paystack_tx ON subscription_history(paystack_transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_provider ON payment_methods(provider, provider_payment_id);

-- Success
SELECT 'Payment tables updated for Paystack!' as status;
```

---

### Step 7: Update Billing Page to Use Paystack

Update `client/src/pages/Billing.js`:

```javascript
import PaystackPayment from '../components/PaystackPayment';

// In handleUpgrade function (line 81-92):
} else {
  // Regular users go through Paystack payment
  setCurrentStep('payment');
  setSelectedPlanForUpgrade({ plan: planType, cycle: 'monthly' });
}

// Add state for payment modal
const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);

// Add payment modal in JSX
{selectedPlanForUpgrade && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-md w-full p-6">
      <PaystackPayment
        plan={selectedPlanForUpgrade.plan}
        billingCycle={selectedPlanForUpgrade.cycle}
        userEmail={user.email}
        userId={user.id}
        onSuccess={() => {
          setSelectedPlanForUpgrade(null);
          fetchBillingData();
        }}
        onCancel={() => setSelectedPlanForUpgrade(null)}
      />
    </div>
  </div>
)}
```

---

## 📊 Paystack Features

### Supported Payment Methods:
✅ **Cards:** Visa, Mastercard, Verve  
✅ **Bank Transfer:** Direct bank transfer  
✅ **USSD:** Mobile banking codes  
✅ **QR Code:** Scan to pay  
✅ **Mobile Money:** MTN, Vodafone, AirtelTigo  

### Currencies Supported:
✅ GHS (Ghana Cedis)  
✅ NGN (Nigerian Naira)  
✅ ZAR (South African Rand)  
✅ USD (US Dollars)  
✅ KES (Kenyan Shillings)  

---

## 💰 Pricing

### Paystack Fees:
- **Local Cards (Ghana):** 1.95% capped at GHS 10
- **International Cards:** 3.9% + GHS 0.50
- **Bank Transfer:** GHS 1 flat fee
- **Mobile Money:** 1.5%

### Example Transaction:
- Plan: Pro Monthly (GHS 600)
- Fee: GHS 10 (1.95% capped)
- **Customer Pays:** GHS 600
- **You Receive:** GHS 590

---

## 🧪 Testing

### Step 1: Get Test API Keys

1. Go to https://dashboard.paystack.com
2. Sign up / Log in
3. Go to Settings → API Keys & Webhooks
4. Copy **Test Public Key** and **Test Secret Key**

### Step 2: Use Test Cards

```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

### Step 3: Test Payment Flow

1. Go to `/app/billing`
2. Click "Upgrade to Pro"
3. Paystack popup should appear
4. Use test card
5. Complete payment
6. Verify plan updates

---

## 🚀 Going Live

### Checklist:

- [ ] Create Paystack account
- [ ] Complete KYC verification
- [ ] Get live API keys
- [ ] Update environment variables
- [ ] Set `REACT_APP_PAYMENT_MODE=live`
- [ ] Test with real card (small amount)
- [ ] Setup webhook endpoint
- [ ] Monitor dashboard
- [ ] Enable auto-renewal

---

## 🔐 Security

### Best Practices:
✅ Never expose secret key in frontend  
✅ Verify all payments on backend  
✅ Use HTTPS only  
✅ Implement webhooks for automatic updates  
✅ Store minimal card info  
✅ Comply with PCI DSS  

---

## 📞 Support

**Paystack Support:**
- Email: support@paystack.com
- Phone: +234 1 888 2800
- Docs: https://paystack.com/docs

**Your Support:**
- Email: infoajumapro@gmail.com
- Phone: +233 24 973 9599

---

## 📝 Files to Create

```
✅ client/src/services/paystackService.js
✅ client/src/components/PaystackPayment.js
✅ supabase/functions/verify-paystack-payment/index.ts
✅ UPDATE_PAYMENT_TABLES_FOR_PAYSTACK.sql
```

---

**Status:** Ready to Implement  
**Time to Deploy:** 1-2 hours  
**Complexity:** Medium

