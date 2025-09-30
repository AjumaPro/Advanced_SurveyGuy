import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const DatabaseTest = () => {
  const [tests, setTests] = useState([]);
  const [running, setRunning] = useState(false);

  const runDatabaseTests = async () => {
    setRunning(true);
    setTests([]);

    const testCases = [
      {
        name: 'Check Supabase Connection',
        test: async () => {
          try {
            const { data, error } = await api.surveys.getSurveys('test-user-id');
            return { success: !error, message: error ? error : 'Connected successfully' };
          } catch (err) {
            return { success: false, message: err.message };
          }
        }
      },
      {
        name: 'Check Surveys Table',
        test: async () => {
          try {
            const { data, error } = await api.surveys.getSurveys('test-user-id');
            return { success: true, message: 'Surveys table accessible' };
          } catch (err) {
            return { success: false, message: err.message };
          }
        }
      },
      {
        name: 'Check Question Templates Table',
        test: async () => {
          try {
            const { data, error } = await api.templates.getTemplates();
            return { success: !error, message: error ? error : 'Question templates accessible' };
          } catch (err) {
            return { success: false, message: err.message };
          }
        }
      },
      {
        name: 'Check Question Library Table',
        test: async () => {
          try {
            const { data, error } = await api.questions.getSavedQuestions('test-user-id');
            return { success: !error, message: error ? error : 'Question library accessible' };
          } catch (err) {
            return { success: false, message: err.message };
          }
        }
      },
      {
        name: 'Check Templates API',
        test: async () => {
          try {
            const { data, error } = await api.templates.getTemplates();
            return { success: !error, message: error ? error : `Found ${data?.length || 0} templates` };
          } catch (err) {
            return { success: false, message: err.message };
          }
        }
      }
    ];

    const results = [];
    for (const testCase of testCases) {
      try {
        const result = await testCase.test();
        results.push({
          name: testCase.name,
          success: result.success,
          message: result.message,
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        results.push({
          name: testCase.name,
          success: false,
          message: error.message,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    setTests(results);
    setRunning(false);

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    if (successCount === totalCount) {
      toast.success(`All ${totalCount} database tests passed!`);
    } else {
      toast.error(`${totalCount - successCount} of ${totalCount} database tests failed`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Database Test</h1>
            <p className="text-gray-600 mt-1">Test database connectivity and table access</p>
          </div>
          
          <button
            onClick={runDatabaseTests}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {running ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {running ? 'Testing...' : 'Run Tests'}
          </button>
        </div>

        {tests.length > 0 && (
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  test.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {test.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{test.name}</h3>
                    <p className={`text-sm ${
                      test.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {test.message}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{test.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        {tests.length === 0 && !running && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Run Yet</h3>
            <p className="text-gray-600">
              Click "Run Tests" to check your database connectivity and table access.
            </p>
          </div>
        )}

        {running && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Running Database Tests</h3>
            <p className="text-gray-600">
              Please wait while we test your database connectivity...
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Database Setup Instructions</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>If any tests fail, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Open your Supabase project dashboard</li>
              <li>Go to the SQL Editor</li>
              <li>Run the <code className="bg-blue-100 px-1 rounded">fix-database-errors.sql</code> script</li>
              <li>Verify with the <code className="bg-blue-100 px-1 rounded">verify-database.sql</code> script</li>
              <li>Re-run these tests</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;
