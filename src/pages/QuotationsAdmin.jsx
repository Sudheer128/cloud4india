import React, { useState, useEffect } from 'react';
import {
    EyeIcon, DocumentArrowDownIcon, LinkIcon, TrashIcon, CheckIcon, XMarkIcon,
    ClipboardDocumentIcon, ArrowUpTrayIcon, PaperAirplaneIcon, TableCellsIcon,
    ArrowPathIcon, PencilIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { CMS_URL } from '../utils/config';

const API_BASE_URL = CMS_URL;

const STATUS_COLORS = {
    draft: 'bg-gray-100 text-gray-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    sent: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-gray-200 text-gray-500'
};

const STATUS_LABELS = {
    draft: 'Draft', pending_approval: 'Pending Approval', approved: 'Approved',
    sent: 'Sent', rejected: 'Rejected', expired: 'Expired'
};

export default function QuotationsAdmin() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedQuote, setSelectedQuote] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { fetchQuotations(); }, [filter]);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const url = filter ? `${API_BASE_URL}/api/quotations?status=${filter}` : `${API_BASE_URL}/api/quotations`;
            const response = await fetch(url);
            const data = await response.json();
            setQuotations(data.quotations || []);
        } catch (error) {
            console.error('Error fetching quotations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`${API_BASE_URL}/api/quotations/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, user_name: 'Admin' })
            });
            fetchQuotations();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteQuote = async (id) => {
        if (!confirm('Are you sure you want to delete this quotation?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/quotations/${id}`, { method: 'DELETE' });
            fetchQuotations();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const toggleShare = async (id, enabled) => {
        try {
            await fetch(`${API_BASE_URL}/api/quotations/${id}/share`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled })
            });
            fetchQuotations();
        } catch (error) {
            console.error('Error toggling share:', error);
        }
    };

    const cloneQuote = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/quotations/${id}/clone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ created_by: 'Admin' })
            });
            const data = await response.json();
            alert(`Quote cloned: ${data.quote_number}`);
            fetchQuotations();
        } catch (error) {
            console.error('Error cloning:', error);
        }
    };

    const exportPDF = async (id, quoteNumber) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/quotations/${id}/export/pdf`);
            if (!response.ok) {
                throw new Error('Export failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${quoteNumber || 'quotation'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Failed to export PDF. Please try again.');
        }
    };

    const exportExcel = async (id, quoteNumber) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/quotations/${id}/export/excel`);
            if (!response.ok) {
                throw new Error('Export failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${quoteNumber || 'quotation'}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Excel export error:', error);
            alert('Failed to export Excel. Please try again.');
        }
    };

    const editQuote = (quote) => {
        // Navigate to cart with quote data for editing
        localStorage.setItem('editQuote', JSON.stringify(quote));
        navigate('/cart?edit=' + quote.id);
    };

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(price || 0);

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN') : '-';

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-saree-teal border-t-transparent" /></div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
                <div className="flex items-center gap-3">
                    <button onClick={fetchQuotations} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh">
                        <ArrowPathIcon className="w-5 h-5" />
                    </button>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2">
                        <option value="">All Status</option>
                        {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>
            </div>

            {/* Status Flow Legend */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm flex items-center gap-2 flex-wrap">
                <span className="text-gray-600 font-medium">Workflow:</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Draft</span>
                <span>→</span>
                <span className="px-2 py-1 bg-yellow-100 rounded">Pending Approval</span>
                <span>→</span>
                <span className="px-2 py-1 bg-green-100 rounded">Approved</span>
                <span>→</span>
                <span className="px-2 py-1 bg-blue-100 rounded">Sent</span>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {quotations.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No quotations found</td></tr>
                        ) : (
                            quotations.map(q => (
                                <tr key={q.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className="font-medium">{q.quote_number}</span>
                                        {q.version > 1 && <span className="ml-1 text-xs text-gray-500">v{q.version}</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium">{q.customer_name || '-'}</div>
                                        <div className="text-xs text-gray-500">{q.customer_company}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[q.status]}`}>
                                            {STATUS_LABELS[q.status] || q.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{formatPrice(q.grand_total)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(q.valid_until)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {/* View */}
                                            <button onClick={() => setSelectedQuote(q)} title="View Details" className="p-1.5 hover:bg-gray-100 rounded">
                                                <EyeIcon className="w-4 h-4" />
                                            </button>

                                            {/* Status Actions based on current status */}
                                            {q.status === 'draft' && (
                                                <>
                                                    <button onClick={() => editQuote(q)} title="Edit Quote" className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => updateStatus(q.id, 'pending_approval')} title="Submit for Approval"
                                                        className="p-1.5 hover:bg-yellow-100 rounded text-yellow-600 font-medium">
                                                        <ArrowUpTrayIcon className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {q.status === 'pending_approval' && (
                                                <>
                                                    <button onClick={() => updateStatus(q.id, 'approved')} title="Approve" className="p-1.5 hover:bg-green-100 rounded text-green-600">
                                                        <CheckIcon className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => updateStatus(q.id, 'rejected')} title="Reject / Request Changes" className="p-1.5 hover:bg-red-100 rounded text-red-600">
                                                        <XMarkIcon className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {q.status === 'approved' && (
                                                <button onClick={() => updateStatus(q.id, 'sent')} title="Mark as Sent" className="p-1.5 hover:bg-blue-100 rounded text-blue-600">
                                                    <PaperAirplaneIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            {q.status === 'rejected' && (
                                                <button onClick={() => editQuote(q)} title="Edit & Resubmit" className="p-1.5 hover:bg-yellow-100 rounded text-yellow-600">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Export Actions - Always visible */}
                                            <button onClick={() => exportPDF(q.id, q.quote_number)} title="Export PDF" className="p-1.5 hover:bg-gray-100 rounded text-red-500">
                                                <DocumentArrowDownIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => exportExcel(q.id, q.quote_number)} title="Export Excel" className="p-1.5 hover:bg-gray-100 rounded text-green-600">
                                                <TableCellsIcon className="w-4 h-4" />
                                            </button>

                                            {/* Clone */}
                                            <button onClick={() => cloneQuote(q.id)} title="Clone (New Version)" className="p-1.5 hover:bg-gray-100 rounded">
                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                            </button>

                                            {/* Share Link */}
                                            <button onClick={() => toggleShare(q.id, !q.share_enabled)} title={q.share_enabled ? 'Disable Share Link' : 'Enable Share Link'}
                                                className={`p-1.5 rounded ${q.share_enabled ? 'bg-saree-teal-light text-saree-teal' : 'hover:bg-gray-100'}`}>
                                                <LinkIcon className="w-4 h-4" />
                                            </button>

                                            {/* Delete */}
                                            <button onClick={() => deleteQuote(q.id)} title="Delete" className="p-1.5 hover:bg-red-100 rounded text-red-500">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {selectedQuote && (
                <QuoteViewModal
                    quote={selectedQuote}
                    onClose={() => setSelectedQuote(null)}
                    formatPrice={formatPrice}
                    onExportPDF={() => exportPDF(selectedQuote.id, selectedQuote.quote_number)}
                    onExportExcel={() => exportExcel(selectedQuote.id, selectedQuote.quote_number)}
                />
            )}
        </div>
    );
}

function QuoteViewModal({ quote, onClose, formatPrice, onExportPDF, onExportExcel }) {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/quotations/${quote.id}`)
            .then(r => r.json())
            .then(setDetails)
            .catch(console.error);
    }, [quote.id]);

    const copyShareLink = () => {
        const link = `${window.location.origin}/quote/${quote.share_token}`;
        navigator.clipboard.writeText(link);
        alert('Share link copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{quote.quote_number} {quote.version > 1 && <span className="text-sm text-gray-500">v{quote.version}</span>}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div><span className="text-sm text-gray-500">Customer:</span> <span className="font-medium">{quote.customer_name}</span></div>
                    <div><span className="text-sm text-gray-500">Company:</span> <span className="font-medium">{quote.customer_company || '-'}</span></div>
                    <div><span className="text-sm text-gray-500">Email:</span> <span className="font-medium">{quote.customer_email}</span></div>
                    <div><span className="text-sm text-gray-500">Phone:</span> <span className="font-medium">{quote.customer_phone || '-'}</span></div>
                    <div><span className="text-sm text-gray-500">GST:</span> <span className="font-medium">{quote.customer_gst || '-'}</span></div>
                    <div><span className="text-sm text-gray-500">Address:</span> <span className="font-medium">{quote.customer_address || '-'}</span></div>
                    <div><span className="text-sm text-gray-500">Status:</span> <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[quote.status]}`}>{STATUS_LABELS[quote.status]}</span></div>
                    <div><span className="text-sm text-gray-500">Total:</span> <span className="font-bold text-saree-teal">{formatPrice(quote.grand_total)}</span></div>
                    <div><span className="text-sm text-gray-500">Valid Until:</span> <span className="font-medium">{quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('en-IN') : '-'}</span></div>
                    <div><span className="text-sm text-gray-500">Created:</span> <span className="font-medium">{quote.created_at ? new Date(quote.created_at).toLocaleDateString('en-IN') : '-'}</span></div>
                </div>

                {quote.internal_notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm">
                        <span className="text-gray-600 font-medium">Internal Notes:</span>
                        <p className="mt-1 text-gray-700">{quote.internal_notes}</p>
                    </div>
                )}

                {details?.items && (
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Item</th>
                                    <th className="px-3 py-2 text-left">Duration</th>
                                    <th className="px-3 py-2 text-right">Qty</th>
                                    <th className="px-3 py-2 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {details.items.map((item, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-2">{item.item_name} - {item.plan_name}</td>
                                        <td className="px-3 py-2 capitalize">{item.duration}</td>
                                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                                        <td className="px-3 py-2 text-right">{formatPrice(item.total_price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {quote.share_enabled && quote.share_token && (
                    <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4 flex items-center justify-between">
                        <div>
                            <span className="text-gray-500">Share Link:</span>
                            <a href={`/quote/${quote.share_token}`} target="_blank" className="ml-2 text-saree-teal hover:underline">
                                {window.location.origin}/quote/{quote.share_token}
                            </a>
                        </div>
                        <button onClick={copyShareLink} className="px-3 py-1 bg-saree-teal text-white rounded text-xs hover:bg-saree-teal-dark">
                            Copy
                        </button>
                    </div>
                )}

                {/* Export Buttons */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                    <button onClick={onExportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        Export PDF
                    </button>
                    <button onClick={onExportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        <TableCellsIcon className="w-4 h-4" />
                        Export Excel
                    </button>
                </div>
            </div>
        </div>
    );
}
