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

  // Generate navigation items from visible sections - using dynamic titles from CMS
  const getNavigationItems = () => {
    if (!sections || sections.length === 0) return [];
    
    // Get all visible sections, sorted by order
    const visibleSections = sections
      .filter(s => s.is_visible !== 0)
      .sort((a, b) => a.order_index - b.order_index);
    
    // Map section types to navigation IDs
    const typeToIdMapping = {
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
    
    // Helper to create short navigation labels
    const getShortLabel = (title, sectionType) => {
      if (!title) return sectionType;
      
      // Always show "Overview" for hero section
      if (sectionType === 'hero') {
        return 'Overview';
      }
      
      // Common patterns to shorten
      const patterns = {
        'Ready to Accelerate': 'Get Started',
        'Ready to Get Started': 'Get Started',
        'Ready to': 'Get Started',
        'Perfect For': 'Use Cases',
        'Expert Support': 'Support',
        'Easy Migration': 'Migration',
        'Flexible Pricing': 'Pricing',
        'Technical Specifications': 'Specs',
        'Security & Compliance': 'Security',
        'Key Features': 'Features',
        'in Action': 'Gallery',
        'in action': 'Gallery'
      };
      
      // Check if title matches or contains any pattern
      for (const [pattern, shortLabel] of Object.entries(patterns)) {
        if (title.startsWith(pattern) || title.includes(pattern)) {
          return shortLabel;
        }
      }
      
      // If title is long (>20 chars), intelligently shorten it
      if (title.length > 20) {
        // Take first 2-3 meaningful words
        const words = title.split(' ').filter(w => w.length > 0);
        if (words.length <= 2) {
          return title; // Already short enough
        }
        
        // Skip common filler words for shortening
        const fillerWords = ['the', 'and', 'or', 'for', 'with', 'your', 'our', 'in', 'on', 'at'];
        const meaningfulWords = words.filter(w => !fillerWords.includes(w.toLowerCase()));
        
        // Take first 2 meaningful words, max 20 chars
        const shortTitle = meaningfulWords.slice(0, 2).join(' ');
        return shortTitle.length > 20 ? shortTitle.substring(0, 17) + '...' : shortTitle;
      }
      
      return title;
    };
    
    // Build navigation items dynamically from actual sections
    const navItems = visibleSections.map(section => ({
      id: typeToIdMapping[section.section_type] || `section-${section.id}`,
      label: getShortLabel(section.title, section.section_type), // Use shortened label
      fullTitle: section.title, // Keep full title for reference
      order: section.order_index,
      type: section.section_type
    }));
    
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


