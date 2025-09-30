// Question Types Configuration
export const QUESTION_TYPES = {
  // Text Input Types
  text: {
    type: 'text',
    name: 'Short Text',
    description: 'Single line text input',
    category: 'Text Input',
    icon: '📝',
    planRequired: null,
    settings: {
      placeholder: 'Enter your answer...',
      maxLength: 255,
      validation: {
        required: false,
        minLength: 0,
        maxLength: 255
      }
    }
  },
  textarea: {
    type: 'textarea',
    name: 'Long Text',
    description: 'Multi-line text input',
    category: 'Text Input',
    icon: '📄',
    planRequired: null,
    settings: {
      placeholder: 'Enter your detailed answer...',
      rows: 4,
      maxLength: 2000,
      validation: {
        required: false,
        minLength: 0,
        maxLength: 2000
      }
    }
  },
  email: {
    type: 'email',
    name: 'Email Address',
    description: 'Email input with validation',
    category: 'Text Input',
    icon: '📧',
    planRequired: null,
    settings: {
      placeholder: 'example@email.com',
      validation: {
        required: false,
        format: 'email'
      }
    }
  },
  number: {
    type: 'number',
    name: 'Number',
    description: 'Numeric input',
    category: 'Text Input',
    icon: '🔢',
    planRequired: null,
    settings: {
      placeholder: 'Enter a number...',
      min: null,
      max: null,
      step: 1,
      validation: {
        required: false,
        min: null,
        max: null
      }
    }
  },

  // Choice Types
  radio: {
    type: 'radio',
    name: 'Single Choice',
    description: 'Select one option from multiple choices',
    category: 'Choice',
    icon: '🔘',
    planRequired: null,
    settings: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      allowOther: false,
      otherText: 'Other',
      randomize: false,
      validation: {
        required: false
      }
    }
  },
  checkbox: {
    type: 'checkbox',
    name: 'Multiple Choice',
    description: 'Select multiple options',
    category: 'Choice',
    icon: '☑️',
    planRequired: null,
    settings: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      allowOther: false,
      otherText: 'Other',
      randomize: false,
      minSelections: 1,
      maxSelections: null,
      validation: {
        required: false,
        minSelections: 1,
        maxSelections: null
      }
    }
  },
  dropdown: {
    type: 'dropdown',
    name: 'Dropdown',
    description: 'Select from dropdown menu',
    category: 'Choice',
    icon: '📋',
    planRequired: null,
    settings: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      placeholder: 'Select an option...',
      allowSearch: false,
      validation: {
        required: false
      }
    }
  },

  // Rating & Scale Types
  rating: {
    type: 'rating',
    name: 'Star Rating',
    description: 'Rate using stars (1-5)',
    category: 'Rating & Scale',
    icon: '⭐',
    planRequired: null,
    settings: {
      scale: 5,
      labels: {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      },
      validation: {
        required: false
      }
    }
  },
  emoji_satisfaction: {
    type: 'emoji_satisfaction',
    name: 'Emoji Satisfaction',
    description: 'Rate satisfaction using emoji faces',
    category: 'Emoji & Visual',
    icon: '😊',
    planRequired: null,
    settings: {
      scale: 5,
      emojis: ['😞', '😐', '🙂', '😊', '😍'],
      labels: {
        1: 'Very Dissatisfied',
        2: 'Dissatisfied', 
        3: 'Neutral',
        4: 'Satisfied',
        5: 'Very Satisfied'
      },
      validation: {
        required: false
      }
    }
  },
  emoji_agreement: {
    type: 'emoji_agreement',
    name: 'Emoji Agreement',
    description: 'Show agreement level with emojis',
    category: 'Emoji & Visual',
    icon: '👍',
    planRequired: null,
    settings: {
      scale: 5,
      emojis: ['👎', '😕', '😐', '👍', '💯'],
      labels: {
        1: 'Strongly Disagree',
        2: 'Disagree',
        3: 'Neutral',
        4: 'Agree',
        5: 'Strongly Agree'
      },
      validation: {
        required: false
      }
    }
  },
  emoji_quality: {
    type: 'emoji_quality',
    name: 'Emoji Quality',
    description: 'Rate quality with fun emojis',
    category: 'Emoji & Visual',
    icon: '⭐',
    planRequired: null,
    settings: {
      scale: 4,
      emojis: ['💩', '👎', '👍', '⭐'],
      labels: {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Excellent'
      },
      validation: {
        required: false
      }
    }
  },
  emoji_mood: {
    type: 'emoji_mood',
    name: 'Emoji Mood',
    description: 'Capture mood with expressive emojis',
    category: 'Emoji & Visual',
    icon: '😄',
    planRequired: null,
    settings: {
      scale: 7,
      emojis: ['😭', '😢', '😔', '😐', '🙂', '😊', '😄'],
      labels: {
        1: 'Very Sad',
        2: 'Sad',
        3: 'Disappointed',
        4: 'Neutral',
        5: 'Happy',
        6: 'Very Happy',
        7: 'Ecstatic'
      },
      validation: {
        required: false
      }
    }
  },
  emoji_difficulty: {
    type: 'emoji_difficulty',
    name: 'Emoji Difficulty',
    description: 'Rate difficulty level with emojis',
    category: 'Emoji & Visual',
    icon: '🤯',
    planRequired: null,
    settings: {
      scale: 4,
      emojis: ['😴', '😌', '😰', '🤯'],
      labels: {
        1: 'Very Easy',
        2: 'Easy',
        3: 'Hard',
        4: 'Very Hard'
      },
      validation: {
        required: false
      }
    }
  },
  emoji_likelihood: {
    type: 'emoji_likelihood',
    name: 'Emoji Likelihood',
    description: 'Show likelihood with visual emojis',
    category: 'Emoji & Visual',
    icon: '✅',
    planRequired: 'pro',
    settings: {
      scale: 4,
      emojis: ['❌', '🤔', '✅', '💯'],
      labels: {
        1: 'Never',
        2: 'Maybe',
        3: 'Likely',
        4: 'Definitely'
      },
      validation: {
        required: false
      }
    }
  },
  emoji_scale: {
    type: 'emoji_scale',
    name: 'Emoji Scale',
    description: 'Rate using emoji expressions',
    category: 'Emoji & Visual',
    icon: '😊',
    planRequired: null,
    settings: {
      scale: 5,
      showLabels: true,
      validation: {
        required: false
      }
    }
  },
  emoji_custom: {
    type: 'emoji_custom',
    name: 'Custom Emoji Scale',
    description: 'Create your own emoji rating scale with SVG emojis',
    category: 'Emoji & Visual',
    icon: '🎨',
    planRequired: 'pro',
    settings: {
      scale: 5,
      useSVGEmojis: true,
      svgEmojiType: 'satisfaction',
      emojiSize: 'md',
      showLabels: true,
      allowCustomEmojis: true,
      validation: {
        required: false
      }
    }
  },
  svg_emoji_satisfaction: {
    type: 'svg_emoji_satisfaction',
    name: 'SVG Emoji Satisfaction',
    description: 'Beautiful SVG emoji satisfaction scale',
    category: 'Interactive',
    icon: '😊',
    planRequired: 'pro',
    settings: {
      scale: 5,
      useSVGEmojis: true,
      svgEmojiType: 'satisfaction',
      emojiSize: 'lg',
      showLabels: true,
      validation: {
        required: false
      }
    }
  },
  svg_emoji_mood: {
    type: 'svg_emoji_mood',
    name: 'SVG Emoji Mood',
    description: 'Interactive SVG emoji mood tracker',
    category: 'Interactive',
    icon: '😄',
    planRequired: 'pro',
    settings: {
      scale: 5,
      useSVGEmojis: true,
      svgEmojiType: 'mood',
      emojiSize: 'lg',
      showLabels: true,
      validation: {
        required: false
      }
    }
  },
  scale: {
    type: 'scale',
    name: 'Likert Scale',
    description: 'Rate on a scale (1-10)',
    category: 'Rating & Scale',
    icon: '📊',
    planRequired: 'pro',
    settings: {
      min: 1,
      max: 10,
      minLabel: 'Strongly Disagree',
      maxLabel: 'Strongly Agree',
      step: 1,
      validation: {
        required: false
      }
    }
  },
  nps: {
    type: 'nps',
    name: 'NPS Score',
    description: 'Net Promoter Score (0-10)',
    category: 'Rating & Scale',
    icon: '📈',
    planRequired: 'pro',
    settings: {
      minLabel: 'Not at all likely',
      maxLabel: 'Extremely likely',
      question: 'How likely are you to recommend this to a friend?',
      validation: {
        required: false
      }
    }
  },

  // Advanced Types
  matrix: {
    type: 'matrix',
    name: 'Matrix Question',
    description: 'Rate multiple items on the same scale',
    category: 'Advanced',
    icon: '📋',
    planRequired: 'enterprise',
    settings: {
      rows: ['Item 1', 'Item 2', 'Item 3'],
      columns: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
      type: 'radio', // radio or checkbox
      validation: {
        required: false
      }
    }
  },
  ranking: {
    type: 'ranking',
    name: 'Ranking',
    description: 'Rank items in order of preference',
    category: 'Advanced',
    icon: '🏆',
    planRequired: 'enterprise',
    settings: {
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      validation: {
        required: false
      }
    }
  },
  slider: {
    type: 'slider',
    name: 'Slider',
    description: 'Select value using a slider',
    category: 'Advanced',
    icon: '🎚️',
    planRequired: 'enterprise',
    settings: {
      min: 0,
      max: 100,
      step: 1,
      minLabel: 'Minimum',
      maxLabel: 'Maximum',
      showValue: true,
      validation: {
        required: false
      }
    }
  },
  file: {
    type: 'file',
    name: 'File Upload',
    description: 'Upload files or images',
    category: 'Advanced',
    icon: '📎',
    planRequired: 'enterprise',
    settings: {
      acceptedTypes: ['image/*', '.pdf', '.doc', '.docx'],
      maxFileSize: 10, // MB
      maxFiles: 1,
      validation: {
        required: false
      }
    }
  },
  date: {
    type: 'date',
    name: 'Date',
    description: 'Select a date',
    category: 'Advanced',
    icon: '📅',
    planRequired: 'enterprise',
    settings: {
      minDate: null,
      maxDate: null,
      format: 'YYYY-MM-DD',
      validation: {
        required: false
      }
    }
  },
  time: {
    type: 'time',
    name: 'Time',
    description: 'Select a time',
    category: 'Advanced',
    icon: '⏰',
    planRequired: 'enterprise',
    settings: {
      format: '24h', // 12h or 24h
      step: 15, // minutes
      validation: {
        required: false
      }
    }
  },
  datetime: {
    type: 'datetime',
    name: 'Date & Time',
    description: 'Select date and time',
    category: 'Advanced',
    icon: '📅',
    planRequired: 'enterprise',
    settings: {
      minDate: null,
      maxDate: null,
      format: 'YYYY-MM-DD HH:mm',
      validation: {
        required: false
      }
    }
  }
};

// Get question type configuration
export const getQuestionType = (type) => {
  return QUESTION_TYPES[type] || null;
};

// Get all question types
export const getAllQuestionTypes = () => {
  return Object.values(QUESTION_TYPES);
};

// Get question types by category
export const getQuestionTypesByCategory = (category) => {
  return Object.values(QUESTION_TYPES).filter(type => 
    type.category.toLowerCase().includes(category.toLowerCase())
  );
};

// Get question types by plan
export const getQuestionTypesByPlan = (plan, userRole = 'user') => {
  // Super admins get all question types
  if (userRole === 'super_admin') return Object.values(QUESTION_TYPES);
  
  const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
  const userPlanLevel = planHierarchy[plan] || 0;
  
  return Object.values(QUESTION_TYPES).filter(type => {
    if (!type.planRequired) return true;
    const requiredPlanLevel = planHierarchy[type.planRequired] || 0;
    return userPlanLevel >= requiredPlanLevel;
  });
};

// Get default question settings
export const getDefaultQuestionSettings = (type) => {
  const questionType = getQuestionType(type);
  return questionType ? { ...questionType.settings } : {};
};

export const getDefaultOptions = (questionType) => {
  switch (questionType) {
    case 'multiple_choice':
    case 'checkbox':
    case 'dropdown':
      return ['Option 1', 'Option 2', 'Option 3'];
    case 'rating':
      return ['1', '2', '3', '4', '5'];
    case 'emoji_scale':
      return [
        { emoji: '😠', label: 'Very Unsatisfied', value: 1 },
        { emoji: '😞', label: 'Unsatisfied', value: 2 },
        { emoji: '😐', label: 'Neutral', value: 3 },
        { emoji: '🙂', label: 'Satisfied', value: 4 },
        { emoji: '😊', label: 'Very Satisfied', value: 5 }
      ];
    case 'yes_no':
      return ['Yes', 'No'];
    default:
      return [];
  }
};

// Validate question settings
export const validateQuestionSettings = (question) => {
  const errors = [];
  const questionType = getQuestionType(question.type);
  
  if (!questionType) {
    errors.push('Invalid question type');
    return errors;
  }

  // Check required fields
  if (!question.title || question.title.trim() === '') {
    errors.push('Question title is required');
  }

  // Type-specific validation
  switch (question.type) {
    case 'radio':
    case 'checkbox':
    case 'dropdown':
      if (!question.settings.options || question.settings.options.length < 2) {
        errors.push('At least 2 options are required');
      }
      break;
      
    case 'rating':
      if (question.settings.scale < 1 || question.settings.scale > 10) {
        errors.push('Rating scale must be between 1 and 10');
      }
      break;
      
    case 'scale':
      if (question.settings.min >= question.settings.max) {
        errors.push('Minimum value must be less than maximum value');
      }
      break;
      
    case 'matrix':
      if (!question.settings.rows || question.settings.rows.length < 1) {
        errors.push('At least 1 row is required for matrix questions');
      }
      if (!question.settings.columns || question.settings.columns.length < 2) {
        errors.push('At least 2 columns are required for matrix questions');
      }
      break;
      
    case 'ranking':
      if (!question.settings.options || question.settings.options.length < 2) {
        errors.push('At least 2 options are required for ranking');
      }
      break;
      
    case 'file':
      if (question.settings.maxFileSize > 100) {
        errors.push('Maximum file size cannot exceed 100MB');
      }
      break;
      
    default:
      // No specific validation for other question types
      break;
  }

  return errors;
};

// Check if user has access to question type
export const hasAccessToQuestionType = (type, userPlan, userRole = 'user') => {
  // Super admins have access to all question types
  if (userRole === 'super_admin') return true;
  
  const questionType = getQuestionType(type);
  if (!questionType || !questionType.planRequired) return true;
  
  const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
  const userPlanLevel = planHierarchy[userPlan] || 0;
  const requiredPlanLevel = planHierarchy[questionType.planRequired] || 0;
  
  return userPlanLevel >= requiredPlanLevel;
};

// Emoji scales for rating questions
export const emojiScales = {
  satisfaction: ['😞', '😐', '😊', '😍'],
  agreement: ['👎', '😐', '👍', '💯'],
  quality: ['💩', '👎', '👍', '⭐'],
  difficulty: ['😴', '😌', '😰', '🤯'],
  likelihood: ['❌', '🤔', '✅', '💯'],
  custom: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
};

// Legacy export alias for backward compatibility
export const questionTypes = QUESTION_TYPES;

// Generate question preview text
export const generateQuestionPreview = (question) => {
  const questionType = getQuestionType(question.type);
  if (!questionType) return 'Invalid question type';
  
  let preview = `${questionType.name}`;
  
  switch (question.type) {
    case 'radio':
    case 'checkbox':
    case 'dropdown':
      if (question.settings.options) {
        preview += ` (${question.settings.options.length} options)`;
      }
      break;
      
    case 'rating':
      if (question.settings.scale) {
        preview += ` (1-${question.settings.scale})`;
      }
      break;
      
    case 'scale':
      if (question.settings.min && question.settings.max) {
        preview += ` (${question.settings.min}-${question.settings.max})`;
      }
      break;
      
    case 'matrix':
      if (question.settings.rows && question.settings.columns) {
        preview += ` (${question.settings.rows.length}×${question.settings.columns.length})`;
      }
      break;
    default:
      // No additional preview info for other types
      break;
  }
  
  return preview;
};