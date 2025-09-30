import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  User, 
  Key, 
  Mail, 
  Building,
  Server,
  Database,
  Settings,
  Activity,
  BarChart3,
  Users,
  CreditCard,
  FileText,
  CheckCircle
} from 'lucide-react';
import {motion} from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
const AdminRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    adminKey: '',
    role: 'admin',
    department: '',
    permissions: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, value]
          : prev.permissions.filter(p => p !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.name || !formData.adminKey) {
      toast.error('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (formData.adminKey !== 'ADMIN2024') {
      toast.error('Invalid admin key');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/admin/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        department: formData.department,
        permissions: formData.permissions,
        adminKey: formData.adminKey
      });
      // Auto-login after successful admin registration
      await login(formData.email, formData.password);
      
      toast.success(response.data.message || 'Admin account created successfully!');
      navigate('/app/admin');
      
    } catch (error) {
      const message = error.response?.data?.error || 'Admin registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Registration</h2>
          <p className="text-gray-300">Create new administrative account</p>
        </div>
        {/* Registration Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@company.com"
                />
              </div>
            </div>
            {/* Department Field */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-200 mb-2">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="IT, HR, Finance, etc."
                />
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
            {/* Admin Key Field */}
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Authorization Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="adminKey"
                  name="adminKey"
                  type={showAdminKey ? 'text' : 'password'}
                  required
                  value={formData.adminKey}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter admin key"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminKey(!showAdminKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showAdminKey ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Required authorization key for admin account creation
              </p>
            </div>
            {/* Permissions Section */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Administrative Permissions
              </label>
              <div className="space-y-2">
                {[
                  { value: 'user_management', label: 'User Management', icon: Users },
                  { value: 'payment_approvals', label: 'Payment Approvals', icon: CreditCard },
                  { value: 'survey_analytics', label: 'Survey Analytics', icon: BarChart3 },
                  { value: 'system_reports', label: 'System Reports', icon: FileText },
                  { value: 'data_management', label: 'Data Management', icon: Database },
                  { value: 'system_monitoring', label: 'System Monitoring', icon: Activity }
                ].map((permission) => {
                  const Icon = permission.icon;
                  return (
                    <label key={permission.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={permission.value}
                        checked={formData.permissions.includes(permission.value)}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-white/10"
                      />
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{permission.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Admin Account...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Create Admin Account
                </div>
              )}
            </button>
          </form>
          {/* Back to Admin Login */}
          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Admin Login
            </Link>
          </div>
        </motion.div>
        {/* Admin Features Preview */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-400" />
            Administrative Capabilities
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-gray-300">
              <Users className="h-4 w-4 mr-2 text-green-400" />
              User Management
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <CreditCard className="h-4 w-4 mr-2 text-blue-400" />
              Payment Approvals
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <FileText className="h-4 w-4 mr-2 text-purple-400" />
              Survey Analytics
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <BarChart3 className="h-4 w-4 mr-2 text-yellow-400" />
              System Reports
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Database className="h-4 w-4 mr-2 text-red-400" />
              Data Management
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Activity className="h-4 w-4 mr-2 text-indigo-400" />
              System Monitoring
            </div>
          </div>
        </div>
        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            <Shield className="h-3 w-3 inline mr-1" />
            Admin accounts have full system access. All actions are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminRegister; 