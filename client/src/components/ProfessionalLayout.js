import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import UserImpersonation from './UserImpersonation';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Plus,
  Sparkles,
  Mail,
  CreditCard,
  Shield,
  Users,
  Package,
  Crown,
  DollarSign,
  Calendar,
  Zap,
  Bell,
  Search,
  ChevronDown,
  Layers,
  TrendingUp,
  Database,
  Globe,
  Share2,
  Send,
  Activity,
  Palette,
  Brain,
  GitBranch,
  Smartphone,
  Link,
  DollarSign as PaymentIcon,
  MessageSquare
} from 'lucide-react';

const ProfessionalLayout = () => {
  const { user, userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'AI & Advanced': false
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Check for impersonation mode
  const isImpersonating = userProfile?._impersonated;
  // Check user permissions and plan
  const isSuperAdmin = user?.email === 'infoajumapro@gmail.com' || userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
  const currentPlan = userProfile?.plan || 'free';
  const isFreePlan = currentPlan === 'free';
  const isEnterprisePlan = currentPlan === 'enterprise';

  // Filter navigation items based on plan
  const filterItemsByPlan = (items) => {
    return items.filter(item => {
      // Always show items without badges or with non-plan badges
      if (!item.badge || !['Pro', 'Enterprise', 'AI'].includes(item.badge)) {
        return true;
      }
      
      // Show AI features for all users (they're free to try)
      if (item.badge === 'AI') {
        return true;
      }
      
      // Show Pro features only for Pro and Enterprise users (or super admin)
      if (item.badge === 'Pro') {
        return !isFreePlan || isSuperAdmin;
      }
      
      // Show Enterprise features only for Enterprise users (or super admin)
      if (item.badge === 'Enterprise') {
        return isEnterprisePlan || isSuperAdmin;
      }
      
      return true;
    });
  };

  // Organized navigation with sections
  const navigationSections = [
    {
      title: 'Overview',
      items: filterItemsByPlan([
        { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, badge: null },
        { name: 'Advanced Dashboard', href: '/app/advanced-dashboard', icon: TrendingUp, badge: 'Pro' },
      ])
    },
    {
      title: 'Surveys',
      items: filterItemsByPlan([
        { name: 'Draft Surveys', href: '/app/draft-surveys', icon: FileText, badge: null },
        { name: 'Published Surveys', href: '/app/published-surveys', icon: Globe, badge: null },
        { name: 'Survey Builder', href: '/app/builder-v2/new', icon: Plus, badge: null },
        { name: 'Reports', href: '/app/reports', icon: BarChart3, badge: null },
        ...(isSuperAdmin ? [
          { name: 'Builder Test', href: '/app/survey-builder-test', icon: Activity, badge: 'Test' },
          { name: 'Create Surveys & Events', href: '/app/create-surveys-events', icon: Plus, badge: 'New' }
        ] : []),
      ])
    },
    {
      title: 'Analytics',
      items: filterItemsByPlan([
        { name: 'Analytics', href: '/app/analytics', icon: BarChart3, badge: null },
        { name: 'Features', href: '/app/features', icon: Sparkles, badge: null },
      ])
    },
    {
      title: 'AI & Advanced',
      items: filterItemsByPlan([
        { name: 'AI Question Generator', href: '/app/ai-generator', icon: Brain, badge: 'AI' },
        { name: 'Smart Templates', href: '/app/smart-templates', icon: Brain, badge: 'AI' },
        { name: 'Enhanced Forms', href: '/app/forms/builder', icon: FileText, badge: 'Pro' },
        { name: 'Mobile Builder', href: '/app/mobile-builder', icon: Smartphone, badge: 'New' },
        { name: 'Payment Integration', href: '/app/payments', icon: PaymentIcon, badge: 'Pro' },
        { name: 'Team Collaboration', href: '/app/collaboration', icon: MessageSquare, badge: 'Pro' },
      ])
    },
    {
      title: 'Events',
      items: filterItemsByPlan([
        { name: 'Events', href: '/app/events', icon: Calendar, badge: null },
        { name: 'Advanced Events', href: '/app/advanced-events', icon: Zap, badge: 'Pro' },
      ])
    },
    {
      title: 'Account',
      items: filterItemsByPlan([
        { name: 'Subscriptions', href: '/app/subscriptions', icon: Mail, badge: null },
        { name: 'Billing', href: '/app/billing', icon: CreditCard, badge: null },
        { name: 'Profile', href: '/app/profile', icon: Settings, badge: null },
        { name: 'Admin Setup', href: '/app/admin/setup', icon: Shield, badge: 'Setup' },
      ])
    }
  ].filter(section => section.items.length > 0); // Remove empty sections

  // Add enterprise section if user has enterprise plan
  const enterpriseSection = {
    title: 'Enterprise',
    items: [
      { name: 'Enterprise Dashboard', href: '/app/enterprise', icon: Crown, badge: 'Enterprise' },
      { name: 'Advanced Survey Builder', href: '/app/enterprise/advanced-builder', icon: FileText, badge: 'Enterprise' },
      { name: 'Team Management', href: '/app/enterprise/team-management', icon: Users, badge: 'Enterprise' },
      { name: 'White Label Portal', href: '/app/enterprise/white-label', icon: Palette, badge: 'Enterprise' },
      { name: 'SSO Configuration', href: '/app/enterprise/sso', icon: Shield, badge: 'Enterprise' },
      { name: 'API & Webhooks', href: '/app/enterprise/api-webhooks', icon: Globe, badge: 'Enterprise' },
      { name: 'Data Export & Backup', href: '/app/enterprise/data-export', icon: Database, badge: 'Enterprise' },
      { name: 'Enterprise Security', href: '/app/enterprise/security', icon: Shield, badge: 'Enterprise' },
      { name: 'Real-time Analytics', href: '/app/analytics/realtime', icon: Activity, badge: 'Enterprise' },
    ]
  };

  // Add account management section for super admins
  const accountManagementSection = {
    title: 'Account Management',
    items: [
      { name: 'Account Manager', href: '/app/super-admin', icon: Users, badge: 'Super' },
    ]
  };

  // Add admin section if user is admin
  const adminSection = {
    title: 'Administration',
    items: [
      { name: 'Admin Dashboard', href: '/app/admin', icon: Shield, badge: 'Admin' },
      { name: 'User Accounts', href: '/app/admin/accounts', icon: Users, badge: 'Admin' },
      { name: 'Packages', href: '/app/admin/packages', icon: Package, badge: 'Admin' },
      { name: 'Payments', href: '/app/admin/payments', icon: DollarSign, badge: 'Admin' },
      ...(isSuperAdmin ? [
        { name: 'Super Admin Dashboard', href: '/app/super-admin', icon: Crown, badge: 'Super' },
        { name: 'Feature Management', href: '/app/admin/features', icon: Sparkles, badge: 'Super' },
        { name: 'Database Setup', href: '/app/database-setup', icon: Database, badge: 'Super' },
        { name: 'Survey Builder Test', href: '/app/survey-builder-test', icon: FileText, badge: 'Super' },
        { name: 'Publishing Test', href: '/app/publishing-test', icon: Share2, badge: 'Super' },
        { name: 'Submission Test', href: '/app/submission-test', icon: Send, badge: 'Super' }
      ] : []),
    ]
  };

  // Debug: Log user profile for troubleshooting
  console.log('🔍 ProfessionalLayout Debug:', {
    user: user?.email,
    userProfile,
    role: userProfile?.role,
    isAdmin,
    isSuperAdmin
  });

  // Update Account section to only show Admin Setup for super admin
  const accountSection = {
    title: 'Account',
    items: [
      { name: 'Subscriptions', href: '/app/subscriptions', icon: Mail, badge: null },
      { name: 'Billing', href: '/app/billing', icon: CreditCard, badge: null },
      { name: 'Profile', href: '/app/profile', icon: Settings, badge: null },
      { name: 'Account Management', href: '/app/account', icon: User, badge: null },
      ...(isSuperAdmin ? [{ name: 'Admin Setup', href: '/app/admin/setup', icon: Shield, badge: 'Super' }] : []),
    ]
  };

  // Update navigation sections with the new account section
  const updatedNavigationSections = navigationSections.map(section => 
    section.title === 'Account' ? accountSection : section
  );

  // Show enterprise section if user has enterprise plan or is super admin
  const sectionsWithEnterprise = (userProfile?.plan === 'enterprise' || isSuperAdmin)
    ? [...updatedNavigationSections, enterpriseSection]
    : updatedNavigationSections;

  // Show account management section if user is super admin
  const sectionsWithAccountManagement = isSuperAdmin
    ? [...sectionsWithEnterprise, accountManagementSection]
    : sectionsWithEnterprise;

  // Show admin section if user is admin/super_admin
  const allSections = isAdmin 
    ? [...sectionsWithAccountManagement, adminSection]
    : sectionsWithAccountManagement;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'AI': return 'bg-purple-100 text-purple-800';
      case 'Pro': return 'bg-blue-100 text-blue-800';
      case 'Enterprise': return 'bg-purple-100 text-purple-800';
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Setup': return 'bg-yellow-100 text-yellow-800';
      case 'Super': return 'bg-purple-100 text-purple-800';
      case 'Test': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stopImpersonation = () => {
    sessionStorage.removeItem('admin_impersonation');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4" />
              <span className="font-bold text-sm">SUPER ADMIN VIEWING AS:</span>
              <span className="font-medium">{userProfile.email}</span>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {userProfile.plan}
              </span>
            </div>
            <button
              onClick={stopImpersonation}
              className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              Exit Impersonation
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl lg:hidden"
            >
              <MobileSidebar 
                sections={allSections}
                user={user}
                userProfile={userProfile}
                onNavigate={handleNavigation}
                onClose={() => setSidebarOpen(false)}
                isActive={isActive}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getBadgeColor={getBadgeColor}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col lg:h-screen">
        <DesktopSidebar 
          sections={allSections}
          user={user}
          userProfile={userProfile}
          onNavigate={handleNavigation}
          isActive={isActive}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          getBadgeColor={getBadgeColor}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-80">
        {/* Top navigation */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} />
              </button>

              {/* Search bar */}
              <div className="flex-1 max-w-2xl mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search surveys, templates, or analytics..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-3">
                {/* New Features Quick Access */}
                <button
                  onClick={() => handleNavigation('/app/new-features')}
                  className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md"
                >
                  <Sparkles size={16} />
                  <span className="text-sm font-medium">New Features</span>
                </button>

                {/* Super Admin User Impersonation */}
                {isSuperAdmin && (
                  <UserImpersonation />
                )}

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="px-4 py-3 text-center text-gray-500">
                            No new notifications
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0]}</div>
                      <div className="text-xs text-gray-500 capitalize">{userProfile?.role || 'User'}</div>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <User size={18} className="text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user?.email?.split('@')[0]}</div>
                              <div className="text-sm text-gray-500">{user?.email}</div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPlanBadgeColor(userProfile?.plan)}`}>
                                {userProfile?.plan || 'Free'} Plan
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={() => handleNavigation('/app/profile')}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings size={16} className="mr-3" />
                            Profile Settings
                          </button>
                          <button
                            onClick={() => handleNavigation('/app/billing')}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <CreditCard size={16} className="mr-3" />
                            Billing & Plans
                          </button>
                          <button
                            onClick={() => window.open('/contact', '_blank')}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <MessageSquare size={16} className="mr-3" />
                            Contact Support
                          </button>
                          <hr className="my-2 border-gray-100" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} className="mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Desktop Sidebar Component
const DesktopSidebar = ({ sections, user, userProfile, onNavigate, isActive, expandedSections, toggleSection, getBadgeColor }) => (
  <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
    {/* Logo */}
    <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SurveyGuy
          </h1>
          <p className="text-xs text-gray-500">Advanced Survey Platform</p>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {sections.map((section, sectionIndex) => {
        const isExpanded = expandedSections[section.title] || section.title !== 'AI & Advanced';
        
        return (
          <div key={section.title}>
            {section.title === 'AI & Advanced' ? (
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`} 
                />
              </button>
            ) : (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => onNavigate(item.href)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon size={18} className={`mr-3 ${active ? 'text-white' : 'text-gray-500'}`} />
                          {item.name}
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            active ? 'bg-white/20 text-white' : getBadgeColor(item.badge)
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {active && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>

    {/* User info at bottom */}
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {user?.email?.split('@')[0]}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPlanBadgeColor(userProfile?.plan)}`}>
              {userProfile?.plan || 'Free'}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {userProfile?.role || 'User'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Mobile Sidebar Component
const MobileSidebar = ({ sections, user, userProfile, onNavigate, onClose, isActive, expandedSections, toggleSection, getBadgeColor }) => (
  <div className="flex flex-col h-full bg-white">
    {/* Header */}
    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <BarChart3 size={16} className="text-white" />
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SurveyGuy
        </h1>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X size={20} />
      </button>
    </div>

    {/* New Features Quick Access - Mobile */}
    <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
      <button
        onClick={() => {
          onNavigate('/app/new-features');
          onClose();
        }}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md"
      >
        <Sparkles size={16} />
        <span className="text-sm font-medium">🚀 New Features</span>
      </button>
    </div>

    {/* Navigation */}
    <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {sections.map((section) => {
        const isExpanded = expandedSections[section.title] || section.title !== 'AI & Advanced';
        
        return (
          <div key={section.title}>
            {section.title === 'AI & Advanced' ? (
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`} 
                />
              </button>
            ) : (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <button
                        key={item.name}
                        onClick={() => onNavigate(item.href)}
                        className={`group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                          active
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon size={18} className={`mr-3 ${active ? 'text-white' : 'text-gray-500'}`} />
                          {item.name}
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            active ? 'bg-white/20 text-white' : getBadgeColor(item.badge)
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  </div>
);

const getPlanBadgeColor = (plan) => {
  switch (plan) {
    case 'pro': return 'bg-blue-100 text-blue-800';
    case 'enterprise': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default ProfessionalLayout;
