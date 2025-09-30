import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CreateEventModal = ({ event, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

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
    },
    {
      id: 'custom',
      name: 'Custom Event',
      description: 'Fully customizable event with all fields',
      fields: ['title', 'description', 'date', 'time', 'location', 'capacity', 'customFields']
    }
  ];

  useEffect(() => {
    if (event) {
      // Populate form with existing event data
      setValue('title', event.title);
      setValue('description', event.description);
      setValue('date', event.date);
      setValue('time', event.time);
      setValue('location', event.location);
      setValue('capacity', event.capacity);
      setValue('price', event.price);
      setValue('template', event.template || 'standard');
      setSelectedTemplate(event.template || 'standard');
    }
  }, [event, setValue]);

  const handleFormSubmit = async (data) => {
    if (!user) {
      toast.error('Please log in to create events');
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData = {
        title: data.title,
        description: data.description,
        event_type: selectedTemplate,
        start_date: new Date(data.date + 'T' + data.time).toISOString(),
        end_date: data.endDate ? new Date(data.endDate + 'T' + (data.endTime || data.time)).toISOString() : null,
        location: data.location,
        virtual_link: data.meetingLink,
        capacity: parseInt(data.capacity) || 0,
        registration_required: data.registrationRequired !== false,
        is_public: data.isPublic || false,
        metadata: {
          template: selectedTemplate,
          speakers: data.speakers,
          agenda: data.agenda,
          materials: data.materials,
          requirements: data.requirements,
          platform: data.platform
        }
      };

      if (event) {
        // Update existing event
        const response = await api.events.updateEvent(event.id, eventData);
        if (response.error) {
          toast.error(`Failed to update event: ${response.error}`);
        } else {
          toast.success('Event updated successfully!');
          reset();
          onSuccess();
        }
      } else {
        // Create new event
        const response = await api.events.createEvent(user.id, eventData);
        if (response.error) {
          toast.error(`Failed to create event: ${response.error}`);
        } else {
          toast.success('Event created successfully!');
          reset();
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(event ? 'Failed to update event' : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTemplate = eventTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Template Selection */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Event Template
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {eventTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-xs text-gray-500 mt-1">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Event title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                {...register('date', { required: 'Event date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time *
              </label>
              <input
                type="time"
                {...register('time', { required: 'Event time is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                {...register('capacity', { 
                  required: 'Capacity is required',
                  min: { value: 1, message: 'Capacity must be at least 1' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Maximum number of attendees"
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              {...register('location', { required: 'Location is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event location or venue"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your event..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Template-specific fields */}
          {currentTemplate.fields.includes('price') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00 (free if left empty)"
              />
            </div>
          )}

          {currentTemplate.fields.includes('speakers') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speakers
              </label>
              <textarea
                {...register('speakers')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List of speakers and their topics..."
              />
            </div>
          )}

          {currentTemplate.fields.includes('agenda') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agenda
              </label>
              <textarea
                {...register('agenda')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event agenda and schedule..."
              />
            </div>
          )}

          {currentTemplate.fields.includes('materials') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Materials
              </label>
              <textarea
                {...register('materials')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Materials participants should bring..."
              />
            </div>
          )}

          {currentTemplate.fields.includes('requirements') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <textarea
                {...register('requirements')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Prerequisites or requirements for participants..."
              />
            </div>
          )}

          {currentTemplate.fields.includes('meetingLink') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <input
                type="url"
                {...register('meetingLink')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Zoom, Teams, or other meeting link"
              />
            </div>
          )}

          {currentTemplate.fields.includes('platform') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                {...register('platform')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select platform</option>
                <option value="zoom">Zoom</option>
                <option value="teams">Microsoft Teams</option>
                <option value="meet">Google Meet</option>
                <option value="webex">Cisco Webex</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {event ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal; 