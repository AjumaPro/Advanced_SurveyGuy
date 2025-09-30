/**
 * SDK Download Modal Component
 * Allows users to download SDKs for different programming languages
 */

import React, { useState } from 'react';
import {
  Download,
  Code,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Globe,
  Terminal,
  Server,
  Database,
  Zap
} from 'lucide-react';
import sdkService from '../services/sdkService';
import toast from 'react-hot-toast';

const SDKDownloadModal = ({ onClose, apiKey }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'Browser and Node.js compatible',
      icon: <Code className="w-5 h-5" />,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'python',
      name: 'Python',
      description: 'For Python applications',
      icon: <Terminal className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'php',
      name: 'PHP',
      description: 'For PHP applications',
      icon: <Server className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'node',
      name: 'Node.js',
      description: 'Server-side JavaScript',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'curl',
      name: 'cURL Examples',
      description: 'Command-line examples',
      icon: <Terminal className="w-5 h-5" />,
      color: 'bg-gray-100 text-gray-800'
    }
  ];

  const handleDownload = async () => {
    if (!apiKey) {
      toast.error('Please generate an API key first');
      return;
    }

    setDownloading(true);
    try {
      const result = await sdkService.downloadSDK(selectedLanguage, apiKey);
      
      if (result.success) {
        setDownloadComplete(true);
        toast.success(`SDK downloaded successfully: ${result.filename}`);
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to download SDK');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download SDK');
    } finally {
      setDownloading(false);
    }
  };

  const selectedLang = languages.find(lang => lang.id === selectedLanguage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Download className="w-6 h-6 text-blue-500" />
                Download SDK
              </h2>
              <p className="text-gray-600 mt-1">Choose your programming language and download the SDK</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {downloadComplete ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Complete!</h3>
              <p className="text-gray-600 mb-4">
                Your {selectedLang.name} SDK has been downloaded successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-green-800 mb-2">What's included:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Complete SDK with all API methods</li>
                  <li>• Example code and usage documentation</li>
                  <li>• README with setup instructions</li>
                  <li>• Dependency files (package.json, requirements.txt, etc.)</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* API Key Warning */}
              {!apiKey && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">API Key Required</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    You need to generate an API key first before downloading the SDK. 
                    The SDK will be pre-configured with your API key.
                  </p>
                </div>
              )}

              {/* Language Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Programming Language</h3>
                <div className="grid grid-cols-1 gap-3">
                  {languages.map((language) => (
                    <button
                      key={language.id}
                      onClick={() => setSelectedLanguage(language.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        selectedLanguage === language.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${language.color}`}>
                          {language.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{language.name}</h4>
                          <p className="text-sm text-gray-600">{language.description}</p>
                        </div>
                        {selectedLanguage === language.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SDK Preview */}
              {selectedLang && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">SDK Preview</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <pre>
                      <code>
{selectedLanguage === 'javascript' && `// Initialize SDK
const sdk = new SurveyGuySDK('${apiKey || 'your-api-key'}');

// Get surveys
const surveys = await sdk.getSurveys();

// Create survey
const survey = await sdk.createSurvey({
  title: 'My Survey',
  description: 'Survey description'
});`}

{selectedLanguage === 'python' && `from surveyguy import SurveyGuySDK

# Initialize SDK
sdk = SurveyGuySDK('${apiKey || 'your-api-key'}')

# Get surveys
surveys = sdk.get_surveys()

# Create survey
survey = sdk.create_survey({
    'title': 'My Survey',
    'description': 'Survey description'
})`}

{selectedLanguage === 'php' && `use SurveyGuy\\SurveyGuySDK;

// Initialize SDK
$sdk = new SurveyGuySDK('${apiKey || 'your-api-key'}');

// Get surveys
$surveys = $sdk->getSurveys();

// Create survey
$survey = $sdk->createSurvey([
    'title' => 'My Survey',
    'description' => 'Survey description'
]);`}

{selectedLanguage === 'node' && `const SurveyGuySDK = require('./index.js');

// Initialize SDK
const sdk = new SurveyGuySDK('${apiKey || 'your-api-key'}');

// Get surveys
const surveys = await sdk.getSurveys();

// Create survey
const survey = await sdk.createSurvey({
  title: 'My Survey',
  description: 'Survey description'
});`}

{selectedLanguage === 'curl' && `# Get surveys
curl -H "X-API-Key: ${apiKey || 'your-api-key'}" \\
     "https://api.surveyguy.com/v1/surveys"

# Create survey
curl -X POST \\
     -H "X-API-Key: ${apiKey || 'your-api-key'}" \\
     -H "Content-Type: application/json" \\
     -d '{"title": "My Survey"}' \\
     "https://api.surveyguy.com/v1/surveys"`}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* What's Included */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Code className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">Complete SDK</h4>
                      <p className="text-sm text-gray-600">All API methods and functionality</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">Documentation</h4>
                      <p className="text-sm text-gray-600">README and usage examples</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">Examples</h4>
                      <p className="text-sm text-gray-600">Working code samples</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">Dependencies</h4>
                      <p className="text-sm text-gray-600">Package files included</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!downloadComplete && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {apiKey ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    API key configured
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    API key required
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!apiKey || downloading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download {selectedLang?.name} SDK
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SDKDownloadModal;
