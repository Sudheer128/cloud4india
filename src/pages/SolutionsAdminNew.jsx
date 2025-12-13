import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import SolutionBasicInfo from '../components/SolutionEditor/SolutionBasicInfo';
import SectionManager from '../components/SolutionEditor/SectionManager';
import ItemManager from '../components/SolutionEditor/ItemManager';

const SolutionsAdminNew = () => {
  const navigate = useNavigate();
  const { solutionId = 'new' } = useParams();
  
  const [currentTab, setCurrentTab] = useState('basic');
  const [solution, setSolution] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [managingSection, setManagingSection] = useState(null);

  useEffect(() => {
    loadData();
  }, [solutionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all solutions
      const solutionsRes = await fetch(`${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/admin/solutions`);
      if (solutionsRes.ok) {
        const allSolutions = await solutionsRes.json();
        setSolutions(allSolutions);

        // Load specific solution if not new
        if (solutionId !== 'new') {
          const currentSolution = allSolutions.find(s => s.id === parseInt(solutionId));
          if (currentSolution) {
            setSolution(currentSolution);
          } else {
            // If not found, redirect to new
            navigate('/admin/solutions-new/new');
          }
        } else {
          setSolution({ id: 'new' });
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async (formData) => {
    setSaving(true);
    try {
      const url = solutionId === 'new'
        ? `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions`
        : `${import.meta.env.VITE_CMS_URL || 'http://localhost:4002'}/api/solutions/${solutionId}`;

      const method = solutionId === 'new' ? 'POST' : 'PUT';

      // Ensure route has /solutions/ prefix
      const routeWithPrefix = formData.route.startsWith('/solutions/')
        ? formData.route
        : `/solutions/${formData.route}`;

      // Add default values for fields server expects but we don't show in UI
      const payload = {
        ...formData,
        route: routeWithPrefix,
        color: '#10b981', // Default green
        border_color: '#059669', // Default green border
        enable_single_page: 1 // Always enabled for solutions
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedSolution = await response.json();
        
        // If new solution, redirect to edit page
        if (solutionId === 'new') {
          navigate(`/admin/solutions-new/${savedSolution.id}`);
          alert('Solution created! Now add sections to build your page.');
        } else {
          alert('Solution updated successfully!');
          await loadData();
        }
      } else {
        throw new Error('Failed to save solution');
      }
    } catch (err) {
      alert('Error saving solution: ' + err.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If managing section items, show ItemManager
  if (managingSection) {
    return (
      <ItemManager
        solution={solution}
        section={managingSection}
        onBack={() => setManagingSection(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/solutions')}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Solutions</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {solutionId === 'new' ? 'New Solution' : solution?.name || 'Edit Solution'}
                </h1>
                {solution && solutionId !== 'new' && (
                  <p className="text-sm text-gray-600">
                    Category: {solution.category} • ID: {solution.id}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <TabButton
              label="1. Basic Info"
              active={currentTab === 'basic'}
              onClick={() => setCurrentTab('basic')}
              status={solution && solution.name ? 'complete' : 'pending'}
            />
            <TabButton
              label="2. Page Sections"
              active={currentTab === 'sections'}
              onClick={() => setCurrentTab('sections')}
              disabled={solutionId === 'new'}
              status="pending"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'basic' && (
          <SolutionBasicInfo
            solution={solution}
            onSave={handleSaveBasicInfo}
            saving={saving}
          />
        )}

        {currentTab === 'sections' && (
          <SectionManager
            solutionId={solutionId}
            onManageItems={(section) => setManagingSection(section)}
          />
        )}
      </div>

    </div>
  );
};

// Tab Button Component
const TabButton = ({ label, active, onClick, disabled, status }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all flex items-center gap-2 ${
        active
          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
          : disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
      {status === 'complete' && !active && (
        <CheckCircleIcon className="w-4 h-4 text-green-600" />
      )}
      {disabled && (
        <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
};

export default SolutionsAdminNew;

