import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  CogIcon, 
  UsersIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  LockClosedIcon,
  CloudIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  BanknotesIcon,
  CpuChipIcon,
  KeyIcon,
  ScaleIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  HandRaisedIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  PlayIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarSquareIcon,
  ShieldExclamationIcon,
  CurrencyEuroIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

const FinancialServices = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-8">
              <BuildingOfficeIcon className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Financial Services Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Accelerate innovation, enhance security, and scale with confidence using Cloud4India's 
              comprehensive financial services platform trusted by leading institutions worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center">
                Start Your Journey
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-white/10">
                Watch Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-6">Trusted by leading financial institutions</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-gray-300 font-semibold">HSBC</div>
                <div className="text-gray-300 font-semibold">Goldman Sachs</div>
                <div className="text-gray-300 font-semibold">JP Morgan</div>
                <div className="text-gray-300 font-semibold">Bank of America</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Cloud4India for Financial Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built specifically for financial institutions, our platform delivers the security, 
              compliance, and scalability you need to thrive in today's digital economy.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-grade security with end-to-end encryption, multi-factor authentication, 
                and compliance with global financial regulations.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time insights and predictive analytics to optimize operations, 
                reduce risk, and drive informed decision-making.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <CogIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Scalable Infrastructure</h3>
              <p className="text-gray-600 leading-relaxed">
                Auto-scaling infrastructure that grows with your business, 
                ensuring optimal performance during peak times.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                <UsersIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated financial services support team with deep industry expertise 
                and round-the-clock assistance.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
                <LockClosedIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Built-in compliance tools for GDPR, PCI DSS, SOX, and other 
                regulatory requirements specific to financial services.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <CloudIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cloud Native</h3>
              <p className="text-gray-600 leading-relaxed">
                Fully cloud-native architecture designed for modern financial 
                applications with microservices and API-first approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Segments Section - Hexagonal Layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Serving Every Financial Segment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From traditional banking to modern fintech, we provide specialized solutions 
              tailored to your industry's unique requirements.
            </p>
          </div>

          {/* Hexagonal Grid Layout */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-blue-300 rounded-full"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-green-300 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-28 h-28 border-2 border-purple-300 rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-2 border-orange-300 rounded-full"></div>
            </div>

            {/* Segments Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Banking - Large Feature */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 lg:p-8 h-full min-h-[350px] overflow-hidden hover:shadow-2xl transition-all duration-500">
                  {/* Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CurrencyDollarIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">Banking</h3>
                      <p className="text-blue-100 text-base leading-relaxed mb-4">
                        Complete digital transformation for retail and commercial banking with 
                        core banking systems, regulatory compliance, and customer experience solutions.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Core Banking Systems</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Digital Transformation</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Regulatory Compliance</span>
                        </div>
                      </div>
                      
                      {/* Additional Features */}
                      <div className="bg-white/10 rounded-xl p-5 mb-4">
                        <div className="text-white font-semibold text-base mb-3">Key Capabilities</div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-blue-100">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Mobile Banking</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>API Integration</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Real-time Processing</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Fraud Detection</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-blue-100 text-sm font-medium mb-1">Trusted by</div>
                      <div className="text-white font-bold text-base">500+ Institutions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capital Markets */}
              <div className="group relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ChartPieIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Capital Markets</h3>
                    <p className="text-purple-100 text-sm leading-relaxed mb-3">
                      Trading platforms, risk management, and real-time market data solutions.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Trading Platforms</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Risk Management</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Market Data</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">200+ Firms</div>
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div className="group relative bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ShieldCheckIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Insurance</h3>
                    <p className="text-green-100 text-sm leading-relaxed mb-3">
                      Policy management, claims processing, and actuarial analytics platforms.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Policy Management</span>
                      </div>
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Claims Processing</span>
                      </div>
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Analytics</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">300+ Companies</div>
                  </div>
                </div>
              </div>

              {/* Payments - Spans bottom row */}
              <div className="md:col-span-2 lg:col-span-2">
                <div className="group relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10 h-full flex items-center justify-between">
                    <div className="flex-1">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CogIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Payments</h3>
                      <p className="text-orange-100 leading-relaxed mb-3 text-sm">
                        Payment processing, digital wallets, and cross-border transaction solutions 
                        with fraud detection and compliance.
                      </p>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Payment Processing</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Digital Wallets</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Cross-border Solutions</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                        <div className="text-white font-semibold text-sm">150+ Providers</div>
                      </div>
                    </div>
                    <div className="hidden lg:block ml-6">
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-18 h-18 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                            <CogIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Banking Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
              <div className="text-gray-600">Capital Market Firms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">300+</div>
              <div className="text-gray-600">Insurance Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
              <div className="text-gray-600">Payment Providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6">
                  <StarIcon className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-blue-300 text-sm font-medium">Success Story</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  HSBC's Digital Transformation Journey with Cloud4India
                  </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  HSBC Wealth and Personal Banking built a cloud-first engineering platform on Cloud4India, 
                  achieving unprecedented agility and innovation at scale. The transformation enabled them 
                  to deliver new financial products 40% faster while maintaining enterprise-grade security.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">40%</div>
                    <div className="text-gray-300 text-sm">Faster Product Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                    <div className="text-gray-300 text-sm">Uptime Achieved</div>
                  </div>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                  Read Full Case Study
                </button>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <BuildingOfficeIcon className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-4">HSBC</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Global banking and financial services organization serving millions of customers worldwide.
                    </p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Technology Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge technologies designed specifically for financial services 
              to drive innovation and competitive advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                AI & Machine Learning for Financial Services
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Transform your financial operations with AI-powered solutions for fraud detection, 
                risk assessment, algorithmic trading, and personalized customer experiences. 
                Our ML platform is designed to meet the unique requirements of financial institutions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Real-time fraud detection and prevention</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Automated risk assessment and compliance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Predictive analytics for investment strategies</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Personalized financial advisory services</span>
                </div>
              </div>
              
              <button className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center group">
                Explore AI Solutions
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <ChartBarIcon className="w-16 h-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Analytics</h4>
                <p className="text-gray-600 leading-relaxed">
                  Advanced machine learning models trained specifically for financial data patterns 
                  and regulatory requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases & Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real-World Use Cases & Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how leading financial institutions are leveraging Cloud4India 
              to solve complex business challenges and drive innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Banking Platform</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Complete digital transformation for retail banking with mobile-first design, 
                real-time transactions, and personalized customer experiences.
              </p>
              <div className="text-left mt-auto">
                <div className="text-blue-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Mobile-first • Real-time • Personalized</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Management System</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Advanced risk assessment and monitoring with AI-powered analytics, 
                real-time alerts, and comprehensive reporting dashboards.
              </p>
              <div className="text-left mt-auto">
                <div className="text-green-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">AI-powered • Real-time • Comprehensive</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BanknotesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                High-volume payment processing with fraud detection, 
                cross-border capabilities, and instant settlement options.
              </p>
              <div className="text-left mt-auto">
                <div className="text-purple-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">High-volume • Fraud Detection • Cross-border</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Algorithmic Trading</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Low-latency trading infrastructure with machine learning models, 
                real-time market data, and automated execution strategies.
              </p>
              <div className="text-left mt-auto">
                <div className="text-orange-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Low-latency • ML Models • Automated</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BuildingLibraryIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Wealth Management</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Comprehensive wealth management platform with portfolio analytics, 
                client relationship management, and automated rebalancing.
              </p>
              <div className="text-left mt-auto">
                <div className="text-teal-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Portfolio Analytics • CRM • Automated</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IdentificationIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">KYC & AML Solutions</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Automated Know Your Customer and Anti-Money Laundering processes 
                with AI-powered identity verification and risk scoring.
              </p>
              <div className="text-left mt-auto">
                <div className="text-indigo-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Automated • AI-powered • Risk Scoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Business Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Measurable Business Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See the tangible results our financial services customers achieve 
              with Cloud4India's comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center">
                <RocketLaunchIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">65%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Faster Time to Market</div>
              <div className="text-gray-600">New product launches</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-600 rounded-2xl flex items-center justify-center">
                <BanknotesIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">40%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</div>
              <div className="text-gray-600">Operational expenses</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-600 rounded-2xl flex items-center justify-center">
                <ChartBarIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Accuracy Improvement</div>
              <div className="text-gray-600">Risk assessment</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-600 rounded-2xl flex items-center justify-center">
                <UsersIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">90%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Customer Satisfaction</div>
              <div className="text-gray-600">Digital experience</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Calculate Your ROI
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Use our interactive ROI calculator to estimate the potential savings 
                  and business impact of migrating to Cloud4India for your financial services.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                  Calculate ROI
                </button>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Quick Estimate</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Infrastructure Savings</span>
                    <span className="font-semibold text-green-600">$2.4M/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Operational Efficiency</span>
                    <span className="font-semibold text-green-600">$1.8M/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Reduction</span>
                    <span className="font-semibold text-green-600">$3.2M/year</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Annual Savings</span>
                      <span className="text-2xl font-bold text-blue-600">$7.4M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Roadmap Section - Timeline Layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Implementation Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A structured approach to digital transformation with dedicated support 
              at every step of your Cloud4India journey.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-green-500 via-purple-500 to-orange-500 rounded-full hidden lg:block"></div>
            
            {/* Timeline Items */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8 text-right">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-end mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <LightBulbIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-blue-600 mb-1">PHASE 1</div>
                        <h3 className="text-2xl font-bold text-gray-900">Discovery & Planning</h3>
                </div>
              </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Comprehensive assessment of your current infrastructure, business requirements, 
                      and migration strategy. We analyze your existing systems, identify opportunities 
                      for optimization, and create a detailed roadmap for your digital transformation.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 2-4 weeks
              </div>
            </div>
          </div>

                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                
                <div className="flex-1 lg:pl-8"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8"></div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                
                <div className="flex-1 lg:pl-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                        <CogIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-green-600 mb-1">PHASE 2</div>
                        <h3 className="text-2xl font-bold text-gray-900">Design & Architecture</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Custom solution architecture design with security, compliance, and scalability 
                      considerations. Our experts create a robust foundation that meets your specific 
                      financial services requirements and regulatory standards.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 3-6 weeks
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8 text-right">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-end mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <RocketLaunchIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-purple-600 mb-1">PHASE 3</div>
                        <h3 className="text-2xl font-bold text-gray-900">Implementation</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Phased implementation with continuous testing, monitoring, and optimization 
                      throughout the process. We ensure minimal disruption to your operations while 
                      delivering a robust, scalable solution.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 8-16 weeks
                    </div>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                
                <div className="flex-1 lg:pl-8"></div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8"></div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                
                <div className="flex-1 lg:pl-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                        <HandRaisedIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-orange-600 mb-1">PHASE 4</div>
                        <h3 className="text-2xl font-bold text-gray-900">Go-Live & Support</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Smooth transition to production with 24/7 support, training, and ongoing 
                      optimization services. Our dedicated team ensures your success with continuous 
                      monitoring and improvement.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: Ongoing
                    </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Documentation Section - Mixed Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resources & Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access comprehensive resources, guides, and documentation to help you 
              maximize the value of your Cloud4India financial services platform.
            </p>
          </div>

          {/* Featured Resource - Large Card */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6">
                    <BookOpenIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-700 text-sm font-medium">Featured Resource</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Complete Implementation Guide
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Our comprehensive 200-page guide covers everything you need to know about 
                    implementing Cloud4India for financial services, including architecture patterns, 
                    security best practices, compliance requirements, and real-world case studies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Download PDF Guide
                    </button>
                    <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Watch Overview
                </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <BookOpenIcon className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h4>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Architecture patterns & best practices</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Security & compliance frameworks</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Migration strategies & timelines</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Real-world case studies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resource Categories - Mixed Layout */}
          <div className="space-y-12">
            {/* Row 1: Two Large Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="group bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-green-200">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                    <PlayIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Video Learning Center</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive video library with 50+ tutorials covering platform features, 
                      configuration, and advanced use cases specifically for financial services.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">50+ Videos</span> • 12+ Hours Content
                      </div>
                      <button className="text-green-600 hover:text-green-800 font-semibold flex items-center group">
                        <span>Browse Videos</span>
                        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-purple-200">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Training Programs</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive training programs including certification courses, 
                      hands-on workshops, and specialized tracks for different roles.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">15+ Courses</span> • 3 Certification Tracks
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 font-semibold flex items-center group">
                        <span>View Courses</span>
                        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Three Smaller Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Forum</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Connect with 10,000+ financial services professionals and get expert advice.
                </p>
                <button className="text-orange-600 hover:text-orange-800 font-semibold text-sm flex items-center group">
                  <span>Join Community</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-teal-300">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">API Documentation</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Complete API reference with code examples and integration guides.
                </p>
                <button className="text-teal-600 hover:text-teal-800 font-semibold text-sm flex items-center group">
                  <span>View APIs</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PhoneIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expert Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Get dedicated support from financial services experts.
                </p>
                <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center group">
                  <span>Contact Support</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Financial Services?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join thousands of financial institutions already leveraging Cloud4India's 
            secure, scalable, and innovative platform to drive digital transformation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center">
              Start Your Free Trial
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            <button className="border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-white/10">
              Schedule a Demo
              </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="border-t border-gray-700 pt-12">
            <p className="text-gray-400 text-sm mb-8">Trusted by industry leaders</p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="text-gray-300 font-semibold text-lg">HSBC</div>
              <div className="text-gray-300 font-semibold text-lg">Goldman Sachs</div>
              <div className="text-gray-300 font-semibold text-lg">JP Morgan</div>
              <div className="text-gray-300 font-semibold text-lg">Bank of America</div>
              <div className="text-gray-300 font-semibold text-lg">Wells Fargo</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default FinancialServices
