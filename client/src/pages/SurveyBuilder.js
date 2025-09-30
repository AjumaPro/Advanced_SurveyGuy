import React, { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load the professional Survey Builder
const ProfessionalSurveyBuilder = React.lazy(() => import('../components/ProfessionalSurveyBuilder'));

const SurveyBuilder = () => {
        return (
    <Suspense fallback={<LoadingSpinner fast={true} message="Loading Professional Survey Builder..." />}>
      <ProfessionalSurveyBuilder />
    </Suspense>
  );
};

export default SurveyBuilder; 
