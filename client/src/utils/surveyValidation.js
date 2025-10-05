/**
 * Comprehensive Survey Validation System
 * Handles all survey validation logic and error handling
 */

// Validation rules for different question types
export const QUESTION_VALIDATION_RULES = {
  text: {
    required: (value) => value && value.trim().length > 0,
    minLength: (value, min) => !value || value.length >= min,
    maxLength: (value, max) => !value || value.length <= max,
    pattern: (value, regex) => !value || regex.test(value)
  },
  textarea: {
    required: (value) => value && value.trim().length > 0,
    minLength: (value, min) => !value || value.length >= min,
    maxLength: (value, max) => !value || value.length <= max
  },
  email: {
    required: (value) => value && value.trim().length > 0,
    format: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || emailRegex.test(value);
    }
  },
  phone: {
    required: (value) => value && value.trim().length > 0,
    format: (value) => {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return !value || phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    }
  },
  number: {
    required: (value) => value !== null && value !== undefined && value !== '',
    numeric: (value) => !value || !isNaN(Number(value)),
    min: (value, min) => !value || Number(value) >= min,
    max: (value, max) => !value || Number(value) <= max
  },
  rating: {
    required: (value) => value !== null && value !== undefined,
    range: (value, min = 1, max = 5) => !value || (value >= min && value <= max)
  },
  nps: {
    required: (value) => value !== null && value !== undefined,
    range: (value, min = 0, max = 10) => !value || (value >= min && value <= max)
  },
  star_rating: {
    required: (value) => value !== null && value !== undefined,
    range: (value, min = 1, max = 5) => !value || (value >= min && value <= max)
  },
  linear_scale: {
    required: (value) => value !== null && value !== undefined,
    range: (value, min = 1, max = 10) => !value || (value >= min && value <= max)
  },
  multiple_choice: {
    required: (value) => value !== null && value !== undefined && value !== '',
    validOption: (value, options) => !value || options.includes(value)
  },
  checkbox: {
    required: (value) => value && Array.isArray(value) && value.length > 0,
    validOptions: (value, options) => {
      if (!value || !Array.isArray(value)) return true;
      return value.every(option => options.includes(option));
    }
  },
  matrix: {
    required: (value) => value && typeof value === 'object' && Object.keys(value).length > 0,
    validStructure: (value, matrixConfig) => {
      if (!value || typeof value !== 'object') return true;
      // Validate matrix structure based on configuration
      return true; // Simplified for now
    }
  }
};

// Error messages for different validation failures
export const VALIDATION_ERROR_MESSAGES = {
  required: (fieldName) => `${fieldName} is required`,
  minLength: (fieldName, min) => `${fieldName} must be at least ${min} characters`,
  maxLength: (fieldName, max) => `${fieldName} must be no more than ${max} characters`,
  format: (fieldName) => `Please enter a valid ${fieldName}`,
  numeric: (fieldName) => `Please enter a valid number for ${fieldName}`,
  min: (fieldName, min) => `${fieldName} must be at least ${min}`,
  max: (fieldName, max) => `${fieldName} must be no more than ${max}`,
  range: (fieldName, min, max) => `${fieldName} must be between ${min} and ${max}`,
  validOption: (fieldName) => `Please select a valid option for ${fieldName}`,
  validOptions: (fieldName) => `Please select valid options for ${fieldName}`
};

/**
 * Validate a single question response
 * @param {Object} question - The question object
 * @param {*} value - The response value
 * @returns {Object} - Validation result { isValid: boolean, error: string|null }
 */
export const validateQuestion = (question, value) => {
  if (!question) {
    return { isValid: false, error: 'Invalid question' };
  }

  const { type, required, title, options, minLength, maxLength, min, max, pattern } = question;
  const fieldName = title || 'This field';
  const rules = QUESTION_VALIDATION_RULES[type];

  if (!rules) {
    return { isValid: true, error: null }; // Unknown type, skip validation
  }

  // Check required field
  if (required && rules.required && !rules.required(value)) {
    return { isValid: false, error: VALIDATION_ERROR_MESSAGES.required(fieldName) };
  }

  // Skip other validations if value is empty and not required
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return { isValid: true, error: null };
  }

  // Type-specific validations
  switch (type) {
    case 'text':
      if (minLength && rules.minLength && !rules.minLength(value, minLength)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.minLength(fieldName, minLength) };
      }
      if (maxLength && rules.maxLength && !rules.maxLength(value, maxLength)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.maxLength(fieldName, maxLength) };
      }
      if (pattern && rules.pattern && !rules.pattern(value, new RegExp(pattern))) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.format(fieldName) };
      }
      break;

    case 'textarea':
      if (minLength && rules.minLength && !rules.minLength(value, minLength)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.minLength(fieldName, minLength) };
      }
      if (maxLength && rules.maxLength && !rules.maxLength(value, maxLength)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.maxLength(fieldName, maxLength) };
      }
      break;

    case 'email':
      if (rules.format && !rules.format(value)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.format('email address') };
      }
      break;

    case 'phone':
      if (rules.format && !rules.format(value)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.format('phone number') };
      }
      break;

    case 'number':
      if (rules.numeric && !rules.numeric(value)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.numeric(fieldName) };
      }
      if (min !== undefined && rules.min && !rules.min(value, min)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.min(fieldName, min) };
      }
      if (max !== undefined && rules.max && !rules.max(value, max)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.max(fieldName, max) };
      }
      break;

    case 'rating':
      const ratingMin = question.options?.min || 1;
      const ratingMax = question.options?.max || 5;
      if (rules.range && !rules.range(value, ratingMin, ratingMax)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.range(fieldName, ratingMin, ratingMax) };
      }
      break;

    case 'nps':
      const npsMin = question.options?.min || 0;
      const npsMax = question.options?.max || 10;
      if (rules.range && !rules.range(value, npsMin, npsMax)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.range(fieldName, npsMin, npsMax) };
      }
      break;

    case 'star_rating':
      const starMin = 1;
      const starMax = question.options?.max || 5;
      if (rules.range && !rules.range(value, starMin, starMax)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.range(fieldName, starMin, starMax) };
      }
      break;

    case 'linear_scale':
      const linearMin = question.options?.min || 1;
      const linearMax = question.options?.max || 10;
      if (rules.range && !rules.range(value, linearMin, linearMax)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.range(fieldName, linearMin, linearMax) };
      }
      break;

    case 'multiple_choice':
      if (options && rules.validOption && !rules.validOption(value, options)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.validOption(fieldName) };
      }
      break;

    case 'checkbox':
      if (options && rules.validOptions && !rules.validOptions(value, options)) {
        return { isValid: false, error: VALIDATION_ERROR_MESSAGES.validOptions(fieldName) };
      }
      break;

    case 'matrix':
      if (rules.validStructure && !rules.validStructure(value, question.matrixConfig)) {
        return { isValid: false, error: `Please complete all required matrix fields` };
      }
      break;
  }

  return { isValid: true, error: null };
};

/**
 * Validate all responses for a survey
 * @param {Object} survey - The survey object
 * @param {Object} responses - The responses object
 * @returns {Object} - Validation result { isValid: boolean, errors: Object }
 */
export const validateSurvey = (survey, responses) => {
  if (!survey || !survey.questions) {
    return { isValid: false, errors: { general: 'Invalid survey data' } };
  }

  const errors = {};
  let isValid = true;

  // Validate each question
  survey.questions.forEach(question => {
    const response = responses[question.id];
    const validation = validateQuestion(question, response);

    if (!validation.isValid) {
      errors[question.id] = validation.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Get validation summary for a survey
 * @param {Object} survey - The survey object
 * @param {Object} responses - The responses object
 * @returns {Object} - Summary with completion stats
 */
export const getValidationSummary = (survey, responses) => {
  if (!survey || !survey.questions) {
    return { totalQuestions: 0, answeredQuestions: 0, requiredQuestions: 0, answeredRequired: 0 };
  }

  const totalQuestions = survey.questions.length;
  const answeredQuestions = Object.keys(responses).filter(key => {
    const value = responses[key];
    return value !== null && value !== undefined && value !== '' && 
           !(Array.isArray(value) && value.length === 0);
  }).length;

  const requiredQuestions = survey.questions.filter(q => q.required).length;
  const answeredRequired = survey.questions.filter(q => {
    if (!q.required) return false;
    const response = responses[q.id];
    return response !== null && response !== undefined && response !== '' && 
           !(Array.isArray(response) && response.length === 0);
  }).length;

  return {
    totalQuestions,
    answeredQuestions,
    requiredQuestions,
    answeredRequired,
    completionRate: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
    requiredCompletionRate: requiredQuestions > 0 ? Math.round((answeredRequired / requiredQuestions) * 100) : 0
  };
};

/**
 * Sanitize response data before submission
 * @param {Object} responses - The responses object
 * @returns {Object} - Sanitized responses
 */
export const sanitizeResponses = (responses) => {
  const sanitized = {};
  
  Object.keys(responses).forEach(key => {
    let value = responses[key];
    
    // Handle different data types
    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') value = null;
    } else if (Array.isArray(value)) {
      value = value.filter(item => item !== null && item !== undefined && item !== '');
      if (value.length === 0) value = null;
    } else if (value === '' || value === undefined) {
      value = null;
    }
    
    sanitized[key] = value;
  });
  
  return sanitized;
};

export default {
  validateQuestion,
  validateSurvey,
  getValidationSummary,
  sanitizeResponses,
  QUESTION_VALIDATION_RULES,
  VALIDATION_ERROR_MESSAGES
};
