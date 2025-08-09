import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Star, 
  Users, 
  ShoppingCart, 
  Calendar, 
  Globe,
  ArrowRight,
  Sparkles,
  Edit,
  Copy,
  ChevronDown,
  ChevronRight,
  Search,
  Grid,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';

const SurveyTemplates = () => {
  const [categories, setCategories] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTemplates();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/templates/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const createFromTemplate = async (templateId, template) => {
    try {
      setCreating(true);
      const response = await axios.post('/api/templates/create-survey', {
        templateId: template.id,
        title: `${template.title} Survey`,
        description: template.description
      });

      toast.success('Survey created successfully!');
      navigate(`/builder/${response.data.surveyId}`);
    } catch (error) {
      console.error('Error creating survey:', error);
      toast.error('Failed to create survey');
    } finally {
      setCreating(false);
    }
  };

  const duplicateTemplate = async (templateId, template) => {
    try {
      await axios.post(`/api/templates/${templateId}/duplicate`, {
        title: `${template.title} (Copy)`,
        description: template.description
      });
      
      toast.success('Template duplicated successfully!');
      fetchTemplates(); // Refresh the list
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    }
  };

  const toggleCategory = (categoryKey) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };



  const getCategoryColor = (categoryKey) => {
    const colors = {
      customer_satisfaction: 'bg-blue-500',
      market_research: 'bg-green-500',
      employee_surveys: 'bg-purple-500',
      academic_educational: 'bg-indigo-500',
      health_wellness: 'bg-pink-500',
      event_feedback: 'bg-orange-500',
      community_public_opinion: 'bg-teal-500',
      product_service_feedback: 'bg-emerald-500'
    };
    return colors[categoryKey] || 'bg-gray-500';
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory) {
      return template.id.startsWith(selectedCategory) && matchesSearch;
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading survey categories...</p>
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
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Survey Templates</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive collection of survey templates organized by purpose, 
            question format, and data collection method. Each template is designed for specific use cases.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map(categoryKey => (
                <option key={categoryKey} value={categoryKey}>
                  {categories[categoryKey].name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Categories Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              
              <div className="space-y-2">
                {Object.keys(categories).map(categoryKey => {
                  const category = categories[categoryKey];
                  const isExpanded = expandedCategories.has(categoryKey);
                  const categoryTemplates = templates.filter(t => t.id.startsWith(categoryKey));
                  
                  return (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${getCategoryColor(categoryKey)}`}></div>
                          <span className="font-medium text-gray-700">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {categoryTemplates.length}
                          </span>
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-3 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          <div className="space-y-2">
                            {Object.keys(category.subcategories).map(subcategoryKey => {
                              const subcategory = category.subcategories[subcategoryKey];
                              const templateKey = `${categoryKey}_${subcategoryKey}`;
                              const template = templates.find(t => t.id === templateKey);
                              
                              return (
                                <div key={subcategoryKey} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-2">{subcategory.icon}</span>
                                    <div>
                                      <div className="text-sm font-medium text-gray-700">{subcategory.title}</div>
                                      <div className="text-xs text-gray-500">{subcategory.description}</div>
                                    </div>
                                  </div>
                                  {template && (
                                    <button
                                      onClick={() => createFromTemplate(template.id, template)}
                                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                    >
                                      Use
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Templates Grid/List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No templates found</h3>
                <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
                : "space-y-4"
              }>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Template Header */}
                    <div className={`${getCategoryColor(template.id.split('_')[0])} p-6 text-white ${
                      viewMode === 'list' ? 'w-1/3' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{template.icon}</span>
                          <div>
                            <h3 className="text-xl font-semibold">{template.title}</h3>
                            <p className="text-sm opacity-90">{template.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm opacity-90">
                            {template.questions ? template.questions.length : 0} Questions
                          </div>
                          <div className="text-xs opacity-75">
                            {template.questions ? Math.ceil(template.questions.length * 0.5) : 0} min
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Template Content */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      
                      {/* Question Types Summary */}
                      {template.questions && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const types = {};
                              template.questions.forEach(q => {
                                types[q.type] = (types[q.type] || 0) + 1;
                              });
                              return Object.entries(types).map(([type, count]) => (
                                <span key={type} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                                  {type.replace('_', ' ')}: {count}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => createFromTemplate(template.id, template)}
                          disabled={creating}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          {creating ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              Use This Template
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => navigate(`/templates/${template.id}/edit`)}
                            className="btn-secondary text-sm py-2"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => duplicateTemplate(template.id, template)}
                            className="btn-secondary text-sm py-2"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Create Custom Survey */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Don't see what you need?
            </h2>
            <p className="text-gray-600 mb-6">
              Create a custom survey from scratch with our powerful drag & drop builder.
            </p>
            <button
              onClick={() => navigate('/survey-builder')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Custom Survey
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SurveyTemplates; 