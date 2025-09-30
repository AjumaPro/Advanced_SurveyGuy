import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  BarChart3,
  Download
} from 'lucide-react';

const PackageAnalytics = ({ packages, onClose }) => {
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalSubscribers: 0,
    popularPackage: null,
    revenueByPackage: [],
    subscribersByPackage: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // Mock analytics data - in a real app, this would come from your analytics system
      const mockAnalytics = {
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        totalSubscribers: Math.floor(Math.random() * 1000) + 100,
        popularPackage: packages[Math.floor(Math.random() * packages.length)],
        revenueByPackage: packages.map(pkg => ({
          name: pkg.name,
          revenue: Math.floor(Math.random() * 10000) + 1000,
          subscribers: Math.floor(Math.random() * 100) + 10
        })),
        subscribersByPackage: packages.map(pkg => ({
          name: pkg.name,
          count: Math.floor(Math.random() * 200) + 50,
          growth: (Math.random() - 0.5) * 20
        })),
        recentActivity: [
          { action: 'New subscription', package: 'Pro Plan', user: 'john@example.com', date: '2 hours ago' },
          { action: 'Upgrade', package: 'Enterprise', user: 'sarah@company.com', date: '4 hours ago' },
          { action: 'Cancellation', package: 'Basic Plan', user: 'mike@startup.io', date: '1 day ago' },
          { action: 'New subscription', package: 'Pro Plan', user: 'lisa@agency.com', date: '1 day ago' }
        ]
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [packages]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const exportData = () => {
    const csvContent = `Package,Revenue,Subscribers,Growth
${analytics.revenueByPackage.map(item => 
  `${item.name},${item.revenue},${item.subscribers},${analytics.subscribersByPackage.find(s => s.name === item.name)?.growth || 0}%`
).join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package-analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Package Analytics</h2>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button
              onClick={exportData}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-20 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 opacity-80" />
                    <span className="text-sm opacity-80">Total Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">
                    ${analytics.totalRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 opacity-80" />
                    <span className="text-sm opacity-80">Subscribers</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {analytics.totalSubscribers.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 opacity-80" />
                    <span className="text-sm opacity-80">Active Packages</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {packages.filter(p => p.status === 'active').length}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 opacity-80" />
                    <span className="text-sm opacity-80">Popular Package</span>
                  </div>
                  <div className="text-lg font-bold">
                    {analytics.popularPackage?.name || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Revenue by Package */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Package</h3>
                <div className="space-y-3">
                  {analytics.revenueByPackage.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-sm text-gray-600">${item.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(item.revenue / Math.max(...analytics.revenueByPackage.map(r => r.revenue))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscriber Growth */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscribers by Package</h3>
                  <div className="space-y-3">
                    {analytics.subscribersByPackage.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{item.count}</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            item.growth >= 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.growth >= 0 ? '+' : ''}{item.growth.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.action === 'New subscription' ? 'bg-green-400' :
                          activity.action === 'Upgrade' ? 'bg-blue-400' :
                          'bg-red-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.action}</span> - {activity.package}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.user} • {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageAnalytics;
