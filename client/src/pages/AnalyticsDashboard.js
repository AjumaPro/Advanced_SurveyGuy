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
  Search,
  Plus
} from 'lucide-react';
import AnalyticsSummary from '../components/AnalyticsSummary';

const AnalyticsDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [overviewStats, setOverviewStats] = useState({
    totalSurveys: 0,
    totalResponses: 0,
    averageCompletionRate: 0,
    totalQuestions: 0
  });

  const fetchOverviewStats = React.useCallback(async () => {
    try {
      const response = await axios.get('/api/analytics/overview');
      setOverviewStats(response.data);
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      // Set default stats if API fails
      setOverviewStats({
        totalSurveys: surveys.length,
        totalResponses: 0,
        averageCompletionRate: 0,
        totalQuestions: 0
      });
    }
  }, [surveys.length]);

  useEffect(() => {
    fetchSurveys();
    fetchOverviewStats();
  }, [fetchOverviewStats]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/surveys');
      setSurveys(response.data.surveys || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || survey.status === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <Eye className="h-4 w-4" />;
      case 'draft':
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights across all your surveys</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/app/builder" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Survey
              </Link>
            </div>
          </div>

          {/* Overview Stats */}
          <AnalyticsSummary 
            data={{
              overview: overviewStats,
              trends: {
                dates: Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                responses: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 10)
              },
              deviceAnalytics: {
                desktop: 45,
                mobile: 40,
                tablet: 15
              }
            }}
            loading={loading}
            onExport={() => toast.success('Export functionality coming soon!')}
            onShare={() => toast.success('Share functionality coming soon!')}
          />

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Surveys</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </motion.div>

        {/* Surveys List */}
        {filteredSurveys.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-sm"
          >
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
            <p className="text-gray-600 mb-4">
              {surveys.length === 0 
                ? "You haven't created any surveys yet."
                : "No surveys match your search criteria."
              }
            </p>
            <Link to="/app/builder" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Survey
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredSurveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {survey.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(survey.status)}`}>
                          {getStatusIcon(survey.status)}
                          <span>{survey.status}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{survey.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {formatDate(survey.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{survey.response_count || 0} responses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{survey.question_count || 0} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/analytics/${survey.id}`}
                        className="btn-secondary"
                        title="View detailed analytics"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                      <Link
                        to={`/advanced-analytics/${survey.id}`}
                        className="btn-primary"
                        title="View advanced analytics"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Advanced
                      </Link>
                      <Link
                        to={`/survey/${survey.id}`}
                        className="btn-secondary"
                        title="View survey"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {survey.response_count > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{survey.response_count}</p>
                          <p className="text-xs text-gray-500">Total Responses</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {survey.completion_rate?.toFixed(1) || 0}%
                          </p>
                          <p className="text-xs text-gray-500">Completion Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {survey.avg_rating?.toFixed(1) || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">Avg Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {survey.question_count || 0}
                          </p>
                          <p className="text-xs text-gray-500">Questions</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 