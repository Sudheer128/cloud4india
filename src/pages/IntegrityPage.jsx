import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getIntegrityPage } from '../services/cmsApi'

const IntegrityPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Use description directly from database, with fallback extraction
  const description = useMemo(() => {
    if (!page) return null
    
    // Priority 1: Use description field from database
    if (page.description) return page.description
    
    // Priority 2: Extract from first meaningful paragraph in content
    if (page.content && typeof window !== 'undefined') {
      try {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = page.content
        const paragraphs = tempDiv.querySelectorAll('p')
        for (let i = 0; i < paragraphs.length; i++) {
          const text = paragraphs[i].textContent.trim()
          if (text && text.length > 20 && !text.toLowerCase().includes('effective date')) {
            return text.length > 150 ? text.substring(0, 150) + '...' : text
          }
        }
      } catch (e) {
        console.error('Error extracting description:', e)
      }
    }
    return null
  }, [page?.description, page?.content])

  useEffect(() => {
    const fetchPage = async (forceRefresh = false) => {
      try {
        setLoading(true)
        // Force fresh data fetch - use unique timestamp for cache busting
        const timestamp = forceRefresh ? `refresh-${Date.now()}-${Math.random()}` : Date.now()
        // Always fetch with cache busting
        const data = await getIntegrityPage(slug, false)
        console.log('📥 Fetched page data:', { 
          eyebrow: data?.eyebrow, 
          description: data?.description,
          title: data?.title,
          timestamp: new Date().toISOString()
        })
        setPage(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching integrity page:', err)
        setError('Page not found')
        setPage(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPage()
      // Scroll to top on page load
      window.scrollTo(0, 0)
    }

    // Listen for custom refresh event (can be triggered from admin panel)
    const handleRefresh = (event) => {
      if (slug) {
        // Check if this event is for this specific page
        const eventSlug = event?.detail?.slug
        if (!eventSlug || eventSlug === slug) {
          console.log('🔄 Refreshing page data from event...', { eventSlug, currentSlug: slug })
          // Add delay to ensure database commit, then force refresh
          setTimeout(() => {
            fetchPage(true)
          }, 800)
        }
      }
    }
    
    // Listen for focus event to refresh when user comes back to tab
    const handleFocus = () => {
      if (slug && document.visibilityState === 'visible') {
        // Refresh when tab becomes visible (user might have updated in admin)
        console.log('🔄 Tab focused, refreshing page data...')
        fetchPage(true)
      }
    }

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (slug && document.visibilityState === 'visible') {
        console.log('🔄 Page visible, refreshing data...')
        fetchPage(true)
      }
    }

    // Also listen for storage events (if admin updates localStorage)
    const handleStorageChange = (e) => {
      if (e.key === 'integrity-page-updated' && slug) {
        const updatedSlug = e.newValue
        if (!updatedSlug || updatedSlug === slug) {
          console.log('🔄 Storage event detected, refreshing...')
          fetchPage(true)
        }
      }
    }

    window.addEventListener('integrity-page-updated', handleRefresh)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('integrity-page-updated', handleRefresh)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-white/10 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </section>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-saree-teal text-white px-8 py-3 rounded-lg hover:bg-saree-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (page.is_visible === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Available</h1>
          <p className="text-xl text-gray-600 mb-8">This page is currently not available.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-saree-teal text-white px-8 py-3 rounded-lg hover:bg-saree-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Enhanced Styling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20 px-4 sm:px-6 lg:px-8">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white/30 rounded-full"></div>
            <div className="absolute top-20 right-20 w-60 h-60 border-4 border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-white/20 rounded-lg rotate-45"></div>
            <div className="absolute bottom-20 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          {page.eyebrow && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30 shadow-xl mb-8">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-semibold">{page.eyebrow}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-2xl mb-4">
            {page.title}
          </h1>

          {/* Subtitle - Dynamic from database or extracted from content */}
          {description && (
            <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              {description}
            </p>
          )}
        </div>
      </section>

      {/* Content Section with Enhanced Card Styling */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Content Container */}
            <div className="p-6 md:p-8 lg:p-10">
              <style>{`
                .integrity-content {
                  color: #374151;
                  font-size: 15px;
                  line-height: 1.7;
                  letter-spacing: 0.01em;
                }
                .integrity-content h1:first-child {
                  display: none;
                }
                .integrity-content h1 {
                  font-size: 1.75rem;
                  font-weight: 700;
                  color: #111827;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  padding-bottom: 0.75rem;
                  border-bottom: 2px solid #e5e7eb;
                }
                .integrity-content h2 {
                  font-size: 1.5rem;
                  font-weight: 600;
                  color: #047857;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  padding-left: 0.75rem;
                  border-left: 4px solid #10b981;
                }
                .integrity-content h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: #1f2937;
                  margin-top: 1.75rem;
                  margin-bottom: 0.75rem;
                }
                .integrity-content h4 {
                  font-size: 1.125rem;
                  font-weight: 600;
                  color: #374151;
                  margin-top: 1.5rem;
                  margin-bottom: 0.5rem;
                }
                .integrity-content p {
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.75;
                  margin-bottom: 1.25rem;
                  text-align: justify;
                  text-justify: inter-word;
                }
                .integrity-content p:last-child {
                  margin-bottom: 0;
                }
                .integrity-content strong {
                  color: #111827;
                  font-weight: 600;
                }
                .integrity-content ul {
                  list-style: none;
                  padding-left: 0;
                  margin: 2rem 0;
                }
                .integrity-content ul li {
                  position: relative;
                  padding-left: 1.75rem;
                  margin-bottom: 0.75rem;
                  color: #4b5563;
                  line-height: 1.7;
                  font-size: 15px;
                }
                .integrity-content ul li:before {
                  content: "•";
                  position: absolute;
                  left: 0.5rem;
                  color: #10b981;
                  font-weight: bold;
                  font-size: 1.25rem;
                  line-height: 1.2;
                }
                .integrity-content ol {
                  list-style: none;
                  counter-reset: item;
                  padding-left: 0;
                  margin: 1.5rem 0;
                }
                .integrity-content ol li {
                  position: relative;
                  padding-left: 2.5rem;
                  margin-bottom: 1rem;
                  color: #4b5563;
                  line-height: 1.7;
                  font-size: 15px;
                  counter-increment: item;
                }
                .integrity-content ol li:before {
                  content: counter(item) ".";
                  position: absolute;
                  left: 0.5rem;
                  color: #047857;
                  font-weight: 600;
                  font-size: 1rem;
                }
                .integrity-content ol[type="a"] {
                  counter-reset: alpha;
                }
                .integrity-content ol[type="a"] li {
                  counter-increment: alpha;
                }
                .integrity-content ol[type="a"] li:before {
                  content: counter(alpha, lower-alpha) ")";
                }
                .integrity-content ul ul,
                .integrity-content ol ol,
                .integrity-content ul ol,
                .integrity-content ol ul {
                  margin-top: 0.75rem;
                  margin-bottom: 0.75rem;
                  margin-left: 1.5rem;
                }
                .integrity-content ul ul li:before {
                  content: "◦";
                  color: #6b7280;
                }
                .integrity-content ul ul ul li:before {
                  content: "▪";
                  color: #9ca3af;
                }
                .integrity-content a {
                  color: #047857;
                  text-decoration: none;
                  font-weight: 500;
                  border-bottom: 1px solid transparent;
                  transition: all 0.2s;
                }
                .integrity-content a:hover {
                  color: #059669;
                  border-bottom-color: #059669;
                }
                .integrity-content blockquote {
                  border-left: 4px solid #10b981;
                  padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .integrity-content code {
          background: #f3f4f6;
          color: #1f2937;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'Monaco', 'Courier New', monospace;
        }
        .integrity-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        .integrity-content img {
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin: 2rem 0;
          max-width: 100%;
          height: auto;
        }
        .integrity-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        .integrity-content th {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
          color: #111827;
        }
        .integrity-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          color: #4b5563;
        }
        .integrity-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 3rem 0;
        }
        .integrity-content > *:first-child {
          margin-top: 0;
        }
        .integrity-content > *:last-child {
          margin-bottom: 0;
        }
              `}</style>
              <div 
                className="integrity-content"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>

            {/* Footer of Content Card */}
            <div className="bg-gray-50 border-t border-gray-200 px-8 md:px-12 lg:px-16 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>Last updated: {page.updated_at 
                    ? new Date(page.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-saree-teal">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium">Protected & Confidential</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 bg-gradient-to-r from-saree-teal/10 to-phulkari-turquoise/10 rounded-xl p-8 border border-saree-teal/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-saree-teal rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions about our policies?</h3>
                <p className="text-gray-700 mb-4">
                  If you have any questions or concerns about our policies, please don't hesitate to contact us.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 text-saree-teal font-semibold hover:text-saree-teal-dark transition-colors"
                >
                  Contact Support
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default IntegrityPage

