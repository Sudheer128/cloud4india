import React, { useState, useEffect } from 'react';
import { 
  getAdminSolutions,
  toggleSolutionVisibility,
  duplicateSolution,
  deleteSolution,
  updateSolution
} from '../services/cmsApi';
import { enhanceDescription } from '../services/aiService';
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

// Helper function to get available categories from localStorage
const getAvailableCategories = () => {
  try {
    const stored = localStorage.getItem('availableCategories');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

// Helper function to save available categories to localStorage
const saveAvailableCategories = (categories) => {
  try {
    localStorage.setItem('availableCategories', JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving categories to localStorage:', e);
  }
};

// Solutions Management Component
const SolutionsManagement = ({ solutions, onEditSolution, onDuplicateSolution, onDeleteSolution, onToggleVisibility, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToRename, setCategoryToRename] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(getAvailableCategories());

  // Extract unique categories from solutions
  const categoriesFromSolutions = Array.from(new Set(solutions.map(s => s.category).filter(Boolean)));
  
  // Merge categories from solutions with available categories (from localStorage)
  // Remove categories from availableCategories if they now exist in solutions
  const mergedCategories = Array.from(new Set([
    ...categoriesFromSolutions,
    ...availableCategories.filter(cat => !categoriesFromSolutions.includes(cat))
  ])).sort();
  
  const categories = ['all', ...mergedCategories];

  // Filter solutions based on selected category
  const filteredSolutions = selectedCategory === 'all' 
    ? solutions 
    : solutions.filter(solution => solution.category === selectedCategory);

  // Get category statistics
  const getCategoryStats = (categoryName) => {
    const appsInCategory = solutions.filter(s => s.category === categoryName);
    return {
      count: appsInCategory.length,
      names: appsInCategory.map(s => s.name)
    };
  };

  const handleAddCategory = (categoryName) => {
    // Add category to available categories list
    if (!availableCategories.includes(categoryName)) {
      const updated = [...availableCategories, categoryName];
      setAvailableCategories(updated);
      saveAvailableCategories(updated);
    }
    setShowAddCategoryModal(false);
    alert(`Category "${categoryName}" has been added! It will now appear in all dropdowns. You can now duplicate an app and assign it to this category using the Edit button.`);
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

  const handleDeleteCategoryConfirm = () => {
    // Remove category from available categories list
    const categoryName = categoryToDelete?.name;
    const updated = availableCategories.filter(cat => cat !== categoryName);
    setAvailableCategories(updated);
    saveAvailableCategories(updated);
    setShowDeleteCategoryModal(false);
    setCategoryToDelete(null);
    alert(`Category "${categoryName}" has been removed.`);
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
      // Update available categories list
      const updated = availableCategories.map(cat => cat === oldCategoryName ? newCategoryName : cat);
      if (!updated.includes(newCategoryName) && availableCategories.includes(oldCategoryName)) {
        updated.push(newCategoryName);
      }
      setAvailableCategories(updated.filter(cat => cat !== oldCategoryName || cat === newCategoryName));
      saveAvailableCategories(updated.filter(cat => cat !== oldCategoryName || cat === newCategoryName));

      // Get all solutions with the old category
      const solutionsToUpdate = solutions.filter(s => s.category === oldCategoryName);
      
      if (solutionsToUpdate.length === 0) {
        // If no solutions, just update the available categories list
        alert(`Category "${oldCategoryName}" has been renamed to "${newCategoryName}".`);
        setShowRenameCategoryModal(false);
        setCategoryToRename(null);
        return;
      }

      // Update each solution
      let successCount = 0;
      let errorCount = 0;

      for (const solution of solutionsToUpdate) {
        try {
          await updateSolution(solution.id, {
            ...solution,
            category: newCategoryName
          });
          successCount++;
        } catch (err) {
          console.error(`Error updating solution ${solution.id}:`, err);
          errorCount++;
        }
      }

      // Refresh solutions list
      if (onRefresh) {
        await onRefresh();
      }

      // Show result
      if (errorCount === 0) {
        alert(`Successfully renamed category "${oldCategoryName}" to "${newCategoryName}". Updated ${successCount} app${successCount !== 1 ? 's' : ''}.`);
        setShowRenameCategoryModal(false);
        setCategoryToRename(null);
      } else {
        alert(`Renamed category with some errors. ${successCount} app${successCount !== 1 ? 's' : ''} updated, ${errorCount} error${errorCount !== 1 ? 's' : ''}.`);
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
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Apps</h3>
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
          <div>Solution</div>
          <div>Description</div>
          <div>Route</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredSolutions.length > 0 ? (
            filteredSolutions.map((solution) => (
            <li key={solution.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="md:grid md:grid-cols-[1.5fr_2fr_1.5fr_auto] md:gap-4 items-start">
                <div className="flex items-start gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    solution.category === 'Content Management Systems'
                      ? 'bg-sky-100 text-sky-700'
                      : solution.category === 'Databases'
                      ? 'bg-purple-100 text-purple-700'
                      :                     solution.category === 'Developer Tools'
                      ? 'bg-amber-100 text-amber-700'
                      :                     solution.category === 'Media'
                      ? 'bg-pink-100 text-pink-700'
                      : solution.category === 'E Commerce'
                      ? 'bg-orange-100 text-orange-700'
                      : solution.category === 'Business Applications'
                      ? 'bg-indigo-100 text-indigo-700'
                      : solution.category === 'Monitoring Applications'
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {solution.category}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{solution.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 md:mt-0">{solution.description}</div>
                <div className="text-xs text-gray-500 mt-2 md:mt-0">{solution.route}</div>
                <div className="flex items-center justify-start md:justify-end gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => onEditSolution(solution)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    title="Edit Page Content"
                    aria-label="Edit Page Content"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateSolution(solution)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                    title="Duplicate"
                    aria-label="Duplicate"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleVisibility(solution)}
                    className={`inline-flex items-center justify-center p-2 rounded-lg ${
                      solution.is_visible !== 0 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    title={solution.is_visible !== 0 ? 'Hide Solution' : 'Show Solution'}
                    aria-label={solution.is_visible !== 0 ? 'Hide Solution' : 'Show Solution'}
                  >
                    {solution.is_visible !== 0 ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteSolution(solution)}
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
                          title="Rename category"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoryClick(category)}
                          className={`p-2 rounded-lg transition-colors ${
                            stats.count > 0
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                          title={stats.count > 0 ? 'Cannot delete: Category has apps' : 'Delete category'}
                          disabled={stats.count > 0}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {stats.count > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Delete or reassign all apps to remove this category
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No categories available. Add a new category to get started.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Solution Page Management</h3>
            <p className="mt-1 text-sm text-blue-700">
              Click the <strong>Edit</strong> button (blue) to manage the complete content of each solution page including hero sections, benefits, use cases, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Category Modal */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSave={handleAddCategory}
        existingCategories={categories.filter(cat => cat !== 'all')}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={showDeleteCategoryModal}
        onClose={() => {
          setShowDeleteCategoryModal(false);
          setCategoryToDelete(null);
        }}
        categoryName={categoryToDelete?.name || ''}
        appCount={categoryToDelete?.appCount || 0}
        appNames={categoryToDelete?.appNames || []}
        onConfirm={handleDeleteCategoryConfirm}
      />

      {/* Rename Category Modal */}
      <RenameCategoryModal
        isOpen={showRenameCategoryModal}
        onClose={() => {
          setShowRenameCategoryModal(false);
          setCategoryToRename(null);
        }}
        oldCategoryName={categoryToRename?.oldName || ''}
        appCount={categoryToRename?.appCount || 0}
        onSave={handleRenameCategory}
        existingCategories={categories.filter(cat => cat !== 'all')}
      />
    </div>
  );
};

// Solution Editor Component - Full Featured Editor
const SolutionEditor = ({ solution, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [cardData, setCardData] = useState({
    name: '',
    description: '',
    category: '',
    color: '',
    border_color: '',
    route: '',
    gradient_start: '',
    gradient_end: ''
  });
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [managingItems, setManagingItems] = useState(null);
  const [saving, setSaving] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    // Load available categories
    const loadCategories = async () => {
      try {
        // Get categories from localStorage
        const storedCategories = getAvailableCategories();
        
        // Get categories from all solutions
        const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/solutions`);
        if (response.ok) {
          const allSolutions = await response.json();
          const categoriesFromSolutions = Array.from(new Set(allSolutions.map(s => s.category).filter(Boolean)));
          
          // Merge categories from solutions with localStorage categories
          const mergedCategories = Array.from(new Set([
            ...categoriesFromSolutions,
            ...storedCategories.filter(cat => !categoriesFromSolutions.includes(cat))
          ])).sort();
          
          setAvailableCategories(mergedCategories);
        } else {
          // Fallback to localStorage only
          setAvailableCategories(storedCategories);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        // Fallback to localStorage only
        setAvailableCategories(getAvailableCategories());
      }
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    if (solution) {
      setCardData({
        name: solution.name,
        description: solution.description,
        category: solution.category,
        color: solution.color,
        border_color: solution.border_color,
        route: solution.route,
        gradient_start: solution.gradient_start || 'blue',
        gradient_end: solution.gradient_end || 'blue-700'
      });
      loadSections();
    }
  }, [solution]);

  const loadSections = async () => {
    try {
      setLoading(true);
      console.log(`Loading sections for solution ID: ${solution.id}`);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const sectionsData = await response.json();
      console.log(`Loaded ${sectionsData.length} sections:`, sectionsData);
      setSections(sectionsData);
    } catch (err) {
      console.error('Error loading sections:', err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCard = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });
      
      if (response.ok) {
        alert('Solution card updated successfully!');
      } else {
        throw new Error('Failed to update solution');
      }
    } catch (err) {
      alert('Error updating solution: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSection = async (sectionData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (response.ok) {
        await loadSections();
        setEditingSection(null);
        alert('Section created successfully!');
      } else {
        throw new Error('Failed to create section');
      }
    } catch (err) {
      alert('Error creating section: ' + err.message);
    }
  };

  const handleUpdateSection = async (sectionId, sectionData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });
      
      if (response.ok) {
        await loadSections();
        setEditingSection(null);
        alert('Section updated successfully!');
      } else {
        throw new Error('Failed to update section');
      }
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections/${sectionId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await loadSections();
          alert('Section deleted successfully!');
        } else {
          throw new Error('Failed to delete section');
        }
      } catch (err) {
        alert('Error deleting section: ' + err.message);
      }
    }
  };

  const handleToggleVisibility = async (sectionId, currentVisibility) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solution.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_visible: !currentVisibility }),
      });
      
      if (response.ok) {
        await loadSections();
        alert(`Section ${!currentVisibility ? 'shown' : 'hidden'} successfully!`);
      } else {
        throw new Error('Failed to toggle section visibility');
      }
    } catch (err) {
      alert('Error toggling section visibility: ' + err.message);
    }
  };

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section', description: 'Main banner with title, subtitle, and call-to-action buttons' },
    { value: 'benefits', label: 'Key Benefits', description: 'Main benefits and value propositions' },
    { value: 'segments', label: 'Industry Segments', description: 'Different industry segments or target markets' },
    { value: 'success_story', label: 'Success Stories', description: 'Customer testimonials and case studies' },
    { value: 'technology', label: 'Technology Features', description: 'Technical capabilities and innovations' },
    { value: 'use_cases', label: 'Use Cases & Solutions', description: 'Real-world applications and scenarios' },
    { value: 'roi', label: 'ROI & Value', description: 'Return on investment and business value' },
    { value: 'implementation', label: 'Implementation Timeline', description: 'Step-by-step implementation process' },
    { value: 'resources', label: 'Resources & Support', description: 'Documentation, training, and support materials' },
    { value: 'cta', label: 'Call to Action', description: 'Final engagement section with contact forms' },
    { value: 'stats', label: 'Statistics & Metrics', description: 'Key performance indicators and metrics' },
    { value: 'comparison', label: 'Comparison Table', description: 'Feature comparisons and competitive analysis' },
    { value: 'faq', label: 'FAQ Section', description: 'Frequently asked questions' },
    { value: 'testimonials', label: 'Client Testimonials', description: 'Customer feedback and reviews' },
    { value: 'pricing', label: 'Pricing Information', description: 'Pricing tiers and cost information' }
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold text-gray-900">Edit Solution: {solution.name}</h3>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Solution Overview', description: 'Basic solution information' },
            { id: 'sections', label: 'Page Sections', description: 'Manage page content sections' },
            { id: 'preview', label: 'Preview', description: 'Preview the solution page' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              title={tab.description}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Solution Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold mb-6 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
            Solution Overview & Card Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solution Name</label>
              <input
                type="text"
                value={cardData.name}
                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Financial Services"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={cardData.category}
                onChange={(e) => setCardData({...cardData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category...</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={cardData.description}
              onChange={(e) => setCardData({...cardData, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description for the solution card..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">This appears on the solutions overview page</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Route</label>
              <input
                type="text"
                value={cardData.route}
                onChange={(e) => setCardData({...cardData, route: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/solutions/financial-services"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Background</label>
              <input
                type="text"
                value={cardData.color}
                onChange={(e) => setCardData({...cardData, color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="from-blue-50 to-blue-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Border</label>
              <input
                type="text"
                value={cardData.border_color}
                onChange={(e) => setCardData({...cardData, border_color: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="border-blue-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveCard}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Overview'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Page Sections Tab */}
      {activeTab === 'sections' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Page Content Sections</h4>
              <p className="text-sm text-gray-600 mt-1">Manage all sections of the solution page</p>
            </div>
            <button
              onClick={() => setEditingSection('new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add New Section
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sections...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                            section.section_type === 'hero' ? 'bg-purple-100 text-purple-700' :
                            section.section_type === 'benefits' ? 'bg-green-100 text-green-700' :
                            section.section_type === 'segments' ? 'bg-blue-100 text-blue-700' :
                            section.section_type === 'use_cases' ? 'bg-orange-100 text-orange-700' :
                            section.section_type === 'cta' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {sectionTypes.find(t => t.value === section.section_type)?.label || section.section_type}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Order: {section.order_index}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-lg">
                          {section.title || 'Untitled Section'}
                        </h5>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {section.content ? 
                            (section.content.length > 200 ? 
                              section.content.substring(0, 200) + '...' : 
                              section.content
                            ) : 
                            'No content'
                          }
                        </p>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(section.created_at).toLocaleDateString()} • 
                          Updated: {new Date(section.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingSection(section.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setManagingItems(section.id)}
                          className="text-green-600 hover:text-green-800 text-sm bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Items
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(section.id, section.is_visible !== 0)}
                          className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                            section.is_visible !== 0 
                              ? 'text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100' 
                              : 'text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100'
                          }`}
                        >
                          {section.is_visible !== 0 ? 'Hide' : 'Unhide'}
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-red-600 hover:text-red-800 text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sections created yet</h3>
                  <p className="text-gray-500 mb-4">Start building your solution page by adding content sections.</p>
                  <button
                    onClick={() => setEditingSection('new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Section
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section Editor */}
          {editingSection && (
            <SectionEditor
              section={editingSection === 'new' ? null : sections.find(s => s.id === editingSection)}
              sectionTypes={sectionTypes}
              onCreate={handleCreateSection}
              onUpdate={handleUpdateSection}
              onCancel={() => setEditingSection(null)}
            />
          )}

          {/* Section Items Manager */}
          {managingItems && (
            <SectionItemsManager
              section={sections.find(s => s.id === managingItems)}
              solutionId={solution.id}
              onCancel={() => setManagingItems(null)}
            />
          )}
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Solution Page Preview</h4>
              <p className="text-sm text-gray-600 mt-1">Preview how your solution page will look</p>
            </div>
            <div className="flex space-x-3">
              <a
                href={cardData.route}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Live Page
              </a>
              <button
                onClick={loadSections}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh Preview
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading preview...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Solution Overview Card */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">Solution Overview</h5>
                <div className={`bg-gradient-to-br ${cardData.color} border ${cardData.border_color} rounded-xl p-4 max-w-md`}>
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      cardData.category === 'Content Management Systems'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {cardData.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{cardData.name}</h3>
                    <p className="text-gray-600 text-sm">{cardData.description}</p>
                  </div>
                  <div className="text-blue-600 font-medium text-sm">
                    View solution →
                  </div>
                </div>
              </div>

              {/* Page Sections Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500">
                <h5 className="text-lg font-semibold text-gray-900 mb-4">Page Content ({sections.length} sections)</h5>
                {sections.length > 0 ? (
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={section.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-2">
                              {index + 1}. {section.title || 'Untitled Section'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              section.section_type === 'hero' ? 'bg-purple-100 text-purple-700' :
                              section.section_type === 'benefits' ? 'bg-green-100 text-green-700' :
                              section.section_type === 'segments' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {sectionTypes.find(t => t.value === section.section_type)?.label || section.section_type}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {section.content ? 
                            (section.content.length > 150 ? 
                              section.content.substring(0, 150) + '...' : 
                              section.content
                            ) : 
                            'No content'
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No sections created yet. Add sections to see them here.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Section Editor Component
const SectionEditor = ({ section, sectionTypes, onCreate, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    section_type: '',
    title: '',
    content: '',
    order_index: 0
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        section_type: section.section_type || '',
        title: section.title || '',
        content: section.content || '',
        order_index: section.order_index || 0
      });
    } else {
      setFormData({
        section_type: '',
        title: '',
        content: '',
        order_index: 0
      });
    }
  }, [section]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (section) {
      onUpdate(section.id, formData);
    } else {
      onCreate(formData);
    }
  };

  const handleEnhanceContent = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a section title first before enhancing the content.');
      return;
    }

    if (!formData.content.trim()) {
      alert('Please enter some basic content first before enhancing.');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedContent = await enhanceDescription(
        formData.title,
        formData.content,
        formData.section_type || 'section'
      );
      setFormData({
        ...formData,
        content: enhancedContent
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      if (error.message.includes('rate limit')) {
        alert('Rate limit reached. Your request has been queued and will be processed automatically. Please wait...');
      } else {
        alert(error.message);
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const selectedSectionType = sectionTypes.find(t => t.value === formData.section_type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h5 className="text-xl font-semibold text-gray-900">
              {section ? 'Edit Section' : 'Add New Section'}
            </h5>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
              <select
                value={formData.section_type}
                onChange={(e) => setFormData({...formData, section_type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select section type...</option>
                {sectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {selectedSectionType && (
                <p className="text-xs text-gray-500 mt-1">{selectedSectionType.description}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter section title..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <button
                type="button"
                onClick={handleEnhanceContent}
                disabled={isEnhancing || !formData.title.trim() || !formData.content.trim()}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEnhancing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Enhance with OpenAI
                  </>
                )}
              </button>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={12}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter section content... (HTML supported)"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                💡 <strong>HTML supported:</strong> Use tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt; for formatting
              </p>
              <div className="text-xs text-gray-400">
                {formData.content.length} characters
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
            >
              {section ? 'Update Section' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Section Items Manager Component
const SectionItemsManager = ({ section, solutionId, onCancel }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (section) {
      loadItems();
    }
  }, [section]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solutionId}/sections/${section.id}/items`;
      
      console.log(`Loading items from: ${apiPath}`);
      const response = await fetch(apiPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const itemsData = await response.json();
      console.log(`Loaded ${itemsData.length} items:`, itemsData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error loading section items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      setSaving(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solutionId}/sections/${section.id}/items`;
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadItems();
      setEditingItem(null);
      alert('Item created successfully!');
    } catch (err) {
      console.error('Error creating item:', err);
      alert('Failed to create item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async (itemId, itemData) => {
    try {
      setSaving(true);
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solutionId}/sections/${section.id}/items/${itemId}`;
      const response = await fetch(apiPath, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadItems();
      setEditingItem(null);
      alert('Item updated successfully!');
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const apiPath = `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solutionId}/sections/${section.id}/items/${itemId}`;
      const response = await fetch(apiPath, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadItems();
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const itemTypes = [
    { value: 'benefit', label: 'Benefit Card' },
    { value: 'feature', label: 'Feature' },
    { value: 'stat', label: 'Statistic' },
    { value: 'use_case', label: 'Use Case' },
    { value: 'technology', label: 'Technology' },
    { value: 'segment', label: 'Segment' },
    { value: 'step', label: 'Step' },
    { value: 'resource', label: 'Resource' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Manage Section Items</h3>
              <p className="text-green-100 mt-1">
                Section: {section?.title || 'Untitled'} ({section?.section_type})
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-green-100 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {/* Add New Item Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Section Items</h4>
              <p className="text-sm text-gray-600 mt-1">Manage detailed content like cards, stats, and features</p>
            </div>
            <button
              onClick={() => setEditingItem('new')}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading items...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                            item.item_type === 'benefit' ? 'bg-green-100 text-green-700' :
                            item.item_type === 'feature' ? 'bg-blue-100 text-blue-700' :
                            item.item_type === 'stat' ? 'bg-purple-100 text-purple-700' :
                            item.item_type === 'use_case' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {itemTypes.find(t => t.value === item.item_type)?.label || item.item_type}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Order: {item.order_index}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-lg">
                          {item.title || 'Untitled Item'}
                        </h5>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {item.description ? 
                            (item.description.length > 200 ? 
                              item.description.substring(0, 200) + '...' : 
                              item.description
                            ) : 
                            'No description'
                          }
                        </p>
                        {item.icon && (
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>Icon:</strong> {item.icon}
                          </div>
                        )}
                        {item.value && (
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>Value:</strong> {item.value}
                          </div>
                        )}
                        {item.label && (
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>Label:</strong> {item.label}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items created yet</h3>
                  <p className="text-gray-500 mb-4">Add detailed content like benefit cards, features, or statistics.</p>
                  <button
                    onClick={() => setEditingItem('new')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add First Item
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Item Editor */}
          {editingItem && (
            <SectionItemEditor
              item={editingItem === 'new' ? null : items.find(i => i.id === editingItem)}
              itemTypes={itemTypes}
              onCreate={handleCreateItem}
              onUpdate={handleUpdateItem}
              onCancel={() => setEditingItem(null)}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Section Item Editor Component
const SectionItemEditor = ({ item, itemTypes, onCreate, onUpdate, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    item_type: '',
    title: '',
    description: '',
    icon: '',
    value: '',
    label: '',
    order_index: 0,
    features: ''
  });
  const [featuresList, setFeaturesList] = useState([]);

  useEffect(() => {
    if (item) {
      setFormData({
        item_type: item.item_type || '',
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '',
        value: item.value || '',
        label: item.label || '',
        order_index: item.order_index || 0,
        features: item.features || ''
      });
      
      // Parse features from JSON
      try {
        if (item.features) {
          const parsedFeatures = JSON.parse(item.features);
          setFeaturesList(Array.isArray(parsedFeatures) ? parsedFeatures : []);
        } else {
          setFeaturesList([]);
        }
      } catch (e) {
        console.error('Error parsing features:', e);
        setFeaturesList([]);
      }
    } else {
      setFormData({
        item_type: '',
        title: '',
        description: '',
        icon: '',
        value: '',
        label: '',
        order_index: 0,
        features: ''
      });
      setFeaturesList([]);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item) {
      onUpdate(item.id, formData);
    } else {
      onCreate(formData);
    }
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...featuresList];
    newFeatures[index] = value;
    setFeaturesList(newFeatures);
    
    // Update the features field in formData
    setFormData(prev => ({
      ...prev,
      features: JSON.stringify(newFeatures)
    }));
  };

  const addFeature = () => {
    const newFeatures = [...featuresList, ''];
    setFeaturesList(newFeatures);
    
    // Update the features field in formData
    setFormData(prev => ({
      ...prev,
      features: JSON.stringify(newFeatures)
    }));
  };

  const removeFeature = (index) => {
    if (featuresList.length > 1) {
      const newFeatures = featuresList.filter((_, i) => i !== index);
      setFeaturesList(newFeatures);
      
      // Update the features field in formData
      setFormData(prev => ({
        ...prev,
        features: JSON.stringify(newFeatures)
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h5 className="text-xl font-semibold text-gray-900">
              {item ? 'Edit Item' : 'Add New Item'}
            </h5>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
              <select
                value={formData.item_type}
                onChange={(e) => setFormData({...formData, item_type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select item type...</option>
                {itemTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter item title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (optional)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., ShieldCheckIcon"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value (optional)</label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 40% or Key Features"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label (optional)</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Featured"
              />
            </div>
          </div>

          {/* Features (Bullet Points with Checkmarks) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (Bullet Points with ✓)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              These appear as checkmark bullets in Technology and other sections
            </p>
            <div className="space-y-2">
              {featuresList.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-green-600 text-sm w-6">✓</span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={featuresList.length <= 1}
                    title="Remove feature"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {featuresList.length === 0 && (
                <p className="text-gray-400 text-sm italic py-2">No features added yet</p>
              )}
              <button
                type="button"
                onClick={addFeature}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Feature
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                item ? 'Update Item' : 'Create Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Solutions Admin Component
const SolutionsAdmin = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSolution, setEditingSolution] = useState(null);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const solutionsData = await getAdminSolutions();
      setSolutions(solutionsData);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSolution = (solution) => {
    setEditingSolution(solution);
  };

  const handleDuplicateSolution = async (solution) => {
    const newName = prompt('Enter new solution name:', `${solution.name} (Copy)`);
    if (!newName) return;

    try {
      await duplicateSolution(solution.id, { name: newName });
      await fetchSolutions();
      alert('Solution duplicated successfully!');
    } catch (error) {
      alert('Error duplicating solution: ' + error.message);
    }
  };

  const handleDeleteSolution = async (solution) => {
    if (window.confirm(`Are you sure you want to delete "${solution.name}"?`)) {
      try {
        await deleteSolution(solution.id);
        await fetchSolutions();
        alert('Solution deleted successfully!');
      } catch (error) {
        alert('Error deleting solution: ' + error.message);
      }
    }
  };

  const handleToggleVisibility = async (solution) => {
    try {
      await toggleSolutionVisibility(solution.id);
      await fetchSolutions();
      alert(`Solution ${solution.is_visible ? 'hidden' : 'shown'} successfully!`);
    } catch (error) {
      alert('Error toggling solution visibility: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading solutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {editingSolution ? (
        <SolutionEditor 
          solution={editingSolution}
          onBack={() => setEditingSolution(null)}
        />
      ) : (
        <SolutionsManagement
          solutions={solutions}
          onEditSolution={handleEditSolution}
          onDuplicateSolution={handleDuplicateSolution}
          onDeleteSolution={handleDeleteSolution}
          onToggleVisibility={handleToggleVisibility}
          onRefresh={fetchSolutions}
        />
      )}
    </div>
  );
};

export default SolutionsAdmin;

