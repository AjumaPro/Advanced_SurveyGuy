import React, { useState } from 'react';
import { Copy, Globe, Settings, Eye, EyeOff, ExternalLink, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SimpleEmbedTab = ({ surveyUrl, surveyTitle }) => {
  const [embedWidth, setEmbedWidth] = useState('100%');
  const [embedHeight, setEmbedHeight] = useState('600px');
  const [showPreview, setShowPreview] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const getEmbedCode = () => {
    return `<iframe 
  src="${surveyUrl}" 
  width="${embedWidth}" 
  height="${embedHeight}" 
  frameBorder="0" 
  style="border: 1px solid #e5e7eb; border-radius: 8px; max-width: 100%;" 
  title="${surveyTitle} - Powered by SurveyGuy">
  <p>Your browser does not support iframes. <a href="${surveyUrl}" target="_blank">Click here to take the survey</a></p>
</iframe>`;
  };

  const copyEmbedCode = () => {
    try {
      navigator.clipboard.writeText(getEmbedCode());
      toast.success('Embed code copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy embed code');
    }
  };

  const resetPreview = () => {
    setIframeError(false);
    setIframeLoaded(false);
    setShowPreview(false);
    setTimeout(() => setShowPreview(true), 100);
  };

  const testEmbedInNewWindow = () => {
    const embedCode = getEmbedCode();
    const testWindow = window.open('', '_blank');
    testWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Embed Test - ${surveyTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
          .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .embed-container { margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Embed Test: ${surveyTitle}</h1>
          <p>This is how your survey will look when embedded on a website:</p>
          <div class="embed-container">
            ${embedCode}
          </div>
          <p><small>Test completed successfully! Close this window to return.</small></p>
        </div>
      </body>
      </html>
    `);
    testWindow.document.close();
    toast.success('Embed test opened in new window!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Embed Survey</h3>
        <p className="text-gray-600">
          Embed the survey directly into your website or blog
        </p>
      </div>

      {/* Embed Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Width
          </label>
          <select
            value={embedWidth}
            onChange={(e) => setEmbedWidth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="100%">100% (Responsive)</option>
            <option value="800px">800px (Desktop)</option>
            <option value="600px">600px (Tablet)</option>
            <option value="400px">400px (Mobile)</option>
            <option value="300px">300px (Sidebar)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height
          </label>
          <select
            value={embedHeight}
            onChange={(e) => setEmbedHeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="600px">600px (Standard)</option>
            <option value="800px">800px (Tall)</option>
            <option value="500px">500px (Compact)</option>
            <option value="400px">400px (Short)</option>
            <option value="300px">300px (Minimal)</option>
          </select>
        </div>
      </div>

      {/* Embed Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Embed Code
        </label>
        <div className="relative">
          <textarea
            value={getEmbedCode()}
            readOnly
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
          />
          <button
            onClick={copyEmbedCode}
            className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">Live Preview:</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(surveyUrl, '_blank')}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open Survey
            </button>
            <button
              onClick={testEmbedInNewWindow}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              <Eye className="w-3 h-3" />
              Test Embed
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Preview
                </>
              )}
            </button>
            {iframeError && (
              <button
                onClick={resetPreview}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
        
        {showPreview ? (
          <div className="space-y-3">
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600">
                  Embed Preview ({embedWidth} × {embedHeight})
                </p>
              </div>
              
              {iframeError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                  <p className="text-sm text-red-600 mb-2">Preview could not load</p>
                  <p className="text-xs text-gray-500 mb-4">
                    This is normal for some browsers. The embed code will still work on websites.
                  </p>
                  <button
                    onClick={() => window.open(surveyUrl, '_blank')}
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Survey in New Tab
                  </button>
                </div>
              ) : (
                <>
                  <div 
                    className="mx-auto border border-gray-300 rounded-lg overflow-hidden relative"
                    style={{ 
                      width: embedWidth === '100%' ? '100%' : Math.min(parseInt(embedWidth) || 600, 600) + 'px',
                      height: Math.min(parseInt(embedHeight) || 400, 400) + 'px',
                      maxWidth: '100%'
                    }}
                  >
                    {!iframeLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-xs text-gray-500">Loading preview...</p>
                        </div>
                      </div>
                    )}
                    
                    <iframe
                      src={surveyUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      title="Survey Embed Preview"
                      style={{ 
                        border: 'none',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        console.error('Iframe loading error:', e);
                        setIframeError(true);
                      }}
                      onLoad={() => {
                        console.log('Iframe loaded successfully');
                        setIframeLoaded(true);
                        setIframeError(false);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <span>Actual size: {embedWidth} × {embedHeight}</span>
                    <span>•</span>
                    <span>Preview scaled to fit modal</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm mb-2">Embed Preview</p>
              <p className="text-xs text-gray-400 mb-4">
                Configured size: {embedWidth} × {embedHeight}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Show Embed Preview
                </button>
                <button
                  onClick={() => window.open(surveyUrl, '_blank')}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Open Full Survey
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Globe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800 mb-1">Embed Tips:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Use 100% width for responsive design that adapts to containers</li>
              <li>• Standard height (600px) works well for most surveys</li>
              <li>• Test on different devices and screen sizes</li>
              <li>• The fallback link ensures accessibility for all users</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Settings className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Implementation Guide:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Responsive:</strong> Use 100% width for fluid layouts</p>
              <p><strong>Fixed:</strong> Use pixel values (800px) for specific sizes</p>
              <p><strong>Mobile-First:</strong> Start with smaller dimensions and scale up</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmbedTab;
