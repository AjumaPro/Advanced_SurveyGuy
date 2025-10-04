import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Key,
  Camera,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  FileText,
  Archive,
  ShieldCheck,
  QrCode,
  TrendingUp,
  BarChart3,
  Globe
} from 'lucide-react';

const AccountManagement = () => {
  const { user, signOut, userProfile } = useAuth();
  const { currentPlan, isFreePlan } = useFeatureAccess();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    surveys: true,
    responses: true,
    events: true,
    forms: true,
    qrMessages: true,
    profile: true
  });
  const [availableTables, setAvailableTables] = useState({
    surveys: true,
    responses: true,
    events: true,
    forms: false,
    qrMessages: false
  });
  
  // New state for enhanced features
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [securityScore, setSecurityScore] = useState(0);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  const fileInputRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    bio: '',
    website: '',
    location: '',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching profile for user:', user?.id, user?.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('📊 Profile query result:', { data, error });

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log('Profile not found, creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            role: 'user',
            plan: 'free',
            is_active: true,
            is_verified: user.email_confirmed_at ? true : false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || '',
          email: newProfile.email || user.email || '',
          phone: newProfile.phone || '',
          company: newProfile.company || '',
          bio: newProfile.bio || '',
          website: newProfile.website || '',
          location: newProfile.location || '',
          timezone: newProfile.timezone || 'UTC',
          notifications: newProfile.notification_preferences || {
            email: true,
            push: true,
            sms: false,
            marketing: false
          }
        });
      } else if (error) {
        throw error;
      } else {
        // Profile exists
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        company: data.company || '',
        bio: data.bio || '',
        website: data.website || '',
        location: data.location || '',
        timezone: data.timezone || 'UTC',
        notifications: data.notification_preferences || {
          email: true,
          push: true,
          sms: false,
          marketing: false
        }
      });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If profiles table doesn't exist, create a fallback profile
      if (error.message?.includes('relation "profiles" does not exist') || 
          error.message?.includes('table "profiles" does not exist')) {
        console.log('Profiles table does not exist, using fallback profile data');
        const fallbackProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          role: 'user',
          plan: 'free',
          is_active: true,
          is_verified: user.email_confirmed_at ? true : false
        };
        
        setProfile(fallbackProfile);
        setFormData({
          full_name: fallbackProfile.full_name || '',
          email: fallbackProfile.email || user.email || '',
          phone: '',
          company: '',
          bio: '',
          website: '',
          location: '',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          }
        });
        toast.error('Profile loaded with limited functionality. Please contact support to set up your profile.');
      } else {
        // Try to use userProfile from AuthContext as fallback
        if (userProfile) {
          console.log('🔄 Using userProfile from AuthContext as fallback');
          setProfile(userProfile);
          setFormData({
            full_name: userProfile.full_name || '',
            email: userProfile.email || user.email || '',
            phone: userProfile.phone || '',
            company: userProfile.company || '',
            bio: userProfile.bio || '',
            website: userProfile.website || '',
            location: userProfile.location || '',
            timezone: userProfile.timezone || 'UTC',
            notifications: userProfile.notification_preferences || {
              email: true,
              push: true,
              sms: false,
              marketing: false
            }
          });
          toast.error('Profile loaded from cache. Some features may be limited.');
        } else {
          toast.error('Failed to load profile');
          setRetryCount(prev => prev + 1);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user, userProfile]);

  const fetchActivityLog = useCallback(async () => {
    try {
      // Mock activity log - in real app, fetch from database
      const mockActivity = [
        {
          id: 1,
          action: 'Profile Updated',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          device: 'Chrome on macOS',
          ip: '192.168.1.1'
        },
        {
          id: 2,
          action: 'Password Changed',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          device: 'Safari on iOS',
          ip: '192.168.1.2'
        },
        {
          id: 3,
          action: 'Survey Created',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          device: 'Chrome on Windows',
          ip: '192.168.1.3'
        }
      ];
      setActivityLog(mockActivity);
    } catch (error) {
      console.error('Error fetching activity log:', error);
    }
  }, []);

  const fetchActiveSessions = useCallback(async () => {
    try {
      // Mock active sessions
      const mockSessions = [
        {
          id: 1,
          device: 'Chrome on macOS',
          location: 'Accra, Ghana',
          lastActive: new Date(Date.now() - 30 * 60 * 1000),
          current: true
        },
        {
          id: 2,
          device: 'Safari on iOS',
          location: 'Kumasi, Ghana',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
          current: false
        }
      ];
      setActiveSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  }, []);

  const check2FAStatus = useCallback(async () => {
    // Mock 2FA check
    setTwoFactorEnabled(false);
  }, []);

  const fetchUsageStats = useCallback(async () => {
    try {
      const { data: surveys } = await supabase
        .from('surveys')
        .select('id, created_at, status')
        .eq('user_id', user.id);

      const { data: responses } = await supabase
        .from('survey_responses')
        .select('id, submitted_at')
        .in('survey_id', surveys?.map(s => s.id) || []);

      setUsageStats({
        totalSurveys: surveys?.length || 0,
        publishedSurveys: surveys?.filter(s => s.status === 'published').length || 0,
        totalResponses: responses?.length || 0,
        responsesThisMonth: responses?.filter(r => 
          new Date(r.submitted_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length || 0
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    }
  }, [user]);

  const calculateSecurityScore = useCallback(() => {
    let score = 0;
    
    // Email verified
    if (user?.email_confirmed_at) score += 25;
    
    // Strong password (mock check)
    if (passwordData.newPassword.length >= 8) score += 25;
    
    // Two-factor authentication
    if (twoFactorEnabled) score += 30;
    
    // Recent password change
    const lastPasswordChange = localStorage.getItem('lastPasswordChange');
    if (lastPasswordChange && Date.now() - new Date(lastPasswordChange).getTime() < 90 * 24 * 60 * 60 * 1000) {
      score += 20;
    }
    
    setSecurityScore(Math.min(score, 100));
  }, [user, passwordData.newPassword, twoFactorEnabled]);

  useEffect(() => {
    console.log('👤 User object in AccountManagement:', user);
    console.log('👤 UserProfile object in AccountManagement:', userProfile);
    
    if (user) {
      fetchProfile();
      fetchActivityLog();
      fetchActiveSessions();
      fetchUsageStats();
      calculateSecurityScore();
      check2FAStatus();
    } else {
      console.log('❌ No user object found in AccountManagement');
    }
  }, [user, userProfile, fetchProfile, fetchUsageStats, calculateSecurityScore, fetchActivityLog, fetchActiveSessions, check2FAStatus]);

  const handleRetryProfile = () => {
    setRetryCount(0);
    fetchProfile();
  };

  const testDatabaseConnection = async () => {
    try {
      console.log('🔍 Testing database connection...');
      
      // Test 1: Basic connection
      const { error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (testError) {
        console.error('❌ Database connection test failed:', testError);
        toast.error(`Database connection failed: ${testError.message}`);
        return false;
      }
      
      console.log('✅ Database connection test passed');
      
      // Test 2: Check if user profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code === 'PGRST116') {
        console.log('⚠️ User profile does not exist, attempting to create...');
        toast.warning('Profile not found, attempting to create one...');
        return false;
      } else if (profileError) {
        console.error('❌ Profile access error:', profileError);
        toast.error(`Profile access error: ${profileError.message}`);
        return false;
      }
      
      console.log('✅ Profile access test passed:', profileData);
      toast.success('Database connection and profile access working correctly!');
      return true;
      
    } catch (error) {
      console.error('💥 Database test failed:', error);
      toast.error(`Database test failed: ${error.message}`);
      return false;
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('💾 Attempting to save profile for user:', user?.id);
      console.log('📝 Profile data to save:', formData);
      
      // Validate required fields
      if (!formData.full_name || formData.full_name.trim() === '') {
        toast.error('Full name is required');
        return;
      }

      // Show loading state
      toast.loading('Saving profile...', { id: 'profile-save' });
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone?.trim() || null,
          company: formData.company?.trim() || null,
          bio: formData.bio?.trim() || null,
          website: formData.website?.trim() || null,
          location: formData.location?.trim() || null,
          timezone: formData.timezone || 'UTC',
          notification_preferences: formData.notifications || {
            email: true,
            push: true,
            sms: false,
            marketing: false
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      console.log('💾 Save result:', { data, error });

      if (error) {
        console.error('❌ Profile save error details:', error);
        toast.dismiss('profile-save');
        
        // Handle specific error cases
        if (error.message?.includes('relation "profiles" does not exist') || 
            error.message?.includes('table "profiles" does not exist')) {
          toast.error('Database table not found. Please run the setup script.');
          setEditing(false);
          return;
        }
        
        if (error.message?.includes('permission denied') || error.message?.includes('insufficient_privilege')) {
          toast.error('Permission denied. Please check your account permissions.');
          setEditing(false);
          return;
        }
        
        if (error.code === 'PGRST116') {
          toast.error('Profile not found. Creating new profile...');
          // Try to create a new profile
          await createNewProfile();
          return;
        }
        
        if (error.message?.includes('infinite recursion')) {
          toast.error('Database policy error. Please run the recursion fix script.');
          setEditing(false);
          return;
        }
        
        throw error;
      }

      if (data && data.length > 0) {
        console.log('✅ Profile updated successfully:', data[0]);
        toast.dismiss('profile-save');
        toast.success('Profile updated successfully! 🎉');
        setEditing(false);
        setProfile(data[0]);
        // Update form data with the saved data
        setFormData({
          ...formData,
          ...data[0],
          notifications: data[0].notification_preferences || formData.notifications
        });
      } else {
        console.log('⚠️ No data returned from update');
        toast.dismiss('profile-save');
        toast.error('Profile update completed but no data returned');
        setEditing(false);
      }
    } catch (error) {
      console.error('💥 Unexpected error updating profile:', error);
      toast.dismiss('profile-save');
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    }
  };

  const createNewProfile = async () => {
    try {
      console.log('🆕 Creating new profile for user:', user?.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name.trim(),
          phone: formData.phone?.trim() || null,
          company: formData.company?.trim() || null,
          bio: formData.bio?.trim() || null,
          website: formData.website?.trim() || null,
          location: formData.location?.trim() || null,
          timezone: formData.timezone || 'UTC',
          notification_preferences: formData.notifications || {
            email: true,
            push: true,
            sms: false,
            marketing: false
          },
          role: 'user',
          plan: 'free',
          is_active: true,
          is_verified: user.email_confirmed_at ? true : false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Profile creation error:', error);
        toast.error('Failed to create profile. Please try again.');
        return;
      }

      console.log('✅ Profile created successfully:', data);
      toast.success('Profile created and updated successfully! 🎉');
      setEditing(false);
      setProfile(data);
      setFormData({
        ...formData,
        ...data,
        notifications: data.notification_preferences || formData.notifications
      });
    } catch (error) {
      console.error('💥 Error creating profile:', error);
      toast.error(`Failed to create profile: ${error.message || 'Unknown error'}`);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Sign out user
      await signOut();
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };




  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = async () => {
    if (!avatarFile) return;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast.success('Avatar updated successfully');
      setShowAvatarModal(false);
      fetchProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      // Mock session termination
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success('Session terminated successfully');
    } catch (error) {
      console.error('Error terminating session:', error);
      toast.error('Failed to terminate session');
    }
  };

  const enable2FA = async () => {
    try {
      // Mock 2FA setup
      setTwoFactorEnabled(true);
      setSecurityScore(prev => Math.min(prev + 30, 100));
      toast.success('Two-factor authentication enabled');
      setShow2FAModal(false);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable two-factor authentication');
    }
  };

  const createBackup = async () => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);
      
      // Simulate backup progress
      const interval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsBackingUp(false);
            toast.success('Backup created successfully');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
      setIsBackingUp(false);
    }
  };

  const getUserData = async () => {
    const result = {
      surveys: [],
      responses: [],
      events: [],
      forms: [],
      qrMessages: []
    };

    try {
      // First get user's surveys to get survey IDs
      const { data: surveys, error: surveysError } = await supabase
        .from('surveys')
        .select('*')
        .eq('user_id', user.id);

      if (surveysError) {
        console.warn('Error fetching surveys:', surveysError);
      } else {
        result.surveys = surveys || [];
      }

      const surveyIds = result.surveys?.map(s => s.id) || [];

      // Get responses for user's surveys
      if (surveyIds.length > 0) {
        const { data: responses, error: responsesError } = await supabase
          .from('survey_responses')
          .select('*')
          .in('survey_id', surveyIds);

        if (responsesError) {
          console.warn('Error fetching responses:', responsesError);
        } else {
          result.responses = responses || [];
        }
      }

      // Get events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id);

      if (eventsError) {
        console.warn('Error fetching events:', eventsError);
      } else {
        result.events = events || [];
      }

      // Get forms (handle case where table doesn't exist)
      try {
        const { data: forms, error: formsError } = await supabase
          .from('forms')
          .select('*')
          .eq('user_id', user.id);

        if (formsError) {
          console.warn('Forms table not found or error fetching forms:', formsError);
          result.forms = [];
          setAvailableTables(prev => ({ ...prev, forms: false }));
        } else {
          result.forms = forms || [];
          setAvailableTables(prev => ({ ...prev, forms: true }));
        }
      } catch (formsTableError) {
        console.warn('Forms table does not exist:', formsTableError);
        result.forms = [];
        setAvailableTables(prev => ({ ...prev, forms: false }));
      }

      // Get QR messages (handle case where table doesn't exist)
      try {
        const { data: qrMessages, error: qrError } = await supabase
          .from('qr_messages')
          .select('*')
          .eq('user_id', user.id);

        if (qrError) {
          console.warn('QR messages table not found or error fetching QR messages:', qrError);
          result.qrMessages = [];
          setAvailableTables(prev => ({ ...prev, qrMessages: false }));
        } else {
          result.qrMessages = qrMessages || [];
          setAvailableTables(prev => ({ ...prev, qrMessages: true }));
        }
      } catch (qrTableError) {
        console.warn('QR messages table does not exist:', qrTableError);
        result.qrMessages = [];
        setAvailableTables(prev => ({ ...prev, qrMessages: false }));
      }

      return result;
    } catch (error) {
      console.error('Error in getUserData:', error);
      throw error;
    }
  };

  const exportUserData = async (format = 'json', options = null) => {
    try {
      toast.loading('Preparing your data export...', { id: 'export' });
      
      const data = await getUserData();
      const selectedOptions = options || exportOptions;
      
      const exportData = {
        user: selectedOptions.profile ? {
          id: user.id,
          email: user.email,
          profile: profile
        } : null,
        surveys: selectedOptions.surveys ? data.surveys : [],
        responses: selectedOptions.responses ? data.responses : [],
        events: selectedOptions.events ? data.events : [],
        forms: selectedOptions.forms ? data.forms : [],
        qrMessages: selectedOptions.qrMessages ? data.qrMessages : [],
        exportInfo: {
          exportedAt: new Date().toISOString(),
          totalSurveys: selectedOptions.surveys ? data.surveys.length : 0,
          totalResponses: selectedOptions.responses ? data.responses.length : 0,
          totalEvents: selectedOptions.events ? data.events.length : 0,
          totalForms: selectedOptions.forms ? data.forms.length : 0,
          totalQRMessages: selectedOptions.qrMessages ? data.qrMessages.length : 0,
          exportOptions: selectedOptions
        }
      };

      let blob, filename, mimeType;

      if (format === 'json') {
        blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        filename = `surveyguy-data-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (format === 'csv') {
        const csvData = convertToCSV(exportData);
        blob = new Blob([csvData], { type: 'text/csv' });
        filename = `surveyguy-data-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      // Create and download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const selectedCount = Object.values(selectedOptions).filter(Boolean).length;
      toast.success(`Data exported successfully! ${exportData.exportInfo.totalSurveys} surveys, ${exportData.exportInfo.totalResponses} responses`, { id: 'export' });
      
      if (showExportModal) {
        setShowExportModal(false);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error(`Failed to export data: ${error.message}`, { id: 'export' });
    }
  };

  const convertToCSV = (data) => {
    const csvRows = [];
    
    // Add metadata
    csvRows.push('Export Information');
    csvRows.push(`Exported At,${data.exportInfo.exportedAt}`);
    csvRows.push(`Total Surveys,${data.exportInfo.totalSurveys}`);
    csvRows.push(`Total Responses,${data.exportInfo.totalResponses}`);
    csvRows.push(`Total Events,${data.exportInfo.totalEvents}`);
    csvRows.push(`Total Forms,${data.exportInfo.totalForms}`);
    csvRows.push(`Total QR Messages,${data.exportInfo.totalQRMessages}`);
    csvRows.push('');
    
    // Add surveys
    if (data.surveys.length > 0) {
      csvRows.push('Surveys');
      csvRows.push('ID,Title,Status,Created At,Updated At,Description');
      data.surveys.forEach(survey => {
        csvRows.push(`${survey.id},"${survey.title}","${survey.status}","${survey.created_at}","${survey.updated_at}","${survey.description || ''}"`);
      });
      csvRows.push('');
    }
    
    // Add responses
    if (data.responses.length > 0) {
      csvRows.push('Survey Responses');
      csvRows.push('ID,Survey ID,Response Data,Submitted At,IP Address');
      data.responses.forEach(response => {
        csvRows.push(`${response.id},${response.survey_id},"${JSON.stringify(response.response_data)}","${response.submitted_at}","${response.ip_address || ''}"`);
      });
      csvRows.push('');
    }
    
    // Add events
    if (data.events.length > 0) {
      csvRows.push('Events');
      csvRows.push('ID,Title,Description,Date,Location,Status');
      data.events.forEach(event => {
        csvRows.push(`${event.id},"${event.title}","${event.description || ''}","${event.event_date}","${event.location || ''}","${event.status}"`);
      });
      csvRows.push('');
    }
    
    return csvRows.join('\n');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'data', name: 'Data & Privacy', icon: Download }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (!profile && retryCount > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Loading Failed</h2>
          <p className="text-gray-600 mb-4">
            We couldn't load your profile information. This might be a temporary issue.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetryProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={testDatabaseConnection}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Database Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Management</h1>
          <p className="text-gray-600">Manage your account settings, security, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    {!editing ? (
                      <div className="flex items-center space-x-2">
                      <button
                          onClick={() => {
                            console.log('🖊️ Starting profile edit mode');
                            setEditing(true);
                          }}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                        <button
                          onClick={testDatabaseConnection}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Test DB</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditing(false);
                            fetchProfile();
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Avatar Section */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {profile?.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt="Profile" 
                              className="w-24 h-24 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12" />
                          )}
                        </div>
                        <button
                          onClick={() => setShowAvatarModal(true)}
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow border-2 border-blue-200"
                        >
                          <Camera className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile Picture</h3>
                        <p className="text-gray-600 text-sm mb-3">Upload a profile picture to personalize your account</p>
                        <button
                          onClick={() => setShowAvatarModal(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Change Avatar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!editing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                      <option value="Asia/Shanghai">Shanghai</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                  {/* Security Score */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
                        <p className="text-gray-600 text-sm">Your account security level</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">{securityScore}/100</div>
                        <div className="text-sm text-gray-500">Security Level</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${securityScore}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${user?.email_confirmed_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={user?.email_confirmed_at ? 'text-green-700' : 'text-gray-500'}>Email Verified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={twoFactorEnabled ? 'text-green-700' : 'text-gray-500'}>2FA Enabled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-green-700">Strong Password</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Password Change */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Password</h3>
                          <p className="text-sm text-gray-600">Change your account password</p>
                        </div>
                        <button
                          onClick={() => setShowPasswordForm(!showPasswordForm)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Key className="w-4 h-4" />
                          <span>{showPasswordForm ? 'Cancel' : 'Change Password'}</span>
                        </button>
                      </div>

                      {showPasswordForm && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handlePasswordChange}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Update Password
                            </button>
                            <button
                              onClick={() => setShowPasswordForm(false)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            twoFactorEnabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <button
                            onClick={() => setShow2FAModal(true)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              twoFactorEnabled
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                          </button>
                        </div>
                      </div>
                      {twoFactorEnabled && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 text-green-800">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-medium">Two-factor authentication is active</span>
                          </div>
                          <p className="text-green-700 text-sm mt-1">
                            Your account is protected with an additional security layer.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Active Sessions */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">Active Sessions</h3>
                          <p className="text-sm text-gray-600">Manage your active login sessions</p>
                        </div>
                        <button
                          onClick={() => setShowSessionModal(true)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View All Sessions
                        </button>
                      </div>
                      <div className="space-y-3">
                        {activeSessions.slice(0, 3).map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                {session.device.includes('mobile') ? (
                                  <Smartphone className="w-4 h-4 text-blue-600" />
                                ) : session.device.includes('tablet') ? (
                                  <Tablet className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Monitor className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{session.device}</p>
                                <p className="text-sm text-gray-600">{session.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {session.current && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Current
                                </span>
                              )}
                              <button
                                onClick={() => terminateSession(session.id)}
                                disabled={session.current}
                                className="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Account Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Email Verified</span>
                          <div className="flex items-center space-x-2">
                            {user?.email_confirmed_at ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-sm font-medium">
                              {user?.email_confirmed_at ? 'Verified' : 'Not Verified'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Account Created</span>
                          <span className="text-sm font-medium">
                            {new Date(user?.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Current Plan</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isFreePlan ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {currentPlan}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <h3 className="font-medium text-red-900 mb-4">Danger Zone</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                          <p className="text-sm text-red-700 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Activity</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Usage Statistics */}
                    {usageStats && (
                      <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-blue-600">{usageStats.totalSurveys}</p>
                                <p className="text-sm text-blue-800">Total Surveys</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-green-600">{usageStats.totalResponses}</p>
                                <p className="text-sm text-green-800">Total Responses</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Globe className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-purple-600">{usageStats.publishedSurveys}</p>
                                <p className="text-sm text-purple-800">Published</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-orange-600">{usageStats.responsesThisMonth}</p>
                                <p className="text-sm text-orange-800">This Month</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowSessionModal(true)}
                          className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Monitor className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">View Sessions</span>
                        </button>
                        <button
                          onClick={createBackup}
                          className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Archive className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">Create Backup</span>
                        </button>
                        <button
                          onClick={exportUserData}
                          className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium">Export Data</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activity Log */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View All Activity
                      </button>
                    </div>
                    <div className="space-y-3">
                      {activityLog.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>{activity.device}</span>
                              <span>•</span>
                              <span>{activity.ip}</span>
                              <span>•</span>
                              <span>{activity.timestamp.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    {Object.entries(formData.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">{key} Notifications</h3>
                          <p className="text-sm text-gray-600">
                            {key === 'email' && 'Receive notifications via email'}
                            {key === 'push' && 'Receive push notifications in browser'}
                            {key === 'sms' && 'Receive notifications via SMS'}
                            {key === 'marketing' && 'Receive marketing and promotional emails'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                [key]: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Notification Preferences
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Current Plan</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900 capitalize">{currentPlan}</p>
                          <p className="text-sm text-gray-600">
                            {isFreePlan ? 'Free tier with basic features' : 'Premium features included'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isFreePlan ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isFreePlan ? 'Free' : 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Plan Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-gray-700">Unlimited surveys</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-gray-700">Basic analytics</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-gray-700">Email support</span>
                        </div>
                        {!isFreePlan && (
                          <>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm text-gray-700">Advanced analytics</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm text-gray-700">Priority support</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm text-gray-700">Custom branding</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {isFreePlan && (
                      <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                        <h3 className="font-medium text-blue-900 mb-2">Upgrade to Pro</h3>
                        <p className="text-sm text-blue-800 mb-4">
                          Unlock advanced features and get priority support
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Upgrade Now
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === 'data' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Data & Privacy</h2>

                  <div className="space-y-6">
                    {/* Data Export */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Export Your Data</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Download a copy of all your data including surveys, responses, events, forms, and account information.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          onClick={() => exportUserData('json')}
                          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Export as JSON</span>
                        </button>
                        
                        <button
                          onClick={() => exportUserData('csv')}
                          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export as CSV</span>
                        </button>
                        
                        <button
                          onClick={() => setShowExportModal(true)}
                          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                          <span>Selective Export</span>
                        </button>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">What's included in your export:</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• All your surveys and their configurations</li>
                          <li>• Complete survey response data</li>
                          <li>• Events and event registrations</li>
                          {availableTables.forms && <li>• Custom forms and submissions</li>}
                          {availableTables.qrMessages && <li>• QR messages and analytics</li>}
                          <li>• Account profile information</li>
                        </ul>
                        {(!availableTables.forms || !availableTables.qrMessages) && (
                          <p className="text-xs text-blue-600 mt-2">
                            Note: Some features may not be available in your current setup.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Backup Creation */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Create Backup</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Create a secure backup of your account data that can be restored later.
                      </p>
                      <div className="space-y-4">
                        {isBackingUp && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Creating backup...</span>
                              <span className="text-gray-900 font-medium">{backupProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${backupProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={createBackup}
                          disabled={isBackingUp}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                          <span>{isBackingUp ? 'Creating...' : 'Create Backup'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Privacy Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Data Processing</span>
                          <span className="text-sm font-medium text-green-600">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Analytics Tracking</span>
                          <span className="text-sm font-medium text-green-600">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Marketing Communications</span>
                          <span className="text-sm font-medium">
                            {formData.notifications.marketing ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
            </p>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Upload Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile Picture</h3>
              
              <div className="space-y-4">
                {avatarPreview && (
                  <div className="text-center">
                    <img 
                      src={avatarPreview} 
                      alt="Preview" 
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                    />
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={saveAvatar}
                  disabled={!avatarFile}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Avatar
                </button>
                <button
                  onClick={() => {
                    setShowAvatarModal(false);
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2FA Setup Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Enable Two-Factor Authentication</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <QrCode className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Scan QR Code</p>
                      <p className="text-sm text-blue-700">Use your authenticator app to scan this code</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">QR Code Placeholder</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>1. Install an authenticator app like Google Authenticator</p>
                  <p>2. Scan the QR code above</p>
                  <p>3. Enter the verification code to complete setup</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={enable2FA}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enable 2FA
                </button>
                <button
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Management Modal */}
      <AnimatePresence>
        {showSessionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {session.device.includes('mobile') ? (
                          <Smartphone className="w-5 h-5 text-blue-600" />
                        ) : session.device.includes('tablet') ? (
                          <Tablet className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Monitor className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.device}</p>
                        <p className="text-sm text-gray-600">{session.location}</p>
                        <p className="text-xs text-gray-500">
                          Last active: {session.lastActive.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.current && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      <button
                        onClick={() => terminateSession(session.id)}
                        disabled={session.current}
                        className="px-3 py-1 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                      >
                        {session.current ? 'Current' : 'Terminate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selective Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Selective Data Export</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Choose which data you want to include in your export:
              </p>
              
              <div className="space-y-4">
                {[
                  { key: 'surveys', label: 'Surveys', description: 'All your surveys and configurations', alwaysAvailable: true },
                  { key: 'responses', label: 'Survey Responses', description: 'All response data from your surveys', alwaysAvailable: true },
                  { key: 'events', label: 'Events', description: 'Events and event registrations', alwaysAvailable: true },
                  { key: 'forms', label: 'Custom Forms', description: 'Forms and form submissions', alwaysAvailable: false },
                  { key: 'qrMessages', label: 'QR Messages', description: 'QR codes and messages', alwaysAvailable: false },
                  { key: 'profile', label: 'Profile Data', description: 'Account and profile information', alwaysAvailable: true }
                ].filter(option => option.alwaysAvailable || availableTables[option.key]).map((option) => (
                  <div key={option.key} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={option.key}
                      checked={exportOptions[option.key]}
                      onChange={(e) => setExportOptions({
                        ...exportOptions,
                        [option.key]: e.target.checked
                      })}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor={option.key} className="text-sm font-medium text-gray-900">
                        {option.label}
                        {!option.alwaysAvailable && !availableTables[option.key] && (
                          <span className="ml-2 text-xs text-gray-400">(Not available)</span>
                        )}
                      </label>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => exportUserData('json', exportOptions)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => exportUserData('csv', exportOptions)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Export as CSV
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountManagement;
