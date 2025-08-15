const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');
const { auth, adminAuth } = require('../middleware/auth');

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!hasUpperCase) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }
  return { valid: true };
};

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    await query('BEGIN');

    try {
      // Create user with pending approval (unless it's the first user who becomes admin)
      const userCount = await query('SELECT COUNT(*) FROM users');
      const isFirstUser = parseInt(userCount.rows[0].count) === 0;
      const role = isFirstUser ? 'admin' : 'user';
      // Auto-approve in development mode or if it's the first user
      const isApproved = isFirstUser || process.env.NODE_ENV === 'development';

      // Create user
      const result = await query(
        `INSERT INTO users (email, password_hash, name, role, subscription_plan, subscription_status, is_approved)
         VALUES ($1, $2, $3, $4, 'free', 'active', $5)
         RETURNING id, email, name, role, subscription_plan, subscription_status, is_approved, created_at`,
        [email, passwordHash, name || '', role, isApproved]
      );

      const user = result.rows[0];

      // Create free subscription in payment_subscriptions table
      await query(
        `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, currency, interval, status)
         VALUES ($1, 'free', 'Free Plan', 0.00, 'GHS', 'monthly', 'active')`,
        [user.id]
      );

      // If not auto-approved, create account approval record
      if (!isApproved) {
        await query(
          `INSERT INTO account_approvals (user_id, status)
           VALUES ($1, 'pending')`,
          [user.id]
        );
      }

      // Commit transaction
      await query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const message = isFirstUser 
        ? 'Admin account created successfully with free subscription!' 
        : 'Account created successfully! Pending admin approval.';

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription_plan: user.subscription_plan,
          subscription_status: user.subscription_status,
          is_approved: user.is_approved
        },
        token,
        message
      });

    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await query(
      'SELECT id, email, password_hash, name, role, subscription_plan, subscription_status, is_approved, super_admin FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user account is approved (unless they're an admin, super admin, or in development mode)
    if (user.role !== 'admin' && user.role !== 'super_admin' && !user.is_approved && process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: 'Account pending approval. Please contact support.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription_plan: user.subscription_plan,
        subscription_status: user.subscription_status,
        is_approved: user.is_approved,
        super_admin: user.super_admin
      },
      token
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// POST /api/auth/admin/register - Register a new admin user
router.post('/admin/register', async (req, res) => {
  try {
    const { email, password, name, role, department, permissions, adminKey } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Validate admin key
    if (!adminKey || adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
      return res.status(403).json({ error: 'Invalid admin key. Admin registration requires proper authorization.' });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    await query('BEGIN');

    try {
      // Create admin user
      const result = await query(
        `INSERT INTO users (email, password_hash, name, role, subscription_plan, subscription_status, is_approved)
         VALUES ($1, $2, $3, $4, 'admin', 'active', true)
         RETURNING id, email, name, role, subscription_plan, subscription_status, is_approved, created_at`,
        [email, passwordHash, name, role || 'admin']
      );

      const user = result.rows[0];

      // Create admin subscription
      await query(
        `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, currency, interval, status)
         VALUES ($1, 'admin', 'Admin Plan', 0.00, 'GHS', 'monthly', 'active')`,
        [user.id]
      );

      // Log admin creation
      await query(
        `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
         VALUES ($1, 'admin_created', 'user', $2, $3)`,
        [user.id, user.id, JSON.stringify({ department, permissions })]
      );

      // Commit transaction
      await query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription_plan: user.subscription_plan,
          subscription_status: user.subscription_status,
          is_approved: user.is_approved
        },
        token,
        message: 'Admin account created successfully!'
      });

    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// POST /api/auth/super-admin/register - Register super admin (Francis Sarpaning only)
router.post('/super-admin/register', async (req, res) => {
  try {
    const { email, password, name, superAdminKey } = req.body;

    // Validate required fields
    if (!email || !password || !name || !superAdminKey) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Validate super admin key
    if (superAdminKey !== process.env.SUPER_ADMIN_REGISTRATION_KEY) {
      return res.status(403).json({ error: 'Invalid super admin key' });
    }

    // Check if email already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Start transaction
    await query('BEGIN');

    try {
      // Create super admin user
      const result = await query(
        `INSERT INTO users (email, password_hash, name, role, subscription_plan, subscription_status, is_approved, super_admin)
         VALUES ($1, $2, $3, 'super_admin', 'super_admin', 'active', true, true)
         RETURNING id, email, name, role, subscription_plan, subscription_status, is_approved, super_admin, created_at`,
        [email, passwordHash, name]
      );

      const user = result.rows[0];

      // Create super admin subscription
      await query(
        `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, currency, interval, status)
         VALUES ($1, 'super_admin', 'Super Admin Plan', 0.00, 'GHS', 'monthly', 'active')`,
        [user.id]
      );

      // Log super admin creation
      await query(
        `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
         VALUES ($1, 'super_admin_created', 'user', $2, $3)`,
        [user.id, user.id, JSON.stringify({ created_by: 'Francis Sarpaning' })]
      );

      // Commit transaction
      await query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription_plan: user.subscription_plan,
          subscription_status: user.subscription_status,
          is_approved: user.is_approved,
          super_admin: user.super_admin
        },
        token,
        message: 'Super Admin account created successfully!'
      });

    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error registering super admin:', error);
    res.status(500).json({ error: 'Failed to register super admin' });
  }
});

// POST /api/auth/dev/create-admin - Create admin account for development
router.post('/dev/create-admin', async (req, res) => {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: 'This route is only available in development mode' });
    }

    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    await query('BEGIN');

    try {
      // Create admin user
      const result = await query(
        `INSERT INTO users (email, password_hash, name, role, subscription_plan, subscription_status, is_approved)
         VALUES ($1, $2, $3, 'admin', 'admin', 'active', true)
         RETURNING id, email, name, role, subscription_plan, subscription_status, is_approved, created_at`,
        [email, passwordHash, name]
      );

      const user = result.rows[0];

      // Create admin subscription
      await query(
        `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, currency, interval, status)
         VALUES ($1, 'admin', 'Admin Plan', 0.00, 'GHS', 'monthly', 'active')`,
        [user.id]
      );

      // Commit transaction
      await query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscription_plan: user.subscription_plan,
          subscription_status: user.subscription_status,
          is_approved: user.is_approved
        },
        token,
        message: 'Admin account created successfully for development!'
      });

    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    // Get user with subscription info
    const result = await query(
      'SELECT id, email, name, role, subscription_plan, subscription_status, is_approved, super_admin FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription_plan: user.subscription_plan,
        subscription_status: user.subscription_status,
        is_approved: user.is_approved,
        super_admin: user.super_admin
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// GET /api/auth/profile - Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        id, 
        email, 
        name, 
        role, 
        subscription_plan, 
        subscription_status, 
        is_approved, 
        created_at,
        updated_at
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    // Get subscription details
    const subscriptionResult = await query(
      `SELECT 
        plan_name, 
        amount, 
        currency, 
        interval, 
        status, 
        created_at, 
        updated_at
       FROM payment_subscriptions 
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC 
       LIMIT 1`,
      [req.user.id]
    );

    const subscription = subscriptionResult.rows[0] || null;

    res.json({
      user: {
        ...user,
        subscription
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
    }

    // Update user
    const result = await query(
      `UPDATE users 
       SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, name, role, subscription_plan, subscription_status`,
      [name || req.user.name, email || req.user.email, req.user.id]
    );

    res.json({
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/auth/change-password - Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Get current password hash
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router; 