import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { getAboutUsContent } from '../services/cmsApi'

const TestimonialsSection = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAboutUsContent()
        setContent({
          section: data.testimonialsSection || {},
          testimonials: data.testimonials || [],
          ratings: data.ratings || []
        })
      } catch (error) {
        console.error('Error fetching About Us testimonials content:', error)
        setContent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  // Hide section if content is missing or is_visible is 0
  if (!content || (content.section && content.section.is_visible === 0)) {
    return null
  }
  
  // If section header data is missing but testimonials/ratings exist, section is hidden
  // When section is hidden, backend returns { testimonials: [...], ratings: [...] } without section header
  if (!content.section || (!content.section.header_title && !content.section.header_description && content.section.is_visible === undefined)) {
    return null
  }

  // Group testimonials by page_index if they're not already grouped
  let testimonials = content.testimonials || []
  if (testimonials.length > 0 && !Array.isArray(testimonials[0])) {
    // Group testimonials by page_index
    const grouped = {}
    testimonials.forEach(testimonial => {
      const pageIndex = testimonial.page_index || 0
      if (!grouped[pageIndex]) {
        grouped[pageIndex] = []
      }
      grouped[pageIndex].push(testimonial)
    })
    testimonials = Object.values(grouped)
  }

  const ratings = content.ratings || []
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % testimonials.length)
  }
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {content.section.header_title && (
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              {content.section.header_title}
            </h2>
          )}
          {content.section.header_description && (
            <p className="text-base text-gray-700 max-w-3xl mx-auto">
              {content.section.header_description}
            </p>
          )}
        </div>
        
        {/* Testimonials Grid */}
        {testimonials.length > 0 && testimonials[currentPage] && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {testimonials[currentPage].map((testimonial, index) => (
              <div 
                key={testimonial.id || index} 
                className="bg-gray-50 text-gray-900 rounded-2xl p-8 border-l-4 border-saree-teal shadow-lg hover:shadow-2xl hover:bg-white hover:border-l-8 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="mb-6">
                  <svg className="w-10 h-10 text-saree-teal/50 group-hover:text-saree-teal group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                
                <p className="text-sm text-gray-700 mb-6 leading-relaxed whitespace-pre-line group-hover:text-gray-900 transition-colors duration-300">
                  {testimonial.quote}
                </p>
                
                <div className="border-t border-gray-300 pt-4 group-hover:border-saree-teal transition-colors duration-300">
                  {testimonial.company && (
                    <p className="font-bold text-saree-teal group-hover:text-saree-teal-dark transition-colors duration-300">{testimonial.company}</p>
                  )}
                  {testimonial.author && (
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={prevPage}
              className="bg-saree-teal hover:bg-saree-teal-dark text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Previous testimonials"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === index 
                      ? 'bg-saree-teal w-8 shadow-md' 
                      : 'bg-gray-300 hover:bg-saree-teal/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextPage}
              className="bg-saree-teal hover:bg-saree-teal-dark text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Next testimonials"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        )}
        
        {/* Rating Section */}
        {ratings.length > 0 && (
          <div className="mt-16 text-center">
            <p className="text-gray-700 text-base mb-6 font-medium">
              Ranked among the top server providers in the industry on
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {ratings.map((rating, index) => (
                <div key={rating.id || index} className="flex items-center gap-3 bg-white px-8 py-4 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-saree-amber hover:bg-saree-amber-light hover:scale-110 transition-all duration-300 group">
                  {rating.platform_icon === 'G' ? (
                    <div className="w-12 h-12 bg-saree-amber rounded-full flex items-center justify-center group-hover:bg-saree-amber-dark transition-colors duration-300">
                      <span className="text-white font-bold text-xl">{rating.platform_icon}</span>
                    </div>
                  ) : (
                    <svg className="w-10 h-10 text-saree-lime group-hover:text-saree-lime-dark group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors duration-300">{rating.platform}</span>
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-saree-lime-dark transition-colors duration-300">{rating.rating_value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsSection
