import React, { useState } from 'react';
import QuestionRenderer from './QuestionRenderer';
import {
  X,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  RotateCcw,
  Share2,
  Download
} from 'lucide-react';

const QuickPreview = ({ survey, onClose, onEdit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [previewMode, setPreviewMode] = useState('single'); // single, all, flow
  const [theme, setTheme] = useState('default');

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

  const resetPreview = () => {
    setResponses({});
    setCurrentQuestion(0);
  };

  const getViewModeClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'minimal':
        return 'bg-gray-50 text-gray-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Survey Preview</h2>
              <p className="text-sm text-gray-600">
                {survey.questions.length} questions • Test your survey experience
              </p>
            </div>
          </div>

          {/* Preview Controls */}
          <div className="flex items-center space-x-3">
            {/* View Mode */}
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Tablet view"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Mode */}
            <select
              value={previewMode}
              onChange={(e) => setPreviewMode(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="single">Single Question</option>
              <option value="all">All Questions</option>
              <option value="flow">Question Flow</option>
            </select>

            {/* Theme */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="default">Default Theme</option>
              <option value="minimal">Minimal Theme</option>
              <option value="dark">Dark Theme</option>
            </select>

            {/* Actions */}
            <button
              onClick={resetPreview}
              className="p-2 text-gray-400 hover:text-gray-600 rounded"
              title="Reset responses"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className={getViewModeClasses()}>
            <div className={`rounded-lg p-8 shadow-sm border ${getThemeClasses()}`}>
              {/* Survey Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">
                  {survey.title}
                </h1>
                {survey.description && (
                  <p className="text-lg opacity-80">
                    {survey.description}
                  </p>
                )}
                {survey.settings?.showProgress && previewMode === 'single' && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm opacity-60 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(((currentQuestion + 1) / survey.questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / survey.questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Questions */}
              {previewMode === 'single' ? (
                // Single Question Mode
                <div className="space-y-6">
                  {survey.questions[currentQuestion] && (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {currentQuestion + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-xl font-medium mb-2">
                            {survey.questions[currentQuestion].title}
                            {survey.questions[currentQuestion].required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </h3>
                          {survey.questions[currentQuestion].description && (
                            <p className="text-sm opacity-70 mb-4">
                              {survey.questions[currentQuestion].description}
                            </p>
                          )}
                          
                          <QuestionRenderer 
                            question={survey.questions[currentQuestion]}
                            value={responses[survey.questions[currentQuestion].id]}
                            onChange={(value) => handleResponseChange(survey.questions[currentQuestion].id, value)}
                            preview={false}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <button
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-gray-500 self-center">
                      {currentQuestion + 1} of {survey.questions.length}
                    </span>

                    <button
                      onClick={currentQuestion === survey.questions.length - 1 ? () => alert('Survey completed!') : nextQuestion}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      {currentQuestion === survey.questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                  </div>
                </div>
              ) : (
                // All Questions Mode
                <div className="space-y-8">
                  {survey.questions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-2">
                            {question.title}
                            {question.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </h3>
                          {question.description && (
                            <p className="text-sm opacity-70 mb-4">
                              {question.description}
                            </p>
                          )}
                          
                          <QuestionRenderer 
                            question={question}
                            value={responses[question.id]}
                            onChange={(value) => handleResponseChange(question.id, value)}
                            preview={false}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {survey.questions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-2">No questions added yet</div>
                      <p className="text-sm text-gray-500 mb-4">
                        Add questions to see them in the preview
                      </p>
                      <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add Questions
                      </button>
                    </div>
                  )}

                  {survey.questions.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <button
                        onClick={() => alert('Survey submitted! (Preview mode)')}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700"
                      >
                        Submit Survey
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Preview Mode</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Responses:</span>
              <span className="font-medium">{Object.keys(responses).length}/{survey.questions.length}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Share feature coming soon!')}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <button
              onClick={() => alert('Export feature coming soon!')}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={onEdit || onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              {onEdit ? 'Edit Survey' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPreview;
