import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import UpgradePrompt from './UpgradePrompt';
import { motion } from 'framer-motion';
import {
  Lock,
  Crown,
  Zap,
  Star,
  Shield,
  ArrowLeft
} from 'lucide-react';

const PlanProtectedRoute = ({ 
  children, 
  requiredPlan = 'pro', 
  feature = 'premium feature',
  showUpgradePrompt = true 
}) => {
  const { user, userProfile } = useAuth();
  const { currentPlan, hasFeature, getFeatureStatus } = useFeatureAccess();
  
  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';
  
  // Super admin can access everything
  if (isSuperAdmin) {
    return children;
  }

  // Check if user has required plan
  const hasRequiredPlan = () => {
    switch (requiredPlan) {
      case 'free':
        return true; // Everyone can access free features
      case 'pro':
        return currentPlan === 'pro' || currentPlan === 'enterprise';
      case 'enterprise':
        return currentPlan === 'enterprise';
      default:
        return false;
    }
  };

  // If user has access, render the component
  if (hasRequiredPlan()) {
    return children;
  }

  // If showing upgrade prompt, show modal
  if (showUpgradePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <UpgradePrompt
            feature={feature}
            requiredPlan={requiredPlan}
            currentPlan={currentPlan}
            showModal={true}
            onClose={null} // No close button for route protection
          />
        </motion.div>
      </div>
    );
  }

  // Default: Show access denied
  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'enterprise': return <Crown className="w-8 h-8 text-purple-600" />;
      case 'pro': return <Zap className="w-8 h-8 text-blue-600" />;
      default: return <Star className="w-8 h-8 text-gray-600" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'enterprise': return 'from-purple-500 to-pink-600';
      case 'pro': return 'from-blue-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        {/* Lock Icon */}
        <div className={`w-20 h-20 bg-gradient-to-r ${getPlanColor(requiredPlan)} rounded-full flex items-center justify-center mx-auto mb-6 text-white`}>
          <Lock className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {requiredPlan === 'pro' ? 'Pro' : 'Enterprise'} Feature
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          This feature requires a {requiredPlan} plan. Upgrade your account to access {feature} and unlock more powerful capabilities.
        </p>

        {/* Current Plan */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Current Plan:</span>
              <span className="font-bold text-gray-900 capitalize">{currentPlan}</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center space-x-2">
              {getPlanIcon(requiredPlan)}
              <span className="font-bold text-gray-900 capitalize">{requiredPlan} Required</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/app/subscriptions'}
            className={`w-full bg-gradient-to-r ${getPlanColor(requiredPlan)} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
          >
            Upgrade to {requiredPlan}
          </button>
          
          <button
            onClick={() => window.location.href = '/pricing'}
            className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Compare All Plans
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanProtectedRoute;
