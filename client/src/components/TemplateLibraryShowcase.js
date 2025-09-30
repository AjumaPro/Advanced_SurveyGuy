import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sampleSurveys } from '../data/sampleSurveys';
import { sampleEvents } from '../data/sampleEvents';
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  Eye,
  Copy,
  Play,
  Calendar,
  BarChart3,
  FileText,
  Zap,
  Crown,
  Award,
  Target,
  Briefcase,
  GraduationCap,
  Heart,
  Mic,
  Coffee
} from 'lucide-react';

const TemplateLibraryShowcase = ({ onSelectTemplate, type = 'survey' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const templates = type === 'survey' ? sampleSurveys : sampleEvents;
  
  const categories = [
    { id: 'all', name: 'All Categories', icon: <Star className="w-4 h-4" /> },
    ...(type === 'survey' ? [
      { id: 'Customer Experience', name: 'Customer Experience', icon: <Heart className="w-4 h-4" /> },
      { id: 'Human Resources', name: 'Human Resources', icon: <Users className="w-4 h-4" /> },
      { id: 'Product Development', name: 'Product Development', icon: <Zap className="w-4 h-4" /> },
      { id: 'Market Research', name: 'Market Research', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'Education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
      { id: 'User Experience', name: 'User Experience', icon: <Target className="w-4 h-4" /> },
      { id: 'Healthcare', name: 'Healthcare', icon: <Heart className="w-4 h-4" /> }
    ] : [
      { id: 'Conference', name: 'Conference', icon: <Mic className="w-4 h-4" /> },
      { id: 'Workshop', name: 'Workshop', icon: <GraduationCap className="w-4 h-4" /> },
      { id: 'Networking', name: 'Networking', icon: <Coffee className="w-4 h-4" /> },
      { id: 'Product Launch', name: 'Product Launch', icon: <Zap className="w-4 h-4" /> },
      { id: 'Webinar', name: 'Webinar', icon: <Mic className="w-4 h-4" /> },
      { id: 'Fundraiser', name: 'Fundraiser', icon: <Heart className="w-4 h-4" /> }
    ])
  ];

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Healthcare', name: 'Healthcare' },
    { id: 'Education', name: 'Education' },
    { id: 'Business', name: 'Business' },
    { id: 'Non-Profit', name: 'Non-Profit' },
    { id: 'Corporate', name: 'Corporate' },
    { id: 'General', name: 'General' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    
    return matchesSearch && matchesCategory && matchesIndustry;
  });

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || <FileText className="w-4 h-4" />;
  };

  const getDifficultyColor = (questionCount) => {
    if (questionCount <= 5) return 'bg-green-100 text-green-800';
    if (questionCount <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyLabel = (questionCount) => {
    if (questionCount <= 5) return 'Quick';
    if (questionCount <= 10) return 'Medium';
    return 'Detailed';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {type === 'survey' ? 'Survey' : 'Event'} Templates
        </h2>
        <p className="text-gray-600">
          Professional templates to get you started quickly
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${type} templates...`}
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

        {/* Active Filters */}
        {(selectedCategory !== 'all' || selectedIndustry !== 'all' || searchTerm) && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Category: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
            {selectedIndustry !== 'all' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                Industry: {selectedIndustry}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedIndustry('all');
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            {/* Template Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getCategoryIcon(template.category)}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(template.questions?.length || 0)}`}>
                  {getDifficultyLabel(template.questions?.length || 0)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {template.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Template Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>{(template.questions || template.registrationQuestions || []).length} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{template.estimatedTime || Math.ceil((template.questions?.length || 0) * 0.5)} min</span>
                  </div>
                </div>
                <span className="text-gray-400">{template.industry}</span>
              </div>

              {/* Question Types Preview */}
              <div className="flex flex-wrap gap-1 mb-4">
                {[...new Set((template.questions || template.registrationQuestions || []).map(q => q.type))].slice(0, 4).map((questionType, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {questionType.replace('_', ' ')}
                  </span>
                ))}
                {[...new Set((template.questions || template.registrationQuestions || []).map(q => q.type))].length > 4 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    +{[...new Set((template.questions || template.registrationQuestions || []).map(q => q.type))].length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Template Actions */}
            <div className="px-6 pb-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSelectTemplate(template)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Use Template</span>
                </button>
                <button
                  onClick={() => alert('Preview feature coming soon!')}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Preview template"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedIndustry('all');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Template Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
            <div className="text-sm text-gray-600">Professional Templates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {[...new Set(templates.map(t => t.category))].length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {[...new Set(templates.map(t => t.industry))].length}
            </div>
            <div className="text-sm text-gray-600">Industries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {templates.reduce((acc, t) => acc + (t.questions?.length || t.registrationQuestions?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </div>
      </div>

      {/* Featured Templates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.slice(0, 2).map((template) => (
            <div key={template.id} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Crown className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Featured Template</span>
              </div>
              <h4 className="text-xl font-bold mb-2">{template.title}</h4>
              <p className="text-blue-100 mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{(template.questions || template.registrationQuestions || []).length} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{template.estimatedTime || Math.ceil((template.questions?.length || 0) * 0.5)} min</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectTemplate(template)}
                  className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibraryShowcase;
