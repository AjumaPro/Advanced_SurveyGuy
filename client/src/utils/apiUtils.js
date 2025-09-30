// API Utility Functions
export const apiUtils = {
  // Base API configuration
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  },

  // Set auth token
  setAuthToken: (token, remember = false) => {
    if (remember) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  },

  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  // Build headers with auth
  buildHeaders: (customHeaders = {}) => {
    const token = apiUtils.getAuthToken();
    return {
      ...apiUtils.defaultHeaders,
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...customHeaders
    };
  },

  // Generic API request
  request: async (endpoint, options = {}) => {
    const url = `${apiUtils.baseURL}${endpoint}`;
    const config = {
      headers: apiUtils.buildHeaders(options.headers),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // GET request
  get: (endpoint, options = {}) => {
    return apiUtils.request(endpoint, { ...options, method: 'GET' });
  },

  // POST request
  post: (endpoint, data, options = {}) => {
    return apiUtils.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // PUT request
  put: (endpoint, data, options = {}) => {
    return apiUtils.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // PATCH request
  patch: (endpoint, data, options = {}) => {
    return apiUtils.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // DELETE request
  delete: (endpoint, options = {}) => {
    return apiUtils.request(endpoint, { ...options, method: 'DELETE' });
  },

  // Upload file
  uploadFile: async (endpoint, file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = `${apiUtils.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: {
        ...(apiUtils.getAuthToken() && { 'Authorization': `Bearer ${apiUtils.getAuthToken()}` })
      },
      body: formData,
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  },

  // Download file
  downloadFile: async (endpoint, filename, options = {}) => {
    const url = `${apiUtils.baseURL}${endpoint}`;
    const config = {
      headers: apiUtils.buildHeaders(options.headers),
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('File download failed:', error);
      throw error;
    }
  }
};

// Survey-specific API functions
export const surveyAPI = {
  // Get all surveys
  getSurveys: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiUtils.get(`/surveys${queryString ? `?${queryString}` : ''}`);
  },

  // Get survey by ID
  getSurvey: (id) => {
    return apiUtils.get(`/surveys/${id}`);
  },

  // Create survey
  createSurvey: (surveyData) => {
    return apiUtils.post('/surveys', surveyData);
  },

  // Update survey
  updateSurvey: (id, surveyData) => {
    return apiUtils.put(`/surveys/${id}`, surveyData);
  },

  // Delete survey
  deleteSurvey: (id) => {
    return apiUtils.delete(`/surveys/${id}`);
  },

  // Publish survey
  publishSurvey: (id) => {
    return apiUtils.post(`/surveys/${id}/publish`);
  },

  // Unpublish survey
  unpublishSurvey: (id) => {
    return apiUtils.post(`/surveys/${id}/unpublish`);
  },

  // Get survey responses
  getResponses: (surveyId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiUtils.get(`/surveys/${surveyId}/responses${queryString ? `?${queryString}` : ''}`);
  },

  // Get survey analytics
  getAnalytics: (surveyId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiUtils.get(`/surveys/${surveyId}/analytics${queryString ? `?${queryString}` : ''}`);
  },

  // Export survey data
  exportSurvey: (surveyId, format = 'json') => {
    return apiUtils.get(`/surveys/${surveyId}/export?format=${format}`);
  },

  // Duplicate survey
  duplicateSurvey: (id) => {
    return apiUtils.post(`/surveys/${id}/duplicate`);
  }
};

// User-specific API functions
export const userAPI = {
  // Get user profile
  getProfile: () => {
    return apiUtils.get('/user/profile');
  },

  // Update user profile
  updateProfile: (profileData) => {
    return apiUtils.put('/user/profile', profileData);
  },

  // Change password
  changePassword: (passwordData) => {
    return apiUtils.post('/user/change-password', passwordData);
  },

  // Get user settings
  getSettings: () => {
    return apiUtils.get('/user/settings');
  },

  // Update user settings
  updateSettings: (settingsData) => {
    return apiUtils.put('/user/settings', settingsData);
  },

  // Get user statistics
  getStats: () => {
    return apiUtils.get('/user/stats');
  }
};

// Template-specific API functions
export const templateAPI = {
  // Get all templates
  getTemplates: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiUtils.get(`/templates${queryString ? `?${queryString}` : ''}`);
  },

  // Get template by ID
  getTemplate: (id) => {
    return apiUtils.get(`/templates/${id}`);
  },

  // Create template from survey
  createTemplate: (surveyId, templateData) => {
    return apiUtils.post(`/templates/from-survey/${surveyId}`, templateData);
  },

  // Use template
  useTemplate: (templateId, surveyData = {}) => {
    return apiUtils.post(`/templates/${templateId}/use`, surveyData);
  }
};

// Analytics-specific API functions
export const analyticsAPI = {
  // Get dashboard analytics
  getDashboardAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiUtils.get(`/analytics/dashboard${queryString ? `?${queryString}` : ''}`);
  },

  // Get survey insights
  getSurveyInsights: (surveyId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiUtils.get(`/analytics/surveys/${surveyId}/insights${queryString ? `?${queryString}` : ''}`);
  },

  // Get AI insights
  getAIInsights: (surveyId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiUtils.get(`/analytics/surveys/${surveyId}/ai-insights${queryString ? `?${queryString}` : ''}`);
  },

  // Generate report
  generateReport: (surveyId, reportConfig) => {
    return apiUtils.post(`/analytics/surveys/${surveyId}/reports`, reportConfig);
  }
};

// Integration-specific API functions
export const integrationAPI = {
  // Get integrations
  getIntegrations: () => {
    return apiUtils.get('/integrations');
  },

  // Connect integration
  connectIntegration: (integrationId, config) => {
    return apiUtils.post(`/integrations/${integrationId}/connect`, config);
  },

  // Disconnect integration
  disconnectIntegration: (integrationId) => {
    return apiUtils.post(`/integrations/${integrationId}/disconnect`);
  },

  // Test integration
  testIntegration: (integrationId) => {
    return apiUtils.post(`/integrations/${integrationId}/test`);
  }
};

// Webhook-specific API functions
export const webhookAPI = {
  // Get webhooks
  getWebhooks: (surveyId) => {
    return apiUtils.get(`/surveys/${surveyId}/webhooks`);
  },

  // Create webhook
  createWebhook: (surveyId, webhookData) => {
    return apiUtils.post(`/surveys/${surveyId}/webhooks`, webhookData);
  },

  // Update webhook
  updateWebhook: (surveyId, webhookId, webhookData) => {
    return apiUtils.put(`/surveys/${surveyId}/webhooks/${webhookId}`, webhookData);
  },

  // Delete webhook
  deleteWebhook: (surveyId, webhookId) => {
    return apiUtils.delete(`/surveys/${surveyId}/webhooks/${webhookId}`);
  },

  // Test webhook
  testWebhook: (surveyId, webhookId) => {
    return apiUtils.post(`/surveys/${surveyId}/webhooks/${webhookId}/test`);
  }
};

// Error handling utilities
export const errorUtils = {
  // Handle API errors
  handleError: (error, defaultMessage = 'An error occurred') => {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error: Please check your connection';
    } else {
      // Something else happened
      return error.message || defaultMessage;
    }
  },

  // Check if error is authentication related
  isAuthError: (error) => {
    return error.response?.status === 401 || error.response?.status === 403;
  },

  // Check if error is network related
  isNetworkError: (error) => {
    return !error.response && error.request;
  }
};

// Cache utilities
export const cacheUtils = {
  // Set cache
  set: (key, data, ttl = 300000) => { // 5 minutes default
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  },

  // Get cache
  get: (key) => {
    try {
      const item = JSON.parse(localStorage.getItem(`cache_${key}`));
      if (!item) return null;
      
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return item.data;
    } catch (error) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
  },

  // Clear cache
  clear: (key) => {
    localStorage.removeItem(`cache_${key}`);
  },

  // Clear all cache
  clearAll: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

export default {
  apiUtils,
  surveyAPI,
  userAPI,
  templateAPI,
  analyticsAPI,
  integrationAPI,
  webhookAPI,
  errorUtils,
  cacheUtils
};

