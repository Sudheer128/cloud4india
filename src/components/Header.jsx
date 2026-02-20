import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import AppsDropdown from './AppsDropdown'
import ProductsDropdown from './ProductsDropdown'
import SolutionsDropdown from './SolutionsDropdown'
import { useGlobalFeatureVisibility } from '../hooks/useGlobalFeatureVisibility'
import { PORTAL_URL } from '../utils/config'

const Header = () => {
  // Fetch global feature visibility settings from database
  const { features, loading } = useGlobalFeatureVisibility()

  // Navigation visibility flags - now from database instead of hardcoded
  const SHOW_HOME = features.home
  const SHOW_ABOUT_US = features.about_us
  const SHOW_MARKETPLACE = features.marketplace
  const SHOW_PRODUCTS = features.products
  const SHOW_SOLUTIONS = features.solutions
  const SHOW_PRICING = features.pricing
  const SHOW_PRICE_ESTIMATOR = features.price_estimator
  const SHOW_CONTACT_US = features.contact_us

  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false)
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAppsClick = (e) => {
    e.preventDefault()
    setIsAppsDropdownOpen(!isAppsDropdownOpen)
    setIsProductsDropdownOpen(false)
    setActiveDropdown(activeDropdown === 'apps' ? null : 'apps')
  }

  const handleProductsClick = (e) => {
    e.preventDefault()
    setIsProductsDropdownOpen(!isProductsDropdownOpen)
    setIsAppsDropdownOpen(false)
    setIsSolutionsDropdownOpen(false)
    setActiveDropdown(activeDropdown === 'products' ? null : 'products')
  }

  const handleSolutionsClick = (e) => {
    e.preventDefault()
    setIsSolutionsDropdownOpen(!isSolutionsDropdownOpen)
    setIsAppsDropdownOpen(false)
    setIsProductsDropdownOpen(false)
    setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')
  }

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
                    className="h-16 w-auto max-w-[300px] object-contain"
                  />
                </Link>
              </div>

              {/* Main Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {SHOW_HOME && (
                  <Link to="/" className="relative text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {SHOW_ABOUT_US && (
                  <Link to="/about-us" className="relative text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group">
                    About Us
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {SHOW_MARKETPLACE && (
                  <button
                    data-apps-link
                    onClick={handleAppsClick}
                    className={`relative text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group ${isAppsDropdownOpen ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
                      }`}
                  >
                    Marketplace
                    <span className={`absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-300 ${isAppsDropdownOpen ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                  </button>
                )}
                {SHOW_PRODUCTS && (
                  <button
                    data-products-link
                    onClick={handleProductsClick}
                    className={`relative text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group ${isProductsDropdownOpen ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
                      }`}
                  >
                    Products
                    <span className={`absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-300 ${isProductsDropdownOpen ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                  </button>
                )}
                {SHOW_SOLUTIONS && (
                  <button
                    data-solutions-link
                    onClick={handleSolutionsClick}
                    className={`relative text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group ${isSolutionsDropdownOpen ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
                      }`}
                  >
                    Solutions
                    <span className={`absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-300 ${isSolutionsDropdownOpen ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                  </button>
                )}
                {SHOW_PRICING && (
                  <Link to="/pricing" className="relative text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group">
                    Pricing
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {SHOW_PRICE_ESTIMATOR && (
                  <Link to="/cloud-pricing" className="relative text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group">
                    Price Estimator
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                {SHOW_CONTACT_US && (
                  <Link to="/contact-us" className="relative text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors pb-2 outline-none focus:outline-none group">
                    Contact Us
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Right Side - Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Authentication Buttons */}
              <a
                href={`${PORTAL_URL}/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Sign in
              </a>
              <a
                href={`${PORTAL_URL}/register`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                Create an account
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <nav className="px-4 py-4 space-y-3">
              {SHOW_HOME && (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                >
                  Homepage
                </Link>
              )}
              {SHOW_ABOUT_US && (
                <Link
                  to="/about-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                >
                  About Us
                </Link>
              )}
              {SHOW_MARKETPLACE && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      handleAppsClick(e)
                    }}
                    className="flex items-center justify-between w-full text-left text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                  >
                    <span>Marketplace</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isAppsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isAppsDropdownOpen && (
                    <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-3">
                      <p className="text-xs text-gray-500 py-2">Tap Marketplace in desktop view to see categories</p>
                    </div>
                  )}
                </div>
              )}
              {SHOW_PRODUCTS && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      handleProductsClick(e)
                    }}
                    className="flex items-center justify-between w-full text-left text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                  >
                    <span>Products</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProductsDropdownOpen && (
                    <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-3">
                      <p className="text-xs text-gray-500 py-2">Tap Products in desktop view to see categories</p>
                    </div>
                  )}
                </div>
              )}
              {SHOW_SOLUTIONS && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      handleSolutionsClick(e)
                    }}
                    className="flex items-center justify-between w-full text-left text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                  >
                    <span>Solutions</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isSolutionsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSolutionsDropdownOpen && (
                    <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-3">
                      <p className="text-xs text-gray-500 py-2">Tap Solutions in desktop view to see categories</p>
                    </div>
                  )}
                </div>
              )}
              {SHOW_PRICING && (
                <Link
                  to="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                >
                  Pricing
                </Link>
              )}
              {SHOW_PRICE_ESTIMATOR && (
                <Link
                  to="/cloud-pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                >
                  Price Estimator
                </Link>
              )}
              {SHOW_CONTACT_US && (
                <Link
                  to="/contact-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-orange-500 text-sm font-medium transition-colors py-2"
                >
                  Contact Us
                </Link>
              )}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <a
                  href={`${PORTAL_URL}/login`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors py-2"
                >
                  Sign in
                </a>
                <a
                  href={`${PORTAL_URL}/register`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 text-center"
                >
                  Create an account
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Apps Dropdown */}
      <AppsDropdown
        isOpen={isAppsDropdownOpen}
        onClose={() => {
          setIsAppsDropdownOpen(false)
          setActiveDropdown(null)
        }}
      />

      {/* Products Dropdown */}
      <ProductsDropdown
        isOpen={isProductsDropdownOpen}
        onClose={() => {
          setIsProductsDropdownOpen(false)
          setActiveDropdown(null)
        }}
      />

      {/* Solutions Dropdown */}
      {SHOW_SOLUTIONS && (
        <SolutionsDropdown
          isOpen={isSolutionsDropdownOpen}
          onClose={() => {
            setIsSolutionsDropdownOpen(false)
            setActiveDropdown(null)
          }}
        />
      )}
    </>
  )
}

export default Header
