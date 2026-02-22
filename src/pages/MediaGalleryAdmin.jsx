import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  ArrowPathIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowsPointingOutIcon,
  PlayIcon,
  FilmIcon
} from '@heroicons/react/24/outline';
import { CMS_URL } from '../utils/config.js';
import ImageLightbox from '../components/ImageLightbox';

const CATEGORY_COLORS = {
  marketplaces: { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200' },
  products: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' },
  solutions: { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  logos: { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200' },
  orphaned: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

const TYPE_LABELS = {
  icon: 'Icon',
  section_media: 'Section Media',
  item_media: 'Item Media',
  item_icon: 'Item Icon',
  client_logo: 'Client Logo',
  orphaned: 'Orphaned',
};

// Get YouTube thumbnail URL
const getYouTubeThumbnail = (item) => {
  if (item.youtube_id) return `https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`;
  return null;
};

// Get the display src for a media item (thumbnail for grid)
const getMediaThumbSrc = (item, cmsUrl) => {
  if (item.media_source === 'youtube') return getYouTubeThumbnail(item);
  if (item.file_url && item.file_url.startsWith('/uploads')) return `${cmsUrl}${item.file_url}`;
  if (item.file_url && item.file_url.startsWith('http')) return item.file_url;
  return null;
};

// Convert YouTube watch/short URL to embed URL
const getYouTubeEmbedUrl = (item) => {
  if (!item.youtube_id) return null;
  return `https://www.youtube.com/embed/${item.youtube_id}`;
};

const MediaGalleryAdmin = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState({ total: 0, by_category: {}, by_type: {}, by_media_type: {}, orphaned: 0, missing_files: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail panel
  const [selectedImage, setSelectedImage] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Actions
  const [replacing, setReplacing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [bulkDeleteOrphaned, setBulkDeleteOrphaned] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${CMS_URL}/api/admin/media-gallery?_t=${Date.now()}`);
      if (!res.ok) throw new Error('Failed to fetch media gallery');
      const data = await res.json();
      setImages(data.images || []);
      setStats(data.stats || { total: 0, by_category: {}, by_type: {}, by_media_type: {}, orphaned: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  // Filtered images
  const filteredImages = useMemo(() => {
    return images.filter(img => {
      if (categoryFilter !== 'all' && img.category !== categoryFilter) return false;
      if (typeFilter !== 'all' && img.location_type !== typeFilter) return false;
      if (mediaTypeFilter !== 'all' && img.media_type !== mediaTypeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = [
          img.file_name,
          img.entity_name,
          img.section_title,
          img.item_title,
          img.file_path
        ].some(val => val && val.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [images, categoryFilter, typeFilter, mediaTypeFilter, searchQuery]);

  const getLocationBreadcrumb = (img) => {
    const parts = [];
    if (img.entity_name) parts.push(img.entity_name);
    if (img.section_title) parts.push(img.section_title);
    if (img.item_title) parts.push(img.item_title);
    else if (img.item_id) parts.push(`Item #${img.item_id}`);
    return parts.join(' \u2192 ') || img.location_type;
  };

  const getEditLink = (img) => {
    if (img.entity_type === 'marketplace') return `/rohit/marketplaces-new/${img.entity_id}`;
    if (img.entity_type === 'product') return `/rohit/products-new/${img.entity_id}`;
    if (img.entity_type === 'solution') return `/rohit/solutions-new/${img.entity_id}`;
    return null;
  };

  // Replace image
  const handleReplace = async (img, file) => {
    setReplacing(img.id);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${CMS_URL}/api/admin/media-gallery/${img.id}/replace?deleteOld=true&category=${img.category || 'general'}&entityName=${img.entity_name || ''}`, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to replace media');
      }
      await fetchImages();
      setDetailOpen(false);
      setSelectedImage(null);
    } catch (err) {
      alert('Error replacing media: ' + err.message);
    } finally {
      setReplacing(null);
    }
  };

  // Delete image
  const handleDelete = async (img, deleteFile = false) => {
    const label = img.media_type === 'video' ? 'video' : 'image';
    if (!window.confirm(`Delete this ${label}${deleteFile ? ' and its file from disk' : ' reference from database'}?\n\n${img.file_name}`)) return;
    setDeleting(img.id);
    try {
      const res = await fetch(`${CMS_URL}/api/admin/media-gallery/${img.id}?deleteFile=${deleteFile}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete');
      }
      await fetchImages();
      setDetailOpen(false);
      setSelectedImage(null);
    } catch (err) {
      alert('Error deleting: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  // Bulk delete orphaned
  const handleBulkDeleteOrphaned = async () => {
    const orphaned = images.filter(i => i.category === 'orphaned');
    if (!orphaned.length) return;
    if (!window.confirm(`Delete ${orphaned.length} orphaned file(s) from disk? This cannot be undone.`)) return;
    setBulkDeleteOrphaned(true);
    try {
      const res = await fetch(`${CMS_URL}/api/admin/media-gallery/orphaned/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePaths: orphaned.map(o => o.file_path) })
      });
      if (!res.ok) throw new Error('Failed to delete orphaned files');
      const data = await res.json();
      alert(`Deleted ${data.deleted} orphaned file(s).`);
      await fetchImages();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setBulkDeleteOrphaned(false);
    }
  };

  // Open lightbox
  const openLightbox = (img) => {
    const idx = filteredImages.findIndex(i => i.id === img.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  const categoryTabs = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'marketplaces', label: 'Marketplaces', count: stats.by_category.marketplaces || 0 },
    { key: 'products', label: 'Products', count: stats.by_category.products || 0 },
    { key: 'solutions', label: 'Solutions', count: stats.by_category.solutions || 0 },
    { key: 'logos', label: 'Logos', count: stats.by_category.logos || 0 },
    { key: 'orphaned', label: 'Orphaned', count: stats.orphaned },
  ];

  const typeOptions = [
    { key: 'all', label: 'All Types' },
    { key: 'icon', label: 'Icons' },
    { key: 'section_media', label: 'Section Media' },
    { key: 'item_media', label: 'Item Media' },
    { key: 'item_icon', label: 'Item Icons' },
    { key: 'client_logo', label: 'Client Logos' },
  ];

  const mediaTypeOptions = [
    { key: 'all', label: 'All Media' },
    { key: 'image', label: 'Images' },
    { key: 'video', label: 'Videos' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading media gallery...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 font-medium">{error}</p>
        <button onClick={fetchImages} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      {/* Stats Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{stats.total} media files</span>
            </div>
            {stats.by_media_type && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{stats.by_media_type.image || 0} images</span>
                <span className="text-gray-300">|</span>
                <span>{stats.by_media_type.video || 0} videos</span>
              </div>
            )}
            {stats.missing_files > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                {stats.missing_files} missing files
              </span>
            )}
            {stats.orphaned > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-200">
                <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                {stats.orphaned} orphaned
              </span>
            )}
          </div>
          <button
            onClick={fetchImages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {categoryTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setCategoryFilter(tab.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              categoryFilter === tab.key
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 ring-1 ring-gray-200'
            }`}
          >
            {tab.label}
            <span className={`text-xs ${categoryFilter === tab.key ? 'text-gray-300' : 'text-gray-400'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename, entity, section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none bg-white"
          >
            {typeOptions.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        <select
          value={mediaTypeFilter}
          onChange={(e) => setMediaTypeFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-300 outline-none bg-white"
        >
          {mediaTypeOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        {categoryFilter === 'orphaned' && stats.orphaned > 0 && (
          <button
            onClick={handleBulkDeleteOrphaned}
            disabled={bulkDeleteOrphaned}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <TrashIcon className="w-4 h-4" />
            {bulkDeleteOrphaned ? 'Deleting...' : `Delete All Orphaned (${stats.orphaned})`}
          </button>
        )}
      </div>

      {/* Media Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <PhotoIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No media found matching your filters</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or category filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map(img => {
            const thumbSrc = getMediaThumbSrc(img, CMS_URL);
            const catColor = CATEGORY_COLORS[img.category] || { bg: 'bg-gray-50', text: 'text-gray-700', ring: 'ring-gray-200' };
            const isVideo = img.media_type === 'video';
            const isYouTube = img.media_source === 'youtube';
            const fileMissing = img.file_exists === false;

            return (
              <div
                key={img.id}
                className={`bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group ${fileMissing ? 'border-amber-300' : 'border-gray-200'}`}
                onClick={() => { setSelectedImage(img); setDetailOpen(true); }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {fileMissing ? (
                    /* File missing from disk */
                    <div className="flex flex-col items-center justify-center w-full h-full bg-amber-50/50">
                      <ExclamationTriangleIcon className="w-8 h-8 text-amber-400 mb-1" />
                      <span className="text-[10px] font-medium text-amber-600">File Missing</span>
                    </div>
                  ) : isVideo && !isYouTube && img.file_url && img.file_url.startsWith('/uploads') ? (
                    /* Uploaded video - show video element */
                    <video
                      src={`${CMS_URL}${img.file_url}`}
                      className="w-full h-full object-contain p-2"
                      muted
                      preload="metadata"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : thumbSrc ? (
                    /* Image or YouTube thumbnail */
                    <img
                      src={thumbSrc}
                      alt={img.file_name}
                      className="w-full h-full object-contain p-2"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {!fileMissing && (
                    <div className={`${(thumbSrc || (isVideo && !isYouTube)) ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                      {isVideo ? <FilmIcon className="w-10 h-10 text-gray-300" /> : <PhotoIcon className="w-10 h-10 text-gray-300" />}
                    </div>
                  )}

                  {/* Video badge */}
                  {isVideo && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-white">
                      <PlayIcon className="w-3 h-3" />
                      <span className="text-[10px] font-medium">{isYouTube ? 'YouTube' : 'Video'}</span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); openLightbox(img); }}
                      className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                    >
                      <ArrowsPointingOutIcon className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Visibility indicator */}
                  {img.is_visible !== null && img.is_visible !== undefined && (
                    <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${img.is_visible ? 'bg-green-400' : 'bg-red-400'}`} title={img.is_visible ? 'Visible' : 'Hidden'} />
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-800 truncate" title={img.file_name}>
                    {img.file_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1" title={getLocationBreadcrumb(img)}>
                    {getLocationBreadcrumb(img)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded ${catColor.bg} ${catColor.text} ring-1 ${catColor.ring}`}>
                      {img.category}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {TYPE_LABELS[img.location_type] || img.location_type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Slide-over */}
      {detailOpen && selectedImage && (
        <DetailPanel
          image={selectedImage}
          cmsUrl={CMS_URL}
          onClose={() => { setDetailOpen(false); setSelectedImage(null); }}
          onReplace={handleReplace}
          onDelete={handleDelete}
          onViewFull={() => openLightbox(selectedImage)}
          replacing={replacing}
          deleting={deleting}
          getLocationBreadcrumb={getLocationBreadcrumb}
          getEditLink={getEditLink}
          navigate={navigate}
        />
      )}

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredImages}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
        cmsUrl={CMS_URL}
      />
    </div>
  );
};

// Detail Panel Component
const DetailPanel = ({ image, cmsUrl, onClose, onReplace, onDelete, onViewFull, replacing, deleting, getLocationBreadcrumb, getEditLink, navigate }) => {
  const catColor = CATEGORY_COLORS[image.category] || { bg: 'bg-gray-50', text: 'text-gray-700', ring: 'ring-gray-200' };
  const editLink = getEditLink(image);
  const isVideo = image.media_type === 'video';
  const isYouTube = image.media_source === 'youtube';
  const isUpload = image.media_source === 'upload';
  const fileMissing = image.file_exists === false;

  const triggerReplace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = isVideo ? 'video/*' : 'image/*';
    input.onchange = (e) => {
      if (e.target.files[0]) onReplace(image, e.target.files[0]);
    };
    input.click();
  };

  const renderPreview = () => {
    if (isYouTube) {
      const embedUrl = getYouTubeEmbedUrl(image);
      if (embedUrl) {
        return (
          <iframe
            src={embedUrl}
            className="w-full aspect-video rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={image.file_name}
          />
        );
      }
      const thumb = getYouTubeThumbnail(image);
      return thumb ? <img src={thumb} alt={image.file_name} className="max-w-full max-h-[300px] object-contain p-4" /> : null;
    }

    if (isVideo && isUpload && image.file_url) {
      const src = image.file_url.startsWith('/uploads') ? `${cmsUrl}${image.file_url}` : image.file_url;
      return (
        <video
          src={src}
          controls
          className="max-w-full max-h-[300px] rounded-lg"
          preload="metadata"
        />
      );
    }

    // Image
    const src = image.file_url?.startsWith('/uploads') ? `${cmsUrl}${image.file_url}` : image.file_url;
    if (src) {
      return (
        <img
          src={src}
          alt={image.file_name}
          className="max-w-full max-h-[300px] object-contain p-4 cursor-pointer"
          onClick={onViewFull}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }

    return <PhotoIcon className="w-16 h-16 text-gray-300" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {isVideo ? 'Video' : 'Image'} Details
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview */}
        <div className="px-6 pt-4">
          {fileMissing && (
            <div className="flex items-center gap-2 px-4 py-3 mb-3 bg-amber-50 border border-amber-200 rounded-xl">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">File missing from disk</p>
                <p className="text-xs text-amber-600 mt-0.5">The file at this path no longer exists on the server. It may have been moved or deleted.</p>
              </div>
            </div>
          )}
          <div className="relative bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: '200px' }}>
            {fileMissing ? (
              <div className="flex flex-col items-center justify-center py-8">
                <ExclamationTriangleIcon className="w-12 h-12 text-amber-300 mb-2" />
                <p className="text-sm text-gray-500">No preview available</p>
              </div>
            ) : renderPreview()}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex items-center gap-2 border-b border-gray-100">
          {!isYouTube && (
            <button
              onClick={onViewFull}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
              View Full
            </button>
          )}
          {isYouTube && image.file_url && (
            <a
              href={image.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Open on YouTube
            </a>
          )}
          {image.category !== 'orphaned' && isUpload && (
            <button
              onClick={triggerReplace}
              disabled={replacing === image.id}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className="w-4 h-4" />
              {replacing === image.id ? 'Replacing...' : 'Replace'}
            </button>
          )}
          <button
            onClick={() => onDelete(image, isUpload)}
            disabled={deleting === image.id}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <TrashIcon className="w-4 h-4" />
            {deleting === image.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        {/* Metadata */}
        <div className="px-6 py-4 space-y-4">
          <MetadataRow label="File Name" value={image.file_name} />
          <MetadataRow label="File Path" value={image.file_path} mono />
          <MetadataRow label="Media Type">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${isVideo ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' : 'bg-green-50 text-green-700 ring-1 ring-green-200'}`}>
              {isVideo ? <FilmIcon className="w-3 h-3" /> : <PhotoIcon className="w-3 h-3" />}
              {image.media_type}
            </span>
          </MetadataRow>
          {image.media_source && <MetadataRow label="Source" value={image.media_source} />}
          <MetadataRow label="File Status">
            {fileMissing ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                <ExclamationTriangleIcon className="w-3 h-3" /> Missing
              </span>
            ) : (
              <span className="text-xs text-green-600 font-medium">OK</span>
            )}
          </MetadataRow>
          {image.file_size && <MetadataRow label="File Size" value={formatFileSize(image.file_size)} />}

          <div className="border-t border-gray-100 pt-4">
            <MetadataRow label="Category">
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${catColor.bg} ${catColor.text} ring-1 ${catColor.ring}`}>
                {image.category}
              </span>
            </MetadataRow>
            <MetadataRow label="Type" value={TYPE_LABELS[image.location_type] || image.location_type} />
            {image.entity_name && <MetadataRow label="Entity" value={image.entity_name} />}
            {image.entity_type && <MetadataRow label="Entity Type" value={image.entity_type} />}
          </div>

          {(image.section_title || image.section_type) && (
            <div className="border-t border-gray-100 pt-4">
              {image.section_title && <MetadataRow label="Section" value={image.section_title} />}
              {image.section_type && <MetadataRow label="Section Type" value={image.section_type} />}
              {image.section_order !== null && image.section_order !== undefined && (
                <MetadataRow label="Section Order" value={`#${image.section_order}`} />
              )}
            </div>
          )}

          {(image.item_title || image.item_id) && (
            <div className="border-t border-gray-100 pt-4">
              {image.item_title && <MetadataRow label="Item" value={image.item_title} />}
              {image.item_order !== null && image.item_order !== undefined && (
                <MetadataRow label="Item Order" value={`#${image.item_order}`} />
              )}
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <MetadataRow label="Location" value={getLocationBreadcrumb(image)} />
            {image.is_visible !== null && image.is_visible !== undefined && (
              <MetadataRow label="Visibility">
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${image.is_visible ? 'text-green-600' : 'text-red-600'}`}>
                  {image.is_visible ? <EyeIcon className="w-3.5 h-3.5" /> : <EyeSlashIcon className="w-3.5 h-3.5" />}
                  {image.is_visible ? 'Visible' : 'Hidden'}
                </span>
              </MetadataRow>
            )}
            {image.source_table && <MetadataRow label="DB Table" value={image.source_table} mono />}
            {image.source_column && <MetadataRow label="DB Column" value={image.source_column} mono />}
            {image.created_at && <MetadataRow label="Created" value={new Date(image.created_at).toLocaleString()} />}
          </div>

          {/* Edit entity link */}
          {editLink && (
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => navigate(editLink)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Edit {image.entity_name} {image.entity_type}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetadataRow = ({ label, value, mono, children }) => (
  <div className="flex items-start justify-between gap-4 py-1">
    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{label}</span>
    {children || (
      <span className={`text-xs text-gray-800 text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value || '\u2014'}
      </span>
    )}
  </div>
);

const formatFileSize = (bytes) => {
  if (!bytes) return '\u2014';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default MediaGalleryAdmin;
