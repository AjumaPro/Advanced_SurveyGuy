import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Eye,
  Edit,
  Trash2,
  Copy,
  Globe,
  Share,
  Plus,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const deleteSurvey = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) return;
    
    try {
      await api.delete(`/surveys/${surveyId}`);
      setSurveys(surveys.filter(s => s.id !== surveyId));
      toast.success('Survey deleted successfully');
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast.error('Failed to delete survey');
    }
  };

  const duplicateSurvey = async (survey) => {
    try {
      const response = await api.post(`/surveys/${survey.id}/duplicate`);
      setSurveys([...surveys, response.data]);
      toast.success('Survey duplicated successfully');
    } catch (error) {
      console.error('Error duplicating survey:', error);
      toast.error('Failed to duplicate survey');
    }
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
        return <CheckCircle className="h-4 w-4" />;
      case 'draft':
        return <Clock className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    if (filter === 'all') return true;
    if (filter === 'published') return survey.status === 'published';
    if (filter === 'draft') return survey.status === 'draft';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading surveys...</p>
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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Surveys</h1>
            <p className="text-xl text-gray-600">
              Manage and organize your survey collection
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/app/templates"
              className="btn-secondary"
            >
              <FileText className="h-5 w-5 mr-2" />
              Use Templates
            </Link>
            <Link
              to="/app/builder"
              className="btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Survey
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Surveys', count: surveys.length },
                { key: 'published', label: 'Published', count: surveys.filter(s => s.status === 'published').length },
                { key: 'draft', label: 'Drafts', count: surveys.filter(s => s.status === 'draft').length }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Survey Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {survey.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {survey.description || 'No description available'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(survey.status)}`}>
                    {getStatusIcon(survey.status)}
                    <span className="capitalize">{survey.status}</span>
                  </div>
                </div>

                {/* Survey Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {survey.questions?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {survey.responses_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Responses</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {survey.completion_rate || 0}%
                    </div>
                    <div className="text-xs text-gray-500">Completion</div>
                  </div>
                </div>
              </div>

              {/* Survey Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-gray-500">
                    Created {new Date(survey.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {survey.updated_at && `Updated ${new Date(survey.updated_at).toLocaleDateString()}`}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to={`/preview/${survey.id}`}
                    className="btn-secondary text-sm py-2"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Link>
                  <Link
                    to={`/builder/${survey.id}`}
                    className="btn-secondary text-sm py-2"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <Link
                    to={`/analytics/${survey.id}`}
                    className="btn-secondary text-sm py-2"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Link>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Link
                    to={`/publish/${survey.id}`}
                    className="btn-secondary text-sm py-2"
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Publish
                  </Link>
                  <button
                    onClick={() => duplicateSurvey(survey)}
                    className="btn-secondary text-sm py-2"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => deleteSurvey(survey.id)}
                    className="btn-secondary text-sm py-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>

                {survey.status === 'published' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/survey/${survey.id}`}
                        className="btn-primary text-sm py-2"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Public View
                      </Link>
                      <Link
                        to={`/preview/${survey.id}`}
                        className="btn-secondary text-sm py-2"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSurveys.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No surveys yet' : `No ${filter} surveys`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Create your first survey to get started'
                : `No ${filter} surveys found. Try creating a new survey.`
              }
            </p>
            <Link
              to="/app/builder"
              className="btn-primary"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Survey
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Surveys; 