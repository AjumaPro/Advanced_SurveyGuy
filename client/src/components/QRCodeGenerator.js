import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const QRCodeGenerator = ({ 
  url, 
  title = "QR Code", 
  showDownload = true, 
  size = 200, 
  className = "" 
}) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (url) {
      generateQRCode();
    }
  }, [url, size]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const qrDataURL = await QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `${title}-qrcode.png`;
      link.href = qrCodeDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm text-gray-600">Generating QR code...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center mb-4">
        <QrCode className="w-5 h-5 mr-2 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      {qrCodeDataURL && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img 
              src={qrCodeDataURL} 
              alt={`QR Code for ${title}`} 
              className="border border-gray-200 rounded-lg" 
            />
          </div>
          
          {showDownload && (
            <button
              onClick={downloadQRCode}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;

