import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  Heart, 
  GraduationCap, 
  Building, 
  Home, 
  Star, 
  Calendar,
  Target,
  FileText,
  CheckCircle,
  Plus,
  Eye,
  Copy,
  Edit,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const SurveyTemplates = ({ onSelectTemplate, onPreviewTemplate }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access templates');
          setLoading(false);
          return;
        }
        
        const response = await api.get('/api/templates');
        setTemplates(response.data);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError(err.message);
        // Fallback to hardcoded templates if API fails
        setTemplates([
          {
            id: 'customer-satisfaction',
            name: 'Customer Satisfaction Survey',
            category: 'customer-feedback',
            description: 'Measure customer satisfaction and identify areas for improvement',
            icon: 'Star',
            questions: [
              {
                type: 'rating',
                question: 'How satisfied are you with our product/service?',
                required: true,
                options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
              },
              {
                type: 'rating',
                question: 'How likely are you to recommend us to others?',
                required: true,
                options: ['Very Unlikely', 'Unlikely', 'Neutral', 'Likely', 'Very Likely']
              },
              {
                type: 'text',
                question: 'What did you like most about our product/service?',
                required: false
              },
              {
                type: 'text',
                question: 'What could we improve?',
                required: false
              },
              {
                type: 'multiple-choice',
                question: 'How did you hear about us?',
                required: false,
                options: ['Social Media', 'Friend/Family', 'Advertisement', 'Search Engine', 'Other']
              }
            ],
            estimatedTime: '2-3 minutes',
            responseCount: 0
          },
          {
            id: 'product-feedback',
            name: 'Product Feedback Survey',
            category: 'customer-feedback',
            description: 'Gather detailed feedback about your products',
            icon: 'ShoppingCart',
            questions: [
              {
                type: 'rating',
                question: 'How would you rate the quality of our product?',
                required: true,
                options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
              },
              {
                type: 'rating',
                question: 'How would you rate the value for money?',
                required: true,
                options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
              },
              {
                type: 'multiple-choice',
                question: 'Which features do you use most?',
                required: false,
                options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'All of them']
              },
              {
                type: 'text',
                question: 'What additional features would you like to see?',
                required: false
              },
              {
                type: 'yes-no',
                question: 'Would you purchase this product again?',
                required: true
              }
            ],
            estimatedTime: '3-4 minutes',
            responseCount: 0
          },
          {
            id: 'employee-satisfaction',
            name: 'Employee Satisfaction Survey',
            category: 'employee',
            description: 'Measure employee satisfaction and engagement',
            icon: 'Users',
            questions: [
              {
                type: 'rating',
                question: 'How satisfied are you with your current role?',
                required: true,
                options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
              },
              {
                type: 'rating',
                question: 'How would you rate your work-life balance?',
                required: true,
                options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
              },
              {
                type: 'rating',
                question: 'How satisfied are you with your manager?',
                required: true,
                options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']
              },
              {
                type: 'multiple-choice',
                question: 'What would improve your job satisfaction?',
                required: false,
                options: ['Better compensation', 'More training', 'Flexible hours', 'Better benefits', 'Career growth']
              },
              {
                type: 'text',
                question: 'What suggestions do you have for improving the workplace?',
                required: false
              }
            ],
            estimatedTime: '5-7 minutes',
            responseCount: 0
          },
          {
            id: 'course-evaluation',
            name: 'Course Evaluation Survey',
            category: 'education',
            description: 'Evaluate course effectiveness and instructor performance',
            icon: 'GraduationCap',
            questions: [
              {
                type: 'rating',
                question: 'How would you rate the overall quality of this course?',
                required: true,
                options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
              },
              {
                type: 'rating',
                question: 'How effective was the instructor?',
                required: true,
                options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
              },
              {
                type: 'rating',
                question: 'How relevant was the course content?',
                required: true,
                options: ['Not Relevant', 'Somewhat Relevant', 'Relevant', 'Very Relevant', 'Extremely Relevant']
              },
              {
                type: 'multiple-choice',
                question: 'What was the most valuable aspect of this course?',
                required: false,
                options: ['Course content', 'Instructor', 'Materials', 'Assignments', 'Discussions']
              },
              {
                type: 'text',
                question: 'What suggestions do you have for improving this course?',
                required: false
              }
            ],
            estimatedTime: '3-4 minutes',
            responseCount: 0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const categories = [
    { id: 'all', name: 'All Templates', icon: <FileText className="w-4 h-4" /> },
    { id: 'customer-feedback', name: 'Customer Feedback', icon: <Star className="w-4 h-4" /> },
    { id: 'employee', name: 'Employee', icon: <Users className="w-4 h-4" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'healthcare', name: 'Healthcare', icon: <Heart className="w-4 h-4" /> },
    { id: 'events', name: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'market-research', name: 'Market Research', icon: <Target className="w-4 h-4" /> },
    { id: 'digital', name: 'Digital', icon: <Home className="w-4 h-4" /> }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      toast.success(`Template "${template.name}" selected!`);
    }
  };

  const handlePreviewTemplate = (template) => {
    if (onPreviewTemplate) {
      onPreviewTemplate(template);
    } else {
      toast.success(`Previewing "${template.name}" template`);
    }
  };

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(JSON.stringify(template, null, 2));
    toast.success('Template copied to clipboard!');
  };

  const handleEditTemplate = (template) => {
    navigate(`/app/templates/${template.id}/edit`);
  };

  const handleCustomizeTemplate = (template) => {
    // Create a copy and open in editor
    const customizedTemplate = {
      ...template,
      id: `${template.id}-custom-${Date.now()}`,
      name: `${template.name} (Custom)`,
      description: `${template.description} - Customized version`
    };
    
    // Store in localStorage for the editor to pick up
    localStorage.setItem('customizingTemplate', JSON.stringify(customizedTemplate));
    navigate('/app/templates/new');
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'Star': <Star className="w-6 h-6" />,
      'ShoppingCart': <ShoppingCart className="w-6 h-6" />,
      'Users': <Users className="w-6 h-6" />,
      'GraduationCap': <GraduationCap className="w-6 h-6" />,
      'Heart': <Heart className="w-6 h-6" />,
      'Calendar': <Calendar className="w-6 h-6" />,
      'Target': <Target className="w-6 h-6" />,
      'Home': <Home className="w-6 h-6" />,
      'Building': <Building className="w-6 h-6" />
    };
    return iconMap[iconName] || <FileText className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <FileText className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading templates</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {error === 'Please log in to access templates' ? (
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Templates</h1>
        <p className="text-gray-600">Choose from our collection of pre-built survey templates</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {getIconComponent(template.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>{template.questions?.length || 0} questions</span>
                </div>
              </div>

              {/* Template Description */}
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>

              {/* Template Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Category: {categories.find(c => c.id === template.category)?.name || template.category}</span>
                <span>{template.responseCount || 0} responses</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Use Template
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    title="Edit Template"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCustomizeTemplate(template)}
                    className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                    title="Customize Template"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePreviewTemplate(template)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    title="Preview Template"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyTemplate(template)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    title="Copy Template JSON"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default SurveyTemplates; 