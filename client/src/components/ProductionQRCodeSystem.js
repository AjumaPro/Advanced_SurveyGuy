import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { Download, Copy, AlertCircle, CheckCircle, QrCode, RefreshCw, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Production-Ready QR Code System
 * Built for reliability, error handling, and production deployment
 */
const ProductionQRCodeSystem = ({ 
  surveyId,
  surveyTitle = "Survey",
  surveyUrl = null,
  size = 200,
  className = "",
  showTitle = true,
  showActions = true,
  showTips = true,
  onDownload,
  onCopy,
  onError
}) => {
  // State management
  const [qrError, setQrError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationAttempts, setGenerationAttempts] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobile, setIsMobile] = useState(false);
  const [qrId] = useState(`prod-qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-optimized size calculation
  const mobileSize = useMemo(() => {
    if (isMobile) {
      // On mobile, make QR code larger for easier scanning
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) return 280; // Small mobile
      if (screenWidth < 768) return 320; // Large mobile
      return 250; // Tablet
    }
    return size; // Desktop size
  }, [isMobile, size]);

  // Generate production-ready URL
  const finalSurveyUrl = useMemo(() => {
    if (surveyUrl) return surveyUrl;
    if (!surveyId) return null;
    
    // Always use current origin for production compatibility
    const baseUrl = window.location.origin;
    return `${baseUrl}/survey/${surveyId}`;
  }, [surveyId, surveyUrl]);

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

  // QR Code generation with retry logic
  useEffect(() => {
    if (!finalSurveyUrl) return;

    const generateQRCode = async () => {
      try {
        setIsGenerating(true);
        setQrError(false);
        
        // Validate URL format
        if (!isValidUrl(finalSurveyUrl)) {
          throw new Error('Invalid survey URL format');
        }
        
        // Check if survey URL is accessible (only in production)
        if (process.env.NODE_ENV === 'production') {
          await validateSurveyUrl(finalSurveyUrl);
        }
        
        // Simulate generation time for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setIsGenerating(false);
      } catch (error) {
        console.error('QR Code generation failed:', error);
        setQrError(true);
        setIsGenerating(false);
        onError?.(error);
        
        // Retry logic (max 3 attempts)
        if (generationAttempts < 3) {
          setTimeout(() => {
            setGenerationAttempts(prev => prev + 1);
          }, 1000 * (generationAttempts + 1));
        }
      }
    };

    generateQRCode();
  }, [finalSurveyUrl, generationAttempts, onError]);

  // URL validation
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Survey URL validation
  const validateSurveyUrl = async (url) => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // Avoid CORS issues
      });
      return true;
    } catch (error) {
      console.warn('Survey URL validation failed:', error);
      return true; // Don't block QR generation for validation failures
    }
  };

  // Download QR Code
  const handleDownload = useCallback(() => {
    try {
      const canvas = document.getElementById(qrId);
      if (!canvas) {
        throw new Error('QR code canvas not found');
      }

      // Create download link
      const link = document.createElement('a');
      const filename = `${surveyTitle.replace(/[^a-z0-9]/gi, '_')}_${surveyId}_qr.png`;
      link.download = filename;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('QR code downloaded successfully!');
      onDownload?.(filename);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download QR code. Please try again.');
    }
  }, [qrId, surveyTitle, surveyId, onDownload]);

  // Copy URL to clipboard
  const handleCopy = useCallback(async () => {
    try {
      if (!finalSurveyUrl) {
        throw new Error('No URL to copy');
      }

      let success = false;

      // Try modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(finalSurveyUrl);
          success = true;
        } catch (error) {
          console.warn('Clipboard API failed, trying fallback:', error);
        }
      }

      // Fallback for older browsers
      if (!success) {
        const textArea = document.createElement('textarea');
        textArea.value = finalSurveyUrl;
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
        toast.success('Survey URL copied to clipboard!');
        onCopy?.(finalSurveyUrl);
      } else {
        throw new Error('Copy operation failed');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy URL. Please copy manually.');
    }
  }, [finalSurveyUrl, onCopy]);

  // Retry QR generation
  const handleRetry = useCallback(() => {
    setQrError(false);
    setGenerationAttempts(0);
    setIsGenerating(true);
  }, []);

  // Open survey in new tab
  const handleOpenSurvey = useCallback(() => {
    if (finalSurveyUrl) {
      window.open(finalSurveyUrl, '_blank', 'noopener,noreferrer');
    }
  }, [finalSurveyUrl]);

  // Render loading state
  if (isGenerating) {
    return (
      <div className={`text-center ${className}`}>
        {showTitle && (
          <div className="flex items-center justify-center mb-4">
            <QrCode className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Generating QR Code</h3>
          </div>
        )}
        
        <div className="inline-block p-4 sm:p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center" style={{ width: mobileSize, height: mobileSize }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Creating QR code...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (qrError) {
    return (
      <div className={`text-center ${className}`}>
        {showTitle && (
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg sm:text-xl font-semibold text-red-900">QR Code Error</h3>
          </div>
        )}
        
        <div className="inline-block p-4 sm:p-6 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center" style={{ width: mobileSize, height: mobileSize }}>
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600 mb-3">Failed to generate QR code</p>
              
              {!isOnline && (
                <p className="text-xs text-red-500 mb-3">No internet connection</p>
              )}
              
              <button
                onClick={handleRetry}
                className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="mt-4">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mx-auto min-h-[44px]"
            >
              <Copy className="w-4 h-4" />
              <span>Copy URL Instead</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render successful QR code
  return (
    <div className={`text-center ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-center mb-4">
          <QrCode className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{surveyTitle}</h3>
        </div>
      )}
      
      <div className="inline-block p-4 sm:p-6 bg-white border-2 border-green-200 rounded-xl shadow-sm">
        <QRCode
          id={qrId}
          value={finalSurveyUrl}
          size={mobileSize}
          level="M"
          includeMargin={true}
          renderAs="canvas"
          onError={() => setQrError(true)}
          style={{ display: 'block' }}
        />
      </div>
      
      {showActions && (
        <div className="mt-4 space-y-3">
          <p className="text-base sm:text-sm text-gray-600">
            {isMobile ? 'Scan this QR code with your camera app' : 'Scan this QR code to access the survey instantly'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[48px] w-full sm:w-auto"
            >
              <Download className="w-5 h-5" />
              <span className="text-base">Download</span>
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors min-h-[48px] w-full sm:w-auto"
            >
              <Copy className="w-5 h-5" />
              <span className="text-base">Copy URL</span>
            </button>
            
            <button
              onClick={handleOpenSurvey}
              className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors min-h-[48px] w-full sm:w-auto"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="text-base">Open Survey</span>
            </button>
          </div>
        </div>
      )}

      {showTips && (
        <div className="mt-4 p-4 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-base sm:text-sm font-medium text-green-800 mb-2">QR Code Tips:</p>
              <ul className="text-sm sm:text-xs text-green-700 space-y-1">
                <li>• Works on all mobile devices and QR scanners</li>
                <li>• Print or display for easy scanning access</li>
                <li>• Share via social media, email, or messaging apps</li>
                <li>• High-quality download for professional use</li>
                {isMobile && <li>• Tap and hold to save or share the QR code</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionQRCodeSystem;
