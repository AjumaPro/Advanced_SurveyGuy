import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SurveyBuilder from './pages/SurveyBuilder';
import SurveyAnalytics from './pages/SurveyAnalytics';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdvancedDashboard from './pages/AdvancedDashboard';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import SurveyResponse from './pages/SurveyResponse';
import SurveyTemplates from './pages/SurveyTemplates';
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
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
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Survey Response Route (Public) */}
      <Route path="/survey/:id" element={<SurveyResponse />} />
      
      {/* Public Marketing Routes */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/services" element={<AdvancedServices />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="advanced-dashboard" element={<AdvancedDashboard />} />
        <Route path="surveys" element={<Surveys />} />
        <Route path="preview/:id" element={<SurveyPreview />} />
                   <Route path="templates" element={<SurveyTemplates />} />
           <Route path="templates/:id/edit" element={<TemplateEditor />} />
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
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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