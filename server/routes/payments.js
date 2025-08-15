const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');
const axios = require('axios'); // Added axios for Paystack API calls

// GET /api/payments - Get payment history for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM payment_intents 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Paystack configuration
const PAYSTACK_CONFIG = {
  secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_paystack_secret_key',
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key',
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || 'your_webhook_secret',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.paystack.co' 
    : 'https://api.paystack.co'
};

// Currency configuration with GH¢ as default
const CURRENCIES = {
  GHS: {
    symbol: 'GH¢',
    name: 'Ghanaian Cedi',
    exchangeRate: 1,
    decimalPlaces: 2
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 0.12, // 1 GHS = 0.12 USD (approximate)
    decimalPlaces: 2
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    exchangeRate: 0.11, // 1 GHS = 0.11 EUR (approximate)
    decimalPlaces: 2
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    exchangeRate: 0.095, // 1 GHS = 0.095 GBP (approximate)
    decimalPlaces: 2
  },
  NGN: {
    symbol: '₦',
    name: 'Nigerian Naira',
    exchangeRate: 150, // 1 GHS = 150 NGN (approximate)
    decimalPlaces: 2
  },
  KES: {
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    exchangeRate: 18, // 1 GHS = 18 KES (approximate)
    decimalPlaces: 2
  },
  ZAR: {
    symbol: 'R',
    name: 'South African Rand',
    exchangeRate: 2.2, // 1 GHS = 2.2 ZAR (approximate)
    decimalPlaces: 2
  }
};

// Mock payment processing (replace with actual Paystack integration)
const processPayment = async (amount, currency = 'GHS') => {
  // Simulate payment processing
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency
  };
};

// Verify payment with Paystack
const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(`${PAYSTACK_CONFIG.baseUrl}/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status && response.data.data.status === 'success') {
      return {
        success: true,
        data: response.data.data,
        amount: response.data.data.amount / 100, // Convert from kobo to naira
        currency: response.data.data.currency,
        reference: response.data.data.reference,
        transactionId: response.data.data.id
      };
    } else {
      return {
        success: false,
        message: 'Payment verification failed',
        data: response.data
      };
    }
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to verify payment with Paystack',
      error: error.response?.data || error.message
    };
  }
};

// POST /api/payments/create-payment-intent - Create payment intent for Paystack
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { planId, planName, amount, currency = 'GHS' } = req.body;
    const userId = req.user.id;

    // Validate currency
    if (!CURRENCIES[currency]) {
      return res.status(400).json({ error: 'Unsupported currency' });
    }

    // Generate unique reference
    const reference = `SURVEY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store payment intent in database
    await query(
      `INSERT INTO payment_intents (user_id, plan_id, plan_name, amount, currency, reference, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [userId, planId, planName, amount, currency, reference]
    );

    res.json({
      success: true,
      reference,
      amount: amount * 100, // Paystack expects amount in smallest currency unit
      currency,
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key'
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// POST /api/payments/verify-payment - Verify payment with Paystack
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { reference } = req.body;
    
    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment reference is required' 
      });
    }

    // Verify payment with Paystack
    const verificationResult = await verifyPayment(reference);
    
    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
        error: verificationResult.error
      });
    }

    // Update payment intent status
    const updateQuery = `
      UPDATE payment_intents 
      SET status = 'completed', 
          updated_at = CURRENT_TIMESTAMP,
          payment_transaction_id = $1
      WHERE reference = $2 
      RETURNING *
    `;
    
    const updatedPayment = await query(updateQuery, [
      verificationResult.transactionId,
      reference
    ]);

    if (updatedPayment.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment intent not found'
      });
    }

    // Create subscription if payment is successful
    const paymentIntent = updatedPayment.rows[0];
    
    const subscriptionQuery = `
      INSERT INTO payment_subscriptions (
        user_id, plan_id, plan_name, amount, currency, 
        payment_transaction_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active')
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        plan_id = EXCLUDED.plan_id,
        plan_name = EXCLUDED.plan_name,
        amount = EXCLUDED.amount,
        currency = EXCLUDED.currency,
        payment_transaction_id = EXCLUDED.payment_transaction_id,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const subscription = await query(subscriptionQuery, [
      paymentIntent.user_id,
      paymentIntent.plan_id,
      paymentIntent.plan_name,
      paymentIntent.amount,
      paymentIntent.currency,
      paymentIntent.payment_transaction_id
    ]);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment: paymentIntent,
        subscription: subscription.rows[0],
        verification: verificationResult.data
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// GET /api/payments/billing-history - Get user's billing history
router.get('/billing-history', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
         pi.id,
         pi.plan_name as description,
         pi.amount,
         pi.currency,
         pi.status,
         pi.created_at as date,
         pi.reference
       FROM payment_intents pi
       WHERE pi.user_id = $1
       ORDER BY pi.created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json({
      history: result.rows.map(row => ({
        id: row.id,
        description: row.description,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
        date: row.date,
        reference: row.reference
      }))
    });

  } catch (error) {
    console.error('Error fetching billing history:', error);
    res.status(500).json({ error: 'Failed to fetch billing history' });
  }
});

// GET /api/payments/invoice/:id - Download invoice
router.get('/invoice/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get payment details
    const result = await query(
      `SELECT pi.*, u.name as user_name, u.email
       FROM payment_intents pi
       JOIN users u ON pi.user_id = u.id
       WHERE pi.id = $1 AND pi.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const payment = result.rows[0];

    // Generate simple invoice HTML (in production, use a proper PDF library)
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${payment.reference}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .invoice-details { margin-bottom: 30px; }
          .items { margin-bottom: 30px; }
          .total { font-size: 18px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SurveyGuy Invoice</h1>
          <p>${payment.reference}</p>
        </div>
        
        <div class="invoice-details">
          <p><strong>Date:</strong> ${new Date(payment.created_at).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${payment.user_name} (${payment.email})</p>
        </div>
        
        <div class="items">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${payment.plan_name} Plan</td>
                <td>${payment.amount} ${payment.currency}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="total">
          <p>Total: ${payment.amount} ${payment.currency}</p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p>Thank you for choosing SurveyGuy!</p>
        </div>
      </body>
      </html>
    `;

    // Set headers for HTML download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${payment.reference}.html"`);
    res.send(invoiceHtml);

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

// POST /api/payments/webhook - Paystack webhook handler
router.post('/webhook', async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || 'your_secret_key')
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;

    if (event === 'charge.success') {
      // Payment successful
      const { reference, amount, currency } = data;
      
      // Update payment intent status
      await query(
        `UPDATE payment_intents SET status = 'completed' WHERE reference = $1`,
        [reference]
      );

      // Get payment intent details
      const result = await query(
        `SELECT * FROM payment_intents WHERE reference = $1`,
        [reference]
      );

      if (result.rows.length > 0) {
        const paymentIntent = result.rows[0];
        
        // Create subscription
        await query(
          `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, currency, status, payment_transaction_id)
           VALUES ($1, $2, $3, $4, $5, 'active', $6)`,
          [paymentIntent.user_id, paymentIntent.plan_id, paymentIntent.plan_name, paymentIntent.amount, paymentIntent.currency, reference]
        );

        // Update user subscription
        await query(
          `UPDATE users SET subscription_plan = $1, subscription_status = 'active' WHERE id = $2`,
          [paymentIntent.plan_id, paymentIntent.user_id]
        );
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// POST /api/payments/create-subscription - Create subscription directly
router.post('/create-subscription', auth, async (req, res) => {
  try {
    const { planId, planName, amount, interval = 'monthly', currency = 'GHS' } = req.body;
    const userId = req.user.id;

    // Validate plan
    const validPlans = {
      'pro': { name: 'Pro', price: 50, features: ['unlimited_surveys', 'advanced_analytics'] },
      'business': { name: 'Business', price: 150, features: ['team_collaboration', 'api_access'] },
      'enterprise': { name: 'Enterprise', price: 500, features: ['custom_development', 'dedicated_support'] }
    };

    if (!validPlans[planId]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Validate currency
    if (!CURRENCIES[currency]) {
      return res.status(400).json({ error: 'Unsupported currency' });
    }

    // Process payment
    const payment = await processPayment(amount, currency);

    if (!payment.success) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // Create subscription record
    const subscriptionResult = await query(
      `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, currency, interval, status, payment_transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, planId, planName, amount, currency, interval, 'active', payment.transactionId]
    );

    // Update user's subscription status
    await query(
      `UPDATE users SET subscription_plan = $1, subscription_status = $2 WHERE id = $3`,
      [planId, 'active', userId]
    );

    res.json({
      success: true,
      subscription: subscriptionResult.rows[0],
      message: 'Subscription created successfully'
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// POST /api/payments/cancel-subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Update subscription status
    await query(
      `UPDATE payment_subscriptions SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    // Update user's subscription status
    await query(
      `UPDATE users SET subscription_plan = 'free', subscription_status = 'cancelled' WHERE id = $1`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// GET /api/payments/subscription-status
router.get('/subscription-status', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT ps.*, u.subscription_plan, u.subscription_status
       FROM payment_subscriptions ps
       LEFT JOIN users u ON ps.user_id = u.id
       WHERE ps.user_id = $1
       ORDER BY ps.created_at DESC
       LIMIT 1`,
      [userId]
    );

    res.json({
      subscription: result.rows[0] || null
    });

  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// GET /api/payments/pending-payments - Get user's pending payments
router.get('/pending-payments', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
         pi.id,
         pi.plan_id,
         pi.plan_name,
         pi.amount,
         pi.currency,
         pi.reference,
         pi.status,
         pi.created_at,
         pi.updated_at
       FROM payment_intents pi
       WHERE pi.user_id = $1 AND pi.status = 'pending'
       ORDER BY pi.created_at DESC`,
      [userId]
    );

    res.json({
      pendingPayments: result.rows
    });

  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
});

// POST /api/payments/continue-payment - Continue a pending payment
router.post('/continue-payment', auth, async (req, res) => {
  try {
    const { reference } = req.body;
    const userId = req.user.id;

    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment reference is required' 
      });
    }

    // Get the pending payment
    const paymentResult = await query(
      `SELECT * FROM payment_intents 
       WHERE reference = $1 AND user_id = $2 AND status = 'pending'`,
      [reference, userId]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pending payment not found'
      });
    }

    const payment = paymentResult.rows[0];

    // Return payment details for frontend to continue
    res.json({
      success: true,
      payment: {
        id: payment.id,
        planId: payment.plan_id,
        planName: payment.plan_name,
        amount: payment.amount,
        currency: payment.currency,
        reference: payment.reference
      },
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key'
    });

  } catch (error) {
    console.error('Error continuing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to continue payment',
      error: error.message
    });
  }
});

// POST /api/payments/cancel-pending-payment - Cancel a pending payment
router.post('/cancel-pending-payment', auth, async (req, res) => {
  try {
    const { reference } = req.body;
    const userId = req.user.id;

    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment reference is required' 
      });
    }

    // Update payment status to cancelled
    const result = await query(
      `UPDATE payment_intents 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE reference = $1 AND user_id = $2 AND status = 'pending'
       RETURNING *`,
      [reference, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pending payment not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel payment',
      error: error.message
    });
  }
});

// DELETE /api/payments/clear-history - Clear all payment history for user
router.delete('/clear-history', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Clear all payment intents for the user (except active subscriptions)
    const result = await query(
      `DELETE FROM payment_intents 
       WHERE user_id = $1 AND status IN ('completed', 'cancelled', 'failed')`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Payment history cleared successfully',
      deletedCount: result.rowCount
    });

  } catch (error) {
    console.error('Error clearing payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear payment history',
      error: error.message
    });
  }
});

// DELETE /api/payments/clear-history-selective - Clear specific payment history entries
router.delete('/clear-history-selective', auth, async (req, res) => {
  try {
    const { paymentIds } = req.body;
    const userId = req.user.id;

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment IDs array is required'
      });
    }

    // Clear specific payment intents for the user
    const result = await query(
      `DELETE FROM payment_intents 
       WHERE id = ANY($1) AND user_id = $2 AND status IN ('completed', 'cancelled', 'failed')`,
      [paymentIds, userId]
    );

    res.json({
      success: true,
      message: 'Selected payment history cleared successfully',
      deletedCount: result.rowCount
    });

  } catch (error) {
    console.error('Error clearing selective payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear selected payment history',
      error: error.message
    });
  }
});

module.exports = router; 