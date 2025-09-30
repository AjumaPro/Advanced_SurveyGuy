import React, { useState } from 'react';
import QuestionRenderer from './QuestionRenderer';
import { motion } from 'framer-motion';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  ArrowLeft,
  ArrowRight,
  Eye,
  Share2,
  RotateCcw
} from 'lucide-react';

const ProfessionalPreview = ({ survey, onClose, fullscreen = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [viewMode, setViewMode] = useState('desktop'); // mobile, tablet, desktop
  const [previewMode, setPreviewMode] = useState('flow'); // flow, all

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetResponses = () => {
    setResponses({});
    setCurrentQuestion(0);
  };

  const getDeviceClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const getDeviceStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { minHeight: '667px', maxWidth: '375px' };
      case 'tablet':
        return { minHeight: '1024px', maxWidth: '768px' };
      default:
        return { minHeight: '600px' };
    }
  };

  if (!fullscreen) {
    // Embedded preview mode
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Survey Preview</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className={getDeviceClasses()}>
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm" style={getDeviceStyles()}>
              <SurveyContent 
                survey={survey}
                responses={responses}
                onResponseChange={handleResponseChange}
                currentQuestion={currentQuestion}
                previewMode={previewMode}
                onNext={nextQuestion}
                onPrev={prevQuestion}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen preview mode
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <Eye className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Survey Preview</h2>
              <p className="text-sm text-gray-600">
                Test your survey as respondents will see it
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Device Toggle */}
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Mode Toggle */}
            <select
              value={previewMode}
              onChange={(e) => setPreviewMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="flow">Question Flow</option>
              <option value="all">All Questions</option>
            </select>

            {/* Actions */}
            <button
              onClick={resetResponses}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-8 max-h-[80vh] overflow-y-auto bg-gray-50">
          <div className={getDeviceClasses()}>
            <motion.div 
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              style={getDeviceStyles()}
              layout
            >
              <SurveyContent 
                survey={survey}
                responses={responses}
                onResponseChange={handleResponseChange}
                currentQuestion={currentQuestion}
                previewMode={previewMode}
                onNext={nextQuestion}
                onPrev={prevQuestion}
              />
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">{Object.keys(responses).length}</span> of <span className="font-medium">{survey.questions.length}</span> answered
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(Object.keys(responses).length / survey.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Share preview coming soon!')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Preview</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Survey Content Component
const SurveyContent = ({ 
  survey, 
  responses, 
  onResponseChange, 
  currentQuestion, 
  previewMode, 
  onNext, 
  onPrev 
}) => {
  if (previewMode === 'flow') {
    // Single question flow mode
    const question = survey.questions[currentQuestion];
    if (!question) return null;

    return (
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {survey.title}
          </h1>
          {survey.description && (
            <p className="text-lg text-gray-600 mb-6">
              {survey.description}
            </p>
          )}
          
          {survey.settings?.showProgress && (
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentQuestion + 1) / survey.questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / survey.questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                {currentQuestion + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {question.description && (
                  <p className="text-gray-600 mb-6">{question.description}</p>
                )}
                
                <QuestionRenderer 
                  question={question}
                  value={responses[question.id]}
                  onChange={(value) => onResponseChange(question.id, value)}
                  preview={false}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <button
              onClick={onPrev}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} of {survey.questions.length}
            </div>

            <button
              onClick={currentQuestion === survey.questions.length - 1 ? () => alert('Survey completed!') : onNext}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{currentQuestion === survey.questions.length - 1 ? 'Submit' : 'Next'}</span>
              {currentQuestion < survey.questions.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // All questions mode
  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {survey.title}
        </h1>
        {survey.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {survey.description}
          </p>
        )}
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto space-y-12">
        {survey.questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {question.description && (
                  <p className="text-gray-600 mb-6">{question.description}</p>
                )}
                
                <QuestionRenderer 
                  question={question}
                  value={responses[question.id]}
                  onChange={(value) => onResponseChange(question.id, value)}
                  preview={false}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {survey.questions.length > 0 && (
          <div className="text-center pt-8">
            <button
              onClick={() => alert('Survey submitted! (Preview mode)')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Submit Survey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalPreview;
