import React, { useState, useEffect } from 'react';
import { 
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdvancedEventRegistrationForm = ({ 
  event, 
  onSubmit, 
  onCancel, 
  isOpen = false 
}) => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  const totalSteps = 4;

  useEffect(() => {
    if (event) {
      // Initialize form data based on event template
      const initialData = {};
      event.fields?.forEach(field => {
        initialData[field] = '';
      });
      setFormData(initialData);
    }
  }, [event]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionSelect = (category, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: option
    }));
  };

  const handleCustomFieldChange = (field, value) => {
    // This function is no longer used, but keeping it for now
    // setCustomFields(prev => ({
    //   ...prev,
    //   [field]: value
    // }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.phone && formData.company;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const registrationData = {
        ...formData,
        selectedOptions,
        // customFields, // customFields state was removed
        eventId: event.id,
        registrationDate: new Date().toISOString()
      };

      await onSubmit(registrationData);
      toast.success('Registration submitted successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const fieldConfig = {
      name: { label: 'Full Name', type: 'text', required: true },
      email: { label: 'Email Address', type: 'email', required: true },
      phone: { label: 'Phone Number', type: 'tel', required: true },
      company: { label: 'Company/Organization', type: 'text', required: true },
      position: { label: 'Job Title/Position', type: 'text', required: false },
      dietary: { label: 'Dietary Requirements', type: 'select', required: false },
      attendees: { label: 'Number of Attendees', type: 'number', required: false },
      track_preference: { label: 'Track Preference', type: 'select', required: false },
      workshop_selection: { label: 'Workshop Selection', type: 'multi-select', required: false },
      networking_goals: { label: 'Networking Goals', type: 'textarea', required: false },
      accommodation: { label: 'Accommodation Preference', type: 'select', required: false },
      special_requirements: { label: 'Special Requirements', type: 'textarea', required: false },
      emergency_contact: { label: 'Emergency Contact', type: 'text', required: false },
      social_media_handles: { label: 'Social Media Handles', type: 'text', required: false }
    };

    const config = fieldConfig[field] || { label: field, type: 'text', required: false };

    switch (config.type) {
      case 'select':
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label} {config.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={config.required}
            >
              <option value="">Select {config.label}</option>
              {event.advancedFeatures?.accommodationOptions && field === 'accommodation' && 
                event.advancedFeatures.accommodationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))
              }
              {event.advancedFeatures?.trackSelection && field === 'track_preference' && 
                event.advancedFeatures.trackSelection.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))
              }
            </select>
          </div>
        );

      case 'multi-select':
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label} {config.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {event.advancedFeatures?.workshopOptions && field === 'workshop_selection' && 
                event.advancedFeatures.workshopOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedOptions[field]?.includes(option) || false}
                      onChange={(e) => {
                        const current = selectedOptions[field] || [];
                        const updated = e.target.checked 
                          ? [...current, option]
                          : current.filter(item => item !== option);
                        handleOptionSelect(field, updated);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))
              }
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label} {config.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter your ${config.label.toLowerCase()}`}
              required={config.required}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label} {config.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${config.label.toLowerCase()}`}
              required={config.required}
            />
          </div>
        );

      default:
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label} {config.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={config.type}
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter your ${config.label.toLowerCase()}`}
              required={config.required}
            />
          </div>
        );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-600">Let's start with your basic details</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'email'].map(field => renderField(field))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Contact & Organization</h3>
              <p className="text-sm text-gray-600">Tell us about your organization</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['phone', 'company', 'position'].map(field => renderField(field))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Event Preferences</h3>
              <p className="text-sm text-gray-600">Customize your event experience</p>
            </div>
            <div className="space-y-4">
              {['dietary', 'attendees', 'track_preference', 'workshop_selection'].map(field => renderField(field))}
              {['networking_goals', 'accommodation', 'special_requirements'].map(field => renderField(field))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
              <p className="text-sm text-gray-600">Review your registration details</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h4 className="font-medium text-gray-900">Registration Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                    <span className="font-medium">{value || 'Not specified'}</span>
                  </div>
                ))}
              </div>
              {Object.keys(selectedOptions).length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Selected Options</h5>
                  {Object.entries(selectedOptions).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-medium ml-2">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Event Registration</h2>
              <p className="text-sm text-gray-600">{event?.name}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-3">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Registration</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedEventRegistrationForm; 