import React from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import toast from 'react-hot-toast';
import { X, Copy, ExternalLink, Download } from 'lucide-react';
import { getSurveyUrl } from '../utils/urlUtils';

const SimpleSurveyShare = ({ survey, isOpen, onClose }) => {
  if (!isOpen || !survey) return null;

  const surveyUrl = getSurveyUrl(survey.id);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(surveyUrl);
    toast.success('Survey URL copied to clipboard!');
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('simple-qr-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${survey.title || 'survey'}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('QR code downloaded!');
    }
  };

  const openSurvey = () => {
    window.open(surveyUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Share Survey</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mt-1">{survey.title}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* QR Code */}
          <div className="text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-lg border">
              <QRCode
                id="simple-qr-canvas"
                value={surveyUrl}
                size={200}
                level="M"
                includeMargin={true}
                renderAs="canvas"
              />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Scan this QR code to access the survey
            </p>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={surveyUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download QR</span>
            </button>
            
            <button
              onClick={openSurvey}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Survey</span>
            </button>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed Code
            </label>
            <div className="relative">
              <textarea
                value={`<iframe src="${surveyUrl}" width="100%" height="600" frameBorder="0" style="border: 1px solid #e5e7eb; border-radius: 8px;"></iframe>`}
                readOnly
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={() => {
                  const embedCode = `<iframe src="${surveyUrl}" width="100%" height="600" frameBorder="0" style="border: 1px solid #e5e7eb; border-radius: 8px;"></iframe>`;
                  navigator.clipboard.writeText(embedCode);
                  toast.success('Embed code copied!');
                }}
                className="absolute top-2 right-2 p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Survey is live and ready to share</span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSurveyShare;
