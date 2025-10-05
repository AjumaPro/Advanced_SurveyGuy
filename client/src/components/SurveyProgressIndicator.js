import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SurveyProgressIndicator = ({ 
  currentIndex, 
  totalQuestions, 
  validationSummary, 
  validationErrors = {},
  className = ""
}) => {
  const progressPercentage = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
  const { requiredQuestions = 0, answeredRequired = 0 } = validationSummary;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            {progressPercentage}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Validation Status */}
      {requiredQuestions > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Required Questions:</span>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${
                answeredRequired === requiredQuestions ? 'text-green-600' : 'text-orange-600'
              }`}>
                {answeredRequired}/{requiredQuestions}
              </span>
              {answeredRequired === requiredQuestions ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-orange-500" />
              )}
            </div>
          </div>
          
          {/* Required Questions Progress */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <motion.div
              className={`h-1 rounded-full ${
                answeredRequired === requiredQuestions 
                  ? 'bg-green-500' 
                  : 'bg-orange-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${requiredQuestions > 0 ? (answeredRequired / requiredQuestions) * 100 : 0}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Error Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700 font-medium">
              {Object.keys(validationErrors).length} validation error{Object.keys(validationErrors).length > 1 ? 's' : ''} remaining
            </span>
          </div>
        </motion.div>
      )}

      {/* Completion Status */}
      {validationSummary.completionRate > 0 && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-700 font-medium">
              {validationSummary.completionRate}% Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyProgressIndicator;
