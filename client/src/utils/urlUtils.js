/**
 * URL utility functions for consistent URL generation across the application
 */

/**
 * Get the correct base URL for the current environment
 * @returns {string} The base URL for the current environment
 */
export const getBaseUrl = () => {
  // Check if we're in production
  if (window.location.hostname === 'ajumapro.com') {
    return 'https://ajumapro.com';
  }
  // For local development or other domains
  return window.location.origin;
};

/**
 * Generate a survey URL
 * @param {string} surveyId - The survey ID
 * @returns {string} The full survey URL
 */
export const getSurveyUrl = (surveyId) => {
  return `${getBaseUrl()}/survey/${surveyId}`;
};

/**
 * Generate a short survey URL
 * @param {string} surveyId - The survey ID
 * @returns {string} The short survey URL
 */
export const getShortSurveyUrl = (surveyId) => {
  return `${getBaseUrl()}/s/${surveyId}`;
};

/**
 * Generate a survey preview URL
 * @param {string} surveyId - The survey ID
 * @returns {string} The survey preview URL
 */
export const getSurveyPreviewUrl = (surveyId) => {
  return `${getBaseUrl()}/preview/${surveyId}`;
};

/**
 * Generate an event URL
 * @param {string} eventId - The event ID
 * @returns {string} The event URL
 */
export const getEventUrl = (eventId) => {
  return `${getBaseUrl()}/events/${eventId}`;
};

/**
 * Generate an analytics URL
 * @param {string} surveyId - The survey ID
 * @returns {string} The analytics URL
 */
export const getAnalyticsUrl = (surveyId) => {
  return `${getBaseUrl()}/analytics/${surveyId}`;
};

/**
 * Generate a password update redirect URL
 * @returns {string} The password update URL
 */
export const getPasswordUpdateUrl = () => {
  return `${getBaseUrl()}/update-password`;
};

/**
 * Generate an invitation link URL
 * @param {string} invitationId - The invitation ID
 * @returns {string} The invitation URL
 */
export const getInvitationUrl = (invitationId) => {
  return `${getBaseUrl()}/survey/invite/${invitationId}`;
};
