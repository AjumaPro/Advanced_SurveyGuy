import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Type,
  List,
  Star,
  Hash,
  Calendar,
  Mail,
  Phone,
  Upload,
  BarChart3,
  Grid,
  Sliders,
  Copy,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react';
import { getQuestionType, emojiScales } from '../utils/questionTypes';
import EmojiQuestionRenderer from './EmojiQuestionRenderer';

const ProfessionalQuestionEditorV2 = ({ question, onUpdate, onDelete, onDuplicate }) => {
  const [localQuestion, setLocalQuestion] = useState(() => {
    const defaultQuestion = {
      id: '',
      type: 'text',
      title: '',
      description: '',
      required: false,
      settings: {}
    };
    
    return question ? {
      ...defaultQuestion,
      ...question,
      settings: {
        ...defaultQuestion.settings,
        ...question.settings
      }
    } : defaultQuestion;
  });
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (question) {
      const defaultQuestion = {
        id: '',
        type: 'text',
        title: '',
        description: '',
        required: false,
        settings: {}
      };
      
      setLocalQuestion({
        ...defaultQuestion,
        ...question,
        settings: {
          ...defaultQuestion.settings,
          ...question.settings
        }
      });
    }
  }, [question]);

  const handleUpdate = (updates) => {
    const updatedQuestion = { ...localQuestion, ...updates };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleSettingsUpdate = (key, value) => {
    const updatedSettings = { ...localQuestion.settings, [key]: value };
    handleUpdate({ settings: updatedSettings });
  };

  const addOption = () => {
    const currentOptions = localQuestion.settings?.options || [];
    const newOption = `Option ${currentOptions.length + 1}`;
    handleSettingsUpdate('options', [...currentOptions, newOption]);
  };

  const updateOption = (index, value) => {
    const currentOptions = [...(localQuestion.settings?.options || [])];
    currentOptions[index] = value;
    handleSettingsUpdate('options', currentOptions);
  };

  const removeOption = (index) => {
    const currentOptions = localQuestion.settings?.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    handleSettingsUpdate('options', newOptions);
  };

  const questionTypeInfo = getQuestionType(localQuestion.type);

  const renderQuestionSettings = () => {
    if (!localQuestion.type) return null;

    switch (localQuestion.type) {
      case 'radio':
      case 'checkbox':
      case 'dropdown':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {(localQuestion.settings?.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating Scale (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={localQuestion.settings?.scale || 5}
                onChange={(e) => handleSettingsUpdate('scale', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'emoji_satisfaction':
      case 'emoji_agreement':
      case 'emoji_quality':
      case 'emoji_mood':
      case 'emoji_difficulty':
      case 'emoji_likelihood':
      case 'emoji_custom':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoji Scale ({localQuestion.settings?.scale || 5} points)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Scale Size</label>
                  <select
                    value={localQuestion.settings?.scale || 5}
                    onChange={(e) => handleSettingsUpdate('scale', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={3}>3 Point Scale</option>
                    <option value={4}>4 Point Scale</option>
                    <option value={5}>5 Point Scale</option>
                    <option value={7}>7 Point Scale</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emoji Customization for custom type */}
            {localQuestion.type === 'emoji_custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Emojis
                </label>
                <div className="space-y-2">
                  {(localQuestion.settings?.emojis || []).map((emoji, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={emoji}
                        onChange={(e) => {
                          const newEmojis = [...(localQuestion.settings?.emojis || [])];
                          newEmojis[index] = e.target.value;
                          handleSettingsUpdate('emojis', newEmojis);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Emoji ${index + 1}`}
                      />
                      <input
                        type="text"
                        value={localQuestion.settings?.labels?.[index + 1] || ''}
                        onChange={(e) => {
                          const newLabels = { ...(localQuestion.settings?.labels || {}) };
                          newLabels[index + 1] = e.target.value;
                          handleSettingsUpdate('labels', newLabels);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Label ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <EmojiQuestionRenderer
                question={localQuestion}
                value={null}
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </div>
        );

      case 'scale':
      case 'nps':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={localQuestion.settings?.min || 1}
                  onChange={(e) => handleSettingsUpdate('min', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={localQuestion.settings?.max || 10}
                  onChange={(e) => handleSettingsUpdate('max', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Label
                </label>
                <input
                  type="text"
                  value={localQuestion.settings?.minLabel || ''}
                  onChange={(e) => handleSettingsUpdate('minLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Strongly Disagree"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Label
                </label>
                <input
                  type="text"
                  value={localQuestion.settings?.maxLabel || ''}
                  onChange={(e) => handleSettingsUpdate('maxLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Strongly Agree"
                />
              </div>
            </div>
          </div>
        );

      case 'text':
      case 'textarea':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={localQuestion.settings?.placeholder || ''}
                onChange={(e) => handleSettingsUpdate('placeholder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter placeholder text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Characters
              </label>
              <input
                type="number"
                value={localQuestion.settings?.maxLength || 255}
                onChange={(e) => handleSettingsUpdate('maxLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-8 h-8 mx-auto mb-2" />
            <p>No additional settings for this question type</p>
          </div>
        );
    }
  };

  const renderPreview = () => {
    if (!localQuestion.type) return null;

    switch (localQuestion.type) {
      case 'radio':
        return (
          <div className="space-y-2">
            {(localQuestion.settings?.options || []).map((option, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="preview" className="text-blue-600" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {(localQuestion.settings?.options || []).map((option, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="text-blue-600" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option>Select an option...</option>
            {(localQuestion.settings?.options || []).map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );

      case 'rating':
        return (
          <div className="flex gap-1">
            {Array.from({ length: localQuestion.settings?.scale || 5 }, (_, i) => (
              <Star key={i} className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
            ))}
          </div>
        );

      case 'emoji_satisfaction':
      case 'emoji_agreement':
      case 'emoji_quality':
      case 'emoji_mood':
      case 'emoji_difficulty':
      case 'emoji_likelihood':
      case 'emoji_custom':
        return (
          <EmojiQuestionRenderer
            question={localQuestion}
            value={null}
            onChange={() => {}}
            disabled={true}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            placeholder={localQuestion.settings?.placeholder || 'Enter your answer...'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            disabled
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={localQuestion.settings?.placeholder || 'Enter your detailed answer...'}
            rows={localQuestion.settings?.rows || 4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            disabled
          />
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500 border border-gray-200 rounded-lg">
            Preview not available for this question type
          </div>
        );
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a question to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {questionTypeInfo?.icon && (
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {questionTypeInfo.icon}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                {questionTypeInfo?.name || 'Question'}
              </h3>
              <p className="text-sm text-gray-600">
                {questionTypeInfo?.description || 'Edit your question'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        {/* Question Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDuplicate(localQuestion)}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button
            onClick={() => onDelete(localQuestion.id)}
            className="flex items-center gap-2 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                value={localQuestion.title || ''}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your question..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={localQuestion.description || ''}
                onChange={(e) => handleUpdate({ description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add additional context or instructions..."
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localQuestion.required || false}
                  onChange={(e) => handleUpdate({ required: e.target.checked })}
                  className="text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Required</span>
              </label>
            </div>
          </div>

          {/* Type-specific Settings */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Question Settings</h4>
            {renderQuestionSettings()}
          </div>

          {/* Preview */}
          {showPreview && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Preview</h4>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="mb-3">
                  <h5 className="font-medium text-gray-900">
                    {localQuestion.title || 'Untitled Question'}
                    {localQuestion.required && <span className="text-red-500 ml-1">*</span>}
                  </h5>
                  {localQuestion.description && (
                    <p className="text-sm text-gray-600 mt-1">{localQuestion.description}</p>
                  )}
                </div>
                {renderPreview()}
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h5 className="font-medium text-red-900">Validation Errors</h5>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalQuestionEditorV2;
