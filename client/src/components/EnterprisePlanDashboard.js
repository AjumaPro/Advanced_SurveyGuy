import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import {
  Crown,
  Shield,
  Users,
  BarChart3,
  FileText,
  Globe,
  Code,
  Database,
  Settings,
  Zap,
  TrendingUp,
  Target,
  Lock,
  Bell,
  Calendar,
  Download,
  Share2,
  Eye,
  ArrowRight,
  Activity,
  Server,
  UserCheck,
  Briefcase
} from 'lucide-react';

const EnterprisePlanDashboard = ({ 
  surveys = [], 
  responses = [], 
  teamMembers = [],
  organizations = []
}) => {
  const navigate = useNavigate();
  const { getPlanLimits } = useFeatureAccess();
  
  const totalResponses = responses.length;
  const activeTeamMembers = teamMembers.length || 1;
  const totalOrganizations = organizations.length || 1;

  const stats = [
    {
      label: 'Total Surveys',
      value: surveys.length.toLocaleString(),
      icon: FileText,
      color: 'blue',
      subtitle: 'Unlimited capacity',
      trend: '+12% this month'
    },
    {
      label: 'Total Responses',
      value: totalResponses.toLocaleString(),
      icon: BarChart3,
      color: 'green',
      subtitle: 'All time',
      trend: '+28% this month'
    },
    {
      label: 'Team Members',
      value: activeTeamMembers.toLocaleString(),
      icon: Users,
      color: 'purple',
      subtitle: 'Active collaborators',
      trend: 'Unlimited'
    },
    {
      label: 'Organizations',
      value: totalOrganizations,
      icon: Briefcase,
      color: 'orange',
      subtitle: 'Multi-tenant setup',
      trend: 'Enterprise'
    }
  ];

  const enterpriseActions = [
    {
      title: 'Advanced Survey Builder',
      description: 'Create complex surveys with conditional logic',
      icon: FileText,
      color: 'blue',
      action: () => navigate('/app/enterprise/advanced-builder'),
      feature: 'advanced_survey_creation'
    },
    {
      title: 'Real-time Analytics',
      description: 'Live dashboards with instant insights',
      icon: Activity,
      color: 'green',
      action: () => navigate('/app/analytics/realtime'),
      feature: 'real_time_analytics'
    },
    {
      title: 'Team Management',
      description: 'Advanced role-based access control',
      icon: UserCheck,
      color: 'purple',
      action: () => navigate('/app/enterprise/team-management'),
      feature: 'advanced_team_management'
    },
    {
      title: 'White Label Portal',
      description: 'Customize the entire platform branding',
      icon: Globe,
      color: 'pink',
      action: () => navigate('/app/enterprise/white-label'),
      feature: 'white_label'
    },
    {
      title: 'SSO Configuration',
      description: 'Single sign-on with identity providers',
      icon: Shield,
      color: 'red',
      action: () => navigate('/app/enterprise/sso'),
      feature: 'sso_integration'
    },
    {
      title: 'API & Webhooks',
      description: 'Enterprise integrations and automation',
      icon: Code,
      color: 'gray',
      action: () => navigate('/app/enterprise/api-webhooks'),
      feature: 'webhook_integration'
    },
    {
      title: 'Data Export & Backup',
      description: 'Bulk export with retention controls',
      icon: Database,
      color: 'indigo',
      action: () => navigate('/app/enterprise/data-export'),
      feature: 'bulk_export'
    },
    {
      title: 'Enterprise Security',
      description: 'Audit logs and compliance tools',
      icon: Lock,
      color: 'red',
      action: () => navigate('/app/enterprise/security'),
      feature: 'enterprise_security'
    }
  ];

  const enterpriseFeatures = [
    {
      icon: Crown,
      title: 'White Label Solution',
      description: 'Complete platform branding control',
      status: 'active'
    },
    {
      icon: Shield,
      title: 'SSO Integration',
      description: 'SAML, OAuth, LDAP support',
      status: 'active'
    },
    {
      icon: Users,
      title: 'Unlimited Team Members',
      description: 'No limits on collaboration',
      status: 'active'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Live dashboards and insights',
      status: 'active'
    },
    {
      icon: Code,
      title: 'Advanced API & Webhooks',
      description: 'Enterprise integrations',
      status: 'active'
    },
    {
      icon: Database,
      title: 'Data Retention Control',
      description: 'Custom backup and export',
      status: 'active'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Audit logs and compliance',
      status: 'active'
    },
    {
      icon: Bell,
      title: 'Dedicated Support',
      description: '24/7 priority assistance',
      status: 'active'
    }
  ];

  const recentActivity = [
    {
      type: 'survey_created',
      message: 'New survey "Q4 Customer Satisfaction" created',
      time: '2 hours ago',
      user: 'John Smith'
    },
    {
      type: 'team_member_added',
      message: 'Sarah Johnson added to Marketing team',
      time: '4 hours ago',
      user: 'Admin'
    },
    {
      type: 'export_completed',
      message: 'Bulk data export completed (15,000 responses)',
      time: '6 hours ago',
      user: 'System'
    },
    {
      type: 'integration_updated',
      message: 'Salesforce webhook integration updated',
      time: '1 day ago',
      user: 'Tech Team'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Crown className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Enterprise Command Center</h1>
              </div>
              <p className="text-purple-100 text-lg">
                Complete platform control with unlimited everything and enterprise-grade security.
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-bold">
                Enterprise Plan
              </div>
              <div className="text-purple-200 text-xs mt-1">All features unlocked</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Advanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-50 rounded-full -translate-y-10 translate-x-10`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Enterprise Tools</h2>
          <div className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
            All Features Active
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enterpriseActions.map((action, index) => (
            <div
              key={action.title}
              onClick={action.action}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 bg-${action.color}-100 rounded-lg group-hover:bg-${action.color}-200 transition-colors`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
              </div>
              <p className="text-xs text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Enterprise Features Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Enterprise Features</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enterpriseFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-start space-x-3 p-3 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <feature.icon className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button
              onClick={() => navigate('/app/activity')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">{activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Response Rate</p>
                <p className="text-sm text-gray-600">Average across all surveys</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">87%</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Completion Time</p>
                <p className="text-sm text-gray-600">Average survey duration</p>
              </div>
              <div className="text-2xl font-bold text-green-600">4.2m</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Data Quality</p>
                <p className="text-sm text-gray-600">Clean response rate</p>
              </div>
              <div className="text-2xl font-bold text-purple-600">94%</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Team Productivity</p>
                <p className="text-sm text-gray-600">Surveys per team member</p>
              </div>
              <div className="text-2xl font-bold text-orange-600">12.5</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enterprise Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Dedicated Enterprise Support</h2>
            <p className="text-gray-300">
              24/7 priority support with dedicated account management and custom development
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.open('/contact', '_blank')}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/app/account')}
              className="border border-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:border-gray-500 transition-colors"
            >
              Account Manager
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnterprisePlanDashboard;
