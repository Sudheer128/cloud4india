import React from 'react'

const ComprehensiveSectionNew = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            The most comprehensive cloud platform
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            From infrastructure technologies like compute, storage, and databases to emerging 
            technologies like machine learning, artificial intelligence, and data analytics.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Scale with confidence */}
          <div className="text-center group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="bg-saree-teal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Scale with confidence</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              <span className="block">Cloud4India has the most operational experience,</span>
              <span className="block">at greater scale,</span>
              <span className="block">of any cloud provider</span>
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-saree-teal text-white rounded-full text-sm font-medium hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-md">
              10+ years of experience
            </div>
          </div>

          {/* Trusted by millions */}
          <div className="text-center group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="bg-saree-teal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted by millions</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              <span className="block">Join millions of customers</span>
              <span className="block">who trust Cloud4India</span>
              <span className="block">to power their businesses</span>
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-saree-teal text-white rounded-full text-sm font-medium hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-md">
              1M+ active customers
            </div>
          </div>

          {/* Fast and reliable */}
          <div className="text-center group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="bg-saree-teal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast and reliable</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              <span className="block">99.99% availability SLA</span>
              <span className="block">with global infrastructure</span>
              <span className="block">and redundancy</span>
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-saree-teal text-white rounded-full text-sm font-medium hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-md">
              99.99% uptime
            </div>
          </div>

          {/* Industry recognition */}
          <div className="text-center group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="bg-saree-teal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry recognition</h3>
            <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
              <span className="block">Recognized as a leader</span>
              <span className="block">in cloud infrastructure</span>
              <span className="block">and innovation</span>
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-saree-teal text-white rounded-full text-sm font-medium hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-md">
              Top rated provider
            </div>
          </div>

        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group bg-white rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-saree-amber mb-2">200+</div>
            <div className="text-sm text-gray-700 font-medium">Cloud Services</div>
          </div>
          <div className="group bg-white rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-saree-amber mb-2">120</div>
            <div className="text-sm text-gray-700 font-medium">Availability Zones</div>
          </div>
          <div className="group bg-white rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-saree-amber mb-2">38</div>
            <div className="text-sm text-gray-700 font-medium">Geographic Regions</div>
          </div>
          <div className="group bg-white rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
            <div className="text-3xl md:text-4xl font-bold text-saree-amber mb-2">500+</div>
            <div className="text-sm text-gray-700 font-medium">Edge Locations</div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ComprehensiveSectionNew
