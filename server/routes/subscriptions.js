const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const { auth } = require('../middleware/auth');

// GET /api/subscriptions - Get all subscriptions for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM payment_subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// POST /api/subscriptions - Subscribe to a survey
router.post('/', async (req, res) => {
  try {
    const { email, survey_id, preferences = {} } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check if survey exists and is published
    const surveyResult = await query(
      'SELECT id, title FROM surveys WHERE id = $1 AND status = $2',
      [survey_id, 'published']
    );

    if (surveyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Survey not found or not published' });
    }

    // Check if already subscribed
    const existingSubscription = await query(
      'SELECT id FROM subscriptions WHERE email = $1 AND survey_id = $2',
      [email, survey_id]
    );

    if (existingSubscription.rows.length > 0) {
      return res.status(400).json({ error: 'Already subscribed to this survey' });
    }

    // Create subscription
    const subscriptionResult = await query(
      `INSERT INTO subscriptions (email, survey_id, user_id)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [email, survey_id, null] // user_id is null for anonymous subscriptions
    );

    const subscriptionId = subscriptionResult.rows[0].id;

    // Create subscription preferences
    await query(
      `INSERT INTO subscription_preferences (subscription_id, email_notifications, survey_updates, new_surveys)
       VALUES ($1, $2, $3, $4)`,
      [
        subscriptionId,
        preferences.email_notifications !== false,
        preferences.survey_updates !== false,
        preferences.new_surveys || false
      ]
    );

    res.status(201).json({
      message: 'Successfully subscribed to survey',
      subscription_id: subscriptionId,
      survey_title: surveyResult.rows[0].title
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// GET /api/subscriptions/survey/:id - Get survey subscribers
router.get('/survey/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if survey belongs to user
    const surveyCheck = await query(
      'SELECT id FROM surveys WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (surveyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    const subscribersResult = await query(
      `SELECT s.id, s.email, s.status, s.subscribed_at, sp.email_notifications, sp.survey_updates, sp.new_surveys
       FROM subscriptions s
       LEFT JOIN subscription_preferences sp ON s.id = sp.subscription_id
       WHERE s.survey_id = $1
       ORDER BY s.subscribed_at DESC`,
      [id]
    );

    res.json({
      survey_id: id,
      subscribers_count: subscribersResult.rows.length,
      subscribers: subscribersResult.rows
    });

  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// GET /api/subscriptions/user - Get user's subscriptions (if logged in)
router.get('/user', auth, async (req, res) => {
  try {
    const subscriptionsResult = await query(
      `SELECT s.id, s.email, s.survey_id, s.status, s.subscribed_at,
              sp.email_notifications, sp.survey_updates, sp.new_surveys,
              sur.title as survey_title, sur.description as survey_description
       FROM subscriptions s
       LEFT JOIN subscription_preferences sp ON s.id = sp.subscription_id
       LEFT JOIN surveys sur ON s.survey_id = sur.id
       WHERE s.user_id = $1
       ORDER BY s.subscribed_at DESC`,
      [req.user.id]
    );

    res.json({
      subscriptions: subscriptionsResult.rows
    });

  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// PUT /api/subscriptions/:id - Update subscription preferences
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { email_notifications, survey_updates, new_surveys } = req.body;

    // Check if subscription belongs to user
    const subscriptionCheck = await query(
      'SELECT id FROM subscriptions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (subscriptionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update preferences
    await query(
      `UPDATE subscription_preferences 
       SET email_notifications = $1, survey_updates = $2, new_surveys = $3
       WHERE subscription_id = $4`,
      [email_notifications, survey_updates, new_surveys, id]
    );

    res.json({ message: 'Subscription preferences updated successfully' });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// DELETE /api/subscriptions/:id - Unsubscribe
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if subscription belongs to user
    const subscriptionCheck = await query(
      'SELECT id FROM subscriptions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (subscriptionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Delete subscription (cascade will delete preferences)
    await query('DELETE FROM subscriptions WHERE id = $1', [id]);

    res.json({ message: 'Successfully unsubscribed' });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// POST /api/subscriptions/:id/unsubscribe - Unsubscribe by email (anonymous)
router.post('/:id/unsubscribe', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if subscription exists
    const subscriptionCheck = await query(
      'SELECT id FROM subscriptions WHERE id = $1 AND email = $2',
      [id, email]
    );

    if (subscriptionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Delete subscription
    await query('DELETE FROM subscriptions WHERE id = $1', [id]);

    res.json({ message: 'Successfully unsubscribed' });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

module.exports = router; 