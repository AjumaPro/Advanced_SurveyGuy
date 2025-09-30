/**
 * Analytics Health Check Utility
 * Verifies that SurveyResponse.js data is properly flowing to analytics dashboards
 */

import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export class AnalyticsHealthCheck {
  constructor() {
    this.results = {
      databaseTables: { status: 'unknown', details: {} },
      dataFlow: { status: 'unknown', details: {} },
      realTimeUpdates: { status: 'unknown', details: {} },
      apiIntegration: { status: 'unknown', details: {} }
    };
  }

  /**
   * Run complete analytics health check
   */
  async runCompleteCheck() {
    console.log('🔍 Starting Analytics Health Check...');
    
    try {
      await Promise.all([
        this.checkDatabaseTables(),
        this.checkDataFlow(),
        this.checkApiIntegration()
      ]);

      const overallStatus = this.determineOverallStatus();
      this.logResults(overallStatus);
      
      return {
        status: overallStatus,
        results: this.results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Analytics Health Check failed:', error);
      return {
        status: 'error',
        error: error.message,
        results: this.results,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check if required database tables exist and have data
   */
  async checkDatabaseTables() {
    console.log('📊 Checking database tables...');
    
    try {
      const tables = ['surveys', 'survey_responses', 'survey_analytics', 'user_analytics'];
      const tableStatus = {};

      for (const table of tables) {
        try {
          const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

          if (error) {
            tableStatus[table] = {
              exists: false,
              error: error.message,
              count: 0
            };
          } else {
            tableStatus[table] = {
              exists: true,
              count: count || 0,
              hasData: (count || 0) > 0
            };
          }
        } catch (err) {
          tableStatus[table] = {
            exists: false,
            error: err.message,
            count: 0
          };
        }
      }

      this.results.databaseTables = {
        status: this.checkTableHealth(tableStatus),
        details: tableStatus
      };

      console.log('✅ Database tables check completed');
    } catch (error) {
      this.results.databaseTables = {
        status: 'error',
        error: error.message,
        details: {}
      };
    }
  }

  /**
   * Check data flow from SurveyResponse to analytics
   */
  async checkDataFlow() {
    console.log('🔄 Checking data flow...');
    
    try {
      // Get recent survey responses
      const { data: recentResponses, error: responsesError } = await supabase
        .from('survey_responses')
        .select(`
          id,
          survey_id,
          submitted_at,
          surveys!inner(id, title, user_id)
        `)
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (responsesError) {
        this.results.dataFlow = {
          status: 'error',
          error: responsesError.message,
          details: {}
        };
        return;
      }

      // Check if analytics records exist for these responses
      const analyticsChecks = [];
      for (const response of recentResponses || []) {
        const { data: analytics, error: analyticsError } = await supabase
          .from('survey_analytics')
          .select('*')
          .eq('survey_id', response.survey_id)
          .single();

        analyticsChecks.push({
          surveyId: response.survey_id,
          surveyTitle: response.surveys?.title || 'Unknown',
          responseId: response.id,
          hasAnalytics: !analyticsError && analytics,
          analyticsError: analyticsError?.message
        });
      }

      // Check user analytics
      const userIds = [...new Set(recentResponses?.map(r => r.surveys?.user_id).filter(Boolean) || [])];
      const userAnalyticsChecks = [];
      
      for (const userId of userIds) {
        const { data: userAnalytics, error: userError } = await supabase
          .from('user_analytics')
          .select('*')
          .eq('user_id', userId)
          .single();

        userAnalyticsChecks.push({
          userId,
          hasUserAnalytics: !userError && userAnalytics,
          userAnalyticsError: userError?.message
        });
      }

      const flowStatus = this.analyzeDataFlow(analyticsChecks, userAnalyticsChecks);
      
      this.results.dataFlow = {
        status: flowStatus,
        details: {
          recentResponses: recentResponses?.length || 0,
          analyticsChecks,
          userAnalyticsChecks,
          summary: {
            responsesWithAnalytics: analyticsChecks.filter(c => c.hasAnalytics).length,
            usersWithAnalytics: userAnalyticsChecks.filter(c => c.hasUserAnalytics).length,
            totalResponses: analyticsChecks.length,
            totalUsers: userAnalyticsChecks.length
          }
        }
      };

      console.log('✅ Data flow check completed');
    } catch (error) {
      this.results.dataFlow = {
        status: 'error',
        error: error.message,
        details: {}
      };
    }
  }

  /**
   * Check API integration and analytics endpoints
   */
  async checkApiIntegration() {
    console.log('🔌 Checking API integration...');
    
    try {
      // Test analytics API endpoints
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        this.results.apiIntegration = {
          status: 'warning',
          error: 'No authenticated user found',
          details: {}
        };
        return;
      }

      // Import the API service
      const { analyticsAPI } = await import('../services/api');
      
      // Test overview stats
      const overviewStats = await analyticsAPI.getOverviewStats(user.id);
      const dashboardData = await analyticsAPI.getDashboardData(user.id);

      this.results.apiIntegration = {
        status: overviewStats.error ? 'error' : 'healthy',
        details: {
          overviewStats: {
            success: !overviewStats.error,
            error: overviewStats.error,
            data: overviewStats
          },
          dashboardData: {
            success: !dashboardData.error,
            error: dashboardData.error,
            hasData: !!(dashboardData.overview || dashboardData.trends)
          }
        }
      };

      console.log('✅ API integration check completed');
    } catch (error) {
      this.results.apiIntegration = {
        status: 'error',
        error: error.message,
        details: {}
      };
    }
  }

  /**
   * Check if database triggers are working
   */
  async checkTriggers() {
    console.log('⚡ Checking database triggers...');
    
    try {
      // Check if analytics trigger exists
      const { data: triggers, error } = await supabase
        .rpc('check_analytics_triggers');

      if (error) {
        // Fallback: try to query trigger information directly
        const { data: triggerInfo } = await supabase
          .from('information_schema.triggers')
          .select('*')
          .eq('trigger_name', 'trigger_update_survey_analytics');

        return {
          status: triggerInfo && triggerInfo.length > 0 ? 'healthy' : 'warning',
          details: {
            triggerExists: !!(triggerInfo && triggerInfo.length > 0),
            triggerInfo
          }
        };
      }

      return {
        status: 'healthy',
        details: triggers
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        details: {}
      };
    }
  }

  /**
   * Test real-time analytics updates
   */
  async testRealTimeUpdates() {
    console.log('📡 Testing real-time updates...');
    
    return new Promise((resolve) => {
      let updateReceived = false;
      const timeout = setTimeout(() => {
        resolve({
          status: updateReceived ? 'healthy' : 'warning',
          details: {
            updateReceived,
            message: updateReceived ? 'Real-time updates working' : 'No real-time updates detected'
          }
        });
      }, 5000);

      const subscription = supabase
        .channel('health-check')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'survey_responses' 
          }, 
          (payload) => {
            console.log('📊 Real-time update received:', payload);
            updateReceived = true;
            subscription.unsubscribe();
            clearTimeout(timeout);
            resolve({
              status: 'healthy',
              details: {
                updateReceived: true,
                payload
              }
            });
          }
        )
        .subscribe();
    });
  }

  /**
   * Helper methods
   */
  checkTableHealth(tableStatus) {
    const requiredTables = ['surveys', 'survey_responses'];
    const optionalTables = ['survey_analytics', 'user_analytics'];

    const missingRequired = requiredTables.filter(table => !tableStatus[table]?.exists);
    const missingOptional = optionalTables.filter(table => !tableStatus[table]?.exists);

    if (missingRequired.length > 0) {
      return 'error';
    } else if (missingOptional.length > 0) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  analyzeDataFlow(analyticsChecks, userAnalyticsChecks) {
    const responsesWithAnalytics = analyticsChecks.filter(c => c.hasAnalytics).length;
    const usersWithAnalytics = userAnalyticsChecks.filter(c => c.hasUserAnalytics).length;
    
    const analyticsCoverage = analyticsChecks.length > 0 ? 
      (responsesWithAnalytics / analyticsChecks.length) * 100 : 100;
    
    const userAnalyticsCoverage = userAnalyticsChecks.length > 0 ? 
      (usersWithAnalytics / userAnalyticsChecks.length) * 100 : 100;

    if (analyticsCoverage >= 90 && userAnalyticsCoverage >= 90) {
      return 'healthy';
    } else if (analyticsCoverage >= 50 || userAnalyticsCoverage >= 50) {
      return 'warning';
    } else {
      return 'error';
    }
  }

  determineOverallStatus() {
    const statuses = Object.values(this.results).map(r => r.status);
    
    if (statuses.includes('error')) {
      return 'error';
    } else if (statuses.includes('warning')) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  logResults(overallStatus) {
    console.log('📊 Analytics Health Check Results:');
    console.log(`Overall Status: ${overallStatus.toUpperCase()}`);
    
    Object.entries(this.results).forEach(([category, result]) => {
      console.log(`${category}: ${result.status.toUpperCase()}`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
    });

    // Show toast notification
    const statusColors = {
      healthy: 'success',
      warning: 'warning', 
      error: 'error'
    };

    toast[statusColors[overallStatus]](
      `Analytics Health: ${overallStatus.toUpperCase()}`,
      { duration: 4000 }
    );
  }

  /**
   * Generate health check report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      overallStatus: this.determineOverallStatus(),
      summary: {
        databaseTables: this.results.databaseTables.status,
        dataFlow: this.results.dataFlow.status,
        apiIntegration: this.results.apiIntegration.status
      },
      details: this.results,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.results.databaseTables.status === 'error') {
      recommendations.push('Run CREATE_ANALYTICS_TABLES.sql to set up required database tables');
    }

    if (this.results.dataFlow.status === 'error') {
      recommendations.push('Check database triggers and ensure survey_analytics table is being updated');
    }

    if (this.results.apiIntegration.status === 'error') {
      recommendations.push('Verify analytics API endpoints are working correctly');
    }

    if (this.results.databaseTables.details?.survey_analytics?.count === 0) {
      recommendations.push('No analytics data found - submit a test survey response to populate analytics');
    }

    return recommendations;
  }
}

/**
 * Convenience function to run health check
 */
export const runAnalyticsHealthCheck = async () => {
  const healthCheck = new AnalyticsHealthCheck();
  return await healthCheck.runCompleteCheck();
};

/**
 * Quick health check for development
 */
export const quickAnalyticsCheck = async () => {
  try {
    const { data: responses } = await supabase
      .from('survey_responses')
      .select('count', { count: 'exact', head: true });

    const { data: analytics } = await supabase
      .from('survey_analytics')
      .select('count', { count: 'exact', head: true });

    console.log(`📊 Quick Check: ${responses?.length || 0} responses, ${analytics?.length || 0} analytics records`);
    
    return {
      responses: responses?.length || 0,
      analytics: analytics?.length || 0,
      status: (analytics?.length || 0) > 0 ? 'healthy' : 'warning'
    };
  } catch (error) {
    console.error('❌ Quick check failed:', error);
    return { status: 'error', error: error.message };
  }
};

export default AnalyticsHealthCheck;
