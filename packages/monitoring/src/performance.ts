/**
 * Runtime performance utilities for ArchLens.
 * Tracks component render times, long tasks, and memory usage.
 */

export interface PerformanceEntry {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

const performanceLog: PerformanceEntry[] = [];

/**
 * Measure execution time of an async function.
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>,
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    const entry: PerformanceEntry = { name, duration, timestamp: Date.now(), metadata };
    performanceLog.push(entry);

    if (performanceLog.length > 1000) {
      performanceLog.splice(0, 500);
    }

    if (duration > 100) {
      console.warn(`[ARCHLENS Perf] Slow operation: ${name} took ${duration.toFixed(1)}ms`);
    }
  }
}

/**
 * Measure execution time of a sync function.
 */
export function measureSync<T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, unknown>,
): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - start;
    performanceLog.push({ name, duration, timestamp: Date.now(), metadata });
  }
}

/**
 * Observe long tasks using PerformanceObserver.
 */
export function observeLongTasks(
  callback?: (entry: PerformanceEntryList) => void,
): PerformanceObserver | null {
  if (typeof PerformanceObserver === 'undefined') return null;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          console.warn(
            `[ARCHLENS Perf] Long task detected: ${entry.duration.toFixed(1)}ms`,
          );
        }
      });
      callback?.(entries);
    });

    observer.observe({ type: 'longtask', buffered: true });
    return observer;
  } catch {
    return null;
  }
}

/**
 * Get memory usage info (Chrome only).
 */
export function getMemoryUsage(): {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
} | null {
  const perf = performance as Performance & {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  };

  if (perf.memory) {
    return {
      usedJSHeapSize: perf.memory.usedJSHeapSize,
      totalJSHeapSize: perf.memory.totalJSHeapSize,
      jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
    };
  }
  return null;
}

/**
 * Get collected performance entries.
 */
export function getPerformanceLog(): readonly PerformanceEntry[] {
  return performanceLog;
}

export function clearPerformanceLog(): void {
  performanceLog.length = 0;
}
