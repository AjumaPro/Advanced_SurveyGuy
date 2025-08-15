import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, Users, Mail, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';

const EventRegistrationForm = ({ eventData, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const eventTemplates = [
    {
      id: 'standard',
      name: 'Standard Event',
      fields: ['name', 'email', 'phone', 'attendees'],
      description: 'Basic event registration with contact info'
    },
    {
      id: 'conference',
      name: 'Conference',
      fields: ['name', 'email', 'phone', 'company', 'position', 'dietary', 'attendees'],
      description: 'Professional conference with company details'
    },
    {
      id: 'workshop',
      name: 'Workshop',
      fields: ['name', 'email', 'phone', 'experience', 'goals', 'attendees'],
      description: 'Interactive workshop with experience level'
    },
    {
      id: 'wedding',
      name: 'Wedding',
      fields: ['name', 'email', 'phone', 'plusOne', 'dietary', 'attendees'],
      description: 'Wedding celebration with dietary preferences'
    },
    {
      id: 'custom',
      name: 'Custom Event',
      fields: ['name', 'email', 'phone', 'attendees', 'custom'],
      description: 'Fully customizable registration form'
    }
  ];

  const currentTemplate = eventTemplates.find(t => t.id === selectedTemplate);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        eventId: eventData?.id,
        template: selectedTemplate,
        registrationDate: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default submission logic
        console.log('Form submitted:', formData);
        toast.success('Registration submitted successfully!');
      }
      
      reset();
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Event Details Header */}
      {eventData && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{eventData.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{eventData.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{eventData.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{eventData.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{eventData.capacity} spots available</span>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Registration Form Template
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Registration Details
        </h3>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Full name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Template-specific fields */}
        {currentTemplate.fields.includes('company') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                {...register('company')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                {...register('position')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your job title"
              />
            </div>
          </div>
        )}

        {currentTemplate.fields.includes('experience') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              {...register('experience')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        )}

        {currentTemplate.fields.includes('goals') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workshop Goals
            </label>
            <textarea
              {...register('goals')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What do you hope to learn from this workshop?"
            />
          </div>
        )}

        {currentTemplate.fields.includes('plusOne') && (
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('plusOne')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                I will bring a plus one
              </span>
            </label>
          </div>
        )}

        {currentTemplate.fields.includes('dietary') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Requirements
            </label>
            <select
              {...register('dietary')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No special requirements</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-free</option>
              <option value="dairy-free">Dairy-free</option>
              <option value="nut-free">Nut-free</option>
              <option value="other">Other (please specify)</option>
            </select>
          </div>
        )}

        {currentTemplate.fields.includes('custom') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              {...register('custom')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information or special requests..."
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Number of Attendees *
          </label>
          <input
            type="number"
            {...register('attendees', { 
              required: 'Number of attendees is required',
              min: { value: 1, message: 'Minimum 1 attendee' },
              max: { value: 10, message: 'Maximum 10 attendees' }
            })}
            min="1"
            max="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Number of people attending"
          />
          {errors.attendees && (
            <p className="text-red-500 text-sm mt-1">{errors.attendees.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Registration...
              </span>
            ) : (
              'Submit Registration'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationForm; 