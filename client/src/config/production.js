/**
 * Production Configuration
 * Settings and flags for production environment
 */

export const productionConfig = {
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Feature flags
  features: {
    enableTestRoutes: process.env.NODE_ENV !== 'production',
    enableDebugComponents: process.env.NODE_ENV !== 'production',
    enableConsoleLogs: process.env.NODE_ENV !== 'production',
    enableMockData: process.env.NODE_ENV !== 'production',
    enableAnalyticsIntegrationTest: false, // Disabled in production
    enableEventDebugger: false, // Disabled in production
    enableSurveyDebugger: false, // Disabled in production
    enableDatabaseInspector: false, // Disabled in production
    enableNetworkTests: false, // Disabled in production
    enableAuthTests: false, // Disabled in production
  },
  
  // Security settings
  security: {
    requireSuperAdminForTestRoutes: true,
    requireSuperAdminForDebugFeatures: true,
    hideDebugInfoInProduction: true,
    sanitizeErrorMessages: true,
  },
  
  // Performance settings
  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableServiceWorker: true,
    enableCaching: true,
  },
  
  // Analytics settings
  analytics: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableUserBehaviorTracking: false, // Disabled for privacy
    enableDebugAnalytics: false,
  },
  
  // API settings
  api: {
    enableRetries: true,
    enableOfflineSupport: true,
    enableRequestLogging: false, // Disabled in production
    enableResponseLogging: false, // Disabled in production
  },
  
  // UI settings
  ui: {
    showDebugInfo: false,
    showPerformanceMetrics: false,
    showErrorDetails: false, // Show generic errors only
    enableAnimations: true,
    enableTransitions: true,
  }
};

// Helper functions
export const isFeatureEnabled = (featureName) => {
  return productionConfig.features[featureName] || false;
};

export const isSuperAdminFeature = (featureName) => {
  const superAdminFeatures = [
    'enableTestRoutes',
    'enableDebugComponents',
    'enableConsoleLogs',
    'enableAnalyticsIntegrationTest',
    'enableEventDebugger',
    'enableSurveyDebugger',
    'enableDatabaseInspector',
    'enableNetworkTests',
    'enableAuthTests'
  ];
  
  return superAdminFeatures.includes(featureName);
};

export const shouldShowDebugInfo = () => {
  return !productionConfig.isProduction && !productionConfig.security.hideDebugInfoInProduction;
};

export const getEnvironmentInfo = () => {
  return {
    environment: process.env.NODE_ENV,
    isProduction: productionConfig.isProduction,
    buildTime: process.env.REACT_APP_BUILD_TIME || 'unknown',
    version: process.env.REACT_APP_VERSION || '1.0.0'
  };
};

export default productionConfig;
