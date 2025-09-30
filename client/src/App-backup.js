import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SurveyBuilder from './pages/SurveyBuilder';
import SurveyAnalytics from './pages/SurveyAnalytics';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdvancedDashboard from './pages/AdvancedDashboard';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import SurveyResponse from './pages/SurveyResponse';
import TemplateEditor from './pages/TemplateEditor';
import Surveys from './pages/Surveys';
import SurveyPreview from './pages/SurveyPreview';
import PublishSurvey from './pages/PublishSurvey';
import Subscriptions from './pages/Subscriptions';
import Pricing from './pages/Pricing';
import AdvancedServices from './pages/AdvancedServices';
import Billing from './pages/Billing';
import Team from './pages/Team';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAccounts from './pages/AdminAccounts';
import AdminPackages from './pages/AdminPackages';
import AdminPayments from './pages/AdminPayments';
import AdminRegister from './pages/AdminRegister';
import SuperAdminAdmins from './pages/SuperAdminAdmins';
import TestConnection from './pages/TestConnection';
import SimpleTest from './pages/SimpleTest';
import AuthTest from './pages/AuthTest';
import NetworkTest from './pages/NetworkTest';
import SimpleNetworkTest from './pages/SimpleNetworkTest';
import LoginTest from './pages/LoginTest';
import DatabaseTest from './pages/DatabaseTest';
import AuthDebug from './pages/AuthDebug';
import AdminSetup from './pages/AdminSetup';
import EventManagement from './pages/EventManagement';
import AdvancedEventManagement from './pages/AdvancedEventManagement';
import TemplateLibrary from './pages/TemplateLibrary';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/app/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page (Public) */}
      <Route path="/" element={<Landing />} />
      
      {/* Public Routes */}
      <Route path="/test" element={<TestConnection />} />
      <Route path="/simple" element={<SimpleTest />} />
      <Route path="/auth-test" element={<AuthTest />} />
      <Route path="/network-test" element={<NetworkTest />} />
      <Route path="/simple-network-test" element={<SimpleNetworkTest />} />
      <Route path="/login-test" element={<LoginTest />} />
      <Route path="/database-test" element={<DatabaseTest />} />
      <Route path="/auth-debug" element={<AuthDebug />} />
      <Route path="/admin-setup" element={<AdminSetup />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/admin/login" element={
        <PublicRoute>
          <AdminLogin />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/admin/register" element={
        <PublicRoute>
          <AdminRegister />
        </PublicRoute>
      } />
      
      {/* Survey Response Route (Public) */}
      <Route path="/survey/:id" element={<SurveyResponse />} />
      
      {/* Public Marketing Routes */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/services" element={<AdvancedServices />} />
      
      {/* Protected Routes */}
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="advanced-dashboard" element={<AdvancedDashboard />} />
        <Route path="surveys" element={<Surveys />} />
        <Route path="preview/:id" element={<SurveyPreview />} />
        <Route path="templates/:id/edit" element={<TemplateEditor />} />
        <Route path="templates/new" element={<TemplateEditor />} />
        <Route path="builder" element={<SurveyBuilder />} />
           <Route path="builder/:id" element={<SurveyBuilder />} />
           <Route path="publish/:id" element={<PublishSurvey />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="analytics/:id" element={<SurveyAnalytics />} />
        <Route path="advanced-analytics/:id" element={<AdvancedAnalytics />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="services" element={<AdvancedServices />} />
        <Route path="billing" element={<Billing />} />
                            <Route path="team" element={<Team />} />
                    <Route path="profile" element={<Profile />} />
                                          <Route path="events" element={<EventManagement />} />
                      <Route path="advanced-events" element={<AdvancedEventManagement />} />
                    <Route path="templates" element={<TemplateLibrary />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/accounts" element={<AdminAccounts />} />
        <Route path="admin/packages" element={<AdminPackages />} />
        <Route path="admin/payments" element={<AdminPayments />} />
        <Route path="admin/super-admins" element={<SuperAdminAdmins />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App; 