import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getSolutions, getSolutionCategories } from '../services/cmsApi'
import { toSlug } from '../utils/slugUtils'

const SolutionsDropdown = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(null)
  const [solutions, setSolutions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  
  // Reset active category when popup closes
  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null)
    }
  }, [isOpen])

  // Fetch solutions and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [solutionsData, categoriesData] = await Promise.all([
          getSolutions(),
          getSolutionCategories()
        ])
        setSolutions(solutionsData)
        // Map categories to the format expected by the component
        const formattedCategories = categoriesData.map(cat => ({
          id: cat.name,
          label: cat.name,
          order_index: cat.order_index
        }))
        setCategories(formattedCategories)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
        // Fallback: if categories API fails, extract from solutions
        try {
          const solutionsData = await getSolutions()
          setSolutions(solutionsData)
        } catch (solutionsErr) {
          console.error('Error fetching solutions:', solutionsErr)
        }
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  // Group solutions by category
  const solutionsData = solutions.reduce((acc, solution) => {
    const category = solution.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    
    let solutionId = solution.route?.replace('/solutions/', '') || solution.id?.toString()
    
    acc[category].push({
      id: solutionId,
      name: solution.name,
      description: solution.description,
      buttonText: 'Explore',
      route: solution.route,
      enable_single_page: solution.enable_single_page,
      redirect_url: solution.redirect_url,
      color: solution.color
    })
    
    return acc
  }, {})

  // Use categories from API if available, otherwise fallback to extracting from solutions
  const displayCategories = useMemo(() => {
    let finalCategories = []
    
    if (categories.length > 0) {
      finalCategories = [...categories].sort((a, b) => {
        if (a.order_index !== undefined && b.order_index !== undefined) {
          return a.order_index - b.order_index
        }
        return 0
      })
      
      const categoriesFromSolutions = Object.keys(solutionsData).filter(cat => cat !== 'Uncategorized')
      const existingCategoryNames = new Set(categories.map(c => c.id))
      const missingCategories = categoriesFromSolutions.filter(cat => !existingCategoryNames.has(cat))
      
      if (missingCategories.length > 0) {
        const missingFormatted = missingCategories
          .sort()
          .map(cat => ({ id: cat, label: cat, order_index: 9999 }))
        finalCategories = [...finalCategories, ...missingFormatted]
      }
    } else {
      const predefinedOrder = [
        'Industry Solutions',
        'Use Case Solutions'
      ]
      
      const categoriesFromSolutions = Object.keys(solutionsData).filter(cat => cat !== 'Uncategorized')
      const allCategories = Array.from(new Set(categoriesFromSolutions))
      
      const categoryMap = new Map()
      allCategories.forEach(cat => {
        const orderIndex = predefinedOrder.indexOf(cat)
        categoryMap.set(cat, {
          id: cat,
          label: cat,
          order_index: orderIndex !== -1 ? orderIndex : 9999
        })
      })
      
      predefinedOrder.forEach(catName => {
        if (categoryMap.has(catName)) {
          finalCategories.push(categoryMap.get(catName))
          categoryMap.delete(catName)
        }
      })
      
      const remainingCategories = Array.from(categoryMap.values())
        .sort((a, b) => a.label.localeCompare(b.label))
      finalCategories = [...finalCategories, ...remainingCategories]
    }
    
    return finalCategories
  }, [categories, solutionsData])

  // Set active category to first category with solutions when data loads
  useEffect(() => {
    if (displayCategories.length > 0 && !activeCategory && !loading) {
      const firstCategoryWithSolutions = displayCategories.find(category => {
        return solutionsData[category.id] && solutionsData[category.id].length > 0
      })
      
      if (firstCategoryWithSolutions) {
        setActiveCategory(firstCategoryWithSolutions.id)
      } else if (displayCategories.length > 0) {
        setActiveCategory(displayCategories[0].id)
      }
    }
  }, [displayCategories, activeCategory, loading, solutionsData])
  
  // Get solutions for active category
  const displaySolutions = activeCategory ? (solutionsData[activeCategory] || []) : []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!event.target.closest('[data-solutions-link]')) {
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Dropdown - Top positioned with reasonable height */}
      <div 
        ref={dropdownRef}
        className="fixed top-16 left-0 right-0 bg-white z-[80] shadow-2xl border-t border-gray-200
                   max-h-[75vh] sm:max-h-[80vh] md:max-h-[85vh]
                   overflow-hidden rounded-b-xl
                   mx-2 sm:mx-4 md:mx-auto
                   max-w-7xl
                   flex flex-col
                   pointer-events-auto"
      >
        <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 pb-4 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Explore Solutions</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0 overflow-hidden">
            
            {/* Left Sidebar - Categories (Desktop Only) */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="border-r border-gray-200 pr-4 h-full overflow-y-auto">
                {/* Desktop Category List */}
                <nav className="space-y-0.5">
                  {loading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">Loading categories...</div>
                  ) : error ? (
                    <div className="px-3 py-2 text-sm text-red-600">Error loading categories</div>
                  ) : displayCategories.length > 0 ? (
                    displayCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                          activeCategory === category.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No categories available</div>
                  )}
                </nav>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to="/solutions"
                    onClick={onClose}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group"
                  >
                    View all solutions
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Category Selector */}
            <div className="lg:hidden flex-shrink-0">
              <select
                value={activeCategory || ''}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {displayCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Content Area - Solutions */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="mb-3 md:mb-4 flex-shrink-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {displayCategories.find(c => c.id === activeCategory)?.label || 'Solutions'}
                </h2>
                {!loading && displaySolutions.length === 0 && (
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">No solutions available in this category.</p>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center flex-1 min-h-[150px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Loading solutions...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center flex-1 min-h-[150px] text-red-600 text-sm">
                  <p>Error loading solutions: {error}</p>
                </div>
              ) : displaySolutions.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-0 md:pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {displaySolutions.map((solution) => {
                      const shouldUseSinglePage = solution.enable_single_page !== undefined ? Boolean(solution.enable_single_page) : true
                      const navigationUrl = !shouldUseSinglePage && solution.redirect_url 
                        ? solution.redirect_url 
                        : `/solutions/${toSlug(solution.name)}`
                      
                      const isExternalUrl = navigationUrl.startsWith('http://') || navigationUrl.startsWith('https://')
                      
                      const cardContent = (
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                              {solution.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">{solution.description}</p>
                          </div>
                          <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-600 transition-all duration-200 ml-2 flex-shrink-0 mt-0.5" />
                        </div>
                      )

                      if (isExternalUrl) {
                        return (
                          <a
                            key={solution.id}
                            href={navigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation()
                              onClose()
                            }}
                            className="group rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 hover:shadow-sm cursor-pointer block"
                          >
                            {cardContent}
                          </a>
                        )
                      }

                      return (
                        <div
                          key={solution.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                            navigate(navigationUrl)
                          }}
                          className="group rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 hover:shadow-sm cursor-pointer block"
                        >
                          {cardContent}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-1 min-h-[150px] text-gray-500 text-sm">
                  <p>No solutions available in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SolutionsDropdown


