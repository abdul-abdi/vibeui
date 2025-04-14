import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Throttle function to limit how often a function can be called
 * @param fn Function to throttle
 * @param limit Time in milliseconds to throttle
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return function(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    if (!inThrottle) {
      lastResult = fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}

// Debounce function to delay function execution
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

// Memoization function for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Create a resource loading queue for improved performance
export const resourceLoader = (() => {
  const queue: Array<() => Promise<any>> = [];
  let isProcessing = false;

  // Process the queue with limited concurrency
  const processQueue = async (concurrency = 3) => {
    if (isProcessing || queue.length === 0) return;
    
    isProcessing = true;
    
    while (queue.length > 0) {
      const batch = queue.splice(0, concurrency);
      await Promise.all(batch.map(task => task().catch(err => console.error('Resource loading error:', err))));
    }
    
    isProcessing = false;
  };

  return {
    add: (task: () => Promise<any>, priority = false) => {
      if (priority) {
        queue.unshift(task);
      } else {
        queue.push(task);
      }
      
      // If window is defined, use requestIdleCallback for better performance
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => processQueue());
      } else {
        setTimeout(() => processQueue(), 0);
      }
    },
    
    preloadImage: (src: string, priority = false) => {
      const task = () => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
      
      resourceLoader.add(task, priority);
    }
  };
})();

// Performance monitor utility
export const performanceMonitor = {
  marks: new Map<string, number>(),
  
  start: (id: string) => {
    if (typeof performance === 'undefined') return;
    performanceMonitor.marks.set(id, performance.now());
  },
  
  end: (id: string, log = true) => {
    if (typeof performance === 'undefined') return 0;
    
    const startTime = performanceMonitor.marks.get(id);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    performanceMonitor.marks.delete(id);
    
    if (log) {
      console.info(`Performance [${id}]: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
};
