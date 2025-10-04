import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ProductionQRCodeSystem from './ProductionQRCodeSystem';
import { getSurveyUrl, getShortSurveyUrl } from '../utils/urlUtils';
import {
  X,
  Copy,
  Download,
  Share2,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  QrCode,
  Link as LinkIcon,
  ExternalLink,
  Users,
  Globe,
  Eye,
  BarChart3,
  CheckCircle,
  Smartphone,
  Monitor
} from 'lucide-react';

/**
 * Production-Ready Survey Share Modal
 * Built for reliability and production deployment
 */
const ProductionSurveyShareModal = ({ survey, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('qr');
  const [qrSize, setQrSize] = useState(() => {
    // Set initial size based on device
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) return 280; // Small mobile
      if (screenWidth < 768) return 320; // Large mobile
      return 250; // Tablet
    }
    return 200; // Desktop
  });
  const [copied, setCopied] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobile, setIsMobile] = useState(false);

  // Safety check for survey prop
  if (!survey || !survey.id) {
    console.error('ProductionSurveyShareModal: Invalid survey prop', survey);
    return null;
  }

  const surveyUrl = getSurveyUrl(survey.id);
  const shortUrl = getShortSurveyUrl(survey.id);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Enhanced copy to clipboard with fallbacks
  const copyToClipboard = async (text, message = 'Copied to clipboard!') => {
    try {
      if (!text) {
        toast.error('No text to copy');
        return;
      }

      let success = false;

      // Try modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          success = true;
        } catch (error) {
          console.warn('Clipboard API failed, trying fallback:', error);
        }
      }

      // Fallback for older browsers
      if (!success) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (success) {
        toast.success(message);
        setCopied(true);
      } else {
        throw new Error('Copy operation failed');
      }
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy. Please copy manually.');
    }
  };

  // Share functions
  const shareViaEmail = () => {
    const subject = `Survey: ${survey.title}`;
    const body = `Hi,\n\nI'd like to invite you to participate in our survey: "${survey.title}"\n\n${survey.description || ''}\n\nPlease click the link below to get started:\n${surveyUrl}\n\nThank you for your time!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareViaSMS = () => {
    const message = `Survey: ${survey.title}\n${surveyUrl}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`);
  };

  const shareViaSocial = (platform) => {
    const text = `Check out this survey: ${survey.title}`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(surveyUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(surveyUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(surveyUrl)}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const tabs = [
    { id: 'qr', label: 'QR Code', icon: QrCode },
    { id: 'url', label: 'Share URL', icon: LinkIcon },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'mobile', label: 'Mobile', icon: Smartphone }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Share Survey</h2>
                <p className="text-gray-600 text-sm sm:text-base truncate">{survey.title}</p>
                {!isOnline && (
                  <p className="text-sm text-orange-600 mt-1">⚠️ You're offline - some features may be limited</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 sm:space-x-8 px-2 sm:px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
            {/* QR Code Tab */}
            {activeTab === 'qr' && (
              <div className="space-y-6">
                <ProductionQRCodeSystem
                  surveyId={survey.id}
                  surveyTitle={survey.title}
                  surveyUrl={surveyUrl}
                  size={qrSize}
                  onDownload={(filename) => toast.success(`QR code downloaded: ${filename}`)}
                  onCopy={() => copyToClipboard(surveyUrl, 'Survey URL copied!')}
                  onError={(error) => console.error('QR Code error:', error)}
                />
                
                <div className="flex items-center justify-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Size:</span>
                    <select
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    >
                      <option value={150}>Small (150px)</option>
                      <option value={200}>Medium (200px)</option>
                      <option value={280}>Mobile (280px)</option>
                      <option value={300}>Large (300px)</option>
                      <option value={320}>XL Mobile (320px)</option>
                      <option value={400}>Extra Large (400px)</option>
                    </select>
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <QrCode className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">QR Code Usage Tips:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Print on flyers, posters, or business cards</li>
                        <li>• Display on screens at events or locations</li>
                        <li>• Include in email signatures or presentations</li>
                        <li>• Share on social media for easy mobile access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* URL Sharing Tab */}
            {activeTab === 'url' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={surveyUrl}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(surveyUrl, 'URL copied!')}
                      className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short URL (Easier to share)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(shortUrl, 'Short URL copied!')}
                      className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={shareViaEmail}
                    disabled={!isOnline}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Share via Email</span>
                  </button>
                  
                  <button
                    onClick={shareViaSMS}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Share via SMS</span>
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Survey Information:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">
                        {survey.responseCount || 0} responses
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">
                        {survey.questions?.length || 0} questions
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">
                        ~{Math.ceil((survey.questions?.length || 0) * 0.5)} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Share on Social Media</h3>
                  <p className="text-gray-600">
                    Share your survey across social platforms to reach a wider audience
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => shareViaSocial('facebook')}
                    disabled={!isOnline}
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </button>
                  
                  <button
                    onClick={() => shareViaSocial('twitter')}
                    disabled={!isOnline}
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </button>
                  
                  <button
                    onClick={() => shareViaSocial('linkedin')}
                    disabled={!isOnline}
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </button>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Share2 className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Social Media Tips:</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Keep messages concise and engaging</li>
                        <li>• Include relevant hashtags for better reach</li>
                        <li>• Mention incentives or benefits for participation</li>
                        <li>• Post at optimal times for your audience</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Tab */}
            {activeTab === 'mobile' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile-Optimized Sharing</h3>
                  <p className="text-gray-600">
                    Optimized sharing options for mobile devices
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => copyToClipboard(surveyUrl, 'Survey URL copied!')}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copy URL</span>
                  </button>
                  
                  <button
                    onClick={() => shareViaSMS()}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Send SMS</span>
                  </button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Smartphone className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Mobile Sharing Tips:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• QR codes work best on mobile devices</li>
                        <li>• SMS sharing is perfect for local audiences</li>
                        <li>• Copy URL for messaging apps like WhatsApp</li>
                        <li>• Mobile users prefer shorter URLs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Survey is live</span>
                </div>
                
                <a
                  href={surveyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Live Survey</span>
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                
                <button
                  onClick={() => copyToClipboard(surveyUrl, 'Survey URL copied!')}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy URL</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductionSurveyShareModal;
