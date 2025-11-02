import React from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const Footer = () => {
  const footerSections = [
    {
      title: 'Cloud4India',
      links: [
        { text: 'What Is Cloud4India?', href: '/' },
        { text: 'Products', href: '/products' },
        { text: 'Solutions', href: '/solutions' },
        { text: 'Pricing', href: '/pricing' },
        { text: 'Documentation', href: '#' },
        { text: 'Blogs', href: '#' },
        { text: 'Press Releases', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { text: 'Getting Started', href: '#' },
        { text: 'Training & Certification', href: '#' },
        { text: 'Cloud4India Trust Center', href: '#' },
        { text: 'Cloud4India Apps Library', href: '/solutions' },
        { text: 'Architecture Center', href: '#' },
        { text: 'Product & Technical FAQs', href: '#' },
        { text: 'Analyst Reports', href: '#' },
        { text: 'Cloud4India Partners', href: '#' }
      ]
    },
    {
      title: 'Developers',
      links: [
        { text: 'Developer Center', href: '#' },
        { text: 'SDKs & Tools', href: '#' },
        { text: 'Documentation', href: '#' },
        { text: 'Code Samples', href: '#' },
        { text: 'Tutorials', href: '#' },
        { text: 'API References', href: '#' },
        { text: 'Open Source', href: '#' },
        { text: 'Community Forums', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { text: 'Contact Us', href: '#' },
        { text: 'Support Center', href: '#' },
        { text: 'Knowledge Base', href: '#' },
        { text: 'Service Health', href: '#' },
        { text: 'Training & Certification', href: '#' },
        { text: 'Customer Stories', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Account & Billing', href: 'https://portal.cloud4india.com/login?redirectUrl=/' }
      ]
    }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section with Create Account and Language */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <a 
            href="https://portal.cloud4india.com/login?redirectUrl=/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors mb-4 md:mb-0 inline-block"
          >
            Create a Cloud4India account
          </a>
          <div className="flex items-center space-x-2 border border-white rounded-full px-4 py-2">
            <span className="text-white">🌐</span>
            <span className="text-white">English</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm mb-4">
              Cloud4India is an Equal Opportunity Employer: Minority / Women / Disability / Veteran / Gender Identity / Sexual Orientation / Age.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 3a1 1 0 00-1 1v8a1 1 0 001 1h2.5l1 2.5 1-2.5H13a1 1 0 001-1V4a1 1 0 00-1-1H2zm7 6V5.5l3.5 1.75L9 9z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400 mb-4">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Site terms</a>
              <a href="#" className="hover:text-white">Cookie Preferences</a>
            </div>
            
            <p className="text-xs text-gray-500">
              © 2025, Cloud4India Technologies Pvt. Ltd. or its affiliates. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
