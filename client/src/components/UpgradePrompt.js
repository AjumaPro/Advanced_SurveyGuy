import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown,
  Zap,
  Star,
  ArrowRight,
  X,
  Shield,
  Users,
  BarChart3,
  Palette,
  Globe,
  Lock
} from 'lucide-react';

const UpgradePrompt = ({ 
  feature, 
  requiredPlan, 
  currentPlan, 
  onClose, 
  inline = false,
  showModal = true 
}) => {
  const navigate = useNavigate();

  const planDetails = {
    pro: {
      name: 'Pro',
      price: '$20.00/month',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-600',
      features: [
        'Unlimited surveys',
        '10,000 responses per survey',
        'Advanced analytics',
        'Custom branding',
        'Team collaboration',
        'API access',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: '$99.99/month',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      features: [
        'Everything in Pro',
        'Unlimited responses',
        'Advanced team collaboration',
        'SSO integration',
        'White label solution',
        'Custom development',
        '24/7 priority support'
      ]
    }
  };

  const plan = planDetails[requiredPlan];
  const currentPlanDetails = planDetails[currentPlan];

  const handleUpgrade = () => {
    navigate('/app/subscriptions');
    if (onClose) onClose();
  };

  const handleViewPlans = () => {
    navigate('/pricing');
    if (onClose) onClose();
  };

  // Inline version for small prompts
  if (inline) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Premium Feature</h4>
              <p className="text-sm text-gray-600">
                {feature} requires {plan?.name} plan
              </p>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  // Modal version for full upgrade prompts
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-lg w-full p-6 relative"
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 bg-gradient-to-r ${plan?.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
            {plan?.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade to {plan?.name}
          </h2>
          <p className="text-gray-600">
            Unlock <strong>{feature}</strong> and more premium features
          </p>
        </div>

        {/* Current vs Required Plan */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">Current Plan</span>
              </div>
              <span className="text-lg font-bold text-gray-900 capitalize">
                {currentPlan}
              </span>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {plan?.icon}
                <span className="font-medium text-gray-700">Required Plan</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {plan?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            What you'll get with {plan?.name}:
          </h3>
          <div className="space-y-2">
            {plan?.features.slice(0, 4).map((planFeature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-sm">{planFeature}</span>
              </div>
            ))}
            {plan?.features.length > 4 && (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 text-sm">
                  And {plan?.features.length - 4} more features...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {plan?.price}
            </div>
            <p className="text-gray-600 text-sm">
              Cancel anytime • 14-day free trial
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            className={`w-full bg-gradient-to-r ${plan?.color} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
          >
            Upgrade to {plan?.name}
          </button>
          
          <button
            onClick={handleViewPlans}
            className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Compare All Plans
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
            >
              Maybe later
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradePrompt;
