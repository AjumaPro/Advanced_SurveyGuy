import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import SurveyShareModal from '../components/SurveyShareModal';
import SimpleSurveyShare from '../components/SimpleSurveyShare';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { getSurveyUrl } from '../utils/urlUtils';
import {
  Edit,
  Share2,
  BarChart3,
  Calendar,
  ExternalLink,
  Copy,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Globe,
  CheckCircle,
  FileText,
  Archive,
  QrCode
} from 'lucide-react';

const PublishedSurveys = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSurveyForShare, setSelectedSurveyForShare] = useState(null);
  const [useSimpleModal, setUseSimpleModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPublishedSurveys = useCallback(async (showRefreshToast = false) => {
    if (!user) return;
    
    if (showRefreshToast) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await api.surveys.getSurveysByStatus(user.id, 'published');
      if (response.error) {
        toast.error('Failed to load published surveys');
        console.error('Error:', response.error);
      } else {
        setSurveys(response.surveys || []);
        if (showRefreshToast) {
          toast.success('Survey data refreshed successfully');
        }
      }
    } catch (error) {
      toast.error('Failed to load published surveys');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPublishedSurveys();
  }, [fetchPublishedSurveys]);

  const handleUnpublish = async (surveyId) => {
    try {
      const response = await api.surveys.unpublishSurvey(surveyId);
      if (response.error) {
        toast.error('Failed to unpublish survey');
      } else {
        toast.success('Survey unpublished successfully');
        fetchPublishedSurveys(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to unpublish survey');
      console.error('Error:', error);
    }
  };

  const handleDuplicate = async (survey) => {
    try {
      const response = await api.surveys.duplicateSurvey(survey.id, user.id);
      if (response.error) {
        toast.error('Failed to duplicate survey');
      } else {
        toast.success('Survey duplicated successfully');
        navigate(`/app/builder/${response.survey.id}`);
      }
    } catch (error) {
      toast.error('Failed to duplicate survey');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this published survey? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.surveys.deleteSurvey(surveyId);
      if (response.error) {
        toast.error('Failed to delete survey');
      } else {
        toast.success('Survey deleted successfully');
        fetchPublishedSurveys(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to delete survey');
      console.error('Error:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedSurveys.length === 0) {
      toast.error('Please select surveys first');
      return;
    }

    const confirmMessage = {
      unpublish: 'Are you sure you want to unpublish the selected surveys?',
      delete: 'Are you sure you want to delete the selected surveys? This action cannot be undone.',
    };

    if (!window.confirm(confirmMessage[action])) return;

    try {
      const promises = selectedSurveys.map(surveyId => {
        switch (action) {
          case 'unpublish':
            return api.surveys.unpublishSurvey(surveyId);
          case 'delete':
            return api.surveys.deleteSurvey(surveyId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      toast.success(`Successfully ${action}ed ${selectedSurveys.length} survey(s)`);
      setSelectedSurveys([]);
      setShowBulkActions(false);
      fetchPublishedSurveys();
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
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSurveyUrlLocal = (surveyId) => {
    return getSurveyUrl(surveyId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Survey URL copied to clipboard!');
  };

  const handleShareSurvey = (survey) => {
    try {
      setSelectedSurveyForShare(survey);
      setShareModalOpen(true);
      setUseSimpleModal(false); // Try advanced modal first
    } catch (error) {
      console.error('Error opening share modal:', error);
      // Fallback to simple modal
      setSelectedSurveyForShare(survey);
      setShareModalOpen(true);
      setUseSimpleModal(true);
    }
  };

  const downloadQRCode = (survey) => {
    // This is a simplified version - the actual QR generation happens in the modal
    const surveyUrl = getSurveyUrlLocal(survey.id);
    
    // For now, just copy the URL and show instructions
    copyToClipboard(surveyUrl);
    toast.success('Open the share modal to download QR code!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading published surveys...</p>
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
              <Globe className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Published Surveys</h1>
                <p className="text-gray-600 mt-1">Manage your live surveys and track performance</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/app/surveys"
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>All Surveys</span>
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
                  placeholder="Search published surveys..."
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
                <option value="published_at-desc">Recently Published</option>
                <option value="responseCount-desc">Most Responses</option>
                <option value="responseCount-asc">Least Responses</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {filteredSurveys.length} published survey{filteredSurveys.length !== 1 ? 's' : ''}
                {filteredSurveys.length > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {filteredSurveys.reduce((total, survey) => total + (survey.responseCount || 0), 0)} total responses
                  </span>
                )}
              </span>
              
              <button
                onClick={() => fetchPublishedSurveys(true)}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
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
                    onClick={() => handleBulkAction('unpublish')}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Unpublish</span>
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
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Published Surveys</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No published surveys match "${searchTerm}"`
                : "You haven't published any surveys yet. Create and publish your first survey to get started!"
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
                to="/app/surveys"
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>View Draft Surveys</span>
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
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                          {(survey.responseCount || 0) > 50 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Popular
                            </span>
                          )}
                          {(survey.responseCount || 0) > 100 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Trending
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
                </div>

                {/* Survey Stats */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${
                        (survey.responseCount || 0) > 50 ? 'text-green-600' : 
                        (survey.responseCount || 0) > 10 ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {survey.responseCount || 0}
                      </div>
                      <div className="text-xs text-gray-600">Responses</div>
                      {(survey.responseCount || 0) > 50 && (
                        <div className="text-xs text-green-600 font-medium">Popular!</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {survey.questions?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        Live
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
                      <span>Published: {formatDate(survey.published_at)}</span>
                    </div>
                  </div>
                  
                  {/* QR Code Preview */}
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <QRCode
                        value={getSurveyUrlLocal(survey.id)}
                        size={80}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  {/* Primary Actions */}
                  <div className="flex items-center space-x-2 mb-3">
                    <button
                      onClick={() => handleShareSurvey(survey)}
                      className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm flex-1 justify-center"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share & QR</span>
                    </button>
                    
                    <a
                      href={getSurveyUrlLocal(survey.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm flex-1 justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Live</span>
                    </a>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 mb-3">
                    <button
                      onClick={() => copyToClipboard(getSurveyUrlLocal(survey.id))}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex-1 justify-center"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy URL</span>
                    </button>
                    
                    <button
                      onClick={() => downloadQRCode(survey)}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex-1 justify-center"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR Code</span>
                    </button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex items-center justify-center space-x-1">
                    <Link
                      to={`/app/builder/${survey.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    <Link
                      to={`/app/analytics/${survey.id}`}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Analytics"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDuplicate(survey)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleUnpublish(survey.id)}
                      className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      title="Unpublish"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(survey.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Share Modal with Fallback */}
        {selectedSurveyForShare && shareModalOpen && (
          <>
            {!useSimpleModal ? (
              <SurveyShareModal
                survey={selectedSurveyForShare}
                isOpen={shareModalOpen}
                onClose={() => {
                  setShareModalOpen(false);
                  setSelectedSurveyForShare(null);
                  setUseSimpleModal(false);
                }}
              />
            ) : (
              <SimpleSurveyShare
                survey={selectedSurveyForShare}
                isOpen={shareModalOpen}
                onClose={() => {
                  setShareModalOpen(false);
                  setSelectedSurveyForShare(null);
                  setUseSimpleModal(false);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublishedSurveys;
