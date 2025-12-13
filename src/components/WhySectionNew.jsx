import React, { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useWhyItems, useHomepageContent } from '../hooks/useCMS'
import { ContentWrapper } from './LoadingComponents'

const WhySectionNew = () => {
  const [expandedItem, setExpandedItem] = useState(null)
  const { data: whyItems, loading, error, refetch } = useWhyItems()
  const { data: homepageData } = useHomepageContent()

  const toggleExpanded = (id) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  const getColorClasses = () => {
    return {
      border: 'border-saree-teal',
      bg: 'bg-white',
      text: 'text-saree-teal',
      hover: 'hover:bg-gray-50'
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side - Why Cloud4India */}
          <div>
            <h2 className="text-4xl font-light text-gray-900 mb-8">
              {homepageData?.sectionsConfig?.why?.heading || 'Why Cloud4India?'}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {homepageData?.sectionsConfig?.why?.description || 'Cloud4India is India\'s most comprehensive and broadly adopted cloud platform. Millions of customers—including the fastest-growing startups, largest enterprises, and leading government agencies—use Cloud4India to be more agile, lower costs, and innovate faster.'}
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
            <div className="space-y-2">
              {whyItems?.map((item) => {
                const colors = getColorClasses()
                
                return (
                  <div key={item.id} className={`border-l-4 ${colors.border} ${colors.bg} rounded-r-lg overflow-hidden border border-gray-200`}>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex justify-between items-center py-4 px-4 text-left ${colors.hover} transition-colors duration-200`}
                    >
                      <h3 className="text-lg font-medium text-gray-900 pr-4">
                        {item.title}
                      </h3>
                      <div className="flex-shrink-0">
                        {expandedItem === item.id ? (
                          <MinusIcon className={`h-5 w-5 ${colors.text}`} />
                        ) : (
                          <PlusIcon className={`h-5 w-5 ${colors.text}`} />
                        )}
                      </div>
                    </button>
                    
                    {expandedItem === item.id && (
                      <div className="pb-6 px-4 animate-fadeIn">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {item.content}
                        </p>
                        <a 
                          href="#" 
                          className={`${colors.text} font-semibold underline`}
                        >
                          {item.link}
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ContentWrapper>
        </div>
      </div>
    </section>
  )
}

export default WhySectionNew
