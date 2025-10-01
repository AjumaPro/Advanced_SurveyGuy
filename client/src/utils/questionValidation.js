/**
 * Question Validation Utilities
 * Comprehensive validation for survey questions
 */

// Validation rules for different question types
export const questionValidationRules = {
  text: {
    required: ['title'],
    optional: ['description', 'placeholder', 'minLength', 'maxLength'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (question.settings?.minLength && question.settings?.maxLength) {
        if (question.settings.minLength > question.settings.maxLength) {
          errors.minLength = 'Minimum length cannot be greater than maximum length';
        }
      }
      
      return errors;
    }
  },

  textarea: {
    required: ['title'],
    optional: ['description', 'placeholder', 'minLength', 'maxLength', 'rows'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (question.settings?.rows && (question.settings.rows < 2 || question.settings.rows > 20)) {
        errors.rows = 'Rows must be between 2 and 20';
      }
      
      return errors;
    }
  },

  multiple_choice: {
    required: ['title', 'options'],
    optional: ['description', 'allowOther', 'randomizeOptions'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (!question.settings?.options || question.settings.options.length < 2) {
        errors.options = 'At least 2 options are required';
      }
      
      if (question.settings?.options) {
        const emptyOptions = question.settings.options.filter(opt => !opt?.trim());
        if (emptyOptions.length > 0) {
          errors.options = 'All options must have text';
        }
        
        const duplicateOptions = question.settings.options.filter((opt, index, arr) => 
          arr.indexOf(opt) !== index
        );
        if (duplicateOptions.length > 0) {
          errors.options = 'Options must be unique';
        }
      }
      
      return errors;
    }
  },

  checkbox: {
    required: ['title', 'options'],
    optional: ['description', 'allowOther', 'minSelections', 'maxSelections'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (!question.settings?.options || question.settings.options.length < 2) {
        errors.options = 'At least 2 options are required';
      }
      
      if (question.settings?.minSelections && question.settings?.maxSelections) {
        if (question.settings.minSelections > question.settings.maxSelections) {
          errors.minSelections = 'Minimum selections cannot be greater than maximum';
        }
      }
      
      if (question.settings?.maxSelections && question.settings?.options) {
        if (question.settings.maxSelections > question.settings.options.length) {
          errors.maxSelections = 'Maximum selections cannot exceed number of options';
        }
      }
      
      return errors;
    }
  },

  rating: {
    required: ['title', 'maxRating'],
    optional: ['description', 'allowHalf', 'labels'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (!question.settings?.maxRating || question.settings.maxRating < 2) {
        errors.maxRating = 'Maximum rating must be at least 2';
      }
      
      if (question.settings?.maxRating > 10) {
        errors.maxRating = 'Maximum rating cannot exceed 10';
      }
      
      return errors;
    }
  },

  emoji_scale: {
    required: ['title', 'scaleType'],
    optional: ['description', 'showLabels'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      const validScaleTypes = ['satisfaction', 'mood', 'agreement', 'experience', 'quality', 'difficulty', 'likelihood'];
      if (!question.settings?.scaleType || !validScaleTypes.includes(question.settings.scaleType)) {
        errors.scaleType = 'Valid scale type is required';
      }
      
      return errors;
    }
  },

  matrix: {
    required: ['title', 'rows', 'columns'],
    optional: ['description', 'scaleType', 'allowNA'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (!question.settings?.rows || question.settings.rows.length < 1) {
        errors.rows = 'At least 1 row is required';
      }
      
      if (!question.settings?.columns || question.settings.columns.length < 1) {
        errors.columns = 'At least 1 column is required';
      }
      
      if (question.settings?.rows) {
        const emptyRows = question.settings.rows.filter(row => !row?.trim());
        if (emptyRows.length > 0) {
          errors.rows = 'All rows must have text';
        }
      }
      
      if (question.settings?.columns) {
        const emptyColumns = question.settings.columns.filter(col => !col?.trim());
        if (emptyColumns.length > 0) {
          errors.columns = 'All columns must have text';
        }
      }
      
      return errors;
    }
  },

  slider: {
    required: ['title', 'min', 'max'],
    optional: ['description', 'step', 'showValue'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (question.settings?.min === undefined || question.settings?.max === undefined) {
        errors.range = 'Min and max values are required';
      }
      
      if (question.settings?.min >= question.settings?.max) {
        errors.min = 'Minimum value must be less than maximum value';
      }
      
      if (question.settings?.step && question.settings.step <= 0) {
        errors.step = 'Step value must be positive';
      }
      
      return errors;
    }
  },

  email: {
    required: ['title'],
    optional: ['description', 'placeholder'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      return errors;
    }
  },

  phone: {
    required: ['title'],
    optional: ['description', 'placeholder', 'format'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      return errors;
    }
  },

  date: {
    required: ['title'],
    optional: ['description', 'minDate', 'maxDate', 'format'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (question.settings?.minDate && question.settings?.maxDate) {
        const minDate = new Date(question.settings.minDate);
        const maxDate = new Date(question.settings.maxDate);
        
        if (minDate >= maxDate) {
          errors.minDate = 'Minimum date must be before maximum date';
        }
      }
      
      return errors;
    }
  },

  number: {
    required: ['title'],
    optional: ['description', 'min', 'max', 'step', 'placeholder'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (question.settings?.min !== undefined && question.settings?.max !== undefined) {
        if (question.settings.min >= question.settings.max) {
          errors.min = 'Minimum value must be less than maximum value';
        }
      }
      
      return errors;
    }
  },

  scale: {
    required: ['title', 'min', 'max'],
    optional: ['description', 'step', 'minLabel', 'maxLabel', 'labels'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (question.settings?.min === undefined || question.settings?.max === undefined) {
        errors.range = 'Min and max values are required';
      }
      
      if (question.settings?.min !== undefined && question.settings?.max !== undefined) {
        if (question.settings.min >= question.settings.max) {
          errors.min = 'Minimum must be less than maximum';
        }
      }
      
      return errors;
    }
  },

  ranking: {
    required: ['title', 'options'],
    optional: ['description', 'maxRank'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      if (!question.settings?.options || question.settings.options.length < 2) {
        errors.options = 'At least 2 options required for ranking';
      }
      
      if (question.settings?.maxRank && question.settings?.options) {
        if (question.settings.maxRank > question.settings.options.length) {
          errors.maxRank = 'Max rank cannot exceed number of options';
        }
      }
      
      return errors;
    }
  },

  yes_no: {
    required: ['title'],
    optional: ['description', 'yesLabel', 'noLabel', 'allowNA', 'naLabel'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      return errors;
    }
  },

  nps: {
    required: ['title'],
    optional: ['description', 'minLabel', 'maxLabel', 'question'],
    validate: (question) => {
      const errors = {};
      
      if (!question.title?.trim()) {
        errors.title = 'Question title is required';
      }
      
      return errors;
    }
  }
};

// Main validation function
export const validateQuestion = (question) => {
  if (!question) {
    return { isValid: false, errors: { general: 'Question data is required' } };
  }

  if (!question.type) {
    return { isValid: false, errors: { type: 'Question type is required' } };
  }

  const rules = questionValidationRules[question.type];
  if (!rules) {
    return { isValid: true, errors: {} }; // No validation rules defined
  }

  const errors = rules.validate(question);
  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
};

// Validate entire survey
export const validateSurvey = (survey) => {
  const errors = {};
  let isValid = true;

  // Survey-level validation
  if (!survey.title?.trim()) {
    errors.title = 'Survey title is required';
    isValid = false;
  }

  if (!survey.questions || survey.questions.length === 0) {
    errors.questions = 'At least one question is required';
    isValid = false;
  }

  // Question-level validation
  const questionErrors = {};
  if (survey.questions) {
    survey.questions.forEach((question, index) => {
      const validation = validateQuestion(question);
      if (!validation.isValid) {
        questionErrors[question.id || index] = validation.errors;
        isValid = false;
      }
    });
  }

  if (Object.keys(questionErrors).length > 0) {
    errors.questionErrors = questionErrors;
  }

  return { isValid, errors };
};

// Real-time validation for question editing
export const validateQuestionField = (question, field, value) => {
  const rules = questionValidationRules[question.type];
  if (!rules) return null;

  const tempQuestion = { ...question, [field]: value };
  const validation = rules.validate(tempQuestion);
  
  return validation.errors[field] || null;
};

// Get validation message for a specific field
export const getValidationMessage = (question, field) => {
  const validation = validateQuestion(question);
  return validation.errors[field] || null;
};

// Check if question is complete and ready to save
export const isQuestionComplete = (question) => {
  const validation = validateQuestion(question);
  return validation.isValid;
};

// Get completion percentage for a question
export const getQuestionCompletionPercentage = (question) => {
  const rules = questionValidationRules[question.type];
  if (!rules) return 100;

  const allFields = [...rules.required, ...rules.optional];
  const completedFields = allFields.filter(field => {
    if (field === 'options') {
      return question.settings?.options && question.settings.options.length > 0;
    }
    return question[field] || question.settings?.[field];
  });

  return Math.round((completedFields.length / allFields.length) * 100);
};

const questionValidation = {
  validateQuestion,
  validateSurvey,
  validateQuestionField,
  getValidationMessage,
  isQuestionComplete,
  getQuestionCompletionPercentage,
  questionValidationRules
};

export default questionValidation;
