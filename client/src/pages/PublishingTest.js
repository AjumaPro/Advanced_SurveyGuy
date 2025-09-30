import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Play,
  Share2,
  FileText,
  Globe,
  Lock,
  AlertCircle,
  Eye,
  Edit,
  RefreshCw,
  Plus,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

const PublishingTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testSurvey, setTestSurvey] = useState(null);

  const runPublishingTest = async () => {
    setLoading(true);
    const results = {};

    try {
      console.log('🧪 Testing survey publishing functionality...');

      // Test 1: Create a test survey
      console.log('📝 Creating test survey...');
      const testSurveyData = {
        title: 'Publishing Test Survey - ' + new Date().toISOString(),
        description: 'Test survey for publishing functionality',
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
            type: 'multiple_choice',
            title: 'How satisfied are you with our service?',
            required: true,
            settings: {
              options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
            }
          },
          {
            id: 'q3',
            type: 'rating',
            title: 'Rate your overall experience',
            required: true,
            settings: { maxRating: 5 }
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

      // Test 2: Publish the survey
      if (results.createSurvey.success && results.createSurvey.surveyId) {
        console.log('🚀 Testing survey publishing...');
        
        const publishResponse = await api.surveys.publishSurvey(results.createSurvey.surveyId);
        results.publishSurvey = { 
          success: !publishResponse.error, 
          error: publishResponse.error,
          publishedAt: publishResponse.survey?.published_at
        };
      }

      // Test 3: Verify published status
      if (results.publishSurvey?.success) {
        console.log('✅ Verifying published status...');
        
        const getResponse = await api.surveys.getSurvey(results.createSurvey.surveyId);
        results.verifyPublished = { 
          success: !getResponse.error && getResponse.survey?.status === 'published',
          error: getResponse.error,
          status: getResponse.survey?.status,
          publishedAt: getResponse.survey?.published_at
        };
      }

      // Test 4: Test unpublishing
      if (results.verifyPublished?.success) {
        console.log('🔄 Testing unpublish functionality...');
        
        const unpublishResponse = await api.surveys.unpublishSurvey(results.createSurvey.surveyId);
        results.unpublishSurvey = { 
          success: !unpublishResponse.error, 
          error: unpublishResponse.error 
        };
      }

      // Test 5: Verify draft status after unpublishing
      if (results.unpublishSurvey?.success) {
        console.log('📝 Verifying draft status after unpublish...');
        
        const getResponse = await api.surveys.getSurvey(results.createSurvey.surveyId);
        results.verifyDraft = { 
          success: !getResponse.error && getResponse.survey?.status === 'draft',
          error: getResponse.error,
          status: getResponse.survey?.status
        };
      }

      // Test 6: Re-publish for final test
      if (results.verifyDraft?.success) {
        console.log('🚀 Re-publishing for final test...');
        
        const republishResponse = await api.surveys.publishSurvey(results.createSurvey.surveyId);
        results.republishSurvey = { 
          success: !republishResponse.error, 
          error: republishResponse.error 
        };
      }

      // Test 7: Get published surveys list
      console.log('📋 Testing published surveys list...');
      const publishedListResponse = await api.surveys.getSurveysByStatus(user.id, 'published');
      results.getPublishedList = { 
        success: !publishedListResponse.error, 
        error: publishedListResponse.error,
        count: publishedListResponse.surveys?.length || 0
      };

      // Test 8: Get draft surveys list
      console.log('📝 Testing draft surveys list...');
      const draftListResponse = await api.surveys.getSurveysByStatus(user.id, 'draft');
      results.getDraftList = { 
        success: !draftListResponse.error, 
        error: draftListResponse.error,
        count: draftListResponse.surveys?.length || 0
      };

      // Test 9: Cleanup - Delete test survey
      if (results.createSurvey.success && results.createSurvey.surveyId) {
        console.log('🧹 Cleaning up test survey...');
        
        const deleteResponse = await api.surveys.deleteSurvey(results.createSurvey.surveyId);
        results.cleanup = { 
          success: !deleteResponse.error, 
          error: deleteResponse.error 
        };
      }

    } catch (error) {
      console.error('Publishing test suite error:', error);
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
            <Share2 className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Survey Publishing Test</h1>
          </div>
          <p className="text-gray-600">Comprehensive testing of survey publishing and status management</p>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Publishing Test Suite</h2>
              <p className="text-gray-600">Test survey creation, publishing, unpublishing, and status management</p>
            </div>
            
            <button
              onClick={runPublishingTest}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span>{loading ? 'Running Tests...' : 'Test Publishing System'}</span>
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
            {/* Publishing Tests */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-green-600" />
                  <span>Publishing Functionality Tests</span>
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { key: 'createSurvey', label: 'Create Survey', description: 'Create draft survey for testing' },
                    { key: 'publishSurvey', label: 'Publish Survey', description: 'Change status from draft to published' },
                    { key: 'verifyPublished', label: 'Verify Published Status', description: 'Confirm survey is published with timestamp' },
                    { key: 'unpublishSurvey', label: 'Unpublish Survey', description: 'Change status back to draft' },
                    { key: 'verifyDraft', label: 'Verify Draft Status', description: 'Confirm survey is back to draft' },
                    { key: 'republishSurvey', label: 'Re-publish Survey', description: 'Publish again after unpublishing' },
                    { key: 'cleanup', label: 'Cleanup Test Data', description: 'Delete test survey' }
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
                              {result.status && (
                                <p className="text-sm text-blue-600 mt-1">Status: {result.status}</p>
                              )}
                              {result.publishedAt && (
                                <p className="text-sm text-green-600 mt-1">Published: {new Date(result.publishedAt).toLocaleString()}</p>
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

            {/* Status Management Tests */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Status Management Tests</span>
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Published Surveys List */}
                  {testResults.getPublishedList && (
                    <div className={`p-4 rounded-lg border ${getTestColor(testResults.getPublishedList.success)}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        {getTestIcon(testResults.getPublishedList.success)}
                        <h4 className="font-medium text-gray-900">Published Surveys List</h4>
                      </div>
                      <p className="text-sm text-gray-600">Get surveys with 'published' status</p>
                      {testResults.getPublishedList.error && (
                        <p className="text-sm text-red-600 mt-1">{testResults.getPublishedList.error}</p>
                      )}
                      <p className="text-sm text-blue-600 mt-1">
                        Found: {testResults.getPublishedList.count} published surveys
                      </p>
                    </div>
                  )}

                  {/* Draft Surveys List */}
                  {testResults.getDraftList && (
                    <div className={`p-4 rounded-lg border ${getTestColor(testResults.getDraftList.success)}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        {getTestIcon(testResults.getDraftList.success)}
                        <h4 className="font-medium text-gray-900">Draft Surveys List</h4>
                      </div>
                      <p className="text-sm text-gray-600">Get surveys with 'draft' status</p>
                      {testResults.getDraftList.error && (
                        <p className="text-sm text-red-600 mt-1">{testResults.getDraftList.error}</p>
                      )}
                      <p className="text-sm text-blue-600 mt-1">
                        Found: {testResults.getDraftList.count} draft surveys
                      </p>
                    </div>
                  )}
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
                      <h2 className="text-2xl font-bold text-green-800">Publishing System Fully Functional!</h2>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-600" />
                      <h2 className="text-2xl font-bold text-red-800">Some Publishing Tests Failed</h2>
                    </>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6">
                  {Object.values(testResults).every(r => r.success)
                    ? 'Your survey publishing system is fully functional and ready for production use!'
                    : 'Some publishing components need attention. Check the failed tests above for details.'
                  }
                </p>
                
                <div className="flex justify-center space-x-4">
                  <a
                    href="/app/surveys"
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Draft Surveys</span>
                  </a>
                  
                  <a
                    href="/app/published-surveys"
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Published Surveys</span>
                  </a>
                  
                  <a
                    href="/app/builder/new"
                    className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Survey</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Publishing Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8"
        >
          <div className="flex items-start space-x-3">
            <Share2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800 mb-2">Survey Publishing Guide:</h3>
              <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                <li><strong>Create Survey</strong> - Build your survey with questions and settings</li>
                <li><strong>Validate Content</strong> - Ensure title and questions are complete</li>
                <li><strong>Publish Survey</strong> - Click "Publish" button to make survey live</li>
                <li><strong>Share with QR Codes</strong> - Use QR codes and URLs to distribute</li>
                <li><strong>Monitor Responses</strong> - Track survey performance in analytics</li>
                <li><strong>Manage Status</strong> - Unpublish if needed for major edits</li>
              </ol>
              
              <div className="mt-4 p-3 bg-white border border-green-300 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Publishing Requirements:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✅ Survey must have a title</li>
                  <li>✅ Survey must have at least one question</li>
                  <li>✅ All questions must have titles</li>
                  <li>✅ User must be authenticated</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublishingTest;
