/**
 * Social Media Sharing Component
 */

import React, { useState } from 'react';
import { 
  shareToSocialMedia, 
  generateSocialPreview, 
  exportSocialContent,
  generateSocialMediaImage,
  SOCIAL_PLATFORMS 
} from '../utils/socialMediaShare';
import { Share2, Copy, Download, ExternalLink, Check } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SocialMediaShare = ({ analyticsData, chartRefs = {}, className = '' }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [isSharing, setIsSharing] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleShare = async (platform) => {
    setIsSharing(true);
    try {
      const result = await shareToSocialMedia(platform, analyticsData, {
        url: window.location.href
      });
      
      if (result.type === 'modal') {
        // Show Instagram modal
        setShowExportModal(true);
        setSelectedPlatform('instagram');
      } else if (result.type === 'opened') {
        toast.success(`Opening ${SOCIAL_PLATFORMS[platform].name} share window...`);
      }
    } catch (error) {
      toast.error(`Failed to share to ${SOCIAL_PLATFORMS[platform].name}: ${error.message}`);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyContent = async (platform) => {
    try {
      const content = exportSocialContent(analyticsData, [platform])[platform];
      await navigator.clipboard.writeText(content.content);
      setCopiedPlatform(platform);
      toast.success(`Content copied for ${SOCIAL_PLATFORMS[platform].name}`);
      
      setTimeout(() => {
        setCopiedPlatform(null);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const handleExportAll = () => {
    const allContent = exportSocialContent(analyticsData);
    const exportText = Object.values(allContent)
      .map(platform => `=== ${platform.platform} ===\n${platform.content}\n\n`)
      .join('');
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social_media_content_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Social media content exported successfully!');
  };

  const platforms = Object.keys(SOCIAL_PLATFORMS);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Share on Social Media</h3>
            <p className="text-sm text-gray-600">Spread your analytics insights across platforms</p>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {platforms.map((platform) => {
            const platformConfig = SOCIAL_PLATFORMS[platform];
            const preview = generateSocialPreview(analyticsData, platform);
            
            return (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedPlatform === platform
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <platformConfig.icon 
                    className="w-6 h-6" 
                    style={{ color: platformConfig.color }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-900">{platformConfig.name}</div>
                <div className={`text-xs mt-1 ${
                  preview.isOptimal ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {preview.characterCount}/{preview.maxLength}
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Preview */}
        {selectedPlatform && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                Preview - {SOCIAL_PLATFORMS[selectedPlatform].name}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(selectedPlatform)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copiedPlatform === selectedPlatform ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div 
              className="p-4 bg-gray-50 rounded-lg border"
              style={{ 
                borderColor: SOCIAL_PLATFORMS[selectedPlatform].color + '20',
                backgroundColor: SOCIAL_PLATFORMS[selectedPlatform].color + '05'
              }}
            >
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {generateSocialPreview(analyticsData, selectedPlatform).content}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleShare(selectedPlatform)}
            disabled={isSharing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: SOCIAL_PLATFORMS[selectedPlatform]?.color }}
          >
            {isSharing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sharing...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Share to {SOCIAL_PLATFORMS[selectedPlatform]?.name}
              </>
            )}
          </button>
          
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>

        {/* Platform Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-900 mb-2">💡 Sharing Tips</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• LinkedIn: Best for professional insights and B2B content</li>
            <li>• Twitter: Use for quick updates and trending discussions</li>
            <li>• Facebook: Great for community engagement and detailed posts</li>
            <li>• Instagram: Visual content works best with stories and posts</li>
            <li>• WhatsApp: Perfect for team updates and internal sharing</li>
          </ul>
        </div>
      </div>

      {/* Instagram Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaInstagram className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instagram Post</h3>
                <p className="text-sm text-gray-600">Copy this content for your Instagram post</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border mb-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {exportSocialContent(analyticsData, ['instagram']).instagram.content}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopyContent('instagram')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <Copy className="w-4 h-4" />
                Copy Content
              </button>
              
              <button
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Instagram
              </button>
              
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaShare;
