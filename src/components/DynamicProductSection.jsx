import React, { useState } from 'react';
import { 
  CheckIcon, 
  StarIcon, 
  ServerIcon, 
  CpuChipIcon, 
  CircleStackIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

// Icon mapping for dynamic rendering
const iconMap = {
  'CpuChipIcon': CpuChipIcon,
  'ShieldCheckIcon': ShieldCheckIcon,
  'ClockIcon': ClockIcon,
  'CurrencyDollarIcon': CurrencyDollarIcon,
  'ChartBarIcon': ChartBarIcon,
  'GlobeAltIcon': GlobeAltIcon,
  'UsersIcon': UsersIcon,
  'ServerIcon': ServerIcon,
  'CircleStackIcon': CircleStackIcon,
  'CheckIcon': CheckIcon,
  'StarIcon': StarIcon,
  'ArrowRightIcon': ArrowRightIcon,
  'EyeIcon': EyeIcon,
  'EyeSlashIcon': EyeSlashIcon
};

const DynamicProductSection = ({ section, items, product, hasNavigation = false }) => {
  // Don't render if section is hidden
  if (!section.is_visible) {
    return null;
  }

  // Render different section types
  switch (section.section_type) {
    case 'hero':
      return <HeroSection section={section} items={items} product={product} hasNavigation={hasNavigation} />;
    case 'media_banner':
      return <MediaBannerSection section={section} items={items} />;
    case 'features':
      return <FeaturesSection section={section} items={items} />;
    case 'pricing':
      return <PricingSection section={section} items={items} />;
    case 'specifications':
      return <SpecificationsSection section={section} items={items} />;
    case 'security':
      return <SecuritySection section={section} items={items} />;
    case 'support':
      return <SupportSection section={section} items={items} />;
    case 'migration':
      return <MigrationSection section={section} items={items} />;
    case 'use_cases':
      return <UseCasesSection section={section} items={items} />;
    case 'cta':
      return <CTASection section={section} items={items} />;
    default:
      return <DefaultSection section={section} items={items} />;
  }
};

// Hero Section Component
const HeroSection = ({ section, items, product, hasNavigation = false }) => {
  // Get items by type for dynamic rendering
  const badgeItem = items.find(item => item.item_type === 'badge' && item.is_visible);
  const titleItem = items.find(item => item.item_type === 'title' && item.is_visible);
  const descriptionItem = items.find(item => item.item_type === 'description' && item.is_visible);
  const primaryCTAItem = items.find(item => item.item_type === 'cta_primary' && item.is_visible);
  const secondaryCTAItem = items.find(item => item.item_type === 'cta_secondary' && item.is_visible);
  const heroImageItem = items.find(item => item.item_type === 'image' && item.is_visible);

  // Get feature bullets (item_type='feature') and stats (item_type='stat')
  const featureBullets = items.filter(item => item.item_type === 'feature' && item.is_visible);
  const statItems = items.filter(item => item.item_type === 'stat' && item.is_visible);

  return (
    <section className={`relative py-20 overflow-hidden bg-gradient-to-br from-phulkari-turquoise via-saree-teal to-saree-teal-dark ${hasNavigation ? '-mt-32' : ''}`}>
      {/* Different Background Patterns - Inspired but unique */}
      <div className="absolute inset-0">
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
        }}></div>
        
        {/* Hexagon shapes instead of circles */}
        <div className="absolute top-20 right-10 w-48 h-48 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-20 w-64 h-64 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="3"/>
          </svg>
        </div>
        
        {/* Curved wave overlays */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-saree-amber/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${hasNavigation ? 'pt-14' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {badgeItem && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-saree-amber text-gray-900 text-sm font-bold mb-6 rounded-lg shadow-xl">
                <ServerIcon className="w-5 h-5" />
                {badgeItem.title}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {product?.name || section.title || titleItem?.title || 'Product Name'}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
              {section.description || descriptionItem?.title || product?.description || 'Product description goes here'}
            </p>
            
            {/* Feature list with icons - Dynamic from CMS */}
            {featureBullets.length > 0 && (
            <div className="space-y-3 mb-8">
                {featureBullets.map((feature, index) => (
                  <div key={feature.id || index} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-saree-amber rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-4 h-4 text-gray-900" />
                </div>
                    <span className="text-base font-medium">{feature.title}</span>
              </div>
                ))}
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCTAItem && (
                primaryCTAItem.value ? (
                  <a
                    href={primaryCTAItem.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white text-saree-teal-dark text-base font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:scale-105 transform text-center"
                  >
                    {primaryCTAItem.title}
                  </a>
                ) : (
                  <button className="px-8 py-4 bg-white text-saree-teal-dark text-base font-bold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:scale-105 transform">
                  {primaryCTAItem.title}
                </button>
                )
              )}
              {secondaryCTAItem && (
                secondaryCTAItem.value ? (
                  <a
                    href={secondaryCTAItem.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-transparent text-white text-base font-bold rounded-lg border-2 border-white hover:bg-white hover:text-saree-teal-dark transition-all duration-300 shadow-xl text-center"
                  >
                    {secondaryCTAItem.title}
                  </a>
                ) : (
                <button className="px-8 py-4 bg-transparent text-white text-base font-bold rounded-lg border-2 border-white hover:bg-white hover:text-saree-teal-dark transition-all duration-300 shadow-xl">
                  {secondaryCTAItem.title}
                </button>
                )
              )}
            </div>
          </div>

          {/* Right Card - Dynamic Stats from CMS */}
          <div className="space-y-4">
            {/* Main CTA Card - show if primary CTA exists */}
            {primaryCTAItem && (
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-saree-teal to-phulkari-turquoise rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ServerIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{primaryCTAItem.description || 'Try It Now'}</h3>
                    <p className="text-sm text-gray-600">{primaryCTAItem.label || 'Start in 60 seconds'}</p>
                </div>
              </div>
              
              {primaryCTAItem.value ? (
                <a
                  href={primaryCTAItem.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-saree-teal to-phulkari-turquoise text-white px-6 py-3.5 rounded-lg font-bold text-base hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                >
                  {primaryCTAItem.title} →
                </a>
              ) : (
              <button className="w-full bg-gradient-to-r from-saree-teal to-phulkari-turquoise text-white px-6 py-3.5 rounded-lg font-bold text-base hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {primaryCTAItem.title} →
              </button>
              )}
            </div>
            )}

            {/* Stats Cards - Dynamic from CMS */}
            {statItems.length > 0 && (
              <div className={`grid gap-3 ${statItems.length === 1 ? 'grid-cols-1' : statItems.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {statItems.slice(0, 3).map((stat, index) => {
                  const colors = ['text-saree-teal', 'text-saree-amber', 'text-saree-lime'];
                  return (
                    <div key={stat.id || index} className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
                      <div className={`text-2xl font-bold ${colors[index % 3]} mb-1`}>{stat.value || stat.title}</div>
                      <div className="text-xs text-gray-600 font-semibold">{stat.label || stat.description}</div>
              </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top diagonal accent instead of bottom wave */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
    </section>
  );
};

// Media Banner Section Component - Carousel Gallery for Multiple Photos/Videos
const MediaBannerSection = ({ section, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cmsBaseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
  
  // Filter visible media items with valid URLs
  const mediaItems = items.filter(item => {
    if (!item.is_visible) return false;
    try {
      const content = item.content ? JSON.parse(item.content) : {};
      return content.media_url && content.media_url.trim() !== '';
    } catch (e) {
      return false;
    }
  });
  
  if (mediaItems.length === 0) {
    return null; // Don't render if no valid media items
  }
  
  // Process media item to get URL and type
  const getMediaInfo = (item) => {
    let content = {};
    try {
      content = item.content ? JSON.parse(item.content) : {};
    } catch (e) {
      console.error('Error parsing media content:', e);
    }
    
    const mediaType = content.media_type || 'image';
    const mediaSource = content.media_source || 'upload';
    let mediaUrl = content.media_url || '';
  let isYouTube = false;
  
    if (mediaType === 'video' && (mediaSource === 'youtube' || 
        mediaUrl.includes('youtube.com') || 
        mediaUrl.includes('youtu.be'))) {
      // YouTube video - normalize to embed format
      let embedUrl = mediaUrl;
      if (embedUrl.includes('youtube.com/watch?v=')) {
        const videoId = embedUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      mediaUrl = embedUrl;
      isYouTube = true;
    } else if (mediaSource === 'upload' && !mediaUrl.startsWith('http')) {
      mediaUrl = `${cmsBaseUrl}${mediaUrl}`;
    }
    
    return { mediaType, mediaUrl, isYouTube, title: item.title, description: item.description };
  };
  
  const currentMedia = getMediaInfo(mediaItems[currentIndex]);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <section className="py-16 bg-gradient-to-br from-saree-teal-light via-white to-saree-amber-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {section.title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                {section.description}
              </p>
            )}
          </div>
        )}
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Current Media Info - Above Media */}
          {(currentMedia.title || currentMedia.description) && (
            <div className="mb-3 text-center">
              {currentMedia.title && (
                <h3 className="text-lg font-bold text-gray-900 mb-1">{currentMedia.title}</h3>
              )}
              {currentMedia.description && (
                <p className="text-xs text-gray-600">{currentMedia.description}</p>
              )}
            </div>
          )}
          
          {/* Main Media Display - Smaller Size */}
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <div className="relative group" style={{ paddingBottom: '45%' }}>
              {currentMedia.mediaType === 'video' && currentMedia.isYouTube ? (
                // YouTube Video
              <iframe
                  key={`youtube-${currentIndex}`}
                  src={`${currentMedia.mediaUrl}?autoplay=0&mute=0&controls=1&rel=0`}
                  className="absolute inset-0 w-full h-full"
                frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                  title={currentMedia.title || 'Video'}
                />
              ) : currentMedia.mediaType === 'video' ? (
            // Uploaded Video
              <video
                  key={`video-${currentIndex}`}
                  src={currentMedia.mediaUrl}
                controls
                  className="absolute inset-0 w-full h-full object-cover"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
              ) : (
            // Image
              <img
                  key={`image-${currentIndex}`}
                  src={currentMedia.mediaUrl}
                  alt={currentMedia.title || 'Gallery image'}
                  className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                />
              )}
              
              {/* Navigation Arrows - Clean Design */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-saree-teal hover:bg-saree-teal-dark text-white p-2.5 rounded-full shadow-lg hover:scale-105 transition-all duration-200 z-10"
                    aria-label="Previous"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-saree-teal hover:bg-saree-teal-dark text-white p-2.5 rounded-full shadow-lg hover:scale-105 transition-all duration-200 z-10"
                    aria-label="Next"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Counter Badge - Top Right */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                    <span className="text-xs font-semibold text-white">
                      {currentIndex + 1} / {mediaItems.length}
                    </span>
            </div>
                </>
              )}
        </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = ({ section, items }) => {
  const cmsBaseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
  
  return (
    <section className="py-20 bg-gradient-to-br from-saree-teal-light/30 via-white to-saree-amber-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Key Features'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Discover the key features that make this product special'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            // Check if icon is a custom uploaded path or heroicon name
            const isCustomIcon = item.icon && (item.icon.startsWith('/uploads/') || item.icon.startsWith('http'));
            const IconComponent = !isCustomIcon ? (iconMap[item.icon] || CpuChipIcon) : null;
            const customIconUrl = isCustomIcon ? (item.icon.startsWith('http') ? item.icon : `${cmsBaseUrl}${item.icon}`) : null;
            // 6 colors to avoid same pattern in 3-column grid
            const colors = [
              { bg: 'from-saree-teal-light to-white', border: 'border-saree-teal', iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-light hover:border-saree-teal-dark' },
              { bg: 'from-saree-amber-light to-white', border: 'border-saree-amber', iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-light hover:border-saree-amber-dark' },
              { bg: 'from-saree-lime-light to-white', border: 'border-saree-lime', iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-light hover:border-saree-lime-dark' },
              { bg: 'from-saree-rose-light to-white', border: 'border-saree-rose', iconBg: 'bg-saree-rose', hover: 'hover:bg-saree-rose-light hover:border-saree-rose-dark' },
              { bg: 'from-phulkari-turquoise-light to-white', border: 'border-phulkari-turquoise', iconBg: 'bg-phulkari-turquoise', hover: 'hover:bg-phulkari-turquoise-light hover:border-phulkari-turquoise-dark' },
              { bg: 'from-saree-coral-light to-white', border: 'border-saree-coral', iconBg: 'bg-saree-coral', hover: 'hover:bg-saree-coral-light hover:border-saree-coral-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className={`bg-gradient-to-br ${color.bg} p-8 rounded-xl border-2 ${color.border} hover:shadow-2xl ${color.hover} hover:scale-105 transition-all duration-300 group`}>
                <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {isCustomIcon ? (
                    <img 
                      src={customIconUrl} 
                      alt={item.title}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                  <IconComponent className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-saree-amber-light/20 via-white to-saree-lime-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Pricing'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Choose the perfect plan for your needs'}
          </p>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-saree-teal to-saree-amber text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Plan</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Specifications</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Features</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Pricing</th>
                  <th className="px-6 py-4 text-center font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.filter(item => item.is_visible).map((item) => {
                  let content = {};
                  try {
                    content = item.content ? JSON.parse(item.content) : {};
                  } catch (e) {
                    console.error('Error parsing pricing content:', e);
                  }
                  
                  return (
                    <tr key={item.id} className="hover:bg-saree-teal-light transition-colors duration-300 group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm group-hover:text-saree-teal-dark transition-colors duration-300">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-700">
                          {content.specifications?.map((spec, index) => (
                            <div key={index}>{spec}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-700">
                          {content.features?.map((feature, index) => (
                            <div key={index}>{feature}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-base font-bold ${content.price === 'Absolutely Free' ? 'text-saree-lime' : 'text-saree-amber-dark'}`}>
                          {content.price || item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {content.buttonUrl ? (
                          <a
                            href={content.buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-saree-amber hover:bg-saree-amber-dark text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            {content.buttonText || 'Order Now'}
                          </a>
                        ) : (
                          <button className="bg-saree-amber hover:bg-saree-amber-dark text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                          {content.buttonText || 'Order Now'}
                        </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// Specifications Section Component
const SpecificationsSection = ({ section, items }) => {
  const cmsBaseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
  
  return (
    <section className="py-20 bg-gradient-to-br from-saree-lime-light/30 via-white to-phulkari-turquoise-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Technical Specifications'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Detailed technical specifications and requirements'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const isCustomIcon = item.icon && (item.icon.startsWith('/uploads/') || item.icon.startsWith('http'));
            const IconComponent = !isCustomIcon ? (iconMap[item.icon] || CpuChipIcon) : null;
            const customIconUrl = isCustomIcon ? (item.icon.startsWith('http') ? item.icon : `${cmsBaseUrl}${item.icon}`) : null;
            // 6 colors to avoid same pattern in 3-column grid
            const colors = [
              { bg: 'from-saree-teal-light to-white', border: 'border-saree-teal', iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-light hover:border-saree-teal-dark' },
              { bg: 'from-saree-amber-light to-white', border: 'border-saree-amber', iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-light hover:border-saree-amber-dark' },
              { bg: 'from-saree-lime-light to-white', border: 'border-saree-lime', iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-light hover:border-saree-lime-dark' },
              { bg: 'from-phulkari-turquoise-light to-white', border: 'border-phulkari-turquoise', iconBg: 'bg-phulkari-turquoise', hover: 'hover:bg-phulkari-turquoise-light hover:border-phulkari-turquoise-dark' },
              { bg: 'from-saree-rose-light to-white', border: 'border-saree-rose', iconBg: 'bg-saree-rose', hover: 'hover:bg-saree-rose-light hover:border-saree-rose-dark' },
              { bg: 'from-saree-coral-light to-white', border: 'border-saree-coral', iconBg: 'bg-saree-coral', hover: 'hover:bg-saree-coral-light hover:border-saree-coral-dark' }
            ];
            const color = colors[index % colors.length];
            
            let content = {};
            try {
              content = item.content ? JSON.parse(item.content) : {};
            } catch (e) {
              console.error('Error parsing spec content:', e);
            }
            
            return (
              <div key={item.id} className={`bg-gradient-to-br ${color.bg} p-8 rounded-xl border-2 ${color.border} hover:shadow-2xl ${color.hover} hover:scale-105 transition-all duration-300 group`}>
                <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {isCustomIcon ? (
                    <img 
                      src={customIconUrl} 
                      alt={item.title}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                  <IconComponent className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.title}</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {content.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Security Section Component
const SecuritySection = ({ section, items }) => {
  const cmsBaseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
  
  let rightSideContent = {};
  try {
    rightSideContent = section.content ? JSON.parse(section.content) : {};
  } catch (e) {
    console.error('Error parsing security content:', e);
  }
  
  return (
    <section className="py-20 bg-gradient-to-br from-phulkari-turquoise-light/20 via-white to-saree-teal-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Security & Compliance'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Enterprise-grade security features'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              {items.filter(item => item.is_visible).map((item, index) => {
                const isCustomIcon = item.icon && (item.icon.startsWith('/uploads/') || item.icon.startsWith('http'));
                const IconComponent = !isCustomIcon ? (iconMap[item.icon] || ShieldCheckIcon) : null;
                const customIconUrl = isCustomIcon ? (item.icon.startsWith('http') ? item.icon : `${cmsBaseUrl}${item.icon}`) : null;
                const colors = [
                  { iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-dark' },
                  { iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-dark' },
                  { iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-dark' }
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={item.id} className="flex items-start group">
                    <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${color.hover} transition-all duration-300 group-hover:scale-110`}>
                      {isCustomIcon ? (
                        <img 
                          src={customIconUrl} 
                          alt={item.title}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                      <IconComponent className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                      <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right side card - only show if section has a content field with features list */}
          {section.content && (() => {
            try {
              const content = JSON.parse(section.content);
              if (content.features && Array.isArray(content.features) && content.features.length > 0) {
                return (
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:shadow-2xl hover:border-saree-teal transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{content.title || 'Security Features'}</h3>
            <div className="space-y-4">
                      {content.features.map((feature, index) => (
                <div key={index} className="flex items-center group">
                  <CheckIcon className="w-5 h-5 text-saree-lime mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
                );
              }
            } catch (e) {
              // Invalid JSON, skip
            }
            return null;
          })()}
        </div>
      </div>
    </section>
  );
};

// Support Section Component
const SupportSection = ({ section, items }) => {
  const cmsBaseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
  
  return (
    <section className="py-20 bg-gradient-to-br from-saree-rose-light/20 via-white to-saree-amber-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Support & Service Level Agreement'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Round-the-clock support and guaranteed uptime'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const isCustomIcon = item.icon && (item.icon.startsWith('/uploads/') || item.icon.startsWith('http'));
            const IconComponent = !isCustomIcon ? (iconMap[item.icon] || ClockIcon) : null;
            const customIconUrl = isCustomIcon ? (item.icon.startsWith('http') ? item.icon : `${cmsBaseUrl}${item.icon}`) : null;
            const colors = [
              { iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-dark' },
              { iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-dark' },
              { iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-dark' },
              { iconBg: 'bg-saree-rose', hover: 'hover:bg-saree-rose-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 ${color.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 ${color.hover} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  {isCustomIcon ? (
                    <img 
                      src={customIconUrl} 
                      alt={item.title}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                  <IconComponent className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Migration Section Component
const MigrationSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-saree-teal-light via-white to-saree-amber-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Easy Migration & Onboarding'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Seamless migration with expert guidance'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const colors = [
              { iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-dark' },
              { iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-dark' },
              { iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:border-saree-teal hover:scale-105 transition-all duration-300 group">
                <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mb-6 ${color.hover} group-hover:scale-110 transition-all duration-300`}>
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Use Cases Section Component
const UseCasesSection = ({ section, items }) => {
  const cmsBaseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
  
  return (
    <section className="py-20 bg-gradient-to-br from-saree-coral-light/20 via-white to-saree-lime-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Perfect For'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'See how this product perfectly matches different business needs'}
          </p>
        </div>

        <div className="space-y-12">
          {items.filter(item => item.is_visible).map((item, index) => {
            const isCustomIcon = item.icon && (item.icon.startsWith('/uploads/') || item.icon.startsWith('http'));
            const IconComponent = !isCustomIcon ? (iconMap[item.icon] || GlobeAltIcon) : null;
            const customIconUrl = isCustomIcon ? (item.icon.startsWith('http') ? item.icon : `${cmsBaseUrl}${item.icon}`) : null;
            const colors = [
              { bg: 'from-saree-teal-light to-white', border: 'border-saree-teal', iconBg: 'bg-saree-teal', dotBg: 'bg-saree-teal', hover: 'hover:border-saree-teal-dark' },
              { bg: 'from-saree-amber-light to-white', border: 'border-saree-amber', iconBg: 'bg-saree-amber', dotBg: 'bg-saree-amber', hover: 'hover:border-saree-amber-dark' },
              { bg: 'from-saree-lime-light to-white', border: 'border-saree-lime', iconBg: 'bg-saree-lime', dotBg: 'bg-saree-lime', hover: 'hover:border-saree-lime-dark' }
            ];
            const color = colors[index % colors.length];
            
            let content = {};
            try {
              content = item.content ? JSON.parse(item.content) : {};
            } catch (e) {
              console.error('Error parsing use case content:', e);
            }
            
            return (
              <div key={item.id} className={`bg-gradient-to-r ${color.bg} rounded-2xl p-8 border-2 ${color.border} ${color.hover} hover:shadow-2xl transition-all duration-300 group`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <div className={`w-20 h-20 ${color.iconBg} rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {isCustomIcon ? (
                        <img 
                          src={customIconUrl} 
                          alt={item.title}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                      <IconComponent className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl mb-4">→</div>
                    <div className="text-xs text-gray-500 font-medium">PERFECT MATCH</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 group-hover:border-saree-teal transition-colors duration-300">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Why It's Perfect:</h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {content.benefits?.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center">
                          <div className={`w-2 h-2 ${color.dotBg} rounded-full mr-3`}></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


// CTA Section Component
const CTASection = ({ section, items }) => {
  // Get items by type for dynamic rendering
  const titleItem = items.find(item => item.item_type === 'title' && item.is_visible);
  const descriptionItem = items.find(item => item.item_type === 'description' && item.is_visible);
  const primaryCTAItem = items.find(item => item.item_type === 'cta_primary' && item.is_visible);
  const secondaryCTAItem = items.find(item => item.item_type === 'cta_secondary' && item.is_visible);

  return (
    <section className="py-20 bg-gradient-to-br from-saree-teal-light via-white to-saree-amber-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {titleItem?.title || section.title || 'Ready to Get Started?'}
        </h2>
        <p className="text-base text-gray-700 mb-8">
          {descriptionItem?.title || section.description || 'Join thousands of businesses already using our products'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTAItem && (
            primaryCTAItem.value ? (
              <a
                href={primaryCTAItem.value}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-saree-teal text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-saree-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
              >
                {primaryCTAItem.title}
              </a>
            ) : (
            <button className="bg-saree-teal text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-saree-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              {primaryCTAItem.title}
            </button>
            )
          )}
          {secondaryCTAItem && (
            secondaryCTAItem.value ? (
              <a
                href={secondaryCTAItem.value}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-saree-amber text-saree-amber-dark px-8 py-3 rounded-lg font-semibold text-base hover:border-saree-amber-dark hover:bg-saree-amber-light transition-all duration-300 text-center"
              >
                {secondaryCTAItem.title}
              </a>
            ) : (
            <button className="border-2 border-saree-amber text-saree-amber-dark px-8 py-3 rounded-lg font-semibold text-base hover:border-saree-amber-dark hover:bg-saree-amber-light transition-all duration-300">
              {secondaryCTAItem.title}
            </button>
            )
          )}
        </div>
      </div>
    </section>
  );
};

// Default Section Component (fallback)
const DefaultSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-saree-teal-light/20 via-white to-saree-amber-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Section'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Section description'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const colors = [
              { bg: 'bg-saree-teal-light', border: 'border-saree-teal', hover: 'hover:bg-saree-teal-light hover:border-saree-teal-dark' },
              { bg: 'bg-saree-amber-light', border: 'border-saree-amber', hover: 'hover:bg-saree-amber-light hover:border-saree-amber-dark' },
              { bg: 'bg-saree-lime-light', border: 'border-saree-lime', hover: 'hover:bg-saree-lime-light hover:border-saree-lime-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className={`${color.bg} p-8 rounded-xl border-2 ${color.border} hover:shadow-2xl ${color.hover} hover:scale-105 transition-all duration-300 group`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DynamicProductSection;

