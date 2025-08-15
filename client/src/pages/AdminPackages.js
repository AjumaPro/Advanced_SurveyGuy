import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Calendar,
  Settings,
  RefreshCw,
  Save,
  X,
  Search,
  Brain,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Database,
  Cpu,
  Bot,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Layers
} from 'lucide-react';

const AdminPackages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [showQuestionTemplates, setShowQuestionTemplates] = useState(false);
  const [showSurveySuggestions, setShowSurveySuggestions] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'GHS',
    interval: 'monthly',
    features: [],
    max_surveys: 3,
    max_responses_per_survey: 50,
    is_active: true,
    is_featured: false,
    sort_order: 0,
    // Enterprise features
    advanced_analytics: false,
    custom_branding: false,
    api_access: false,
    white_label: false,
    priority_support: false,
    data_export: false,
    team_collaboration: false,
    advanced_security: false,
    custom_integrations: false,
    dedicated_account_manager: false,
    sso_integration: false,
    advanced_workflows: false,
    ai_insights: false,
    real_time_dashboard: false,
    custom_domains: false,
    backup_restore: false,
    compliance_certifications: false,
    training_sessions: false,
    custom_development: false,
    sla_guarantee: false
  });
  const [newFeature, setNewFeature] = useState('');
  const [showEnterpriseTemplates, setShowEnterpriseTemplates] = useState(false);

  // Enterprise package templates
  const enterpriseTemplates = {
    basic_enterprise: {
      name: 'Basic Enterprise',
      description: 'Essential enterprise features for growing organizations',
      price: '199.99',
      features: [
        'Advanced Analytics Dashboard',
        'Custom Branding',
        'API Access',
        'Priority Support',
        'Data Export',
        'Team Collaboration',
        'Advanced Security'
      ],
      max_surveys: 100,
      max_responses_per_survey: 10000,
      advanced_analytics: true,
      custom_branding: true,
      api_access: true,
      priority_support: true,
      data_export: true,
      team_collaboration: true,
      advanced_security: true
    },
    professional_enterprise: {
      name: 'Professional Enterprise',
      description: 'Comprehensive enterprise solution for established businesses',
      price: '399.99',
      features: [
        'All Basic Enterprise Features',
        'White Label Solution',
        'Custom Integrations',
        'Dedicated Account Manager',
        'SSO Integration',
        'Advanced Workflows',
        'AI Insights',
        'Real-time Dashboard',
        'Custom Domains'
      ],
      max_surveys: 500,
      max_responses_per_survey: 50000,
      advanced_analytics: true,
      custom_branding: true,
      api_access: true,
      white_label: true,
      priority_support: true,
      data_export: true,
      team_collaboration: true,
      advanced_security: true,
      custom_integrations: true,
      dedicated_account_manager: true,
      sso_integration: true,
      advanced_workflows: true,
      ai_insights: true,
      real_time_dashboard: true,
      custom_domains: true
    },
    ultimate_enterprise: {
      name: 'Ultimate Enterprise',
      description: 'Complete enterprise solution with maximum features and support',
      price: '799.99',
      features: [
        'All Professional Enterprise Features',
        'Backup & Restore',
        'Compliance Certifications',
        'Training Sessions',
        'Custom Development',
        'SLA Guarantee',
        '24/7 Premium Support',
        'On-site Implementation',
        'Custom AI Models'
      ],
      max_surveys: -1, // Unlimited
      max_responses_per_survey: -1, // Unlimited
      advanced_analytics: true,
      custom_branding: true,
      api_access: true,
      white_label: true,
      priority_support: true,
      data_export: true,
      team_collaboration: true,
      advanced_security: true,
      custom_integrations: true,
      dedicated_account_manager: true,
      sso_integration: true,
      advanced_workflows: true,
      ai_insights: true,
      real_time_dashboard: true,
      custom_domains: true,
      backup_restore: true,
      compliance_certifications: true,
      training_sessions: true,
      custom_development: true,
      sla_guarantee: true
    },
    ai_powered_enterprise: {
      name: 'AI-Powered Enterprise',
      description: 'Next-generation enterprise solution with advanced AI capabilities',
      price: '1299.99',
      features: [
        'All Ultimate Enterprise Features',
        'AI Question Generation',
        'Smart Survey Suggestions',
        'Predictive Analytics',
        'Natural Language Processing',
        'Automated Insights',
        'AI-Powered Recommendations',
        'Machine Learning Models',
        'Sentiment Analysis',
        'Behavioral Analytics',
        'Custom AI Training',
        'Advanced Data Mining',
        'Real-time AI Processing',
        'Intelligent Workflows',
        'AI Chatbot Integration',
        'Voice-to-Text Surveys',
        'Image Recognition',
        'Multi-language AI Support',
        'AI-Powered A/B Testing',
        'Intelligent Survey Optimization'
      ],
      max_surveys: -1, // Unlimited
      max_responses_per_survey: -1, // Unlimited
      advanced_analytics: true,
      custom_branding: true,
      api_access: true,
      white_label: true,
      priority_support: true,
      data_export: true,
      team_collaboration: true,
      advanced_security: true,
      custom_integrations: true,
      dedicated_account_manager: true,
      sso_integration: true,
      advanced_workflows: true,
      ai_insights: true,
      real_time_dashboard: true,
      custom_domains: true,
      backup_restore: true,
      compliance_certifications: true,
      training_sessions: true,
      custom_development: true,
      sla_guarantee: true
    },
    global_enterprise: {
      name: 'Global Enterprise',
      description: 'Worldwide enterprise solution for multinational organizations',
      price: '2499.99',
      features: [
        'All AI-Powered Enterprise Features',
        'Global Data Centers',
        'Multi-region Compliance',
        'International Support',
        'Localization Services',
        'Currency Conversion',
        'Time Zone Management',
        'Multi-language Surveys',
        'Global Analytics',
        'Cross-border Data Transfer',
        'International Legal Compliance',
        'Regional Customization',
        'Global Team Management',
        'Worldwide Deployment',
        'International Training',
        'Global SLA Coverage',
        '24/7 Global Support',
        'Regional Account Managers',
        'International Integrations',
        'Global Security Standards'
      ],
      max_surveys: -1, // Unlimited
      max_responses_per_survey: -1, // Unlimited
      advanced_analytics: true,
      custom_branding: true,
      api_access: true,
      white_label: true,
      priority_support: true,
      data_export: true,
      team_collaboration: true,
      advanced_security: true,
      custom_integrations: true,
      dedicated_account_manager: true,
      sso_integration: true,
      advanced_workflows: true,
      ai_insights: true,
      real_time_dashboard: true,
      custom_domains: true,
      backup_restore: true,
      compliance_certifications: true,
      training_sessions: true,
      custom_development: true,
      sla_guarantee: true
    }
  };

  // AI Question Generation Templates
  const aiQuestionTemplates = {
    customer_satisfaction: {
      name: 'Customer Satisfaction Survey',
      description: 'AI-generated questions to measure customer satisfaction and loyalty',
      category: 'Business',
      questions: [
        'How satisfied are you with our overall service?',
        'How likely are you to recommend us to others?',
        'What aspects of our service could be improved?',
        'How would you rate our customer support?',
        'What is your primary reason for choosing our service?'
      ],
      ai_features: ['Sentiment Analysis', 'NPS Scoring', 'Trend Detection']
    },
    employee_engagement: {
      name: 'Employee Engagement Survey',
      description: 'Comprehensive employee satisfaction and engagement assessment',
      category: 'HR',
      questions: [
        'How satisfied are you with your current role?',
        'Do you feel valued and recognized at work?',
        'How would you rate your work-life balance?',
        'Do you see opportunities for growth in this company?',
        'How would you rate the company culture?'
      ],
      ai_features: ['Engagement Scoring', 'Retention Prediction', 'Culture Analysis']
    },
    market_research: {
      name: 'Market Research Survey',
      description: 'Advanced market research with AI-powered insights',
      category: 'Marketing',
      questions: [
        'What factors influence your purchasing decisions?',
        'How do you prefer to discover new products?',
        'What is your preferred price range for this type of product?',
        'Which features are most important to you?',
        'How do you compare us to our competitors?'
      ],
      ai_features: ['Market Segmentation', 'Competitive Analysis', 'Trend Prediction']
    },
    product_feedback: {
      name: 'Product Feedback Survey',
      description: 'Detailed product feedback with AI-powered feature analysis',
      category: 'Product',
      questions: [
        'How would you rate the overall product quality?',
        'Which features do you use most frequently?',
        'What additional features would you like to see?',
        'How intuitive is the user interface?',
        'What problems have you encountered while using the product?'
      ],
      ai_features: ['Feature Prioritization', 'Usability Analysis', 'Bug Detection']
    },
    academic_research: {
      name: 'Academic Research Survey',
      description: 'Research-focused surveys with statistical analysis',
      category: 'Education',
      questions: [
        'What is your current level of education?',
        'How much time do you spend studying daily?',
        'What study methods do you find most effective?',
        'How would you rate the quality of your education?',
        'What challenges do you face in your academic journey?'
      ],
      ai_features: ['Statistical Analysis', 'Correlation Detection', 'Academic Insights']
    }
  };

  // AI Survey Suggestions
  const aiSurveySuggestions = {
    question_optimization: {
      title: 'Question Optimization',
      description: 'AI suggests improvements to make questions more effective',
      features: [
        'Clarity Analysis',
        'Bias Detection',
        'Response Rate Prediction',
        'Question Flow Optimization',
        'Language Simplification'
      ]
    },
    survey_design: {
      title: 'Survey Design',
      description: 'AI-powered survey design recommendations',
      features: [
        'Layout Optimization',
        'Mobile Responsiveness',
        'User Experience Analysis',
        'Completion Rate Optimization',
        'Visual Design Suggestions'
      ]
    },
    data_analysis: {
      title: 'Data Analysis',
      description: 'Advanced AI-powered data analysis and insights',
      features: [
        'Pattern Recognition',
        'Anomaly Detection',
        'Predictive Analytics',
        'Segmentation Analysis',
        'Trend Identification'
      ]
    },
    response_prediction: {
      title: 'Response Prediction',
      description: 'Predict survey responses and optimize accordingly',
      features: [
        'Response Rate Prediction',
        'Drop-off Point Analysis',
        'Completion Time Estimation',
        'Quality Score Prediction',
        'Engagement Forecasting'
      ]
    }
  };

  // Check if user is admin or super admin
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'super_admin' && !user.super_admin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      currency: 'GHS',
      interval: 'monthly',
      features: [],
      max_surveys: 3,
      max_responses_per_survey: 50,
      is_active: true,
      is_featured: false,
      sort_order: 0,
      // Enterprise features
      advanced_analytics: false,
      custom_branding: false,
      api_access: false,
      white_label: false,
      priority_support: false,
      data_export: false,
      team_collaboration: false,
      advanced_security: false,
      custom_integrations: false,
      dedicated_account_manager: false,
      sso_integration: false,
      advanced_workflows: false,
      ai_insights: false,
      real_time_dashboard: false,
      custom_domains: false,
      backup_restore: false,
      compliance_certifications: false,
      training_sessions: false,
      custom_development: false,
      sla_guarantee: false
    });
    setNewFeature('');
  };

  const handleCreatePackage = async () => {
    try {
      if (!formData.name || !formData.price) {
        toast.error('Name and price are required');
        return;
      }

      await axios.post('/api/admin/packages', formData);
      toast.success('Package created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchPackages();
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error('Failed to create package');
    }
  };

  const handleEditPackage = async () => {
    try {
      if (!formData.name || !formData.price) {
        toast.error('Name and price are required');
        return;
      }

      await axios.put(`/api/admin/packages/${selectedPackage.id}`, formData);
      toast.success('Package updated successfully');
      setShowEditModal(false);
      setSelectedPackage(null);
      resetForm();
      fetchPackages();
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update package');
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/packages/${packageId}`);
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete package');
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedPackages.length === 0) {
      toast.error('Please select packages to perform bulk action');
      return;
    }

    try {
      if (action === 'activate') {
        await Promise.all(selectedPackages.map(id => 
          axios.put(`/api/admin/packages/${id}`, { is_active: true })
        ));
        toast.success(`${selectedPackages.length} packages activated successfully`);
      } else if (action === 'deactivate') {
        await Promise.all(selectedPackages.map(id => 
          axios.put(`/api/admin/packages/${id}`, { is_active: false })
        ));
        toast.success(`${selectedPackages.length} packages deactivated successfully`);
      } else if (action === 'feature') {
        await Promise.all(selectedPackages.map(id => 
          axios.put(`/api/admin/packages/${id}`, { is_featured: true })
        ));
        toast.success(`${selectedPackages.length} packages marked as featured`);
      } else if (action === 'unfeature') {
        await Promise.all(selectedPackages.map(id => 
          axios.put(`/api/admin/packages/${id}`, { is_featured: false })
        ));
        toast.success(`${selectedPackages.length} packages unfeatured`);
      } else if (action === 'delete') {
        if (!window.confirm(`Are you sure you want to delete ${selectedPackages.length} packages? This action cannot be undone.`)) {
          return;
        }
        await Promise.all(selectedPackages.map(id => 
          axios.delete(`/api/admin/packages/${id}`)
        ));
        toast.success(`${selectedPackages.length} packages deleted successfully`);
      }
      
      setSelectedPackages([]);
      fetchPackages();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const togglePackageSelection = (packageId) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const selectAllPackages = () => {
    setSelectedPackages(packages.map(pkg => pkg.id));
  };

  const clearSelection = () => {
    setSelectedPackages([]);
  };

  // AI-Powered Functions
  const generateAIQuestions = async (template, topic, targetAudience) => {
    try {
      // Simulate AI question generation
      const questions = [
        `How satisfied are you with ${topic}?`,
        `What aspects of ${topic} could be improved?`,
        `How would you rate your experience with ${topic}?`,
        `What would make ${topic} better for ${targetAudience}?`,
        `How likely are you to recommend ${topic} to others?`
      ];
      
      setAiGeneratedQuestions(questions);
      toast.success('AI questions generated successfully!');
    } catch (error) {
      console.error('Error generating AI questions:', error);
      toast.error('Failed to generate AI questions');
    }
  };

  const getAISuggestions = async (surveyType, targetAudience) => {
    try {
      // Simulate AI suggestions
      const suggestions = [
        'Consider adding follow-up questions for deeper insights',
        'Use rating scales for quantitative analysis',
        'Include demographic questions for segmentation',
        'Add open-ended questions for qualitative feedback',
        'Consider mobile-optimized question formats'
      ];
      
      setAiSuggestions(suggestions);
      toast.success('AI suggestions generated!');
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
    }
  };

  const applyAITemplate = (templateKey) => {
    const template = aiQuestionTemplates[templateKey];
    if (template) {
      setAiGeneratedQuestions(template.questions);
      toast.success(`${template.name} template applied!`);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && pkg.is_active) ||
                         (statusFilter === 'inactive' && !pkg.is_active) ||
                         (statusFilter === 'featured' && pkg.is_featured);
    return matchesSearch && matchesStatus;
  });

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      currency: pkg.currency || 'GHS',
      interval: pkg.interval || 'monthly',
      features: pkg.features || [],
      max_surveys: pkg.max_surveys || 3,
      max_responses_per_survey: pkg.max_responses_per_survey || 50,
      is_active: pkg.is_active,
      is_featured: pkg.is_featured || false,
      sort_order: pkg.sort_order || 0,
      // Enterprise features
      advanced_analytics: pkg.advanced_analytics || false,
      custom_branding: pkg.custom_branding || false,
      api_access: pkg.api_access || false,
      white_label: pkg.white_label || false,
      priority_support: pkg.priority_support || false,
      data_export: pkg.data_export || false,
      team_collaboration: pkg.team_collaboration || false,
      advanced_security: pkg.advanced_security || false,
      custom_integrations: pkg.custom_integrations || false,
      dedicated_account_manager: pkg.dedicated_account_manager || false,
      sso_integration: pkg.sso_integration || false,
      advanced_workflows: pkg.advanced_workflows || false,
      ai_insights: pkg.ai_insights || false,
      real_time_dashboard: pkg.real_time_dashboard || false,
      custom_domains: pkg.custom_domains || false,
      backup_restore: pkg.backup_restore || false,
      compliance_certifications: pkg.compliance_certifications || false,
      training_sessions: pkg.training_sessions || false,
      custom_development: pkg.custom_development || false,
      sla_guarantee: pkg.sla_guarantee || false
    });
    setShowEditModal(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const applyEnterpriseTemplate = (templateKey) => {
    const template = enterpriseTemplates[templateKey];
    setFormData({
      ...formData,
      name: template.name,
      description: template.description,
      price: template.price,
      features: template.features,
      max_surveys: template.max_surveys,
      max_responses_per_survey: template.max_responses_per_survey,
      // Apply all enterprise features from template
      advanced_analytics: template.advanced_analytics || false,
      custom_branding: template.custom_branding || false,
      api_access: template.api_access || false,
      white_label: template.white_label || false,
      priority_support: template.priority_support || false,
      data_export: template.data_export || false,
      team_collaboration: template.team_collaboration || false,
      advanced_security: template.advanced_security || false,
      custom_integrations: template.custom_integrations || false,
      dedicated_account_manager: template.dedicated_account_manager || false,
      sso_integration: template.sso_integration || false,
      advanced_workflows: template.advanced_workflows || false,
      ai_insights: template.ai_insights || false,
      real_time_dashboard: template.real_time_dashboard || false,
      custom_domains: template.custom_domains || false,
      backup_restore: template.backup_restore || false,
      compliance_certifications: template.compliance_certifications || false,
      training_sessions: template.training_sessions || false,
      custom_development: template.custom_development || false,
      sla_guarantee: template.sla_guarantee || false
    });
    setShowEnterpriseTemplates(false);
    setShowCreateModal(true);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }
  };

  const getFeaturedBadge = (isFeatured) => {
    if (isFeatured) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Package className="w-3 h-3 mr-1" />
          Featured
        </span>
      );
    }
    return null;
  };

  if (user?.role !== 'admin' && user?.role !== 'super_admin' && !user?.super_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscription Packages</h1>
              <p className="mt-2 text-gray-600">Create and manage subscription packages for users</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchPackages}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowEnterpriseTemplates(!showEnterpriseTemplates)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Enterprise Templates
                </button>
                {showEnterpriseTemplates && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Enterprise Templates</h3>
                      <div className="space-y-3">
                        {Object.entries(enterpriseTemplates).map(([key, template]) => (
                          <div key={key} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{template.name}</h4>
                              <span className="text-sm font-semibold text-purple-600">{template.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            <button
                              onClick={() => applyEnterpriseTemplate(key)}
                              className="w-full text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                            >
                              Use Template
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowAIFeatures(!showAIFeatures)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Features
                </button>
                {showAIFeatures && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">AI-Powered Features</h3>
                      <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                            Question Generation
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">AI-generated survey questions</p>
                          <button
                            onClick={() => setShowQuestionTemplates(true)}
                            className="w-full text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Generate Questions
                          </button>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                            Survey Suggestions
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">AI-powered survey optimization</p>
                          <button
                            onClick={() => setShowSurveySuggestions(true)}
                            className="w-full text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                          >
                            Get Suggestions
                          </button>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                            Analytics Insights
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">AI-powered data analysis</p>
                          <button
                            onClick={() => getAISuggestions('analytics', 'enterprise')}
                            className="w-full text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Analyze Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Package
              </button>
            </div>
          </div>
        </div>

        {/* Package Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Packages</p>
                <p className="text-2xl font-semibold text-gray-900">{packages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">{packages.filter(p => p.is_active).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inactive</p>
                <p className="text-2xl font-semibold text-gray-900">{packages.filter(p => !p.is_active).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Featured</p>
                <p className="text-2xl font-semibold text-gray-900">{packages.filter(p => p.is_featured).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Packages</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex-1 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Bulk Actions
              </button>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {showBulkActions && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={selectAllPackages}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Select All ({packages.length})
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Clear Selection
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedPackages.length} packages selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    disabled={selectedPackages.length === 0}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    disabled={selectedPackages.length === 0}
                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('feature')}
                    disabled={selectedPackages.length === 0}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    Feature
                  </button>
                  <button
                    onClick={() => handleBulkAction('unfeature')}
                    disabled={selectedPackages.length === 0}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    Unfeature
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={selectedPackages.length === 0}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading packages...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  selectedPackages.includes(pkg.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {showBulkActions && (
                        <input
                          type="checkbox"
                          checked={selectedPackages.includes(pkg.id)}
                          onChange={() => togglePackageSelection(pkg.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                        />
                      )}
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(pkg.is_active)}
                          {getFeaturedBadge(pkg.is_featured)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Package"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">{pkg.description || 'No description'}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {pkg.currency} {parseFloat(pkg.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Interval</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{pkg.interval}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Max Surveys</span>
                      <span className="text-sm font-medium text-gray-900">{pkg.max_surveys}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Max Responses</span>
                      <span className="text-sm font-medium text-gray-900">{pkg.max_responses_per_survey}</span>
                    </div>
                  </div>

                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                      <ul className="space-y-1">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Enterprise Features Display */}
                  {pkg.advanced_analytics || pkg.custom_branding || pkg.api_access || pkg.white_label || 
                   pkg.priority_support || pkg.data_export || pkg.team_collaboration || pkg.advanced_security || 
                   pkg.custom_integrations || pkg.dedicated_account_manager || pkg.sso_integration || 
                   pkg.advanced_workflows || pkg.ai_insights || pkg.real_time_dashboard || pkg.custom_domains || 
                   pkg.backup_restore || pkg.compliance_certifications || pkg.training_sessions || 
                   pkg.custom_development || pkg.sla_guarantee ? (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Enterprise Features</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {pkg.advanced_analytics && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            Advanced Analytics
                          </div>
                        )}
                        {pkg.custom_branding && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            Custom Branding
                          </div>
                        )}
                        {pkg.api_access && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            API Access
                          </div>
                        )}
                        {pkg.white_label && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            White Label
                          </div>
                        )}
                        {pkg.priority_support && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            Priority Support
                          </div>
                        )}
                        {pkg.ai_insights && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            AI Insights
                          </div>
                        )}
                        {pkg.sla_guarantee && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            SLA Guarantee
                          </div>
                        )}
                        {pkg.custom_development && (
                          <div className="flex items-center text-xs text-purple-600">
                            <CheckCircle className="w-2 h-2 mr-1" />
                            Custom Dev
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Package</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <PackageForm
                formData={formData}
                setFormData={setFormData}
                newFeature={newFeature}
                setNewFeature={setNewFeature}
                addFeature={addFeature}
                removeFeature={removeFeature}
                onSubmit={handleCreatePackage}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedPackage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Package</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <PackageForm
                formData={formData}
                setFormData={setFormData}
                newFeature={newFeature}
                setNewFeature={setNewFeature}
                addFeature={addFeature}
                removeFeature={removeFeature}
                onSubmit={handleEditPackage}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        )}

        {/* AI Question Templates Modal */}
        {showQuestionTemplates && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">AI Question Generation</h3>
                <button
                  onClick={() => setShowQuestionTemplates(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Question Templates</h4>
                  <div className="space-y-3">
                    {Object.entries(aiQuestionTemplates).map(([key, template]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{template.name}</h5>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{template.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {template.ai_features.map((feature, index) => (
                            <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => applyAITemplate(key)}
                          className="w-full text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Use Template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Custom Question Generation</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Survey Topic</label>
                      <input
                        type="text"
                        placeholder="e.g., Customer Service, Product Quality"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                      <input
                        type="text"
                        placeholder="e.g., Enterprise Customers, Students"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => generateAIQuestions('custom', 'Product Quality', 'Enterprise Customers')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Generate AI Questions
                    </button>
                  </div>
                  {aiGeneratedQuestions.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Generated Questions:</h5>
                      <div className="space-y-2">
                        {aiGeneratedQuestions.map((question, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                            <p className="text-sm text-gray-700">{question}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Survey Suggestions Modal */}
        {showSurveySuggestions && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">AI Survey Suggestions</h3>
                <button
                  onClick={() => setShowSurveySuggestions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">AI-Powered Recommendations</h4>
                  <div className="space-y-3">
                    {Object.entries(aiSurveySuggestions).map(([key, suggestion]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                          {suggestion.title}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <div className="space-y-1">
                          {suggestion.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Smart Suggestions</h4>
                  {aiSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                          <p className="text-sm text-gray-700">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click "Get Suggestions" to generate AI-powered recommendations</p>
                      <button
                        onClick={() => getAISuggestions('enterprise', 'admin')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Generate Suggestions
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Package Form Component
const PackageForm = ({ formData, setFormData, newFeature, setNewFeature, addFeature, removeFeature, onSubmit, onCancel }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Package Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="GHS">GHS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Billing Interval</label>
          <select
            value={formData.interval}
            onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Surveys</label>
          <input
            type="number"
            value={formData.max_surveys}
            onChange={(e) => setFormData({ ...formData, max_surveys: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="-1 for unlimited"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Responses per Survey</label>
          <input
            type="number"
            value={formData.max_responses_per_survey}
            onChange={(e) => setFormData({ ...formData, max_responses_per_survey: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="-1 for unlimited"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
          />
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="space-y-1">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
              <span className="text-sm text-gray-700">{feature}</span>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Features Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Enterprise Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="advanced_analytics"
              checked={formData.advanced_analytics}
              onChange={(e) => setFormData({ ...formData, advanced_analytics: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="advanced_analytics" className="ml-2 block text-sm text-gray-700">
              Advanced Analytics Dashboard
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="custom_branding"
              checked={formData.custom_branding}
              onChange={(e) => setFormData({ ...formData, custom_branding: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="custom_branding" className="ml-2 block text-sm text-gray-700">
              Custom Branding
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="api_access"
              checked={formData.api_access}
              onChange={(e) => setFormData({ ...formData, api_access: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="api_access" className="ml-2 block text-sm text-gray-700">
              API Access
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="white_label"
              checked={formData.white_label}
              onChange={(e) => setFormData({ ...formData, white_label: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="white_label" className="ml-2 block text-sm text-gray-700">
              White Label Solution
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="priority_support"
              checked={formData.priority_support}
              onChange={(e) => setFormData({ ...formData, priority_support: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="priority_support" className="ml-2 block text-sm text-gray-700">
              Priority Support
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="data_export"
              checked={formData.data_export}
              onChange={(e) => setFormData({ ...formData, data_export: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="data_export" className="ml-2 block text-sm text-gray-700">
              Data Export
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="team_collaboration"
              checked={formData.team_collaboration}
              onChange={(e) => setFormData({ ...formData, team_collaboration: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="team_collaboration" className="ml-2 block text-sm text-gray-700">
              Team Collaboration
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="advanced_security"
              checked={formData.advanced_security}
              onChange={(e) => setFormData({ ...formData, advanced_security: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="advanced_security" className="ml-2 block text-sm text-gray-700">
              Advanced Security
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="custom_integrations"
              checked={formData.custom_integrations}
              onChange={(e) => setFormData({ ...formData, custom_integrations: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="custom_integrations" className="ml-2 block text-sm text-gray-700">
              Custom Integrations
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="dedicated_account_manager"
              checked={formData.dedicated_account_manager}
              onChange={(e) => setFormData({ ...formData, dedicated_account_manager: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="dedicated_account_manager" className="ml-2 block text-sm text-gray-700">
              Dedicated Account Manager
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sso_integration"
              checked={formData.sso_integration}
              onChange={(e) => setFormData({ ...formData, sso_integration: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sso_integration" className="ml-2 block text-sm text-gray-700">
              SSO Integration
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="advanced_workflows"
              checked={formData.advanced_workflows}
              onChange={(e) => setFormData({ ...formData, advanced_workflows: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="advanced_workflows" className="ml-2 block text-sm text-gray-700">
              Advanced Workflows
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ai_insights"
              checked={formData.ai_insights}
              onChange={(e) => setFormData({ ...formData, ai_insights: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="ai_insights" className="ml-2 block text-sm text-gray-700">
              AI Insights
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="real_time_dashboard"
              checked={formData.real_time_dashboard}
              onChange={(e) => setFormData({ ...formData, real_time_dashboard: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="real_time_dashboard" className="ml-2 block text-sm text-gray-700">
              Real-time Dashboard
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="custom_domains"
              checked={formData.custom_domains}
              onChange={(e) => setFormData({ ...formData, custom_domains: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="custom_domains" className="ml-2 block text-sm text-gray-700">
              Custom Domains
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="backup_restore"
              checked={formData.backup_restore}
              onChange={(e) => setFormData({ ...formData, backup_restore: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="backup_restore" className="ml-2 block text-sm text-gray-700">
              Backup & Restore
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="compliance_certifications"
              checked={formData.compliance_certifications}
              onChange={(e) => setFormData({ ...formData, compliance_certifications: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="compliance_certifications" className="ml-2 block text-sm text-gray-700">
              Compliance Certifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="training_sessions"
              checked={formData.training_sessions}
              onChange={(e) => setFormData({ ...formData, training_sessions: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="training_sessions" className="ml-2 block text-sm text-gray-700">
              Training Sessions
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="custom_development"
              checked={formData.custom_development}
              onChange={(e) => setFormData({ ...formData, custom_development: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="custom_development" className="ml-2 block text-sm text-gray-700">
              Custom Development
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sla_guarantee"
              checked={formData.sla_guarantee}
              onChange={(e) => setFormData({ ...formData, sla_guarantee: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sla_guarantee" className="ml-2 block text-sm text-gray-700">
              SLA Guarantee
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Active Package
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
            Featured Package
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Package
        </button>
      </div>
    </form>
  );
};

export default AdminPackages; 