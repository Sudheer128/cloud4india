import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useMainProductsContent } from '../hooks/useCMS'
import { ContentWrapper } from './LoadingComponents'

const ProductsSectionNew = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { data: mainPageData, loading, error, refetch } = useMainProductsContent()
  
  const products = mainPageData?.sections || []

  const categories = ['all', 'Generative AI', 'Artificial Intelligence (AI)', 'Compute', 'Storage', 'Database', 'Networking']

  const filteredProducts = products?.filter(product => {
    const productName = product.title || product.name || '';
    const productDesc = product.description || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productDesc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const getCategoryColor = () => {
    return {
      active: 'bg-saree-teal text-white',
      inactive: 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-100'
    }
  }

  const getProductColor = () => {
    return {
      border: 'border-gray-200 hover:border-saree-teal-dark',
      badge: 'bg-saree-amber text-white',
      title: '',
      link: 'text-saree-teal hover:text-saree-teal-dark'
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-light text-gray-900">Explore our products</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 border-2 border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors bg-white">
              <FunnelIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Filter by category</span>
            </button>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by product name or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 font-medium">
            Displaying 1-{filteredProducts.length} ({products.length})
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const colors = getCategoryColor()
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                  selectedCategory === category ? colors.active : colors.inactive
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            )
          })}
        </div>

        <ContentWrapper 
          loading={loading} 
          error={error} 
          data={products} 
          onRetry={refetch}
          loadingText="Loading products..."
          emptyMessage="No products available"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => {
              const productRoute = product.product_route || product.product_id || product.id;
              const productName = product.product_name || product.title || product.name || '';
              const productCategory = product.category || 'Cloud Services';
              const colors = getProductColor()
               
              return (
                <Link
                  key={product.id}
                  to={`/products/${productRoute}`}
                  className={`relative bg-white border ${colors.border} rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group block overflow-hidden`}
                >
                  {/* single-color hover wash: light teal, under content */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
                    <div className="absolute inset-0 bg-saree-teal/10" />
                  </div>
                  <div className="mb-4 relative z-10">
                    {productCategory && (
                      <span className={`inline-block ${colors.badge} px-3 py-1 rounded-full text-xs font-semibold mb-3`}>
                        {productCategory}
                      </span>
                    )}
                    <h3 className={`text-xl font-semibold text-gray-900 mb-3 transition-colors`}>
                      {productName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`${colors.link} font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform`}>
                      <span>{product.button_text || 'View product'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </ContentWrapper>

        {filteredProducts.length === products.length && (
          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = 'http://38.242.248.213:4001/products'}
              className="bg-saree-teal text-white border-2 border-saree-teal px-8 py-3 rounded-lg font-semibold hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View more products
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsSectionNew
