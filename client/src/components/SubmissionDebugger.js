import React, { useState } from 'react';
import api from '../services/api';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Play, AlertCircle, CheckCircle, Send, Copy } from 'lucide-react';

const SubmissionDebugger = () => {
  const [surveyId, setSurveyId] = useState('');
  const [debugResults, setDebugResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSubmissionTest = async () => {
    if (!surveyId.trim()) {
      toast.error('Please enter a survey ID');
      return;
    }

    setLoading(true);
    const results = {
      timestamp: new Date().toISOString(),
      surveyId: surveyId.trim(),
      tests: {}
    };

    try {
      // Test 1: Check if survey exists and is published
      console.log('🔍 Testing survey access...');
      try {
        const surveyResponse = await api.responses.getPublicSurvey(surveyId.trim());
        results.tests.surveyAccess = {
          success: !surveyResponse.error && surveyResponse.survey,
          data: surveyResponse.survey,
          error: surveyResponse.error
        };
      } catch (error) {
        results.tests.surveyAccess = {
          success: false,
          error: error.message
        };
      }

      // Test 2: Check survey_responses table structure
      console.log('🔍 Testing database table...');
      try {
        const { error: tableError } = await supabase
          .from('survey_responses')
          .select('*')
          .limit(1);

        results.tests.tableStructure = {
          success: !tableError,
          error: tableError?.message,
          note: 'Table exists and is accessible'
        };
      } catch (error) {
        results.tests.tableStructure = {
          success: false,
          error: error.message
        };
      }

      // Test 3: Test submission with mock data
      console.log('🔍 Testing submission...');
      try {
        const mockResponseData = {
          responses: {
            'q1': 'Test response',
            'q2': 'Option 1'
          },
          sessionId: `test_${Date.now()}`,
          completionTime: 30,
          userAgent: navigator.userAgent
        };

        const submissionResponse = await api.responses.submitResponse(surveyId.trim(), mockResponseData);
        results.tests.submission = {
          success: !submissionResponse.error,
          data: submissionResponse.response,
          error: submissionResponse.error,
          mockData: mockResponseData
        };

        if (submissionResponse.response) {
          // Clean up test submission
          try {
            await supabase
              .from('survey_responses')
              .delete()
              .eq('id', submissionResponse.response.id);
            results.tests.submission.note = 'Test submission cleaned up';
          } catch (cleanupError) {
            results.tests.submission.cleanupError = cleanupError.message;
          }
        }
      } catch (error) {
        results.tests.submission = {
          success: false,
          error: error.message
        };
      }

      // Test 4: Check RLS policies
      console.log('🔍 Testing RLS policies...');
      try {
        const { data: rlsData, error: rlsError } = await supabase.rpc('check_table_rls', {
          table_name: 'survey_responses'
        });

        results.tests.rlsPolicies = {
          success: !rlsError,
          data: rlsData,
          error: rlsError?.message || null,
          note: 'RLS policies checked'
        };
      } catch (error) {
        results.tests.rlsPolicies = {
          success: false,
          error: error.message,
          note: 'RLS check function not available'
        };
      }

      // Test 5: Check user permissions
      console.log('🔍 Testing permissions...');
      try {
        const { data: permissionTest, error: permissionError } = await supabase
          .from('survey_responses')
          .insert({
            survey_id: surveyId.trim(),
            responses: { test: 'permission_check' },
            session_id: 'permission_test'
          })
          .select()
          .single();

        if (!permissionError && permissionTest) {
          // Clean up permission test
          await supabase
            .from('survey_responses')
            .delete()
            .eq('id', permissionTest.id);
        }

        results.tests.permissions = {
          success: !permissionError,
          error: permissionError?.message,
          note: 'Permission test completed and cleaned up'
        };
      } catch (error) {
        results.tests.permissions = {
          success: false,
          error: error.message
        };
      }

      setDebugResults(results);
      console.log('🐛 Submission Debug Results:', results);

    } catch (error) {
      console.error('Debug error:', error);
      toast.error('Debug failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyResults = () => {
    navigator.clipboard.writeText(JSON.stringify(debugResults, null, 2));
    toast.success('Debug results copied to clipboard!');
  };

  const testActualSubmission = async () => {
    if (!surveyId.trim()) {
      toast.error('Please enter a survey ID');
      return;
    }

    try {
      // Get the actual survey
      const surveyResponse = await api.responses.getPublicSurvey(surveyId.trim());
      if (surveyResponse.error || !surveyResponse.survey) {
        toast.error('Survey not found or not published');
        return;
      }

      const survey = surveyResponse.survey;
      
      // Create realistic test responses
      const testResponses = {};
      if (survey.questions && survey.questions.length > 0) {
        survey.questions.forEach((question, index) => {
          const questionId = question.id || `q${index + 1}`;
          
          switch (question.type) {
            case 'text':
              testResponses[questionId] = `Test response for ${question.question || question.title}`;
              break;
            case 'multiple-choice':
              testResponses[questionId] = question.options?.[0] || 'Option 1';
              break;
            case 'rating':
              testResponses[questionId] = 5;
              break;
            case 'boolean':
              testResponses[questionId] = true;
              break;
            default:
              testResponses[questionId] = 'Test value';
          }
        });
      } else {
        // Fallback for surveys without proper question structure
        testResponses['q1'] = 'Test response 1';
        testResponses['q2'] = 'Test response 2';
      }

      const submissionData = {
        responses: testResponses,
        sessionId: `debug_test_${Date.now()}`,
        completionTime: 45,
        userAgent: navigator.userAgent
      };

      const result = await api.responses.submitResponse(surveyId.trim(), submissionData);
      
      if (result.error) {
        toast.error(`Submission failed: ${result.error}`);
      } else {
        toast.success('Test submission successful!');
        console.log('Test submission result:', result);
      }

    } catch (error) {
      console.error('Test submission error:', error);
      toast.error('Test submission failed: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Survey Submission Debugger</h2>
      
      <div className="space-y-6">
        {/* Survey ID Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Survey ID to Test
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={surveyId}
              onChange={(e) => setSurveyId(e.target.value)}
              placeholder="Enter survey ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={runSubmissionTest}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {loading ? 'Testing...' : 'Run Tests'}
            </button>
            <button
              onClick={testActualSubmission}
              disabled={!surveyId.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Test Submit
            </button>
          </div>
        </div>

        {/* Debug Results */}
        {debugResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Debug Results</h3>
              <button
                onClick={copyResults}
                className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                <Copy className="h-3 w-3" />
                Copy Results
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(debugResults.tests).map(([testName, result]) => (
                <div
                  key={testName}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <h4 className="font-medium capitalize">
                      {testName.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                  </div>

                  {result.error && (
                    <div className="text-sm text-red-700 mb-2">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}

                  {result.note && (
                    <div className="text-sm text-blue-700 mb-2">
                      <strong>Note:</strong> {result.note}
                    </div>
                  )}

                  {result.data && (
                    <details className="text-sm text-gray-700">
                      <summary className="cursor-pointer font-medium">View Data</summary>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Summary:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Survey ID: <code className="bg-gray-200 px-1 rounded">{debugResults.surveyId}</code></li>
                <li>• Tests Run: {Object.keys(debugResults.tests).length}</li>
                <li>• Passed: {Object.values(debugResults.tests).filter(t => t.success).length}</li>
                <li>• Failed: {Object.values(debugResults.tests).filter(t => !t.success).length}</li>
                <li>• Debug Time: {new Date(debugResults.timestamp).toLocaleString()}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">How to use:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Enter a survey ID from your published surveys</li>
            <li>2. Click "Run Tests" to diagnose submission issues</li>
            <li>3. Click "Test Submit" to try an actual submission</li>
            <li>4. Check the results to identify what's failing</li>
            <li>5. Copy results if you need to share debug info</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDebugger;
