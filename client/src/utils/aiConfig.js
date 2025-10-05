/**
 * AI Configuration Utility
 * Centralized configuration for AI features
 */

export const AIConfig = {
  // Feature flags
  ENABLE_AI_FEATURES: process.env.REACT_APP_ENABLE_AI_FEATURES === 'true',
  AI_FALLBACK_MODE: process.env.REACT_APP_AI_FALLBACK_MODE === 'true',
  
  // OpenAI Configuration
  OPENAI: {
    API_KEY: process.env.REACT_APP_OPENAI_API_KEY,
    MODEL: process.env.REACT_APP_OPENAI_MODEL || 'gpt-4',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7
  },
  
  // Browser-based Sentiment Analysis (always available)
  SENTIMENT: {
    ENABLED: true,
    SOURCE: 'browser'
  },
  
  // Default settings
  DEFAULTS: {
    QUESTION_COUNT: 5,
    MAX_QUESTIONS: 15,
    CLUSTERS: 3,
    MAX_CLUSTERS: 10,
    CONFIDENCE_THRESHOLD: 0.7
  }
};

// Validation functions
export const validateAIConfig = () => {
  const errors = [];
  
  if (AIConfig.ENABLE_AI_FEATURES) {
    if (!AIConfig.OPENAI.API_KEY) {
      errors.push('OpenAI API key is required for AI features');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
};

// Check if AI services are available
export const isAIAvailable = () => {
  const validation = validateAIConfig();
  return validation.isValid && AIConfig.ENABLE_AI_FEATURES;
};

// Get AI service status
export const getAIStatus = () => {
  const validation = validateAIConfig();
  const status = {
    enabled: AIConfig.ENABLE_AI_FEATURES,
    openai: !!AIConfig.OPENAI.API_KEY,
    sentiment: AIConfig.SENTIMENT.ENABLED,
    fallback: AIConfig.AI_FALLBACK_MODE
  };
  
  return {
    ...status,
    available: status.enabled && (status.openai || status.sentiment),
    errors: validation.errors
  };
};

// Log AI configuration status
export const logAIConfig = () => {
  const status = getAIStatus();
  console.log('🤖 AI Configuration Status:', status);
  
  if (!status.enabled) {
    console.log('ℹ️ AI features are disabled. Set REACT_APP_ENABLE_AI_FEATURES=true to enable.');
  } else if (!status.available) {
    console.log('⚠️ AI features enabled but no valid API keys found. Using fallback mode.');
  } else {
    console.log('✅ AI features are properly configured and available.');
    console.log(`📊 OpenAI: ${status.openai ? '✅ Connected' : '❌ Not configured'}`);
    console.log(`💭 Sentiment Analysis: ${status.sentiment ? '✅ Browser-based' : '❌ Not available'}`);
  }
  
  return status;
};

export default AIConfig;
