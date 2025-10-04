# Supabase Secret Setup for Paystack

## 🎯 Goal
Configure the `PAYSTACK_SECRET_KEY` secret in Supabase so the payment verification Edge Function can work.

## 📋 Step-by-Step Instructions

### Step 1: Access Supabase Dashboard
1. **Go to**: https://supabase.com/dashboard
2. **Sign in** to your account
3. **Select your project**: `waasqqbklnhfrbzfuvzn`

### Step 2: Navigate to Edge Functions Settings
1. **Click "Settings"** in the left sidebar
2. **Click "Edge Functions"**
3. **Click the "Secrets" tab**

### Step 3: Add Paystack Secret
1. **Click "Add new secret"**
2. **Name**: `PAYSTACK_SECRET_KEY`
3. **Value**: Your Paystack secret key (from your Paystack dashboard)
   - Test key: `sk_test_xxxxxxxxxxxxx`
   - Live key: `sk_live_xxxxxxxxxxxxx`
4. **Click "Save"**

### Step 4: Verify Setup
You should see `PAYSTACK_SECRET_KEY` in the secrets list.

## 🔍 How to Find Your Paystack Secret Key

1. **Go to**: https://dashboard.paystack.com/#/settings/developers
2. **Copy the "Secret Key"** (not the Public Key)
3. **It should look like**: `sk_test_xxxxxxxxxxxxx` or `sk_live_xxxxxxxxxxxxx`

## ✅ What This Enables

Once configured, the payment verification will work:
1. User makes payment → Paystack processes it
2. Payment succeeds → Edge Function verifies with Paystack
3. Verification succeeds → User profile updated in database
4. User gets access to premium features

## 🧪 Test After Setup

1. **Restart your dev server**: `npm start`
2. **Go to**: http://localhost:3000/app/subscriptions
3. **Try upgrading** to a paid plan
4. **Payment should work** end-to-end

## 🚨 Important Notes

- **Never share** your secret key publicly
- **Use test keys** for development
- **Use live keys** only for production
- **The secret key** is different from the public key

## 📞 Need Help?

If you can't find the Edge Functions settings:
1. Make sure you're in the correct Supabase project
2. Check that you have admin access to the project
3. Try refreshing the dashboard page
