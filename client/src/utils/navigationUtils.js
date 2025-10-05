/**
 * Navigation utilities for consistent back button behavior
 * Ensures signed-in users always return to dashboard when using back arrows
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for dashboard-aware navigation
 * @returns {Object} Navigation utilities
 */
export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /**
   * Navigate to dashboard for signed-in users, or home for guests
   */
  const navigateToDashboard = () => {
    if (user) {
      navigate('/app/dashboard');
    } else {
      navigate('/');
    }
  };

  /**
   * Navigate back with dashboard fallback for signed-in users
   */
  const navigateBack = () => {
    if (user) {
      navigate('/app/dashboard');
    } else {
      navigate(-1);
    }
  };

  /**
   * Navigate to a specific route with dashboard fallback
   * @param {string} route - The route to navigate to
   */
  const navigateWithFallback = (route) => {
    if (user) {
      navigate(route);
    } else {
      navigate('/app/dashboard');
    }
  };

  return {
    navigateToDashboard,
    navigateBack,
    navigateWithFallback,
    isSignedIn: !!user
  };
};

/**
 * Get the appropriate back route based on authentication status
 * @param {boolean} isSignedIn - Whether the user is signed in
 * @returns {string} The appropriate back route
 */
export const getBackRoute = (isSignedIn) => {
  return isSignedIn ? '/app/dashboard' : '/';
};

/**
 * Check if current route should redirect to dashboard
 * @param {string} currentPath - Current pathname
 * @param {boolean} isSignedIn - Whether the user is signed in
 * @returns {boolean} Whether to redirect to dashboard
 */
export const shouldRedirectToDashboard = (currentPath, isSignedIn) => {
  if (!isSignedIn) return false;
  
  // Routes that should redirect to dashboard for signed-in users
  const dashboardRedirectRoutes = [
    '/form/',
    '/survey/',
    '/s/',
    '/contact',
    '/services',
    '/pricing'
  ];

  return dashboardRedirectRoutes.some(route => currentPath.startsWith(route));
};

/**
 * Default dashboard routes for different user types
 */
export const DASHBOARD_ROUTES = {
  admin: '/app/admin',
  super_admin: '/app/admin',
  user: '/app/dashboard'
};

/**
 * Get the appropriate dashboard route based on user role
 * @param {Object} user - User object
 * @returns {string} Dashboard route
 */
export const getDashboardRoute = (user) => {
  if (!user) return '/';
  
  if (user.role === 'super_admin' || user.super_admin) {
    return DASHBOARD_ROUTES.super_admin;
  }
  
  if (user.role === 'admin') {
    return DASHBOARD_ROUTES.admin;
  }
  
  return DASHBOARD_ROUTES.user;
};
