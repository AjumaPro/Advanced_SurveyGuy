import React, { useState } from 'react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import UpgradePrompt from './UpgradePrompt';
import { Lock, Crown, Zap } from 'lucide-react';

const FeatureGate = ({ 
  feature, 
  children, 
  fallback = null, 
  showUpgradePrompt = true,
  inline = false,
  className = ""
}) => {
  const { hasFeature, getFeatureStatus, currentPlan } = useFeatureAccess();
  const [showModal, setShowModal] = useState(false);
  
  const featureStatus = getFeatureStatus(feature);
  const hasAccess = hasFeature(feature);

  // If user has access, render children normally
  if (hasAccess) {
    return children;
  }

  // If fallback is provided, render it instead of upgrade prompt
  if (fallback) {
    return fallback;
  }

  // If inline upgrade prompt requested
  if (inline && showUpgradePrompt) {
    return (
      <UpgradePrompt
        feature={feature}
        requiredPlan={featureStatus.requiredPlan}
        currentPlan={currentPlan}
        inline={true}
      />
    );
  }

  // Default: render locked feature with click to upgrade
  const handleUpgradeClick = () => {
    if (showUpgradePrompt) {
      setShowModal(true);
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'pro': return <Zap className="w-4 h-4" />;
      case 'enterprise': return <Crown className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'pro': return 'from-blue-500 to-purple-600';
      case 'enterprise': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Render children with overlay */}
        <div className="relative">
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center p-6">
              <div className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(featureStatus.requiredPlan)} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                {getPlanIcon(featureStatus.requiredPlan)}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                Premium Feature
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {featureStatus.upgradeMessage}
              </p>
              
              {showUpgradePrompt && (
                <button
                  onClick={handleUpgradeClick}
                  className={`bg-gradient-to-r ${getPlanColor(featureStatus.requiredPlan)} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
                >
                  Upgrade to {featureStatus.requiredPlan}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <UpgradePrompt
          feature={feature}
          requiredPlan={featureStatus.requiredPlan}
          currentPlan={currentPlan}
          onClose={() => setShowModal(false)}
          showModal={showModal}
        />
      )}
    </>
  );
};

export default FeatureGate;
