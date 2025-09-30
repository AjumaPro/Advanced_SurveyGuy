import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FeatureGate, trackFeatureUsage } from '../utils/planFeatures';
import toast from 'react-hot-toast';
import {
  Code,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Activity,
  BarChart3,
  FileText,
  Shield,
  ExternalLink,
  Zap,
  Key
} from 'lucide-react';

const APIAccess = () => {
  const { user, userProfile } = useAuth();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState(['read']);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [apiUsage, setApiUsage] = useState({
    totalRequests: 0,
    thisMonth: 0,
    rateLimit: 1000,
    remaining: 1000
  });

  const userPlan = userProfile?.plan || 'free';

  const permissions = [
    { id: 'read', name: 'Read', description: 'View surveys and responses' },
    { id: 'write', name: 'Write', description: 'Create and update surveys' },
    { id: 'delete', name: 'Delete', description: 'Delete surveys and responses' },
    { id: 'analytics', name: 'Analytics', description: 'Access analytics data' }
  ];

  const getRateLimit = React.useCallback(() => {
    switch (userPlan) {
      case 'pro': return 1000; // requests per hour
      case 'enterprise': return 10000; // requests per hour
      default: return 0;
    }
  }, [userPlan]);

  const loadApiKeys = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setApiKeys(data || []);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  }, [user.id]);

  const loadApiUsage = React.useCallback(async () => {
    try {
      const rateLimit = getRateLimit();
      // Mock API usage data - in a real app, this would come from API analytics
      setApiUsage({
        totalRequests: Math.floor(Math.random() * 5000),
        thisMonth: Math.floor(Math.random() * 500),
        rateLimit: rateLimit,
        remaining: Math.floor(Math.random() * rateLimit)
      });
    } catch (error) {
      console.error('Error loading API usage:', error);
    }
  }, [getRateLimit]);

  useEffect(() => {
    loadApiKeys();
    loadApiUsage();
  }, [loadApiKeys, loadApiUsage]);

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sg_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setLoading(true);
    try {
      const apiKey = generateApiKey();
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: newKeyName,
          key: apiKey,
          permissions: newKeyPermissions,
          rate_limit: getRateLimit(),
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Track usage
      await trackFeatureUsage(user.id, 'api_access', {
        action: 'key_created',
        keyName: newKeyName,
        permissions: newKeyPermissions
      });

      setApiKeys(prev => [data, ...prev]);
      setNewKeyName('');
      setNewKeyPermissions(['read']);
      setShowCreateModal(false);
      
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast.success('API key deleted');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const maskApiKey = (key) => {
    return key.substring(0, 6) + '•'.repeat(20) + key.substring(key.length - 4);
  };

  return (
    <FeatureGate
      userPlan={userPlan}
      feature="integrations.api"
      fallback={
        <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg text-center">
          <Code className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">API Access</h3>
          <p className="text-gray-600 mb-4">
            Integrate SurveyGuy with your applications using our REST API
          </p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">API Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Create and manage surveys programmatically</li>
              <li>• Retrieve survey responses in real-time</li>
              <li>• Access analytics and reporting data</li>
              <li>• Webhook notifications for new responses</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.href = '/app/subscriptions'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upgrade to Pro
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Code className="w-6 h-6 mr-3 text-blue-600" />
              API Access
            </h2>
            <p className="text-gray-600">Manage your API keys and integration settings</p>
          </div>
          
          <div className="flex space-x-3">
            <a
              href="/docs/api"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              API Docs
            </a>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </button>
          </div>
        </div>

        {/* API Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{apiUsage.totalRequests.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{apiUsage.thisMonth.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rate Limit</p>
                <p className="text-2xl font-bold text-gray-900">{apiUsage.rateLimit.toLocaleString()}/hr</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{apiUsage.remaining.toLocaleString()}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">API Keys ({apiKeys.length})</h3>
          </div>
          
          {apiKeys.length === 0 ? (
            <div className="p-8 text-center">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No API keys created yet</p>
              <p className="text-sm text-gray-500">Create your first API key to start integrating</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                      <p className="text-sm text-gray-600">
                        Created {new Date(apiKey.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apiKey.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apiKey.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm font-mono">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Permissions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-gray-600">
                        Rate limit: {apiKey.rate_limit || getRateLimit()}/hour
                      </div>
                      <button
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Quick Start
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Base URL</h4>
              <code className="text-sm text-gray-800">https://api.surveyguy.com/v1</code>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
              <code className="text-sm text-gray-800">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Example Request</h4>
              <pre className="text-sm text-gray-800 overflow-x-auto">
{`curl -X GET "https://api.surveyguy.com/v1/surveys" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <a
              href="/docs/api"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Full Documentation
            </a>
            <a
              href="/docs/api/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Code className="w-4 h-4 mr-2" />
              Code Examples
            </a>
          </div>
        </div>

        {/* Create API Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create API Key</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production App, Development, Mobile App"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={newKeyPermissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewKeyPermissions(prev => [...prev, permission.id]);
                            } else {
                              setNewKeyPermissions(prev => prev.filter(p => p !== permission.id));
                            }
                          }}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                          <p className="text-xs text-gray-600">{permission.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createApiKey}
                  disabled={loading || !newKeyName.trim() || newKeyPermissions.length === 0}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FeatureGate>
  );
};

export default APIAccess;
