import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Globe, 
  Share2, 
  Download, 
  Copy,
  ExternalLink,
  QrCode,
  Mail,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import EventDebugger from './EventDebugger';

const EventViewerModal = ({ event, onClose }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (event) {
      generateQRCode();
      generateShareUrl();
    }
  }, [event, generateQRCode, generateShareUrl]);

  const generateQRCode = useCallback(async () => {
    try {
      console.log('🔧 Generating QR code for event:', event);
      const registrationUrl = `${window.location.origin}/app/events/register/${event.id}`;
      console.log('📱 Registration URL:', registrationUrl);
      
      const qrDataURL = await QRCode.toDataURL(registrationUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      console.log('✅ QR code generated successfully');
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('❌ Error generating QR code:', error);
      toast.error(`Failed to generate QR code: ${error.message}`);
    }
  }, [event]);

  const generateShareUrl = useCallback(() => {
    try {
      const baseUrl = window.location.origin;
      const eventUrl = `${baseUrl}/app/events/register/${event.id}`;
      console.log('🔗 Generated share URL:', eventUrl);
      setShareUrl(eventUrl);
    } catch (error) {
      console.error('❌ Error generating share URL:', error);
      toast.error(`Failed to generate share URL: ${error.message}`);
    }
  }, [event]);

  const copyToClipboard = async (text) => {
    try {
      console.log('📋 Copying to clipboard:', text);
      
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        console.warn('Clipboard API not available, using fallback');
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Copied to clipboard!');
        return;
      }
      
      await navigator.clipboard.writeText(text);
      console.log('✅ Successfully copied to clipboard');
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('❌ Failed to copy:', error);
      toast.error(`Failed to copy to clipboard: ${error.message}`);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `${event.title}-qrcode.png`;
      link.href = qrCodeDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    }
  };

  const shareToSocial = (platform) => {
    const text = `Check out this event: ${event.title}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    let shareUrl_social = '';
    switch (platform) {
      case 'twitter':
        shareUrl_social = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl_social = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl_social = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'mail':
        shareUrl_social = `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl_social = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl_social, '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const getEventStatus = () => {
    const now = new Date();
    const eventDate = new Date(event.start_date || event.starts_at || event.date);
    
    if (event.status === 'cancelled') {
      return { status: 'cancelled', color: 'bg-red-100 text-red-800', label: 'Cancelled' };
    }
    if (event.status === 'completed') {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800', label: 'Completed' };
    }
    if (eventDate < now) {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800', label: 'Completed' };
    } else if (eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return { status: 'upcoming', color: 'bg-orange-100 text-orange-800', label: 'Starting Soon' };
    } else {
      return { status: 'published', color: 'bg-green-100 text-green-800', label: 'Published' };
    }
  };

  const status = getEventStatus();

  if (!event) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color.replace('bg-', 'bg-white/20 ').replace('text-', 'text-white ')}`}>
                  {status.label}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {event.registrationCount || event.registrations || 0} registered
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Debug Info */}
          <div className="mb-6">
            <EventDebugger event={event} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {event.description || 'No description provided.'}
                </p>
              </div>

              {/* Event Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date</p>
                      <p className="text-sm text-gray-600">{formatDate(event.start_date || event.starts_at || event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Time</p>
                      <p className="text-sm text-gray-600">
                        {event.time || formatTime(event.start_date || event.starts_at || event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">
                        {event.location || 'To be announced'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Capacity</p>
                      <p className="text-sm text-gray-600">
                        {event.capacity ? `${event.capacity} attendees` : 'Unlimited'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Virtual Event Info */}
              {event.virtual_link && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Virtual Event</p>
                      <p className="text-sm text-blue-700 mb-2">This event will be held online</p>
                      <a
                        href={event.virtual_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Join Virtual Event
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Registration</p>
                    <p className="text-sm text-green-700 mb-2">
                      {event.registration_required !== false ? 'Registration required' : 'No registration required'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-700">
                        {event.registrationCount || event.registrations || 0} / {event.capacity || '∞'} registered
                      </span>
                      {event.capacity && (
                        <div className="flex-1 bg-green-200 rounded-full h-2 ml-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, ((event.registrationCount || event.registrations || 0) / event.capacity) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code and Sharing */}
            <div className="space-y-6">
              {/* QR Code */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  QR Code
                </h3>
                {qrCodeDataURL ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={qrCodeDataURL} 
                        alt="Event QR Code" 
                        className="border border-gray-200 rounded-lg"
                        onError={(e) => {
                          console.error('❌ QR code image failed to load:', e);
                          toast.error('Failed to display QR code image');
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Scan to register for this event
                    </p>
                    <button
                      onClick={downloadQRCode}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download QR Code
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-sm text-gray-600">Generating QR code...</p>
                    <button
                      onClick={generateQRCode}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      Retry QR Code Generation
                    </button>
                  </div>
                )}
              </div>

              {/* Share URL */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Event
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(shareUrl)}
                        className="px-3 py-2 bg-gray-600 text-white rounded-r-lg hover:bg-gray-700 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Social Sharing */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Share on Social Media</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => shareToSocial('twitter')}
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Twitter className="w-4 h-4" />
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => shareToSocial('facebook')}
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                      >
                        <Facebook className="w-4 h-4" />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => shareToSocial('linkedin')}
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={() => shareToSocial('mail')}
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Direct Link */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => window.open(shareUrl, '_blank')}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Registration Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.open(shareUrl, '_blank')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Registration Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventViewerModal;
