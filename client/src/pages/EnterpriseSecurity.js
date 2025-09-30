import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  User,
  Globe,
  Server,
  Database,
  Key,
  Settings,
  Filter,
  Search,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Save,
  FileText,
  BarChart3,
  Zap,
  Bell,
  Users,
  MapPin,
  Monitor,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EnterpriseSecurity = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('audit');
  const [loading, setLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityPolicies, setSecurityPolicies] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [threats, setThreats] = useState([]);

  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    type: 'access',
    severity: 'medium',
    conditions: [],
    actions: [],
    enabled: true
  });

  const [newAlert, setNewAlert] = useState({
    name: '',
    description: '',
    type: 'security',
    severity: 'medium',
    conditions: [],
    notifications: [],
    enabled: true
  });

  const tabs = [
    { id: 'audit', label: 'Audit Logs', icon: <Activity className="w-4 h-4" /> },
    { id: 'policies', label: 'Security Policies', icon: <Shield className="w-4 h-4" /> },
    { id: 'alerts', label: 'Security Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'threats', label: 'Threat Detection', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'compliance', label: 'Compliance', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const auditEvents = [
    {
      id: 1,
      timestamp: '2024-01-15T10:30:00Z',
      user: 'john@company.com',
      action: 'login',
      resource: 'dashboard',
      ip: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'Chrome on Windows',
      status: 'success',
      details: 'User logged in successfully'
    },
    {
      id: 2,
      timestamp: '2024-01-15T10:25:00Z',
      user: 'sarah@company.com',
      action: 'survey_created',
      resource: 'survey_123',
      ip: '192.168.1.101',
      location: 'New York, NY',
      device: 'Safari on macOS',
      status: 'success',
      details: 'Created new survey: Customer Feedback Q1'
    },
    {
      id: 3,
      timestamp: '2024-01-15T10:20:00Z',
      user: 'unknown',
      action: 'failed_login',
      resource: 'login',
      ip: '203.0.113.1',
      location: 'Unknown',
      device: 'Unknown',
      status: 'failed',
      details: 'Failed login attempt with invalid credentials'
    },
    {
      id: 4,
      timestamp: '2024-01-15T10:15:00Z',
      user: 'admin@company.com',
      action: 'permission_changed',
      resource: 'user_sarah',
      ip: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'Chrome on Windows',
      status: 'success',
      details: 'Changed user permissions for Sarah Johnson'
    }
  ];

  const securityPoliciesData = [
    {
      id: 1,
      name: 'Password Policy',
      description: 'Enforce strong password requirements',
      type: 'authentication',
      severity: 'high',
      enabled: true,
      rules: [
        'Minimum 8 characters',
        'Must contain uppercase and lowercase',
        'Must contain numbers and symbols',
        'Cannot reuse last 5 passwords'
      ]
    },
    {
      id: 2,
      name: 'Session Timeout',
      description: 'Automatic session termination after inactivity',
      type: 'session',
      severity: 'medium',
      enabled: true,
      rules: [
        '30 minutes of inactivity',
        '8 hours maximum session duration',
        'Require re-authentication for sensitive operations'
      ]
    },
    {
      id: 3,
      name: 'IP Whitelist',
      description: 'Restrict access to specific IP addresses',
      type: 'access',
      severity: 'high',
      enabled: false,
      rules: [
        'Office IP: 192.168.1.0/24',
        'VPN IP: 10.0.0.0/8',
        'Block all other IPs'
      ]
    }
  ];

  const threatData = [
    {
      id: 1,
      type: 'brute_force',
      severity: 'high',
      source: '203.0.113.1',
      target: 'login',
      timestamp: '2024-01-15T10:20:00Z',
      status: 'blocked',
      details: 'Multiple failed login attempts detected'
    },
    {
      id: 2,
      type: 'suspicious_activity',
      severity: 'medium',
      source: '198.51.100.1',
      target: 'api',
      timestamp: '2024-01-15T09:45:00Z',
      status: 'monitoring',
      details: 'Unusual API access pattern detected'
    },
    {
      id: 3,
      type: 'data_breach',
      severity: 'critical',
      source: 'internal',
      target: 'user_data',
      timestamp: '2024-01-15T08:30:00Z',
      status: 'investigating',
      details: 'Potential unauthorized access to user data'
    }
  ];

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load security data from API
      // const response = await api.get('/security/data');
      // setAuditLogs(response.data.auditLogs);
      // setSecurityPolicies(response.data.policies);
      // setAlerts(response.data.alerts);
      // setThreats(response.data.threats);
    } catch (error) {
      console.error('Failed to load security data:', error);
    }
  };

  const createSecurityPolicy = async () => {
    setLoading(true);
    try {
      // await api.post('/security/policies', newPolicy);
      toast.success('Security policy created successfully!');
      setShowPolicyModal(false);
      setNewPolicy({
        name: '',
        description: '',
        type: 'access',
        severity: 'medium',
        conditions: [],
        actions: [],
        enabled: true
      });
    } catch (error) {
      toast.error('Failed to create security policy');
    } finally {
      setLoading(false);
    }
  };

  const createSecurityAlert = async () => {
    setLoading(true);
    try {
      // await api.post('/security/alerts', newAlert);
      toast.success('Security alert created successfully!');
      setShowAlertModal(false);
      setNewAlert({
        name: '',
        description: '',
        type: 'security',
        severity: 'medium',
        conditions: [],
        notifications: [],
        enabled: true
      });
    } catch (error) {
      toast.error('Failed to create security alert');
    } finally {
      setLoading(false);
    }
  };

  const exportAuditLogs = async () => {
    try {
      // await api.get('/security/audit/export');
      toast.success('Audit logs exported successfully!');
    } catch (error) {
      toast.error('Failed to export audit logs');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100';
      case 'investigating': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderAuditTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">All Events</option>
            <option value="login">Login Events</option>
            <option value="data_access">Data Access</option>
            <option value="permission_changes">Permission Changes</option>
          </select>
          <button
            onClick={exportAuditLogs}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditEvents.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{event.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {event.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{event.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
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

  const renderPoliciesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Security Policies</h2>
        <button
          onClick={() => setShowPolicyModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Policy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityPoliciesData.map(policy => (
          <div key={policy.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                <p className="text-sm text-gray-600">{policy.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(policy.severity)}`}>
                  {policy.severity}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm text-gray-900 capitalize">{policy.type}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {policy.enabled ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <XCircle className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Rules</label>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  {policy.rules.slice(0, 2).map((rule, index) => (
                    <li key={index}>• {rule}</li>
                  ))}
                  {policy.rules.length > 2 && (
                    <li className="text-blue-600">+{policy.rules.length - 2} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Security Alerts</h2>
        <button
          onClick={() => setShowAlertModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Alert
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{alert.name}</h3>
                <p className="text-sm text-gray-600">{alert.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  {alert.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <p className="text-sm text-gray-900 capitalize">{alert.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Triggered</label>
                <p className="text-sm text-gray-900">{alert.lastTriggered || 'Never'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Trigger Count</label>
                <p className="text-sm text-gray-900">{alert.triggerCount || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThreatsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Threat Detection</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Active Threats</h3>
              <p className="text-sm text-gray-600">Currently being monitored</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">{threats.filter(t => t.status === 'investigating').length}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Monitored</h3>
              <p className="text-sm text-gray-600">Under surveillance</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{threats.filter(t => t.status === 'monitoring').length}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Blocked</h3>
              <p className="text-sm text-gray-600">Successfully prevented</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{threats.filter(t => t.status === 'blocked').length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {threatData.map(threat => (
          <div key={threat.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">{threat.type.replace('_', ' ')}</h3>
                <p className="text-sm text-gray-600">{threat.details}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                  {threat.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Source</label>
                <p className="text-sm text-gray-900">{threat.source}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target</label>
                <p className="text-sm text-gray-900">{threat.target}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Detected</label>
                <p className="text-sm text-gray-900">{new Date(threat.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Compliance Dashboard</h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GDPR Compliance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Processing Records</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Compliant
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Consent Management</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Compliant
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Right to Erasure</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Compliant
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SOC 2 Type II</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Security Controls</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Compliant
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Availability</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Compliant
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Processing Integrity</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Compliant
              </span>
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
                <Shield className="w-8 h-8 text-blue-500" />
                Enterprise Security
              </h1>
              <p className="text-gray-600 mt-1">Audit logs and compliance tools</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{auditEvents.length}</div>
                <div className="text-sm text-gray-600">Audit Events</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{threats.length}</div>
                <div className="text-sm text-gray-600">Threats Detected</div>
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
                {activeTab === 'audit' && renderAuditTab()}
                {activeTab === 'policies' && renderPoliciesTab()}
                {activeTab === 'alerts' && renderAlertsTab()}
                {activeTab === 'threats' && renderThreatsTab()}
                {activeTab === 'compliance' && renderComplianceTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSecurity;
