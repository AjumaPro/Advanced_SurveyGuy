import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Eye,
  Copy,
  Edit3,
  Plus,
  Crown,
  Users,
  Building,
  Heart,
  Calendar,
  Target,
  BarChart3,
  FileText,
  Sparkles,
  Clock,
  Tag,
  Grid,
  List,
  ArrowRight,
  CheckCircle,
  Download,
  Share2,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const TemplateSelector = ({ 
  onSelectTemplate, 
  onEditTemplate,
  onClose, 
  allowEdit = true,
  showCreateOption = true 
}) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const categories = [
    { id: 'all', name: 'All Templates', icon: <Grid className="w-4 h-4" />, count: 0 },
    { id: 'customer-feedback', name: 'Customer Feedback', icon: <Star className="w-4 h-4" />, count: 0 },
    { id: 'employee', name: 'Employee Survey', icon: <Users className="w-4 h-4" />, count: 0 },
    { id: 'product', name: 'Product Research', icon: <Target className="w-4 h-4" />, count: 0 },
    { id: 'event', name: 'Event Feedback', icon: <Calendar className="w-4 h-4" />, count: 0 },
    { id: 'education', name: 'Education', icon: <FileText className="w-4 h-4" />, count: 0 },
    { id: 'healthcare', name: 'Healthcare', icon: <Heart className="w-4 h-4" />, count: 0 },
    { id: 'business', name: 'Business', icon: <Building className="w-4 h-4" />, count: 0 },
    { id: 'market-research', name: 'Market Research', icon: <BarChart3 className="w-4 h-4" />, count: 0 }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular', icon: <Star className="w-4 h-4" /> },
    { id: 'recent', name: 'Recently Added', icon: <Clock className="w-4 h-4" /> },
    { id: 'name', name: 'Name A-Z', icon: <FileText className="w-4 h-4" /> },
    { id: 'questions', name: 'Question Count', icon: <Tag className="w-4 h-4" /> }
  ];

  useEffect(() => {
    loadTemplates();
    loadFavorites();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { templates: templateData, error } = await api.templates.getTemplates();
      
      if (error) {
        throw new Error(error);
      }

      setTemplates(templateData || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
      
      // Fallback to mock data for demonstration
      setTemplates([
        {
          id: 'customer-satisfaction',
          title: 'Customer Satisfaction Survey',
          description: 'Measure customer satisfaction and identify areas for improvement',
          category: 'customer-feedback',
          questions: [
            { type: 'rating', title: 'How satisfied are you with our service?' },
            { type: 'nps', title: 'How likely are you to recommend us?' },
            { type: 'textarea', title: 'What could we improve?' }
          ],
          estimatedTime: '3-5 minutes',
          responseCount: 245,
          isPublic: true,
          isPremium: false,
          tags: ['satisfaction', 'customer', 'feedback']
        },
        {
          id: 'employee-engagement',
          title: 'Employee Engagement Survey',
          description: 'Comprehensive survey to measure employee satisfaction and engagement',
          category: 'employee',
          questions: [
            { type: 'rating', title: 'How satisfied are you with your role?' },
            { type: 'emoji_scale', title: 'How do you feel about work-life balance?' },
            { type: 'multiple_choice', title: 'What motivates you most at work?' }
          ],
          estimatedTime: '8-12 minutes',
          responseCount: 156,
          isPublic: true,
          isPremium: true,
          tags: ['employee', 'engagement', 'hr']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('templateFavorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('templateFavorites', JSON.stringify([...newFavorites]));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (templateId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    saveFavorites(newFavorites);
  };

  const handleUseTemplate = (template) => {
    onSelectTemplate(template);
    toast.success(`Template "${template.title}" selected!`);
  };

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      // Plan-based filtering
      if (template.isPremium && user?.plan === 'free') return false;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.responseCount || 0) - (a.responseCount || 0);
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'questions':
          return (b.questions?.length || 0) - (a.questions?.length || 0);
        default:
          return 0;
      }
    });

  const renderTemplateCard = (template) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all group cursor-pointer"
      onClick={() => handleUseTemplate(template)}
      onMouseEnter={() => setHoveredTemplate(template)}
      onMouseLeave={() => setHoveredTemplate(null)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {template.title}
            </h3>
            {template.isPremium && (
              <Crown className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
        </div>
        
        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(template.id);
            }}
            className={`p-1.5 rounded transition-colors ${
              favorites.has(template.id)
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(template.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{template.questions?.length || 0} questions</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{template.estimatedTime || '5 min'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{template.responseCount || 0} uses</span>
        </div>
      </div>

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{template.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUseTemplate(template);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Use Template</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHoveredTemplate(template);
          }}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Preview Template"
        >
          <Eye className="w-4 h-4" />
        </button>
        
        {allowEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTemplate?.(template);
            }}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Template"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Premium Overlay */}
      {template.isPremium && user?.plan === 'free' && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-xl flex items-center justify-center">
          <div className="bg-white px-4 py-3 rounded-lg shadow-lg text-center">
            <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Pro Plan Required</p>
            <p className="text-xs text-gray-600">Upgrade to access this template</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderTemplateRow = (template) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer group"
      onClick={() => handleUseTemplate(template)}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {template.title}
              </h3>
              {template.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
            </div>
            <p className="text-sm text-gray-600 truncate">{template.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{template.questions?.length || 0} questions</span>
              <span>{template.estimatedTime || '5 min'}</span>
              <span>{template.responseCount || 0} uses</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(template.id);
            }}
            className={`p-2 rounded transition-colors ${
              favorites.has(template.id)
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(template.id) ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUseTemplate(template);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Use
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Template</h2>
            <p className="text-gray-600 mt-1">Start with a professional template or create from scratch</p>
          </div>
          
          <div className="flex items-center gap-3">
            {showCreateOption && (
              <button
                onClick={() => onSelectTemplate(null)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Start from Scratch
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
                {categories.map(category => {
                  const count = category.id === 'all' 
                    ? templates.length 
                    : templates.filter(t => t.category === category.id).length;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sort Options */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Sort By</h3>
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left ${
                      sortBy === option.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">View</h3>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <Grid className="w-3 h-3" />
                    <span className="text-xs">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <List className="w-3 h-3" />
                    <span className="text-xs">List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedCategory === 'all' ? 'All Templates' : 
                     categories.find(c => c.id === selectedCategory)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                
                {favorites.size > 0 && (
                  <button
                    onClick={() => setSelectedCategory('favorites')}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="text-sm">Favorites ({favorites.size})</span>
                  </button>
                )}
              </div>

              {/* Templates */}
              {loading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600">Loading templates...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'No templates available in this category'}
                  </p>
                  {showCreateOption && (
                    <button
                      onClick={() => onSelectTemplate(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Create from Scratch
                    </button>
                  )}
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-3'
                }>
                  {filteredTemplates.map(template => 
                    viewMode === 'grid' 
                      ? renderTemplateCard(template)
                      : renderTemplateRow(template)
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Preview Sidebar */}
          {hoveredTemplate && (
            <div className="w-96 border-l border-gray-200 overflow-y-auto">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{hoveredTemplate.title}</h3>
                      <p className="text-sm text-gray-600">{hoveredTemplate.category}</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Template Preview</h4>
                    <p className="text-sm text-gray-600 mb-4">{hoveredTemplate.description}</p>
                    
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-900">Questions ({hoveredTemplate.questions?.length || 0})</h5>
                      <div className="space-y-2">
                        {(hoveredTemplate.questions || []).slice(0, 5).map((question, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                            <span className="text-xs text-gray-500 mt-0.5">{idx + 1}.</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 line-clamp-2">
                                {question.title}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {question.type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(hoveredTemplate.questions?.length || 0) > 5 && (
                          <div className="text-xs text-gray-500 text-center py-2">
                            +{hoveredTemplate.questions.length - 5} more questions
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Estimated Time</div>
                      <div className="text-gray-600">{hoveredTemplate.estimatedTime || '5 minutes'}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Usage</div>
                      <div className="text-gray-600">{hoveredTemplate.responseCount || 0} times</div>
                    </div>
                  </div>

                  {hoveredTemplate.tags && hoveredTemplate.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {hoveredTemplate.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      onClick={() => handleUseTemplate(hoveredTemplate)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Use This Template
                    </button>
                    
                    {allowEdit && (
                      <button
                        onClick={() => onEditTemplate?.(hoveredTemplate)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Template
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Free ({templates.filter(t => !t.isPremium).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-3 h-3 text-yellow-500" />
              <span>Premium ({templates.filter(t => t.isPremium).length})</span>
            </div>
            {favorites.size > 0 && (
              <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>Favorites ({favorites.size})</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Choose a template to get started quickly
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TemplateSelector;
