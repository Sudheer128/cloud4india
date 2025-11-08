import React from 'react'

const DataCentersSection = () => {
  const locations = [
    { name: 'London', lat: 51.5, lng: -0.1, flag: '🇬🇧' },
    { name: 'Chennai', lat: 13.1, lng: 80.3, flag: '🇮🇳' }
  ]
  
  const stats = [
    { label: '12+ Countries', description: 'We serve customers in.' },
    { label: '99.99% Uptime', description: 'SLA for VMs & Hybrid Servers.' },
    { label: '3 Datacenters', description: 'World class facilities.' },
    { label: '> 25K+ VMs', description: 'Launched over time.' }
  ]
  
  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Global Data Centers
          </h2>
          <p className="text-base text-gray-700 max-w-3xl mx-auto">
            Serving customers worldwide with strategically located data centers
          </p>
        </div>
        
        {/* Map Section */}
        <div className="relative mb-16 bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200 hover:border-saree-teal hover:shadow-2xl transition-all duration-300 min-h-[400px]">
          {/* World Map Dotted Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 60 }).map((_, i) => 
                Array.from({ length: 120 }).map((_, j) => (
                  <circle 
                    key={`${i}-${j}`} 
                    cx={j * 10 + 5} 
                    cy={i * 10 + 5} 
                    r="1" 
                    fill="#12A7A7"
                  />
                ))
              )}
            </svg>
          </div>
          
          {/* Location Markers */}
          <div className="relative h-[400px]">
            {/* London Marker */}
            <div className="absolute" style={{ left: '35%', top: '25%' }}>
              <div className="relative group">
                <div className="w-5 h-5 bg-saree-teal rounded-full animate-pulse cursor-pointer shadow-lg"></div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-saree-teal whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{locations[0].flag}</span>
                    <span className="font-semibold text-gray-900">{locations[0].name}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chennai Marker */}
            <div className="absolute" style={{ left: '65%', top: '45%' }}>
              <div className="relative group">
                <div className="w-5 h-5 bg-saree-teal rounded-full animate-pulse cursor-pointer shadow-lg"></div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-saree-teal whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{locations[1].flag}</span>
                    <span className="font-semibold text-gray-900">{locations[1].name}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional location dots */}
            <div className="absolute w-3 h-3 bg-saree-teal/60 rounded-full" style={{ left: '15%', top: '40%' }}></div>
            <div className="absolute w-3 h-3 bg-saree-teal/60 rounded-full" style={{ left: '70%', top: '30%' }}></div>
            <div className="absolute w-3 h-3 bg-saree-teal/60 rounded-full" style={{ left: '75%', top: '50%' }}></div>
            <div className="absolute w-3 h-3 bg-saree-teal/60 rounded-full" style={{ left: '72%', top: '55%' }}></div>
            <div className="absolute w-3 h-3 bg-saree-teal/60 rounded-full" style={{ left: '78%', top: '48%' }}></div>
            <div className="absolute w-3 h-3 bg-saree-teal/60 rounded-full" style={{ left: '68%', top: '60%' }}></div>
          </div>
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const colors = [
              { bg: 'hover:bg-phulkari-turquoise-light', border: 'hover:border-phulkari-turquoise', title: 'group-hover:text-phulkari-turquoise' },
              { bg: 'hover:bg-phulkari-gold-light', border: 'hover:border-phulkari-gold', title: 'group-hover:text-phulkari-gold-dark' },
              { bg: 'hover:bg-phulkari-lime-light', border: 'hover:border-phulkari-lime', title: 'group-hover:text-phulkari-lime-dark' },
              { bg: 'hover:bg-saree-teal-light', border: 'hover:border-saree-teal', title: 'group-hover:text-saree-teal-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={index} className={`bg-white text-center rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-2xl ${color.bg} ${color.border} hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                <h3 className={`text-xl md:text-2xl font-bold text-gray-900 mb-2 ${color.title} transition-colors duration-300`}>{stat.label}</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{stat.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default DataCentersSection

