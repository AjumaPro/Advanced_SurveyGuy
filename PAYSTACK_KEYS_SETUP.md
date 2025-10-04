# Paystack API Keys Setup Guide

## 🚨 ISSUE IDENTIFIED
The subscriptions page doesn't connect to Paystack because the API keys are set to placeholder values.

## 🔧 IMMEDIATE FIX REQUIRED

### Step 1: Get Your Paystack API Keys
1. **Go to**: https://dashboard.paystack.com/#/settings/developers
2. **Copy your Test Keys**:
   - Public Key: `pk_test_xxxxxxxxxxxxx`
   - Secret Key: `sk_test_xxxxxxxxxxxxx`

### Step 2: Update Environment File
Edit `/Users/newuser/Desktop/Advanced_SurveyGuy/client/.env.local`:

```bash
# Paystack Configuration for SurveyGuy
# Get your API keys from: https://dashboard.paystack.com/#/settings/developers

# Paystack Test Keys (REPLACE WITH YOUR ACTUAL KEYS)
REACT_APP_PAYSTACK_PUBLIC_KEY_TEST=pk_test_YOUR_ACTUAL_TEST_KEY_HERE
REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE=pk_live_YOUR_ACTUAL_LIVE_KEY_HERE
REACT_APP_PAYMENT_MODE=test

# Supabase Configuration (already configured)
REACT_APP_SUPABASE_URL=https://waasqqbklnhfrbzfuvzn.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXNxcWJrbG5oZnJiemZ1dnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjQ5ODcsImV4cCI6MjA3MzgwMDk4N30.W0CHR_5kQi6JL7p5qJ2hrHkqme0QWEsxSS4zIlzqv7Q

# Application Configuration
NODE_ENV=development
REACT_APP_VERSION=1.0.0

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_AI_FEATURES=true
REACT_APP_ENABLE_EVENTS=true

# Contact Information
REACT_APP_SUPPORT_PHONE=+233249739599
REACT_APP_TECHNICAL_PHONE=+233506985503
REACT_APP_LOCATION="Accra, Ghana"
```

### Step 3: Configure Supabase Secret
Add your Paystack secret key to Supabase:

**Option A: Using Supabase CLI**
```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
```

**Option B: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Settings → Edge Functions
3. Add secret: `PAYSTACK_SECRET_KEY` = `sk_test_YOUR_ACTUAL_SECRET_KEY_HERE`

### Step 4: Restart Development Server
```bash
cd /Users/newuser/Desktop/Advanced_SurveyGuy/client
npm start
```

## 🧪 Test Payment Flow
After updating the keys:

1. **Navigate to**: http://localhost:3000/app/subscriptions
2. **Click "Upgrade to Pro"** on any paid plan
3. **Payment modal should open** with Paystack interface
4. **Use test card**: `4084084084084081` (Ghana test card)

## 📋 What's Already Working
- ✅ Payment UI components
- ✅ Payment flow logic
- ✅ Edge function for verification
- ✅ Database integration
- ✅ Error handling

## 🎯 Expected Result
After adding real API keys, the payment flow will work completely:
1. User clicks upgrade → Payment modal opens
2. User enters card details → Paystack processes payment
3. Payment succeeds → User profile updated
4. User gets access to premium features

## 🚨 Current Error
Without real API keys, you'll see:
- Payment modal doesn't open
- Console errors about invalid Paystack configuration
- "Payment system unavailable" messages

**The fix is simple: Replace the placeholder keys with your actual Paystack API keys!**
