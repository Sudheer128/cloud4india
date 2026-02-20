import React, { useState, useEffect } from 'react';
import { XMarkIcon, ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { CMS_URL } from '../../utils/config';
import { DURATIONS } from '../../utils/priceUtils';

const API_BASE_URL = CMS_URL;

export default function PricingModal({ isOpen, onClose, item }) {
    const { addItem } = useCart();
    const [duration, setDuration] = useState('monthly');
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (isOpen && item) {
            setDuration('monthly');
            setAdded(false);
            fetchPrice('monthly');
        }
    }, [isOpen, item]);

    const fetchPrice = async (dur) => {
        if (!item) return;
        setLoading(true);
        try {
            const priceKey = `${dur}_price`;
            if (item.pricing_content || item[priceKey]) {
                const pricingData = item.pricing_content ?
                    (typeof item.pricing_content === 'string' ? JSON.parse(item.pricing_content) : item.pricing_content) : item;
                if (pricingData[priceKey]) {
                    setPrice(pricingData[priceKey]);
                    setLoading(false);
                    return;
                }
            }
            const response = await fetch(`${API_BASE_URL}/api/price-estimator/item-price?item_id=${item.item_id}&item_type=${item.item_type}&duration=${dur}`);
            const data = await response.json();
            setPrice(data.price || 'Contact Sales');
        } catch (error) {
            setPrice('Contact Sales');
        } finally {
            setLoading(false);
        }
    };

    const handleDurationChange = (e) => {
        const newDur = e.target.value;
        setDuration(newDur);
        fetchPrice(newDur);
    };

    const handleAddToCart = () => {
        if (!item || !price || price === 'Contact Sales') return;
        addItem({
            item_id: item.item_id,
            item_type: item.item_type,
            item_name: item.item_name || item.name,
            item_description: item.item_description || item.description || '',
            plan_name: item.plan_name || item.title || '',
            duration,
            unit_price: price,
            quantity: 1,
            specifications: item.specifications || [],
            features: item.features || [],
            category: item.category || ''
        });
        setAdded(true);
        setTimeout(() => { onClose(); setAdded(false); }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item?.item_name || item?.name || 'Add to Cart'}</h3>
                <p className="text-sm text-gray-500 mb-4">{item?.plan_name || item?.title || 'Select billing'}</p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Billing Duration</label>
                    <select value={duration} onChange={handleDurationChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-saree-teal">
                        {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                </div>

                <div className="bg-gradient-to-r from-saree-teal-light/30 to-saree-amber-light/30 rounded-xl p-4 mb-6">
                    <div className="text-sm text-gray-600 mb-1">Price</div>
                    {loading ? <div className="h-8 bg-gray-200 animate-pulse rounded w-32" /> : (
                        <div className="text-2xl font-bold text-saree-teal-dark">
                            {price || 'N/A'}
                            <span className="text-sm font-normal text-gray-500 ml-1">{DURATIONS.find(d => d.value === duration)?.suffix}</span>
                        </div>
                    )}
                </div>

                <button onClick={handleAddToCart} disabled={loading || !price || price === 'Contact Sales' || added}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-500' : (loading || !price || price === 'Contact Sales') ? 'bg-gray-300 cursor-not-allowed' : 'bg-saree-teal hover:bg-saree-teal-dark'
                        }`}>
                    {added ? <><CheckIcon className="w-5 h-5" />Added!</> : <><ShoppingCartIcon className="w-5 h-5" />Add to Cart</>}
                </button>
            </div>
        </div>
    );
}
