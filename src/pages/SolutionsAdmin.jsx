import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminSolutions,
  toggleSolutionVisibility,
  duplicateSolution,
  deleteSolution,
  updateSolution
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
  FunnelIcon,
  SparklesIcon
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
// Helper functions for category management are now handled via API in the component

// Solutions Management Component
const SolutionsManagement = ({ solutions, onDuplicateSolution, onDeleteSolution, onToggleVisibility, onRefresh }) => {
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
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/categories`);
      if (response.ok) {
        const cats = await response.json();
        setAvailableCategories(cats.map(c => c.name));
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Extract unique categories from solutions
  const categoriesFromSolutions = Array.from(new Set(solutions.map(p => p.category).filter(Boolean)));

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
    const solutionsInCategory = solutions.filter(p => p.category === categoryName);
    return {
      count: solutionsInCategory.length,
      names: solutionsInCategory.map(p => p.name)
    };
  };

  const handleAddCategory = async (categoryName) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/categories`, {
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
      const response = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/categories`);
      const cats = await response.json();
      const catToDelete = cats.find(c => c.name === categoryName);
      
      if (catToDelete) {
        const deleteResponse = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/categories/${catToDelete.id}`, {
          method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
          await loadCategoriesFromDB();
    setShowDeleteCategoryModal(false);
    setCategoryToDelete(null);
    alert(`Category "${categoryName}" has been removed.`);
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
      // Update available categories list
      const updated = availableCategories.map(cat => cat === oldCategoryName ? newCategoryName : cat);
      if (!updated.includes(newCategoryName) && availableCategories.includes(oldCategoryName)) {
        updated.push(newCategoryName);
      }
      setAvailableCategories(updated.filter(cat => cat !== oldCategoryName || cat === newCategoryName));
      saveAvailableCategories(updated.filter(cat => cat !== oldCategoryName || cat === newCategoryName));

      // Get all solutions with the old category
      const solutionsToUpdate = solutions.filter(p => p.category === oldCategoryName);

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
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Solutions</h3>
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
                <div className="text-xs text-gray-500 mt-2 md:mt-0">{solution.route || `/solutions/${solution.id}`}</div>
                <div className="flex items-center justify-start md:justify-end gap-2 mt-3 md:mt-0">
                  <button
                    onClick={() => navigate(`/admin/solutions-new/${solution.id}`)}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    title="Edit Solution - New Interface"
                    aria-label="Edit Solution - New Interface"
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
              Click the <strong>Edit</strong> button (blue pen icon) to manage the complete content of each solution page including sections, items, and all page content.
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


// Main Solutions Admin Component
const SolutionsAdmin = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <SolutionsManagement
          solutions={solutions}
          onDuplicateSolution={handleDuplicateSolution}
          onDeleteSolution={handleDeleteSolution}
          onToggleVisibility={handleToggleVisibility}
          onRefresh={fetchSolutions}
        />
    </div>
  );
};

export default SolutionsAdmin;

