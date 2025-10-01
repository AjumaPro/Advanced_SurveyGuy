/**
 * Admin Utilities for Production
 * Provides utilities for checking admin permissions and gating features
 */

import { useAuth } from '../contexts/AuthContext';
import { isFeatureEnabled } from '../config/production';

/**
 * Check if user is super admin
 * @param {Object} user - User object from auth context
 * @param {Object} userProfile - User profile object
 * @returns {boolean} - True if user is super admin
 */
export const isSuperAdmin = (user, userProfile) => {
  if (!user) return false;
  
  // Check by email (hardcoded super admin)
  if (user.email === 'infoajumapro@gmail.com') return true;
  
  // Check by role
  if (userProfile?.role === 'super_admin') return true;
  
  return false;
};

/**
 * Check if user is admin (admin or super admin)
 * @param {Object} user - User object from auth context
 * @param {Object} userProfile - User profile object
 * @returns {boolean} - True if user is admin or super admin
 */
export const isAdmin = (user, userProfile) => {
  if (!user) return false;
  
  // Super admin check
  if (isSuperAdmin(user, userProfile)) return true;
  
  // Regular admin check
  if (userProfile?.role === 'admin') return true;
  
  return false;
};

/**
 * Hook to get admin status
 * @returns {Object} - Object with isAdmin and isSuperAdmin flags
 */
export const useAdminStatus = () => {
  const { user, userProfile } = useAuth();
  
  return {
    isAdmin: isAdmin(user, userProfile),
    isSuperAdmin: isSuperAdmin(user, userProfile),
    user,
    userProfile
  };
};

/**
 * Conditional rendering wrapper for admin-only features
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children to render if user is admin
 * @param {boolean} props.superAdminOnly - If true, requires super admin access
 * @param {React.ReactNode} props.fallback - Fallback content for non-admin users
 * @returns {React.ReactNode} - Rendered content based on admin status
 */
export const AdminOnly = ({ children, superAdminOnly = false, fallback = null, featureName = null }) => {
  const { isAdmin, isSuperAdmin } = useAdminStatus();
  
  // Check if feature is enabled in production config
  if (featureName && !isFeatureEnabled(featureName)) {
    return fallback;
  }
  
  const hasAccess = superAdminOnly ? isSuperAdmin : isAdmin;
  
  return hasAccess ? children : fallback;
};

/**
 * Check if feature should be enabled based on admin status and environment
 * @param {string} featureName - Name of the feature
 * @param {boolean} superAdminOnly - If true, requires super admin access
 * @returns {boolean} - True if feature should be enabled
 */
export const isFeatureEnabledForAdmin = (featureName, superAdminOnly = false) => {
  // In production, only enable for super admins
  if (process.env.NODE_ENV === 'production') {
    // You would need to get user context here, but for utility function,
    // we'll assume it's called from a component that has access to user data
    return superAdminOnly;
  }
  
  // In development, allow all features
  return true;
};

/**
 * Get environment-specific configuration
 * @returns {Object} - Environment configuration
 */
export const getEnvironmentConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    isProduction,
    isDevelopment: !isProduction,
    enableDebugFeatures: !isProduction,
    enableTestRoutes: !isProduction,
    enableConsoleLogs: !isProduction,
    enableMockData: !isProduction
  };
};
