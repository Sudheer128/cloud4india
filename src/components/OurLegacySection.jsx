import React, { useState } from 'react'

const OurLegacySection = () => {
  const [activeYear, setActiveYear] = useState('2010')
  
  const milestones = {
    '2010': {
      title: 'Inception and Start of services',
      description: 'Cloud 4 India was founded with a vision to provide reliable and affordable cloud infrastructure solutions.'
    },
    '2015': {
      title: 'Remote Infrastructure management services',
      description: 'Expanded our offerings to include comprehensive remote infrastructure management for enterprises.'
    },
    '2019': {
      title: 'Launched Tally On Cloud + Application As A Service and serving over 1+ million users',
      description: 'Successfully launched cloud-based Tally solutions and reached a milestone of 1+ million satisfied users.'
    },
    '2022': {
      title: 'Launch of Self Service portal, Cloud Automation, Market Place and complete SDN stack',
      description: 'Introduced cutting-edge automation tools and a comprehensive SDN infrastructure for enhanced customer experience.'
    },
    '2024': {
      title: 'Started operations in USA',
      description: 'Expanded our global footprint by establishing operations in the United States market.'
    }
  }
  
  const stats = [
    { label: 'Support Given', value: '2M+' },
    { label: 'Clients Rating', value: '254+' },
    { label: 'Money Saved', value: '20M+' },
    { label: 'Connected Device', value: '50K+' }
  ]
  
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Our Legacy
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            With strategically located global data centres, we empower you to host your VPS exactly where it's needed most. Partner with a hosting provider that not only delivers excellence but also champions sustainability for a better future.
          </p>
        </div>
        
        {/* Timeline */}
        <div className="mb-16 bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-200">
          {/* Timeline Bar */}
          <div className="relative mb-12">
            {/* Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-saree-teal/30 -translate-y-1/2 rounded-full"></div>
            
            {/* Year Markers */}
            <div className="relative flex justify-between items-center px-4">
              {Object.keys(milestones).map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className="relative flex flex-col items-center group"
                >
                  {/* Year Label */}
                  <div className={`mb-4 px-4 py-2 rounded-full transition-all duration-300 shadow-md ${
                    activeYear === year 
                      ? 'bg-saree-teal text-white scale-110 shadow-xl' 
                      : 'bg-white text-gray-900 group-hover:bg-saree-teal/10'
                  }`}>
                    <span className="font-bold">{year}</span>
                  </div>
                  
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 border-4 ${
                    activeYear === year 
                      ? 'bg-saree-teal border-white scale-150 shadow-lg' 
                      : 'bg-gray-200 border-white group-hover:bg-saree-teal/50'
                  }`}></div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Milestone Description */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {milestones[activeYear].title}
            </h3>
            <p className="text-gray-700 text-lg">
              {milestones[activeYear].description}
            </p>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white text-center rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-gray-600 text-sm mb-2 font-medium">{stat.label}</p>
              <p className="text-4xl md:text-5xl font-bold text-saree-teal">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurLegacySection

