import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  Calendar,
  Database,
  Zap,
  Crown,
  Shield,
  ArrowUpRight,
  RefreshCw,
  Target,
  Award
} from 'lucide-react';

const UsageTracker = ({ currentPlan, onUpgradeClick }) => {
  const { user } = useAuth();
  const [usage, setUsage] = useState({
    surveys: { current: 0, limit: 0, percentage: 0 },
    responses: { current: 0, limit: 0, percentage: 0 },
    events: { current: 0, limit: 0, percentage: 0 },
    storage: { current: 0, limit: 0, percentage: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('current_month');

  const planLimits = React.useMemo(() => ({
    free: {
      surveys: 5, // Upgraded from 3
      responses: 100, // Per survey
      events: 2, // Upgraded from 1
      storage: 2048, // 2 GB (upgraded from 1 GB)
      features: ['All Question Types', 'File Uploads', 'Basic Analytics', 'Email Support', 'PDF Export']
    },
    pro: {
      surveys: Infinity,
      responses: 10000, // Upgraded to 10,000 per survey
      events: Infinity,
      storage: 20480, // 20 GB (upgraded from 10 GB)
      features: ['Advanced Analytics', 'Team Collaboration', 'API Access', 'Custom Branding', 'White-label', 'Priority Support']
    },
    enterprise: {
      surveys: Infinity,
      responses: Infinity,
      events: Infinity,
      storage: Infinity,
      features: ['Real-time Analytics', '24/7 Support', 'Custom Development', 'SSO', 'Compliance', 'Dedicated Manager']
    }
  }), []);

  const fetchUsageData = React.useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate;

      switch (timeRange) {
        case 'current_month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last_30_days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'current_year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Fetch surveys count
      const { data: surveys } = await supabase
        .from('surveys')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Fetch responses count
      const { data: responses } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Fetch events count
      const { data: events } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Mock storage usage (in a real app, this would come from file storage)
      const storageUsed = Math.floor(Math.random() * 500) + 50; // MB

      const limits = planLimits[currentPlan] || planLimits.free;
      
      const newUsage = {
        surveys: {
          current: surveys?.length || 0,
          limit: limits.surveys,
          percentage: limits.surveys === Infinity ? 0 : Math.min(((surveys?.length || 0) / limits.surveys) * 100, 100)
        },
        responses: {
          current: responses?.length || 0,
          limit: limits.responses,
          percentage: limits.responses === Infinity ? 0 : Math.min(((responses?.length || 0) / limits.responses) * 100, 100)
        },
        events: {
          current: events?.length || 0,
          limit: limits.events,
          percentage: limits.events === Infinity ? 0 : Math.min(((events?.length || 0) / limits.events) * 100, 100)
        },
        storage: {
          current: storageUsed,
          limit: limits.storage,
          percentage: limits.storage === Infinity ? 0 : Math.min((storageUsed / limits.storage) * 100, 100)
        }
      };

      setUsage(newUsage);

    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, timeRange, currentPlan, planLimits]);

  useEffect(() => {
    if (user) {
      fetchUsageData();
    }
  }, [user, timeRange, fetchUsageData]);

  // Removed unused getUsageColor function

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatLimit = (limit, unit = '') => {
    if (limit === Infinity) return 'Unlimited';
    if (unit === 'MB' && limit >= 1024) {
      return `${(limit / 1024).toFixed(1)} GB`;
    }
    return `${limit.toLocaleString()}${unit}`;
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'free': return <Shield className="w-5 h-5" />;
      case 'pro': return <Zap className="w-5 h-5" />;
      case 'enterprise': return <Crown className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const usageItems = [
    {
      key: 'surveys',
      label: 'Surveys Created',
      icon: FileText,
      description: 'Active surveys in your account',
      unit: ''
    },
    {
      key: 'responses',
      label: 'Responses Collected',
      icon: Users,
      description: 'Total survey responses received',
      unit: ''
    },
    {
      key: 'events',
      label: 'Events Hosted',
      icon: Calendar,
      description: 'Events created and managed',
      unit: ''
    },
    {
      key: 'storage',
      label: 'Storage Used',
      icon: Database,
      description: 'Files, images, and data storage',
      unit: 'MB'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Usage Overview</h3>
              <p className="text-sm text-gray-600">Track your current plan usage</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="current_month">This Month</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="current_year">This Year</option>
            </select>
            
            <button
              onClick={fetchUsageData}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh usage data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Current Plan Badge */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {getPlanIcon(currentPlan)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 capitalize">{currentPlan} Plan</p>
              <p className="text-sm text-gray-600">
                {planLimits[currentPlan]?.features.length} features included
              </p>
            </div>
          </div>
          
          {currentPlan === 'free' && (
            <button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Now
            </button>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usageItems.map((item) => {
            const usageData = usage[item.key];
            const Icon = item.icon;
            const isNearLimit = usageData.percentage >= 80;
            const isOverLimit = usageData.percentage >= 100;

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isOverLimit 
                    ? 'border-red-200 bg-red-50' 
                    : isNearLimit 
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isOverLimit 
                        ? 'bg-red-100 text-red-600'
                        : isNearLimit 
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {isNearLimit && (
                    <div className={`p-1 rounded-full ${
                      isOverLimit ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {isOverLimit ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Target className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {usageData.current.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      of {formatLimit(usageData.limit, item.unit)}
                    </span>
                  </div>
                  
                  {usageData.limit !== Infinity && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(usageData.percentage)}`}
                          style={{ width: `${Math.min(usageData.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${
                          isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {usageData.percentage.toFixed(1)}% used
                        </span>
                        {isNearLimit && (
                          <span className={`${isOverLimit ? 'text-red-600' : 'text-yellow-600'}`}>
                            {isOverLimit ? 'Limit exceeded' : 'Near limit'}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  
                  {usageData.limit === Infinity && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Unlimited</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Upgrade Prompt */}
        {(currentPlan === 'free' && (usage.surveys.percentage > 80 || usage.responses.percentage > 80)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">You're approaching your limits!</h4>
                <p className="text-blue-100 text-sm mb-3">
                  Upgrade to Pro for unlimited surveys and 10,000+ responses per month.
                </p>
                <button
                  onClick={onUpgradeClick}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm flex items-center"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Plan Features */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-4 h-4 mr-2 text-blue-600" />
            Your Plan Features
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {planLimits[currentPlan]?.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UsageTracker;
