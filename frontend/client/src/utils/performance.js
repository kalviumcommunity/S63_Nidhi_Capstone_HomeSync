// Performance monitoring utilities for improved auth flow

export const performanceMonitor = {
  // Track form submission performance
  trackAuthAction: (action, startTime) => {
    const duration = Date.now() - startTime;
    
    if (duration > 2000) { // Log slow operations
      console.warn(`Slow ${action} took ${duration}ms`);
    }
    
    return duration;
  },

  // Debounce input validation for better performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Optimize form validation timing
  optimizedValidation: (validationFn, delay = 300) => {
    return this.debounce(validationFn, delay);
  },

  // Check network connection quality
  getConnectionInfo: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    }
    return null;
  }
};

// Optimized email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Optimized password validation
export const validatePassword = (password, confirmPassword = null) => {
  const validations = {
    length: password.length >= 6,
    match: confirmPassword ? password === confirmPassword : true
  };
  
  return {
    isValid: Object.values(validations).every(Boolean),
    errors: validations
  };
};

// Form state optimization
export const getOptimizedFormState = (initialState) => ({
  ...initialState,
  loading: false,
  errors: {},
  touched: {}
});

export default performanceMonitor;
