import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useSolutions } from '../hooks/useSolutions'
import { SolutionsLoading } from './LoadingComponents'

const SolutionsSection = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Fetch solutions from CMS
  const { solutions, loading, error } = useSolutions()

  // Show loading state
  if (loading) {
    return <SolutionsLoading />
  }

  // Show error state with fallback
  if (error) {
    console.error('Failed to load solutions from CMS:', error)
    // You could show an error message or fallback to static data here
  }

  const categories = ['all', 'Industry', 'Technology']

  // Map CMS data to component format and filter
  const filteredSolutions = solutions
    .map(solution => ({
      ...solution,
      // Map CMS fields to component expected format
      borderColor: solution.border_color || 'border-gray-200',
      // Ensure route starts with /
      route: solution.route?.startsWith('/') ? solution.route : `/${solution.route}`
    }))
    .filter(solution => {
      const matchesSearch = solution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           solution.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory
      return matchesSearch && matchesCategory
    })

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-light text-gray-900">Explore our solutions</h2>
          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
            View all solutions
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
            Displaying 1-{filteredSolutions.length} ({solutions.length})
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

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((solution) => {
            // Create gradient class from database fields (now using light gradients)
            const gradientClass = `from-${solution.gradient_start}-50 to-${solution.gradient_end}`;
            
            return (
              <Link
                key={solution.id}
                to={`/solutions/${solution.id}`}
                className={`bg-gradient-to-br ${gradientClass} rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group block text-gray-900`}
              >
                <div className="mb-4">
                  <span className="inline-block bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 mb-3">
                    {solution.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {solution.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {solution.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-all">
                    <span>View solutions</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show more button */}
        {filteredSolutions.length === solutions.length && (
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

export default SolutionsSection
