import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('🔍 Checking auth status...');
        const response = await api.get('/auth/me');
        console.log('✅ Auth status check successful:', response.data);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('❌ Auth status check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('🔐 Attempting login with:', { email, password });
    try {
      console.log('📡 Making login API call...');
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login API response:', response.data);
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        console.error('❌ Missing token or user in response');
        return { success: false, error: 'Invalid response from server' };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Welcome back!');
      console.log('🎉 Login successful!');
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('🔍 Error response:', error.response?.data);
      console.error('📊 Error status:', error.response?.status);
      
      // Handle different error response formats
      let message = 'Login failed';
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password, name) => {
    console.log('🔐 Attempting registration with:', { email, name });
    try {
      console.log('📡 Making registration API call...');
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        name 
      });
      console.log('✅ Registration API response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Account created successfully!');
      console.log('🎉 Registration successful!');
      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('🔍 Error response:', error.response?.data);
      console.error('📊 Error status:', error.response?.status);
      
      // Handle different error response formats
      let message = 'Registration failed';
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Attempting logout...');
      await api.post('/auth/logout');
      console.log('✅ Logout API call successful');
    } catch (error) {
      console.error('❌ Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      console.log('🎉 Logout completed');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      console.log('📝 Updating profile...');
      const response = await api.put('/auth/profile', profileData);
      console.log('✅ Profile update successful:', response.data);
      
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      const message = error.response?.data?.error || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      console.log('🔐 Changing password...');
      await api.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      console.log('✅ Password change successful');
      
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ Password change error:', error);
      const message = error.response?.data?.error || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 