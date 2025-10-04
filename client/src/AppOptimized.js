import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ProfessionalLayout } from './components/ProfessionalLayout';
import { AdminOnly, PlanProtectedRoute } from './components/ProtectedRoutes';

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
import Contact from './pages/Contact';

// Essential components - lazy load only what's needed
const SurveyAnalytics = React.lazy(() => import('./pages/SurveyAnalytics'));
const SurveyResponse = React.lazy(() => import('./pages/SurveyResponse'));
const SurveyEdit = React.lazy(() => import('./pages/SurveyEdit'));
const QRMessages = React.lazy(() => import('./pages/QRMessages'));
const QRMessageReveal = React.lazy(() => import('./pages/QRMessageReveal'));
const Forms = React.lazy(() => import('./pages/Forms'));
const FormViewer = React.lazy(() => import('./pages/FormViewer'));
const EventManagement = React.lazy(() => import('./pages/EventManagement'));
const PublishedEvents = React.lazy(() => import('./pages/PublishedEvents'));
const EventRegistration = React.lazy(() => import('./pages/EventRegistration'));
const PublicEventView = React.lazy(() => import('./pages/PublicEventView'));
const TemplateLibrary = React.lazy(() => import('./pages/TemplateLibrary'));

// Admin components - minimal set
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminAccounts = React.lazy(() => import('./pages/AdminAccounts'));
const SuperAdminDashboard = React.lazy(() => import('./pages/SuperAdminDashboard'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return children;
};

// Lazy Route Wrapper
const LazyRoute = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

function App() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            
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
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Admin Login */}
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
              
              {/* Event Registration Route (Public) - Lazy load */}
              <Route path="/event/:id/register" element={
                <LazyRoute>
                  <EventRegistration />
                </LazyRoute>
              } />
              
              {/* Public Event View Route - Lazy load */}
              <Route path="/event/:id" element={
                <LazyRoute>
                  <PublicEventView />
                </LazyRoute>
              } />
              
              {/* Protected Routes - All optimized */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <ProfessionalLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                
                {/* Core Dashboard Routes - Load immediately */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="surveys" element={<SurveyDashboard />} />
                <Route path="published-surveys" element={<PublishedSurveys />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
                <Route path="billing" element={<Billing />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                
                {/* Survey Builder - Load immediately */}
                <Route path="survey-builder" element={<SurveyBuilder />} />
                <Route path="survey-builder/:id" element={<SurveyBuilder />} />
                
                {/* Secondary Routes - Lazy load */}
                <Route path="analytics" element={
                  <LazyRoute>
                    <SurveyAnalytics />
                  </LazyRoute>
                } />
                <Route path="survey/:id/edit" element={
                  <LazyRoute>
                    <SurveyEdit />
                  </LazyRoute>
                } />
                <Route path="qr-messages" element={
                  <LazyRoute>
                    <QRMessages />
                  </LazyRoute>
                } />
                <Route path="forms" element={
                  <LazyRoute>
                    <Forms />
                  </LazyRoute>
                } />
                <Route path="forms/:id" element={
                  <LazyRoute>
                    <FormViewer />
                  </LazyRoute>
                } />
                <Route path="events" element={
                  <LazyRoute>
                    <EventManagement />
                  </LazyRoute>
                } />
                <Route path="published-events" element={
                  <LazyRoute>
                    <PublishedEvents />
                  </LazyRoute>
                } />
                <Route path="templates" element={
                  <LazyRoute>
                    <TemplateLibrary />
                  </LazyRoute>
                } />
                
                {/* Admin Routes - Minimal set */}
                <Route path="admin" element={
                  <AdminOnly>
                    <LazyRoute>
                      <AdminDashboard />
                    </LazyRoute>
                  </AdminOnly>
                } />
                <Route path="admin/accounts" element={
                  <AdminOnly>
                    <LazyRoute>
                      <AdminAccounts />
                    </LazyRoute>
                  </AdminOnly>
                } />
                <Route path="super-admin" element={
                  <AdminOnly superAdminOnly={true}>
                    <LazyRoute>
                      <SuperAdminDashboard />
                    </LazyRoute>
                  </AdminOnly>
                } />
              </Route>
              
              {/* Public QR Message Reveal Route */}
              <Route path="/qr-message/:messageId" element={
                <LazyRoute>
                  <QRMessageReveal />
                </LazyRoute>
              } />
              
              {/* Form Viewer Route (Public) */}
              <Route path="/form/:id" element={
                <LazyRoute>
                  <FormViewer />
                </LazyRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </CurrencyProvider>
  );
}

export default App;
