import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Clock, MapPin, Globe, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EnhancedCreateEventModal = ({ event, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [debugMode, setDebugMode] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: 50,
      registrationRequired: true,
      isPublic: false,
      publishNow: false
    }
  });

  const eventTemplates = [
    {
      id: 'standard',
      name: 'Standard Event',
      description: 'Basic event with essential details',
      fields: ['title', 'description', 'date', 'time', 'location', 'capacity']
    },
    {
      id: 'conference',
      name: 'Conference',
      description: 'Professional conference with speakers and agenda',
      fields: ['title', 'description', 'date', 'time', 'location', 'capacity', 'speakers', 'agenda']
    },
    {
      id: 'workshop',
      name: 'Workshop',
      description: 'Interactive workshop with materials and requirements',
      fields: ['title', 'description', 'date', 'time', 'location', 'capacity', 'materials', 'requirements']
    },
    {
      id: 'webinar',
      name: 'Webinar',
      description: 'Online webinar with virtual meeting details',
      fields: ['title', 'description', 'date', 'time', 'meetingLink', 'capacity', 'platform']
    }
  ];

  useEffect(() => {
    if (event) {
      // Populate form with existing event data
      setValue('title', event.title || '');
      setValue('description', event.description || '');
      setValue('date', event.starts_at ? new Date(event.starts_at).toISOString().split('T')[0] : '');
      setValue('time', event.starts_at ? new Date(event.starts_at).toTimeString().slice(0, 5) : '');
      setValue('location', event.location || '');
      setValue('capacity', event.capacity || 50);
      setValue('registrationRequired', event.registration_required !== false);
      setValue('isPublic', event.is_public || false);
      setValue('meetingLink', event.virtual_link || '');
      setValue('publishNow', event.status === 'published');
      setSelectedTemplate(event.event_type || 'standard');
    }
  }, [event, setValue]);

  const handleFormSubmit = async (data) => {
    if (!user) {
      toast.error('Please log in to create events');
      return;
    }

    console.log('🚀 Starting event submission...', { user: user.id, data });

    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!data.title || !data.date || !data.time) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Create proper date-time
      const startDateTime = new Date(data.date + 'T' + data.time);
      if (isNaN(startDateTime.getTime())) {
        toast.error('Invalid date or time format');
        setIsSubmitting(false);
        return;
      }

      const eventData = {
        title: data.title.trim(),
        description: data.description?.trim() || '',
        event_type: selectedTemplate,
        starts_at: startDateTime.toISOString(),
        ends_at: data.endDate && data.endTime ? 
          new Date(data.endDate + 'T' + data.endTime).toISOString() : 
          null,
        location: data.location?.trim() || '',
        virtual_link: data.meetingLink?.trim() || '',
        capacity: parseInt(data.capacity) || 0,
        registration_required: data.registrationRequired !== false,
        is_public: data.isPublic === true,
        status: data.publishNow ? 'published' : 'draft',
        metadata: {
          template: selectedTemplate,
          speakers: data.speakers?.trim() || '',
          agenda: data.agenda?.trim() || '',
          materials: data.materials?.trim() || '',
          requirements: data.requirements?.trim() || '',
          platform: data.platform?.trim() || ''
        }
      };

      console.log('📝 Event data prepared:', eventData);

      let response;
      if (event) {
        // Update existing event
        console.log('🔄 Updating existing event:', event.id);
        response = await api.events.updateEvent(event.id, eventData);
      } else {
        // Create new event
        console.log('➕ Creating new event for user:', user.id);
        response = await api.events.createEvent(user.id, eventData);
      }

      console.log('📡 API Response:', response);

      if (response.error) {
        console.error('❌ API Error:', response.error);
        toast.error(`Failed to ${event ? 'update' : 'create'} event: ${response.error}`);
      } else if (response.event) {
        console.log('✅ Event saved successfully:', response.event);
        const action = event ? 'updated' : 'created';
        const status = data.publishNow ? ' and published' : '';
        toast.success(`Event ${action}${status} successfully!`);
        reset();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        console.error('❌ Unexpected response format:', response);
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      console.error('💥 Exception during event submission:', error);
      toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectDatabaseTest = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      console.log('🧪 Testing direct database access...');
      
      // Import supabase directly for testing
      const { supabase } = await import('../lib/supabase');
      
      const testEvent = {
        user_id: user.id,
        title: 'Test Event - ' + new Date().toISOString(),
        description: 'Test event created for debugging',
        event_type: 'standard',
        starts_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        location: 'Test Location',
        capacity: 10,
        registration_required: true,
        is_public: false,
        status: 'draft',
        metadata: {}
      };

      console.log('📝 Test event data:', testEvent);

      const { data, error } = await supabase
        .from('events')
        .insert(testEvent)
        .select()
        .single();

      if (error) {
        console.error('❌ Direct database error:', error);
        toast.error(`Database error: ${error.message}`);
      } else {
        console.log('✅ Direct database success:', data);
        toast.success('Direct database test successful!');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('💥 Direct database test failed:', error);
      toast.error(`Test failed: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="text-gray-600">Fill in the details for your event</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              Debug {debugMode ? 'ON' : 'OFF'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {debugMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Debug Information</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>User ID: {user?.id || 'Not logged in'}</p>
              <p>User Email: {user?.email || 'No email'}</p>
              <p>Event Mode: {event ? 'Edit' : 'Create'}</p>
              <p>Selected Template: {selectedTemplate}</p>
              <button
                onClick={handleDirectDatabaseTest}
                className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
              >
                Test Direct Database
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Template
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {eventTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-3 rounded-lg border text-left ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Event title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                {...register('capacity', { min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Maximum attendees"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your event"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                {...register('date', { required: 'Event date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time *
              </label>
              <input
                type="time"
                {...register('time', { required: 'Event time is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.time && (
                <p className="text-red-600 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event location or address"
            />
          </div>

          {/* Virtual Link for Webinars */}
          {selectedTemplate === 'webinar' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Meeting Link
              </label>
              <input
                type="url"
                {...register('meetingLink')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://zoom.us/j/..."
              />
            </div>
          )}

          {/* Additional Fields Based on Template */}
          {selectedTemplate === 'conference' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speakers
                </label>
                <textarea
                  {...register('speakers')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List of speakers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agenda
                </label>
                <textarea
                  {...register('agenda')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event agenda"
                />
              </div>
            </div>
          )}

          {selectedTemplate === 'workshop' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Needed
                </label>
                <textarea
                  {...register('materials')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Required materials"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  {...register('requirements')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Prerequisites or requirements"
                />
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">
              <Settings className="w-4 h-4 inline mr-1" />
              Event Settings
            </h3>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('registrationRequired')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Registration Required</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isPublic')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Public Event</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('publishNow')}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">Publish Immediately</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedCreateEventModal;
