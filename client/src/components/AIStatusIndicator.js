/**
 * AI Status Indicator Component
 * Shows the current status of AI features and services
 */

import React, { useState, useEffect } from 'react';
import {
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Sparkles,
  Cloud,
  Key
} from 'lucide-react';
import { getAIStatus, logAIConfig } from '../utils/aiConfig';

const AIStatusIndicator = ({ className = '' }) => {
  const [status, setStatus] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const aiStatus = getAIStatus();
    setStatus(aiStatus);
    logAIConfig();
  }, []);

  if (!status) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse w-4 h-4 bg-gray-300 rounded-full"></div>
        <span className="text-sm text-gray-500">Loading AI status...</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (!status.enabled) {
      return <XCircle className="w-4 h-4 text-gray-400" />;
    }
    
    if (status.available) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (status.fallback) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (!status.enabled) {
      return 'AI Disabled';
    }
    
    if (status.available) {
      return 'AI Active';
    }
    
    if (status.fallback) {
      return 'AI Fallback';
    }
    
    return 'AI Error';
  };

  const getStatusColor = () => {
    if (!status.enabled) {
      return 'text-gray-500';
    }
    
    if (status.available) {
      return 'text-green-600';
    }
    
    if (status.fallback) {
      return 'text-yellow-600';
    }
    
    return 'text-red-600';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        title="Click to view AI configuration details"
      >
        <Brain className="w-4 h-4 text-gray-600" />
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </button>

      {/* Detailed Status Modal */}
      {showDetails && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Overall Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Overall Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>

              {/* Service Status */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900">Services</h4>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">OpenAI GPT</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {status.openai ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {status.openai ? 'Connected' : 'Missing API Key'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Sentiment Analysis</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {status.sentiment ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {status.sentiment ? 'Browser-based' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {status.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600">Issues</h4>
                  {status.errors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback Mode */}
              {status.fallback && (
                <div className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-yellow-800">Fallback Mode Active</span>
                    <p className="text-xs text-yellow-700 mt-1">
                      AI features will use template-based fallbacks when services are unavailable.
                    </p>
                  </div>
                </div>
              )}

              {/* Setup Instructions */}
              {!status.available && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Setup Instructions</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>1. Add OpenAI API key to environment variables</p>
                    <p>2. Set REACT_APP_ENABLE_AI_FEATURES=true</p>
                    <p>3. Restart the application</p>
                    <p>4. Sentiment analysis works without API keys</p>
                  </div>
                  <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800">
                    <Settings className="w-3 h-3" />
                    <span>View Setup Guide</span>
                  </button>
                </div>
              )}

              {/* Features Available */}
              {status.available && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-green-600">AI Features Available</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Question Generation</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Sentiment Analysis</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Survey Optimization</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>AI Insights</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStatusIndicator;
