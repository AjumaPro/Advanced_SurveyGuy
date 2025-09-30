import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Send, ExternalLink, CheckCircle } from 'lucide-react';

const TestSurveyCreator = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [createdSurvey, setCreatedSurvey] = useState(null);
  const [publishedSurvey, setPublishedSurvey] = useState(null);

  const createTestSurvey = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    try {
      const testSurveyData = {
        title: 'Test Customer Survey',
        description: 'A simple test survey to verify public access functionality',
        questions: [
          {
            id: 'q1',
            type: 'text',
            question: 'What is your name?',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'How satisfied are you with our service?',
            required: true,
            options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
          },
          {
            id: 'q3',
            type: 'rating',
            question: 'Rate your overall experience (1-5)',
            required: true,
            min: 1,
            max: 5
          },
          {
            id: 'q4',
            type: 'text',
            question: 'Any additional comments?',
            required: false,
            placeholder: 'Optional feedback'
          }
        ],
        settings: {
          allowAnonymous: true,
          showProgressBar: true,
          oneQuestionPerPage: true
        },
        status: 'draft',
        is_active: true
      };

      const response = await api.surveys.createSurvey(user.id, testSurveyData);
      
      if (response.error) {
        toast.error(`Failed to create survey: ${response.error}`);
        return;
      }

      setCreatedSurvey(response.survey);
      toast.success('Test survey created successfully!');

    } catch (error) {
      console.error('Error creating test survey:', error);
      toast.error('Failed to create test survey');
    } finally {
      setLoading(false);
    }
  };

  const publishSurvey = async () => {
    if (!createdSurvey) return;

    setLoading(true);
    try {
      const response = await api.surveys.publishSurvey(createdSurvey.id);
      
      if (response.error) {
        toast.error(`Failed to publish survey: ${response.error}`);
        return;
      }

      setPublishedSurvey(response.survey);
      toast.success('Survey published successfully!');

    } catch (error) {
      console.error('Error publishing survey:', error);
      toast.error('Failed to publish survey');
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = () => {
    if (!publishedSurvey) return '';
    return `${window.location.origin}/survey/${publishedSurvey.id}`;
  };

  const copyUrl = () => {
    const url = getPublicUrl();
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const openPublicSurvey = () => {
    const url = getPublicUrl();
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Survey Creator</h2>
      
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">Please log in to create a test survey.</p>
        </div>
      )}

      {user && (
        <div className="space-y-4">
          {/* Step 1: Create Survey */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Step 1: Create Test Survey</h3>
              <p className="text-sm text-gray-600">Create a simple survey for testing</p>
            </div>
            <button
              onClick={createTestSurvey}
              disabled={loading || createdSurvey}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createdSurvey ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Created
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Survey'}
                </>
              )}
            </button>
          </div>

          {/* Step 2: Publish Survey */}
          {createdSurvey && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Step 2: Publish Survey</h3>
                <p className="text-sm text-gray-600">Make the survey publicly accessible</p>
                <p className="text-xs text-gray-500">Survey ID: {createdSurvey.id}</p>
              </div>
              <button
                onClick={publishSurvey}
                disabled={loading || publishedSurvey}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishedSurvey ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Published
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {loading ? 'Publishing...' : 'Publish Survey'}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Test Public Access */}
          {publishedSurvey && (
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold text-gray-900 mb-2">Step 3: Test Public Access</h3>
              <p className="text-sm text-gray-600 mb-3">Survey is now publicly accessible!</p>
              
              <div className="bg-white p-3 rounded border mb-3">
                <p className="text-xs text-gray-500 mb-1">Public URL:</p>
                <p className="text-sm font-mono break-all">{getPublicUrl()}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyUrl}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Copy URL
                </button>
                <button
                  onClick={openPublicSurvey}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Survey
                </button>
              </div>
            </div>
          )}

          {/* Status Display */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Status:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className={`flex items-center gap-2 ${createdSurvey ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="h-4 w-4" />
                Survey Created {createdSurvey ? '✓' : ''}
              </li>
              <li className={`flex items-center gap-2 ${publishedSurvey ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="h-4 w-4" />
                Survey Published {publishedSurvey ? '✓' : ''}
              </li>
              <li className={`flex items-center gap-2 ${publishedSurvey ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="h-4 w-4" />
                Public Access Available {publishedSurvey ? '✓' : ''}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSurveyCreator;
