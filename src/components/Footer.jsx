import React from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const Footer = () => {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { text: 'Home', href: '/' },
        { text: 'About Us', href: '/about-us' },
        { text: 'Pricing', href: '/pricing' },
        { text: 'Marketplace', href: '/marketplace' },
        { text: 'Products', href: '/products' },
        { text: 'Solutions', href: '/solutions' }
      ]
    },
    {
      title: 'Marketplace',
      links: [
        { text: 'All Apps', href: '/marketplace' },
        { text: 'Frameworks', href: '/marketplace?category=frameworks' },
        { text: 'CMS', href: '/marketplace?category=cms' },
        { text: 'Databases', href: '/marketplace?category=databases' },
        { text: 'Developer Tools', href: '/marketplace?category=developer-tools' }
      ]
    },
    {
      title: 'Products',
      links: [
        { text: 'All Products', href: '/products' },
        { text: 'Cloud Services', href: '/products' },
        { text: 'Infrastructure', href: '/products' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { text: 'All Solutions', href: '/solutions' },
        { text: 'Industry Solutions', href: '/solutions?category=Industry' },
        { text: 'Use Case Solutions', href: '/solutions?category=Use%20Case' }
      ]
    },
    {
      title: 'Account',
      links: [
        { text: 'Customer Portal', href: 'https://portal.cloud4india.com/login?redirectUrl=/' },
        { text: 'Create Account', href: 'https://portal.cloud4india.com/login?redirectUrl=/' }
      ]
    }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section - Brand */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Cloud4India</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            India's Premier Cloud Infrastructure Provider
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-6 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('http') ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link 
                        to={link.href} 
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Back to Top */}
        <div className="text-center mb-8">
          <button 
            onClick={scrollToTop}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ChevronUpIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © 2025 Cloud4India Technologies Pvt. Ltd. All rights reserved.
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
