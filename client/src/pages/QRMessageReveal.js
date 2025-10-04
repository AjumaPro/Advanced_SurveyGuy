import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  Heart,
  Calendar,
  Gift,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Share2,
  Copy,
  ArrowLeft
} from 'lucide-react';

const QRMessageReveal = () => {
  const { messageId } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Message types with icons and colors
  const messageTypes = {
    thank_you: {
      name: 'Thank You',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    appointment: {
      name: 'Appointment',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    special_offer: {
      name: 'Special Offer',
      icon: <Gift className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    feedback: {
      name: 'Feedback Request',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    announcement: {
      name: 'Announcement',
      icon: <Star className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  };

  // Fetch message data
  const fetchMessage = async () => {
    try {
      setLoading(true);
      
      // Extract the actual message ID from the URL parameter
      const actualMessageId = messageId.split('-')[0];
      
      const { data, error } = await supabase
        .from('qr_messages')
        .select('*')
        .eq('id', actualMessageId)
        .single();

      if (error) throw error;

      if (!data) {
        setError('Message not found');
        return;
      }

      // Check if message has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('This message has expired');
        return;
      }

      // Check if message is public or user has access
      if (!data.is_public) {
        setError('This message is not publicly available');
        return;
      }

      setMessage(data);

      // Increment scan count
      await supabase
        .from('qr_messages')
        .update({ scan_count: (data.scan_count || 0) + 1 })
        .eq('id', actualMessageId);

    } catch (error) {
      console.error('Error fetching message:', error);
      setError('Failed to load message');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messageId) {
      fetchMessage();
    }
  }, [messageId]);

  // Copy message content
  const copyMessage = () => {
    if (message) {
      navigator.clipboard.writeText(message.content);
      setScanned(true);
    }
  };

  // Share message
  const shareMessage = async () => {
    if (navigator.share && message) {
      try {
        await navigator.share({
          title: message.title,
          text: message.content,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your message...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Not Available</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (!message) return null;

  const typeInfo = messageTypes[message.type] || messageTypes.thank_you;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-2xl shadow-xl border-2 ${typeInfo.borderColor} overflow-hidden`}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${typeInfo.color} p-8 text-white text-center`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              {typeInfo.icon}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              {message.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-90"
            >
              {typeInfo.name} Message
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${typeInfo.bgColor} p-6 rounded-xl border ${typeInfo.borderColor} mb-6`}
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </motion.div>

            {/* Message Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between text-sm text-gray-500 mb-6"
            >
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Scanned {new Date().toLocaleDateString()}</span>
              </div>
              {message.expires_at && (
                <div className="flex items-center">
                  <span>Expires {new Date(message.expires_at).toLocaleDateString()}</span>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex space-x-3"
            >
              <button
                onClick={copyMessage}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Message
              </button>
              <button
                onClick={shareMessage}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </motion.div>

            {/* Success Message */}
            {scanned && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800">Message copied to clipboard!</span>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-sm text-gray-500">
              This message was created with SurveyGuy QR Messages
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QRMessageReveal;
