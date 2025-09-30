import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  FileText,
  Settings,
  Shield,
  Zap,
  Crown,
  Star,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const SubscriptionManager = ({ currentPlan, onPlanChange }) => {
  const { user, userProfile } = useAuth();
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState({
    billing: true,
    usage: true,
    features: false
  });

  const fetchSubscriptionData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Fetch subscription history from subscription_history table
      const { data: history, error: historyError } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!historyError) {
        setBillingHistory(history || []);
      }

      // Mock subscription details (would come from payment processor)
      setSubscriptionDetails({
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        status: 'active',
        current_period_start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        cancel_at_period_end: false,
        created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      });

      // Mock payment methods
      setPaymentMethods([
        {
          id: 'pm_1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          },
          is_default: true
        }
      ]);

    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user, fetchSubscriptionData]);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call your payment processor's API
      toast.success('Subscription cancelled. You will retain access until the end of your billing period.');
      
      // Create notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'subscription_cancelled',
        title: 'Subscription Cancelled',
        message: 'Your subscription has been cancelled and will end on ' + 
                new Date(subscriptionDetails.current_period_end).toLocaleDateString(),
        link: '/app/subscriptions'
      });

      // Update local state
      setSubscriptionDetails(prev => ({
        ...prev,
        cancel_at_period_end: true
      }));

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    try {
      // In a real app, this would call your payment processor's API
      toast.success('Subscription reactivated successfully!');
      
      setSubscriptionDetails(prev => ({
        ...prev,
        cancel_at_period_end: false
      }));

    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      // In a real app, this would generate and download the invoice
      toast.success('Invoice download started');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      // Update notification preferences
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...newSettings
        });

      if (error) throw error;

      setNotifications(newSettings);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification preferences');
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'free': return <Star className="w-5 h-5" />;
      case 'pro': return <Zap className="w-5 h-5" />;
      case 'enterprise': return <Crown className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'free': return 'text-gray-600 bg-gray-100';
      case 'pro': return 'text-blue-600 bg-blue-100';
      case 'enterprise': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'billing', label: 'Billing History', icon: FileText },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Current Subscription */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${getPlanColor(currentPlan)}`}>
                  {getPlanIcon(currentPlan)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 capitalize">{currentPlan} Plan</h4>
                  <p className="text-gray-600">
                    {subscriptionDetails?.status === 'active' ? 'Active' : 'Inactive'} • 
                    {subscriptionDetails?.cancel_at_period_end ? ' Cancelling at period end' : ' Auto-renewing'}
                  </p>
                </div>
              </div>
              
              {currentPlan !== 'free' && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${currentPlan === 'pro' ? '29' : '99'}
                  </p>
                  <p className="text-gray-600">per month</p>
                </div>
              )}
            </div>

            {subscriptionDetails && currentPlan !== 'free' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Current Period</p>
                    <p className="font-medium">
                      {new Date(subscriptionDetails.current_period_start).toLocaleDateString()} - {' '}
                      {new Date(subscriptionDetails.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Billing Date</p>
                    <p className="font-medium">
                      {subscriptionDetails.cancel_at_period_end 
                        ? 'Subscription ends' 
                        : 'Renews on'
                      } {new Date(subscriptionDetails.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  {subscriptionDetails.cancel_at_period_end ? (
                    <button
                      onClick={handleReactivateSubscription}
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Reactivate Subscription
                    </button>
                  ) : (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={loading}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </button>
                  )}
                  
                  <button
                    onClick={() => setActiveTab('payment')}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Payment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${billingHistory.reduce((sum, item) => sum + (item.price || 0), 0)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Member Since</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {subscriptionDetails ? 
                      new Date(subscriptionDetails.created).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      }) : 
                      new Date(userProfile?.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{billingHistory.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'billing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
              <button
                onClick={fetchSubscriptionData}
                disabled={loading}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {billingHistory.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {billingHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-1 rounded ${getPlanColor(item.plan_id)}`}>
                            {getPlanIcon(item.plan_id)}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {item.plan_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.price * 100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => downloadInvoice(item.id)}
                          className="text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No billing history available</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'payment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Payment Method
              </button>
            </div>

            {paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          •••• •••• •••• {method.card.last4}
                        </p>
                        <p className="text-sm text-gray-600">
                          {method.card.brand.toUpperCase()} • Expires {method.card.exp_month}/{method.card.exp_year}
                        </p>
                      </div>
                      {method.is_default && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No payment methods added</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Add Your First Payment Method
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Billing Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications about payments and billing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.billing}
                    onChange={(e) => updateNotificationSettings({
                      ...notifications,
                      billing: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Usage Alerts</p>
                  <p className="text-sm text-gray-600">Get notified when approaching plan limits</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.usage}
                    onChange={(e) => updateNotificationSettings({
                      ...notifications,
                      usage: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Feature Updates</p>
                  <p className="text-sm text-gray-600">Stay updated on new features and improvements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.features}
                    onChange={(e) => updateNotificationSettings({
                      ...notifications,
                      features: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Actions</h3>
            
            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Export Account Data</p>
                  <p className="text-sm text-gray-600">Download all your survey data and responses</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 flex items-center justify-between text-red-600">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionManager;
