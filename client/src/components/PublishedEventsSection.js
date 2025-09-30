import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Eye, 
  Edit, 
  Share2, 
  Download,
  BarChart3,
  Globe,
  Copy,
  ExternalLink,
  Filter,
  Search,
  MoreVertical,
  Play,
  Pause,
  Archive,
  Trash2,
  Star,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import EventViewerModal from './EventViewerModal';

const PublishedEventsSection = () => {
  const { user } = useAuth();
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEventViewer, setShowEventViewer] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPublishedEvents();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPublishedEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Try to get published events first
      const response = await api.events.getEvents(user.id, { status: 'published' });
      
      if (response.error) {
        console.error('Error fetching published events:', response.error);
        toast.error('Failed to load published events');
        setPublishedEvents([]);
      } else {
        setPublishedEvents(response.events || []);
        
        // If no published events found, get all events and filter them
        if (!response.events || response.events.length === 0) {
          console.log('No published events found, checking all events...');
          const allEventsResponse = await api.events.getEvents(user.id);
          
          if (allEventsResponse.error) {
            console.error('Error fetching all events:', allEventsResponse.error);
            setPublishedEvents([]);
          } else {
            // Filter events that are not templates and have a published status or no status
            const filteredEvents = (allEventsResponse.events || []).filter(event => 
              !event.is_template && (event.status === 'published' || !event.status)
            );
            setPublishedEvents(filteredEvents);
            console.log(`Found ${filteredEvents.length} events to display`);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching published events:', error);
      toast.error('Failed to load published events');
      setPublishedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventAction = async (eventId, action) => {
    try {
      switch (action) {
        case 'view':
          setSelectedEvent(publishedEvents.find(e => e.id === eventId));
          setShowEventViewer(true);
          break;
        case 'edit':
          // Navigate to event editor
          window.open(`/app/events/${eventId}/edit`, '_blank');
          break;
        case 'share':
          const shareUrl = `${window.location.origin}/app/events/register/${eventId}`;
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Event registration link copied to clipboard!');
          break;
        case 'analytics':
          // Navigate to analytics
          window.open(`/app/events/${eventId}/analytics`, '_blank');
          break;
        case 'export':
          toast.success('Export functionality coming soon!');
          break;
        case 'publish':
          await api.events.publishEvent(eventId);
          toast.success('Event published successfully');
          fetchPublishedEvents();
          break;
        case 'unpublish':
          await api.events.unpublishEvent(eventId);
          toast.success('Event unpublished successfully');
          fetchPublishedEvents();
          break;
        case 'archive':
          await api.events.updateEvent(eventId, { status: 'archived' });
          toast.success('Event archived successfully');
          fetchPublishedEvents();
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            await api.events.deleteEvent(eventId);
            toast.success('Event deleted successfully');
            fetchPublishedEvents();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      toast.error(`Failed to ${action} event`);
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.start_date || event.starts_at || event.date);
    
    // Check if event has explicit status
    if (event.status === 'cancelled') {
      return { status: 'cancelled', color: 'bg-red-100 text-red-800', label: 'Cancelled' };
    }
    if (event.status === 'completed') {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800', label: 'Completed' };
    }
    if (event.status === 'draft') {
      return { status: 'draft', color: 'bg-yellow-100 text-yellow-800', label: 'Draft' };
    }
    
    // Auto-determine status based on date
    if (eventDate < now) {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800', label: 'Completed' };
    } else if (eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return { status: 'upcoming', color: 'bg-orange-100 text-orange-800', label: 'Starting Soon' };
    } else {
      return { status: 'published', color: 'bg-green-100 text-green-800', label: 'Published' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvents = publishedEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const eventStatus = getEventStatus(event);
      const matchesFilter = filterStatus === 'all' || eventStatus.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.start_date || a.starts_at || a.date) - new Date(b.start_date || b.starts_at || b.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'registrations':
          return (b.registrationCount || b.registrations || 0) - (a.registrationCount || a.registrations || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Published Events</h1>
          <p className="text-gray-600">Manage and track your published events</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <BarChart3 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Published</p>
              <p className="text-2xl font-bold text-gray-900">{publishedEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {publishedEvents.filter(e => getEventStatus(e).status === 'published').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {publishedEvents.filter(e => getEventStatus(e).status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">
                {publishedEvents.reduce((sum, event) => sum + (event.registrationCount || event.registrations || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search published events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="registrations">Sort by Registrations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No events found' : 'No published events yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Publish your first event to get started'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => window.location.href = '/app/events'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Event
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          <AnimatePresence>
            {filteredEvents.map((event) => {
              const status = getEventStatus(event);
              const eventDate = event.start_date || event.starts_at || event.date;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'p-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => handleEventAction(event.id, 'more')}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-3">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(eventDate)} at {formatTime(eventDate)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{event.registrationCount || event.registrations || 0} / {event.capacity || '∞'} registered</span>
                          </div>
                          {event.metadata?.price > 0 && (
                            <span className="font-medium text-green-600">
                              ${event.metadata.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEventAction(event.id, 'view')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEventAction(event.id, 'share')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Share Event"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEventAction(event.id, 'analytics')}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          {event.status === 'published' ? (
                            <button
                              onClick={() => handleEventAction(event.id, 'unpublish')}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Unpublish Event"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEventAction(event.id, 'publish')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Publish Event"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => window.open(`/app/events/register/${event.id}`, '_blank')}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Live
                        </button>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-1">{event.description}</p>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{formatDate(eventDate)}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              <span>{event.registrationCount || event.registrations || 0} registrations</span>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEventAction(event.id, 'view')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEventAction(event.id, 'edit')}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`/app/events/register/${event.id}`, '_blank')}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Live
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Event Viewer Modal */}
      {showEventViewer && selectedEvent && (
        <EventViewerModal
          event={selectedEvent}
          onClose={() => {
            setShowEventViewer(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default PublishedEventsSection;
