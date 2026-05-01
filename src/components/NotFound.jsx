import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B0E14] text-gray-900 dark:text-white transition-colors">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-blue-600 dark:text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
