// =============================================
// COUPON API SERVICE
// =============================================
// API functions for discount coupon management

import { supabase } from '../lib/supabase';

export const couponAPI = {
  // =============================================
  // SUPER ADMIN COUPON MANAGEMENT
  // =============================================

  // Get all coupons (super admin only)
  async getAllCoupons(options = {}) {
    try {
      // Check if user is super admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isSuperAdmin = profile?.role === 'super_admin' || user.email === 'infoajumapro@gmail.com';
      if (!isSuperAdmin) {
        return { error: 'Super admin access required' };
      }

      let query = supabase
        .from('discount_coupons')
        .select(`
          *,
          coupon_usage(count)
        `)
        .order('created_at', { ascending: false });

      if (options.search) {
        query = query.or(`code.ilike.%${options.search}%,name.ilike.%${options.search}%`);
      }

      if (options.status) {
        if (options.status === 'active') {
          query = query.eq('is_active', true);
        } else if (options.status === 'inactive') {
          query = query.eq('is_active', false);
        } else if (options.status === 'expired') {
          query = query.lt('valid_until', new Date().toISOString());
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      return { coupons: data || [], error: null };
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return { coupons: [], error: error.message };
    }
  },

  // Create new coupon (super admin only)
  async createCoupon(couponData) {
    try {
      // Check if user is super admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isSuperAdmin = profile?.role === 'super_admin' || user.email === 'infoajumapro@gmail.com';
      if (!isSuperAdmin) {
        return { error: 'Super admin access required' };
      }

      // Validate coupon data
      if (!couponData.code || !couponData.name || !couponData.discount_value) {
        return { error: 'Missing required fields' };
      }

      // Check if coupon code already exists
      const { data: existingCoupon } = await supabase
        .from('discount_coupons')
        .select('id')
        .eq('code', couponData.code)
        .single();

      if (existingCoupon) {
        return { error: 'Coupon code already exists' };
      }

      const { data, error } = await supabase
        .from('discount_coupons')
        .insert([{
          ...couponData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      return { coupon: data, error: null };
    } catch (error) {
      console.error('Error creating coupon:', error);
      return { coupon: null, error: error.message };
    }
  },

  // Update coupon (super admin only)
  async updateCoupon(couponId, updates) {
    try {
      // Check if user is super admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isSuperAdmin = profile?.role === 'super_admin' || user.email === 'infoajumapro@gmail.com';
      if (!isSuperAdmin) {
        return { error: 'Super admin access required' };
      }

      const { data, error } = await supabase
        .from('discount_coupons')
        .update(updates)
        .eq('id', couponId)
        .select()
        .single();

      if (error) throw error;

      return { coupon: data, error: null };
    } catch (error) {
      console.error('Error updating coupon:', error);
      return { coupon: null, error: error.message };
    }
  },

  // Delete coupon (super admin only)
  async deleteCoupon(couponId) {
    try {
      // Check if user is super admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isSuperAdmin = profile?.role === 'super_admin' || user.email === 'infoajumapro@gmail.com';
      if (!isSuperAdmin) {
        return { error: 'Super admin access required' };
      }

      const { error } = await supabase
        .from('discount_coupons')
        .delete()
        .eq('id', couponId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return { success: false, error: error.message };
    }
  },

  // Get coupon usage statistics (super admin only)
  async getCouponUsageStats(couponId) {
    try {
      // Check if user is super admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isSuperAdmin = profile?.role === 'super_admin' || user.email === 'infoajumapro@gmail.com';
      if (!isSuperAdmin) {
        return { error: 'Super admin access required' };
      }

      const { data, error } = await supabase
        .from('coupon_usage')
        .select(`
          *,
          profiles(email, full_name),
          subscription_plans(name)
        `)
        .eq('coupon_id', couponId)
        .order('used_at', { ascending: false });

      if (error) throw error;

      return { usage: data || [], error: null };
    } catch (error) {
      console.error('Error fetching coupon usage:', error);
      return { usage: [], error: error.message };
    }
  },

  // =============================================
  // PUBLIC COUPON FUNCTIONS
  // =============================================

  // Validate coupon code (public)
  async validateCoupon(couponCode, orderAmount, planId = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data, error } = await supabase.rpc('validate_coupon', {
        coupon_code: couponCode,
        user_id_param: user.id,
        order_amount: orderAmount,
        plan_id: planId
      });

      if (error) throw error;

      return { result: data, error: null };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { result: null, error: error.message };
    }
  },

  // Apply coupon (public)
  async applyCoupon(couponCode, orderAmount, planId = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data, error } = await supabase.rpc('apply_coupon', {
        coupon_code: couponCode,
        user_id_param: user.id,
        order_amount: orderAmount,
        plan_id: planId
      });

      if (error) throw error;

      return { result: data, error: null };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { result: null, error: error.message };
    }
  },

  // Get user's coupon usage history
  async getUserCouponUsage() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'Authentication required' };
      }

      const { data, error } = await supabase
        .from('coupon_usage')
        .select(`
          *,
          discount_coupons(code, name, discount_type, discount_value),
          subscription_plans(name)
        `)
        .eq('user_id', user.id)
        .order('used_at', { ascending: false });

      if (error) throw error;

      return { usage: data || [], error: null };
    } catch (error) {
      console.error('Error fetching user coupon usage:', error);
      return { usage: [], error: error.message };
    }
  },

  // Get available coupons for user
  async getAvailableCoupons(planId = null) {
    try {
      let query = supabase
        .from('discount_coupons')
        .select('*')
        .eq('is_active', true)
        .gt('valid_until', new Date().toISOString());

      const { data, error } = await query;

      if (error) throw error;

      // Filter by applicable plans if planId is provided
      let availableCoupons = data || [];
      if (planId) {
        availableCoupons = availableCoupons.filter(coupon => {
          if (!coupon.applicable_plans || coupon.applicable_plans.length === 0) {
            return true; // No plan restrictions
          }
          return coupon.applicable_plans.includes(planId);
        });
      }

      return { coupons: availableCoupons, error: null };
    } catch (error) {
      console.error('Error fetching available coupons:', error);
      return { coupons: [], error: error.message };
    }
  }
};
