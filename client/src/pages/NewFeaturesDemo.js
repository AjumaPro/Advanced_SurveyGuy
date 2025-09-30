import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GitBranch,
  CreditCard,
  Users,
  Zap,
  Smartphone,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const NewFeaturesDemo = () => {
  // const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'ai-generator',
      name: 'AI Question Generator',
      description: 'Generate intelligent questions from natural language prompts',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      route: '/app/ai-generator',
      status: 'New'
    },
    {
      id: 'ai-insights',
      name: 'AI Insights',
      description: 'Automated response analysis and sentiment detection',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      route: '/app/ai-insights',
      status: 'New'
    },
    {
      id: 'conditional-logic',
      name: 'Conditional Logic',
      description: 'Visual drag-and-drop logic builder for smart surveys',
      icon: <GitBranch className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      route: '/app/forms/logic',
      status: 'Enhanced'
    },
    {
      id: 'form-builder',
      name: 'Enhanced Form Builder',
      description: 'Advanced form creation with payment integration',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      route: '/app/forms/builder',
      status: 'New'
    },
    {
      id: 'mobile-builder',
      name: 'Mobile Survey Builder',
      description: 'Touch-optimized interface for mobile devices',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      route: '/app/mobile-builder',
      status: 'New'
    },
    {
      id: 'integrations',
      name: 'Integration Hub',
      description: 'Connect with 200+ apps and services',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      route: '/app/integrations',
      status: 'New'
    },
    {
      id: 'payments',
      name: 'Payment Integration',
      description: 'Accept payments with Stripe integration',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      route: '/app/payments',
      status: 'New'
    },
    {
      id: 'collaboration',
      name: 'Real-time Collaboration',
      description: 'Work together with your team in real-time',
      icon: <Users className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-500',
      route: '/app/collaboration',
      status: 'New'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">New Features Demo</h1>
                <p className="text-slate-600 mt-2">
                  Explore the latest AI-powered and advanced features
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🚀 New Features</h2>
          <p className="text-slate-600">
            Advanced SurveyGuy now includes cutting-edge AI features and advanced capabilities 
            that make it competitive with and superior to SurveyMonkey and Jotform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              // onClick={() => setActiveFeature(feature.id)}
            >
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    feature.status === 'New' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {feature.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.name}
                </h3>
                
                <p className="text-slate-600 mb-4">
                  {feature.description}
                </p>
                
                <Link
                  to={feature.route}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-1 transition-transform"
                >
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Competitive Advantages */}
        <div className="mt-12 bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🏆 Competitive Advantages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">vs SurveyMonkey</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">AI-powered question generation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Visual conditional logic builder</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Real-time team collaboration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Event management integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Offline PWA support</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">vs Jotform</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Advanced AI insights and analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Professional survey templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Mobile-first design approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Comprehensive integration ecosystem</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Enterprise-grade collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Access</h3>
          <div className="flex flex-wrap gap-3">
            {features.slice(0, 4).map((feature) => (
              <Link
                key={feature.id}
                to={feature.route}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {feature.icon}
                <span className="text-sm font-medium">{feature.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFeaturesDemo;
