'use client';

import { memo } from 'react';

interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

const ErrorDisplay = memo(function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="mt-8 text-center">
      <div className="border-2 border-red-200 rounded-lg p-6 max-w-2xl mx-auto bg-red-50">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold mb-4">
          ⚠️ Error
        </div>
        <p className="text-red-900 text-lg font-semibold mb-2">Error</p>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={onDismiss}
          className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-300 cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
});

export default ErrorDisplay;

