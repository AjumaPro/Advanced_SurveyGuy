const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database with subscription info
    const result = await query(
      'SELECT id, email, name, role, subscription_plan, subscription_status, is_approved, super_admin FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    const user = result.rows[0];
    
    // Check if user account is approved (unless they're an admin or super admin)
    if (user.role !== 'admin' && user.role !== 'super_admin' && !user.is_approved) {
      return res.status(403).json({ error: 'Account pending approval. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Admin middleware to check if user has admin privileges
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database with subscription info
    const result = await query(
      'SELECT id, email, name, role, subscription_plan, subscription_status, is_approved, super_admin FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    const user = result.rows[0];
    
    // Check if user is admin or super admin
    if (user.role !== 'admin' && user.role !== 'super_admin' && !user.super_admin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(403).json({ error: 'Admin access denied.' });
  }
};

module.exports = { auth, adminAuth }; 