/**
 * DashboardRedirect Component
 * Wraps components to ensure back navigation goes to dashboard for signed-in users
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { shouldRedirectToDashboard, getDashboardRoute } from '../utils/navigationUtils';

const DashboardRedirect = ({ children, redirectToDashboard = true }) => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (redirectToDashboard && shouldRedirectToDashboard(location.pathname, !!user)) {
      // Override browser back button behavior for signed-in users
      const handlePopState = (event) => {
        if (user) {
          event.preventDefault();
          window.history.pushState(null, '', location.pathname);
          window.location.href = getDashboardRoute(user);
        }
      };

      // Add event listener for browser back button
      window.addEventListener('popstate', handlePopState);

      // Cleanup
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [location.pathname, user, redirectToDashboard]);

  return <>{children}</>;
};

export default DashboardRedirect;
