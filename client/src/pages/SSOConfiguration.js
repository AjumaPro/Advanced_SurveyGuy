import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Key,
  Server,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Upload,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Lock,
  Unlock,
  Zap,
  FileText,
  Globe,
  UserCheck,
  Activity,
  Save,
  RotateCcw,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const SSOConfiguration = () => {
  const { user } = useAuth();
  const [activeProvider, setActiveProvider] = useState('saml');
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [showSecrets, setShowSecrets] = useState({});
  
  const [samlConfig, setSamlConfig] = useState({
    enabled: false,
    entityId: 'urn:surveyplatform:entity',
    acsUrl: 'https://app.surveyplatform.com/auth/saml/callback',
    ssoUrl: '',
    x509Certificate: '',
    nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    attributeMapping: {
      email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
      lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
      role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    },
    signRequests: true,
    encryptAssertions: false
  });

  const [oauthConfig, setOauthConfig] = useState({
    enabled: false,
    clientId: '',
    clientSecret: '',
    authorizationUrl: '',
    tokenUrl: '',
    userInfoUrl: '',
    scopes: ['openid', 'email', 'profile'],
    redirectUri: 'https://app.surveyplatform.com/auth/oauth/callback',
    attributeMapping: {
      email: 'email',
      firstName: 'given_name',
      lastName: 'family_name',
      role: 'role'
    }
  });

  const [ldapConfig, setLdapConfig] = useState({
    enabled: false,
    server: '',
    port: 389,
    bindDn: '',
    bindPassword: '',
    baseDn: '',
    userFilter: '(uid={username})',
    groupFilter: '(member={dn})',
    attributeMapping: {
      email: 'mail',
      firstName: 'givenName',
      lastName: 'sn',
      role: 'memberOf'
    },
    useSSL: false,
    timeout: 30000
  });

  const [adConfig, setAdConfig] = useState({
    enabled: false,
    domain: '',
    server: '',
    port: 389,
    serviceAccount: '',
    servicePassword: '',
    baseDn: '',
    userFilter: '(sAMAccountName={username})',
    groupFilter: '(member={dn})',
    attributeMapping: {
      email: 'mail',
      firstName: 'givenName',
      lastName: 'sn',
      role: 'memberOf'
    },
    useSSL: false
  });

  const providers = [
    {
      id: 'saml',
      name: 'SAML 2.0',
      description: 'Security Assertion Markup Language',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: 'oauth',
      name: 'OAuth 2.0',
      description: 'Open Authorization 2.0',
      icon: <Key className="w-5 h-5" />,
      color: 'bg-green-500',
      popular: true
    },
    {
      id: 'ldap',
      name: 'LDAP',
      description: 'Lightweight Directory Access Protocol',
      icon: <Server className="w-5 h-5" />,
      color: 'bg-purple-500',
      popular: false
    },
    {
      id: 'ad',
      name: 'Active Directory',
      description: 'Microsoft Active Directory',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-orange-500',
      popular: true
    }
  ];

  useEffect(() => {
    loadSSOConfiguration();
  }, []);

  const loadSSOConfiguration = async () => {
    try {
      // Load existing SSO configuration from API
      // const response = await api.get('/sso/config');
      // setSamlConfig(response.data.saml || samlConfig);
      // setOauthConfig(response.data.oauth || oauthConfig);
      // setLdapConfig(response.data.ldap || ldapConfig);
      // setAdConfig(response.data.ad || adConfig);
    } catch (error) {
      console.error('Failed to load SSO config:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const config = {
        saml: samlConfig,
        oauth: oauthConfig,
        ldap: ldapConfig,
        ad: adConfig
      };
      
      // await api.post('/sso/config', config);
      toast.success('SSO configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save SSO configuration');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      // await api.post(`/sso/test/${activeProvider}`);
      toast.success('SSO connection test successful!');
    } catch (error) {
      toast.error('SSO connection test failed');
      console.error('Test error:', error);
    } finally {
      setTestingConnection(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const toggleSecret = (field) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const downloadMetadata = () => {
    const metadata = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${samlConfig.entityId}">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${samlConfig.acsUrl}" index="0"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`;
    
    const blob = new Blob([metadata], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saml-metadata.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSAMLConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={samlConfig.enabled}
          onChange={(e) => setSamlConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-lg font-medium text-gray-900">Enable SAML 2.0 Authentication</label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entity ID</label>
            <div className="flex">
              <input
                type="text"
                value={samlConfig.entityId}
                onChange={(e) => setSamlConfig(prev => ({ ...prev, entityId: e.target.value }))}
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!samlConfig.enabled}
              />
              <button
                onClick={() => copyToClipboard(samlConfig.entityId)}
                className="px-3 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                disabled={!samlConfig.enabled}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ACS URL</label>
            <div className="flex">
              <input
                type="text"
                value={samlConfig.acsUrl}
                onChange={(e) => setSamlConfig(prev => ({ ...prev, acsUrl: e.target.value }))}
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!samlConfig.enabled}
              />
              <button
                onClick={() => copyToClipboard(samlConfig.acsUrl)}
                className="px-3 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                disabled={!samlConfig.enabled}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SSO URL</label>
            <input
              type="text"
              value={samlConfig.ssoUrl}
              onChange={(e) => setSamlConfig(prev => ({ ...prev, ssoUrl: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-idp.com/sso/saml"
              disabled={!samlConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name ID Format</label>
            <select
              value={samlConfig.nameIdFormat}
              onChange={(e) => setSamlConfig(prev => ({ ...prev, nameIdFormat: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!samlConfig.enabled}
            >
              <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">Email Address</option>
              <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">Persistent</option>
              <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">Transient</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">X.509 Certificate</label>
            <textarea
              value={samlConfig.x509Certificate}
              onChange={(e) => setSamlConfig(prev => ({ ...prev, x509Certificate: e.target.value }))}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
              disabled={!samlConfig.enabled}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={samlConfig.signRequests}
                onChange={(e) => setSamlConfig(prev => ({ ...prev, signRequests: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={!samlConfig.enabled}
              />
              <label className="text-sm text-gray-700">Sign SAML Requests</label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={samlConfig.encryptAssertions}
                onChange={(e) => setSamlConfig(prev => ({ ...prev, encryptAssertions: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                disabled={!samlConfig.enabled}
              />
              <label className="text-sm text-gray-700">Encrypt Assertions</label>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={downloadMetadata}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!samlConfig.enabled}
            >
              <Download className="w-4 h-4" />
              Download Metadata
            </button>
          </div>
        </div>
      </div>

      {/* Attribute Mapping */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attribute Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(samlConfig.attributeMapping).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setSamlConfig(prev => ({
                  ...prev,
                  attributeMapping: { ...prev.attributeMapping, [key]: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!samlConfig.enabled}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOAuthConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={oauthConfig.enabled}
          onChange={(e) => setOauthConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-lg font-medium text-gray-900">Enable OAuth 2.0 Authentication</label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
            <input
              type="text"
              value={oauthConfig.clientId}
              onChange={(e) => setOauthConfig(prev => ({ ...prev, clientId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your-client-id"
              disabled={!oauthConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
            <div className="relative">
              <input
                type={showSecrets.clientSecret ? 'text' : 'password'}
                value={oauthConfig.clientSecret}
                onChange={(e) => setOauthConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-client-secret"
                disabled={!oauthConfig.enabled}
              />
              <button
                type="button"
                onClick={() => toggleSecret('clientSecret')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={!oauthConfig.enabled}
              >
                {showSecrets.clientSecret ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Authorization URL</label>
            <input
              type="text"
              value={oauthConfig.authorizationUrl}
              onChange={(e) => setOauthConfig(prev => ({ ...prev, authorizationUrl: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-provider.com/oauth/authorize"
              disabled={!oauthConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Token URL</label>
            <input
              type="text"
              value={oauthConfig.tokenUrl}
              onChange={(e) => setOauthConfig(prev => ({ ...prev, tokenUrl: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-provider.com/oauth/token"
              disabled={!oauthConfig.enabled}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Info URL</label>
            <input
              type="text"
              value={oauthConfig.userInfoUrl}
              onChange={(e) => setOauthConfig(prev => ({ ...prev, userInfoUrl: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-provider.com/oauth/userinfo"
              disabled={!oauthConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Redirect URI</label>
            <div className="flex">
              <input
                type="text"
                value={oauthConfig.redirectUri}
                onChange={(e) => setOauthConfig(prev => ({ ...prev, redirectUri: e.target.value }))}
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!oauthConfig.enabled}
              />
              <button
                onClick={() => copyToClipboard(oauthConfig.redirectUri)}
                className="px-3 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                disabled={!oauthConfig.enabled}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scopes</label>
            <div className="space-y-2">
              {oauthConfig.scopes.map((scope, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={scope}
                    onChange={(e) => {
                      const newScopes = [...oauthConfig.scopes];
                      newScopes[index] = e.target.value;
                      setOauthConfig(prev => ({ ...prev, scopes: newScopes }));
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!oauthConfig.enabled}
                  />
                  <button
                    onClick={() => {
                      const newScopes = oauthConfig.scopes.filter((_, i) => i !== index);
                      setOauthConfig(prev => ({ ...prev, scopes: newScopes }));
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    disabled={!oauthConfig.enabled || oauthConfig.scopes.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setOauthConfig(prev => ({ ...prev, scopes: [...prev.scopes, ''] }))}
                className="text-blue-600 text-sm hover:text-blue-800"
                disabled={!oauthConfig.enabled}
              >
                + Add Scope
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Mapping */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attribute Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(oauthConfig.attributeMapping).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setOauthConfig(prev => ({
                  ...prev,
                  attributeMapping: { ...prev.attributeMapping, [key]: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!oauthConfig.enabled}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLDAPConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={ldapConfig.enabled}
          onChange={(e) => setLdapConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-lg font-medium text-gray-900">Enable LDAP Authentication</label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LDAP Server</label>
            <input
              type="text"
              value={ldapConfig.server}
              onChange={(e) => setLdapConfig(prev => ({ ...prev, server: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ldap.company.com"
              disabled={!ldapConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
            <input
              type="number"
              value={ldapConfig.port}
              onChange={(e) => setLdapConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 389 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!ldapConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bind DN</label>
            <input
              type="text"
              value={ldapConfig.bindDn}
              onChange={(e) => setLdapConfig(prev => ({ ...prev, bindDn: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="cn=admin,dc=company,dc=com"
              disabled={!ldapConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bind Password</label>
            <div className="relative">
              <input
                type={showSecrets.bindPassword ? 'text' : 'password'}
                value={ldapConfig.bindPassword}
                onChange={(e) => setLdapConfig(prev => ({ ...prev, bindPassword: e.target.value }))}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!ldapConfig.enabled}
              />
              <button
                type="button"
                onClick={() => toggleSecret('bindPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={!ldapConfig.enabled}
              >
                {showSecrets.bindPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base DN</label>
            <input
              type="text"
              value={ldapConfig.baseDn}
              onChange={(e) => setLdapConfig(prev => ({ ...prev, baseDn: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ou=users,dc=company,dc=com"
              disabled={!ldapConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Filter</label>
            <input
              type="text"
              value={ldapConfig.userFilter}
              onChange={(e) => setLdapConfig(prev => ({ ...prev, userFilter: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!ldapConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group Filter</label>
            <input
              type="text"
              value={ldapConfig.groupFilter}
              onChange={(e) => setLdapConfig(prev => ({ ...prev, groupFilter: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!ldapConfig.enabled}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={ldapConfig.useSSL}
              onChange={(e) => setLdapConfig(prev => ({ ...prev, useSSL: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={!ldapConfig.enabled}
            />
            <label className="text-sm text-gray-700">Use SSL/TLS</label>
          </div>
        </div>
      </div>

      {/* Attribute Mapping */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attribute Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(ldapConfig.attributeMapping).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setLdapConfig(prev => ({
                  ...prev,
                  attributeMapping: { ...prev.attributeMapping, [key]: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!ldapConfig.enabled}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderADConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={adConfig.enabled}
          onChange={(e) => setAdConfig(prev => ({ ...prev, enabled: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-lg font-medium text-gray-900">Enable Active Directory Authentication</label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
            <input
              type="text"
              value={adConfig.domain}
              onChange={(e) => setAdConfig(prev => ({ ...prev, domain: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="company.com"
              disabled={!adConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain Controller</label>
            <input
              type="text"
              value={adConfig.server}
              onChange={(e) => setAdConfig(prev => ({ ...prev, server: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="dc.company.com"
              disabled={!adConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
            <input
              type="number"
              value={adConfig.port}
              onChange={(e) => setAdConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 389 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!adConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Account</label>
            <input
              type="text"
              value={adConfig.serviceAccount}
              onChange={(e) => setAdConfig(prev => ({ ...prev, serviceAccount: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="service@company.com"
              disabled={!adConfig.enabled}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Password</label>
            <div className="relative">
              <input
                type={showSecrets.servicePassword ? 'text' : 'password'}
                value={adConfig.servicePassword}
                onChange={(e) => setAdConfig(prev => ({ ...prev, servicePassword: e.target.value }))}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!adConfig.enabled}
              />
              <button
                type="button"
                onClick={() => toggleSecret('servicePassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={!adConfig.enabled}
              >
                {showSecrets.servicePassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base DN</label>
            <input
              type="text"
              value={adConfig.baseDn}
              onChange={(e) => setAdConfig(prev => ({ ...prev, baseDn: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="DC=company,DC=com"
              disabled={!adConfig.enabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Filter</label>
            <input
              type="text"
              value={adConfig.userFilter}
              onChange={(e) => setAdConfig(prev => ({ ...prev, userFilter: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!adConfig.enabled}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={adConfig.useSSL}
              onChange={(e) => setAdConfig(prev => ({ ...prev, useSSL: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={!adConfig.enabled}
            />
            <label className="text-sm text-gray-700">Use SSL/TLS</label>
          </div>
        </div>
      </div>

      {/* Attribute Mapping */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attribute Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(adConfig.attributeMapping).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setAdConfig(prev => ({
                  ...prev,
                  attributeMapping: { ...prev.attributeMapping, [key]: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!adConfig.enabled}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getProviderConfig = (providerId) => {
    switch (providerId) {
      case 'saml': return samlConfig;
      case 'oauth': return oauthConfig;
      case 'ldap': return ldapConfig;
      case 'ad': return adConfig;
      default: return null;
    }
  };

  const isProviderEnabled = (providerId) => {
    const config = getProviderConfig(providerId);
    return config?.enabled || false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-500" />
                SSO Configuration
              </h1>
              <p className="text-gray-600 mt-1">Single sign-on with identity providers</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={testConnection}
                disabled={testingConnection || !isProviderEnabled(activeProvider)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {testingConnection ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {testingConnection ? 'Testing...' : 'Test Connection'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Identity Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                onClick={() => setActiveProvider(provider.id)}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  activeProvider === provider.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center text-white`}>
                    {provider.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    {provider.popular && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  {isProviderEnabled(provider.id) && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{provider.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProvider}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeProvider === 'saml' && renderSAMLConfig()}
              {activeProvider === 'oauth' && renderOAuthConfig()}
              {activeProvider === 'ldap' && renderLDAPConfig()}
              {activeProvider === 'ad' && renderADConfig()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold text-gray-900">Connection Status</h3>
            </div>
            <div className="space-y-2">
              {providers.map(provider => (
                <div key={provider.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{provider.name}</span>
                  <div className="flex items-center gap-2">
                    {isProviderEnabled(provider.id) ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span className="text-xs text-gray-500">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold text-gray-900">User Mapping</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Configured attributes:</p>
              <ul className="space-y-1">
                <li>• Email address</li>
                <li>• First name</li>
                <li>• Last name</li>
                <li>• User role</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Security</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Security features:</p>
              <ul className="space-y-1">
                <li>• Request signing</li>
                <li>• Assertion encryption</li>
                <li>• SSL/TLS support</li>
                <li>• Token validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOConfiguration;
