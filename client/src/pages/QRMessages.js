import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import {
  QrCode,
  Plus,
  MessageSquare,
  Calendar,
  Heart,
  Gift,
  Star,
  Eye,
  Copy,
  Download,
  Trash2,
  Clock
} from 'lucide-react';

const QRMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [newMessage, setNewMessage] = useState({
    title: '',
    content: '',
    type: 'thank_you',
    isPublic: false,
    expiresAt: null
  });

  // Message types with icons and colors
  const messageTypes = [
    {
      id: 'thank_you',
      name: 'Thank You',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500',
      description: 'Express gratitude to customers'
    },
    {
      id: 'appointment',
      name: 'Appointment',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500',
      description: 'Schedule or confirm appointments'
    },
    {
      id: 'special_offer',
      name: 'Special Offer',
      icon: <Gift className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Share exclusive deals and offers'
    },
    {
      id: 'feedback',
      name: 'Feedback Request',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-500',
      description: 'Request customer feedback'
    },
    {
      id: 'announcement',
      name: 'Announcement',
      icon: <Star className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      description: 'Share important announcements'
    }
  ];

  // Fetch user's QR messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('qr_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, fetchMessages]);

  // Create new QR message
  const handleCreateMessage = async () => {
    try {
      if (!newMessage.title.trim() || !newMessage.content.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { data, error } = await supabase
        .from('qr_messages')
        .insert([{
          user_id: user.id,
          title: newMessage.title,
          content: newMessage.content,
          type: newMessage.type,
          is_public: newMessage.isPublic,
          expires_at: newMessage.expiresAt,
          qr_code_url: `${window.location.origin}/qr-message/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [data, ...prev]);
      setShowCreateModal(false);
      setNewMessage({
        title: '',
        content: '',
        type: 'thank_you',
        isPublic: false,
        expiresAt: null
      });
      toast.success('QR message created successfully!');
    } catch (error) {
      console.error('Error creating message:', error);
      toast.error('Failed to create message');
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('qr_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Generate QR code for a message
  const generateQRCode = async (message) => {
    try {
      const qrUrl = `${window.location.origin}/qr-message/${message.id}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  // Show QR modal with generated code
  const handleShowQR = async (message) => {
    setSelectedMessage(message);
    setShowQRModal(true);
    await generateQRCode(message);
  };

  // Copy QR code URL
  const copyQRUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('QR code URL copied to clipboard!');
  };

  // Download QR code
  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `qr-code-${selectedMessage?.id || 'message'}.png`;
      link.href = qrCodeDataUrl;
      link.click();
      toast.success('QR code downloaded!');
    }
  };

  // Get message type info
  const getMessageTypeInfo = (type) => {
    return messageTypes.find(t => t.id === type) || messageTypes[0];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <QrCode className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-extrabold text-gray-900">QR Messages</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create custom messages that customers can discover by scanning QR codes. 
              Perfect for thank you notes, appointments, special offers, and more!
            </p>
          </motion.div>
        </div>

        {/* Create Message Button */}
        <div className="text-center mb-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center mx-auto shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New QR Message
          </motion.button>
        </div>

        {/* Messages Grid */}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No QR Messages Yet</h3>
            <p className="text-gray-600 mb-6">Create your first QR message to start engaging with customers</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Message
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message, index) => {
              const typeInfo = getMessageTypeInfo(message.type);
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Message Type Header */}
                  <div className={`bg-gradient-to-r ${typeInfo.color} p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {typeInfo.icon}
                        <span className="ml-2 font-semibold">{typeInfo.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {message.is_public && (
                          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                            Public
                          </span>
                        )}
                        {message.expires_at && new Date(message.expires_at) > new Date() && (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{message.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{message.content}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{message.scan_count || 0} scans</span>
                      </div>
                      <span>{formatDate(message.created_at)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleShowQR(message)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        View QR
                      </button>
                      <button
                        onClick={() => copyQRUrl(`${window.location.origin}/qr-message/${message.id}`)}
                        className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Message Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Create QR Message</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateMessage();
                }} className="space-y-6">
                  {/* Message Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Message Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {messageTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setNewMessage({ ...newMessage, type: type.id })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            newMessage.type === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white mr-3`}>
                              {type.icon}
                            </div>
                            <span className="font-medium text-gray-900">{type.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={newMessage.title}
                      onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                      placeholder="Enter message title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Content *</label>
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      placeholder="Enter your message content"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newMessage.isPublic}
                        onChange={(e) => setNewMessage({ ...newMessage, isPublic: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                        Make this message public (visible to anyone with the QR code)
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date (Optional)</label>
                      <input
                        type="datetime-local"
                        value={newMessage.expiresAt || ''}
                        onChange={(e) => setNewMessage({ ...newMessage, expiresAt: e.target.value || null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create QR Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">QR Code</h2>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center">
                  <div className="bg-white p-8 rounded-lg mb-4 border">
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code" 
                        className="w-64 h-64 mx-auto"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">Generating QR Code...</p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Share this QR code with customers. When they scan it, they'll see your message.
                  </p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => copyQRUrl(`${window.location.origin}/qr-message/${selectedMessage.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </button>
                    <button 
                      onClick={downloadQRCode}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRMessages;
