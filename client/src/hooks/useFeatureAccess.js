import { useAuth } from '../contexts/AuthContext';

// Feature definitions for each plan
const PLAN_FEATURES = {
  free: {
    surveys: 5,
    responses_per_survey: 100,
    team_members: 1,
    features: [
      'basic_survey_creation',
      'basic_analytics',
      'standard_templates',
      'basic_export'
    ]
  },
  pro: {
    surveys: -1, // unlimited
    responses_per_survey: 10000,
    team_members: 10,
    features: [
      'basic_survey_creation',
      'advanced_survey_creation',
      'basic_analytics',
      'advanced_analytics',
      'advanced_reports',
      'standard_templates',
      'premium_templates',
      'custom_branding',
      'team_collaboration',
      'api_access',
      'advanced_export',
      'email_notifications',
      'custom_domains',
      'priority_support'
    ]
  },
  enterprise: {
    surveys: -1, // unlimited
    responses_per_survey: -1, // unlimited
    team_members: -1, // unlimited
    features: [
      'basic_survey_creation',
      'advanced_survey_creation',
      'basic_analytics',
      'advanced_analytics',
      'advanced_reports',
      'real_time_analytics',
      'standard_templates',
      'premium_templates',
      'custom_templates',
      'custom_branding',
      'white_label',
      'team_collaboration',
      'advanced_team_management',
      'api_access',
      'webhook_integration',
      'advanced_export',
      'bulk_export',
      'email_notifications',
      'sms_notifications',
      'custom_domains',
      'sso_integration',
      'priority_support',
      'dedicated_support',
      'custom_development',
      'enterprise_security',
      'audit_logs',
      'data_retention_control'
    ]
  }
};

export const useFeatureAccess = () => {
  const { userProfile } = useAuth();
  const currentPlan = userProfile?.plan || 'free';
  const planFeatures = PLAN_FEATURES[currentPlan] || PLAN_FEATURES.free;

  const hasFeature = (featureName) => {
    return planFeatures.features.includes(featureName);
  };

  const getLimit = (limitType) => {
    return planFeatures[limitType] || 0;
  };

  const canCreateSurvey = (currentCount = 0) => {
    const limit = planFeatures.surveys;
    return limit === -1 || currentCount < limit;
  };

  const canAddTeamMember = (currentCount = 0) => {
    const limit = planFeatures.team_members;
    return limit === -1 || currentCount < limit;
  };

  const canReceiveResponses = (currentCount = 0, surveyId = null) => {
    const limit = planFeatures.responses_per_survey;
    return limit === -1 || currentCount < limit;
  };

  const getFeatureStatus = (featureName) => {
    const hasAccess = hasFeature(featureName);
    const requiredPlan = getRequiredPlan(featureName);
    
    return {
      hasAccess,
      currentPlan,
      requiredPlan,
      needsUpgrade: !hasAccess,
      upgradeMessage: !hasAccess ? `This feature requires ${requiredPlan} plan` : null
    };
  };

  const getRequiredPlan = (featureName) => {
    for (const [plan, config] of Object.entries(PLAN_FEATURES)) {
      if (config.features.includes(featureName)) {
        return plan;
      }
    }
    return 'enterprise'; // Default to highest plan
  };

  const getPlanLimits = () => {
    return {
      surveys: planFeatures.surveys,
      responses_per_survey: planFeatures.responses_per_survey,
      team_members: planFeatures.team_members,
      features: planFeatures.features
    };
  };

  const getPlanName = () => {
    return currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  };

  const isFreePlan = () => currentPlan === 'free';
  const isProPlan = () => currentPlan === 'pro';
  const isEnterprisePlan = () => currentPlan === 'enterprise';

  return {
    currentPlan,
    planFeatures,
    hasFeature,
    getLimit,
    canCreateSurvey,
    canAddTeamMember,
    canReceiveResponses,
    getFeatureStatus,
    getRequiredPlan,
    getPlanLimits,
    getPlanName,
    isFreePlan,
    isProPlan,
    isEnterprisePlan
  };
};
