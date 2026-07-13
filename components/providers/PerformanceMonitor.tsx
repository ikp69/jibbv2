'use client';

import { useEffect } from 'react';

interface Metric {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  entries?: PerformanceEntry[];
  id?: string;
}

/**
 * PerformanceMonitor Component
 * 
 * Monitors and logs Core Web Vitals using the Web Vitals API:
 * - LCP (Largest Contentful Paint) — should be < 2.5s
 * - FID (First Input Delay) — should be < 100ms (INP preferred in newer browsers)
 * - CLS (Cumulative Layout Shift) — should be < 0.1
 * 
 * Also monitors:
 * - TTFB (Time to First Byte)
 * - FCP (First Contentful Paint)
 * - Total page load time
 * 
 * Note: Requires optional 'web-vitals' dependency
 * Falls back gracefully if library not installed
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Only run on client side in development mode
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    // Monitor Core Web Vitals using dynamic import
    const monitorWebVitals = async () => {
      try {
        // Dynamically import web-vitals library
        // @ts-ignore - web-vitals is an optional dependency
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
          'web-vitals'
        );

        // Largest Contentful Paint (LCP) - target < 2.5s
        getLCP((metric: Metric) => {
          console.log('LCP:', metric.value.toFixed(0), 'ms', metric.rating);
          if (metric.value > 2500) {
            console.warn('⚠️  LCP is above threshold (2.5s)');
          }
        });

        // First Input Delay (FID) - target < 100ms
        getFID((metric: Metric) => {
          console.log('FID:', metric.value.toFixed(0), 'ms', metric.rating);
          if (metric.value > 100) {
            console.warn('⚠️  FID is above threshold (100ms)');
          }
        });

        // Cumulative Layout Shift (CLS) - target < 0.1
        getCLS((metric: Metric) => {
          console.log('CLS:', metric.value.toFixed(3), metric.rating);
          if (metric.value > 0.1) {
            console.warn('⚠️  CLS is above threshold (0.1)');
          }
        });

        // First Contentful Paint (FCP) - target < 1.8s
        getFCP((metric: Metric) => {
          console.log('FCP:', metric.value.toFixed(0), 'ms', metric.rating);
        });

        // Time to First Byte (TTFB) - target < 600ms
        getTTFB((metric: Metric) => {
          console.log('TTFB:', metric.value.toFixed(0), 'ms', metric.rating);
        });
      } catch (error) {
        // Gracefully handle missing library - development feature only
        console.debug('Web Vitals library not available (optional dependency)');
      }
    };

    // Measure page load time using native Performance API
    const handlePageLoad = () => {
      try {
        if (window.performance && window.performance.timing) {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          console.log('📊 Total Page Load Time:', pageLoadTime, 'ms');
        }
      } catch (error) {
        console.debug('Performance API not available');
      }
    };

    window.addEventListener('load', handlePageLoad);

    // Start monitoring
    monitorWebVitals();

    // Cleanup
    return () => {
      window.removeEventListener('load', handlePageLoad);
    };
  }, []);

  return null; // This component doesn't render anything
}
