import React, { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load the plan-based Dashboard
const PlanBasedDashboard = React.lazy(() => import('../components/PlanBasedDashboard'));

const Dashboard = () => {
  return (
    <Suspense fallback={<LoadingSpinner fast={true} message="Loading your personalized dashboard..." />}>
      <PlanBasedDashboard />
    </Suspense>
  );
};

export default Dashboard;