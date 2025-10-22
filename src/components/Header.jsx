import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null)

  return (
    <>
      {/* Main Header - Clean AWS Style */}
      <header className="bg-white text-gray-900 sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <img 
                    src="/images/cloud4India-logo.png" 
                    alt="Cloud4India Logo" 
                    className="h-12 w-auto max-w-[200px] object-contain"
                  />
                </Link>
              </div>
              
              {/* Main Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <a href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors">
                  Agentic AI
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors">
                  Discover Cloud4India
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors">
                  Products
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors">
                  Solutions
                </a>
                <Link to="/pricing" className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors">
                  Pricing
                </Link>
                <a href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors">
                  Resources
                </a>
              </nav>
            </div>
            
            {/* Right Side - Search and Auth */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button className="text-gray-600 hover:text-orange-500 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              
              {/* Authentication Buttons */}
              <button className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
                Sign in to console
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200">
                Create account
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
