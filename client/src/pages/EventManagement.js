import React, { useState } from 'react';
import EventManagementDashboard from '../components/EventManagementDashboard';
import EventRegistrationForm from '../components/EventRegistrationForm';
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react';

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample event data for demonstration
  const sampleEvents = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      description: 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
      date: '2024-12-15',
      time: '09:00',
      location: 'Convention Center, Downtown',
      capacity: 500,
      registrations: 342,
      price: 299.99,
      template: 'conference'
    },
    {
      id: 2,
      title: 'Web Development Workshop',
      description: 'Hands-on workshop covering modern web development techniques and best practices.',
      date: '2024-11-20',
      time: '14:00',
      location: 'Tech Hub, Innovation District',
      capacity: 50,
      registrations: 47,
      price: 99.99,
      template: 'workshop'
    },
    {
      id: 3,
      title: 'Virtual Marketing Summit',
      description: 'Learn from marketing experts in this comprehensive online summit.',
      date: '2024-12-01',
      time: '10:00',
      location: 'Online (Zoom)',
      capacity: 200,
      registrations: 156,
      price: 149.99,
      template: 'webinar'
    }
  ];

  const handleRegistrationSubmit = async (formData) => {
    // Simulate API call
    console.log('Registration submitted:', formData);
    alert('Registration submitted successfully! Check the console for details.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600 mt-2">Create, manage, and track your events</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('registration')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'registration'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Registration Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <EventManagementDashboard />
        ) : (
          <div className="space-y-8">
            {/* Sample Events Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {event.template}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{event.registrations}/{event.capacity} registered</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            ${event.price}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form Demo */}
            {selectedEvent && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Registration Form Demo
                  </h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <EventRegistrationForm
                  eventData={selectedEvent}
                  onSubmit={handleRegistrationSubmit}
                />
              </div>
            )}

            {/* Features Section */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Management Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Event Creation</h3>
                  <p className="text-gray-600 text-sm">
                    Create events with customizable templates and forms
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Management</h3>
                  <p className="text-gray-600 text-sm">
                    Track registrations, manage capacity, and export data
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Templates</h3>
                  <p className="text-gray-600 text-sm">
                    Choose from conference, workshop, webinar, and custom templates
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement; 