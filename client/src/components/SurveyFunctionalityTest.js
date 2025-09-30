import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';

const SurveyFunctionalityTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [publishedSurveys, setPublishedSurveys] = useState([]);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, result }
      }));
      toast.success(`${testName} test passed!`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }));
      toast.error(`${testName} test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testFetchPublishedSurveys = async () => {
    if (!user) throw new Error('User not logged in');
    
    const response = await api.surveys.getSurveysByStatus(user.id, 'published');
    if (response.error) throw new Error(response.error);
    
    setPublishedSurveys(response.surveys);
    return `Found ${response.surveys.length} published surveys`;
  };

  const testSurveyURL = async () => {
    if (publishedSurveys.length === 0) throw new Error('No published surveys to test');
    
    const survey = publishedSurveys[0];
    const url = `${window.location.origin}/survey/${survey.id}`;
    
    // Test if URL is accessible
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Survey URL not accessible: ${response.status}`);
    
    return `Survey URL is accessible: ${url}`;
  };

  const testCopyToClipboard = async () => {
    if (publishedSurveys.length === 0) throw new Error('No published surveys to test');
    
    const survey = publishedSurveys[0];
    const url = `${window.location.origin}/survey/${survey.id}`;
    
    await navigator.clipboard.writeText(url);
    const clipboardText = await navigator.clipboard.readText();
    
    if (clipboardText !== url) throw new Error('Clipboard copy failed');
    
    return 'Clipboard functionality working';
  };

  const testShortURL = async () => {
    if (publishedSurveys.length === 0) throw new Error('No published surveys to test');
    
    const survey = publishedSurveys[0];
    const shortUrl = `${window.location.origin}/s/${survey.id}`;
    
    // Test if short URL is accessible
    const response = await fetch(shortUrl);
    if (!response.ok) throw new Error(`Short URL not accessible: ${response.status}`);
    
    return `Short URL is accessible: ${shortUrl}`;
  };

  const testDuplicateSurvey = async () => {
    if (publishedSurveys.length === 0) throw new Error('No published surveys to test');
    
    const survey = publishedSurveys[0];
    const response = await api.surveys.duplicateSurvey(survey.id, user.id);
    
    if (response.error) throw new Error(response.error);
    
    return `Survey duplicated successfully: ${response.survey.title}`;
  };

  const runAllTests = async () => {
    await runTest('Fetch Published Surveys', testFetchPublishedSurveys);
    await runTest('Survey URL Access', testSurveyURL);
    await runTest('Copy to Clipboard', testCopyToClipboard);
    await runTest('Short URL Access', testShortURL);
    await runTest('Duplicate Survey', testDuplicateSurvey);
  };

  const openSurveyInNewTab = (surveyId) => {
    const url = `${window.location.origin}/survey/${surveyId}`;
    window.open(url, '_blank');
  };

  const copyUrl = (surveyId) => {
    const url = `${window.location.origin}/survey/${surveyId}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Survey Functionality Test</h2>
      
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">Please log in to test survey functionality.</p>
        </div>
      )}

      {user && (
        <div className="space-y-6">
          {/* Test Controls */}
          <div className="flex gap-4">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <button
              onClick={() => runTest('Fetch Published Surveys', testFetchPublishedSurveys)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Fetch Surveys
            </button>
          </div>

          {/* Test Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div
                key={testName}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle 
                    className={`h-5 w-5 ${
                      result.success ? 'text-green-600' : 'text-red-600'
                    }`} 
                  />
                  <h3 className="font-medium">{testName}</h3>
                </div>
                <p className={`text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? result.result : result.error}
                </p>
              </div>
            ))}
          </div>

          {/* Published Surveys List */}
          {publishedSurveys.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Published Surveys ({publishedSurveys.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedSurveys.map((survey) => (
                  <div key={survey.id} className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {survey.title || 'Untitled Survey'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      ID: {survey.id}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Questions: {survey.questions?.length || 0}
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openSurveyInNewTab(survey.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Live
                      </button>
                      
                      <button
                        onClick={() => copyUrl(survey.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        <Copy className="h-3 w-3" />
                        Copy URL
                      </button>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 font-mono">
                      {`${window.location.origin}/survey/${survey.id}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SurveyFunctionalityTest;
