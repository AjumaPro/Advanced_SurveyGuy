import React, { useState } from 'react';
import { 
  Calendar,
  BarChart3,
  Zap,
  CreditCard,
  Users,
  Settings,
  Bell,
  Target
} from 'lucide-react';
import AdvancedEventDashboard from '../components/AdvancedEventDashboard';
import EventAnalyticsDashboard from '../components/EventAnalyticsDashboard';
import EventAutomationWorkflows from '../components/EventAutomationWorkflows';
import EventPaymentSystem from '../components/EventPaymentSystem';
import AdvancedEventRegistration from '../components/AdvancedEventRegistration';

const AdvancedEventManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdvancedEventDashboard />;
      case 'analytics':
        return <EventAnalyticsDashboard />;
      case 'registrations':
        return <AdvancedEventRegistration />;
      case 'payments':
        return <EventPaymentSystem />;
      case 'automation':
        return <EventAutomationWorkflows />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Event Settings</h3>
            <p className="text-gray-600">Advanced event configuration and settings coming soon</p>
          </div>
        );
      default:
        return <AdvancedEventDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Event Management</h1>
          <p className="text-gray-600">Comprehensive event management with advanced analytics, automation, and payment processing</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedEventManagement; 