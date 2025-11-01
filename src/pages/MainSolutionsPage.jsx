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
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Solutions</h2>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section - Modern Dark Theme */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full text-blue-300 text-sm font-medium mb-8 border border-blue-500/30">
              <CloudIcon className="w-5 h-5 mr-2" />
              {mainPageData?.hero?.subtitle || 'Industry Solutions - Made in India'}
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                {mainPageData?.hero?.title || 'Cloud Solutions'}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto">
              {mainPageData?.hero?.description || 'Discover industry-specific cloud solutions tailored for your business needs. From financial services to healthcare, our specialized solutions drive digital transformation across various sectors.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/pricing"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
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
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid Section */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Search All Solutions
          </h1>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Filter Button */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
              >
                <FunnelIcon className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
              </button>
              
              {/* Filter Dropdown */}
              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
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
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search solutions & services"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Solution Count Display */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">
              Displaying {filteredSolutions.length > 0 ? 1 : 0}-{Math.min(visibleCount, filteredSolutions.length)} ({filteredSolutions.length})
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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
                  button_text: solution.button_text || 'Explore Solution'
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
                  <p className="text-gray-500">No solutions found</p>
                </div>
              )
            )}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
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

// Modern Solution Card Component
const SolutionCard = ({ section, index, isHovered, onHover }) => {
  // Icon mapping for different solution types
  const getSolutionIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('financial')) return BanknotesIcon;
    if (titleLower.includes('retail')) return ShoppingBagIcon;
    if (titleLower.includes('healthcare') || titleLower.includes('health')) return HeartIcon;
    if (titleLower.includes('compute') || titleLower.includes('ai')) return CpuChipIcon;
    if (titleLower.includes('server')) return ServerIcon;
    return CloudIcon;
  };

  const IconComponent = getSolutionIcon(section.title);

  // Enhanced features based on solution type
  const getFeatures = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('financial')) {
      return [
        { icon: LockClosedIcon, text: 'Regulatory Compliance' },
        { icon: ShieldCheckIcon, text: 'Bank-Grade Security' },
        { icon: ChartBarIcon, text: 'Real-Time Analytics' }
      ];
    }
    if (titleLower.includes('retail')) {
      return [
        { icon: BoltIcon, text: 'High Performance' },
        { icon: ChartBarIcon, text: 'Inventory Management' },
        { icon: ServerIcon, text: 'Scalable Infrastructure' }
      ];
    }
    if (titleLower.includes('healthcare') || titleLower.includes('health')) {
      return [
        { icon: ShieldCheckIcon, text: 'HIPAA Compliant' },
        { icon: LockClosedIcon, text: 'Patient Data Security' },
        { icon: HeartIcon, text: 'Healthcare Focused' }
      ];
    }
    return [
      { icon: BoltIcon, text: 'Lightning Fast' },
      { icon: LockClosedIcon, text: 'Secure & Compliant' },
      { icon: ChartBarIcon, text: 'Scalable Architecture' }
    ];
  };

  const features = getFeatures(section.title);

  return (
    <div 
      className="group relative"
      onMouseEnter={() => onHover(section.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Card */}
      <div className={`
        relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden
        transition-all duration-500 transform
        ${isHovered ? 'scale-105 shadow-2xl shadow-blue-500/20' : 'hover:scale-102'}
      `}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className={`
              w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300
              ${isHovered 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }
            `}>
              <IconComponent className={`w-8 h-8 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-600'}`} />
            </div>
            
            {/* Popular Badge */}
            {section.popular_tag && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {section.popular_tag}
              </span>
            )}
          </div>

          {/* Category */}
          {section.category && (
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
              {section.category}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors">
            {section.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
            {section.description}
          </p>

          {/* Features */}
          {section.features && section.features.length > 0 ? (
            <div className="space-y-3 mb-8">
              {section.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing */}
          {section.price ? (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{section.price}</span>
                  {section.price_period && (
                    <span className="text-gray-600 ml-2">{section.price_period}</span>
                  )}
                </div>
                {section.free_trial_tag && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {section.free_trial_tag}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹2,999</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Free Trial
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link 
            to={`/solutions/${section.solution_id}`}
            className={`
              group/btn relative w-full inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-300
              ${isHovered 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
              }
            `}
          >
            <span className="relative z-10 flex items-center">
              {section.button_text || 'Explore Solution'}
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            )}
          </Link>
        </div>

        {/* Hover Effect Border */}
        <div className={`
          absolute inset-0 rounded-2xl border-2 transition-all duration-300
          ${isHovered ? 'border-blue-500/50' : 'border-transparent'}
        `}></div>
      </div>

      {/* Background Glow Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 transition-opacity duration-500"></div>
      )}
    </div>
  );
};

export default MainSolutionsPage;