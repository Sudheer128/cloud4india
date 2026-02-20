import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useMainMarketplacesContent, useHomepageContent } from '../hooks/useCMS'
import { ContentWrapper } from './LoadingComponents'
import { toSlug } from '../utils/slugUtils'
import { getMarketplaceCategories } from '../services/cmsApi'

const MarketplacesSectionNew = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState(['all'])
  const { data: mainPageData, loading, error, refetch } = useMainMarketplacesContent()
  const { data: homepageData } = useHomepageContent()
  
  const marketplaces = mainPageData?.sections || []
  const config = homepageData?.sectionsConfig?.marketplaces || {}

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getMarketplaceCategories()
        // Map categories to array format: ['all', ...category names]
        const categoryNames = categoriesData.map(cat => cat.name)
        setCategories(['all', ...categoryNames])
      } catch (err) {
        console.error('Error fetching marketplace categories:', err)
        // Fallback to default categories if API fails
        setCategories(['all', 'Frameworks', 'Content Management Systems', 'Databases'])
      }
    }
    fetchCategories()
  }, [])

  const filteredMarketplaces = marketplaces?.filter(marketplace => {
    const marketplaceName = marketplace.marketplace_name || marketplace.title || marketplace.name || '';
    const marketplaceDesc = marketplace.description || '';
    const matchesSearch = marketplaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         marketplaceDesc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || marketplace.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const getCategoryColor = () => {
    return {
      active: 'bg-saree-teal text-white',
      inactive: 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-100'
    }
  }

  const getMarketplaceColor = () => {
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
          <h2 className="text-4xl font-light text-gray-900">{config.heading || 'Explore our Apps'}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 border-2 border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors bg-white">
              <FunnelIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{config.filter_text || 'Filter by category'}</span>
            </button>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder={config.search_placeholder || 'Search categories'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 font-medium">
            Displaying 1-{Math.min(6, filteredMarketplaces.length)} ({marketplaces.length})
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
          data={marketplaces} 
          onRetry={refetch}
          loadingText="Loading marketplaces..."
          emptyMessage="No marketplaces available"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarketplaces.slice(0, 6).map((marketplace, index) => {
              const marketplaceId = marketplace.marketplace_id || marketplace.id;
              const marketplaceName = marketplace.marketplace_name || marketplace.title || marketplace.name || '';
              const marketplaceCategory = marketplace.category || 'Enterprise Marketplaces';
              const colors = getMarketplaceColor()
              
              const shouldUseSinglePage = marketplace.enable_single_page !== undefined
                ? Boolean(marketplace.enable_single_page)
                : true;
              const navigationUrl = !shouldUseSinglePage && marketplace.redirect_url
                ? marketplace.redirect_url
                : `/marketplace/${toSlug(marketplaceName)}`;
              const isExternalUrl = navigationUrl.startsWith('http://') || navigationUrl.startsWith('https://');

              const cardContent = (
                <>
                  {/* single-color hover wash: light teal, under content */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
                    <div className="absolute inset-0 bg-saree-teal/10" />
                  </div>
                  <div className="mb-4 relative z-10">
                    {marketplaceCategory && (
                      <span className={`inline-block ${colors.badge} px-3 py-1 rounded-full text-xs font-semibold mb-3`}>
                        {marketplaceCategory}
                      </span>
                    )}
                    <h3 className={`text-xl font-semibold text-gray-900 mb-3 transition-colors`}>
                      {marketplaceName}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {marketplace.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <span className={`${colors.link} font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform`}>
                      <span>{marketplace.button_text || 'View marketplace'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </>
              );

              const cardClassName = `relative bg-white border ${colors.border} rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group block overflow-hidden`;

              return isExternalUrl ? (
                <a
                  key={marketplace.id}
                  href={navigationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {cardContent}
                </a>
              ) : (
                <Link
                  key={marketplace.id}
                  to={navigationUrl}
                  className={cardClassName}
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </ContentWrapper>

        {marketplaces.length > 6 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = '/marketplace'}
              className="bg-saree-teal text-white border-2 border-saree-teal px-8 py-3 rounded-lg font-semibold hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {config.button_text || 'View more Apps'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default MarketplacesSectionNew
