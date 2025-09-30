import React, { useEffect, useState } from 'react';
import { checkSampleSurveysExist, createSampleSurveys } from '../utils/sampleSurveySetup';
import toast from 'react-hot-toast';
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const SampleSurveyInitializer = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    initializeSampleSurveys();
  }, []);

  const initializeSampleSurveys = async () => {
    try {
      // Check if sample surveys already exist
      const samplesExist = await checkSampleSurveysExist();
      
      if (samplesExist) {
        setInitializationComplete(true);
        return;
      }

      // If no samples exist, create them
      setIsInitializing(true);
      
      const result = await createSampleSurveys();
      
      if (result.success) {
        toast.success(`✨ ${result.count} professional survey templates are now available!`);
        setInitializationComplete(true);
      } else {
        console.error('Failed to initialize sample surveys:', result.error);
        toast.error('Failed to load survey templates');
        setInitializationComplete(true); // Continue anyway
      }
    } catch (error) {
      console.error('Error during sample survey initialization:', error);
      toast.error('Failed to initialize survey templates');
      setInitializationComplete(true); // Continue anyway
    } finally {
      setIsInitializing(false);
    }
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 absolute top-1 right-1" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Setting up Survey Templates
          </h2>
          <p className="text-gray-600 mb-4">
            We're preparing professional survey templates for you...
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>This will only take a moment</span>
          </div>
        </div>
      </div>
    );
  }

  // Show success message briefly
  if (!initializationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Templates Ready!
          </h2>
          <p className="text-gray-600">
            Professional survey templates are now available
          </p>
        </div>
      </div>
    );
  }

  // Render children when initialization is complete
  return children;
};

export default SampleSurveyInitializer;
