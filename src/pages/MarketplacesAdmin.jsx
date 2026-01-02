import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CMS_URL } from '../utils/config';
import { 
  getAdminMarketplaces,
  toggleMarketplaceVisibility,
  duplicateMarketplace,
  deleteMarketplace,
  updateMarketplace
} from '../services/cmsApi';
import { toSlug } from '../utils/slugUtils';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon, 
  XMarkIcon, 
  DocumentDuplicateIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  CheckIcon, 
  ListBulletIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CubeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Add New Category Modal Component
const AddCategoryModal = ({ isOpen, onClose, onSave, existingCategories }) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategoryName('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      setError('Category name cannot be empty');
      return;
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = existingCategories.some(
      cat => cat.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setError('This category already exists');
      return;
    }

    // Save category
    onSave(trimmedName);
    setCategoryName('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Add New Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError('');
              }}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., New Category"
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter a unique category name. This will be available when creating or editing apps.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Rename Category Modal Component
const RenameCategoryModal = ({ isOpen, onClose, oldCategoryName, appCount, onSave, existingCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewCategoryName(oldCategoryName || '');
      setError('');
    }
  }, [isOpen, oldCategoryName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const trimmedName = newCategoryName.trim();
    
    if (!trimmedName) {
      setError('Category name cannot be empty');
      return;
    }

    if (trimmedName === oldCategoryName) {
      setError('New name must be different from current name');
      return;
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = existingCategories.some(
      cat => cat.toLowerCase() === trimmedName.toLowerCase() && cat !== oldCategoryName
    );

    if (isDuplicate) {
      setError('This category name already exists');
      return;
    }

    // Save category rename
    setSaving(true);
    try {
      await onSave(oldCategoryName, trimmedName);
      setNewCategoryName('');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to rename category');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Rename Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-4">
              This will update all <strong>{appCount}</strong> app{appCount !== 1 ? 's' : ''} in the category <strong>"{oldCategoryName}"</strong> to the new category name.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Category Name
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setError('');
              }}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter new category name"
              autoFocus
              disabled={saving}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Renaming...
                </>
              ) : (
                'Rename Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Category Modal Component
const DeleteCategoryModal = ({ isOpen, onClose, categoryName, appCount, appNames, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Delete Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {appCount > 0 ? (
            <div>
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 mb-2">
                      Cannot delete category "{categoryName}"
                    </h4>
                    <p className="text-sm text-red-700 mb-3">
                      This category has <strong>{appCount}</strong> app{appCount !== 1 ? 's' : ''} assigned to it. Please delete or reassign all apps before deleting this category.
                    </p>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-red-800 mb-2">Apps in this category:</p>
                      <ul className="text-xs text-red-700 space-y-1 max-h-32 overflow-y-auto">
                        {appNames.map((name, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the category <strong>"{categoryName}"</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This category has no apps assigned to it. The category will be removed from the list.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Marketplaces Management Component
const MarketplacesManagement = ({ marketplaces, onDuplicateMarketplace, onDeleteMarketplace, onToggleVisibility, onRefresh }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToRename, setCategoryToRename] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  // Load categories from database on mount
  useEffect(() => {
    loadCategoriesFromDB();
  }, []);
  
  const loadCategoriesFromDB = async () => {
    try {
      const response = await fetch(`${CMS_URL}/api/marketplaces/categories`);
      if (response.ok) {
        const cats = await response.json();
        setAvailableCategories(cats.map(c => c.name));
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Extract unique categories from marketplaces
  const categoriesFromMarketplaces = Array.from(new Set(marketplaces.map(m => m.category).filter(Boolean)));

  // Merge categories from marketplaces with available categories
  const mergedCategories = Array.from(new Set([
    ...categoriesFromMarketplaces,
    ...availableCategories.filter(cat => !categoriesFromMarketplaces.includes(cat))
  ])).sort();
  
  const categories = ['all', ...mergedCategories];

  // Filter marketplaces based on selected category
  const filteredMarketplaces = selectedCategory === 'all' 
    ? marketplaces 
    : marketplaces.filter(marketplace => marketplace.category === selectedCategory);

  // Get category statistics
  const getCategoryStats = (categoryName) => {
    const appsInCategory = marketplaces.filter(m => m.category === categoryName);
    return {
      count: appsInCategory.length,
      names: appsInCategory.map(m => m.name)
    };
  };

  const handleAddCategory = async (categoryName) => {
    try {
      const response = await fetch(`${CMS_URL}/api/marketplaces/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });
      
      if (response.ok) {
        await loadCategoriesFromDB();
        setShowAddCategoryModal(false);
        alert(`Category "${categoryName}" has been added! It will now appear in all dropdowns.`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to add category'}`);
      }
    } catch (err) {
      alert('Error adding category: ' + err.message);
    }
  };

  const handleDeleteCategoryClick = (categoryName) => {
    const stats = getCategoryStats(categoryName);
    setCategoryToDelete({
      name: categoryName,
      appCount: stats.count,
      appNames: stats.names
    });
    setShowDeleteCategoryModal(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    try {
      const categoryName = categoryToDelete?.name;
      // Find category ID
      const response = await fetch(`${CMS_URL}/api/marketplaces/categories`);
      const cats = await response.json();
      const catToDelete = cats.find(c => c.name === categoryName);
      
      if (catToDelete) {
        const deleteResponse = await fetch(`${CMS_URL}/api/marketplaces/categories/${catToDelete.id}`, {
          method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
          await loadCategoriesFromDB();
          setShowDeleteCategoryModal(false);
          setCategoryToDelete(null);
          alert(`Category "${categoryName}" has been deleted.`);
        }
      }
    } catch (err) {
      alert('Error deleting category: ' + err.message);
    }
  };

  const handleRenameCategoryClick = (categoryName) => {
    const stats = getCategoryStats(categoryName);
    setCategoryToRename({
      oldName: categoryName,
      appCount: stats.count
    });
    setShowRenameCategoryModal(true);
  };

  const handleRenameCategory = async (oldCategoryName, newCategoryName) => {
    try {
      // Find category ID and update it
      const response = await fetch(`${CMS_URL}/api/marketplaces/categories`);
      const cats = await response.json();
      const catToRename = cats.find(c => c.name === oldCategoryName);
      
      if (catToRename) {
        const updateResponse = await fetch(`${CMS_URL}/api/marketplaces/categories/${catToRename.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategoryName })
        });
        
        if (updateResponse.ok) {
          // Update marketplaces with old category
          const marketplacesToUpdate = marketplaces.filter(m => m.category === oldCategoryName);
          
          for (const marketplace of marketplacesToUpdate) {
            await updateMarketplace(marketplace.id, {
              ...marketplace,
              category: newCategoryName
            });
          }
          
          await loadCategoriesFromDB();
          if (onRefresh) await onRefresh();
          
          alert(`Successfully renamed category "${oldCategoryName}" to "${newCategoryName}". Updated ${marketplacesToUpdate.length} app${marketplacesToUpdate.length !== 1 ? 's' : ''}.`);
          setShowRenameCategoryModal(false);
          setCategoryToRename(null);
        }
      }
    } catch (err) {
      console.error('Error renaming category:', err);
      alert('Error renaming category: ' + err.message);
      throw err;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Marketplace Apps</h3>
        <div className="flex items-center gap-3">
          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer pr-10"
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== 'all').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <button 
            onClick={() => setShowAddCategoryModal(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_2fr_1.5fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div>Marketplace App</div>
          <div>Description</div>
          <div>Route</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredMarketplaces.length > 0 ? (
            filteredMarketplaces.map((marketplace) => (
            <li key={marketplace.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="md:grid md:grid-cols-[1.5fr_2fr_1.5fr_auto] md:gap-4 items-start">
                <div className="flex items-start gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    marketplace.category === 'Content Management Systems'
                      ? 'bg-sky-100 text-sky-700'
                      : marketplace.category === 'Databases'
                      ? 'bg-purple-100 text-purple-700'
                      : marketplace.category === 'Developer Tools'
                      ? 'bg-amber-100 text-amber-700'
                      : marketplace.category === 'Media'
                      ? 'bg-pink-100 text-pink-700'
                      : marketplace.category === 'E Commerce'
                      ? 'bg-orange-100 text-orange-700'
                      : marketplace.category === 'Business Applications'
                      ? 'bg-indigo-100 text-indigo-700'
                      : marketplace.category === 'Monitoring Applications'
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {marketplace.category}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{marketplace.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 md:mt-0">{marketplace.description}</div>
                <div className="text-xs text-gray-500 mt-2 md:mt-0">/marketplace/{toSlug(marketplace.name)}</div>
                <div className="flex items-center justify-start md:justify-end gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => navigate(`/rohit/marketplaces-new/${marketplace.id}`)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    title="Edit Marketplace App - New Interface"
                    aria-label="Edit Marketplace App - New Interface"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateMarketplace(marketplace)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                    title="Duplicate"
                    aria-label="Duplicate"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleVisibility(marketplace)}
                    className={`inline-flex items-center justify-center p-2 rounded-lg ${
                      marketplace.is_visible !== 0 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    title={marketplace.is_visible !== 0 ? 'Hide App' : 'Show App'}
                    aria-label={marketplace.is_visible !== 0 ? 'Hide App' : 'Show App'}
                  >
                    {marketplace.is_visible !== 0 ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteMarketplace(marketplace)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    title="Delete"
                    aria-label="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          )))
          : (
            <li className="px-6 py-12 text-center">
              <div className="text-gray-400 mb-2">
                <FunnelIcon className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">No apps found in this category</p>
              <p className="text-gray-500 text-sm mt-1">Try selecting a different category or "All Categories"</p>
            </li>
          )}
        </ul>
      </div>
      
      {/* Category Management Section */}
      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Category Management</h4>
          <p className="text-sm text-gray-600 mt-1">Manage your app categories. Delete categories that have no apps assigned.</p>
        </div>
        <div className="p-6">
          {categories.filter(cat => cat !== 'all').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.filter(cat => cat !== 'all').map((category) => {
                const stats = getCategoryStats(category);
                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-1">{category}</h5>
                        <p className="text-sm text-gray-600">
                          {stats.count} app{stats.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRenameCategoryClick(category)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Rename Category"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoryClick(category)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Category"
                          disabled={stats.count > 0}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {stats.count > 0 && (
                      <div className="text-xs text-gray-500 mt-2">
                        {stats.names.slice(0, 3).join(', ')}
                        {stats.count > 3 && ` and ${stats.count - 3} more`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No categories available. Add categories using the button above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={handleAddCategory}
        existingCategories={categories.filter(cat => cat !== 'all')}
      />

      <DeleteCategoryModal
        isOpen={showDeleteCategoryModal}
        onClose={() => {
          setShowDeleteCategoryModal(false);
          setCategoryToDelete(null);
        }}
        categoryName={categoryToDelete?.name}
        appCount={categoryToDelete?.appCount || 0}
        appNames={categoryToDelete?.appNames || []}
        onConfirm={handleDeleteCategoryConfirm}
      />

      <RenameCategoryModal
        isOpen={showRenameCategoryModal}
        onClose={() => {
          setShowRenameCategoryModal(false);
          setCategoryToRename(null);
        }}
        oldCategoryName={categoryToRename?.oldName}
        appCount={categoryToRename?.appCount || 0}
        onSave={handleRenameCategory}
        existingCategories={categories.filter(cat => cat !== 'all')}
      />
    </div>
  );
};

// Main Marketplaces Admin Component
const MarketplacesAdmin = () => {
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplaces();
  }, []);

  const fetchMarketplaces = async () => {
    try {
      setLoading(true);
      const marketplacesData = await getAdminMarketplaces();
      setMarketplaces(marketplacesData);
    } catch (error) {
      console.error('Error fetching marketplaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateMarketplace = async (marketplace) => {
    const newName = prompt('Enter new marketplace app name:', `${marketplace.name} (Copy)`);
    if (!newName) return;

    try {
      await duplicateMarketplace(marketplace.id, { name: newName });
      await fetchMarketplaces();
      alert('Marketplace app duplicated successfully!');
    } catch (error) {
      alert('Error duplicating marketplace app: ' + error.message);
    }
  };

  const handleDeleteMarketplace = async (marketplace) => {
    if (window.confirm(`Are you sure you want to delete "${marketplace.name}"?`)) {
      try {
        await deleteMarketplace(marketplace.id);
        await fetchMarketplaces();
        alert('Marketplace app deleted successfully!');
      } catch (error) {
        alert('Error deleting marketplace app: ' + error.message);
      }
    }
  };

  const handleToggleVisibility = async (marketplace) => {
    try {
      await toggleMarketplaceVisibility(marketplace.id);
      await fetchMarketplaces();
      alert(`Marketplace app ${marketplace.is_visible ? 'hidden' : 'shown'} successfully!`);
    } catch (error) {
      alert('Error toggling marketplace visibility: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace apps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
        <MarketplacesManagement
          marketplaces={marketplaces}
          onDuplicateMarketplace={handleDuplicateMarketplace}
          onDeleteMarketplace={handleDeleteMarketplace}
          onToggleVisibility={handleToggleVisibility}
          onRefresh={fetchMarketplaces}
        />
    </div>
  );
};

export default MarketplacesAdmin;
