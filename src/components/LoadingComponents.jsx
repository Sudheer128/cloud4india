import React from 'react';

// Loading spinner component
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

// Error message component
const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="text-red-600 text-center">
        <p className="font-medium">❌ Error loading content</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// Empty state component
const EmptyState = ({ message = 'No content available', icon = '📭' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-lg">{message}</p>
    </div>
  );
};

// Content wrapper with loading, error, and empty states
const ContentWrapper = ({ 
  loading, 
  error, 
  data, 
  onRetry, 
  emptyMessage,
  children,
  loadingText = 'Loading...',
  showEmptyState = true
}) => {
  if (loading) {
    return <LoadingSpinner text={loadingText} />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} />;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    if (showEmptyState) {
      return <EmptyState message={emptyMessage} />;
    }
    return null;
  }

  return children;
};

export { LoadingSpinner, ErrorMessage, EmptyState, ContentWrapper };
export default ContentWrapper;
