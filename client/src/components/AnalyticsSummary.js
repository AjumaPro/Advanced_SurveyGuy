import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Clock,
  BarChart3,
  Eye,
  Download,
  Share2,
  Image
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';

const AnalyticsSummary = ({ data, loading, onExport, onShare, onGenerateReport, onDownloadCharts }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Responses',
      value: data?.overview?.totalResponses?.toLocaleString() || 0,
      icon: Users,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Completion Rate',
      value: `${data?.overview?.averageCompletionRate?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: 'green',
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Avg Time',
      value: `${data?.overview?.averageTimeToComplete || 0} min`,
      icon: Clock,
      color: 'purple',
      change: '-2%',
      changeType: 'negative'
    },
    {
      label: 'Active Now',
      value: data?.overview?.activeResponses || 0,
      icon: Eye,
      color: 'red',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const getChangeColor = (type) => {
    return type === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  // Mini chart data for response trends
  const miniChartData = {
    labels: data?.trends?.dates?.slice(-7) || [],
    datasets: [
      {
        data: data?.trends?.responses?.slice(-7) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    },
    elements: {
      point: { radius: 0 }
    }
  };

  // Device distribution chart
  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          data?.deviceAnalytics?.desktop || 0,
          data?.deviceAnalytics?.mobile || 0,
          data?.deviceAnalytics?.tablet || 0
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderWidth: 0
      }
    ]
  };

  const deviceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${getColorClasses(metric.color)}`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change}
                </span>
                <p className="text-xs text-gray-500">vs last period</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Trends Mini Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Response Trends</h3>
            <div className="flex space-x-2">
              <button
                onClick={onExport}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Export data"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={onShare}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Share analytics"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="h-32">
            <Line data={miniChartData} options={miniChartOptions} />
          </div>
        </motion.div>

        {/* Device Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
          <div className="h-32">
            <Doughnut data={deviceData} options={deviceOptions} />
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {deviceData.labels.map((label, index) => (
              <div key={label} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: deviceData.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
          <button
            onClick={onShare}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Report</span>
          </button>
          <button 
            onClick={onGenerateReport}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
          <button 
            onClick={onDownloadCharts}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Image className="h-4 w-4" />
            <span>Download Charts</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsSummary; 