import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Activity,
  Sparkles,
  Crown,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, subscriptionPlan, subscriptionStatus } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  const getSubscriptionInfo = () => {
    switch (subscriptionPlan) {
      case 'free':
        return {
          name: 'Free Plan',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          features: ['3 surveys', '50 responses per survey', 'Basic analytics'],
          upgradeMessage: 'Upgrade to unlock unlimited surveys and advanced features!'
        };
      case 'basic':
        return {
          name: 'Basic Plan',
          icon: <Sparkles className="h-5 w-5 text-blue-600" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          features: ['Unlimited surveys', '1,000 responses per survey', 'Advanced analytics'],
          upgradeMessage: 'You have access to all Basic features!'
        };
      case 'premium':
        return {
          name: 'Premium Plan',
          icon: <Crown className="h-5 w-5 text-purple-600" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          features: ['Everything in Basic', '5,000 responses per survey', 'Team collaboration'],
          upgradeMessage: 'You have access to all Premium features!'
        };
      case 'enterprise':
        return {
          name: 'Enterprise Plan',
          icon: <Crown className="h-5 w-5 text-yellow-600" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          features: ['Unlimited everything', 'Custom integrations', 'Dedicated support'],
          upgradeMessage: 'You have access to all Enterprise features!'
        };
      default:
        return {
          name: 'Free Plan',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          features: ['3 surveys', '50 responses per survey', 'Basic analytics'],
          upgradeMessage: 'Upgrade to unlock unlimited surveys and advanced features!'
        };
    }
  };

  const subscriptionInfo = getSubscriptionInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Surveys',
      value: dashboardData?.summary?.total_surveys || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Published Surveys',
      value: dashboardData?.summary?.published_surveys || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Responses',
      value: dashboardData?.summary?.total_respondents || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Draft Surveys',
      value: dashboardData?.summary?.draft_surveys || 0,
      icon: Edit,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your surveys.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleNavigation('/app/templates')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Use Templates
          </button>
          <button
            onClick={() => handleNavigation('/app/builder')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Survey
          </button>
        </div>
      </div>

      {/* Subscription Status */}
      <div className={`${subscriptionInfo.bgColor} rounded-lg p-4 border border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${subscriptionInfo.bgColor} p-2 rounded-lg`}>
              {subscriptionInfo.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{subscriptionInfo.name}</h3>
              <p className="text-sm text-gray-600">
                Status: <span className="capitalize font-medium">{subscriptionStatus}</span>
              </p>
              <div className="flex items-center space-x-4 mt-1">
                {subscriptionInfo.features.map((feature, index) => (
                  <span key={index} className="text-xs text-gray-500">• {feature}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{subscriptionInfo.upgradeMessage}</p>
            {subscriptionPlan === 'free' && (
              <button
                onClick={() => handleNavigation('/app/billing')}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Templates Section for First-time Users */}
      {(dashboardData?.summary?.total_surveys || 0) === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Welcome to SurveyGuy! 🎉</h3>
                <p className="text-gray-600">Get started quickly with our pre-built survey templates</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">Customer Satisfaction</h4>
                </div>
                <p className="text-sm text-gray-600">Measure customer satisfaction with your products or services</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">Employee Feedback</h4>
                </div>
                <p className="text-sm text-gray-600">Gather feedback from your team members</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">Product Feedback</h4>
                </div>
                <p className="text-sm text-gray-600">Collect feedback about your products or services</p>
              </div>
            </div>
            <div className="flex space-x-3">
            <button
              onClick={() => handleNavigation('/app/templates')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Templates
            </button>
            <button
              onClick={() => handleNavigation('/app/builder')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Survey
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity & Top Surveys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {dashboardData?.recent_activity?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_activity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.survey_title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.new_responses} new responses
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleNavigation(`/app/analytics/${activity.survey_id}`)}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Top Performing Surveys */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Surveys</h3>
          </div>
          <div className="p-6">
            {dashboardData?.top_surveys?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.top_surveys.map((survey, index) => (
                  <div key={survey.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {survey.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {survey.respondent_count} respondents
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleNavigation(`/app/analytics/${survey.id}`)}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => handleNavigation(`/app/builder/${survey.id}`)}
                        className="text-gray-600 hover:text-gray-500 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No surveys yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleNavigation('/app/builder')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left w-full"
            >
              <Plus className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Create New Survey</p>
                <p className="text-sm text-gray-500">Start building your survey</p>
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('/app/templates')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left w-full"
            >
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Use Template</p>
                <p className="text-sm text-gray-500">Start with a template</p>
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('/app/analytics')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left w-full"
            >
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Check your survey results</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 