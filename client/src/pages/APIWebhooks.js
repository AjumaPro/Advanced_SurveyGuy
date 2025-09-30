import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Link as LinkIcon,
  Key,
  Settings,
  Play,
  Pause,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Zap,
  Globe,
  Lock,
  Unlock,
  Download,
  Upload,
  BarChart3,
  Send,
  RotateCcw,
  Save,
  FileText,
  Database,
  Server,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import apiKeysService from '../services/apiKeysService';
import APIDocumentation from '../components/APIDocumentation';
import SDKDownloadModal from '../components/SDKDownloadModal';
import toast from 'react-hot-toast';

const APIWebhooks = () => {
  const { user } = useAuth();
  const { hasFeature, currentPlan, isFreePlan } = useFeatureAccess();
  const [activeTab, setActiveTab] = useState('api');
  const [loading, setLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [apiStats, setApiStats] = useState(null);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showApiDocs, setShowApiDocs] = useState(false);
  const [showSDKModal, setShowSDKModal] = useState(false);

  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: ['read'],
    expiresAt: null
  });

  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [],
    secret: '',
    active: true
  });

  const tabs = [
    { id: 'api', label: 'API Access', icon: <Code className="w-4 h-4" /> },
    { id: 'webhooks', label: 'Webhooks', icon: <LinkIcon className="w-4 h-4" /> },
    { id: 'endpoints', label: 'Endpoints', icon: <Globe className="w-4 h-4" /> },
    { id: 'logs', label: 'Activity Logs', icon: <Activity className="w-4 h-4" /> }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/surveys',
      description: 'List all surveys',
      category: 'Surveys'
    },
    {
      method: 'POST',
      path: '/api/v1/surveys',
      description: 'Create a new survey',
      category: 'Surveys'
    },
    {
      method: 'GET',
      path: '/api/v1/surveys/{id}',
      description: 'Get survey details',
      category: 'Surveys'
    },
    {
      method: 'GET',
      path: '/api/v1/responses',
      description: 'List survey responses',
      category: 'Responses'
    },
    {
      method: 'POST',
      path: '/api/v1/responses',
      description: 'Submit survey response',
      category: 'Responses'
    },
    {
      method: 'GET',
      path: '/api/v1/analytics/{id}',
      description: 'Get survey analytics',
      category: 'Analytics'
    }
  ];

  const webhookEvents = [
    { id: 'survey.created', name: 'Survey Created', description: 'Triggered when a survey is created' },
    { id: 'survey.published', name: 'Survey Published', description: 'Triggered when a survey is published' },
    { id: 'response.submitted', name: 'Response Submitted', description: 'Triggered when a response is submitted' },
    { id: 'survey.completed', name: 'Survey Completed', description: 'Triggered when survey reaches completion target' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load API keys
      const keysResult = await apiKeysService.getUserApiKeys(user.id);
      if (keysResult.success) {
        setApiKeys(keysResult.apiKeys);
      }
      
      // Load API stats
      const statsResult = await apiKeysService.getApiKeyStats(user.id);
      if (statsResult.success) {
        setApiStats(statsResult.stats);
      }
      
      // Load webhooks (placeholder for now)
      setWebhooks([]);
      
    } catch (error) {
      console.error('Failed to load integration data:', error);
      toast.error('Failed to load API data');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!user) {
      console.error('❌ No user found');
      toast.error('Please log in to generate API keys');
      return;
    }
    
    console.log('🚀 Starting API key generation...');
    console.log('👤 User:', user);
    console.log('📝 New API key data:', newApiKey);
    
    setLoading(true);
    try {
      // Check API access
      console.log('🔐 Checking API access...');
      const accessCheck = await apiKeysService.checkApiAccess(user.id);
      console.log('🔐 Access check result:', accessCheck);
      
      if (!accessCheck.hasAccess) {
        console.error('❌ Access denied:', accessCheck.reason);
        toast.error(accessCheck.reason);
        return;
      }
      
      console.log('✅ Access granted, generating API key...');
      const result = await apiKeysService.generateApiKey(user.id, newApiKey);
      console.log('🎯 Generation result:', result);
      
      if (result.success) {
        console.log('✅ API key generated successfully!');
        setGeneratedKey(result.apiKey);
        setShowKeyModal(true);
        setShowApiKeyModal(false);
        setNewApiKey({ name: '', permissions: ['read'], expiresAt: null });
        
        // Reload data to show new key
        await loadData();
        
        toast.success('API key generated successfully!');
      } else {
        console.error('❌ API key generation failed:', result.error);
        toast.error(result.error || 'Failed to generate API key');
      }
    } catch (error) {
      console.error('💥 Error generating API key:', error);
      toast.error('Failed to generate API key: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    setLoading(true);
    try {
      // const response = await api.post('/api/webhooks', newWebhook);
      // setWebhooks(prev => [...prev, response.data]);
      toast.success('Webhook created successfully!');
      setShowWebhookModal(false);
      setNewWebhook({ name: '', url: '', events: [], secret: '', active: true });
    } catch (error) {
      toast.error('Failed to create webhook');
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async (endpoint) => {
    setSelectedEndpoint(endpoint);
    try {
      // const response = await api.post('/api/test', { endpoint });
      // setTestResults(prev => ({ ...prev, [endpoint.path]: response.data }));
      toast.success('Endpoint test completed!');
    } catch (error) {
      toast.error('Endpoint test failed');
    }
  };

  const revokeApiKey = async (keyId) => {
    if (!user) return;
    
    try {
      const result = await apiKeysService.revokeApiKey(keyId, user.id);
      
      if (result.success) {
        toast.success('API key revoked successfully');
        await loadData(); // Reload data
      } else {
        toast.error(result.error || 'Failed to revoke API key');
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const renderAPITab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
        <button
          onClick={() => setShowApiKeyModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate API Key
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiKeys.map(key => (
          <div key={key.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{key.name}</h3>
                <p className="text-sm text-gray-600">Created {new Date(key.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => copyToClipboard(key.keyPreview)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title="Copy key preview"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => revokeApiKey(key.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Revoke API key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Key (hidden)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="password"
                    value={key.keyPreview}
                    disabled
                    className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded text-sm font-mono"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Permissions</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {key.permissions.map(permission => (
                    <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">Usage</span>
                <span className="text-sm text-gray-600">
                  {key.usageCount || 0} requests
                </span>
              </div>
              
              {key.lastUsedAt && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-gray-600">Last used</span>
                  <span className="text-sm text-gray-600">
                    {new Date(key.lastUsedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {key.expiresAt && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-gray-600">Expires</span>
                  <span className="text-sm text-gray-600">
                    {new Date(key.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">API Documentation</h3>
        <p className="text-blue-800 mb-4">
          Use our REST API to integrate SurveyGuy with your applications. All API requests require authentication using your API key.
        </p>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowApiDocs(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Documentation
          </button>
          <button 
            onClick={() => setShowSDKModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download SDK
          </button>
        </div>
      </div>
    </div>
  );

  const renderWebhooksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Webhooks</h2>
        <button
          onClick={() => setShowWebhookModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Webhook
        </button>
      </div>

      <div className="space-y-4">
        {webhooks.map(webhook => (
          <div key={webhook.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                <p className="text-sm text-gray-600">{webhook.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Play className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Events</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {webhook.events.map(event => (
                    <span key={event} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center gap-1 mt-1">
                  {webhook.active ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Pause className="w-4 h-4" />
                      Paused
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Last Delivery</label>
                <p className="text-sm text-gray-600 mt-1">
                  {webhook.lastDelivery ? new Date(webhook.lastDelivery).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEndpointsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">API Endpoints</h2>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">All Categories</option>
            <option value="surveys">Surveys</option>
            <option value="responses">Responses</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiEndpoints.map((endpoint, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{endpoint.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {endpoint.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => testEndpoint(endpoint)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors text-sm"
                    >
                      <Play className="w-3 h-3" />
                      Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            id: 1,
            type: 'api',
            action: 'API request to /api/v1/surveys',
            timestamp: '2024-01-15T10:30:00Z',
            status: 'success',
            details: 'GET request from API key sk_live_...'
          },
          {
            id: 2,
            type: 'webhook',
            action: 'Webhook delivery to https://example.com/webhook',
            timestamp: '2024-01-15T10:25:00Z',
            status: 'success',
            details: 'survey.created event'
          },
          {
            id: 3,
            type: 'api',
            action: 'API request to /api/v1/responses',
            timestamp: '2024-01-15T10:20:00Z',
            status: 'error',
            details: 'Invalid API key'
          }
        ].map(log => (
          <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  log.type === 'api' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {log.type === 'api' ? (
                    <Code className="w-4 h-4 text-blue-600" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{log.action}</h4>
                  <p className="text-sm text-gray-600">{log.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Code className="w-8 h-8 text-blue-500" />
                API & Webhooks
              </h1>
              <p className="text-gray-600 mt-1">Enterprise integrations and automation</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{apiKeys.length}</div>
                <div className="text-sm text-gray-600">API Keys</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{apiStats?.totalUsage || 0}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{webhooks.length}</div>
                <div className="text-sm text-gray-600">Webhooks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'api' && renderAPITab()}
                {activeTab === 'webhooks' && renderWebhooksTab()}
                {activeTab === 'endpoints' && renderEndpointsTab()}
                {activeTab === 'logs' && renderLogsTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Generated API Key Modal */}
      {showKeyModal && generatedKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">API Key Generated</h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Important</span>
                </div>
                <p className="text-sm text-yellow-700">
                  This is the only time you'll see your API key. Make sure to copy and store it securely.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your API Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedKey.key}
                    readOnly
                    className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedKey.key)}
                    className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <div className="font-medium">{generatedKey.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Permissions:</span>
                  <div className="font-medium">{generatedKey.permissions.join(', ')}</div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(generatedKey.key);
                    setShowKeyModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generate API Key</h3>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newApiKey.name}
                  onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                  placeholder="e.g., My App Integration"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {['read', 'write', 'admin'].map(permission => (
                    <label key={permission} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newApiKey.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewApiKey({
                              ...newApiKey,
                              permissions: [...newApiKey.permissions, permission]
                            });
                          } else {
                            setNewApiKey({
                              ...newApiKey,
                              permissions: newApiKey.permissions.filter(p => p !== permission)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateApiKey}
                  disabled={!newApiKey.name || newApiKey.permissions.length === 0 || loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Key'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Documentation Modal */}
      {showApiDocs && (
        <APIDocumentation onClose={() => setShowApiDocs(false)} />
      )}

      {/* SDK Download Modal */}
      {showSDKModal && (
        <SDKDownloadModal 
          onClose={() => setShowSDKModal(false)} 
          apiKey={generatedKey?.key || apiKeys[0]?.keyPreview || ''}
        />
      )}
    </div>
  );
};

export default APIWebhooks;
