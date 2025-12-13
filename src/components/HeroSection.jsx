import React from 'react'
import { useHeroContent } from '../hooks/useCMS'

const HeroSection = () => {
  const { data: heroData, loading, error, refetch } = useHeroContent()

  return (
    <section className="bg-gradient-to-r from-purple-200 via-purple-300 to-blue-300 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background particles/effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-blue-100/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-light text-gray-800 mb-8 animate-slideIn">
            {heroData?.title || 'Start building on Cloud4India today'}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed animate-fadeIn">
            {heroData?.description || 'Whether you\'re looking for generative AI, compute power, database storage, content delivery, or other functionality, Cloud4India has the services to help you build sophisticated applications with increased flexibility, scalability, and reliability'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn">
            <button className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-900 transition-all duration-300 hover:shadow-xl">
              {heroData?.primary_button_text || 'Get started for free'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400/40 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-20 w-5 h-5 bg-purple-500/35 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-500/40 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
    </section>
  )
}

export default HeroSection
