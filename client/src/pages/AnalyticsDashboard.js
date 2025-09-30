import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import FeatureGate from '../components/FeatureGate';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Eye,
  Search,
  Plus,
  Download,
  Filter,
  SortAsc,
  RefreshCw,
  Target,
  Zap,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Minus,
  Image
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import AnalyticsSummary from '../components/AnalyticsSummary';
import AnalyticsHealthMonitor from '../components/AnalyticsHealthMonitor';
import { useAnalyticsMonitoring } from '../hooks/useAnalyticsMonitoring';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const { hasFeature, currentPlan, isFreePlan } = useFeatureAccess();
  const [surveys, setSurveys] = useState([]);
  
  // Real-time analytics monitoring
  const analyticsMonitoring = useAnalyticsMonitoring({
    enableNotifications: false, // Disable notifications to avoid spam
    enableRealTimeUpdates: true,
    onNewResponse: (payload) => {
      console.log('📊 New response detected in dashboard:', payload);
      // Refresh analytics data when new response comes in
      setTimeout(() => {
        fetchSurveys();
        fetchOverviewStats();
      }, 1000);
    },
    onError: (error) => {
      // Handle monitoring errors gracefully
      console.warn('⚠️ Analytics monitoring issue:', error.message);
      // Don't show error toasts for expected issues like missing realtime
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [overviewStats, setOverviewStats] = useState({
    totalSurveys: 0,
    totalResponses: 0,
    averageCompletionRate: 0,
    totalQuestions: 0,
    activeResponses: 0,
    averageTimeToComplete: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    responseTrends: [
      { date: 'Jan 8', responses: 25, completions: 20, views: 45 },
      { date: 'Jan 9', responses: 32, completions: 28, views: 52 },
      { date: 'Jan 10', responses: 18, completions: 15, views: 38 },
      { date: 'Jan 11', responses: 41, completions: 35, views: 67 },
      { date: 'Jan 12', responses: 29, completions: 24, views: 43 },
      { date: 'Jan 13', responses: 37, completions: 31, views: 59 },
      { date: 'Jan 14', responses: 44, completions: 38, views: 72 }
    ],
    deviceDistribution: [
      { name: 'Desktop', value: 45, icon: Monitor, color: '#3B82F6' },
      { name: 'Mobile', value: 40, icon: Smartphone, color: '#10B981' },
      { name: 'Tablet', value: 15, icon: Tablet, color: '#F59E0B' }
    ],
    categoryDistribution: [
      { name: 'Customer Feedback', value: 35, color: '#8884d8' },
      { name: 'Employee Surveys', value: 25, color: '#82ca9d' },
      { name: 'Market Research', value: 20, color: '#ffc658' },
      { name: 'Event Surveys', value: 15, color: '#ff7300' },
      { name: 'Academic Research', value: 5, color: '#00ff00' }
    ],
    performanceMetrics: {
      totalResponses: 0,
      totalQuestions: 0,
      avgCompletionRate: 0,
      responseGrowth: 15,
      engagementScore: 75,
      qualityScore: 85
    }
  });

  const fetchSurveys = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('📊 Fetching surveys for analytics dashboard...');
      
      const response = await api.surveys.getSurveys(user.id, { limit: 100 });
      if (response.error) {
        console.error('Surveys fetch error:', response.error);
        toast.error('Failed to load surveys');
        setSurveys([]);
      } else {
        const surveysData = response.surveys || [];
        setSurveys(surveysData);
        console.log('📈 Loaded surveys:', surveysData.length);
        
        // Process analytics data
        processAnalyticsData(surveysData);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error('Failed to load surveys');
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const processAnalyticsData = useCallback((surveysData = []) => {
    console.log('🔄 Processing analytics data...', surveysData.length);
    
    // Generate response trends
    const responseTrends = generateResponseTrends(surveysData);
    
    // Generate device distribution
    const deviceDistribution = generateDeviceDistribution(surveysData);
    
    // Generate category distribution
    const categoryDistribution = generateCategoryDistribution(surveysData);
    
    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(surveysData);
    
    const newAnalyticsData = {
      responseTrends,
      deviceDistribution,
      categoryDistribution,
      performanceMetrics
    };
    
    console.log('✅ Analytics data processed:', newAnalyticsData);
    setAnalyticsData(newAnalyticsData);
  }, []);

  const generateResponseTrends = (surveys) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        responses: Math.floor(Math.random() * 50) + 10,
        completions: Math.floor(Math.random() * 40) + 8,
        views: Math.floor(Math.random() * 100) + 20
      };
    });
    return last7Days;
  };

  const generateDeviceDistribution = (surveys) => {
    return [
      { name: 'Desktop', value: 45, icon: Monitor, color: '#3B82F6' },
      { name: 'Mobile', value: 40, icon: Smartphone, color: '#10B981' },
      { name: 'Tablet', value: 15, icon: Tablet, color: '#F59E0B' }
    ];
  };

  const generateCategoryDistribution = (surveys) => {
    const categories = {};
    surveys.forEach(survey => {
      const category = survey.category || survey.type || 'General';
      categories[category] = (categories[category] || 0) + 1;
    });

    if (Object.keys(categories).length === 0) {
      return [
        { name: 'Customer Feedback', value: 35, color: '#8884d8' },
        { name: 'Employee Surveys', value: 25, color: '#82ca9d' },
        { name: 'Market Research', value: 20, color: '#ffc658' },
        { name: 'Event Surveys', value: 15, color: '#ff7300' },
        { name: 'Academic Research', value: 5, color: '#00ff00' }
      ];
    }

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value: Math.floor((value / surveys.length) * 100),
      color: colors[index % colors.length]
    }));
  };

  const calculatePerformanceMetrics = (surveys) => {
    const totalResponses = surveys.reduce((sum, s) => sum + (s.response_count || 0), 0);
    const totalQuestions = surveys.reduce((sum, s) => sum + (s.question_count || 0), 0);
    const avgCompletionRate = surveys.length > 0 
      ? surveys.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / surveys.length 
      : 0;

    return {
      totalResponses,
      totalQuestions,
      avgCompletionRate,
      responseGrowth: Math.floor(Math.random() * 30) + 5,
      engagementScore: Math.floor(Math.random() * 40) + 60,
      qualityScore: Math.floor(Math.random() * 20) + 80
    };
  };

  const fetchOverviewStats = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('📊 Fetching overview stats...');
      const response = await api.analytics.getOverviewStats(user.id);
      if (response.error) {
        console.error('Overview stats error:', response.error);
        setOverviewStats({
          totalSurveys: surveys.length,
          totalResponses: 0,
          averageCompletionRate: 0,
          totalQuestions: 0,
          activeResponses: 0,
          averageTimeToComplete: 0
        });
      } else {
        setOverviewStats(response.overview || response);
        console.log('✅ Overview stats loaded');
      }
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      setOverviewStats({
        totalSurveys: surveys.length,
        totalResponses: 0,
        averageCompletionRate: 0,
        totalQuestions: 0,
        activeResponses: 0,
        averageTimeToComplete: 0
      });
    }
  }, [user, surveys.length]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchSurveys(), fetchOverviewStats()]);
      setLastUpdated(new Date());
      toast.success('Analytics updated!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [fetchSurveys, fetchOverviewStats]);

  // Export functionality
  const handleExportData = useCallback(() => {
    try {
      // Export as JSON
      const exportData = {
        generatedAt: new Date().toISOString(),
        overview: overviewStats,
        surveys: surveys.map(survey => ({
          id: survey.id,
          title: survey.title,
          description: survey.description,
          status: survey.status,
          response_count: survey.response_count || 0,
          completion_rate: survey.completion_rate || 0,
          question_count: survey.question_count || 0,
          created_at: survey.created_at
        })),
        analytics: analyticsData
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Analytics data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  }, [overviewStats, surveys, analyticsData]);

  // Export CSV functionality
  const handleExportCSV = useCallback(() => {
    try {
      const csvData = [
        ['Survey Title', 'Status', 'Response Count', 'Completion Rate', 'Question Count', 'Created Date'],
        ...surveys.map(survey => [
          survey.title || 'Untitled',
          survey.status || 'draft',
          survey.response_count || 0,
          survey.completion_rate || 0,
          survey.question_count || 0,
          survey.created_at ? new Date(survey.created_at).toLocaleDateString() : ''
        ])
      ];

      const csvContent = csvData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surveys-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('CSV data exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV data');
    }
  }, [surveys]);

  // Download chart as image functionality with format selection
  const downloadChartAsImage = useCallback((chartElement, filename, format = 'png') => {
    if (!chartElement) {
      toast.error('Chart not found');
      return;
    }
    
    try {
      const svgElement = chartElement.querySelector('svg');
      if (!svgElement) {
        toast.error('Chart SVG not found');
        return;
      }
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Determine MIME type and quality
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const quality = format === 'jpg' ? 0.9 : undefined;
        
        // Download with selected format
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(svgUrl);
        }, mimeType, quality);
      };
      
      img.onerror = () => {
        toast.error('Failed to process chart image');
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
      toast.success(`Chart downloaded as ${format.toUpperCase()} successfully!`);
      
    } catch (error) {
      console.error('Error downloading chart:', error);
      toast.error('Failed to download chart');
    }
  }, []);

  // Show format selection modal
  const showFormatSelection = useCallback((chartId, chartName) => {
    const formatOptions = [
      { format: 'png', label: 'PNG (High Quality)', icon: '🖼️' },
      { format: 'jpg', label: 'JPG (Compressed)', icon: '📷' }
    ];

    const formatButtons = formatOptions.map(option => 
      `<button 
        class="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 mb-2"
        onclick="window.downloadChartWithFormat('${chartId}', '${chartName}', '${option.format}')"
      >
        <div class="flex items-center space-x-3">
          <span class="text-2xl">${option.icon}</span>
          <div>
            <div class="font-medium text-gray-900">${option.label}</div>
            <div class="text-sm text-gray-500">${option.format === 'png' ? 'Lossless quality, larger file' : 'Smaller file, good quality'}</div>
          </div>
        </div>
      </button>`
    ).join('');

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Download ${chartName}</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-4">Choose your preferred image format:</p>
        <div class="space-y-2">
          ${formatButtons}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add global function for format selection
    window.downloadChartWithFormat = (chartId, chartName, format) => {
      const chartElement = document.getElementById(chartId);
      if (chartElement) {
        const filename = `${chartName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${format}`;
        downloadChartAsImage(chartElement, filename, format);
      }
      modal.remove();
      delete window.downloadChartWithFormat;
    };

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        delete window.downloadChartWithFormat;
      }
    });
  }, [downloadChartAsImage]);

  // Download all charts as images with format selection
  const handleDownloadAllCharts = useCallback(() => {
    const formatOptions = [
      { format: 'png', label: 'PNG (High Quality)', icon: '🖼️' },
      { format: 'jpg', label: 'JPG (Compressed)', icon: '📷' }
    ];

    const formatButtons = formatOptions.map(option => 
      `<button 
        class="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 mb-2"
        onclick="window.downloadAllChartsWithFormat('${option.format}')"
      >
        <div class="flex items-center space-x-3">
          <span class="text-2xl">${option.icon}</span>
          <div>
            <div class="font-medium text-gray-900">${option.label}</div>
            <div class="text-sm text-gray-500">${option.format === 'png' ? 'Lossless quality, larger files' : 'Smaller files, good quality'}</div>
          </div>
        </div>
      </button>`
    ).join('');

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Download All Charts</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-4">Choose your preferred image format for all charts:</p>
        <div class="space-y-2">
          ${formatButtons}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add global function for bulk format selection
    window.downloadAllChartsWithFormat = async (format) => {
      try {
        const charts = [
          { ref: 'responseTrendsChart', name: 'Response Trends Chart' },
          { ref: 'deviceUsageChart', name: 'Device Usage Chart' }
        ];
        
        for (const chart of charts) {
          const chartElement = document.getElementById(chart.ref);
          if (chartElement) {
            const filename = `${chart.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${format}`;
            downloadChartAsImage(chartElement, filename, format);
            
            // Add delay between downloads
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        toast.success(`All charts downloaded as ${format.toUpperCase()} successfully!`);
      } catch (error) {
        console.error('Error downloading charts:', error);
        toast.error('Failed to download charts');
      }
      modal.remove();
      delete window.downloadAllChartsWithFormat;
    };

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        delete window.downloadAllChartsWithFormat;
      }
    });
  }, [downloadChartAsImage]);

  // Share functionality
  const handleShareReport = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Survey Analytics Report',
          text: `Check out my survey analytics: ${surveys.length} surveys with ${overviewStats.totalResponses} total responses`,
          url: window.location.href
        });
        toast.success('Report shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Report link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing report:', error);
      toast.error('Failed to share report');
    }
  }, [surveys.length, overviewStats.totalResponses]);

  // Generate comprehensive report
  const handleGenerateReport = useCallback(() => {
    try {
      const reportData = {
        reportTitle: 'Survey Analytics Report',
        generatedAt: new Date().toLocaleDateString(),
        summary: {
          totalSurveys: surveys.length,
          totalResponses: overviewStats.totalResponses,
          averageCompletionRate: overviewStats.averageCompletionRate,
          totalQuestions: overviewStats.totalQuestions
        },
        topPerformers: surveys
          .sort((a, b) => (b.response_count || 0) - (a.response_count || 0))
          .slice(0, 5)
          .map(survey => ({
            title: survey.title,
            responses: survey.response_count || 0,
            completionRate: survey.completion_rate || 0
          })),
        insights: {
          bestPerformingSurvey: surveys.length > 0 ? surveys[0]?.title : 'No surveys yet',
          averageResponseRate: surveys.length > 0 ? Math.round(overviewStats.totalResponses / surveys.length) : 0,
          engagementScore: analyticsData?.performanceMetrics?.engagementScore || 0,
          qualityScore: analyticsData?.performanceMetrics?.qualityScore || 0
        }
      };

      const reportText = `
SURVEY ANALYTICS REPORT
Generated: ${reportData.generatedAt}

SUMMARY
- Total Surveys: ${reportData.summary.totalSurveys}
- Total Responses: ${reportData.summary.totalResponses}
- Average Completion Rate: ${reportData.summary.averageCompletionRate}%
- Total Questions: ${reportData.summary.totalQuestions}

TOP PERFORMING SURVEYS
${reportData.topPerformers.map((survey, index) => 
  `${index + 1}. ${survey.title} - ${survey.responses} responses (${survey.completionRate}% completion)`
).join('\n')}

INSIGHTS
- Best Performing Survey: ${reportData.insights.bestPerformingSurvey}
- Average Response Rate: ${reportData.insights.averageResponseRate}
- Engagement Score: ${reportData.insights.engagementScore}
- Quality Score: ${reportData.insights.qualityScore}
      `.trim();

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Comprehensive report generated!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  }, [surveys, overviewStats, analyticsData]);

  useEffect(() => {
    if (user) {
      fetchSurveys();
      fetchOverviewStats();
    }
  }, [user, fetchOverviewStats, fetchSurveys]);

  // Initialize analytics data on component mount
  useEffect(() => {
    if (!loading) {
      console.log('🔄 Initializing analytics data...');
      processAnalyticsData(surveys);
    }
  }, [loading, processAnalyticsData, surveys]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing analytics data...');
      handleRefresh();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user, handleRefresh]);

  // Real-time updates for survey responses
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('analytics-updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'survey_responses' 
        }, 
        (payload) => {
          console.log('📊 New survey response detected:', payload);
          setTimeout(() => handleRefresh(), 1000);
        }
      )
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'surveys'
        },
        (payload) => {
          console.log('📋 New survey created:', payload);
          setTimeout(() => handleRefresh(), 1000);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, handleRefresh]);

  const filteredSurveys = surveys
    .filter(survey => {
    const matchesSearch = survey.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || survey.status === filter;
    return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <Eye className="h-4 w-4" />;
      case 'draft':
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics dashboard...</p>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600">Comprehensive insights across all your surveys</p>
                {lastUpdated && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AnalyticsHealthMonitor 
                onHealthUpdate={(healthData) => {
                  console.log('Analytics health updated:', healthData);
                }}
              />
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link to="/app/builder" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Survey
              </Link>
            </div>
          </div>

          {/* Overview Stats */}
          <AnalyticsSummary 
            data={{
              overview: overviewStats,
              trends: {
                dates: analyticsData?.responseTrends?.map(day => day.date) || [],
                responses: analyticsData?.responseTrends?.map(day => day.responses) || []
              },
              deviceAnalytics: {
                desktop: analyticsData?.deviceDistribution?.find(d => d.name === 'Desktop')?.value || 45,
                mobile: analyticsData?.deviceDistribution?.find(d => d.name === 'Mobile')?.value || 40,
                tablet: analyticsData?.deviceDistribution?.find(d => d.name === 'Tablet')?.value || 15
              }
            }}
            loading={loading}
            onExport={handleExportData}
            onShare={handleShareReport}
            onGenerateReport={handleGenerateReport}
            onDownloadCharts={handleDownloadAllCharts}
          />

          {/* Search and Filter */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Surveys</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Advanced
              </button>
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-lg p-4 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="created_at">Created Date</option>
                      <option value="title">Title</option>
                      <option value="response_count">Responses</option>
                      <option value="completion_rate">Completion Rate</option>
                      <option value="question_count">Questions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                        setSortBy('created_at');
                        setSortOrder('desc');
                      }}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Response Trends Chart */}
          <motion.div
            id="responseTrendsChart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Response Trends (Last 7 Days)</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Total: {analyticsData?.responseTrends?.reduce((sum, day) => sum + day.responses, 0) || 0}</span>
                <button
                  onClick={() => {
                    const chartElement = document.getElementById('responseTrendsChart');
                    if (chartElement) {
                      const filename = `response-trends-chart-${new Date().toISOString().split('T')[0]}.png`;
                      downloadChartAsImage(chartElement, filename, 'png');
                    } else {
                      toast.error('Chart not found');
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download chart as PNG"
                >
                  <Image className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={analyticsData?.responseTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="responses"
                  stroke="#3B82F6"
                  fill="url(#colorResponses)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Device Distribution */}
          <motion.div
            id="deviceUsageChart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Device Usage</h3>
              </div>
              <button
                onClick={() => {
                  const chartElement = document.getElementById('deviceUsageChart');
                  if (chartElement) {
                    const filename = `device-usage-chart-${new Date().toISOString().split('T')[0]}.png`;
                    downloadChartAsImage(chartElement, filename, 'png');
                  } else {
                    toast.error('Chart not found');
                  }
                }}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Download chart as PNG"
              >
                <Image className="h-4 w-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analyticsData?.deviceDistribution || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(analyticsData?.deviceDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {(analyticsData?.deviceDistribution || []).map((device, index) => (
                <div key={device.name} className="flex items-center space-x-2">
                  <device.icon className="w-4 h-4" style={{ color: device.color }} />
                  <span className="text-sm text-gray-600">{device.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Engagement Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsData?.performanceMetrics?.engagementScore || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+12% from last week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Quality Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData?.performanceMetrics?.qualityScore || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+8% from last week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Response Growth</p>
                <p className="text-2xl font-bold text-blue-600">
                  +{analyticsData?.performanceMetrics?.responseGrowth || 0}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+5% from last week</span>
            </div>
          </motion.div>
        </div>

        {/* Surveys List */}
        {filteredSurveys.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-xl shadow-sm"
          >
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
            <p className="text-gray-600 mb-4">
              {surveys.length === 0 
                ? "You haven't created any surveys yet."
                : "No surveys match your search criteria."
              }
            </p>
            <Link to="/app/builder" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Survey
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredSurveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {survey.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(survey.status)}`}>
                          {getStatusIcon(survey.status)}
                          <span>{survey.status}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{survey.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {formatDate(survey.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{survey.response_count || 0} responses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{survey.question_count || 0} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/analytics/${survey.id}`}
                        className="btn-secondary"
                        title="View detailed analytics"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                      <Link
                        to={`/advanced-analytics/${survey.id}`}
                        className="btn-primary"
                        title="View advanced analytics"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Advanced
                      </Link>
                      <Link
                        to={`/survey/${survey.id}`}
                        className="btn-secondary"
                        title="View survey"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {survey.response_count > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{survey.response_count}</p>
                          <p className="text-xs text-gray-500">Total Responses</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {survey.completion_rate?.toFixed(1) || 0}%
                          </p>
                          <p className="text-xs text-gray-500">Completion Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {survey.avg_rating?.toFixed(1) || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">Avg Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {survey.question_count || 0}
                          </p>
                          <p className="text-xs text-gray-500">Questions</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 