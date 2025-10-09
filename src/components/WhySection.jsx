import React, { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useWhyItems } from '../hooks/useCMS'
import { ContentWrapper } from './LoadingComponents'

const WhySection = () => {
  const [expandedItem, setExpandedItem] = useState(null)
  const { data: whyItems, loading, error, refetch } = useWhyItems()

  const toggleExpanded = (id) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side - Why Cloud4India */}
          <div>
            <h2 className="text-4xl font-light text-gray-900 mb-8">Why Cloud4India?</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Cloud4India is India's most comprehensive and broadly adopted cloud platform. 
              Millions of customers—including the fastest-growing startups, largest enterprises, 
              and leading government agencies—use Cloud4India to be more agile, lower costs, 
              and innovate faster.
            </p>
          </div>

          {/* Right Side - Expandable Items */}
          <ContentWrapper 
            loading={loading} 
            error={error} 
            data={whyItems} 
            onRetry={refetch}
            loadingText="Loading why items..."
            emptyMessage="Why items not available"
          >
            <div className="space-y-4">
              {whyItems?.map((item) => (
                <div key={item.id} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {item.title}
                    </h3>
                    <div className="flex-shrink-0">
                      {expandedItem === item.id ? (
                        <MinusIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {expandedItem === item.id && (
                    <div className="pb-6 pr-8 animate-fadeIn">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {item.content}
                      </p>
                      <a 
                        href="#" 
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                      >
                        {item.link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ContentWrapper>
        </div>
      </div>
    </section>
  )
}

export default WhySection
