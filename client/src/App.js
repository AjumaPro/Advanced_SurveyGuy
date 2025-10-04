import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import ProfessionalLayout from './components/ProfessionalLayout';
import LoadingSpinner from './components/LoadingSpinner';
import PlanProtectedRoute from './components/PlanProtectedRoute';
import { AdminOnly } from './utils/adminUtils';

// Core components that should load immediately
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/RegisterWithPlan';

// Critical components - load immediately for better performance
import Dashboard from './pages/Dashboard';
import SurveyBuilder from './pages/SurveyBuilder';
import SurveyDashboard from './pages/SurveyDashboard';
import PublishedSurveys from './pages/PublishedSurveys';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import Subscriptions from './pages/Subscriptions';
import Pricing from './pages/Pricing';

// Secondary components - lazy load for better performance
const SurveyAnalytics = React.lazy(() => import('./pages/SurveyAnalytics'));
const AdvancedDashboard = React.lazy(() => import('./pages/AdvancedDashboard'));
const AdvancedAnalytics = React.lazy(() => import('./pages/AdvancedAnalytics'));
const AnalyticsRouter = React.lazy(() => import('./components/AnalyticsRouter'));
const SurveyResponse = React.lazy(() => import('./pages/SurveyResponse'));
const TemplateEditor = React.lazy(() => import('./pages/TemplateEditor'));
const ProfessionalEventCreation = React.lazy(() => import('./pages/ProfessionalEventCreation'));
const DraftSurveys = React.lazy(() => import('./pages/DraftSurveys'));
const SurveyPreview = React.lazy(() => import('./pages/SurveyPreview'));
const PublishSurvey = React.lazy(() => import('./pages/PublishSurvey'));
const AdvancedServices = React.lazy(() => import('./pages/AdvancedServices'));
const BillingDebug = React.lazy(() => import('./pages/BillingDebug'));
const FeatureDashboard = React.lazy(() => import('./pages/FeatureDashboard'));
const Teams = React.lazy(() => import('./pages/Teams'));
const Team = React.lazy(() => import('./pages/Team'));
const AccountManagement = React.lazy(() => import('./pages/AccountManagement'));
const Contact = React.lazy(() => import('./pages/Contact'));
const QRMessages = React.lazy(() => import('./pages/QRMessages'));
const QRMessageReveal = React.lazy(() => import('./pages/QRMessageReveal'));
const Forms = React.lazy(() => import('./pages/Forms'));
const FormViewer = React.lazy(() => import('./pages/FormViewer'));

// Admin components - keep as lazy loaded but reduce total count
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminAccounts = React.lazy(() => import('./pages/AdminAccounts'));
const SuperAdminDashboard = React.lazy(() => import('./pages/SuperAdminDashboard'));
const SurveyEdit = React.lazy(() => import('./pages/SurveyEdit'));

// Enterprise components - only load essential ones
const EventManagement = React.lazy(() => import('./pages/EventManagement'));
const PublishedEvents = React.lazy(() => import('./pages/PublishedEvents'));
const EventRegistration = React.lazy(() => import('./pages/EventRegistration'));
const PublicEventView = React.lazy(() => import('./pages/PublicEventView'));
const TemplateLibrary = React.lazy(() => import('./pages/TemplateLibrary'));

// Protected Route Component with fast loading
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fast={true} message="Checking authentication..." />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component with fast loading
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fast={true} message="Loading..." />;
  }
  
  return user ? <Navigate to="/app/dashboard" replace /> : children;
};

// Lazy Route Wrapper with fast loading
const LazyRoute = ({ children }) => (
  <Suspense fallback={<LoadingSpinner fast={true} message="Loading page..." />}>
    {children}
  </Suspense>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page (Public) - Load immediately */}
      <Route path="/" element={<Landing />} />
      
      
      {/* Authentication Routes - Load immediately */}
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
      
      {/* Admin Auth Routes - Lazy load */}
      <Route path="/admin/login" element={
        <PublicRoute>
          <LazyRoute>
            <AdminLogin />
          </LazyRoute>
        </PublicRoute>
      } />
      
      {/* Survey Response Route (Public) - Lazy load */}
      <Route path="/survey/:id" element={
        <LazyRoute>
          <SurveyResponse />
        </LazyRoute>
      } />
      
      {/* Short URL redirect */}
      <Route path="/s/:id" element={
        <LazyRoute>
          <SurveyResponse />
        </LazyRoute>
      } />
      
      {/* Public Marketing Routes - Lazy load */}
      <Route path="/pricing" element={
        <LazyRoute>
          <Pricing />
        </LazyRoute>
      } />
      <Route path="/services" element={
        <LazyRoute>
          <AdvancedServices />
        </LazyRoute>
      } />
      <Route path="/contact" element={
        <LazyRoute>
          <Contact />
        </LazyRoute>
      } />
      
      
      {/* Protected Routes - All lazy loaded */}
      <Route path="/app" element={
        <ProtectedRoute>
          <ProfessionalLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={
          <LazyRoute>
            <Dashboard />
          </LazyRoute>
        } />
              <Route path="advanced-dashboard" element={
                <LazyRoute>
                  <AdvancedDashboard />
                </LazyRoute>
              } />
              <Route path="surveys" element={
                <LazyRoute>
                  <SurveyDashboard />
                </LazyRoute>
              } />
              <Route path="draft-surveys" element={
                <LazyRoute>
                  <DraftSurveys />
                </LazyRoute>
              } />
              <Route path="survey-dashboard" element={
                <LazyRoute>
                  <SurveyDashboard />
                </LazyRoute>
              } />
              <Route path="published-surveys" element={
                <LazyRoute>
                  <PublishedSurveys />
                </LazyRoute>
              } />
              <Route path="reports" element={
                <LazyRoute>
                  <PlanProtectedRoute requiredPlan="pro" feature="Advanced Reports & Analytics">
                    <Reports />
                  </PlanProtectedRoute>
                </LazyRoute>
              } />
              <Route path="template-editor/:id" element={
                <LazyRoute>
                  <TemplateEditor />
                </LazyRoute>
              } />
              <Route path="edit/:id" element={
                <LazyRoute>
                  <SurveyEdit />
                </LazyRoute>
              } />
        <Route path="preview/:id" element={
          <LazyRoute>
            <SurveyPreview />
          </LazyRoute>
        } />
        <Route path="templates/:id/edit" element={
          <LazyRoute>
            <TemplateEditor />
          </LazyRoute>
        } />
        <Route path="templates/new" element={
          <LazyRoute>
            <TemplateEditor />
          </LazyRoute>
        } />
        <Route path="builder" element={
          <LazyRoute>
            <SurveyBuilder />
          </LazyRoute>
        } />
        <Route path="builder-v2/:id?" element={
          <LazyRoute>
            <SurveyBuilder />
          </LazyRoute>
        } />
        <Route path="builder/:id" element={
          <LazyRoute>
            <SurveyBuilder />
          </LazyRoute>
        } />
        <Route path="publish/:id" element={
          <LazyRoute>
            <PublishSurvey />
          </LazyRoute>
        } />
        <Route path="analytics" element={
          <LazyRoute>
            <AnalyticsRouter />
          </LazyRoute>
        } />
        <Route path="analytics/:id" element={
          <LazyRoute>
            <SurveyAnalytics />
          </LazyRoute>
        } />
        <Route path="advanced-analytics/:id" element={
          <LazyRoute>
            <AdvancedAnalytics />
          </LazyRoute>
        } />
        <Route path="subscriptions" element={
          <LazyRoute>
            <Subscriptions />
          </LazyRoute>
        } />
        <Route path="pricing" element={
          <LazyRoute>
            <Pricing />
          </LazyRoute>
        } />
        <Route path="services" element={
          <LazyRoute>
            <AdvancedServices />
          </LazyRoute>
        } />
        <Route path="billing" element={
          <LazyRoute>
            <Billing />
          </LazyRoute>
        } />
        <Route path="qr-messages" element={
          <LazyRoute>
            <QRMessages />
          </LazyRoute>
        } />
        <Route path="billing-debug" element={
          <AdminOnly superAdminOnly={true}>
            <LazyRoute>
              <BillingDebug />
            </LazyRoute>
          </AdminOnly>
        } />
        <Route path="teams" element={
          <LazyRoute>
            <Teams />
          </LazyRoute>
        } />
        <Route path="features" element={
          <LazyRoute>
            <FeatureDashboard />
          </LazyRoute>
        } />
        <Route path="team" element={
          <LazyRoute>
            <Team />
          </LazyRoute>
        } />
        <Route path="profile" element={
          <LazyRoute>
            <Profile />
          </LazyRoute>
        } />
        <Route path="account" element={
          <LazyRoute>
            <AccountManagement />
          </LazyRoute>
        } />
        <Route path="events" element={
          <LazyRoute>
            <EventManagement />
          </LazyRoute>
        } />
        <Route path="events/published" element={
          <LazyRoute>
            <PublishedEvents />
          </LazyRoute>
        } />
        <Route path="events/register/:eventId" element={
          <LazyRoute>
            <EventRegistration />
          </LazyRoute>
        } />
        <Route path="events/view/:eventId" element={
          <LazyRoute>
            <PublicEventView />
          </LazyRoute>
        } />
        <Route path="forms" element={
          <LazyRoute>
            <Forms />
          </LazyRoute>
        } />
        <Route path="templates" element={
          <LazyRoute>
            <TemplateLibrary />
          </LazyRoute>
        } />
        <Route path="templates/professional-events" element={
          <LazyRoute>
            <ProfessionalEventCreation />
          </LazyRoute>
        } />
        
        
        {/* Admin Routes - Lazy loaded */}
        <Route path="admin" element={
          <LazyRoute>
            <AdminDashboard />
          </LazyRoute>
        } />
        <Route path="admin/accounts" element={
          <LazyRoute>
            <AdminAccounts />
          </LazyRoute>
        } />
              <Route path="super-admin" element={
                <LazyRoute>
                  <SuperAdminDashboard />
                </LazyRoute>
              } />
              
      </Route>
      
      {/* Public QR Message Reveal Route */}
        <Route path="/qr-message/:messageId" element={
          <LazyRoute>
            <QRMessageReveal />
          </LazyRoute>
        } />
        <Route path="/form/:formId" element={
          <LazyRoute>
            <FormViewer />
          </LazyRoute>
        } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <AppRoutes />
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App; 