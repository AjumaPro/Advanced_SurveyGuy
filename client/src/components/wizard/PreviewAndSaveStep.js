import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Save,
  Share2,
  Download,
  CheckCircle,
  Star,
  Users,
  Clock,
  FileText,
  Palette,
  Settings,
  ArrowRight,
  Copy
} from 'lucide-react';

const PreviewAndSaveStep = ({ templateData, onSave, saving }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [previewMode, setPreviewMode] = useState('desktop');

  const questions = templateData.selectedTemplate?.questions || [];
  const questionCount = templateData.selectedTemplate?.questionCount || questions.length;

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              {question.options.map((option, idx) => (
                <label key={idx} className="flex flex-col items-center mx-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors">
                    {idx + 1}
                  </div>
                  <span className="text-xs text-gray-600 mt-2 text-center max-w-16">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${index}`}
                  className="sr-only"
                />
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Type your answer here..."
            />
          </div>
        );
      
      case 'nps':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Not at all likely</span>
              <span className="text-sm text-gray-600">Extremely likely</span>
            </div>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <label key={i} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    className="sr-only"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors">
                    {i}
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg text-gray-500 text-center">
            Question type not supported in preview
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          👀 Preview & Save
        </h2>
        <p className="text-gray-600">
          Review your template and save it to start collecting responses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Preview */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </h3>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    previewMode === 'mobile'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            <div className={`mx-auto ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
              {/* Template Header */}
              <div
                className="p-6 rounded-lg mb-6"
                style={{
                  backgroundColor: templateData.branding.backgroundColor,
                  color: templateData.branding.primaryColor
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: templateData.branding.primaryColor }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {templateData.settings.name || 'Template Preview'}
                    </h2>
                    <p className="text-sm opacity-75">
                      {templateData.settings.description || 'Template description'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{templateData.settings.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{questionCount} questions</span>
                  </div>
                  {templateData.settings.showProgress && (
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: templateData.branding.accentColor,
                            width: `${((currentQuestion + 1) / questions.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions Preview */}
              {questions.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      {questions[currentQuestion].required && (
                        <span className="text-sm text-red-500">* Required</span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {questions[currentQuestion].question}
                    </h3>
                    
                    {renderQuestion(questions[currentQuestion], currentQuestion)}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentQuestion === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestion === questions.length - 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentQuestion === questions.length - 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-white'
                      }`}
                      style={{
                        backgroundColor: currentQuestion === questions.length - 1 ? '#E5E7EB' : templateData.branding.primaryColor
                      }}
                    >
                      Next Question
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No questions to preview</h3>
                  <p>Add questions to see the preview</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Template Summary & Actions */}
        <div className="space-y-6">
          {/* Template Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Template Summary
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: templateData.branding.primaryColor }}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {templateData.settings.name || 'Untitled Template'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {templateData.category?.replace('-', ' ')} • {templateData.purpose}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium">{questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Time:</span>
                  <span className="font-medium">{templateData.settings.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Audience:</span>
                  <span className="font-medium">{templateData.settings.targetAudience || 'General'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility:</span>
                  <span className="font-medium">{templateData.settings.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Anonymous:</span>
                  <span className="font-medium">{templateData.settings.allowAnonymous ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile Optimized:</span>
                  <span className="font-medium">{templateData.settings.mobileOptimized ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💾 Save Template
            </h3>

            <div className="space-y-3">
              <button
                onClick={onSave}
                disabled={saving}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Template...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Publish Template
                  </>
                )}
              </button>

              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                <Copy className="w-4 h-4 mr-2" />
                Save as Draft
              </button>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🎯 Next Steps
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Edit questions and settings</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Customize branding and styling</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Add analytics and tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Publish and start collecting responses</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Share with your team</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PreviewAndSaveStep;
