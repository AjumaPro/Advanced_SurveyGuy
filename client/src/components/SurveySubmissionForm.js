import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle,
  Star,
  Clock,
  User,
  Mail,
  Phone,
  Hash,
  Calendar,
  FileText,
  RefreshCw
} from 'lucide-react';
import EmojiScale from './EmojiScale';

const SurveySubmissionForm = ({ 
  survey, 
  responses, 
  onResponseChange, 
  onSubmit, 
  validationErrors = {},
  submitting = false 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  if (!survey || !survey.questions || survey.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Survey Not Available</h3>
        <p className="text-gray-600">This survey is not available or has no questions.</p>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const nextQuestion = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Validate all required questions
    const requiredQuestions = survey.questions.filter(q => q.required);
    const missingRequired = requiredQuestions.filter(q => {
      const response = responses[q.id];
      return !response || response === '' || response === null;
    });

    if (missingRequired.length > 0) {
      toast.error(`Please complete all required questions (${missingRequired.length} missing)`);
      return;
    }

    onSubmit();
  };

  const renderQuestionInput = (question) => {
    const value = responses[question.id] || '';
    const error = validationErrors[question.id];
    const hasError = !!error;

    const inputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

    switch (question.type) {
      case 'text':
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              placeholder={question.settings?.placeholder || 'Enter your answer...'}
              className={inputClasses}
              maxLength={question.settings?.maxLength || 500}
            />
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              placeholder={question.settings?.placeholder || 'Enter your detailed response...'}
              rows={question.settings?.rows || 4}
              className={inputClasses}
              maxLength={question.settings?.maxLength || 2000}
            />
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'email':
        return (
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={value}
                onChange={(e) => onResponseChange(question.id, e.target.value)}
                placeholder={question.settings?.placeholder || 'your@email.com'}
                className={`pl-12 ${inputClasses}`}
              />
            </div>
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'phone':
        return (
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={value}
                onChange={(e) => onResponseChange(question.id, e.target.value)}
                placeholder={question.settings?.placeholder || '+1 (555) 123-4567'}
                className={`pl-12 ${inputClasses}`}
              />
            </div>
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={value}
                onChange={(e) => onResponseChange(question.id, e.target.value)}
                placeholder={question.settings?.placeholder || 'Enter a number...'}
                min={question.settings?.min}
                max={question.settings?.max}
                step={question.settings?.step || 1}
                className={`pl-12 ${inputClasses}`}
              />
            </div>
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.settings?.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  value === option 
                    ? 'border-blue-500 bg-blue-50' 
                    : hasError 
                      ? 'border-red-300 hover:border-red-400' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onResponseChange(question.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'checkbox':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            {question.settings?.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedValues.includes(option) 
                    ? 'border-blue-500 bg-blue-50' 
                    : hasError 
                      ? 'border-red-300 hover:border-red-400' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option]
                      : selectedValues.filter(v => v !== option);
                    onResponseChange(question.id, newValues);
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'rating':
        const maxRating = question.settings?.maxRating || 5;
        return (
          <div>
            <div className="flex items-center space-x-2 justify-center">
              {[...Array(maxRating)].map((_, index) => {
                const rating = index + 1;
                return (
                  <button
                    key={rating}
                    onClick={() => onResponseChange(question.id, rating)}
                    className={`p-2 transition-colors ${
                      value >= rating 
                        ? 'text-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                );
              })}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {value ? `${value} out of ${maxRating} stars` : 'Click to rate'}
              </span>
            </div>
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center justify-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'emoji_scale':
        return (
          <div>
            <EmojiScale
              value={value}
              onChange={(val) => onResponseChange(question.id, val)}
              scaleType={question.settings?.scaleType || 'satisfaction'}
              showLabels={question.settings?.showLabels !== false}
            />
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center justify-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={value}
                onChange={(e) => onResponseChange(question.id, e.target.value)}
                className={`pl-12 ${inputClasses}`}
                min={question.settings?.minDate}
                max={question.settings?.maxDate}
              />
            </div>
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );

      default:
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              placeholder="Enter your answer..."
              className={inputClasses}
            />
            {hasError && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
          </div>
        );
    }
  };

  if (showAllQuestions) {
    // Show all questions in one page
    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          {survey.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">{survey.description}</p>
          )}
        </div>

        {/* All Questions */}
        <div className="space-y-8">
          {survey.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  
                  {question.description && (
                    <p className="text-gray-600 text-sm mb-4">{question.description}</p>
                  )}
                  
                  <div className="mt-4">
                    {renderQuestionInput(question)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {submitting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{submitting ? 'Submitting...' : 'Submit Survey'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Single question view
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      {survey.settings?.showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Question Card */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-xl shadow-lg border p-8"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
            {currentQuestionIndex + 1}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentQuestion.title}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          
          {currentQuestion.description && (
            <p className="text-gray-600">{currentQuestion.description}</p>
          )}
        </div>

        {/* Question Input */}
        <div className="mb-8">
          {renderQuestionInput(currentQuestion)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousQuestion}
            disabled={isFirstQuestion}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {survey.questions.length}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>{submitting ? 'Submitting...' : 'Submit Survey'}</span>
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* View Toggle */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowAllQuestions(true)}
          className="text-blue-600 hover:text-blue-700 text-sm underline"
        >
          View all questions on one page
        </button>
      </div>
    </div>
  );
};

export default SurveySubmissionForm;
