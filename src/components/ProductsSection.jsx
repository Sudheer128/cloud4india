import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useProducts } from '../hooks/useCMS'
import { ContentWrapper } from './LoadingComponents'

const ProductsSection = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { data: products, loading, error, refetch } = useProducts()

  const categories = ['all', 'Generative AI', 'Artificial Intelligence (AI)', 'Compute', 'Storage', 'Database', 'Networking']

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-light text-gray-900">Explore our products</h2>
          <a href="#" className="text-aws-blue hover:underline font-medium">
            View all products
          </a>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2 hover:border-gray-400 transition-colors">
              <FunnelIcon className="h-4 w-4" />
              <span className="text-sm">Filter by category</span>
            </button>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Displaying 1-{filteredProducts.length} ({products.length})
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-aws-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <ContentWrapper 
          loading={loading} 
          error={error} 
          data={products} 
          onRetry={refetch}
          loadingText="Loading products..."
          emptyMessage="No products available"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              // Use product ID for dynamic routing
              const productId = product.id;
              
              return (
                <Link
                  key={product.id}
                  to={`/products/${productId}`}
                  className={`bg-gradient-to-br ${product.color} border ${product.border_color} rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group block`}
                >
                  <div className="mb-4">
                    <span className="inline-block bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 mb-3">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-aws-blue transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-aws-blue hover:text-aws-orange font-medium text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>View product</span>
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

        {/* Load More */}
        {filteredProducts.length === products.length && (
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-aws-navy text-aws-navy px-8 py-3 rounded-lg font-medium hover:bg-aws-navy hover:text-white transition-all duration-300">
              Load more products
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsSection
