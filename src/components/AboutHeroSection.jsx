import React from 'react'

const AboutHeroSection = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-saree-teal rounded-full animate-pulse"></div>
            <span className="text-gray-700 text-sm font-medium">About Cloud 4 India</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
            The Power of{' '}
            <span className="font-bold text-saree-teal">Next-generation</span>{' '}
            Control
          </h1>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            From small businesses to large enterprises, and from individual webmasters to online entrepreneurs, Cloud 4 India has been the trusted partner for cost-effective managed IT solutions. We specialise in empowering your online presence with reliable, tailored services designed to meet your unique needs.
          </p>
          
          <button className="bg-saree-teal text-white px-8 py-3 rounded-full font-semibold hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-lg">
            Explore Our Services
          </button>
        </div>
        
        {/* Right Image */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop" 
              alt="Team collaboration" 
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Floating stats card */}
          <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-saree-teal rounded-full w-12 h-12 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">14+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHeroSection

