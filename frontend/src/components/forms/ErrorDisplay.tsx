import React from 'react';

interface ErrorDisplayProps {
  errors: Record<string, string>;
  fieldName: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, fieldName }) => {
  if (!errors[fieldName]) {
    return null;
  }

  return (
    <p className="mt-1 text-red-500 text-sm">{errors[fieldName]}</p>
  );
};

export default ErrorDisplay;