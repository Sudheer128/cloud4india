import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProductData } from '../hooks/useProductData';
import DynamicProductSection from '../components/DynamicProductSection';
import LoadingSpinner from '../components/LoadingSpinner';

const UniversalProductPage = () => {
  const { productId } = useParams();
  const [activeSection, setActiveSection] = useState('overview');
  const isScrollingRef = useRef(false);
  const lastActiveSectionRef = useRef('overview');
  
  // Determine if productId is a numeric ID or a route slug
  // If it's a number, use it as-is. If it's a string (route), pass it directly.
  const isNumericId = !isNaN(parseInt(productId)) && productId.toString().match(/^\d+$/);
  const productIdentifier = isNumericId ? parseInt(productId) : productId;
  
  const { sections, itemsBySection, product, loading, error } = useProductData(productIdentifier);

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

  // Helper function to get section by order
  const getSectionByOrder = (order) => {
    return sections.find(section => section.order_index === order);
  };

  // Check if media_banner exists at order_index 1
  const hasMediaBanner = sections.some(s => s.section_type === 'media_banner' && s.order_index === 1 && s.is_visible !== 0);
  
  // Dynamic order offset: if media_banner exists at 1, all subsequent sections are shifted by 1
  const getOrderOffset = () => hasMediaBanner ? 1 : 0;

  // Generate navigation items from visible sections
  const getNavigationItems = () => {
    if (!sections || sections.length === 0) return [];
    
    const navItems = [];
    const offset = getOrderOffset();
    
    // Map section types to readable names and IDs for products
    const sectionMapping = [
      { order: 0, id: 'overview', label: 'Overview', type: 'hero' },
      { order: 1, id: 'media', label: 'Gallery', type: 'media_banner' },
      { order: 1 + offset, id: 'features', label: 'Features', type: 'features' },
      { order: 2 + offset, id: 'pricing', label: 'Pricing', type: 'pricing' },
      { order: 3 + offset, id: 'specifications', label: 'Specifications', type: 'specifications' },
      { order: 4 + offset, id: 'security', label: 'Security', type: 'security' },
      { order: 5 + offset, id: 'support', label: 'Support', type: 'support' },
      { order: 6 + offset, id: 'migration', label: 'Migration', type: 'migration' },
      { order: 7 + offset, id: 'use-cases', label: 'Use Cases', type: 'use_cases' },
      { order: 8 + offset, id: 'get-started', label: 'Get Started', type: 'cta' }
    ];
    
    sectionMapping.forEach(mapping => {
      const section = getSectionByOrder(mapping.order);
      if (section && section.section_type === mapping.type && section.is_visible !== 0) {
        navItems.push({
          id: mapping.id,
          label: mapping.label,
          order: mapping.order
        });
      }
    });
    
    return navItems;
  };

  const navigationItems = getNavigationItems();

  // Scroll to section smoothly
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (element) {
      // Set flag to prevent scroll tracking interference
      isScrollingRef.current = true;
      
      // Update active section immediately
      lastActiveSectionRef.current = sectionId;
      setActiveSection(sectionId);
      
      // Calculate offset dynamically
      // Main navbar: 64px (h-16) + Sub navbar with padding
      const mainNavbar = document.querySelector('header');
      const subNavbar = document.querySelector('.sticky.top-16');
      
      let offset = 64; // Main navbar default
      if (mainNavbar) {
        offset = mainNavbar.offsetHeight;
      }
      if (subNavbar) {
        offset += subNavbar.offsetHeight;
      }
      
      // Add small buffer for better visibility
      offset += 10;
      
      // Get the actual bounding rect to avoid issues with negative margins
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Re-enable scroll tracking after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  // Map section type to section ID for navigation
  const getSectionId = (section) => {
    const offset = getOrderOffset();
    const mapping = {
      'hero': 'overview',
      'media_banner': 'media',
      'features': 'features',
      'pricing': 'pricing',
      'specifications': 'specifications',
      'security': 'security',
      'support': 'support',
      'migration': 'migration',
      'use_cases': 'use-cases',
      'cta': 'get-started'
    };
    return mapping[section.section_type] || `section-${section.id}`;
  };

  return (
    <div className="min-h-screen">
      {/* Secondary Navigation Bar - Sticky, always visible on top layer */}
      {navigationItems.length > 0 && (
        <div className="sticky top-16 left-0 right-0 z-[60] w-full py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-center px-6">
                {/* Product Title */}
                <div className="py-4 pr-8 font-semibold text-gray-900 text-base whitespace-nowrap">
                  {product?.name || productId}
                </div>
                {/* Navigation Items */}
                <nav className="flex items-center overflow-x-auto scrollbar-hide -mb-px">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`px-5 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 border-l-0 border-r-0 border-t-0 focus:outline-none focus:ring-0 ${
                        activeSection === item.id
                          ? 'border-saree-teal text-saree-teal'
                          : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {sections.map((section) => {
        const sectionId = getSectionId(section);
        const hasNavItems = navigationItems.length > 0;
        
        return (
          <div 
            key={section.id} 
            data-section-id={sectionId}
          >
            <DynamicProductSection
              section={section}
              items={itemsBySection[section.id] || []}
              product={product}
              hasNavigation={hasNavItems}
            />
          </div>
        );
      })}
    </div>
  );
};

export default UniversalProductPage;


