import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  Heart,
  Building,
  GraduationCap,
  Globe,
  PenTool,
  Zap,
  Clock as ClockIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdvancedEventRegistrationForm from './AdvancedEventRegistrationForm';

const AdvancedEventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    revenue: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        name: 'Tech Conference 2024',
        category: 'conference',
        description: 'Comprehensive tech conference with multiple tracks, workshops, and networking',
        date: '2024-03-15',
        time: '09:00',
        location: 'San Francisco Convention Center',
        capacity: 500,
        registered: 342,
        price: 299.99,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        features: ['Keynote speakers', 'Multiple tracks', 'Networking', 'Workshops'],
        tags: ['Technology', 'Networking', 'Professional Development']
      },
      {
        id: 2,
        name: 'Leadership Development Program',
        category: 'training',
        description: 'Comprehensive leadership training with assessments and follow-up coaching',
        date: '2024-04-10',
        time: '10:00',
        location: 'Virtual Event',
        capacity: 25,
        registered: 18,
        price: 1499.99,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
        features: ['Leadership assessments', 'One-on-one coaching', 'Certification'],
        tags: ['Leadership', 'Professional Development', 'Coaching']
      },
      {
        id: 3,
        name: 'Wellness Retreat 2024',
        category: 'wellness',
        description: 'Comprehensive wellness retreat with personalized health programs',
        date: '2024-05-20',
        time: '08:00',
        location: 'Mountain View Resort',
        capacity: 50,
        registered: 45,
        price: 899.99,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        features: ['Yoga sessions', 'Spa treatments', 'Nutrition workshops'],
        tags: ['Wellness', 'Health', 'Retreat']
      }
    ];

    setEvents(mockEvents);
    setStats({
      totalEvents: mockEvents.length,
      activeEvents: mockEvents.filter(e => e.status === 'active').length,
      totalRegistrations: mockEvents.reduce((sum, e) => sum + e.registered, 0),
      revenue: mockEvents.reduce((sum, e) => sum + (e.registered * e.price), 0)
    });
    setLoading(false);
  }, []);

  const handleRegistration = async (registrationData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update event registration count
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, registered: event.registered + 1 }
          : event
      ));

      setShowRegistrationForm(false);
      setSelectedEvent(null);
      toast.success('Registration submitted successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.category === filter;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      conference: <Building className="w-5 h-5" />,
      training: <GraduationCap className="w-5 h-5" />,
      wellness: <Heart className="w-5 h-5" />,
      virtual: <Globe className="w-5 h-5" />,
      workshop: <PenTool className="w-5 h-5" />,
      wedding: <Heart className="w-5 h-5" />
    };
    return icons[category] || <Calendar className="w-5 h-5" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRegistrationProgress = (registered, capacity) => {
    const percentage = (registered / capacity) * 100;
    return {
      percentage,
      color: percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
    };
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Event Management Dashboard</h1>
          <p className="text-gray-600">Manage and track your events</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
            </div>
            <Zap className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="conference">Conference</option>
              <option value="training">Training</option>
              <option value="wellness">Wellness</option>
              <option value="virtual">Virtual</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        <AnimatePresence>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden ${view === 'list' ? 'flex' : ''}`}
            >
              {/* Event Image */}
              <div className={`${view === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Content */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {getCategoryIcon(event.category)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{event.registered}/{event.capacity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${event.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Registration Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Registration Progress</span>
                      <span className="font-medium">
                        {Math.round((event.registered / event.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getRegistrationProgress(event.registered, event.capacity).color}`}
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-4">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRegistrationForm(true);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Register
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Advanced Registration Form */}
      <AdvancedEventRegistrationForm
        event={selectedEvent}
        isOpen={showRegistrationForm}
        onSubmit={handleRegistration}
        onCancel={() => {
          setShowRegistrationForm(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};

export default AdvancedEventDashboard; 