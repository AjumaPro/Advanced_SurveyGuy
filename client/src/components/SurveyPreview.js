import React, { useState } from 'react';
import QuestionRenderer from './QuestionRenderer';
import {
  X,
  Eye,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const SurveyPreview = ({ survey, onClose }) => {
  const [responses, setResponses] = useState({});

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Survey Preview</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                <Smartphone className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                <Tablet className="w-4 h-4" />
              </button>
              <button className="p-2 text-blue-600 bg-blue-50 rounded">
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {survey.title}
                </h1>
                {survey.description && (
                  <p className="text-gray-600">
                    {survey.description}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {survey.questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-3 mb-4">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {question.title}
                          {question.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </h3>
                        {question.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {question.description}
                          </p>
                        )}
                        
                        <div className="mt-3">
                          <QuestionRenderer 
                            question={question}
                            value={responses[question.id]}
                            onChange={(value) => handleResponseChange(question.id, value)}
                            preview={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {survey.questions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">No questions added yet</div>
                  <p className="text-sm text-gray-500">
                    Add questions to see them in the preview
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled
                >
                  Submit Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPreview;
