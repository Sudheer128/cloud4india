import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { CMS_URL } from '../utils/config';

const API_BASE_URL = CMS_URL;

export default function PdfEstimateConfigAdmin() {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingQr, setUploadingQr] = useState(false);
    const logoInputRef = useRef(null);
    const qrInputRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/pdf-estimate-config`)
            .then(r => r.json())
            .then(data => {
                if (!Array.isArray(data.terms_conditions)) {
                    data.terms_conditions = [];
                }
                setConfig(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`${API_BASE_URL}/api/pdf-estimate-config`, {
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

    // Terms & Conditions helpers
    const terms = config.terms_conditions || [];

    const updateTerm = (index, value) => {
        const updated = [...terms];
        updated[index] = value;
        handleChange('terms_conditions', updated);
    };

    const addTerm = () => {
        handleChange('terms_conditions', [...terms, '']);
    };

    const removeTerm = (index) => {
        handleChange('terms_conditions', terms.filter((_, i) => i !== index));
    };

    const moveTerm = (index, direction) => {
        const updated = [...terms];
        const target = index + direction;
        if (target < 0 || target >= updated.length) return;
        [updated[index], updated[target]] = [updated[target], updated[index]];
        handleChange('terms_conditions', updated);
    };

    const handleImageUpload = async (file, field, setUploading) => {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_BASE_URL}/api/upload/image?category=pdf-config`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.filePath) {
                handleChange(field, data.filePath);
            }
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const ImageUpload = ({ field, label, description, uploading, setUploading, inputRef }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
            <input type="file" accept="image/*" ref={inputRef} className="hidden"
                onChange={e => handleImageUpload(e.target.files[0], field, setUploading)} />
            {config[field] ? (
                <div className="flex items-start gap-4">
                    <div className="relative border rounded-lg overflow-hidden bg-gray-50 p-2">
                        <img src={`${API_BASE_URL}${config[field]}`} alt={label}
                            className="max-h-32 max-w-48 object-contain" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => inputRef.current?.click()} disabled={uploading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition">
                            <ArrowUpTrayIcon className="w-4 h-4" />
                            {uploading ? 'Uploading...' : 'Replace'}
                        </button>
                        <button onClick={() => handleChange(field, '')}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                            <TrashIcon className="w-4 h-4" /> Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => inputRef.current?.click()} disabled={uploading}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-2 text-gray-400 hover:border-saree-teal hover:text-saree-teal transition cursor-pointer">
                    <PhotoIcon className="w-8 h-8" />
                    <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                </button>
            )}
        </div>
    );

    const ToggleSwitch = ({ field, label, description }) => (
        <div className="flex items-center justify-between py-3">
            <div>
                <label className="font-medium text-gray-700">{label}</label>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            <button
                onClick={() => handleChange(field, config[field] ? 0 : 1)}
                className={`w-12 h-6 rounded-full transition-colors ${config[field] ? 'bg-saree-teal' : 'bg-gray-300'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${config[field] ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-saree-teal border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">PDF Export Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Customize the generated estimate PDF — header, logo, colors, QR code, terms, and section visibility.</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-saree-teal text-white hover:bg-saree-teal-dark'}`}>
                    {saved ? <><CheckIcon className="w-5 h-5" />Saved!</> : saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">
                {/* 1. Header Configuration */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Header Configuration</h3>
                    <div className="space-y-4">
                        <ImageUpload field="company_logo" label="Company Logo"
                            description="Displayed in the top-left of the PDF header (recommended: max 200px wide)"
                            uploading={uploadingLogo} setUploading={setUploadingLogo} inputRef={logoInputRef} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Header Title</label>
                            <input type="text" value={config.header_title || ''} onChange={e => handleChange('header_title', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" placeholder="Commercial Proposal for Cloud 4 India" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Header Subtitle</label>
                            <input type="text" value={config.header_subtitle || ''} onChange={e => handleChange('header_subtitle', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" placeholder="Cloud Services BOM" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Header Background Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={config.header_bg_color || '#FFF2CC'}
                                        onChange={e => handleChange('header_bg_color', e.target.value)}
                                        className="w-10 h-10 rounded border cursor-pointer" />
                                    <input type="text" value={config.header_bg_color || '#FFF2CC'}
                                        onChange={e => handleChange('header_bg_color', e.target.value)}
                                        className="flex-1 border rounded-lg px-4 py-2 font-mono text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Table Header Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={config.table_header_color || '#FFFF00'}
                                        onChange={e => handleChange('table_header_color', e.target.value)}
                                        className="w-10 h-10 rounded border cursor-pointer" />
                                    <input type="text" value={config.table_header_color || '#FFFF00'}
                                        onChange={e => handleChange('table_header_color', e.target.value)}
                                        className="flex-1 border rounded-lg px-4 py-2 font-mono text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Estimate Identity */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Estimate Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimate ID Prefix</label>
                            <input type="text" value={config.estimate_id_prefix || ''} onChange={e => handleChange('estimate_id_prefix', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" placeholder="EST" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input type="text" value={config.company_name || ''} onChange={e => handleChange('company_name', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" placeholder="C4I Solutions LLP" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PDF Filename Prefix</label>
                            <input type="text" value={config.pdf_filename_prefix || ''} onChange={e => handleChange('pdf_filename_prefix', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" placeholder="Cloud4India_Estimate" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                        <textarea value={config.company_address || ''} onChange={e => handleChange('company_address', e.target.value)}
                            rows={2} className="w-full border rounded-lg px-4 py-2 text-sm resize-none" placeholder="Company address for the PDF header/footer" />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prepared For Label</label>
                        <input type="text" value={config.prepared_for_label || ''} onChange={e => handleChange('prepared_for_label', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2" placeholder="Prepared For: Acme Corp" />
                        <p className="text-xs text-gray-500 mt-1">Shown below the header. Enter the client/recipient name directly.</p>
                    </div>
                </div>

                {/* Tax Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Tax Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
                            <input type="text" value={config.tax_name || 'GST'} onChange={e => handleChange('tax_name', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" placeholder="GST" />
                            <p className="text-xs text-gray-500 mt-1">Label used in the PDF (e.g., GST, VAT, Tax)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                            <input type="number" min={0} max={100} step={0.01} value={config.tax_rate ?? 18}
                                onChange={e => handleChange('tax_rate', parseFloat(e.target.value))}
                                className="w-full border rounded-lg px-4 py-2" />
                            <p className="text-xs text-gray-500 mt-1">Tax percentage applied in the PDF summary</p>
                        </div>
                    </div>
                </div>

                {/* 3. Terms & Conditions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">Terms & Conditions</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Placeholders: <code className="bg-gray-100 px-1 rounded">{'{currency}'}</code> <code className="bg-gray-100 px-1 rounded">{'{symbol}'}</code> <code className="bg-gray-100 px-1 rounded">{'{company_name}'}</code>
                            </p>
                        </div>
                        <button onClick={addTerm}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-saree-teal border border-saree-teal rounded-lg hover:bg-saree-teal hover:text-white transition">
                            <PlusIcon className="w-4 h-4" /> Add Term
                        </button>
                    </div>
                    <div className="space-y-3">
                        {terms.map((term, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="mt-2.5 text-sm font-medium text-gray-400 w-6 text-right">{i + 1}.</span>
                                <textarea
                                    value={term}
                                    onChange={e => updateTerm(i, e.target.value)}
                                    rows={2}
                                    className="flex-1 border rounded-lg px-4 py-2 text-sm resize-none"
                                />
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => moveTerm(i, -1)} disabled={i === 0}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Move up">
                                        <ChevronUpIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => moveTerm(i, 1)} disabled={i === terms.length - 1}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" title="Move down">
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => removeTerm(i)}
                                        className="p-1 text-red-400 hover:text-red-600" title="Remove">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {terms.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-4">No terms added. Click "Add Term" to start.</p>
                        )}
                    </div>
                </div>

                {/* 4. Payment Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms Text</label>
                            <input type="text" value={config.payment_terms_text || ''} onChange={e => handleChange('payment_terms_text', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment QR Text</label>
                            <input type="text" value={config.payment_qr_text || ''} onChange={e => handleChange('payment_qr_text', e.target.value)}
                                className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <ImageUpload field="payment_qr_image" label="Payment QR Code Image"
                            description="UPI QR code image displayed at the bottom of the PDF after payment terms"
                            uploading={uploadingQr} setUploading={setUploadingQr} inputRef={qrInputRef} />
                    </div>
                </div>

                {/* 5. Bank Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Bank Details</h3>
                    <div className="space-y-4">
                        <ToggleSwitch field="show_bank_details" label="Show Bank Details" description="Display bank details section in the PDF between T&C and Payment" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Details Text</label>
                            <textarea value={config.bank_details_text || ''} onChange={e => handleChange('bank_details_text', e.target.value)}
                                rows={4} className="w-full border rounded-lg px-4 py-2 text-sm resize-none"
                                placeholder="Bank Name: ...\nAccount No: ...\nIFSC: ...\nBranch: ..." />
                        </div>
                    </div>
                </div>

                {/* 6. Footer */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Footer</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                        <input type="text" value={config.footer_text || ''} onChange={e => handleChange('footer_text', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2" placeholder="Text rendered at the bottom of the PDF" />
                    </div>
                </div>

                {/* 7. Visibility Controls */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Visibility Controls</h3>
                    <p className="text-sm text-gray-500 mb-4">Toggle which sections appear in the generated PDF.</p>
                    <div className="divide-y divide-gray-100">
                        <ToggleSwitch field="show_gst_row" label="GST Row" description="Show the GST calculation row in the summary" />
                        <ToggleSwitch field="show_total_incl_gst" label="Total Incl. GST" description="Show the total including GST row" />
                        <ToggleSwitch field="show_12_months_row" label="12 Months Charges" description="Show the annual (12-month) charges row" />
                        <ToggleSwitch field="show_tc_section" label="Terms & Conditions" description="Show the T&C section at the bottom" />
                        <ToggleSwitch field="show_date_line" label="Date Line" description="Show the date on the estimate" />
                        <ToggleSwitch field="show_estimate_id" label="Estimate ID" description="Show the estimate ID reference" />
                        <ToggleSwitch field="show_payment_terms" label="Payment Terms" description="Show the payment terms text" />
                        <ToggleSwitch field="show_payment_qr_text" label="Payment QR Text" description="Show the payment QR code text" />
                    </div>
                </div>
            </div>
        </div>
    );
}
