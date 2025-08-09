import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Mail,
  Calendar,
  Trash2,
  CheckCircle,
  Bell,
  Settings,
  Search
} from 'lucide-react';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/subscriptions/user');
      setSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
      // Set empty array to show empty state
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to unsubscribe?')) {
      return;
    }

    try {
      await axios.delete(`/api/subscriptions/${subscriptionId}`);
      toast.success('Successfully unsubscribed');
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Failed to unsubscribe');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.survey_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || sub.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
              <p className="text-gray-600 mt-1">Manage your survey subscriptions and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subscriptions</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </motion.div>

        {/* Subscriptions List */}
        {filteredSubscriptions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-sm"
          >
            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
            <p className="text-gray-600 mb-4">
              {subscriptions.length === 0 
                ? "You haven't subscribed to any surveys yet."
                : "No subscriptions match your search criteria."
              }
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Bell className="h-4 w-4" />
              <span>Subscribe to surveys to receive updates and notifications</span>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredSubscriptions.map((subscription, index) => (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {subscription.survey_title || 'Untitled Survey'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {subscription.email}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Subscribed {formatDate(subscription.subscribed_at)}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingSubscription(subscription.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit preferences"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => unsubscribe(subscription.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Unsubscribe"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Preferences */}
                  {subscription.preferences && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className={`h-4 w-4 ${subscription.preferences.email_notifications ? 'text-green-500' : 'text-gray-300'}`} />
                          <span>Email Notifications</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className={`h-4 w-4 ${subscription.preferences.survey_updates ? 'text-green-500' : 'text-gray-300'}`} />
                          <span>Survey Updates</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions; 