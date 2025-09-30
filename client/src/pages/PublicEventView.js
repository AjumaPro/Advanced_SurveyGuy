import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const PublicEventView = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.events.getEvent(eventId);
      
      if (response.error) {
        console.error('Error fetching event:', response.error);
        setError(response.error);
        toast.error('Failed to load event details');
      } else if (response.event) {
        setEvent(response.event);
      } else {
        setError('Event not found');
        toast.error('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError(error.message);
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Event link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share event');
    }
  };

  const handleRegister = () => {
    navigate(`/app/events/register/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist or is no longer available.'}</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Check if event is public
  if (!event.is_public) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Private Event</h2>
          <p className="text-gray-600 mb-6">This event is not publicly available.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.start_date || event.starts_at || event.date);
  const now = new Date();
  const isPastEvent = eventDate < now;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              {!isPastEvent && event.is_active && (
                <button
                  onClick={handleRegister}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                {event.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Event Status */}
              {isPastEvent && (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 font-medium">This event has already taken place.</p>
                </div>
              )}

              {!event.is_active && !isPastEvent && (
                <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 font-medium">This event is currently not accepting registrations.</p>
                </div>
              )}

              {/* Additional Event Information */}
              {event.agenda && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Agenda</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{event.agenda}</p>
                  </div>
                </div>
              )}

              {event.speakers && event.speakers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Speakers</h3>
                  <div className="space-y-3">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {speaker.name ? speaker.name.charAt(0).toUpperCase() : 'S'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{speaker.name || 'Speaker'}</p>
                          {speaker.title && (
                            <p className="text-sm text-gray-600">{speaker.title}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.requirements && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{event.requirements}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date</p>
                    <p className="text-sm text-gray-600">
                      {eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Time</p>
                    <p className="text-sm text-gray-600">
                      {event.time || eventDate.toTimeString().slice(0, 5)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">
                      {event.location || 'To be announced'}
                    </p>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Capacity</p>
                      <p className="text-sm text-gray-600">
                        {event.capacity} attendees
                      </p>
                    </div>
                  </div>
                )}

                {event.virtual_link && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900 mb-1">Virtual Event</p>
                    <p className="text-sm text-blue-700">This event will be held online</p>
                    <a
                      href={event.virtual_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Join Online
                    </a>
                  </div>
                )}

                {event.price && event.price > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-900 mb-1">Price</p>
                    <p className="text-lg font-bold text-green-700">${event.price}</p>
                  </div>
                )}

                {event.price === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-900">Free Event</p>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              {!isPastEvent && event.is_active && (
                <div className="mt-6">
                  <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Register for Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventView;
