import React, { useState } from 'react';
import {
  Save,
  Eye,
  Play,
  Share2,
  Settings,
  Wand2,
  Loader2,
  CheckCircle,
  Clock
} from 'lucide-react';

const SurveyBuilderToolbar = ({ 
  survey, 
  onSave, 
  onPreview, 
  onQuickPreview, 
  onShowAI,
  onShowSettings,
  saving = false,
  lastSaved = null 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const saved = new Date(timestamp);
    const diffMs = now - saved;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return saved.toLocaleDateString();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-auto'
      }`}>
        {isExpanded ? (
          // Expanded Toolbar
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Survey Tools</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Save Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <span className="text-sm text-gray-700">
                    {saving ? 'Saving...' : 'Saved'}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatLastSaved(lastSaved)}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onQuickPreview}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Test</span>
                </button>
                
                <button
                  onClick={onPreview}
                  className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Preview</span>
                </button>
                
                <button
                  onClick={onShowAI}
                  className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  <span className="text-sm">AI Help</span>
                </button>
                
                <button
                  onClick={() => alert('Share feature coming soon!')}
                  className="flex items-center justify-center space-x-2 p-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Survey Stats */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">Survey Stats</div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{survey.questions.length}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {Math.ceil(survey.questions.length * 0.5)}
                    </div>
                    <div className="text-xs text-gray-500">Est. Minutes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {survey.questions.filter(q => q.required).length}
                    </div>
                    <div className="text-xs text-gray-500">Required</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Collapsed Toolbar
          <div className="flex items-center space-x-2 p-3">
            <button
              onClick={onSave}
              disabled={saving}
              className={`p-3 rounded-full transition-colors ${
                saving 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title="Save survey"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onQuickPreview}
              className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              title="Quick preview"
            >
              <Play className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsExpanded(true)}
              className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              title="More tools"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyBuilderToolbar;
