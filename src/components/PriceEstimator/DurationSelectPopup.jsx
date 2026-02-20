import React, { useState } from 'react';
import { XMarkIcon, ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { formatPriceOrContact, DURATIONS } from '../../utils/priceUtils';

export default function DurationSelectPopup({ isOpen, onClose, onConfirm, item, prices }) {
    const [selectedDuration, setSelectedDuration] = useState('monthly');
    const [added, setAdded] = useState(false);

    if (!isOpen) return null;

    const getPrice = (duration) => {
        const key = `${duration}_price`;
        return prices?.[key] || prices?.[duration] || 'N/A';
    };

    const formatPrice = formatPriceOrContact;

    const handleConfirm = () => {
        onConfirm(selectedDuration, getPrice(selectedDuration));
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onClose();
        }, 800);
    };

    const selectedPrice = getPrice(selectedDuration);
    const selectedSuffix = DURATIONS.find(d => d.value === selectedDuration)?.suffix || '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Popup */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Select Billing Period</h3>
                    <p className="text-sm text-gray-500 mt-1">{item?.name || item?.title || 'Service'}</p>
                </div>

                {/* Duration Options */}
                <div className="space-y-2 mb-6">
                    {DURATIONS.map((duration) => {
                        const price = getPrice(duration.value);
                        const isSelected = selectedDuration === duration.value;

                        return (
                            <label
                                key={duration.value}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                        ? 'border-saree-teal bg-saree-teal/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="duration"
                                        value={duration.value}
                                        checked={isSelected}
                                        onChange={() => setSelectedDuration(duration.value)}
                                        className="w-4 h-4 text-saree-teal focus:ring-saree-teal"
                                    />
                                    <span className={`font-medium ${isSelected ? 'text-saree-teal' : 'text-gray-700'}`}>
                                        {duration.label}
                                    </span>
                                </div>
                                <span className={`font-semibold ${isSelected ? 'text-saree-teal' : 'text-gray-900'}`}>
                                    {formatPrice(price)}
                                </span>
                            </label>
                        );
                    })}
                </div>

                {/* Selected Price Display */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Selected Price:</span>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">{formatPrice(selectedPrice)}</span>
                            <span className="text-gray-500 text-sm">{selectedSuffix}</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleConfirm}
                    disabled={added || selectedPrice === 'N/A'}
                    className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${added
                            ? 'bg-green-500'
                            : selectedPrice === 'N/A' || !selectedPrice
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-saree-teal hover:bg-saree-teal-dark'
                        }`}
                >
                    {added ? (
                        <>
                            <CheckIcon className="w-5 h-5" />
                            Added to Cart!
                        </>
                    ) : (
                        <>
                            <ShoppingCartIcon className="w-5 h-5" />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
