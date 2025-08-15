import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Copy,
  Eye,
  Settings,
  FileText,
  Users,
  Calendar,
  Star,
  ShoppingCart,
  Heart,
  GraduationCap,
  Building,
  Target,
  Home,
  Music,
  Camera,
  Utensils,
  Plane,
  Car,
  Gift,
  Award,
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/axios';
const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [ ] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  // Template form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'customer-feedback',
    icon: 'Star',
    questions: [],
    fields: [],
    features: [],
    estimatedTime: '2-3 minutes',
    targetAudience: '',
    templateType: 'survey'
  });
  const categories = [
    { id: 'customer-feedback', name: 'Customer Feedback', icon: <Star className="w-4 h-4" /> },
    { id: 'employee', name: 'Employee', icon: <Users className="w-4 h-4" /> },
    { id: 'academic', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'health', name: 'Health & Wellness', icon: <Heart className="w-4 h-4" /> },
    { id: 'event', name: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'community', name: 'Community', icon: <Target className="w-4 h-4" /> },
    { id: 'product-feedback', name: 'Product Feedback', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'business', name: 'Business', icon: <Building className="w-4 h-4" /> },
    { id: 'social', name: 'Social', icon: <Heart className="w-4 h-4" /> },
    { id: 'entertainment', name: 'Entertainment', icon: <Music className="w-4 h-4" /> },
    { id: 'travel', name: 'Travel', icon: <Plane className="w-4 h-4" /> },
    { id: 'wedding', name: 'Wedding', icon: <Heart className="w-4 h-4" /> },
    { id: 'training', name: 'Training', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'virtual', name: 'Virtual', icon: <Globe className="w-4 h-4" /> },
    { id: 'wellness', name: 'Wellness', icon: <Heart className="w-4 h-4" /> },
    { id: 'conference', name: 'Conference', icon: <Building className="w-4 h-4" /> }
  ];
  const icons = [
    { name: 'Star', component: <Star className="w-4 h-4" /> },
    { name: 'Users', component: <Users className="w-4 h-4" /> },
    { name: 'Calendar', component: <Calendar className="w-4 h-4" /> },
    { name: 'ShoppingCart', component: <ShoppingCart className="w-4 h-4" /> },
    { name: 'Heart', component: <Heart className="w-4 h-4" /> },
    { name: 'GraduationCap', component: <GraduationCap className="w-4 h-4" /> },
    { name: 'Building', component: <Building className="w-4 h-4" /> },
    { name: 'Target', component: <Target className="w-4 h-4" /> },
    { name: 'Home', component: <Home className="w-4 h-4" /> },
    { name: 'Music', component: <Music className="w-4 h-4" /> },
    { name: 'Camera', component: <Camera className="w-4 h-4" /> },
    { name: 'Utensils', component: <Utensils className="w-4 h-4" /> },
    { name: 'Plane', component: <Plane className="w-4 h-4" /> },
    { name: 'Car', component: <Car className="w-4 h-4" /> },
    { name: 'Gift', component: <Gift className="w-4 h-4" /> },
    { name: 'Award', component: <Award className="w-4 h-4" /> },
    { name: 'Globe', component: <Globe className="w-4 h-4" /> },
    { name: 'Zap', component: <Zap className="w-4 h-4" /> }
  ];
  const questionTypes = [
    { id: 'text', name: 'Text Input', icon: <FileText className="w-4 h-4" /> },
    { id: 'multiple-choice', name: 'Multiple Choice', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'rating', name: 'Rating Scale', icon: <Star className="w-4 h-4" /> },
    { id: 'yes-no', name: 'Yes/No', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'emoji-scale', name: 'Emoji Scale', icon: <Star className="w-4 h-4" /> }
  ];
  useEffect(() => {
    if (id && id !== 'new') {
      fetchTemplate();
    } else {
      // New 
      setTemplate({ id: 'new', name: 'New Template', description: '', category: 'customer-feedback' });
    }
  }, [id, fetchTemplate]);
  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/templates/${id}`);
      const templateData = response.data;
      setTemplate(templateData);
      setFormData({
        name: templateData.name || '',
        description: templateData.description || '',
        category: templateData.category || 'customer-feedback',
        icon: templateData.icon || 'Star',
        questions: templateData.questions || [],
        fields: templateData.fields || [],
        features: templateData.features || [],
        estimatedTime: templateData.estimatedTime || '2-3 minutes',
        targetAudience: templateData.targetAudience || '',
        templateType: templateData.templateType || 'survey'
      });
    } catch (error) {
      console.error('Error fetching :', error);
      toast.error('Failed to load ');
      navigate('/app/templates');
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const templateData = {
        ...formData,
        questions: formData.questions.map((q, index) => ({ ...q, order: index }))
      };
      if (id === 'new') {
        // Create new 
        const response = await api.post('/api/templates', templateData);
        toast.success('Template created successfully!');
        navigate(`/app/templates/${response.data.id}/edit`);
      } else {
        // Update existing 
        await api.put(`/api/templates/${id}`, templateData);
        toast.success('Template updated successfully!');
      }
    } catch (error) {
      console.error('Error saving :', error);
      toast.error('Failed to save ');
    } finally {
      setSaving(false);
    }
  };
  const handleDuplicate = async () => {
    try {
      setSaving(true);
      await api.post(`/api/templates/${id}/duplicate`, {
        name: `${formData.name} (Copy)`,
        description: formData.description
      });
      toast.success('Template duplicated successfully');
      navigate('/app/templates');
    } catch (error) {
      console.error('Error duplicating :', error);
      toast.error('Failed to duplicate ');
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ? This action cannot be undone.')) {
      return;
    }
    try {
      setSaving(true);
      await api.delete(`/api/templates/${id}`);
      toast.success('Template deleted successfully');
      navigate('/app/templates');
    } catch (error) {
      console.error('Error deleting :', error);
      toast.error('Failed to delete ');
    } finally {
      setSaving(false);
    }
  };
  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: '',
      required: false,
      options: type === 'emoji-scale' ? [
        { emoji: '😠', label: 'Very Unsatisfied', value: 1 },
        { emoji: '😞', label: 'Unsatisfied', value: 2 },
        { emoji: '😐', label: 'Neutral', value: 3 },
        { emoji: '🙂', label: 'Satisfied', value: 4 },
        { emoji: '🥰', label: 'Very Satisfied', value: 5 }
      ] : type === 'rating' ? ['1', '2', '3', '4', '5'] : [],
      settings: {}
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setShowQuestionModal(false);
  };
  const updateQuestion = (questionId, updates) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };
  const deleteQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };
  const duplicateQuestion = (question) => {
    const duplicated = {
      ...question,
      id: Date.now(),
      question: `${question.question} (Copy)`
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, duplicated]
    }));
  };
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Star': <Star className="w-6 h-6" />,
      'Users': <Users className="w-6 h-6" />,
      'Calendar': <Calendar className="w-6 h-6" />,
      'ShoppingCart': <ShoppingCart className="w-6 h-6" />,
      'Heart': <Heart className="w-6 h-6" />,
      'GraduationCap': <GraduationCap className="w-6 h-6" />,
      'Building': <Building className="w-6 h-6" />,
      'Target': <Target className="w-6 h-6" />,
      'Home': <Home className="w-6 h-6" />,
      'Music': <Music className="w-6 h-6" />,
      'Camera': <Camera className="w-6 h-6" />,
      'Utensils': <Utensils className="w-6 h-6" />,
      'Plane': <Plane className="w-6 h-6" />,
      'Car': <Car className="w-6 h-6" />,
      'Gift': <Gift className="w-6 h-6" />,
      'Award': <Award className="w-6 h-6" />,
      'Globe': <Globe className="w-6 h-6" />,
      'Zap': <Zap className="w-6 h-6" />
    };
    return iconMap[iconName] || <FileText className="w-6 h-6" />;
  };
  const renderQuestionEditor = (question) => {
    return (
      <div className="bg-white rounded-lg border p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {questionTypes.find(t => t.id === question.type)?.icon}
            <span className="font-medium">{questionTypes.find(t => t.id === question.type)?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => duplicateQuestion(question)}
              className="p-1 text-gray-500 hover:text-blue-600"
              title="Duplicate question"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteQuestion(question.id)}
              className="p-1 text-gray-500 hover:text-red-600"
              title="Delete question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text
            </label>
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your question..."
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>
          </div>
          {(question.type === 'multiple-choice' || question.type === 'rating' || question.type === 'emoji-scale') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options
              </label>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[index] = e.target.value;
                        updateQuestion(question.id, { options: newOptions });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newOptions = question.options.filter((_, i) => i !== index);
                        updateQuestion(question.id, { options: newOptions });
                      }}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...question.options, ''];
                    updateQuestion(question.id, { options: newOptions });
                  }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ...</p>
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
            <div className="flex items-center space-x-4">
              <Link to="/app/templates" className="btn-secondary">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Templates
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {id === 'new' ? 'Create New Template' : 'Edit Template'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {id === 'new' ? 'Design your custom ' : 'Customize your '}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  previewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              
              {id !== 'new' && (
                <>
                  <button
                    onClick={handleDuplicate}
                    disabled={saving}
                    className="btn-secondary"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="btn-danger"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Settings */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Template Settings
              </h2>
              <div className="space-y-4">
                {/* Template Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name..."
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your ..."
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {icons.map(icon => (
                      <button
                        key={icon.name}
                        onClick={() => setFormData(prev => ({ ...prev, icon: icon.name }))}
                        className={`p-2 rounded-lg border-2 ${
                          formData.icon === icon.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon.component}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Template Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Type
                  </label>
                  <select
                    value={formData.templateType}
                    onChange={(e) => setFormData(prev => ({ ...prev, templateType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="survey">Survey Template</option>
                    <option value="event">Event Template</option>
                    <option value="form">Form Template</option>
                  </select>
                </div>
                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2-3 minutes"
                  />
                </div>
                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Customers, Employees, Students"
                  />
                </div>
              </div>
            </motion.div>
          </div>
          {/* Questions Editor */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Questions ({formData.questions.length})
                </h2>
                
                <button
                  onClick={() => setShowQuestionModal(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </button>
              </div>
              {formData.questions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-600 mb-4">Start building your by adding questions</p>
                  <button
                    onClick={() => setShowQuestionModal(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {renderQuestionEditor(question)}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
        {/* Question Type Modal */}
        <AnimatePresence>
          {showQuestionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Question</h3>
                <div className="space-y-2">
                  {questionTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => addQuestion(type.id)}
                      className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {type.icon}
                      <span className="font-medium">{type.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="w-full mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default TemplateEditor; 