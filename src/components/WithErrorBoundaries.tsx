import React from "react";
import { withErrorBoundary } from "react-error-boundary";

const WithErrorBoundariesWrapper = (
  componentThayMayError: React.ComponentType | JSX.Element
) => {
  return withErrorBoundary(componentThayMayError, {
    FallbackComponent: ErrorFallback,
  });
};

export { WithErrorBoundariesWrapper };

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div
      role="alert"
      className="relative top-[15vh] w-1/3 rounded-2xl p-2 shadow-2xl text-center left-[50%] -translate-x-[50%]"
    >
      <p className="text-2xl lg:text-4xl font-bold text-orange-500">Oops!</p>
      <p className="mt-4 font-medium">{error.message}</p>
      <button
        className="px-2 py-2 font-semibold text-lg bg-orange-600 rounded-lg text-white mt-5"
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    </div>
  );
};
