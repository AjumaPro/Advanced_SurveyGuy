import React from 'react';

// Performance monitoring utilities
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
};

// Component performance wrapper
export const withPerformanceTracking = (Component, name) => {
  return (props) => {
    const start = performance.now();
    
    React.useEffect(() => {
      const end = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 ${name} rendered in ${(end - start).toFixed(2)}ms`);
      }
    });
    
    return <Component {...props} />;
  };
};

// Bundle size tracking
export const trackBundleLoad = (componentName) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`📦 ${componentName} loaded in ${(end - start).toFixed(2)}ms`);
    };
  }
  return () => {};
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = performance.memory;
    console.log('💾 Memory Usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`
    });
  }
};

// Network performance tracking
export const trackNetworkRequest = async (name, requestFn) => {
  const start = performance.now();
  try {
    const result = await requestFn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 ${name} request completed in ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const end = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.error(`🌐 ${name} request failed after ${(end - start).toFixed(2)}ms:`, error);
    }
    throw error;
  }
};

// Debounce utility for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }

  // Fallback for browsers without IntersectionObserver
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {}
  };
};

const performanceUtils = {
  measurePerformance,
  withPerformanceTracking,
  trackBundleLoad,
  trackMemoryUsage,
  trackNetworkRequest,
  debounce,
  throttle,
  createIntersectionObserver
};

export default performanceUtils;
