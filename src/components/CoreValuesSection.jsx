import React, { useState, useEffect } from 'react'
import { getAboutUsContent } from '../services/cmsApi'

const CoreValuesSection = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAboutUsContent()
        setContent({
          section: data.coreValuesSection || {},
          values: data.coreValues || []
        })
      } catch (error) {
        console.error('Error fetching Core Values content:', error)
        setContent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  // Hide section if content is missing or is_visible is 0
  if (!content || (content.section && content.section.is_visible === 0)) {
    return null
  }

  // If section header data is missing but values exist, section is hidden
  if (!content.section || (!content.section.header_title && !content.section.header_description && content.section.is_visible === undefined)) {
    return null
  }

  const values = content.values || []
  const section = content.section || {}

  // Icon renderer based on icon_type
  const renderIcon = (iconType, color) => {
    const iconClasses = `w-10 h-10 text-${color}`
    switch (iconType) {
      case 'lightbulb':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        )
      case 'shield':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'heart':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        )
      case 'check':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'star':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      case 'lock':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {section.header_title && (
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              {section.header_title}
            </h2>
          )}
          {section.header_description && (
            <p className="text-base text-gray-700 max-w-3xl mx-auto">
              {section.header_description}
            </p>
          )}
        </div>

        {/* Core Values Grid */}
        {values.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const colors = [
                { bg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-dark', light: 'bg-saree-teal/10' },
                { bg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-dark', light: 'bg-saree-lime/10' },
                { bg: 'bg-saree-rose', hover: 'hover:bg-saree-rose-dark', light: 'bg-saree-rose/10' },
                { bg: 'bg-saree-amber', hover: 'hover:bg-saree-gold', light: 'bg-saree-amber/10' },
                { bg: 'bg-phulkari-fuchsia', hover: 'hover:bg-phulkari-red', light: 'bg-phulkari-fuchsia/10' },
                { bg: 'bg-saree-coral', hover: 'hover:bg-saree-coral-dark', light: 'bg-saree-coral/10' }
              ]
              const color = colors[index % colors.length]
              
              return (
                <div 
                  key={value.id || index} 
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer overflow-hidden relative"
                >
                  <div className={`absolute inset-0 ${color.light} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className={`w-14 h-14 ${color.bg} ${color.hover} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      {renderIcon(value.icon_type || 'lightbulb', 'white')}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default CoreValuesSection

