import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Globe,
  Lock,
  Eye,
  Edit,
  Share2,
  BarChart3,
  Copy,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  CheckCircle,
  Archive,
  Grid,
  List,
  ExternalLink,
  Crown
} from 'lucide-react';

const SurveyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('draft'); // all, draft, published, archived - default to draft for /app/surveys
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchAllSurveys = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.surveys.getSurveys(user.id);
      if (response.error) {
        console.error('API Error:', response.error);
        // Fallback to mock data for testing
        const mockSurveys = [
          {
            id: '1',
            title: 'Customer Satisfaction Survey',
            description: 'Help us improve our service',
            status: 'draft',
            category: 'customer-satisfaction',
            questions: [
              { id: 'q1', title: 'How satisfied are you with our service?', type: 'rating' },
              { id: 'q2', title: 'What can we improve?', type: 'text' }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            responseCount: 0
          },
          {
            id: '2',
            title: 'Employee Feedback Form',
            description: 'Annual employee satisfaction survey',
            status: 'published',
            category: 'employee-feedback',
            questions: [
              { id: 'q1', title: 'Rate your work environment', type: 'rating' },
              { id: 'q2', title: 'Suggestions for improvement', type: 'textarea' }
            ],
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            published_at: new Date(Date.now() - 3600000).toISOString(),
            responseCount: 15
          },
          {
            id: '3',
            title: 'Product Feedback',
            description: 'Tell us about your experience with our product',
            status: 'draft',
            category: 'general',
            questions: [
              { id: 'q1', title: 'Which features do you use most?', type: 'multiple_choice' }
            ],
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 7200000).toISOString(),
            responseCount: 0
          }
        ];
        setSurveys(mockSurveys);
        toast('Using demo data - API connection failed', { icon: 'ℹ️' });
      } else {
        setSurveys(response.surveys || []);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to mock data
      const mockSurveys = [
        {
          id: '1',
          title: 'Customer Satisfaction Survey',
          description: 'Help us improve our service',
          status: 'draft',
          category: 'customer-satisfaction',
          questions: [
            { id: 'q1', title: 'How satisfied are you with our service?', type: 'rating' },
            { id: 'q2', title: 'What can we improve?', type: 'text' }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          responseCount: 0
        },
        {
          id: '2',
          title: 'Employee Feedback Form',
          description: 'Annual employee satisfaction survey',
          status: 'published',
          category: 'employee-feedback',
          questions: [
            { id: 'q1', title: 'Rate your work environment', type: 'rating' },
            { id: 'q2', title: 'Suggestions for improvement', type: 'textarea' }
          ],
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          published_at: new Date(Date.now() - 3600000).toISOString(),
          responseCount: 15
        }
      ];
      setSurveys(mockSurveys);
      toast('Using demo data - Connection failed', { icon: 'ℹ️' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllSurveys();
  }, [fetchAllSurveys]);

  const handleEditSurvey = (surveyId) => {
    navigate(`/app/builder/${surveyId}`);
  };

  const handlePreviewSurvey = (surveyId) => {
    navigate(`/app/preview/${surveyId}`);
  };

  // const handleViewAnalytics = (surveyId) => {
  //   navigate(`/app/analytics/${surveyId}`);
  // };

  const handleDuplicateSurvey = async (survey) => {
    try {
      const response = await api.surveys.duplicateSurvey(survey.id, user.id);
      if (response.error) {
        toast.error('Failed to duplicate survey');
      } else {
        toast.success('Survey duplicated successfully');
        fetchAllSurveys();
      }
    } catch (error) {
      toast.error('Failed to duplicate survey');
      console.error('Error:', error);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) return;
    
    try {
      const response = await api.surveys.deleteSurvey(surveyId);
      if (response.error) {
        throw new Error(response.error);
      }
      
      setSurveys(surveys.filter(s => s.id !== surveyId));
      toast.success('Survey deleted successfully');
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast.error('Failed to delete survey');
    }
  };

  const handlePublishSurvey = async (survey) => {
    if (!survey.title?.trim()) {
      toast.error('Please add a title before publishing');
      return;
    }
    
    if (!survey.questions || survey.questions.length === 0) {
      toast.error('Please add at least one question before publishing');
      return;
    }

    try {
      const response = await api.surveys.publishSurvey(survey.id);
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast.success('Survey published successfully!', {
        duration: 4000,
        action: {
          label: 'View Published',
          onClick: () => navigate('/app/published-surveys')
        }
      });
      fetchAllSurveys();
    } catch (error) {
      console.error('Error publishing survey:', error);
      toast.error('Failed to publish survey');
    }
  };

  const handleUnpublishSurvey = async (surveyId) => {
    try {
      const response = await api.surveys.unpublishSurvey(surveyId);
      if (response.error) {
        toast.error('Failed to unpublish survey');
      } else {
        toast.success('Survey unpublished successfully');
        fetchAllSurveys();
      }
    } catch (error) {
      toast.error('Failed to unpublish survey');
      console.error('Error:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedSurveys.length === 0) {
      toast.error('Please select surveys first');
      return;
    }

    const confirmMessage = {
      publish: 'Are you sure you want to publish the selected surveys?',
      unpublish: 'Are you sure you want to unpublish the selected surveys?',
      delete: 'Are you sure you want to delete the selected surveys? This action cannot be undone.',
      duplicate: 'Duplicate the selected surveys?'
    };

    if (!window.confirm(confirmMessage[action])) return;

    try {
      const promises = selectedSurveys.map(surveyId => {
        // const survey = surveys.find(s => s.id === surveyId);
        switch (action) {
          case 'publish':
            return api.surveys.publishSurvey(surveyId);
          case 'unpublish':
            return api.surveys.unpublishSurvey(surveyId);
          case 'delete':
            return api.surveys.deleteSurvey(surveyId);
          case 'duplicate':
            return api.surveys.duplicateSurvey(surveyId, user.id);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      toast.success(`Successfully ${action}ed ${selectedSurveys.length} survey(s)`);
      setSelectedSurveys([]);
      setShowBulkActions(false);
      fetchAllSurveys();
    } catch (error) {
      toast.error(`Failed to ${action} surveys`);
      console.error('Error:', error);
    }
  };

  const toggleSurveySelection = (surveyId) => {
    setSelectedSurveys(prev => {
      const newSelection = prev.includes(surveyId)
        ? prev.filter(id => id !== surveyId)
        : [...prev, surveyId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const filteredSurveys = surveys
    .filter(survey => {
      // Status filter
      if (statusFilter !== 'all' && survey.status !== statusFilter) return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!survey.title?.toLowerCase().includes(searchLower) &&
            !survey.description?.toLowerCase().includes(searchLower)) return false;
      }
      
      // Category filter
      if (categoryFilter !== 'all' && survey.category !== categoryFilter) return false;
      
      // Date range filter
      if (dateRange !== 'all') {
        const now = new Date();
        const surveyDate = new Date(survey.created_at);
        const daysDiff = (now - surveyDate) / (1000 * 60 * 60 * 24);
        
        switch (dateRange) {
          case 'today':
            return daysDiff < 1;
          case 'week':
            return daysDiff < 7;
          case 'month':
            return daysDiff < 30;
          case 'year':
            return daysDiff < 365;
          default:
            return true;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <Globe className="w-4 h-4 text-green-600" />;
      case 'draft':
        return <Lock className="w-4 h-4 text-gray-400" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-gray-100 text-gray-600'
    };
    
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getSurveyStats = (survey) => {
    const stats = {
      questions: survey.questions?.length || 0,
      responses: survey.responseCount || 0,
      completionRate: survey.completion_rate || 0,
      avgTime: survey.avg_completion_time || 0
    };
    
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading surveys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {statusFilter === 'draft' ? 'Draft Surveys' : 
                   statusFilter === 'published' ? 'Published Surveys' :
                   statusFilter === 'archived' ? 'Archived Surveys' : 
                   'Survey Dashboard'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {statusFilter === 'draft' ? 'Create and edit your survey drafts' :
                   statusFilter === 'published' ? 'Manage your live surveys' :
                   statusFilter === 'archived' ? 'View archived surveys' :
                   'Manage all your surveys in one place'}
                </p>
                <div className="mt-3 flex space-x-4">
                  {statusFilter !== 'published' && (
                    <Link
                      to="/app/published-surveys"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      <span>View Published Surveys</span>
                    </Link>
                  )}
                  {statusFilter !== 'draft' && (
                    <Link
                      to="/app/surveys"
                      className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Draft Surveys</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{surveys.length}</div>
                <div className="text-sm text-gray-600">
                  {statusFilter === 'draft' ? 'Draft Surveys' :
                   statusFilter === 'published' ? 'Published Surveys' :
                   statusFilter === 'archived' ? 'Archived Surveys' :
                   'Total Surveys'}
                </div>
              </div>
              {statusFilter === 'all' && (
                <>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                      {surveys.filter(s => s.status === 'published').length}
                    </div>
                    <div className="text-sm text-gray-600">Published</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">
                      {surveys.filter(s => s.status === 'draft').length}
                    </div>
                    <div className="text-sm text-gray-600">Drafts</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {surveys.reduce((sum, s) => sum + (s.responseCount || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Responses</div>
                  </div>
                </>
              )}
              {statusFilter !== 'all' && (
                <>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                      {surveys.filter(s => s.status === 'published').length}
                    </div>
                    <div className="text-sm text-gray-600">Published</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">
                      {surveys.filter(s => s.status === 'draft').length}
                    </div>
                    <div className="text-sm text-gray-600">Drafts</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {surveys.reduce((sum, s) => sum + (s.responseCount || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Responses</div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/app/builder/new"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Survey</span>
            </Link>
            
            <Link
              to="/app/enterprise/advanced-builder"
              className="flex items-center space-x-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Crown className="w-4 h-4" />
              <span>Advanced Builder</span>
            </Link>
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search surveys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              
              {/* Filters */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="updated_at-desc">Recently Updated</option>
                  <option value="created_at-desc">Recently Created</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="status-asc">Status</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <span className="text-sm text-gray-600">
                {filteredSurveys.length} survey{filteredSurveys.length !== 1 ? 's' : ''}
              </span>
              
              <button
                onClick={fetchAllSurveys}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="general">General</option>
                      <option value="customer-satisfaction">Customer Satisfaction</option>
                      <option value="employee-feedback">Employee Feedback</option>
                      <option value="market-research">Market Research</option>
                      <option value="event-feedback">Event Feedback</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {showBulkActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {selectedSurveys.length} survey{selectedSurveys.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleBulkAction('publish')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Publish</span>
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('unpublish')}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Unpublish</span>
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('duplicate')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedSurveys([]);
                      setShowBulkActions(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Surveys Display */}
        {filteredSurveys.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Surveys Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || dateRange !== 'all'
                ? `No surveys match your current filters`
                : "You don't have any surveys yet. Create your first survey to get started!"
              }
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/app/builder/new"
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Survey</span>
              </Link>
              
              <Link
                to="/app/enterprise/advanced-builder"
                className="flex items-center space-x-2 px-6 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span>Advanced Builder</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredSurveys.map((survey, index) => {
              const stats = getSurveyStats(survey);
              return (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Survey Card Content */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedSurveys.includes(survey.id)}
                            onChange={() => toggleSurveySelection(survey.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(survey.status)}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(survey.status)}`}>
                              {survey.status}
                            </span>
                            {survey.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {survey.category.replace('-', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {survey.title || 'Untitled Survey'}
                        </h3>
                        
                        {survey.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {survey.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {stats.questions}
                        </div>
                        <div className="text-xs text-gray-600">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {stats.responses}
                        </div>
                        <div className="text-xs text-gray-600">Responses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {stats.completionRate}%
                        </div>
                        <div className="text-xs text-gray-600">Complete</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {stats.avgTime}m
                        </div>
                        <div className="text-xs text-gray-600">Avg Time</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      {/* Primary Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSurvey(survey.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex-1 justify-center"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        
                        <button
                          onClick={() => handlePreviewSurvey(survey.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm flex-1 justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Preview</span>
                        </button>
                      </div>
                      
                      {/* Status-specific Actions */}
                      <div className="flex items-center space-x-2">
                        {survey.status === 'draft' ? (
                          <button
                            onClick={() => handlePublishSurvey(survey)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Publish</span>
                          </button>
                        ) : survey.status === 'published' ? (
                          <div className="flex items-center space-x-2 w-full">
                            <a
                              href={`/survey/${survey.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm flex-1 justify-center"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>View Live</span>
                            </a>
                            <button
                              onClick={() => handleUnpublishSurvey(survey.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm flex-1 justify-center"
                            >
                              <Archive className="w-4 h-4" />
                              <span>Unpublish</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                      
                      {/* Secondary Actions */}
                      <div className="flex items-center justify-center space-x-1">
                        <Link
                          to={`/app/analytics/${survey.id}`}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDuplicateSurvey(survey)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSurvey(survey.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Updated: {formatDate(survey.updated_at)}</span>
                        </div>
                        {survey.published_at && (
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4" />
                            <span>Published: {formatDate(survey.published_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyDashboard;
