import React, { useState, useEffect } from 'react'
import { getAboutUsContent } from '../services/cmsApi'

const MissionVisionSection = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAboutUsContent()
        setContent(data.missionVision)
      } catch (error) {
        console.error('Error fetching Mission & Vision content:', error)
        setContent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          {(content.mission_title || content.mission_description) && (
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-saree-teal hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saree-teal to-saree-teal-dark"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-saree-teal rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                {content.mission_title && (
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {content.mission_title}
                  </h3>
                )}
                {content.mission_description && (
                  <p className="text-gray-700 leading-relaxed">
                    {content.mission_description}
                  </p>
                )}
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-saree-teal/10 rounded-full blur-2xl group-hover:bg-saree-teal/20 transition-colors duration-300"></div>
            </div>
          )}

          {/* Vision Card */}
          {(content.vision_title || content.vision_description) && (
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-saree-amber hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saree-amber to-saree-gold"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-saree-amber rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {content.vision_title && (
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {content.vision_title}
                  </h3>
                )}
                {content.vision_description && (
                  <p className="text-gray-700 leading-relaxed">
                    {content.vision_description}
                  </p>
                )}
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-saree-amber/10 rounded-full blur-2xl group-hover:bg-saree-amber/20 transition-colors duration-300"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MissionVisionSection

