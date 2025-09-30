import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Square,
  Copy,
  Trash2,
  Move,
  Edit3,
  Eye,
  EyeOff,
  Settings,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Zap,
  Filter,
  Search
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const BulkQuestionOperations = ({ 
  questions, 
  selectedQuestions, 
  onSelectionChange,
  onBulkDelete,
  onBulkDuplicate,
  onBulkReorder,
  onBulkEdit,
  onBulkToggleRequired,
  onBulkToggleVisibility
}) => {
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const selectedCount = selectedQuestions.length;
  const totalCount = questions.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  useEffect(() => {
    setShowBulkPanel(selectedCount > 0);
  }, [selectedCount]);

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(questions.map(q => q.id));
    }
  };

  const handleSelectQuestion = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      onSelectionChange(selectedQuestions.filter(id => id !== questionId));
    } else {
      onSelectionChange([...selectedQuestions, questionId]);
    }
  };

  const handleBulkAction = (action) => {
    setBulkAction(action);
    
    if (['delete', 'duplicate'].includes(action)) {
      setConfirmAction(action);
      setShowConfirmDialog(true);
    } else {
      executeBulkAction(action);
    }
  };

  const executeBulkAction = (action) => {
    switch (action) {
      case 'delete':
        onBulkDelete(selectedQuestions);
        break;
      case 'duplicate':
        onBulkDuplicate(selectedQuestions);
        break;
      case 'makeRequired':
        onBulkToggleRequired(selectedQuestions, true);
        break;
      case 'makeOptional':
        onBulkToggleRequired(selectedQuestions, false);
        break;
      case 'hide':
        onBulkToggleVisibility(selectedQuestions, false);
        break;
      case 'show':
        onBulkToggleVisibility(selectedQuestions, true);
        break;
      case 'moveUp':
        onBulkReorder(selectedQuestions, 'up');
        break;
      case 'moveDown':
        onBulkReorder(selectedQuestions, 'down');
        break;
    }
    
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setBulkAction('');
  };

  const getQuestionTypeColor = (type) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      textarea: 'bg-blue-100 text-blue-800',
      multiple_choice: 'bg-green-100 text-green-800',
      checkbox: 'bg-green-100 text-green-800',
      rating: 'bg-yellow-100 text-yellow-800',
      emoji_scale: 'bg-pink-100 text-pink-800',
      date: 'bg-purple-100 text-purple-800',
      number: 'bg-indigo-100 text-indigo-800',
      email: 'bg-cyan-100 text-cyan-800',
      phone: 'bg-cyan-100 text-cyan-800',
      slider: 'bg-orange-100 text-orange-800',
      matrix: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || question.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const questionTypes = [...new Set(questions.map(q => q.type))];

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
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
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {questionTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Selection Header */}
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : someSelected ? (
              <div className="w-4 h-4 bg-blue-600 rounded border-2 border-blue-600 flex items-center justify-center">
                <Minus className="w-2 h-2 text-white" />
              </div>
            ) : (
              <Square className="w-4 h-4" />
            )}
            Select All ({selectedCount}/{totalCount})
          </button>
        </div>
        
        {selectedCount > 0 && (
          <div className="text-sm text-blue-600 font-medium">
            {selectedCount} question{selectedCount !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-2">
        {filteredQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 border rounded-lg transition-all ${
              selectedQuestions.includes(question.id)
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => handleSelectQuestion(question.id)}
                className="mt-1 flex-shrink-0"
              >
                {selectedQuestions.includes(question.id) ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {question.title || 'Untitled Question'}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    {question.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {question.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQuestionTypeColor(question.type)}`}>
                      {question.type.replace('_', ' ')}
                    </span>
                    
                    {question.hidden && (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Question {index + 1}</span>
                  {question.settings?.options && (
                    <span>{question.settings.options.length} options</span>
                  )}
                  {question.type === 'rating' && question.settings?.maxRating && (
                    <span>{question.settings.maxRating} stars</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bulk Actions Panel */}
      <AnimatePresence>
        {showBulkPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 mr-2">
                {selectedCount} selected:
              </span>
              
              <button
                onClick={() => handleBulkAction('duplicate')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              
              <button
                onClick={() => handleBulkAction('makeRequired')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Required
              </button>
              
              <button
                onClick={() => handleBulkAction('makeOptional')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Minus className="w-4 h-4" />
                Optional
              </button>
              
              <button
                onClick={() => handleBulkAction('hide')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                Hide
              </button>
              
              <button
                onClick={() => handleBulkAction('show')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4" />
                Show
              </button>
              
              <div className="w-px h-6 bg-gray-200 mx-2" />
              
              <button
                onClick={() => handleBulkAction('moveUp')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <ArrowUp className="w-4 h-4" />
                Move Up
              </button>
              
              <button
                onClick={() => handleBulkAction('moveDown')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <ArrowDown className="w-4 h-4" />
                Move Down
              </button>
              
              <div className="w-px h-6 bg-gray-200 mx-2" />
              
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              
              <button
                onClick={() => onSelectionChange([])}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors ml-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
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
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirm {confirmAction === 'delete' ? 'Deletion' : 'Duplication'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action affects {selectedCount} question{selectedCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                {confirmAction === 'delete' ? (
                  <>Are you sure you want to delete the selected questions? This action cannot be undone.</>
                ) : (
                  <>Are you sure you want to duplicate the selected questions? They will be added to the end of your survey.</>
                )}
              </p>
              
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfirmAction(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeBulkAction(confirmAction)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    confirmAction === 'delete'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {confirmAction === 'delete' ? 'Delete' : 'Duplicate'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkQuestionOperations;
