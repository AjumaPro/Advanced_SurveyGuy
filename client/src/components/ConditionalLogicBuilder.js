import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  X,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ConditionalLogicBuilder = ({ 
  question, 
  allQuestions = [], 
  onLogicUpdate, 
  onClose 
}) => {
  const [logic, setLogic] = useState(question?.conditionalLogic || {
    enabled: false,
    conditions: [],
    operator: 'any', // 'any' or 'all'
    action: 'show' // 'show' or 'hide'
  });
  // const [isExpanded] = useState(false);
  // const [editingCondition] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Available operators for different question types
  const operators = {
    multiple_choice: [
      { value: 'equals', label: 'is', icon: '=' },
      { value: 'not_equals', label: 'is not', icon: '≠' },
      { value: 'contains', label: 'contains', icon: '⊃' }
    ],
    checkbox: [
      { value: 'contains', label: 'contains', icon: '⊃' },
      { value: 'not_contains', label: 'does not contain', icon: '⊅' },
      { value: 'equals', label: 'is exactly', icon: '=' }
    ],
    rating: [
      { value: 'equals', label: 'is', icon: '=' },
      { value: 'greater_than', label: 'is greater than', icon: '>' },
      { value: 'less_than', label: 'is less than', icon: '<' },
      { value: 'greater_equal', label: 'is greater than or equal to', icon: '≥' },
      { value: 'less_equal', label: 'is less than or equal to', icon: '≤' }
    ],
    emoji_scale: [
      { value: 'equals', label: 'is', icon: '=' },
      { value: 'greater_than', label: 'is greater than', icon: '>' },
      { value: 'less_than', label: 'is less than', icon: '<' }
    ],
    text: [
      { value: 'contains', label: 'contains', icon: '⊃' },
      { value: 'not_contains', label: 'does not contain', icon: '⊅' },
      { value: 'equals', label: 'is exactly', icon: '=' },
      { value: 'is_empty', label: 'is empty', icon: '∅' },
      { value: 'is_not_empty', label: 'is not empty', icon: '¬∅' }
    ],
    yes_no: [
      { value: 'equals', label: 'is', icon: '=' }
    ]
  };

  const addCondition = () => {
    const newCondition = {
      id: Date.now(),
      questionId: '',
      operator: 'equals',
      value: '',
      questionType: 'multiple_choice'
    };
    
    setLogic(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
    // setEditingCondition(newCondition.id);
  };

  const updateCondition = (conditionId, updates) => {
    setLogic(prev => ({
      ...prev,
      conditions: prev.conditions.map(condition =>
        condition.id === conditionId
          ? { ...condition, ...updates }
          : condition
      )
    }));
  };

  const removeCondition = (conditionId) => {
    setLogic(prev => ({
      ...prev,
      conditions: prev.conditions.filter(condition => condition.id !== conditionId)
    }));
  };

  const getQuestionOptions = (questionId) => {
    const targetQuestion = allQuestions.find(q => q.id === questionId);
    if (!targetQuestion) return [];
    
    switch (targetQuestion.type) {
      case 'multiple_choice':
      case 'checkbox':
      case 'dropdown':
        return targetQuestion.options || [];
      case 'rating':
        return Array.from({ length: targetQuestion.maxRating || 5 }, (_, i) => i + 1);
      case 'emoji_scale':
        return targetQuestion.scale || [];
      case 'yes_no':
        return ['Yes', 'No'];
      default:
        return [];
    }
  };

  const getOperatorOptions = (questionType) => {
    return operators[questionType] || operators.multiple_choice;
  };

  const validateLogic = () => {
    if (!logic.enabled) return { valid: true };
    
    const hasValidConditions = logic.conditions.every(condition => 
      condition.questionId && condition.operator && condition.value
    );
    
    return {
      valid: hasValidConditions && logic.conditions.length > 0,
      errors: hasValidConditions ? [] : ['All conditions must be complete']
    };
  };

  const saveLogic = () => {
    const validation = validateLogic();
    if (validation.valid) {
      onLogicUpdate(logic);
      onClose();
    }
  };

  const previewLogic = () => {
    // Generate a visual representation of the logic
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700">
          Show this question when:
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          {logic.conditions.map((condition, index) => {
            const targetQuestion = allQuestions.find(q => q.id === condition.questionId);
            const operator = getOperatorOptions(condition.questionType).find(op => op.value === condition.operator);
            
            return (
              <div key={condition.id} className="flex items-center space-x-2 text-sm">
                {index > 0 && (
                  <span className="text-slate-500 font-medium">
                    {logic.operator === 'any' ? 'OR' : 'AND'}
                  </span>
                )}
                <span className="font-medium text-slate-900">
                  "{targetQuestion?.title || 'Select question'}"
                </span>
                <span className="text-slate-600">
                  {operator?.label || condition.operator}
                </span>
                <span className="font-medium text-slate-900">
                  "{condition.value}"
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const validation = validateLogic();

  return (
    <div className="conditional-logic-builder bg-white rounded-xl border border-slate-200 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <GitBranch className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Conditional Logic</h3>
              <p className="text-sm text-slate-600">
                Show or hide this question based on previous answers
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enable/Disable Toggle */}
        <div className="mb-6">
          <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-slate-900">Enable Conditional Logic</div>
                <div className="text-sm text-slate-600">
                  Show this question only when certain conditions are met
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={logic.enabled}
                onChange={(e) => setLogic(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${
                logic.enabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  logic.enabled ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`}></div>
              </div>
            </div>
          </label>
        </div>

        {logic.enabled && (
          <div className="space-y-6">
            {/* Logic Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Condition Operator
                </label>
                <select
                  value={logic.operator}
                  onChange={(e) => setLogic(prev => ({ ...prev, operator: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="any">Any condition is met (OR)</option>
                  <option value="all">All conditions are met (AND)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Action
                </label>
                <select
                  value={logic.action}
                  onChange={(e) => setLogic(prev => ({ ...prev, action: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="show">Show question</option>
                  <option value="hide">Hide question</option>
                </select>
              </div>
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-900">Conditions</h4>
                <button
                  onClick={addCondition}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Condition</span>
                </button>
              </div>

              {logic.conditions.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No Conditions</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Add conditions to control when this question appears
                  </p>
                  <button
                    onClick={addCondition}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Condition</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {logic.conditions.map((condition, index) => (
                    <div key={condition.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-700">Condition {index + 1}</span>
                        </div>
                        <button
                          onClick={() => removeCondition(condition.id)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Question Selection */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Question
                          </label>
                          <select
                            value={condition.questionId}
                            onChange={(e) => {
                              const selectedQuestion = allQuestions.find(q => q.id === e.target.value);
                              updateCondition(condition.id, {
                                questionId: e.target.value,
                                questionType: selectedQuestion?.type || 'multiple_choice'
                              });
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select a question...</option>
                            {allQuestions
                              .filter(q => q.id !== question.id)
                              .map(q => (
                                <option key={q.id} value={q.id}>
                                  {q.title}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Operator Selection */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Operator
                          </label>
                          <select
                            value={condition.operator}
                            onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {getOperatorOptions(condition.questionType).map(op => (
                              <option key={op.value} value={op.value}>
                                {op.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Value Selection */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Value
                          </label>
                          {condition.questionType === 'text' && condition.operator === 'is_empty' ? (
                            <div className="px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-500">
                              No value needed
                            </div>
                          ) : (
                            <select
                              value={condition.value}
                              onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select value...</option>
                              {getQuestionOptions(condition.questionId).map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Validation */}
            {!validation.valid && logic.conditions.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Please complete all conditions
                  </span>
                </div>
                <ul className="mt-2 text-sm text-red-700">
                  {validation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview */}
            {showPreview && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Logic Preview
                </h4>
                {previewLogic()}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveLogic}
            disabled={logic.enabled && !validation.valid}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save Logic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConditionalLogicBuilder;
