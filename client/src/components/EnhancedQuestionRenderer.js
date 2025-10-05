import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  Star, 
  ThumbsUp, 
  Heart, 
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import EmojiScale from './EmojiScale';
import MatrixQuestion from './MatrixQuestion';

const EnhancedQuestionRenderer = ({ 
  question, 
  value, 
  onChange, 
  error, 
  disabled = false,
  className = ""
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const renderError = () => {
    if (!error) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 flex items-center space-x-2 text-red-600"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{error}</span>
      </motion.div>
    );
  };

  const renderQuestionTitle = () => (
    <div className="mb-4">
      <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${
        question.required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''
      }`}>
        {question.title}
      </h3>
      {question.description && (
        <p className="text-sm text-gray-600">{question.description}</p>
      )}
    </div>
  );

  const renderTextInput = () => (
    <div>
      {renderQuestionTitle()}
      <input
        type="text"
        value={localValue || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={question.placeholder || 'Enter your answer...'}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
      />
      {renderError()}
    </div>
  );

  const renderTextarea = () => (
    <div>
      {renderQuestionTitle()}
      <textarea
        value={localValue || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={question.placeholder || 'Enter your answer...'}
        rows={4}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
      />
      {question.maxLength && (
        <div className="mt-1 text-right text-xs text-gray-500">
          {(localValue || '').length}/{question.maxLength}
        </div>
      )}
      {renderError()}
    </div>
  );

  const renderEmailInput = () => (
    <div>
      {renderQuestionTitle()}
      <input
        type="email"
        value={localValue || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={question.placeholder || 'Enter your email...'}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
      />
      {renderError()}
    </div>
  );

  const renderNumberInput = () => (
    <div>
      {renderQuestionTitle()}
      <input
        type="number"
        value={localValue || ''}
        onChange={(e) => handleChange(Number(e.target.value))}
        placeholder={question.placeholder || 'Enter a number...'}
        min={question.min}
        max={question.max}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
      />
      {renderError()}
    </div>
  );

  const renderRating = () => (
    <div>
      {renderQuestionTitle()}
      <div className="flex justify-center space-x-2 my-6">
        {Array.from({ length: question.options?.max || 5 }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            onClick={() => !disabled && handleChange(rating)}
            disabled={disabled}
            className={`p-3 rounded-full transition-all duration-200 ${
              localValue >= rating
                ? 'bg-yellow-400 text-white shadow-lg transform scale-110'
                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
          >
            <Star className="w-8 h-8" />
          </button>
        ))}
      </div>
      {question.options?.labels && (
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{question.options.labels[0]}</span>
          <span>{question.options.labels[question.options.labels.length - 1]}</span>
        </div>
      )}
      {renderError()}
    </div>
  );

  const renderNPS = () => (
    <div>
      {renderQuestionTitle()}
      <div className="flex justify-center space-x-2 my-6">
        {Array.from({ length: 11 }, (_, i) => i).map((score) => (
          <button
            key={score}
            onClick={() => !disabled && handleChange(score)}
            disabled={disabled}
            className={`w-12 h-12 rounded-full border-2 transition-all duration-200 font-semibold ${
              localValue === score
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-110'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
          >
            {score}
          </button>
        ))}
      </div>
      {question.options?.labels && (
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{question.options.labels[0]}</span>
          <span>{question.options.labels[1]}</span>
        </div>
      )}
      {renderError()}
    </div>
  );

  const renderLinearScale = () => (
    <div>
      {renderQuestionTitle()}
      <div className="flex justify-center space-x-2 my-6">
        {Array.from({ length: (question.options?.max || 7) - (question.options?.min || 1) + 1 }, (_, i) => i + (question.options?.min || 1)).map((value) => (
          <button
            key={value}
            onClick={() => !disabled && handleChange(value)}
            disabled={disabled}
            className={`w-12 h-12 rounded-full border-2 transition-all duration-200 font-semibold ${
              localValue === value
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg transform scale-110'
                : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
          >
            {value}
          </button>
        ))}
      </div>
      {question.options?.labels && (
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{question.options.labels[0]}</span>
          <span>{question.options.labels[1]}</span>
        </div>
      )}
      {renderError()}
    </div>
  );

  const renderMultipleChoice = () => (
    <div>
      {renderQuestionTitle()}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              localValue === option
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={localValue === option}
              onChange={() => !disabled && handleChange(option)}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              localValue === option
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {localValue === option && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-gray-900 font-medium">{option}</span>
          </label>
        ))}
      </div>
      {renderError()}
    </div>
  );

  const renderCheckbox = () => (
    <div>
      {renderQuestionTitle()}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              localValue?.includes(option)
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="checkbox"
              checked={localValue?.includes(option) || false}
              onChange={(e) => {
                if (disabled) return;
                const currentValues = localValue || [];
                if (e.target.checked) {
                  handleChange([...currentValues, option]);
                } else {
                  handleChange(currentValues.filter(v => v !== option));
                }
              }}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
              localValue?.includes(option)
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            }`}>
              {localValue?.includes(option) && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-gray-900 font-medium">{option}</span>
          </label>
        ))}
      </div>
      {renderError()}
    </div>
  );

  const renderEmojiScale = () => (
    <div>
      {renderQuestionTitle()}
      <div className="flex justify-center my-6">
        <EmojiScale
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          scale={question.options?.scale || 'satisfaction'}
          labels={question.options?.labels}
        />
      </div>
      {renderError()}
    </div>
  );

  const renderMatrix = () => (
    <div>
      {renderQuestionTitle()}
      <MatrixQuestion
        question={question}
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
      />
      {renderError()}
    </div>
  );

  const renderQuestion = () => {
    switch (question.type) {
      case 'text':
        return renderTextInput();
      case 'textarea':
        return renderTextarea();
      case 'email':
        return renderEmailInput();
      case 'number':
        return renderNumberInput();
      case 'rating':
        return renderRating();
      case 'nps':
        return renderNPS();
      case 'linear_scale':
        return renderLinearScale();
      case 'multiple_choice':
        return renderMultipleChoice();
      case 'checkbox':
        return renderCheckbox();
      case 'emoji_scale':
        return renderEmojiScale();
      case 'matrix':
        return renderMatrix();
      default:
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Unsupported question type: {question.type}</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}
    >
      {renderQuestion()}
    </motion.div>
  );
};

export default EnhancedQuestionRenderer;
