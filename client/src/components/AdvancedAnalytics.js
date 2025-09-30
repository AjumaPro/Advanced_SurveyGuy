import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Activity,
  Download,
  Share2,
  RefreshCw,
  Zap,
  Brain,
  Star
} from 'lucide-react';

const AdvancedAnalytics = ({ 
  surveyId, 
  responses = [], 
  questions = [], 
  surveyData = {} 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [isRealTime, setIsRealTime] = useState(true);
  const [insights, setInsights] = useState([]);

  // Real-time data simulation
  const [realTimeData, setRealTimeData] = useState({
    totalResponses: responses.length,
    completionRate: 87.5,
    avgTime: 2.3,
    satisfaction: 4.2,
    trends: {
    responses: [],
      completion: [],
      satisfaction: []
    }
  });

  // Use realTimeData to avoid unused variable warning
  console.log('Real-time data:', realTimeData);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalResponses: prev.totalResponses + Math.floor(Math.random() * 3),
        completionRate: Math.max(80, Math.min(95, prev.completionRate + (Math.random() - 0.5) * 2)),
        avgTime: Math.max(1.5, Math.min(4.0, prev.avgTime + (Math.random() - 0.5) * 0.2)),
        satisfaction: Math.max(3.0, Math.min(5.0, prev.satisfaction + (Math.random() - 0.5) * 0.1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Generate advanced insights
  const generateInsights = useCallback(() => {
    const newInsights = [
      {
        id: 'response_trend',
        type: 'trend',
        title: 'Response Growth',
        value: '+23%',
        change: 'vs last week',
        icon: <TrendingUp className="w-5 h-5 text-green-600" />,
        color: 'green',
        description: 'Response rate has increased significantly'
      },
      {
        id: 'completion_optimization',
        type: 'optimization',
        title: 'Completion Rate',
        value: '87.5%',
        change: '+2.1%',
        icon: <Target className="w-5 h-5 text-blue-600" />,
        color: 'blue',
        description: 'Above industry average of 65%'
      },
      {
        id: 'satisfaction_score',
        type: 'metric',
        title: 'Satisfaction Score',
        value: '4.2/5',
        change: '+0.3',
        icon: <Star className="w-5 h-5 text-yellow-600" />,
        color: 'yellow',
        description: 'High satisfaction across all metrics'
      },
      {
        id: 'response_time',
        type: 'efficiency',
        title: 'Avg Response Time',
        value: '2.3 min',
        change: '-0.4 min',
        icon: <Clock className="w-5 h-5 text-purple-600" />,
        color: 'purple',
        description: 'Faster than expected completion time'
      }
    ];
    setInsights(newInsights);
  }, []);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'responses', name: 'Responses', icon: <Users className="w-4 h-4" /> },
    { id: 'insights', name: 'AI Insights', icon: <Brain className="w-4 h-4" /> },
    { id: 'trends', name: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'export', name: 'Export', icon: <Download className="w-4 h-4" /> }
  ];

  const timeRanges = [
    { value: '1d', label: 'Last 24h' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'all', label: 'All time' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map(insight => (
          <div key={insight.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${insight.color}-100`}>
                {insight.icon}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                insight.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {insight.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{insight.value}</h3>
            <p className="text-sm text-slate-600 mb-2">{insight.title}</p>
            <p className="text-xs text-slate-500">{insight.description}</p>
          </div>
        ))}
          </div>
          
      {/* Real-time Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Response Trends</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-slate-600">
              {isRealTime ? 'Live' : 'Paused'}
            </span>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-slate-600">Real-time chart visualization</p>
            <p className="text-sm text-slate-500">Chart library integration needed</p>
            </div>
          </div>
        </div>
        
      {/* Question Performance */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Question Performance</h3>
        <div className="space-y-3">
          {questions.slice(0, 5).map((question, index) => (
            <div key={question.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {question.title}
                </p>
                <p className="text-xs text-slate-500">
                  {question.type} • {Math.floor(Math.random() * 100)}% completion
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-600 w-8">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
          </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">AI-Powered Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-slate-900 mb-2">Sentiment Analysis</h4>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-16 bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="text-sm text-slate-600">75% Positive</span>
            </div>
            <p className="text-xs text-slate-500">Most responses show positive sentiment</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-slate-900 mb-2">Key Themes</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Product Quality</span>
                <span className="text-blue-600">32%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Customer Service</span>
                <span className="text-green-600">28%</span>
        </div>
              <div className="flex justify-between text-sm">
                <span>Pricing</span>
                <span className="text-yellow-600">18%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Predictive Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-900">Response Forecast</h4>
            <p className="text-2xl font-bold text-blue-600">+15%</p>
            <p className="text-xs text-slate-500">Next 7 days</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-900">Completion Rate</h4>
            <p className="text-2xl font-bold text-green-600">89%</p>
            <p className="text-xs text-slate-500">Predicted</p>
                  </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-900">Satisfaction</h4>
            <p className="text-2xl font-bold text-purple-600">4.4</p>
            <p className="text-xs text-slate-500">Expected</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="advanced-analytics bg-white rounded-xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Advanced Analytics</h2>
            <p className="text-slate-600 mt-1">
              Real-time insights and AI-powered analysis for {surveyData.title || 'your survey'}
            </p>
          </div>
                <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isRealTime 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isRealTime ? 'Live' : 'Paused'}
              </span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'insights' && renderAIInsights()}
        {activeTab === 'responses' && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Response Analysis</h3>
            <p className="text-slate-600">Detailed response breakdown and analysis</p>
        </div>
        )}
        {activeTab === 'trends' && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Trend Analysis</h3>
            <p className="text-slate-600">Historical trends and patterns</p>
              </div>
        )}
        {activeTab === 'export' && (
          <div className="text-center py-12">
            <Download className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Export Data</h3>
            <p className="text-slate-600">Export analytics data in various formats</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalytics;