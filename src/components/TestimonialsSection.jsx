import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const TestimonialsSection = () => {
  const [currentPage, setCurrentPage] = useState(0)
  
  const testimonials = [
    [
      {
        quote: "A reliable company to host cloud servers and have good expertise and command over remote access tools.",
        company: "Cevious Technologies",
        author: ""
      },
      {
        quote: "As the Head of IT at Trustline Securities Ltd., I highly recommend Cloud 4 India Private Limited for their exceptional email services. For over 15 years, we've relied on their 99.99% uptime and outstanding support, critical to our operations.\n\nWhat sets them apart is their personalised approach — promptly addressing challenges and making us feel valued as customers. Cloud 4 India is more than a service provider; they are a trusted partner in our success.",
        company: "",
        author: "Rohit Kumar – Head – IT – Trustline Securities Ltd."
      }
    ],
    [
      {
        quote: "I have received 99.95% uptime on my Smart Dedicated server and have been satisfied with the support services received from Cloud 4 India. They have been cost effective and the gold processors are best in performance.",
        company: "Furacle Pvt Ltd",
        author: ""
      },
      {
        quote: "We use cloud servers from Cloud 4 India and we provide ERP services to various customers over their platform. They have provided us 100% uptime in past 2 years.",
        company: "Abhinav IT Solution",
        author: ""
      }
    ]
  ]
  
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
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Hear from Our Satisfied Customers
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            See what our clients say about working with Cloud 4 India
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {testimonials[currentPage].map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 text-gray-900 rounded-2xl p-8 border-l-4 border-saree-teal shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <svg className="w-10 h-10 text-saree-teal/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                {testimonial.quote}
              </p>
              
              <div className="border-t border-gray-300 pt-4">
                {testimonial.company && (
                  <p className="font-bold text-saree-teal">{testimonial.company}</p>
                )}
                {testimonial.author && (
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation */}
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
        
        {/* Rating Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-700 text-lg mb-6 font-medium">
            Ranked among the top server providers in the industry on
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3 bg-white px-8 py-4 rounded-xl border-2 border-gray-200 shadow-lg">
              <div className="w-12 h-12 bg-saree-amber rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-3xl font-bold text-gray-900">4.7/5</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-8 py-4 rounded-xl border-2 border-gray-200 shadow-lg">
              <svg className="w-10 h-10 text-saree-lime" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600 font-medium">Trustpilot</span>
                <span className="text-3xl font-bold text-gray-900">4.7/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection

