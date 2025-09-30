import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Search, Eye, AlertCircle, CheckCircle, Copy } from 'lucide-react';

const SurveyDebugger = () => {
  const [surveyId, setSurveyId] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const debugSurvey = async () => {
    if (!surveyId.trim()) {
      toast.error('Please enter a survey ID');
      return;
    }

    setLoading(true);
    try {
      const debugData = {
        surveyId: surveyId.trim(),
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Check if survey exists in database
      console.log('🔍 Testing survey existence...');
      try {
        const { data: surveyExists, error: existsError } = await api.surveys.getSurvey(surveyId.trim());
        debugData.tests.surveyExists = {
          success: !existsError && surveyExists,
          data: surveyExists,
          error: existsError
        };
      } catch (error) {
        debugData.tests.surveyExists = {
          success: false,
          error: error.message
        };
      }

      // Test 2: Check published status
      console.log('🔍 Testing published status...');
      try {
        const response = await api.responses.getPublicSurvey(surveyId.trim());
        debugData.tests.publicAccess = {
          success: !response.error && response.survey,
          data: response.survey,
          error: response.error
        };
      } catch (error) {
        debugData.tests.publicAccess = {
          success: false,
          error: error.message
        };
      }

      // Test 3: Direct database query
      console.log('🔍 Testing direct database query...');
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: directQuery, error: directError } = await supabase
          .from('surveys')
          .select('id, title, status, published_at, is_active, questions')
          .eq('id', surveyId.trim())
          .single();

        debugData.tests.directQuery = {
          success: !directError && directQuery,
          data: directQuery,
          error: directError?.message
        };
      } catch (error) {
        debugData.tests.directQuery = {
          success: false,
          error: error.message
        };
      }

      // Test 4: URL accessibility
      console.log('🔍 Testing URL accessibility...');
      try {
        const surveyUrl = `${window.location.origin}/survey/${surveyId.trim()}`;
        const urlResponse = await fetch(surveyUrl, { method: 'HEAD' });
        debugData.tests.urlAccess = {
          success: urlResponse.ok,
          status: urlResponse.status,
          url: surveyUrl
        };
      } catch (error) {
        debugData.tests.urlAccess = {
          success: false,
          error: error.message
        };
      }

      setDebugInfo(debugData);
      console.log('🐛 Debug Info:', debugData);

    } catch (error) {
      console.error('Debug error:', error);
      toast.error('Debug failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyDebugInfo = () => {
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    toast.success('Debug info copied to clipboard!');
  };

  const testSurveyUrl = () => {
    if (!surveyId.trim()) {
      toast.error('Please enter a survey ID');
      return;
    }
    const url = `${window.location.origin}/survey/${surveyId.trim()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Survey Debugger</h2>
      
      <div className="space-y-6">
        {/* Survey ID Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Survey ID to Debug
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={surveyId}
              onChange={(e) => setSurveyId(e.target.value)}
              placeholder="Enter survey ID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={debugSurvey}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {loading ? 'Debugging...' : 'Debug'}
            </button>
            <button
              onClick={testSurveyUrl}
              disabled={!surveyId.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Test URL
            </button>
          </div>
        </div>

        {/* Debug Results */}
        {debugInfo && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Debug Results</h3>
              <button
                onClick={copyDebugInfo}
                className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                <Copy className="h-3 w-3" />
                Copy Debug Info
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(debugInfo.tests).map(([testName, result]) => (
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
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Error:</strong> {result.error}
                    </p>
                  )}

                  {result.data && (
                    <div className="text-sm text-gray-700">
                      <strong>Data:</strong>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.status && (
                    <p className="text-sm text-gray-700">
                      <strong>Status:</strong> {result.status}
                    </p>
                  )}

                  {result.url && (
                    <p className="text-sm text-gray-700">
                      <strong>URL:</strong> 
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {result.url}
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Summary:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Survey ID: <code className="bg-gray-200 px-1 rounded">{debugInfo.surveyId}</code></li>
                <li>• Debug Time: {new Date(debugInfo.timestamp).toLocaleString()}</li>
                <li>• Tests Passed: {Object.values(debugInfo.tests).filter(t => t.success).length} / {Object.keys(debugInfo.tests).length}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">How to use:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Get a survey ID from your Published Surveys page</li>
            <li>2. Paste it in the input field above</li>
            <li>3. Click "Debug" to run diagnostic tests</li>
            <li>4. Check the results to see what's preventing access</li>
            <li>5. Use "Test URL" to try opening the survey directly</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SurveyDebugger;
