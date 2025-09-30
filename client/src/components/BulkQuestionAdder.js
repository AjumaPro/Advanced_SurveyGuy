import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  CheckCircle,
  Star,
  Sparkles,
  Hash,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  Heart,
  ShoppingCart,
  GraduationCap,
  Building,
  Target,
  X,
  Zap,
  Crown,
  BookOpen,
  Clock,
  BarChart3,
  ThumbsUp,
  MessageSquare,
  Image,
  Upload,
  Grid,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';

const BulkQuestionAdder = ({ onAddQuestions, onClose, isOpen }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customQuestions, setCustomQuestions] = useState('');
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  // Predefined question templates
  const questionTemplates = [
    {
      id: 'feedback-set',
      name: 'Customer Feedback Set',
      description: 'Complete feedback collection suite',
      icon: <ThumbsUp className="w-5 h-5" />,
      color: 'blue',
      questions: [
        { type: 'emoji_scale', title: 'How satisfied are you with our service?', required: true },
        { type: 'multiple_choice', title: 'How did you hear about us?', options: ['Social Media', 'Search Engine', 'Referral', 'Advertisement', 'Other'], required: false },
        { type: 'text', title: 'What could we improve?', required: false },
        { type: 'rating', title: 'Rate your overall experience', required: true }
      ]
    },
    {
      id: 'demographics',
      name: 'Demographics Collection',
      description: 'Essential demographic information',
      icon: <Users className="w-5 h-5" />,
      color: 'green',
      questions: [
        { type: 'multiple_choice', title: 'What is your age range?', options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'], required: true },
        { type: 'multiple_choice', title: 'What is your gender?', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'], required: false },
        { type: 'multiple_choice', title: 'What is your highest education level?', options: ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Other'], required: false },
        { type: 'text', title: 'What is your occupation?', required: false }
      ]
    },
    {
      id: 'event-survey',
      name: 'Event Feedback',
      description: 'Comprehensive event evaluation',
      icon: <Calendar className="w-5 h-5" />,
      color: 'purple',
      questions: [
        { type: 'emoji_scale', title: 'How would you rate this event?', required: true },
        { type: 'multiple_choice', title: 'What was your favorite part?', options: ['Keynote Speaker', 'Networking', 'Workshops', 'Food & Beverages', 'Venue', 'Other'], required: false },
        { type: 'rating', title: 'Rate the event organization', required: true },
        { type: 'text', title: 'What would you like to see at future events?', required: false },
        { type: 'multiple_choice', title: 'Would you attend again?', options: ['Definitely', 'Probably', 'Maybe', 'Probably not', 'Definitely not'], required: true }
      ]
    },
    {
      id: 'product-research',
      name: 'Product Research',
      description: 'Product feedback and market research',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'orange',
      questions: [
        { type: 'multiple_choice', title: 'Have you used our product before?', options: ['Yes, regularly', 'Yes, occasionally', 'No, but I\'m interested', 'No, not interested'], required: true },
        { type: 'rating', title: 'How likely are you to recommend our product?', required: true },
        { type: 'multiple_choice', title: 'What features do you value most?', options: ['Ease of use', 'Performance', 'Price', 'Customer support', 'Design', 'All of the above'], required: false },
        { type: 'text', title: 'What other products do you use for this purpose?', required: false },
        { type: 'emoji_scale', title: 'How would you describe your experience?', required: true }
      ]
    },
    {
      id: 'employee-satisfaction',
      name: 'Employee Satisfaction',
      description: 'Workplace satisfaction and engagement',
      icon: <Building className="w-5 h-5" />,
      color: 'indigo',
      questions: [
        { type: 'emoji_scale', title: 'How satisfied are you with your current role?', required: true },
        { type: 'rating', title: 'Rate your work-life balance', required: true },
        { type: 'multiple_choice', title: 'What motivates you most at work?', options: ['Recognition', 'Growth opportunities', 'Compensation', 'Team collaboration', 'Challenging projects', 'Work flexibility'], required: false },
        { type: 'text', title: 'What would improve your work experience?', required: false },
        { type: 'multiple_choice', title: 'How often do you feel recognized for your work?', options: ['Very often', 'Often', 'Sometimes', 'Rarely', 'Never'], required: false }
      ]
    },
    {
      id: 'academic-evaluation',
      name: 'Academic Evaluation',
      description: 'Educational assessment and feedback',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'teal',
      questions: [
        { type: 'rating', title: 'Rate the course content quality', required: true },
        { type: 'emoji_scale', title: 'How engaging were the lectures?', required: true },
        { type: 'multiple_choice', title: 'What learning method works best for you?', options: ['Visual', 'Auditory', 'Reading/Writing', 'Hands-on', 'Group work'], required: false },
        { type: 'text', title: 'What topics would you like to see covered?', required: false },
        { type: 'multiple_choice', title: 'How would you rate the course difficulty?', options: ['Too easy', 'Just right', 'Somewhat challenging', 'Very challenging', 'Too difficult'], required: true }
      ]
    },
    {
      id: 'health-wellness',
      name: 'Health & Wellness',
      description: 'Health assessment and lifestyle questions',
      icon: <Heart className="w-5 h-5" />,
      color: 'red',
      questions: [
        { type: 'multiple_choice', title: 'How would you rate your overall health?', options: ['Excellent', 'Very good', 'Good', 'Fair', 'Poor'], required: true },
        { type: 'rating', title: 'Rate your stress level (1=low, 5=high)', required: true },
        { type: 'multiple_choice', title: 'How often do you exercise?', options: ['Daily', '3-4 times/week', '1-2 times/week', 'Rarely', 'Never'], required: false },
        { type: 'text', title: 'What health goals do you have?', required: false },
        { type: 'emoji_scale', title: 'How would you rate your energy level?', required: true }
      ]
    },
    {
      id: 'market-research',
      name: 'Market Research',
      description: 'Consumer behavior and preferences',
      icon: <Target className="w-5 h-5" />,
      color: 'pink',
      questions: [
        { type: 'multiple_choice', title: 'What is your primary shopping channel?', options: ['Online', 'In-store', 'Mobile app', 'Social media', 'All of the above'], required: true },
        { type: 'rating', title: 'Rate the importance of brand reputation', required: true },
        { type: 'multiple_choice', title: 'What influences your purchase decisions most?', options: ['Price', 'Quality', 'Reviews', 'Brand loyalty', 'Convenience', 'Recommendations'], required: false },
        { type: 'text', title: 'Describe your ideal shopping experience', required: false },
        { type: 'emoji_scale', title: 'How do you feel about online shopping?', required: true }
      ]
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleAddTemplate = () => {
    if (!selectedTemplate) return;

    const questionsToAdd = selectedTemplate.questions.map((q, index) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
      type: q.type,
      title: q.title,
      required: q.required || false,
      description: '',
      options: q.options || (q.type === 'emoji_scale' ? [
        { emoji: '😠', label: 'Very Unsatisfied', value: 1 },
        { emoji: '😞', label: 'Unsatisfied', value: 2 },
        { emoji: '😐', label: 'Neutral', value: 3 },
        { emoji: '🙂', label: 'Satisfied', value: 4 },
        { emoji: '🥰', label: 'Very Satisfied', value: 5 }
      ] : q.type === 'rating' ? ['1', '2', '3', '4', '5'] : q.options || []),
      settings: {}
    }));

    onAddQuestions(questionsToAdd);
    toast.success(`Added ${questionsToAdd.length} questions from ${selectedTemplate.name}`);
    onClose();
  };

  const handleCustomAdd = () => {
    const lines = customQuestions.split('\n').filter(line => line.trim());
    const questionsToAdd = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Q:')) {
        const questionText = trimmedLine.substring(2).trim();
        questionsToAdd.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          type: 'text',
          title: questionText,
          required: false,
          description: '',
          options: [],
          settings: {}
        });
      } else if (trimmedLine.startsWith('MC:')) {
        const parts = trimmedLine.substring(3).split('|');
        const questionText = parts[0].trim();
        const options = parts.slice(1).map(opt => opt.trim());
        questionsToAdd.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          type: 'multiple_choice',
          title: questionText,
          required: false,
          description: '',
          options: options,
          settings: {}
        });
      } else if (trimmedLine.startsWith('ES:')) {
        const questionText = trimmedLine.substring(3).trim();
        questionsToAdd.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          type: 'emoji_scale',
          title: questionText,
          required: false,
          description: '',
          options: [
            { emoji: '😠', label: 'Very Unsatisfied', value: 1 },
            { emoji: '😞', label: 'Unsatisfied', value: 2 },
            { emoji: '😐', label: 'Neutral', value: 3 },
            { emoji: '🙂', label: 'Satisfied', value: 4 },
            { emoji: '🥰', label: 'Very Satisfied', value: 5 }
          ],
          settings: {}
        });
      } else if (trimmedLine.startsWith('R:')) {
        const questionText = trimmedLine.substring(2).trim();
        questionsToAdd.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
          type: 'rating',
          title: questionText,
          required: false,
          description: '',
          options: ['1', '2', '3', '4', '5'],
          settings: {}
        });
      }
    });

    if (questionsToAdd.length > 0) {
      onAddQuestions(questionsToAdd);
      toast.success(`Added ${questionsToAdd.length} custom questions`);
      onClose();
    } else {
      toast.error('No valid questions found. Please check your format.');
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
      teal: 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100',
      red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Multiple Questions</h2>
              <p className="text-gray-600 mt-1">Choose from templates or create custom questions</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex h-[600px]">
            {/* Left Panel - Templates */}
            <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Question Templates</h3>
                  <button
                    onClick={() => setShowCustomEditor(!showCustomEditor)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showCustomEditor ? 'Hide Custom Editor' : 'Show Custom Editor'}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {questionTemplates.map((template) => (
                    <motion.button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${getColorClasses(template.color)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getColorClasses(template.color)}`}>
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded-full">
                              {template.questions.length} questions
                            </span>
                            <span className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded-full">
                              {template.questions.filter(q => q.required).length} required
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Editor */}
                {showCustomEditor && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Custom Questions</h4>
                    <textarea
                      value={customQuestions}
                      onChange={(e) => setCustomQuestions(e.target.value)}
                      placeholder={`Format examples:
Q: What is your name?
MC: How did you hear about us?|Social Media|Search Engine|Referral
ES: How satisfied are you with our service?
R: Rate the quality of our product`}
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-gray-500">
                        Use Q: for text, MC: for multiple choice, ES: for emoji scale, R: for rating
                      </div>
                      <button
                        onClick={handleCustomAdd}
                        disabled={!customQuestions.trim()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Add Custom
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                
                {selectedTemplate ? (
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-lg ${getColorClasses(selectedTemplate.color)}`}>
                        {selectedTemplate.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedTemplate.name}</h4>
                        <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedTemplate.questions.map((question, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Q{index + 1}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                question.type === 'text' ? 'bg-blue-100 text-blue-800' :
                                question.type === 'multiple_choice' ? 'bg-green-100 text-green-800' :
                                question.type === 'rating' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {question.type.replace('_', ' ')}
                              </span>
                              {question.required && (
                                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-900">{question.title}</p>
                          {question.options && question.options.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                Options: {question.options.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={handleAddTemplate}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Add {selectedTemplate.questions.length} Questions
                      </button>
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a template to preview questions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkQuestionAdder;
