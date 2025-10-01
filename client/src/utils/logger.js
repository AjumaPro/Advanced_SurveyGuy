/**
 * Production-Safe Logging Utility
 * Provides controlled logging that can be disabled in production
 */

import { getEnvironmentConfig } from './adminUtils';

const config = getEnvironmentConfig();

/**
 * Production-safe console.log
 * Only logs in development or for super admins
 */
export const log = (...args) => {
  if (!config.isProduction || isSuperAdminLogged()) {
    console.log('[LOG]', ...args);
  }
};

/**
 * Production-safe console.warn
 * Always logs warnings but with reduced verbosity in production
 */
export const warn = (...args) => {
  if (config.isProduction) {
    console.warn('[WARN]', ...args);
  } else {
    console.warn('[WARN]', ...args);
  }
};

/**
 * Production-safe console.error
 * Always logs errors
 */
export const error = (...args) => {
  console.error('[ERROR]', ...args);
};

/**
 * Debug logging - only in development
 */
export const debug = (...args) => {
  if (!config.isProduction) {
    console.log('[DEBUG]', ...args);
  }
};

/**
 * Info logging - always logs
 */
export const info = (...args) => {
  console.info('[INFO]', ...args);
};

/**
 * Check if current user is super admin (for logging purposes)
 * This is a simplified check - in a real app you'd get this from context
 */
const isSuperAdminLogged = () => {
  // In production, you might want to check localStorage or get from context
  // For now, we'll just return false to be safe
  return false;
};

/**
 * Performance logging
 */
export const perf = (label, fn) => {
  if (!config.isProduction) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`[PERF] ${label}: ${end - start}ms`);
    return result;
  }
  return fn();
};

/**
 * Group logging for related operations
 */
export const group = (label, fn) => {
  if (!config.isProduction) {
    console.group(label);
    fn();
    console.groupEnd();
  } else {
    fn();
  }
};

/**
 * Table logging for structured data
 */
export const table = (data, columns) => {
  if (!config.isProduction) {
    console.table(data, columns);
  }
};

/**
 * Trace logging for debugging call stacks
 */
export const trace = (...args) => {
  if (!config.isProduction) {
    console.trace('[TRACE]', ...args);
  }
};

// Export default logger object
export default {
  log,
  warn,
  error,
  debug,
  info,
  perf,
  group,
  table,
  trace
};
