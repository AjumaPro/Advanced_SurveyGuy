import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../services/api';
import { getQuestionType, getDefaultQuestionSettings } from '../utils/questionTypes';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Database,
  FileText,
  Crown,
  RefreshCw,
  Play,
  Plus
} from 'lucide-react';

const SurveyBuilderTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testSurvey, setTestSurvey] = useState(null);

  const runComprehensiveTest = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Database Table Access
      console.log('🧪 Testing database table access...');
      
      const tables = ['surveys', 'survey_responses', 'profiles', 'analytics', 'notifications'];
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('count').limit(1);
          results[`table_${table}`] = { success: !error, error: error?.message };
        } catch (err) {
          results[`table_${table}`] = { success: false, error: err.message };
        }
      }

      // Test 2: Survey API Functions
      console.log('🧪 Testing survey API functions...');
      
      // Test getSurveys
      try {
        const response = await api.surveys.getSurveys(user.id, { limit: 5 });
        results.getSurveys = { 
          success: !response.error, 
          error: response.error,
          data: response.surveys?.length || 0
        };
      } catch (err) {
        results.getSurveys = { success: false, error: err.message };
      }

      // Test 3: Survey Creation
      console.log('🧪 Testing survey creation...');
      
      try {
        const testSurveyData = {
          title: 'Test Survey - ' + new Date().toISOString(),
          description: 'Automated test survey',
          questions: [
            {
              id: 'q1',
              type: 'text',
              title: 'What is your name?',
              required: true,
              settings: {}
            },
            {
              id: 'q2',
              type: 'multiple_choice',
              title: 'How satisfied are you?',
              required: true,
              settings: {
                options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied']
              }
            }
          ],
          settings: {
            allowAnonymous: true,
            collectEmail: false,
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
        }
      } catch (err) {
        results.createSurvey = { success: false, error: err.message };
      }

      // Test 4: Survey Update (if creation was successful)
      if (results.createSurvey.success && results.createSurvey.surveyId) {
        console.log('🧪 Testing survey update...');
        
        try {
          const updateResponse = await api.surveys.updateSurvey(results.createSurvey.surveyId, {
            title: 'Updated Test Survey - ' + new Date().toISOString(),
            description: 'Updated test survey description'
          });
          results.updateSurvey = { 
            success: !updateResponse.error, 
            error: updateResponse.error 
          };
        } catch (err) {
          results.updateSurvey = { success: false, error: err.message };
        }
      }

      // Test 5: Survey Retrieval
      if (results.createSurvey.success && results.createSurvey.surveyId) {
        console.log('🧪 Testing survey retrieval...');
        
        try {
          const getResponse = await api.surveys.getSurvey(results.createSurvey.surveyId);
          results.getSurvey = { 
            success: !getResponse.error, 
            error: getResponse.error,
            hasQuestions: getResponse.survey?.questions?.length > 0
          };
        } catch (err) {
          results.getSurvey = { success: false, error: err.message };
        }
      }

      // Test 6: Question Types
      console.log('🧪 Testing question types...');
      
      const questionTypes = ['text', 'multiple_choice', 'rating', 'yes_no', 'checkbox', 'dropdown'];
      results.questionTypes = {};
      
      for (const type of questionTypes) {
        try {
          const questionConfig = getQuestionType(type);
          const defaultSettings = getDefaultQuestionSettings(type);
          results.questionTypes[type] = { 
            success: !!questionConfig, 
            hasSettings: !!defaultSettings 
          };
        } catch (err) {
          results.questionTypes[type] = { success: false, error: err.message };
        }
      }

      // Test 7: Survey Analytics
      if (results.createSurvey.success && results.createSurvey.surveyId) {
        console.log('🧪 Testing survey analytics...');
        
        try {
          const analyticsResponse = await api.analytics.getSurveyAnalytics(results.createSurvey.surveyId);
          results.analytics = { 
            success: !analyticsResponse.error, 
            error: analyticsResponse.error 
          };
        } catch (err) {
          results.analytics = { success: false, error: err.message };
        }
      }

      // Test 8: Cleanup - Delete test survey
      if (results.createSurvey.success && results.createSurvey.surveyId) {
        console.log('🧪 Cleaning up test survey...');
        
        try {
          const deleteResponse = await api.surveys.deleteSurvey(results.createSurvey.surveyId);
          results.cleanup = { 
            success: !deleteResponse.error, 
            error: deleteResponse.error 
          };
        } catch (err) {
          results.cleanup = { success: false, error: err.message };
        }
      }

    } catch (error) {
      console.error('Test suite error:', error);
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
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Survey Builder Test Suite</h1>
          </div>
          <p className="text-gray-600">Comprehensive testing of survey builder functionality and database connectivity</p>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Suite Controls</h2>
              <p className="text-gray-600">Run comprehensive tests to verify all survey builder functionality</p>
            </div>
            
            <button
              onClick={runComprehensiveTest}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span>{loading ? 'Running Tests...' : 'Run Full Test Suite'}</span>
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
            {/* Database Tests */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>Database Table Access</span>
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(testResults)
                    .filter(([key]) => key.startsWith('table_'))
                    .map(([key, result]) => {
                      const tableName = key.replace('table_', '');
                      return (
                        <div
                          key={key}
                          className={`p-4 rounded-lg border ${getTestColor(result.success)}`}
                        >
                          <div className="flex items-center space-x-3">
                            {getTestIcon(result.success)}
                            <div>
                              <h4 className="font-medium text-gray-900">{tableName}</h4>
                              {result.error && (
                                <p className="text-sm text-red-600 mt-1">{result.error}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Survey API Tests */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span>Survey API Functions</span>
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {['getSurveys', 'createSurvey', 'updateSurvey', 'getSurvey', 'analytics', 'cleanup'].map((testName) => {
                    const result = testResults[testName];
                    if (!result) return null;
                    
                    return (
                      <div
                        key={testName}
                        className={`p-4 rounded-lg border ${getTestColor(result.success)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTestIcon(result.success)}
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {testName.replace(/([A-Z])/g, ' $1').trim()}
                              </h4>
                              {result.error && (
                                <p className="text-sm text-red-600 mt-1">{result.error}</p>
                              )}
                              {result.data !== undefined && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Data: {result.data} items
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

            {/* Question Types Test */}
            {testResults.questionTypes && (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-purple-600" />
                    <span>Question Types</span>
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(testResults.questionTypes).map(([type, result]) => (
                      <div
                        key={type}
                        className={`p-4 rounded-lg border ${getTestColor(result.success)}`}
                      >
                        <div className="flex items-center space-x-3">
                          {getTestIcon(result.success)}
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {type.replace('_', ' ')}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-600">
                                Config: {result.success ? '✓' : '✗'}
                              </span>
                              <span className="text-xs text-gray-600">
                                Settings: {result.hasSettings ? '✓' : '✗'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Overall Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  {Object.values(testResults).every(r => r.success || (r.questionTypes && Object.values(r.questionTypes).every(qt => qt.success))) ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <h2 className="text-2xl font-bold text-green-800">All Tests Passed!</h2>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-600" />
                      <h2 className="text-2xl font-bold text-red-800">Some Tests Failed</h2>
                    </>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6">
                  {Object.values(testResults).every(r => r.success || (r.questionTypes && Object.values(r.questionTypes).every(qt => qt.success)))
                    ? 'Your survey builder is fully functional and ready for production use!'
                    : 'Some components need attention. Check the failed tests above for details.'
                  }
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => window.location.href = '/app/builder'}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Go to Survey Builder</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/app/database-setup'}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Database className="w-4 h-4" />
                    <span>Database Setup</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8"
        >
          <div className="flex items-start space-x-3">
            <Crown className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Survey Builder Test Instructions:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Click "Run Full Test Suite" to test all survey builder functionality</li>
                <li>If database tests fail, run the complete database setup in Supabase</li>
                <li>If API tests fail, check your Supabase connection and RLS policies</li>
                <li>All tests should pass for full survey builder functionality</li>
                <li>Use "Go to Survey Builder" once all tests pass</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SurveyBuilderTest;
