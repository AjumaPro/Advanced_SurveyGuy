import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

const SurveyResponse = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const fetchSurvey = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/surveys/public/${id}`);
      setSurvey(response.data);
      
      // Initialize responses object
      const initialResponses = {};
      response.data.questions.forEach(question => {
        initialResponses[question.id] = null;
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error('Error fetching survey:', error);
      toast.error('Survey not found or not available');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  const handleResponse = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
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
      
      const surveyResponses = Object.entries(responses)
        .filter(([_, answer]) => answer !== null)
        .map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer
        }));

      await axios.post('/api/responses', {
        surveyId: parseInt(id),
        responses: surveyResponses,
        sessionId
      });

      toast.success('Thank you for your responses!');
      setCompleted(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
      toast.error('Failed to submit responses');
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
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
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
          <div className="flex items-center justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {currentQuestionIndex === survey.questions.length - 1 ? (
                <button
                  onClick={submitSurvey}
                  disabled={submitting}
                  className="btn-primary"
                >
                  {submitting ? (
                    <div className="spinner w-4 h-4 mr-2"></div>
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Survey
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="btn-primary"
                >
                  Next
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
        return (
          <input
            type="text"
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your answer"
          />
        );

      case 'paragraph':
        return (
          <textarea
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Your answer"
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value || option.label : option;
              const optionLabel = typeof option === 'object' ? option.label || option.value : option;
              
              return (
                <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionValue}
                    checked={currentResponse === optionValue}
                    onChange={(e) => handleResponse(question.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="flex-1 text-gray-700">{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value || option.label : option;
              const optionLabel = typeof option === 'object' ? option.label || option.value : option;
              const currentValues = currentResponse || [];
              
              return (
                <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                  <input
                    type="checkbox"
                    value={optionValue}
                    checked={currentValues.includes(optionValue)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...currentValues, optionValue]
                        : currentValues.filter(v => v !== optionValue);
                      handleResponse(question.id, newValues);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="flex-1 text-gray-700">{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an option</option>
            {question.options.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value || option.label : option;
              const optionLabel = typeof option === 'object' ? option.label || option.value : option;
              
              return (
                <option key={index} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
        );

      case 'linear_scale':
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
              {options.map((option) => (
                <label key={option} className="flex flex-col items-center space-y-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={currentResponse === option}
                    onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    currentResponse === option 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {currentResponse === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-xs text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'emoji_scale':
        return (
          <div className="p-4 border rounded-lg">
            <EmojiScale options={question.options} />
          </div>
        );

      case 'rating':
        const maxStars = question.settings?.max || 5;
        return (
          <div className="flex items-center space-x-2">
            {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleResponse(question.id, star)}
                className={`p-1 rounded ${
                  currentResponse >= star 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star className={`h-8 w-8 ${currentResponse >= star ? 'fill-current' : ''}`} />
              </button>
            ))}
            {currentResponse && (
              <span className="ml-2 text-sm text-gray-600">
                {currentResponse} out of {maxStars}
              </span>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
          <input
            type="email"
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email address"
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter website URL"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={currentResponse || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            min={question.settings?.min}
            max={question.settings?.max}
            step={question.settings?.step || 1}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter number"
          />
        );

      case 'file_upload':
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
                  {question.settings?.columns?.map((col, colIndex) => (
                    <th key={colIndex} className="border border-gray-300 p-2 bg-gray-50 text-center text-sm">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.settings?.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-300 p-2 bg-gray-50 text-sm font-medium">
                      {row}
                    </td>
                    {question.settings?.columns?.map((col, colIndex) => (
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
                  {question.settings?.columns?.map((col, colIndex) => (
                    <th key={colIndex} className="border border-gray-300 p-2 bg-gray-50 text-center text-sm">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.settings?.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-300 p-2 bg-gray-50 text-sm font-medium">
                      {row}
                    </td>
                    {question.settings?.columns?.map((col, colIndex) => (
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
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Survey Not Found</h2>
          <p className="text-gray-600">This survey is not available or has been removed.</p>
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

      {/* Survey Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
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