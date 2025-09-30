import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Settings,
  Save,
  X,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Move,
  Copy,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Crown,
  Star,
  Type,
  List,
  Hash,
  Calendar,
  Mail,
  Phone,
  Sliders,
  Grid,
  Upload,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Wand2
} from 'lucide-react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getAllQuestionTypes, getDefaultQuestionSettings, emojiScales } from '../utils/questionTypes';
import { validateQuestion, getQuestionCompletionPercentage } from '../utils/questionValidation';

const ComprehensiveQuestionEditor = ({ 
  question, 
  onSave, 
  onClose, 
  onDelete,
  onDuplicate,
  isNew = false 
}) => {
  const [localQuestion, setLocalQuestion] = useState(question || {
    id: `q_${Date.now()}`,
    type: 'text',
    title: '',
    description: '',
    required: false,
    settings: {}
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'basic', name: 'Basic', icon: <Type className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'validation', name: 'Validation', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'advanced', name: 'Advanced', icon: <Zap className="w-4 h-4" /> }
  ];

  useEffect(() => {
    // Initialize settings if empty
    if (!localQuestion.settings || Object.keys(localQuestion.settings).length === 0) {
      setLocalQuestion(prev => ({
        ...prev,
        settings: getDefaultQuestionSettings(prev.type)
      }));
    }
  }, [localQuestion.type]);

  useEffect(() => {
    // Validate question on changes
    const validation = validateQuestion(localQuestion);
    setErrors(validation.errors);
  }, [localQuestion]);

  const handleUpdate = (updates) => {
    setLocalQuestion(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleSettingsUpdate = (key, value) => {
    const newSettings = { ...localQuestion.settings, [key]: value };
    handleUpdate({ settings: newSettings });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const validation = validateQuestion(localQuestion);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error('Please fix validation errors before saving');
        return;
      }

      await onSave(localQuestion);
      setIsDirty(false);
      toast.success('Question saved successfully!');
    } catch (error) {
      console.error('Failed to save question:', error);
      toast.error('Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const addOption = () => {
    const options = localQuestion.settings.options || [];
    handleSettingsUpdate('options', [...options, `Option ${options.length + 1}`]);
  };

  const updateOption = (index, value) => {
    const options = [...(localQuestion.settings.options || [])];
    options[index] = value;
    handleSettingsUpdate('options', options);
  };

  const removeOption = (index) => {
    const options = (localQuestion.settings.options || []).filter((_, i) => i !== index);
    handleSettingsUpdate('options', options);
  };

  // Drag and drop reordering temporarily disabled for React 18 compatibility
  // const reorderOptions = (result) => {
  //   if (!result.destination) return;
  //   
  //   const options = Array.from(localQuestion.settings.options || []);
  //   const [reorderedOption] = options.splice(result.source.index, 1);
  //   options.splice(result.destination.index, 0, reorderedOption);
  //   
  //   handleSettingsUpdate('options', options);
  // };

  const completionPercentage = getQuestionCompletionPercentage(localQuestion);
  const validation = validateQuestion(localQuestion);

  const renderBasicTab = () => (
    <div className="space-y-6">
      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
        <select
          value={localQuestion.type}
          onChange={(e) => {
            const newType = e.target.value;
            handleUpdate({ 
              type: newType, 
              settings: getDefaultQuestionSettings(newType) 
            });
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Object.values(getAllQuestionTypes().reduce((acc, type) => {
            const category = type.category;
            if (!acc[category]) {
              acc[category] = { category, types: [] };
            }
            acc[category].types.push(type);
            return acc;
          }, {})).map(category => (
            <optgroup key={category.category} label={category.category}>
              {category.types.map(type => (
                <option key={type.type} value={type.type}>
                  {type.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Question Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Title {localQuestion.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          value={localQuestion.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          rows="2"
          placeholder="Enter your question here..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={localQuestion.description || ''}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          rows="2"
          placeholder="Add helpful context or instructions..."
        />
      </div>

      {/* Required Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={localQuestion.required}
          onChange={(e) => handleUpdate({ required: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Required Question
        </label>
        <Info className="w-4 h-4 text-gray-400" title="Required questions must be answered before submission" />
      </div>
    </div>
  );

  const renderSettingsTab = () => {
    switch (localQuestion.type) {
      case 'text':
      case 'textarea':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
              <input
                type="text"
                value={localQuestion.settings.placeholder || ''}
                onChange={(e) => handleSettingsUpdate('placeholder', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter placeholder text..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Length</label>
                <input
                  type="number"
                  value={localQuestion.settings.minLength || ''}
                  onChange={(e) => handleSettingsUpdate('minLength', parseInt(e.target.value) || null)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Length</label>
                <input
                  type="number"
                  value={localQuestion.settings.maxLength || ''}
                  onChange={(e) => handleSettingsUpdate('maxLength', parseInt(e.target.value) || null)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            
            {localQuestion.type === 'textarea' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
                <input
                  type="number"
                  value={localQuestion.settings.rows || 4}
                  onChange={(e) => handleSettingsUpdate('rows', parseInt(e.target.value) || 4)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="2"
                  max="20"
                />
              </div>
            )}
          </div>
        );

      case 'multiple_choice':
      case 'checkbox':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Options</label>
                <button
                  onClick={addOption}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-3 h-3" />
                  Add Option
                </button>
              </div>
              
              <div className="space-y-2">
                {(localQuestion.settings.options || []).map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white"
                  >
                    <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 p-2 border-0 focus:ring-0 focus:outline-none bg-transparent"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      onClick={() => removeOption(index)}
                      className="text-red-400 hover:text-red-600 p-1"
                      disabled={(localQuestion.settings.options || []).length <= 2}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {errors.options && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.options}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localQuestion.settings.allowOther || false}
                  onChange={(e) => handleSettingsUpdate('allowOther', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Allow "Other" option</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localQuestion.settings.randomizeOptions || false}
                  onChange={(e) => handleSettingsUpdate('randomizeOptions', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Randomize option order</label>
              </div>
            </div>

            {localQuestion.type === 'checkbox' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Selections</label>
                  <input
                    type="number"
                    value={localQuestion.settings.minSelections || ''}
                    onChange={(e) => handleSettingsUpdate('minSelections', parseInt(e.target.value) || null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Selections</label>
                  <input
                    type="number"
                    value={localQuestion.settings.maxSelections || ''}
                    onChange={(e) => handleSettingsUpdate('maxSelections', parseInt(e.target.value) || null)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Rating</label>
              <select
                value={localQuestion.settings.maxRating || 5}
                onChange={(e) => handleSettingsUpdate('maxRating', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[3, 4, 5, 7, 10].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localQuestion.settings.allowHalf || false}
                onChange={(e) => handleSettingsUpdate('allowHalf', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Allow half stars</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Low Label</label>
                <input
                  type="text"
                  value={localQuestion.settings.labels?.['1'] || ''}
                  onChange={(e) => handleSettingsUpdate('labels', { 
                    ...localQuestion.settings.labels, 
                    '1': e.target.value 
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Poor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">High Label</label>
                <input
                  type="text"
                  value={localQuestion.settings.labels?.[localQuestion.settings.maxRating?.toString()] || ''}
                  onChange={(e) => handleSettingsUpdate('labels', { 
                    ...localQuestion.settings.labels, 
                    [localQuestion.settings.maxRating?.toString()]: e.target.value 
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Excellent"
                />
              </div>
            </div>
          </div>
        );

      case 'emoji_scale':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scale Type</label>
              <select
                value={localQuestion.settings.scaleType || 'satisfaction'}
                onChange={(e) => handleSettingsUpdate('scaleType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(emojiScales).map(scaleType => (
                  <option key={scaleType} value={scaleType}>
                    {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localQuestion.settings.showLabels !== false}
                onChange={(e) => handleSettingsUpdate('showLabels', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Show labels</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localQuestion.settings.showDescriptions || false}
                onChange={(e) => handleSettingsUpdate('showDescriptions', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Show detailed descriptions</label>
            </div>

            {/* Emoji Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Emoji Preview</h4>
              <div className="flex justify-between">
                {(emojiScales[localQuestion.settings.scaleType] || emojiScales.satisfaction).map((emoji, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{emoji.emoji}</div>
                    {localQuestion.settings.showLabels !== false && (
                      <div className="text-xs text-gray-600">{emoji.label}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No additional settings available for this question type</p>
          </div>
        );
    }
  };

  const renderValidationTab = () => (
    <div className="space-y-6">
      {/* Validation Status */}
      <div className="p-4 rounded-lg border">
        <div className="flex items-center gap-3 mb-3">
          {validation.isValid ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {validation.isValid ? 'Question is Valid' : 'Validation Issues Found'}
            </h3>
            <p className="text-sm text-gray-600">
              Completion: {completionPercentage}%
            </p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-red-900">Issues to Fix:</h4>
          {Object.entries(errors).map(([field, error]) => (
            <div key={field} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900 capitalize">{field}</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Validation Rules */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Custom Validation</h4>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={localQuestion.settings.customValidation?.enabled || false}
            onChange={(e) => handleSettingsUpdate('customValidation', { 
              ...localQuestion.settings.customValidation,
              enabled: e.target.checked 
            })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">Enable custom validation</label>
        </div>

        {localQuestion.settings.customValidation?.enabled && (
          <div className="space-y-3 ml-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Validation Pattern (Regex)</label>
              <input
                type="text"
                value={localQuestion.settings.customValidation?.pattern || ''}
                onChange={(e) => handleSettingsUpdate('customValidation', { 
                  ...localQuestion.settings.customValidation,
                  pattern: e.target.value 
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="^[A-Za-z0-9]+$"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error Message</label>
              <input
                type="text"
                value={localQuestion.settings.customValidation?.message || ''}
                onChange={(e) => handleSettingsUpdate('customValidation', { 
                  ...localQuestion.settings.customValidation,
                  message: e.target.value 
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Please enter a valid format"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      {/* Display Options */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Display Options</h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localQuestion.settings.hideNumber || false}
              onChange={(e) => handleSettingsUpdate('hideNumber', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Hide question number</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localQuestion.settings.fullWidth || false}
              onChange={(e) => handleSettingsUpdate('fullWidth', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Full width display</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localQuestion.settings.showProgress || false}
              onChange={(e) => handleSettingsUpdate('showProgress', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Show progress indicator</label>
          </div>
        </div>
      </div>

      {/* Conditional Logic */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Conditional Logic</h4>
          <Crown className="w-4 h-4 text-yellow-500" title="Pro feature" />
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Coming Soon</span>
          </div>
          <p className="text-sm text-yellow-700">
            Show/hide questions based on previous answers. This feature will be available in the next update.
          </p>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Custom Styling</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS Classes</label>
          <input
            type="text"
            value={localQuestion.settings.customClasses || ''}
            onChange={(e) => handleSettingsUpdate('customClasses', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="custom-class another-class"
          />
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (localQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={localQuestion.settings.placeholder || 'Enter your answer...'}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          />
        );
        
      case 'textarea':
        return (
          <textarea
            placeholder={localQuestion.settings.placeholder || 'Enter your detailed response...'}
            rows={localQuestion.settings.rows || 4}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            disabled
          />
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {(localQuestion.settings.options || ['Option 1', 'Option 2']).map((option, index) => (
              <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="radio" name="preview" className="w-4 h-4 text-blue-600" disabled />
                <span>{option}</span>
              </label>
            ))}
            {localQuestion.settings.allowOther && (
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="radio" name="preview" className="w-4 h-4 text-blue-600" disabled />
                <input type="text" placeholder="Other..." className="flex-1 p-1 border border-gray-200 rounded text-sm" disabled />
              </label>
            )}
          </div>
        );
        
      case 'rating':
        return (
          <div className="flex gap-1">
            {Array.from({ length: localQuestion.settings.maxRating || 5 }).map((_, index) => (
              <Star key={index} className="w-8 h-8 text-gray-300 hover:text-yellow-400 cursor-pointer" />
            ))}
          </div>
        );
        
      case 'emoji_scale':
        const scaleType = localQuestion.settings.scaleType || 'satisfaction';
        const emojis = emojiScales[scaleType] || emojiScales.satisfaction;
        return (
          <div className="flex justify-between items-center gap-2">
            {emojis.map((emoji, index) => (
              <div key={index} className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div className="text-3xl">{emoji.emoji}</div>
                {localQuestion.settings.showLabels !== false && (
                  <span className="text-xs text-gray-600 text-center">{emoji.label}</span>
                )}
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
            Preview not available for this question type
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isNew ? 'Create Question' : 'Edit Question'}
              </h2>
              <p className="text-sm text-gray-500">
                Configure your question settings and preview the result
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Completion Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{completionPercentage}%</span>
            </div>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${
                showPreview 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Settings */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-lg p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'basic' && renderBasicTab()}
                  {activeTab === 'settings' && renderSettingsTab()}
                  {activeTab === 'validation' && renderValidationTab()}
                  {activeTab === 'advanced' && renderAdvancedTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right Panel - Preview */}
          {showPreview && (
            <div className="w-1/2 overflow-y-auto">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>How it will look</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="bg-white rounded-lg p-6 space-y-4">
                      {/* Question Header */}
                      <div>
                        {localQuestion.title ? (
                          <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            {!localQuestion.settings?.hideNumber && (
                              <span className="text-blue-600">1.</span>
                            )}
                            {localQuestion.title}
                            {localQuestion.required && <span className="text-red-500">*</span>}
                          </h4>
                        ) : (
                          <div className="h-6 bg-gray-200 rounded animate-pulse" />
                        )}
                        
                        {localQuestion.description && (
                          <p className="text-sm text-gray-600 mt-2">{localQuestion.description}</p>
                        )}
                      </div>
                      
                      {/* Question Input */}
                      <div>
                        {renderPreview()}
                      </div>
                    </div>
                  </div>

                  {/* Question Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Question Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">Type</div>
                        <div className="text-gray-600 capitalize">{localQuestion.type.replace('_', ' ')}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">Required</div>
                        <div className="text-gray-600">{localQuestion.required ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(localQuestion)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
            )}
            
            {onDelete && !isNew && (
              <button
                onClick={() => onDelete(localQuestion.id)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isDirty && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={!validation.isValid || saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <RotateCcw className="w-4 h-4" />
                </motion.div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComprehensiveQuestionEditor;
