import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import ProfessionalEventCreator from '../components/ProfessionalEventCreator';

const ProfessionalEventCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    // Get selected template from navigation state
    if (location.state?.selectedTemplate) {
      setSelectedTemplate(location.state.selectedTemplate);
    }
  }, [location.state]);

  const handleEventCreated = (event) => {
    // Navigate to the event management page
    navigate('/app/events', { 
      state: { 
        message: 'Professional event created successfully!',
        createdEvent: event 
      }
    });
  };

  const handleClose = () => {
    navigate('/app/templates');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Templates</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Professional Event Creator</h1>
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Create professional events with our comprehensive templates
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <ProfessionalEventCreator 
          selectedTemplate={selectedTemplate}
          onEventCreated={handleEventCreated}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default ProfessionalEventCreation;
