import React, { useState } from 'react';
import { getQuestionType, emojiScales } from '../utils/questionTypes';
import {
  X,
  Plus,
  Trash2,
  Settings,
  Type,
  AlignLeft,
  List,
  Star,
  Sliders,
  Smile,
  Upload,
  Hash
} from 'lucide-react';

const QuestionEditor = ({ question, onUpdate, onClose }) => {
  const [localQuestion, setLocalQuestion] = useState(question);

  const handleUpdate = (field, value) => {
    const updated = { ...localQuestion, [field]: value };
    setLocalQuestion(updated);
    onUpdate(updated);
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

  const questionTypeInfo = getQuestionType(localQuestion.type);
  const needsOptions = ['multiple_choice', 'checkbox', 'dropdown', 'image_choice'].includes(localQuestion.type);
  const isNumericType = ['number', 'currency', 'percentage'].includes(localQuestion.type);
  const isFileType = localQuestion.type === 'file';

  return (
    <div className="h-full flex flex-col question-editor-container bg-white">
      {/* Modern Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              {questionTypeInfo?.icon && (
                <div className="text-white text-xl">
                  {questionTypeInfo.icon}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Edit Question</h3>
              <p className="text-slate-300 text-sm font-medium">{questionTypeInfo?.name || 'Question Type'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group p-3 text-slate-300 hover:text-white rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto question-editor-desktop bg-slate-50/50">
        <div className="p-8 space-y-8 question-editor-content">
        {/* Basic Information Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Type className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">Basic Information</h4>
              <p className="text-slate-500 text-sm font-medium">Define your question content</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Question Title */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-900 mb-3 tracking-wide">
                Question Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={localQuestion.title}
                onChange={(e) => handleUpdate('title', e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400"
                placeholder="What would you like to ask?"
              />
            </div>

            {/* Question Description */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-900 mb-3 tracking-wide">
                Description <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={localQuestion.description || ''}
                onChange={(e) => handleUpdate('description', e.target.value)}
                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400 resize-none"
                rows={3}
                placeholder="Provide additional context or instructions..."
              />
            </div>
          </div>
        </div>

        {/* Options for choice questions */}
        {needsOptions && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <List className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">Answer Options</h4>
                <p className="text-slate-500 text-sm font-medium">Define available choices</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {(localQuestion.options || []).map((option, index) => (
                <div key={index} className="group flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 transition-all duration-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-900 font-medium placeholder-slate-400"
                    placeholder={`Enter option ${index + 1}...`}
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="flex-shrink-0 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={addOption}
                className="w-full flex items-center justify-center space-x-3 p-6 border-2 border-dashed border-emerald-300 rounded-2xl text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 font-bold group"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Add New Option</span>
              </button>
            </div>
          </div>
        )}

        {/* Question Type Info */}
        {questionTypeInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              {questionTypeInfo.icon}
              <span className="font-medium text-blue-900">{questionTypeInfo.name}</span>
            </div>
            <p className="text-sm text-blue-700">{questionTypeInfo.description}</p>
          </div>
        )}

        {/* Emoji Scale Settings */}
        {localQuestion.type === 'emoji_scale' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Smile className="w-4 h-4 inline mr-1" />
              Emoji Scale Type
            </label>
            <select
              value={localQuestion.scaleType || 'satisfaction'}
              onChange={(e) => handleUpdate('scaleType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            >
              {Object.entries(emojiScales).map(([key, scale]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({scale.length} points)
                </option>
              ))}
            </select>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localQuestion.showLabels !== false}
                onChange={(e) => handleUpdate('showLabels', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Show labels</span>
            </label>
          </div>
        )}

        {/* Rating Settings */}
        {localQuestion.type === 'rating' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Rating Settings
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Rating</label>
                <select
                  value={localQuestion.maxRating || 5}
                  onChange={(e) => handleUpdate('maxRating', parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>3 Stars</option>
                  <option value={5}>5 Stars</option>
                  <option value={7}>7 Stars</option>
                  <option value={10}>10 Stars</option>
                </select>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localQuestion.allowHalf || false}
                  onChange={(e) => handleUpdate('allowHalf', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Allow half stars</span>
              </label>
            </div>
          </div>
        )}

        {/* Scale Settings */}
        {localQuestion.type === 'scale' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Sliders className="w-4 h-4 inline mr-1" />
              Scale Settings
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Value</label>
                <input
                  type="number"
                  value={localQuestion.minScale || 1}
                  onChange={(e) => handleUpdate('minScale', parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Value</label>
                <input
                  type="number"
                  value={localQuestion.maxScale || 10}
                  onChange={(e) => handleUpdate('maxScale', parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Step</label>
                <input
                  type="number"
                  value={localQuestion.step || 1}
                  onChange={(e) => handleUpdate('step', parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Numeric Settings */}
        {isNumericType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              Numeric Settings
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Value</label>
                <input
                  type="number"
                  value={localQuestion.min || ''}
                  onChange={(e) => handleUpdate('min', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No limit"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Value</label>
                <input
                  type="number"
                  value={localQuestion.max || ''}
                  onChange={(e) => handleUpdate('max', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No limit"
                />
              </div>
            </div>
            {localQuestion.type === 'currency' && (
              <div className="mt-3">
                <label className="block text-xs text-gray-500 mb-1">Currency</label>
                <select
                  value={localQuestion.currency || 'USD'}
                  onChange={(e) => handleUpdate('currency', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="GHS">GHS (₵)</option>
                  <option value="NGN">NGN (₦)</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* File Upload Settings */}
        {isFileType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              File Upload Settings
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Allowed File Types</label>
                <input
                  type="text"
                  value={(localQuestion.fileTypes || []).join(', ')}
                  onChange={(e) => handleUpdate('fileTypes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="jpg, png, pdf, doc"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={localQuestion.maxSize || 10}
                    onChange={(e) => handleUpdate('maxSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Files</label>
                  <input
                    type="number"
                    value={localQuestion.maxFiles || 1}
                    onChange={(e) => handleUpdate('maxFiles', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">Settings</h4>
              <p className="text-slate-500 text-sm font-medium">Configure question behavior</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="group flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-violet-300 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localQuestion.required || false}
                    onChange={(e) => handleUpdate('required', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-xl border-2 transition-all duration-200 ${
                    localQuestion.required 
                      ? 'bg-violet-500 border-violet-500' 
                      : 'bg-white border-slate-300 group-hover:border-violet-400'
                  }`}>
                    {localQuestion.required && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-slate-900 font-bold text-sm">Required Question</span>
                  <p className="text-slate-500 text-xs">Must be answered to continue</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-bold">
                Required
              </div>
            </label>

            {needsOptions && (
              <label className="group flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-violet-300 transition-all duration-200 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={localQuestion.allowOther || false}
                      onChange={(e) => handleUpdate('allowOther', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-xl border-2 transition-all duration-200 ${
                      localQuestion.allowOther 
                        ? 'bg-violet-500 border-violet-500' 
                        : 'bg-white border-slate-300 group-hover:border-violet-400'
                    }`}>
                      {localQuestion.allowOther && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold text-sm">Allow "Other" Option</span>
                    <p className="text-slate-500 text-xs">Let users add custom responses</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-bold">
                  Custom
                </div>
              </label>
            )}

            {localQuestion.type === 'checkbox' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Selections</label>
                  <input
                    type="number"
                    value={localQuestion.minSelections || ''}
                    onChange={(e) => handleUpdate('minSelections', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="No limit"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Selections</label>
                  <input
                    type="number"
                    value={localQuestion.maxSelections || ''}
                    onChange={(e) => handleUpdate('maxSelections', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="No limit"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validation Rules */}
        {['text', 'textarea', 'number'].includes(localQuestion.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Validation
            </label>
            <div className="space-y-3">
              {(localQuestion.type === 'text' || localQuestion.type === 'textarea') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min Length</label>
                    <input
                      type="number"
                      value={localQuestion.minLength || ''}
                      onChange={(e) => handleUpdate('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Length</label>
                    <input
                      type="number"
                      value={localQuestion.maxLength || ''}
                      onChange={(e) => handleUpdate('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              )}

              {localQuestion.type === 'number' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min Value</label>
                    <input
                      type="number"
                      value={localQuestion.minValue || ''}
                      onChange={(e) => handleUpdate('minValue', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Value</label>
                    <input
                      type="number"
                      value={localQuestion.maxValue || ''}
                      onChange={(e) => handleUpdate('maxValue', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
