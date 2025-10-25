import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductData } from '../hooks/useProductData';
import DynamicProductSection from '../components/DynamicProductSection';
import LoadingSpinner from '../components/LoadingSpinner';

const UniversalProductPage = () => {
  const { productId } = useParams();
  
  // Handle both numeric IDs and string routes
  let actualProductId = productId;
  
  // Map string routes to numeric IDs
  const routeToIdMap = {
    'basic-cloud-servers': 1,
    'cpu-intensive-servers': 7,
    'memory-intensive-servers': 3,
    'acronis-cloud-backup': 4
  };
  
  // If productId is not a number, try to map it from route
  if (isNaN(parseInt(productId))) {
    actualProductId = routeToIdMap[productId];
    if (!actualProductId) {
      // If route not found, show error
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The requested product route does not exist.</p>
            <button 
              onClick={() => window.history.back()} 
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }
  
  const { sections, itemsBySection, loading, error } = useProductData(parseInt(actualProductId));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">This product doesn't exist or has no content.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {sections.map((section) => (
        <DynamicProductSection
          key={section.id}
          section={section}
          items={itemsBySection[section.id] || []}
        />
      ))}
    </div>
  );
};

export default UniversalProductPage;


