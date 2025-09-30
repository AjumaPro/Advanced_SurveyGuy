import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Activity,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  RefreshCw,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import AnalyticsHealthMonitor from '../components/AnalyticsHealthMonitor';

const AnalyticsIntegrationTest = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [healthData, setHealthData] = useState(null);

  const testDefinitions = [
    {
      id: 'database_tables',
      name: 'Database Tables Check',
      description: 'Verify all required analytics tables exist',
      icon: Database,
      category: 'Infrastructure'
    },
    {
      id: 'data_submission',
      name: 'Data Submission Test',
      description: 'Test survey response submission flow',
      icon: Activity,
      category: 'Data Flow'
    },
    {
      id: 'analytics_update',
      name: 'Analytics Update Test',
      description: 'Verify analytics are updated automatically',
      icon: TrendingUp,
      category: 'Data Flow'
    },
    {
      id: 'api_endpoints',
      name: 'API Endpoints Test',
      description: 'Test analytics API endpoints',
      icon: BarChart3,
      category: 'API'
    },
    {
      id: 'real_time_updates',
      name: 'Real-time Updates Test',
      description: 'Test real-time analytics updates',
      icon: Clock,
      category: 'Real-time'
    },
    {
      id: 'dashboard_integration',
      name: 'Dashboard Integration Test',
      description: 'Verify dashboard shows real data',
      icon: Users,
      category: 'UI'
    }
  ];

  const runTest = async (testId) => {
    const test = testDefinitions.find(t => t.id === testId);
    if (!test) return;

    // Update test status
    setTests(prev => prev.map(t => 
      t.id === testId ? { ...t, status: 'running', error: null } : t
    ));

    try {
      let result;
      switch (testId) {
        case 'database_tables':
          result = await testDatabaseTables();
          break;
        case 'data_submission':
          result = await testDataSubmission();
          break;
        case 'analytics_update':
          result = await testAnalyticsUpdate();
          break;
        case 'api_endpoints':
          result = await testApiEndpoints();
          break;
        case 'real_time_updates':
          result = await testRealTimeUpdates();
          break;
        case 'dashboard_integration':
          result = await testDashboardIntegration();
          break;
        default:
          result = { status: 'error', message: 'Unknown test' };
      }

      setTests(prev => prev.map(t => 
        t.id === testId ? { ...t, status: result.status, result, completed: true } : t
      ));

      return result;
    } catch (error) {
      setTests(prev => prev.map(t => 
        t.id === testId ? { 
          ...t, 
          status: 'error', 
          error: error.message, 
          completed: true 
        } : t
      ));
      return { status: 'error', message: error.message };
    }
  };

  const testDatabaseTables = async () => {
    const requiredTables = ['surveys', 'survey_responses', 'survey_analytics', 'user_analytics'];
    const results = {};

    for (const table of requiredTables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        results[table] = {
          exists: !error,
          count: count || 0,
          error: error?.message
        };
      } catch (err) {
        results[table] = {
          exists: false,
          count: 0,
          error: err.message
        };
      }
    }

    const missingTables = Object.entries(results)
      .filter(([_, result]) => !result.exists)
      .map(([table, _]) => table);

    return {
      status: missingTables.length === 0 ? 'success' : 'error',
      message: missingTables.length === 0 
        ? 'All required tables exist' 
        : `Missing tables: ${missingTables.join(', ')}`,
      details: results
    };
  };

  const testDataSubmission = async () => {
    if (!user) {
      return { status: 'error', message: 'User not authenticated' };
    }

    // Create a test survey
    const testSurvey = {
      title: `Analytics Test Survey - ${Date.now()}`,
      description: 'Test survey for analytics integration',
      questions: [
        {
          id: 'test_q1',
          type: 'multiple_choice',
          title: 'How satisfied are you with our service?',
          options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
          required: true
        }
      ],
      status: 'published',
      user_id: user.id
    };

    try {
      // Create survey
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert(testSurvey)
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Submit test response
      const testResponse = {
        survey_id: survey.id,
        responses: { test_q1: 'Very Satisfied' },
        session_id: `test_${Date.now()}`,
        submitted_at: new Date().toISOString(),
        completion_time: 30
      };

      const { data: response, error: responseError } = await supabase
        .from('survey_responses')
        .insert(testResponse)
        .select()
        .single();

      if (responseError) throw responseError;

      // Clean up test data
      setTimeout(async () => {
        await supabase.from('surveys').delete().eq('id', survey.id);
      }, 5000);

      return {
        status: 'success',
        message: 'Test survey response submitted successfully',
        details: { surveyId: survey.id, responseId: response.id }
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  };

  const testAnalyticsUpdate = async () => {
    try {
      // Get recent survey responses
      const { data: responses, error: responsesError } = await supabase
        .from('survey_responses')
        .select(`
          id,
          survey_id,
          submitted_at,
          surveys!inner(id, title, user_id)
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (responsesError) throw responsesError;

      if (!responses || responses.length === 0) {
        return { status: 'warning', message: 'No survey responses found to test analytics' };
      }

      // Check if analytics exist for these responses
      const analyticsChecks = [];
      for (const response of responses) {
        const { data: analytics, error: analyticsError } = await supabase
          .from('survey_analytics')
          .select('*')
          .eq('survey_id', response.survey_id)
          .single();

        analyticsChecks.push({
          surveyId: response.survey_id,
          hasAnalytics: !analyticsError && analytics,
          error: analyticsError?.message
        });
      }

      const successCount = analyticsChecks.filter(c => c.hasAnalytics).length;
      const totalCount = analyticsChecks.length;

      return {
        status: successCount === totalCount ? 'success' : 'warning',
        message: `${successCount}/${totalCount} surveys have analytics records`,
        details: { analyticsChecks, successRate: (successCount / totalCount) * 100 }
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  };

  const testApiEndpoints = async () => {
    if (!user) {
      return { status: 'error', message: 'User not authenticated' };
    }

    try {
      // Import API service
      const { analyticsAPI } = await import('../services/api');

      // Test overview stats
      const overviewStats = await analyticsAPI.getOverviewStats(user.id);
      const dashboardData = await analyticsAPI.getDashboardData(user.id);

      const tests = [
        {
          name: 'Overview Stats',
          success: !overviewStats.error,
          error: overviewStats.error,
          data: overviewStats
        },
        {
          name: 'Dashboard Data',
          success: !dashboardData.error,
          error: dashboardData.error,
          data: dashboardData
        }
      ];

      const successCount = tests.filter(t => t.success).length;

      return {
        status: successCount === tests.length ? 'success' : 'warning',
        message: `${successCount}/${tests.length} API endpoints working`,
        details: { tests }
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  };

  const testRealTimeUpdates = async () => {
    return new Promise((resolve) => {
      let updateReceived = false;
      const timeout = setTimeout(() => {
        resolve({
          status: updateReceived ? 'success' : 'warning',
          message: updateReceived 
            ? 'Real-time updates are working' 
            : 'No real-time updates detected (this may be normal if no recent activity)',
          details: { updateReceived }
        });
      }, 5000);

      const subscription = supabase
        .channel('integration-test')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'survey_responses' 
          }, 
          (payload) => {
            updateReceived = true;
            subscription.unsubscribe();
            clearTimeout(timeout);
            resolve({
              status: 'success',
              message: 'Real-time update received successfully',
              details: { payload, updateReceived: true }
            });
          }
        )
        .subscribe();
    });
  };

  const testDashboardIntegration = async () => {
    try {
      // Test if dashboard can fetch real data
      const { data: surveys, error: surveysError } = await supabase
        .from('surveys')
        .select(`
          id,
          title,
          status,
          created_at,
          survey_responses(count)
        `)
        .eq('user_id', user.id)
        .limit(5);

      if (surveysError) throw surveysError;

      const hasRealData = surveys && surveys.length > 0;
      const hasResponses = surveys?.some(s => s.survey_responses?.[0]?.count > 0);

      return {
        status: hasRealData ? 'success' : 'warning',
        message: hasRealData 
          ? `Dashboard can access ${surveys.length} surveys with ${surveys.filter(s => s.survey_responses?.[0]?.count > 0).length} having responses`
          : 'No survey data found for dashboard',
        details: { 
          surveyCount: surveys?.length || 0, 
          surveysWithResponses: surveys?.filter(s => s.survey_responses?.[0]?.count > 0).length || 0,
          hasRealData 
        }
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    setTestResults(null);
    
    // Initialize tests
    setTests(testDefinitions.map(test => ({
      ...test,
      status: 'pending',
      completed: false,
      error: null,
      result: null
    })));

    const results = [];
    
    for (const test of testDefinitions) {
      const result = await runTest(test.id);
      results.push({ testId: test.id, ...result });
    }

    const overallStatus = results.every(r => r.status === 'success') 
      ? 'success' 
      : results.some(r => r.status === 'error') 
        ? 'error' 
        : 'warning';

    setTestResults({
      status: overallStatus,
      results,
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        success: results.filter(r => r.status === 'success').length,
        warning: results.filter(r => r.status === 'warning').length,
        error: results.filter(r => r.status === 'error').length
      }
    });

    setRunning(false);

    // Show toast notification
    const statusColors = {
      success: 'success',
      warning: 'warning',
      error: 'error'
    };

    toast[statusColors[overallStatus]](
      `Integration test completed: ${overallStatus.toUpperCase()}`,
      { duration: 4000 }
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportTestResults = () => {
    if (!testResults) return;

    const report = {
      timestamp: testResults.timestamp,
      overallStatus: testResults.status,
      summary: testResults.summary,
      tests: tests.map(test => ({
        id: test.id,
        name: test.name,
        category: test.category,
        status: test.status,
        result: test.result,
        error: test.error
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-integration-test-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Test results exported');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Integration Test</h1>
          <p className="text-gray-600">
            Comprehensive test suite to verify SurveyResponse.js data flows correctly to analytics dashboards
          </p>
        </div>

        {/* Health Monitor */}
        <div className="mb-8">
          <AnalyticsHealthMonitor 
            onHealthUpdate={setHealthData}
            showDetails={true}
          />
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Integration Tests</h2>
              <p className="text-gray-600">Run comprehensive tests to verify analytics integration</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {testResults && (
                <button
                  onClick={exportTestResults}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Results</span>
                </button>
              )}
              
              <button
                onClick={runAllTests}
                disabled={running}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>{running ? 'Running Tests...' : 'Run All Tests'}</span>
              </button>
            </div>
          </div>

          {/* Test Results Summary */}
          {testResults && (
            <div className={`p-4 rounded-lg border-2 mb-6 ${getStatusColor(testResults.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(testResults.status)}
                  <div>
                    <h3 className="font-semibold">Test Results Summary</h3>
                    <p className="text-sm opacity-90">
                      {testResults.summary.success}/{testResults.summary.total} tests passed
                      {testResults.summary.warning > 0 && `, ${testResults.summary.warning} warnings`}
                      {testResults.summary.error > 0 && `, ${testResults.summary.error} errors`}
                    </p>
                  </div>
                </div>
                <div className="text-sm opacity-90">
                  {new Date(testResults.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Individual Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  test.status === 'running' 
                    ? 'border-blue-200 bg-blue-50' 
                    : getStatusColor(test.status)
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm opacity-75">{test.description}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full mt-1">
                        {test.category}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => runTest(test.id)}
                    disabled={test.status === 'running'}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {test.status === 'running' ? 'Running...' : 'Run'}
                  </button>
                </div>

                {test.result && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">{test.result.message}</p>
                    {test.result.details && (
                      <details className="text-xs opacity-75">
                        <summary className="cursor-pointer">View Details</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                          {JSON.stringify(test.result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {test.error && (
                  <div className="text-sm text-red-700">
                    <p className="font-medium">Error:</p>
                    <p>{test.error}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Next Steps</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Run the ANALYTICS_VERIFICATION.sql script in your Supabase SQL Editor for detailed database checks</p>
            <p>• If any tests fail, check the recommendations in the health monitor above</p>
            <p>• Submit a test survey response to verify the complete data flow</p>
            <p>• Monitor the analytics dashboard for real-time updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsIntegrationTest;
