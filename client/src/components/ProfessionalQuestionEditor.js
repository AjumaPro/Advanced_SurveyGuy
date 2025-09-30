import React, { useState, useEffect } from 'react';
import { getQuestionType, emojiScales, getDefaultOptions } from '../utils/questionTypes';
import QuestionRenderer from './QuestionRenderer';
import AIQuestionGenerator from './AIQuestionGenerator';
import ConditionalLogicBuilder from './ConditionalLogicBuilder';
import {
  X,
  Type,
  AlignLeft,
  Settings,
  Eye,
  EyeOff,
  Star,
  List,
  Smile,
  ToggleLeft,
  Plus,
  RefreshCw,
  ChevronDown,
  CheckSquare,
  Circle,
  Hash,
  ThumbsUp,
  Calendar,
  MapPin,
  Upload,
  BarChart3,
  Grid,
  MessageSquare,
  Sparkles,
  GitBranch,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProfessionalQuestionEditor = ({ question, onUpdate, onClose, allQuestions = [] }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(true);
  const [localQuestion, setLocalQuestion] = useState(question);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Ensure localQuestion is properly initialized and updated
  useEffect(() => {
    if (question) {
      setLocalQuestion(question);
    }
  }, [question]);

  // Close type selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTypeSelector && !event.target.closest('.type-selector')) {
        setShowTypeSelector(false);
      }
    };

    if (showTypeSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTypeSelector]);

  // Handle null/undefined question
  if (!question) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No question selected</p>
      </div>
    );
  }

  // Handle case where localQuestion is still null/undefined
  if (!localQuestion) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }

  const questionTypeInfo = getQuestionType(localQuestion.type);
  
  // Available question types with icons
  const questionTypes = [
    { id: 'text', name: 'Text Input', icon: <Type className="w-4 h-4" />, description: 'Single line text input' },
    { id: 'textarea', name: 'Long Text', icon: <AlignLeft className="w-4 h-4" />, description: 'Multi-line text input' },
    { id: 'multiple_choice', name: 'Multiple Choice', icon: <Circle className="w-4 h-4" />, description: 'Single selection from options' },
    { id: 'checkbox', name: 'Checkboxes', icon: <CheckSquare className="w-4 h-4" />, description: 'Multiple selections allowed' },
    { id: 'dropdown', name: 'Dropdown', icon: <ChevronDown className="w-4 h-4" />, description: 'Dropdown selection menu' },
    { id: 'rating', name: 'Rating Scale', icon: <Star className="w-4 h-4" />, description: 'Numeric rating scale' },
    { id: 'emoji_scale', name: 'Emoji Scale', icon: <Smile className="w-4 h-4" />, description: 'Emoji-based rating' },
    { id: 'yes_no', name: 'Yes/No', icon: <ThumbsUp className="w-4 h-4" />, description: 'Simple yes or no choice' },
    { id: 'date', name: 'Date Picker', icon: <Calendar className="w-4 h-4" />, description: 'Date selection' },
    { id: 'location', name: 'Location', icon: <MapPin className="w-4 h-4" />, description: 'Address or coordinates' },
    { id: 'file_upload', name: 'File Upload', icon: <Upload className="w-4 h-4" />, description: 'File attachment' },
    { id: 'number', name: 'Number Input', icon: <Hash className="w-4 h-4" />, description: 'Numeric input field' },
    { id: 'matrix', name: 'Matrix', icon: <Grid className="w-4 h-4" />, description: 'Grid of questions' },
    { id: 'comment', name: 'Comment Box', icon: <MessageSquare className="w-4 h-4" />, description: 'Open-ended feedback' }
  ];

  const tabs = [
    { id: 'content', name: 'Content', icon: <Type className="w-4 h-4" /> },
    { id: 'ai', name: 'AI Assistant', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'logic', name: 'Logic', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'validation', name: 'Validation', icon: <ToggleLeft className="w-4 h-4" /> },
    { id: 'advanced', name: 'Advanced', icon: <Star className="w-4 h-4" /> }
  ];

  // Validation function
  const validateQuestion = (question) => {
    const errors = {};
    
    if (!question.title || question.title.trim() === '') {
      errors.title = 'Question title is required';
    }
    
    if (['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
      if (!question.options || question.options.length === 0) {
        errors.options = 'At least one option is required';
      } else if (question.options.some(opt => !opt || opt.trim() === '')) {
        errors.options = 'All options must have text';
      }
    }
    
    if (question.type === 'rating' && (!question.min || !question.max)) {
      errors.rating = 'Rating scale must have min and max values';
    }
    
    return errors;
  };

  const handleUpdate = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Auto-save with debouncing
    setIsSaving(true);
    onUpdate(updated);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    }, 300);
  };

  const addOption = () => {
    const options = [...(localQuestion.options || []), `Option ${(localQuestion.options?.length || 0) + 1}`];
    handleUpdate('options', options);
  };

  const updateOption = (index, value) => {
    const options = [...(localQuestion.options || [])];
    options[index] = value;
    handleUpdate('options', options);
  };

  const removeOption = (index) => {
    const options = localQuestion.options?.filter((_, i) => i !== index) || [];
    handleUpdate('options', options);
  };

  // Handle question type change
  const handleTypeChange = (newType) => {
    const currentType = localQuestion.type;
    
    // If changing to the same type, just close the selector
    if (newType === currentType) {
      setShowTypeSelector(false);
      return;
    }

    // Get default options for the new type
    const newDefaultOptions = getDefaultOptions ? getDefaultOptions(newType) : [];
    
    // Preserve existing data where possible, reset incompatible data
    const updatedQuestion = {
      ...localQuestion,
      type: newType,
      options: newDefaultOptions,
      settings: {} // Reset settings for new type
    };

    // Handle specific type migrations
    if (currentType === 'emoji_scale' && newType !== 'emoji_scale') {
      // Remove emoji-specific settings
      delete updatedQuestion.emojiSet;
      delete updatedQuestion.scale;
    }
    
    if (newType === 'emoji_scale' && currentType !== 'emoji_scale') {
      // Add emoji-specific defaults
      updatedQuestion.emojiSet = 'customer-satisfaction';
      updatedQuestion.scale = '5-point';
    }

    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
    setShowTypeSelector(false);
  };

  const handleAIQuestionsGenerated = (questions) => {
    // Add AI-generated questions to the survey
    // This would typically be handled by the parent component
    console.log('AI Generated Questions:', questions);
  };

  const handleConditionalLogicUpdate = (logic) => {
    handleUpdate('conditionalLogic', logic);
  };


  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                {questionTypeInfo?.icon && (
                  <div className="text-white">
                    {questionTypeInfo.icon}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Question Editor
                </h2>
                <p className="text-sm text-gray-500">
                  {questionTypeInfo?.name || 'Question'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Auto-save indicator */}
              {isSaving ? (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Saving...</span>
                </div>
              ) : showSuccessMessage ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Saved</span>
                </div>
              ) : null}
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPreview 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{showPreview ? 'Preview' : 'Preview'}</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Type Selector */}
      <div className="px-6 pb-4">
        <div className="relative type-selector">
          <button
            onClick={() => setShowTypeSelector(!showTypeSelector)}
            className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Question Type</div>
                <div className="text-xs text-gray-500">{questionTypeInfo?.name || localQuestion.type}</div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTypeSelector ? 'rotate-180' : ''}`} />
          </button>

          {/* Type Selector Dropdown */}
          {showTypeSelector && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
                  Select Question Type
                </div>
                <div className="space-y-1">
                  {questionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        type.id === localQuestion.type
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded ${
                        type.id === localQuestion.type ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {type.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          type.id === localQuestion.type ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {type.name}
                        </div>
                        <div className={`text-xs ${
                          type.id === localQuestion.type ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {type.description}
                        </div>
                      </div>
                      {type.id === localQuestion.type && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="px-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className={`p-1 rounded ${
                activeTab === tab.id ? 'bg-gray-100' : 'bg-transparent'
              }`}>
                {tab.icon}
              </div>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 min-h-[500px]">
                <AIQuestionGenerator 
                  onQuestionsGenerated={handleAIQuestionsGenerated}
                  currentSurvey={{ questions: allQuestions }}
                />
              </div>
            </div>
          )}

          {activeTab === 'logic' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 min-h-[500px]">
                <ConditionalLogicBuilder
                  question={localQuestion}
                  allQuestions={allQuestions}
                  onLogicUpdate={handleConditionalLogicUpdate}
                  onClose={() => {}}
                />
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Question Content Section */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 min-h-[400px]">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Question Content
                  </h3>
                  <p className="text-sm text-gray-600">Define your question and provide any additional context</p>
                </div>
                
                <div className="space-y-6">
                  {/* Question Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Title *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={localQuestion.title}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:outline-none text-base ${
                          validationErrors.title 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="Enter your question..."
                      />
                      {validationErrors.title && (
                        <div className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors.title}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={localQuestion.description || ''}
                      onChange={(e) => handleUpdate('description', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Add additional context or instructions..."
                    />
                    <p className="mt-1 text-xs text-gray-500">Provide additional context or instructions for respondents</p>
                  </div>
                </div>
              </div>

              {/* Answer Options Section */}
              {['multiple_choice', 'checkbox', 'dropdown'].includes(localQuestion.type) && (
                <div className="bg-white rounded-lg p-6 border border-gray-200 min-h-[300px]">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Answer Options
                    </h3>
                    <p className="text-sm text-gray-600">Define the available choices for respondents</p>
                  </div>
                  <div className="space-y-3">
                    {(localQuestion.options || []).map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border border-gray-300">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder={`Option ${index + 1}`}
                        />
                        <button
                          onClick={() => removeOption(index)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove option"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addOption}
                      className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Option</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Enhanced Emoji Scale Settings */}
              {localQuestion.type === 'emoji_scale' && (
                <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                  <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center">
                    <div className="p-1.5 bg-yellow-100 rounded-lg mr-3">
                      <Smile className="w-4 h-4 text-yellow-600" />
                    </div>
                    Emoji Scale Configuration
                  </label>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Scale Type</label>
                      <select
                        value={localQuestion.scaleType || 'satisfaction'}
                        onChange={(e) => handleUpdate('scaleType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 font-medium"
                      >
                        {Object.entries(emojiScales).map(([key, scale]) => (
                          <option key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)} Scale ({scale.length} points)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Enhanced Emoji Preview */}
                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                      <div className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Live Preview
                      </div>
                      <div className="flex justify-center space-x-4">
                        {(emojiScales[localQuestion.scaleType || 'satisfaction'] || []).map((emoji, index) => (
                          <div key={index} className="text-center p-3 bg-white rounded-lg shadow-sm border border-yellow-100">
                            <img src={emoji.emoji} alt={emoji.label} className="w-10 h-10 mx-auto mb-2" />
                            <div className="text-xs font-medium text-gray-600">{emoji.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{emoji.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Preview Section */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 flex items-center tracking-tight mb-1">
                      <div className="p-1.5 bg-indigo-100 rounded-lg mr-3">
                        <Eye className="w-5 h-5 text-indigo-600" />
                      </div>
                      Live Preview
                    </h4>
                    <p className="text-sm text-slate-600 font-medium ml-8">See how your question will appear to respondents</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-4 py-2 rounded-full text-xs font-bold ${
                      showPreview 
                        ? 'bg-green-100 text-green-700 shadow-sm' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {showPreview ? 'Preview Active' : 'Preview Hidden'}
                    </div>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-md ${
                        showPreview 
                          ? 'bg-indigo-600 text-white border border-indigo-700 shadow-lg' 
                          : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 hover:shadow-lg'
                      }`}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                    </button>
                  </div>
                </div>
                
                {showPreview && (
                  <div className="mt-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-white hover:border-slate-300 transition-all duration-300 shadow-sm">
                      <div className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                        Respondent View
                      </div>
                      <div className="bg-white rounded-lg p-5 shadow-lg border border-slate-200">
                        <QuestionRenderer 
                          question={localQuestion} 
                          preview={true}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Question Settings Section */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 min-h-[500px]">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Settings className="w-5 h-5 text-orange-600" />
                    </div>
                    Question Settings
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">Configure additional settings and validation rules for this question</p>
                </div>
                
                <div className="space-y-4">
              <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Basic Settings</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="font-medium text-gray-900">Required Question</div>
                        <div className="text-sm text-gray-600">Respondents must answer this question</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={localQuestion.required || false}
                        onChange={(e) => handleUpdate('required', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        localQuestion.required ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          localQuestion.required ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </div>
                    </div>
                  </label>

                  {['multiple_choice', 'checkbox'].includes(localQuestion.type) && (
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Plus className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">Allow "Other" Option</div>
                          <div className="text-sm text-gray-600">Let respondents add their own option</div>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={localQuestion.allowOther || false}
                          onChange={(e) => handleUpdate('allowOther', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${
                          localQuestion.allowOther ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            localQuestion.allowOther ? 'translate-x-6' : 'translate-x-0.5'
                          } mt-0.5`}></div>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Type-specific Settings */}
              {localQuestion.type === 'rating' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Rating Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Rating</label>
                      <select
                        value={localQuestion.maxRating || 5}
                        onChange={(e) => handleUpdate('maxRating', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={3}>3 Stars</option>
                        <option value={5}>5 Stars</option>
                        <option value={7}>7 Stars</option>
                        <option value={10}>10 Stars</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {localQuestion.type === 'scale' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Scale Settings</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
                      <input
                        type="number"
                        value={localQuestion.minScale || 1}
                        onChange={(e) => handleUpdate('minScale', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
                      <input
                        type="number"
                        value={localQuestion.maxScale || 10}
                        onChange={(e) => handleUpdate('maxScale', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Step</label>
                      <input
                        type="number"
                        value={localQuestion.step || 1}
                        onChange={(e) => handleUpdate('step', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-6">
              {/* Validation Status */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 min-h-[400px]">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  Question Validation Status
                </h3>
                
                {(() => {
                  const errors = validateQuestion(localQuestion);
                  const hasErrors = Object.keys(errors).length > 0;
                  
                  return (
                    <div className="space-y-4">
                      {hasErrors ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <h4 className="font-semibold text-red-900">Validation Issues Found</h4>
                          </div>
                          <ul className="space-y-2">
                            {Object.entries(errors).map(([field, error]) => (
                              <li key={field} className="text-sm text-red-700 flex items-center">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <h4 className="font-semibold text-green-900">Question is valid!</h4>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            All required fields are completed and properly configured.
                          </p>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Validation Checklist</h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                          <li className={`flex items-center ${localQuestion.title ? 'text-green-700' : 'text-red-700'}`}>
                            {localQuestion.title ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                            Question title is provided
                          </li>
                          {['multiple_choice', 'checkbox', 'dropdown'].includes(localQuestion.type) && (
                            <li className={`flex items-center ${localQuestion.options?.length > 0 ? 'text-green-700' : 'text-red-700'}`}>
                              {localQuestion.options?.length > 0 ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                              Answer options are configured
                            </li>
                          )}
                          <li className={`flex items-center ${localQuestion.description ? 'text-green-700' : 'text-blue-700'}`}>
                            {localQuestion.description ? <CheckCircle className="w-4 h-4 mr-2" /> : <div className="w-4 h-4 mr-2" />}
                            Description is provided (optional)
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Validation Rules */}
              {['text', 'textarea'].includes(localQuestion.type) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Text Validation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Length</label>
                      <input
                        type="number"
                        value={localQuestion.minLength || ''}
                        onChange={(e) => handleUpdate('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Length</label>
                      <input
                        type="number"
                        value={localQuestion.maxLength || ''}
                        onChange={(e) => handleUpdate('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                </div>
              )}

              {localQuestion.type === 'checkbox' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Selection Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Selections</label>
                      <input
                        type="number"
                        value={localQuestion.minSelections || ''}
                        onChange={(e) => handleUpdate('minSelections', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Selections</label>
                      <input
                        type="number"
                        value={localQuestion.maxSelections || ''}
                        onChange={(e) => handleUpdate('maxSelections', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Conditional Logic */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 min-h-[500px]">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Conditional Logic</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium text-gray-900">Show question based on previous answers</div>
                        <div className="text-sm text-gray-600">Display this question only when certain conditions are met</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={localQuestion.conditionalLogic?.enabled || false}
                        onChange={(e) => handleUpdate('conditionalLogic', {
                          ...localQuestion.conditionalLogic,
                          enabled: e.target.checked
                        })}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        localQuestion.conditionalLogic?.enabled ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          localQuestion.conditionalLogic?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </div>
                    </div>
                  </label>

                  {localQuestion.conditionalLogic?.enabled && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Show this question when:</label>
                          <select
                            value={localQuestion.conditionalLogic?.condition || 'any'}
                            onChange={(e) => handleUpdate('conditionalLogic', {
                              ...localQuestion.conditionalLogic,
                              condition: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="any">Any condition is met</option>
                            <option value="all">All conditions are met</option>
                          </select>
                        </div>
                        <div className="text-xs text-gray-600">
                          Conditional logic rules will be configured in a future update.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Display Options */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Display Options</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-900">Randomize Options</div>
                        <div className="text-sm text-gray-600">Shuffle the order of answer options</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={localQuestion.randomizeOptions || false}
                        onChange={(e) => handleUpdate('randomizeOptions', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        localQuestion.randomizeOptions ? 'bg-green-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          localQuestion.randomizeOptions ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <List className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-medium text-gray-900">Show Progress</div>
                        <div className="text-sm text-gray-600">Display question number and progress</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={localQuestion.showProgress !== false}
                        onChange={(e) => handleUpdate('showProgress', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        localQuestion.showProgress !== false ? 'bg-orange-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          localQuestion.showProgress !== false ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </div>
                    </div>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS Class</label>
                    <input
                      type="text"
                      value={localQuestion.customClass || ''}
                      onChange={(e) => handleUpdate('customClass', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="my-custom-class"
                    />
                    <p className="text-xs text-gray-500 mt-1">Add custom CSS classes for styling</p>
                  </div>
                </div>
              </div>

              {/* Analytics and Tracking */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Analytics & Tracking</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-indigo-500" />
                      <div>
                        <div className="font-medium text-gray-900">Track Response Time</div>
                        <div className="text-sm text-gray-600">Measure how long users take to answer</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={localQuestion.trackResponseTime || false}
                        onChange={(e) => handleUpdate('trackResponseTime', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        localQuestion.trackResponseTime ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          localQuestion.trackResponseTime ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`}></div>
                      </div>
                    </div>
                  </label>

                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Question ID</label>
                    <input
                      type="text"
                      value={localQuestion.analyticsId || localQuestion.id}
                      onChange={(e) => handleUpdate('analyticsId', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      placeholder="question_1"
                    />
                      <p className="text-xs text-slate-500 mt-1 font-medium">Custom identifier for analytics tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalQuestionEditor;
