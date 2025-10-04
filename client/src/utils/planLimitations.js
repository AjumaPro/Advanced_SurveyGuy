import { useAuth } from '../contexts/AuthContext';

// Plan limitations configuration
export const PLAN_LIMITS = {
  free: {
    maxSurveys: 5,
    canEditPublished: false,
    canDeletePublished: false,
    canExport: false,
    canCollaborate: false,
    canUseAdvancedAnalytics: false,
    canUseTemplates: true,
    canCustomizeBranding: false
  },
  pro: {
    maxSurveys: -1, // unlimited
    canEditPublished: true,
    canDeletePublished: true,
    canExport: true,
    canCollaborate: true,
    canUseAdvancedAnalytics: true,
    canUseTemplates: true,
    canCustomizeBranding: true
  },
  enterprise: {
    maxSurveys: -1, // unlimited
    canEditPublished: true,
    canDeletePublished: true,
    canExport: true,
    canCollaborate: true,
    canUseAdvancedAnalytics: true,
    canUseTemplates: true,
    canCustomizeBranding: true
  }
};

// Hook to check plan limitations
export const usePlanLimitations = () => {
  const { userProfile } = useAuth();
  const plan = userProfile?.plan || 'free';
  
  return {
    plan,
    limits: PLAN_LIMITS[plan] || PLAN_LIMITS.free,
    isFree: plan === 'free',
    isPro: plan === 'pro',
    isEnterprise: plan === 'enterprise',
    isPaid: plan === 'pro' || plan === 'enterprise'
  };
};

// Utility functions for checking specific limitations
export const canCreateSurvey = (currentSurveyCount, plan) => {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits.maxSurveys === -1 || currentSurveyCount < limits.maxSurveys;
};

export const canEditSurvey = (surveyStatus, plan) => {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  
  // If survey is published and user is on free plan, cannot edit
  if (surveyStatus === 'published' && !limits.canEditPublished) {
    return false;
  }
  
  return true;
};

export const canDeleteSurvey = (surveyStatus, plan) => {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  
  // If survey is published and user is on free plan, cannot delete
  if (surveyStatus === 'published' && !limits.canDeletePublished) {
    return false;
  }
  
  return true;
};

export const canExportSurvey = (plan) => {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits.canExport;
};

export const canUseFeature = (featureName, plan) => {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits[featureName] || false;
};

// Component for showing plan upgrade prompts
export const PlanUpgradePrompt = ({ feature, children, className = "" }) => {
  const { isFree, plan } = usePlanLimitations();
  
  if (!isFree) {
    return children;
  }
  
  const featureMessages = {
    canEditPublished: "Edit published surveys",
    canDeletePublished: "Delete published surveys", 
    canExport: "Export survey data",
    canCollaborate: "Team collaboration",
    canUseAdvancedAnalytics: "Advanced analytics",
    canCustomizeBranding: "Custom branding"
  };
  
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-sm text-gray-600 mb-2">
            {featureMessages[feature] || "This feature"} requires Pro plan
          </div>
          <a 
            href="/app/subscriptions" 
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>
    </div>
  );
};

export default {
  PLAN_LIMITS,
  usePlanLimitations,
  canCreateSurvey,
  canEditSurvey,
  canDeleteSurvey,
  canExportSurvey,
  canUseFeature,
  PlanUpgradePrompt
};
