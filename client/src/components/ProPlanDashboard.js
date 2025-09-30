import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import FeatureGate from './FeatureGate';
import {
  Plus,
  BarChart3,
  FileText,
  Zap,
  Crown,
  Users,
  Palette,
  Code,
  TrendingUp,
  Target,
  Bell,
  Settings,
  Download,
  Share2,
  Eye,
  ArrowRight,
  Shield
} from 'lucide-react';

const ProPlanDashboard = ({ surveys = [], responses = [], teamMembers = [] }) => {
  const navigate = useNavigate();
  const { getPlanLimits } = useFeatureAccess();
  
  const limits = getPlanLimits();
  const totalResponses = responses.length;
  const activeTeamMembers = teamMembers.length || 1; // Include self

  const stats = [
    {
      label: 'Total Surveys',
      value: surveys.length,
      icon: FileText,
      color: 'blue',
      subtitle: 'Unlimited'
    },
    {
      label: 'Total Responses',
      value: totalResponses.toLocaleString(),
      icon: BarChart3,
      color: 'green',
      subtitle: 'This month'
    },
    {
      label: 'Team Members',
      value: `${activeTeamMembers}/${limits.team_members}`,
      icon: Users,
      color: 'purple',
      subtitle: 'Active collaborators'
    },
    {
      label: 'Response Rate',
      value: surveys.length > 0 ? `${Math.round(totalResponses / surveys.length)}%` : '0%',
      icon: TrendingUp,
      color: 'orange',
      subtitle: 'Average completion'
    }
  ];

  const quickActions = [
    {
      title: 'Create Survey',
      description: 'Build a new survey with advanced question types',
      icon: Plus,
      color: 'blue',
      action: () => navigate('/app/survey-builder'),
      feature: 'advanced_survey_creation'
    },
    {
      title: 'Advanced Analytics',
      description: 'Deep insights with trends and demographics',
      icon: BarChart3,
      color: 'green',
      action: () => navigate('/app/analytics'),
      feature: 'advanced_analytics'
    },
    {
      title: 'Team Management',
      description: 'Invite team members and manage permissions',
      icon: Users,
      color: 'purple',
      action: () => navigate('/app/team'),
      feature: 'team_collaboration'
    },
    {
      title: 'Custom Branding',
      description: 'Add your logo and customize survey appearance',
      icon: Palette,
      color: 'pink',
      action: () => navigate('/app/branding'),
      feature: 'custom_branding'
    },
    {
      title: 'API Access',
      description: 'Integrate surveys with your applications',
      icon: Code,
      color: 'gray',
      action: () => navigate('/app/api'),
      feature: 'api_access'
    },
    {
      title: 'Advanced Export',
      description: 'Export data in multiple formats with filters',
      icon: Download,
      color: 'indigo',
      action: () => navigate('/app/export'),
      feature: 'advanced_export'
    }
  ];

  const proFeatures = [
    {
      icon: Zap,
      title: 'Unlimited Surveys',
      description: 'Create as many surveys as you need',
      status: 'active'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights and custom reports',
      status: 'active'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with up to 10 team members',
      status: 'active'
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Add your logo and brand colors',
      status: 'active'
    },
    {
      icon: Code,
      title: 'API Access',
      description: 'Integrate with your existing tools',
      status: 'active'
    },
    {
      icon: Bell,
      title: 'Priority Support',
      description: 'Get help when you need it most',
      status: 'active'
    }
  ];

  const enterpriseFeatures = [
    {
      icon: Crown,
      title: 'White Label Solution',
      description: 'Remove our branding completely',
      plan: 'Enterprise'
    },
    {
      icon: Shield,
      title: 'SSO Integration',
      description: 'Single sign-on with your identity provider',
      plan: 'Enterprise'
    },
    {
      icon: Users,
      title: 'Advanced Team Management',
      description: 'Unlimited team members with role-based access',
      plan: 'Enterprise'
    },
    {
      icon: Target,
      title: 'Custom Development',
      description: 'Tailored features for your specific needs',
      plan: 'Enterprise'
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
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Pro Dashboard</h1>
            </div>
            <p className="text-blue-100">
              Welcome to your Pro workspace! You have access to advanced features and unlimited surveys.
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm font-medium">
              Pro Plan Active
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <FeatureGate key={action.title} feature={action.feature}>
              <div
                onClick={action.action}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 bg-${action.color}-100 rounded-lg group-hover:bg-${action.color}-200 transition-colors`}>
                    <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </FeatureGate>
          ))}
        </div>
      </motion.div>

      {/* Pro Features Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Pro Features</h2>
          <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            All Active
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <feature.icon className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Enterprise Upgrade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Need Even More Power?
            </h2>
            <p className="text-gray-600">
              Upgrade to Enterprise for white-label solutions, SSO, and unlimited everything
            </p>
          </div>
          <Crown className="w-12 h-12 text-purple-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {enterpriseFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <feature.icon className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                {feature.plan}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/app/subscriptions')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade to Enterprise</span>
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Surveys</h2>
          <button
            onClick={() => navigate('/app/surveys')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {surveys.length > 0 ? (
          <div className="space-y-3">
            {surveys.slice(0, 4).map((survey, index) => (
              <div
                key={survey.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{survey.title}</h4>
                    <p className="text-sm text-gray-600">
                      {survey.status} • {survey.responses || 0} responses • {survey.created_at}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/app/surveys/${survey.id}/analytics`)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="View Analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/app/surveys/${survey.id}`)}
                    className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                    title="View Survey"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/survey/${survey.id}`)}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                    title="Share Survey"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-4">Create your first survey to get started</p>
            <button
              onClick={() => navigate('/app/survey-builder')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Survey
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProPlanDashboard;
