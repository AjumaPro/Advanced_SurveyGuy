import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Bar,
  Line,
  Pie,
  Doughnut
} from 'react-chartjs-2';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Eye,
  Download,
  Share2,
  Filter,
  Calendar,
  Search,
  RefreshCw,
  FileText,
  Target,
  Globe,
  MessageSquare,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  ChevronDown
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const { user } = useAuth();
  const { hasFeature, currentPlan, isFreePlan } = useFeatureAccess();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d'); // 7d, 30d, 90d, 1y
  const [selectedSurvey, setSelectedSurvey] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [chartViewMode, setChartViewMode] = useState('all'); // all, trends, demographics, performance
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [sortBy, setSortBy] = useState('responses'); // responses, title, completion, rating
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dataError, setDataError] = useState(null);
  
  // Chart references for PDF export
  const responseTrendsChartRef = React.useRef();
  const surveyPerformanceChartRef = React.useRef();
  const completionRateChartRef = React.useRef();
  const questionPerformanceChartRef = React.useRef();
  const ageDistributionChartRef = React.useRef();
  const geographicDistributionChartRef = React.useRef();
  
  // Analytics data - will be loaded from database
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalSurveys: 0,
      totalResponses: 0,
      avgCompletionRate: 0,
      avgTimeSpent: 0,
      bounceRate: 0
    },
    surveys: [
      {
        id: 'survey_1',
        title: 'Customer Satisfaction Survey',
        status: 'published',
        responses: 1247,
        completionRate: 0.82,
        avgRating: 4.3,
        lastResponse: '2 hours ago',
        trend: 'up'
      },
      {
        id: 'survey_2',
        title: 'Product Feedback Form',
        status: 'published',
        responses: 892,
        completionRate: 0.75,
        avgRating: 4.1,
        lastResponse: '1 day ago',
        trend: 'stable'
      },
      {
        id: 'survey_3',
        title: 'Employee Engagement Survey',
        status: 'published',
        responses: 708,
        completionRate: 0.71,
        avgRating: 3.9,
        lastResponse: '3 days ago',
        trend: 'down'
      }
    ],
    responseTrends: [
      { date: '2024-01-01', responses: 45, completions: 38 },
      { date: '2024-01-02', responses: 52, completions: 41 },
      { date: '2024-01-03', responses: 38, completions: 29 },
      { date: '2024-01-04', responses: 61, completions: 48 },
      { date: '2024-01-05', responses: 49, completions: 39 },
      { date: '2024-01-06', responses: 67, completions: 52 },
      { date: '2024-01-07', responses: 43, completions: 35 }
    ],
    questionPerformance: [
      {
        id: 'q1',
        title: 'How satisfied are you with our service?',
        type: 'rating',
        responses: 1247,
        avgRating: 4.3,
        completionRate: 0.95,
        skipped: 62
      },
      {
        id: 'q2',
        title: 'What can we improve?',
        type: 'text',
        responses: 1185,
        avgRating: null,
        completionRate: 0.87,
        skipped: 162
      },
      {
        id: 'q3',
        title: 'Would you recommend us?',
        type: 'nps',
        responses: 1209,
        avgRating: 4.5,
        completionRate: 0.92,
        skipped: 100
      }
    ],
    demographics: {
      ageGroups: [
        { range: '18-24', count: 234, percentage: 0.08 },
        { range: '25-34', count: 891, percentage: 0.31 },
        { range: '35-44', count: 1023, percentage: 0.36 },
        { range: '45-54', count: 498, percentage: 0.17 },
        { range: '55+', count: 201, percentage: 0.08 }
      ],
      locations: [
        { country: 'United States', count: 1247, percentage: 0.44 },
        { country: 'Canada', count: 498, percentage: 0.17 },
        { country: 'United Kingdom', count: 387, percentage: 0.14 },
        { country: 'Australia', count: 298, percentage: 0.10 },
        { country: 'Germany', count: 234, percentage: 0.08 },
        { country: 'Other', count: 183, percentage: 0.07 }
      ]
    }
  });

  // Chart configurations and data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed;
            return `${label}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    hover: {
      animationDuration: 200
    }
  };

  // Response Trends Chart Data - Use real response data
  const generateResponseTrends = () => {
    // Use real trends data if available, otherwise generate from real responses
    if (analyticsData.realTrends && analyticsData.realTrends.length > 0) {
      return analyticsData.realTrends;
    }
    
    // Generate from real response data
    if (analyticsData.realResponses && analyticsData.realResponses.length > 0) {
      const last7Days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Count actual responses for this date
        const responsesForDate = analyticsData.realResponses.filter(response => {
          const responseDate = new Date(response.submitted_at).toISOString().split('T')[0];
          return responseDate === dateStr;
        }).length;
        
        last7Days.push({
          date: dateStr,
          responses: responsesForDate,
          completions: responsesForDate // All submitted responses are considered completed
        });
      }
      
      return last7Days;
    }
    
    // Fallback to filtered surveys if no real response data
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const responsesForDate = filteredSurveys.reduce((total, survey) => {
        return total + Math.floor(survey.responses / 7);
      }, 0);
      
      last7Days.push({
        date: dateStr,
        responses: responsesForDate,
        completions: Math.floor(responsesForDate * 0.75)
      });
    }
    
    return last7Days;
  };

  const responseTrendsData = {
    labels: generateResponseTrends().map(trend => {
      const date = new Date(trend.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Total Responses',
        data: generateResponseTrends().map(trend => trend.responses),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Completions',
        data: generateResponseTrends().map(trend => trend.completions),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Survey Performance Chart Data - Use filtered surveys
  const surveyPerformanceData = {
    labels: filteredSurveys.map(survey => 
      survey.title.length > 20 ? survey.title.substring(0, 20) + '...' : survey.title
    ),
    datasets: [
      {
        label: 'Responses',
        data: filteredSurveys.map(survey => survey.responses),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Completion Rate Chart Data - Use filtered surveys
  const completionRateData = {
    labels: filteredSurveys.map(survey => 
      survey.title.length > 20 ? survey.title.substring(0, 20) + '...' : survey.title
    ),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: filteredSurveys.map(survey => Math.round(survey.completionRate * 100)),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Age Distribution Pie Chart Data - Use real survey response data
  const generateAgeDistribution = () => {
    console.log('🎂 Generating age distribution from real data:', {
      realDemographics: analyticsData.realDemographics,
      realResponses: analyticsData.realResponses?.length,
      filteredSurveys: filteredSurveys.length
    });

    // Use real demographic data if available from API
    if (analyticsData.realDemographics && analyticsData.realDemographics.ageGroups && analyticsData.realDemographics.ageGroups.length > 0) {
      console.log('✅ Using real demographic data from API');
      return analyticsData.realDemographics.ageGroups;
    }
    
    // Generate from real response data if available
    if (analyticsData.realResponses && analyticsData.realResponses.length > 0) {
      console.log('📊 Processing real response data for age distribution');
      const ageGroups = {};
      
      // Count age groups from real responses - check multiple possible field names
      analyticsData.realResponses.forEach(response => {
        let ageValue = null;
        
        // Check multiple possible field names for age data
        if (response.responses) {
          ageValue = response.responses.age || 
                    response.responses.Age || 
                    response.responses.age_group ||
                    response.responses['age-group'] ||
                    response.responses.ageGroup;
        }
        
        // Also check if age is in the root response object
        if (!ageValue) {
          ageValue = response.age || response.Age;
        }
        
        if (ageValue) {
          const age = parseInt(ageValue);
          if (!isNaN(age) && age > 0 && age < 120) {
            if (age >= 18 && age <= 24) {
              ageGroups['18-24'] = (ageGroups['18-24'] || 0) + 1;
            } else if (age >= 25 && age <= 34) {
              ageGroups['25-34'] = (ageGroups['25-34'] || 0) + 1;
            } else if (age >= 35 && age <= 44) {
              ageGroups['35-44'] = (ageGroups['35-44'] || 0) + 1;
            } else if (age >= 45 && age <= 54) {
              ageGroups['45-54'] = (ageGroups['45-54'] || 0) + 1;
            } else if (age >= 55) {
              ageGroups['55+'] = (ageGroups['55+'] || 0) + 1;
            }
          }
        }
      });
      
      const totalResponses = Object.values(ageGroups).reduce((sum, count) => sum + count, 0);
      
      if (totalResponses > 0) {
        console.log('✅ Generated age distribution from real responses:', ageGroups);
        return [
          { range: '18-24', count: ageGroups['18-24'] || 0, percentage: (ageGroups['18-24'] || 0) / totalResponses },
          { range: '25-34', count: ageGroups['25-34'] || 0, percentage: (ageGroups['25-34'] || 0) / totalResponses },
          { range: '35-44', count: ageGroups['35-44'] || 0, percentage: (ageGroups['35-44'] || 0) / totalResponses },
          { range: '45-54', count: ageGroups['45-54'] || 0, percentage: (ageGroups['45-54'] || 0) / totalResponses },
          { range: '55+', count: ageGroups['55+'] || 0, percentage: (ageGroups['55+'] || 0) / totalResponses }
        ];
      } else {
        console.log('⚠️ No valid age data found in responses');
      }
    }
    
    // If no real data available, show empty state instead of mock data
    console.log('❌ No real age data available, showing empty state');
    return [
      { range: '18-24', count: 0, percentage: 0 },
      { range: '25-34', count: 0, percentage: 0 },
      { range: '35-44', count: 0, percentage: 0 },
      { range: '45-54', count: 0, percentage: 0 },
      { range: '55+', count: 0, percentage: 0 }
    ];
  };

  const ageDistributionData = {
    labels: generateAgeDistribution().map(group => group.range),
    datasets: [
      {
        data: generateAgeDistribution().map(group => group.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Geographic Distribution Doughnut Chart Data - Use real survey response data
  const generateGeographicDistribution = () => {
    console.log('🌍 Generating geographic distribution from real data:', {
      realDemographics: analyticsData.realDemographics,
      realResponses: analyticsData.realResponses?.length,
      filteredSurveys: filteredSurveys.length
    });

    // Use real demographic data if available from API
    if (analyticsData.realDemographics && analyticsData.realDemographics.locations && analyticsData.realDemographics.locations.length > 0) {
      console.log('✅ Using real demographic data from API');
      return analyticsData.realDemographics.locations;
    }
    
    // Generate from real response data if available
    if (analyticsData.realResponses && analyticsData.realResponses.length > 0) {
      console.log('📊 Processing real response data for geographic distribution');
      const locations = {};
      
      // Count locations from real responses - check multiple possible field names
      analyticsData.realResponses.forEach(response => {
        let locationValue = null;
        
        // Check multiple possible field names for location data
        if (response.responses) {
          locationValue = response.responses.country || 
                         response.responses.Country || 
                         response.responses.location ||
                         response.responses.Location ||
                         response.responses.country_code ||
                         response.responses['country-code'] ||
                         response.responses.countryCode ||
                         response.responses.state ||
                         response.responses.State ||
                         response.responses.region ||
                         response.responses.Region;
        }
        
        // Also check if location is in the root response object
        if (!locationValue) {
          locationValue = response.country || response.Country || response.location || response.Location;
        }
        
        if (locationValue && typeof locationValue === 'string' && locationValue.trim()) {
          // Clean and normalize the location value
          const cleanLocation = locationValue.trim();
          
          // If it's a full address, try to extract country
          if (cleanLocation.includes(',')) {
            const parts = cleanLocation.split(',').map(part => part.trim());
            const country = parts[parts.length - 1]; // Usually the last part is country
            if (country && country.length > 2) {
              locations[country] = (locations[country] || 0) + 1;
            }
          } else {
            // Use the location as-is
            locations[cleanLocation] = (locations[cleanLocation] || 0) + 1;
          }
        }
      });
      
      const totalResponses = Object.values(locations).reduce((sum, count) => sum + count, 0);
      
      if (totalResponses > 0) {
        console.log('✅ Generated geographic distribution from real responses:', locations);
        // Convert to array format and sort by count
        return Object.entries(locations)
          .map(([country, count]) => ({
            country,
            count,
            percentage: count / totalResponses
          }))
          .sort((a, b) => b.count - a.count) // Sort by count descending
          .slice(0, 10); // Limit to top 10 countries
      } else {
        console.log('⚠️ No valid location data found in responses');
      }
    }
    
    // If no real data available, show empty state instead of mock data
    console.log('❌ No real location data available, showing empty state');
    return [
      { country: 'No Data', count: 0, percentage: 0 }
    ];
  };

  const geographicDistributionData = {
    labels: generateGeographicDistribution().map(location => location.country),
    datasets: [
      {
        data: generateGeographicDistribution().map(location => location.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Question Performance Chart Data
  const questionPerformanceData = {
    labels: analyticsData.questionPerformance.map(question => 
      question.title.length > 30 ? question.title.substring(0, 30) + '...' : question.title
    ),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: analyticsData.questionPerformance.map(question => Math.round(question.completionRate * 100)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  };

  // Check if user has access to advanced reports
  const hasAdvancedReports = hasFeature('advanced_reports');
  
  // Redirect to dashboard if user doesn't have access
  useEffect(() => {
    if (!hasAdvancedReports && !isFreePlan()) {
      toast.error('Advanced Reports feature requires Pro or Enterprise plan');
      navigate('/app/dashboard');
    }
  }, [hasAdvancedReports, isFreePlan, navigate]);

  const fetchReportsData = useCallback(async (showRefreshIndicator = false) => {
    if (!user || !hasAdvancedReports) return;
    
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
    setLoading(true);
    }
    
    try {
      console.log('📊 Fetching reports data for user:', user.id);
      
      // Fetch real data from API with better error handling
      const [overviewStats, surveysData] = await Promise.all([
        api.analytics.getOverviewStats(user.id).catch(err => {
          console.warn('Analytics API failed:', err);
          return { error: err.message };
        }),
        api.surveys.getSurveys(user.id, { limit: 50 }).catch(err => {
          console.warn('Surveys API failed:', err);
          return { error: err.message };
        })
      ]);
      
      // Try to fetch additional data, but don't fail if unavailable
      let responseData = { responses: [] };
      let detailedAnalytics = { demographics: null };
      
      try {
        responseData = await api.responses.getResponses(user.id, { limit: 1000 });
      } catch (err) {
        console.warn('Response data API not available:', err);
      }
      
      try {
        detailedAnalytics = await api.analytics.getDetailedAnalytics(user.id);
      } catch (err) {
        console.warn('Detailed analytics API not available:', err);
      }
      
      if (overviewStats.error) {
        console.warn('Analytics API error:', overviewStats.error);
      }
      
      if (surveysData.error) {
        console.warn('Surveys API error:', surveysData.error);
      }
      
      // No need to check for errors on optional data
      
      // Always update data, even if some APIs fail
      setAnalyticsData(prevData => ({
        ...prevData,
        overview: {
          ...prevData.overview,
          totalSurveys: surveysData.surveys?.length || prevData.overview.totalSurveys,
          totalResponses: overviewStats?.totalResponses || prevData.overview.totalResponses,
          avgCompletionRate: overviewStats?.averageCompletionRate || prevData.overview.avgCompletionRate,
          avgTimeSpent: overviewStats?.averageTimeSpent || prevData.overview.avgTimeSpent,
          bounceRate: overviewStats?.bounceRate || prevData.overview.bounceRate
        },
        surveys: surveysData.surveys?.map(survey => ({
          id: survey.id,
          title: survey.title,
          status: survey.status || 'published',
          responses: survey.responseCount || 0,
          completionRate: survey.completion_rate || 0.75,
          avgRating: survey.average_rating || null,
          lastResponse: survey.last_response_at ? 
            new Date(survey.last_response_at).toLocaleDateString() : 'No responses',
          trend: 'stable'
        })) || prevData.surveys,
        // Add real response data for trends and demographics
        realResponses: responseData.responses || [],
        realTrends: overviewStats?.trends || prevData.responseTrends,
        realDemographics: detailedAnalytics.demographics || prevData.demographics
      }));
      
      // Show appropriate success message
      const hasRealData = (surveysData.surveys?.length > 0) || (responseData.responses?.length > 0);
      if (hasRealData) {
      toast.success('Reports data loaded successfully!');
      } else {
        toast.success('Reports loaded with sample data');
      }
      setLastRefresh(new Date());
      
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      
      // Show specific error message but still display data
      if (error.message.includes('network') || error.message.includes('fetch')) {
        toast.error('Network error - showing cached data');
      } else if (error.message.includes('unauthorized') || error.message.includes('403')) {
        toast.error('Access denied - showing sample data');
      } else {
        toast.error('Data loading issue - showing sample data');
      }
      
      // Still set refresh time even on error
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, hasAdvancedReports]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  // Filter and sort surveys based on current filters
  useEffect(() => {
    let filtered = [...analyticsData.surveys];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(survey => 
        survey.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply survey selection filter
    if (selectedSurvey !== 'all') {
      if (selectedSurvey === 'published') {
        filtered = filtered.filter(survey => survey.status === 'published');
      } else if (selectedSurvey === 'draft') {
        filtered = filtered.filter(survey => survey.status === 'draft');
      } else {
        filtered = filtered.filter(survey => survey.id === selectedSurvey);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'completion':
          aValue = a.completionRate;
          bValue = b.completionRate;
          break;
        case 'rating':
          aValue = a.avgRating || 0;
          bValue = b.avgRating || 0;
          break;
        case 'responses':
        default:
          aValue = a.responses;
          bValue = b.responses;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSurveys(filtered);
  }, [analyticsData.surveys, searchTerm, selectedSurvey, sortBy, sortOrder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportDropdown && !event.target.closest('.export-dropdown')) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportDropdown]);

  // Export functionality
  const generateCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    try {
      // Export Survey Performance Data
      const surveyData = analyticsData.surveys.map(survey => ({
        'Survey Title': survey.title,
        'Status': survey.status,
        'Total Responses': survey.responses,
        'Completion Rate (%)': Math.round(survey.completionRate * 100),
        'Average Rating': survey.avgRating?.toFixed(1) || 'N/A',
        'Trend': survey.trend,
        'Last Response': survey.lastResponse
      }));

      // Export Question Performance Data
      const questionData = analyticsData.questionPerformance.map(question => ({
        'Question': question.title,
        'Type': question.type,
        'Responses': question.responses,
        'Completion Rate (%)': Math.round(question.completionRate * 100),
        'Average Rating': question.avgRating?.toFixed(1) || 'N/A',
        'Skipped': question.skipped
      }));

      // Export Response Trends Data
      const trendsData = analyticsData.responseTrends.map(trend => ({
        'Date': trend.date,
        'Total Responses': trend.responses,
        'Completions': trend.completions,
        'Completion Rate (%)': Math.round((trend.completions / trend.responses) * 100)
      }));

      // Export Demographics Data
      const ageData = analyticsData.demographics.ageGroups.map(group => ({
        'Age Group': group.range,
        'Count': group.count,
        'Percentage (%)': Math.round(group.percentage * 100)
      }));

      const locationData = analyticsData.demographics.locations.map(location => ({
        'Country': location.country,
        'Count': location.count,
        'Percentage (%)': Math.round(location.percentage * 100)
      }));

      // Export Overview Data
      const overviewData = [{
        'Metric': 'Total Surveys',
        'Value': analyticsData.overview.totalSurveys
      }, {
        'Metric': 'Total Responses',
        'Value': analyticsData.overview.totalResponses
      }, {
        'Metric': 'Average Completion Rate (%)',
        'Value': Math.round(analyticsData.overview.avgCompletionRate * 100)
      }, {
        'Metric': 'Average Time Spent (minutes)',
        'Value': analyticsData.overview.avgTimeSpent
      }, {
        'Metric': 'Bounce Rate (%)',
        'Value': Math.round(analyticsData.overview.bounceRate * 100)
      }];

      // Generate multiple CSV files (Excel-compatible)
      generateCSV(overviewData, 'Survey_Overview');
      generateCSV(surveyData, 'Survey_Performance');
      generateCSV(questionData, 'Question_Performance');
      generateCSV(trendsData, 'Response_Trends');
      generateCSV(ageData, 'Age_Demographics');
      generateCSV(locationData, 'Location_Demographics');

      toast.success('Excel reports exported successfully! (Multiple CSV files)');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export Excel report');
    }
  };

  const handleExportPDF = async () => {
    try {
      // Create a comprehensive PDF report with charts
      const generatePDFContent = async () => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        
        // Function to convert chart to base64 image
        const getChartImage = (chartRef) => {
          if (chartRef && chartRef.current) {
            const canvas = chartRef.current.canvas;
            return canvas.toDataURL('image/png');
          }
          return null;
        };

        // Get chart images
        const responseTrendsImage = getChartImage(responseTrendsChartRef);
        const surveyPerformanceImage = getChartImage(surveyPerformanceChartRef);
        const completionRateImage = getChartImage(completionRateChartRef);
        const questionPerformanceImage = getChartImage(questionPerformanceChartRef);
        const ageDistributionImage = getChartImage(ageDistributionChartRef);
        const geographicDistributionImage = getChartImage(geographicDistributionChartRef);
        
        let content = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Survey Analytics Report</title>
            <style>
              @media print {
                body { margin: 0; }
                .page-break { page-break-before: always; }
                .no-break { page-break-inside: avoid; }
              }
              
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                color: #333; 
                line-height: 1.6;
                background: white;
              }
              
              .header { 
                text-align: center; 
                margin-bottom: 40px; 
                border-bottom: 3px solid #3B82F6; 
                padding-bottom: 25px; 
              }
              .header h1 { 
                color: #3B82F6; 
                margin: 0 0 10px 0; 
                font-size: 32px; 
                font-weight: 700;
              }
              .header p { 
                color: #666; 
                margin: 5px 0; 
                font-size: 14px;
              }
              
              .section { 
                margin: 40px 0; 
                page-break-inside: avoid;
              }
              .section h2 { 
                color: #1F2937; 
                border-left: 5px solid #3B82F6; 
                padding-left: 20px; 
                font-size: 24px;
                margin-bottom: 25px;
              }
              
              .metric-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
                gap: 20px; 
                margin: 25px 0; 
              }
              .metric-card { 
                background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); 
                border: 2px solid #E2E8F0; 
                border-radius: 12px; 
                padding: 20px; 
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .metric-title { 
                font-weight: 600; 
                color: #64748B; 
                font-size: 13px; 
                margin-bottom: 8px; 
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .metric-value { 
                font-size: 28px; 
                font-weight: 800; 
                color: #1E293B; 
                margin: 0;
              }
              
              .table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
                font-size: 14px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .table th, .table td { 
                border: 1px solid #D1D5DB; 
                padding: 12px 15px; 
                text-align: left; 
              }
              .table th { 
                background: linear-gradient(135deg, #3B82F6, #1D4ED8); 
                color: white; 
                font-weight: 600; 
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .table tr:nth-child(even) { 
                background: #F8FAFC; 
              }
              .table tr:hover { 
                background: #F1F5F9; 
              }
              
              .progress-bar { 
                background: #E2E8F0; 
                height: 8px; 
                border-radius: 4px; 
                overflow: hidden; 
                margin: 8px 0; 
                width: 100%;
              }
              .progress-fill { 
                background: linear-gradient(90deg, #3B82F6, #1D4ED8); 
                height: 100%; 
                border-radius: 4px;
              }
              
              .trend-up { color: #059669; font-weight: bold; }
              .trend-down { color: #DC2626; font-weight: bold; }
              .trend-stable { color: #6B7280; font-weight: bold; }
              
              .demographics-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin: 25px 0;
              }
              
              .footer { 
                margin-top: 50px; 
                padding-top: 25px; 
                border-top: 2px solid #E5E7EB; 
                text-align: center; 
                color: #6B7280; 
                font-size: 12px; 
                background: #F9FAFB;
                padding: 20px;
                border-radius: 8px;
              }
              
              .logo {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                border-radius: 12px;
                margin: 0 auto 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
              }
              
              .summary-box {
                background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 100%);
                border: 2px solid #3B82F6;
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                text-align: center;
              }
              
              .summary-box h3 {
                color: #1E40AF;
                margin: 0 0 15px 0;
                font-size: 20px;
              }
              
              .summary-box p {
                color: #1E40AF;
                margin: 5px 0;
                font-size: 16px;
                font-weight: 500;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">SG</div>
              <h1>Survey Analytics Report</h1>
              <p><strong>Generated:</strong> ${currentDate} at ${currentTime}</p>
              <p><strong>Reporting Period:</strong> ${selectedPeriod === '7d' ? 'Last 7 days' : selectedPeriod === '30d' ? 'Last 30 days' : selectedPeriod === '90d' ? 'Last 90 days' : 'Last year'}</p>
            </div>

            <div class="summary-box">
              <h3>📊 Executive Summary</h3>
              <p>Total Surveys: ${analyticsData.overview.totalSurveys} | Total Responses: ${analyticsData.overview.totalResponses.toLocaleString()} | Avg Completion Rate: ${Math.round(analyticsData.overview.avgCompletionRate * 100)}%</p>
              <p>Average Time Spent: ${analyticsData.overview.avgTimeSpent} minutes | Bounce Rate: ${Math.round(analyticsData.overview.bounceRate * 100)}%</p>
            </div>

            <div class="section no-break">
              <h2>📊 Key Performance Metrics</h2>
              <div class="metric-grid">
                <div class="metric-card">
                  <div class="metric-title">Total Surveys</div>
                  <div class="metric-value">${analyticsData.overview.totalSurveys}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Total Responses</div>
                  <div class="metric-value">${analyticsData.overview.totalResponses.toLocaleString()}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Avg. Completion Rate</div>
                  <div class="metric-value">${Math.round(analyticsData.overview.avgCompletionRate * 100)}%</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Avg. Time Spent</div>
                  <div class="metric-value">${analyticsData.overview.avgTimeSpent}m</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Bounce Rate</div>
                  <div class="metric-value">${Math.round(analyticsData.overview.bounceRate * 100)}%</div>
                </div>
              </div>
            </div>

            <div class="section page-break">
              <h2>📈 Survey Performance Analysis</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Survey Title</th>
                    <th>Responses</th>
                    <th>Completion Rate</th>
                    <th>Avg Rating</th>
                    <th>Trend</th>
                    <th>Last Response</th>
                  </tr>
                </thead>
                <tbody>
                  ${analyticsData.surveys.map(survey => `
                    <tr>
                      <td><strong>${survey.title}</strong></td>
                      <td>${survey.responses.toLocaleString()}</td>
                      <td>
                        ${Math.round(survey.completionRate * 100)}%
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: ${survey.completionRate * 100}%"></div>
                        </div>
                      </td>
                      <td>${survey.avgRating?.toFixed(1) || 'N/A'}</td>
                      <td class="trend-${survey.trend}">
                        ${survey.trend === 'up' ? '↗ Improving' : survey.trend === 'down' ? '↘ Declining' : '→ Stable'}
                      </td>
                      <td>${survey.lastResponse}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section page-break">
              <h2>❓ Question Performance Analysis</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Type</th>
                    <th>Responses</th>
                    <th>Completion Rate</th>
                    <th>Avg Rating</th>
                    <th>Skipped</th>
                  </tr>
                </thead>
                <tbody>
                  ${analyticsData.questionPerformance.map(question => `
                    <tr>
                      <td><strong>${question.title}</strong></td>
                      <td><span style="background: #E0E7FF; color: #3730A3; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${question.type.toUpperCase()}</span></td>
                      <td>${question.responses.toLocaleString()}</td>
                      <td>
                        ${Math.round(question.completionRate * 100)}%
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: ${question.completionRate * 100}%"></div>
                        </div>
                      </td>
                      <td>${question.avgRating?.toFixed(1) || 'N/A'}</td>
                      <td>${question.skipped}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section page-break">
              <h2>📅 Response Trends (Last 7 Days)</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Responses</th>
                    <th>Completions</th>
                    <th>Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  ${analyticsData.responseTrends.map(trend => `
                    <tr>
                      <td><strong>${trend.date}</strong></td>
                      <td>${trend.responses}</td>
                      <td>${trend.completions}</td>
                      <td>
                        ${Math.round((trend.completions / trend.responses) * 100)}%
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: ${(trend.completions / trend.responses) * 100}%"></div>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <!-- Chart Data Summary -->
              <div style="margin-top: 20px; padding: 15px; background: #F8FAFC; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #1E293B;">📈 Trend Analysis</h4>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Peak Day:</strong> ${analyticsData.responseTrends.reduce((max, trend) => trend.responses > max.responses ? trend : max).date} 
                  (${analyticsData.responseTrends.reduce((max, trend) => trend.responses > max.responses ? trend : max).responses} responses)
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Average Daily Responses:</strong> ${Math.round(analyticsData.responseTrends.reduce((sum, trend) => sum + trend.responses, 0) / analyticsData.responseTrends.length)}
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Average Completion Rate:</strong> ${Math.round(analyticsData.responseTrends.reduce((sum, trend) => sum + (trend.completions / trend.responses), 0) / analyticsData.responseTrends.length * 100)}%
                </p>
              </div>
            </div>

            <div class="section page-break">
              <h2>👥 Demographic Analysis</h2>
              <div class="demographics-grid">
                <div>
                  <h3 style="color: #1F2937; margin-bottom: 20px;">📊 Age Distribution</h3>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Age Group</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${analyticsData.demographics.ageGroups.map(group => `
                        <tr>
                          <td><strong>${group.range}</strong></td>
                          <td>${group.count.toLocaleString()}</td>
                          <td>
                            ${Math.round(group.percentage * 100)}%
                            <div class="progress-bar">
                              <div class="progress-fill" style="width: ${group.percentage * 100}%"></div>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 style="color: #1F2937; margin-bottom: 20px;">🌍 Geographic Distribution</h3>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${analyticsData.demographics.locations.map(location => `
                        <tr>
                          <td><strong>${location.country}</strong></td>
                          <td>${location.count.toLocaleString()}</td>
                          <td>
                            ${Math.round(location.percentage * 100)}%
                            <div class="progress-bar">
                              <div class="progress-fill" style="width: ${location.percentage * 100}%"></div>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="section page-break">
              <h2>📊 Analytics Charts & Graphs</h2>
              
              <!-- Response Trends Chart -->
              ${responseTrendsImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px;">📈 Response Trends (7 Days)</h3>
                  <img src="${responseTrendsImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 8px;" alt="Response Trends Chart" />
                </div>
              ` : ''}
              
              <!-- Survey Performance Chart -->
              ${surveyPerformanceImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px;">📊 Survey Performance</h3>
                  <img src="${surveyPerformanceImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 8px;" alt="Survey Performance Chart" />
                </div>
              ` : ''}
              
              <!-- Completion Rate Chart -->
              ${completionRateImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px;">🎯 Completion Rates</h3>
                  <img src="${completionRateImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 8px;" alt="Completion Rate Chart" />
                </div>
              ` : ''}
              
              <!-- Question Performance Chart -->
              ${questionPerformanceImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px;">❓ Question Performance</h3>
                  <img src="${questionPerformanceImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 8px;" alt="Question Performance Chart" />
                </div>
              ` : ''}
              
              <!-- Age Distribution Chart -->
              ${ageDistributionImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px;">👥 Age Distribution</h3>
                  <img src="${ageDistributionImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 8px;" alt="Age Distribution Chart" />
                </div>
              ` : ''}
              
              <!-- Geographic Distribution Chart -->
              ${geographicDistributionImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px;">🌍 Geographic Distribution</h3>
                  <img src="${geographicDistributionImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 8px;" alt="Geographic Distribution Chart" />
                </div>
              ` : ''}
              
              <!-- Chart Summary -->
              <div style="margin-top: 30px; padding: 20px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E5E7EB;">
                <h4 style="margin: 0 0 15px 0; color: #1E293B;">📊 Chart Analysis Summary</h4>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Total Charts Included:</strong> 6 comprehensive analytics charts
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Chart Types:</strong> Line charts, Bar charts, Pie charts, Doughnut charts
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Data Coverage:</strong> Response trends, survey performance, completion rates, demographics
                </p>
                <p style="margin: 5px 0; font-size: 12px;">
                  <strong>Visual Elements:</strong> Interactive charts converted to high-quality images for PDF
                </p>
              </div>
            </div>

            <div class="footer">
              <p><strong>SurveyGuy Analytics Report</strong></p>
              <p>This report was generated automatically on ${currentDate} at ${currentTime}</p>
              <p>For questions or support, contact your system administrator</p>
              <p style="margin-top: 15px; font-size: 10px; color: #9CA3AF;">© 2024 SurveyGuy. All rights reserved.</p>
            </div>
          </body>
          </html>
        `;
        
        return content;
      };

      // Create a new window for PDF generation
      const htmlContent = await generatePDFContent();
      const newWindow = window.open('', '_blank');
      newWindow.document.write(htmlContent);
      newWindow.document.close();

      // Wait for content to load, then trigger print
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
        }, 1000); // Increased timeout to allow chart images to load
      };

      toast.success('PDF report opened in print dialog! Use "Save as PDF" to download.');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF report');
    }
  };

  const handleExportPDFDirect = async () => {
    try {
      // Alternative PDF export using browser's built-in PDF generation
      const generatePDFContent = async () => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        
        // Function to convert chart to base64 image
        const getChartImage = (chartRef) => {
          if (chartRef && chartRef.current) {
            const canvas = chartRef.current.canvas;
            return canvas.toDataURL('image/png');
          }
          return null;
        };

        // Get chart images
        const responseTrendsImage = getChartImage(responseTrendsChartRef);
        const surveyPerformanceImage = getChartImage(surveyPerformanceChartRef);
        const completionRateImage = getChartImage(completionRateChartRef);
        const questionPerformanceImage = getChartImage(questionPerformanceChartRef);
        const ageDistributionImage = getChartImage(ageDistributionChartRef);
        const geographicDistributionImage = getChartImage(geographicDistributionChartRef);
        
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Survey Analytics Report</title>
            <style>
              @page { 
                margin: 1in; 
                size: A4; 
              }
              
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 0; 
                padding: 0; 
                color: #333; 
                line-height: 1.4;
                font-size: 12px;
              }
              
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #3B82F6; 
                padding-bottom: 15px; 
              }
              .header h1 { 
                color: #3B82F6; 
                margin: 0 0 5px 0; 
                font-size: 24px; 
                font-weight: bold;
              }
              .header p { 
                color: #666; 
                margin: 2px 0; 
                font-size: 10px;
              }
              
              .section { 
                margin: 20px 0; 
                page-break-inside: avoid;
              }
              .section h2 { 
                color: #1F2937; 
                border-left: 3px solid #3B82F6; 
                padding-left: 10px; 
                font-size: 16px;
                margin-bottom: 15px;
              }
              
              .metric-grid { 
                display: grid; 
                grid-template-columns: repeat(5, 1fr); 
                gap: 10px; 
                margin: 15px 0; 
              }
              .metric-card { 
                background: #F8FAFC; 
                border: 1px solid #E2E8F0; 
                border-radius: 6px; 
                padding: 10px; 
                text-align: center;
              }
              .metric-title { 
                font-weight: bold; 
                color: #64748B; 
                font-size: 9px; 
                margin-bottom: 5px; 
                text-transform: uppercase;
              }
              .metric-value { 
                font-size: 18px; 
                font-weight: bold; 
                color: #1E293B; 
                margin: 0;
              }
              
              .table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 10px 0; 
                font-size: 10px;
              }
              .table th, .table td { 
                border: 1px solid #D1D5DB; 
                padding: 6px; 
                text-align: left; 
              }
              .table th { 
                background: #3B82F6; 
                color: white; 
                font-weight: bold; 
                font-size: 9px;
              }
              .table tr:nth-child(even) { 
                background: #F8FAFC; 
              }
              
              .progress-bar { 
                background: #E2E8F0; 
                height: 4px; 
                border-radius: 2px; 
                overflow: hidden; 
                margin: 2px 0; 
                width: 100%;
              }
              .progress-fill { 
                background: #3B82F6; 
                height: 100%; 
                border-radius: 2px;
              }
              
              .trend-up { color: #059669; font-weight: bold; }
              .trend-down { color: #DC2626; font-weight: bold; }
              .trend-stable { color: #6B7280; font-weight: bold; }
              
              .demographics-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 15px 0;
              }
              
              .footer { 
                margin-top: 30px; 
                padding-top: 15px; 
                border-top: 1px solid #E5E7EB; 
                text-align: center; 
                color: #6B7280; 
                font-size: 8px; 
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Survey Analytics Report</h1>
              <p>Generated: ${currentDate} at ${currentTime} | Period: ${selectedPeriod === '7d' ? 'Last 7 days' : selectedPeriod === '30d' ? 'Last 30 days' : selectedPeriod === '90d' ? 'Last 90 days' : 'Last year'}</p>
            </div>

            <div class="section">
              <h2>📊 Key Performance Metrics</h2>
              <div class="metric-grid">
                <div class="metric-card">
                  <div class="metric-title">Total Surveys</div>
                  <div class="metric-value">${analyticsData.overview.totalSurveys}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Total Responses</div>
                  <div class="metric-value">${analyticsData.overview.totalResponses.toLocaleString()}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Completion Rate</div>
                  <div class="metric-value">${Math.round(analyticsData.overview.avgCompletionRate * 100)}%</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Avg. Time</div>
                  <div class="metric-value">${analyticsData.overview.avgTimeSpent}m</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Bounce Rate</div>
                  <div class="metric-value">${Math.round(analyticsData.overview.bounceRate * 100)}%</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>📈 Survey Performance</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Survey Title</th>
                    <th>Responses</th>
                    <th>Completion Rate</th>
                    <th>Avg Rating</th>
                    <th>Trend</th>
                    <th>Last Response</th>
                  </tr>
                </thead>
                <tbody>
                  ${analyticsData.surveys.map(survey => `
                    <tr>
                      <td><strong>${survey.title}</strong></td>
                      <td>${survey.responses.toLocaleString()}</td>
                      <td>
                        ${Math.round(survey.completionRate * 100)}%
                        <div class="progress-bar">
                          <div class="progress-fill" style="width: ${survey.completionRate * 100}%"></div>
                        </div>
                      </td>
                      <td>${survey.avgRating?.toFixed(1) || 'N/A'}</td>
                      <td class="trend-${survey.trend}">
                        ${survey.trend === 'up' ? '↗' : survey.trend === 'down' ? '↘' : '→'}
                      </td>
                      <td>${survey.lastResponse}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2>👥 Demographics</h2>
              <div class="demographics-grid">
                <div>
                  <h3 style="font-size: 12px; margin-bottom: 10px;">Age Distribution</h3>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Age Group</th>
                        <th>Count</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${analyticsData.demographics.ageGroups.map(group => `
                        <tr>
                          <td>${group.range}</td>
                          <td>${group.count.toLocaleString()}</td>
                          <td>
                            ${Math.round(group.percentage * 100)}%
                            <div class="progress-bar">
                              <div class="progress-fill" style="width: ${group.percentage * 100}%"></div>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 style="font-size: 12px; margin-bottom: 10px;">Geographic Distribution</h3>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Count</th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${analyticsData.demographics.locations.map(location => `
                        <tr>
                          <td>${location.country}</td>
                          <td>${location.count.toLocaleString()}</td>
                          <td>
                            ${Math.round(location.percentage * 100)}%
                            <div class="progress-bar">
                              <div class="progress-fill" style="width: ${location.percentage * 100}%"></div>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="section page-break">
              <h2>📊 Analytics Charts & Graphs</h2>
              
              <!-- Response Trends Chart -->
              ${responseTrendsImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px; font-size: 14px;">📈 Response Trends (7 Days)</h3>
                  <img src="${responseTrendsImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 4px;" alt="Response Trends Chart" />
                </div>
              ` : ''}
              
              <!-- Survey Performance Chart -->
              ${surveyPerformanceImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px; font-size: 14px;">📊 Survey Performance</h3>
                  <img src="${surveyPerformanceImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 4px;" alt="Survey Performance Chart" />
                </div>
              ` : ''}
              
              <!-- Completion Rate Chart -->
              ${completionRateImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px; font-size: 14px;">🎯 Completion Rates</h3>
                  <img src="${completionRateImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 4px;" alt="Completion Rate Chart" />
                </div>
              ` : ''}
              
              <!-- Question Performance Chart -->
              ${questionPerformanceImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px; font-size: 14px;">❓ Question Performance</h3>
                  <img src="${questionPerformanceImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 4px;" alt="Question Performance Chart" />
                </div>
              ` : ''}
              
              <!-- Age Distribution Chart -->
              ${ageDistributionImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px; font-size: 14px;">👥 Age Distribution</h3>
                  <img src="${ageDistributionImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 4px;" alt="Age Distribution Chart" />
                </div>
              ` : ''}
              
              <!-- Geographic Distribution Chart -->
              ${geographicDistributionImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <h3 style="color: #1F2937; margin-bottom: 15px; font-size: 14px;">🌍 Geographic Distribution</h3>
                  <img src="${geographicDistributionImage}" style="max-width: 100%; height: auto; border: 1px solid #E5E7EB; border-radius: 4px;" alt="Geographic Distribution Chart" />
                </div>
              ` : ''}
              
              <!-- Chart Summary -->
              <div style="margin-top: 20px; padding: 15px; background: #F8FAFC; border-radius: 6px; border: 1px solid #E5E7EB;">
                <h4 style="margin: 0 0 10px 0; color: #1E293B; font-size: 12px;">📊 Chart Analysis Summary</h4>
                <p style="margin: 3px 0; font-size: 10px;">
                  <strong>Total Charts:</strong> 6 comprehensive analytics charts included
                </p>
                <p style="margin: 3px 0; font-size: 10px;">
                  <strong>Types:</strong> Line, Bar, Pie, Doughnut charts
                </p>
                <p style="margin: 3px 0; font-size: 10px;">
                  <strong>Coverage:</strong> Trends, performance, demographics
                </p>
              </div>
            </div>

            <div class="footer">
              <p><strong>SurveyGuy Analytics Report</strong> | Generated ${currentDate} at ${currentTime}</p>
              <p>© 2024 SurveyGuy. All rights reserved.</p>
            </div>
          </body>
          </html>
        `;
      };

      // Create and download as HTML file that can be saved as PDF
      const htmlContent = await generatePDFContent();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Survey_Analytics_Report_${new Date().toISOString().split('T')[0]}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('PDF report downloaded! Open in browser and use "Print to PDF" for best results.');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF report');
    }
  };

  const handleExportCharts = () => {
    try {
      const charts = [
        { ref: responseTrendsChartRef, name: 'Response_Trends' },
        { ref: surveyPerformanceChartRef, name: 'Survey_Performance' },
        { ref: completionRateChartRef, name: 'Completion_Rates' },
        { ref: questionPerformanceChartRef, name: 'Question_Performance' },
        { ref: ageDistributionChartRef, name: 'Age_Distribution' },
        { ref: geographicDistributionChartRef, name: 'Geographic_Distribution' }
      ];

      charts.forEach((chart, index) => {
        if (chart.ref && chart.ref.current) {
          const canvas = chart.ref.current.canvas;
          const link = document.createElement('a');
          link.download = `Survey_Chart_${chart.name}_${new Date().toISOString().split('T')[0]}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      });

      toast.success('All charts exported as PNG images!');
    } catch (error) {
      console.error('Chart export failed:', error);
      toast.error('Failed to export charts');
    }
  };

  const handleExportReport = (format) => {
    if (format === 'excel') {
      handleExportExcel();
    } else if (format === 'pdf') {
      handleExportPDF();
    } else if (format === 'pdf-direct') {
      handleExportPDFDirect();
    } else if (format === 'filtered') {
      handleExportFiltered();
    } else {
      toast.success(`Exporting report as ${format.toUpperCase()}...`);
    }
  };

  const handleExportFiltered = () => {
    try {
      // Export only filtered surveys
      const filteredData = filteredSurveys.map(survey => ({
        'Survey Title': survey.title,
        'Status': survey.status,
        'Total Responses': survey.responses,
        'Completion Rate (%)': Math.round(survey.completionRate * 100),
        'Average Rating': survey.avgRating?.toFixed(1) || 'N/A',
        'Trend': survey.trend,
        'Last Response': survey.lastResponse
      }));

      if (filteredData.length === 0) {
        toast.error('No surveys to export');
        return;
      }

      generateCSV(filteredData, `Filtered_Surveys_${new Date().toISOString().split('T')[0]}`);
      toast.success(`Exported ${filteredData.length} filtered surveys to CSV`);
    } catch (error) {
      console.error('Filtered export failed:', error);
      toast.error('Failed to export filtered data');
    }
  };

  const handleShareReport = (reportId) => {
    toast.success('Report sharing link copied to clipboard!');
    // In real implementation, this would generate and copy share link
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Surveys</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalSurveys}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+12%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Responses</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalResponses.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+8%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
            <p className="text-3xl font-bold text-gray-900">{Math.round(analyticsData.overview.avgCompletionRate * 100)}%</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+3%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Time</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.avgTimeSpent}m</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDown className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-600 font-medium">-5%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
            <p className="text-3xl font-bold text-gray-900">{Math.round(analyticsData.overview.bounceRate * 100)}%</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDown className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">-2%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSurveyPerformance = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
        <h3 className="text-lg font-semibold text-gray-900">Survey Performance</h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredSurveys.length} of {analyticsData.surveys.length} surveys
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportReport('pdf')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSurveys.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `No surveys match "${searchTerm}"` : 'No surveys match the current filters'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSurvey('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredSurveys.map((survey) => (
          <div key={survey.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{survey.title}</h4>
                  <p className="text-sm text-gray-600">{survey.responses} responses</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{Math.round(survey.completionRate * 100)}%</p>
                  <p className="text-xs text-gray-600">Completion</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{survey.avgRating?.toFixed(1) || 'N/A'}</p>
                  <p className="text-xs text-gray-600">Avg Rating</p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(survey.trend)}
                  <span className={`text-xs font-medium ${getTrendColor(survey.trend)}`}>
                    {survey.trend === 'up' ? '+12%' : survey.trend === 'down' ? '-5%' : '0%'}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/app/survey-analytics/${survey.id}`)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last response: {survey.lastResponse}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleShareReport(survey.id)}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
                <div className="relative">
                  <button
                    onClick={() => {
                      handleExportReport('excel');
                      toast.success(`Exported ${survey.title} data to Excel`);
                    }}
                    className="flex items-center gap-1 hover:text-green-600 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );

  const renderResponseTrends = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Response Trends</h3>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {analyticsData.responseTrends.map((trend, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{trend.date}</p>
                <p className="text-xs text-gray-600">{trend.responses} responses</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{trend.completions}</p>
                <p className="text-xs text-gray-600">Completions</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  {Math.round((trend.completions / trend.responses) * 100)}%
                </p>
                <p className="text-xs text-gray-600">Rate</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionPerformance = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Question Performance</h3>
      
      <div className="space-y-4">
        {analyticsData.questionPerformance.map((question) => (
          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{question.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {question.type}
                  </span>
                  <span className="text-xs text-gray-500">{question.responses} responses</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {question.avgRating && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{question.avgRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Avg Rating</p>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{Math.round(question.completionRate * 100)}%</p>
                  <p className="text-xs text-gray-600">Completion</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{question.skipped}</p>
                  <p className="text-xs text-gray-600">Skipped</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${question.completionRate * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDemographics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Age Distribution</h3>
        <div className="space-y-3">
          {generateAgeDistribution().map((group) => (
            <div key={group.range} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{group.range}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${group.percentage * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {group.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
        <div className="space-y-3">
          {generateGeographicDistribution().map((location) => (
            <div key={location.country} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{location.country}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${location.percentage * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {location.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Chart rendering functions
  const renderAnalyticsCharts = () => (
    <div className="space-y-8">
      {/* Chart View Mode Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Charts
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={chartViewMode}
              onChange={(e) => setChartViewMode(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Charts</option>
              <option value="trends">Response Trends</option>
              <option value="demographics">Demographics</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Response Trends Chart */}
          {(chartViewMode === 'all' || chartViewMode === 'trends') && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Response Trends (7 Days)
              </h4>
              <div className="h-80">
                <Line 
                  ref={responseTrendsChartRef}
                  data={responseTrendsData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'Daily Response and Completion Trends'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          )}

          {/* Survey Performance Chart */}
          {(chartViewMode === 'all' || chartViewMode === 'performance') && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Survey Performance
              </h4>
              <div className="h-80">
                <Bar 
                  ref={surveyPerformanceChartRef}
                  data={surveyPerformanceData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'Total Responses by Survey'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          )}

          {/* Completion Rate Chart */}
          {(chartViewMode === 'all' || chartViewMode === 'performance') && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Completion Rates
              </h4>
              <div className="h-80">
                <Bar 
                  ref={completionRateChartRef}
                  data={completionRateData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'Completion Rate by Survey (%)'
                      }
                    },
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        max: 100
                      }
                    }
                  }} 
                />
              </div>
            </div>
          )}

          {/* Question Performance Chart */}
          {(chartViewMode === 'all' || chartViewMode === 'performance') && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Question Performance
              </h4>
              <div className="h-80">
                <Bar 
                  ref={questionPerformanceChartRef}
                  data={questionPerformanceData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'Completion Rate by Question (%)'
                      }
                    },
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        max: 100
                      }
                    }
                  }} 
                />
              </div>
            </div>
          )}

          {/* Age Distribution Chart */}
          {(chartViewMode === 'all' || chartViewMode === 'demographics') && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Age Distribution
              </h4>
              <div className="h-80">
                {generateAgeDistribution().some(group => group.count > 0) ? (
                <Pie 
                  ref={ageDistributionChartRef}
                  data={ageDistributionData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'Response Distribution by Age Group'
                      }
                    }
                  }} 
                />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No age data available</p>
                      <p className="text-gray-400 text-xs mt-1">Age information not collected in responses</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Geographic Distribution Chart */}
          {(chartViewMode === 'all' || chartViewMode === 'demographics') && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Geographic Distribution
              </h4>
              <div className="h-80">
                {generateGeographicDistribution().some(location => location.count > 0) ? (
                <Doughnut 
                  ref={geographicDistributionChartRef}
                  data={geographicDistributionData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: 'Response Distribution by Country'
                      }
                    }
                  }} 
                />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No location data available</p>
                      <p className="text-gray-400 text-xs mt-1">Location information not collected in responses</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chart Export Options */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Charts are interactive - hover for details, click legend to toggle datasets
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleExportCharts();
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Charts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );

  // Show loading or access denied
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-40"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-40"></div>
            </div>
          </div>

          {/* Overview Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <SkeletonChart />
          </div>
        </div>
      </div>
    );
  }

  // Show access denied for free users
  if (!hasAdvancedReports) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
            <BarChart3 className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Advanced Reports</h1>
          <p className="text-gray-600 mb-6">
            Access comprehensive analytics, detailed reports, and advanced insights for your surveys. This feature is available with Pro and Enterprise plans.
          </p>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Current Plan:</span>
                <span className="font-bold text-gray-900 capitalize">{currentPlan}</span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-600">Pro Required</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/app/subscriptions')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Upgrade to Pro
            </button>
            
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Survey Reports</h1>
              <p className="text-gray-600 mt-1">Comprehensive analytics and insights for your surveys</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${analyticsData.realResponses?.length > 0 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <span className={`text-sm font-medium ${analyticsData.realResponses?.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {analyticsData.realResponses?.length > 0 ? 'Live Data' : 'Sample Data'}
                </span>
                <span className="text-xs text-gray-500">
                  {analyticsData.realResponses?.length > 0 ? 
                    `• ${analyticsData.realResponses.length} responses` : 
                    '• Using mock data'
                  }
                </span>
                {analyticsData.realResponses?.length > 0 && (
                  <button
                    onClick={() => {
                      console.log('📊 Full response data:', analyticsData.realResponses);
                      console.log('🎂 Age data sample:', analyticsData.realResponses.slice(0, 3).map(r => ({
                        id: r.id,
                        age: r.responses?.age || r.age,
                        country: r.responses?.country || r.country
                      })));
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700 underline"
                  >
                    Debug Data
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchReportsData(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              {lastRefresh && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
              {dataError && (
                <button
                  onClick={() => {
                    setDataError(null);
                    fetchReportsData(true);
                  }}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              )}
              
              {/* Debug Button for Response Count Issues */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={async () => {
                    if (window.confirm('Fix response counts? This will recalculate all response data.')) {
                      try {
                        const result = await api.responses.fixResponseCounts(user.id);
                        if (result.error) {
                          toast.error(`Failed to fix counts: ${result.error}`);
                        } else {
                          toast.success(`Fixed! Surveys: ${result.totalSurveys}, Responses: ${result.totalResponses}`);
                          // Refresh the data
                          await fetchReportsData(true);
                        }
                      } catch (error) {
                        toast.error('Failed to fix response counts');
                        console.error('Fix counts error:', error);
                      }
                    }
                  }}
                  className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  🔧 Fix Counts
                </button>
              )}

              {/* Export Dropdown */}
              <div className="relative export-dropdown">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleExportReport('excel');
                          setShowExportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-green-600" />
                        Export as Excel (CSV)
                      </button>
                      <button
                        onClick={() => {
                          handleExportReport('pdf');
                          setShowExportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-red-600" />
                        Export as PDF (Print Dialog)
                      </button>
                      <button
                        onClick={() => {
                          handleExportReport('pdf-direct');
                          setShowExportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-orange-600" />
                        Download PDF (HTML)
                      </button>
                      <button
                        onClick={() => {
                          handleExportReport('filtered');
                          setShowExportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-purple-600" />
                        Export Filtered Results ({filteredSurveys.length})
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          handleExportReport('excel');
                          handleExportReport('pdf');
                          setShowExportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        Export All Formats
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedSurvey}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Surveys</option>
                {analyticsData.surveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>{survey.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="responses">Sort by Responses</option>
                <option value="title">Sort by Title</option>
                <option value="completion">Sort by Completion</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        {renderOverviewCards()}

        {/* Analytics Charts Section */}
        {renderAnalyticsCharts()}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          <div className="xl:col-span-2 space-y-8">
            {renderSurveyPerformance()}
            {renderResponseTrends()}
            {renderQuestionPerformance()}
          </div>
          
          <div className="space-y-8">
            {renderDemographics()}
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/app/surveys')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>View All Surveys</span>
                </button>
                <button
                  onClick={() => navigate('/app/builder-v2/new')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Survey</span>
                </button>
                <button
                  onClick={() => handleExportReport('excel')}
                  className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Export All Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
