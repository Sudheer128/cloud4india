import React, { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CMS_URL } from '../utils/config'
import { useMarketplaceData } from '../hooks/useMarketplaceData'
import DynamicMarketplaceSection from '../components/DynamicMarketplaceSection'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  ArrowRightIcon,
  StarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  BanknotesIcon,
  CpuChipIcon,
  KeyIcon,
  ScaleIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  HandRaisedIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  PlayIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarSquareIcon,
  ShieldExclamationIcon,
  CurrencyEuroIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  ChartPieIcon,
  LockClosedIcon,
  CloudIcon,
  CheckCircleIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import { useSectionItems } from '../hooks/useSectionItems'
import { appThemeColors, getGradient, getTextColor, getHoverBorder } from '../utils/appThemeColors'
import { AVAILABLE_ICONS } from '../components/MarketplaceEditor/IconSelector'

// Rupee Icon - displays ₹ symbol using Unicode character
const RupeeIconSimple = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="12"
      y="17"
      fontSize="20"
      fontWeight="bold"
      textAnchor="middle"
      fill="currentColor"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      ₹
    </text>
  </svg>
);


const UniversalMarketplacePage = () => {
  const { appName } = useParams();
  const [activeSection, setActiveSection] = useState('overview');
  const isScrollingRef = useRef(false);
  const lastActiveSectionRef = useRef('overview');

  // Use the hook exactly like Products/Solutions
  const { sections, itemsBySection, marketplace, loading, error } = useMarketplaceData(appName);

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
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Content</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/marketplace" className="text-saree-teal hover:text-saree-teal-dark font-semibold">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Content Available</h1>
          <p className="text-gray-600 mb-4">This marketplace page doesn't have any content yet.</p>
          <Link to="/marketplace" className="text-saree-teal hover:text-saree-teal-dark font-semibold">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Map section type to section ID for navigation - exactly like Products/Solutions
  const getSectionId = (section) => {
    const mapping = {
      'hero': 'overview',
      'media_banner': 'media',
      'benefits': 'benefits',
      'segments': 'segments',
      'technology': 'technology',
      'use_cases': 'use-cases',
      'roi': 'roi',
      'implementation': 'implementation',
      'resources': 'resources',
      'cta': 'get-started'
    };
    return mapping[section.section_type] || `section-${section.id}`;
  };

  // Generate navigation items from visible sections - simplified like Products/Solutions
  const getNavigationItems = () => {
    if (!sections || sections.length === 0) return [];

    // Map section types to readable names and IDs
    const typeToIdMapping = {
      'hero': 'overview',
      'media_banner': 'media',
      'benefits': 'benefits',
      'segments': 'segments',
      'technology': 'technology',
      'use_cases': 'use-cases',
      'roi': 'roi',
      'implementation': 'implementation',
      'resources': 'resources',
      'cta': 'get-started'
    };

    // Helper to create short navigation labels
    const getShortLabel = (title, sectionType) => {
      if (!title) return sectionType;

      // Always show "Overview" for hero section
      if (sectionType === 'hero') {
        return 'Overview';
      }

      // Always show "Gallery" for media_banner section
      if (sectionType === 'media_banner') {
        return 'Gallery';
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
        'in action': 'Gallery',
        'Why Choose': 'Benefits',
        'Advanced Tech': 'Technology',
        'Implementation Journey': 'Implementation',
        'Return on Investment': 'ROI',
        'Resources': 'Resources',
        'Trusted by': 'Segments'
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
    const navItems = sections
      .filter(section => section.is_visible !== 0)
      .map(section => ({
        id: typeToIdMapping[section.section_type] || `section-${section.id}`,
        label: getShortLabel(section.title, section.section_type),
        fullTitle: section.title,
        order: section.order_index,
        type: section.section_type
      }))
      .sort((a, b) => a.order - b.order);

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

  // Component for CTA section buttons (fetched from section items)
  const CTAButtons = ({ marketplaceId, sectionId }) => {
    const { items, loading, error } = useSectionItems(marketplaceId ? parseInt(marketplaceId) : null, sectionId);

    if (loading || error || !items) return null;

    // Get CTA buttons
    const ctaButtons = items.filter(item =>
      item.is_visible && (item.item_type === 'cta_primary' || item.item_type === 'cta_secondary')
    ).sort((a, b) => a.order_index - b.order_index);

    if (ctaButtons.length === 0) {
      // Fallback to default buttons if no items in database
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-saree-teal px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg">
            Start Your Financial Journey
          </button>
          <button className="border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
            Schedule a Demo
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {ctaButtons.map((button, index) => {
          const isPrimary = button.item_type === 'cta_primary';
          const buttonUrl = button.value || '#';
          const ButtonElement = buttonUrl && buttonUrl !== '#' ? 'a' : 'button';

          return (
            <ButtonElement
              key={button.id || index}
              href={buttonUrl !== '#' ? buttonUrl : undefined}
              className={isPrimary
                ? "bg-white text-saree-teal px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
                : "border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              }
            >
              {button.title}
            </ButtonElement>
          );
        })}
      </div>
    );
  };

  // Component for segment stats (fetched from section items)
  const SegmentStats = ({ marketplaceId, sectionId }) => {
    const { items, loading, error } = useSectionItems(marketplaceId ? parseInt(marketplaceId) : null, sectionId);

    if (loading || error || !items) return null;

    // Get stat items
    const statItems = items.filter(item =>
      item.is_visible && item.item_type === 'stat'
    ).sort((a, b) => a.order_index - b.order_index);

    if (statItems.length === 0) {
      // Fallback to default stats if no items in database
      return (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-saree-teal mb-2">500+</div>
            <div className="text-gray-600">Banking Institutions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-saree-amber mb-2">200+</div>
            <div className="text-gray-600">Capital Market Firms</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-saree-lime mb-2">300+</div>
            <div className="text-gray-600">Insurance Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-saree-coral mb-2">150+</div>
            <div className="text-gray-600">Payment Providers</div>
          </div>
        </div>
      );
    }

    const colors = ['text-saree-teal', 'text-saree-amber', 'text-saree-lime', 'text-saree-coral'];

    return (
      <div className={`mt-16 grid gap-8 ${statItems.length === 4 ? 'grid-cols-2 md:grid-cols-4' : statItems.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
        {statItems.map((stat, index) => (
          <div key={stat.id || index} className="text-center">
            <div className={`text-3xl font-bold ${colors[index % colors.length]} mb-2`}>
              {stat.value}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  };

  // Component for hero CTA buttons (fetched from section items)
  const HeroButtons = ({ marketplaceId, sectionId }) => {
    const { items, loading, error } = useSectionItems(marketplaceId ? parseInt(marketplaceId) : null, sectionId);

    if (loading || error || !items) return null;

    // Get CTA buttons (cta_primary and cta_secondary types)
    const ctaButtons = items.filter(item =>
      item.is_visible && (item.item_type === 'cta_primary' || item.item_type === 'cta_secondary')
    ).sort((a, b) => a.order_index - b.order_index);

    if (ctaButtons.length === 0) {
      // Fallback to default buttons if no items in database
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-saree-teal px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg">
            Get Started Today
          </button>
          <button className="border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
            Watch Demo
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {ctaButtons.map((button, index) => {
          const isPrimary = button.item_type === 'cta_primary';
          const buttonUrl = button.value || '#';
          const ButtonElement = buttonUrl && buttonUrl !== '#' ? 'a' : 'button';

          return (
            <ButtonElement
              key={button.id || index}
              href={buttonUrl !== '#' ? buttonUrl : undefined}
              className={isPrimary
                ? "bg-white text-saree-teal px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg"
                : "border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              }
            >
              {button.title}
            </ButtonElement>
          );
        })}
      </div>
    );
  };

  // Component for dynamic benefit cards
  const DynamicBenefitCards = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(marketplace?.id), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No items found</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => {
          const colorClasses = [
            'hover:border-saree-teal',
            'hover:border-saree-amber',
            'hover:border-saree-lime'
          ];
          const gradientClasses = [
            'from-saree-teal to-saree-teal-dark',
            'from-saree-amber to-saree-amber-dark',
            'from-saree-lime to-saree-lime-dark'
          ];
          const textColorClasses = [
            'text-saree-teal',
            'text-saree-amber',
            'text-saree-lime'
          ];

          const colorClass = colorClasses[index % colorClasses.length];
          const gradientClass = gradientClasses[index % gradientClasses.length];
          const textColorClass = textColorClasses[index % textColorClasses.length];

          // Icon mapping
          const iconMap = {
            'ShieldCheckIcon': ShieldCheckIcon,
            'LockClosedIcon': LockClosedIcon,
            'ChartBarIcon': ChartBarIcon,
            'CogIcon': CogIcon,
            'CloudIcon': CloudIcon,
            'ScaleIcon': ScaleIcon
          };
          const IconComponent = iconMap[item.icon] || ShieldCheckIcon;

          // Parse features if they exist
          let featuresList = [];
          if (item.features) {
            try {
              featuresList = JSON.parse(item.features);
            } catch (e) {
              console.error('Error parsing features:', e);
              featuresList = [];
            }
          }

          return (
            <div key={item.id} className={`group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 ${colorClass} flex flex-col h-full`}>
              <div className={`w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>
              {featuresList.length > 0 && (
                <div className="text-left mt-auto">
                  <div className={`${textColorClass} text-sm font-medium mb-3`}>Key Features</div>
                  <div className="space-y-2">
                    {featuresList.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic financial segments
  const DynamicFinancialSegments = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(marketplace?.id), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No items found</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, index) => {
          const gradients = [
            'from-saree-teal to-saree-teal-dark',
            'from-saree-amber to-saree-amber-dark',
            'from-saree-lime to-saree-lime-dark',
            'from-saree-coral to-saree-coral-dark'
          ];
          const gradient = gradients[index % gradients.length];

          // Icon mapping
          const iconMap = {
            'CurrencyDollarIcon': RupeeIconSimple,
            'ChartPieIcon': ChartPieIcon,
            'ShieldCheckIcon': ShieldCheckIcon,
            'CogIcon': CogIcon
          };
          const IconComponent = iconMap[item.icon] || RupeeIconSimple;

          return (
            <div key={item.id} className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 h-full min-h-[350px]`}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/90 text-base leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="text-left">
                <div className="text-white/80 text-sm font-medium mb-1">Trusted by</div>
                {item.value && <div className="text-white font-bold text-base">{item.value}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic ROI stats
  const DynamicROIStats = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(marketplace?.id), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No items found</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, index) => {
          const colorClasses = [
            'bg-saree-teal-light border-saree-teal',
            'bg-saree-amber-light border-saree-amber',
            'bg-saree-lime-light border-saree-lime',
            'bg-saree-coral-light border-saree-coral'
          ];
          const textColorClasses = [
            'text-saree-teal',
            'text-saree-amber',
            'text-saree-lime',
            'text-saree-coral'
          ];

          const colorClass = colorClasses[index % colorClasses.length];
          const textColorClass = textColorClasses[index % textColorClasses.length];

          return (
            <div key={item.id} className={`${colorClass} rounded-2xl p-8 text-center border-2`}>
              <div className={`text-4xl font-bold ${textColorClass} mb-2`}>{item.value}</div>
              <div className="text-gray-600 font-semibold mb-2">{item.title}</div>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic Advanced Technology Marketplaces
  const DynamicTechMarketplaces = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(marketplace?.id), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No content found</div>;

    const itemsList = items.filter(item => item.is_visible);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        {itemsList.map((item, index) => {
          let itemFeatures = [];
          if (item.features) {
            try {
              itemFeatures = JSON.parse(item.features);
            } catch (e) {
              console.error('Error parsing features:', e);
            }
          }

          const isLeftSide = index % 2 === 0;

          return isLeftSide ? (
            <div key={item.id}>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {item.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {item.description}
              </p>

              {itemFeatures.length > 0 && (
                <div className="space-y-4 mb-8">
                  {itemFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {item.value && (
                <button className="text-saree-teal hover:text-saree-teal-dark font-semibold text-lg flex items-center group">
                  {item.value}
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ) : (
            <div key={item.id} className="bg-gradient-to-br from-saree-teal-light to-saree-lime-light rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-saree-teal to-saree-lime-dark rounded-3xl flex items-center justify-center">
                  <ChartBarSquareIcon className="w-16 h-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic Real-World Use Cases
  const DynamicUseCases = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(marketplace?.id), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No use cases found</div>;

    const colorClasses = [
      'hover:border-saree-teal',
      'hover:border-saree-coral',
      'hover:border-saree-lime'
    ];

    const gradientClasses = [
      'from-saree-teal to-saree-teal-dark',
      'from-saree-coral to-saree-coral-dark',
      'from-saree-lime to-saree-lime-dark'
    ];

    const textColorClasses = [
      'text-saree-teal',
      'text-saree-coral',
      'text-saree-lime'
    ];

    // Icon mapping
    const iconMap = {
      'BanknotesIcon': BanknotesIcon,
      'ShieldCheckIcon': ShieldExclamationIcon,
      'CreditCardIcon': CreditCardIcon
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {items.map((item, index) => {
          const colorClass = colorClasses[index % colorClasses.length];
          const gradientClass = gradientClasses[index % gradientClasses.length];
          const textColorClass = textColorClasses[index % textColorClasses.length];
          const IconComponent = iconMap[item.icon] || BanknotesIcon;

          // Parse features if they exist
          let featuresList = [];
          if (item.features) {
            try {
              featuresList = JSON.parse(item.features);
            } catch (e) {
              console.error('Error parsing features:', e);
              featuresList = [];
            }
          }

          return (
            <div key={item.id} className={`group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 ${colorClass} flex flex-col h-full`}>
              <div className={`w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>
              {featuresList.length > 0 && (
                <div className="text-left mt-auto">
                  <div className={`${textColorClass} text-sm font-medium mb-3`}>Key Features</div>
                  <div className="space-y-2">
                    {featuresList.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic Implementation Journey timeline
  const DynamicImplementationJourney = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(marketplace?.id), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No timeline phases found</div>;

    const colorClasses = [
      'from-saree-teal to-saree-teal-dark',
      'from-saree-amber to-saree-amber-dark',
      'from-saree-lime to-saree-lime-dark',
      'from-saree-coral to-saree-coral-dark'
    ];

    const nodeColors = [
      'bg-saree-teal',
      'bg-saree-amber',
      'bg-saree-lime',
      'bg-saree-coral'
    ];

    const textColors = [
      'text-saree-teal',
      'text-saree-amber',
      'text-saree-lime',
      'text-saree-coral'
    ];

    // Icon mapping
    const iconMap = {
      'LightBulbIcon': LightBulbIcon,
      'CogIcon': CogIcon,
      'RocketLaunchIcon': RocketLaunchIcon,
      'HandRaisedIcon': HandRaisedIcon
    };

    return (
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-saree-teal via-saree-amber via-saree-lime to-saree-coral rounded-full hidden lg:block"></div>

        {/* Timeline Items */}
        <div className="space-y-16">
          {items.map((item, index) => {
            const colorClass = colorClasses[index % colorClasses.length];
            const nodeColor = nodeColors[index % nodeColors.length];
            const textColor = textColors[index % textColors.length];
            const IconComponent = iconMap[item.icon] || LightBulbIcon;
            const isLeft = index % 2 === 0;

            return (
              <div key={item.id} className="relative flex items-center">
                {isLeft ? (
                  <>
                    <div className="flex-1 lg:pr-8 text-right">
                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-end mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mr-4`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${textColor} mb-1`}>PHASE {index + 1}</div>
                            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-end text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Duration: {item.value}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 ${nodeColor} rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>

                    <div className="flex-1 lg:pl-8"></div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 lg:pr-8"></div>

                    {/* Timeline Node */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 ${nodeColor} rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>

                    <div className="flex-1 lg:pl-8">
                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mr-4`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className={`text-sm font-semibold ${textColor} mb-1`}>PHASE {index + 1}</div>
                            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Duration: {item.value}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Component for dynamic Resources & Documentation
  const DynamicResourcesDocs = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(marketplace?.id), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No resources found</div>;

    const featuredResource = items.find(item => item.order_index === 0);
    const resourceCategories = items.filter(item => item.order_index > 0 && !item.title.toLowerCase().includes('community forum'));

    let featuredFeatures = [];
    if (featuredResource && featuredResource.features) {
      try {
        featuredFeatures = JSON.parse(featuredResource.features);
      } catch (e) {
        console.error('Error parsing featured resource features:', e);
        featuredFeatures = [];
      }
    }

    // Icon mapping
    const iconMap = {
      'DocumentTextIcon': DocumentTextIcon,
      'PlayIcon': PlayIcon,
      'CodeBracketIcon': CodeBracketIcon,
      'UsersIcon': UsersIcon
    };

    return (
      <div>
        {/* Featured Resource - Large Card */}
        {featuredResource && (
          <div className="mb-16">
            <div className="bg-gradient-to-br from-saree-teal-light to-saree-lime-light rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-saree-teal/20 border border-saree-teal/30 mb-6">
                    <DocumentTextIcon className="h-5 w-5 text-saree-teal mr-2" />
                    <span className="text-saree-teal-dark text-sm font-medium">{featuredResource.label}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {featuredResource.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {featuredResource.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-saree-teal hover:bg-saree-teal-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-saree-teal/25 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      {featuredResource.value}
                    </button>
                    <button className="border-2 border-saree-teal text-saree-teal hover:bg-saree-teal hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Watch Overview
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-saree-teal to-saree-teal-dark rounded-2xl flex items-center justify-center">
                      <DocumentTextIcon className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h4>
                    <div className="space-y-3 text-left">
                      {featuredFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-saree-teal mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resource Categories - Mixed Layout */}
        <div className="space-y-12">
          {/* Row 1: Two Large Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resourceCategories.slice(0, 2).map((item, index) => {
              const gradients = [
                'from-saree-lime-light to-saree-lime-light',
                'from-saree-amber-light to-saree-amber-light'
              ];
              const iconGradients = [
                'from-saree-lime to-saree-lime-dark',
                'from-saree-amber to-saree-amber-dark'
              ];
              const textColors = [
                'text-saree-lime',
                'text-saree-amber'
              ];
              const borderColors = [
                'border-saree-lime',
                'border-saree-amber'
              ];

              const gradient = gradients[index % gradients.length];
              const iconGradient = iconGradients[index % iconGradients.length];
              const textColor = textColors[index % textColors.length];
              const borderColor = borderColors[index % borderColors.length];
              const IconComponent = iconMap[item.icon] || PlayIcon;

              return (
                <div key={item.id} className={`group bg-gradient-to-br ${gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border ${borderColor} flex flex-col`}>
                  <div className="flex items-start mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    <button className={`${textColor} hover:opacity-80 font-semibold flex items-center group`}>
                      <span>{item.label}</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: Two Large Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resourceCategories.slice(2, 4).map((item, index) => {
              const gradients = [
                'from-saree-coral-light to-saree-coral-light',
                'from-saree-teal-light to-saree-teal-light'
              ];
              const iconGradients = [
                'from-saree-coral to-saree-coral-dark',
                'from-saree-teal to-saree-teal-dark'
              ];
              const textColors = [
                'text-saree-coral',
                'text-saree-teal'
              ];
              const borderColors = [
                'border-saree-coral',
                'border-saree-teal'
              ];

              const gradient = gradients[index % gradients.length];
              const iconGradient = iconGradients[index % iconGradients.length];
              const textColor = textColors[index % textColors.length];
              const borderColor = borderColors[index % borderColors.length];
              const IconComponent = iconMap[item.icon] || CodeBracketIcon;

              return (
                <div key={item.id} className={`group bg-gradient-to-br ${gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border ${borderColor} flex flex-col`}>
                  <div className="flex items-start mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    <button className={`${textColor} hover:opacity-80 font-semibold flex items-center group`}>
                      <span>{item.label}</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Secondary Navigation Bar - Sticky, always visible on top layer */}
      {navigationItems.length > 0 && (
        <div className="sticky top-16 left-0 right-0 z-[60] w-full py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-center px-6">
                {/* App Title */}
                <div className="py-4 pr-8 font-semibold text-gray-900 text-base whitespace-nowrap">
                  {marketplace?.name || appName}
                </div>
                {/* Navigation Items */}
                <nav className="flex items-center overflow-x-auto scrollbar-hide -mb-px">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`px-5 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 border-l-0 border-r-0 border-t-0 focus:outline-none focus:ring-0 ${activeSection === item.id
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

      {/* Hero Section */}
      {(() => {
        const heroSection = sections.find(s => s.section_type === 'hero' && s.order_index === 0);
        return heroSection && (
          <section data-section-id="overview" className={`relative py-20 bg-gradient-to-br from-saree-teal via-saree-teal to-saree-teal-dark overflow-hidden ${navigationItems.length > 0 ? '-mt-32' : ''}`}>

            {/* Dot Grid Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            ></div>

            {/* Hexagon Pattern Overlay (additional sophistication) */}
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            ></div>

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${navigationItems.length > 0 ? 'pt-14' : ''}`}>
              {/* Breadcrumb Navigation - Inside Hero */}
              <nav className="flex items-center text-sm mb-8">
                <Link
                  to="/marketplace"
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  Marketplace
                </Link>
                <svg className="w-4 h-4 mx-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  to={`/marketplace?category=${marketplace?.category || ''}`}
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  {marketplace?.category || 'Category'}
                </Link>
                <svg className="w-4 h-4 mx-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-semibold">{marketplace?.name || appName}</span>
              </nav>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
                  {(() => {
                    // Render icon from database if available
                    if (heroSection?.icon) {
                      // Check if it's a library icon
                      const iconObj = AVAILABLE_ICONS.find(i => i.name === heroSection.icon);
                      if (iconObj) {
                        const IconComponent = iconObj.icon;
                        return <IconComponent className="w-10 h-10 text-white" />;
                      }
                      // Check if it's an uploaded icon (starts with /uploads)
                      if (heroSection.icon.startsWith('/uploads')) {
                        const cmsUrl = CMS_URL;
                        return (
                          <img
                            src={`${cmsUrl}${heroSection.icon}`}
                            alt="Marketplace icon"
                            className="w-10 h-10 object-contain"
                          />
                        );
                      }
                    }
                    // Default fallback icon
                    return <BanknotesIcon className="w-10 h-10 text-white" />;
                  })()}
                </div>
                {heroSection && (
                  <>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                      {heroSection.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8">
                      {heroSection.content}
                    </p>
                    <HeroButtons marketplaceId={marketplace?.id} sectionId={heroSection.id} />
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Media Banner Section - Only this section uses DynamicMarketplaceSection with itemsBySection */}
      {(() => {
        const mediaBannerSection = sections.find(s =>
          s.section_type === 'media_banner' &&
          s.is_visible !== 0
        );

        if (!mediaBannerSection) return null;

        return (
          <div data-section-id="media">
            <DynamicMarketplaceSection
              section={mediaBannerSection}
              items={itemsBySection[mediaBannerSection.id] || []}
              marketplace={marketplace}
              hasNavigation={navigationItems.length > 0}
            />
          </div>
        );
      })()}

      {/* Key Benefits Section */}
      {(() => {
        const benefitsSection = sections.find(s => s.section_type === 'benefits' && s.is_visible !== 0);
        if (!benefitsSection) return null;
        return (
          <section data-section-id="benefits" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {benefitsSection.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {benefitsSection.content}
                </p>
              </div>
              <DynamicBenefitCards sectionId={benefitsSection.id} />
            </div>
          </section>
        );
      })()}

      {/* Industry Segments Section */}
      {(() => {
        const segmentsSection = sections.find(s => s.section_type === 'segments' && s.is_visible !== 0);
        if (!segmentsSection) return null;
        return (
          <section data-section-id="segments" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {segmentsSection.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {segmentsSection.content}
                </p>
              </div>
              <DynamicFinancialSegments sectionId={segmentsSection.id} />
              <SegmentStats marketplaceId={marketplace?.id} sectionId={segmentsSection.id} />
            </div>
          </section>
        );
      })()}

      {/* Technology Marketplaces Section */}
      {(() => {
        const techSection = sections.find(s => s.section_type === 'technology' && s.is_visible !== 0);
        if (!techSection) return null;
        return (
          <section data-section-id="technology" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {techSection.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {techSection.content}
                </p>
              </div>
              <DynamicTechMarketplaces sectionId={techSection.id} />
            </div>
          </section>
        );
      })()}

      {/* Real-World Use Cases */}
      {(() => {
        const useCasesSection = sections.find(s => s.section_type === 'use_cases' && s.is_visible !== 0);
        if (!useCasesSection) return null;
        return (
          <section data-section-id="use-cases" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {useCasesSection.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {useCasesSection.content}
                </p>
              </div>
              <DynamicUseCases sectionId={useCasesSection.id} />
            </div>
          </section>
        );
      })()}

      {/* ROI & Business Impact Section */}
      {(() => {
        const roiSection = sections.find(s => s.section_type === 'roi' && s.is_visible !== 0);
        if (!roiSection) return null;
        return (
          <section data-section-id="roi" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {roiSection.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {roiSection.content}
                </p>
              </div>
              <DynamicROIStats sectionId={roiSection.id} />
            </div>
          </section>
        );
      })()}

      {/* Implementation Journey Roadmap */}
      {(() => {
        const implSection = sections.find(s => s.section_type === 'implementation' && s.is_visible !== 0);
        if (!implSection) return null;
        return (
          <section data-section-id="implementation" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {implSection.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {implSection.content}
                </p>
              </div>
              <DynamicImplementationJourney sectionId={implSection.id} />
            </div>
          </section>
        );
      })()}

      {/* Resources & Documentation Section */}
      {(() => {
        const resourcesSection = sections.find(s => s.section_type === 'resources' && s.is_visible !== 0);
        if (!resourcesSection) return null;
        return (
          <section data-section-id="resources" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {resourcesSection.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {resourcesSection.content}
                </p>
              </div>
              <DynamicResourcesDocs sectionId={resourcesSection.id} />
            </div>
          </section>
        );
      })()}

      {/* Call to Action Section */}
      {(() => {
        const ctaSection = sections.find(s => s.section_type === 'cta' && s.is_visible !== 0);
        if (!ctaSection) return null;
        return (
          <section data-section-id="get-started" className="relative py-20 bg-gradient-to-br from-saree-teal via-saree-teal to-saree-teal-dark overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            ></div>
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            ></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {ctaSection.title}
              </h2>
              <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-8">
                {ctaSection.content}
              </p>
              <CTAButtons marketplaceId={marketplace?.id} sectionId={ctaSection.id} />
            </div>
          </section>
        );
      })()}

      {/* Pricing Section - Uses DynamicMarketplaceSection */}
      {(() => {
        const pricingSection = sections.find(s =>
          s.section_type === 'pricing' &&
          s.is_visible !== 0
        );

        if (!pricingSection) return null;

        return (
          <div data-section-id="pricing">
            <DynamicMarketplaceSection
              section={pricingSection}
              items={itemsBySection[pricingSection.id] || []}
              marketplace={marketplace}
              hasNavigation={navigationItems.length > 0}
            />
          </div>
        );
      })()}

    </div>
  )
}

export default UniversalMarketplacePage


