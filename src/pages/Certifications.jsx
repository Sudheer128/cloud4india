import React from 'react'

const Certifications = () => {
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
            Certifications
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            At our data center, Cloud 4 India india prioritize the safety and security of your data. That's why we have obtained all the necessary DC certificates that a data center requires to operate. Our certifications are a testament to our commitment to excellence and our dedication to providing the highest quality service to our clients. You can trust us to provide a secure and reliable environment for your data. We take pride and continue to work hard to maintain them, ensuring that we are always up-to-date with the latest industry standards and best practices.
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

      {/* Certification Badges Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* ISO 9001:2015 */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/certifications/iso-9001-2015.png" 
                  alt="ISO 9001:2015 Certified" 
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">ISO 9001:2015</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">ISO 9001:2015</p>
            </div>

            {/* ISO 20000 */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/certifications/iso-20000.png" 
                  alt="ISO 20000 Certified" 
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">ISO 20000</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">ISO 20000</p>
            </div>

            {/* PCI DSS Compliant */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/certifications/pci-dss-compliant.png" 
                  alt="PCI DSS Compliant" 
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">PCI DSS Compliant</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">PCI DSS Compliant</p>
            </div>

            {/* AICPA SOC */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/certifications/aicpa-soc.png" 
                  alt="AICPA SOC Certified" 
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">AICPA SOC</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">AICPA SOC</p>
            </div>

            {/* AICPA SOC 2 */}
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="w-full max-w-[200px] h-auto mb-4">
                <img 
                  src="/images/certifications/aicpa-soc-2.png" 
                  alt="AICPA SOC 2 Certified" 
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-[200px] bg-gray-100 rounded-lg">
                  <span className="text-gray-400 text-sm">AICPA SOC 2</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 text-center">AICPA SOC 2</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Support Given */}
            <div className="text-center p-8 bg-gradient-to-br from-saree-teal-light/20 to-saree-amber-light/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-saree-teal mb-2">2M+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Support Given</div>
            </div>

            {/* Clients Rating */}
            <div className="text-center p-8 bg-gradient-to-br from-saree-amber-light/20 to-saree-lime-light/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-saree-amber mb-2">254+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Clients Rating</div>
            </div>

            {/* Money Saved */}
            <div className="text-center p-8 bg-gradient-to-br from-saree-lime-light/20 to-phulkari-turquoise-light/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-saree-lime mb-2">20M+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Money Saved</div>
            </div>

            {/* Connected Device */}
            <div className="text-center p-8 bg-gradient-to-br from-phulkari-turquoise-light/20 to-saree-rose-light/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-phulkari-turquoise mb-2">50K+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Connected Device</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-saree-lime-light/20 via-white to-saree-rose-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hear from Our Satisfied Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 - Cevious Technologies */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-saree-teal-light rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  CT
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Cevious Technologies</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "A reliable company to host cloud servers and have good expertise and command over remote access tools."
              </p>
            </div>

            {/* Testimonial 2 - Rohit Kumar */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-saree-amber-light rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  RK
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Rohit Kumar</div>
                  <div className="text-sm text-gray-600">Head - IT - Trustline Securities Ltd.</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "As the Head of IT at Trustline Securities Ltd., I highly recommend Cloud 4 India Private Limited for their exceptional email services. For over 15 years, we've relied on their 99.99% uptime and outstanding support, critical to our operations. What sets them apart is their personalised approach—promptly addressing challenges and making us feel valued as customers. Cloud 4 India is more than a service provider; they are a trusted partner in our success."
              </p>
            </div>

            {/* Testimonial 3 - Furacle Pvt Ltd */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-saree-lime-light rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  FP
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Furacle Pvt Ltd</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "I have received 99.95% uptime on my Smart Dedicated server and have been satisfied with the support services received from Cloud 4 India. They have been cost effective and the gold processors are best in performance."
              </p>
            </div>

            {/* Testimonial 4 - Abhinav IT Solution */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-phulkari-turquoise-light rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  AI
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Abhinav IT Solution</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "We use cloud servers from Cloud 4 India and we provide ERP services to various customers over their platform. They have provided us 100% uptime in past 2 years."
              </p>
            </div>

            {/* Testimonial 5 - DBS Tech Solution */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-saree-teal">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-saree-rose-light rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  DS
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">DBS Tech Solution</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "Hosted a dedicated server with Cloud 4 India and have been satisfied with the performance of the machine, we have received 100% uptime in past 2 years with WSI Dedicated Hosting."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Certifications

