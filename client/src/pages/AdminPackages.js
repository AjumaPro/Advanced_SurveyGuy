import React, { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load the heavy AdminPackages core
const AdminPackagesCore = React.lazy(() => import('../components/AdminPackagesCore'));

const AdminPackages = () => {
      return (
    <Suspense fallback={<LoadingSpinner message="Loading Package Management..." />}>
      <AdminPackagesCore />
    </Suspense>
  );
};

export default AdminPackages; 
