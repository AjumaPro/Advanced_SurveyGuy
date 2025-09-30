import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X, CheckCircle } from 'lucide-react';

const SurveyValidationPanel = ({ errors, onClose }) => {
  const getErrorIcon = (type) => {
    switch (type) {
      case 'title':
        return '📝';
      case 'questions':
        return '❓';
      case 'question':
        return '⚠️';
      default:
        return '❌';
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case 'title':
        return 'border-red-200 bg-red-50';
      case 'questions':
        return 'border-orange-200 bg-orange-50';
      case 'question':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-b border-gray-200 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-red-900">
              Validation Errors ({errors.length})
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-red-700 mb-3">
            Please fix the following issues before publishing your survey:
          </p>
          
          <div className="space-y-2">
            {errors.map((error, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getErrorColor(error.type)}`}
              >
                <span className="text-lg">{getErrorIcon(error.type)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {error.message}
                  </p>
                  {error.questionId && (
                    <p className="text-xs text-gray-600 mt-1">
                      Question ID: {error.questionId}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Make sure your survey has a title and all questions have titles before publishing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SurveyValidationPanel;
