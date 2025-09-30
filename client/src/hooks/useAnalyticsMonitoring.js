/**
 * Real-time Analytics Monitoring Hook
 * Provides real-time monitoring of survey responses and analytics updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useAnalyticsMonitoring = (options = {}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [errors, setErrors] = useState([]);
  
  const subscriptionRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const pollingIntervalRef = useRef(null);
  const lastCheckTime = useRef(new Date());

  const {
    enableNotifications = true,
    enableRealTimeUpdates = true,
    onNewResponse = null,
    onAnalyticsUpdate = null,
    onError = null,
    reconnectDelay = 5000
  } = options;

  const addToRecentActivity = useCallback((activity) => {
    setRecentActivity(prev => {
      const newActivity = [activity, ...prev.slice(0, 49)]; // Keep last 50 activities
      return newActivity;
    });
  }, []);

  const handleNewResponse = useCallback((payload) => {
    console.log('📊 New survey response detected:', payload);
    
    const activity = {
      id: Date.now(),
      type: 'new_response',
      timestamp: new Date(),
      data: payload,
      surveyId: payload.new?.survey_id,
      responseId: payload.new?.id
    };

    addToRecentActivity(activity);
    setLastUpdate(new Date());
    setUpdateCount(prev => prev + 1);

    if (enableNotifications) {
      toast.success('New survey response received!', {
        duration: 3000,
        icon: '📊'
      });
    }

    if (onNewResponse) {
      onNewResponse(payload);
    }
  }, [enableNotifications, onNewResponse, addToRecentActivity]);

  const handleAnalyticsUpdate = useCallback((payload) => {
    console.log('📈 Analytics updated:', payload);
    
    const activity = {
      id: Date.now(),
      type: 'analytics_update',
      timestamp: new Date(),
      data: payload,
      surveyId: payload.new?.survey_id || payload.old?.survey_id
    };

    addToRecentActivity(activity);

    if (onAnalyticsUpdate) {
      onAnalyticsUpdate(payload);
    }
  }, [onAnalyticsUpdate, addToRecentActivity]);

  const handleError = useCallback((error) => {
    console.error('❌ Analytics monitoring error:', error);
    
    const errorActivity = {
      id: Date.now(),
      type: 'error',
      timestamp: new Date(),
      data: { error: error.message }
    };

    setErrors(prev => [errorActivity, ...prev.slice(0, 19)]); // Keep last 20 errors
    addToRecentActivity(errorActivity);

    // Only show toast for critical errors, not for expected issues like missing realtime
    if (enableNotifications && !error.message.includes('Realtime') && !error.message.includes('subscription')) {
      toast.error(`Analytics monitoring error: ${error.message}`);
    } else {
      console.warn('⚠️ Analytics monitoring issue (non-critical):', error.message);
    }

    if (onError) {
      onError(error);
    }
  }, [enableNotifications, onError, addToRecentActivity]);

  const connect = useCallback(() => {
    if (!user || !enableRealTimeUpdates) return;

    console.log('🔌 Connecting to analytics monitoring...');

    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    try {
      // First, check if we can access the tables
      const checkTableAccess = async () => {
        try {
          const { error } = await supabase
            .from('survey_responses')
            .select('id')
            .limit(1);
          
          if (error) {
            console.warn('⚠️ Cannot access survey_responses table:', error.message);
            return false;
          }
          return true;
        } catch (err) {
          console.warn('⚠️ Table access check failed:', err.message);
          return false;
        }
      };

      checkTableAccess().then((hasAccess) => {
        if (!hasAccess) {
          console.warn('⚠️ Skipping realtime subscription due to table access issues');
          setIsConnected(false);
          return;
        }

        const subscription = supabase
          .channel('analytics-monitoring')
          .on('postgres_changes', 
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'survey_responses',
              filter: `user_id=eq.${user.id}` // Add RLS filter
            }, 
            handleNewResponse
          )
          .on('postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'survey_analytics',
              filter: `user_id=eq.${user.id}` // Add RLS filter
            },
            handleAnalyticsUpdate
          )
          .on('postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'user_analytics',
              filter: `user_id=eq.${user.id}` // Add RLS filter
            },
            handleAnalyticsUpdate
          )
          .on('system', { event: 'SUBSCRIPTION_ERROR' }, (error) => {
            console.error('❌ Realtime subscription error:', error);
            handleError(new Error(`Realtime subscription failed: ${error.message || 'Unknown error'}`));
            // Don't schedule reconnect for subscription errors - they usually indicate config issues
          })
          .on('system', { event: 'CHANNEL_ERROR' }, (error) => {
            console.error('❌ Channel error:', error);
            handleError(new Error(`Channel error: ${error.message || 'Unknown error'}`));
          })
          .subscribe((status, err) => {
            console.log('📡 Analytics monitoring status:', status, err ? `Error: ${err.message}` : '');
            
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              reconnectAttempts.current = 0;
              
              const activity = {
                id: Date.now(),
                type: 'connection',
                timestamp: new Date(),
                data: { status: 'connected' }
              };
              addToRecentActivity(activity);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              setIsConnected(false);
              const errorMessage = err?.message || `Connection failed: ${status}`;
              handleError(new Error(errorMessage));
              
              // Start polling fallback when realtime fails
              if (!pollingIntervalRef.current) {
                startPollingFallback();
              }
              
              // Only schedule reconnect for network issues, not permission issues
              if (status === 'TIMED_OUT') {
                scheduleReconnect();
              }
            } else if (status === 'CLOSED') {
              setIsConnected(false);
              console.log('📡 Analytics monitoring connection closed');
              
              // Start polling fallback when connection is closed
              if (!pollingIntervalRef.current) {
                startPollingFallback();
              }
            }
          });

        subscriptionRef.current = subscription;
      });

    } catch (error) {
      console.error('❌ Failed to setup analytics monitoring:', error);
      handleError(error);
      // Don't schedule reconnect for setup errors
    }
  }, [user, enableRealTimeUpdates, handleNewResponse, handleAnalyticsUpdate, handleError, addToRecentActivity]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    reconnectAttempts.current++;
    console.log(`🔄 Scheduling reconnect attempt ${reconnectAttempts.current}/${maxReconnectAttempts} in ${reconnectDelay}ms`);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectDelay);
  }, [connect, reconnectDelay, maxReconnectAttempts]);

  // Polling fallback for when realtime is not available
  const startPollingFallback = useCallback(() => {
    if (pollingIntervalRef.current) return;
    
    console.log('🔄 Starting polling fallback for analytics monitoring...');
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        // Check for new survey responses since last check
        const { data: newResponses, error } = await supabase
          .from('survey_responses')
          .select('id, survey_id, submitted_at, surveys!inner(user_id)')
          .gte('submitted_at', lastCheckTime.current.toISOString())
          .limit(10);
        
        if (error) {
          console.warn('⚠️ Polling check failed:', error.message);
          return;
        }
        
        if (newResponses && newResponses.length > 0) {
          // Filter responses for current user
          const userResponses = newResponses.filter(response => 
            response.surveys?.user_id === user.id
          );
          
          userResponses.forEach(response => {
            const payload = {
              new: {
                id: response.id,
                survey_id: response.survey_id,
                submitted_at: response.submitted_at
              }
            };
            handleNewResponse(payload);
          });
          
          lastCheckTime.current = new Date();
        }
      } catch (error) {
        console.warn('⚠️ Polling error:', error.message);
      }
    }, 30000); // Check every 30 seconds
  }, [user, handleNewResponse]);

  const stopPollingFallback = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log('🔄 Stopped polling fallback');
    }
  }, []);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting from analytics monitoring...');
    
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    stopPollingFallback();
    setIsConnected(false);
    
    const activity = {
      id: Date.now(),
      type: 'connection',
      timestamp: new Date(),
      data: { status: 'disconnected' }
    };
    addToRecentActivity(activity);
  }, [addToRecentActivity, stopPollingFallback]);

  const clearActivity = useCallback(() => {
    setRecentActivity([]);
    setErrors([]);
    setUpdateCount(0);
  }, []);

  const getActivitySummary = useCallback(() => {
    const now = new Date();
    const last24h = now.getTime() - (24 * 60 * 60 * 1000);
    
    const recentResponses = recentActivity.filter(
      activity => activity.type === 'new_response' && activity.timestamp.getTime() > last24h
    ).length;

    const recentErrors = errors.filter(
      error => error.timestamp.getTime() > last24h
    ).length;

    return {
      totalActivities: recentActivity.length,
      recentResponses,
      recentErrors,
      lastUpdate,
      updateCount,
      isConnected
    };
  }, [recentActivity, errors, lastUpdate, updateCount, isConnected]);

  // Auto-connect when user changes
  useEffect(() => {
    if (user && enableRealTimeUpdates) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, enableRealTimeUpdates, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      stopPollingFallback();
    };
  }, [disconnect, stopPollingFallback]);

  return {
    // Connection status
    isConnected,
    lastUpdate,
    updateCount,
    
    // Activity data
    recentActivity,
    errors,
    activitySummary: getActivitySummary(),
    
    // Controls
    connect,
    disconnect,
    clearActivity,
    
    // Utility functions
    getActivitySummary
  };
};

/**
 * Hook for monitoring specific survey analytics
 */
export const useSurveyAnalyticsMonitoring = (surveyId, options = {}) => {
  const [surveyUpdates, setSurveyUpdates] = useState([]);
  const [lastSurveyUpdate, setLastSurveyUpdate] = useState(null);
  const subscriptionRef = useRef(null);

  const {
    enableRealTimeUpdates = true,
    onSurveyUpdate = null
  } = options;

  const handleSurveyUpdate = useCallback((payload) => {
    console.log('📊 Survey analytics updated:', payload);
    
    const update = {
      id: Date.now(),
      timestamp: new Date(),
      data: payload,
      type: payload.eventType || 'update'
    };

    setSurveyUpdates(prev => [update, ...prev.slice(0, 49)]);
    setLastSurveyUpdate(new Date());

    if (onSurveyUpdate) {
      onSurveyUpdate(payload);
    }
  }, [onSurveyUpdate]);

  useEffect(() => {
    if (!surveyId || !enableRealTimeUpdates) return;

    const subscription = supabase
      .channel(`survey-analytics-${surveyId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'survey_analytics',
          filter: `survey_id=eq.${surveyId}`
        },
        handleSurveyUpdate
      )
      .subscribe();

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [surveyId, enableRealTimeUpdates, handleSurveyUpdate]);

  return {
    surveyUpdates,
    lastSurveyUpdate,
    updateCount: surveyUpdates.length
  };
};

/**
 * Hook for monitoring user-level analytics
 */
export const useUserAnalyticsMonitoring = (userId, options = {}) => {
  const [userUpdates, setUserUpdates] = useState([]);
  const [lastUserUpdate, setLastUserUpdate] = useState(null);
  const subscriptionRef = useRef(null);

  const {
    enableRealTimeUpdates = true,
    onUserUpdate = null
  } = options;

  const handleUserUpdate = useCallback((payload) => {
    console.log('👤 User analytics updated:', payload);
    
    const update = {
      id: Date.now(),
      timestamp: new Date(),
      data: payload,
      type: payload.eventType || 'update'
    };

    setUserUpdates(prev => [update, ...prev.slice(0, 49)]);
    setLastUserUpdate(new Date());

    if (onUserUpdate) {
      onUserUpdate(payload);
    }
  }, [onUserUpdate]);

  useEffect(() => {
    if (!userId || !enableRealTimeUpdates) return;

    const subscription = supabase
      .channel(`user-analytics-${userId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_analytics',
          filter: `user_id=eq.${userId}`
        },
        handleUserUpdate
      )
      .subscribe();

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [userId, enableRealTimeUpdates, handleUserUpdate]);

  return {
    userUpdates,
    lastUserUpdate,
    updateCount: userUpdates.length
  };
};

export default useAnalyticsMonitoring;
