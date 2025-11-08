import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductData } from '../hooks/useProductData';
import DynamicProductSection from '../components/DynamicProductSection';
import LoadingSpinner from '../components/LoadingSpinner';

const UniversalProductPage = () => {
  const { productId } = useParams();
  
  // Determine if productId is a numeric ID or a route slug
  // If it's a number, use it as-is. If it's a string (route), pass it directly.
  const isNumericId = !isNaN(parseInt(productId)) && productId.toString().match(/^\d+$/);
  const productIdentifier = isNumericId ? parseInt(productId) : productId;
  
  const { sections, itemsBySection, loading, error } = useProductData(productIdentifier);

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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-saree-teal text-white px-6 py-3 rounded-lg hover:bg-saree-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-sm text-gray-600 mb-4">This product doesn't exist or has no content.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-saree-teal text-white px-6 py-3 rounded-lg hover:bg-saree-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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


