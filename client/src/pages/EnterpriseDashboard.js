import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  Users,
  Globe,
  Shield,
  Code,
  Database,
  Lock,
  Crown,
  CheckCircle,
  Settings,
  BarChart3,
  Zap,
  Palette,
  Server,
  Key,
  Download,
  Bell,
  Activity,
  UserCheck,
  Briefcase,
  Target,
  Eye,
  ArrowRight,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EnterpriseDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [systemStatus, setSystemStatus] = useState('operational');
  const [stats, setStats] = useState({
    totalSurveys: 0,
    totalResponses: 0,
    teamMembers: 0,
    apiCalls: 0
  });

  useEffect(() => {
    // Fetch enterprise stats
    fetchEnterpriseStats();
  }, []);

  const fetchEnterpriseStats = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalSurveys: 1247,
      totalResponses: 89432,
      teamMembers: 156,
      apiCalls: 234567
    });
  };

  const enterpriseTools = [
    {
      id: 'advanced-builder',
      title: 'Advanced Survey Builder',
      description: 'Create complex surveys with conditional logic',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-500',
      route: '/app/builder/new',
      features: ['Conditional Logic', 'Advanced Question Types', 'Custom Validation', 'Multi-page Surveys']
    },
    {
      id: 'realtime-analytics',
      title: 'Real-time Analytics',
      description: 'Live dashboards with instant insights',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
      route: '/app/analytics/realtime',
      features: ['Live Dashboards', 'Real-time Updates', 'Advanced Filtering', 'Export Options']
    },
    {
      id: 'team-management',
      title: 'Team Management',
      description: 'Advanced role-based access control',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500',
      route: '/app/enterprise/team',
      features: ['Role-based Access', 'Department Groups', 'Permission Matrix', 'Activity Logs']
    },
    {
      id: 'white-label',
      title: 'White Label Portal',
      description: 'Customize the entire platform branding',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-indigo-500',
      route: '/app/enterprise/white-label',
      features: ['Custom Branding', 'Domain Mapping', 'Email Templates', 'Mobile Apps']
    },
    {
      id: 'sso-config',
      title: 'SSO Configuration',
      description: 'Single sign-on with identity providers',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-500',
      route: '/app/enterprise/sso',
      features: ['SAML 2.0', 'OAuth 2.0', 'LDAP', 'Active Directory']
    },
    {
      id: 'api-webhooks',
      title: 'API & Webhooks',
      description: 'Enterprise integrations and automation',
      icon: <Code className="w-6 h-6" />,
      color: 'bg-gray-500',
      route: '/app/enterprise/api',
      features: ['REST API', 'GraphQL', 'Webhooks', 'Rate Limiting']
    },
    {
      id: 'data-export',
      title: 'Data Export & Backup',
      description: 'Bulk export with retention controls',
      icon: <Database className="w-6 h-6" />,
      color: 'bg-blue-600',
      route: '/app/enterprise/data-export',
      features: ['Automated Backups', 'Bulk Export', 'Data Retention', 'Compliance Reports']
    },
    {
      id: 'enterprise-security',
      title: 'Enterprise Security',
      description: 'Audit logs and compliance tools',
      icon: <Lock className="w-6 h-6" />,
      color: 'bg-red-600',
      route: '/app/enterprise/security',
      features: ['Audit Logs', 'Compliance Tools', 'IP Restrictions', 'Data Encryption']
    }
  ];

  const enterpriseFeatures = [
    {
      title: 'White Label Solution',
      description: 'Complete platform branding control',
      icon: <Crown className="w-5 h-5" />,
      status: 'operational'
    },
    {
      title: 'SSO Integration',
      description: 'SAML, OAuth, LDAP support',
      icon: <Shield className="w-5 h-5" />,
      status: 'operational'
    },
    {
      title: 'Unlimited Team Members',
      description: 'No limits on collaboration',
      icon: <Users className="w-5 h-5" />,
      status: 'operational'
    },
    {
      title: 'Real-time Analytics',
      description: 'Live dashboards and insights',
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'operational'
    },
    {
      title: 'Advanced API & Webhooks',
      description: 'Enterprise integrations',
      icon: <Code className="w-5 h-5" />,
      status: 'operational'
    },
    {
      title: 'Data Retention Control',
      description: 'Custom backup and export',
      icon: <Database className="w-5 h-5" />,
      status: 'operational'
    },
    {
      title: 'Enterprise Security',
      description: 'Audit logs and compliance',
      icon: <Lock className="w-5 h-5" />,
      status: 'operational'
    },
    {
      title: 'Dedicated Support',
      description: '24/7 priority assistance',
      icon: <Bell className="w-5 h-5" />,
      status: 'operational'
    }
  ];

  const handleToolClick = (tool) => {
    navigate(tool.route);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'maintenance': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                Enterprise Tools
              </h1>
              <p className="text-gray-600 mt-1">Advanced features for enterprise organizations</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">All Features Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSurveys.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalResponses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-gray-900">{stats.teamMembers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-3xl font-bold text-gray-900">{stats.apiCalls.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enterprise Tools Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enterprise Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleToolClick(tool)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-white`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                
                <div className="space-y-2">
                  {tool.features.slice(0, 2).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enterprise Features Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Enterprise Features</h2>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600 truncate">{feature.description}</p>
                </div>
                <CheckCircle className={`w-4 h-4 ${getStatusColor(feature.status)}`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6" />
              <h3 className="font-semibold">Quick Start</h3>
            </div>
            <p className="text-blue-100 mb-4">Create your first enterprise survey with advanced features</p>
            <button 
              onClick={() => navigate('/app/builder/new')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Create Survey
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6" />
              <h3 className="font-semibold">Configuration</h3>
            </div>
            <p className="text-purple-100 mb-4">Set up SSO, white-labeling, and security settings</p>
            <button 
              onClick={() => navigate('/app/enterprise/settings')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Configure
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6" />
              <h3 className="font-semibold">Support</h3>
            </div>
            <p className="text-green-100 mb-4">24/7 dedicated enterprise support and assistance</p>
            <button 
              onClick={() => window.open('/contact', '_blank')}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
