import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  Copy,
  Eye,
  Star,
  Clock,
  FileText,
  Users,
  BarChart3,
  Heart,
  GraduationCap,
  Zap,
  Crown,
  Award,
  Target,
  Loader2
} from 'lucide-react';

const SampleSurveyManager = ({ onSelectTemplate, embedded = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [creatingFromTemplate, setCreatingFromTemplate] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: <Star className="w-4 h-4" />, color: 'text-gray-600' },
    { id: 'Customer Experience', name: 'Customer Experience', icon: <Heart className="w-4 h-4" />, color: 'text-red-600' },
    { id: 'Human Resources', name: 'Human Resources', icon: <Users className="w-4 h-4" />, color: 'text-blue-600' },
    { id: 'Product Development', name: 'Product Development', icon: <Zap className="w-4 h-4" />, color: 'text-purple-600' },
    { id: 'Market Research', name: 'Market Research', icon: <BarChart3 className="w-4 h-4" />, color: 'text-indigo-600' },
    { id: 'Education', name: 'Education', icon: <GraduationCap className="w-4 h-4" />, color: 'text-green-600' },
    { id: 'User Experience', name: 'User Experience', icon: <Target className="w-4 h-4" />, color: 'text-yellow-600' },
    { id: 'Healthcare', name: 'Healthcare', icon: <Heart className="w-4 h-4" />, color: 'text-red-600' },
    { id: 'Event Management', name: 'Event Management', icon: <Award className="w-4 h-4" />, color: 'text-orange-600' }
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Healthcare', name: 'Healthcare' },
    { id: 'Education', name: 'Education' },
    { id: 'Business', name: 'Business' },
    { id: 'Corporate', name: 'Corporate' },
    { id: 'Events', name: 'Events' },
    { id: 'General', name: 'General' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select(`
          id,
          title,
          description,
          questions,
          template_category,
          template_industry,
          estimated_time,
          created_at
        `)
        .eq('is_template', true)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add question count to each template
      const templatesWithStats = data.map(template => ({
        ...template,
        questionCount: template.questions ? template.questions.length : 0
      }));
      
      setTemplates(templatesWithStats);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load survey templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.template_category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'all' || template.template_industry === selectedIndustry;
    
    return matchesSearch && matchesCategory && matchesIndustry;
  });

  const applyTemplate = async (template) => {
    if (!user) {
      toast.error('Please log in to use templates');
      return;
    }

    setCreatingFromTemplate(template.id);
    try {
      // Call the clone function
      const { data, error } = await supabase.rpc('clone_template_survey', {
        template_id: template.id,
        user_id: user.id,
        new_title: `${template.title} (Copy)`
      });

      if (error) throw error;

      toast.success('Template applied successfully!');
      
      if (embedded && onSelectTemplate) {
        onSelectTemplate(template);
      } else {
        navigate(`/app/builder/${data}`);
      }
    } catch (error) {
      console.error('Error using template:', error);
      toast.error('Failed to apply template');
    } finally {
      setCreatingFromTemplate(null);
    }
  };

  const previewTemplate = (template) => {
    // Open preview in new tab
    window.open(`/survey/${template.id}`, '_blank');
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || <FileText className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.color || 'text-gray-600';
  };

  const getDifficultyInfo = (questionCount) => {
    if (questionCount <= 5) return { label: 'Quick', color: 'bg-green-100 text-green-800' };
    if (questionCount <= 8) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Detailed', color: 'bg-red-100 text-red-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading survey templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!embedded && (
        <>
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Survey Templates</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional survey templates to get you started quickly. Choose from industry-specific examples and customize them for your needs.
            </p>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{templates.length}</div>
                <div className="text-sm text-gray-600">Professional Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {[...new Set(templates.map(t => t.template_category))].length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {[...new Set(templates.map(t => t.template_industry))].length}
                </div>
                <div className="text-sm text-gray-600">Industries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {templates.reduce((acc, t) => acc + t.questionCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {industries.map(industry => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const difficulty = getDifficultyInfo(template.questionCount);
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group"
            >
              {/* Template Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-gray-100 rounded-lg ${getCategoryColor(template.template_category)}`}>
                      {getCategoryIcon(template.template_category)}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {template.template_category}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${difficulty.color}`}>
                    {difficulty.label}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {template.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {template.description}
                </p>

                {/* Template Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{template.questionCount}</div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {template.estimated_time || Math.ceil(template.questionCount * 0.5)}
                    </div>
                    <div className="text-xs text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-xs font-medium text-gray-900">{template.template_industry}</div>
                    <div className="text-xs text-gray-600">Industry</div>
                  </div>
                </div>

                {/* Question Types Preview */}
                <div className="mb-6">
                  <div className="text-xs text-gray-500 mb-2">Question Types:</div>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(template.questions?.map(q => q.type) || [])].slice(0, 4).map((type, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                    {[...new Set(template.questions?.map(q => q.type) || [])].length > 4 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{[...new Set(template.questions?.map(q => q.type) || [])].length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => applyTemplate(template)}
                    disabled={creatingFromTemplate === template.id}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {creatingFromTemplate === template.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>
                      {creatingFromTemplate === template.id ? 'Creating...' : 'Use Template'}
                    </span>
                  </button>
                  <button
                    onClick={() => previewTemplate(template)}
                    className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Preview template"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find relevant templates
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedIndustry('all');
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Featured Templates */}
      {!embedded && filteredTemplates.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl p-8">
          <div className="text-center mb-8">
            <Crown className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">Featured Templates</h2>
            <p className="text-purple-100">
              Most popular and comprehensive survey templates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.slice(0, 2).map((template) => (
              <div key={template.id} className="bg-white bg-opacity-10 rounded-lg p-6">
                <h4 className="text-xl font-bold mb-2">{template.title}</h4>
                <p className="text-purple-100 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{template.questionCount} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{template.estimated_time || Math.ceil(template.questionCount * 0.5)} min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => applyTemplate(template)}
                    disabled={creatingFromTemplate === template.id}
                    className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50"
                  >
                    {creatingFromTemplate === template.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Use Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Start Guide */}
      {!embedded && (
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            How to Use Survey Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Browse & Search</h4>
              <p className="text-sm text-gray-600">
                Find the perfect template using our category and industry filters
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Copy className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Use Template</h4>
              <p className="text-sm text-gray-600">
                Click "Use Template" to create your own copy that you can customize
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Customize & Launch</h4>
              <p className="text-sm text-gray-600">
                Edit questions, add your branding, and publish your survey
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleSurveyManager;
