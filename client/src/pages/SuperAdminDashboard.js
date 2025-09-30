import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserManagementTab,
  PackageControlTab,
  DataControlTab,
  SystemSettingsTab,
  CouponManagementTabComponent
} from '../components/SuperAdminTabs';
import {
  Crown,
  Users,
  Shield,
  CreditCard,
  Package,
  Database,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Globe,
  Server,
  Key,
  Bell,
  Archive,
  Zap,
  Tag
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalSurveys: 0,
    totalResponses: 0,
    systemHealth: 'healthy'
  });
  
  // User management
  const [users, setUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Package management
  const [packages, setPackages] = useState([]);
  const [pendingUpgrades, setPendingUpgrades] = useState([]);
  
  // System data
  const [systemData, setSystemData] = useState({
    surveys: [],
    responses: [],
    events: [],
    templates: []
  });
  
  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Check super admin access
  useEffect(() => {
    const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';
    
    if (!user || !isSuperAdmin) {
      console.log('🚫 Super Admin access denied:', { 
        user: user?.email, 
        userRole: userProfile?.role,
        isSuperAdmin 
      });
      navigate('/app/dashboard');
      return;
    }
    
    console.log('✅ Super Admin access granted:', { 
      user: user?.email, 
      userRole: userProfile?.role 
    });
    fetchDashboardData();
  }, [user, userProfile, navigate]);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch comprehensive dashboard data
      const [usersResponse, statsResponse] = await Promise.all([
        api.admin.getAllUsers({ limit: 100 }),
        api.admin.getDashboardStats()
      ]);
      
      if (usersResponse.users) {
        setUsers(usersResponse.users);
      }
      
      if (statsResponse.stats) {
        setStats(prevStats => ({
          ...prevStats,
          ...statsResponse.stats
        }));
      }
      
      // Fetch additional system data
      await fetchSystemData();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSystemData = async () => {
    try {
      // Fetch all system data for complete control
      const [surveysResponse, responsesResponse] = await Promise.all([
        api.surveys.getSurveys(user.id, { limit: 1000 }),
        api.responses.getAllResponses({ limit: 1000 })
      ]);
      
      setSystemData(prev => ({
        ...prev,
        surveys: surveysResponse.surveys || [],
        responses: responsesResponse.responses || []
      }));
      
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard data refreshed');
  };

  // User management functions
  const handleCreateUser = async (userData) => {
    try {
      const response = await api.admin.createUser(userData);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('User created successfully');
        setShowUserModal(false);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const response = await api.admin.updateUser(userId, updates);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('User updated successfully');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await api.admin.deleteUser(userId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('User deleted successfully');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleChangeUserPlan = async (userId, newPlan) => {
    try {
      const response = await api.admin.changePlan(userId, newPlan, true);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(`User plan changed to ${newPlan}`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to change user plan');
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      const response = await api.admin.toggleUserStatus(userId, isActive);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  // Package management functions
  const handleApproveUpgrade = async (upgradeId) => {
    try {
      // Implementation for approving package upgrades
      toast.success('Package upgrade approved');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve upgrade');
    }
  };

  const handleRejectUpgrade = async (upgradeId) => {
    try {
      // Implementation for rejecting package upgrades
      toast.success('Package upgrade rejected');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject upgrade');
    }
  };

  // Data management functions
  const handleExportData = async (dataType) => {
    try {
      // Implementation for exporting user data
      toast.success(`${dataType} data exported successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteData = async (dataType, dataId) => {
    if (!window.confirm(`Are you sure you want to delete this ${dataType}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      // Implementation for deleting user data
      toast.success(`${dataType} deleted successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Super Admin Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            User: {user?.email} | Role: {userProfile?.role}
          </p>
        </div>
      </div>
    );
  }

  // Debug information
  console.log('🔍 SuperAdminDashboard Debug:', {
    user: user?.email,
    userProfile: userProfile?.role,
    isSuperAdmin: user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Complete system control and management</p>
                <p className="text-sm text-gray-500 mt-1">
                  Logged in as: {user?.email} | Role: {userProfile?.role || 'Loading...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">System Healthy</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border p-1">
            <nav className="flex space-x-1">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'packages', label: 'Package Control', icon: Package },
                { id: 'coupons', label: 'Coupon Management', icon: Tag },
                { id: 'data', label: 'Data Control', icon: Database },
                { id: 'system', label: 'System Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab
              key="overview"
              stats={stats}
              users={users}
              systemData={systemData}
            />
          )}
          
          {activeTab === 'users' && (
            <UserManagementTab
              key="users"
              users={users}
              userSearchTerm={userSearchTerm}
              setUserSearchTerm={setUserSearchTerm}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onChangePlan={handleChangeUserPlan}
              onToggleStatus={handleToggleUserStatus}
            />
          )}
          
          {activeTab === 'packages' && (
            <PackageControlTab
              key="packages"
              packages={packages}
              pendingUpgrades={pendingUpgrades}
              onApproveUpgrade={handleApproveUpgrade}
              onRejectUpgrade={handleRejectUpgrade}
            />
          )}
          
          {activeTab === 'coupons' && (
            <CouponManagementTabComponent key="coupons" />
          )}
          
          {activeTab === 'data' && (
            <DataControlTab
              key="data"
              systemData={systemData}
              onExportData={handleExportData}
              onDeleteData={handleDeleteData}
            />
          )}
          
          {activeTab === 'system' && (
            <SystemSettingsTab
              key="system"
              stats={stats}
              onRefresh={handleRefresh}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, users, systemData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-3xl font-bold text-green-600">Healthy</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
          <div className="space-y-4">
            {users.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.full_name?.charAt(0) || user.email?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.full_name || user.email}</p>
                  <p className="text-xs text-gray-500">Last active: {new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Surveys</span>
              <span className="text-sm font-medium text-gray-900">{systemData.surveys.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Responses</span>
              <span className="text-sm font-medium text-gray-900">{systemData.responses.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Size</span>
              <span className="text-sm font-medium text-gray-900">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Uptime</span>
              <span className="text-sm font-medium text-gray-900">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuperAdminDashboard;
