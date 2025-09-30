import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit,
  Eye,
  Trash2,
  Copy,
  Share2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  FileText,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Users,
  Settings,
  ExternalLink,
  Archive
} from 'lucide-react';

const DraftSurveys = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const fetchDraftSurveys = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.surveys.getSurveysByStatus(user.id, 'draft');
      if (response.error) {
        toast.error('Failed to load draft surveys');
        console.error('Error:', response.error);
      } else {
        setSurveys(response.surveys || []);
      }
    } catch (error) {
      toast.error('Failed to load draft surveys');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDraftSurveys();
  }, [user, fetchDraftSurveys]);

  const handleEditSurvey = (surveyId) => {
    navigate(`/app/builder/${surveyId}`);
  };

  const handlePreviewSurvey = (surveyId) => {
    navigate(`/app/preview/${surveyId}`);
  };

  const handlePublishSurvey = async (survey) => {
    // Validation before publishing
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
      
      toast.success('Survey published successfully!');
      fetchDraftSurveys(); // Refresh the list
    } catch (error) {
      console.error('Error publishing survey:', error);
      toast.error('Failed to publish survey');
    }
  };

  const handleDuplicateSurvey = async (survey) => {
    try {
      const response = await api.surveys.duplicateSurvey(survey.id, user.id);
      if (response.error) {
        toast.error('Failed to duplicate survey');
      } else {
        toast.success('Survey duplicated successfully');
        fetchDraftSurveys(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to duplicate survey');
      console.error('Error:', error);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this draft survey?')) return;
    
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

  const handleBulkAction = async (action) => {
    if (selectedSurveys.length === 0) {
      toast.error('Please select surveys first');
      return;
    }

    const confirmMessage = {
      publish: 'Are you sure you want to publish the selected surveys?',
      delete: 'Are you sure you want to delete the selected surveys? This action cannot be undone.',
      duplicate: 'Duplicate the selected surveys?'
    };

    if (!window.confirm(confirmMessage[action])) return;

    try {
      const promises = selectedSurveys.map(surveyId => {
        const survey = surveys.find(s => s.id === surveyId);
        switch (action) {
          case 'publish':
            return api.surveys.publishSurvey(surveyId);
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
      fetchDraftSurveys();
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
    .filter(survey => 
      survey.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canPublish = (survey) => {
    return survey.title?.trim() && survey.questions?.length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading draft surveys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Draft Surveys</h1>
                <p className="text-gray-600 mt-1">Work-in-progress surveys ready for editing and publishing</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/app/published-surveys"
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Published Surveys</span>
            </Link>
            
            <Link
              to="/app/builder/new"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Survey</span>
            </Link>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search draft surveys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              
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
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {filteredSurveys.length} draft survey{filteredSurveys.length !== 1 ? 's' : ''}
              </span>
              
              <button
                onClick={fetchDraftSurveys}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
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

        {/* Surveys Grid */}
        {filteredSurveys.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Draft Surveys</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No draft surveys match "${searchTerm}"`
                : "You don't have any draft surveys yet. Create your first survey to get started!"
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
                to="/app/reports"
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Reports</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200"
              >
                {/* Survey Card Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedSurveys.includes(survey.id)}
                          onChange={() => toggleSurveySelection(survey.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Draft
                          </span>
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
                </div>

                {/* Survey Stats */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {survey.questions?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.ceil((survey.questions?.length || 0) * 0.5)}
                      </div>
                      <div className="text-xs text-gray-600">Est. Min</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${canPublish(survey) ? 'text-green-600' : 'text-red-600'}`}>
                        {canPublish(survey) ? 'Ready' : 'Incomplete'}
                      </div>
                      <div className="text-xs text-gray-600">Status</div>
                    </div>
                  </div>
                </div>

                {/* Survey Actions */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Updated: {formatDate(survey.updated_at)}</span>
                    </div>
                  </div>
                  
                  {/* Primary Actions */}
                  <div className="flex items-center space-x-2 mb-3">
                    <button
                      onClick={() => handleEditSurvey(survey.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex-1 justify-center"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Survey</span>
                    </button>
                    
                    <button
                      onClick={() => handlePreviewSurvey(survey.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm flex-1 justify-center"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                  
                  {/* Publish Button */}
                  <button
                    onClick={() => handlePublishSurvey(survey)}
                    disabled={!canPublish(survey)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>
                      {canPublish(survey) ? 'Publish Survey' : 'Complete Survey to Publish'}
                    </span>
                  </button>
                  
                  {/* Secondary Actions */}
                  <div className="flex items-center justify-center space-x-1">
                    <Link
                      to={`/app/analytics/${survey.id}`}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
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
                  
                  {/* Survey Completion Status */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm">
                      {canPublish(survey) ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-medium">Ready to publish</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span className="text-amber-700 font-medium">
                            {!survey.title ? 'Add title' : 'Add questions'} to publish
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftSurveys;
