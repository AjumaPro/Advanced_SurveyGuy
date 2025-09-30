import React from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { Copy, Download, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSurveyUrl } from '../utils/urlUtils';

const SurveyQRCode = ({ 
  surveyId, 
  size = 120, 
  showActions = true, 
  className = '',
  title = null 
}) => {
  const surveyUrl = getSurveyUrl(surveyId);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyUrl);
    toast.success('Survey URL copied to clipboard!');
  };

  const downloadQRCode = () => {
    // For now, just copy the URL and show instructions
    copyToClipboard();
    toast.success('Use the Share modal for full QR code download!');
  };

  return (
    <div className={`inline-block ${className}`}>
      {title && (
        <div className="text-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        </div>
      )}
      
      <div className="relative group">
        <div className="p-3 bg-white border-2 border-gray-200 rounded-lg shadow-sm group-hover:border-blue-300 transition-colors">
          <QRCode
            value={surveyUrl}
            size={size}
            level="M"
            includeMargin={false}
            className="block"
          />
        </div>
        
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={downloadQRCode}
                className="p-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                title="Download QR Code"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showActions && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">Hover for actions</p>
        </div>
      )}
    </div>
  );
};

export default SurveyQRCode;
