import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useMainMarketplacesContent } from '../hooks/useCMS'
import { ContentWrapper } from './LoadingComponents'
import { toSlug } from '../utils/slugUtils'

const MarketplacesSection = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { data: mainPageData, loading, error, refetch } = useMainMarketplacesContent()
  
  // Use sections from mainPageData instead of marketplaces
  const marketplaces = mainPageData?.sections || []

  const categories = ['all', 'Frameworks', 'Content Management Systems', 'Databases', 'Developer Tools', 'Media', 'E Commerce', 'Business Applications', 'Monitoring Applications']

  const filteredMarketplaces = marketplaces?.filter(marketplace => {
    const marketplaceName = marketplace.title || marketplace.name || '';
    const marketplaceDesc = marketplace.description || '';
    const matchesSearch = marketplaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         marketplaceDesc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || marketplace.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-light text-gray-900">Explore our Apps</h2>
          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
            View all marketplaces
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
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Displaying 1-{filteredMarketplaces.length} ({marketplaces.length})
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
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {/* Marketplaces Grid */}
        <ContentWrapper 
          loading={loading} 
          error={error} 
          data={marketplaces} 
          onRetry={refetch}
          loadingText="Loading marketplaces..."
          emptyMessage="No marketplaces available"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarketplaces.map((marketplace) => {
              // Use marketplace ID for dynamic routing - fallback to section id if no marketplace_id
              const marketplaceId = marketplace.marketplace_id || marketplace.id;
              const marketplaceName = marketplace.title || marketplace.name || '';
              const marketplaceCategory = marketplace.category || 'Enterprise Marketplaces';
              
              return (
                <Link
                  key={marketplace.id}
                  to={`/marketplace/${toSlug(marketplaceName)}`}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group block"
                >
                  <div className="mb-4">
                    {marketplaceCategory && (
                      <span className="inline-block bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 mb-3">
                        {marketplaceCategory}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {marketplaceName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {marketplace.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>{marketplace.button_text || 'View marketplace'}</span>
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

        {/* Show more button */}
        {filteredMarketplaces.length === marketplaces.length && (
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-gray-800 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-all duration-300">
              Show 15 more
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default MarketplacesSection
