// Plan-based feature gating system
import { supabase } from '../lib/supabase';

// Feature definitions for each plan
export const PLAN_FEATURES = {
  free: {
    surveys: {
      limit: 5,
      unlimited: false
    },
    responses: {
      limit: 100, // per survey
      unlimited: false
    },
    questionTypes: {
      basic: true,
      advanced: true, // All question types available
      quiz: true,
      scales: true
    },
    fileUploads: true,
    analytics: {
      basic: true,
      advanced: false,
      realtime: false,
      customReports: false
    },
    templates: {
      standard: true,
      premium: false,
      custom: false
    },
    support: {
      email: true,
      priority: false,
      phone: false,
      dedicated: false
    },
    exports: {
      pdf: true,
      excel: false,
      csv: true
    },
    branding: {
      custom: false,
      whiteLabel: false
    },
    collaboration: {
      team: false,
      roles: false,
      sharing: true // Basic sharing
    },
    integrations: {
      api: false,
      webhooks: false,
      zapier: false
    },
    storage: {
      limit: 2048, // 2 GB in MB
      unlimited: false
    },
    qrCodes: true,
    events: {
      limit: 2,
      unlimited: false
    }
  },
  
  pro: {
    surveys: {
      limit: null,
      unlimited: true
    },
    responses: {
      limit: 10000, // per survey
      unlimited: false
    },
    questionTypes: {
      basic: true,
      advanced: true,
      quiz: true,
      scales: true
    },
    fileUploads: true,
    analytics: {
      basic: true,
      advanced: true,
      realtime: false,
      customReports: true
    },
    templates: {
      standard: true,
      premium: true,
      custom: true
    },
    support: {
      email: true,
      priority: true,
      phone: false,
      dedicated: false
    },
    exports: {
      pdf: true,
      excel: true,
      csv: true
    },
    branding: {
      custom: true,
      whiteLabel: true
    },
    collaboration: {
      team: true,
      roles: true,
      sharing: true
    },
    integrations: {
      api: true,
      webhooks: false,
      zapier: true
    },
    storage: {
      limit: 20480, // 20 GB in MB
      unlimited: false
    },
    qrCodes: true,
    events: {
      limit: null,
      unlimited: true
    },
    security: {
      advanced: true,
      encryption: true,
      audit: true
    },
    multiLanguage: true
  },
  
  enterprise: {
    surveys: {
      limit: null,
      unlimited: true
    },
    responses: {
      limit: null,
      unlimited: true
    },
    questionTypes: {
      basic: true,
      advanced: true,
      quiz: true,
      scales: true
    },
    fileUploads: true,
    analytics: {
      basic: true,
      advanced: true,
      realtime: true,
      customReports: true,
      customDashboards: true
    },
    templates: {
      standard: true,
      premium: true,
      custom: true
    },
    support: {
      email: true,
      priority: true,
      phone: true,
      dedicated: true,
      accountManager: true
    },
    exports: {
      pdf: true,
      excel: true,
      csv: true,
      api: true
    },
    branding: {
      custom: true,
      whiteLabel: true,
      fullCustomization: true
    },
    collaboration: {
      team: true,
      roles: true,
      sharing: true,
      advanced: true
    },
    integrations: {
      api: true,
      webhooks: true,
      zapier: true,
      custom: true
    },
    storage: {
      limit: null,
      unlimited: true
    },
    qrCodes: true,
    events: {
      limit: null,
      unlimited: true
    },
    security: {
      advanced: true,
      encryption: true,
      audit: true,
      sso: true,
      compliance: true
    },
    multiLanguage: true,
    customDevelopment: true,
    onPremise: true,
    sla: true,
    customTraining: true,
    priorityFeatures: true,
    customWorkflows: true
  }
};

// Helper functions to check feature access
export const hasFeature = (userPlan, featurePath) => {
  if (!userPlan || !PLAN_FEATURES[userPlan]) {
    return false;
  }
  
  const features = PLAN_FEATURES[userPlan];
  const pathParts = featurePath.split('.');
  
  let current = features;
  for (const part of pathParts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }
  
  return current === true;
};

export const getFeatureLimit = (userPlan, featurePath) => {
  if (!userPlan || !PLAN_FEATURES[userPlan]) {
    return 0;
  }
  
  const features = PLAN_FEATURES[userPlan];
  const pathParts = featurePath.split('.');
  
  let current = features;
  for (const part of pathParts) {
    if (current[part] === undefined) {
      return 0;
    }
    current = current[part];
  }
  
  return current.limit || 0;
};

export const isUnlimited = (userPlan, featurePath) => {
  if (!userPlan || !PLAN_FEATURES[userPlan]) {
    return false;
  }
  
  const features = PLAN_FEATURES[userPlan];
  const pathParts = featurePath.split('.');
  
  let current = features;
  for (const part of pathParts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }
  
  return current.unlimited === true;
};

// Usage tracking functions
export const trackFeatureUsage = async (userId, feature, metadata = {}) => {
  try {
    await supabase.from('analytics').insert({
      user_id: userId,
      entity_type: 'feature',
      entity_id: feature,
      event_type: 'usage',
      metadata
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
};

// Plan upgrade suggestions
export const getUpgradeSuggestion = (userPlan, attemptedFeature) => {
  const suggestions = {
    'analytics.advanced': {
      requiredPlan: 'pro',
      message: 'Upgrade to Pro for advanced analytics and custom reporting'
    },
    'branding.custom': {
      requiredPlan: 'pro',
      message: 'Upgrade to Pro for custom branding and white-label options'
    },
    'collaboration.team': {
      requiredPlan: 'pro',
      message: 'Upgrade to Pro for team collaboration features'
    },
    'integrations.api': {
      requiredPlan: 'pro',
      message: 'Upgrade to Pro for API access and integrations'
    },
    'security.sso': {
      requiredPlan: 'enterprise',
      message: 'Upgrade to Enterprise for Single Sign-On (SSO)'
    },
    'customDevelopment': {
      requiredPlan: 'enterprise',
      message: 'Upgrade to Enterprise for custom development'
    },
    'compliance': {
      requiredPlan: 'enterprise',
      message: 'Upgrade to Enterprise for GDPR and HIPAA compliance'
    }
  };
  
  return suggestions[attemptedFeature] || {
    requiredPlan: 'pro',
    message: 'Upgrade your plan to access this feature'
  };
};

// Feature gate component wrapper
export const FeatureGate = ({ 
  userPlan, 
  feature, 
  children, 
  fallback = null, 
  showUpgrade = true,
  onUpgradeClick = null 
}) => {
  const hasAccess = hasFeature(userPlan, feature);
  
  if (hasAccess) {
    return children;
  }
  
  if (showUpgrade) {
    const suggestion = getUpgradeSuggestion(userPlan, feature);
    return (
      <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-600 mb-3">{suggestion.message}</p>
        <button
          onClick={onUpgradeClick || (() => window.location.href = '/app/subscriptions')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upgrade to {suggestion.requiredPlan.charAt(0).toUpperCase() + suggestion.requiredPlan.slice(1)}
        </button>
      </div>
    );
  }
  
  return fallback;
};

const planFeaturesExport = {
  PLAN_FEATURES,
  hasFeature,
  getFeatureLimit,
  isUnlimited,
  trackFeatureUsage,
  getUpgradeSuggestion,
  FeatureGate
};

export default planFeaturesExport;
