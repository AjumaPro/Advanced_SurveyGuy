import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Activity,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const BillingAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    monthlySpend: [],
    planHistory: [],
    savingsData: [],
    paymentMethods: [],
    billingTrends: {},
    projections: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12_months'); // 3_months, 6_months, 12_months, all_time

  const fetchAnalyticsData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Fetch subscription history for analytics
      const { data: subscriptionData, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const data = subscriptionData || [];
      
      // Calculate analytics
      const totalSpent = data.reduce((sum, item) => sum + (item.price || 0), 0);
      
      // Monthly spend analysis
      const monthlySpend = calculateMonthlySpend(data);
      
      // Plan history analysis
      const planHistory = analyzePlanHistory(data);
      
      // Savings calculation
      const savingsData = calculateSavings(data);
      
      // Billing trends
      const billingTrends = analyzeBillingTrends(data);
      
      // Future projections
      const projections = calculateProjections(data);

      setAnalytics({
        totalSpent,
        monthlySpend,
        planHistory,
        savingsData,
        billingTrends,
        projections,
        paymentMethods: [
          { type: 'card', count: 1, percentage: 100 },
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange, fetchAnalyticsData]);

  const calculateMonthlySpend = (data) => {
    const monthlyData = {};
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += item.price || 0;
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount,
        date: month
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-12); // Last 12 months
  };

  const analyzePlanHistory = (data) => {
    const planCounts = {};
    const planSpending = {};
    
    data.forEach(item => {
      const planId = item.plan_id || 'unknown';
      planCounts[planId] = (planCounts[planId] || 0) + 1;
      planSpending[planId] = (planSpending[planId] || 0) + (item.price || 0);
    });

    return Object.entries(planCounts).map(([planId, count]) => ({
      planId,
      planName: planId.charAt(0).toUpperCase() + planId.slice(1),
      count,
      totalSpent: planSpending[planId] || 0,
      percentage: Math.round((count / data.length) * 100)
    }));
  };

  const calculateSavings = (data) => {
    // Mock savings calculation - in reality, this would compare with regular pricing
    const annualSavings = data
      .filter(item => item.billing_cycle === 'annually')
      .reduce((sum, item) => sum + (item.price * 0.17), 0); // 17% savings on annual plans

    return {
      totalSaved: annualSavings,
      potentialSavings: data
        .filter(item => item.billing_cycle === 'monthly')
        .reduce((sum, item) => sum + (item.price * 0.17), 0),
      savingsOpportunities: data.filter(item => item.billing_cycle === 'monthly').length
    };
  };

  const analyzeBillingTrends = (data) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = data.filter(item => {
      const date = new Date(item.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, item) => sum + (item.price || 0), 0);

    const lastMonth = data.filter(item => {
      const date = new Date(item.created_at);
      const lastMonthDate = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return date.getMonth() === lastMonthDate && date.getFullYear() === lastMonthYear;
    }).reduce((sum, item) => sum + (item.price || 0), 0);

    const trend = lastMonth === 0 ? 0 : ((thisMonth - lastMonth) / lastMonth) * 100;

    return {
      thisMonth,
      lastMonth,
      trend,
      averageMonthly: data.length > 0 ? data.reduce((sum, item) => sum + (item.price || 0), 0) / Math.max(1, data.length) : 0
    };
  };

  const calculateProjections = (data) => {
    if (data.length === 0) return { nextMonth: 0, nextQuarter: 0, nextYear: 0 };

    const averageMonthly = data.reduce((sum, item) => sum + (item.price || 0), 0) / Math.max(1, data.length);
    
    return {
      nextMonth: averageMonthly,
      nextQuarter: averageMonthly * 3,
      nextYear: averageMonthly * 12
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getChangeIcon = (trend) => {
    if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <ArrowUpRight className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing Analytics</h2>
          <p className="text-gray-600">Insights into your spending patterns and billing history</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="3_months">Last 3 Months</option>
            <option value="6_months">Last 6 Months</option>
            <option value="12_months">Last 12 Months</option>
            <option value="all_time">All Time</option>
          </select>
          
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.totalSpent)}
              </p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.billingTrends.thisMonth)}
              </p>
              <div className="flex items-center mt-1">
                {getChangeIcon(analytics.billingTrends.trend)}
                <span className={`text-sm ml-1 ${getChangeColor(analytics.billingTrends.trend)}`}>
                  {Math.abs(analytics.billingTrends.trend).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.savingsData.totalSaved)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Annual discounts</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Monthly</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.billingTrends.averageMonthly)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Historical average</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Spending Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Spending</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            {analytics.monthlySpend.slice(-6).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((item.amount / Math.max(...analytics.monthlySpend.map(m => m.amount))) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Plan Usage</h3>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          
          <div className="space-y-4">
            {analytics.planHistory.map((plan, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    plan.planId === 'free' ? 'bg-gray-400' :
                    plan.planId === 'pro' ? 'bg-blue-500' :
                    plan.planId === 'enterprise' ? 'bg-purple-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm text-gray-900 font-medium">{plan.planName}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(plan.totalSpent)}
                  </p>
                  <p className="text-xs text-gray-500">{plan.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Savings Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Savings Opportunities</h3>
          </div>
          
          <div className="space-y-4">
            {analytics.savingsData.potentialSavings > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Switch to Annual Billing
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Save up to {formatCurrency(analytics.savingsData.potentialSavings)} per year by switching to annual billing
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Optimize Your Plan
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Review your usage to ensure you're on the most cost-effective plan
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Team Discounts
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    Consider team plans for additional savings on multiple users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm p-6 border"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Spending Projections</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Next Month</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(analytics.projections.nextMonth)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Next Quarter</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(analytics.projections.nextQuarter)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Next Year</span>
              </div>
              <span className="text-sm font-semibold text-blue-900">
                {formatCurrency(analytics.projections.nextYear)}
              </span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  Budget Planning
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Projections based on historical data. Actual costs may vary based on plan changes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingAnalytics;
