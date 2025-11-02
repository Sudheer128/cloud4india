import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ServerIcon, 
  CpuChipIcon, 
  CircleStackIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CloudIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  LockClosedIcon,
  GlobeAltIcon,
  BoltIcon,
  CheckIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useProducts, useMainProductsContent } from '../hooks/useCMS';
import LoadingSpinner from '../components/LoadingSpinner';

const MainProductsPage = () => {
  const { data: mainPageData, loading: heroLoading } = useMainProductsContent();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);
  
  // Use sections from mainPageData instead of products
  const products = mainPageData?.sections || [];
  const loading = heroLoading;
  const error = null;

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    products.forEach(product => {
      if (product.category && product.category.trim()) {
        uniqueCategories.add(product.category);
      }
    });
    return ['all', ...Array.from(uniqueCategories).sort()];
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productName = product.title || product.name || '';
      const productDesc = product.description || '';
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           productDesc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Get visible products based on pagination
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  
  // Reset visible count when search or filter changes
  useEffect(() => {
    setVisibleCount(8);
  }, [searchTerm, selectedCategory]);

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const hasMore = visibleCount < filteredProducts.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white/70 mt-4">Loading our innovative solutions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Products</h2>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section - Modern Dark Theme - Compact */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full text-blue-300 text-xs font-medium mb-4 border border-blue-500/30">
              <CloudIcon className="w-4 h-4 mr-2" />
              {mainPageData?.hero?.subtitle || 'Enterprise Cloud Solutions - Made in India'}
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                {mainPageData?.hero?.title || 'Cloud Products'}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-6 max-w-3xl mx-auto">
              {mainPageData?.hero?.description || 'Accelerate your digital transformation with our cutting-edge cloud infrastructure. Built for scale, optimized for performance, designed for the future.'}
            </p>

            {/* CTA Button */}
            <div className="flex justify-center items-center mb-8">
              <Link 
                to="/pricing"
                className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { 
                  label: mainPageData?.hero?.stat1_label || 'Global Customers', 
                  value: mainPageData?.hero?.stat1_value || '10K+', 
                  icon: GlobeAltIcon 
                },
                { 
                  label: mainPageData?.hero?.stat2_label || 'Uptime SLA', 
                  value: mainPageData?.hero?.stat2_value || '99.9%', 
                  icon: ChartBarIcon 
                },
                { 
                  label: mainPageData?.hero?.stat3_label || 'Data Centers', 
                  value: mainPageData?.hero?.stat3_value || '15+', 
                  icon: ServerIcon 
                },
                { 
                  label: mainPageData?.hero?.stat4_label || 'Support Rating', 
                  value: mainPageData?.hero?.stat4_value || '4.9★', 
                  icon: StarIcon 
                }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-lg font-bold text-white mb-0.5">{stat.value}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="relative py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
            Search All Products
          </h1>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Filter Button */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white text-sm"
              >
                <FunnelIcon className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
              </button>
              
              {/* Filter Dropdown */}
              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products & services"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Product Count Display */}
          <div className="mb-5">
            <p className="text-xs text-gray-600">
              Displaying {filteredProducts.length > 0 ? 1 : 0}-{Math.min(visibleCount, filteredProducts.length)} ({filteredProducts.length})
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {visibleProducts && visibleProducts.length > 0 ? (
              visibleProducts.map((product, index) => {
                // Map product to section format for ProductCard
                // Use section data if available, otherwise fall back to product data
                const section = {
                  id: product.id,
                  product_id: product.product_id || product.id,
                  title: product.title || product.name,
                  description: product.description,
                  category: product.category,
                  popular_tag: product.popular_tag || 'Most Popular',
                  features: product.features || [],
                  price: product.price || '₹2,999',
                  price_period: product.price_period || '/month',
                  free_trial_tag: product.free_trial_tag || 'Free Trial',
                  button_text: product.button_text || 'Explore Product'
                };
                return (
                  <ProductCard 
                    key={product.id} 
                    section={section} 
                    index={index}
                    isHovered={hoveredCard === product.id}
                    onHover={setHoveredCard}
                  />
                );
              })
            ) : (
              !loading && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No products found</p>
                </div>
              )
            )}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMore}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Show 8 more
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Modern Product Card Component - Optimized & Compact
const ProductCard = ({ section, index, isHovered, onHover }) => {
  // Icon mapping for different product types
  const getProductIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('server') || titleLower.includes('compute')) return ServerIcon;
    if (titleLower.includes('cpu') || titleLower.includes('intensive')) return CpuChipIcon;
    if (titleLower.includes('memory') || titleLower.includes('storage')) return CircleStackIcon;
    if (titleLower.includes('backup') || titleLower.includes('security')) return ShieldCheckIcon;
    return CloudIcon;
  };

  const IconComponent = getProductIcon(section.title);

  // Use features from section data if available, filter out empty ones
  const getFeatures = () => {
    if (section.features && Array.isArray(section.features)) {
      // Filter out empty features and map to feature objects
      const validFeatures = section.features.filter(f => f && f.trim());
      if (validFeatures.length > 0) {
        const iconMap = [BoltIcon, LockClosedIcon, ChartBarIcon];
        return validFeatures.slice(0, 3).map((text, index) => ({
          icon: iconMap[index % iconMap.length],
          text: text.trim()
        }));
      }
    }
    // Return empty array if no valid features (don't show fallback defaults)
    return [];
  };

  const features = getFeatures();

  return (
    <div 
      className="group relative"
      style={{ willChange: 'transform' }}
      onMouseEnter={() => onHover(section.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Card */}
      <div className={`
        relative bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden
        transition-all duration-200 transform
        ${isHovered ? 'scale-[1.02] shadow-xl shadow-blue-500/10' : ''}
      `}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        
        {/* Content */}
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
              ${isHovered 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-md' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }
            `}>
              <IconComponent className={`w-6 h-6 transition-colors duration-200 ${isHovered ? 'text-white' : 'text-gray-600'}`} />
            </div>
            
            {/* Popular Badge - Only show if popular_tag exists */}
            {section.popular_tag && section.popular_tag.trim() && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {section.popular_tag}
              </span>
            )}
          </div>

          {/* Category - Only show if category exists */}
          {section.category && section.category.trim() && (
            <div className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-3">
              {section.category}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2.5 group-hover:text-blue-900 transition-colors line-clamp-2">
            {section.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {section.description}
          </p>

          {/* Features - Only show if there are valid features */}
          {features.length > 0 && (
            <div className="space-y-2 mb-5">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-2.5 h-2.5 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-700 line-clamp-1">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing - Only show if price exists */}
          {section.price && section.price.trim() && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">{section.price}</span>
                  {section.price_period && section.price_period.trim() && (
                    <span className="text-gray-600 text-sm ml-1">{section.price_period}</span>
                  )}
                </div>
                {section.free_trial_tag && section.free_trial_tag.trim() && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {section.free_trial_tag}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link 
            to={`/products/${section.product_id}`}
            className={`
              group/btn relative w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${isHovered 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
              }
            `}
          >
            <span className="relative z-10 flex items-center">
              {section.button_text || 'Explore Solution'}
              <ArrowRightIcon className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </span>
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
            )}
          </Link>
        </div>

        {/* Hover Effect Border */}
        <div className={`
          absolute inset-0 rounded-xl border-2 transition-all duration-200
          ${isHovered ? 'border-blue-500/30' : 'border-transparent'}
        `}></div>
      </div>

      {/* Background Glow Effect - Simplified for performance */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-lg -z-10"></div>
      )}
    </div>
  );
};

export default MainProductsPage;
