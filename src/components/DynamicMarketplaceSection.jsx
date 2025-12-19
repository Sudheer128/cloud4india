import React, { useState } from 'react';

// Media Banner Section Component - Carousel Gallery for Multiple Photos/Videos
const MediaBannerSection = ({ section, items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cmsBaseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';

  // Filter visible media items with valid URLs
  const mediaItems = items.filter(item => {
    // Check visibility: is_visible should be !== 0 (consistent with section visibility checks)
    if (item.is_visible === 0 || item.is_visible === false || item.is_visible === null || item.is_visible === undefined) {
      console.log('Item filtered out (not visible):', item.id, item.title, 'is_visible:', item.is_visible);
      return false;
    }
    try {
      const content = item.content ? JSON.parse(item.content) : {};
      const hasMediaUrl = content.media_url && content.media_url.trim() !== '';
      if (!hasMediaUrl) {
        console.log('Item filtered out (no media_url):', item.id, item.title, content);
      }
      return hasMediaUrl;
    } catch (e) {
      console.error('Error parsing item content:', item.id, item.title, e);
      return false;
    }
  });

  // Debug logging - detailed content inspection
  console.log('MediaBannerSection - Items received:', {
    totalItems: items?.length || 0,
    visibleItems: mediaItems.length,
    items: items?.map(item => {
      let parsedContent = null;
      try {
        parsedContent = item.content ? JSON.parse(item.content) : {};
      } catch (e) {
        console.error(`Item ${item.id} content parse error:`, e, 'Raw:', item.content);
      }
      return {
        id: item.id,
        title: item.title,
        is_visible: item.is_visible,
        item_type: item.item_type,
        contentRaw: item.content,
        contentParsed: parsedContent,
        hasMediaUrl: parsedContent?.media_url ? 'YES' : 'NO',
        mediaUrl: parsedContent?.media_url || 'MISSING'
      };
    })
  });

  if (mediaItems.length === 0) {
    console.warn('MediaBannerSection - No valid media items found. Items received:', items);
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
      <div className="w-full px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
        {/* Section Header - Only show if not empty */}
        {section.title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {section.description}
              </p>
            )}
          </div>
        )}

        {/* Split Layout: Content Left, Media Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Content: Title & Description - Compact Width */}
          <div className="text-left space-y-8 order-2 lg:order-1 lg:col-span-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-saree-teal/10 text-saree-teal font-bold text-2xl mb-2 shadow-sm">
              {currentIndex + 1}
            </div>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {currentMedia.title || 'App in Action'}
            </h3>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              {currentMedia.description || 'Watch our demonstration to see how this app can help you.'}
            </p>

            {/* Mobile Navigation Controls (Visible only on mobile) */}
            {mediaItems.length > 1 && (
              <div className="flex gap-4 pt-4 lg:hidden">
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors shadow-sm"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="p-4 rounded-full bg-saree-teal hover:bg-saree-teal-dark text-white transition-colors shadow-lg shadow-saree-teal/30"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right Content: Media Player - Maximized Width */}
          <div className="relative order-1 lg:order-2 lg:col-span-7">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-900 aspect-video group relative ring-1 ring-gray-200/50 transform transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
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

              {/* Desktop Navigation Arrows (Biq Arrows on Sides) */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-saree-teal/90 backdrop-blur-md text-white p-5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center focus:outline-none transform hover:scale-110 hover:rotate-180deg group/btn"
                    aria-label="Previous"
                  >
                    <svg className="w-8 h-8 group-hover/btn:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-saree-teal/90 backdrop-blur-md text-white p-5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center focus:outline-none transform hover:scale-110 group/btn"
                    aria-label="Next"
                  >
                    <svg className="w-8 h-8 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Counter Badge */}
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full z-10 border border-white/20">
                    <span className="text-sm font-bold text-white tracking-widest">
                      {currentIndex + 1} / {mediaItems.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Decorative Glares */}
            <div className="absolute -z-10 top-12 -right-12 w-full h-full bg-saree-teal/10 rounded-[3rem] blur-3xl hidden lg:block"></div>
            <div className="absolute -z-10 -bottom-12 -left-12 w-full h-full bg-saree-amber/10 rounded-[3rem] blur-3xl hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = ({ section, items }) => {
  // Helper function to extract price value from old format (backward compatibility)
  const extractPriceValue = (priceString) => {
    if (!priceString) return null;
    // Extract price with currency symbol if present (e.g., "₹1.19/Hour" -> "₹1.19")
    const match = priceString.match(/(₹?[\d,]+\.?\d*)/);
    return match ? match[1] : priceString;
  };

  // Get table headers from section config or use defaults
  const tableHeaderAppName = section.pricing_table_header_app_name || 'App Name';
  const tableHeaderSpecs = section.pricing_table_header_specs || 'Specifications';
  const tableHeaderFeatures = section.pricing_table_header_features || 'Features';
  const tableHeaderHourly = section.pricing_table_header_hourly || 'Price Hourly';
  const tableHeaderMonthly = section.pricing_table_header_monthly || 'Price Monthly';
  const tableHeaderQuarterly = section.pricing_table_header_quarterly || 'Price Quarterly';
  const tableHeaderYearly = section.pricing_table_header_yearly || 'Price Yearly';
  const tableHeaderAction = section.pricing_table_header_action || 'Action';

  // Get column visibility flags (default to true for backward compatibility)
  const showHourly = section.show_hourly_column !== undefined ? section.show_hourly_column !== 0 : true;
  const showMonthly = section.show_monthly_column !== undefined ? section.show_monthly_column !== 0 : true;
  const showQuarterly = section.show_quarterly_column !== undefined ? section.show_quarterly_column !== 0 : true;
  const showYearly = section.show_yearly_column !== undefined ? section.show_yearly_column !== 0 : true;

  return (
    <section className="py-20 bg-gradient-to-br from-saree-amber-light/20 via-white to-saree-lime-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Pricing'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || section.content || 'Choose the perfect plan for your needs'}
          </p>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-saree-teal to-saree-amber text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm">{tableHeaderAppName}</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">{tableHeaderSpecs}</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">{tableHeaderFeatures}</th>
                  {showHourly && <th className="px-6 py-4 text-center font-semibold text-sm">{tableHeaderHourly}</th>}
                  {showMonthly && <th className="px-6 py-4 text-center font-semibold text-sm">{tableHeaderMonthly}</th>}
                  {showQuarterly && <th className="px-6 py-4 text-center font-semibold text-sm">{tableHeaderQuarterly}</th>}
                  {showYearly && <th className="px-6 py-4 text-center font-semibold text-sm">{tableHeaderYearly}</th>}
                  <th className="px-6 py-4 text-center font-semibold text-sm">{tableHeaderAction}</th>
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

                  // Backward compatibility: Extract prices from old format or use new format
                  let hourlyPrice = content.hourly_price || null;
                  let monthlyPrice = content.monthly_price || null;
                  let quarterlyPrice = content.quarterly_price || null;
                  let yearlyPrice = content.yearly_price || null;

                  // If old format exists and new format doesn't, extract from old price
                  if (content.price && !hourlyPrice) {
                    hourlyPrice = extractPriceValue(content.price);
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
                      {showHourly && (
                        <td className="px-6 py-4 text-center">
                          <div className="font-bold text-lg text-gray-900">{hourlyPrice || 'N/A'}</div>
                          <div className="text-xs text-gray-500">/Hour</div>
                        </td>
                      )}
                      {showMonthly && (
                        <td className="px-6 py-4 text-center">
                          <div className="font-bold text-lg text-gray-900">{monthlyPrice || 'N/A'}</div>
                          <div className="text-xs text-gray-500">/Month</div>
                        </td>
                      )}
                      {showQuarterly && (
                        <td className="px-6 py-4 text-center">
                          <div className="font-bold text-lg text-gray-900">{quarterlyPrice || 'N/A'}</div>
                          <div className="text-xs text-gray-500">/Quarter</div>
                        </td>
                      )}
                      {showYearly && (
                        <td className="px-6 py-4 text-center">
                          <div className="font-bold text-lg text-gray-900">{yearlyPrice || 'N/A'}</div>
                          <div className="text-xs text-gray-500">/Year</div>
                        </td>
                      )}
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

const DynamicMarketplaceSection = ({ section, items, marketplace, hasNavigation = false }) => {
  // Don't render if section is hidden (check for 0, false, null, or undefined)
  if (section.is_visible === 0 || section.is_visible === false || section.is_visible === null || section.is_visible === undefined) {
    return null;
  }

  // Render different section types
  switch (section.section_type) {
    case 'media_banner':
      return <MediaBannerSection section={section} items={items} />;
    case 'pricing':
      return <PricingSection section={section} items={items} />;
    default:
      return null; // Other section types are handled by UniversalMarketplacePage
  }
};

export default DynamicMarketplaceSection;

