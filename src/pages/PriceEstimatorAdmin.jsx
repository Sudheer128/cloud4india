import React, { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';

export default function PriceEstimatorAdmin() {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/price-estimator/config`)
            .then(r => r.json())
            .then(setConfig)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`${API_BASE_URL}/api/price-estimator/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            alert('Error saving configuration');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-saree-teal border-t-transparent" /></div>;
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Price Estimator Configuration</h1>
                <button onClick={handleSave} disabled={saving}
                    className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-saree-teal text-white hover:bg-saree-teal-dark'
                        }`}>
                    {saved ? <><CheckIcon className="w-5 h-5" />Saved!</> : saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">
                {/* Page Content */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Page Content</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                            <input type="text" value={config.page_title || ''} onChange={(e) => handleChange('page_title', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Page Subtitle</label>
                            <input type="text" value={config.page_subtitle || ''} onChange={(e) => handleChange('page_subtitle', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Page Description</label>
                            <textarea value={config.page_description || ''} onChange={(e) => handleChange('page_description', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" rows={2} />
                        </div>
                    </div>
                </div>

                {/* Section Titles */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Section Titles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Section</label>
                            <input type="text" value={config.marketplace_section_title || ''} onChange={(e) => handleChange('marketplace_section_title', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Description</label>
                            <input type="text" value={config.marketplace_section_description || ''} onChange={(e) => handleChange('marketplace_section_description', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Products Section</label>
                            <input type="text" value={config.products_section_title || ''} onChange={(e) => handleChange('products_section_title', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Products Description</label>
                            <input type="text" value={config.products_section_description || ''} onChange={(e) => handleChange('products_section_description', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Solutions Section</label>
                            <input type="text" value={config.solutions_section_title || ''} onChange={(e) => handleChange('solutions_section_title', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Solutions Description</label>
                            <input type="text" value={config.solutions_section_description || ''} onChange={(e) => handleChange('solutions_section_description', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                    </div>
                </div>

                {/* Workflow Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Workflow Settings</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium text-gray-700">Enable Approval Workflow</label>
                                <p className="text-sm text-gray-500">Require admin approval before quotes can be sent</p>
                            </div>
                            <button onClick={() => handleChange('enable_approval_workflow', config.enable_approval_workflow ? 0 : 1)}
                                className={`w-12 h-6 rounded-full transition-colors ${config.enable_approval_workflow ? 'bg-saree-teal' : 'bg-gray-300'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${config.enable_approval_workflow ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Validity (days)</label>
                                <input type="number" min={1} max={365} value={config.default_validity_days || 30}
                                    onChange={(e) => handleChange('default_validity_days', parseInt(e.target.value))}
                                    className="w-full border rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quote Prefix</label>
                                <input type="text" value={config.quote_prefix || 'C4I-Q'} onChange={(e) => handleChange('quote_prefix', e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                                <input type="number" min={0} max={100} step={0.01} value={config.tax_rate || 18}
                                    onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value))}
                                    className="w-full border rounded-lg px-4 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
                                <input type="text" value={config.tax_name || 'GST'} onChange={(e) => handleChange('tax_name', e.target.value)}
                                    className="w-full border rounded-lg px-4 py-2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Display */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Pricing Display</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['hourly', 'monthly', 'quarterly', 'yearly'].map(duration => (
                            <div key={duration} className="flex items-center gap-2">
                                <input type="checkbox" id={`show_${duration}`} checked={config[`show_${duration}_pricing`] !== 0}
                                    onChange={(e) => handleChange(`show_${duration}_pricing`, e.target.checked ? 1 : 0)}
                                    className="w-4 h-4 text-saree-teal" />
                                <label htmlFor={`show_${duration}`} className="text-sm text-gray-700 capitalize">Show {duration}</label>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Duration</label>
                        <select value={config.default_duration || 'monthly'} onChange={(e) => handleChange('default_duration', e.target.value)}
                            className="w-full max-w-xs border rounded-lg px-4 py-2">
                            <option value="hourly">Hourly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>

                {/* Terms & Assumptions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Terms & Assumptions</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assumptions Text</label>
                            <textarea value={config.assumptions_text || ''} onChange={(e) => handleChange('assumptions_text', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" rows={3} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Terms Text</label>
                            <textarea value={config.terms_text || ''} onChange={(e) => handleChange('terms_text', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" rows={3} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
