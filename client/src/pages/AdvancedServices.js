import React from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  Code,
  Database,
  Cloud,
  Smartphone,
  Monitor
} from 'lucide-react';

const AdvancedServices = () => {
  const services = [
    {
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms to analyze survey responses and provide actionable insights.',
      features: [
        'Sentiment analysis',
        'Trend prediction',
        'Response clustering',
        'Automated insights',
        'Custom ML models'
      ],
      price: 'From $99/month',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with advanced encryption, compliance, and audit trails.',
      features: [
        'SOC 2 Type II compliance',
        'End-to-end encryption',
        'Advanced access controls',
        'Audit logging',
        'Data residency options'
      ],
      price: 'From $299/month',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'White-Label Solutions',
      description: 'Custom branded survey platform for agencies and enterprises.',
      features: [
        'Custom domain',
        'Branded interface',
        'Custom CSS/JS',
        'API access',
        'Multi-tenant support'
      ],
      price: 'From $499/month',
      icon: Code,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Advanced Integrations',
      description: 'Connect with your existing tools and workflows seamlessly.',
      features: [
        'CRM integrations',
        'Marketing automation',
        'Analytics platforms',
        'Custom webhooks',
        'API documentation'
      ],
      price: 'From $79/month',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Team Collaboration',
      description: 'Advanced team features for organizations and agencies.',
      features: [
        'Role-based permissions',
        'Team workspaces',
        'Real-time collaboration',
        'Approval workflows',
        'Activity tracking'
      ],
      price: 'From $149/month',
      icon: Cloud,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Custom Development',
      description: 'Bespoke development services for unique requirements.',
      features: [
        'Custom question types',
        'Specialized integrations',
        'Custom reporting',
        'Mobile apps',
        'On-premise deployment'
      ],
      price: 'From $500/project',
      icon: Smartphone,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const revenueStreams = [
    {
      title: 'Subscription Tiers',
      description: 'Freemium model with premium features',
      revenue: '$50K - $200K/month',
      difficulty: 'Medium',
      icon: Sparkles,
      color: 'text-green-600'
    },
    {
      title: 'Enterprise Sales',
      description: 'Custom solutions for large organizations',
      revenue: '$100K - $500K/month',
      difficulty: 'High',
      icon: Monitor,
      color: 'text-blue-600'
    },
    {
      title: 'Agency Partnerships',
      description: 'White-label solutions for agencies',
      revenue: '$25K - $100K/month',
      difficulty: 'Medium',
      icon: Cloud,
      color: 'text-purple-600'
    },
    {
      title: 'Consulting Services',
      description: 'Expert guidance and implementation',
      revenue: '$10K - $50K/month',
      difficulty: 'Low',
      icon: Sparkles,
      color: 'text-orange-600'
    },
    {
      title: 'Data Analytics',
      description: 'Advanced analytics and insights',
      revenue: '$20K - $80K/month',
      difficulty: 'Medium',
      icon: Database,
      color: 'text-red-600'
    },
    {
      title: 'Custom Development',
      description: 'Bespoke development services',
      revenue: '$30K - $150K/month',
      difficulty: 'High',
      icon: Code,
      color: 'text-indigo-600'
    }
  ];

  const marketingStrategies = [
    {
      title: 'Content Marketing',
      description: 'Create valuable content to attract and educate potential customers',
      tactics: [
        'Blog posts about survey best practices',
        'Case studies and success stories',
        'Webinars and online courses',
        'Free templates and resources',
        'SEO optimization'
      ],
      budget: '$5K - $20K/month',
      roi: '300-500%'
    },
    {
      title: 'Digital Advertising',
      description: 'Targeted ads on Google, LinkedIn, and social media',
      tactics: [
        'Google Ads for survey-related keywords',
        'LinkedIn ads for B2B audience',
        'Facebook/Instagram for small businesses',
        'Retargeting campaigns',
        'Influencer partnerships'
      ],
      budget: '$10K - $50K/month',
      roi: '200-400%'
    },
    {
      title: 'Partnership Marketing',
      description: 'Strategic partnerships with complementary businesses',
      tactics: [
        'Agency partnerships',
        'Software integrations',
        'Referral programs',
        'Co-marketing campaigns',
        'Channel partnerships'
      ],
      budget: '$5K - $25K/month',
      roi: '400-800%'
    },
    {
      title: 'Direct Sales',
      description: 'Direct outreach to enterprise prospects',
      tactics: [
        'Cold email campaigns',
        'LinkedIn outreach',
        'Trade shows and events',
        'Demo calls and presentations',
        'Account-based marketing'
      ],
      budget: '$15K - $75K/month',
      roi: '150-300%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Services & Revenue Opportunities
          </h1>
          <p className="text-xl text-gray-600">
            Discover how to scale your survey platform into a profitable business
          </p>
        </div>

        {/* Advanced Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Premium Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${service.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-lg font-semibold text-gray-900">{service.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Revenue Streams & Projections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {revenueStreams.map((stream, index) => {
              const Icon = stream.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <Icon className={`h-8 w-8 ${stream.color} mr-3`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{stream.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        stream.difficulty === 'High' ? 'bg-red-100 text-red-800' :
                        stream.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {stream.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{stream.description}</p>
                  <div className="text-lg font-semibold text-gray-900">{stream.revenue}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marketing Strategies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Marketing & Growth Strategies
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {marketingStrategies.map((strategy, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{strategy.title}</h3>
                <p className="text-gray-600 mb-4">{strategy.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Tactics:</h4>
                  <ul className="space-y-2">
                    {strategy.tactics.map((tactic, tacticIndex) => (
                      <li key={tacticIndex} className="flex items-start text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                        {tactic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Budget:</span>
                    <div className="font-semibold text-gray-900">{strategy.budget}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Expected ROI:</span>
                    <div className="font-semibold text-green-600">{strategy.roi}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Model Canvas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Business Model Overview
          </h2>
          
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Value Propositions</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Easy-to-use survey builder</li>
                  <li>• Advanced question types</li>
                  <li>• Real-time analytics</li>
                  <li>• Professional templates</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Segments</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Small businesses</li>
                  <li>• Marketing agencies</li>
                  <li>• HR departments</li>
                  <li>• Research firms</li>
                  <li>• Educational institutions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Revenue Streams</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Subscription plans</li>
                  <li>• Enterprise licensing</li>
                  <li>• Consulting services</li>
                  <li>• Custom development</li>
                  <li>• Data analytics</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Activities</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Platform development</li>
                  <li>• Customer support</li>
                  <li>• Sales and marketing</li>
                  <li>• Partnerships</li>
                  <li>• Product innovation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Projections */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            5-Year Financial Projections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { year: 'Year 1', revenue: '$120K', users: '1,000', mrr: '$10K' },
              { year: 'Year 2', revenue: '$480K', users: '4,000', mrr: '$40K' },
              { year: 'Year 3', revenue: '$1.2M', users: '10,000', mrr: '$100K' },
              { year: 'Year 4', revenue: '$2.4M', users: '20,000', mrr: '$200K' },
              { year: 'Year 5', revenue: '$4.8M', users: '40,000', mrr: '$400K' }
            ].map((projection, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{projection.year}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{projection.revenue}</div>
                    <div className="text-sm text-gray-600">Annual Revenue</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-gray-900">{projection.users}</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{projection.mrr}</div>
                    <div className="text-sm text-gray-600">Monthly Recurring</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Implementation Roadmap
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                phase: 'Phase 1 (Months 1-3)',
                title: 'Foundation',
                tasks: [
                  'Launch MVP with core features',
                  'Implement basic pricing tiers',
                  'Set up payment processing',
                  'Create marketing website',
                  'Start content marketing'
                ]
              },
              {
                phase: 'Phase 2 (Months 4-6)',
                title: 'Growth',
                tasks: [
                  'Add advanced question types',
                  'Implement analytics dashboard',
                  'Launch referral program',
                  'Start digital advertising',
                  'Build customer support team'
                ]
              },
              {
                phase: 'Phase 3 (Months 7-12)',
                title: 'Scale',
                tasks: [
                  'Launch enterprise features',
                  'Develop API and integrations',
                  'Partner with agencies',
                  'Expand to new markets',
                  'Hire sales team'
                ]
              },
              {
                phase: 'Phase 4 (Year 2+)',
                title: 'Optimize',
                tasks: [
                  'AI-powered features',
                  'Advanced security',
                  'White-label solutions',
                  'International expansion',
                  'Acquisition opportunities'
                ]
              }
            ].map((phase, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-sm text-blue-600 font-medium mb-2">{phase.phase}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedServices; 