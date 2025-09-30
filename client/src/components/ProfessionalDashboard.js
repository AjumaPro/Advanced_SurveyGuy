import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';
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
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Target,
  Zap
} from 'lucide-react';

const ProfessionalDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { markLoadComplete } = usePerformanceMonitor('Dashboard');
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = React.useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await api.analytics.getDashboardData(user.id);
      if (response.error) {
        console.error('Dashboard API error:', response.error);
        // Set fallback data
        setDashboardData({
          overview: {
            totalSurveys: 0,
            totalResponses: 0,
            totalQuestions: 0,
            averageCompletionRate: 0
          },
          trends: [],
          topSurveys: [],
          recentActivity: []
        });
      } else {
        setDashboardData(response);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set fallback data
      setDashboardData({
        overview: {
          totalSurveys: 0,
          totalResponses: 0,
          totalQuestions: 0,
          averageCompletionRate: 0
        },
        trends: [],
        topSurveys: [],
        recentActivity: []
      });
    } finally {
      setLoading(false);
      markLoadComplete();
    }
  }, [user, markLoadComplete]);

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <BarChart3 size={32} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600">Preparing your survey insights...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Surveys',
      value: dashboardData?.overview?.totalSurveys || 0,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Responses',
      value: dashboardData?.overview?.totalResponses || 0,
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Questions Created',
      value: dashboardData?.overview?.totalQuestions || 0,
      change: '+8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: 'Completion Rate',
      value: `${dashboardData?.overview?.averageCompletionRate || 0}%`,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      name: 'Create Survey',
      description: 'Start building your next survey',
      icon: Plus,
      color: 'from-blue-500 to-purple-600',
      onClick: () => handleNavigation('/app/builder')
    },
    {
      name: 'View Reports',
      description: 'Comprehensive survey analytics',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-600',
      onClick: () => handleNavigation('/app/reports')
    },
    {
      name: 'View Analytics',
      description: 'Analyze your survey data',
      icon: BarChart3,
      color: 'from-green-500 to-teal-600',
      onClick: () => handleNavigation('/app/analytics')
    },
    {
      name: 'Manage Events',
      description: 'Create and manage events',
      icon: Calendar,
      color: 'from-orange-500 to-red-600',
      onClick: () => handleNavigation('/app/events')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Ready to create amazing surveys? Here's what's happening with your account.
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm`}>
                  {userProfile?.plan || 'Free'} Plan
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                  {userProfile?.role || 'User'}
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 size={64} className="text-white/80" />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon size={24} className={stat.textColor} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.name}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Jump into your most common tasks</p>
          </div>
          <Zap size={24} className="text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.name}
                onClick={action.onClick}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-200 text-left border border-gray-200 hover:border-gray-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 transition-transform duration-200`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.name}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity & Top Surveys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-gray-600 text-sm">Your latest survey actions</p>
            </div>
            <Activity size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData?.recentActivity?.length > 0 ? (
              dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.activity || activity}</p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Start creating surveys to see activity here</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Performing Surveys */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Surveys</h3>
              <p className="text-gray-600 text-sm">Your best performing surveys</p>
            </div>
            <Target size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData?.topSurveys?.length > 0 ? (
              dashboardData.topSurveys.slice(0, 5).map((survey, index) => (
                <div key={survey.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                     onClick={() => handleNavigation(`/app/analytics/${survey.id}`)}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{survey.title || 'Untitled Survey'}</p>
                      <p className="text-xs text-gray-500">{survey.responseCount || 0} responses</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-600">
                      {Math.round(Math.random() * 30 + 70)}%
                    </span>
                    <Eye size={16} className="text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No surveys yet</p>
                <button
                  onClick={() => handleNavigation('/app/builder')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first survey
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upgrade Banner (for free users) */}
      {(!userProfile?.plan || userProfile?.plan === 'free') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
                <p className="text-purple-100 mb-4">
                  Get unlimited surveys, advanced analytics, and premium templates
                </p>
                <button
                  onClick={() => handleNavigation('/app/subscriptions')}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
              <Crown size={48} className="text-white/60" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
