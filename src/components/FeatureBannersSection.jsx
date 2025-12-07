import React, { useState, useEffect } from 'react';
import { useFeatureBanners } from '../hooks/useCMS';
import LoadingSpinner from './LoadingSpinner';

const FeatureBannersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: banners, loading, error } = useFeatureBanners();

  // Default fallback banners
  const defaultBanners = [
    {
      id: 1,
      category: 'Event',
      title: 'Join us at Cloud4India Summit 2025—India\'s largest cloud infrastructure event',
      subtitle: 'Connect with industry leaders and explore the future of cloud computing',
      gradient: 'from-phulkari-fuchsia via-phulkari-red to-phulkari-gold',
      accentGradient: 'from-phulkari-fuchsia to-phulkari-red',
      ctaText: 'Register Now',
      ctaLink: '#'
    },
    {
      id: 2,
      category: 'Innovation',
      title: 'Accelerate your digital transformation with AI-powered cloud Apps',
      subtitle: 'Discover how leading enterprises are scaling with Cloud4India\'s intelligent infrastructure',
      gradient: 'from-saree-teal via-phulkari-turquoise to-saree-lime',
      accentGradient: 'from-saree-teal to-phulkari-turquoise',
      ctaText: 'Learn More',
      ctaLink: '#'
    },
    {
      id: 3,
      category: 'Security',
      title: 'Enterprise-grade security meets unmatched performance',
      subtitle: 'Protect your data with ISO-certified infrastructure and 99.99% uptime SLA',
      gradient: 'from-saree-rose via-saree-coral to-phulkari-peach',
      accentGradient: 'from-saree-rose to-saree-coral',
      ctaText: 'Explore Security',
      ctaLink: '#'
    },
    {
      id: 4,
      category: 'Savings',
      title: 'Save up to 40% on cloud infrastructure with flexible pricing',
      subtitle: 'Get enterprise features at startup-friendly prices with transparent billing',
      gradient: 'from-phulkari-turquoise via-phulkari-blue-light to-saree-teal',
      accentGradient: 'from-phulkari-turquoise to-saree-teal',
      ctaText: 'View Pricing',
      ctaLink: '/pricing'
    },
    {
      id: 5,
      category: 'Performance',
      title: 'Lightning-fast NVMe storage and dedicated CPU resources',
      subtitle: 'Experience 3x faster performance with our next-gen infrastructure',
      gradient: 'from-phulkari-gold via-saree-amber to-phulkari-peach',
      accentGradient: 'from-phulkari-gold to-saree-amber',
      ctaText: 'Get Started',
      ctaLink: '#'
    }
  ];

  // Use CMS data or fallback to defaults
  const displayBanners = banners && banners.length > 0 ? banners : defaultBanners;

  // Auto-rotate every 3 seconds
  useEffect(() => {
    if (displayBanners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [displayBanners.length]);

  // Reset index if banners change
  useEffect(() => {
    if (displayBanners.length > 0 && currentIndex >= displayBanners.length) {
      setCurrentIndex(0);
    }
  }, [displayBanners.length, currentIndex]);

  // Get previous, current, and next banner indices
  const getPrevIndex = () => (currentIndex - 1 + displayBanners.length) % displayBanners.length;
  const getNextIndex = () => (currentIndex + 1) % displayBanners.length;

  const prevBanner = displayBanners[getPrevIndex()];
  const currentBanner = displayBanners[currentIndex];
  const nextBanner = displayBanners[getNextIndex()];

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full flex items-center justify-center h-[500px]">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error loading feature banners:', error);
    // Continue with default data on error
  }

  if (!displayBanners || displayBanners.length === 0) {
    return null;
  }

  const BannerCard = ({ banner, position, slideIndex, totalSlides }) => {
    const isCenter = position === 'center';
    
    // Different border radius based on position
    const borderRadiusClass = position === 'left' 
      ? 'rounded-r-3xl' // Only right side rounded for left card
      : position === 'right' 
      ? 'rounded-l-3xl' // Only left side rounded for right card
      : 'rounded-3xl'; // All sides rounded for center card
    
    return (
      <div 
        className={`absolute transition-all duration-700 ease-in-out ${
          position === 'left' 
            ? 'left-0 w-[10%] opacity-50 hover:opacity-70 top-[35px]' 
            : position === 'center'
            ? 'left-[11%] w-[78%] z-10 top-0'
            : 'right-0 w-[10%] opacity-50 hover:opacity-70 top-[35px]'
        }`}
      >
        <div className={`relative ${borderRadiusClass} overflow-hidden shadow-2xl ${
          isCenter ? 'h-[500px] cursor-default' : 'h-[420px] cursor-pointer'
        }`}>
          {/* Gradient Background */}
          <div className={`relative h-full bg-gradient-to-br ${banner.gradient} transition-all duration-700`}>
            {/* Angular Accent Shape - Top Left */}
            <div className={`absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br ${banner.accentGradient} opacity-60 transform -translate-x-1/4 -translate-y-1/4 rotate-45`}></div>
            
            {/* Angular Accent Shape - Bottom Right */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black/20 transform translate-x-1/4 translate-y-1/4 -rotate-12"></div>

            {/* Content - Only show full content for center card */}
            {isCenter && (
              <div className="relative z-10 h-full flex flex-col justify-center px-12 md:px-16 lg:px-20">
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {banner.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl leading-tight drop-shadow-lg">
                  {banner.title}
                </h2>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl drop-shadow-md">
                  {banner.subtitle}
                </p>

                {/* CTA Button */}
                <div className="flex items-center space-x-4">
                  <a
                    href={banner.ctaLink}
                    className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                  >
                    {banner.ctaText}
                    <svg
                      className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Slide Counter - Only show on center card */}
            {isCenter && (
              <div className="absolute bottom-8 right-8 bg-gray-900/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold z-20">
                {slideIndex + 1} / {totalSlides}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Carousel Container - Full Width */}
      <div className="w-full mb-8">
        <div className="relative h-[500px]">
          {/* Left Card (Previous) - 12% visible */}
          <BannerCard banner={prevBanner} position="left" slideIndex={currentIndex} totalSlides={displayBanners.length} />
          
          {/* Center Card (Current) - Full view */}
          <BannerCard banner={currentBanner} position="center" slideIndex={currentIndex} totalSlides={displayBanners.length} />
          
          {/* Right Card (Next) - 12% visible */}
          <BannerCard banner={nextBanner} position="right" slideIndex={currentIndex} totalSlides={displayBanners.length} />

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'bg-white w-12 h-3'
                    : 'bg-white/50 hover:bg-white/70 w-3 h-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBannersSection;
