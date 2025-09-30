import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Target,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

const EventAnalyticsDashboard = ({ eventId = null }) => {
  const [analyticsData, setAnalyticsData] = useState({
    registrationTrends: [],
    demographicBreakdown: {},
    revenueAnalytics: {},
    attendanceMetrics: {},
    performanceKPIs: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('registrations');

  useEffect(() => {
    fetchAnalytics();
  }, [eventId, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data - replace with actual API call
      const mockData = {
        registrationTrends: [
          { date: '2024-01-01', registrations: 25, revenue: 2500 },
          { date: '2024-01-02', registrations: 45, revenue: 4500 },
          { date: '2024-01-03', registrations: 35, revenue: 3500 },
          { date: '2024-01-04', registrations: 65, revenue: 6500 },
          { date: '2024-01-05', registrations: 80, revenue: 8000 }
        ],
        demographicBreakdown: {
          ageGroups: {
            '18-25': 20,
            '26-35': 35,
            '36-45': 25,
            '46-55': 15,
            '55+': 5
          },
          locations: {
            'San Francisco': 40,
            'New York': 25,
            'Los Angeles': 20,
            'Chicago': 10,
            'Other': 5
          },
          industries: {
            'Technology': 45,
            'Healthcare': 20,
            'Finance': 15,
            'Education': 10,
            'Other': 10
          }
        },
        revenueAnalytics: {
          totalRevenue: 125000,
          averageTicketPrice: 250,
          refundRate: 2.5,
          conversionRate: 15.8,
          revenueBySource: {
            'Direct': 60000,
            'Social Media': 35000,
            'Email': 20000,
            'Referrals': 10000
          }
        },
        attendanceMetrics: {
          registrationRate: 85,
          showUpRate: 78,
          engagementScore: 4.2,
          satisfactionScore: 4.5,
          netPromoterScore: 68
        },
        performanceKPIs: {
          costPerAcquisition: 25,
          lifetimeValue: 450,
          retentionRate: 35,
          socialShareRate: 12,
          emailOpenRate: 45
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{change >= 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </motion.div>
  );

  const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${analyticsData.revenueAnalytics.totalRevenue?.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Total Registrations"
          value={analyticsData.registrationTrends?.reduce((sum, item) => sum + item.registrations, 0)}
          change={8.3}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Attendance Rate"
          value={`${analyticsData.attendanceMetrics.showUpRate}%`}
          change={-2.1}
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Satisfaction Score"
          value={`${analyticsData.attendanceMetrics.satisfactionScore}/5.0`}
          change={5.2}
          icon={BarChart3}
          color="indigo"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trends Chart */}
        <ChartContainer title="Registration Trends">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Integration with Chart.js or similar</p>
            </div>
          </div>
        </ChartContainer>

        {/* Revenue Breakdown */}
        <ChartContainer title="Revenue by Source">
          <div className="space-y-3">
            {Object.entries(analyticsData.revenueAnalytics.revenueBySource || {}).map(([source, amount]) => {
              const percentage = (amount / analyticsData.revenueAnalytics.totalRevenue) * 100;
              return (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{source}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartContainer>
      </div>

      {/* Demographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer title="Age Distribution">
          <div className="space-y-2">
            {Object.entries(analyticsData.demographicBreakdown.ageGroups || {}).map(([age, count]) => (
              <div key={age} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{age}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(count / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}%</span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Top Locations">
          <div className="space-y-2">
            {Object.entries(analyticsData.demographicBreakdown.locations || {}).map(([location, count]) => (
              <div key={location} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{location}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(count / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}%</span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Industry Breakdown">
          <div className="space-y-2">
            {Object.entries(analyticsData.demographicBreakdown.industries || {}).map(([industry, count]) => (
              <div key={industry} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{industry}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${(count / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}%</span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${analyticsData.performanceKPIs.costPerAcquisition}</div>
            <div className="text-sm text-gray-600">Cost per Acquisition</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${analyticsData.performanceKPIs.lifetimeValue}</div>
            <div className="text-sm text-gray-600">Customer LTV</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{analyticsData.performanceKPIs.retentionRate}%</div>
            <div className="text-sm text-gray-600">Retention Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{analyticsData.attendanceMetrics.netPromoterScore}</div>
            <div className="text-sm text-gray-600">Net Promoter Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{analyticsData.performanceKPIs.emailOpenRate}%</div>
            <div className="text-sm text-gray-600">Email Open Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalyticsDashboard;
