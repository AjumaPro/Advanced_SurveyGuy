import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  Share2,
  Plus,
  Settings,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Users,
  BarChart3
} from 'lucide-react';

// Import the ProfessionalSurveyBuilder component
import ProfessionalSurveyBuilder from '../components/ProfessionalSurveyBuilder';

const SurveyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    fetchSurvey();
  }, [id, user]);

  const fetchSurvey = async () => {
    if (!user || !id) return;
    
    setLoading(true);
    try {
      const response = await api.surveys.getSurvey(id);
      if (response.error) {
        toast.error('Survey not found');
        navigate('/app/surveys');
        return;
      }
      
      setSurvey(response.survey);
    } catch (error) {
      toast.error('Failed to load survey');
      console.error('Error:', error);
      navigate('/app/surveys');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSurvey = async () => {
    if (!survey.title?.trim()) {
      toast.error('Please add a title before publishing');
      return;
    }
    
    if (!survey.questions?.length) {
      toast.error('Please add at least one question before publishing');
      return;
    }

    try {
      const response = await api.surveys.publishSurvey(survey.id);
      if (response.error) {
        toast.error('Failed to publish survey');
      } else {
        toast.success('Survey published successfully!');
        navigate('/app/published-surveys');
      }
    } catch (error) {
      toast.error('Failed to publish survey');
      console.error('Error:', error);
    }
  };

  const canPublish = () => {
    return survey?.title?.trim() && survey?.questions?.length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey editor...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey Not Found</h2>
          <p className="text-gray-600 mb-6">The survey you're trying to edit doesn't exist or you don't have access to it.</p>
          <Link
            to="/app/surveys"
            className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Surveys</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Quick Actions Header */}
      {showQuickActions && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/app/surveys"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Drafts</span>
                </Link>
                
                <div className="border-l border-gray-300 pl-4">
                  <h1 className="text-lg font-semibold text-gray-900">
                    Editing: {survey.title || 'Untitled Survey'}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Draft</span>
                    <span>•</span>
                    <span>{survey.questions?.length || 0} questions</span>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Quick Status */}
                <div className="flex items-center space-x-2">
                  {canPublish() ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">Ready to publish</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700 font-medium">
                        {!survey.title ? 'Add title' : 'Add questions'} to publish
                      </span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/app/preview/${survey.id}`}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </Link>

                  <button
                    onClick={handlePublishSurvey}
                    disabled={!canPublish()}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Survey Builder */}
      <div className="relative">
        <ProfessionalSurveyBuilder />
      </div>

      {/* Floating Action Button for Quick Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 right-8 z-30"
      >
        <Link
          to={`/app/preview/${survey.id}`}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
        >
          <Eye className="w-5 h-5" />
          <span className="font-medium">Quick Preview</span>
        </Link>
      </motion.div>

      {/* Survey Info Panel (Collapsible) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-20 max-w-xs"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Survey Info</h3>
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <Lock className="w-3 h-3 mr-1" />
              Draft
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Questions:</span>
            <span className="font-medium text-gray-900">{survey.questions?.length || 0}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Est. Time:</span>
            <span className="font-medium text-gray-900">
              {Math.ceil((survey.questions?.length || 0) * 0.5)} min
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Updated:</span>
            <span className="font-medium text-gray-900">
              {survey.updated_at ? new Date(survey.updated_at).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SurveyEdit;
