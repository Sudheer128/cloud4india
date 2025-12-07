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

// Marketplaces section loading skeleton
const MarketplacesLoading = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Search bar skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="h-10 bg-gray-200 rounded-full w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg flex-1 max-w-md animate-pulse"></div>
        </div>

        {/* Results count skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Category pills skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-full w-28 animate-pulse"></div>
        </div>

        {/* Marketplaces grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-20 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { LoadingSpinner, ErrorMessage, EmptyState, ContentWrapper, MarketplacesLoading };
export default { LoadingSpinner, ErrorMessage, EmptyState, ContentWrapper, MarketplacesLoading };
