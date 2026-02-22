import React, { useEffect, useCallback } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ImageLightbox = ({ isOpen, onClose, images = [], currentIndex = 0, onNavigate, cmsUrl }) => {
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !images.length) return null;

  const current = images[currentIndex];
  if (!current) return null;

  const isVideo = current.media_type === 'video';
  const isYouTube = current.media_source === 'youtube';

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = () => {
    if (!current.youtube_id) return null;
    return `https://www.youtube.com/embed/${current.youtube_id}?autoplay=1`;
  };

  const mediaSrc = current.file_url?.startsWith('/uploads')
    ? `${cmsUrl}${current.file_url}`
    : current.file_url;

  const renderMedia = () => {
    if (isYouTube) {
      const embedUrl = getYouTubeEmbedUrl();
      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className="w-full max-w-4xl aspect-video rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={current.file_name}
          />
        );
      }
    }

    if (isVideo && mediaSrc) {
      return (
        <video
          src={mediaSrc}
          controls
          autoPlay
          className="max-w-full max-h-[75vh] rounded-lg shadow-2xl"
        />
      );
    }

    return (
      <img
        src={mediaSrc}
        alt={current.file_name || 'Image'}
        className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23374151" width="200" height="200"/><text fill="%239CA3AF" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">Failed to load</text></svg>'; }}
      />
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {images.length > 1 && currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {images.length > 1 && currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}

      <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {renderMedia()}
        <div className="mt-3 text-center text-white/80 text-sm">
          <p className="font-medium text-white">{current.file_name}</p>
          {current.entity_name && (
            <p className="mt-1">{current.entity_name} {current.section_title ? `\u2014 ${current.section_title}` : ''}</p>
          )}
          {images.length > 1 && (
            <p className="mt-1 text-white/50">{currentIndex + 1} / {images.length}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
