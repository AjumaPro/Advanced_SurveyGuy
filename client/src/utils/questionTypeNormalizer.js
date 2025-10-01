/**
 * Question Type Normalizer
 * Standardizes question type names across the application
 * Handles legacy formats and converts to standard snake_case
 */

// Standard question type mapping
export const STANDARD_QUESTION_TYPES = {
  // Text Input Types
  'text': 'text',
  'short-text': 'text',
  'short_text': 'text',
  'textarea': 'textarea',
  'long-text': 'textarea',
  'long_text': 'textarea',
  'longtext': 'textarea',
  
  // Email & Phone
  'email': 'email',
  'email-address': 'email',
  'phone': 'phone',
  'tel': 'phone',
  'telephone': 'phone',
  'number': 'number',
  'numeric': 'number',
  
  // Choice Types
  'radio': 'radio',
  'single-choice': 'radio',
  'single_choice': 'radio',
  'singlechoice': 'radio',
  'multiple-choice': 'checkbox',
  'multiple_choice': 'checkbox',
  'multiplechoice': 'checkbox',
  'checkbox': 'checkbox',
  'checkboxes': 'checkbox',
  'dropdown': 'dropdown',
  'select': 'dropdown',
  'pulldown': 'dropdown',
  
  // Rating Types
  'rating': 'rating',
  'star-rating': 'rating',
  'star_rating': 'rating',
  'stars': 'rating',
  'scale': 'scale',
  'likert': 'scale',
  'likert-scale': 'scale',
  'likert_scale': 'scale',
  'nps': 'nps',
  'net-promoter-score': 'nps',
  'net_promoter_score': 'nps',
  
  // Emoji Types
  'emoji-scale': 'emoji_scale',
  'emoji_scale': 'emoji_scale',
  'emojiscale': 'emoji_scale',
  'emoji-satisfaction': 'emoji_satisfaction',
  'emoji_satisfaction': 'emoji_satisfaction',
  'emoji-agreement': 'emoji_agreement',
  'emoji_agreement': 'emoji_agreement',
  'emoji-quality': 'emoji_quality',
  'emoji_quality': 'emoji_quality',
  'emoji-mood': 'emoji_mood',
  'emoji_mood': 'emoji_mood',
  'emoji-difficulty': 'emoji_difficulty',
  'emoji_difficulty': 'emoji_difficulty',
  'emoji-likelihood': 'emoji_likelihood',
  'emoji_likelihood': 'emoji_likelihood',
  'emoji-custom': 'emoji_custom',
  'emoji_custom': 'emoji_custom',
  
  // SVG Emoji (map to regular emoji types)
  'svg-emoji-satisfaction': 'emoji_satisfaction',
  'svg_emoji_satisfaction': 'emoji_satisfaction',
  'svg-emoji-mood': 'emoji_mood',
  'svg_emoji_mood': 'emoji_mood',
  
  // Yes/No
  'yes-no': 'yes_no',
  'yes_no': 'yes_no',
  'yes/no': 'yes_no',
  'yesno': 'yes_no',
  'boolean': 'yes_no',
  'true-false': 'yes_no',
  'true_false': 'yes_no',
  'thumbs': 'yes_no',  // Legacy thumbs type
  
  // Advanced Types
  'matrix': 'matrix',
  'grid': 'matrix',
  'table': 'matrix',
  'ranking': 'ranking',
  'rank': 'ranking',
  'order': 'ranking',
  'slider': 'slider',
  'range': 'slider',
  'file': 'file',
  'upload': 'file',
  'file-upload': 'file',
  'file_upload': 'file',
  'image': 'file',
  'date': 'date',
  'datepicker': 'date',
  'time': 'time',
  'timepicker': 'time',
  'datetime': 'datetime',
  'date-time': 'datetime',
  'date_time': 'datetime'
};

/**
 * Normalize question type to standard format
 * @param {string} type - Question type in any format
 * @returns {string} - Standardized type name
 */
export const normalizeQuestionType = (type) => {
  if (!type) return 'text'; // Default to text if no type specified
  
  const normalized = type.toLowerCase().trim();
  return STANDARD_QUESTION_TYPES[normalized] || normalized;
};

/**
 * Normalize array of questions
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Questions with normalized types
 */
export const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];
  
  return questions.map(question => ({
    ...question,
    type: normalizeQuestionType(question.type)
  }));
};

/**
 * Normalize survey object
 * @param {Object} survey - Survey object with questions
 * @returns {Object} - Survey with normalized question types
 */
export const normalizeSurvey = (survey) => {
  if (!survey) return null;
  
  return {
    ...survey,
    questions: normalizeQuestions(survey.questions || [])
  };
};

/**
 * Check if two type names refer to the same type
 * @param {string} type1 - First type name
 * @param {string} type2 - Second type name
 * @returns {boolean} - True if they're the same type
 */
export const isSameQuestionType = (type1, type2) => {
  return normalizeQuestionType(type1) === normalizeQuestionType(type2);
};

/**
 * Get all supported question types
 * @returns {Array} - Array of standard type names
 */
export const getAllSupportedTypes = () => {
  return [...new Set(Object.values(STANDARD_QUESTION_TYPES))];
};

/**
 * Validate if type is supported
 * @param {string} type - Question type to validate
 * @returns {boolean} - True if type is supported
 */
export const isValidQuestionType = (type) => {
  const normalized = normalizeQuestionType(type);
  return getAllSupportedTypes().includes(normalized);
};

/**
 * Get legacy type names for a standard type
 * @param {string} standardType - Standard type name
 * @returns {Array} - Array of legacy type names
 */
export const getLegacyTypeNames = (standardType) => {
  return Object.entries(STANDARD_QUESTION_TYPES)
    .filter(([_, standard]) => standard === standardType)
    .map(([legacy, _]) => legacy);
};

export default {
  normalizeQuestionType,
  normalizeQuestions,
  normalizeSurvey,
  isSameQuestionType,
  getAllSupportedTypes,
  isValidQuestionType,
  getLegacyTypeNames,
  STANDARD_QUESTION_TYPES
};

