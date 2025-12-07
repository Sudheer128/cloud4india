import React, { useState, useEffect } from 'react'
import { getAboutUsContent } from '../services/cmsApi'

const AboutHeroSection = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAboutUsContent()
        setContent(data.hero)
      } catch (error) {
        console.error('Error fetching About Us hero content:', error)
        // Fallback to default content if API fails
        setContent({
          badge_text: 'About Cloud 4 India',
          title: 'The Power of',
          highlighted_text: 'Next-generation',
          title_after: 'Control',
          description: 'From small businesses to large enterprises, and from individual webmasters to online entrepreneurs, Cloud 4 India has been the trusted partner for cost-effective managed IT Apps. We specialise in empowering your online presence with reliable, tailored services designed to meet your unique needs.',
          button_text: 'Explore Our Services',
          image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
          stat_value: '14+',
          stat_label: 'Years Experience'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-white">
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  // Hide section if content is missing or is_visible is 0
  if (!content || content.is_visible === 0) {
    return null
  }

  const titleParts = content.title ? content.title.split(content.highlighted_text || 'Next-generation') : ['The Power of', '']
  const highlightedText = content.highlighted_text || 'Next-generation'

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Geometric Patterns */}
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white/30 rounded-full"></div>
          <div className="absolute top-20 right-20 w-60 h-60 border-4 border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-white/20 rounded-lg rotate-45"></div>
          <div className="absolute bottom-20 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          {content.badge_text && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30 shadow-xl">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-semibold">{content.badge_text}</span>
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight drop-shadow-2xl">
            {titleParts[0]}{' '}
            <span className="font-bold text-saree-amber">{highlightedText}</span>{' '}
            {content.title_after || titleParts[1] || 'Control'}
          </h1>
          
          {content.description && (
            <p className="text-base text-white/90 leading-relaxed drop-shadow-lg">
              {content.description}
            </p>
          )}
          
          {content.button_text && (
            <button 
              onClick={() => { if (content.button_link) window.location.href = content.button_link; }}
              className="bg-white text-saree-teal-dark px-8 py-3 rounded-lg font-bold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/20"
            >
              {content.button_text}
            </button>
          )}
        </div>
        
        {/* Right Image */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30">
            <img 
              src={content.image_url || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'} 
              alt="Team collaboration" 
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Floating stats card */}
          {(content.stat_value || content.stat_label) && (
            <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border-2 border-white/30 hover:border-white/50 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center group-hover:bg-white/90 transition-colors duration-300">
                  <svg className="w-6 h-6 text-saree-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  {content.stat_value && (
                    <div className="text-2xl font-bold text-white drop-shadow-lg">{content.stat_value}</div>
                  )}
                  {content.stat_label && (
                    <div className="text-sm text-white/90">{content.stat_label}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
          <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.2"/>
        </svg>
      </div>
    </section>
  )
}

export default AboutHeroSection
