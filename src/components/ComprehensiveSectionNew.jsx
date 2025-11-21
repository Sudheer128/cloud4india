import React from 'react'
import { useComprehensiveSectionContent } from '../hooks/useCMS'
import LoadingSpinner from './LoadingSpinner'

// Icon components based on icon_type
const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const LightningIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const CheckmarkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

// Icon mapping
const iconMap = {
  'chart': ChartIcon,
  'users': UsersIcon,
  'lightning': LightningIcon,
  'checkmark': CheckmarkIcon
}

const ComprehensiveSectionNew = () => {
  const { data, loading, error } = useComprehensiveSectionContent()

  // Default fallback data
  const defaultHeader = {
    title: 'The most comprehensive cloud platform',
    description: 'From infrastructure technologies like compute, storage, and databases to emerging technologies like machine learning, artificial intelligence, and data analytics.'
  }

  const defaultFeatures = [
    {
      id: 1,
      title: 'Scale with confidence',
      description: 'Cloud4India has the most operational experience, at greater scale, of any cloud provider',
      button_text: '10+ years of experience',
      icon_type: 'chart'
    },
    {
      id: 2,
      title: 'Trusted by millions',
      description: 'Join millions of customers who trust Cloud4India to power their businesses',
      button_text: '1M+ active customers',
      icon_type: 'users'
    },
    {
      id: 3,
      title: 'Fast and reliable',
      description: '99.99% availability SLA with global infrastructure and redundancy',
      button_text: '99.99% uptime',
      icon_type: 'lightning'
    },
    {
      id: 4,
      title: 'Industry recognition',
      description: 'Recognized as a leader in cloud infrastructure and innovation',
      button_text: 'Top rated provider',
      icon_type: 'checkmark'
    }
  ]

  const defaultStats = [
    { id: 1, value: '200+', label: 'Cloud Services' },
    { id: 2, value: '120', label: 'Availability Zones' },
    { id: 3, value: '38', label: 'Geographic Regions' },
    { id: 4, value: '500+', label: 'Edge Locations' }
  ]

  // Use CMS data or fallback to defaults
  const header = data?.header || defaultHeader
  const features = data?.features || defaultFeatures
  const stats = data?.stats || defaultStats

  // Render icon based on icon_type
  const renderIcon = (iconType) => {
    const IconComponent = iconMap[iconType] || ChartIcon
    return <IconComponent className="w-10 h-10 text-white" />
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </section>
    )
  }

  if (error) {
    console.error('Error loading comprehensive section:', error)
    // Continue with default data on error
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {header.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {header.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="bg-saree-teal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {renderIcon(feature.icon_type)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed clamp-3">
                {feature.description}
              </p>
              {feature.button_text && (
                <div className="inline-flex items-center px-4 py-2 bg-saree-teal text-white rounded-full text-sm font-medium hover:bg-saree-teal-dark transition-all duration-300 transform hover:scale-105 shadow-md">
                  {feature.button_text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="group bg-white rounded-xl p-6 hover:scale-105 transition-transform duration-300 border border-gray-200">
              <div className="text-3xl md:text-4xl font-bold text-saree-amber mb-2">{stat.value}</div>
              <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ComprehensiveSectionNew
