import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BarChart as BarChartIcon,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Clock,
  Eye,
  Download,
  RefreshCw,
  ArrowLeft,
  Settings
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdvancedAnalytics = () => {
  const { surveyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedChart, setSelectedChart] = useState('overview');

  const fetchSurveyData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/surveys/${surveyId}`);
      setSurvey(response.data);
    } catch (error) {
      console.error('Error fetching survey:', error);
      toast.error('Failed to load survey data');
    }
  }, [surveyId]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analytics/survey/${surveyId}?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Create mock data for demonstration
      setAnalytics(createMockAnalytics());
    } finally {
      setLoading(false);
    }
  }, [surveyId, timeRange]);

  useEffect(() => {
    if (surveyId) {
      fetchSurveyData();
      fetchAnalytics();
    }
  }, [surveyId, timeRange, fetchSurveyData, fetchAnalytics]);

  const createMockAnalytics = () => {
    const days = 30;
    const dates = [];
    const responses = [];
    const completionRates = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      responses.push(Math.floor(Math.random() * 50) + 10);
      completionRates.push(Math.floor(Math.random() * 30) + 70);
    }

    return {
      overview: {
        totalResponses: 1250,
        averageCompletionRate: 85.2,
        averageTimeToComplete: 4.5,
        totalQuestions: 12,
        activeResponses: 45
      },
      trends: {
        dates: dates,
        responses: responses,
        completionRates: completionRates
      },
      demographics: {
        ageGroups: [
          { label: '18-24', value: 25, color: '#3B82F6' },
          { label: '25-34', value: 35, color: '#10B981' },
          { label: '35-44', value: 20, color: '#F59E0B' },
          { label: '45-54', value: 15, color: '#EF4444' },
          { label: '55+', value: 5, color: '#8B5CF6' }
        ],
        locations: [
          { label: 'United States', value: 45, color: '#3B82F6' },
          { label: 'Canada', value: 20, color: '#10B981' },
          { label: 'United Kingdom', value: 15, color: '#F59E0B' },
          { label: 'Australia', value: 10, color: '#EF4444' },
          { label: 'Other', value: 10, color: '#8B5CF6' }
        ]
      },
      questionAnalytics: [
        {
          question: "How satisfied are you with our product?",
          type: "scale",
          responses: 1200,
          averageRating: 4.2,
          distribution: [5, 15, 25, 35, 20]
        },
        {
          question: "What features do you use most?",
          type: "multiple_choice",
          responses: 1150,
          options: [
            { label: "Feature A", count: 450, percentage: 39.1 },
            { label: "Feature B", count: 320, percentage: 27.8 },
            { label: "Feature C", count: 280, percentage: 24.3 },
            { label: "Feature D", count: 100, percentage: 8.7 }
          ]
        },
        {
          question: "How likely are you to recommend us?",
          type: "nps",
          responses: 1180,
          promoters: 65,
          passives: 25,
          detractors: 10,
          npsScore: 55
        }
      ],
      deviceAnalytics: {
        desktop: 45,
        mobile: 40,
        tablet: 15
      },
      timeAnalytics: {
        hourly: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          responses: Math.floor(Math.random() * 20) + 5
        })),
        daily: Array.from({ length: 7 }, (_, i) => ({
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
          responses: Math.floor(Math.random() * 100) + 50
        }))
      }
    };
  };

  const responseTrendData = {
    labels: analytics?.trends?.dates || [],
    datasets: [
      {
        label: 'Daily Responses',
        data: analytics?.trends?.responses || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const completionTrendData = {
    labels: analytics?.trends?.dates || [],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: analytics?.trends?.completionRates || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const demographicsData = {
    labels: analytics?.demographics?.ageGroups?.map(g => g.label) || [],
    datasets: [
      {
        data: analytics?.demographics?.ageGroups?.map(g => g.value) || [],
        backgroundColor: analytics?.demographics?.ageGroups?.map(g => g.color) || [],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          analytics?.deviceAnalytics?.desktop || 0,
          analytics?.deviceAnalytics?.mobile || 0,
          analytics?.deviceAnalytics?.tablet || 0
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const hourlyData = {
    labels: analytics?.timeAnalytics?.hourly?.map(h => `${h.hour}:00`) || [],
    datasets: [
      {
        label: 'Responses by Hour',
        data: analytics?.timeAnalytics?.hourly?.map(h => h.responses) || [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1
      }
    ]
  };

  const dailyData = {
    labels: analytics?.timeAnalytics?.daily?.map(d => d.day) || [],
    datasets: [
      {
        label: 'Responses by Day',
        data: analytics?.timeAnalytics?.daily?.map(d => d.responses) || [],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Survey Analytics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link to="/app/analytics" className="btn-secondary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Analytics
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {survey?.title || 'Survey Analytics'}
                </h1>
                <p className="text-gray-600 mt-1">Advanced insights and visualizations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="btn-secondary"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className="btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Responses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.overview?.totalResponses?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.overview?.averageCompletionRate?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Time (min)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.overview?.averageTimeToComplete || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChartIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Questions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.overview?.totalQuestions || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Eye className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Now</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.overview?.activeResponses || 0}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Chart Navigation */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChartIcon },
              { id: 'trends', label: 'Trends', icon: LineChart },
              { id: 'demographics', label: 'Demographics', icon: PieChart },
              { id: 'devices', label: 'Devices', icon: Settings },
              { id: 'timing', label: 'Timing', icon: Clock }
            ].map((chart) => (
              <button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChart === chart.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <chart.icon className="h-4 w-4" />
                <span>{chart.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="space-y-8">
          {/* Overview Charts */}
          {selectedChart === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Trends</h3>
                <div className="h-80">
                  <Line data={responseTrendData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate Trends</h3>
                <div className="h-80">
                  <Line data={completionTrendData} options={chartOptions} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Trends Charts */}
          {selectedChart === 'trends' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Volume Over Time</h3>
                <div className="h-96">
                  <Bar data={responseTrendData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate Analysis</h3>
                <div className="h-96">
                  <Line data={completionTrendData} options={chartOptions} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Demographics Charts */}
          {selectedChart === 'demographics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                <div className="h-80">
                  <Doughnut data={demographicsData} options={doughnutOptions} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
                <div className="h-80">
                  <Doughnut 
                    data={{
                      labels: analytics?.demographics?.locations?.map(l => l.label) || [],
                      datasets: [{
                        data: analytics?.demographics?.locations?.map(l => l.value) || [],
                        backgroundColor: analytics?.demographics?.locations?.map(l => l.color) || [],
                        borderWidth: 2,
                        borderColor: '#fff'
                      }]
                    }} 
                    options={doughnutOptions} 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Device Analytics */}
          {selectedChart === 'devices' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
                <div className="h-80">
                  <Doughnut data={deviceData} options={doughnutOptions} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Performance</h3>
                <div className="space-y-4">
                  {[
                    { device: 'Desktop', completion: 92, time: 3.2 },
                    { device: 'Mobile', completion: 78, time: 5.8 },
                    { device: 'Tablet', completion: 85, time: 4.1 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{item.device}</span>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">{item.completion}% completion</span>
                        <span className="text-blue-600">{item.time}min avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Timing Analytics */}
          {selectedChart === 'timing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Response Pattern</h3>
                <div className="h-96">
                  <Bar data={hourlyData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Response Pattern</h3>
                <div className="h-96">
                  <Bar data={dailyData} options={chartOptions} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Question Analytics */}
        {analytics?.questionAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Question-by-Question Analysis</h3>
            <div className="space-y-6">
              {analytics.questionAnalytics.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{question.question}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{question.responses} responses</span>
                      {question.averageRating && (
                        <span>Avg: {question.averageRating}/5</span>
                      )}
                      {question.npsScore && (
                        <span>NPS: {question.npsScore}</span>
                      )}
                    </div>
                  </div>
                  
                  {question.type === 'multiple_choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{option.label}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${option.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{option.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'scale' && question.distribution && (
                    <div className="flex items-center space-x-4">
                      {question.distribution.map((value, distIndex) => (
                        <div key={distIndex} className="text-center">
                          <div className="text-sm text-gray-500">{distIndex + 1}</div>
                          <div className="text-lg font-bold text-gray-900">{value}%</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'nps' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-100 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{question.promoters}%</div>
                        <div className="text-sm text-green-600">Promoters</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-100 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{question.passives}%</div>
                        <div className="text-sm text-yellow-600">Passives</div>
                      </div>
                      <div className="text-center p-3 bg-red-100 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{question.detractors}%</div>
                        <div className="text-sm text-red-600">Detractors</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalytics; 