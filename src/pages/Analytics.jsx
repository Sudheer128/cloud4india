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

const Analytics = () => {
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
              <ChartBarIcon className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Analytics Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Data Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Unlock the power of your data with Cloud4India's comprehensive analytics platform 
              trusted by leading enterprises worldwide for real-time insights and AI-driven decision making.
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
              <p className="text-gray-400 text-sm mb-6">Trusted by leading enterprises</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-gray-300 font-semibold">Netflix</div>
                <div className="text-gray-300 font-semibold">Spotify</div>
                <div className="text-gray-300 font-semibold">Airbnb</div>
                <div className="text-gray-300 font-semibold">Uber</div>
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
              Why Choose Cloud4India Analytics?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive analytics solutions designed to handle enterprise-scale data processing, 
              real-time insights, and advanced machine learning capabilities.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Process and analyze data streams in real-time with sub-second latency, 
                enabling instant insights and rapid decision-making.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <CloudIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Scalable Data Lakes</h3>
              <p className="text-gray-600 leading-relaxed">
                Build enterprise-grade data lakes that scale automatically to handle 
                petabytes of structured and unstructured data.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <CpuChipIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Leverage machine learning and AI to uncover hidden patterns, 
                predict trends, and generate actionable business insights.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                <ShieldCheckIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-grade security with encryption, access controls, and compliance 
                frameworks to protect your most sensitive data.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
                <RocketLaunchIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rapid Deployment</h3>
              <p className="text-gray-600 leading-relaxed">
                Deploy analytics solutions in days, not months, with pre-built templates 
                and automated infrastructure provisioning.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-200 transition-colors">
                <ChartPieIcon className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cost Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Reduce analytics costs by up to 60% with intelligent resource management 
                and pay-per-use pricing models.
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
              Analytics for Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From e-commerce to healthcare, we provide specialized analytics solutions 
              tailored to your industry's unique data challenges and opportunities.
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
              {/* E-commerce - Large Feature */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 lg:p-8 h-full min-h-[350px] overflow-hidden hover:shadow-2xl transition-all duration-500">
                  {/* Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ChartBarIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">E-commerce</h3>
                      <p className="text-blue-100 text-base leading-relaxed mb-4">
                        Complete customer analytics platform with real-time personalization, 
                        recommendation engines, and conversion optimization tools.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Customer Analytics</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Real-time Personalization</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Recommendation Engines</span>
                        </div>
                      </div>
                      
                      {/* Additional Features */}
                      <div className="bg-white/10 rounded-xl p-5 mb-4">
                        <div className="text-white font-semibold text-base mb-3">Key Capabilities</div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-blue-100">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Conversion Tracking</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Inventory Analytics</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Price Optimization</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Demand Forecasting</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-blue-100 text-sm font-medium mb-1">Trusted by</div>
                      <div className="text-white font-bold text-base">500+ Companies</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Healthcare */}
              <div className="group relative bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ShieldCheckIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Healthcare</h3>
                    <p className="text-green-100 text-sm leading-relaxed mb-3">
                      Patient analytics, clinical research, and population health insights.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Patient Analytics</span>
                      </div>
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Clinical Research</span>
                      </div>
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Population Health</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">200+ Hospitals</div>
                  </div>
                </div>
              </div>

              {/* Manufacturing */}
              <div className="group relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <CogIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Manufacturing</h3>
                    <p className="text-purple-100 text-sm leading-relaxed mb-3">
                      Predictive maintenance, quality control, and supply chain optimization.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Predictive Maintenance</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Quality Control</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Supply Chain</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">300+ Companies</div>
                  </div>
                </div>
              </div>

              {/* Media & Entertainment - Spans bottom row */}
              <div className="md:col-span-2 lg:col-span-2">
                <div className="group relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10 h-full flex items-center justify-between">
                    <div className="flex-1">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <PlayIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Media & Entertainment</h3>
                      <p className="text-orange-100 leading-relaxed mb-3 text-sm">
                        Content analytics, audience insights, and recommendation systems 
                        for streaming platforms and digital media.
                      </p>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Content Analytics</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Audience Insights</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Recommendation Systems</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                        <div className="text-white font-semibold text-sm">150+ Platforms</div>
                      </div>
                    </div>
                    <div className="hidden lg:block ml-6">
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-18 h-18 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                            <PlayIcon className="w-6 h-6 text-white" />
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
              <div className="text-gray-600">E-commerce Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600">Healthcare Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">300+</div>
              <div className="text-gray-600">Manufacturing Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
              <div className="text-gray-600">Media Platforms</div>
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
                  Netflix's Data-Driven Content Strategy with Cloud4India
                  </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  Netflix leveraged Cloud4India's analytics platform to process 500+ petabytes of viewing data, 
                  enabling personalized recommendations that increased viewer engagement by 35% and reduced 
                  content production costs by 20% through data-driven insights.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">35%</div>
                    <div className="text-gray-300 text-sm">Increase in Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">20%</div>
                    <div className="text-gray-300 text-sm">Cost Reduction</div>
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
                      <PlayIcon className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-4">Netflix</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Global streaming entertainment service with 200+ million subscribers worldwide.
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
              Advanced Analytics Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge analytics technologies including AI, machine learning, 
              and real-time processing to drive innovation and competitive advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                AI & Machine Learning for Analytics
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Transform your data into actionable insights with AI-powered analytics solutions for 
                predictive modeling, anomaly detection, natural language processing, and automated 
                decision-making. Our ML platform is designed for enterprise-scale analytics workloads.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Predictive analytics and forecasting models</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Real-time anomaly detection and alerting</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Natural language processing for text analytics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Automated insights generation and reporting</span>
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
                  <CpuChipIcon className="w-16 h-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Analytics</h4>
                <p className="text-gray-600 leading-relaxed">
                  Advanced machine learning models trained on enterprise data patterns 
                  and optimized for real-time analytics workloads.
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
              Real-World Analytics Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how leading enterprises are leveraging Cloud4India Analytics 
              to solve complex data challenges and drive business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Analytics Platform</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Complete customer journey analytics with behavioral insights, 
                segmentation, and personalized engagement strategies.
              </p>
              <div className="text-left mt-auto">
                <div className="text-blue-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Behavioral Analytics • Segmentation • Personalization</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Predictive Analytics Engine</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Advanced predictive modeling with real-time forecasting, 
                trend analysis, and automated decision support systems.
              </p>
              <div className="text-left mt-auto">
                <div className="text-green-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Predictive Modeling • Forecasting • Decision Support</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Data Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                High-velocity data processing with stream analytics, 
                real-time dashboards, and instant alerting capabilities.
              </p>
              <div className="text-left mt-auto">
                <div className="text-purple-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Stream Processing • Real-time • Instant Alerts</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CloudIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Lake Analytics</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Enterprise data lake with advanced querying, data cataloging, 
                and automated data quality management.
              </p>
              <div className="text-left mt-auto">
                <div className="text-orange-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Data Lake • Querying • Data Quality</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartPieIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Intelligence Suite</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Comprehensive BI platform with interactive dashboards, 
                self-service analytics, and automated reporting.
              </p>
              <div className="text-left mt-auto">
                <div className="text-teal-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Interactive Dashboards • Self-service • Automated Reports</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Governance & Security</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Enterprise-grade data governance with privacy controls, 
                compliance monitoring, and automated data lineage tracking.
              </p>
              <div className="text-left mt-auto">
                <div className="text-indigo-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Data Governance • Privacy Controls • Compliance</div>
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
              Measurable Analytics Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See the tangible results our analytics customers achieve 
              with Cloud4India's comprehensive data platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center">
                <RocketLaunchIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">75%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Faster Insights</div>
              <div className="text-gray-600">Time to actionable insights</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-600 rounded-2xl flex items-center justify-center">
                <ChartBarIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">60%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</div>
              <div className="text-gray-600">Analytics infrastructure</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-600 rounded-2xl flex items-center justify-center">
                <CpuChipIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">90%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Accuracy Improvement</div>
              <div className="text-gray-600">Predictive models</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-600 rounded-2xl flex items-center justify-center">
                <UsersIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">85%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">User Adoption</div>
              <div className="text-gray-600">Self-service analytics</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Calculate Your Analytics ROI
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Use our interactive ROI calculator to estimate the potential savings 
                  and business impact of implementing Cloud4India Analytics for your organization.
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
                    <span className="font-semibold text-green-600">$3.2M/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Operational Efficiency</span>
                    <span className="font-semibold text-green-600">$2.8M/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Decision Speed</span>
                    <span className="font-semibold text-green-600">$4.1M/year</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Annual Value</span>
                      <span className="text-2xl font-bold text-blue-600">$10.1M</span>
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
              Your Analytics Implementation Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A structured approach to analytics transformation with dedicated support 
              at every step of your Cloud4India Analytics journey.
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
                        <h3 className="text-2xl font-bold text-gray-900">Data Assessment & Strategy</h3>
                </div>
              </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Comprehensive assessment of your current data landscape, analytics requirements, 
                      and strategic goals. We analyze your data sources, identify opportunities 
                      for optimization, and create a detailed roadmap for your analytics transformation.
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
                        <h3 className="text-2xl font-bold text-gray-900">Architecture & Design</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Custom analytics architecture design with data pipelines, storage solutions, 
                      and processing frameworks. Our experts create a robust foundation that meets 
                      your specific analytics requirements and performance standards.
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
                      delivering a robust, scalable analytics solution.
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
                        <h3 className="text-2xl font-bold text-gray-900">Go-Live & Optimization</h3>
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
              Analytics Resources & Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access comprehensive resources, guides, and documentation to help you 
              maximize the value of your Cloud4India Analytics platform.
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
                    Complete Analytics Implementation Guide
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Our comprehensive 250-page guide covers everything you need to know about 
                    implementing Cloud4India Analytics, including architecture patterns, 
                    data modeling best practices, ML workflows, and real-world case studies.
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
                        <span className="text-gray-700">Analytics architecture patterns & best practices</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Data modeling & ML workflow frameworks</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Implementation strategies & timelines</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Real-world analytics case studies</span>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Analytics Learning Center</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive video library with 75+ tutorials covering analytics features, 
                      data modeling, ML workflows, and advanced use cases.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">75+ Videos</span> • 20+ Hours Content
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Analytics Training Programs</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive training programs including certification courses, 
                      hands-on workshops, and specialized tracks for data professionals.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">20+ Courses</span> • 4 Certification Tracks
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytics Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Connect with 15,000+ analytics professionals and get expert advice.
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytics API Reference</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Analytics Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Get dedicated support from analytics and data science experts.
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
            Ready to Transform Your Analytics?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join thousands of enterprises already leveraging Cloud4India Analytics' 
            powerful, scalable, and intelligent platform to drive data-driven transformation.
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
              <div className="text-gray-300 font-semibold text-lg">Netflix</div>
              <div className="text-gray-300 font-semibold text-lg">Spotify</div>
              <div className="text-gray-300 font-semibold text-lg">Airbnb</div>
              <div className="text-gray-300 font-semibold text-lg">Uber</div>
              <div className="text-gray-300 font-semibold text-lg">Tesla</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Analytics