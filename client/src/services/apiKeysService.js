/**
 * API Keys Service
 * Handles API key generation, management, and authentication
 */

import { supabase } from '../lib/supabase';
import crypto from 'crypto-js';

// =============================================
// API KEY GENERATION AND MANAGEMENT
// =============================================

export const apiKeysService = {
  // Generate a new API key
  async generateApiKey(userId, keyData) {
    try {
      console.log('🔑 Generating API key for user:', userId);
      console.log('📝 Key data:', keyData);
      
      // Check if user has API access first
      const accessCheck = await this.checkApiAccess(userId);
      console.log('🔐 Access check result:', accessCheck);
      
      if (!accessCheck.hasAccess) {
        return {
          success: false,
          apiKey: null,
          error: accessCheck.reason
        };
      }
      
      // Generate unique API key
      const apiKey = this.generateUniqueKey();
      const keyHash = this.hashKey(apiKey);
      
      console.log('🔑 Generated API key (first 10 chars):', apiKey.substring(0, 10) + '...');
      console.log('🔒 Generated key hash (first 10 chars):', keyHash.substring(0, 10) + '...');
      
      const keyRecord = {
        user_id: userId,
        name: keyData.name,
        key_hash: keyHash,
        permissions: keyData.permissions || ['read'],
        expires_at: keyData.expiresAt || null,
        last_used_at: null,
        usage_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📊 Key record to insert:', keyRecord);

      const { data, error } = await supabase
        .from('api_keys')
        .insert(keyRecord)
        .select()
        .single();

      console.log('💾 Database insert result:', { data, error });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      // Return the actual API key (only shown once)
      return {
        success: true,
        apiKey: {
          id: data.id,
          name: data.name,
          key: apiKey, // Full key shown only once
          permissions: data.permissions,
          expiresAt: data.expires_at,
          createdAt: data.created_at
        },
        error: null
      };
    } catch (error) {
      console.error('Error generating API key:', error);
      return {
        success: false,
        apiKey: null,
        error: error.message
      };
    }
  },

  // Get all API keys for a user
  async getUserApiKeys(userId) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to hide sensitive information
      const transformedKeys = data.map(key => ({
        id: key.id,
        name: key.name,
        permissions: key.permissions,
        expiresAt: key.expires_at,
        lastUsedAt: key.last_used_at,
        usageCount: key.usage_count,
        createdAt: key.created_at,
        keyPreview: this.maskApiKey(key.key_hash) // Show masked version
      }));

      return {
        success: true,
        apiKeys: transformedKeys,
        error: null
      };
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return {
        success: false,
        apiKeys: [],
        error: error.message
      };
    }
  },

  // Validate API key
  async validateApiKey(apiKey) {
    try {
      const keyHash = this.hashKey(apiKey);
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*, user:user_id(id, email, full_name, plan)')
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return {
          valid: false,
          user: null,
          permissions: [],
          error: 'Invalid API key'
        };
      }

      // Check if key is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return {
          valid: false,
          user: null,
          permissions: [],
          error: 'API key has expired'
        };
      }

      // Update usage statistics
      await this.updateKeyUsage(data.id);

      return {
        valid: true,
        user: data.user,
        permissions: data.permissions,
        error: null
      };
    } catch (error) {
      console.error('Error validating API key:', error);
      return {
        valid: false,
        user: null,
        permissions: [],
        error: error.message
      };
    }
  },

  // Update API key usage statistics
  async updateKeyUsage(keyId) {
    try {
      await supabase
        .from('api_keys')
        .update({
          last_used_at: new Date().toISOString(),
          usage_count: supabase.raw('usage_count + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', keyId);
    } catch (error) {
      console.warn('Failed to update key usage:', error);
      // Don't throw error as this is not critical
    }
  },

  // Revoke API key
  async revokeApiKey(keyId, userId) {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', keyId)
        .eq('user_id', userId);

      if (error) throw error;

      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('Error revoking API key:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update API key permissions
  async updateApiKeyPermissions(keyId, userId, permissions) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', keyId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        apiKey: data,
        error: null
      };
    } catch (error) {
      console.error('Error updating API key permissions:', error);
      return {
        success: false,
        apiKey: null,
        error: error.message
      };
    }
  },

  // Get API key usage statistics
  async getApiKeyStats(userId) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('usage_count, last_used_at, created_at')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      const stats = {
        totalKeys: data.length,
        totalUsage: data.reduce((sum, key) => sum + (key.usage_count || 0), 0),
        activeKeys: data.filter(key => key.last_used_at).length,
        lastUsed: data.reduce((latest, key) => {
          if (!key.last_used_at) return latest;
          return !latest || new Date(key.last_used_at) > new Date(latest) ? key.last_used_at : latest;
        }, null)
      };

      return {
        success: true,
        stats,
        error: null
      };
    } catch (error) {
      console.error('Error fetching API key stats:', error);
      return {
        success: false,
        stats: null,
        error: error.message
      };
    }
  },

  // Helper: Generate unique API key
  generateUniqueKey() {
    const prefix = 'sk_live_';
    const randomBytes = crypto.lib.WordArray.random(32);
    const key = randomBytes.toString(crypto.enc.Hex);
    return prefix + key;
  },

  // Helper: Hash API key for storage
  hashKey(apiKey) {
    return crypto.SHA256(apiKey).toString();
  },

  // Helper: Mask API key for display
  maskApiKey(keyHash) {
    // Since we only store the hash, we can't show the original key
    // Instead, show a consistent masked representation
    return 'sk_live_••••••••••••••••••••••••••••••••';
  },

  // Helper: Check if user has API access permission
  async checkApiAccess(userId) {
    try {
      console.log('🔍 Checking API access for user:', userId);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan, role, email')
        .eq('id', userId)
        .single();

      console.log('👤 Profile query result:', { profile, profileError });

      if (profileError) {
        console.error('❌ Profile query error:', profileError);
        return { hasAccess: false, reason: 'Error fetching user profile: ' + profileError.message };
      }

      if (!profile) {
        console.error('❌ No profile found for user:', userId);
        return { hasAccess: false, reason: 'User profile not found' };
      }

      console.log('📋 User profile:', profile);

      // API access available for Pro and Enterprise plans, or admin users
      const hasAccess = ['pro', 'enterprise'].includes(profile.plan) || 
                       ['admin', 'super_admin'].includes(profile.role) ||
                       profile.email === 'infoajumapro@gmail.com'; // Special case for testing
      
      const reason = hasAccess ? null : `API access requires Pro or Enterprise plan. Current plan: ${profile.plan || 'none'}`;
      
      console.log('🔐 Access check result:', { hasAccess, reason });
      
      return { hasAccess, reason };
    } catch (error) {
      console.error('💥 Error checking API access:', error);
      return { hasAccess: false, reason: 'Error checking permissions: ' + error.message };
    }
  }
};

// =============================================
// API KEY AUTHENTICATION MIDDLEWARE
// =============================================

export const apiAuthMiddleware = {
  // Middleware for API key authentication
  async authenticate(req, res, next) {
    try {
      const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
      
      if (!apiKey) {
        return res.status(401).json({
          error: 'API key required',
          message: 'Please provide an API key in the X-API-Key header or Authorization header'
        });
      }

      const validation = await apiKeysService.validateApiKey(apiKey);
      
      if (!validation.valid) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: validation.error
        });
      }

      // Add user info to request
      req.user = validation.user;
      req.apiPermissions = validation.permissions;
      
      next();
    } catch (error) {
      console.error('API authentication error:', error);
      return res.status(500).json({
        error: 'Authentication error',
        message: 'Internal server error during authentication'
      });
    }
  },

  // Middleware to check specific permissions
  requirePermission(permission) {
    return (req, res, next) => {
      if (!req.apiPermissions || !req.apiPermissions.includes(permission)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: `This action requires '${permission}' permission`
        });
      }
      next();
    };
  }
};

// =============================================
// API RATE LIMITING
// =============================================

export const rateLimitService = {
  // Simple in-memory rate limiting (in production, use Redis)
  rateLimitStore: new Map(),

  // Check rate limit for API key
  checkRateLimit(apiKey, limit = 1000, windowMs = 60000) { // 1000 requests per minute
    const now = Date.now();
    const windowStart = now - windowMs;
    const key = `rate_limit_${apiKey}`;
    
    if (!this.rateLimitStore.has(key)) {
      this.rateLimitStore.set(key, []);
    }
    
    const requests = this.rateLimitStore.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    this.rateLimitStore.set(key, validRequests);
    
    if (validRequests.length >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: validRequests[0] + windowMs
      };
    }
    
    // Add current request
    validRequests.push(now);
    this.rateLimitStore.set(key, validRequests);
    
    return {
      allowed: true,
      remaining: limit - validRequests.length,
      resetTime: now + windowMs
    };
  },

  // Rate limiting middleware
  rateLimit(limit = 1000, windowMs = 60000) {
    return (req, res, next) => {
      const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
      
      if (!apiKey) {
        return next(); // Skip rate limiting if no API key
      }
      
      const rateLimit = this.checkRateLimit(apiKey, limit, windowMs);
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': rateLimit.remaining,
        'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000)
      });
      
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        });
      }
      
      next();
    };
  }
};

export default apiKeysService;
