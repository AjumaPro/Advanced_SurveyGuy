import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { supabase } from '../lib/supabase';
import UpgradePrompt from '../components/UpgradePrompt';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Clock,
  Target,
  Zap,
  Crown,
  Lock,
  ArrowRight
} from 'lucide-react';

const BasicAnalytics = () => {
  const { user } = useAuth();
  const { currentPlan, isFreePlan, hasFeature } = useFeatureAccess();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBasicData();
    }
  }, [user]);

  const fetchBasicData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's surveys
      const { data: surveysData, error } = await supabase
        .from('surveys')
        .select(`
          id,
          title,
          status,
          created_at,
          survey_responses(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching surveys:', error);
        toast.error('Failed to load analytics data');
      } else {
        setSurveys(surveysData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate basic stats
  const totalSurveys = surveys.length;
  const publishedSurveys = surveys.filter(s => s.status === 'published').length;
  const totalResponses = surveys.reduce((sum, survey) => {
    return sum + (survey.responseCount || 0);
  }, 0);
  const avgResponsesPerSurvey = totalSurveys > 0 ? Math.round(totalResponses / totalSurveys) : 0;

  const basicStats = [
    {
      label: 'Total Surveys',
      value: totalSurveys,
      icon: FileText,
      color: 'blue',
      description: 'Surveys created'
    },
    {
      label: 'Published Surveys',
      value: publishedSurveys,
      icon: Eye,
      color: 'green',
      description: 'Active surveys'
    },
    {
      label: 'Total Responses',
      value: totalResponses,
      icon: Users,
      color: 'purple',
      description: 'All responses'
    },
    {
      label: 'Avg per Survey',
      value: avgResponsesPerSurvey,
      icon: Target,
      color: 'orange',
      description: 'Response average'
    }
  ];

  const proFeatures = [
    {
      icon: BarChart3,
      title: 'Advanced Charts',
      description: 'Interactive charts with drill-down capabilities'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Track performance over time with detailed trends'
    },
    {
      icon: Users,
      title: 'Demographics',
      description: 'Age, location, and behavioral insights'
    },
    {
      icon: Target,
      title: 'Custom Reports',
      description: 'Build custom analytics dashboards'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Plan Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Basic Analytics</span>
          </h1>
          <p className="text-gray-600">Essential insights for your surveys</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            Free Plan
          </div>
          {!hasFeature('advanced_analytics') && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade for Advanced</span>
            </button>
          )}
        </div>
      </div>

      {/* Basic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {basicStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Pro Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unlock Advanced Analytics
          </h2>
          <p className="text-gray-600">
            Upgrade to Pro for powerful insights, demographic analysis, and custom reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {proFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="relative bg-white rounded-lg p-4 border border-gray-200"
            >
              {/* Lock overlay */}
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="flex items-start space-x-3 opacity-50">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/app/subscriptions')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Upgrade to Pro</span>
          </button>
          
          <button
            onClick={() => navigate('/pricing')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span>View All Plans</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Basic Survey List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Surveys</h2>
          <p className="text-gray-600 text-sm">Basic performance overview</p>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-4">Create your first survey to see analytics</p>
            <button
              onClick={() => navigate('/app/survey-builder')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Survey
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {surveys.slice(0, 5).map((survey, index) => (
              <div key={survey.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{survey.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          survey.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {survey.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          Created {new Date(survey.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {survey.responseCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">responses</p>
                    </div>
                    <button
                      onClick={() => navigate(`/app/surveys/${survey.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {surveys.length > 5 && (
              <div className="p-4 text-center border-t border-gray-200">
                <button
                  onClick={() => navigate('/app/surveys')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All Surveys ({surveys.length})
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradePrompt
          feature="Advanced Analytics"
          requiredPlan="pro"
          currentPlan={currentPlan}
          onClose={() => setShowUpgradeModal(false)}
          showModal={showUpgradeModal}
        />
      )}
    </div>
  );
};

export default BasicAnalytics;
