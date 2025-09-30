import React, { useState, useRef, useEffect } from 'react';
import { getQuestionType } from '../utils/questionTypes';
import QuestionRenderer from './QuestionRenderer';
import {
  Check,
  X,
  Eye,
  EyeOff,
  Settings,
  Copy,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const InlineQuestionEditor = ({ 
  question, 
  index, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  isActive, 
  onSetActive,
  dragHandleProps 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedDescription, setEditedDescription] = useState(question.description || '');
  const [showPreview, setShowPreview] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const titleInputRef = useRef(null);

  const questionTypeInfo = getQuestionType(question.type);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    onUpdate(question.id, {
      title: editedTitle.trim() || question.title,
      description: editedDescription.trim()
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(question.title);
    setEditedDescription(question.description || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleQuickEdit = (field, value) => {
    onUpdate(question.id, { [field]: value });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
      isActive ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Question Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Drag Handle */}
            <div {...dragHandleProps} className="mt-1">
              <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" />
            </div>

            {/* Question Number & Type */}
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Q{index + 1}
              </span>
              <div className="flex items-center space-x-1">
                {questionTypeInfo?.icon && (
                  <div className="text-gray-400">
                    {questionTypeInfo.icon}
                  </div>
                )}
                <span className="text-xs text-gray-500 capitalize">
                  {questionTypeInfo?.name || question.type.replace('_', ' ')}
                </span>
              </div>
              {question.required && (
                <span className="text-xs text-red-500 font-medium">Required</span>
              )}
            </div>

            {/* Question Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    placeholder="Question title..."
                  />
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Description (optional)..."
                    rows={2}
                    className="w-full text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditing(true)}
                  className="cursor-text hover:bg-gray-50 p-1 -m-1 rounded"
                >
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    {question.title}
                  </h4>
                  {question.description && (
                    <p className="text-sm text-gray-600">
                      {question.description}
                    </p>
                  )}
                  {!question.title && (
                    <p className="text-gray-400 italic">Click to edit question title...</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 ml-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded transition-colors ${
                showPreview 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title={showPreview ? 'Hide preview' : 'Show preview'}
            >
              {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                onSetActive(isActive ? null : question.id);
              }}
              className={`p-2 rounded transition-colors ${
                showSettings 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title="Question settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDuplicate(question.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Duplicate question"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(question.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete question"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
            >
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="flex items-center space-x-4 mt-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required || false}
              onChange={(e) => handleQuickEdit('required', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Required</span>
          </label>

          {['multiple_choice', 'checkbox', 'dropdown'].includes(question.type) && (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={question.allowOther || false}
                onChange={(e) => handleQuickEdit('allowOther', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Allow "Other"</span>
            </label>
          )}

          {question.type === 'emoji_scale' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Scale:</span>
              <select
                value={question.scaleType || 'satisfaction'}
                onChange={(e) => handleQuickEdit('scaleType', e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="satisfaction">Satisfaction</option>
                <option value="mood">Mood</option>
                <option value="agreement">Agreement</option>
                <option value="experience">Experience</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Question Preview */}
      {showPreview && (
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
            Respondent View
          </div>
          <QuestionRenderer 
            question={question} 
            preview={true}
          />
        </div>
      )}

      {/* Quick Options Editor for Choice Questions */}
      {showPreview && ['multiple_choice', 'checkbox', 'dropdown'].includes(question.type) && (
        <div className="p-4 bg-blue-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-900">Quick Edit Options</span>
            <button
              onClick={() => {
                const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                handleQuickEdit('options', newOptions);
              }}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Add Option
            </button>
          </div>
          <div className="space-y-2">
            {(question.options || []).map((option, optIndex) => (
              <div key={optIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[optIndex] = e.target.value;
                    handleQuickEdit('options', newOptions);
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Option ${optIndex + 1}`}
                />
                <button
                  onClick={() => {
                    const newOptions = question.options?.filter((_, i) => i !== optIndex) || [];
                    handleQuickEdit('options', newOptions);
                  }}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Settings Panel */}
      {showSettings && isActive && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Advanced Settings
          </div>
          
          {/* Settings content will be handled by the main QuestionEditor */}
          <div className="text-sm text-gray-600">
            Click the settings button in the toolbar to open detailed settings panel.
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineQuestionEditor;
