import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Download,
  PieChart,
  BarChart3,
  ArrowLeft,
  Copy
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell
} from 'recharts';

const SurveyAnalytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analytics/${id}`);
      setAnalytics(response.data);
      if (response.data.questions && response.data.questions.length > 0) {
        setSelectedQuestion(response.data.questions[0]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const exportResponses = async (format = 'csv') => {
    try {
      setExporting(true);
      const response = await axios.get(`/api/responses/export/${id}?format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `survey_${id}_responses.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Error exporting responses:', error);
      toast.error('Failed to export responses');
    } finally {
      setExporting(false);
    }
  };

  const copyAnalyticsLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/analytics/${id}`);
      toast.success('Analytics link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics available</h3>
          <p className="text-gray-600 mb-4">This survey doesn't have any responses yet.</p>
          <Link to={`/survey/${id}`} className="btn-primary">
            View Survey
          </Link>
        </div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderQuestionAnalytics = (question) => {
    if (!question.analytics) return null;

    switch (question.type) {
      case 'emoji_scale':
      case 'likert_scale':
        return renderScaleAnalytics(question);
      case 'multiple_choice':
        return renderMultipleChoiceAnalytics(question);
      case 'text':
        return renderTextAnalytics(question);
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Analytics not available for this question type
          </div>
        );
    }
  };

  const renderScaleAnalytics = (question) => {
    const { analytics } = question;
    const data = analytics.distribution || [];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Average Rating</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.average?.toFixed(1) || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Total Responses</h4>
            <p className="text-2xl font-bold text-green-600">{analytics.total_responses || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Satisfaction Index</h4>
            <p className="text-2xl font-bold text-purple-600">{analytics.satisfaction_index?.toFixed(1) || 'N/A'}%</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Response Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMultipleChoiceAnalytics = (question) => {
    const { analytics } = question;
    const data = analytics.distribution || [];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Total Responses</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.total_responses || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Most Popular</h4>
            <p className="text-lg font-semibold text-green-600">
              {data.length > 0 ? data[0]?.label || 'N/A' : 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Response Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTextAnalytics = (question) => {
    const { analytics } = question;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Total Responses</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.total_responses || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Average Length</h4>
            <p className="text-2xl font-bold text-green-600">{analytics.average_length?.toFixed(0) || 'N/A'} chars</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Responses</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analytics.recent_responses?.map((response, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{response}</p>
              </div>
            )) || (
              <p className="text-gray-500 text-center">No text responses available</p>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            <div className="flex items-center space-x-4">
              <Link to="/app/surveys" className="btn-secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Surveys
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Survey Analytics</h1>
                <p className="text-gray-600 mt-1">Detailed insights and response analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={copyAnalyticsLink}
                className="btn-secondary"
                title="Copy analytics link"
              >
                <Copy className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={() => exportResponses('csv')}
                disabled={exporting}
                className="btn-primary"
                title="Export responses"
              >
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>

          {/* Survey Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Survey Title</h3>
                <p className="text-lg font-semibold text-gray-900">{analytics.survey_title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Responses</h3>
                <p className="text-lg font-semibold text-blue-600">{analytics.total_responses || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h3>
                <p className="text-lg font-semibold text-green-600">{analytics.completion_rate?.toFixed(1) || 0}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Questions</h3>
                <p className="text-lg font-semibold text-purple-600">{analytics.questions?.length || 0}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Questions Analytics */}
        {analytics.questions && analytics.questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Question Analytics</h2>
              <select
                value={selectedQuestion?.id || ''}
                onChange={(e) => {
                  const question = analytics.questions.find(q => q.id === parseInt(e.target.value));
                  setSelectedQuestion(question);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {analytics.questions.map((question, index) => (
                  <option key={question.id} value={question.id}>
                    Question {index + 1}: {question.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedQuestion.title}
                  </h3>
                  <p className="text-gray-600">{selectedQuestion.description}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedQuestion.type === 'emoji_scale' ? 'bg-blue-100 text-blue-800' :
                      selectedQuestion.type === 'multiple_choice' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedQuestion.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {renderQuestionAnalytics(selectedQuestion)}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyAnalytics; 