import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Globe, 
  Building, 
  GraduationCap,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ProfessionalEventCreator = ({ selectedTemplate: propSelectedTemplate, onEventCreated, onClose }) => {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1); // 1: Template Selection, 2: Event Details, 3: Review

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  // Professional Event Templates (matches our database templates)
  const professionalTemplates = [
    {
      id: 'business-conference',
      title: 'Professional Business Conference',
      description: 'Comprehensive business conference template with speakers, networking, workshops, and professional development sessions.',
      category: 'business',
      icon: Building,
      color: 'blue',
      defaultCapacity: 500,
      defaultPrice: 299.99,
      defaultDuration: 8,
      features: [
        'Professional keynote speakers',
        'Interactive workshop sessions',
        'Networking breaks and lunch',
        'Conference materials and swag',
        'Certificate of attendance',
        'Mobile app for agenda',
        'Post-event resources'
      ],
      targetAudience: 'Business professionals, executives, entrepreneurs, industry leaders',
      suggestedFields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: false },
        { id: 'company', type: 'text', label: 'Company/Organization', required: true },
        { id: 'position', type: 'text', label: 'Job Title/Position', required: true },
        { id: 'dietary', type: 'select', label: 'Dietary Restrictions', required: false, options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Other'] },
        { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 5 }
      ]
    },
    {
      id: 'team-building',
      title: 'Corporate Team Building Event',
      description: 'Professional team building event template designed to strengthen team relationships and improve collaboration.',
      category: 'business',
      icon: Users,
      color: 'green',
      defaultCapacity: 100,
      defaultPrice: 0.00,
      defaultDuration: 4,
      features: [
        'Team building activities',
        'Leadership presentations',
        'Group problem-solving exercises',
        'Refreshments and lunch',
        'Team collaboration tools',
        'Professional facilitator'
      ],
      targetAudience: 'Employees, team members, department staff',
      suggestedFields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: false },
        { id: 'department', type: 'select', label: 'Department', required: true, options: ['HR', 'Marketing', 'Sales', 'Engineering', 'Finance', 'Operations', 'Other'] },
        { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 1 }
      ]
    },
    {
      id: 'educational-workshop',
      title: 'Educational Workshop',
      description: 'Hands-on learning workshop template with practical exercises, expert instruction, and skill development.',
      category: 'education',
      icon: GraduationCap,
      color: 'purple',
      defaultCapacity: 50,
      defaultPrice: 99.99,
      defaultDuration: 6,
      features: [
        'Hands-on training sessions',
        'Expert instruction and guidance',
        'Practice materials and resources',
        'Certificate of completion',
        'Take-home learning materials',
        'Follow-up support'
      ],
      targetAudience: 'Students, professionals, hobbyists, skill learners',
      suggestedFields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: false },
        { id: 'experience', type: 'select', label: 'Experience Level', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'goals', type: 'textarea', label: 'Learning Goals', required: false },
        { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 3 }
      ]
    },
    {
      id: 'professional-webinar',
      title: 'Professional Webinar',
      description: 'Virtual educational webinar template with live presentation, interactive Q&A, and digital resources.',
      category: 'education',
      icon: Globe,
      color: 'indigo',
      defaultCapacity: 500,
      defaultPrice: 49.99,
      defaultDuration: 2,
      features: [
        'Live presentation and demonstration',
        'Interactive Q&A session',
        'Screen sharing capabilities',
        'Recording access for attendees',
        'Digital handouts and resources',
        'Follow-up materials'
      ],
      targetAudience: 'Remote learners, professionals, students, online audience',
      suggestedFields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: false },
        { id: 'meetingLink', type: 'text', label: 'Preferred Meeting Platform', required: false },
        { id: 'platform', type: 'select', label: 'Platform Experience', required: false, options: ['Zoom', 'Teams', 'WebEx', 'Other', 'None'] },
        { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 5 }
      ]
    },
    {
      id: 'networking-event',
      title: 'Professional Networking Event',
      description: 'Structured networking event template for professionals to connect, share ideas, and build business relationships.',
      category: 'business',
      icon: Zap,
      color: 'orange',
      defaultCapacity: 200,
      defaultPrice: 79.99,
      defaultDuration: 3,
      features: [
        'Structured networking sessions',
        'Speed networking activities',
        'Industry-specific breakout groups',
        'Cocktails and appetizers',
        'Business card exchange',
        'Professional photographer',
        'Follow-up networking platform'
      ],
      targetAudience: 'Business professionals, entrepreneurs, industry leaders, sales professionals',
      suggestedFields: [
        { id: 'name', type: 'text', label: 'Full Name', required: true },
        { id: 'email', type: 'email', label: 'Email Address', required: true },
        { id: 'phone', type: 'text', label: 'Phone Number', required: false },
        { id: 'company', type: 'text', label: 'Company/Organization', required: true },
        { id: 'position', type: 'text', label: 'Job Title', required: true },
        { id: 'industry', type: 'select', label: 'Industry', required: true, options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Other'] },
        { id: 'attendees', type: 'number', label: 'Number of Attendees', required: true, min: 1, max: 2 }
      ]
    }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // If a template is passed as prop, select it automatically
    if (propSelectedTemplate) {
      const matchingTemplate = professionalTemplates.find(t => t.id === propSelectedTemplate.id);
      if (matchingTemplate) {
        setSelectedTemplate(matchingTemplate);
        setValue('title', matchingTemplate.title);
        setValue('description', matchingTemplate.description);
        setValue('capacity', matchingTemplate.defaultCapacity);
        setValue('price', matchingTemplate.defaultPrice);
        setValue('duration', matchingTemplate.defaultDuration);
        setValue('category', matchingTemplate.category);
        setStep(2); // Skip template selection
      }
    }
  }, [propSelectedTemplate, setValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // Try to fetch from database first
      const response = await api.events.getEventTemplates();
      if (response.error) {
        console.log('Using fallback templates');
        setTemplates(professionalTemplates);
      } else {
        setTemplates(response.templates || professionalTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates(professionalTemplates);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setValue('title', template.title);
    setValue('description', template.description);
    setValue('capacity', template.defaultCapacity);
    setValue('price', template.defaultPrice);
    setValue('duration', template.defaultDuration);
    setValue('category', template.category);
    setStep(2);
  };

  const handleEventCreation = async (data) => {
    if (!user) {
      toast.error('Please log in to create events');
      return;
    }

    setIsCreating(true);
    try {
      // Validate required fields
      if (!data.startDate || !data.startTime || !data.endDate || !data.endTime) {
        throw new Error('Please fill in all date and time fields');
      }

      // Create date objects and validate
      const startDateTime = new Date(data.startDate + 'T' + data.startTime);
      const endDateTime = new Date(data.endDate + 'T' + data.endTime);
      
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date format. Please check your date and time entries.');
      }

      if (endDateTime <= startDateTime) {
        throw new Error('End date must be after start date.');
      }

      const eventData = {
        title: data.title,
        description: data.description,
        status: 'published', // Required field
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        starts_at: startDateTime.toISOString(), // Required for starts_at NOT NULL constraint
        ends_at: endDateTime.toISOString(), // Required for ends_at NOT NULL constraint
        location: data.location,
        capacity: parseInt(data.capacity) || selectedTemplate.defaultCapacity,
        is_public: data.isPublic || false,
        is_template: false, // This is a real event, not a template
        // Store additional data in metadata to avoid constraint issues
        metadata: {
          event_type: 'standard',
          category: selectedTemplate.category,
          templateUsed: selectedTemplate.id,
          templateName: selectedTemplate.title,
          createdFromTemplate: true,
          venue: data.venue, // Store venue in metadata since column doesn't exist
          price: parseFloat(data.price) || selectedTemplate.defaultPrice, // Store price in metadata
          currency: data.currency || 'USD', // Store currency in metadata
          registration_fields: selectedTemplate.suggestedFields,
          event_settings: {
            allowWaitlist: data.allowWaitlist || true,
            requireApproval: data.requireApproval || false,
            sendConfirmation: true,
            collectPayment: data.price > 0,
            earlyBirdDiscount: data.earlyBirdDiscount || false,
            groupDiscounts: data.groupDiscounts || false,
            cancellationPolicy: data.cancellationPolicy || 'Full refund up to 7 days before event'
          },
          features: selectedTemplate.features,
          target_audience: selectedTemplate.targetAudience
        }
      };

      console.log('Creating event with data:', eventData);
      console.log('Date values:', {
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        starts_at: startDateTime.toISOString(),
        ends_at: endDateTime.toISOString()
      });
      
      // Try the new API first
      let response = await api.events.createEvent(user.id, eventData);
      
      // If that fails, try the legacy API as fallback
      if (response.error) {
        console.log('New API failed, trying legacy API...');
        try {
          const legacyResponse = await api.post('/api/events', eventData);
          response = { event: legacyResponse.data, error: null };
        } catch (legacyError) {
          console.error('Both APIs failed:', legacyError);
          throw new Error(response.error);
        }
      }
      
      if (response.error) {
        console.error('Event creation error:', response.error);
        throw new Error(response.error);
      }

      console.log('Event created successfully:', response.event);
      toast.success('Professional event created successfully!');
      
      if (onEventCreated) {
        onEventCreated(response.event);
      }
      
      // Reset form and close modal
      reset();
      setSelectedTemplate(null);
      setStep(1);
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error.message || 'Failed to create event. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCategoryColor = (category) => {
    const colors = {
      business: 'bg-blue-50 text-blue-700 border-blue-200',
      education: 'bg-purple-50 text-purple-700 border-purple-200',
      social: 'bg-pink-50 text-pink-700 border-pink-200',
      entertainment: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading professional templates...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Event Creator</h1>
            <p className="text-gray-600 mt-1">Create professional events using our comprehensive templates</p>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <span className="ml-2 font-medium">Choose Template</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <span className="ml-2 font-medium">Event Details</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Review & Create</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Professional Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg bg-${template.color}-50 group-hover:bg-${template.color}-100 transition-colors`}>
                        <IconComponent className={`w-6 h-6 text-${template.color}-600`} />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{template.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{template.defaultCapacity} capacity</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{template.defaultDuration} hours</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{formatPrice(template.defaultPrice)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{template.features.length} features included</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && selectedTemplate && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
              <p className="text-gray-600">Customize your {selectedTemplate.title}</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Templates
            </button>
          </div>

          <form onSubmit={handleSubmit(() => setStep(3))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                  <input
                    {...register('title', { required: 'Event title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your event"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    {...register('location', { required: 'Location is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Event location or venue"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue/Room</label>
                  <input
                    {...register('venue')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specific venue or room name"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    {...register('startDate', { required: 'Start date is required' })}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input
                    {...register('startTime', { required: 'Start time is required' })}
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    {...register('endDate', { required: 'End date is required' })}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input
                    {...register('endTime', { required: 'End time is required' })}
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
                </div>
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                <input
                  {...register('capacity', { required: 'Capacity is required', min: 1 })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                <input
                  {...register('price', { min: 0 })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Event Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    {...register('isPublic')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Make event public</span>
                </label>

                <label className="flex items-center">
                  <input
                    {...register('allowWaitlist')}
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow waitlist</span>
                </label>

                <label className="flex items-center">
                  <input
                    {...register('requireApproval')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require approval</span>
                </label>

                <label className="flex items-center">
                  <input
                    {...register('earlyBirdDiscount')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Early bird discount</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Continue to Review →
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && selectedTemplate && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Review & Create Event</h2>
            <button
              onClick={() => setStep(2)}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Details
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <p className="text-gray-900">{watch('title')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-900">{watch('description')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-900">{watch('location')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date & Time:</span>
                    <p className="text-gray-900">{watch('startDate')} at {watch('startTime')} - {watch('endDate')} at {watch('endTime')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Capacity:</span>
                    <p className="text-gray-900">{watch('capacity')} attendees</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Price:</span>
                    <p className="text-gray-900">{formatPrice(watch('price') || 0)} {watch('currency') || 'USD'}</p>
                  </div>
                </div>
              </div>

              {/* Template Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Features</h3>
                <div className="space-y-2">
                  {selectedTemplate.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Target Audience:</strong> {selectedTemplate.targetAudience}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ← Back to Details
            </button>
            <button
              onClick={handleSubmit(handleEventCreation)}
              disabled={isCreating}
              className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Creating Event...
                </>
              ) : (
                'Create Professional Event'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalEventCreator;
