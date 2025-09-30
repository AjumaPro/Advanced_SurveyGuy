import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Optimized profile fetching with timeout and fallback
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      // Check for impersonation mode
      const impersonationData = sessionStorage.getItem('admin_impersonation');
      if (impersonationData) {
        const { targetUser, originalUser } = JSON.parse(impersonationData);
        console.log('🎭 Impersonation mode active - using target user profile');
        setUserProfile({
          ...targetUser,
          _impersonated: true,
          _originalAdmin: originalUser
        });
        return;
      }

      // Add timeout to prevent hanging on slow connections
      const profilePromise = supabase
        .from('profiles')
        .select('id, role, plan, is_active, is_verified, email') // Include plan and email fields
        .eq('id', userId)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile timeout')), 1500)
      );
      
      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]);
      
      if (!error && profile) {
        // Check if this is the super admin and force enterprise plan if needed
        const userEmail = await supabase.auth.getUser().then(res => res.data.user?.email);
        const isSuperAdmin = userEmail === 'infoajumapro@gmail.com';
        
        if (isSuperAdmin && (profile.plan !== 'enterprise' || profile.role !== 'super_admin')) {
          console.log('🔧 Updating super admin profile to enterprise plan...');
          // Force update the profile to enterprise for super admin
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update({ 
              role: 'super_admin', 
              plan: 'enterprise',
              is_active: true,
              is_verified: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select('id, role, plan, is_active, is_verified, email')
            .single()
            .catch((err) => {
              console.error('Profile update error:', err);
              return null;
            });
          
          setUserProfile(updatedProfile || {
            ...profile,
            role: 'super_admin',
            plan: 'enterprise',
            is_active: true,
            is_verified: true
          });
          
          if (updatedProfile) {
            toast.success('Super admin profile updated to Enterprise plan!');
          }
        } else {
          setUserProfile(profile);
        }
      } else if (error && error.code === 'PGRST116') {
        // Create minimal profile quickly - check if this is the super admin email
        const userEmail = await supabase.auth.getUser().then(res => res.data.user?.email);
        const isSuperAdmin = userEmail === 'infoajumapro@gmail.com';
        
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail,
            role: isSuperAdmin ? 'super_admin' : 'user',
            plan: isSuperAdmin ? 'enterprise' : 'free',
            is_active: true,
            is_verified: true
          })
          .select('id, role, plan, is_active, is_verified')
          .single()
          .catch(() => null);
        
        // Always set a profile, even if creation fails
        setUserProfile(newProfile || {
          id: userId,
          role: isSuperAdmin ? 'super_admin' : 'user',
          plan: isSuperAdmin ? 'enterprise' : 'free',
          is_active: true,
          is_verified: true
        });
      } else {
        // Fallback profile to prevent app breaking
        const userEmail = await supabase.auth.getUser().then(res => res.data.user?.email);
        const isSuperAdmin = userEmail === 'infoajumapro@gmail.com';
        
        setUserProfile({
          id: userId,
          role: isSuperAdmin ? 'super_admin' : 'user',
          plan: isSuperAdmin ? 'enterprise' : 'free',
          is_active: true,
          is_verified: true
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error.message);
      // Always provide fallback profile
      const userEmail = await supabase.auth.getUser().then(res => res.data.user?.email);
      const isSuperAdmin = userEmail === 'infoajumapro@gmail.com';
      
      setUserProfile({
        id: userId,
        role: isSuperAdmin ? 'super_admin' : 'user',
        plan: isSuperAdmin ? 'enterprise' : 'free',
        is_active: true,
        is_verified: true
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session with timeout for faster loading
    const getInitialSession = async () => {
      try {
        // Set a timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 3000)
        );
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          // Continue without session rather than hanging
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Fetch profile in background, completely non-blocking
            setTimeout(() => {
              fetchUserProfile(session.user.id).catch(console.error);
            }, 100); // Small delay to let UI render first
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        // Don't block the UI, continue without session
    } finally {
        if (mounted) {
      setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes with optimized, non-blocking handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        // Update auth state immediately for fast UI response
        setSession(session);
        setUser(session?.user ?? null);

        // Fetch user profile in background without blocking UI
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id).catch(console.error);
          }, 50); // Minimal delay for UI responsiveness
        } else {
          setUserProfile(null);
        }

        // Don't set loading here - let initial session handle it

        // Handle auth events with minimal delay to avoid blocking
        setTimeout(() => {
          if (event === 'SIGNED_IN') {
            toast.success('Welcome back!');
          } else if (event === 'SIGNED_OUT') {
            toast.success('Signed out successfully');
            setUserProfile(null);
          } else if (event === 'SIGNED_UP') {
            toast.success('Account created successfully!');
          }
        }, 0);
      }
    );

    // Cleanup subscription
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Attempting login with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('❌ AuthContext: Login error:', error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ AuthContext: Login successful:', data);
      toast.success('Login successful!');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ AuthContext: Login exception:', error);
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email, password, name) => {
    try {
      console.log('🔐 AuthContext: Attempting registration with Supabase...');
      const { data, error } = await supabase.auth.signUp({
        email, 
        password, 
        options: {
          data: { full_name: name }
        }
      });
      
      if (error) {
        console.error('❌ AuthContext: Registration error:', error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ AuthContext: Registration successful:', data);
      toast.success('Registration successful! Please check your email to confirm your account.');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ AuthContext: Registration exception:', error);
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 AuthContext: Attempting logout...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ AuthContext: Logout error:', error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ AuthContext: Logout successful');
      toast.success('Logged out successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthContext: Logout exception:', error);
      toast.error(error.message || 'Logout failed');
      return { success: false, error: error.message || 'Logout failed' };
    }
  };

  const resetPassword = async (email) => {
    try {
      console.log('🔑 AuthContext: Attempting password reset for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) {
        console.error('❌ AuthContext: Password reset error:', error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ AuthContext: Password reset email sent');
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthContext: Password reset exception:', error);
      toast.error(error.message || 'Password reset failed');
      return { success: false, error: error.message || 'Password reset failed' };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Profile update error:', error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      console.log('✅ Profile updated successfully');
      setUserProfile(data); // Update local state
      toast.success('Profile updated successfully');
      return { success: true, user: data };
      
    } catch (error) {
      console.error('❌ Profile update exception:', error);
      const errorMessage = error.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return userProfile?.role === role || false;
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
  };

  // Helper function to check if user is super admin
  const isSuperAdmin = () => {
    return userProfile?.role === 'super_admin';
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    hasRole,
    isAdmin,
    isSuperAdmin,
    // Supabase client for direct access if needed
    supabase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 