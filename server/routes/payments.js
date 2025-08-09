const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Mock payment processing (replace with actual Paystack integration)
const processPayment = async (amount, currency = 'ngn') => {
  // Simulate payment processing
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency
  };
};

// POST /api/payments/create-payment-intent - Create payment intent for Paystack
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { planId, planName, amount, currency = 'NGN' } = req.body;
    const userId = req.user.id;

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
      amount: amount * 100, // Paystack expects amount in kobo
      currency,
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key'
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// POST /api/payments/verify-payment - Verify Paystack payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { reference, planId, planName, amount } = req.body;
    const userId = req.user.id;

    // In production, verify with Paystack API
    // const paystackResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
    //   headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    // });

    // For now, simulate successful verification
    const paymentVerified = true; // Replace with actual Paystack verification

    if (paymentVerified) {
      // Update payment intent status
      await query(
        `UPDATE payment_intents SET status = 'completed' WHERE reference = $1`,
        [reference]
      );

      // Create subscription
      await query(
        `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, status, payment_transaction_id)
         VALUES ($1, $2, $3, $4, 'active', $5)`,
        [userId, planId, planName, amount, reference]
      );

      // Update user subscription
      await query(
        `UPDATE users SET subscription_plan = $1, subscription_status = 'active' WHERE id = $2`,
        [planId, userId]
      );

      res.json({ success: true, message: 'Payment verified and subscription created' });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
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

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, amount, customer } = event.data;

      // Update payment intent
      await query(
        `UPDATE payment_intents SET status = 'completed' WHERE reference = $1`,
        [reference]
      );

      // Get payment intent details
      const paymentIntent = await query(
        `SELECT * FROM payment_intents WHERE reference = $1`,
        [reference]
      );

      if (paymentIntent.rows[0]) {
        const { user_id, plan_id, plan_name } = paymentIntent.rows[0];

        // Create subscription
        await query(
          `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, status, payment_transaction_id)
           VALUES ($1, $2, $3, $4, 'active', $5)`,
          [user_id, plan_id, plan_name, amount / 100, reference]
        );

        // Update user subscription
        await query(
          `UPDATE users SET subscription_plan = $1, subscription_status = 'active' WHERE id = $2`,
          [plan_id, user_id]
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// POST /api/payments/create-subscription
router.post('/create-subscription', auth, async (req, res) => {
  try {
    const { planId, planName, amount, interval } = req.body;
    const userId = req.user.id;

    // Validate plan
    const validPlans = {
      'pro': { name: 'Pro', price: 19, features: ['unlimited_surveys', 'advanced_analytics'] },
      'business': { name: 'Business', price: 49, features: ['team_collaboration', 'api_access'] },
      'enterprise': { name: 'Enterprise', price: 199, features: ['custom_development', 'dedicated_support'] }
    };

    if (!validPlans[planId]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Process payment
    const payment = await processPayment(amount);

    if (!payment.success) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // Create subscription record
    const subscriptionResult = await query(
      `INSERT INTO subscriptions (user_id, plan_id, plan_name, amount, interval, status, payment_transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, planId, planName, amount, interval, 'active', payment.transactionId]
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
      `UPDATE subscriptions SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    // Update user's subscription status
    await query(
      `UPDATE users SET subscription_plan = 'free', subscription_status = 'cancelled' WHERE id = $3`,
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

module.exports = router; 