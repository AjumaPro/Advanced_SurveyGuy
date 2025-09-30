import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://waasqqbklnhfrbzfuvzn.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXNxcWJrbG5oZnJiemZ1dnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjQ5ODcsImV4cCI6MjA3MzgwMDk4N30.W0CHR_5kQi6JL7p5qJ2hrHkqme0QWEsxSS4zIlzqv7Q'

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Auth helper functions
export const authHelpers = {
  // Sign up a new user
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData // Additional user metadata
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Sign in an existing user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Sign out the current user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  // Get the current user
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // Get the current session
  getCurrentSession: () => {
    return supabase.auth.getSession()
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const dbHelpers = {
  // Profile operations
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Survey operations
  async getSurveys(userId, options = {}) {
    let query = supabase
      .from('surveys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getPublicSurveys(options = {}) {
    let query = supabase
      .from('surveys')
      .select('*')
      .eq('is_public', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Event operations
  async getEvents(userId, options = {}) {
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async getPublicEvents(options = {}) {
    let query = supabase
      .from('events')
      .select('*')
      .eq('is_public', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Template operations
  async getTemplates(userId, options = {}) {
    let query = supabase
      .from('templates')
      .select('*');

    if (options.publicOnly) {
      query = query.eq('is_public', true);
    } else if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    }

    query = query.order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Notification operations
  async getNotifications(userId, options = {}) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options.unreadOnly) {
      query = query.eq('is_read', false);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async markNotificationAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    return { data, error };
  },

  // Analytics operations
  async recordAnalytics(userId, entityType, entityId, eventType, metadata = {}) {
    const { data, error } = await supabase
      .from('analytics')
      .insert({
        user_id: userId,
        entity_type: entityType,
        entity_id: entityId,
        event_type: eventType,
        metadata
      });
    return { data, error };
  }
}

// Real-time subscriptions helper
export const realtimeHelpers = {
  // Subscribe to profile changes
  subscribeToProfile(userId, callback) {
    return supabase
      .channel(`profile-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  // Subscribe to notifications
  subscribeToNotifications(userId, callback) {
    return supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  // Subscribe to survey responses
  subscribeToSurveyResponses(surveyId, callback) {
    return supabase
      .channel(`survey-responses-${surveyId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'survey_responses',
        filter: `survey_id=eq.${surveyId}`
      }, callback)
      .subscribe();
  }
}

export default supabase
