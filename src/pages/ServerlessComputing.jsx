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
  IdentificationIcon,
  BoltIcon,
  ServerIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

const ServerlessComputing = () => {
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
              <BoltIcon className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Serverless Computing Apps</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Build Without
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Server Management
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Run code, manage data, and integrate applications—all without managing servers. 
              Focus on building great applications while Cloud4India handles the infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center">
                Start Building
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-white/10">
                Watch Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm mb-6">Trusted by leading developers</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-gray-300 font-semibold">Airbnb</div>
                <div className="text-gray-300 font-semibold">Netflix</div>
                <div className="text-gray-300 font-semibold">Slack</div>
                <div className="text-gray-300 font-semibold">Zoom</div>
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
              Why Choose Cloud4India Serverless?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Build and run applications without thinking about servers. Our serverless platform 
              automatically scales and manages infrastructure so you can focus on code.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <BoltIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Auto-Scaling</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically scale from zero to millions of requests without 
                any configuration or capacity planning.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pay Per Use</h3>
              <p className="text-gray-600 leading-relaxed">
                Only pay for the compute time you consume. No charges when 
                your code isn't running.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <CodeBracketIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event-Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Build event-driven applications that respond to triggers 
                from various sources automatically.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                <WrenchScrewdriverIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Zero Management</h3>
              <p className="text-gray-600 leading-relaxed">
                No server management, patching, or maintenance required. 
                Focus entirely on your application logic.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
                <RocketLaunchIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rapid Deployment</h3>
              <p className="text-gray-600 leading-relaxed">
                Deploy applications in seconds with simple code uploads 
                and automatic infrastructure provisioning.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Built-in Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with automatic encryption, 
                IAM integration, and compliance certifications.
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
              Serverless for Every Use Case
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From web applications to data processing, serverless computing 
              powers modern applications across industries and use cases.
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
              {/* Web Applications - Large Feature */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 lg:p-8 h-full min-h-[350px] overflow-hidden hover:shadow-2xl transition-all duration-500">
                  {/* Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CodeBracketIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">Web Applications</h3>
                      <p className="text-blue-100 text-base leading-relaxed mb-4">
                        Build scalable web applications and APIs with automatic scaling, 
                        load balancing, and zero server management overhead.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">REST APIs</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Web Applications</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Microservices</span>
                        </div>
                      </div>
                      
                      {/* Additional Features */}
                      <div className="bg-white/10 rounded-xl p-5 mb-4">
                        <div className="text-white font-semibold text-base mb-3">Key Capabilities</div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-blue-100">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Auto-scaling</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Load Balancing</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>API Gateway</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>CDN Integration</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-blue-100 text-sm font-medium mb-1">Trusted by</div>
                      <div className="text-white font-bold text-base">1000+ Applications</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Processing */}
              <div className="group relative bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ChartBarIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Data Processing</h3>
                    <p className="text-green-100 text-sm leading-relaxed mb-3">
                      Process data streams and batches with serverless functions 
                      that scale automatically.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Stream Processing</span>
                      </div>
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Batch Processing</span>
                      </div>
                      <div className="flex items-center text-green-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>ETL Pipelines</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">500+ Companies</div>
                  </div>
                </div>
              </div>

              {/* IoT Applications */}
              <div className="group relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <CpuChipIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">IoT Applications</h3>
                    <p className="text-purple-100 text-sm leading-relaxed mb-3">
                      Handle IoT device data processing and real-time 
                      event handling at scale.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Device Management</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Real-time Processing</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Event Handling</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">300+ Companies</div>
                  </div>
                </div>
              </div>

              {/* Mobile Backend - Spans bottom row */}
              <div className="md:col-span-2 lg:col-span-2">
                <div className="group relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10 h-full flex items-center justify-between">
                    <div className="flex-1">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UsersIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Mobile Backend</h3>
                      <p className="text-orange-100 leading-relaxed mb-3 text-sm">
                        Build scalable mobile backends with authentication, 
                        push notifications, and real-time synchronization.
                      </p>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Authentication</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Push Notifications</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Real-time Sync</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                        <div className="text-white font-semibold text-sm">200+ Apps</div>
                      </div>
                    </div>
                    <div className="hidden lg:block ml-6">
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-18 h-18 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-6 h-6 text-white" />
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
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Web Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Data Processing Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">300+</div>
              <div className="text-gray-600">IoT Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
              <div className="text-gray-600">Mobile Apps</div>
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
                  Airbnb's Serverless Architecture Transformation
                  </h3>
                
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  Airbnb migrated their microservices architecture to Cloud4India Serverless, 
                  reducing infrastructure costs by 70% while improving scalability and 
                  developer productivity by 50%.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">70%</div>
                    <div className="text-gray-300 text-sm">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">50%</div>
                    <div className="text-gray-300 text-sm">Productivity Increase</div>
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
                    <h4 className="text-xl font-semibold text-white mb-4">Airbnb</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Global online marketplace for lodging and experiences with millions of users worldwide.
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

      {/* Technology Apps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Serverless Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge serverless technologies including event-driven architecture, 
              microservices, and automated scaling to build modern applications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Event-Driven Serverless Architecture
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Build responsive, event-driven applications that automatically scale based on 
                demand. Our serverless platform handles events from various sources including 
                HTTP requests, database changes, file uploads, and custom triggers.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Automatic event processing and routing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Real-time data streaming and processing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Microservices orchestration and coordination</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Serverless workflow automation</span>
                </div>
              </div>
              
              <button className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center group">
                Explore Serverless Apps
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <BoltIcon className="w-16 h-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Event-Driven Computing</h4>
                <p className="text-gray-600 leading-relaxed">
                  Advanced event processing with automatic scaling and 
                  intelligent routing for modern applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases & Apps Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real-World Serverless Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how leading companies are leveraging Cloud4India Serverless 
              to build scalable, cost-effective applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CodeBracketIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">API Gateway & Microservices</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Build scalable APIs and microservices with automatic load balancing, 
                authentication, and rate limiting.
              </p>
              <div className="text-left mt-auto">
                <div className="text-blue-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Auto-scaling • Load Balancing • Authentication</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-Time Data Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Process streaming data in real-time with serverless functions 
                that scale automatically with data volume.
              </p>
              <div className="text-left mt-auto">
                <div className="text-green-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Stream Processing • Real-time • Auto-scaling</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Backend Services</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Complete mobile backend with authentication, push notifications, 
                and real-time synchronization.
              </p>
              <div className="text-left mt-auto">
                <div className="text-purple-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Authentication • Push Notifications • Real-time</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">IoT Data Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Handle IoT device data processing and real-time event handling 
                with serverless functions.
              </p>
              <div className="text-left mt-auto">
                <div className="text-orange-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Device Management • Event Handling • Real-time</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Automated Workflows</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Build automated workflows and business process automation 
                with serverless orchestration.
              </p>
              <div className="text-left mt-auto">
                <div className="text-teal-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Workflow Automation • Process Orchestration • Triggers</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CloudIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">File Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Process files automatically with serverless functions triggered 
                by file uploads or changes.
              </p>
              <div className="text-left mt-auto">
                <div className="text-indigo-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">File Processing • Auto-triggers • Batch Processing</div>
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
              Measurable Serverless Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See the tangible results our serverless customers achieve 
              with Cloud4India's comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</div>
              <div className="text-gray-600">Infrastructure costs</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-600 rounded-2xl flex items-center justify-center">
                <RocketLaunchIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">90%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Faster Deployment</div>
              <div className="text-gray-600">Time to market</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-600 rounded-2xl flex items-center justify-center">
                <BoltIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Availability</div>
              <div className="text-gray-600">Uptime achieved</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-600 rounded-2xl flex items-center justify-center">
                <UsersIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Developer Productivity</div>
              <div className="text-gray-600">Focus on code</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Calculate Your Serverless ROI
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Use our interactive ROI calculator to estimate the potential savings 
                  and business impact of migrating to Cloud4India Serverless.
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
                    <span className="font-semibold text-green-600">$2.8M/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Operational Efficiency</span>
                    <span className="font-semibold text-green-600">$1.5M/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Developer Productivity</span>
                    <span className="font-semibold text-green-600">$3.2M/year</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Annual Savings</span>
                      <span className="text-2xl font-bold text-blue-600">$7.5M</span>
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
              Your Serverless Implementation Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A structured approach to serverless transformation with dedicated support 
              at every step of your Cloud4India Serverless journey.
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
                        <h3 className="text-2xl font-bold text-gray-900">Assessment & Planning</h3>
                </div>
              </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Comprehensive assessment of your current architecture and identification 
                      of serverless opportunities. We analyze your applications, identify 
                      suitable workloads, and create a detailed migration strategy.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 1-3 weeks
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
                        <h3 className="text-2xl font-bold text-gray-900">Architecture Design</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Design serverless architecture with event-driven patterns, 
                      microservices, and optimal function sizing. Our experts create 
                      a robust foundation for scalable serverless applications.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 2-4 weeks
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
                      throughout the process. We ensure smooth migration with minimal 
                      disruption to your operations.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 4-12 weeks
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
                        <h3 className="text-2xl font-bold text-gray-900">Optimization & Support</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Continuous optimization and 24/7 support with performance monitoring, 
                      cost optimization, and ongoing improvements. Our dedicated team ensures 
                      your serverless success.
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
              Serverless Resources & Documentation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access comprehensive resources, guides, and documentation to help you 
              maximize the value of your Cloud4India Serverless platform.
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
                    Complete Serverless Implementation Guide
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Our comprehensive 300-page guide covers everything you need to know about 
                    implementing Cloud4India Serverless, including architecture patterns, 
                    best practices, performance optimization, and real-world case studies.
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
                        <span className="text-gray-700">Serverless architecture patterns & best practices</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Performance optimization & cost management</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Migration strategies & implementation timelines</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Real-world serverless case studies</span>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Serverless Learning Center</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive video library with 100+ tutorials covering serverless concepts, 
                      implementation patterns, and advanced use cases.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">100+ Videos</span> • 25+ Hours Content
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Serverless Training Programs</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive training programs including certification courses, 
                      hands-on workshops, and specialized tracks for developers.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">25+ Courses</span> • 5 Certification Tracks
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Serverless Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Connect with 20,000+ serverless developers and get expert advice.
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Serverless API Reference</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Serverless Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Get dedicated support from serverless architecture experts.
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
            Ready to Go Serverless?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join thousands of developers already leveraging Cloud4India Serverless' 
            powerful, scalable, and cost-effective platform to build modern applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center">
              Start Building Serverless
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
              <div className="text-gray-300 font-semibold text-lg">Airbnb</div>
              <div className="text-gray-300 font-semibold text-lg">Netflix</div>
              <div className="text-gray-300 font-semibold text-lg">Slack</div>
              <div className="text-gray-300 font-semibold text-lg">Zoom</div>
              <div className="text-gray-300 font-semibold text-lg">Spotify</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default ServerlessComputing
