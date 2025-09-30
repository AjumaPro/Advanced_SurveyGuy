import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const startTime = useRef(performance.now());
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const loadTime = performance.now() - startTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
        
        // Warn if loading is slow
        if (loadTime > 1000) {
          console.warn(`🐌 ${componentName} took ${loadTime.toFixed(2)}ms to load (slow)`);
        } else if (loadTime > 500) {
          console.warn(`⚠️ ${componentName} took ${loadTime.toFixed(2)}ms to load (moderate)`);
        } else {
          console.log(`🚀 ${componentName} loaded quickly (${loadTime.toFixed(2)}ms)`);
        }
      }
    }
  }, [componentName]);

  return {
    markLoadComplete: () => {
      const totalTime = performance.now() - startTime.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ ${componentName} fully loaded in ${totalTime.toFixed(2)}ms`);
      }
    }
  };
};

export const usePageLoadTime = (pageName) => {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const handleLoad = () => {
      const loadTime = performance.now() - startTime.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`📄 ${pageName} page loaded in ${loadTime.toFixed(2)}ms`);
      }
    };

    // Track when the page is fully loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [pageName]);
};

export default usePerformanceMonitor;
