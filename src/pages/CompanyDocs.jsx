import React, { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const CompanyDocs = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageTitle, setImageTitle] = useState('')

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
        setImageTitle('')
      }
    }
    if (selectedImage) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  const openModal = (imageSrc, title) => {
    setSelectedImage(imageSrc)
    setImageTitle(title)
  }

  const closeModal = () => {
    setSelectedImage(null)
    setImageTitle('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saree-teal-light/30 via-white to-saree-amber-light/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white/30 rounded-full"></div>
          <div className="absolute top-20 right-20 w-60 h-60 border-4 border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-white/20 rounded-lg rotate-45"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
            Company Docs
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Cloud 4 India is a legally established and compliant organization operating in India. We maintain all necessary company documents and registrations required for business operations. Our company documentation includes GST registration, establishment certificate, PAN card, company registration documents, and other statutory compliances. These documents demonstrate our commitment to transparency, legal compliance, and ethical business practices. We ensure all our company documents are up-to-date and in accordance with Indian regulations, providing our clients with confidence in our legitimacy and reliability as a trusted cloud infrastructure provider.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </div>
      </section>

      {/* Company Documents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* GST Registration */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal cursor-pointer" onClick={() => openModal('/images/company-docs/GST_page.jpg', 'GST Registration')}>
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/company-docs/GST_page.jpg" 
                  alt="GST Registration Certificate" 
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">GST Registration</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">GST Registration</p>
            </div>

            {/* Udyam Registration */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal cursor-pointer" onClick={() => openModal('/images/company-docs/Udyam%20Registration%20Certificate_page.jpg', 'Udyam Registration')}>
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/company-docs/Udyam%20Registration%20Certificate_page.jpg" 
                  alt="Udyam Registration Certificate" 
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">Udyam Registration</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">Udyam Registration</p>
            </div>

            {/* Establishment Certificate */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal cursor-pointer" onClick={() => openModal('/images/company-docs/shop%26establishment_page.jpg', 'Establishment Certificate')}>
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/company-docs/shop%26establishment_page.jpg" 
                  alt="Establishment Certificate" 
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">Establishment Certificate</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">Establishment Certificate</p>
            </div>

            {/* PAN Card */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal cursor-pointer" onClick={() => openModal('/images/company-docs/C4I%20PAN_page.jpg', 'PAN Card')}>
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/company-docs/C4I%20PAN_page.jpg" 
                  alt="PAN Card" 
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">PAN Card</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">PAN Card</p>
            </div>

            {/* Startup India Certificate */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal cursor-pointer" onClick={() => openModal('/images/company-docs/Startup%20C4I%20SOLUTIONS%20LLP_page.jpg', 'Startup India Certificate')}>
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/company-docs/Startup%20C4I%20SOLUTIONS%20LLP_page.jpg" 
                  alt="Startup India Certificate" 
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">Startup India Certificate</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">Startup India Certificate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6 text-gray-800" />
            </button>

            {/* Image Title */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg px-4 py-2 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">{imageTitle}</h3>
            </div>

            {/* Zoomed Image */}
            <img 
              src={selectedImage} 
              alt={imageTitle}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyDocs

