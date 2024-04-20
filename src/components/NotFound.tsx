import React from 'react';
import { WithErrorBoundariesWrapper } from './WithErrorBoundaries';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl text-gray-700 font-bold mb-8 animate-bounce">404</h1>
      <p className="text-xl text-gray-600 mb-4">Oops! Page not found.</p>
      <p className="text-gray-500 mb-4">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <a href="/" className="text-blue-600 hover:underline">Go to Home Page</a>
    </div>
  );
};

export default WithErrorBoundariesWrapper(NotFoundPage);
