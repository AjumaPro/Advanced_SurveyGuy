/**
 * BackNavigation Component
 * Provides consistent back navigation that redirects to dashboard for signed-in users
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useDashboardNavigation } from '../utils/navigationUtils';

const BackNavigation = ({ 
  className = "p-2 text-gray-400 hover:text-gray-600 transition-colors",
  showText = false,
  text = null,
  onClick = null,
  ...props 
}) => {
  const { navigateToDashboard, isSignedIn } = useDashboardNavigation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigateToDashboard();
    }
  };

  const defaultText = isSignedIn ? 'Back to Dashboard' : 'Back to Home';
  const displayText = text || defaultText;

  return (
    <button
      onClick={handleClick}
      className={className}
      title={displayText}
      {...props}
    >
      <ArrowLeft className="w-5 h-5" />
      {showText && (
        <span className="ml-2">{displayText}</span>
      )}
    </button>
  );
};

export default BackNavigation;
