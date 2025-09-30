import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Star, 
  Clock,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';

const SmartTemplateSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for template suggestions
  const mockSuggestions = [
    {
      id: 1,
      title: "Employee Satisfaction Survey",
      description: "Comprehensive survey to measure employee engagement and satisfaction",
      category: "HR",
      popularity: 95,
      rating: 4.8,
      questions: 15,
      estimatedTime: "5-7 minutes",
      tags: ["employee", "satisfaction", "engagement"],
      aiGenerated: true,
      trending: true
    },
    {
      id: 2,
      title: "Customer Feedback Form",
      description: "Gather valuable customer insights and feedback",
      category: "Marketing",
      popularity: 88,
      rating: 4.6,
      questions: 12,
      estimatedTime: "3-5 minutes",
      tags: ["customer", "feedback", "experience"],
      aiGenerated: true,
      trending: false
    },
    {
      id: 3,
      title: "Event Registration Form",
      description: "Streamlined registration process for events and conferences",
      category: "Events",
      popularity: 92,
      rating: 4.7,
      questions: 8,
      estimatedTime: "2-3 minutes",
      tags: ["event", "registration", "attendee"],
      aiGenerated: false,
      trending: true
    },
    {
      id: 4,
      title: "Product Research Survey",
      description: "Market research survey for new product development",
      category: "Research",
      popularity: 76,
      rating: 4.4,
      questions: 20,
      estimatedTime: "8-10 minutes",
      tags: ["product", "research", "market"],
      aiGenerated: true,
      trending: false
    },
    {
      id: 5,
      title: "Course Evaluation Form",
      description: "Educational assessment and course feedback collection",
      category: "Education",
      popularity: 83,
      rating: 4.5,
      questions: 10,
      estimatedTime: "4-6 minutes",
      tags: ["course", "evaluation", "education"],
      aiGenerated: false,
      trending: true
    }
  ];

  const categories = ['all', 'HR', 'Marketing', 'Events', 'Research', 'Education'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
    const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId) => {
    console.log('Using template:', templateId);
    // Implement template usage logic
  };

  const handleCustomizeTemplate = (templateId) => {
    console.log('Customizing template:', templateId);
    // Implement template customization logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Template Suggestions</h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered template recommendations based on your needs and trending surveys
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-sm rounded-lg capitalize transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuggestions.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="p-6 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                      {template.trending && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </span>
                      )}
                      {template.aiGenerated && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{template.description}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pt-0 pb-6">
                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{template.popularity}% used</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{template.estimatedTime}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 bg-white">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUseTemplate(template.id)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                  <button 
                    onClick={() => handleCustomizeTemplate(template.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSuggestions.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or category filter
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartTemplateSuggestions;
