import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database, 
  Activity,
  TrendingUp,
  Users,
  BarChart3,
  Download,
  ExternalLink
} from 'lucide-react';
import { runAnalyticsHealthCheck, quickAnalyticsCheck } from '../utils/analyticsHealthCheck';
import toast from 'react-hot-toast';

const AnalyticsHealthMonitor = ({ onHealthUpdate, showDetails = false }) => {
  const [healthStatus, setHealthStatus] = useState('unknown');
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const result = await runAnalyticsHealthCheck();
      setHealthStatus(result.status);
      setHealthData(result);
      setLastChecked(new Date());
      
      if (onHealthUpdate) {
        onHealthUpdate(result);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus('error');
      toast.error('Analytics health check failed');
    } finally {
      setLoading(false);
    }
  };

  const runQuickCheck = async () => {
    try {
      const result = await quickAnalyticsCheck();
      console.log('Quick check result:', result);
    } catch (error) {
      console.error('Quick check failed:', error);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        runQuickCheck();
        runHealthCheck();
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportHealthReport = () => {
    if (!healthData) return;

    const report = {
      timestamp: new Date().toISOString(),
      status: healthStatus,
      summary: healthData.results,
      recommendations: healthData.recommendations || []
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-health-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Health report exported');
  };

  if (!showDetails) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={runHealthCheck}
          disabled={loading}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium transition-colors ${getStatusColor(healthStatus)}`}
          title={`Analytics Health: ${healthStatus}`}
        >
          {getStatusIcon(healthStatus)}
          <span className="hidden sm:inline">
            {loading ? 'Checking...' : healthStatus}
          </span>
        </button>
        {loading && <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Analytics Health Monitor</h3>
            <p className="text-sm text-gray-600">
              {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Not checked yet'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          
          <button
            onClick={runHealthCheck}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Check Health</span>
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(healthStatus)}`}>
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon(healthStatus)}
            <span className="font-medium">Overall Status</span>
          </div>
          <p className="text-2xl font-bold capitalize">{healthStatus}</p>
        </div>

        {healthData?.results && (
          <>
            <div className={`p-4 rounded-lg border-2 ${getStatusColor(healthData.results.databaseTables?.status)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-4 h-4" />
                <span className="font-medium">Database</span>
              </div>
              <p className="text-lg font-semibold capitalize">
                {healthData.results.databaseTables?.status || 'unknown'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${getStatusColor(healthData.results.dataFlow?.status)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Data Flow</span>
              </div>
              <p className="text-lg font-semibold capitalize">
                {healthData.results.dataFlow?.status || 'unknown'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Detailed Results */}
      {healthData?.results && (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-900">Detailed Results</h4>
          
          {/* Database Tables */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Database Tables</span>
            </h5>
            {healthData.results.databaseTables?.details && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {Object.entries(healthData.results.databaseTables.details).map(([table, status]) => (
                  <div key={table} className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="font-medium">{table}</span>
                    <div className="flex items-center space-x-1">
                      {status.exists ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs">{status.count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Flow */}
          {healthData.results.dataFlow?.details && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Data Flow</span>
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 bg-white rounded">
                  <span className="text-gray-600">Recent Responses:</span>
                  <span className="font-medium ml-1">
                    {healthData.results.dataFlow.details.recentResponses || 0}
                  </span>
                </div>
                <div className="p-2 bg-white rounded">
                  <span className="text-gray-600">With Analytics:</span>
                  <span className="font-medium ml-1">
                    {healthData.results.dataFlow.details.summary?.responsesWithAnalytics || 0}
                  </span>
                </div>
                <div className="p-2 bg-white rounded">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium ml-1">
                    {healthData.results.dataFlow.details.summary?.totalUsers || 0}
                  </span>
                </div>
                <div className="p-2 bg-white rounded">
                  <span className="text-gray-600">User Analytics:</span>
                  <span className="font-medium ml-1">
                    {healthData.results.dataFlow.details.summary?.usersWithAnalytics || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* API Integration */}
          {healthData.results.apiIntegration?.details && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>API Integration</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-white rounded flex items-center justify-between">
                  <span className="text-gray-600">Overview Stats:</span>
                  {healthData.results.apiIntegration.details.overviewStats?.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="p-2 bg-white rounded flex items-center justify-between">
                  <span className="text-gray-600">Dashboard Data:</span>
                  {healthData.results.apiIntegration.details.dashboardData?.success ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {healthData?.recommendations && healthData.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            {healthData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={exportHealthReport}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          
          <a
            href="/app/analytics"
            className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Analytics</span>
          </a>
        </div>

        <div className="text-xs text-gray-500">
          Run ANALYTICS_VERIFICATION.sql for detailed database check
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsHealthMonitor;
