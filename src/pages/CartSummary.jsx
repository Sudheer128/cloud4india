import React, { useState } from 'react';
import { TrashIcon, MinusIcon, PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CMS_URL } from '../utils/config';

const API_BASE_URL = CMS_URL;

const DURATIONS = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
];

const CATEGORY_LABELS = {
    marketplace: 'Marketplace Applications',
    product: 'Cloud Products',
    solution: 'Enterprise Solutions'
};

export default function CartSummary() {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, updateDuration, clearCart, subtotal, parsePrice } = useCart();
    const [showQuoteModal, setShowQuoteModal] = useState(false);

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2
    }).format(price);

    const itemsByCategory = items.reduce((acc, item) => {
        const cat = item.item_type;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    const taxRate = 18;
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    const handleDurationChange = async (item, newDuration) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/price-estimator/item-price?item_id=${item.item_id}&item_type=${item.item_type}&duration=${newDuration}`);
            const data = await response.json();
            updateDuration(item.id, newDuration, data.price || item.unit_price);
        } catch (error) {
            console.error('Error fetching new price:', error);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-saree-teal-light/10 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <DocumentTextIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Start adding items from the Price Estimator</p>
                    <button onClick={() => navigate('/price-estimator')}
                        className="bg-saree-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-saree-teal-dark transition-all">
                        Go to Price Estimator
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-saree-teal-light/10 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-saree-teal-dark via-saree-teal to-phulkari-turquoise text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl font-bold">Cart Summary</h1>
                    <p className="mt-1 opacity-90">Review your selections before creating a quotation</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                            <div key={category} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-saree-teal-light/30 to-white px-6 py-4 border-b">
                                    <h3 className="font-semibold text-gray-900">{CATEGORY_LABELS[category] || category}</h3>
                                    <p className="text-sm text-gray-500">{categoryItems.length} items</p>
                                </div>
                                <div className="divide-y">
                                    {categoryItems.map(item => (
                                        <div key={item.id} className="p-4 flex flex-wrap items-center gap-4">
                                            <div className="flex-1 min-w-[200px]">
                                                <h4 className="font-medium text-gray-900">{item.item_name}</h4>
                                                <p className="text-sm text-gray-500">{item.plan_name}</p>
                                            </div>
                                            <select value={item.duration} onChange={(e) => handleDurationChange(item, e.target.value)}
                                                className="border rounded-lg px-3 py-2 text-sm">
                                                {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                            </select>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 rounded border hover:bg-gray-100"><MinusIcon className="w-4 h-4" /></button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 rounded border hover:bg-gray-100"><PlusIcon className="w-4 h-4" /></button>
                                            </div>
                                            <div className="w-24 text-right font-semibold text-saree-teal">
                                                {formatPrice(parsePrice(item.unit_price) * item.quantity)}
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Clear all items
                        </button>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST ({taxRate}%)</span>
                                    <span>{formatPrice(taxAmount)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Grand Total</span>
                                    <span className="text-saree-teal">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            <button onClick={() => setShowQuoteModal(true)}
                                className="w-full bg-saree-teal text-white py-3 rounded-xl font-semibold hover:bg-saree-teal-dark transition-all mb-3">
                                Save as Quotation
                            </button>
                            <button onClick={() => navigate('/price-estimator')}
                                className="w-full border border-saree-teal text-saree-teal py-3 rounded-xl font-semibold hover:bg-saree-teal-light/20 transition-all">
                                Continue Adding
                            </button>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
                                <strong>Note:</strong> All prices are indicative. Final pricing may vary based on usage and specific requirements. GST will be applied as per applicable rates.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote Modal */}
            {showQuoteModal && <SaveQuoteModal onClose={() => setShowQuoteModal(false)} items={items} subtotal={subtotal} taxAmount={taxAmount} grandTotal={grandTotal} />}
        </div>
    );
}

function SaveQuoteModal({ onClose, items, subtotal, taxAmount, grandTotal }) {
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        customer_name: '', customer_company: '', customer_email: '', customer_phone: '',
        customer_address: '', customer_gst: '', validity_days: 30, internal_notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/quotations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, items })
            });
            const data = await response.json();
            if (data.id) {
                // Auto-download PDF
                try {
                    const pdfResponse = await fetch(`${API_BASE_URL}/api/quotations/${data.id}/export/pdf`);
                    if (pdfResponse.ok) {
                        const blob = await pdfResponse.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${data.quote_number}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                    }
                } catch (pdfError) {
                    console.error('PDF download error:', pdfError);
                }

                clearCart();
                alert(`Quotation ${data.quote_number} created and downloaded successfully!`);
                onClose();
                navigate('/rohit/quotations');
            }
        } catch (error) {
            alert('Error creating quotation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <h3 className="text-xl font-bold mb-4">Save as Quotation</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Customer Name *" required value={form.customer_name}
                        onChange={(e) => setForm(f => ({ ...f, customer_name: e.target.value }))}
                        className="w-full border rounded-lg px-4 py-2" />
                    <input type="text" placeholder="Company Name" value={form.customer_company}
                        onChange={(e) => setForm(f => ({ ...f, customer_company: e.target.value }))}
                        className="w-full border rounded-lg px-4 py-2" />
                    <input type="email" placeholder="Email *" required value={form.customer_email}
                        onChange={(e) => setForm(f => ({ ...f, customer_email: e.target.value }))}
                        className="w-full border rounded-lg px-4 py-2" />
                    <input type="tel" placeholder="Phone" value={form.customer_phone}
                        onChange={(e) => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                        className="w-full border rounded-lg px-4 py-2" />
                    <input type="text" placeholder="GST Number (Optional)" value={form.customer_gst}
                        onChange={(e) => setForm(f => ({ ...f, customer_gst: e.target.value }))}
                        className="w-full border rounded-lg px-4 py-2" />
                    <textarea placeholder="Address" value={form.customer_address}
                        onChange={(e) => setForm(f => ({ ...f, customer_address: e.target.value }))}
                        className="w-full border rounded-lg px-4 py-2" rows={2} />
                    <div>
                        <label className="text-sm text-gray-600">Validity (days)</label>
                        <input type="number" min={1} max={90} value={form.validity_days}
                            onChange={(e) => setForm(f => ({ ...f, validity_days: parseInt(e.target.value) }))}
                            className="w-full border rounded-lg px-4 py-2" />
                    </div>
                    <textarea placeholder="Internal Notes" value={form.internal_notes}
                        onChange={(e) => setForm(f => ({ ...f, internal_notes: e.target.value }))}
                        className="w-full border rounded-lg px-4 py-2" rows={2} />

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 border py-2 rounded-lg">Cancel</button>
                        <button type="submit" disabled={loading}
                            className="flex-1 bg-saree-teal text-white py-2 rounded-lg font-semibold hover:bg-saree-teal-dark disabled:bg-gray-300">
                            {loading ? 'Saving...' : 'Save Quotation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
