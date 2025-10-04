import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Advanced Dashboard', href: '/app/advanced-dashboard', icon: BarChart3 },
    { 
      name: 'Events', 
      icon: Calendar, 
      isDropdown: true,
      items: [
        { name: 'Event Dashboard', href: '/app/events', icon: Calendar },
        { name: 'Published Events', href: '/app/events/published', icon: Calendar },
        { name: 'Advanced Events', href: '/app/advanced-events', icon: Zap, badge: 'Pro' },
        { name: 'Professional Creator', href: '/app/templates/professional-events', icon: Sparkles, badge: 'New' }
      ]
    },
    { name: 'Teams', href: '/app/teams', icon: Users, badge: 'New' },
    { name: 'Surveys', href: '/app/surveys', icon: FileText },
    { name: 'Templates', href: '/app/templates', icon: Sparkles },
    { name: 'Survey Builder', href: '/app/builder', icon: Plus },
    { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    { name: 'Features', href: '/app/features', icon: Sparkles },
    { name: 'Subscriptions', href: '/app/subscriptions', icon: Mail },
    { name: 'Billing', href: '/app/billing', icon: CreditCard },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
    { name: 'Profile', href: '/app/profile', icon: Settings },
  ];

  // Add admin navigation items if user is admin
  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/app/admin', icon: Shield },
    { name: 'Manage Accounts', href: '/app/admin/accounts', icon: Users },
    { name: 'Manage Packages', href: '/app/admin/packages', icon: Package },
    { name: 'Payment Approvals', href: '/app/admin/payments', icon: CreditCard },
  ];

  // Add super admin navigation items if user is super admin
  const superAdminNavigation = [
    { name: 'Manage Admins', href: '/app/admin/super-admins', icon: Crown },
  ];

  const allNavigation = user?.role === 'super_admin' || user?.super_admin
    ? [...navigation, ...adminNavigation, ...superAdminNavigation]
    : user?.role === 'admin'
    ? [...navigation, ...adminNavigation]
    : navigation;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  const toggleDropdown = (itemName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isDropdownActive = (items) => {
    return items.some(item => isActive(item.href));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-blue-600">SurveyGuy</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {allNavigation.map((item) => {
              const Icon = item.icon;
              
              if (item.isDropdown) {
                const isOpen = openDropdowns[item.name];
                const hasActiveChild = isDropdownActive(item.items);
                
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                        hasActiveChild
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 space-y-1"
                        >
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <button
                                key={subItem.name}
                                onClick={() => {
                                  handleNavigation(subItem.href);
                                  setSidebarOpen(false);
                                }}
                                className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                                  isActive(subItem.href)
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                              >
                                <div className="flex items-center">
                                  <SubIcon className="mr-3 h-4 w-4" />
                                  {subItem.name}
                                </div>
                                {subItem.badge && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    subItem.badge === 'Pro' 
                                      ? 'bg-purple-100 text-purple-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {subItem.badge}
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
              }
              
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigation(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-blue-600">SurveyGuy</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {allNavigation.map((item) => {
              const Icon = item.icon;
              
              if (item.isDropdown) {
                const isOpen = openDropdowns[item.name];
                const hasActiveChild = isDropdownActive(item.items);
                
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                        hasActiveChild
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 space-y-1"
                        >
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <button
                                key={subItem.name}
                                onClick={() => handleNavigation(subItem.href)}
                                className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                                  isActive(subItem.href)
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                              >
                                <div className="flex items-center">
                                  <SubIcon className="mr-3 h-4 w-4" />
                                  {subItem.name}
                                </div>
                                {subItem.badge && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    subItem.badge === 'Pro' 
                                      ? 'bg-purple-100 text-purple-700' 
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {subItem.badge}
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
              }
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Quick actions */}
              <button
                onClick={() => handleNavigation('/pricing')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Pricing
              </button>
              <button
                onClick={() => handleNavigation('/app/builder')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Survey
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 