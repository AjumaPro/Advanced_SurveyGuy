# Paystack Environment Setup

## Issue
The payment form is not redirecting to the payment page because the Paystack environment variables are not configured.

## Solution
Create a `.env.local` file in the `client` directory with the following content:

```bash
# Paystack Configuration
REACT_APP_PAYSTACK_PUBLIC_KEY_TEST=pk_test_49027c3c3accfd7fa0ae698fae14f8d30ee7699b
REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE=pk_live_0ddbef13c9be38d3035e5f0425529fa1c0887d50
REACT_APP_PAYMENT_MODE=test
```

## Steps to Fix

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Create the .env.local file:**
   ```bash
   touch .env.local
   ```

3. **Add the environment variables:**
   Copy the content above into the `.env.local` file

4. **Restart the development server:**
   ```bash
   npm start
   ```

## What This Fixes

- ✅ Enables Paystack payment redirects
- ✅ Provides proper API keys for payment processing
- ✅ Sets test mode for safe testing
- ✅ Allows payment forms to redirect to Paystack's secure payment page

## Testing

After setting up the environment variables:

1. Go to a payment form
2. Fill out the form with an amount > 0
3. Click "Submit Form"
4. Click "Pay Now" in the payment modal
5. You should be redirected to Paystack's payment page

## Debugging

If the payment still doesn't redirect:

1. Check the browser console for any error messages
2. Verify the `.env.local` file is in the correct location (`client/.env.local`)
3. Make sure the development server was restarted after adding the environment variables
4. Check that the Paystack keys are valid and active

## Production Setup

For production deployment, set these environment variables in your hosting platform:

- `REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE` (use live keys)
- `REACT_APP_PAYMENT_MODE=live`
