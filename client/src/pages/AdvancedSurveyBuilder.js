import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  Move,
  Eye,
  Save,
  RotateCcw,
  Settings,
  Target,
  Palette,
  Layers,
  ChevronDown,
  CheckCircle,
  Users,
  Link as LinkIcon,
  Wand2,
  Upload,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Star,
  MessageCircle,
  Image,
  Video,
  Database,
  Cloud,
  Wifi,
  WifiOff,
  User,
  Edit3,
  Type,
  Hash,
  Calendar,
  MapPin,
  Mail,
  CreditCard,
  Sliders
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdvancedSurveyBuilder = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('builder');
  const [saving, setSaving] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [autoSave] = useState(true);
  const [versionHistory, setVersionHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('order'); // order, type, title
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [integrations, setIntegrations] = useState({
    webhooks: [],
    cloudStorage: [],
    emailMarketing: []
  });
  
  const [survey, setSurvey] = useState({
    id: `survey_${Date.now()}`,
    title: 'Advanced Survey',
    description: '',
    category: 'general',
    tags: [],
    questions: [],
    validationRules: [],
    conditionalLogic: [], // Added missing property
    styling: {
      theme: 'modern',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      fontFamily: 'Inter',
      fontSize: 'medium',
      borderRadius: 'medium',
      shadow: 'medium',
      customCSS: '',
      logo: '',
      favicon: ''
    },
    settings: {
      allowBackNavigation: true,
      showProgressBar: true,
      randomizeQuestions: false,
      randomizeOptions: false,
      timeLimit: 0,
      maxResponses: 0,
      requireLogin: false,
      allowAnonymous: true,
      collectEmail: false,
      showResults: false,
      allowMultipleSubmissions: false,
      enableComments: false,
      enableSharing: true,
      password: '',
      expirationDate: null,
      startDate: null,
      ipRestriction: false,
      allowedIPs: [],
      geolocationRestriction: false,
      allowedCountries: [],
      deviceRestriction: false,
      allowedDevices: ['desktop', 'tablet', 'mobile']
    },
    integrations: {
      webhooks: [],
      apiKeys: [],
      thirdPartyServices: []
    },
    notifications: {
      emailOnResponse: false,
      emailOnCompletion: false,
      webhookNotifications: false,
      slackIntegration: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: user?.id || 'anonymous',
    version: 1,
    status: 'draft' // draft, published, archived
  });

  const questionTypes = [
    // Basic Types
    {
      id: 'text',
      name: 'Text Input',
      icon: <Type className="w-4 h-4" />,
      description: 'Single line text input',
      category: 'basic',
      isAdvanced: false
    },
    {
      id: 'textarea',
      name: 'Long Text',
      icon: <FileText className="w-4 h-4" />,
      description: 'Multi-line text input',
      category: 'basic',
      isAdvanced: false
    },
    {
      id: 'multiple_choice',
      name: 'Multiple Choice',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Single selection from options',
      category: 'basic',
      isAdvanced: false
    },
    {
      id: 'checkbox',
      name: 'Checkboxes',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Multiple selections from options',
      category: 'basic',
      isAdvanced: false
    },
    {
      id: 'dropdown',
      name: 'Dropdown',
      icon: <ChevronDown className="w-4 h-4" />,
      description: 'Dropdown selection',
      category: 'basic',
      isAdvanced: false
    },
    {
      id: 'rating',
      name: 'Rating Scale',
      icon: <Star className="w-4 h-4" />,
      description: 'Star or numeric rating',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'date',
      name: 'Date Picker',
      icon: <Calendar className="w-4 h-4" />,
      description: 'Date selection',
      category: 'basic',
      isAdvanced: false
    },
    {
      id: 'file_upload',
      name: 'File Upload',
      icon: <Upload className="w-4 h-4" />,
      description: 'File attachment',
      category: 'advanced',
      isAdvanced: true
    },
    
    // Advanced Types
    {
      id: 'matrix',
      name: 'Matrix Question',
      icon: <Grid className="w-4 h-4" />,
      description: 'Grid of questions with common options',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'ranking',
      name: 'Ranking',
      icon: <SortAsc className="w-4 h-4" />,
      description: 'Drag and drop ranking',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'slider',
      name: 'Slider',
      icon: <Sliders className="w-4 h-4" />,
      description: 'Numeric slider input',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'nps',
      name: 'NPS Score',
      icon: <Target className="w-4 h-4" />,
      description: 'Net Promoter Score (0-10)',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'likert',
      name: 'Likert Scale',
      icon: <Target className="w-4 h-4" />,
      description: 'Agreement scale (Strongly Agree to Strongly Disagree)',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'contact',
      name: 'Contact Info',
      icon: <User className="w-4 h-4" />,
      description: 'Name, email, phone fields',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'address',
      name: 'Address',
      icon: <MapPin className="w-4 h-4" />,
      description: 'Complete address fields',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'payment',
      name: 'Payment',
      icon: <CreditCard className="w-4 h-4" />,
      description: 'Payment information collection',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'signature',
      name: 'Digital Signature',
      icon: <Edit3 className="w-4 h-4" />,
      description: 'Digital signature capture',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'video',
      name: 'Video Response',
      icon: <Video className="w-4 h-4" />,
      description: 'Video recording submission',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'audio',
      name: 'Audio Response',
      icon: <MessageCircle className="w-4 h-4" />,
      description: 'Audio recording submission',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'image',
      name: 'Image Upload',
      icon: <Image className="w-4 h-4" />,
      description: 'Image file upload',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'location',
      name: 'Location',
      icon: <MapPin className="w-4 h-4" />,
      description: 'GPS location capture',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'cascading',
      name: 'Cascading Dropdown',
      icon: <Layers className="w-4 h-4" />,
      description: 'Dependent dropdown selections',
      category: 'advanced',
      isAdvanced: true
    },
    {
      id: 'calculation',
      name: 'Calculation',
      icon: <Hash className="w-4 h-4" />,
      description: 'Dynamic calculations based on answers',
      category: 'advanced',
      isAdvanced: true
    }
  ];


  const tabs = [
    { id: 'builder', label: 'Builder', icon: <FileText className="w-4 h-4" /> },
    { id: 'styling', label: 'Styling', icon: <Palette className="w-4 h-4" /> },
    { id: 'collaboration', label: 'Collaboration', icon: <Users className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  const handleAutoSave = useCallback(async () => {
    try {
      const surveyData = {
        ...survey,
        updatedAt: new Date().toISOString(),
        version: survey.version + 1
      };
      
      // await api.post('/survey/autosave', surveyData);
      console.log('Auto-saved survey');
      
      // Add to version history
      const newVersion = {
        id: (versionHistory?.length || 0) + 1,
        version: surveyData.version,
        timestamp: surveyData.updatedAt,
        author: user?.name || 'Anonymous',
        changes: 'Auto-save'
      };
      
      setVersionHistory(prev => [newVersion, ...(prev || []).slice(0, 9)]); // Keep last 10 versions
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [survey, user, versionHistory.length]);

  const loadSurvey = async () => {
    try {
      // Load existing survey from API
      // const response = await api.get('/survey/builder');
      // setSurvey(response.data);
    } catch (error) {
      console.error('Failed to load survey:', error);
    }
  };

  const setupAutoSave = useCallback(() => {
    // Setup auto-save functionality
    const autoSaveInterval = setInterval(() => {
      if (autoSave && isOnline && (survey.questions || []).length > 0) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [autoSave, isOnline, (survey.questions || []).length, handleAutoSave]);

  useEffect(() => {
    loadSurvey();
    setupAutoSave();
    setupOnlineStatus();
    loadCollaborators();
    loadVersionHistory();
  }, [setupAutoSave]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && (survey.questions || []).length > 0) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [survey, autoSave, handleAutoSave]);

  const setupOnlineStatus = () => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  const loadCollaborators = async () => {
    try {
      // Load collaborators from API
      // const response = await api.get('/survey/collaborators');
      // setCollaborators(response.data);
      setCollaborators([
        { id: '1', name: 'John Smith', email: 'john@company.com', role: 'owner', avatar: '', isOnline: true },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'editor', avatar: '', isOnline: false }
      ]);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    }
  };

  const loadVersionHistory = async () => {
    try {
      // Load version history from API
      setVersionHistory([
        { id: 1, version: 1, timestamp: new Date().toISOString(), author: 'John Smith', changes: 'Initial version' },
        { id: 2, version: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), author: 'Sarah Johnson', changes: 'Added conditional logic' }
      ]);
    } catch (error) {
      console.error('Failed to load version history:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // await api.post('/survey/builder', survey);
      toast.success('Survey saved successfully!');
    } catch (error) {
      toast.error('Failed to save survey');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type) => {
    const questionType = questionTypes.find(qt => qt.id === type);
    const newQuestion = {
      id: `q_${Date.now()}`,
      type,
      title: questionType?.name || 'New Question',
      description: '',
      required: false,
      placeholder: '',
      helpText: '',
      options: getDefaultOptions(type),
      validation: getDefaultValidation(type),
      displayOptions: {
        showTitle: true,
        showDescription: true,
        showHelpText: false,
        randomizeOptions: false,
        allowOther: false,
        otherLabel: 'Other',
        allowMultipleSelections: type === 'checkbox',
        minSelections: type === 'checkbox' ? 0 : 1,
        maxSelections: type === 'checkbox' ? null : 1,
        layout: 'vertical', // vertical, horizontal, grid
        showAsDropdown: type === 'multiple_choice' ? false : true,
        scaleType: type === 'rating' ? 'stars' : 'numbers',
        scaleMin: type === 'rating' || type === 'slider' ? 1 : 0,
        scaleMax: type === 'rating' || type === 'slider' ? 5 : 10,
        scaleStep: 1,
        showLabels: true,
        leftLabel: '',
        rightLabel: '',
        allowComments: false,
        commentLabel: 'Additional comments'
      },
      advanced: {
        skipLogic: [],
        piping: false,
        calculation: '',
        customCSS: '',
        tags: [],
        metadata: {}
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSurvey(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
      updatedAt: new Date().toISOString()
    }));

    setSelectedQuestion(newQuestion.id);
    toast.success(`${questionType?.name || 'Question'} added successfully!`);
  };

  const getDefaultOptions = (type) => {
    switch (type) {
      case 'multiple_choice':
      case 'checkbox':
      case 'dropdown':
        return ['Option 1', 'Option 2', 'Option 3'];
      case 'rating':
      case 'slider':
        return [];
      case 'likert':
        return ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
      case 'nps':
        return Array.from({ length: 11 }, (_, i) => i.toString());
      case 'matrix':
        return {
          rows: ['Quality', 'Service', 'Value'],
          columns: ['Poor', 'Fair', 'Good', 'Excellent']
        };
      case 'ranking':
        return ['Option 1', 'Option 2', 'Option 3'];
      default:
        return [];
    }
  };

  const getDefaultValidation = (type) => {
    const baseValidation = {
      required: false,
      customMessage: '',
      minLength: 0,
      maxLength: type === 'textarea' ? 5000 : 255
    };

    switch (type) {
      case 'text':
      case 'textarea':
        return {
          ...baseValidation,
          pattern: '',
          minWords: 0,
          maxWords: type === 'textarea' ? 500 : 50
        };
      case 'email':
        return {
          ...baseValidation,
          pattern: 'email'
        };
      case 'phone':
        return {
          ...baseValidation,
          pattern: 'phone'
        };
      case 'url':
        return {
          ...baseValidation,
          pattern: 'url'
        };
      case 'number':
        return {
          ...baseValidation,
          min: null,
          max: null,
          step: 1,
          decimals: 0
        };
      case 'rating':
      case 'slider':
        return {
          ...baseValidation,
          min: 1,
          max: 5
        };
      case 'file_upload':
        return {
          ...baseValidation,
          allowedTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
          maxSize: 10 * 1024 * 1024, // 10MB
          maxFiles: 1
        };
      default:
        return baseValidation;
    }
  };


  const deleteQuestion = (questionId) => {
    setSurvey(prev => ({
      ...prev,
      questions: (prev.questions || []).filter(q => q.id !== questionId)
    }));
    
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    }
    toast.success('Question deleted successfully!');
  };

  const duplicateQuestion = (questionId) => {
    const question = (survey.questions || []).find(q => q.id === questionId);
    if (question) {
      const duplicatedQuestion = {
        ...question,
        id: `q_${Date.now()}`,
        title: `${question.title} (Copy)`
      };
      
      setSurvey(prev => ({
        ...prev,
        questions: [...(prev.questions || []), duplicatedQuestion]
      }));
      toast.success('Question duplicated successfully!');
    }
  };

  const moveQuestion = (questionId, direction) => {
    const questions = [...(survey.questions || [])];
    const index = questions.findIndex(q => q.id === questionId);
    
    if (direction === 'up' && index > 0) {
      [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }
    
    setSurvey(prev => ({ ...prev, questions }));
  };




  // Integration Functions
  const addWebhook = (webhookData) => {
    const newWebhook = {
      id: `webhook_${Date.now()}`,
      ...webhookData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setIntegrations(prev => ({
      ...prev,
      webhooks: [...(prev?.webhooks || []), newWebhook]
    }));
    toast.success('Webhook added successfully!');
  };

  const toggleWebhook = (webhookId) => {
    setIntegrations(prev => ({
      ...prev,
      webhooks: (prev?.webhooks || []).map(webhook =>
        webhook.id === webhookId ? { ...webhook, isActive: !webhook.isActive } : webhook
      )
    }));
  };


  // Filter and search functions
  const filteredQuestionTypes = questionTypes.filter(type => {
    if (!searchQuery) return true;
    return type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           type.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedQuestions = [...(survey.questions || [])].sort((a, b) => {
    switch (sortBy) {
      case 'type':
        return sortOrder === 'asc' 
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      case 'title':
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      case 'order':
      default:
        return sortOrder === 'asc'
          ? (survey.questions || []).indexOf(a) - (survey.questions || []).indexOf(b)
          : (survey.questions || []).indexOf(b) - (survey.questions || []).indexOf(a);
    }
  });

  const getQuestionTypeIcon = (type) => {
    const questionType = questionTypes.find(qt => qt.id === type);
    return questionType?.icon || <FileText className="w-4 h-4" />;
  };

  const renderBuilderTab = () => (
    <div className="space-y-6">
      {/* Survey Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title</label>
            <input
              type="text"
              value={survey.title}
              onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
              placeholder="Enter survey title"
            />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={survey.category}
                onChange={(e) => setSurvey(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="customer-satisfaction">Customer Satisfaction</option>
                <option value="employee-feedback">Employee Feedback</option>
                <option value="market-research">Market Research</option>
                <option value="event-feedback">Event Feedback</option>
                <option value="product-feedback">Product Feedback</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={survey.description}
              onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter survey description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={survey.tags.join(', ')}
              onChange={(e) => setSurvey(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tags separated by commas"
            />
          </div>
        </div>
      </div>

      {/* Question Types with Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Questions
        </h3>
        
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                placeholder="Search question types..."
              />
            </div>

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
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <button
            onClick={() => setSearchQuery('')}
            className={`px-3 py-1 rounded-full text-sm ${
              !searchQuery ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSearchQuery('basic')}
            className={`px-3 py-1 rounded-full text-sm ${
              searchQuery === 'basic' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setSearchQuery('advanced')}
            className={`px-3 py-1 rounded-full text-sm ${
              searchQuery === 'advanced' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Advanced
          </button>
        </div>
        
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredQuestionTypes.map(type => (
            <motion.button
              key={type.id}
              onClick={() => addQuestion(type.id)}
              className={`p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left ${
                type.isAdvanced ? 'border-purple-200 bg-purple-50' : ''
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`flex items-center gap-3 mb-2 ${viewMode === 'list' ? 'justify-between' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  type.isAdvanced ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                <span className="font-medium text-gray-900">{type.name}</span>
                  {type.isAdvanced && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                      Advanced
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{type.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Questions List with Sorting */}
      <div className="space-y-4">
        {(survey.questions || []).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {(survey.questions || []).length} question{(survey.questions || []).length !== 1 ? 's' : ''}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="order">Order</option>
                    <option value="type">Type</option>
                    <option value="title">Title</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {sortedQuestions.map((question, index) => {
          const originalIndex = (survey.questions || []).findIndex(q => q.id === question.id);
          return (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
              selectedQuestion === question.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedQuestion(question.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 font-semibold">
                    {originalIndex + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                      {getQuestionTypeIcon(question.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{question.title}</h4>
                  <p className="text-sm text-gray-600 capitalize">{question.type.replace('_', ' ')}</p>
                </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                {question.required && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Required
                  </span>
                )}
                    {question.advanced?.skipLogic && question.advanced.skipLogic.length > 0 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Logic
                      </span>
                    )}
                    {questionTypes.find(qt => qt.id === question.type)?.isAdvanced && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Advanced
                  </span>
                )}
                  </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveQuestion(question.id, 'up');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    disabled={originalIndex === 0}
                >
                  <Move className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveQuestion(question.id, 'down');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    disabled={originalIndex === (survey.questions || []).length - 1}
                >
                  <Move className="w-4 h-4 -rotate-90" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateQuestion(question.id);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(question.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
                {question.description && (
                  <p className="text-sm text-gray-600 mb-3">{question.description}</p>
                )}
                
              {question.type === 'multiple_choice' && (
                <div className="space-y-2">
                  {(question.options || []).map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input type="radio" disabled className="text-blue-600" />
                      <span className="text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {(question.options || []).map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input type="checkbox" disabled className="text-blue-600" />
                      <span className="text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              )}
                
                {question.type === 'rating' && (
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-gray-300" />
                    ))}
                  </div>
                )}
                
                {question.type === 'slider' && (
                  <div className="space-y-2">
                    <input type="range" disabled className="w-full" min="1" max="10" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1</span>
                      <span>10</span>
                    </div>
                </div>
              )}
              
              {(question.type === 'text' || question.type === 'textarea') && (
                <input
                  type="text"
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                  placeholder={`Enter ${question.type === 'textarea' ? 'long' : 'short'} text`}
                />
              )}

                {question.type === 'matrix' && (
                  <div className="text-sm text-gray-600">
                    Matrix question with {question.options?.rows?.length || 0} rows and {question.options?.columns?.length || 0} columns
                  </div>
              )}
            </div>
          </motion.div>
          );
        })}

        {(survey.questions || []).length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-600 mb-4">Start building your survey by adding questions above</p>
          </div>
        )}
      </div>
    </div>
  );



  const renderStylingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Settings */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {['modern', 'classic', 'minimal', 'colorful'].map(theme => (
                <button
                  key={theme}
                  onClick={() => setSurvey(prev => ({ 
                    ...prev, 
                    styling: { ...prev.styling, theme } 
                  }))}
                  className={`p-4 border-2 rounded-lg text-center capitalize transition-all ${
                    survey.styling.theme === theme
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={survey.styling.primaryColor}
                onChange={(e) => setSurvey(prev => ({ 
                  ...prev, 
                  styling: { ...prev.styling, primaryColor: e.target.value } 
                }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={survey.styling.primaryColor}
                onChange={(e) => setSurvey(prev => ({ 
                  ...prev, 
                  styling: { ...prev.styling, primaryColor: e.target.value } 
                }))}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={survey.styling.backgroundColor}
                onChange={(e) => setSurvey(prev => ({ 
                  ...prev, 
                  styling: { ...prev.styling, backgroundColor: e.target.value } 
                }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={survey.styling.backgroundColor}
                onChange={(e) => setSurvey(prev => ({ 
                  ...prev, 
                  styling: { ...prev.styling, backgroundColor: e.target.value } 
                }))}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select
              value={survey.styling.fontFamily}
              onChange={(e) => setSurvey(prev => ({ 
                ...prev, 
                styling: { ...prev.styling, fontFamily: e.target.value } 
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
          <div 
            className="border border-gray-200 rounded-lg p-6 space-y-4"
            style={{ 
              backgroundColor: survey.styling.backgroundColor,
              fontFamily: survey.styling.fontFamily
            }}
          >
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: survey.styling.primaryColor }}>
                {survey.title || 'Survey Title'}
              </h2>
              <p className="text-gray-600">
                {survey.description || 'Survey description goes here'}
              </p>
            </div>

            {(survey.questions || []).slice(0, 2).map((question, index) => (
              <div key={question.id} className="space-y-2">
                <label className="block font-medium text-gray-900">
                  {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {question.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {(question.options || []).map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          disabled 
                          className="text-blue-600"
                          style={{ accentColor: survey.styling.primaryColor }}
                        />
                        <span className="text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'text' && (
                  <input
                    type="text"
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    placeholder="Enter your answer"
                  />
                )}
              </div>
            ))}

            <button
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: survey.styling.primaryColor }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Behavior</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Allow Back Navigation</label>
                  <p className="text-sm text-gray-600">Users can go back to previous questions</p>
                </div>
                <input
                  type="checkbox"
                  checked={survey.settings.allowBackNavigation}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allowBackNavigation: e.target.checked }
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Show Progress Bar</label>
                  <p className="text-sm text-gray-600">Display survey completion progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={survey.settings.showProgressBar}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, showProgressBar: e.target.checked }
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Randomize Questions</label>
                  <p className="text-sm text-gray-600">Show questions in random order</p>
                </div>
                <input
                  type="checkbox"
                  checked={survey.settings.randomizeQuestions}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, randomizeQuestions: e.target.checked }
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Require Login</label>
                  <p className="text-sm text-gray-600">Users must be logged in to take survey</p>
                </div>
                <input
                  type="checkbox"
                  checked={survey.settings.requireLogin}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, requireLogin: e.target.checked }
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Limits</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-900 mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={survey.settings.timeLimit}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, timeLimit: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0 = no limit"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">Max Responses</label>
                <input
                  type="number"
                  value={survey.settings.maxResponses}
                  onChange={(e) => setSurvey(prev => ({
                    ...prev,
                    settings: { ...prev.settings, maxResponses: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0 = unlimited"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Advanced Features
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Conditional Logic</h4>
                  <p className="text-sm text-blue-800">Show/hide questions based on answers</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Custom Styling</h4>
                  <p className="text-sm text-blue-800">Brand your surveys with custom themes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Advanced Analytics</h4>
                  <p className="text-sm text-blue-800">Detailed response analysis and insights</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">API Integration</h4>
                  <p className="text-sm text-blue-800">Connect with external systems</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Survey Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{(survey.questions || []).length}</div>
                <div className="text-sm text-green-800">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{(survey.conditionalLogic || []).length}</div>
                <div className="text-sm text-green-800">Logic Rules</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="max-w-2xl mx-auto">
          <div 
            className="space-y-8"
            style={{ 
              backgroundColor: survey.styling.backgroundColor,
              fontFamily: survey.styling.fontFamily
            }}
          >
            {/* Survey Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4" style={{ color: survey.styling.primaryColor }}>
                {survey.title}
              </h1>
              {survey.description && (
                <p className="text-gray-600 text-lg">{survey.description}</p>
              )}
            </div>

            {/* Progress Bar */}
            {survey.settings.showProgressBar && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: '33%',
                    backgroundColor: survey.styling.primaryColor 
                  }}
                ></div>
              </div>
            )}

            {/* Questions Preview */}
            <div className="space-y-6">
              {(survey.questions || []).slice(0, 3).map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <label className="block text-lg font-medium text-gray-900">
                    {index + 1}. {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {question.description && (
                    <p className="text-gray-600">{question.description}</p>
                  )}
                  
                  {question.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {(question.options || []).map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`question_${question.id}`}
                            className="text-blue-600"
                            style={{ accentColor: survey.styling.primaryColor }}
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'checkbox' && (
                    <div className="space-y-3">
                      {(question.options || []).map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="text-blue-600"
                            style={{ accentColor: survey.styling.primaryColor }}
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ 
                        focusRingColor: survey.styling.primaryColor,
                        '--tw-ring-color': survey.styling.primaryColor
                      }}
                      placeholder="Enter your answer"
                    />
                  )}
                  
                  {question.type === 'textarea' && (
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      rows={4}
                      placeholder="Enter your answer"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <button
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={!survey.settings.allowBackNavigation}
              >
                Previous
              </button>
              
              <button
                className="px-6 py-3 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: survey.styling.primaryColor }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add missing tab render functions
  const renderCollaborationTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Team Collaboration</h2>
            <p className="text-green-100">Work together with your team in real-time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Collaborators</h3>
          <div className="space-y-3">
            {(collaborators || []).map((collaborator) => (
              <div key={collaborator.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  {collaborator.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                  <p className="text-sm text-gray-600">{collaborator.role}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  collaborator.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {collaborator.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John edited question 3</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sarah added a new question</p>
                <p className="text-xs text-gray-600">5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <LinkIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Integrations & Webhooks</h2>
            <p className="text-orange-100">Connect with external services and automate workflows</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Webhooks</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Send real-time data to your systems</p>
          <button 
            onClick={() => addWebhook({ name: 'Response Webhook', url: 'https://api.example.com/webhook', events: ['response_completed'] })}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Sample Webhook
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cloud Storage</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Sync with Google Drive, Dropbox</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Connect Storage
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Email Marketing</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Integrate with Mailchimp, SendGrid</p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            Setup Email
          </button>
        </div>
      </div>

      {/* Configured Webhooks */}
      {(integrations?.webhooks || []).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configured Webhooks</h3>
          <div className="space-y-3">
            {(integrations?.webhooks || []).map((webhook) => (
              <div key={webhook.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{webhook.name}</h4>
                  <p className="text-sm text-gray-600">{webhook.url}</p>
                  <p className="text-xs text-gray-500">Events: {(webhook.events || []).join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {webhook.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleWebhook(webhook.id)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      webhook.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {webhook.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                Advanced Survey Builder
              </h1>
                
                {/* Status Indicators */}
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <Wifi className="w-3 h-3" />
                      Online
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      <WifiOff className="w-3 h-3" />
                      Offline
                    </div>
                  )}
                  
                  {autoSave && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      <Save className="w-3 h-3" />
                      Auto-save
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <p className="text-gray-600">{survey.title}</p>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  v{survey.version}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                  {(survey.questions || []).length} questions
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Collaborators */}
              <div className="flex items-center gap-2">
                {(collaborators || []).slice(0, 3).map((collaborator) => (
                  <div key={collaborator.id} className="relative">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    {collaborator.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                ))}
                {(collaborators || []).length > 3 && (
                  <span className="text-sm text-gray-600">+{(collaborators || []).length - 3}</span>
                )}
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Survey'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            
            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Survey Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-medium">{(survey.questions || []).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Logic Rules</span>
                  <span className="font-medium">{(survey.conditionalLogic || []).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">v{survey.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    survey.status === 'draft' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : survey.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {survey.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Version History */}
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Changes</h3>
              <div className="space-y-2">
                {(versionHistory || []).slice(0, 3).map((version) => (
                  <div key={version.id} className="text-sm">
                    <div className="font-medium text-gray-900">{version.changes}</div>
                    <div className="text-gray-600 text-xs">{version.author} • {new Date(version.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'builder' && renderBuilderTab()}
                {activeTab === 'styling' && renderStylingTab()}
                {activeTab === 'collaboration' && renderCollaborationTab()}
                {activeTab === 'integrations' && renderIntegrationsTab()}
                {activeTab === 'settings' && renderSettingsTab()}
                {activeTab === 'preview' && renderPreviewTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSurveyBuilder;
