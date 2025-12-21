import React, { useState, useEffect, useRef } from 'react'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import {
  getContactUsContent,
  verifyPhoneEmail,
  checkPhoneVerification,
  submitContactForm
} from '../services/cmsApi'

const ContactUs = () => {
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Phone.Email Verification States
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneVerificationData, setPhoneVerificationData] = useState(null)
  const [verificationTimestamp, setVerificationTimestamp] = useState(null)
  const [verificationError, setVerificationError] = useState(null)
  const phoneEmailWidgetRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchContactData()

    // Define Phone.Email listener (must be global)
    window.phoneEmailListener = function (userObj) {
      const user_json_url = userObj.user_json_url
      console.log('✅ Phone.Email verification successful!', user_json_url)
      console.log('📱 User object:', userObj)

      // Verify with backend
      handlePhoneEmailVerification(user_json_url)
    }

    // Also define as phoneEmailListener (without window) for compatibility
    window.phoneEmailListener = window.phoneEmailListener

    // Listen for content updates from admin panel
    const handleContactPageUpdate = () => {
      console.log('🔄 Contact page updated, refreshing...')
      fetchContactData()
    }

    window.addEventListener('contactPageUpdated', handleContactPageUpdate)

    return () => {
      window.removeEventListener('contactPageUpdated', handleContactPageUpdate)
      // Don't remove phoneEmailListener as it's needed globally
    }
  }, [])

  // Load Phone.Email script and check if widget rendered
  useEffect(() => {
    if (phoneVerified) return // Don't load if already verified

    // Wait for the ref to be set
    const loadPhoneEmail = () => {
      if (!phoneEmailWidgetRef.current) {
        setTimeout(loadPhoneEmail, 100)
        return
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="phone.email/sign_in_button"]')

      if (!existingScript) {
        // Load the script - Phone.Email will auto-detect .pe_signin_button elements
        const script = document.createElement('script')
        script.src = "https://www.phone.email/sign_in_button_v1.js"
        script.async = true
        script.onload = () => {
          console.log('✅ Phone.Email script loaded successfully')
          // Phone.Email automatically finds and renders into .pe_signin_button elements
          setTimeout(() => {
            if (phoneEmailWidgetRef.current) {
              const widgetButton = phoneEmailWidgetRef.current.querySelector('button, a, [role="button"], iframe, div[onclick]')
              if (widgetButton) {
                console.log('✅ Phone.Email widget rendered successfully')
              } else {
                console.log('⏳ Phone.Email widget may still be initializing...')
              }
            }
          }, 2000)
        }
        script.onerror = () => {
          console.error('❌ Failed to load Phone.Email script')
          setVerificationError('Failed to load phone verification. Please refresh the page.')
        }
        document.head.appendChild(script)
      } else {
        console.log('📱 Phone.Email script already loaded')
        // Script already loaded, widget should render automatically
        setTimeout(() => {
          if (phoneEmailWidgetRef.current) {
            const widgetButton = phoneEmailWidgetRef.current.querySelector('button, a, [role="button"], iframe, div[onclick]')
            if (widgetButton) {
              console.log('✅ Phone.Email widget found')
            }
          }
        }, 1000)
      }
    }

    // Start loading after component mounts
    setTimeout(loadPhoneEmail, 300)
  }, [phoneVerified])

  const fetchContactData = async () => {
    try {
      setLoading(true)
      const data = await getContactUsContent()
      setContactData(data)
    } catch (error) {
      console.error('Error fetching contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'map':
        return <MapPinIcon className="h-6 w-6" />
      case 'phone':
        return <PhoneIcon className="h-6 w-6" />
      case 'email':
        return <EnvelopeIcon className="h-6 w-6" />
      case 'clock':
        return <ClockIcon className="h-6 w-6" />
      default:
        return <MapPinIcon className="h-6 w-6" />
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    // Check if phone is already verified when phone changes
    if (e.target.name === 'phone') {
      checkPhoneVerificationStatus(e.target.value)
    }
  }

  const handlePhoneEmailVerification = async (user_json_url) => {
    try {
      setVerificationError(null)

      // Send user_json_url to backend for verification
      const result = await verifyPhoneEmail(user_json_url)

      if (result.verified) {
        setPhoneVerified(true)
        setPhoneVerificationData(result.phone_data)
        setVerificationTimestamp(result.verification_timestamp)

        // Update form phone field with verified phone
        if (result.phone_data) {
          const fullPhone = `${result.phone_data.user_country_code}${result.phone_data.user_phone_number}`
          setFormData(prev => ({ ...prev, phone: fullPhone }))
        }

        // Store in localStorage
        if (result.phone_data) {
          const phoneKey = `${result.phone_data.user_country_code}${result.phone_data.user_phone_number}`
          localStorage.setItem(`verified_phone_${phoneKey}`, JSON.stringify({
            verified: true,
            expires_at: result.expires_at,
            phone_data: result.phone_data
          }))
        }
      } else {
        setVerificationError('Phone verification failed. Please try again.')
      }
    } catch (error) {
      console.error('Error verifying phone:', error)
      setVerificationError(error.response?.data?.error || 'Failed to verify phone number. Please try again.')
    }
  }

  const checkPhoneVerificationStatus = async (phone) => {
    if (!phone || phone.length < 10) {
      setPhoneVerified(false)
      return
    }

    try {
      const result = await checkPhoneVerification(phone)
      if (result.verified) {
        setPhoneVerified(true)
        setVerificationTimestamp(result.expires_at)
      } else {
        setPhoneVerified(false)
      }
    } catch (error) {
      // Check localStorage as fallback
      const stored = localStorage.getItem(`verified_phone_${phone}`)
      if (stored) {
        const data = JSON.parse(stored)
        if (new Date(data.expires_at) > new Date()) {
          setPhoneVerified(true)
          setVerificationTimestamp(data.expires_at)
          if (data.phone_data) {
            setPhoneVerificationData(data.phone_data)
          }
        } else {
          localStorage.removeItem(`verified_phone_${phone}`)
          setPhoneVerified(false)
        }
      } else {
        setPhoneVerified(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if phone is verified
    if (!phoneVerified) {
      setVerificationError('Please verify your phone number before submitting')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setVerificationError(null)

    try {
      // Get IP address and user agent
      const ipAddress = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'unknown')

      const userAgent = navigator.userAgent

      // Use verified phone from Phone.Email if available
      const verifiedPhone = phoneVerificationData?.full_phone || formData.phone

      const submissionData = {
        ...formData,
        phone: verifiedPhone,
        phone_verified: true,
        verification_timestamp: verificationTimestamp || new Date().toISOString(),
        phone_data: phoneVerificationData, // Include Phone.Email verification data
        ip_address: ipAddress,
        user_agent: userAgent
      }

      await submitContactForm(submissionData)

      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setPhoneVerified(false)
      setPhoneVerificationData(null)
      setVerificationTimestamp(null)
      setVerificationError(null)

      // Reset status message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (error) {
      setIsSubmitting(false)
      setSubmitStatus('error')
      setVerificationError(error.response?.data?.error || 'Failed to submit form. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    )
  }

  const hero = contactData?.hero || {}
  const contactInfo = contactData?.items || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
            {hero.title ? (
              <>
                {hero.title.split(hero.highlighted_text || 'Touch')[0]}
                <span className="font-bold text-saree-amber">{hero.highlighted_text || 'Touch'}</span>
                {hero.title.split(hero.highlighted_text || 'Touch')[1]}
              </>
            ) : (
              <>
                Get in <span className="font-bold text-saree-amber">Touch</span>
              </>
            )}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {hero.description || "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  {hero.contact_section_title || 'Contact Information'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {hero.contact_section_description || "Reach out to us through any of these channels. We're here to help you with your cloud infrastructure needs."}
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.length > 0 ? (
                  contactInfo.map((info) => (
                    <div
                      key={info.id}
                      className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                        {getIcon(info.icon_type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <p className="text-gray-700 mb-1">
                          {info.content}
                        </p>
                        {info.sub_content && (
                          <p className="text-sm text-gray-600">
                            {info.sub_content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No contact information available.</p>
                )}
              </div>

              {/* Social Media Links */}
              {contactData?.socialLinks && contactData.socialLinks.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {hero.follow_us_title || 'Follow Us'}
                  </h3>
                  <div className="flex space-x-4">
                    {contactData.socialLinks.map((link) => {
                      const getIcon = () => {
                        switch (link.platform.toLowerCase()) {
                          case 'linkedin':
                            return (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            );
                          case 'instagram':
                            return (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            );
                          case 'youtube':
                            return (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                            );
                          case 'whatsapp':
                            return (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                              </svg>
                            );
                          default:
                            return (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                              </svg>
                            );
                        }
                      };

                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                          title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                        >
                          {getIcon()}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                {hero.form_section_title || 'Send us a Message'}
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    {hero.success_message || "Thank you for your message! We'll get back to you soon."}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                    {phoneVerified && (
                      <span className="ml-2 text-xs text-green-600 font-normal">
                        ✓ Verified
                      </span>
                    )}
                  </label>

                  {!phoneVerified ? (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
                        <p className="text-sm font-medium text-gray-800 mb-3">
                          📱 Verify Phone Number (Required)
                        </p>
                        <div
                          ref={phoneEmailWidgetRef}
                          id="phone-email-widget"
                          className="pe_signin_button"
                          data-client-id="12244582110848417905"
                          style={{
                            minHeight: '50px',
                            width: '100%'
                          }}
                        >
                          {/* Phone.Email widget will render here automatically */}
                        </div>
                        {verificationError && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-600">{verificationError}</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                          <strong>How it works:</strong> Click the button above → Enter your phone number in the popup → Receive OTP via SMS → Enter OTP to verify
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        readOnly
                        className="flex-1 px-4 py-3 border border-green-300 bg-green-50 rounded-lg text-gray-700"
                        placeholder="Verified phone number"
                      />
                      <span className="text-green-600 text-sm font-medium">✓ Verified</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !phoneVerified}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : phoneVerified ? 'Send Message' : 'Verify Phone to Submit'}
                </button>
                {!phoneVerified && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    {hero.phone_verification_text || 'Phone verification is required to submit the form'}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>


      {/* Map Section (Optional) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
            {hero.map_section_title || 'Find Us'}
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  {hero.map_office_name || 'Bengaluru Office'}
                </p>
                <p className="text-gray-500 text-sm">
                  {hero.map_address_line1 || '3052 "Prestige Finsbury Park Hyde"'}<br />
                  {hero.map_address_line2 || 'Aerospace Park, Bagalur KIADB'}<br />
                  {hero.map_address_line3 || 'Bengaluru, 562149, India'}
                </p>
                <p className="text-gray-400 text-xs mt-4">
                  <a
                    href={hero.map_url || 'https://www.google.com/maps/search/?api=1&query=Bagalur+KIADB+Bengaluru'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600 underline"
                  >
                    View on Google Maps
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs

