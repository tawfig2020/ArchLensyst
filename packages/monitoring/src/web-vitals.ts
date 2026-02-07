import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';
import type { Metric } from 'web-vitals';

export type VitalsReporter = (metric: Metric) => void;

const DEFAULT_ENDPOINT = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/vitals`
  : null;

/**
 * Sends Web Vitals metrics to the analytics endpoint and/or SpeedCurve LUX.
 */
function createReporter(endpoint?: string): VitalsReporter {
  return (metric: Metric) => {
    const body = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Send to ArchLens analytics API
    const targetEndpoint = endpoint ?? DEFAULT_ENDPOINT;
    if (targetEndpoint) {
      // Use sendBeacon for reliability on page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon(targetEndpoint, JSON.stringify(body));
      } else {
        void fetch(targetEndpoint, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        });
      }
    }

    // SpeedCurve LUX integration
    const luxGlobal = (window as Record<string, unknown>).LUX as
      | { mark?: (name: string, value: number) => void }
      | undefined;
    if (luxGlobal?.mark) {
      luxGlobal.mark(metric.name, metric.value);
    }

    // Console in development
    if (import.meta.env.DEV) {
      const color =
        metric.rating === 'good'
          ? '#3fb950'
          : metric.rating === 'needs-improvement'
            ? '#d29922'
            : '#f85149';
      console.warn(
        `%c[Web Vital] ${metric.name}: ${metric.value.toFixed(1)} (${metric.rating})`,
        `color: ${color}; font-weight: bold;`,
      );
    }
  };
}

/**
 * Initialize Web Vitals collection for all Core Web Vitals + supplementary metrics.
 */
export function initWebVitals(options?: { endpoint?: string }): void {
  const report = createReporter(options?.endpoint);

  onCLS(report);
  onFID(report);
  onLCP(report);
  onFCP(report);
  onTTFB(report);
  onINP(report);
}
