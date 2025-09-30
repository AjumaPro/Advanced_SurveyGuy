import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  FileText,
  List,
  CheckSquare,
  Star,
  Sliders,
  Calendar,
  Clock,
  Phone,
  Mail,
  Hash,
  Upload,
  BarChart3,
  Grid,
  Smile,
  MapPin,
  Globe,
  Image,
  ThumbsUp,
  Heart,
  TrendingUp,
  MessageSquare,
  Settings,
  Plus,
  Minus,
  Move,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
  Unlock
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { questionTypes, getDefaultQuestionSettings, emojiScales } from '../utils/questionTypes';

const AdvancedQuestionEditor = ({ question, onUpdate, onClose, onDelete, onDuplicate }) => {
  const [localQuestion, setLocalQuestion] = useState(question || {
    id: `q_${Date.now()}`,
    type: 'text',
    title: '',
    description: '',
    required: false,
    settings: {}
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showConditional, setShowConditional] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!localQuestion.settings || Object.keys(localQuestion.settings).length === 0) {
      setLocalQuestion(prev => ({
        ...prev,
        settings: getDefaultQuestionSettings(prev.type)
      }));
    }
  }, [localQuestion.type]);

  const handleUpdate = (updates) => {
    const updated = { ...localQuestion, ...updates };
    setLocalQuestion(updated);
    onUpdate(updated);
  };

  const handleSettingsUpdate = (key, value) => {
    const newSettings = { ...localQuestion.settings, [key]: value };
    handleUpdate({ settings: newSettings });
  };

  const validateQuestion = () => {
    const newErrors = {};
    
    if (!localQuestion.title.trim()) {
      newErrors.title = 'Question title is required';
    }
    
    if (localQuestion.type === 'multiple_choice' || localQuestion.type === 'checkbox') {
      if (!localQuestion.settings.options || localQuestion.settings.options.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }
    }
    
    if (localQuestion.type === 'rating' && (!localQuestion.settings.maxRating || localQuestion.settings.maxRating < 2)) {
      newErrors.maxRating = 'Maximum rating must be at least 2';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOption = () => {
    const options = localQuestion.settings.options || [];
    handleSettingsUpdate('options', [...options, `Option ${options.length + 1}`]);
  };

  const updateOption = (index, value) => {
    const options = [...localQuestion.settings.options];
    options[index] = value;
    handleSettingsUpdate('options', options);
  };

  const removeOption = (index) => {
    const options = localQuestion.settings.options.filter((_, i) => i !== index);
    handleSettingsUpdate('options', options);
  };

  const reorderOptions = (result) => {
    if (!result.destination) return;
    
    const options = Array.from(localQuestion.settings.options);
    const [reorderedOption] = options.splice(result.source.index, 1);
    options.splice(result.destination.index, 0, reorderedOption);
    
    handleSettingsUpdate('options', options);
  };

  const renderQuestionPreview = () => {
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
            {(localQuestion.settings.options || []).map((option, index) => (
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
        
      case 'checkbox':
        return (
          <div className="space-y-2">
            {(localQuestion.settings.options || []).map((option, index) => (
              <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600" disabled />
                <span>{option}</span>
              </label>
            ))}
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
                {localQuestion.settings.showLabels && (
                  <span className="text-xs text-gray-600 text-center">{emoji.label}</span>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'slider':
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={localQuestion.settings.min || 0}
              max={localQuestion.settings.max || 100}
              step={localQuestion.settings.step || 1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{localQuestion.settings.min || 0}</span>
              <span>{localQuestion.settings.max || 100}</span>
            </div>
          </div>
        );
        
      case 'matrix':
        const rows = localQuestion.settings.rows || ['Row 1', 'Row 2'];
        const columns = localQuestion.settings.columns || ['Column 1', 'Column 2'];
        return (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr>
                  <th className="p-3 border-b border-gray-200 bg-gray-50"></th>
                  {columns.map((col, index) => (
                    <th key={index} className="p-3 border-b border-gray-200 bg-gray-50 text-center text-sm font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="p-3 border-b border-gray-200 font-medium">{row}</td>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="p-3 border-b border-gray-200 text-center">
                        <input type="radio" name={`matrix_${rowIndex}`} className="w-4 h-4 text-blue-600" disabled />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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

  const renderSettings = () => {
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
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Length</label>
                <input
                  type="number"
                  value={localQuestion.settings.maxLength || ''}
                  onChange={(e) => handleSettingsUpdate('maxLength', parseInt(e.target.value) || null)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Options</label>
                <button
                  onClick={addOption}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-3 h-3" />
                  Add Option
                </button>
              </div>
              
              <DragDropContext onDragEnd={reorderOptions}>
                <Droppable droppableId="options">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {(localQuestion.settings.options || []).map((option, index) => (
                        <Draggable key={index} draggableId={`option-${index}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-2 p-2 border border-gray-200 rounded-lg ${
                                snapshot.isDragging ? 'bg-blue-50 border-blue-300' : 'bg-white'
                              }`}
                            >
                              <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600">
                                <Move className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 p-1 border-0 focus:ring-0 focus:outline-none"
                                placeholder={`Option ${index + 1}`}
                              />
                              <button
                                onClick={() => removeOption(index)}
                                className="text-red-400 hover:text-red-600"
                                disabled={(localQuestion.settings.options || []).length <= 2}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localQuestion.settings.allowOther || false}
                onChange={(e) => handleSettingsUpdate('allowOther', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">Allow "Other" option</label>
            </div>
            
            {localQuestion.type === 'checkbox' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Selections</label>
                  <input
                    type="number"
                    value={localQuestion.settings.minSelections || ''}
                    onChange={(e) => handleSettingsUpdate('minSelections', parseInt(e.target.value) || null)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Selections</label>
                  <input
                    type="number"
                    value={localQuestion.settings.maxSelections || ''}
                    onChange={(e) => handleSettingsUpdate('maxSelections', parseInt(e.target.value) || null)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-4 h-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">Allow half stars</label>
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
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="satisfaction">Satisfaction</option>
                <option value="mood">Mood</option>
                <option value="agreement">Agreement</option>
                <option value="experience">Experience</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localQuestion.settings.showLabels !== false}
                onChange={(e) => handleSettingsUpdate('showLabels', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">Show labels</label>
            </div>
          </div>
        );
        
      case 'slider':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
                <input
                  type="number"
                  value={localQuestion.settings.min || 0}
                  onChange={(e) => handleSettingsUpdate('min', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
                <input
                  type="number"
                  value={localQuestion.settings.max || 100}
                  onChange={(e) => handleSettingsUpdate('max', parseInt(e.target.value) || 100)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Step</label>
                <input
                  type="number"
                  value={localQuestion.settings.step || 1}
                  onChange={(e) => handleSettingsUpdate('step', parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localQuestion.settings.showValue !== false}
                onChange={(e) => handleSettingsUpdate('showValue', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label className="text-sm text-gray-700">Show current value</label>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center text-gray-500 py-4">
            No additional settings available for this question type
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Question Editor</h2>
              <p className="text-sm text-gray-500">Configure your question settings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`p-2 rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Settings */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Settings</h3>
                
                {/* Question Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                  <select
                    value={localQuestion.type}
                    onChange={(e) => handleUpdate({ type: e.target.value, settings: getDefaultQuestionSettings(e.target.value) })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {questionTypes.map(category => (
                      <optgroup key={category.category} label={category.category}>
                        {category.types.map(type => (
                          <option key={type.type} value={type.type}>{type.name}</option>
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
                      errors.title ? 'border-red-300' : 'border-gray-200'
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={localQuestion.description || ''}
                    onChange={(e) => handleUpdate({ description: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
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
                    className="w-4 h-4 text-blue-600"
                  />
                  <label className="text-sm font-medium text-gray-700">Required Question</label>
                </div>
              </div>
              
              {/* Question-specific Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Question Settings</h3>
                {renderSettings()}
              </div>
              
              {/* Advanced Settings */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Advanced Settings
                </button>
                
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={localQuestion.settings.randomizeOptions || false}
                          onChange={(e) => handleSettingsUpdate('randomizeOptions', e.target.checked)}
                          className="w-4 h-4 text-blue-600"
                          disabled={!['multiple_choice', 'checkbox'].includes(localQuestion.type)}
                        />
                        <label className="text-sm text-gray-700">Randomize option order</label>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={localQuestion.settings.hideNumber || false}
                          onChange={(e) => handleSettingsUpdate('hideNumber', e.target.checked)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label className="text-sm text-gray-700">Hide question number</label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Preview */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Preview</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="space-y-4">
                    {/* Question Header */}
                    <div>
                      {localQuestion.title && (
                        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          {localQuestion.title}
                          {localQuestion.required && <span className="text-red-500">*</span>}
                        </h4>
                      )}
                      {localQuestion.description && (
                        <p className="text-sm text-gray-600 mt-1">{localQuestion.description}</p>
                      )}
                    </div>
                    
                    {/* Question Input */}
                    <div className="bg-white rounded-lg p-4">
                      {renderQuestionPreview()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            
            {onDelete && (
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
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={() => {
                if (validateQuestion()) {
                  onClose();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Save Question
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedQuestionEditor;
