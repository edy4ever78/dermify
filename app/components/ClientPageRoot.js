'use client';

import { Suspense, ErrorBoundary } from 'react';

function ErrorFallback({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
      </div>
    </div>
  );
}

export default function ClientPageRoot({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-teal-500 border-gray-200 dark:border-gray-700 animate-spin"></div>
        </div>
      }>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
