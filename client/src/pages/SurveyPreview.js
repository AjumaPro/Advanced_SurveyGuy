import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Share2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Settings,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Smartphone,
  Monitor,
  Tablet,
  QrCode,
  Mail,
  MessageSquare,
  Share,
  TrendingUp,
  Target
} from 'lucide-react';

// Import question renderers
import QuestionRenderer from '../components/QuestionRenderer';

const SurveyPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // preview, analytics, settings, share

  const fetchSurvey = useCallback(async () => {
    if (!user || !id) return;
    
    setLoading(true);
    try {
      const response = await api.surveys.getSurvey(id);
      if (response.error) {
        console.error('API Error:', response.error);
        // Fallback to mock data for testing
        const mockSurvey = {
          id: id,
          title: 'Customer Satisfaction Survey',
          description: 'Help us improve our service by sharing your feedback',
          status: 'draft',
          category: 'customer-satisfaction',
          questions: [
            {
              id: 'q1',
              title: 'How satisfied are you with our service?',
              type: 'rating',
              required: true,
              options: { min: 1, max: 5, labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] }
            },
            {
              id: 'q2',
              title: 'What can we improve?',
              type: 'textarea',
              required: false,
              placeholder: 'Please share your suggestions...'
            },
            {
              id: 'q3',
              title: 'Which features do you use most?',
              type: 'multiple_choice',
              required: true,
              options: ['Mobile App', 'Web Interface', 'API Integration', 'Customer Support'],
              allowOther: true
            }
          ],
          settings: {
            showProgress: true,
            allowAnonymous: true,
            collectEmail: false,
            showResults: false
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          responses: []
        };
        setSurvey(mockSurvey);
        toast('Using demo data - API connection failed', { icon: 'ℹ️' });
      } else {
        setSurvey(response.survey);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to mock data
      const mockSurvey = {
        id: id,
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve our service by sharing your feedback',
        status: 'draft',
        category: 'customer-satisfaction',
        questions: [
          {
            id: 'q1',
            title: 'How satisfied are you with our service?',
            type: 'rating',
            required: true,
            options: { min: 1, max: 5, labels: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] }
          },
          {
            id: 'q2',
            title: 'What can we improve?',
            type: 'textarea',
            required: false,
            placeholder: 'Please share your suggestions...'
          }
        ],
        settings: {
          showProgress: true,
          allowAnonymous: true,
          collectEmail: false,
          showResults: false
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        responses: []
      };
      setSurvey(mockSurvey);
      toast('Using demo data - Connection failed', { icon: 'ℹ️' });
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handlePublishSurvey = async () => {
    if (!survey.title?.trim()) {
      toast.error('Please add a title before publishing');
      return;
    }
    
    if (!survey.questions?.length) {
      toast.error('Please add at least one question before publishing');
      return;
    }

    try {
      const response = await api.surveys.publishSurvey(survey.id);
      if (response.error) {
        toast.error('Failed to publish survey');
      } else {
        toast.success('Survey published successfully!', {
          duration: 4000,
          action: {
            label: 'View Published',
            onClick: () => navigate('/app/published-surveys')
          }
        });
        setSurvey(prev => ({ ...prev, status: 'published' }));
        
        // Auto-navigate after a short delay
        setTimeout(() => {
          navigate('/app/published-surveys');
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to publish survey');
      console.error('Error:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const getSurveyUrl = () => {
    return `${window.location.origin}/survey/${survey.id}`;
  };

  const getPreviewContainerClass = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const getDeviceIcon = (mode) => {
    switch (mode) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey preview...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey Not Found</h2>
          <p className="text-gray-600 mb-6">The survey you're looking for doesn't exist or you don't have access to it.</p>
          <Link
            to="/app/surveys"
            className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Surveys</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Header with Tabs */}
      {!isFullscreen && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Navigation */}
            <div className="flex items-center justify-between h-16">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/app/surveys"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Surveys</span>
                </Link>
                
                <div className="border-l border-gray-300 pl-4">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {survey.title || 'Untitled Survey'}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      survey.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {survey.status === 'published' ? (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Draft
                        </>
                      )}
                    </span>
                    <span>{survey.questions?.length || 0} questions</span>
                    {survey.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {survey.category.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Device Preview Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  {['desktop', 'tablet', 'mobile'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPreviewMode(mode)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                        previewMode === mode 
                          ? 'bg-white shadow-sm text-blue-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {getDeviceIcon(mode)}
                      <span className="capitalize text-sm">{mode}</span>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/app/builder/${survey.id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>

                  {survey.status === 'published' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(getSurveyUrl())}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </button>
                      
                      <a
                        href={getSurveyUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Live</span>
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handlePublishSurvey}
                      disabled={!survey.title || !survey.questions?.length}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Publish</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Fullscreen Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-t border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'preview', label: 'Preview', icon: Eye },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'settings', label: 'Settings', icon: Settings },
                  { id: 'share', label: 'Share', icon: Share2 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className={activeTab === 'preview' ? getPreviewContainerClass() : 'max-w-7xl mx-auto'}>
          {activeTab === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
            {/* Survey Header */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {survey.title || 'Untitled Survey'}
                </h1>
                {survey.description && (
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {survey.description}
                  </p>
                )}
                
                {survey.settings?.showProgress && survey.questions?.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(((currentQuestionIndex + 1) / survey.questions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / survey.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Survey Questions */}
            <div className="p-8">
              {survey.questions && survey.questions.length > 0 ? (
                <div className="space-y-8">
                  {survey.questions.map((question, index) => (
                    <motion.div
                      key={question.id || index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {question.title || `Question ${index + 1}`}
                                {question.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </h3>
                              {question.description && (
                                <p className="text-gray-600 text-sm mb-4">
                                  {question.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {question.type?.replace('_', ' ') || 'text'}
                              </span>
                              {question.required && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Question Renderer */}
                          <div className="mt-4">
                            <QuestionRenderer
                              question={question}
                              value={responses[question.id]}
                              onChange={(value) => handleResponseChange(question.id, value)}
                              preview={true}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Added</h3>
                  <p className="text-gray-600 mb-6">
                    This survey doesn't have any questions yet. Add questions to see the preview.
                  </p>
                  <Link
                    to={`/app/builder/${survey.id}`}
                    className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Add Questions</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Survey Footer */}
            {survey.questions?.length > 0 && (
              <div className="p-8 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''} • 
                    Estimated time: {Math.ceil(survey.questions.length * 0.5)} minutes
                  </div>
                  
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Submit Survey (Preview)
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          )}

          {/* Survey Info Panel - Only show on preview tab */}
          {activeTab === 'preview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {survey.responses?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Responses</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {survey.questions?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.ceil((survey.questions?.length || 0) * 0.5)}
                </div>
                <div className="text-sm text-gray-600">Est. Minutes</div>
              </div>
            </div>
          </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Analytics Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Survey Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {survey.responses?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Responses</div>
                    <div className="text-xs text-green-600 mt-1">+12% this week</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {survey.completion_rate || 78}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                    <div className="text-xs text-green-600 mt-1">+5% this week</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {survey.avg_completion_time || 4.2}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Time (min)</div>
                    <div className="text-xs text-red-600 mt-1">-0.3 min this week</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {survey.bounce_rate || 22}%
                    </div>
                    <div className="text-sm text-gray-600">Bounce Rate</div>
                    <div className="text-xs text-red-600 mt-1">+2% this week</div>
                  </div>
                </div>
              </div>

              {/* Response Trends */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Trends</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Response trend chart would go here</p>
                    <p className="text-sm text-gray-500">Integration with charting library needed</p>
                  </div>
                </div>
              </div>

              {/* Question Performance */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Performance</h3>
                <div className="space-y-4">
                  {survey.questions?.map((question, index) => (
                    <div key={question.id || index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            Q{index + 1}: {question.title || `Question ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-600">{question.type?.replace('_', ' ')}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {Math.floor(Math.random() * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Completion</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Survey Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Survey Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title</label>
                    <input
                      type="text"
                      value={survey.title || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={survey.category || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={survey.description || ''}
                      readOnly
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Display Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Display Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={survey.settings?.showProgress || false}
                        readOnly
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Show progress bar</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={survey.settings?.allowAnonymous || false}
                        readOnly
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Allow anonymous responses</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={survey.settings?.collectEmail || false}
                        readOnly
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Collect email addresses</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={survey.settings?.showResults || false}
                        readOnly
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Show results after submission</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Share Tab */}
          {activeTab === 'share' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Share Options */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Share Your Survey</h3>
                
                {survey.status === 'published' ? (
                  <div className="space-y-6">
                    {/* Survey URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Survey URL</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={getSurveyUrl()}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => copyToClipboard(getSurveyUrl())}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Share Buttons */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Share via</label>
                      <div className="flex flex-wrap gap-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <Share className="w-4 h-4" />
                          <span>Social Media</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <QrCode className="w-4 h-4" />
                          <span>QR Code</span>
                        </button>
                      </div>
                    </div>

                    {/* Embed Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
                      <textarea
                        value={`<iframe src="${getSurveyUrl()}" width="100%" height="600" frameborder="0"></iframe>`}
                        readOnly
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(`<iframe src="${getSurveyUrl()}" width="100%" height="600" frameborder="0"></iframe>`)}
                        className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Copy Embed Code
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Survey Not Published</h3>
                    <p className="text-gray-600 mb-6">
                      Publish your survey to get a shareable link and start collecting responses.
                    </p>
                    <button
                      onClick={handlePublishSurvey}
                      disabled={!survey.title || !survey.questions?.length}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Publish Survey</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fullscreen Exit */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
        >
          <EyeOff className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SurveyPreview;