import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Shield, Sparkles } from 'lucide-react';

const SuperAdminPlanSwitcher = ({ onPlanChange }) => {
  const { user, userProfile } = useAuth();
  const [switching, setSwitching] = useState(false);

  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';

  if (!isSuperAdmin) {
    return null;
  }

  const handleInstantSwitch = async (planType) => {
    try {
      setSwitching(true);
      toast.success(`Super admin: Switching to ${planType} plan instantly...`);
      
      const response = await api.admin.changePlan(user.id, planType, true);
      
      if (response.error) {
        toast.error(`Failed to change plan: ${response.error}`);
      } else {
        toast.success(`Successfully switched to ${planType} plan!`);
        if (onPlanChange) {
          onPlanChange(planType);
        }
        // Refresh page to update all components
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Plan switch error:', error);
      toast.error('Failed to switch plan');
    } finally {
      setSwitching(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <Star className="w-4 h-4" />,
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: <Crown className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 mb-6 text-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold">Super Admin Plan Control</h3>
            <p className="text-purple-100 text-sm">Instantly switch between any plan</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleInstantSwitch(plan.id)}
              disabled={switching || userProfile?.plan === plan.id}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                userProfile?.plan === plan.id
                  ? 'bg-white/30 backdrop-blur-sm'
                  : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
              }`}
            >
              {plan.icon}
              <span>{plan.name}</span>
              {userProfile?.plan === plan.id && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-lg p-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-sm text-purple-100">
            Current: <strong>{userProfile?.plan || 'Free'}</strong> • 
            Instant switching enabled • No payment required
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SuperAdminPlanSwitcher;
