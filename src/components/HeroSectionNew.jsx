import React from 'react'
import { useHeroContent } from '../hooks/useCMS'

const HeroSectionNew = () => {
  const { data: heroData, loading, error, refetch } = useHeroContent()

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-phulkari-turquoise via-phulkari-gold to-phulkari-lime">
      {/* Soft overlay to maintain legibility over blended gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 animate-slideIn">
            {heroData?.title || 'Start building on Cloud4India today'}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto mb-12 leading-relaxed animate-fadeIn font-medium">
            {heroData?.description || 'Whether you\'re looking for generative AI, compute power, database storage, content delivery, or other functionality, Cloud4India has the services to help you build sophisticated applications with increased flexibility, scalability, and reliability'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn">
            {heroData?.primary_button_link ? (
              <a 
                href={heroData.primary_button_link}
                className="bg-white text-[rgb(18_167_167_/_var(--tw-bg-opacity,_1))] px-8 py-4 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-white/90 inline-block text-center"
              >
                {heroData?.primary_button_text || 'Get started for free'}
              </a>
            ) : (
              <button 
                onClick={() => window.location.href = 'https://portal.cloud4india.com/login?redirectUrl=/'}
                className="bg-white text-[rgb(18_167_167_/_var(--tw-bg-opacity,_1))] px-8 py-4 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-white/90"
              >
                {heroData?.primary_button_text || 'Get started for free'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Minimal accent elements */}
      <div className="absolute top-24 left-12 w-3 h-3 bg-white rounded-full animate-float opacity-30"></div>
    </section>
  )
}

export default HeroSectionNew
