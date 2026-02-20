import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCartIcon, EyeIcon, FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CMS_URL } from '../utils/config';
import { formatPriceOrContact, DURATIONS } from '../utils/priceUtils';

const API_BASE_URL = CMS_URL;

const TABS = [
    { id: 'marketplace', label: 'Marketplace Apps', icon: '🛒' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'solutions', label: 'Solutions', icon: '💼' }
];

// Card component that shows the PRODUCT/APP with plan selection
function ServiceCard({ item, itemType, onAdd, onView, cartItems, onUpdateQuantity, onRemoveItem }) {
    const [selectedPlan, setSelectedPlan] = useState(item.plans?.[0] || null);
    const [selectedDuration, setSelectedDuration] = useState('monthly');

    const plans = item.plans || [];
    const hasPlan = plans.length > 0;

    const getPrice = (plan, dur) => {
        if (!plan) return 'N/A';
        const key = `${dur}_price`;
        const val = plan[key];
        return (val !== null && val !== undefined && val !== '') ? val : 'N/A';
    };

    const formatPrice = formatPriceOrContact;

    // Find if current plan+duration is in cart
    const cartItem = selectedPlan && cartItems.find(
        ci => ci.item_id === selectedPlan.item_id &&
            ci.item_type === itemType &&
            ci.duration === selectedDuration
    );

    const isInCart = !!cartItem;
    const quantity = cartItem?.quantity || 0;

    // Check if there's a valid price for the selected plan+duration
    const currentPrice = getPrice(selectedPlan, selectedDuration);
    const hasValidPrice = currentPrice && currentPrice !== 'N/A' && currentPrice !== 'Contact Sales';

    const handleAdd = () => {
        if (!selectedPlan) return;
        onAdd({
            item_id: selectedPlan.item_id,
            item_type: itemType,
            item_name: item.name,
            item_description: item.description || '',
            plan_name: selectedPlan.plan_name || item.name,
            duration: selectedDuration,
            unit_price: getPrice(selectedPlan, selectedDuration),
            specifications: selectedPlan.specifications || [],
            features: selectedPlan.features || [],
            category: item.category || ''
        });
    };

    const handleIncrement = () => {
        if (cartItem) {
            onUpdateQuantity(cartItem.id, quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (cartItem && quantity > 1) {
            onUpdateQuantity(cartItem.id, quantity - 1);
        } else if (cartItem && quantity === 1) {
            onRemoveItem(cartItem.id);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-saree-teal/30 transition-all duration-300 flex flex-col">
            {/* Category Badge */}
            {item.category && (
                <span className="self-start text-xs bg-saree-teal/10 text-saree-teal px-2 py-0.5 rounded mb-2">
                    {item.category}
                </span>
            )}

            {/* Header */}
            <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">
                {item.description || 'Enterprise-grade cloud service with reliable performance and support.'}
            </p>

            {/* Plan Selector (if multiple plans) */}
            {hasPlan && plans.length > 1 && (
                <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">Select Plan</label>
                    <select
                        value={selectedPlan?.item_id || ''}
                        onChange={(e) => {
                            const plan = plans.find(p => p.item_id == e.target.value);
                            setSelectedPlan(plan);
                        }}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-saree-teal focus:border-saree-teal"
                    >
                        {plans.map(plan => (
                            <option key={plan.item_id} value={plan.item_id}>
                                {plan.plan_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Single plan display */}
            {hasPlan && plans.length === 1 && (
                <div className="mb-3 text-sm text-gray-600">
                    <span className="font-medium">{plans[0].plan_name}</span>
                </div>
            )}

            {/* Specs Preview */}
            {selectedPlan?.specifications?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                    {selectedPlan.specifications.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {spec}
                        </span>
                    ))}
                </div>
            )}

            {/* Duration Selector */}
            <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Billing Period</label>
                <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-saree-teal focus:border-saree-teal"
                >
                    {DURATIONS.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                </select>
            </div>

            {/* Price Display - Highlighted */}
            <div className="mb-4 p-3 bg-gradient-to-r from-saree-teal/5 to-phulkari-turquoise/5 border border-saree-teal/20 rounded-lg">
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="text-2xl font-bold text-saree-teal">
                            {hasPlan ? formatPrice(getPrice(selectedPlan, selectedDuration)) : 'Contact Sales'}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/{selectedDuration}</span>
                    </div>
                    {hasPlan && getPrice(selectedPlan, selectedDuration) !== 'N/A' && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Per {selectedDuration}
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
                {isInCart ? (
                    /* Quantity Controls */
                    <div className="flex-1 flex items-center justify-center gap-2 py-1 bg-green-50 border border-green-200 rounded-lg">
                        <button
                            onClick={handleDecrement}
                            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                            title={quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
                        >
                            {quantity === 1 ? '×' : '−'}
                        </button>
                        <span className="w-8 text-center font-semibold text-green-700">{quantity}</span>
                        <button
                            onClick={handleIncrement}
                            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-green-600 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-all"
                            title="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                ) : (
                    /* Add to Quote Button */
                    <button
                        onClick={handleAdd}
                        disabled={!hasPlan || !hasValidPrice}
                        className={`flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-all ${(!hasPlan || !hasValidPrice)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-saree-teal text-white hover:bg-saree-teal-dark'
                            }`}
                        title={!hasValidPrice ? 'Contact Sales for pricing' : ''}
                    >
                        {!hasValidPrice ? (
                            'Contact Sales'
                        ) : (
                            <><ShoppingCartIcon className="w-4 h-4" /> Add to Quote</>
                        )}
                    </button>
                )}
                {item.route && (
                    <button
                        onClick={() => onView(item.route, itemType)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                        title="View Details"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default function PriceEstimator() {
    const navigate = useNavigate();
    const { addItem, items: cartItems, updateQuantity, removeItem } = useCart();
    const [activeTab, setActiveTab] = useState('marketplace');
    const [data, setData] = useState({ marketplaces: [], products: [], solutions: [] });
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        Promise.all([
            fetch(`${API_BASE_URL}/api/price-estimator/all-items`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/price-estimator/config`).then(r => r.json())
        ]).then(([itemsData, configData]) => {
            setData(itemsData);
            setConfig(configData);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    // Reset filters when tab changes
    useEffect(() => {
        setSelectedCategory('all');
        setSearchQuery('');
    }, [activeTab]);

    const handleAdd = (item) => {
        addItem(item);
    };

    const handleView = (route, itemType) => {
        if (!route) return;

        // Build the correct path based on item type
        const prefixMap = {
            'marketplace': '/marketplace/',
            'product': '/products/',
            'solution': '/solutions/'
        };

        const prefix = prefixMap[itemType] || '/';
        const fullPath = prefix + route;
        navigate(fullPath);
    };

    const getTabData = () => {
        switch (activeTab) {
            case 'marketplace': return { items: data.marketplaces || [], type: 'marketplace' };
            case 'products': return { items: data.products || [], type: 'product' };
            case 'solutions': return { items: data.solutions || [], type: 'solution' };
            default: return { items: [], type: '' };
        }
    };

    const { items: tabItems, type: itemType } = getTabData();

    // Extract unique categories for current tab
    const categories = useMemo(() => {
        const cats = new Set();
        tabItems.forEach(item => {
            if (item.category) cats.add(item.category);
        });
        return ['all', ...Array.from(cats).sort()];
    }, [tabItems]);

    // Filter items (now filtering actual products/apps, not plans)
    const filteredItems = useMemo(() => {
        return tabItems.filter(item => {
            // Filter by category
            if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

            // Filter by search query
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matchesName = item.name?.toLowerCase().includes(searchLower);
                const matchesDesc = item.description?.toLowerCase().includes(searchLower);
                const matchesCat = item.category?.toLowerCase().includes(searchLower);
                const matchesPlan = item.plans?.some(p => p.plan_name?.toLowerCase().includes(searchLower));
                if (!matchesName && !matchesDesc && !matchesCat && !matchesPlan) return false;
            }

            return true;
        });
    }, [tabItems, selectedCategory, searchQuery]);

    // Group by category for display
    const groupedByCategory = useMemo(() => {
        if (selectedCategory !== 'all') return null;

        const groups = {};
        filteredItems.forEach(item => {
            const cat = item.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [filteredItems, selectedCategory]);

    // Get counts
    const tabCounts = {
        marketplace: data.marketplaces?.length || 0,
        products: data.products?.length || 0,
        solutions: data.solutions?.length || 0
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-saree-teal border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-saree-teal-dark via-saree-teal to-phulkari-turquoise text-white py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl md:text-4xl font-bold">{config.page_title || 'Price Estimator'}</h1>
                    <p className="mt-2 text-lg opacity-90">{config.page_subtitle || 'Build your custom cloud solution'}</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <nav className="flex gap-1 -mb-px">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-4 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
                                    ? 'border-saree-teal text-saree-teal'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    {tabCounts[tab.id]}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-md">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-saree-teal/20 focus:border-saree-teal"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-saree-teal/20 focus:border-saree-teal"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Results count */}
                        <span className="text-sm text-gray-500">
                            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="text-gray-400 text-5xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery ? `No results for "${searchQuery}"` : 'No items available in this category'}
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                            className="text-saree-teal hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : groupedByCategory && selectedCategory === 'all' ? (
                    // Show grouped by category
                    <div className="space-y-10">
                        {Object.entries(groupedByCategory).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
                            <div key={category}>
                                <div className="flex items-center gap-3 mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
                                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                        {items.length} {items.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {items.map((item) => (
                                        <ServiceCard
                                            key={item.id}
                                            item={item}
                                            itemType={itemType}
                                            onAdd={handleAdd}
                                            onView={handleView}
                                            cartItems={cartItems}
                                            onUpdateQuantity={updateQuantity}
                                            onRemoveItem={removeItem}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Show flat grid when category is selected
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedCategory === 'all' ? TABS.find(t => t.id === activeTab)?.label : selectedCategory}
                            </h2>
                            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredItems.map((item) => (
                                <ServiceCard
                                    key={item.id}
                                    item={item}
                                    itemType={itemType}
                                    onAdd={handleAdd}
                                    onView={handleView}
                                    cartItems={cartItems}
                                    onUpdateQuantity={updateQuantity}
                                    onRemoveItem={removeItem}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
