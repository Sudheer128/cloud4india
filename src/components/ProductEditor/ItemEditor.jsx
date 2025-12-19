import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import IconSelector, { AVAILABLE_ICONS } from './IconSelector';

const ItemEditor = ({ item, sectionType, sectionId, productId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    item_type: '',
    title: '',
    description: '',
    icon: '',
    value: '',
    label: '',
    content: '',
    order_index: 0
  });

  const [contentJSON, setContentJSON] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        item_type: item.item_type || getDefaultItemType(),
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '',
        value: item.value || '',
        label: item.label || '',
        content: item.content || '',
        order_index: item.order_index || 0
      });

      // Parse JSON content if exists
      if (item.content) {
        try {
          const parsed = JSON.parse(item.content);
          setContentJSON(parsed);
          
          // Backward compatibility: Auto-migrate old price field to hourly_price
          if (parsed.price && !parsed.hourly_price) {
            // Extract price value from old format (e.g., "₹1.19/Hour" -> "₹1.19")
            const priceMatch = parsed.price.match(/[\d,]+\.?\d*/);
            if (priceMatch) {
              setContentJSON({
                ...parsed,
                hourly_price: parsed.price.includes('₹') ? `₹${priceMatch[0]}` : priceMatch[0],
                // Keep old price for reference, but don't use it
                _old_price: parsed.price
              });
            }
          }
        } catch (e) {
          setContentJSON({});
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        item_type: getDefaultItemType()
      }));
    }
  }, [item, sectionType]);

  const getDefaultItemType = () => {
    const typeMap = {
      hero: 'feature',
      features: 'feature',
      pricing: 'pricing_plan',
      specifications: 'specification',
      security: 'security_feature',
      support: 'support_channel',
      migration: 'step',
      use_cases: 'use_case',
      cta: 'cta_primary',
      media_banner: 'media_item'
    };
    return typeMap[sectionType] || 'feature';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build final content based on section type
      let finalContent = formData.content;
      
      // For complex types, stringify JSON
      if (['pricing', 'specifications', 'use_cases', 'media_banner'].includes(sectionType)) {
        finalContent = JSON.stringify(contentJSON);
      }

      const payload = {
        ...formData,
        content: finalContent || null
      };

      const url = item
        ? `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${sectionId}/items/${item.id}`
        : `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/products/${productId}/sections/${sectionId}/items`;

      const method = item ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSave();
      } else {
        throw new Error('Failed to save item');
      }
    } catch (err) {
      alert('Error saving item: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderFormFields = () => {
    switch (sectionType) {
      case 'hero':
        return renderHeroForm();
      case 'pricing':
        return renderPricingForm();
      case 'specifications':
        return renderSpecificationForm();
      case 'use_cases':
        return renderUseCaseForm();
      case 'media_banner':
        return renderMediaForm();
      default:
        return renderGenericForm();
    }
  };

  // Hero Section Forms (feature, stat, CTA)
  const renderHeroForm = () => {
    if (formData.item_type === 'stat') {
      return (
        <>
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-blue-900">
              <strong>Stats</strong> appear as cards on the right side (e.g., "99.9% Uptime", "24/7 Support")
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stat Value *</label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 99.9%, 24/7, 10x"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The big number/stat to display</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stat Label *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Uptime, Support, Faster"
              required
            />
            <p className="text-xs text-gray-500 mt-1">The small label below the stat</p>
          </div>
        </>
      );
    }

    if (formData.item_type === 'cta_primary' || formData.item_type === 'cta_secondary') {
      const isPrimary = formData.item_type === 'cta_primary';
      return (
        <>
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-blue-900">
              <strong>{isPrimary ? 'Primary CTA' : 'Secondary CTA'}</strong> - 
              {isPrimary ? ' Amber button on the left' : ' White border button on the right'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Launch Console, Get Started"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button URL *</label>
            <input
              type="url"
              value={formData.value || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://portal.cloud4india.com/console"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Where the button redirects when clicked</p>
          </div>
          {isPrimary && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Heading (optional)</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Try It Now, Start Training"
                />
                <p className="text-xs text-gray-500 mt-1">Shown in the CTA card on right side</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Subtext (optional)</label>
                <input
                  type="text"
                  value={formData.label || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Deploy in 60 seconds"
                />
                <p className="text-xs text-gray-500 mt-1">Small text below the heading in the card</p>
              </div>
            </>
          )}
        </>
      );
    }

    // Default: feature bullet
    return (
      <>
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-blue-900">
            <strong>Features</strong> appear as checkmark bullets on the left side
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Feature Text *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Latest NVIDIA GPUs (A100, V100, T4)"
            required
          />
        </div>
      </>
    );
  };

  // Pricing Form
  const renderPricingForm = () => {
    return (
      <>
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-blue-900">
            <strong>Pricing Plan</strong> creates a row in the pricing table with specs, features, price, and button
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Tesla T4, SSD Standard"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Hourly *</label>
            <input
              type="text"
              value={contentJSON.hourly_price || ''}
              onChange={(e) => setContentJSON(prev => ({ ...prev, hourly_price: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., ₹1.19"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Price per hour</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Monthly *</label>
            <input
              type="text"
              value={contentJSON.monthly_price || ''}
              onChange={(e) => setContentJSON(prev => ({ ...prev, monthly_price: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., ₹512"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Price per month</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Quarterly</label>
            <input
              type="text"
              value={contentJSON.quarterly_price || ''}
              onChange={(e) => setContentJSON(prev => ({ ...prev, quarterly_price: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., ₹1,459"
            />
            <p className="text-xs text-gray-500 mt-1">Price per quarter (optional)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Yearly</label>
            <input
              type="text"
              value={contentJSON.yearly_price || ''}
              onChange={(e) => setContentJSON(prev => ({ ...prev, yearly_price: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., ₹5,530"
            />
            <p className="text-xs text-gray-500 mt-1">Price per year (optional)</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specifications (one per line)</label>
          <textarea
            value={(contentJSON.specifications || []).join('\n')}
            onChange={(e) => setContentJSON(prev => ({ ...prev, specifications: e.target.value.split('\n').filter(Boolean) }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="1x NVIDIA T4 GPU&#10;16GB GPU Memory&#10;8 vCPUs&#10;32GB RAM"
          />
          <p className="text-xs text-gray-500 mt-1">Enter each specification on a new line</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
          <textarea
            value={(contentJSON.features || []).join('\n')}
            onChange={(e) => setContentJSON(prev => ({ ...prev, features: e.target.value.split('\n').filter(Boolean) }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="24/7 Support&#10;99.9% Uptime SLA&#10;Free Backups"
          />
          <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
            <input
              type="text"
              value={contentJSON.buttonText || ''}
              onChange={(e) => setContentJSON(prev => ({ ...prev, buttonText: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Deploy Now"
            />
            <p className="text-xs text-gray-500 mt-1">Text shown on the button</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
            <input
              type="url"
              value={contentJSON.buttonUrl || ''}
              onChange={(e) => setContentJSON(prev => ({ ...prev, buttonUrl: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://portal.cloud4india.com/signup"
            />
            <p className="text-xs text-gray-500 mt-1">Where button should navigate</p>
          </div>
        </div>
      </>
    );
  };

  // Specification Form
  const renderSpecificationForm = () => {
    return (
      <>
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-blue-900">
            <strong>Specification Card</strong> displays a category with a list of technical details
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., GPU Options, Compute Power, Memory & Storage"
            required
          />
        </div>

        <IconSelector
          value={formData.icon}
          onChange={(iconValue) => setFormData(prev => ({ ...prev, icon: iconValue }))}
          optional={true}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features/Details (one per line) *</label>
          <textarea
            value={(contentJSON.features || []).join('\n')}
            onChange={(e) => setContentJSON(prev => ({ ...prev, features: e.target.value.split('\n').filter(Boolean) }))}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="NVIDIA A100 80GB PCIe/SXM&#10;NVIDIA V100 32GB SXM2&#10;NVIDIA Tesla T4 16GB"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Enter each feature/detail on a new line</p>
        </div>
      </>
    );
  };

  // Use Case Form
  const renderUseCaseForm = () => {
    return (
      <>
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-blue-900">
            <strong>Use Case Card</strong> shows a use case with its benefits
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Use Case Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Deep Learning & AI Research"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Brief description of this use case"
            required
          />
        </div>

        <IconSelector
          value={formData.icon}
          onChange={(iconValue) => setFormData(prev => ({ ...prev, icon: iconValue }))}
          optional={true}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line) *</label>
          <textarea
            value={(contentJSON.benefits || []).join('\n')}
            onChange={(e) => setContentJSON(prev => ({ ...prev, benefits: e.target.value.split('\n').filter(Boolean) }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="10x faster training than CPUs&#10;Support for large transformer models&#10;Multi-GPU distributed training"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Why this use case is perfect (bullet points)</p>
        </div>
      </>
    );
  };

  // Media Gallery Form (for media_banner section)
  const renderMediaForm = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    
    // Initialize contentJSON with media data
    useEffect(() => {
      if (item && !contentJSON.media_type) {
        try {
          const content = item.content ? JSON.parse(item.content) : {};
          setContentJSON({
            media_type: content.media_type || 'image',
            media_source: content.media_source || 'upload',
            media_url: content.media_url || ''
          });
        } catch (e) {
          setContentJSON({ media_type: 'image', media_source: 'upload', media_url: '' });
        }
      }
    }, [item]);
    
    const handleFileUpload = async (file) => {
      setUploading(true);
      setUploadError('');
      
      try {
        const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
        const formDataObj = new FormData();
        const isVideo = contentJSON.media_type === 'video';
        formDataObj.append(isVideo ? 'video' : 'image', file);
        
        const endpoint = isVideo ? '/api/upload/video' : '/api/upload/image';
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          body: formDataObj
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }
        
        setContentJSON(prev => ({
          ...prev,
          media_url: data.filePath,
          media_source: 'upload'
        }));
        
        setUploadError('');
        alert('Media uploaded successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError(error.message);
      } finally {
        setUploading(false);
      }
    };
    
    return (
      <>
        <div className="bg-purple-50 p-3 rounded-lg mb-4">
          <p className="text-xs text-purple-900">
            <strong>Media Item</strong> - Add photos or videos to the gallery carousel
          </p>
        </div>
        
        {/* Title (optional - for overlay) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., GPU Dashboard Overview"
          />
          <p className="text-xs text-gray-500 mt-1">Shown as overlay on the media (optional)</p>
        </div>
        
        {/* Description (optional - for overlay) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Brief description shown below title"
          />
        </div>
        
        {/* Media Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Media Type *</label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="media_type"
                value="image"
                checked={contentJSON.media_type === 'image'}
                onChange={(e) => setContentJSON(prev => ({ ...prev, media_type: e.target.value, media_source: 'upload', media_url: '' }))}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">📷 Photo</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="media_type"
                value="video"
                checked={contentJSON.media_type === 'video'}
                onChange={(e) => setContentJSON(prev => ({ ...prev, media_type: e.target.value, media_source: 'youtube', media_url: '' }))}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">🎥 Video</span>
            </label>
          </div>
        </div>
        
        {/* Video Source (only if video) */}
        {contentJSON.media_type === 'video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Video Source *</label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="video_source"
                  value="youtube"
                  checked={contentJSON.media_source === 'youtube'}
                  onChange={(e) => setContentJSON(prev => ({ ...prev, media_source: e.target.value, media_url: '' }))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">YouTube URL</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="video_source"
                  value="upload"
                  checked={contentJSON.media_source === 'upload'}
                  onChange={(e) => setContentJSON(prev => ({ ...prev, media_source: e.target.value, media_url: '' }))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Upload Video File</span>
              </label>
            </div>
          </div>
        )}
        
        {/* Media Input */}
        {contentJSON.media_source === 'youtube' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL *</label>
            <input
              type="url"
              value={contentJSON.media_url || ''}
              onChange={(e) => setContentJSON(prev => ({ ...prev, media_url: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload {contentJSON.media_type === 'video' ? 'Video' : 'Photo'} *
            </label>
            <input
              type="file"
              accept={contentJSON.media_type === 'video' ? 'video/*' : 'image/*'}
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
            {uploadError && <p className="text-sm text-red-600 mt-2">{uploadError}</p>}
            {contentJSON.media_url && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-xs text-green-900">✓ {contentJSON.media_type === 'video' ? 'Video' : 'Photo'} uploaded: {contentJSON.media_url}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Max size: {contentJSON.media_type === 'video' ? '100MB' : '10MB'}
            </p>
          </div>
        )}
      </>
    );
  };

  // Generic Form (for features, security, support, migration, CTA)
  const renderGenericForm = () => {
    const needsDescription = ['feature', 'security_feature', 'support_channel', 'step'].includes(formData.item_type);
    const needsIcon = ['feature', 'security_feature', 'support_channel'].includes(formData.item_type);
    const isCTA = ['cta_primary', 'cta_secondary'].includes(formData.item_type);

    // Special form for CTA buttons
    if (isCTA) {
      return (
        <>
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-xs text-blue-900">
              <strong>{formData.item_type === 'cta_primary' ? 'Primary Button (Teal)' : 'Secondary Button (Orange Border)'}</strong>
              {' '}appears in the final Get Started section
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder={formData.item_type === 'cta_primary' ? 'Start Free Trial' : 'Contact Sales Team'}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Text displayed on the button</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
            <input
              type="url"
              value={formData.value || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://portal.cloud4india.com/signup"
            />
            <p className="text-xs text-gray-500 mt-1">
              Where the button navigates (leave empty for non-clickable button)
            </p>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-900">
              <strong>Preview:</strong> {formData.item_type === 'cta_primary' ? 'Solid teal button' : 'Bordered orange button'}
            </p>
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter title..."
            required
          />
        </div>

        {needsDescription && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description {needsDescription && '*'}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Detailed description..."
              required={needsDescription}
            />
          </div>
        )}

        {needsIcon && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            
            {/* Icon Tabs: Select from Library or Custom URL */}
            <div className="mb-3">
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, iconType: 'library' }))}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    (!formData.iconType || formData.iconType === 'library')
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📚 Icon Library
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, iconType: 'upload' }))}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    formData.iconType === 'upload'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📤 Upload Custom Icon
                </button>
              </div>
            </div>
            
            {/* Icon Preview */}
            {formData.icon && (!formData.iconType || formData.iconType === 'library') && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                {(() => {
                  const IconComponent = AVAILABLE_ICONS.find(i => i.name === formData.icon)?.icon;
                  return IconComponent ? (
                    <>
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Selected Icon Preview</p>
                        <p className="text-xs text-gray-600">{AVAILABLE_ICONS.find(i => i.name === formData.icon)?.label}</p>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            )}
            
            {/* Icon Library Grid */}
            {(!formData.iconType || formData.iconType === 'library') && (
              <>
                <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  {AVAILABLE_ICONS.map(iconObj => {
                    const IconComponent = iconObj.icon;
                    const isSelected = formData.icon === iconObj.name;
                    return (
                      <button
                        key={iconObj.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: iconObj.name, iconType: 'library' }))}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-300 bg-white hover:border-blue-300'
                        }`}
                        title={iconObj.label}
                      >
                        <IconComponent className={`w-8 h-8 mx-auto ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        <p className={`text-xs mt-2 text-center ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                          {iconObj.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-gray-500">Click an icon to select it • 13 icons available</p>
              </>
            )}
            
            {/* Upload Custom Icon */}
            {formData.iconType === 'upload' && (
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-2">📋 Icon Requirements:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Format: <strong>SVG</strong> (best) or PNG with transparent background</li>
                    <li>• Size: <strong>24x24px to 64x64px</strong></li>
                    <li>• Style: <strong>Outline/stroke</strong> (not filled)</li>
                    <li>• Color: <strong>Monochrome</strong> (single color)</li>
                    <li>• File size: <strong>Under 50KB</strong></li>
                  </ul>
                  <p className="text-xs text-blue-700 mt-2">
                    💡 Get free icons from: <a href="https://heroicons.com" target="_blank" className="underline">heroicons.com</a>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Icon File</label>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      
                      // Validate file size
                      if (file.size > 50 * 1024) {
                        alert('Icon file too large. Maximum 50KB');
                        return;
                      }
                      
                      // Upload icon
                      try {
                        const formDataObj = new FormData();
                        formDataObj.append('image', file);
                        
                        const baseUrl = import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002';
                        const response = await fetch(`${baseUrl}/api/upload/image`, {
                          method: 'POST',
                          body: formDataObj
                        });
                        
                        const data = await response.json();
                        if (response.ok) {
                          setFormData(prev => ({ ...prev, icon: data.filePath }));
                          alert('Icon uploaded successfully!');
                        } else {
                          throw new Error(data.error || 'Upload failed');
                        }
                      } catch (error) {
                        alert('Error uploading icon: ' + error.message);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    SVG or PNG with transparent background • Max 50KB
                  </p>
                </div>
                
                {/* Custom Icon Preview */}
                {formData.icon && formData.icon.startsWith('/uploads') && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-300 flex items-center justify-center">
                        <img 
                          src={`${import.meta.env.VITE_CMS_URL || 'http://149.13.60.6:4002'}${formData.icon}`} 
                          alt="Custom icon" 
                          className="w-8 h-8" 
                        />
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-medium">✓ Icon uploaded successfully</p>
                        <p className="text-xs text-gray-500">{formData.icon}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  // Item Type Selector
  const getItemTypesForSection = () => {
    const typeMap = {
      hero: ['feature', 'stat', 'cta_primary'],
      features: ['feature'],
      pricing: ['pricing_plan'],
      specifications: ['specification'],
      security: ['security_feature'],
      support: ['support_channel'],
      migration: ['step'],
      use_cases: ['use_case'],
      cta: ['cta_primary', 'cta_secondary']
    };
    return typeMap[sectionType] || ['feature'];
  };

  const availableItemTypes = getItemTypesForSection();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {item ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Order (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
          <input
            type="number"
            value={formData.order_index}
            readOnly
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Order cannot be changed • Lower numbers appear first</p>
        </div>

        {/* Dynamic Form Fields */}
        {renderFormFields()}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                {item ? 'Update' : 'Create'} Item
              </>
            )}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default ItemEditor;

