import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Eye,
  Download,
  Share,
  Copy,
  Plus,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Shield,
  Globe,
  Mail,
  CreditCard
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const AdvancedDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('responses');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analytics/dashboard?range=${selectedTimeRange}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      // Set default data structure
      setDashboardData({
        overview: {
          totalSurveys: 0,
          totalResponses: 0,
          totalQuestions: 0,
          averageCompletionRate: 0,
          totalRevenue: 0,
          activeSubscriptions: 0
        },
        trends: [],
        topSurveys: [],
        recentActivity: [],
        performanceMetrics: {
          responseGrowth: 0,
          completionRateChange: 0,
          revenueGrowth: 0,
          userGrowth: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return <ArrowUp className="h-4 w-4" />;
    if (value < 0) return <ArrowDown className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading advanced dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Advanced Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights and analytics overview</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Link to="/builder" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Survey
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`flex items-center space-x-1 ${getGrowthColor(dashboardData?.performanceMetrics?.responseGrowth || 0)}`}>
                {getGrowthIcon(dashboardData?.performanceMetrics?.responseGrowth || 0)}
                <span className="text-sm font-medium">
                  {Math.abs(dashboardData?.performanceMetrics?.responseGrowth || 0)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(dashboardData?.overview?.totalSurveys || 0)}
            </h3>
            <p className="text-gray-600">Total Surveys</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className={`flex items-center space-x-1 ${getGrowthColor(dashboardData?.performanceMetrics?.userGrowth || 0)}`}>
                {getGrowthIcon(dashboardData?.performanceMetrics?.userGrowth || 0)}
                <span className="text-sm font-medium">
                  {Math.abs(dashboardData?.performanceMetrics?.userGrowth || 0)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(dashboardData?.overview?.totalResponses || 0)}
            </h3>
            <p className="text-gray-600">Total Responses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className={`flex items-center space-x-1 ${getGrowthColor(dashboardData?.performanceMetrics?.completionRateChange || 0)}`}>
                {getGrowthIcon(dashboardData?.performanceMetrics?.completionRateChange || 0)}
                <span className="text-sm font-medium">
                  {Math.abs(dashboardData?.performanceMetrics?.completionRateChange || 0)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {(dashboardData?.overview?.averageCompletionRate || 0).toFixed(1)}%
            </h3>
            <p className="text-gray-600">Avg Completion Rate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div className={`flex items-center space-x-1 ${getGrowthColor(dashboardData?.performanceMetrics?.revenueGrowth || 0)}`}>
                {getGrowthIcon(dashboardData?.performanceMetrics?.revenueGrowth || 0)}
                <span className="text-sm font-medium">
                  {Math.abs(dashboardData?.performanceMetrics?.revenueGrowth || 0)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(dashboardData?.overview?.totalRevenue || 0)}
            </h3>
            <p className="text-gray-600">Total Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Mail className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(dashboardData?.overview?.activeSubscriptions || 0)}
            </h3>
            <p className="text-gray-600">Active Subscriptions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <Zap className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(dashboardData?.overview?.totalQuestions || 0)}
            </h3>
            <p className="text-gray-600">Total Questions</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Response Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Response Trends</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="responses">Responses</option>
                <option value="completion">Completion Rate</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.trends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Survey Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Survey Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.topSurveys || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responses" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {dashboardData?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/builder" className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Create New Survey</span>
              </Link>
              <Link to="/analytics" className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">View Analytics</span>
              </Link>
              <Link to="/billing" className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Manage Billing</span>
              </Link>
              <Link to="/subscriptions" className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Mail className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">View Subscriptions</span>
              </Link>
            </div>
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Response Growth</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +{dashboardData?.performanceMetrics?.responseGrowth || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  +{dashboardData?.performanceMetrics?.completionRateChange || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Revenue Growth</span>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  +{dashboardData?.performanceMetrics?.revenueGrowth || 0}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard; 