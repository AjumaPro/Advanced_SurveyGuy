import React from 'react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { useAuth } from '../contexts/AuthContext';
import BasicAnalytics from '../pages/BasicAnalytics';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';

const AnalyticsRouter = () => {
  const { userProfile, user } = useAuth();
  const { hasFeature, isFreePlan } = useFeatureAccess();
  
  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';
  
  // Super admin can access everything
  if (isSuperAdmin) {
    return <AnalyticsDashboard />;
  }
  
  // Route based on plan
  if (isFreePlan || !hasFeature('advanced_analytics')) {
    return <BasicAnalytics />;
  }
  
  // Pro and Enterprise users get full analytics
  return <AnalyticsDashboard />;
};

export default AnalyticsRouter;
