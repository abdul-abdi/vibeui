/**
 * Performance monitoring and optimization utilities
 */

/**
 * Detects if the device is low-end and should use reduced animations/effects
 */
export const detectLowPerformanceDevice = (): boolean => {
  // Check if running in browser
  if (typeof window === 'undefined') return false;
  
  // Check if low performance mode was explicitly set
  if (localStorage.getItem('lowPerformanceMode') === 'true') return true;
  if (localStorage.getItem('lowPerformanceMode') === 'false') return false;
  
  // Simple and lightweight detection
  const isLowEndDevice = 
    ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Store the setting
  localStorage.setItem('lowPerformanceMode', isLowEndDevice ? 'true' : 'false');
  
  return isLowEndDevice;
};

/**
 * Reports performance metrics to console (only in production)
 */
export const reportPerformanceMetrics = (): void => {
  if (typeof window === 'undefined' || !window.performance || process.env.NODE_ENV !== 'production') return;
  
  // Use requestIdleCallback to avoid blocking the main thread
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      try {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log(`Performance: ${pageLoadTime}ms (${localStorage.getItem('lowPerformanceMode') === 'true' ? 'Low' : 'High'} quality)`);
      } catch (e) {
        // Silent fail
      }
    });
  } else {
    setTimeout(() => {
      try {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log(`Performance: ${pageLoadTime}ms (${localStorage.getItem('lowPerformanceMode') === 'true' ? 'Low' : 'High'} quality)`);
      } catch (e) {
        // Silent fail
      }
    }, 1000);
  }
};

/**
 * Toggles low performance mode
 */
export const toggleLowPerformanceMode = (enabled?: boolean): boolean => {
  const newValue = enabled !== undefined ? enabled : 
    localStorage.getItem('lowPerformanceMode') !== 'true';
  
  localStorage.setItem('lowPerformanceMode', newValue ? 'true' : 'false');
  return newValue;
};

/**
 * Gets optimized animation duration based on performance mode
 */
export const getOptimizedDuration = (baseDuration: number): number => {
  return localStorage.getItem('lowPerformanceMode') === 'true' 
    ? baseDuration * 0.5  // Reduce animation time for low-end devices
    : baseDuration;
};

// Simplified quality settings
export type QualityLevel = 'low' | 'medium' | 'high';

/**
 * Get recommended animation settings based on quality level
 */
export const getAnimationSettings = (qualityLevel: QualityLevel = 'medium') => {
  switch(qualityLevel) {
    case 'low': 
      return { 
        duration: 0.2, 
        easing: 'linear',
        particles: 0,
        blur: false,
        parallax: false
      };
    case 'medium': 
      return { 
        duration: 0.4, 
        easing: 'easeOut',
        particles: 10,
        blur: true,
        parallax: true
      };
    case 'high': 
      return { 
        duration: 0.6, 
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        particles: 30,
        blur: true,
        parallax: true
      };
    default: 
      return { 
        duration: 0.4, 
        easing: 'easeOut',
        particles: 10,
        blur: true,
        parallax: true
      };
  }
}; 