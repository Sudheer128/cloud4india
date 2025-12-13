import React, { useState, useEffect } from 'react'
import { getAboutUsContent } from '../services/cmsApi'

const OurLegacySection = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAboutUsContent()
        setContent(data.legacy)
      } catch (error) {
        console.error('Error fetching About Us legacy content:', error)
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

  // Hide section if:
  // 1. Content is missing
  // 2. is_visible is explicitly 0
  // 3. Header data is missing (when section is hidden, backend returns { stats: [...] } without header)
  if (!content || content.is_visible === 0) {
    return null
  }
  
  // If header data is missing but stats exist, section is hidden
  if (!content.header_title && !content.header_description && content.is_visible === undefined) {
    return null
  }
  
  const stats = content.stats || []
  
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {content.header_title && (
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              {content.header_title}
            </h2>
          )}
          {content.header_description && (
            <p className="text-base text-gray-700 max-w-4xl mx-auto">
              {content.header_description}
            </p>
          )}
        </div>
        
        {/* Statistics */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const colors = [
                { bg: 'hover:bg-saree-teal-light', border: 'hover:border-saree-teal', text: 'text-saree-teal' },
                { bg: 'hover:bg-saree-amber-light', border: 'hover:border-saree-amber', text: 'text-saree-amber' },
                { bg: 'hover:bg-saree-lime-light', border: 'hover:border-saree-lime', text: 'text-saree-lime' },
                { bg: 'hover:bg-saree-rose-light', border: 'hover:border-saree-rose', text: 'text-saree-rose' }
              ];
              const color = colors[index % colors.length];
              
              return (
                <div key={stat.id || index} className={`bg-white text-center rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-2xl ${color.bg} ${color.border} hover:scale-105 hover:-translate-y-2 transition-all duration-300 group`}>
                  <p className="text-gray-600 text-xs mb-2 font-medium group-hover:text-gray-900 transition-colors duration-300">{stat.label}</p>
                  <p className={`text-3xl md:text-4xl font-bold ${color.text}`}>{stat.value}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default OurLegacySection
