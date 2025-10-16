import React, { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

const InfrastructureSection = () => {
  const [selectedRegion, setSelectedRegion] = useState('North America')
  const [expandedSection, setExpandedSection] = useState(null)

  const regions = [
    'North America',
    'South America', 
    'Europe',
    'Middle East',
    'Africa',
    'Asia Pacific',
    'Australia and New Zealand'
  ]

  const regionData = {
    'North America': {
      geographicRegions: 9,
      edgeLocations: 31,
      details: {
        availabilityZones: 31,
        description: 'The Cloud4India Cloud in North America has 31 Availability Zones within 9 Geographic Regions, with 31 Edge Network Locations and 3 Edge Cache Locations.',
        regions: [
          'Cloud4India GovCloud (US-East)',
          'Cloud4India GovCloud (US-West)',
          'Canada (Central)',
          'Canada West (Calgary)',
          'Mexico (Central)',
          'US West (Northern California)',
          'US East (Northern Virginia)',
          'US East (Ohio)',
          'US West (Oregon)'
        ],
        cities: [
          'Ashburn, VA', 'Atlanta GA', 'Boston, MA', 'Chicago, IL', 'Columbus, OH',
          'Dallas/Fort Worth, TX', 'Denver, CO', 'Hayward, CA', 'Houston, TX',
          'Jacksonville, FL', 'Kansas City, MO', 'Los Angeles, CA', 'Miami, FL',
          'Minneapolis, MN', 'Montreal, QC', 'Nashville, TN', 'New York, NY',
          'Newark, NJ', 'Palo Alto, CA', 'Phoenix, AZ', 'Philadelphia, PA',
          'Portland, OR', 'Queretaro, MX', 'Salt Lake City, UT', 'San Jose, CA',
          'Seattle, WA', 'South Bend, IN', 'St. Louis, MO', 'Tampa Bay, FL',
          'Toronto, ON', 'Washington D.C.'
        ]
      }
    },
    'Asia Pacific': {
      geographicRegions: 10,
      edgeLocations: 45,
      details: {
        availabilityZones: 35,
        description: 'The Cloud4India Cloud in Asia Pacific has 35 Availability Zones within 10 Geographic Regions, with 45 Edge Network Locations and 8 Edge Cache Locations.',
        regions: [
          'Mumbai (ap-south-1)',
          'Delhi NCR (ap-north-1)',
          'Singapore (ap-southeast-1)',
          'Sydney (ap-southeast-2)',
          'Tokyo (ap-northeast-1)',
          'Seoul (ap-northeast-2)',
          'Osaka (ap-northeast-3)',
          'Hong Kong (ap-east-1)',
          'Jakarta (ap-southeast-3)',
          'Melbourne (ap-southeast-4)'
        ],
        cities: [
          'Mumbai, IN', 'Delhi, IN', 'Bangalore, IN', 'Chennai, IN', 'Hyderabad, IN',
          'Singapore, SG', 'Sydney, AU', 'Melbourne, AU', 'Tokyo, JP', 'Osaka, JP',
          'Seoul, KR', 'Hong Kong, HK', 'Jakarta, ID', 'Kuala Lumpur, MY',
          'Manila, PH', 'Bangkok, TH', 'Ho Chi Minh City, VN', 'Taipei, TW'
        ]
      }
    }
  }

  const toggleExpansion = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Cloud4India Global Infrastructure</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            The Cloud4India Cloud spans 120 Availability Zones within 38 Geographic Regions, with announced 
            plans for 10 more Availability Zones and 3 more Cloud4India Regions in the Kingdom of Saudi Arabia, 
            Chile, and the Cloud4India European Sovereign Cloud.
          </p>
        </div>

        {/* Region Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedRegion === region
                  ? 'bg-purple-100 text-purple-800 border-2 border-purple-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Infrastructure Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Region Details */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Cloud4India Coverage Regions</h3>
              <h4 className="text-2xl font-semibold text-gray-900">{selectedRegion}</h4>
            </div>

            {regionData[selectedRegion] && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Geographic Regions</h5>
                    <p className="text-3xl font-bold text-gray-900">{regionData[selectedRegion].geographicRegions}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Edge Locations</h5>
                    <p className="text-3xl font-bold text-gray-900">{regionData[selectedRegion].edgeLocations}</p>
                  </div>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-4">
                  {/* Geographic Regions */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleExpansion('regions')}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">Geographic Regions</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{regionData[selectedRegion].geographicRegions}</span>
                        {expandedSection === 'regions' ? (
                          <MinusIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <PlusIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </button>
                    
                    {expandedSection === 'regions' && (
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 gap-2 mt-4">
                          {regionData[selectedRegion].details.regions.map((region, index) => (
                            <div key={index} className="flex justify-between items-center py-2">
                              <span className="text-sm text-gray-700">{region}</span>
                              <span className="text-xs text-green-600 font-medium">Available</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edge Locations */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleExpansion('edge')}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">Edge Locations</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{regionData[selectedRegion].edgeLocations}</span>
                        {expandedSection === 'edge' ? (
                          <MinusIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <PlusIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </button>
                    
                    {expandedSection === 'edge' && (
                      <div className="px-4 pb-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mt-4 mb-4">
                          {regionData[selectedRegion].details.description}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {regionData[selectedRegion].details.cities.map((city, index) => (
                            <span key={index} className="text-sm text-gray-700 py-1">
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Side - Infrastructure Stats */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 min-h-[500px]">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Global Coverage</h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-blue-500 mb-2">120+</div>
                  <div className="text-sm text-gray-600">Availability Zones</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-green-500 mb-2">38</div>
                  <div className="text-sm text-gray-600">Geographic Regions</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-orange-500 mb-2">99.99%</div>
                  <div className="text-sm text-gray-600">Uptime SLA</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-purple-500 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Edge Locations</div>
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">North America</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">31</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Asia Pacific</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">45</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Europe</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '35%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">28</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Other Regions</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">16</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfrastructureSection
