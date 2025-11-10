// src/components/LoadingSpinner.js
import React from "react";

const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-[5px]",
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-t-blue-600 border-blue-200 dark:border-gray-700 dark:border-t-blue-400`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;

