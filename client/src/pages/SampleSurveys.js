import React from 'react';
import SampleSurveyManager from '../components/SampleSurveyManager';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';

const SampleSurveys = () => {
  const navigate = useNavigate();

  const handleSelectTemplate = (template) => {
    // Template selection is handled by the SampleSurveyManager component
    // which will navigate to the builder with the cloned survey
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/surveys')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Surveys</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Survey Templates</h1>
                  <p className="text-gray-600">Professional templates to jumpstart your surveys</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/app/builder/new')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>Start from Scratch</span>
              </button>
              
              <button
                onClick={() => navigate('/app/builder/new')}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span>Create Survey</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SampleSurveyManager onSelectTemplate={handleSelectTemplate} />
      </div>
    </div>
  );
};

export default SampleSurveys;
