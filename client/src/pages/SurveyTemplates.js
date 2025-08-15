import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ArrowRight,
  Sparkles,
  Edit,
  Copy,
  ChevronDown,
  ChevronRight,
  Search,
  Grid,
  List,
  Filter,
  Star,
  Clock,
  Users,
  TrendingUp,
  Eye,
  Download,
  Share2,
  Bookmark,
  BookmarkPlus,
  MessageSquare,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

const SurveyTemplates = () => {
  const [categories, setCategories] = useState({});
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
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
      const response = await axios.post(`/api/templates/${templateId}/create`, {
        title: `${template.title} Survey`,
        description: template.description
      });

      toast.success('Survey created successfully!');
      navigate(`/app/builder/${response.data.surveyId}`);
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
      fetchTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Failed to duplicate template');
    }
  };

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(templateId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
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
      customer_satisfaction: 'from-blue-500 to-blue-600',
      market_research: 'from-green-500 to-green-600',
      employee_surveys: 'from-purple-500 to-purple-600',
      academic_educational: 'from-indigo-500 to-indigo-600',
      health_wellness: 'from-pink-500 to-pink-600',
      event_feedback: 'from-orange-500 to-orange-600',
      community_public_opinion: 'from-teal-500 to-teal-600',
      product_service_feedback: 'from-emerald-500 to-emerald-600'
    };
    return colors[categoryKey] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (categoryKey) => {
    const icons = {
      customer_satisfaction: <MessageSquare className="w-5 h-5" />,
      market_research: <TrendingUp className="w-5 h-5" />,
      employee_surveys: <Users className="w-5 h-5" />,
      academic_educational: <Bookmark className="w-5 h-5" />,
      health_wellness: <Star className="w-5 h-5" />,
      event_feedback: <Clock className="w-5 h-5" />,
      community_public_opinion: <Globe className="w-5 h-5" />,
      product_service_feedback: <Eye className="w-5 h-5" />
    };
    return icons[categoryKey] || <Sparkles className="w-5 h-5" />;
  };

  const sortTemplates = (templates) => {
    switch (sortBy) {
      case 'popular':
        return [...templates].sort((a, b) => (b.usage || 0) - (a.usage || 0));
      case 'newest':
        return [...templates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'name':
        return [...templates].sort((a, b) => a.title.localeCompare(b.title));
      case 'favorites':
        return [...templates].sort((a, b) => {
          const aFav = favorites.has(a.id);
          const bFav = favorites.has(b.id);
          return bFav - aFav;
        });
      default:
        return templates;
    }
  };

  const filteredTemplates = sortTemplates(templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory) {
      return template.id.startsWith(selectedCategory) && matchesSearch;
    }
    
    return matchesSearch;
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading survey templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">Survey Templates</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Choose from our comprehensive collection of professionally designed survey templates. 
            Each template is crafted by experts and optimized for maximum response rates.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>4.9/5 Expert Rating</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-500 mr-1" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-green-500 mr-1" />
              <span>5 min setup</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map(categoryKey => (
                <option key={categoryKey} value={categoryKey}>
                  {categories[categoryKey].name}
                </option>
              ))}
            </select>
          </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest First</option>
                      <option value="name">Alphabetical</option>
                      <option value="favorites">Favorites First</option>
                    </select>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Actions</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setFavorites(new Set())}
                        className="px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Clear Favorites
                      </button>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex gap-8">
          {/* Enhanced Categories Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Categories
              </h3>
              
              <div className="space-y-3">
                {Object.keys(categories).map(categoryKey => {
                  const category = categories[categoryKey];
                  const isExpanded = expandedCategories.has(categoryKey);
                  const categoryTemplates = templates.filter(t => t.id.startsWith(categoryKey));
                  
                  return (
                    <div key={categoryKey} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(categoryKey)} rounded-lg flex items-center justify-center text-white mr-3`}>
                            {getCategoryIcon(categoryKey)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{categoryTemplates.length} templates</div>
                        </div>
                        </div>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                      </button>
                      
                      <AnimatePresence>
                      {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-200 bg-gray-50"
                          >
                            <div className="p-4">
                              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                          <div className="space-y-2">
                            {Object.keys(category.subcategories).map(subcategoryKey => {
                              const subcategory = category.subcategories[subcategoryKey];
                              const templateKey = `${categoryKey}_${subcategoryKey}`;
                              const template = templates.find(t => t.id === templateKey);
                              
                              return (
                                    <div key={subcategoryKey} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                  <div className="flex items-center">
                                        <span className="text-lg mr-3">{subcategory.icon}</span>
                                    <div>
                                          <div className="text-sm font-medium text-gray-900">{subcategory.title}</div>
                                      <div className="text-xs text-gray-500">{subcategory.description}</div>
                                    </div>
                                  </div>
                                  {template && (
                                    <button
                                      onClick={() => createFromTemplate(template.id, template)}
                                          className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                                    >
                                      Use
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                          </motion.div>
                      )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Templates Grid/List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <Search className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">No templates found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search terms or category filter.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 lg:grid-cols-2 gap-8" 
                : "space-y-6"
              }>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Enhanced Template Header */}
                    <div className={`bg-gradient-to-r ${getCategoryColor(template.id.split('_')[0])} p-6 text-white ${
                      viewMode === 'list' ? 'w-1/3' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-3xl mr-4">{template.icon}</span>
                          <div>
                            <h3 className="text-2xl font-bold">{template.title}</h3>
                            <p className="text-sm opacity-90">{template.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(template.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            favorites.has(template.id) 
                              ? 'bg-white/20 text-yellow-300' 
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {favorites.has(template.id) ? (
                            <Bookmark className="w-5 h-5 fill-current" />
                          ) : (
                            <BookmarkPlus className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{template.usage || 0} uses</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            <span>{template.rating || 4.5}</span>
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

                    {/* Enhanced Template Content */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">{template.description}</p>
                      
                      {/* Enhanced Question Types Summary */}
                      {template.questions && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Question Types</h4>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const types = {};
                              template.questions.forEach(q => {
                                types[q.type] = (types[q.type] || 0) + 1;
                              });
                              return Object.entries(types).map(([type, count]) => (
                                <span key={type} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                  {type.replace('_', ' ')}: {count}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Enhanced Action Buttons */}
                      <div className="space-y-4">
                        <button
                          onClick={() => createFromTemplate(template.id, template)}
                          disabled={creating}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center text-lg shadow-lg hover:shadow-xl"
                        >
                          {creating ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          ) : (
                            <>
                              Use This Template
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </button>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => navigate(`/app/templates/${template.id}/edit`)}
                            className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => duplicateTemplate(template.id, template)}
                            className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => navigate(`/app/preview/${template.id}`)}
                            className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
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

        {/* Enhanced Create Custom Survey */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 max-w-4xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-6">
              Don't see what you need?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Create a custom survey from scratch with our powerful drag & drop builder.
              Design exactly what you need with unlimited customization options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
                onClick={() => navigate('/app/builder')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Custom Survey
            </button>
              <button
                onClick={() => navigate('/app/templates')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
              >
                Browse All Templates
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SurveyTemplates; 