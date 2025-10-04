import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import FormBuilder from '../components/FormBuilder';
import QRCode from 'qrcode';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  QrCode,
  CreditCard,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Settings,
  BarChart3,
  Globe,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import api from '../services/api';

const Forms = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  // Form templates
  const formTemplates = [
    {
      id: 'contact',
      name: 'Contact Form',
      description: 'Basic contact form with name, email, and message fields',
      icon: Mail,
      color: 'blue',
      fields: ['name', 'email', 'phone', 'message'],
      category: 'communication'
    },
    {
      id: 'registration',
      name: 'Registration Form',
      description: 'Event or service registration with personal details',
      icon: Users,
      color: 'green',
      fields: ['name', 'email', 'phone', 'company', 'position', 'dietary'],
      category: 'registration'
    },
    {
      id: 'payment',
      name: 'Payment Form',
      description: 'Payment collection form with Paystack integration',
      icon: CreditCard,
      color: 'purple',
      fields: ['name', 'email', 'phone', 'amount', 'description', 'payment_method'],
      category: 'payment'
    },
    {
      id: 'feedback',
      name: 'Feedback Form',
      description: 'Customer feedback and satisfaction survey',
      icon: Star,
      color: 'yellow',
      fields: ['name', 'email', 'rating', 'feedback', 'category'],
      category: 'feedback'
    },
    {
      id: 'booking',
      name: 'Booking Form',
      description: 'Appointment or service booking form',
      icon: Calendar,
      color: 'indigo',
      fields: ['name', 'email', 'phone', 'service', 'date', 'time', 'notes'],
      category: 'booking'
    },
    {
      id: 'survey',
      name: 'Survey Form',
      description: 'Custom survey with multiple question types',
      icon: BarChart3,
      color: 'pink',
      fields: ['title', 'description', 'questions', 'settings'],
      category: 'survey'
    },
    {
      id: 'lead',
      name: 'Lead Generation',
      description: 'Lead capture form for marketing campaigns',
      icon: Users,
      color: 'teal',
      fields: ['name', 'email', 'phone', 'company', 'interest', 'source'],
      category: 'marketing'
    },
    {
      id: 'support',
      name: 'Support Ticket',
      description: 'Customer support and help desk form',
      icon: AlertCircle,
      color: 'red',
      fields: ['name', 'email', 'subject', 'priority', 'description', 'attachments'],
      category: 'support'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchForms();
    }
  }, [user]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      // Load forms from localStorage (for demo purposes)
      // In production, this would be an API call
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      
      // Add some mock data if no forms exist
      if (savedForms.length === 0) {
        const mockForms = [
          {
            id: 'form_1',
            title: 'Contact Us Form',
            type: 'contact',
            status: 'published',
            responses: 45,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-20T14:22:00Z',
            user_id: user?.id
          },
          {
            id: 'form_2',
            title: 'Event Registration',
            type: 'registration',
            status: 'draft',
            responses: 0,
            created_at: '2024-01-18T09:15:00Z',
            updated_at: '2024-01-18T09:15:00Z',
            user_id: user?.id
          },
          {
            id: 'form_3',
            title: 'Payment Collection',
            type: 'payment',
            status: 'published',
            responses: 23,
            created_at: '2024-01-12T16:45:00Z',
            updated_at: '2024-01-19T11:30:00Z',
            user_id: user?.id
          }
        ];
        setForms(mockForms);
      } else {
        // Filter forms by current user
        const userForms = savedForms.filter(form => form.user_id === user?.id);
        setForms(userForms);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || form.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTemplateIcon = (type) => {
    const template = formTemplates.find(t => t.id === type);
    return template ? template.icon : FileText;
  };

  const getTemplateColor = (type) => {
    const template = formTemplates.find(t => t.id === type);
    return template ? template.color : 'gray';
  };

  const handleCreateForm = (template) => {
    setSelectedTemplate(template);
    setShowCreateModal(false);
    setShowFormBuilder(true);
  };

  const handleFormSave = (formData) => {
    setShowFormBuilder(false);
    setSelectedTemplate(null);
    fetchForms(); // Refresh the forms list
    toast.success('Form saved successfully!');
  };

  const handleEditForm = (form) => {
    // Create a template-like object from the existing form
    const editTemplate = {
      id: form.id,
      name: form.title,
      description: form.description || '',
      fields: form.fields || [],
      settings: form.settings || {}
    };
    
    setSelectedTemplate(editTemplate);
    setShowFormBuilder(true);
  };

  const handleDuplicateForm = (form) => {
    try {
      // Create a duplicate of the form with new ID and title
      const duplicatedForm = {
        ...form,
        id: `form_${Date.now()}`,
        title: `${form.title} (Copy)`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'draft',
        responses: 0
      };

      // Save to localStorage
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
      savedForms.push(duplicatedForm);
      localStorage.setItem('savedForms', JSON.stringify(savedForms));

      // Refresh forms list
      fetchForms();
      toast.success('Form duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating form:', error);
      toast.error('Failed to duplicate form');
    }
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        // Remove from localStorage
        const savedForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
        const updatedForms = savedForms.filter(form => form.id !== formId);
        localStorage.setItem('savedForms', JSON.stringify(updatedForms));

        // Refresh forms list
        fetchForms();
        toast.success('Form deleted successfully!');
      } catch (error) {
        console.error('Error deleting form:', error);
        toast.error('Failed to delete form');
      }
    }
  };

  const generateQRCode = async (formUrl) => {
    try {
      const qrDataURL = await QRCode.toDataURL(formUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const handleViewForm = (form) => {
    const formUrl = `${window.location.origin}/form/${form.id}`;
    window.open(formUrl, '_blank');
  };

  const handleShareForm = async (form) => {
    setSelectedForm(form);
    const formUrl = `${window.location.origin}/form/${form.id}`;
    await generateQRCode(formUrl);
    setShowShareModal(true);
  };

  const copyFormUrl = (form) => {
    const formUrl = `${window.location.origin}/form/${form.id}`;
    navigator.clipboard.writeText(formUrl);
    toast.success('Form URL copied to clipboard!');
  };

  const downloadQRCode = () => {
    if (qrCodeDataURL && selectedForm) {
      const link = document.createElement('a');
      link.download = `${selectedForm.title}-qrcode.png`;
      link.href = qrCodeDataURL;
      link.click();
      toast.success('QR code downloaded!');
    }
  };

  const shareToSocialMedia = (platform, form) => {
    const formUrl = `${window.location.origin}/form/${form.id}`;
    const text = `Check out this form: ${form.title}`;
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(formUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(formUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + formUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(form.title)}&body=${encodeURIComponent(text + '\n\n' + formUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank');
  };



  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return Globe;
      case 'draft': return Edit;
      case 'archived': return Lock;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
              <p className="text-gray-600 mt-2">Create and manage custom forms with templates</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Form
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {formTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Forms Grid/List */}
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first form'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Form
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredForms.map((form) => {
              const TemplateIcon = getTemplateIcon(form.type);
              const color = getTemplateColor(form.type);
              const StatusIcon = getStatusIcon(form.status);

              return (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'p-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg bg-${color}-100`}>
                          <TemplateIcon className={`w-6 h-6 text-${color}-600`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {form.status}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {formTemplates.find(t => t.id === form.type)?.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{form.responses} responses</span>
                        <span>{new Date(form.updated_at).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t">
                        <button 
                          onClick={() => handleViewForm(form)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button 
                          onClick={() => handleShareForm(form)}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                        <button 
                          onClick={() => copyFormUrl(form)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditForm(form)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDuplicateForm(form)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteForm(form.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-${color}-100`}>
                          <TemplateIcon className={`w-6 h-6 text-${color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                          <p className="text-sm text-gray-600">
                            {formTemplates.find(t => t.id === form.type)?.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{form.responses} responses</div>
                          <div className="text-sm text-gray-500">{new Date(form.updated_at).toLocaleDateString()}</div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {form.status}
                        </span>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewForm(form)}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button 
                            onClick={() => handleShareForm(form)}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                          <button 
                            onClick={() => copyFormUrl(form)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditForm(form)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDuplicateForm(form)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteForm(form.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <FormTemplateModal
            templates={formTemplates}
            onClose={() => setShowCreateModal(false)}
            onSelectTemplate={handleCreateForm}
          />
        )}
      </AnimatePresence>

      {/* Form Builder */}
      {showFormBuilder && (
        <FormBuilder
          template={selectedTemplate}
          onClose={() => {
            setShowFormBuilder(false);
            setSelectedTemplate(null);
          }}
          onSave={handleFormSave}
        />
      )}

      {/* Share Modal */}
      {showShareModal && selectedForm && (
        <FormShareModal
          form={selectedForm}
          qrCodeDataURL={qrCodeDataURL}
          onClose={() => {
            setShowShareModal(false);
            setSelectedForm(null);
            setQrCodeDataURL('');
          }}
          onDownloadQR={downloadQRCode}
          onCopyUrl={() => copyFormUrl(selectedForm)}
          onShareSocial={(platform) => shareToSocialMedia(platform, selectedForm)}
        />
      )}
    </div>
  );
};

// Form Template Selection Modal
const FormTemplateModal = ({ templates, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'communication', name: 'Communication' },
    { id: 'registration', name: 'Registration' },
    { id: 'payment', name: 'Payment' },
    { id: 'feedback', name: 'Feedback' },
    { id: 'booking', name: 'Booking' },
    { id: 'survey', name: 'Survey' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'support', name: 'Support' }
  ];

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose a Form Template</h2>
            <p className="text-gray-600 mt-1">Select a template to get started with your form</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className={`w-12 h-12 bg-${template.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${template.color}-600`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">{template.category}</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Use Template →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Form Share Modal Component
const FormShareModal = ({ form, qrCodeDataURL, onClose, onDownloadQR, onCopyUrl, onShareSocial }) => {
  const formUrl = `${window.location.origin}/form/${form.id}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Share Form</h2>
            <p className="text-gray-600 mt-1">{form.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* QR Code Section */}
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <QrCode className="w-5 h-5 mr-2" />
              QR Code
            </h3>
            
            {qrCodeDataURL ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={qrCodeDataURL} 
                    alt="Form QR Code" 
                    className="border border-gray-200 rounded-lg"
                  />
                </div>
                
                <p className="text-sm text-gray-600">
                  Scan this QR code to access the form
                </p>
                
                <button
                  onClick={onDownloadQR}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-sm text-gray-600">Generating QR code...</p>
              </div>
            )}
          </div>

          {/* URL Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Form URL
            </h3>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={onCopyUrl}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Share2 className="w-5 h-5 mr-2" />
              Share on Social Media
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => onShareSocial('twitter')}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">T</span>
                </div>
                <span className="text-sm font-medium">Twitter</span>
              </button>
              
              <button
                onClick={() => onShareSocial('facebook')}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <span className="text-sm font-medium">Facebook</span>
              </button>
              
              <button
                onClick={() => onShareSocial('linkedin')}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">in</span>
                </div>
                <span className="text-sm font-medium">LinkedIn</span>
              </button>
              
              <button
                onClick={() => onShareSocial('whatsapp')}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">W</span>
                </div>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              
              <button
                onClick={() => onShareSocial('email')}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Embed Code
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HTML Embed</label>
                <textarea
                  value={`<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                  readOnly
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direct Link</label>
                <textarea
                  value={`<a href="${formUrl}" target="_blank">${form.title}</a>`}
                  readOnly
                  rows={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Forms;
