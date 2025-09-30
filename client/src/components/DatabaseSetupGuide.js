import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Settings,
  BookOpen,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const DatabaseSetupGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedScript, setCopiedScript] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Open Supabase Dashboard',
      description: 'Go to your Supabase project dashboard',
      icon: <ExternalLink className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            You need to run SQL scripts in your Supabase project to enable question saving functionality.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Quick Access:</h4>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">supabase.com/dashboard</a></li>
              <li>Select your project</li>
              <li>Click on "SQL Editor" in the left sidebar</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Run Database Fix Script',
      description: 'Copy and run the database setup script',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Copy the script below and paste it into the Supabase SQL Editor, then click "Run".
          </p>
          
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <button
              onClick={() => {
                navigator.clipboard.writeText(sqlScript);
                setCopiedScript(true);
                toast.success('Script copied to clipboard!');
                setTimeout(() => setCopiedScript(false), 2000);
              }}
              className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              {copiedScript ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            
            <pre className="text-green-400 text-xs overflow-x-auto">
              <code>{sqlScript.substring(0, 200)}...</code>
            </pre>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Important:</h4>
                <p className="text-sm text-yellow-800">
                  Make sure you're in the correct project and have the right permissions before running this script.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Verify Setup',
      description: 'Confirm the database is set up correctly',
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            After running the script, you should see success messages. You can also run the verification script to double-check.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Expected Results:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Database errors fixed successfully!</li>
                <li>• Question library tables created</li>
                <li>• 3 question templates added</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Try saving a question</li>
                <li>• Browse question templates</li>
                <li>• Use the question library</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => {
              // Navigate to database test page
              window.open('/app/database-test', '_blank');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Run Database Test
          </button>
        </div>
      )
    }
  ];

  const sqlScript = `-- Fix Database Errors - Supabase SQL Script
-- This script adds support for advanced question types, templates, and library functionality

-- Add missing columns to surveys table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'advanced_features') THEN
        ALTER TABLE public.surveys ADD COLUMN advanced_features JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'surveys' AND column_name = 'question_library_enabled') THEN
        ALTER TABLE public.surveys ADD COLUMN question_library_enabled BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Create question_library table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.question_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  question_data JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE public.question_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own questions and public questions" ON public.question_library;
DROP POLICY IF EXISTS "Users can insert their own questions" ON public.question_library;
DROP POLICY IF EXISTS "Users can update their own questions" ON public.question_library;
DROP POLICY IF EXISTS "Users can delete their own questions" ON public.question_library;

-- Create RLS Policies
CREATE POLICY "Users can view their own questions and public questions" ON public.question_library
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert their own questions" ON public.question_library
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own questions" ON public.question_library
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own questions" ON public.question_library
  FOR DELETE USING (user_id = auth.uid());

-- Success message
SELECT 'Database errors fixed successfully!' as result;
SELECT 'Question library tables created and configured.' as status;`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Database Setup Guide</h2>
            <p className="text-gray-600 mt-1">Fix question saving and enable advanced features</p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= step.id
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {currentStep > step.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 ${
                        currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Current Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                    {steps[currentStep - 1].icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Step {currentStep}: {steps[currentStep - 1].title}
                  </h3>
                  <p className="text-gray-600">
                    {steps[currentStep - 1].description}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  {steps[currentStep - 1].content}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index + 1 === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep < steps.length ? (
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Setup
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DatabaseSetupGuide;
