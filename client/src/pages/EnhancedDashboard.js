import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  Eye,
  Edit,
  Share2,
  Download,
  Filter,
  Search,
  Bell,
  Settings,
  Zap,
  Target,
  Award,
  Clock,
  Star
} from 'lucide-react';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [quickActions, setQuickActions] = useState([]);

  // Mock data for enhanced dashboard
  const mockDashboardData = {
    stats: {
      totalSurveys: 24,
      activeSurveys: 8,
      totalResponses: 1247,
      responseRate: 68.5,
      avgCompletionTime: '4.2 min',
      satisfactionScore: 4.7
    },
    recentActivity: [
      {
        id: 1,
        type: 'survey_created',
        title: 'Customer Satisfaction Survey',
        time: '2 hours ago',
        status: 'active'
      },
      {
        id: 2,
        type: 'response_received',
        title: 'Employee Feedback Form',
        count: 15,
        time: '4 hours ago'
      },
      {
        id: 3,
        type: 'survey_published',
        title: 'Product Research Survey',
        time: '1 day ago',
        status: 'published'
      }
    ],
    topSurveys: [
      {
        id: 1,
        title: 'Customer Satisfaction Survey',
        responses: 342,
        completionRate: 78,
        avgRating: 4.8,
        status: 'active',
        trend: 'up'
      },
      {
        id: 2,
        title: 'Employee Feedback Form',
        responses: 189,
        completionRate: 65,
        avgRating: 4.5,
        status: 'active',
        trend: 'up'
      },
      {
        id: 3,
        title: 'Product Research Survey',
        responses: 156,
        completionRate: 82,
        avgRating: 4.6,
        status: 'published',
        trend: 'stable'
      }
    ],
    insights: [
      {
        id: 1,
        title: 'High Response Rate Trend',
        description: 'Your surveys have seen a 23% increase in response rates this week',
        type: 'positive',
        icon: TrendingUp
      },
      {
        id: 2,
        title: 'Quick Completion Times',
        description: 'Average completion time is 15% faster than industry average',
        type: 'positive',
        icon: Zap
      },
      {
        id: 3,
        title: 'Template Optimization',
        description: 'Consider using shorter forms for better completion rates',
        type: 'suggestion',
        icon: Target
      }
    ]
  };

  const timeRanges = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  const mockQuickActions = [
    {
      id: 1,
      title: 'Create Survey',
      description: 'Start building a new survey',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => console.log('Create survey')
    },
    {
      id: 2,
      title: 'Use Template',
      description: 'Choose from pre-built templates',
      icon: Star,
      color: 'bg-green-500',
      action: () => console.log('Use template')
    },
    {
      id: 3,
      title: 'Import Data',
      description: 'Import responses from CSV',
      icon: Download,
      color: 'bg-purple-500',
      action: () => console.log('Import data')
    },
    {
      id: 4,
      title: 'View Analytics',
      description: 'Deep dive into your data',
      icon: BarChart3,
      color: 'bg-orange-500',
      action: () => console.log('View analytics')
    }
  ];

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setQuickActions(mockQuickActions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleQuickAction = (action) => {
    action.action();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load dashboard</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your surveys today
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="h-4 w-4 mr-2 inline" />
              Notifications
            </button>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4 mr-2 inline" />
              Settings
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <div 
              key={action.id} 
              className="bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleQuickAction(action)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalSurveys}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.activeSurveys}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalResponses.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.responseRate}%</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
            <div className="p-6 pb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </h3>
            </div>
            <div className="px-6 pt-0 pb-6">
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {activity.type === 'survey_created' && <Plus className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'response_received' && <Users className="h-4 w-4 text-green-600" />}
                      {activity.type === 'survey_published' && <Share2 className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                    {activity.status && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 pb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Insights
              </h3>
            </div>
            <div className="px-6 pt-0 pb-6">
              <div className="space-y-4">
                {dashboardData.insights.map((insight) => (
                  <div key={insight.id} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        insight.type === 'positive' ? 'bg-green-100' : 
                        insight.type === 'suggestion' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <insight.icon className={`h-4 w-4 ${
                          insight.type === 'positive' ? 'text-green-600' : 
                          insight.type === 'suggestion' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{insight.title}</p>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Surveys */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Surveys
            </h3>
          </div>
          <div className="px-6 pt-0 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Survey</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Responses</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Completion Rate</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topSurveys.map((survey) => (
                    <tr key={survey.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{survey.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {getTrendIcon(survey.trend)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{survey.responses}</td>
                      <td className="py-4 px-4 text-gray-600">{survey.completionRate}%</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-gray-600">{survey.avgRating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                          {survey.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
