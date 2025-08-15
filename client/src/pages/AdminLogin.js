import React, { useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Key,
  Building,
  Server,
  Database,
  Settings,
  Activity,
  BarChart3,
  Users,
  CreditCard,
  FileText
} from 'lucide-react';
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Wait a moment for the AuthContext to update
        setTimeout(() => {
          // Check if the logged-in user is an admin
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (currentUser.role === 'admin' || currentUser.role === 'super_admin') {
            toast.success('Welcome, Administrator!');
            navigate('/app/admin');
          } else {
            toast.error('Access denied. Admin privileges required.');
            // Clear the login data since it's not an admin
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }, 100);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Admin login failed. Please check your credentials.');
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
          <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-gray-300">Secure administrative access</p>
        </div>
        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@company.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-white/10"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Access Admin Portal
                </div>
              )}
            </button>
          </form>
          {/* Back to Regular Login */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to User Login
            </Link>
            <div className="text-sm text-gray-400">
              Need to create an admin account?{' '}
              <Link
                to="/admin/register"
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Admin Registration
              </Link>
            </div>
          </div>
        </div>
        {/* Admin Features Preview */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-400" />
            Administrative Features
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
            Secure administrative access. All actions are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin; 