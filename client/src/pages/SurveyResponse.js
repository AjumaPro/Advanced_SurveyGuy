import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Send,
  Smile,
  XCircle,
  Star
} from 'lucide-react';
import EmojiScale from '../components/EmojiScale';
import SubscriptionForm from '../components/SubscriptionForm';
import MatrixQuestion from '../components/MatrixQuestion';
import SurveyProgressIndicator from '../components/SurveyProgressIndicator';
import EnhancedQuestionRenderer from '../components/EnhancedQuestionRenderer';
import { testDatabaseConnection, testSurveyAccess } from '../utils/testDatabase';
import { validateSurvey, sanitizeResponses, getValidationSummary } from '../utils/surveyValidation';
import { useDashboardNavigation } from '../utils/navigationUtils';

const SurveyResponse = () => {
  const { id } = useParams();
  const { navigateToDashboard, isSignedIn } = useDashboardNavigation();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [validationErrors, setValidationErrors] = useState({});
  const [startTime] = useState(new Date());
  const [validationSummary, setValidationSummary] = useState({});

  const fetchSurvey = React.useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Fetching survey with ID:', id);
      console.log('🌐 Current URL:', window.location.href);
      console.log('🏠 Base URL:', window.location.origin);
      
      // Test database connection first
      console.log('📡 Testing database connection...');
      const dbTest = await testDatabaseConnection();
      console.log('📊 Database test result:', dbTest);
      
      // Test specific survey access
      console.log('🎯 Testing specific survey access...');
      const surveyTest = await testSurveyAccess(id);
      console.log('📋 Survey test result:', surveyTest);
      
      // Fetch published survey using new API
      console.log('📡 Fetching survey via API...');
      const response = await api.responses.getPublicSurvey(id);
      console.log('📨 API response:', response);
      
      if (response.error) {
        console.error('❌ Error fetching survey:', response.error);
        console.log('🔍 Survey ID:', id);
        console.log('🔍 API response:', response);
        
        // Show more detailed error information
        toast.error(`Survey not found: ${response.error}`);
        return;
      }

      if (!response.survey) {
        console.error('❌ No survey data returned');
        toast.error('Survey data not available');
        return;
      }

      console.log('✅ Survey fetched successfully:', response.survey);
      setSurvey(response.survey);
      
      // Initialize responses object
      const initialResponses = {};
      if (response.survey.questions) {
        response.survey.questions.forEach(question => {
          initialResponses[question.id] = null;
        });
      }
      setResponses(initialResponses);
    } catch (error) {
      console.error('💥 Error fetching survey:', error);
      console.log('🔍 Survey ID:', id);
      console.log('🔍 Error details:', error);
      toast.error(`Survey access failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  const handleResponse = (questionId, answer) => {
    setResponses(prev => {
      const newResponses = {
        ...prev,
        [questionId]: answer
      };
      
      // Update validation summary
      if (survey) {
        const summary = getValidationSummary(survey, newResponses);
        setValidationSummary(summary);
      }
      
      return newResponses;
    });
    
    // Clear validation error for this question
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

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

  const submitSurvey = async () => {
    try {
      setSubmitting(true);
      setValidationErrors({});
      
      console.log('🚀 Starting survey submission...');
      console.log('Survey ID:', id);
      console.log('Responses:', responses);
      
      // Validate responses before submission
      const validation = validateSurvey(survey, responses);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        const errorCount = Object.keys(validation.errors).length;
        toast.error(`Please complete all required questions (${errorCount} error${errorCount > 1 ? 's' : ''})`);
        setSubmitting(false);
        return;
      }
      
      // Calculate completion time
      const completionTime = Math.round((new Date() - startTime) / 1000); // seconds
      
      console.log('📝 Validation passed, attempting submission...');
      
        // Sanitize responses before submission
        const sanitizedResponses = sanitizeResponses(responses);
        
        // EMERGENCY BYPASS: Try direct Supabase insertion first
        try {
          console.log('🛠️ Trying emergency direct submission...');
        const { supabase } = await import('../lib/supabase');
        
        const directSubmission = {
          survey_id: id,
          responses: sanitizedResponses,
          session_id: sessionId,
          submitted_at: new Date().toISOString(),
          completion_time: completionTime,
          user_agent: navigator.userAgent
        };
        
        console.log('📋 Direct submission data:', directSubmission);
        
        const { data: directResult, error: directError } = await supabase
          .from('survey_responses')
          .insert(directSubmission)
          .select()
          .single();
          
        if (!directError && directResult) {
          console.log('✅ Emergency direct submission successful!', directResult);
          
          // Update analytics after successful direct submission
          try {
            await api.responses.updateAnalyticsOnResponse(id, directResult);
          } catch (analyticsError) {
            console.warn('⚠️ Analytics update failed (non-critical):', analyticsError);
          }
          
          toast.success('Thank you for your responses!');
          setCompleted(true);
          return;
        } else {
          console.warn('⚠️ Direct submission failed:', directError);
        }
      } catch (directSubmissionError) {
        console.warn('⚠️ Direct submission exception:', directSubmissionError);
      }
      
      // Fallback to API method
      console.log('🔄 Falling back to API method...');
      const response = await api.responses.submitResponse(id, {
        responses: responses,
        sessionId: sessionId,
        email: responses.email || null,
        completionTime: completionTime,
        userAgent: navigator.userAgent
      });

      if (response.error) {
        console.error('❌ API submission failed:', response.error);
        
        // FINAL FALLBACK: Store in localStorage
        console.log('💾 Storing in localStorage as final fallback...');
        const backupKey = `survey_response_${id}_${Date.now()}`;
        const backupData = {
          surveyId: id,
          responses: responses,
          sessionId: sessionId,
          completionTime: completionTime,
          timestamp: new Date().toISOString(),
          status: 'pending_submission'
        };
        
        try {
          localStorage.setItem(backupKey, JSON.stringify(backupData));
          toast.success('Your responses have been saved locally. We will try to submit them later.');
          setCompleted(true);
          console.log('💾 Responses backed up to localStorage:', backupKey);
          return;
        } catch (storageError) {
          console.error('❌ localStorage backup failed:', storageError);
          toast.error('Failed to submit survey. Please try again.');
          return;
        }
      }

      console.log('✅ API submission successful!', response);
      toast.success('Thank you for your responses!');
      setCompleted(true);
    } catch (error) {
      console.error('💥 Complete submission failure:', error);
      toast.error('Failed to submit responses. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {survey.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {question.title}
            </h2>
            {question.description && (
              <p className="text-gray-600">{question.description}</p>
            )}
            {question.required && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                Required
              </span>
            )}
          </div>

          {/* Question Content */}
          <div className="mb-8">
            {renderQuestionContent(question)}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center space-x-2 flex-1 sm:flex-none">
              {currentQuestionIndex === survey.questions.length - 1 ? (
                <button
                  onClick={submitSurvey}
                  disabled={submitting}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  {submitting ? (
                    <div className="spinner w-4 h-4 mr-2"></div>
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">Submit Survey</span>
                  <span className="sm:hidden">Submit</span>
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionContent = (question) => {
    const currentResponse = responses[question.id];

    switch (question.type) {
      case 'short_answer':
      case 'text':
      case 'short_text':
      case 'single_line':
        return (
          <div className="relative">
            <input
              type="text"
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`w-full p-4 sm:p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-sm ${
                currentResponse ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Your answer"
            />
            {currentResponse && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'paragraph':
      case 'long_text':
      case 'textarea':
      case 'multi_line':
      case 'essay':
      case 'description':
        return (
          <div className="relative">
            <textarea
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`w-full p-4 sm:p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-sm ${
                currentResponse ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
              rows="4"
              placeholder="Your answer"
            />
            {currentResponse && (
              <div className="absolute right-3 top-3 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'multiple_choice':
      case 'radio':
      case 'single_choice':
      case 'choice':
        return (
          <div className="space-y-3">
            {(question.options || []).map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value || option.label : option;
              const optionLabel = typeof option === 'object' ? option.label || option.value : option;
              const isSelected = currentResponse === optionValue;
              
              return (
                <label key={index} className={`flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-4 sm:p-3 rounded-lg border-2 transition-all duration-200 min-h-[56px] sm:min-h-[48px] ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="relative">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optionValue}
                      checked={isSelected}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <span className={`flex-1 text-base sm:text-sm text-gray-700 font-medium ${isSelected ? 'text-blue-700' : ''}`}>
                    {optionLabel}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox':
      case 'multiple_select':
      case 'multi_select':
        return (
          <div className="space-y-3">
            {(question.options || []).map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value || option.label : option;
              const optionLabel = typeof option === 'object' ? option.label || option.value : option;
              const currentValues = currentResponse || [];
              const isSelected = currentValues.includes(optionValue);
              
              return (
                <label key={index} className={`flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="relative">
                    <input
                      type="checkbox"
                      value={optionValue}
                      checked={isSelected}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...currentValues, optionValue]
                          : currentValues.filter(v => v !== optionValue);
                        handleResponse(question.id, newValues);
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <span className={`flex-1 text-gray-700 font-medium ${isSelected ? 'text-green-700' : ''}`}>
                    {optionLabel}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case 'dropdown':
      case 'select':
      case 'single_select':
        return (
          <div className="relative">
            <select
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                currentResponse ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select an option</option>
              {(question.options || []).map((option, index) => {
                const optionValue = typeof option === 'object' ? option.value || option.label : option;
                const optionLabel = typeof option === 'object' ? option.label || option.value : option;
                
                return (
                  <option key={index} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
            {currentResponse && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'linear_scale':
      case 'scale':
      case 'likert_scale':
      case 'likert':
        const min = question.settings?.min || 1;
        const max = question.settings?.max || 5;
        const range = max - min + 1;
        const options = Array.from({ length: range }, (_, i) => min + i);
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{question.settings?.minLabel || min}</span>
              <span className="text-sm text-gray-600">{question.settings?.maxLabel || max}</span>
            </div>
            <div className="flex items-center justify-between">
              {options.map((option) => {
                const isSelected = currentResponse === option;
                return (
                  <label key={option} className="flex flex-col items-center space-y-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="relative">
                      <div className={`w-12 h-12 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-600 text-white scale-110' 
                          : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      }`}>
                        {isSelected ? (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        ) : (
                          <span className="text-xs font-medium text-gray-600">{option}</span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className={`text-sm sm:text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'emoji_scale':
      case 'emoji_satisfaction':
      case 'emoji_agreement':
      case 'emoji_quality':
      case 'emoji_mood':
      case 'emoji_difficulty':
      case 'emoji_likelihood':
      case 'emoji_custom':
      case 'svg_emoji_satisfaction':
      case 'svg_emoji_mood':
      case 'happy_scale':
      case 'how_happy':
      case 'experience':
        return (
          <div className="p-4 border rounded-lg">
            <EmojiScale 
              options={question.options} 
              value={currentResponse}
              onChange={(value) => handleResponse(question.id, value)}
            />
          </div>
        );

      case 'rating':
      case 'star_rating':
      case 'stars':
        const maxStars = question.settings?.max || 5;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-1">
              {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleResponse(question.id, star)}
                  className={`p-2 sm:p-1 rounded transition-all duration-200 min-h-[48px] sm:min-h-[40px] min-w-[48px] sm:min-w-[40px] flex items-center justify-center ${
                    currentResponse >= star 
                      ? 'text-yellow-500 scale-110' 
                      : 'text-gray-300 hover:text-yellow-400 hover:scale-105'
                  }`}
                >
                  <Star className={`h-10 w-10 sm:h-8 sm:w-8 ${currentResponse >= star ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            {currentResponse && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentResponse} out of {maxStars}
                </span>
                <div className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              </div>
            )}
          </div>
        );

      case 'nps':
      case 'net_promoter_score':
      case 'nps_score':
        const npsOptions = Array.from({ length: 11 }, (_, i) => i); // 0-10
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">How likely are you to recommend this to a friend or colleague?</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Not at all likely</span>
                <span>Extremely likely</span>
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-1">
              {npsOptions.map((option) => {
                const isSelected = currentResponse === option;
                return (
                  <label key={option} className="flex flex-col items-center space-y-2 cursor-pointer min-w-[32px] sm:min-w-[28px]">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div className="relative">
                      <div className={`w-12 h-12 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-green-600 bg-green-600 text-white scale-110' 
                          : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      }`}>
                        {isSelected ? (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        ) : (
                          <span className="text-xs font-medium text-gray-600">{option}</span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className={`text-sm sm:text-xs font-medium ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
            {currentResponse !== null && (
              <div className="text-center">
                <span className="text-sm text-gray-600">NPS Score: {currentResponse}</span>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                currentResponse ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
            />
            {currentResponse && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'time':
        return (
          <div className="relative">
            <input
              type="time"
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                currentResponse ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
            />
            {currentResponse && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="date"
                value={currentResponse?.date || ''}
                onChange={(e) => handleResponse(question.id, { ...currentResponse, date: e.target.value })}
                className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  currentResponse?.date ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}
              />
              {currentResponse?.date && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="time"
                value={currentResponse?.time || ''}
                onChange={(e) => handleResponse(question.id, { ...currentResponse, time: e.target.value })}
                className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  currentResponse?.time ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}
              />
              {currentResponse?.time && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="flex items-center space-x-2">
            <select 
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="+1"
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+233">🇬🇭 +233</option>
            </select>
            <input
              type="tel"
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
            />
          </div>
        );

      case 'email':
        return (
          <div className="relative">
            <input
              type="email"
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                currentResponse ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {currentResponse && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'url':
        return (
          <div className="relative">
            <input
              type="url"
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                currentResponse ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Enter website URL"
            />
            {currentResponse && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="relative">
            <input
              type="number"
              value={currentResponse || ''}
              onChange={(e) => handleResponse(question.id, e.target.value)}
              min={question.settings?.min}
              max={question.settings?.max}
              step={question.settings?.step || 1}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                currentResponse ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
              placeholder="Enter number"
            />
            {currentResponse && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </div>
        );

      case 'slider':
        const sliderMin = question.settings?.min || 0;
        const sliderMax = question.settings?.max || 100;
        const sliderStep = question.settings?.step || 1;
        const sliderValue = currentResponse || sliderMin;
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{question.settings?.minLabel || sliderMin}</span>
              <span className="font-medium text-lg">{sliderValue}</span>
              <span>{question.settings?.maxLabel || sliderMax}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
                value={sliderValue}
                onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100}%, #E5E7EB ${((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold -ml-2.5" 
                   style={{ left: `${((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100}%` }}>
                ✓
              </div>
            </div>
          </div>
        );

      case 'file_upload':
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              onChange={(e) => handleResponse(question.id, e.target.files)}
              accept={question.settings?.accept}
              multiple={question.settings?.multiple}
              className="hidden"
              id={`file-upload-${question.id}`}
            />
            <label
              htmlFor={`file-upload-${question.id}`}
              className="cursor-pointer"
            >
              <div className="space-y-2">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </div>
                <p className="text-xs text-gray-500">
                  {question.settings?.accept ? `Accepted formats: ${question.settings.accept}` : 'All file types accepted'}
                  {question.settings?.multiple && ' (Multiple files allowed)'}
                </p>
              </div>
            </label>
            {currentResponse && currentResponse.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-sm text-green-700">
                    {currentResponse.length} file{currentResponse.length > 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-4">
            <canvas
              width={400}
              height={200}
              className="border border-gray-300 rounded-lg cursor-crosshair"
              style={{ touchAction: 'none' }}
            />
            <div className="flex space-x-2">
              <button
                type="button"
                className="btn-secondary text-sm"
              >
                Clear Signature
              </button>
            </div>
          </div>
        );

      case 'checkbox_grid':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50"></th>
                  {(question.settings?.columns || []).map((col, colIndex) => (
                    <th key={colIndex} className="border border-gray-300 p-2 bg-gray-50 text-center text-sm">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(question.settings?.rows || []).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-300 p-2 bg-gray-50 text-sm font-medium">
                      {row}
                    </td>
                    {(question.settings?.columns || []).map((col, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2 text-center">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => {}} // TODO: Implement grid response handling
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'multiple_choice_grid':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50"></th>
                  {(question.settings?.columns || []).map((col, colIndex) => (
                    <th key={colIndex} className="border border-gray-300 p-2 bg-gray-50 text-center text-sm">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(question.settings?.rows || []).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-300 p-2 bg-gray-50 text-sm font-medium">
                      {row}
                    </td>
                    {(question.settings?.columns || []).map((col, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          name={`question-${question.id}-row-${rowIndex}`}
                          checked={false}
                          onChange={() => {}} // TODO: Implement grid response handling
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'matrix':
        return (
          <MatrixQuestion
            question={question}
            value={currentResponse || {}}
            onChange={(value) => handleResponse(question.id, value)}
            disabled={false}
            isEditing={false}
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Question type not supported</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Survey Not Found</h2>
          <p className="text-gray-600 mb-6">This survey is not available or has been removed.</p>
          
          {/* Debug Information */}
          <div className="bg-gray-100 rounded-lg p-4 text-left text-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
            <div className="space-y-1 text-gray-600">
              <p><strong>Survey ID:</strong> {id}</p>
              <p><strong>Current URL:</strong> {window.location.href}</p>
              <p><strong>Base URL:</strong> {window.location.origin}</p>
              <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800 text-xs">
                <strong>Possible causes:</strong>
              </p>
              <ul className="text-blue-700 text-xs mt-1 space-y-1">
                <li>• Survey ID doesn't exist in database</li>
                <li>• Survey is not published (status ≠ 'published')</li>
                <li>• Database connection issues</li>
                <li>• Survey was deleted or moved</li>
              </ul>
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  console.log('🔄 Retrying survey fetch...');
                  fetchSurvey();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];

  // Show completion view with subscription form
  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{survey.title}</h1>
                {survey.description && (
                  <p className="text-gray-600 text-sm mt-1">{survey.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Smile className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-600">SurveyGuy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Thank You Message */}
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-600">
                Your responses have been submitted successfully.
              </p>
            </div>

            {/* Subscription Form */}
            <div className="mb-8">
              <SubscriptionForm
                surveyId={survey.id}
                surveyTitle={survey.title}
                onSubscribe={(data) => {
                  console.log('Subscription created:', data);
                }}
              />
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your responses are anonymous and secure</li>
                <li>• Survey results will be analyzed and shared</li>
                <li>• You'll receive updates if you subscribed</li>
                <li>• Thank you for your valuable feedback!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t mt-12">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Powered by SurveyGuy</span>
              <span>Your responses are anonymous</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{survey.title}</h1>
              {survey.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{survey.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Smile className="h-5 w-5 text-primary-600 flex-shrink-0" />
              <span className="text-sm text-gray-600 hidden sm:inline">SurveyGuy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderQuestion(currentQuestion)}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Powered by SurveyGuy</span>
            <span>Your responses are anonymous</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyResponse; 