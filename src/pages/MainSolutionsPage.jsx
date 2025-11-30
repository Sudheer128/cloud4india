import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toSlug } from '../utils/slugUtils';
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
  BanknotesIcon,
  ShoppingBagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useSolutions, useMainSolutionsContent } from '../hooks/useCMS';
import LoadingSpinner from '../components/LoadingSpinner';

const MainSolutionsPage = () => {
  const { data: mainPageData, loading: heroLoading } = useMainSolutionsContent();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);
  
  // Use sections from mainPageData instead of solutions
  const solutions = mainPageData?.sections || [];
  const loading = heroLoading;
  const error = null;

  // Get unique categories from solutions
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    solutions.forEach(solution => {
      if (solution.category && solution.category.trim()) {
        uniqueCategories.add(solution.category);
      }
    });
    return ['all', ...Array.from(uniqueCategories).sort()];
  }, [solutions]);

  // Filter solutions based on search and category
  const filteredSolutions = useMemo(() => {
    return solutions.filter(solution => {
      const solutionName = solution.title || solution.name || '';
      const solutionDesc = solution.description || '';
      const matchesSearch = solutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           solutionDesc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [solutions, searchTerm, selectedCategory]);

  // Get visible solutions based on pagination
  const visibleSolutions = filteredSolutions.slice(0, visibleCount);
  
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

  const hasMore = visibleCount < filteredSolutions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saree-teal-light via-white to-saree-lime-light flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-700 mt-4">Loading our innovative solutions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saree-teal-light via-white to-saree-lime-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Error Loading Solutions</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saree-teal-light/30 via-white to-saree-amber-light/30">
      {/* Hero Section - Enhanced Attractive Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Geometric Patterns */}
            <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white/30 rounded-full"></div>
            <div className="absolute top-20 right-20 w-60 h-60 border-4 border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-white/20 rounded-lg rotate-45"></div>
            <div className="absolute bottom-20 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6 border border-white/30 shadow-xl hover:bg-white/30 transition-all duration-300 cursor-pointer">
              <CloudIcon className="w-5 h-5 mr-2" />
              {mainPageData?.hero?.subtitle || 'Industry Solutions - Made in India'}
            </div>

            {/* Main Heading with Glow Effect */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              {mainPageData?.hero?.title || 'Our Marketplace'}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto drop-shadow-lg">
              {mainPageData?.hero?.description || 'Discover industry-specific cloud apps tailored for your business needs. From financial services to healthcare, our specialized apps drive digital transformation across various sectors.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center items-center gap-4 mb-12">
              <Link 
                to="/pricing"
                className="px-8 py-3.5 bg-white text-saree-teal-dark text-base font-bold rounded-lg hover:bg-white/90 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
              >
                View Pricing
              </Link>
              <Link 
                to="#marketplace"
                className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white text-base font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-xl"
              >
                Explore Solutions
              </Link>
            </div>

            {/* Stats - Enhanced Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
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
                <div key={index} className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <stat.icon className="w-8 h-8 text-white mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                  <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{stat.value}</div>
                  <div className="text-xs text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </div>
      </section>

      {/* Solutions Grid Section */}
      <section className="relative py-12 bg-gradient-to-br from-saree-amber-light/20 via-white to-saree-rose-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
            Search All Apps
          </h1>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Filter Button */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-saree-teal hover:bg-saree-teal-light/20 transition-all duration-300 bg-white text-sm shadow-md"
              >
                <FunnelIcon className="w-4 h-4 text-saree-teal" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
              </button>
              
              {/* Filter Dropdown */}
              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-saree-teal text-white font-medium shadow-md'
                            : 'text-gray-700 hover:bg-saree-teal-light hover:text-saree-teal-dark'
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
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-saree-teal" />
              <input
                type="text"
                placeholder="Search solutions & services"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-saree-teal focus:border-saree-teal outline-none transition-all duration-300 shadow-md hover:border-saree-teal-dark"
              />
            </div>
          </div>

          {/* Solution Count Display */}
          <div className="mb-5">
            <p className="text-xs text-gray-600">
              Displaying {filteredSolutions.length > 0 ? 1 : 0}-{Math.min(visibleCount, filteredSolutions.length)} ({filteredSolutions.length})
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {visibleSolutions && visibleSolutions.length > 0 ? (
              visibleSolutions.map((solution, index) => {
                // Map solution to section format for SolutionCard
                // Use section data if available, otherwise fall back to solution data
                const section = {
                  id: solution.id,
                  solution_id: solution.solution_id || solution.id,
                  title: solution.title || solution.name,
                  description: solution.description,
                  category: solution.category,
                  popular_tag: solution.popular_tag || 'Most Popular',
                  features: solution.features || [],
                  price: solution.price || '₹2,999',
                  price_period: solution.price_period || '/month',
                  free_trial_tag: solution.free_trial_tag || 'Free Trial',
                  button_text: solution.button_text || 'Explore App'
                };
                return (
                  <SolutionCard 
                    key={solution.id} 
                    section={section} 
                    index={index}
                    isHovered={hoveredCard === solution.id}
                    onHover={setHoveredCard}
                  />
                );
              })
            ) : (
              !loading && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No apps found</p>
                </div>
              )
            )}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMore}
                className="px-6 py-2.5 bg-saree-teal hover:bg-saree-teal-dark text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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

// Modern Solution Card Component - Optimized & Compact
const SolutionCard = ({ section, index, isHovered, onHover }) => {
  // Icon mapping for different solution types
  const getSolutionIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('financial')) return BanknotesIcon;
    if (titleLower.includes('retail')) return ShoppingBagIcon;
    if (titleLower.includes('healthcare') || titleLower.includes('health')) return HeartIcon;
    if (titleLower.includes('server') || titleLower.includes('compute')) return ServerIcon;
    if (titleLower.includes('cpu') || titleLower.includes('intensive')) return CpuChipIcon;
    if (titleLower.includes('memory') || titleLower.includes('storage')) return CircleStackIcon;
    if (titleLower.includes('backup') || titleLower.includes('security')) return ShieldCheckIcon;
    return CloudIcon;
  };

  const IconComponent = getSolutionIcon(section.title);

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

  // Balanced color palette - Professional and clean
  const cardColors = [
    { 
      iconBg: 'bg-saree-teal',
      iconColor: 'text-saree-teal',
      border: 'border-saree-teal/20',
      badge: 'bg-saree-teal/10 text-saree-teal-dark border-saree-teal/30'
    },
    { 
      iconBg: 'bg-saree-amber',
      iconColor: 'text-saree-amber',
      border: 'border-saree-amber/20',
      badge: 'bg-saree-amber/10 text-saree-amber-dark border-saree-amber/30'
    },
    { 
      iconBg: 'bg-saree-lime',
      iconColor: 'text-saree-lime',
      border: 'border-saree-lime/20',
      badge: 'bg-saree-lime/10 text-saree-lime-dark border-saree-lime/30'
    },
    { 
      iconBg: 'bg-saree-rose',
      iconColor: 'text-saree-rose',
      border: 'border-saree-rose/20',
      badge: 'bg-saree-rose/10 text-saree-rose-dark border-saree-rose/30'
    },
    { 
      iconBg: 'bg-phulkari-turquoise',
      iconColor: 'text-phulkari-turquoise',
      border: 'border-phulkari-turquoise/20',
      badge: 'bg-phulkari-turquoise/10 text-phulkari-turquoise-dark border-phulkari-turquoise/30'
    },
    { 
      iconBg: 'bg-saree-coral',
      iconColor: 'text-saree-coral',
      border: 'border-saree-coral/20',
      badge: 'bg-saree-coral/10 text-saree-coral-dark border-saree-coral/30'
    }
  ];

  const color = cardColors[index % cardColors.length];
  const unifiedHover = {
    border: 'border-saree-teal',
    iconBg: 'bg-saree-teal',
    buttonBg: 'bg-saree-teal'
  };

  return (
    <div 
      className="group relative"
      onMouseEnter={() => onHover(section.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Balanced Card Design */}
      <div
        className={`
        relative bg-white rounded-xl shadow-md border-2 overflow-hidden
        transition-all duration-300
          ${isHovered ? `shadow-xl -translate-y-1 ${unifiedHover.border}` : color.border}
        `}
      >
        {/* Content */}
        <div className="p-6">
          {/* Header with Icon and Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
              ${isHovered ? unifiedHover.iconBg : 'bg-gray-100'}
            `}>
              <IconComponent className={`w-6 h-6 transition-colors duration-300 ${isHovered ? 'text-white' : color.iconColor}`} />
            </div>
            
            {/* Popular Badge - Simple version */}
            {section.popular_tag && section.popular_tag.trim() && (
              <span className="bg-saree-amber text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                {section.popular_tag}
              </span>
            )}
          </div>

          {/* Category Badge */}
          {section.category && section.category.trim() && (
            <div className={`inline-flex items-center px-3 py-1 ${color.badge} rounded-md text-xs font-semibold mb-4 border`}>
              {section.category}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {section.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {section.description}
          </p>

          {/* Features - Clean and simple */}
          {features.length > 0 && (
            <div className="space-y-2.5 mb-5 pb-5 border-b border-gray-100">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckIcon className={`w-4 h-4 ${color.iconColor} flex-shrink-0`} />
                  <span className="text-sm text-gray-700 line-clamp-1">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing - Clean version */}
          {section.price && section.price.trim() && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{section.price}</span>
                  {section.price_period && section.price_period.trim() && (
                    <span className="text-gray-600 text-sm ml-1">{section.price_period}</span>
                  )}
                </div>
                {section.free_trial_tag && section.free_trial_tag.trim() && (
                  <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {section.free_trial_tag}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button - Balanced design */}
          <Link 
            to={`/marketplace/${toSlug(section.title || section.name || 'app')}`}
            className={`
              group/btn w-full inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300
              ${isHovered 
                ? `${unifiedHover.buttonBg} text-white` 
                : 'bg-gray-900 text-white hover:bg-gray-800'
              }
            `}
          >
            {section.button_text || 'Explore App'}
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainSolutionsPage;