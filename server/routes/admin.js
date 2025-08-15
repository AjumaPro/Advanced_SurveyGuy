const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');
const { adminAuth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// GET /api/admin - Get admin overview
router.get('/', adminAuth, async (req, res) => {
  try {
    // Get overall statistics
    const stats = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
        COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admin_users
      FROM users
    `);

    // Get recent activity
    const recentActivity = await query(`
      SELECT 
        'user_registered' as type,
        email as title,
        created_at as time
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({
      stats: stats.rows[0],
      recentActivity: recentActivity.rows
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

// Helper function to log admin actions
const logAdminAction = async (adminId, action, targetType, targetId, details = {}, req) => {
  try {
    await query(
      `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        adminId,
        action,
        targetType,
        targetId,
        JSON.stringify(details),
        req.ip || req.connection.remoteAddress,
        req.get('User-Agent')
      ]
    );
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

// GET /api/admin/dashboard - Get admin dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get pending approvals count
    const pendingAccounts = await query(
      'SELECT COUNT(*) FROM account_approvals WHERE status = $1',
      ['pending']
    );

    const pendingPayments = await query(
      'SELECT COUNT(*) FROM payment_approvals WHERE status = $1',
      ['pending']
    );

    // Get total users count
    const totalUsers = await query('SELECT COUNT(*) FROM users');
    
    // Get total revenue
    const totalRevenue = await query(
      'SELECT SUM(amount) FROM payment_subscriptions WHERE status = $1',
      ['active']
    );

    // Get recent admin actions
    const recentActions = await query(
      `SELECT al.*, u.name as admin_name 
       FROM admin_audit_log al 
       LEFT JOIN users u ON al.admin_id = u.id 
       ORDER BY al.created_at DESC 
       LIMIT 10`
    );

    res.json({
      stats: {
        pendingAccounts: parseInt(pendingAccounts.rows[0].count),
        pendingPayments: parseInt(pendingPayments.rows[0].count),
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalRevenue: parseFloat(totalRevenue.rows[0].sum || 0)
      },
      recentActions: recentActions.rows
    });

  } catch (error) {
    console.error('Error getting admin dashboard:', error);
    res.status(500).json({ error: 'Failed to get admin dashboard' });
  }
});

// GET /api/admin/accounts - Get all user accounts with approval status
router.get('/accounts', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += `WHERE u.is_approved = $${paramCount}`;
      params.push(status === 'approved');
    }

    if (search) {
      paramCount++;
      const searchParam = `%${search}%`;
      whereClause += whereClause ? ' AND ' : 'WHERE ';
      whereClause += `(u.email ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`;
      params.push(searchParam);
    }

    // Get accounts with approval info
    const accounts = await query(
      `SELECT 
        u.id, u.email, u.name, u.role, u.is_approved, u.created_at,
        u.subscription_plan, u.subscription_status,
        aa.status as approval_status, aa.admin_notes,
        aa.approved_at, aa.rejection_reason
       FROM users u
       LEFT JOIN account_approvals aa ON u.id = aa.user_id
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Get total count
    const totalCount = await query(
      `SELECT COUNT(*) FROM users u ${whereClause}`,
      params
    );

    res.json({
      accounts: accounts.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error getting accounts:', error);
    res.status(500).json({ error: 'Failed to get accounts' });
  }
});

// POST /api/admin/accounts - Create new user account
router.post('/accounts', adminAuth, async (req, res) => {
  try {
    const { name, email, password, subscription_plan, subscription_status } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, role, subscription_plan, subscription_status, is_approved, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, name, email, role, subscription_plan, subscription_status, is_approved`,
      [name, email, hashedPassword, 'user', subscription_plan || 'free', subscription_status || 'active', true]
    );

    const newUser = userResult.rows[0];

    // Create basic subscription record
    await query(
      `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, interval, status, currency, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [newUser.id, '1', subscription_plan || 'free', 0.00, 'monthly', subscription_status || 'active', 'GHS']
    );

    // Log action
    await logAdminAction(req.user.id, 'account_created', 'user', newUser.id, {
      user_email: newUser.email,
      user_name: newUser.name,
      subscription_plan: newUser.subscription_plan,
      subscription_status: newUser.subscription_status
    }, req);

    res.status(201).json({
      message: 'User account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        subscription_plan: newUser.subscription_plan,
        subscription_status: newUser.subscription_status,
        is_approved: newUser.is_approved
      }
    });

  } catch (error) {
    console.error('Error creating user account:', error);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

// POST /api/admin/accounts/:id/approve - Approve or reject user account
router.post('/accounts/:id/approve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason, notes } = req.body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "approve" or "reject"' });
    }

    // Start transaction
    await query('BEGIN');

    try {
      if (action === 'approve') {
        // Approve user account
        await query(
          `UPDATE users 
           SET is_approved = true, approved_by = $1, approved_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [req.user.id, id]
        );

        // Update approval record
        await query(
          `UPDATE account_approvals 
           SET status = 'approved', admin_id = $1, approved_at = CURRENT_TIMESTAMP, admin_notes = $2
           WHERE user_id = $3`,
          [req.user.id, notes || '', id]
        );

        // Log action
        await logAdminAction(req.user.id, 'account_approved', 'user', id, { reason, notes }, req);

        res.json({ message: 'Account approved successfully' });

      } else {
        // Reject user account
        await query(
          `UPDATE users 
           SET is_approved = false, approved_by = $1
           WHERE id = $2`,
          [req.user.id, id]
        );

        // Update approval record
        await query(
          `UPDATE account_approvals 
           SET status = 'rejected', admin_id = $1, admin_notes = $2, rejection_reason = $3
           WHERE user_id = $4`,
          [req.user.id, notes || '', reason || '', id]
        );

        // Log action
        await logAdminAction(req.user.id, 'account_rejected', 'user', id, { reason, notes }, req);

        res.json({ message: 'Account rejected successfully' });
      }

      await query('COMMIT');

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error approving/rejecting account:', error);
    res.status(500).json({ error: 'Failed to process account approval' });
  }
});

// PUT /api/admin/accounts/:id - Update user account
router.put('/accounts/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subscription_plan, subscription_status } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if email is already taken by another user
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already taken by another user' });
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Update user account
      const result = await query(
        `UPDATE users 
         SET name = $1, email = $2, subscription_plan = $3, subscription_status = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, name, email, role, subscription_plan, subscription_status, is_approved`,
        [name, email, subscription_plan || 'free', subscription_status || 'active', id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Log action
      await logAdminAction(req.user.id, 'account_updated', 'user', id, req.body, req);

      await query('COMMIT');

      res.json({
        message: 'Account updated successfully',
        user: result.rows[0]
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// DELETE /api/admin/accounts/:id - Delete user account
router.delete('/accounts/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userResult = await query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Prevent deletion of super admin accounts
    if (user.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot delete super admin accounts' });
    }

    // Prevent deletion of admin accounts (only super admins can delete admins)
    if (user.role === 'admin' && req.user.role !== 'super_admin' && !req.user.super_admin) {
      return res.status(403).json({ error: 'Only super admins can delete admin accounts' });
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Log action before deletion
      await logAdminAction(req.user.id, 'account_deleted', 'user', id, { 
        user_email: user.email, user_name: user.name, user_role: user.role 
      }, req);

      // Delete related records first
      await query('DELETE FROM payment_subscriptions WHERE user_id = $1', [id]);
      await query('DELETE FROM account_approvals WHERE user_id = $1', [id]);
      await query('DELETE FROM admin_management WHERE admin_id = $1', [id]);
      
      // Delete user's surveys and related data
      await query('DELETE FROM responses WHERE user_id = $1', [id]);
      await query('DELETE FROM questions WHERE survey_id IN (SELECT id FROM surveys WHERE user_id = $1)', [id]);
      await query('DELETE FROM surveys WHERE user_id = $1', [id]);
      
      // Finally delete the user
      await query('DELETE FROM users WHERE id = $1', [id]);

      await query('COMMIT');

      res.json({ message: 'Account deleted successfully' });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// GET /api/admin/packages - Get all subscription packages
router.get('/packages', adminAuth, async (req, res) => {
  try {
    const packages = await query(
      `SELECT * FROM subscription_packages ORDER BY sort_order, name`
    );

    res.json(packages.rows);

  } catch (error) {
    console.error('Error getting packages:', error);
    res.status(500).json({ error: 'Failed to get packages' });
  }
});

// POST /api/admin/packages - Create new subscription package
router.post('/packages', adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency = 'GHS',
      interval = 'monthly',
      features = [],
      max_surveys = 3,
      max_responses_per_survey = 50,
      is_active = true,
      is_featured = false,
      sort_order = 0,
      // Enterprise features
      advanced_analytics = false,
      custom_branding = false,
      api_access = false,
      white_label = false,
      priority_support = false,
      data_export = false,
      team_collaboration = false,
      advanced_security = false,
      custom_integrations = false,
      dedicated_account_manager = false,
      sso_integration = false,
      advanced_workflows = false,
      ai_insights = false,
      real_time_dashboard = false,
      custom_domains = false,
      backup_restore = false,
      compliance_certifications = false,
      training_sessions = false,
      custom_development = false,
      sla_guarantee = false
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const result = await query(
      `INSERT INTO subscription_packages (
        name, description, price, currency, interval, features, 
        max_surveys, max_responses_per_survey, is_active, is_featured, sort_order, created_by,
        advanced_analytics, custom_branding, api_access, white_label, priority_support,
        data_export, team_collaboration, advanced_security, custom_integrations,
        dedicated_account_manager, sso_integration, advanced_workflows, ai_insights,
        real_time_dashboard, custom_domains, backup_restore, compliance_certifications,
        training_sessions, custom_development, sla_guarantee
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
      RETURNING *`,
      [
        name, description, price, currency, interval, JSON.stringify(features),
        max_surveys, max_responses_per_survey, is_active, is_featured, sort_order, req.user.id,
        advanced_analytics, custom_branding, api_access, white_label, priority_support,
        data_export, team_collaboration, advanced_security, custom_integrations,
        dedicated_account_manager, sso_integration, advanced_workflows, ai_insights,
        real_time_dashboard, custom_domains, backup_restore, compliance_certifications,
        training_sessions, custom_development, sla_guarantee
      ]
    );

    // Log action
    await logAdminAction(req.user.id, 'package_created', 'package', result.rows[0].id, req.body, req);

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

// PUT /api/admin/packages/:id - Update subscription package
router.put('/packages/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Build dynamic update query
    const setClause = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updateFields).forEach(key => {
      if (key !== 'id' && key !== 'created_by') {
        paramCount++;
        setClause.push(`${key} = $${paramCount}`);
        
        // Handle JSON fields properly
        if (key === 'features' && Array.isArray(updateFields[key])) {
          values.push(JSON.stringify(updateFields[key]));
        } else {
          values.push(updateFields[key]);
        }
      }
    });

    if (setClause.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    paramCount++;
    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE subscription_packages 
       SET ${setClause.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Log action
    await logAdminAction(req.user.id, 'package_updated', 'package', id, updateFields, req);

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// DELETE /api/admin/packages/:id - Delete subscription package
router.delete('/packages/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if package is in use
    const usageCheck = await query(
      'SELECT COUNT(*) FROM payment_subscriptions WHERE plan_id = $1',
      [id]
    );

    if (parseInt(usageCheck.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Cannot delete package that is currently in use' });
    }

    const result = await query(
      'DELETE FROM subscription_packages WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Log action
    await logAdminAction(req.user.id, 'package_deleted', 'package', id, {}, req);

    res.json({ message: 'Package deleted successfully' });

  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// GET /api/admin/payments - Get all payment approvals
router.get('/payments', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE pa.status = $1';
      params.push(status);
    }

    const payments = await query(
      `SELECT 
        pa.*, u.email, u.name as user_name,
        pi.reference, pi.plan_name, pi.plan_id
       FROM payment_approvals pa
       JOIN users u ON pa.user_id = u.id
       LEFT JOIN payment_intents pi ON pa.payment_intent_id = pi.id
       ${whereClause}
       ORDER BY pa.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    // Get total count
    const totalCount = await query(
      `SELECT COUNT(*) FROM payment_approvals pa ${whereClause}`,
      params
    );

    res.json({
      payments: payments.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  }
});

// POST /api/admin/payments/:id/approve - Approve or reject payment
router.post('/payments/:id/approve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "approve" or "reject"' });
    }

    // Start transaction
    await query('BEGIN');

    try {
      if (action === 'approve') {
        // Approve payment
        await query(
          `UPDATE payment_approvals 
           SET status = 'approved', admin_id = $1, approved_at = CURRENT_TIMESTAMP, admin_notes = $2
           WHERE id = $3`,
          [req.user.id, notes || '', id]
        );

        // Update payment intent status
        await query(
          `UPDATE payment_intents 
           SET status = 'approved'
           WHERE id = (SELECT payment_intent_id FROM payment_approvals WHERE id = $1)`,
          [id]
        );

        // Log action
        await logAdminAction(req.user.id, 'payment_approved', 'payment', id, { notes }, req);

        res.json({ message: 'Payment approved successfully' });

      } else {
        // Reject payment
        await query(
          `UPDATE payment_approvals 
           SET status = 'rejected', admin_id = $1, admin_notes = $2
           WHERE id = $3`,
          [req.user.id, notes || '', id]
        );

        // Update payment intent status
        await query(
          `UPDATE payment_intents 
           SET status = 'rejected'
           WHERE id = (SELECT payment_intent_id FROM payment_approvals WHERE id = $1)`,
          [id]
        );

        // Log action
        await logAdminAction(req.user.id, 'payment_rejected', 'payment', id, { notes }, req);

        res.json({ message: 'Payment rejected successfully' });
      }

      await query('COMMIT');

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error approving/rejecting payment:', error);
    res.status(500).json({ error: 'Failed to process payment approval' });
  }
});

// GET /api/admin/audit-log - Get admin audit log
router.get('/audit-log', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, action, targetType } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];
    let paramCount = 0;

    if (action) {
      paramCount++;
      whereClause += `WHERE al.action = $${paramCount}`;
      params.push(action);
    }

    if (targetType) {
      paramCount++;
      whereClause += whereClause ? ' AND ' : 'WHERE ';
      whereClause += `al.target_type = $${paramCount}`;
      params.push(targetType);
    }

    const auditLog = await query(
      `SELECT 
        al.*, u.name as admin_name, u.email as admin_email
       FROM admin_audit_log al
       LEFT JOIN users u ON al.admin_id = u.id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Get total count
    const totalCount = await query(
      `SELECT COUNT(*) FROM admin_audit_log al ${whereClause}`,
      params
    );

    res.json({
      auditLog: auditLog.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error getting audit log:', error);
    res.status(500).json({ error: 'Failed to get audit log' });
  }
});

// ==================== SUPER ADMIN ROUTES ====================

// Middleware to check if user is super admin
const superAdminAuth = async (req, res, next) => {
  try {
    // First check if user is admin
    const adminResult = await query(
      'SELECT id, email, name, role, super_admin FROM users WHERE id = $1',
      [req.user.id]
    );

    if (adminResult.rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = adminResult.rows[0];

    // Check if user is super admin
    if (user.role !== 'super_admin' && !user.super_admin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    req.superAdmin = user;
    next();
  } catch (error) {
    console.error('Super admin auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// GET /api/admin/super-admin/admins - Get all admin accounts
router.get('/super-admin/admins', adminAuth, superAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE u.role IN ('admin', 'super_admin')";
    let params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND u.is_approved = $${paramCount}`;
      params.push(status === 'active');
    }

    if (search) {
      paramCount++;
      const searchParam = `%${search}%`;
      whereClause += ` AND (u.email ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`;
      params.push(searchParam);
    }

    // Get admin accounts
    const admins = await query(
      `SELECT 
        u.id, u.email, u.name, u.role, u.is_approved, u.super_admin, u.created_at,
        am.status as admin_status, am.permissions, am.department, am.notes
       FROM users u
       LEFT JOIN admin_management am ON u.id = am.admin_id
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Get total count
    const totalCount = await query(
      `SELECT COUNT(*) FROM users u ${whereClause}`,
      params
    );

    res.json({
      admins: admins.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error getting admin accounts:', error);
    res.status(500).json({ error: 'Failed to get admin accounts' });
  }
});

// POST /api/admin/super-admin/admins - Create new admin account
router.post('/super-admin/admins', adminAuth, superAdminAuth, async (req, res) => {
  try {
    const { email, password, name, role, department, permissions, notes } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Start transaction
    await query('BEGIN');

    try {
      // Create admin user
      const result = await query(
        `INSERT INTO users (email, password_hash, name, role, subscription_plan, subscription_status, is_approved, super_admin)
         VALUES ($1, $2, $3, $4, 'admin', 'active', true, false)
         RETURNING id, email, name, role, subscription_plan, subscription_status, is_approved, super_admin, created_at`,
        [email, passwordHash, name, role || 'admin']
      );

      const user = result.rows[0];

      // Create admin subscription
      await query(
        `INSERT INTO payment_subscriptions (user_id, plan_id, plan_name, amount, currency, interval, status)
         VALUES ($1, 'admin', 'Admin Plan', 0.00, 'GHS', 'monthly', 'active')`,
        [user.id]
      );

      // Add to admin management
      await query(
        `INSERT INTO admin_management (admin_id, super_admin_id, action, permissions, department, status, notes)
         VALUES ($1, $2, 'created', $3, $4, 'active', $5)`,
        [user.id, req.superAdmin.id, JSON.stringify(permissions || []), department || '', notes || '']
      );

      // Log action
      await logAdminAction(req.superAdmin.id, 'admin_created', 'user', user.id, { 
        email, name, role, department, permissions 
      }, req);

      // Commit transaction
      await query('COMMIT');

      res.status(201).json({
        message: 'Admin account created successfully',
        admin: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_approved: user.is_approved,
          super_admin: user.super_admin
        }
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error creating admin account:', error);
    res.status(500).json({ error: 'Failed to create admin account' });
  }
});

// PUT /api/admin/super-admin/admins/:id - Update admin account
router.put('/super-admin/admins/:id', adminAuth, superAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, department, permissions, notes, is_approved } = req.body;

    // Check if admin exists
    const adminResult = await query(
      'SELECT id, role, super_admin FROM users WHERE id = $1 AND role IN ($2, $3)',
      [id, 'admin', 'super_admin']
    );

    if (adminResult.rows.length === 0) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    const admin = adminResult.rows[0];

    // Prevent super admin from modifying other super admins
    if (admin.role === 'super_admin' && admin.id !== req.superAdmin.id) {
      return res.status(403).json({ error: 'Cannot modify other super admin accounts' });
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Update user
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;

      if (name) {
        paramCount++;
        updateFields.push(`name = $${paramCount}`);
        updateValues.push(name);
      }

      if (email) {
        paramCount++;
        updateFields.push(`email = $${paramCount}`);
        updateValues.push(email);
      }

      if (role) {
        paramCount++;
        updateFields.push(`role = $${paramCount}`);
        updateValues.push(role);
      }

      if (is_approved !== undefined) {
        paramCount++;
        updateFields.push(`is_approved = $${paramCount}`);
        updateValues.push(is_approved);
      }

      if (updateFields.length > 0) {
        paramCount++;
        updateValues.push(id);
        await query(
          `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
          updateValues
        );
      }

      // Update admin management
      await query(
        `INSERT INTO admin_management (admin_id, super_admin_id, action, permissions, department, status, notes)
         VALUES ($1, $2, 'updated', $3, $4, 'active', $5)
         ON CONFLICT (admin_id) DO UPDATE SET
         super_admin_id = $2, action = 'updated', permissions = $3, department = $4, notes = $5, updated_at = CURRENT_TIMESTAMP`,
        [id, req.superAdmin.id, JSON.stringify(permissions || []), department || '', notes || '']
      );

      // Log action
      await logAdminAction(req.superAdmin.id, 'admin_updated', 'user', id, { 
        name, email, role, department, permissions, is_approved 
      }, req);

      await query('COMMIT');

      res.json({ message: 'Admin account updated successfully' });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error updating admin account:', error);
    res.status(500).json({ error: 'Failed to update admin account' });
  }
});

// DELETE /api/admin/super-admin/admins/:id - Remove admin account
router.delete('/super-admin/admins/:id', adminAuth, superAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const adminResult = await query(
      'SELECT id, role, super_admin FROM users WHERE id = $1 AND role IN ($2, $3)',
      [id, 'admin', 'super_admin']
    );

    if (adminResult.rows.length === 0) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    const admin = adminResult.rows[0];

    // Prevent super admin from deleting themselves or other super admins
    if (admin.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot delete super admin accounts' });
    }

    // Prevent super admin from deleting themselves
    if (admin.id === req.superAdmin.id) {
      return res.status(403).json({ error: 'Cannot delete your own account' });
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Log action before deletion
      await logAdminAction(req.superAdmin.id, 'admin_deleted', 'user', id, { 
        admin_email: admin.email, admin_name: admin.name 
      }, req);

      // Remove from admin management
      await query('DELETE FROM admin_management WHERE admin_id = $1', [id]);

      // Update user role to regular user
      await query(
        'UPDATE users SET role = $1, super_admin = false WHERE id = $2',
        ['user', id]
      );

      // Update subscription to free plan
      await query(
        'UPDATE payment_subscriptions SET plan_id = $1, plan_name = $2, amount = $3 WHERE user_id = $4',
        ['free', 'Free Plan', 0.00, id]
      );

      await query('COMMIT');

      res.json({ message: 'Admin account removed successfully' });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error removing admin account:', error);
    res.status(500).json({ error: 'Failed to remove admin account' });
  }
});

module.exports = router; 