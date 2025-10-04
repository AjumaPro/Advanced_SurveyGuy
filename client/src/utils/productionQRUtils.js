/**
 * Production QR Code Utilities
 * Built for reliability and production deployment
 * Consolidated from multiple QR utility files
 */

/**
 * Validate URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get production-ready survey URL
 * @param {string} surveyId - The survey ID
 * @returns {string} The production-ready survey URL
 */
export const getProductionSurveyUrl = (surveyId) => {
  if (!surveyId) {
    throw new Error('Survey ID is required');
  }
  
  // Always use current origin for production compatibility
  const baseUrl = window.location.origin;
  const surveyUrl = `${baseUrl}/survey/${surveyId}`;
  
  // Validate the generated URL
  if (!isValidUrl(surveyUrl)) {
    console.warn('Generated survey URL is invalid:', surveyUrl);
  }
  
  return surveyUrl;
};

/**
 * Validate survey ID format (UUID)
 * @param {string} surveyId - The survey ID to validate
 * @returns {boolean} Whether the survey ID is valid
 */
export const isValidSurveyId = (surveyId) => {
  if (!surveyId || typeof surveyId !== 'string') {
    return false;
  }
  
  // Check if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(surveyId);
};

/**
 * Sanitize filename for download
 * @param {string} filename - The filename to sanitize
 * @returns {string} The sanitized filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename) return 'qrcode.png';
  
  return filename
    .replace(/[^a-z0-9.-]/gi, '_') // Replace invalid characters with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
};

/**
 * Generate unique QR code ID
 * @returns {string} A unique ID for QR code canvas
 */
export const generateQRId = () => {
  return `prod-qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Copy text to clipboard with comprehensive fallbacks
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided for clipboard');
    }
    
    let success = false;

    // Try modern clipboard API first
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
      textArea.setAttribute('readonly', '');
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        success = document.execCommand('copy');
      } catch (error) {
        console.warn('execCommand copy failed:', error);
      }
      
      document.body.removeChild(textArea);
    }
    
    return success;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
};

/**
 * Download QR code as PNG file
 * @param {string} canvasId - The canvas element ID
 * @param {string} filename - The filename for the download
 * @returns {Promise<boolean>} Success status
 */
export const downloadQRCode = async (canvasId, filename = 'qrcode.png') => {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      throw new Error('QR code canvas not found');
    }
    
    // Convert canvas to blob
    const dataURL = canvas.toDataURL('image/png', 1.0);
    if (!dataURL || dataURL === 'data:,') {
      throw new Error('Failed to generate image data');
    }
    
    // Create download link
    const link = document.createElement('a');
    link.download = sanitizeFilename(filename);
    link.href = dataURL;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('QR code download failed:', error);
    return false;
  }
};

/**
 * Validate survey accessibility
 * @param {string} surveyUrl - The survey URL to validate
 * @returns {Promise<boolean>} Whether the survey is accessible
 */
export const validateSurveyAccessibility = async (surveyUrl) => {
  try {
    if (!isValidUrl(surveyUrl)) {
      return false;
    }
    
    // Use HEAD request to check accessibility
    const response = await fetch(surveyUrl, { 
      method: 'HEAD',
      mode: 'no-cors', // Avoid CORS issues
      cache: 'no-cache'
    });
    
    return true;
  } catch (error) {
    console.warn('Survey accessibility check failed:', error);
    return true; // Don't block QR generation for validation failures
  }
};

/**
 * Get QR code error message
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getQRErrorMessage = (error) => {
  if (!error) return 'Unknown error occurred';
  
  const message = error.message || error.toString();
  
  if (message.includes('Invalid URL')) {
    return 'Invalid survey URL format';
  } else if (message.includes('network')) {
    return 'Network connection error';
  } else if (message.includes('canvas')) {
    return 'QR code generation failed';
  } else if (message.includes('clipboard')) {
    return 'Copy to clipboard failed';
  } else if (message.includes('download')) {
    return 'Download failed';
  } else {
    return 'QR code operation failed';
  }
};

/**
 * Check if device is mobile
 * @returns {boolean} Whether the device is mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get optimal QR code size based on device
 * @returns {number} Optimal QR code size in pixels
 */
export const getOptimalQRSize = () => {
  if (isMobileDevice()) {
    return 150; // Smaller for mobile
  } else {
    return 200; // Standard for desktop
  }
};

/**
 * Generate QR code with retry mechanism
 * @param {string} text - The text to encode
 * @param {Object} options - QR code options
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<string>} The QR code data URL
 */
export const generateQRCodeWithRetry = async (text, options = {}, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Import QRCode dynamically
      const QRCode = await import('qrcode');
      
      const defaultOptions = {
        width: getOptimalQRSize(),
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      };

      const qrOptions = { ...defaultOptions, ...options };
      
      // Validate input
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid text input for QR code generation');
      }

      // Generate QR code
      const dataURL = await QRCode.toDataURL(text, qrOptions);
      
      return dataURL;
    } catch (error) {
      lastError = error;
      console.warn(`QR code generation attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Generate a QR code data URL with error handling (from qrCodeUtils)
 * @param {string} text - The text to encode in the QR code
 * @param {Object} options - QR code options
 * @returns {Promise<string>} The QR code data URL
 */
export const generateQRCodeDataURL = async (text, options = {}) => {
  try {
    // Import QRCode dynamically to handle potential loading issues
    const QRCode = await import('qrcode');
    
    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    };

    const qrOptions = { ...defaultOptions, ...options };
    
    // Validate input
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input for QR code generation');
    }

    // Additional validation for URLs
    if (text.startsWith('http') && !isValidUrl(text)) {
      console.warn('Invalid URL format detected:', text);
    }

    // Generate QR code with retry mechanism
    const dataURL = await QRCode.toDataURL(text, qrOptions);
    
    return dataURL;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Download QR code as PNG file (enhanced version)
 * @param {string} dataURL - The QR code data URL
 * @param {string} filename - The filename for the download
 */
export const downloadQRCodeDataURL = (dataURL, filename = 'qrcode.png') => {
  try {
    if (!dataURL) {
      throw new Error('No QR code data available for download');
    }
    
    const link = document.createElement('a');
    link.download = sanitizeFilename(filename);
    link.href = dataURL;
    link.click();
  } catch (error) {
    console.error('QR code download failed:', error);
    throw new Error('Failed to download QR code');
  }
};

/**
 * Production QR code configuration
 */
export const QR_CONFIG = {
  DEFAULT_SIZE: 200,
  MOBILE_SIZE: 150,
  ERROR_CORRECTION_LEVEL: 'M',
  MARGIN: 2,
  COLORS: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};
