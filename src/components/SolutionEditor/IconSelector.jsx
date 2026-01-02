import { CMS_URL } from '../../utils/config';
import React, { useState } from 'react';
import { 
  CpuChipIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  GlobeAltIcon,
  UsersIcon,
  ServerIcon,
  CircleStackIcon,
  CheckIcon,
  StarIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AVAILABLE_ICONS = [
  { name: 'CpuChipIcon', label: 'CPU/Processor', icon: CpuChipIcon },
  { name: 'ShieldCheckIcon', label: 'Security/Shield', icon: ShieldCheckIcon },
  { name: 'ClockIcon', label: 'Time/24-7', icon: ClockIcon },
  { name: 'CurrencyDollarIcon', label: 'Money/Pricing', icon: CurrencyDollarIcon },
  { name: 'ChartBarIcon', label: 'Analytics/Chart', icon: ChartBarIcon },
  { name: 'GlobeAltIcon', label: 'Global/Network', icon: GlobeAltIcon },
  { name: 'UsersIcon', label: 'Users/Team', icon: UsersIcon },
  { name: 'ServerIcon', label: 'Server/Database', icon: ServerIcon },
  { name: 'CircleStackIcon', label: 'Storage/Data', icon: CircleStackIcon },
  { name: 'CheckIcon', label: 'Check/Verified', icon: CheckIcon },
  { name: 'StarIcon', label: 'Star/Featured', icon: StarIcon },
  { name: 'EyeIcon', label: 'View/Visible', icon: EyeIcon },
  { name: 'DocumentTextIcon', label: 'Document/File', icon: DocumentTextIcon }
];

const IconSelector = ({ value, onChange, optional = false, category = 'general', entityName = '' }) => {
  const [activeTab, setActiveTab] = useState('library');
  const [uploading, setUploading] = useState(false);

  const handleIconUpload = async (file) => {
    // Validate file
    if (file.size > 50 * 1024) {
      alert('Icon file too large. Maximum 50KB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const baseUrl = CMS_URL;
      const params = new URLSearchParams();
      params.append('category', category);
      if (entityName) params.append('entityName', entityName);
      
      const response = await fetch(`${baseUrl}/api/upload/image?${params.toString()}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        onChange(data.filePath);
        alert('Icon uploaded successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      alert('Error uploading icon: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Icon {optional && '(Optional)'}
      </label>
      
      {/* Tabs */}
      <div className="mb-3">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📚 Icon Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📤 Upload Custom
          </button>
        </div>
      </div>

      {/* Library Tab */}
      {activeTab === 'library' && (
        <>
          {/* Preview */}
          {value && AVAILABLE_ICONS.find(i => i.name === value) && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              {(() => {
                const IconComponent = AVAILABLE_ICONS.find(i => i.name === value)?.icon;
                return IconComponent ? (
                  <>
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Selected Icon</p>
                      <p className="text-xs text-gray-600">{AVAILABLE_ICONS.find(i => i.name === value)?.label}</p>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
          
          {/* Icon Grid */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
            {optional && (
              <button
                type="button"
                onClick={() => onChange('')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  !value ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-300'
                }`}
                title="No icon"
              >
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-gray-400 text-2xl">—</div>
                <p className={`text-xs mt-2 text-center ${!value ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                  None
                </p>
              </button>
            )}
            {AVAILABLE_ICONS.map(iconObj => {
              const IconComponent = iconObj.icon;
              const isSelected = value === iconObj.name;
              return (
                <button
                  key={iconObj.name}
                  type="button"
                  onClick={() => onChange(iconObj.name)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-300'
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
          <p className="mt-2 text-xs text-gray-500">Click an icon to select • 13 icons available</p>
        </>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">📋 Icon Requirements:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Format: <strong>SVG</strong> (best) or PNG with transparent background</li>
              <li>• Size: <strong>24x24px to 64x64px</strong></li>
              <li>• Style: <strong>Outline/stroke</strong> (matches library)</li>
              <li>• Color: <strong>Monochrome</strong> (single color)</li>
              <li>• File size: <strong>Under 50KB</strong></li>
            </ul>
            <p className="text-xs text-blue-700 mt-2">
              💡 Get free icons: <a href="https://heroicons.com" target="_blank" rel="noopener noreferrer" className="underline">heroicons.com</a>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Icon File</label>
            <input
              type="file"
              accept="image/svg+xml,image/png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleIconUpload(file);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              SVG or PNG • Max 50KB
            </p>
          </div>
          
          {uploading && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-800">Uploading icon...</p>
              </div>
            </div>
          )}
          
          {/* Custom Icon Preview */}
          {value && value.startsWith('/uploads') && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg border border-gray-300 flex items-center justify-center">
                  <img 
                    src={`${CMS_URL}${value}`} 
                    alt="Custom icon" 
                    className="w-8 h-8" 
                  />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">✓ Icon uploaded</p>
                  <p className="text-xs text-gray-500">{value}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IconSelector;
export { AVAILABLE_ICONS };

