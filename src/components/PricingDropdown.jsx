import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getProductVariantsByRoute } from '../services/cmsApi'
import LoadingSpinner from './LoadingSpinner'

const PricingDropdown = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('microsoft-365-licenses')
  const dropdownRef = useRef(null)
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)

  // Category mapping - route-based categories (defined outside useEffect to avoid dependency issues)
  const categories = [
    { id: 'microsoft-365-licenses', label: 'Microsoft 365 Licenses', route: 'microsoft-365-licenses' },
    { id: 'acronis-server-backup', label: 'Acronis Server Backup', route: 'acronis-server-backup' },
    { id: 'acronis-m365-backup', label: 'Acronis M365 Backup', route: 'acronis-m365-backup' },
    { id: 'acronis-google-workspace-backup', label: 'Acronis Google Workspace Backup', route: 'acronis-google-workspace-backup' },
    { id: 'anti-virus', label: 'Anti Virus', route: 'anti-virus' }
  ]

  // Fetch product variants for all categories when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const fetchAllProducts = async () => {
        setLoading(true);
        const productsData = {};

        for (const category of categories) {
          try {
            const variants = await getProductVariantsByRoute(category.route);
            productsData[category.id] = variants.map(variant => ({
              id: variant.id,
              name: variant.name,
              price: variant.price,
              route: variant.route
            }));
          } catch (error) {
            console.error(`Error fetching variants for ${category.route}:`, error);
            productsData[category.id] = [];
          }
        }

        setProducts(productsData);
        setLoading(false);
      };

      fetchAllProducts();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter products based on active category
  const displayProducts = products[activeCategory] || []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if click is not on the products link itself
        if (!event.target.closest('[data-products-link]')) {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        ref={dropdownRef}
        className="fixed top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50 max-h-[85vh] overflow-hidden rounded-b-xl"
      >
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex gap-8">
            
            {/* Left Sidebar - Categories */}
            <div className="w-72 flex-shrink-0">
              <div className="border-r border-gray-200 pr-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Explore Products</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className="space-y-0.5">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group"
                  >
                    View all products
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Content Area - Products */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find(c => c.id === activeCategory)?.label || 'Products'}
                </h2>
                {displayProducts.length === 0 && (
                  <p className="text-gray-500 text-sm mt-2">No products available in this category.</p>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingSpinner />
                </div>
              ) : displayProducts.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.route}`}
                        onClick={onClose}
                        className="group rounded-lg p-6 border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-700 text-xl font-medium">{product.price}</p>
                          </div>
                          <ArrowRightIcon className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-600 transition-all duration-200 ml-2 flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>No products available in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PricingDropdown

