import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  XMarkIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  getIntegrityPages, 
  getIntegrityPage, 
  updateIntegrityPage,
  toggleIntegrityPageVisibility
} from '../services/cmsApi';

const IntegrityAdmin = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Hero Section
    eyebrow: '',
    heading: '',
    description: '',
    // Content Sections
    sections: []
  });
  
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch all integrity pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await getIntegrityPages(true);
      setPages(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching integrity pages:', err);
      setError('Failed to load integrity pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Parse existing content to structure
  const parseContentToStructure = (title, description, content) => {
    // Extract eyebrow from description or use default
    const eyebrow = 'Integrity & Policies';
    
    // Use title as heading
    const heading = title || '';
    
    // Parse content into sections
    const sections = [];
    
    if (typeof window !== 'undefined' && content) {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        let currentSection = null;
        let currentItems = [];
        
        const nodes = Array.from(tempDiv.childNodes);
        
        nodes.forEach((node) => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            const tagName = node.tagName.toLowerCase();
            
            if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
              // Save previous section
              if (currentSection) {
                sections.push({
                  ...currentSection,
                  items: currentItems
                });
              }
              
              // Start new section
              currentSection = {
                id: `section-${sections.length + 1}`,
                heading: node.textContent.trim() || 'Untitled Section',
                description: '',
                hasItems: false,
                items: []
              };
              currentItems = [];
            } else if (tagName === 'p' || tagName === 'div') {
              // Preserve HTML content from ReactQuill, not just text
              const htmlContent = node.innerHTML.trim();
              if (htmlContent && currentSection) {
                if (currentSection.description) {
                  currentSection.description += ' ' + htmlContent;
                } else {
                  currentSection.description = htmlContent;
                }
              }
            } else if (tagName === 'ol' || tagName === 'ul') {
              // This section has items
              if (currentSection) {
                currentSection.hasItems = true;
                const listItems = node.querySelectorAll('li');
                listItems.forEach((li, index) => {
                  const strong = li.querySelector('strong');
                  const itemHeading = strong ? strong.textContent.trim() : '';
                  // Preserve HTML content after the strong tag (ReactQuill content)
                  let itemDesc = '';
                  if (strong && strong.nextSibling) {
                    // Get HTML content after the strong tag
                    const afterStrong = li.cloneNode(true);
                    const strongEl = afterStrong.querySelector('strong');
                    if (strongEl) {
                      strongEl.remove();
                      itemDesc = afterStrong.innerHTML.trim();
                    }
                  } else if (!strong) {
                    // No strong tag, use all content
                    itemDesc = li.innerHTML.trim();
                  }
                  
                  currentItems.push({
                    id: `item-${currentItems.length + 1}`,
                    heading: itemHeading,
                    description: itemDesc
                  });
                });
              }
            }
          }
        });
        
        // Add last section
        if (currentSection) {
          sections.push({
            ...currentSection,
            items: currentItems
          });
        }
      } catch (err) {
        console.error('Error parsing content:', err);
      }
    }
    
    return { eyebrow, heading, description: description || '', sections };
  };

  // Handle edit button click
  const handleEdit = async (page) => {
    try {
      setLoading(true);
      // Force fresh data fetch with cache-busting - add delay to ensure any pending updates are committed
      console.log('📥 Fetching fresh page data for editing:', page.slug);
      // Small delay to ensure database commits are complete
      await new Promise(resolve => setTimeout(resolve, 150));
      const pageData = await getIntegrityPage(page.slug, true);
      console.log('📥 Fetched page data:', {
        eyebrow: pageData.eyebrow,
        description: pageData.description,
        title: pageData.title,
        'description length': pageData.description?.length
      });
      
      const structure = parseContentToStructure(
        pageData.title,
        pageData.description,
        pageData.content
      );
      
      // Ensure description is properly loaded (handle null, undefined, empty string)
      const loadedDescription = pageData.description !== null && pageData.description !== undefined
        ? String(pageData.description)
        : '';
      
      console.log('📋 Setting form data:', {
        'pageData.description': pageData.description,
        'loadedDescription': loadedDescription,
        'description type': typeof pageData.description
      });
      
      setFormData({
        eyebrow: pageData.eyebrow || 'Integrity & Policies',
        heading: structure.heading || pageData.title || '',
        description: loadedDescription,
        sections: structure.sections.length > 0 ? structure.sections : [{
          id: 'section-1',
          heading: 'Content',
          description: pageData.content || '',
          hasItems: false,
          items: []
        }]
      });
      
      // Use fresh data from API, not the cached page object
      setEditingPage({
        ...page,
        ...pageData
      });
      setEditingSection(null);
      setEditingItem(null);
      setError(null);
    } catch (err) {
      console.error('Error fetching page data:', err);
      alert('Failed to load page data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Combine structure back to HTML
  const combineStructureToHTML = () => {
    let html = '';
    
    formData.sections.forEach((section) => {
      if (section.hasItems && section.items.length > 0) {
        // Section with items
        html += `<h2>${section.heading}</h2>`;
        if (section.description) {
          // ReactQuill already returns HTML, so insert directly without wrapping
          // Check if it's already wrapped in a tag, if not, wrap it
          const trimmedDesc = section.description.trim();
          if (trimmedDesc && !trimmedDesc.startsWith('<')) {
            html += `<p>${trimmedDesc}</p>`;
          } else {
            html += trimmedDesc;
          }
        }
        html += '<ol>';
        section.items.forEach((item) => {
          // Item description from ReactQuill is already HTML
          const itemDesc = item.description || '';
          const itemHeading = item.heading || '';
          if (itemHeading) {
            html += `<li><strong>${itemHeading}</strong>${itemDesc ? '<br>' + itemDesc : ''}</li>`;
          } else {
            html += `<li>${itemDesc}</li>`;
          }
        });
        html += '</ol>';
      } else {
        // Simple section
        html += `<h2>${section.heading}</h2>`;
        if (section.description) {
          // ReactQuill already returns HTML, so insert directly without wrapping
          // Check if it's already wrapped in a tag, if not, wrap it
          const trimmedDesc = section.description.trim();
          if (trimmedDesc && !trimmedDesc.startsWith('<')) {
            html += `<p>${trimmedDesc}</p>`;
          } else {
            html += trimmedDesc;
          }
        }
      }
    });
    
    return html;
  };

  // Handle save
  const handleSave = async () => {
    if (!editingPage) return;

    if (!formData.heading) {
      alert('Heading is required');
      return;
    }

    try {
      setSaving(true);
      const content = combineStructureToHTML();
      
      // Prepare update data - always include all fields to ensure updates work
      const updateData = {
        title: formData.heading,
        description: formData.description !== undefined && formData.description !== null 
          ? String(formData.description).trim() 
          : '',
        eyebrow: formData.eyebrow !== undefined && formData.eyebrow !== null
          ? String(formData.eyebrow).trim()
          : '',
        content: content
      };
      
      console.log('📤 Sending update request:', {
        id: editingPage.id,
        data: updateData,
        'description': updateData.description,
        'description length': updateData.description?.length,
        'eyebrow': updateData.eyebrow,
        'eyebrow length': updateData.eyebrow?.length,
        'formData.description (raw)': formData.description
      });
      
      const response = await updateIntegrityPage(editingPage.id, updateData);
      
      console.log('✅ Update response:', response);
      console.log('📝 Update data sent:', JSON.stringify(updateData, null, 2));
      
      // Longer delay to ensure database commit completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the update by fetching the page again with fresh timestamp
      // Increase delay to ensure database commit
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force a completely fresh fetch with multiple cache-busting parameters
      const verifyTimestamp = Date.now();
      const verifyRandom = Math.random().toString(36).substring(7);
      const verifyData = await getIntegrityPage(editingPage.slug, true);
      
      console.log('🔍 Verified data after update:', {
        eyebrow: verifyData.eyebrow,
        description: verifyData.description,
        title: verifyData.title,
        'description length': verifyData.description?.length,
        'description value': verifyData.description,
        'expected description': updateData.description,
        'match': verifyData.description === updateData.description
      });
      
      // If description doesn't match, try one more time after a longer delay
      if (verifyData.description !== updateData.description) {
        console.warn('⚠️ Description mismatch detected, retrying fetch...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryData = await getIntegrityPage(editingPage.slug, true);
        console.log('🔍 Retry fetch result:', {
          description: retryData.description,
          'expected': updateData.description,
          'match': retryData.description === updateData.description
        });
        if (retryData.description === updateData.description) {
          Object.assign(verifyData, retryData);
        }
      }
      
      // Refresh the pages list to show updated data with cache busting
      await fetchPages();
      
      // Update the pages list with the verified data (double update to ensure it sticks)
      setPages(prevPages => {
        const updated = prevPages.map(p => 
          p.id === editingPage.id 
            ? { ...p, ...verifyData }
            : p
        );
        console.log('📋 Updated pages list:', updated.find(p => p.id === editingPage.id));
        return updated;
      });
      
      // Trigger a custom event to refresh the frontend page if it's open
      window.dispatchEvent(new CustomEvent('integrity-page-updated', { 
        detail: { pageId: editingPage.id, slug: editingPage.slug } 
      }));
      
      // Also use localStorage as a cross-tab communication mechanism
      try {
        localStorage.setItem('integrity-page-updated', editingPage.slug);
        localStorage.setItem('integrity-page-updated-timestamp', Date.now().toString());
        // Remove after a short delay to allow event to be caught
        setTimeout(() => {
          localStorage.removeItem('integrity-page-updated');
        }, 1000);
      } catch (e) {
        console.warn('localStorage not available for cross-tab communication');
      }
      
      setEditingPage(null);
      alert('Page updated successfully! The frontend page will refresh automatically if open.');
    } catch (err) {
      console.error('❌ Error updating page:', err);
      console.error('Error details:', err.response?.data || err.message);
      alert('Failed to update page: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Handle visibility toggle
  const handleToggleVisibility = async (page) => {
    try {
      await toggleIntegrityPageVisibility(page.id);
      await fetchPages();
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Failed to toggle visibility: ' + err.message);
    }
  };

  // Section management
  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      heading: 'New Section',
      description: '',
      hasItems: false,
      items: []
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection]
    });
    setEditingSection(newSection.id);
  };

  const handleDeleteSection = (sectionId) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setFormData({
        ...formData,
        sections: formData.sections.filter(s => s.id !== sectionId)
      });
      if (editingSection === sectionId) {
        setEditingSection(null);
      }
    }
  };

  const handleUpdateSection = (sectionId, updates) => {
    setFormData({
      ...formData,
      sections: formData.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    });
  };

  const handleMoveSection = (sectionId, direction) => {
    const index = formData.sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.sections.length) return;
    
    const newSections = [...formData.sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    setFormData({
      ...formData,
      sections: newSections
    });
  };

  // Item management (for sections with multiple items)
  const handleAddItem = (sectionId) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newItem = {
      id: `item-${Date.now()}`,
      heading: 'New Item',
      description: ''
    };
    
    handleUpdateSection(sectionId, {
      hasItems: true,
      items: [...(section.items || []), newItem]
    });
    
    setEditingItem({ sectionId, itemId: newItem.id });
  };

  const handleDeleteItem = (sectionId, itemId) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    handleUpdateSection(sectionId, {
      items: section.items.filter(item => item.id !== itemId)
    });
    
    if (editingItem?.itemId === itemId) {
      setEditingItem(null);
    }
  };

  const handleUpdateItem = (sectionId, itemId, updates) => {
    const section = formData.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    handleUpdateSection(sectionId, {
      items: section.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    });
  };

  // Get page display name
  const getPageDisplayName = (slug) => {
    const names = {
      'privacy': 'Privacy Policy',
      'acceptance-user-policy': 'Acceptance User Policy',
      'msa-sla': 'MSA & SLA',
      'terms': 'Terms & Conditions',
      'refund-policy': 'Refund Policy'
    };
    return names[slug] || slug;
  };

  if (loading && pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading integrity pages...</p>
        </div>
      </div>
    );
  }

  const currentEditingSection = formData.sections.find(s => s.id === editingSection);
  const currentEditingItem = editingItem && currentEditingSection
    ? currentEditingSection.items.find(item => item.id === editingItem.itemId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style>{`
        .ql-container {
          font-size: 15px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 150px;
        }
        .ql-editor {
          min-height: 150px;
          padding: 12px;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 8px;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-top: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Integrity Pages Management</h1>
          </div>
          <p className="text-gray-600">Manage privacy policy, terms, and other legal pages</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Pages List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Integrity Pages</h2>
            <p className="text-sm text-gray-500 mt-1">Click Edit to modify any page content</p>
          </div>

          <div className="divide-y divide-gray-200">
            {pages.map((page) => (
              <div
                key={page.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getPageDisplayName(page.slug)}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        page.is_visible === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {page.is_visible === 1 ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Title:</strong> {page.title}
                    </p>
                    {page.description && (
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Description:</strong> {page.description.substring(0, 100)}
                        {page.description.length > 100 ? '...' : ''}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Slug: <code className="bg-gray-100 px-1 py-0.5 rounded">/{page.slug}</code> • 
                      Last updated: {page.updated_at 
                        ? new Date(page.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleVisibility(page)}
                      className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                        page.is_visible === 1
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={page.is_visible === 1 ? 'Hide page' : 'Show page'}
                    >
                      {page.is_visible === 1 ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(page)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pages.length === 0 && (
            <div className="p-12 text-center">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No integrity pages found</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Edit {getPageDisplayName(editingPage.slug)}</h3>
                  <p className="text-green-100 mt-1 text-sm">
                    Manage page structure and content
                  </p>
                </div>
                <button
                  onClick={() => setEditingPage(null)}
                  className="text-green-100 hover:text-white text-2xl font-bold"
                  disabled={saving}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Hero Section
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eyebrow Text
                    </label>
                    <input
                      type="text"
                      value={formData.eyebrow}
                      onChange={(e) => setFormData({...formData, eyebrow: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Integrity & Policies"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Heading *
                    </label>
                    <input
                      type="text"
                      value={formData.heading}
                      onChange={(e) => setFormData({...formData, heading: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                      placeholder="Enter main heading..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter description..."
                    />
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Content Sections
                  </h4>
                  <button
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Section
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`bg-white rounded-lg border-2 p-4 transition-all ${
                        editingSection === section.id
                          ? 'border-green-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {editingSection === section.id ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-gray-900">Editing Section</h5>
                            <button
                              onClick={() => setEditingSection(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section Heading
                            </label>
                            <input
                              type="text"
                              value={section.heading}
                              onChange={(e) => handleUpdateSection(section.id, { heading: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section Description
                            </label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                              <ReactQuill
                                theme="snow"
                                value={section.description}
                                onChange={(value) => handleUpdateSection(section.id, { description: value })}
                                modules={{
                                  toolbar: [
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    ['link'],
                                    ['clean']
                                  ]
                                }}
                                placeholder="Enter section description..."
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={section.hasItems}
                              onChange={(e) => handleUpdateSection(section.id, { hasItems: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <label className="text-sm font-medium text-gray-700">
                              This section has multiple items/points
                            </label>
                          </div>

                          {section.hasItems && (
                            <div className="border-t pt-4 mt-4">
                              <div className="flex items-center justify-between mb-3">
                                <h6 className="font-medium text-gray-700">Items/Points</h6>
                                <button
                                  onClick={() => handleAddItem(section.id)}
                                  className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
                                >
                                  <PlusIcon className="w-3 h-3" />
                                  Add Item
                                </button>
                              </div>
                              <div className="space-y-3">
                                {section.items?.map((item, itemIndex) => (
                                  <div
                                    key={item.id}
                                    className={`bg-gray-50 rounded-lg p-3 border ${
                                      editingItem?.sectionId === section.id && editingItem?.itemId === item.id
                                        ? 'border-blue-500'
                                        : 'border-gray-200'
                                    }`}
                                  >
                                    {editingItem?.sectionId === section.id && editingItem?.itemId === item.id ? (
                                      <div className="space-y-2">
                                        <input
                                          type="text"
                                          value={item.heading}
                                          onChange={(e) => handleUpdateItem(section.id, item.id, { heading: e.target.value })}
                                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm font-semibold"
                                          placeholder="Item heading..."
                                        />
                                        <div className="border border-gray-300 rounded overflow-hidden">
                                          <ReactQuill
                                            theme="snow"
                                            value={item.description}
                                            onChange={(value) => handleUpdateItem(section.id, item.id, { description: value })}
                                            modules={{
                                              toolbar: [
                                                ['bold', 'italic'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                ['link'],
                                                ['clean']
                                              ]
                                            }}
                                            placeholder="Item description..."
                                          />
                                        </div>
                                        <button
                                          onClick={() => setEditingItem(null)}
                                          className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                                              {itemIndex + 1}
                                            </span>
                                            <strong className="text-sm">{item.heading}</strong>
                                          </div>
                                          <div
                                            className="text-xs text-gray-600 line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: item.description.substring(0, 100) + '...' }}
                                          />
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                          <button
                                            onClick={() => setEditingItem({ sectionId: section.id, itemId: item.id })}
                                            className="p-1 rounded hover:bg-blue-100 text-blue-600"
                                            title="Edit"
                                          >
                                            <PencilIcon className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteItem(section.id, item.id)}
                                            className="p-1 rounded hover:bg-red-100 text-red-600"
                                            title="Delete"
                                          >
                                            <TrashIcon className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  Section {index + 1}
                                </span>
                                <h5 className="font-semibold text-gray-900">{section.heading}</h5>
                                {section.hasItems && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    {section.items?.length || 0} items
                                  </span>
                                )}
                              </div>
                              <div
                                className="text-sm text-gray-600 line-clamp-2 mb-2"
                                dangerouslySetInnerHTML={{ __html: section.description.substring(0, 150) + '...' }}
                              />
                              {section.hasItems && section.items && section.items.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  Items: {section.items.map(item => item.heading).join(', ')}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleMoveSection(section.id, 'up')}
                                disabled={index === 0}
                                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <ArrowUpIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMoveSection(section.id, 'down')}
                                disabled={index === formData.sections.length - 1}
                                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <ArrowDownIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingSection(section.id)}
                                className="p-1.5 rounded hover:bg-blue-100 text-blue-600"
                                title="Edit"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSection(section.id)}
                                className="p-1.5 rounded hover:bg-red-100 text-red-600"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingPage(null)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrityAdmin;
