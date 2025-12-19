import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  getContactUsContent,
  updateContactHero,
  getContactInfoItems,
  createContactInfoItem,
  updateContactInfoItem,
  deleteContactInfoItem,
  toggleContactInfoItemVisibility,
  getContactSocialLinks,
  createContactSocialLink,
  updateContactSocialLink,
  deleteContactSocialLink,
  toggleContactSocialLinkVisibility
} from '../services/cmsApi';

const ContactUsAdmin = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hero Section
  const [editingHero, setEditingHero] = useState(false);
  const [heroForm, setHeroForm] = useState({
    title: '',
    highlighted_text: '',
    description: ''
  });

  // Contact Info Items
  const [contactItems, setContactItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({ 
    icon_type: 'map', 
    title: '', 
    content: '', 
    sub_content: '', 
    order_index: 0, 
    is_visible: 1 
  });

  // Social Media Links
  const [socialLinks, setSocialLinks] = useState([]);
  const [editingSocialLink, setEditingSocialLink] = useState(null);
  const [showSocialLinkModal, setShowSocialLinkModal] = useState(false);
  const [socialLinkForm, setSocialLinkForm] = useState({ 
    platform: 'linkedin', 
    url: '', 
    icon_name: 'linkedin', 
    order_index: 0, 
    is_visible: 1 
  });

  // Fetch all Contact Us content
  const fetchContactData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContactUsContent(true); // all=true for admin
      setContactData(data);
      
      // Initialize hero form
      if (data.hero) {
        setHeroForm({
          title: data.hero.title || 'Get in Touch',
          highlighted_text: data.hero.highlighted_text || 'Touch',
          description: data.hero.description || ''
        });
      }

      // Load contact items
      const items = await getContactInfoItems(true);
      setContactItems(items || []);

      // Load social media links
      const links = await getContactSocialLinks(true);
      setSocialLinks(links || []);
    } catch (err) {
      console.error('Error fetching contact data:', err);
      setError('Failed to load contact page data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // Hero Section Handlers
  const handleSaveHero = async () => {
    try {
      await updateContactHero(heroForm);
      setEditingHero(false);
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error saving hero:', err);
      alert('Failed to save hero section');
    }
  };

  // Contact Info Items Handlers
  const handleOpenItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        icon_type: item.icon_type || 'map',
        title: item.title || '',
        content: item.content || '',
        sub_content: item.sub_content || '',
        order_index: item.order_index || 0,
        is_visible: item.is_visible !== undefined ? item.is_visible : 1
      });
    } else {
      setEditingItem(null);
      setItemForm({ 
        icon_type: 'map', 
        title: '', 
        content: '', 
        sub_content: '', 
        order_index: contactItems.length, 
        is_visible: 1 
      });
    }
    setShowItemModal(true);
  };

  const handleCloseItemModal = () => {
    setShowItemModal(false);
    setEditingItem(null);
    setItemForm({ 
      icon_type: 'map', 
      title: '', 
      content: '', 
      sub_content: '', 
      order_index: 0, 
      is_visible: 1 
    });
  };

  const handleSaveItem = async () => {
    try {
      if (editingItem) {
        await updateContactInfoItem(editingItem.id, itemForm);
      } else {
        await createContactInfoItem(itemForm);
      }
      handleCloseItemModal();
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save contact info item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact info item?')) {
      return;
    }
    try {
      await deleteContactInfoItem(id);
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete contact info item');
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await toggleContactInfoItemVisibility(id);
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Failed to toggle visibility');
    }
  };

  const handleMoveItem = async (item, direction) => {
    const currentIndex = item.order_index;
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Find item at new position
    const targetItem = contactItems.find(i => i.order_index === newIndex);
    if (!targetItem) return;

    try {
      // Swap order indices
      await updateContactInfoItem(item.id, { ...item, order_index: newIndex });
      await updateContactInfoItem(targetItem.id, { ...targetItem, order_index: currentIndex });
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error moving item:', err);
      alert('Failed to move item');
    }
  };

  // Social Media Links Handlers
  const handleOpenSocialLinkModal = (link = null) => {
    if (link) {
      setEditingSocialLink(link);
      setSocialLinkForm({
        platform: link.platform || 'linkedin',
        url: link.url || '',
        icon_name: link.icon_name || link.platform || 'linkedin',
        order_index: link.order_index || 0,
        is_visible: link.is_visible !== undefined ? link.is_visible : 1
      });
    } else {
      setEditingSocialLink(null);
      setSocialLinkForm({ 
        platform: 'linkedin', 
        url: '', 
        icon_name: 'linkedin', 
        order_index: socialLinks.length, 
        is_visible: 1 
      });
    }
    setShowSocialLinkModal(true);
  };

  const handleCloseSocialLinkModal = () => {
    setShowSocialLinkModal(false);
    setEditingSocialLink(null);
    setSocialLinkForm({ 
      platform: 'linkedin', 
      url: '', 
      icon_name: 'linkedin', 
      order_index: 0, 
      is_visible: 1 
    });
  };

  const handleSaveSocialLink = async () => {
    try {
      if (editingSocialLink) {
        await updateContactSocialLink(editingSocialLink.id, socialLinkForm);
      } else {
        await createContactSocialLink(socialLinkForm);
      }
      handleCloseSocialLinkModal();
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error saving social link:', err);
      alert('Failed to save social media link');
    }
  };

  const handleDeleteSocialLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social media link?')) {
      return;
    }
    try {
      await deleteContactSocialLink(id);
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error deleting social link:', err);
      alert('Failed to delete social media link');
    }
  };

  const handleToggleSocialLinkVisibility = async (id) => {
    try {
      await toggleContactSocialLinkVisibility(id);
      await fetchContactData();
      // Dispatch custom event to refresh frontend
      window.dispatchEvent(new CustomEvent('contactPageUpdated'));
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Failed to toggle visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact page data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchContactData}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us Page</h1>
          <p className="text-gray-600 mt-1">Manage your contact page content</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
          {!editingHero ? (
            <button
              onClick={() => setEditingHero(true)}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveHero}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <CheckIcon className="h-5 w-5" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setEditingHero(false);
                  if (contactData?.hero) {
                    setHeroForm({
                      title: contactData.hero.title || 'Get in Touch',
                      highlighted_text: contactData.hero.highlighted_text || 'Touch',
                      description: contactData.hero.description || ''
                    });
                  }
                }}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {editingHero ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (before highlighted text)
              </label>
              <input
                type="text"
                value={heroForm.title.split(heroForm.highlighted_text || 'Touch')[0] || ''}
                onChange={(e) => {
                  const before = e.target.value;
                  const after = heroForm.title.split(heroForm.highlighted_text || 'Touch')[1] || '';
                  setHeroForm({
                    ...heroForm,
                    title: before + (heroForm.highlighted_text || 'Touch') + after
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Get in "
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Highlighted Text
              </label>
              <input
                type="text"
                value={heroForm.highlighted_text}
                onChange={(e) => {
                  const before = heroForm.title.split(heroForm.highlighted_text || 'Touch')[0] || '';
                  const after = heroForm.title.split(heroForm.highlighted_text || 'Touch')[1] || '';
                  setHeroForm({
                    ...heroForm,
                    highlighted_text: e.target.value,
                    title: before + e.target.value + after
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Touch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Have questions? We'd love to hear from you..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Title:</strong> {contactData?.hero?.title || 'Get in Touch'}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Description:</strong> {contactData?.hero?.description || ''}
            </p>
          </div>
        )}
      </div>

      {/* Contact Info Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Contact Information Items</h2>
          <button
            onClick={() => handleOpenItemModal()}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {contactItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No contact info items yet. Add one to get started.</p>
          ) : (
            contactItems.map((item) => (
              <div 
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {item.icon_type}
                      </span>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.is_visible === 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{item.content}</p>
                    {item.sub_content && (
                      <p className="text-gray-600 text-xs">{item.sub_content}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">Order: {item.order_index}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMoveItem(item, 'up')}
                      disabled={item.order_index === 0}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUpIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleMoveItem(item, 'down')}
                      disabled={item.order_index === contactItems.length - 1}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDownIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(item.id)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                      title={item.is_visible === 1 ? 'Hide' : 'Show'}
                    >
                      {item.is_visible === 1 ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenItemModal(item)}
                      className="p-2 text-orange-600 hover:text-orange-700"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseItemModal}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingItem ? 'Edit Contact Info Item' : 'Add Contact Info Item'}
                  </h3>
                  <button
                    onClick={handleCloseItemModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon Type
                    </label>
                    <select
                      value={itemForm.icon_type}
                      onChange={(e) => setItemForm({ ...itemForm, icon_type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="map">Map (Address)</option>
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="clock">Clock (Business Hours)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={itemForm.title}
                      onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Address, Phone, Email, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={itemForm.content}
                      onChange={(e) => setItemForm({ ...itemForm, content: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Main content text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Content (Optional)
                    </label>
                    <textarea
                      value={itemForm.sub_content}
                      onChange={(e) => setItemForm({ ...itemForm, sub_content: e.target.value })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Additional information"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Index
                    </label>
                    <input
                      type="number"
                      value={itemForm.order_index}
                      onChange={(e) => setItemForm({ ...itemForm, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_visible"
                      checked={itemForm.is_visible === 1}
                      onChange={(e) => setItemForm({ ...itemForm, is_visible: e.target.checked ? 1 : 0 })}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_visible" className="ml-2 block text-sm text-gray-700">
                      Visible on frontend
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCloseItemModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveItem}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Social Media Links</h2>
          <button
            onClick={() => handleOpenSocialLinkModal()}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-4">
          {socialLinks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No social media links yet. Add one to get started.</p>
          ) : (
            socialLinks.map((link) => (
              <div 
                key={link.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">
                        {link.platform}
                      </span>
                      <h3 className="font-semibold text-gray-900">{link.url}</h3>
                      {link.is_visible === 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-2">Order: {link.order_index}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleSocialLinkVisibility(link.id)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                      title={link.is_visible === 1 ? 'Hide' : 'Show'}
                    >
                      {link.is_visible === 1 ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenSocialLinkModal(link)}
                      className="p-2 text-orange-600 hover:text-orange-700"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSocialLink(link.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Social Link Modal */}
      {showSocialLinkModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseSocialLinkModal}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingSocialLink ? 'Edit Social Media Link' : 'Add Social Media Link'}
                  </h3>
                  <button
                    onClick={handleCloseSocialLinkModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform
                    </label>
                    <select
                      value={socialLinkForm.platform}
                      onChange={(e) => setSocialLinkForm({ 
                        ...socialLinkForm, 
                        platform: e.target.value,
                        icon_name: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={socialLinkForm.url}
                      onChange={(e) => setSocialLinkForm({ ...socialLinkForm, url: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://www.linkedin.com/company/cloud4india"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Index
                    </label>
                    <input
                      type="number"
                      value={socialLinkForm.order_index}
                      onChange={(e) => setSocialLinkForm({ ...socialLinkForm, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="social_is_visible"
                      checked={socialLinkForm.is_visible === 1}
                      onChange={(e) => setSocialLinkForm({ ...socialLinkForm, is_visible: e.target.checked ? 1 : 0 })}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="social_is_visible" className="ml-2 block text-sm text-gray-700">
                      Visible on frontend
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={handleCloseSocialLinkModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSocialLink}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    {editingSocialLink ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUsAdmin;

