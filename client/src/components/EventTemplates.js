import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  GraduationCap, 
  Heart, 
  Building, 
  Music, 
  Camera, 
  Utensils,
  Plane,
  Car,
  Gift,
  Award,
  Star,
  Plus,
  Eye,
  Copy,
  Edit,
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const EventTemplates = ({ onSelectTemplate, onPreviewTemplate }) => {
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
        
        // Try to fetch event templates from API first
        const response = await api.get('/api/templates/events');
        setTemplates(response.data);
      } catch (err) {
        console.error('Error fetching event templates:', err);
        setError(err.message);
        // Fallback to hardcoded event templates if API fails
        setTemplates([
          // Business Events
          {
            id: 'business-conference',
            name: 'Business Conference',
            category: 'business',
            description: 'Professional conference with speakers, networking, and workshops',
            icon: 'Building',
            template: 'conference',
            fields: ['name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees'],
            defaultCapacity: 500,
            defaultPrice: 299.99,
            features: [
              'Professional speakers',
              'Networking sessions',
              'Workshop tracks',
              'Lunch included',
              'Conference materials',
              'Certificate of attendance'
            ],
            estimatedDuration: '8 hours',
            targetAudience: 'Professionals, Executives, Entrepreneurs'
          },
          {
            id: 'corporate-meeting',
            name: 'Corporate Meeting',
            category: 'business',
            description: 'Internal company meeting or team building event',
            icon: 'Users',
            template: 'standard',
            fields: ['name', 'email', 'phone', 'department', 'attendees'],
            defaultCapacity: 100,
            defaultPrice: 0,
            features: [
              'Team building activities',
              'Presentations',
              'Group discussions',
              'Refreshments',
              'Meeting materials'
            ],
            estimatedDuration: '4 hours',
            targetAudience: 'Employees, Team Members'
          },
          {
            id: 'product-launch',
            name: 'Product Launch',
            category: 'business',
            description: 'Launch event for new products or services',
            icon: 'Star',
            template: 'conference',
            fields: ['name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees'],
            defaultCapacity: 200,
            defaultPrice: 149.99,
            features: [
              'Product demonstrations',
              'Expert presentations',
              'Q&A sessions',
              'Networking',
              'Product samples',
              'Press coverage'
            ],
            estimatedDuration: '6 hours',
            targetAudience: 'Customers, Partners, Media, Investors'
          },

          // Educational Events
          {
            id: 'workshop',
            name: 'Educational Workshop',
            category: 'education',
            description: 'Hands-on learning workshop with practical exercises',
            icon: 'GraduationCap',
            template: 'workshop',
            fields: ['name', 'email', 'phone', 'experience', 'goals', 'attendees'],
            defaultCapacity: 50,
            defaultPrice: 99.99,
            features: [
              'Hands-on training',
              'Expert instruction',
              'Practice materials',
              'Certificate',
              'Take-home resources'
            ],
            estimatedDuration: '6 hours',
            targetAudience: 'Students, Professionals, Hobbyists'
          },
          {
            id: 'webinar',
            name: 'Online Webinar',
            category: 'education',
            description: 'Virtual educational session with live interaction',
            icon: 'GraduationCap',
            template: 'webinar',
            fields: ['name', 'email', 'phone', 'meetingLink', 'platform', 'attendees'],
            defaultCapacity: 500,
            defaultPrice: 49.99,
            features: [
              'Live presentation',
              'Interactive Q&A',
              'Screen sharing',
              'Recording access',
              'Digital materials'
            ],
            estimatedDuration: '2 hours',
            targetAudience: 'Remote learners, Professionals, Students'
          },
          {
            id: 'training-session',
            name: 'Training Session',
            category: 'education',
            description: 'Professional development and skill training',
            icon: 'GraduationCap',
            template: 'workshop',
            fields: ['name', 'email', 'phone', 'experience', 'goals', 'attendees'],
            defaultCapacity: 30,
            defaultPrice: 199.99,
            features: [
              'Skill development',
              'Practical exercises',
              'Assessment',
              'Certification',
              'Follow-up support'
            ],
            estimatedDuration: '8 hours',
            targetAudience: 'Professionals, Employees, Job Seekers'
          },

          // Social Events
          {
            id: 'wedding',
            name: 'Wedding Celebration',
            category: 'social',
            description: 'Wedding ceremony and reception celebration',
            icon: 'Heart',
            template: 'wedding',
            fields: ['name', 'email', 'phone', 'plusOne', 'dietary', 'attendees'],
            defaultCapacity: 150,
            defaultPrice: 0,
            features: [
              'Ceremony',
              'Reception',
              'Dinner service',
              'Entertainment',
              'Photography',
              'Wedding favors'
            ],
            estimatedDuration: '8 hours',
            targetAudience: 'Family, Friends, Colleagues'
          },
          {
            id: 'birthday-party',
            name: 'Birthday Party',
            category: 'social',
            description: 'Birthday celebration with friends and family',
            icon: 'Gift',
            template: 'standard',
            fields: ['name', 'email', 'phone', 'attendees'],
            defaultCapacity: 50,
            defaultPrice: 0,
            features: [
              'Party decorations',
              'Catering',
              'Entertainment',
              'Games & activities',
              'Party favors'
            ],
            estimatedDuration: '4 hours',
            targetAudience: 'Friends, Family, Children'
          },
          {
            id: 'anniversary',
            name: 'Anniversary Celebration',
            category: 'social',
            description: 'Anniversary party or celebration',
            icon: 'Heart',
            template: 'standard',
            fields: ['name', 'email', 'phone', 'attendees'],
            defaultCapacity: 100,
            defaultPrice: 0,
            features: [
              'Celebration dinner',
              'Entertainment',
              'Photography',
              'Memories sharing',
              'Special decorations'
            ],
            estimatedDuration: '6 hours',
            targetAudience: 'Family, Friends, Couples'
          },

          // Entertainment Events
          {
            id: 'concert',
            name: 'Concert or Music Event',
            category: 'entertainment',
            description: 'Live music performance or concert',
            icon: 'Music',
            template: 'standard',
            fields: ['name', 'email', 'phone', 'attendees'],
            defaultCapacity: 1000,
            defaultPrice: 79.99,
            features: [
              'Live performance',
              'Sound system',
              'Lighting effects',
              'Merchandise',
              'Food & beverages'
            ],
            estimatedDuration: '4 hours',
            targetAudience: 'Music lovers, General public'
          },
          {
            id: 'photography-workshop',
            name: 'Photography Workshop',
            category: 'entertainment',
            description: 'Photography skills workshop and photo shoot',
            icon: 'Camera',
            template: 'workshop',
            fields: ['name', 'email', 'phone', 'experience', 'goals', 'attendees'],
            defaultCapacity: 20,
            defaultPrice: 149.99,
            features: [
              'Equipment provided',
              'Expert instruction',
              'Outdoor shooting',
              'Photo editing',
              'Portfolio review'
            ],
            estimatedDuration: '8 hours',
            targetAudience: 'Photography enthusiasts, Beginners, Professionals'
          },
          {
            id: 'cooking-class',
            name: 'Cooking Class',
            category: 'entertainment',
            description: 'Culinary workshop and cooking demonstration',
            icon: 'Utensils',
            template: 'workshop',
            fields: ['name', 'email', 'phone', 'experience', 'dietary', 'attendees'],
            defaultCapacity: 15,
            defaultPrice: 89.99,
            features: [
              'Hands-on cooking',
              'Recipe book',
              'Ingredients provided',
              'Meal tasting',
              'Chef instruction'
            ],
            estimatedDuration: '3 hours',
            targetAudience: 'Food enthusiasts, Home cooks, Beginners'
          },

          // Travel & Adventure
          {
            id: 'travel-tour',
            name: 'Travel Tour',
            category: 'travel',
            description: 'Guided travel tour or adventure trip',
            icon: 'Plane',
            template: 'custom',
            fields: ['name', 'email', 'phone', 'dietary', 'custom', 'attendees'],
            defaultCapacity: 25,
            defaultPrice: 599.99,
            features: [
              'Guided tour',
              'Transportation',
              'Accommodation',
              'Meals included',
              'Local guide',
              'Travel insurance'
            ],
            estimatedDuration: 'Multi-day',
            targetAudience: 'Travelers, Adventure seekers, Tourists'
          },
          {
            id: 'road-trip',
            name: 'Road Trip',
            category: 'travel',
            description: 'Group road trip or driving adventure',
            icon: 'Car',
            template: 'standard',
            fields: ['name', 'email', 'phone', 'attendees'],
            defaultCapacity: 10,
            defaultPrice: 199.99,
            features: [
              'Route planning',
              'Vehicle rental',
              'Accommodation',
              'Group activities',
              'Travel guide'
            ],
            estimatedDuration: 'Multi-day',
            targetAudience: 'Adventure seekers, Friends, Travel groups'
          },

          // Health & Wellness
          {
            id: 'fitness-class',
            name: 'Fitness Class',
            category: 'health',
            description: 'Group fitness class or wellness session',
            icon: 'Heart',
            template: 'standard',
            fields: ['name', 'email', 'phone', 'experience', 'attendees'],
            defaultCapacity: 30,
            defaultPrice: 29.99,
            features: [
              'Professional instructor',
              'Equipment provided',
              'Workout plan',
              'Health tips',
              'Progress tracking'
            ],
            estimatedDuration: '1 hour',
            targetAudience: 'Fitness enthusiasts, Beginners, Health-conscious individuals'
          },
          {
            id: 'wellness-retreat',
            name: 'Wellness Retreat',
            category: 'health',
            description: 'Wellness and relaxation retreat',
            icon: 'Heart',
            template: 'custom',
            fields: ['name', 'email', 'phone', 'dietary', 'custom', 'attendees'],
            defaultCapacity: 50,
            defaultPrice: 399.99,
            features: [
              'Yoga sessions',
              'Meditation',
              'Spa treatments',
              'Healthy meals',
              'Wellness workshops',
              'Nature activities'
            ],
            estimatedDuration: 'Weekend',
            targetAudience: 'Wellness seekers, Stress relief, Health enthusiasts'
          },

          // Awards & Recognition
          {
            id: 'awards-ceremony',
            name: 'Awards Ceremony',
            category: 'recognition',
            description: 'Awards ceremony and recognition event',
            icon: 'Award',
            template: 'conference',
            fields: ['name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees'],
            defaultCapacity: 300,
            defaultPrice: 199.99,
            features: [
              'Awards presentation',
              'Dinner service',
              'Entertainment',
              'Networking',
              'Photography',
              'Memorabilia'
            ],
            estimatedDuration: '4 hours',
            targetAudience: 'Professionals, Award winners, Industry leaders'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const categories = [
    { id: 'all', name: 'All Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'business', name: 'Business', icon: <Building className="w-4 h-4" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'social', name: 'Social', icon: <Heart className="w-4 h-4" /> },
    { id: 'entertainment', name: 'Entertainment', icon: <Music className="w-4 h-4" /> },
    { id: 'travel', name: 'Travel', icon: <Plane className="w-4 h-4" /> },
    { id: 'health', name: 'Health & Wellness', icon: <Heart className="w-4 h-4" /> },
    { id: 'recognition', name: 'Awards & Recognition', icon: <Award className="w-4 h-4" /> }
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
      // Check if it's a professional template
      const isProfessional = ['business-conference', 'team-building', 'educational-workshop', 'professional-webinar', 'networking-event'].includes(template.id);
      
      if (isProfessional) {
        // Navigate to professional event creation page
        navigate('/app/templates/professional-events', { 
          state: { selectedTemplate: template } 
        });
      } else {
        // Use regular template flow
        toast.success(`Event template "${template.name}" selected!`);
      }
    }
  };

  const handlePreviewTemplate = (template) => {
    if (onPreviewTemplate) {
      onPreviewTemplate(template);
    } else {
      toast.success(`Previewing "${template.name}" event template`);
    }
  };

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(JSON.stringify(template, null, 2));
    toast.success('Event template copied to clipboard!');
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
      'Calendar': <Calendar className="w-6 h-6" />,
      'Users': <Users className="w-6 h-6" />,
      'GraduationCap': <GraduationCap className="w-6 h-6" />,
      'Heart': <Heart className="w-6 h-6" />,
      'Building': <Building className="w-6 h-6" />,
      'Music': <Music className="w-6 h-6" />,
      'Camera': <Camera className="w-6 h-6" />,
      'Utensils': <Utensils className="w-6 h-6" />,
      'Plane': <Plane className="w-6 h-6" />,
      'Car': <Car className="w-6 h-6" />,
      'Gift': <Gift className="w-6 h-6" />,
      'Award': <Award className="w-6 h-6" />,
      'Star': <Star className="w-6 h-6" />
    };
    return iconMap[iconName] || <Calendar className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Calendar className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading event templates</h3>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Templates</h1>
            <p className="text-gray-600">Choose from our collection of pre-built event templates</p>
          </div>
          <button
            onClick={() => navigate('/app/templates/professional-events')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Professional Creator</span>
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search event templates..."
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {['business-conference', 'team-building', 'educational-workshop', 'professional-webinar', 'networking-event'].includes(template.id) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full border border-blue-200">
                          <Sparkles className="w-3 h-3" />
                          Professional
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{template.estimatedDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{template.defaultCapacity} max</span>
                </div>
              </div>

              {/* Template Description */}
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>

              {/* Template Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-700">{categories.find(c => c.id === template.category)?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Target Audience:</span>
                  <span className="text-gray-700">{template.targetAudience}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Registration Fields:</span>
                  <span className="text-gray-700">{template.fields.length} fields</span>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{template.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {/* Professional Templates get special treatment */}
                {['business-conference', 'team-building', 'educational-workshop', 'professional-webinar', 'networking-event'].includes(template.id) ? (
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    Create Professional Event
                    <Zap className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Use Template
                  </button>
                )}
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
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No event templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default EventTemplates; 