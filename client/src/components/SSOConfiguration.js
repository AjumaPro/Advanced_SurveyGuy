import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FeatureGate, trackFeatureUsage } from '../utils/planFeatures';
import toast from 'react-hot-toast';
import {
  Shield,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Save,
  TestTube,
  ExternalLink,
  Users,
  Zap,
  Crown,
  FileText,
  Download
} from 'lucide-react';

const SSOConfiguration = () => {
  const { user, userProfile } = useAuth();
  const [ssoConfig, setSsoConfig] = useState({
    enabled: false,
    provider: 'saml',
    entityId: '',
    ssoUrl: '',
    x509Certificate: '',
    attributeMapping: {
      email: 'email',
      firstName: 'first_name',
      lastName: 'last_name',
      groups: 'groups'
    },
    autoProvisioning: true,
    defaultRole: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState('configuration');

  const userPlan = userProfile?.plan || 'free';

  const ssoProviders = [
    { id: 'saml', name: 'SAML 2.0', description: 'Industry standard for enterprise SSO' },
    { id: 'oidc', name: 'OpenID Connect', description: 'Modern OAuth 2.0 based authentication' },
    { id: 'azure', name: 'Azure AD', description: 'Microsoft Azure Active Directory' },
    { id: 'google', name: 'Google Workspace', description: 'Google Workspace SSO' },
    { id: 'okta', name: 'Okta', description: 'Okta identity provider' }
  ];

  const loadSSOConfiguration = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sso_configurations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setSsoConfig(data.configuration);
      }
    } catch (error) {
      console.error('Error loading SSO configuration:', error);
    }
  }, [user.id]);

  useEffect(() => {
    loadSSOConfiguration();
  }, [loadSSOConfiguration]);

  const saveSSOConfiguration = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('sso_configurations')
        .upsert({
          user_id: user.id,
          configuration: ssoConfig,
          is_active: ssoConfig.enabled
        });

      if (error) throw error;

      // Track usage
      await trackFeatureUsage(user.id, 'sso_configuration', {
        provider: ssoConfig.provider,
        enabled: ssoConfig.enabled
      });

      toast.success('SSO configuration saved successfully');
    } catch (error) {
      console.error('Error saving SSO configuration:', error);
      toast.error('Failed to save SSO configuration');
    } finally {
      setLoading(false);
    }
  };

  const testSSOConnection = async () => {
    setLoading(true);
    try {
      // Mock SSO test - in a real app, this would test the actual SSO connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTestResults({
        success,
        message: success 
          ? 'SSO connection test successful'
          : 'SSO connection test failed - please check your configuration',
        details: success 
          ? 'Authentication flow completed successfully'
          : 'Unable to validate SAML response from identity provider'
      });

      if (success) {
        toast.success('SSO test successful');
      } else {
        toast.error('SSO test failed');
      }
    } catch (error) {
      console.error('SSO test error:', error);
      toast.error('SSO test failed');
    } finally {
      setLoading(false);
    }
  };

  const generateMetadata = () => {
    const metadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" 
                     entityID="https://surveyguy.com/saml/metadata">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                Location="https://surveyguy.com/saml/acs"
                                index="0" isDefault="true"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
    
    navigator.clipboard.writeText(metadata);
    toast.success('Metadata copied to clipboard');
  };

  const tabs = [
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'users', label: 'SSO Users', icon: Users },
    { id: 'logs', label: 'Audit Logs', icon: FileText }
  ];

  return (
    <FeatureGate
      userPlan={userPlan}
      feature="security.sso"
      fallback={
        <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg text-center">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Single Sign-On (SSO)</h3>
          <p className="text-gray-600 mb-4">
            Enable enterprise-grade authentication with SAML, OIDC, and popular identity providers
          </p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">SSO Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• SAML 2.0 and OpenID Connect support</li>
              <li>• Azure AD, Google Workspace, Okta integration</li>
              <li>• Automatic user provisioning</li>
              <li>• Role-based access control</li>
              <li>• Audit logging and compliance</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.href = '/app/subscriptions'}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
          >
            Upgrade to Enterprise
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-yellow-600" />
              Single Sign-On (SSO)
            </h2>
            <p className="text-gray-600">Configure enterprise authentication for your organization</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={testSSOConnection}
              disabled={loading || !ssoConfig.enabled}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test Connection
            </button>
            <button
              onClick={saveSSOConfiguration}
              disabled={loading}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-lg border ${
          ssoConfig.enabled 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-3">
            {ssoConfig.enabled ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
            <div>
              <p className={`font-medium ${
                ssoConfig.enabled ? 'text-green-900' : 'text-yellow-900'
              }`}>
                SSO is {ssoConfig.enabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className={`text-sm ${
                ssoConfig.enabled ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {ssoConfig.enabled 
                  ? 'Users can authenticate using your identity provider'
                  : 'Configure and enable SSO to allow enterprise authentication'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'configuration' && (
          <div className="space-y-6">
            {/* Basic Settings */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable SSO</p>
                    <p className="text-sm text-gray-600">Allow users to authenticate via SSO</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ssoConfig.enabled}
                      onChange={(e) => setSsoConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identity Provider
                  </label>
                  <select
                    value={ssoConfig.provider}
                    onChange={(e) => setSsoConfig(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {ssoProviders.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name} - {provider.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SAML Configuration */}
            {ssoConfig.provider === 'saml' && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SAML Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entity ID
                    </label>
                    <input
                      type="text"
                      value={ssoConfig.entityId}
                      onChange={(e) => setSsoConfig(prev => ({ ...prev, entityId: e.target.value }))}
                      placeholder="https://your-idp.com/saml/metadata"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SSO URL
                    </label>
                    <input
                      type="url"
                      value={ssoConfig.ssoUrl}
                      onChange={(e) => setSsoConfig(prev => ({ ...prev, ssoUrl: e.target.value }))}
                      placeholder="https://your-idp.com/saml/sso"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      X.509 Certificate
                    </label>
                    <div className="space-y-2">
                      <textarea
                        value={ssoConfig.x509Certificate}
                        onChange={(e) => setSsoConfig(prev => ({ ...prev, x509Certificate: e.target.value }))}
                        placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                        rows={showCertificate ? 8 : 3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                      />
                      <button
                        onClick={() => setShowCertificate(!showCertificate)}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                      >
                        {showCertificate ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                        {showCertificate ? 'Hide' : 'Show'} full certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Provider Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Provider Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                Provide these details to your identity provider administrator
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Entity ID</label>
                    <button
                      onClick={() => copyToClipboard('https://surveyguy.com/saml/metadata')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="text-sm text-gray-800">https://surveyguy.com/saml/metadata</code>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">ACS URL</label>
                    <button
                      onClick={() => copyToClipboard('https://surveyguy.com/saml/acs')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="text-sm text-gray-800">https://surveyguy.com/saml/acs</code>
                </div>
                
                <button
                  onClick={generateMetadata}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download SP Metadata
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Testing</h3>
              
              {testResults && (
                <div className={`p-4 rounded-lg border mb-4 ${
                  testResults.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    {testResults.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        testResults.success ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {testResults.message}
                      </p>
                      <p className={`text-sm ${
                        testResults.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {testResults.details}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <button
                  onClick={testSSOConnection}
                  disabled={loading || !ssoConfig.enabled}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Test SSO Connection
                    </>
                  )}
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Pre-flight Checks</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        {ssoConfig.entityId ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Entity ID configured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {ssoConfig.ssoUrl ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>SSO URL configured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {ssoConfig.x509Certificate ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Certificate uploaded</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Quick Test</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Test your SSO configuration with a simulated login flow
                    </p>
                    <a
                      href="/sso/test"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open Test Page
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FeatureGate>
  );
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export default SSOConfiguration;
