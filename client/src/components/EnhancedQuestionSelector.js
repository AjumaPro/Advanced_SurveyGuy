import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Square,
  Edit3,
  Eye,
  Copy,
  Trash2,
  Star,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Minus,
  Settings,
  Save,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Crown,
  BookOpen,
  Tag,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getQuestionType } from '../utils/questionTypes';
import { validateQuestion } from '../utils/questionValidation';

const EnhancedQuestionSelector = ({ 
  questions = [], 
  selectedQuestions = [],
  onSelectionChange,
  onEditQuestion,
  onDeleteQuestions,
  onDuplicateQuestions,
  onReorderQuestions,
  onBulkEdit,
  showBulkActions = true,
  allowMultiSelect = true,
  viewMode = 'grid' // 'grid' or 'list'
}) => {
  const [localSelectedQuestions, setLocalSelectedQuestions] = useState(selectedQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    setLocalSelectedQuestions(selectedQuestions);
  }, [selectedQuestions]);

  const handleSelectionChange = (questionIds) => {
    setLocalSelectedQuestions(questionIds);
    onSelectionChange?.(questionIds);
  };

  const toggleQuestionSelection = (questionId) => {
    if (!allowMultiSelect) {
      handleSelectionChange([questionId]);
      return;
    }

    const newSelection = localSelectedQuestions.includes(questionId)
      ? localSelectedQuestions.filter(id => id !== questionId)
      : [...localSelectedQuestions, questionId];
    
    handleSelectionChange(newSelection);
  };

  const selectAllQuestions = () => {
    if (localSelectedQuestions.length === filteredQuestions.length) {
      handleSelectionChange([]);
    } else {
      handleSelectionChange(filteredQuestions.map(q => q.id));
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         filterType === 'required' && question.required ||
                         filterType === 'optional' && !question.required ||
                         filterType === question.type;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'type':
        return a.type.localeCompare(b.type);
      case 'required':
        return b.required - a.required;
      case 'order':
      default:
        return questions.indexOf(a) - questions.indexOf(b);
    }
  });

  const getQuestionTypeInfo = (type) => {
    return getQuestionType(type) || { 
      name: type, 
      icon: <Tag className="w-4 h-4" />,
      category: 'Unknown'
    };
  };

  const getValidationStatus = (question) => {
    const validation = validateQuestion(question);
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      hasWarnings: Object.keys(validation.errors).length > 0
    };
  };

  const getQuestionStats = (question) => {
    const typeInfo = getQuestionTypeInfo(question.type);
    const validation = getValidationStatus(question);
    
    return {
      type: typeInfo.name,
      category: typeInfo.category,
      hasOptions: question.settings?.options?.length > 0,
      optionCount: question.settings?.options?.length || 0,
      isValid: validation.isValid,
      hasWarnings: validation.hasWarnings
    };
  };

  const renderQuestionCard = (question, index) => {
    const isSelected = localSelectedQuestions.includes(question.id);
    const stats = getQuestionStats(question);
    
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`relative group bg-white border-2 rounded-xl p-4 transition-all cursor-pointer ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }`}
        onClick={() => toggleQuestionSelection(question.id)}
      >
        {/* Selection Checkbox */}
        {allowMultiSelect && (
          <div className="absolute top-3 left-3 z-10">
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </div>
        )}

        {/* Question Header */}
        <div className={`${allowMultiSelect ? 'ml-8' : ''} mb-3`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {question.title || 'Untitled Question'}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {question.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {question.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Validation Status */}
              {stats.hasWarnings ? (
                <div className="w-2 h-2 bg-orange-400 rounded-full" title="Has validation warnings" />
              ) : stats.isValid ? (
                <div className="w-2 h-2 bg-green-400 rounded-full" title="Valid question" />
              ) : (
                <div className="w-2 h-2 bg-red-400 rounded-full" title="Has validation errors" />
              )}
              
              {/* Question Type Badge */}
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {stats.type}
              </span>
            </div>
          </div>
        </div>

        {/* Question Preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-2">Preview:</div>
          {renderQuestionPreview(question)}
        </div>

        {/* Question Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>Question {index + 1}</span>
            {stats.hasOptions && (
              <span>{stats.optionCount} options</span>
            )}
            <span className="capitalize">{stats.category}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {question.required && (
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">Required</span>
            )}
          </div>
        </div>

        {/* Quick Actions (shown on hover) */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditQuestion?.(question);
                setEditingQuestion(question);
              }}
              className="p-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              title="Edit Question"
            >
              <Edit3 className="w-3 h-3 text-gray-600" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle preview or show detailed view
              }}
              className="p-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              title="Preview Question"
            >
              <Eye className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-600 bg-opacity-5 rounded-xl pointer-events-none" />
        )}
      </motion.div>
    );
  };

  const renderQuestionRow = (question, index) => {
    const isSelected = localSelectedQuestions.includes(question.id);
    const stats = getQuestionStats(question);
    
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className={`flex items-center gap-4 p-4 bg-white border rounded-lg transition-all cursor-pointer ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-sm' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => toggleQuestionSelection(question.id)}
      >
        {/* Selection Checkbox */}
        {allowMultiSelect && (
          <div className="flex-shrink-0">
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </div>
        )}

        {/* Question Type Icon */}
        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
          {getQuestionTypeInfo(question.type).icon}
        </div>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 truncate">
                {question.title || 'Untitled Question'}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {question.description && (
                <p className="text-sm text-gray-600 truncate mt-1">
                  {question.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span>Question {index + 1}</span>
                <span className="capitalize">{stats.type}</span>
                {stats.hasOptions && <span>{stats.optionCount} options</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Validation Status */}
          {stats.hasWarnings ? (
            <div className="w-3 h-3 bg-orange-400 rounded-full" title="Has warnings" />
          ) : stats.isValid ? (
            <div className="w-3 h-3 bg-green-400 rounded-full" title="Valid" />
          ) : (
            <div className="w-3 h-3 bg-red-400 rounded-full" title="Has errors" />
          )}
          
          {/* Required Badge */}
          {question.required && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
              Required
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditQuestion?.(question);
              setEditingQuestion(question);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit Question"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const renderQuestionPreview = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={question.settings?.placeholder || 'Enter your answer...'}
            className="w-full p-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
            disabled
          />
        );
        
      case 'multiple_choice':
        return (
          <div className="space-y-1">
            {(question.settings?.options || ['Option 1', 'Option 2']).slice(0, 3).map((option, idx) => (
              <label key={idx} className="flex items-center gap-2 text-sm">
                <input type="radio" className="w-3 h-3" disabled />
                <span>{option}</span>
              </label>
            ))}
            {(question.settings?.options?.length || 0) > 3 && (
              <span className="text-xs text-gray-500">+{(question.settings.options.length - 3)} more options</span>
            )}
          </div>
        );
        
      case 'rating':
        return (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(question.settings?.maxRating || 5, 5) }).map((_, idx) => (
              <Star key={idx} className="w-4 h-4 text-gray-300" />
            ))}
          </div>
        );
        
      case 'emoji_scale':
        return (
          <div className="flex justify-between">
            {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, idx) => (
              <span key={idx} className="text-lg">{emoji}</span>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="text-xs text-gray-500 italic">
            {question.type.replace('_', ' ')} question
          </div>
        );
    }
  };

  const questionTypes = [...new Set(questions.map(q => q.type))];
  const selectedCount = localSelectedQuestions.length;
  const totalCount = filteredQuestions.length;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Questions ({totalCount})
          </h3>
          
          {selectedCount > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {selectedCount} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {/* Toggle to grid view */}}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {/* Toggle to list view */}}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Advanced Options */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Options</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Questions</option>
            <option value="required">Required Only</option>
            <option value="optional">Optional Only</option>
            {questionTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="order">Original Order</option>
          <option value="title">Title A-Z</option>
          <option value="type">Question Type</option>
          <option value="required">Required First</option>
        </select>
      </div>

      {/* Advanced Options Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bulk Selection */}
                {allowMultiSelect && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Bulk Selection</h4>
                    <div className="space-y-1">
                      <button
                        onClick={selectAllQuestions}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
                      </button>
                      <button
                        onClick={() => {
                          const requiredQuestions = filteredQuestions.filter(q => q.required).map(q => q.id);
                          handleSelectionChange(requiredQuestions);
                        }}
                        className="block text-sm text-blue-600 hover:text-blue-800"
                      >
                        Select Required Only
                      </button>
                      <button
                        onClick={() => {
                          const invalidQuestions = filteredQuestions.filter(q => !getValidationStatus(q).isValid).map(q => q.id);
                          handleSelectionChange(invalidQuestions);
                        }}
                        className="block text-sm text-orange-600 hover:text-orange-800"
                      >
                        Select Invalid Questions
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Quick Stats</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Total: {totalCount} questions</div>
                    <div>Required: {questions.filter(q => q.required).length}</div>
                    <div>Optional: {questions.filter(q => !q.required).length}</div>
                    <div>Types: {questionTypes.length} different</div>
                  </div>
                </div>

                {/* Validation Summary */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Validation</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-gray-600">
                        {questions.filter(q => getValidationStatus(q).isValid).length} valid
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full" />
                      <span className="text-gray-600">
                        {questions.filter(q => getValidationStatus(q).hasWarnings).length} with warnings
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="text-gray-600">
                        {questions.filter(q => !getValidationStatus(q).isValid).length} with errors
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedCount} question{selectedCount !== 1 ? 's' : ''} selected
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDuplicateQuestions?.(localSelectedQuestions)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm">Duplicate</span>
              </button>
              
              <button
                onClick={() => onBulkEdit?.(localSelectedQuestions)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
              
              <button
                onClick={() => onDeleteQuestions?.(localSelectedQuestions)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
              
              <button
                onClick={() => handleSelectionChange([])}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Questions Grid/List */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first question'
            }
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {filteredQuestions.map((question, index) => 
            viewMode === 'grid' 
              ? renderQuestionCard(question, index)
              : renderQuestionRow(question, index)
          )}
        </div>
      )}

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {selectedCount} of {totalCount} questions selected
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <span>Ready for bulk operations</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedQuestionSelector;
