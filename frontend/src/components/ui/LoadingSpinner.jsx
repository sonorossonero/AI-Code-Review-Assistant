// src/components/ui/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClass = size === "small" ? "h-10 w-10" : "h-10 w-10"; // Adjust size if needed
  return (
    <div
      className={`animate-spin border-t-2 border-blue-600 rounded-full ${sizeClass}`}
    />
  );
};

export { LoadingSpinner };
