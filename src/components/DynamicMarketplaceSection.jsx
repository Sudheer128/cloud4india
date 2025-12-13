import React, { useState } from 'react';

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
          
          {/* Main Media Display */}
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
        
        {/* Thumbnail Navigation */}
        {mediaItems.length > 1 && (
          <div className="mt-6 flex justify-center gap-2 overflow-x-auto pb-2">
            {mediaItems.map((item, index) => {
              const mediaInfo = getMediaInfo(item);
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    isActive 
                      ? 'border-saree-teal ring-2 ring-saree-teal/50 scale-105' 
                      : 'border-gray-300 hover:border-saree-teal/50'
                  }`}
                >
                  {mediaInfo.mediaType === 'image' ? (
                    <img
                      src={mediaInfo.mediaUrl}
                      alt={item.title || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const DynamicMarketplaceSection = ({ section, items, marketplace, hasNavigation = false }) => {
  // Don't render if section is hidden
  if (!section.is_visible) {
    return null;
  }

  // Render different section types
  switch (section.section_type) {
    case 'media_banner':
      return <MediaBannerSection section={section} items={items} />;
    default:
      return null; // Other section types are handled by UniversalMarketplacePage
  }
};

export default DynamicMarketplaceSection;

