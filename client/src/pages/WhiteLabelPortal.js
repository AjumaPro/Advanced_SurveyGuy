import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Globe,
  Mail,
  Smartphone,
  Monitor,
  Upload,
  Download,
  Eye,
  Save,
  RotateCcw,
  Settings,
  Crown,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
  Image as ImageIcon,
  Type,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const WhiteLabelPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  
  const [brandingConfig, setBrandingConfig] = useState({
    companyName: 'Your Company',
    logo: null,
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    fontFamily: 'Inter',
    customCSS: '',
    favicon: null,
    loginBackground: null,
    headerLogo: null,
    footerLogo: null
  });

  const [domainConfig, setDomainConfig] = useState({
    customDomain: '',
    subdomain: 'yourcompany',
    sslEnabled: true,
    redirects: [],
    dnsRecords: []
  });

  const [emailConfig, setEmailConfig] = useState({
    fromName: 'Your Company',
    fromEmail: 'noreply@yourcompany.com',
    replyToEmail: 'support@yourcompany.com',
    emailSignature: '',
    customTemplates: {
      invitation: '',
      reminder: '',
      thankYou: '',
      report: ''
    }
  });

  const [mobileConfig, setMobileConfig] = useState({
    appName: 'Your Survey App',
    appIcon: null,
    splashScreen: null,
    themeColor: '#3B82F6',
    bundleId: 'com.yourcompany.surveys',
    pushNotifications: true,
    offlineMode: true
  });

  const tabs = [
    { id: 'branding', label: 'Branding', icon: <Palette className="w-4 h-4" /> },
    { id: 'domain', label: 'Domain', icon: <Globe className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'mobile', label: 'Mobile App', icon: <Smartphone className="w-4 h-4" /> }
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Source Sans Pro', 'Nunito'
  ];

  const previewModes = [
    { id: 'desktop', label: 'Desktop', icon: <Monitor className="w-4 h-4" /> },
    { id: 'tablet', label: 'Tablet', icon: <Monitor className="w-4 h-4" /> },
    { id: 'mobile', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> }
  ];

  useEffect(() => {
    loadWhiteLabelConfig();
  }, []);

  const loadWhiteLabelConfig = async () => {
    try {
      // Load existing configuration from API
      // const response = await api.get('/white-label/config');
      // setBrandingConfig(response.data.branding);
      // setDomainConfig(response.data.domain);
      // setEmailConfig(response.data.email);
      // setMobileConfig(response.data.mobile);
    } catch (error) {
      console.error('Failed to load white-label config:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const config = {
        branding: brandingConfig,
        domain: domainConfig,
        email: emailConfig,
        mobile: mobileConfig
      };
      
      // await api.post('/white-label/config', config);
      toast.success('White-label configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save configuration');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (field, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setBrandingConfig(prev => ({
        ...prev,
        [field]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const generateDNSRecords = () => {
    const records = [
      { type: 'CNAME', name: domainConfig.subdomain, value: 'app.surveyplatform.com' },
      { type: 'A', name: '@', value: '192.168.1.100' },
      { type: 'TXT', name: '@', value: 'v=spf1 include:surveyplatform.com ~all' }
    ];
    setDomainConfig(prev => ({ ...prev, dnsRecords: records }));
    toast.success('DNS records generated!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const renderBrandingTab = () => (
    <div className="space-y-8">
      {/* Logo Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {brandingConfig.logo ? (
                <div className="space-y-3">
                  <img src={brandingConfig.logo} alt="Logo" className="h-16 mx-auto" />
                  <button
                    onClick={() => setBrandingConfig(prev => ({ ...prev, logo: null }))}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <label className="cursor-pointer text-blue-600 hover:text-blue-800">
                      <span>Upload logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('logo', e.target.files[0])}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={brandingConfig.companyName}
              onChange={(e) => setBrandingConfig(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select
              value={brandingConfig.fontFamily}
              onChange={(e) => setBrandingConfig(prev => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Color Scheme */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Color Scheme</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brandingConfig.primaryColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingConfig.primaryColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brandingConfig.secondaryColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingConfig.secondaryColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brandingConfig.accentColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingConfig.accentColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brandingConfig.backgroundColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={brandingConfig.backgroundColor}
                  onChange={(e) => setBrandingConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="p-4 rounded-lg border border-gray-200" style={{ backgroundColor: brandingConfig.backgroundColor }}>
            <div className="text-center space-y-3">
              <h4 className="font-semibold" style={{ color: brandingConfig.textColor }}>
                {brandingConfig.companyName}
              </h4>
              <button
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: brandingConfig.primaryColor }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white font-medium ml-2"
                style={{ backgroundColor: brandingConfig.secondaryColor }}
              >
                Secondary Button
              </button>
              <div
                className="inline-block px-3 py-1 rounded-full text-white text-sm"
                style={{ backgroundColor: brandingConfig.accentColor }}
              >
                Accent Badge
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
        <textarea
          value={brandingConfig.customCSS}
          onChange={(e) => setBrandingConfig(prev => ({ ...prev, customCSS: e.target.value }))}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="/* Add your custom CSS here */"
        />
        <p className="text-xs text-gray-500 mt-1">Advanced CSS customization for complete control over styling</p>
      </div>
    </div>
  );

  const renderDomainTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Domain</label>
            <input
              type="text"
              value={domainConfig.customDomain}
              onChange={(e) => setDomainConfig(prev => ({ ...prev, customDomain: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="surveys.yourcompany.com"
            />
            <p className="text-xs text-gray-500 mt-1">Use your own domain for the survey platform</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
            <div className="flex">
              <input
                type="text"
                value={domainConfig.subdomain}
                onChange={(e) => setDomainConfig(prev => ({ ...prev, subdomain: e.target.value }))}
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="yourcompany"
              />
              <span className="px-3 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                .surveyplatform.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={domainConfig.sslEnabled}
              onChange={(e) => setDomainConfig(prev => ({ ...prev, sslEnabled: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Enable SSL Certificate (Recommended)</label>
          </div>

          <button
            onClick={generateDNSRecords}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Generate DNS Records
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">DNS Configuration</h3>
          
          {domainConfig.dnsRecords.length > 0 && (
            <div className="space-y-3">
              {domainConfig.dnsRecords.map((record, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{record.type} Record</span>
                    <button
                      onClick={() => copyToClipboard(record.value)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Name:</strong> {record.name}</p>
                    <p><strong>Value:</strong> {record.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Add the DNS records to your domain provider</li>
              <li>Wait for DNS propagation (up to 24 hours)</li>
              <li>Verify domain ownership</li>
              <li>SSL certificate will be automatically provisioned</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
            <input
              type="text"
              value={emailConfig.fromName}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, fromName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
            <input
              type="email"
              value={emailConfig.fromEmail}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="noreply@yourcompany.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reply-To Email</label>
            <input
              type="email"
              value={emailConfig.replyToEmail}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, replyToEmail: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="support@yourcompany.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Signature</label>
            <textarea
              value={emailConfig.emailSignature}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, emailSignature: e.target.value }))}
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Best regards,&#10;Your Company Team"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
          
          {Object.entries(emailConfig.customTemplates).map(([type, template]) => (
            <div key={type}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {type.replace(/([A-Z])/g, ' $1').trim()} Template
              </label>
              <textarea
                value={template}
                onChange={(e) => setEmailConfig(prev => ({
                  ...prev,
                  customTemplates: { ...prev.customTemplates, [type]: e.target.value }
                }))}
                className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder={`Custom ${type} email template...`}
              />
            </div>
          ))}

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Template Variables</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p><code>{'{{company_name}}'}</code> - Company name</p>
              <p><code>{'{{recipient_name}}'}</code> - Recipient name</p>
              <p><code>{'{{survey_title}}'}</code> - Survey title</p>
              <p><code>{'{{survey_url}}'}</code> - Survey URL</p>
              <p><code>{'{{unsubscribe_url}}'}</code> - Unsubscribe URL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
            <input
              type="text"
              value={mobileConfig.appName}
              onChange={(e) => setMobileConfig(prev => ({ ...prev, appName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Survey App"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bundle ID</label>
            <input
              type="text"
              value={mobileConfig.bundleId}
              onChange={(e) => setMobileConfig(prev => ({ ...prev, bundleId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="com.yourcompany.surveys"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={mobileConfig.themeColor}
                onChange={(e) => setMobileConfig(prev => ({ ...prev, themeColor: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={mobileConfig.themeColor}
                onChange={(e) => setMobileConfig(prev => ({ ...prev, themeColor: e.target.value }))}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={mobileConfig.pushNotifications}
                onChange={(e) => setMobileConfig(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Enable Push Notifications</label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={mobileConfig.offlineMode}
                onChange={(e) => setMobileConfig(prev => ({ ...prev, offlineMode: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Enable Offline Mode</label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">App Assets</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">App Icon</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {mobileConfig.appIcon ? (
                <div className="space-y-3">
                  <img src={mobileConfig.appIcon} alt="App Icon" className="w-16 h-16 mx-auto rounded-xl" />
                  <button
                    onClick={() => setMobileConfig(prev => ({ ...prev, appIcon: null }))}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove Icon
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <label className="cursor-pointer text-blue-600 hover:text-blue-800">
                      <span>Upload app icon</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('appIcon', e.target.files[0])}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">1024x1024px PNG</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Mobile App Features</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Native iOS and Android apps</li>
              <li>• Offline survey completion</li>
              <li>• Push notifications</li>
              <li>• Biometric authentication</li>
              <li>• Custom app store listing</li>
            </ul>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
            <Download className="w-4 h-4" />
            Generate Mobile App
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
        <div className="flex items-center gap-2">
          {previewModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setPreviewMode(mode.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                previewMode === mode.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {mode.icon}
              <span className="text-sm">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className={`mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-sm' :
            previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-full'
          }`}
          style={{ 
            backgroundColor: brandingConfig.backgroundColor,
            fontFamily: brandingConfig.fontFamily
          }}
        >
          {/* Preview Header */}
          <div 
            className="px-6 py-4 border-b"
            style={{ backgroundColor: brandingConfig.primaryColor }}
          >
            <div className="flex items-center gap-3">
              {brandingConfig.logo && (
                <img src={brandingConfig.logo} alt="Logo" className="h-8" />
              )}
              <h1 className="text-xl font-bold text-white">
                {brandingConfig.companyName}
              </h1>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: brandingConfig.textColor }}>
                Welcome to Your Survey Platform
              </h2>
              <p className="text-gray-600">
                This is how your white-labeled platform will look to your users.
              </p>
            </div>

            <div className="space-y-3">
              <button
                className="w-full px-4 py-3 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: brandingConfig.primaryColor }}
              >
                Create New Survey
              </button>
              
              <button
                className="w-full px-4 py-3 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: brandingConfig.secondaryColor }}
              >
                View Analytics
              </button>

              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: brandingConfig.accentColor }}
                >
                  New Feature
                </span>
                <span
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: brandingConfig.primaryColor }}
                >
                  Popular
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium mb-2" style={{ color: brandingConfig.textColor }}>
                    Survey {i}
                  </h3>
                  <p className="text-sm text-gray-600">Sample survey description</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                <Crown className="w-8 h-8 text-yellow-500" />
                White Label Portal
              </h1>
              <p className="text-gray-600 mt-1">Customize the entire platform branding</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode('preview')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
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
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
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
              
              <button
                onClick={() => setActiveTab('preview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === 'preview'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="font-medium">Preview</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'branding' && renderBrandingTab()}
                  {activeTab === 'domain' && renderDomainTab()}
                  {activeTab === 'email' && renderEmailTab()}
                  {activeTab === 'mobile' && renderMobileTab()}
                  {activeTab === 'preview' && renderPreview()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelPortal;
