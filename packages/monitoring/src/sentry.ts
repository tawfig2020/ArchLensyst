import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';

export interface SentryConfig {
  dsn?: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
}

export function initSentry(config?: SentryConfig): void {
  if (!SENTRY_DSN && !config?.dsn) {
    console.warn('[ARCHLENS Monitoring] Sentry DSN not configured — skipping initialization');
    return;
  }

  Sentry.init({
    dsn: config?.dsn ?? SENTRY_DSN,
    environment: config?.environment ?? import.meta.env.MODE ?? 'development',
    release: config?.release ?? `archlens@${import.meta.env.VITE_APP_VERSION ?? '3.0.0'}`,

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
      Sentry.feedbackIntegration({
        colorScheme: 'dark',
        buttonLabel: 'Report Issue',
        submitButtonLabel: 'Submit',
        formTitle: 'ArchLens Bug Report',
      }),
    ],

    tracesSampleRate: config?.tracesSampleRate ?? 0.2,
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/api\.archlens\./,
      /^https:\/\/.*\.archlens\.dev/,
    ],

    replaysSessionSampleRate: config?.replaysSessionSampleRate ?? 0.1,
    replaysOnErrorSampleRate: config?.replaysOnErrorSampleRate ?? 1.0,

    beforeSend(event) {
      // Scrub sensitive data
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['X-API-Key'];
      }
      return event;
    },

    beforeBreadcrumb(breadcrumb) {
      // Filter noisy breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null;
      }
      return breadcrumb;
    },
  });
}

// ─── Sentry Helpers ─────────────────────────────────────────────────────────

export function captureAnalysisError(
  error: Error,
  context: { filePath?: string; operation?: string; userId?: string },
): void {
  Sentry.withScope((scope) => {
    scope.setTag('archlens.operation', context.operation ?? 'unknown');
    scope.setContext('analysis', {
      filePath: context.filePath,
      operation: context.operation,
    });
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }
    Sentry.captureException(error);
  });
}

export function trackPerformance(name: string, fn: () => void): void {
  const transaction = Sentry.startInactiveSpan({ name, op: 'archlens.operation' });
  try {
    fn();
  } finally {
    transaction?.end();
  }
}

export { Sentry };
