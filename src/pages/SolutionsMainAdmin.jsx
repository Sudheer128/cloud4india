import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  getMainSolutionsContent, 
  updateMainSolutionsHero, 
  updateMainSolutionsSection 
} from '../services/cmsApi';

const SolutionsMainAdmin = () => {
  const [mainPageData, setMainPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHero, setEditingHero] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: ''
  });
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    is_visible: 1
  });

  // Fetch main solutions content
  const fetchMainSolutionsContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMainSolutionsContent();
      setMainPageData(data);
      
      // Initialize hero form
      if (data.hero) {
        setHeroForm({
          title: data.hero.title || '',
          subtitle: data.hero.subtitle || '',
          description: data.hero.description || ''
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching main solutions content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainSolutionsContent();
  }, []);

  // Handle hero section update
  const handleHeroUpdate = async () => {
    try {
      await updateMainSolutionsHero(heroForm);
      await fetchMainSolutionsContent();
      setEditingHero(false);
      alert('Hero section updated successfully!');
    } catch (err) {
      alert('Error updating hero section: ' + err.message);
    }
  };

  // Handle section update
  const handleSectionUpdate = async () => {
    try {
      await updateMainSolutionsSection(editingSection, sectionForm);
      await fetchMainSolutionsContent();
      setEditingSection(null);
      alert('Section updated successfully!');
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
  };

  // Start editing a section
  const startEditingSection = (section) => {
    setEditingSection(section.id);
    setSectionForm({
      title: section.title || '',
      description: section.description || '',
      is_visible: section.is_visible
    });
  };

  if (loading) {
    return (
      <AdminLayout activeSection="solutions-main" title="Solutions Main Page">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activeSection="solutions-main" title="Solutions Main Page">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Content</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            onClick={fetchMainSolutionsContent}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeSection="solutions-main" title="Solutions Main Page">
      <div className="space-y-8">
        
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            {!editingHero ? (
              <button
                onClick={() => setEditingHero(true)}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <PencilIcon className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleHeroUpdate}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingHero(false)}
                  className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingHero ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{mainPageData?.hero?.title}</h3>
                <p className="text-sm text-gray-600">{mainPageData?.hero?.subtitle}</p>
              </div>
              <p className="text-gray-700">{mainPageData?.hero?.description}</p>
            </div>
          )}
        </div>

        {/* Solution Sections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Solution Sections</h2>
          
          {mainPageData?.sections?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No solution sections found.</p>
          ) : (
            <div className="space-y-4">
              {mainPageData?.sections?.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{section.solution_name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        section.is_visible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {section.is_visible ? (
                          <>
                            <EyeIcon className="w-3 h-3" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </span>
                      <span className="text-xs text-gray-500">Order: {section.order_index}</span>
                    </div>
                    
                    {editingSection !== section.id ? (
                      <button
                        onClick={() => startEditingSection(section)}
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                      >
                        <PencilIcon className="w-3 h-3" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSectionUpdate}
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          <CheckIcon className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          className="inline-flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          <XMarkIcon className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {editingSection === section.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={sectionForm.title}
                          onChange={(e) => setSectionForm({...sectionForm, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={sectionForm.description}
                          onChange={(e) => setSectionForm({...sectionForm, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sectionForm.is_visible === 1}
                            onChange={(e) => setSectionForm({...sectionForm, is_visible: e.target.checked ? 1 : 0})}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Visible on main page</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{section.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                      <div className="text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{section.category}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-purple-800 font-medium mb-2">ℹ️ Information</h3>
          <ul className="text-purple-700 text-sm space-y-1">
            <li>• Solution sections are automatically created when you duplicate solutions</li>
            <li>• All sections are visible by default - use the visibility toggle to hide them</li>
            <li>• The order is determined by the solution's order index</li>
            <li>• Changes are reflected immediately on the main solutions page</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SolutionsMainAdmin;
