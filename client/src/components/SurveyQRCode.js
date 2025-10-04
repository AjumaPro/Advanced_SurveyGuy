import React, { useState } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { Copy, Download, QrCode, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSurveyUrl } from '../utils/urlUtils';
import { generateQRId, copyToClipboard, downloadQRCode, isValidSurveyId } from '../utils/productionQRUtils';

const SurveyQRCode = ({ 
  surveyId, 
  size = 120, 
  showActions = true, 
  className = '',
  title = null 
}) => {
  const surveyUrl = getSurveyUrl(surveyId);
  const [qrError, setQrError] = useState(false);
  const [qrId] = useState(generateQRId());

  // Validate survey ID
  if (!isValidSurveyId(surveyId)) {
    console.error('Invalid survey ID:', surveyId);
    return (
      <div className={`inline-block ${className}`}>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Invalid survey ID</p>
        </div>
      </div>
    );
  }

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboard(surveyUrl);
    if (success) {
      toast.success('Survey URL copied to clipboard!');
    } else {
      toast.error('Failed to copy URL. Please copy manually.');
    }
  };

  const handleDownloadQRCode = async () => {
    const filename = `survey-${surveyId}-qr-code.png`;
    const success = await downloadQRCode(qrId, filename);
    if (success) {
      toast.success('QR code downloaded successfully!');
    } else {
      toast.error('Failed to download QR code');
    }
  };

  const handleQRError = () => {
    setQrError(true);
    toast.error('Failed to generate QR code');
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
          {qrError ? (
            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
              <div className="text-center">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-xs text-red-600">QR Error</p>
              </div>
            </div>
          ) : (
            <QRCode
              id={qrId}
              value={surveyUrl}
              size={size}
              level="M"
              includeMargin={true}
              renderAs="canvas"
              onError={handleQRError}
              className="block"
            />
          )}
        </div>
        
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyToClipboard}
                className="p-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleDownloadQRCode}
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
