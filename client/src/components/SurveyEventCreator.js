import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  Calendar,
  Users,
  Star,
  CheckCircle,
  Loader2,
  Eye,
  Share2,
  Settings,
  Zap,
  Crown,
  BookOpen,
  Globe,
  Clock,
  MapPin,
  DollarSign,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const SurveyEventCreator = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('surveys');
  const [creating, setCreating] = useState(false);
  const [createdItems, setCreatedItems] = useState([]);

  // Survey form state
  const [surveyForm, setSurveyForm] = useState({
    title: '',
    description: '',
    category: 'business',
    template: 'custom'
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxAttendees: 100,
    registrationFee: 0,
    type: 'conference'
  });

  const surveyTemplates = [
    {
      id: 'customer-satisfaction',
      name: 'Customer Satisfaction Survey',
      description: 'Measure customer satisfaction with your products and services',
      icon: <Star className="w-6 h-6" />,
      questions: [
        { type: 'text', title: 'What is your name?', required: true },
        { type: 'email', title: 'What is your email?', required: true },
        { type: 'rating', title: 'How satisfied are you? (1-5 stars)', required: true },
        { type: 'multiple_choice', title: 'How likely are you to recommend us?', required: true, options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'] },
        { type: 'textarea', title: 'What can we improve?', required: false }
      ]
    },
    {
      id: 'employee-engagement',
      name: 'Employee Engagement Survey',
      description: 'Assess employee satisfaction and engagement levels',
      icon: <Users className="w-6 h-6" />,
      questions: [
        { type: 'multiple_choice', title: 'What department do you work in?', required: true, options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'] },
        { type: 'rating', title: 'How satisfied are you with your role?', required: true },
        { type: 'matrix', title: 'Rate your work environment:', required: true, rows: ['Work-Life Balance', 'Career Growth', 'Team Collaboration'], columns: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] },
        { type: 'yes_no', title: 'Would you recommend this company?', required: true },
        { type: 'textarea', title: 'Suggestions for improvement', required: false }
      ]
    },
    {
      id: 'event-feedback',
      name: 'Event Feedback Survey',
      description: 'Collect feedback after conferences, workshops, or events',
      icon: <Calendar className="w-6 h-6" />,
      questions: [
        { type: 'text', title: 'What is your name?', required: true },
        { type: 'multiple_choice', title: 'How did you hear about this event?', required: true, options: ['Social Media', 'Email', 'Website', 'Colleague', 'Other'] },
        { type: 'rating', title: 'Overall event rating', required: true },
        { type: 'checkbox', title: 'Which sessions did you attend?', required: false, options: ['Keynote', 'Panel Discussion', 'Workshop A', 'Workshop B', 'Networking'] },
        { type: 'emoji_scale', title: 'How was the venue?', required: false },
        { type: 'textarea', title: 'Topics for future events', required: false }
      ]
    },
    {
      id: 'market-research',
      name: 'Market Research Survey',
      description: 'Understand market needs and customer preferences',
      icon: <BookOpen className="w-6 h-6" />,
      questions: [
        { type: 'multiple_choice', title: 'What is your age range?', required: true, options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
        { type: 'multiple_choice', title: 'What is your occupation?', required: true, options: ['Student', 'Professional', 'Business Owner', 'Retired', 'Other'] },
        { type: 'checkbox', title: 'Which products interest you?', required: false, options: ['Product A', 'Product B', 'Product C', 'Service X', 'Service Y'] },
        { type: 'rating', title: 'How important is price?', required: true },
        { type: 'matrix', title: 'Rate these factors:', required: true, rows: ['Quality', 'Price', 'Brand Reputation'], columns: ['Not Important', 'Somewhat Important', 'Important', 'Very Important'] },
        { type: 'textarea', title: 'Desired product features', required: false }
      ]
    },
    {
      id: 'nps-survey',
      name: 'Net Promoter Score (NPS)',
      description: 'Measure customer loyalty and satisfaction',
      icon: <Zap className="w-6 h-6" />,
      questions: [
        { type: 'text', title: 'What is your name?', required: true },
        { type: 'rating', title: 'How likely are you to recommend us? (0-10)', required: true, maxRating: 10 },
        { type: 'textarea', title: 'What is the main reason for your score?', required: false },
        { type: 'multiple_choice', title: 'What could we improve?', required: false, options: ['Customer Service', 'Product Quality', 'Pricing', 'Website Experience', 'Other'] }
      ]
    },
    {
      id: 'custom',
      name: 'Custom Survey',
      description: 'Start with a blank survey and build your own',
      icon: <Plus className="w-6 h-6" />,
      questions: []
    }
  ];

  const eventTemplates = [
    {
      id: 'conference',
      name: 'Tech Conference',
      description: 'Multi-day technology conference with speakers and workshops',
      icon: <Globe className="w-6 h-6" />,
      duration: '3 days',
      capacity: 500,
      fee: 299.99
    },
    {
      id: 'webinar',
      name: 'Online Webinar',
      description: 'Educational webinar for remote attendees',
      icon: <Users className="w-6 h-6" />,
      duration: '1-2 hours',
      capacity: 1000,
      fee: 0
    },
    {
      id: 'workshop',
      name: 'Training Workshop',
      description: 'Hands-on training workshop for skill development',
      icon: <BookOpen className="w-6 h-6" />,
      duration: '1 day',
      capacity: 50,
      fee: 89.99
    },
    {
      id: 'networking',
      name: 'Networking Event',
      description: 'Professional networking mixer and social event',
      icon: <Users className="w-6 h-6" />,
      duration: '3 hours',
      capacity: 150,
      fee: 25.00
    },
    {
      id: 'product-launch',
      name: 'Product Launch',
      description: 'Product announcement and demonstration event',
      icon: <Zap className="w-6 h-6" />,
      duration: '2 hours',
      capacity: 200,
      fee: 49.99
    },
    {
      id: 'custom',
      name: 'Custom Event',
      description: 'Create your own custom event from scratch',
      icon: <Plus className="w-6 h-6" />,
      duration: 'Custom',
      capacity: 100,
      fee: 0
    }
  ];

  const handleCreateSurvey = async () => {
    if (!surveyForm.title.trim()) {
      toast.error('Please enter a survey title');
      return;
    }

    setCreating(true);
    try {
      const selectedTemplate = surveyTemplates.find(t => t.id === surveyForm.template);
      
      const surveyData = {
        title: surveyForm.title,
        description: surveyForm.description || `A ${selectedTemplate.name.toLowerCase()}`,
        questions: selectedTemplate.questions.map((q, index) => ({
          id: `q_${Date.now()}_${index}`,
          type: q.type,
          title: q.title,
          required: q.required || false,
          settings: {
            options: q.options || [],
            maxRating: q.maxRating || 5,
            rows: q.rows || [],
            columns: q.columns || [],
            placeholder: q.placeholder || '',
            ...q.settings
          }
        })),
        settings: {
          allowAnonymous: true,
          collectEmail: true,
          showProgress: true,
          randomizeQuestions: false,
          requireAll: false,
          theme: 'modern',
          brandColor: '#3B82F6'
        }
      };

      const { survey, error } = await api.surveys.createSurvey(user.id, surveyData);
      
      if (error) throw new Error(error);

      const newItem = {
        id: survey.id,
        type: 'survey',
        title: survey.title,
        description: survey.description,
        status: 'draft',
        createdAt: new Date().toLocaleTimeString()
      };

      setCreatedItems(prev => [newItem, ...prev]);
      setSurveyForm({ title: '', description: '', category: 'business', template: 'custom' });
      
      toast.success(`Survey "${survey.title}" created successfully!`);
      
    } catch (error) {
      console.error('Error creating survey:', error);
      toast.error(`Failed to create survey: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    if (!eventForm.startDate || !eventForm.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    setCreating(true);
    try {
      const selectedTemplate = eventTemplates.find(t => t.id === eventForm.type);
      
      const eventData = {
        title: eventForm.title,
        description: eventForm.description || `A ${selectedTemplate.name.toLowerCase()}`,
        startDate: new Date(eventForm.startDate).toISOString(),
        endDate: new Date(eventForm.endDate).toISOString(),
        location: eventForm.location || 'TBD',
        maxAttendees: eventForm.maxAttendees,
        registrationFee: eventForm.registrationFee,
        status: 'active',
        settings: {
          allowWaitlist: true,
          requireApproval: false,
          collectDietaryRequirements: selectedTemplate.id === 'conference',
          collectEmergencyContact: selectedTemplate.id === 'workshop',
          sendReminders: true,
          customFields: []
        }
      };

      const { event, error } = await api.events.createEvent(user.id, eventData);
      
      if (error) throw new Error(error);

      const newItem = {
        id: event.id,
        type: 'event',
        title: event.title,
        description: event.description,
        status: 'active',
        createdAt: new Date().toLocaleTimeString()
      };

      setCreatedItems(prev => [newItem, ...prev]);
      setEventForm({ 
        title: '', 
        description: '', 
        startDate: '', 
        endDate: '', 
        location: '', 
        maxAttendees: 100, 
        registrationFee: 0, 
        type: 'conference' 
      });
      
      toast.success(`Event "${event.title}" created successfully!`);
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(`Failed to create event: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSurveyForm(prev => ({ ...prev, template: templateId }));
  };

  const handleEventTemplateSelect = (templateId) => {
    const template = eventTemplates.find(t => t.id === templateId);
    setEventForm(prev => ({
      ...prev,
      type: templateId,
      maxAttendees: template.capacity,
      registrationFee: template.fee
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Surveys & Events</h1>
              <p className="text-gray-600 mt-2">Quickly create professional surveys and events using templates</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('surveys')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'surveys'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Surveys
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'events'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Events
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'surveys' && (
              <motion.div
                key="surveys"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Survey Templates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surveyTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          surveyForm.template === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            surveyForm.template === template.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {template.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.questions.length} questions</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Survey Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Survey Title *
                      </label>
                      <input
                        type="text"
                        value={surveyForm.title}
                        onChange={(e) => setSurveyForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter survey title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={surveyForm.category}
                        onChange={(e) => setSurveyForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="business">Business</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="marketing">Marketing</option>
                        <option value="research">Research</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={surveyForm.description}
                      onChange={(e) => setSurveyForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your survey..."
                    />
                  </div>
                  <button
                    onClick={handleCreateSurvey}
                    disabled={creating || !surveyForm.title.trim()}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                    {creating ? 'Creating Survey...' : 'Create Survey'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Event Templates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose an Event Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleEventTemplateSelect(template.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          eventForm.type === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            eventForm.type === template.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {template.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.duration}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Capacity: {template.capacity}</span>
                          <span>Fee: ${template.fee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter event title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Event location..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={eventForm.startDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={eventForm.endDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        value={eventForm.maxAttendees}
                        onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Fee ($)
                      </label>
                      <input
                        type="number"
                        value={eventForm.registrationFee}
                        onChange={(e) => setEventForm(prev => ({ ...prev, registrationFee: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your event..."
                    />
                  </div>
                  <button
                    onClick={handleCreateEvent}
                    disabled={creating || !eventForm.title.trim() || !eventForm.startDate || !eventForm.endDate}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                    {creating ? 'Creating Event...' : 'Create Event'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Created Items */}
          {createdItems.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Created</h3>
              <div className="space-y-3">
                {createdItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      {item.type === 'survey' ? (
                        <FileText className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Calendar className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500">Created at {item.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyEventCreator;
