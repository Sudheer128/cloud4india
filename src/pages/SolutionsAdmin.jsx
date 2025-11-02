import React, { useState, useEffect } from 'react';
import { 
  getAdminSolutions,
  toggleSolutionVisibility,
  duplicateSolution,
  deleteSolution,
  updateSolution
} from '../services/cmsApi';
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
  ArrowLeftIcon
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

// Solutions Management Component
const SolutionsManagement = ({ solutions, onEditSolution, onDuplicateSolution, onDeleteSolution, onToggleVisibility }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Manage Apps</h3>
        <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
          <PlusIcon className="w-5 h-5" />
          <span>Add New App</span>
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_2fr_1.5fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-200">
          <div>Solution</div>
          <div>Description</div>
          <div>Route</div>
          <div className="text-right">Actions</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {solutions.map((solution) => (
            <li key={solution.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="md:grid md:grid-cols-[1.5fr_2fr_1.5fr_auto] md:gap-4 items-start">
                <div className="flex items-start gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    solution.category === 'Industry'
                      ? 'bg-sky-100 text-sky-700'
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
          ))}
        </ul>
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
    </div>
  );
};

// Solution Editor Component - simplified version that redirects to solution editor
const SolutionEditor = ({ solution, onBack }) => {
  // For now, just show a message that full editor is available in AdminPanel
  // In future, we can add the full editor here similar to ProductEditor
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Solutions
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold mb-4">Solution Editor</h4>
        <p className="text-gray-600">
          Full solution editing is available in the main Admin Panel. This is a simplified view.
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Solution: <strong>{solution.name}</strong></p>
          <p className="text-sm text-gray-500">Route: <strong>{solution.route}</strong></p>
        </div>
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
        />
      )}
    </div>
  );
};

export default SolutionsAdmin;

