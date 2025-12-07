import React, { useState, useEffect } from 'react'
import { getAboutUsContent } from '../services/cmsApi'

const OurApproachSection = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAboutUsContent()
        setContent({
          section: data.approachSection || {},
          items: data.approachItems || []
        })
      } catch (error) {
        console.error('Error fetching About Us approach content:', error)
        // Fallback to default content
        setContent({
          section: {
            header_title: 'Our Approach',
            header_description: 'At Cloud 4 India, we are committed to providing secure, reliable, and customised data centre Apps designed to empower your business growth.',
            cta_button_text: 'Talk to a Specialist'
          },
          items: [
            { title: 'TIER 4 DATA CENTRES', description: 'Optimized for speed, security, and resilience', icon_type: 'database' },
            { title: '99.99% UPTIME', description: 'Ensuring uninterrupted business operations', icon_type: 'clock' },
            { title: 'HYPERCONVERGED INFRASTRUCTURE', description: 'Seamless integration and resource optimization', icon_type: 'sun' },
            { title: '24/7 SUPPORT', description: 'Dedicated experts, always ready to assist', icon_type: 'phone' }
          ]
        })
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
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
  
  // If section header data is missing but items exist, section is hidden
  // When section is hidden, backend returns { items: [...] } without section header
  if (!content.section || (!content.section.header_title && !content.section.header_description && content.section.is_visible === undefined)) {
    return null
  }

  const approachItems = content.items || []
  const section = content.section || {}

  // Icon renderer based on icon_type
  const renderIcon = (iconType) => {
    const iconClasses = "w-16 h-16"
    switch (iconType) {
      case 'database':
        return (
          <svg className={iconClasses + " text-saree-teal"} fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
        )
      case 'clock':
        return (
          <svg className={iconClasses + " text-saree-lime"} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      case 'sun':
        return (
          <svg className={iconClasses + " text-saree-amber"} fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        )
      case 'phone':
        return (
          <svg className={iconClasses + " text-saree-teal"} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        )
      default:
        return (
          <svg className={iconClasses + " text-saree-teal"} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        )
    }
  }
  
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {section.header_title && (
            <div className="mb-6">
              <div className="inline-block bg-saree-teal/10 rounded-full px-6 py-2 mb-4">
                <span className="text-saree-teal font-semibold text-sm uppercase tracking-wider">
                  Our Commitment
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {section.header_title}
              </h2>
            </div>
          )}
          {section.header_description && (
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {section.header_description.split('Cloud 4 India').map((part, index, array) => (
                <React.Fragment key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="font-bold text-saree-teal">Cloud 4 India</span>
                  )}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
        
        {/* Approach Cards */}
        {approachItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {approachItems.map((approach, index) => {
              const colors = [
                { iconBg: 'group-hover:bg-saree-teal-light', cardBg: 'hover:bg-saree-teal-light', border: 'hover:border-saree-teal' },
                { iconBg: 'group-hover:bg-saree-lime-light', cardBg: 'hover:bg-saree-lime-light', border: 'hover:border-saree-lime' },
                { iconBg: 'group-hover:bg-saree-amber-light', cardBg: 'hover:bg-saree-amber-light', border: 'hover:border-saree-amber' },
                { iconBg: 'group-hover:bg-phulkari-turquoise-light', cardBg: 'hover:bg-phulkari-turquoise-light', border: 'hover:border-phulkari-turquoise' }
              ];
              const color = colors[index % colors.length];
              
              return (
                <div 
                  key={approach.id || index}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center border-2 border-gray-200 ${color.cardBg} ${color.border} cursor-pointer group`}
                >
                  <div className={`bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 ${color.iconBg} transition-all duration-300`}>
                    {renderIcon(approach.icon_type)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {approach.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                    {approach.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        
        {/* CTA Button */}
        {section.cta_button_text && (
          <div className="text-center">
            <button className="bg-saree-teal hover:bg-saree-teal-dark text-white px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {section.cta_button_text}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default OurApproachSection
