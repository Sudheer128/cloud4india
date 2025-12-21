import React, { useState, useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:4002';

export default function QuotationView() {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = window.location.pathname.split('/').pop();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/quotations/share/${token}`)
            .then(r => {
                if (!r.ok) throw new Error('Quotation not found or expired');
                return r.json();
            })
            .then(setQuote)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [token]);

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(price || 0);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-saree-teal border-t-transparent" /></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Quotation Not Found</h2>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-saree-teal-dark to-saree-teal p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Quotation</h1>
                                <p className="opacity-90">{quote.quote_number}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm opacity-75">Valid Until</div>
                                <div className="font-semibold">{new Date(quote.valid_until).toLocaleDateString('en-IN')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="p-6 border-b">
                        <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-500">Name:</span> {quote.customer_name}</div>
                            <div><span className="text-gray-500">Company:</span> {quote.customer_company || '-'}</div>
                            <div><span className="text-gray-500">Email:</span> {quote.customer_email}</div>
                            <div><span className="text-gray-500">Phone:</span> {quote.customer_phone || '-'}</div>
                            {quote.customer_gst && <div className="col-span-2"><span className="text-gray-500">GST:</span> {quote.customer_gst}</div>}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                        <table className="w-full text-sm">
                            <thead className="border-b">
                                <tr className="text-gray-500">
                                    <th className="pb-2 text-left">Item</th>
                                    <th className="pb-2 text-left">Duration</th>
                                    <th className="pb-2 text-right">Qty</th>
                                    <th className="pb-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {quote.items?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="py-2">{item.item_name} {item.plan_name && `- ${item.plan_name}`}</td>
                                        <td className="py-2 capitalize">{item.duration}</td>
                                        <td className="py-2 text-right">{item.quantity}</td>
                                        <td className="py-2 text-right">{formatPrice(item.total_price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="p-6 bg-gray-50">
                        <div className="max-w-xs ml-auto space-y-2">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(quote.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">GST ({quote.tax_rate}%)</span><span>{formatPrice(quote.tax_amount)}</span></div>
                            <div className="flex justify-between pt-2 border-t font-bold text-lg">
                                <span>Grand Total</span><span className="text-saree-teal">{formatPrice(quote.grand_total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Terms */}
                    {quote.terms_text && (
                        <div className="p-6 border-t text-sm text-gray-500">
                            <h4 className="font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                            <p>{quote.terms_text}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
