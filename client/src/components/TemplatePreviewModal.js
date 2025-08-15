import React from 'react';
import { X, Eye, Copy, Download, CheckCircle, Clock, Users, Star } from 'lucide-react';

const TemplatePreviewModal = ({ template, isOpen, onClose, onUseTemplate }) => {
  if (!isOpen || !template) return null;

  const renderQuestionPreview = (question, index) => {
    return (
      <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900">
            Q{index + 1}: {question.question}
          </h4>
          <span className={`px-2 py-1 rounded-full text-xs ${
            question.required 
              ? 'bg-red-100 text-red-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {question.required ? 'Required' : 'Optional'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          Type: <span className="font-medium capitalize">{question.type}</span>
        </div>

        {question.options && (
          <div className="space-y-1">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEventFields = (fields) => {
    const fieldLabels = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company',
      position: 'Position',
      dietary: 'Dietary Requirements',
      attendees: 'Number of Attendees',
      experience: 'Experience Level',
      goals: 'Learning Goals',
      meetingLink: 'Meeting Link',
      platform: 'Platform',
      plusOne: 'Plus One',
      custom: 'Custom Field'
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-700">{fieldLabels[field] || field}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {template.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {/* Template Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {template.estimatedTime || template.estimatedDuration}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {template.defaultCapacity ? `${template.defaultCapacity} max capacity` : `${template.questions?.length || 0} questions`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4" />
                <span>
                  {template.category ? template.category.replace('-', ' ').toUpperCase() : 'Template'}
                </span>
              </div>
            </div>

            {/* Questions or Fields */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                {template.questions ? 'Survey Questions' : 'Registration Fields'}
              </h4>
              
              {template.questions ? (
                <div className="space-y-3">
                  {template.questions.map((question, index) => renderQuestionPreview(question, index))}
                </div>
              ) : (
                <div>
                  {renderEventFields(template.fields)}
                </div>
              )}
            </div>

            {/* Features */}
            {template.features && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Features Included</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Audience */}
            {template.targetAudience && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
                <p className="text-sm text-gray-600">{template.targetAudience}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(template, null, 2));
                  // You can add a toast notification here
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Template
              </button>
              <button
                onClick={() => {
                  // Export template as JSON file
                  const dataStr = JSON.stringify(template, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`;
                  link.click();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUseTemplate(template);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Use This Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal; 