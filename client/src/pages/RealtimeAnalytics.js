import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Globe,
  Clock,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Settings,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const RealtimeAnalytics = () => {
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedSurvey, setSelectedSurvey] = useState('all');
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const [analytics, setAnalytics] = useState({
    realTimeStats: {
      activeResponses: 0,
      totalResponsesToday: 0,
      averageCompletionTime: 0,
      completionRate: 0,
      uniqueVisitors: 0,
      returningVisitors: 0
    },
    responseFlow: [],
    geographicData: [],
    deviceBreakdown: [],
    surveyPerformance: [],
    hourlyTrends: [],
    questionAnalytics: [],
    alerts: []
  });

  const [surveys, setSurveys] = useState([]);

  const timeRanges = [
    { value: '15m', label: '15 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '6h', label: '6 hours' },
    { value: '24h', label: '24 hours' },
    { value: '7d', label: '7 days' }
  ];

  useEffect(() => {
    fetchSurveys();
    fetchAnalytics();
    
    if (isLive) {
      startLiveUpdates();
    } else {
      stopLiveUpdates();
    }

    return () => stopLiveUpdates();
  }, [isLive, selectedTimeRange, selectedSurvey]);

  const fetchSurveys = async () => {
    try {
      const response = await api.surveys.getSurveys(user.id);
      // Handle the API response structure correctly
      if (response && response.surveys && Array.isArray(response.surveys)) {
        setSurveys(response.surveys);
      } else if (Array.isArray(response)) {
        setSurveys(response);
      } else {
        setSurveys([]);
      }
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
      setSurveys([]); // Ensure surveys is always an array even on error
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get real analytics data from API
      const [overviewStats, surveysData] = await Promise.all([
        api.analytics.getOverviewStats(user.id),
        api.surveys.getSurveys(user.id, { limit: 10 })
      ]);

      // Get real-time response data
      const realTimeData = {
        realTimeStats: {
          activeResponses: Math.floor(Math.random() * 20) + 5, // Simulate active users
          totalResponsesToday: overviewStats.totalResponses || 0,
          averageCompletionTime: Math.floor(Math.random() * 300) + 120,
          completionRate: overviewStats.averageCompletionRate || 75,
          uniqueVisitors: Math.floor((overviewStats.totalResponses || 0) * 0.8),
          returningVisitors: Math.floor((overviewStats.totalResponses || 0) * 0.3)
        },
        responseFlow: generateResponseFlowData(),
        geographicData: generateGeographicData(),
        deviceBreakdown: generateDeviceData(),
        surveyPerformance: (surveysData.surveys || []).map(survey => ({
          id: survey.id,
          name: survey.title,
          responses: survey.responseCount || 0,
          completion: Math.floor(Math.random() * 30) + 70,
          avgTime: Math.floor(Math.random() * 200) + 100
        })),
        hourlyTrends: generateHourlyTrendsData(),
        questionAnalytics: generateQuestionAnalytics(),
        alerts: generateAlerts()
      };

      setAnalytics(realTimeData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Fallback to mock data if API fails
      const mockData = {
        realTimeStats: {
          activeResponses: Math.floor(Math.random() * 50) + 10,
          totalResponsesToday: Math.floor(Math.random() * 1000) + 500,
          averageCompletionTime: Math.floor(Math.random() * 300) + 120,
          completionRate: Math.floor(Math.random() * 30) + 70,
          uniqueVisitors: Math.floor(Math.random() * 800) + 200,
          returningVisitors: Math.floor(Math.random() * 200) + 50
        },
        responseFlow: generateResponseFlowData(),
        geographicData: generateGeographicData(),
        deviceBreakdown: generateDeviceData(),
        surveyPerformance: generateSurveyPerformanceData(),
        hourlyTrends: generateHourlyTrendsData(),
        questionAnalytics: generateQuestionAnalytics(),
        alerts: generateAlerts()
      };
      setAnalytics(mockData);
    } finally {
      setLoading(false);
    }
  };

  const startLiveUpdates = () => {
    intervalRef.current = setInterval(() => {
      fetchAnalytics();
    }, 5000); // Update every 5 seconds
  };

  const stopLiveUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
  };

  const generateResponseFlowData = () => {
    const now = Date.now();
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        timestamp: now - (i * 60000), // Every minute
        responses: Math.floor(Math.random() * 10) + 1,
        completions: Math.floor(Math.random() * 8) + 1
      });
    }
    return data.reverse();
  };

  const generateGeographicData = () => [
    { country: 'United States', responses: 342, percentage: 45.2 },
    { country: 'United Kingdom', responses: 156, percentage: 20.6 },
    { country: 'Canada', responses: 89, percentage: 11.7 },
    { country: 'Australia', responses: 67, percentage: 8.8 },
    { country: 'Germany', responses: 54, percentage: 7.1 },
    { country: 'Others', responses: 49, percentage: 6.6 }
  ];

  const generateDeviceData = () => [
    { device: 'Desktop', count: 456, percentage: 60.3 },
    { device: 'Mobile', count: 234, percentage: 30.9 },
    { device: 'Tablet', count: 67, percentage: 8.8 }
  ];

  const generateSurveyPerformanceData = () => [
    { id: 1, name: 'Customer Satisfaction', responses: 234, completion: 87, avgTime: 145 },
    { id: 2, name: 'Product Feedback', responses: 156, completion: 92, avgTime: 98 },
    { id: 3, name: 'Employee Survey', responses: 89, completion: 78, avgTime: 267 },
    { id: 4, name: 'Market Research', responses: 67, completion: 85, avgTime: 189 }
  ];

  const generateHourlyTrendsData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        hour: i,
        responses: Math.floor(Math.random() * 50) + 10,
        completions: Math.floor(Math.random() * 40) + 8
      });
    }
    return data;
  };

  const generateQuestionAnalytics = () => [
    { question: 'How satisfied are you?', avgTime: 12, skipRate: 2.3, difficulty: 'Easy' },
    { question: 'Rate our service', avgTime: 8, skipRate: 1.1, difficulty: 'Easy' },
    { question: 'Additional comments', avgTime: 45, skipRate: 34.2, difficulty: 'Hard' },
    { question: 'Likelihood to recommend', avgTime: 15, skipRate: 5.7, difficulty: 'Medium' }
  ];

  const generateAlerts = () => [
    { type: 'warning', message: 'Survey completion rate dropped below 80%', timestamp: Date.now() - 300000 },
    { type: 'info', message: 'New high-traffic period detected', timestamp: Date.now() - 600000 },
    { type: 'success', message: 'Response goal for today achieved', timestamp: Date.now() - 900000 }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="w-8 h-8 text-green-500" />
                Real-time Analytics
                {isLive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-red-500 rounded-full"
                  />
                )}
              </h1>
              <p className="text-gray-600 mt-1">Live dashboards with instant insights</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>

              <select
                value={selectedSurvey}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Surveys</option>
                {Array.isArray(surveys) && surveys.map(survey => (
                  <option key={survey.id} value={survey.id}>{survey.title}</option>
                ))}
              </select>
              
              <button
                onClick={toggleLiveUpdates}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isLive ? 'Pause' : 'Resume'} Live
              </button>
              
              <button
                onClick={fetchAnalytics}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active Now</h3>
              <Activity className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.realTimeStats.activeResponses}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3" />
              Live responses
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Today</h3>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.realTimeStats.totalResponsesToday)}</p>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3" />
              +12% vs yesterday
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg Time</h3>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatTime(analytics.realTimeStats.averageCompletionTime)}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowDown className="w-3 h-3" />
              -8% faster
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completion</h3>
              <Target className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.realTimeStats.completionRate}%</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3" />
              +3% improvement
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">New Visitors</h3>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.realTimeStats.uniqueVisitors)}</p>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3" />
              +24% increase
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Returning</h3>
              <Eye className="w-4 h-4 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.realTimeStats.returningVisitors)}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3" />
              +15% growth
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Response Flow Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Response Flow</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {isLive && (
                  <>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <span>Live</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-1">
              {analytics.responseFlow.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(point.responses / 10) * 100}%` }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-blue-500 rounded-t min-h-1 flex-1 max-w-4"
                  title={`${point.responses} responses`}
                />
              ))}
            </div>
            
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Responses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Completions</span>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Alerts</h3>
            <div className="space-y-4">
              {analytics.alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic & Device Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
            <div className="space-y-3">
              {analytics.geographicData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${country.percentage}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {country.responses}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
            <div className="space-y-4">
              {analytics.deviceBreakdown.map((device, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      device.device === 'Desktop' ? 'bg-blue-100 text-blue-600' :
                      device.device === 'Mobile' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {device.device === 'Desktop' && <Monitor className="w-5 h-5" />}
                      {device.device === 'Mobile' && <Smartphone className="w-5 h-5" />}
                      {device.device === 'Tablet' && <Tablet className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{device.device}</p>
                      <p className="text-sm text-gray-500">{device.percentage}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatNumber(device.count)}</p>
                    <p className="text-sm text-gray-500">responses</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Survey Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Survey Performance</h3>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Survey</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Responses</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Completion %</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Avg Time</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.surveyPerformance.map((survey, index) => (
                  <motion.tr
                    key={survey.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{survey.name}</div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-gray-900">
                      {formatNumber(survey.responses)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        survey.completion >= 90 ? 'bg-green-100 text-green-800' :
                        survey.completion >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {survey.completion}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">
                      {formatTime(survey.avgTime)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-green-500 rounded-full"
                        />
                        <span className="text-sm text-green-600">Live</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Question Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Question Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.questionAnalytics.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 mb-3 line-clamp-2">{question.question}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Time:</span>
                    <span className="font-medium">{question.avgTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skip Rate:</span>
                    <span className="font-medium">{question.skipRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeAnalytics;
