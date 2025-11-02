import React from 'react'

const ComprehensiveSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            The most comprehensive cloud platform
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From infrastructure technologies like compute, storage, and databases to emerging 
            technologies like machine learning, artificial intelligence, and data analytics.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Scale with confidence */}
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Scale with confidence</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              Cloud4India has the most operational experience, at greater scale, of any cloud provider
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-400 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
              10+ years of experience
            </div>
          </div>

          {/* Trusted by millions */}
          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted by millions</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              Join millions of customers who trust Cloud4India to power their businesses
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-purple-400 text-white rounded-full text-sm font-medium hover:bg-purple-600 transition-all duration-300 transform hover:scale-105">
              1M+ active customers
            </div>
          </div>

          {/* Fast and reliable */}
          <div className="text-center group">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast and reliable</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              99.99% availability SLA with global infrastructure and redundancy
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-orange-400 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
              99.99% uptime
            </div>
          </div>

          {/* Industry recognition */}
          <div className="text-center group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry recognition</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              Recognized as a leader in cloud infrastructure and innovation
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-400 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-all duration-300 transform hover:scale-105">
              Top rated provider
            </div>
          </div>

        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">200+</div>
            <div className="text-sm text-gray-600">Cloud Services</div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2 group-hover:scale-110 transition-transform duration-300">120</div>
            <div className="text-sm text-gray-600">Availability Zones</div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2 group-hover:scale-110 transition-transform duration-300">38</div>
            <div className="text-sm text-gray-600">Geographic Regions</div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div className="text-sm text-gray-600">Edge Locations</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Start building today
            </button>
            <button className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-500 px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
              Learn more
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ComprehensiveSection
