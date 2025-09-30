import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Play,
  Send,
  FileText,
  Globe,
  Users,
  Clock,
  RefreshCw,
  Plus,
  Eye,
  BarChart3,
  AlertCircle
} from 'lucide-react';

const SubmissionTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testSurvey, setTestSurvey] = useState(null);

  const runSubmissionTest = async () => {
    setLoading(true);
    const results = {};

    try {
      console.log('🧪 Testing survey submission functionality...');

      // Test 1: Create and publish a test survey
      console.log('📝 Creating and publishing test survey...');
      const testSurveyData = {
        title: 'Submission Test Survey - ' + new Date().toISOString(),
        description: 'Test survey for submission functionality',
        questions: [
          {
            id: 'q1',
            type: 'text',
            title: 'What is your name?',
            required: true,
            settings: { placeholder: 'Enter your name...' }
          },
          {
            id: 'q2',
            type: 'email',
            title: 'What is your email address?',
            required: true,
            settings: { placeholder: 'your@email.com' }
          },
          {
            id: 'q3',
            type: 'multiple_choice',
            title: 'How did you hear about us?',
            required: false,
            settings: {
              options: ['Google Search', 'Social Media', 'Friend Referral', 'Advertisement', 'Other']
            }
          },
          {
            id: 'q4',
            type: 'rating',
            title: 'Rate your experience',
            required: true,
            settings: { maxRating: 5 }
          }
        ],
        settings: {
          allowAnonymous: true,
          collectEmail: true,
          showProgress: true
        },
        status: 'draft'
      };

      const createResponse = await api.surveys.createSurvey(user.id, testSurveyData);
      results.createSurvey = { 
        success: !createResponse.error, 
        error: createResponse.error,
        surveyId: createResponse.survey?.id
      };

      if (createResponse.survey) {
        setTestSurvey(createResponse.survey);
        
        // Publish the survey
        const publishResponse = await api.surveys.publishSurvey(createResponse.survey.id);
        results.publishSurvey = { 
          success: !publishResponse.error, 
          error: publishResponse.error 
        };
      }

      // Test 2: Fetch public survey
      if (results.publishSurvey?.success) {
        console.log('🌐 Testing public survey access...');
        
        const publicResponse = await api.responses.getPublicSurvey(results.createSurvey.surveyId);
        results.getPublicSurvey = { 
          success: !publicResponse.error, 
          error: publicResponse.error,
          hasQuestions: publicResponse.survey?.questions?.length > 0
        };
      }

      // Test 3: Validate responses
      if (results.getPublicSurvey?.success) {
        console.log('✅ Testing response validation...');
        
        // Test with incomplete responses (should fail validation)
        const incompleteResponses = {
          'q1': 'John Doe',
          'q2': '', // Missing required email
          'q3': 'Google Search',
          'q4': null // Missing required rating
        };
        
        const validation = api.responses.validateResponse(testSurvey, incompleteResponses);
        results.validationIncomplete = { 
          success: !validation.isValid, // Should be false (invalid)
          error: validation.isValid ? 'Validation should have failed' : null,
          errorCount: Object.keys(validation.errors).length
        };

        // Test with complete responses (should pass validation)
        const completeResponses = {
          'q1': 'John Doe',
          'q2': 'john@example.com',
          'q3': 'Google Search',
          'q4': 5
        };
        
        const validationComplete = api.responses.validateResponse(testSurvey, completeResponses);
        results.validationComplete = { 
          success: validationComplete.isValid, // Should be true (valid)
          error: !validationComplete.isValid ? 'Validation should have passed' : null,
          errorCount: Object.keys(validationComplete.errors).length
        };
      }

      // Test 4: Submit test response
      if (results.validationComplete?.success) {
        console.log('📤 Testing response submission...');
        
        const testResponseData = {
          responses: {
            'q1': 'Test User',
            'q2': 'test@example.com',
            'q3': 'Google Search',
            'q4': 4
          },
          sessionId: `test_${Date.now()}`,
          email: 'test@example.com',
          completionTime: 120, // 2 minutes
          userAgent: navigator.userAgent
        };
        
        const submitResponse = await api.responses.submitResponse(results.createSurvey.surveyId, testResponseData);
        results.submitResponse = { 
          success: !submitResponse.error, 
          error: submitResponse.error,
          responseId: submitResponse.response?.id
        };
      }

      // Test 5: Verify response was saved
      if (results.submitResponse?.success) {
        console.log('🔍 Verifying response was saved...');
        
        const { data, error } = await api.supabase
          .from('survey_responses')
          .select('*')
          .eq('survey_id', results.createSurvey.surveyId)
          .order('submitted_at', { ascending: false })
          .limit(1);
        
        results.verifyResponse = { 
          success: !error && data?.length > 0,
          error: error?.message,
          responseCount: data?.length || 0
        };
      }

      // Test 6: Cleanup - Delete test survey and responses
      if (results.createSurvey.success && results.createSurvey.surveyId) {
        console.log('🧹 Cleaning up test data...');
        
        const deleteResponse = await api.surveys.deleteSurvey(results.createSurvey.surveyId);
        results.cleanup = { 
          success: !deleteResponse.error, 
          error: deleteResponse.error 
        };
      }

    } catch (error) {
      console.error('Submission test suite error:', error);
      results.testSuite = { success: false, error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  const getTestIcon = (success) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getTestColor = (success) => {
    return success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Send className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Survey Submission Test</h1>
          </div>
          <p className="text-gray-600">Comprehensive testing of survey submission and response handling</p>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Submission Test Suite</h2>
              <p className="text-gray-600">Test survey publishing, public access, validation, and response submission</p>
            </div>
            
            <button
              onClick={runSubmissionTest}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span>{loading ? 'Running Tests...' : 'Test Submission System'}</span>
            </button>
          </div>
        </motion.div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Core Submission Tests */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <span>Survey Submission Tests</span>
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { key: 'createSurvey', label: 'Create Test Survey', description: 'Create survey with various question types' },
                    { key: 'publishSurvey', label: 'Publish Survey', description: 'Make survey publicly accessible' },
                    { key: 'getPublicSurvey', label: 'Public Survey Access', description: 'Fetch survey via public API' },
                    { key: 'validationIncomplete', label: 'Validation (Incomplete)', description: 'Test validation with missing required fields' },
                    { key: 'validationComplete', label: 'Validation (Complete)', description: 'Test validation with all required fields' },
                    { key: 'submitResponse', label: 'Submit Response', description: 'Submit complete survey response' },
                    { key: 'verifyResponse', label: 'Verify Response Saved', description: 'Confirm response was saved to database' },
                    { key: 'cleanup', label: 'Cleanup Test Data', description: 'Remove test survey and responses' }
                  ].map(({ key, label, description }) => {
                    const result = testResults[key];
                    if (!result) return null;
                    
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border ${getTestColor(result.success)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTestIcon(result.success)}
                            <div>
                              <h4 className="font-medium text-gray-900">{label}</h4>
                              <p className="text-sm text-gray-600">{description}</p>
                              {result.error && (
                                <p className="text-sm text-red-600 mt-1">{result.error}</p>
                              )}
                              {result.errorCount !== undefined && (
                                <p className="text-sm text-blue-600 mt-1">
                                  Validation errors: {result.errorCount}
                                </p>
                              )}
                              {result.responseCount !== undefined && (
                                <p className="text-sm text-green-600 mt-1">
                                  Responses found: {result.responseCount}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {result.surveyId && (
                            <div className="text-xs text-gray-500 font-mono">
                              ID: {result.surveyId.slice(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Overall Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  {Object.values(testResults).every(r => r.success) ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <h2 className="text-2xl font-bold text-green-800">All Submission Tests Passed!</h2>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-600" />
                      <h2 className="text-2xl font-bold text-red-800">Some Submission Tests Failed</h2>
                    </>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6">
                  {Object.values(testResults).every(r => r.success)
                    ? 'Your survey submission system is fully functional and ready for production use!'
                    : 'Some submission components need attention. Check the failed tests above for details.'
                  }
                </p>
                
                <div className="flex justify-center space-x-4">
                  <a
                    href="/app/builder/new"
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Survey</span>
                  </a>
                  
                  <a
                    href="/app/published-surveys"
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Published Surveys</span>
                  </a>
                  
                  <a
                    href="/app/analytics"
                    className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submission Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8"
        >
          <div className="flex items-start space-x-3">
            <Send className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Survey Submission Guide:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li><strong>Publish Survey</strong> - Survey must be published to accept responses</li>
                <li><strong>Public Access</strong> - Respondents access via URL or QR code</li>
                <li><strong>Form Validation</strong> - Required fields validated before submission</li>
                <li><strong>Response Storage</strong> - Responses saved to survey_responses table</li>
                <li><strong>Analytics Tracking</strong> - Responses tracked for analytics</li>
                <li><strong>Completion Feedback</strong> - Users see confirmation after submission</li>
              </ol>
              
              <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Submission Requirements:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Survey must be published (status: 'published')</li>
                  <li>✅ Survey must be active (is_active: true)</li>
                  <li>✅ Required questions must be answered</li>
                  <li>✅ Email validation for email questions</li>
                  <li>✅ Number validation for numeric questions</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmissionTest;
