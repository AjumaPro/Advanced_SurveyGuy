import React from 'react';
import {
  Zap,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Code,
  Webhook,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  Shield,
  Key,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Play,
  Pause,
  Activity,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

const IntegrationHub = ({ userPlan = 'free' }) => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [integrations, setIntegrations] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Available integrations based on plan
  const availableIntegrations = {
    free: [
      {
        id: 'zapier',
        name: 'Zapier',
        description: 'Connect with 5000+ apps',
        icon: <Zap className="w-6 h-6" />,
        color: 'bg-orange-100 text-orange-600',
        category: 'automation',
        status: 'available',
        setupRequired: true
      },
      {
        id: 'google_sheets',
        name: 'Google Sheets',
        description: 'Export responses to spreadsheets',
        icon: <Database className="w-6 h-6" />,
        color: 'bg-green-100 text-green-600',
        category: 'data',
        status: 'available',
        setupRequired: true
      },
      {
        id: 'email',
        name: 'Email Notifications',
        description: 'Send email alerts for new responses',
        icon: <Mail className="w-6 h-6" />,
        color: 'bg-blue-100 text-blue-600',
        category: 'notifications',
        status: 'available',
        setupRequired: false
      }
    ],
    pro: [
      {
        id: 'slack',
        name: 'Slack',
        description: 'Get notifications in Slack channels',
        icon: <MessageSquare className="w-6 h-6" />,
        color: 'bg-purple-100 text-purple-600',
        category: 'communication',
        status: 'available',
        setupRequired: true
      },
      {
        id: 'microsoft_teams',
        name: 'Microsoft Teams',
        description: 'Integrate with Teams workspace',
        icon: <Users className="w-6 h-6" />,
        color: 'bg-indigo-100 text-indigo-600',
        category: 'communication',
        status: 'available',
        setupRequired: true
      },
      {
        id: 'google_workspace',
        name: 'Google Workspace',
        description: 'Connect with Google Drive, Calendar',
        icon: <Calendar className="w-6 h-6" />,
        color: 'bg-red-100 text-red-600',
        category: 'productivity',
        status: 'available',
        setupRequired: true
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Sync with CRM data',
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'bg-blue-100 text-blue-600',
        category: 'crm',
        status: 'available',
        setupRequired: true
      }
    ],
    enterprise: [
      {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Advanced CRM integration',
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'bg-orange-100 text-orange-600',
        category: 'crm',
        status: 'available',
        setupRequired: true
      },
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Email marketing automation',
        icon: <Mail className="w-6 h-6" />,
        color: 'bg-yellow-100 text-yellow-600',
        category: 'marketing',
        status: 'available',
        setupRequired: true
      },
      {
        id: 'webhook',
        name: 'Custom Webhooks',
        description: 'Send data to any endpoint',
        icon: <Webhook className="w-6 h-6" />,
        color: 'bg-gray-100 text-gray-600',
        category: 'custom',
        status: 'available',
        setupRequired: true
      }
    ]
  };

  const tabs = [
    { id: 'integrations', name: 'Integrations', icon: <Zap className="w-4 h-4" /> },
    { id: 'webhooks', name: 'Webhooks', icon: <Webhook className="w-4 h-4" /> },
    { id: 'api', name: 'API Keys', icon: <Key className="w-4 h-4" /> },
    { id: 'logs', name: 'Activity Logs', icon: <Activity className="w-4 h-4" /> }
  ];

  const categories = [
    { id: 'all', name: 'All', count: 0 },
    { id: 'automation', name: 'Automation', count: 0 },
    { id: 'data', name: 'Data Export', count: 0 },
    { id: 'communication', name: 'Communication', count: 0 },
    { id: 'crm', name: 'CRM', count: 0 },
    { id: 'marketing', name: 'Marketing', count: 0 },
    { id: 'notifications', name: 'Notifications', count: 0 },
    { id: 'custom', name: 'Custom', count: 0 }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get integrations based on user plan
  const getUserIntegrations = () => {
    const allIntegrations = [
      ...availableIntegrations.free,
      ...(userPlan === 'pro' || userPlan === 'enterprise' ? availableIntegrations.pro : []),
      ...(userPlan === 'enterprise' ? availableIntegrations.enterprise : [])
    ];
    return allIntegrations;
  };

  const connectIntegration = async (integrationId) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newIntegration = {
        id: integrationId,
        name: getUserIntegrations().find(i => i.id === integrationId)?.name,
        status: 'connected',
        connectedAt: new Date().toISOString(),
        lastSync: new Date().toISOString()
      };
      
      setIntegrations(prev => [...prev, newIntegration]);
    } catch (error) {
      console.error('Error connecting integration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectIntegration = (integrationId) => {
    setIntegrations(prev => prev.filter(i => i.id !== integrationId));
  };

  const createWebhook = () => {
    const newWebhook = {
      id: Date.now(),
      name: 'New Webhook',
      url: '',
      events: ['response.created', 'response.updated'],
      status: 'inactive',
      createdAt: new Date().toISOString(),
      lastTriggered: null
    };
    setWebhooks(prev => [...prev, newWebhook]);
  };

  const createApiKey = () => {
    const newApiKey = {
      id: Date.now(),
      name: 'New API Key',
      key: generateApiKey(),
      permissions: ['read', 'write'],
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: null
    };
    setApiKeys(prev => [...prev, newApiKey]);
  };

  const generateApiKey = () => {
    return 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const filteredIntegrations = getUserIntegrations().filter(integration => {
    if (selectedCategory === 'all') return true;
    return integration.category === selectedCategory;
  });

  const getIntegrationStatus = (integrationId) => {
    const connected = integrations.find(i => i.id === integrationId);
    return connected ? 'connected' : 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'available': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'available': return <Plus className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'inactive': return <Pause className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="integration-hub bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Integration Hub</h2>
              <p className="text-sm text-slate-600">
                Connect SurveyGuy with your favorite tools and services
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {userPlan.toUpperCase()} Plan
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map(integration => {
                const status = getIntegrationStatus(integration.id);
                const isConnected = status === 'connected';
                
                return (
                  <div
                    key={integration.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg ${integration.color}`}>
                        {integration.icon}
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        <span className="capitalize">{status}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {integration.name}
                    </h3>
                    
                    <p className="text-sm text-slate-600 mb-4">
                      {integration.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {isConnected ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => disconnectIntegration(integration.id)}
                            className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Disconnect
                          </button>
                          <button className="p-1 text-slate-400 hover:text-slate-600">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => connectIntegration(integration.id)}
                          disabled={isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          <span>Connect</span>
                        </button>
                      )}
                      
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Plan Upgrade Prompt */}
            {userPlan === 'free' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900">Unlock More Integrations</h4>
                    <p className="text-blue-800 mt-1">
                      Upgrade to Pro or Enterprise to access advanced integrations like Slack, 
                      Microsoft Teams, Salesforce, and custom webhooks.
                    </p>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Webhooks</h3>
              <button
                onClick={createWebhook}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Webhook</span>
              </button>
            </div>

            {webhooks.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <Webhook className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 mb-2">No Webhooks</h4>
                <p className="text-slate-600 mb-4">
                  Create webhooks to receive real-time notifications when events occur
                </p>
                <button
                  onClick={createWebhook}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Webhook</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map(webhook => (
                  <div key={webhook.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Webhook className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{webhook.name}</h4>
                          <p className="text-sm text-slate-600">{webhook.url || 'No URL set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          webhook.status === 'active' 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-gray-600 bg-gray-100'
                        }`}>
                          {webhook.status}
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">API Keys</h3>
              <button
                onClick={createApiKey}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create API Key</span>
              </button>
            </div>

            {apiKeys.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 mb-2">No API Keys</h4>
                <p className="text-slate-600 mb-4">
                  Create API keys to access SurveyGuy programmatically
                </p>
                <button
                  onClick={createApiKey}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First API Key</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map(apiKey => (
                  <div key={apiKey.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Key className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{apiKey.name}</h4>
                          <p className="text-sm text-slate-600 font-mono">
                            {apiKey.key.substring(0, 20)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          apiKey.status === 'active' 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-gray-600 bg-gray-100'
                        }`}>
                          {apiKey.status}
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* API Documentation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Code className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-900">API Documentation</h4>
                  <p className="text-blue-800 mt-1">
                    Learn how to integrate with SurveyGuy's REST API. Access comprehensive 
                    documentation, code examples, and SDKs.
                  </p>
                  <button className="mt-3 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Documentation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Activity Logs</h3>
            
            <div className="space-y-4">
              {[
                { id: 1, action: 'Webhook triggered', target: 'response.created', time: '2 minutes ago', status: 'success' },
                { id: 2, action: 'API request', target: 'GET /surveys', time: '5 minutes ago', status: 'success' },
                { id: 3, action: 'Integration sync', target: 'Google Sheets', time: '1 hour ago', status: 'success' },
                { id: 4, action: 'Webhook failed', target: 'response.updated', time: '2 hours ago', status: 'error' }
              ].map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      log.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Activity className={`w-4 h-4 ${
                        log.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{log.action}</h4>
                      <p className="text-sm text-slate-600">{log.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      log.status === 'success' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-red-600 bg-red-100'
                    }`}>
                      {log.status}
                    </span>
                    <p className="text-sm text-slate-500 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationHub;
