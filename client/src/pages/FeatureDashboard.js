import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PLAN_FEATURES } from '../utils/planFeatures';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import CustomBranding from '../components/CustomBranding';
import TeamCollaboration from '../components/TeamCollaboration';
import APIAccess from '../components/APIAccess';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import SSOConfiguration from '../components/SSOConfiguration';
import {
  Zap,
  Crown,
  Star,
  CheckCircle,
  XCircle,
  ArrowRight,
  Users,
  BarChart3,
  Code,
  Palette,
  Upload,
  Shield,
  Activity
} from 'lucide-react';

const FeatureDashboard = () => {
  const { userProfile } = useAuth();
  const [activeFeature, setActiveFeature] = useState('overview');
  
  const userPlan = userProfile?.plan || 'free';

  const features = [
    {
      id: 'file-uploads',
      name: 'File Uploads',
      description: 'Allow respondents to upload files in surveys',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      requiredPlan: 'free',
      component: FileUpload
    },
    {
      id: 'custom-branding',
      name: 'Custom Branding',
      description: 'Customize survey appearance with your brand',
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      requiredPlan: 'pro',
      component: CustomBranding
    },
    {
      id: 'team-collaboration',
      name: 'Team Collaboration',
      description: 'Invite team members and assign roles',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      requiredPlan: 'pro',
      component: TeamCollaboration
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Integrate with external applications',
      icon: Code,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      requiredPlan: 'pro',
      component: APIAccess
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Detailed insights and reporting',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      requiredPlan: 'pro',
      component: AdvancedAnalytics
    },
    {
      id: 'sso',
      name: 'Single Sign-On',
      description: 'Enterprise authentication integration',
      icon: Shield,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      requiredPlan: 'enterprise',
      component: SSOConfiguration
    }
  ];

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'free': return <Star className="w-4 h-4" />;
      case 'pro': return <Zap className="w-4 h-4" />;
      case 'enterprise': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeatureAccess = (featureId) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return false;
    
    const planHierarchy = ['free', 'pro', 'enterprise'];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(feature.requiredPlan);
    
    return userPlanIndex >= requiredPlanIndex;
  };

  const getAvailableFeatures = () => {
    return features.filter(feature => getFeatureAccess(feature.id));
  };

  const getLockedFeatures = () => {
    return features.filter(feature => !getFeatureAccess(feature.id));
  };

  const renderFeatureComponent = () => {
    const feature = features.find(f => f.id === activeFeature);
    if (!feature || !feature.component) return null;
    
    const Component = feature.component;
    return <Component />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feature Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and configure your plan features</p>
            </div>
            
            {/* Current Plan Badge */}
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getPlanColor(userPlan)}`}>
                {getPlanIcon(userPlan)}
                <span className="font-medium capitalize">{userPlan} Plan</span>
              </div>
              <a
                href="/app/subscriptions"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Plan
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Feature Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
              
              {/* Overview */}
              <button
                onClick={() => setActiveFeature('overview')}
                className={`w-full text-left p-3 rounded-lg transition-colors mb-2 ${
                  activeFeature === 'overview' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
                </div>
              </button>

              {/* Available Features */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Available Features</h3>
                <div className="space-y-1">
                  {getAvailableFeatures().map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeFeature === feature.id 
                            ? `${feature.bgColor} ${feature.color} border border-current border-opacity-30` 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{feature.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Locked Features */}
              {getLockedFeatures().length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Upgrade Required</h3>
                  <div className="space-y-1">
                    {getLockedFeatures().map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={feature.id}
                          className="p-3 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-600">{feature.name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                {getPlanIcon(feature.requiredPlan)}
                                <span className="text-xs text-gray-500 capitalize">
                                  {feature.requiredPlan} required
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature Content */}
          <div className="lg:col-span-3">
            {activeFeature === 'overview' ? (
              <div className="space-y-6">
                {/* Plan Overview */}
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Plan Features</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(PLAN_FEATURES[userPlan] || {}).map(([category, categoryFeatures]) => {
                      if (typeof categoryFeatures !== 'object' || categoryFeatures === null) return null;
                      
                      return (
                        <div key={category} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-3 capitalize">
                            {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </h3>
                          <div className="space-y-2">
                            {Object.entries(categoryFeatures).map(([feature, value]) => (
                              <div key={feature} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 capitalize">
                                  {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {typeof value === 'boolean' ? (
                                    value ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-500" />
                                    )
                                  ) : typeof value === 'number' ? (
                                    value.toLocaleString()
                                  ) : (
                                    String(value)
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    const hasAccess = getFeatureAccess(feature.id);
                    
                    return (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-lg border p-6 transition-all hover:shadow-md ${
                          hasAccess ? 'cursor-pointer' : 'opacity-75'
                        }`}
                        onClick={() => hasAccess && setActiveFeature(feature.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                            <Icon className={`w-6 h-6 ${feature.color}`} />
                          </div>
                          {hasAccess ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(feature.requiredPlan)}`}>
                              {getPlanIcon(feature.requiredPlan)}
                              <span className="capitalize">{feature.requiredPlan}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            hasAccess ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {hasAccess ? 'Available' : 'Upgrade Required'}
                          </span>
                          {hasAccess && (
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    {features.find(f => f.id === activeFeature)?.icon && 
                      React.createElement(features.find(f => f.id === activeFeature).icon, {
                        className: `w-6 h-6 ${features.find(f => f.id === activeFeature).color}`
                      })
                    }
                    <h2 className="text-xl font-semibold text-gray-900">
                      {features.find(f => f.id === activeFeature)?.name}
                    </h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {renderFeatureComponent()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureDashboard;
