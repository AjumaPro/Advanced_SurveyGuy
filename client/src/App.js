import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProfessionalLayout from './components/ProfessionalLayout';
import LoadingSpinner from './components/LoadingSpinner';
import PlanProtectedRoute from './components/PlanProtectedRoute';
import { AdminOnly } from './utils/adminUtils';

// Core components that should load immediately
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load all other components to improve initial load time
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const SurveyBuilder = React.lazy(() => import('./pages/SurveyBuilder'));
// Disabled ProfessionalSurveyBuilderV2 due to runtime errors - using stable SurveyBuilder instead
// const ProfessionalSurveyBuilderV2 = React.lazy(() => import('./components/ProfessionalSurveyBuilderV2'));
const SurveyAnalytics = React.lazy(() => import('./pages/SurveyAnalytics'));
const SurveyDashboard = React.lazy(() => import('./pages/SurveyDashboard'));
const AdvancedDashboard = React.lazy(() => import('./pages/AdvancedDashboard'));
const AdvancedAnalytics = React.lazy(() => import('./pages/AdvancedAnalytics'));
const AnalyticsRouter = React.lazy(() => import('./components/AnalyticsRouter'));
const SurveyResponse = React.lazy(() => import('./pages/SurveyResponse'));
const TemplateEditor = React.lazy(() => import('./pages/TemplateEditor'));
const ProfessionalEventCreation = React.lazy(() => import('./pages/ProfessionalEventCreation'));
const DraftSurveys = React.lazy(() => import('./pages/DraftSurveys'));
const SurveyPreview = React.lazy(() => import('./pages/SurveyPreview'));
const PublishSurvey = React.lazy(() => import('./pages/PublishSurvey'));
const Subscriptions = React.lazy(() => import('./pages/Subscriptions'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const AdvancedServices = React.lazy(() => import('./pages/AdvancedServices'));
const Billing = React.lazy(() => import('./pages/Billing'));
const BillingDebug = React.lazy(() => import('./pages/BillingDebug'));
const FeatureDashboard = React.lazy(() => import('./pages/FeatureDashboard'));
const Team = React.lazy(() => import('./pages/Team'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AccountManagement = React.lazy(() => import('./pages/AccountManagement'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Admin components
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminAccounts = React.lazy(() => import('./pages/AdminAccounts'));
const AdminPackages = React.lazy(() => import('./pages/AdminPackages'));
const AdminPayments = React.lazy(() => import('./pages/AdminPayments'));
const AdminRegister = React.lazy(() => import('./pages/AdminRegister'));
const SuperAdminAdmins = React.lazy(() => import('./pages/SuperAdminAdmins'));
const SuperAdminDashboard = React.lazy(() => import('./pages/SuperAdminDashboard'));
const AdminSetup = React.lazy(() => import('./pages/AdminSetup'));
const FeatureManagement = React.lazy(() => import('./pages/FeatureManagement'));
const DatabaseSetup = React.lazy(() => import('./pages/DatabaseSetup'));
const SuperAdminFix = React.lazy(() => import('./pages/SuperAdminFix'));
const SurveyBuilderTest = React.lazy(() => import('./pages/SurveyBuilderTest'));
const PublishedSurveys = React.lazy(() => import('./pages/PublishedSurveys'));
const Reports = React.lazy(() => import('./pages/Reports'));
const SurveyEdit = React.lazy(() => import('./pages/SurveyEdit'));
const PublishingTest = React.lazy(() => import('./pages/PublishingTest'));
const SubmissionTest = React.lazy(() => import('./pages/SubmissionTest'));
const DatabaseTest = React.lazy(() => import('./components/DatabaseTest'));
const SurveyBuilderComprehensiveTest = React.lazy(() => import('./components/SurveyBuilderComprehensiveTest'));
const SurveyEventCreator = React.lazy(() => import('./components/SurveyEventCreator'));

// Enterprise components
const EnterpriseDashboard = React.lazy(() => import('./pages/EnterpriseDashboard'));
const WhiteLabelPortal = React.lazy(() => import('./pages/WhiteLabelPortal'));
const SSOConfiguration = React.lazy(() => import('./pages/SSOConfiguration'));
const RealtimeAnalytics = React.lazy(() => import('./pages/RealtimeAnalytics'));
const AdvancedSurveyBuilder = React.lazy(() => import('./pages/AdvancedSurveyBuilder'));
const TeamManagement = React.lazy(() => import('./pages/TeamManagement'));
const APIWebhooks = React.lazy(() => import('./pages/APIWebhooks'));
const DataExportBackup = React.lazy(() => import('./pages/DataExportBackup'));
const EnterpriseSecurity = React.lazy(() => import('./pages/EnterpriseSecurity'));

// Event management
const EventManagement = React.lazy(() => import('./pages/EventManagement'));
const AdvancedEventManagement = React.lazy(() => import('./pages/AdvancedEventManagement'));
const PublishedEvents = React.lazy(() => import('./pages/PublishedEvents'));
const EventRegistration = React.lazy(() => import('./pages/EventRegistration'));
const PublicEventView = React.lazy(() => import('./pages/PublicEventView'));
const TemplateLibrary = React.lazy(() => import('./pages/TemplateLibrary'));
const SampleSurveys = React.lazy(() => import('./pages/SampleSurveys'));

// New AI and Advanced Features
const AIQuestionGenerator = React.lazy(() => import('./components/AIQuestionGenerator'));
const EnhancedFormBuilder = React.lazy(() => import('./components/EnhancedFormBuilder'));
const MobileSurveyBuilder = React.lazy(() => import('./components/MobileSurveyBuilder'));
const PaymentIntegration = React.lazy(() => import('./components/PaymentIntegration'));
const RealTimeCollaboration = React.lazy(() => import('./components/RealTimeCollaboration'));
const SmartTemplateSuggestions = React.lazy(() => import('./components/SmartTemplateSuggestions'));
const TemplateCreationWizard = React.lazy(() => import('./components/TemplateCreationWizard'));
const WizardTest = React.lazy(() => import('./components/WizardTest'));

// Test/Debug components (only load when needed)
const TestConnection = React.lazy(() => import('./pages/TestConnection'));
const SimpleTest = React.lazy(() => import('./pages/SimpleTest'));
const AuthTest = React.lazy(() => import('./pages/AuthTest'));
const NetworkTest = React.lazy(() => import('./pages/NetworkTest'));
const SimpleNetworkTest = React.lazy(() => import('./pages/SimpleNetworkTest'));
const LoginTest = React.lazy(() => import('./pages/LoginTest'));
const SupabaseConnectionTest = React.lazy(() => import('./pages/SupabaseConnectionTest'));
const DatabaseInspector = React.lazy(() => import('./pages/DatabaseInspector'));
const DatabaseConnectionReview = React.lazy(() => import('./pages/DatabaseConnectionReview'));
const DatabaseTableVerification = React.lazy(() => import('./pages/DatabaseTableVerification'));
const TestSurveyCreator = React.lazy(() => import('./components/TestSurveyCreator'));
const SurveyFunctionalityTest = React.lazy(() => import('./components/SurveyFunctionalityTest'));
const SurveyDebugger = React.lazy(() => import('./components/SurveyDebugger'));
const SubmissionDebugger = React.lazy(() => import('./components/SubmissionDebugger'));
const PublishedSurveysReview = React.lazy(() => import('./components/PublishedSurveysReview'));

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
      
      {/* Test Routes - Super Admin Only */}
      <Route path="/wizard-test" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <WizardTest />
          </LazyRoute>
        </AdminOnly>
      } />
      
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
      <Route path="/admin/register" element={
        <PublicRoute>
          <LazyRoute>
          <AdminRegister />
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
      
      {/* Test/Debug Routes - Super Admin Only */}
      <Route path="/test" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <TestConnection />
          </LazyRoute>
        </AdminOnly>
      } />
      <Route path="/simple" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <SimpleTest />
          </LazyRoute>
        </AdminOnly>
      } />
      <Route path="/auth-test" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <AuthTest />
          </LazyRoute>
        </AdminOnly>
      } />
      <Route path="/network-test" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <NetworkTest />
          </LazyRoute>
        </AdminOnly>
      } />
      <Route path="/simple-network-test" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <SimpleNetworkTest />
          </LazyRoute>
        </AdminOnly>
      } />
      <Route path="/login-test" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <LoginTest />
          </LazyRoute>
        </AdminOnly>
      } />
      <Route path="/supabase-test" element={
        <AdminOnly superAdminOnly={true}>
          <LazyRoute>
            <SupabaseConnectionTest />
          </LazyRoute>
        </AdminOnly>
      } />
      <Route path="/database-inspector" element={
        <LazyRoute>
          <DatabaseInspector />
        </LazyRoute>
      } />
      <Route path="/database-review" element={
        <LazyRoute>
          <DatabaseConnectionReview />
        </LazyRoute>
      } />
      <Route path="/database-verify" element={
        <LazyRoute>
          <DatabaseTableVerification />
        </LazyRoute>
      } />
      <Route path="/test-survey-creator" element={
        <LazyRoute>
          <TestSurveyCreator />
        </LazyRoute>
      } />
      <Route path="/test-survey-functionality" element={
        <LazyRoute>
          <SurveyFunctionalityTest />
        </LazyRoute>
      } />
      <Route path="/survey-debugger" element={
        <LazyRoute>
          <SurveyDebugger />
        </LazyRoute>
      } />
      <Route path="/submission-debugger" element={
        <LazyRoute>
          <SubmissionDebugger />
        </LazyRoute>
      } />
      <Route path="/published-surveys-review" element={
        <LazyRoute>
          <PublishedSurveysReview />
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
        <Route path="billing-debug" element={
          <LazyRoute>
            <BillingDebug />
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
        <Route path="advanced-events" element={
                <LazyRoute>
                  <PlanProtectedRoute requiredPlan="pro" feature="Advanced Events">
                    <AdvancedEventManagement />
                  </PlanProtectedRoute>
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
        <Route path="sample-surveys" element={
          <LazyRoute>
            <SampleSurveys />
          </LazyRoute>
        } />
        
        {/* New AI and Advanced Features */}
        <Route path="ai-generator" element={
          <LazyRoute>
            <AIQuestionGenerator />
          </LazyRoute>
        } />
        <Route path="forms/builder" element={
          <LazyRoute>
            <EnhancedFormBuilder 
              onSave={(form) => console.log('Form saved:', form)}
              onPublish={(form) => console.log('Form published:', form)}
              onPreview={(form) => console.log('Form preview:', form)}
            />
          </LazyRoute>
        } />
        <Route path="mobile-builder" element={
          <LazyRoute>
            <MobileSurveyBuilder />
          </LazyRoute>
        } />
        <Route path="payments" element={
          <LazyRoute>
            <PaymentIntegration 
              survey={null}
              onPaymentUpdate={(payment) => console.log('Payment updated:', payment)}
              userPlan="pro"
            />
          </LazyRoute>
        } />
        <Route path="collaboration" element={
          <LazyRoute>
            <RealTimeCollaboration 
              survey={null}
              currentUser={{ id: 'user1', name: 'Demo User', role: 'owner' }}
              onCollaborationUpdate={(collaboration) => console.log('Collaboration updated:', collaboration)}
              userPlan="pro"
            />
          </LazyRoute>
        } />
        <Route path="smart-templates" element={
          <LazyRoute>
            <SmartTemplateSuggestions />
          </LazyRoute>
        } />
        <Route path="template-wizard" element={
          <LazyRoute>
            <TemplateCreationWizard />
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
        <Route path="admin/packages" element={
          <LazyRoute>
            <AdminPackages />
          </LazyRoute>
        } />
        <Route path="admin/payments" element={
          <LazyRoute>
            <AdminPayments />
          </LazyRoute>
        } />
              <Route path="admin/super-admins" element={
                <LazyRoute>
                  <SuperAdminAdmins />
                </LazyRoute>
              } />
              <Route path="super-admin" element={
                <LazyRoute>
                  <SuperAdminDashboard />
                </LazyRoute>
              } />
              <Route path="admin/setup" element={
                <LazyRoute>
                  <AdminSetup />
                </LazyRoute>
              } />
              <Route path="admin/features" element={
                <LazyRoute>
                  <FeatureManagement />
                </LazyRoute>
              } />
              <Route path="database-setup" element={
                <LazyRoute>
                  <DatabaseSetup />
                </LazyRoute>
              } />
              <Route path="super-admin-fix" element={
                <LazyRoute>
                  <SuperAdminFix />
                </LazyRoute>
              } />
              <Route path="survey-builder-test" element={
                <LazyRoute>
                  <SurveyBuilderTest />
                </LazyRoute>
              } />
              <Route path="publishing-test" element={
                <LazyRoute>
                  <PublishingTest />
                </LazyRoute>
              } />
              <Route path="submission-test" element={
                <LazyRoute>
                  <SubmissionTest />
                </LazyRoute>
              } />
              <Route path="database-test" element={
                <LazyRoute>
                  <DatabaseTest />
                </LazyRoute>
              } />
              <Route path="survey-builder-test" element={
                <LazyRoute>
                  <SurveyBuilderComprehensiveTest />
                </LazyRoute>
              } />
              <Route path="create-surveys-events" element={
                <LazyRoute>
                  <SurveyEventCreator />
                </LazyRoute>
              } />
              
              {/* Enterprise Routes */}
              <Route path="enterprise" element={
                <LazyRoute>
                  <EnterpriseDashboard />
                </LazyRoute>
              } />
              <Route path="enterprise/white-label" element={
                <LazyRoute>
                  <WhiteLabelPortal />
                </LazyRoute>
              } />
              <Route path="enterprise/sso" element={
                <LazyRoute>
                  <SSOConfiguration />
                </LazyRoute>
              } />
              <Route path="enterprise/advanced-builder" element={
                <LazyRoute>
                  <AdvancedSurveyBuilder />
                </LazyRoute>
              } />
              <Route path="enterprise/team-management" element={
                <LazyRoute>
                  <TeamManagement />
                </LazyRoute>
              } />
              <Route path="enterprise/api-webhooks" element={
                <LazyRoute>
                  <APIWebhooks />
                </LazyRoute>
              } />
              <Route path="enterprise/data-export" element={
                <LazyRoute>
                  <DataExportBackup />
                </LazyRoute>
              } />
              <Route path="enterprise/security" element={
                <LazyRoute>
                  <EnterpriseSecurity />
                </LazyRoute>
              } />
              <Route path="analytics/realtime" element={
                <LazyRoute>
                  <RealtimeAnalytics />
                </LazyRoute>
              } />
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