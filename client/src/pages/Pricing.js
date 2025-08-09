import React, { useState } from 'react';
import { Check, Star, Crown, Zap, Users, BarChart3, Shield, Globe } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        'Up to 3 surveys',
        '50 responses per survey',
        'Basic question types',
        'Email support',
        'Basic analytics',
        'Standard templates'
      ],
      limitations: [
        'No advanced question types',
        'No file uploads',
        'No custom branding',
        'No API access'
      ],
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      name: 'Pro',
      price: { monthly: 19, yearly: 190 },
      description: 'For growing businesses',
      features: [
        'Unlimited surveys',
        '1,000 responses per survey',
        'All question types',
        'File uploads',
        'Custom branding',
        'Advanced analytics',
        'Priority support',
        'Export to PDF/Excel',
        'QR code generation',
        'Survey templates'
      ],
      popular: false,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Business',
      price: { monthly: 49, yearly: 490 },
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Unlimited responses',
        'Team collaboration',
        'Advanced reporting',
        'API access',
        'White-label options',
        'Custom integrations',
        'Dedicated support',
        'Advanced security',
        'Multi-language support'
      ],
      popular: true,
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'Enterprise',
      price: { monthly: 199, yearly: 1990 },
      description: 'For large organizations',
      features: [
        'Everything in Business',
        'Unlimited everything',
        'Custom development',
        'On-premise deployment',
        'Advanced security',
        'SLA guarantee',
        'Dedicated account manager',
        'Custom training',
        'Advanced integrations',
        'Compliance features'
      ],
      popular: false,
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const getPrice = (plan) => {
    const price = plan.price[billingCycle];
    if (price === 0) return 'Free';
    return billingCycle === 'yearly' ? `$${price}/year` : `$${price}/month`;
  };

  const getSavings = (plan) => {
    if (plan.price.monthly === 0) return null;
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    const savings = monthlyTotal - yearlyPrice;
    return savings > 0 ? `Save $${savings}/year` : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free and scale as you grow
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="text-sm text-green-600 font-medium">Save up to 20%</span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-lg border-2 p-6 ${
                  plan.popular 
                    ? 'border-purple-300 bg-white shadow-lg scale-105' 
                    : `${plan.borderColor} ${plan.bgColor}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${plan.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${plan.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">{getPrice(plan)}</span>
                  </div>
                  {getSavings(plan) && (
                    <span className="text-sm text-green-600 font-medium">{getSavings(plan)}</span>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-gray-900">Features:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations && (
                    <>
                      <h4 className="font-medium text-gray-900 mt-6">Limitations:</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <div className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0">✕</div>
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : plan.name === 'Free'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Additional Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Custom Development</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Need custom features or integrations? Our development team can build exactly what you need.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Custom question types</li>
                <li>• API integrations</li>
                <li>• White-label solutions</li>
                <li>• Custom reporting</li>
              </ul>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">From $500</span>
                <span className="text-gray-600">/project</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Data Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get professional insights from your survey data with our advanced analytics services.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Statistical analysis</li>
                <li>• Custom reports</li>
                <li>• Data visualization</li>
                <li>• Trend analysis</li>
              </ul>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">From $200</span>
                <span className="text-gray-600">/report</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Globe className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Consulting</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Expert guidance on survey design, best practices, and optimization strategies.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Survey design review</li>
                <li>• Best practices training</li>
                <li>• Response rate optimization</li>
                <li>• Strategy consulting</li>
              </ul>
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">From $150</span>
                <span className="text-gray-600">/hour</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your billing cycle.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time from your account settings. No long-term contracts or cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 