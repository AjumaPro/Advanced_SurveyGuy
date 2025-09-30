import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import UpgradePrompt from './UpgradePrompt';
import {
  Plus,
  BarChart3,
  FileText,
  Star,
  Zap,
  Crown,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Award,
  Lock
} from 'lucide-react';

const FreePlanDashboard = ({ surveys = [], responses = [] }) => {
  const navigate = useNavigate();
  const { getPlanLimits, canCreateSurvey } = useFeatureAccess();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const limits = getPlanLimits();
  const surveysUsed = surveys.length;
  const canCreateMore = canCreateSurvey(surveysUsed);

  const handleCreateSurvey = () => {
    if (canCreateMore) {
      navigate('/app/survey-builder');
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleUpgradeClick = (feature) => {
    setShowUpgradeModal(true);
  };

  const stats = [
    {
      label: 'Surveys Created',
      value: `${surveysUsed}/${limits.surveys}`,
      icon: FileText,
      color: 'blue',
      progress: (surveysUsed / limits.surveys) * 100,
      warning: surveysUsed >= limits.surveys * 0.8
    },
    {
      label: 'Total Responses',
      value: responses.length,
      icon: BarChart3,
      color: 'green',
      progress: null
    },
    {
      label: 'Active Surveys',
      value: surveys.filter(s => s.status === 'published').length,
      icon: TrendingUp,
      color: 'purple',
      progress: null
    }
  ];

  const premiumFeatures = [
    {
      icon: Zap,
      title: 'Unlimited Surveys',
      description: 'Create as many surveys as you need',
      plan: 'Pro',
      planColor: 'blue'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights with trends and demographics',
      plan: 'Pro',
      planColor: 'blue'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team members',
      plan: 'Pro',
      planColor: 'blue'
    },
    {
      icon: Crown,
      title: 'White Label Solution',
      description: 'Remove our branding and add yours',
      plan: 'Enterprise',
      planColor: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to SurveyGuy Free!</h1>
            <p className="text-blue-100">
              You're on the Free plan. Create up to {limits.surveys} surveys with {limits.responses_per_survey} responses each.
            </p>
          </div>
          <Star className="w-12 h-12 text-blue-200" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
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
              {stat.warning && (
                <div className="text-orange-500 text-sm font-medium">
                  Limit Warning
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            
            {stat.progress !== null && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stat.warning ? 'bg-orange-500' : `bg-${stat.color}-500`
                    }`}
                    style={{ width: `${Math.min(stat.progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.progress >= 100 ? 'Limit reached' : `${Math.round(stat.progress)}% used`}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Survey */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create New Survey</h3>
              <p className="text-gray-600 text-sm">
                {canCreateMore 
                  ? `${limits.surveys - surveysUsed} surveys remaining`
                  : 'Survey limit reached'
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCreateSurvey}
            disabled={!canCreateMore}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              canCreateMore
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canCreateMore ? 'Create Survey' : 'Upgrade to Create More'}
          </button>
        </motion.div>

        {/* View Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Basic Analytics</h3>
              <p className="text-gray-600 text-sm">View your survey performance</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/app/analytics')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View Analytics
          </button>
        </motion.div>
      </div>

      {/* Upgrade Promotion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unlock More Powerful Features
          </h2>
          <p className="text-gray-600">
            Upgrade to Pro or Enterprise for unlimited surveys, advanced analytics, and more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {premiumFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className={`p-2 bg-${feature.planColor}-100 rounded-lg`}>
                <feature.icon className={`w-5 h-5 text-${feature.planColor}-600`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                feature.planColor === 'blue' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {feature.plan}
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
            <span>Compare Plans</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Recent Surveys */}
      {surveys.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Surveys</h2>
          <div className="space-y-3">
            {surveys.slice(0, 3).map((survey, index) => (
              <div
                key={survey.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{survey.title}</h4>
                    <p className="text-sm text-gray-600">
                      {survey.status} • {survey.responses || 0} responses
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/app/surveys/${survey.id}`)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View
                </button>
              </div>
            ))}
          </div>
          
          {surveys.length > 3 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/app/surveys')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All Surveys
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradePrompt
          feature="unlimited surveys"
          requiredPlan="pro"
          currentPlan="free"
          onClose={() => setShowUpgradeModal(false)}
          showModal={showUpgradeModal}
        />
      )}
    </div>
  );
};

export default FreePlanDashboard;
