import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Eye,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Globe,
  Lock,
  Users,
  FileText,
  Layers,
  Crown,
  Settings,
  Download,
  Share2,
  Calendar,
  BarChart3,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Clock,
  Heart,
  GraduationCap
} from 'lucide-react';

const TemplateManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filter, setFilter] = useState('all'); // all, mine, public, favorites
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [user, filter, selectedCategory]);

  const fetchTemplates = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let response;
      
      switch (filter) {
        case 'mine':
          response = await api.templates.getUserTemplates(user.id);
          break;
        case 'public':
          response = await api.templates.getTemplates(null, { 
            category: selectedCategory 
          });
          break;
        default:
          response = await api.templates.getTemplates(user.id, { 
            category: selectedCategory 
          });
      }
      
      if (response.error) {
        toast.error('Failed to load templates');
        console.error('Error:', response.error);
      } else {
        setTemplates(response.templates || []);
      }
    } catch (error) {
      toast.error('Failed to load templates');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.templates.getTemplateCategories();
      if (!response.error) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateTemplate = () => {
    navigate('/app/template-wizard');
  };

  const handleCreateTemplateAdvanced = () => {
    navigate('/app/template-editor/new');
  };

  const handleEditTemplate = (templateId) => {
    navigate(`/app/template-editor/${templateId}`);
  };

  const handleCloneTemplate = async (template) => {
    try {
      const response = await api.templates.cloneTemplate(
        template.id, 
        user.id, 
        `${template.title} (Copy)`
      );
      
      if (response.error) {
        toast.error('Failed to clone template');
      } else {
        toast.success('Template cloned successfully!');
        navigate(`/app/builder/${response.survey.id}`);
      }
    } catch (error) {
      toast.error('Failed to clone template');
      console.error('Error:', error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.templates.deleteTemplate(templateId);
      if (response.error) {
        toast.error('Failed to delete template');
      } else {
        toast.success('Template deleted successfully');
        fetchTemplates(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to delete template');
      console.error('Error:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedTemplates.length === 0) {
      toast.error('Please select templates first');
      return;
    }

    const confirmMessage = {
      delete: 'Are you sure you want to delete the selected templates? This action cannot be undone.',
      clone: 'Clone the selected templates as new surveys?'
    };

    if (!window.confirm(confirmMessage[action])) return;

    try {
      const promises = selectedTemplates.map(templateId => {
        const template = templates.find(t => t.id === templateId);
        switch (action) {
          case 'delete':
            return api.templates.deleteTemplate(templateId);
          case 'clone':
            return api.templates.cloneTemplate(templateId, user.id, `${template.title} (Copy)`);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      toast.success(`Successfully ${action}d ${selectedTemplates.length} template(s)`);
      setSelectedTemplates([]);
      fetchTemplates();
    } catch (error) {
      toast.error(`Failed to ${action} templates`);
      console.error('Error:', error);
    }
  };

  const toggleTemplateSelection = (templateId) => {
    setSelectedTemplates(prev => {
      return prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId];
    });
  };

  const filteredTemplates = templates
    .filter(template => 
      template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.template_category?.toLowerCase().includes(searchTerm.toLowerCase())
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
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'customer-feedback': Users,
      'employee-survey': FileText,
      'market-research': BarChart3,
      'event-feedback': Calendar,
      'product-feedback': Star,
      'education': GraduationCap,
      'healthcare': Heart,
      'nonprofit': Globe
    };
    
    const IconComponent = iconMap[category] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
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
              <Layers className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Template Manager</h1>
                <p className="text-gray-600 mt-1">Create, edit, and manage survey templates</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateTemplate}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
            
            <button
              onClick={handleCreateTemplateAdvanced}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Editor</span>
            </button>
          </div>
        </motion.div>

        {/* Filters and Search */}
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
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
                />
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Templates</option>
                <option value="mine">My Templates</option>
                <option value="public">Public Templates</option>
              </select>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="updated_at-desc">Recently Updated</option>
                <option value="created_at-desc">Recently Created</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchTemplates}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTemplates.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedTemplates.length} template{selectedTemplates.length !== 1 ? 's' : ''} selected
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('clone')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Clone Selected</span>
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedTemplates([])}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No templates match "${searchTerm}"`
                : filter === 'mine' 
                  ? "You haven't created any templates yet. Create your first template to get started!"
                  : "No templates available in this category."
              }
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCreateTemplate}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
              
              {filter === 'mine' && (
                <button
                  onClick={() => setFilter('public')}
                  className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Browse Public Templates</span>
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'flex items-center p-6' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    {/* Template Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              checked={selectedTemplates.includes(template.id)}
                              onChange={() => toggleTemplateSelection(template.id)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(template.template_category)}
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {template.template_category?.replace('-', ' ') || 'General'}
                              </span>
                              {template.is_public ? (
                                <Globe className="w-4 h-4 text-green-600" title="Public Template" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" title="Private Template" />
                              )}
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {template.title || 'Untitled Template'}
                          </h3>
                          
                          {template.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {template.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Template Stats */}
                    <div className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {template.questions?.length || 0}
                          </div>
                          <div className="text-xs text-gray-600">Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {template.estimated_time || '5 min'}
                          </div>
                          <div className="text-xs text-gray-600">Est. Time</div>
                        </div>
                      </div>
                    </div>

                    {/* Template Actions */}
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Updated: {formatDate(template.updated_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCloneTemplate(template)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex-1 justify-center"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Use Template</span>
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditTemplate(template.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <Link
                            to={`/app/preview/${template.id}`}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          
                          {template.user_id === user.id && (
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <>
                    <div className="flex items-center space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => toggleTemplateSelection(template.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getCategoryIcon(template.template_category)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {template.title || 'Untitled Template'}
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {template.template_category?.replace('-', ' ') || 'General'}
                          </span>
                          {template.is_public ? (
                            <Globe className="w-4 h-4 text-green-600" title="Public Template" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" title="Private Template" />
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">
                          {template.description || 'No description provided'}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{template.questions?.length || 0} questions</span>
                          <span>Updated {formatDate(template.updated_at)}</span>
                          <span>{template.estimated_time || '5 min'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCloneTemplate(template)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Use Template</span>
                        </button>
                        
                        <button
                          onClick={() => handleEditTemplate(template.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <Link
                          to={`/app/preview/${template.id}`}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {template.user_id === user.id && (
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateManager;
