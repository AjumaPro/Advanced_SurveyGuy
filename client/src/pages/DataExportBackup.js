import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Download,
  Upload,
  Archive,
  Clock,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Eye,
  Calendar,
  HardDrive,
  Cloud,
  FileText,
  BarChart3,
  Users,
  Mail,
  Zap,
  Save,
  Filter,
  Search,
  Plus,
  X,
  Lock,
  Unlock,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DataExportBackup = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('export');
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [backupJobs, setBackupJobs] = useState([]);
  const [retentionPolicies, setRetentionPolicies] = useState([]);

  const [exportConfig, setExportConfig] = useState({
    name: '',
    format: 'csv',
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    includeResponses: true,
    includeAnalytics: true,
    includeMetadata: true,
    compression: 'zip',
    encryption: false,
    password: ''
  });

  const [backupConfig, setBackupConfig] = useState({
    name: '',
    schedule: 'daily',
    time: '02:00',
    retention: 30,
    includeFiles: true,
    includeDatabase: true,
    compression: true,
    encryption: true
  });

  const tabs = [
    { id: 'export', label: 'Data Export', icon: <Download className="w-4 h-4" /> },
    { id: 'backup', label: 'Backup Jobs', icon: <Archive className="w-4 h-4" /> },
    { id: 'retention', label: 'Retention Policies', icon: <Shield className="w-4 h-4" /> },
    { id: 'history', label: 'Export History', icon: <Clock className="w-4 h-4" /> }
  ];

  const dataTypes = [
    {
      id: 'surveys',
      name: 'Surveys',
      description: 'Survey definitions and metadata',
      icon: <BarChart3 className="w-5 h-5" />,
      size: '2.3 MB',
      count: 24
    },
    {
      id: 'responses',
      name: 'Responses',
      description: 'Survey response data',
      icon: <Users className="w-5 h-5" />,
      size: '45.7 MB',
      count: 1247
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Analytics and reporting data',
      icon: <Activity className="w-5 h-5" />,
      size: '12.1 MB',
      count: 89
    },
    {
      id: 'users',
      name: 'Users',
      description: 'User accounts and profiles',
      icon: <Users className="w-5 h-5" />,
      size: '1.8 MB',
      count: 156
    },
    {
      id: 'templates',
      name: 'Templates',
      description: 'Survey templates and designs',
      icon: <FileText className="w-5 h-5" />,
      size: '5.2 MB',
      count: 67
    },
    {
      id: 'attachments',
      name: 'Attachments',
      description: 'File uploads and media',
      icon: <HardDrive className="w-5 h-5" />,
      size: '234.5 MB',
      count: 892
    }
  ];

  const exportFormats = [
    { id: 'csv', name: 'CSV', description: 'Comma-separated values', icon: '📊' },
    { id: 'json', name: 'JSON', description: 'JavaScript Object Notation', icon: '📋' },
    { id: 'xlsx', name: 'Excel', description: 'Microsoft Excel format', icon: '📈' },
    { id: 'xml', name: 'XML', description: 'Extensible Markup Language', icon: '📄' }
  ];

  const dateRanges = [
    { id: 'all', name: 'All Time', description: 'Export all available data' },
    { id: 'last30', name: 'Last 30 Days', description: 'Export data from the last month' },
    { id: 'last90', name: 'Last 90 Days', description: 'Export data from the last quarter' },
    { id: 'last365', name: 'Last Year', description: 'Export data from the last year' },
    { id: 'custom', name: 'Custom Range', description: 'Select specific date range' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load export history, backup jobs, and retention policies
      // const response = await api.get('/data/export-backup');
      // setExportHistory(response.data.exportHistory);
      // setBackupJobs(response.data.backupJobs);
      // setRetentionPolicies(response.data.retentionPolicies);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const startExport = async () => {
    setLoading(true);
    try {
      // await api.post('/data/export', exportConfig);
      toast.success('Export job started successfully!');
      setShowExportModal(false);
      setExportConfig({
        name: '',
        format: 'csv',
        dateRange: 'all',
        customStartDate: '',
        customEndDate: '',
        includeResponses: true,
        includeAnalytics: true,
        includeMetadata: true,
        compression: 'zip',
        encryption: false,
        password: ''
      });
    } catch (error) {
      toast.error('Failed to start export job');
    } finally {
      setLoading(false);
    }
  };

  const createBackupJob = async () => {
    setLoading(true);
    try {
      // await api.post('/data/backup', backupConfig);
      toast.success('Backup job created successfully!');
      setShowBackupModal(false);
      setBackupConfig({
        name: '',
        schedule: 'daily',
        time: '02:00',
        retention: 30,
        includeFiles: true,
        includeDatabase: true,
        compression: true,
        encryption: true
      });
    } catch (error) {
      toast.error('Failed to create backup job');
    } finally {
      setLoading(false);
    }
  };

  const downloadExport = async (exportId) => {
    try {
      // await api.get(`/data/export/${exportId}/download`);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download export');
    }
  };

  const deleteExport = async (exportId) => {
    try {
      // await api.delete(`/data/export/${exportId}`);
      setExportHistory(prev => prev.filter(exp => exp.id !== exportId));
      toast.success('Export deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete export');
    }
  };

  const renderExportTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Data Export</h2>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataTypes.map(dataType => (
          <div key={dataType.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {dataType.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dataType.name}</h3>
                  <p className="text-sm text-gray-600">{dataType.description}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedData.includes(dataType.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedData(prev => [...prev, dataType.id]);
                  } else {
                    setSelectedData(prev => prev.filter(id => id !== dataType.id));
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Records</span>
                <span className="font-medium text-gray-900">{dataType.count}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Size</span>
                <span className="font-medium text-gray-900">{dataType.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 mb-3">Available Formats</h4>
            <div className="space-y-2">
              {exportFormats.map(format => (
                <div key={format.id} className="flex items-center gap-3">
                  <span className="text-2xl">{format.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{format.name}</div>
                    <div className="text-sm text-gray-600">{format.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-3">Security Features</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600" />
                Password protection
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Encryption support
              </li>
              <li className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-green-600" />
                Compression options
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                Date range filtering
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Backup Jobs</h2>
        <button
          onClick={() => setShowBackupModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Backup Job
        </button>
      </div>

      <div className="space-y-4">
        {backupJobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{job.name}</h3>
                <p className="text-sm text-gray-600">Last run: {job.lastRun || 'Never'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Schedule</label>
                <p className="text-sm text-gray-900 capitalize">{job.schedule}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Retention</label>
                <p className="text-sm text-gray-900">{job.retention} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Next Run</label>
                <p className="text-sm text-gray-900">{job.nextRun || 'Not scheduled'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Size</label>
                <p className="text-sm text-gray-900">{job.size || 'Unknown'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRetentionTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Retention Policies</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Policy
        </button>
      </div>

      <div className="space-y-4">
        {retentionPolicies.map(policy => (
          <div key={policy.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                <p className="text-sm text-gray-600">{policy.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  policy.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {policy.active ? 'Active' : 'Inactive'}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Data Type</label>
                <p className="text-sm text-gray-900">{policy.dataType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Retention Period</label>
                <p className="text-sm text-gray-900">{policy.retentionPeriod}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Cleanup</label>
                <p className="text-sm text-gray-900">{policy.lastCleanup || 'Never'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Export History</h2>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">All Exports</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">Excel</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Bulk Download
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exportHistory.map(exportItem => (
                <tr key={exportItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{exportItem.name}</div>
                      <div className="text-sm text-gray-500">{exportItem.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {exportItem.format.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exportItem.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(exportItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exportItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                      exportItem.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exportItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadExport(exportItem.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => deleteExport(exportItem.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Database className="w-8 h-8 text-blue-500" />
                Data Export & Backup
              </h1>
              <p className="text-gray-600 mt-1">Bulk export with retention controls</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{exportHistory.length}</div>
                <div className="text-sm text-gray-600">Exports</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{backupJobs.length}</div>
                <div className="text-sm text-gray-600">Backups</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'export' && renderExportTab()}
                {activeTab === 'backup' && renderBackupTab()}
                {activeTab === 'retention' && renderRetentionTab()}
                {activeTab === 'history' && renderHistoryTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportBackup;
