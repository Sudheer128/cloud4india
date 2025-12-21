import React from 'react';
import { ShoppingCartIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function BottomCartBar() {
    const { items, itemCount, subtotal } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) return null;

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2
    }).format(price);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40">
            <div className="bg-gradient-to-r from-saree-teal-dark via-saree-teal to-phulkari-turquoise shadow-2xl border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <ShoppingCartIcon className="w-6 h-6 text-white" />
                                <span className="absolute -top-2 -right-2 bg-saree-amber text-saree-teal-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            </div>
                            <div className="text-white">
                                <div className="text-sm opacity-80">{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</div>
                                <div className="font-bold text-lg">{formatPrice(subtotal)}</div>
                            </div>
                        </div>
                        <button onClick={() => navigate('/cart')}
                            className="flex items-center gap-2 bg-white text-saree-teal-dark px-6 py-2.5 rounded-xl font-semibold hover:bg-saree-amber transition-all transform hover:scale-105 shadow-lg">
                            View Cart <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
