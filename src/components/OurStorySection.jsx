import React, { useState, useEffect } from 'react'
import { getAboutUsContent } from '../services/cmsApi'

const OurStorySection = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAboutUsContent()
        setContent(data.story)
      } catch (error) {
        console.error('Error fetching About Us story content:', error)
        // Fallback to default content
        setContent({
          header_title: 'Our Story',
          header_description: 'A journey of innovation, trust, and excellence spanning over a decade',
          founding_year: '2010',
          story_items: JSON.stringify([
            'Founded in 2010, Cloud 4 India was established to address the growing demand for secure, reliable data centres and managed IT services.',
            'Over the past 14 years, we have become a trusted partner for organisations and webmasters, delivering dependable cloud and managed hosting Apps at competitive prices.',
            'With a commitment to innovation and customer satisfaction, we offer comprehensive managed IT services, catering to businesses of all sizes — from ambitious startups to established enterprises.'
          ]),
          image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=600&fit=crop',
          badge_value: '24H',
          badge_label: 'Support',
          top_badge_value: '1M+',
          top_badge_label: 'Happy Customers'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  // Hide section if content is missing or is_visible is 0
  if (!content || content.is_visible === 0) {
    return null
  }

  // Parse story_items if it's a string
  let storyItems = []
  if (content.story_items) {
    try {
      storyItems = typeof content.story_items === 'string' 
        ? JSON.parse(content.story_items) 
        : content.story_items
    } catch (e) {
      storyItems = Array.isArray(content.story_items) ? content.story_items : []
    }
  }

  const colors = ['border-saree-teal', 'border-saree-amber', 'border-saree-lime']

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {content.header_title && (
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              {content.header_title}
            </h2>
          )}
          {content.header_description && (
            <p className="text-base text-gray-700 max-w-3xl mx-auto">
              {content.header_description}
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            {content.founding_year && (
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-saree-teal text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                  {content.founding_year}
                </div>
                <div className="h-1 flex-1 bg-gradient-to-r from-saree-teal to-transparent rounded-full"></div>
              </div>
            )}
            
            <div className="space-y-4">
              {storyItems.map((item, index) => {
                const borderColor = colors[index % colors.length]
                return (
                <div 
                  key={index}
                  className={`bg-white p-8 rounded-2xl border-l-4 ${borderColor} shadow-lg hover:shadow-2xl hover:border-l-8 hover:-translate-x-2 transition-all duration-300 cursor-pointer`}
                >
                  <p className="text-gray-700 leading-relaxed">
                    {item}
                  </p>
                </div>
                )
              })}
            </div>
          </div>
          
          {/* Right Side - Visual */}
          <div className="relative">
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <img 
                  src={content.image_url || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=600&fit=crop'} 
                  alt="Professional at work" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating badge */}
              {(content.badge_value || content.badge_label) && (
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border-2 border-gray-200 hover:border-saree-lime hover:bg-saree-lime-light hover:scale-110 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="bg-saree-lime rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-lg hover:bg-saree-lime-dark transition-colors duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {content.badge_value && (
                      <span className="text-2xl font-bold text-gray-900">{content.badge_value}</span>
                    )}
                    {content.badge_label && (
                      <span className="text-sm text-gray-600">{content.badge_label}</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Top accent */}
              {(content.top_badge_value || content.top_badge_label) && (
                <div className="absolute -top-6 -right-6 bg-saree-teal rounded-xl shadow-xl p-4 border-2 border-saree-teal hover:bg-saree-teal-dark hover:scale-110 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {content.top_badge_value && (
                      <span className="text-white font-bold">{content.top_badge_value}</span>
                    )}
                  </div>
                  {content.top_badge_label && (
                    <span className="text-xs text-white/90 group-hover:text-white transition-colors duration-300">{content.top_badge_label}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStorySection
