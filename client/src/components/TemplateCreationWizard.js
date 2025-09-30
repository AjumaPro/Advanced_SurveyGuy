import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Calendar,
  FileText,
  Building,
  GraduationCap,
  Heart,
  ShoppingCart,
  Target,
  Home,
  Music,
  Camera,
  Utensils,
  Plane,
  Car,
  Gift,
  Award,
  Globe,
  Zap
} from 'lucide-react';

// Step Components
import TemplatePurposeStep from './wizard/TemplatePurposeStep';
import AITemplateSuggestions from './wizard/AITemplateSuggestions';
import QuickSetupStep from './wizard/QuickSetupStep';
import PreviewAndSaveStep from './wizard/PreviewAndSaveStep';

const TemplateCreationWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [templateData, setTemplateData] = useState({
    purpose: null,
    category: null,
    selectedTemplate: null,
    customizations: {},
    settings: {
      name: '',
      description: '',
      targetAudience: '',
      estimatedTime: '2-3 minutes',
      isPublic: false,
      allowAnonymous: true,
      collectEmail: false,
      showProgress: true,
      mobileOptimized: true
    },
    branding: {
      logo: null,
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
      textColor: '#1F2937',
      backgroundColor: '#F9FAFB'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const steps = [
    {
      id: 'purpose',
      title: 'Template Purpose',
      component: TemplatePurposeStep,
      description: 'Choose what type of template you want to create'
    },
    {
      id: 'suggestions',
      title: 'AI Suggestions',
      component: AITemplateSuggestions,
      description: 'Get AI-powered template recommendations'
    },
    {
      id: 'setup',
      title: 'Quick Setup',
      component: QuickSetupStep,
      description: 'Configure your template settings'
    },
    {
      id: 'preview',
      title: 'Preview & Save',
      component: PreviewAndSaveStep,
      description: 'Review and save your template'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateTemplateData = (updates) => {
    console.log('TemplateCreationWizard: Updating template data with:', updates);
    setTemplateData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      
      const templatePayload = {
        title: templateData.settings.name || 'Untitled Template',
        description: templateData.settings.description || '',
        template_category: templateData.category || 'general',
        template_industry: 'general',
        estimated_time: templateData.settings.estimatedTime,
        target_audience: templateData.settings.targetAudience,
        questions: templateData.selectedTemplate?.questions || [],
        settings: {
          allowAnonymous: templateData.settings.allowAnonymous,
          collectEmail: templateData.settings.collectEmail,
          showProgress: templateData.settings.showProgress,
          mobileOptimized: templateData.settings.mobileOptimized
        },
        branding: templateData.branding,
        is_public: templateData.settings.isPublic,
        is_template: true
      };

      const response = await api.templates.createTemplate(user.id, templatePayload);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Template created successfully!');
      navigate(`/app/template-editor/${response.template.id}`);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Purpose step
        return templateData.purpose && templateData.category;
      case 1: // AI Suggestions step
        return templateData.selectedTemplate !== null;
      case 2: // Setup step
        return templateData.settings.name.trim() !== '';
      case 3: // Preview step
        return true;
      default:
        return false;
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/reports')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Templates
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🎯 Template Creation Wizard
                </h1>
                <p className="text-gray-600 mt-1">
                  Create professional templates in minutes with AI assistance
                </p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step Labels */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  index < currentStep 
                    ? 'bg-blue-600 text-white' 
                    : index === currentStep 
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' 
                      : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs font-medium text-center max-w-20">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentStepComponent
            templateData={templateData}
            updateTemplateData={updateTemplateData}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={handleSaveTemplate}
            canProceed={canProceed()}
            saving={saving}
            loading={loading}
          />
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSaveTemplate}
                disabled={!canProceed() || saving}
                className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors ${
                  !canProceed() || saving
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Template
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors ${
                  !canProceed()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplateCreationWizard;
