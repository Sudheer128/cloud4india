import React from 'react';
import { 
  CpuChipIcon, 
  ShieldCheckIcon, 
  ChartBarSquareIcon, 
  CogIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  HandRaisedIcon,
  ArrowRightIcon,
  PlayIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CodeBracketIcon,
  LifebuoyIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  ChartPieIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  TruckIcon,
  UserIcon,
  StarIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const ArtificialIntelligence = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20-18c9.941 0 18 8.059 18 18s-8.059 18-18 18S-8 39.941-8 30s8.059-18 18-18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8">
              <CpuChipIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI Solutions
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Harness the power of artificial intelligence to transform your business. 
              From machine learning to automation, unlock new possibilities with cutting-edge AI technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all duration-300 shadow-lg">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-indigo-900 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Cloud4India for AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built specifically for organizations looking to leverage AI technologies 
              with scalability, performance, and innovation at the forefront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Machine Learning Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive ML platform with automated model training, 
                deployment, and monitoring for enterprise-scale AI applications.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced analytics and insights powered by AI to uncover patterns, 
                predict trends, and drive data-driven decision making.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-pink-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Automation</h3>
              <p className="text-gray-600 leading-relaxed">
                Automate complex business processes with AI-driven workflows, 
                intelligent document processing, and smart decision engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Segments Section - AI Focus */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Serving Every AI Application
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From computer vision to natural language processing, we provide specialized AI solutions 
              tailored to your business's unique requirements and use cases.
            </p>
          </div>

          {/* AI Segments Grid */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-indigo-300 rounded-full"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-purple-300 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-28 h-28 border-2 border-pink-300 rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-2 border-blue-300 rounded-full"></div>
            </div>

            {/* Segments Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Computer Vision - Large Feature */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="group relative bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-6 lg:p-8 h-full min-h-[350px] overflow-hidden hover:shadow-2xl transition-all duration-500">
                  {/* Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CpuChipIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">Computer Vision</h3>
                      <p className="text-indigo-100 text-base leading-relaxed mb-4">
                        Advanced image and video analysis with object detection, facial recognition, 
                        and automated visual inspection for industrial and commercial applications.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-indigo-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Object Detection</span>
                        </div>
                        <div className="flex items-center text-indigo-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Facial Recognition</span>
                        </div>
                        <div className="flex items-center text-indigo-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Visual Inspection</span>
                        </div>
                      </div>
                      
                      {/* Additional Features */}
                      <div className="bg-white/10 rounded-xl p-5 mb-4">
                        <div className="text-white font-semibold text-base mb-3">Key Capabilities</div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-indigo-100">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Image Classification</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Video Analysis</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>OCR Processing</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Quality Control</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-indigo-100 text-sm font-medium mb-1">Trusted by</div>
                      <div className="text-white font-bold text-base">800+ Companies</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Natural Language Processing */}
              <div className="group relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <DocumentTextIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Natural Language Processing</h3>
                    <p className="text-purple-100 text-sm leading-relaxed mb-3">
                      Advanced text analysis, sentiment analysis, and language understanding 
                      for chatbots and content processing.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Sentiment Analysis</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Text Classification</span>
                      </div>
                      <div className="flex items-center text-purple-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Language Translation</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">500+ Organizations</div>
                  </div>
                </div>
              </div>

              {/* Predictive Analytics */}
              <div className="group relative bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ChartBarSquareIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Predictive Analytics</h3>
                    <p className="text-pink-100 text-sm leading-relaxed mb-3">
                      Machine learning models for forecasting, risk assessment, 
                      and predictive maintenance across industries.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-pink-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Demand Forecasting</span>
                      </div>
                      <div className="flex items-center text-pink-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Risk Assessment</span>
                      </div>
                      <div className="flex items-center text-pink-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Predictive Maintenance</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">600+ Businesses</div>
                  </div>
                </div>
              </div>

              {/* Intelligent Automation - Spans bottom row */}
              <div className="md:col-span-2 lg:col-span-2">
                <div className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10 h-full flex items-center justify-between">
                    <div className="flex-1">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CogIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Intelligent Automation</h3>
                      <p className="text-blue-100 leading-relaxed mb-3 text-sm">
                        AI-powered process automation with intelligent document processing, 
                        workflow optimization, and smart decision engines.
                      </p>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-blue-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Document Processing</span>
                        </div>
                        <div className="flex items-center text-blue-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Workflow Optimization</span>
                        </div>
                        <div className="flex items-center text-blue-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Smart Decision Engines</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                        <div className="text-white font-semibold text-sm">400+ Enterprises</div>
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
              <div className="text-3xl font-bold text-indigo-600 mb-2">800+</div>
              <div className="text-gray-600">Computer Vision</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">NLP Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">600+</div>
              <div className="text-gray-600">Predictive Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">400+</div>
              <div className="text-gray-600">Automation Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-semibold mb-6">
                  <StarIcon className="w-4 h-4 mr-2" />
                  Success Story
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Transforming Manufacturing with AI
                </h2>
                <p className="text-xl text-indigo-100 leading-relaxed mb-8">
                  "Cloud4India's AI solutions enabled us to reduce production defects by 60%, 
                  increase operational efficiency by 45%, and achieve 99.5% accuracy in quality control. 
                  The computer vision system revolutionized our manufacturing process."
                </p>
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold">DR</span>
                  </div>
                  <div>
                    <div className="font-semibold">David Rodriguez</div>
                    <div className="text-indigo-200 text-sm">CTO, Advanced Manufacturing Corp</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">60%</div>
                      <div className="text-indigo-200 text-sm">Reduction in Defects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">45%</div>
                      <div className="text-indigo-200 text-sm">Efficiency Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">99.5%</div>
                      <div className="text-indigo-200 text-sm">Quality Control Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">24/7</div>
                      <div className="text-indigo-200 text-sm">Automated Monitoring</div>
                    </div>
                  </div>
                </div>
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
              Leverage cutting-edge AI technologies designed specifically for enterprise applications 
              to drive innovation and competitive advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                AI & Machine Learning Platform
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Transform your business operations with comprehensive AI solutions including machine learning, 
                deep learning, and neural networks. Our platform is designed to meet the unique requirements 
                of enterprise AI applications.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Automated model training and deployment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Real-time inference and prediction</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Advanced neural network architectures</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Enterprise-grade AI model management</span>
                </div>
              </div>
              
              <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg flex items-center group">
                Explore AI Solutions
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <CpuChipIcon className="w-16 h-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Intelligence</h4>
                <p className="text-gray-600 leading-relaxed">
                  Advanced machine learning models and neural networks trained specifically for 
                  enterprise data patterns and business intelligence requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Use Cases & Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real-World AI Applications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how leading organizations are leveraging Cloud4India's AI solutions 
              to solve complex business challenges and drive innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Computer Vision Systems</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Advanced image and video analysis with object detection, facial recognition, 
                and automated visual inspection for quality control and security.
              </p>
              <div className="text-left mt-auto">
                <div className="text-indigo-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Object Detection • Facial Recognition • Quality Control</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Natural Language Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Advanced text analysis, sentiment analysis, and language understanding 
                for chatbots, content processing, and customer service automation.
              </p>
              <div className="text-left mt-auto">
                <div className="text-purple-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Sentiment Analysis • Text Classification • Language Translation</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-pink-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Predictive Analytics</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Machine learning models for forecasting, risk assessment, and predictive maintenance 
                with real-time insights and automated decision making.
              </p>
              <div className="text-left mt-auto">
                <div className="text-pink-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Demand Forecasting • Risk Assessment • Predictive Maintenance</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Automation</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                AI-powered process automation with intelligent document processing, 
                workflow optimization, and smart decision engines for operational efficiency.
              </p>
              <div className="text-left mt-auto">
                <div className="text-blue-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Document Processing • Workflow Optimization • Smart Decisions</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Experiences</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                AI-driven personalization with recommendation engines, behavioral analysis, 
                and dynamic content optimization for enhanced customer engagement.
              </p>
              <div className="text-left mt-auto">
                <div className="text-green-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Recommendation Engines • Behavioral Analysis • Dynamic Content</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Security & Compliance</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Advanced AI-powered security solutions with threat detection, fraud prevention, 
                and compliance monitoring for enterprise-grade protection.
              </p>
              <div className="text-left mt-auto">
                <div className="text-orange-600 text-sm font-medium mb-2">Key Features</div>
                <div className="text-gray-500 text-sm">Threat Detection • Fraud Prevention • Compliance Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Business Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Measurable AI Impact (ROI)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Quantifiable results that demonstrate the value of Cloud4India's AI solutions 
              in improving operational efficiency and driving business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">60%</div>
              <div className="text-gray-600 font-semibold mb-2">Reduction in Processing Time</div>
              <p className="text-gray-500 text-sm">AI-powered automation and intelligent workflows</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600 font-semibold mb-2">Improvement in Accuracy</div>
              <p className="text-gray-500 text-sm">Machine learning models and predictive analytics</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-pink-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-pink-600 mb-2">40%</div>
              <div className="text-gray-600 font-semibold mb-2">Cost Reduction</div>
              <p className="text-gray-500 text-sm">Intelligent automation and process optimization</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-gray-600 font-semibold mb-2">Increase in Productivity</div>
              <p className="text-gray-500 text-sm">AI-powered insights and automated decision making</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Journey Roadmap */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your AI Implementation Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A structured approach to AI transformation with dedicated support 
              at every step of your Cloud4India journey.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 via-pink-500 to-blue-500 rounded-full hidden lg:block"></div>
            
            {/* Timeline Items */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8 text-right">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-end mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                        <LightBulbIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-indigo-600 mb-1">PHASE 1</div>
                        <h3 className="text-2xl font-bold text-gray-900">AI Strategy & Assessment</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Comprehensive assessment of your current AI readiness, data infrastructure, 
                      and business objectives. We analyze your existing systems, identify AI opportunities, 
                      and create a detailed roadmap for your AI transformation journey.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 2-4 weeks
                    </div>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-indigo-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                
                <div className="flex-1 lg:pl-8"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8"></div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                
                <div className="flex-1 lg:pl-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <CogIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-purple-600 mb-1">PHASE 2</div>
                        <h3 className="text-2xl font-bold text-gray-900">AI Platform Design & Setup</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Custom AI platform architecture design with machine learning capabilities, 
                      data processing pipelines, and model deployment infrastructure. Our experts create 
                      a robust foundation that meets your specific AI requirements and scalability needs.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 4-8 weeks
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8 text-right">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-end mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                        <RocketLaunchIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-pink-600 mb-1">PHASE 3</div>
                        <h3 className="text-2xl font-bold text-gray-900">Model Development & Training</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      AI model development with data preparation, feature engineering, model training, 
                      and validation. We ensure optimal performance with continuous testing, 
                      optimization, and validation throughout the development process.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 6-12 weeks
                    </div>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                
                <div className="flex-1 lg:pl-8"></div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8"></div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                
                <div className="flex-1 lg:pl-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <HandRaisedIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-blue-600 mb-1">PHASE 4</div>
                        <h3 className="text-2xl font-bold text-gray-900">Deployment & Optimization</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Production deployment with 24/7 AI monitoring, model performance optimization, 
                      and ongoing improvement services. Our dedicated team ensures your success with 
                      continuous monitoring, updates, and enhancement.
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
              maximize the value of your Cloud4India AI platform.
            </p>
          </div>

          {/* Featured Resource - Large Card */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 mb-6">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-indigo-700 text-sm font-medium">Featured Resource</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    AI Implementation Guide
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Our comprehensive 300-page guide covers everything you need to know about 
                    implementing Cloud4India for AI, including machine learning strategies, 
                    model deployment, and real-world case studies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Download PDF Guide
                    </button>
                    <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Watch Overview
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <CpuChipIcon className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h4>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">AI strategy development</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Model development templates</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Deployment best practices</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Performance optimization guide</span>
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
              <div className="group bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-indigo-200">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                    <PlayIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Video Learning Center</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive video library with 80+ tutorials covering AI implementation, 
                      machine learning concepts, and advanced techniques.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">80+ Videos</span> • 20+ Hours Content
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center group">
                        <span>Browse Videos</span>
                        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-purple-200">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Training Programs</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive training programs including certification courses, 
                      hands-on workshops, and specialized tracks for AI roles.
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
              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-pink-300">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Connect with 12,000+ AI professionals and get expert advice.
                </p>
                <button className="text-pink-600 hover:text-pink-800 font-semibold text-sm flex items-center group">
                  <span>Join Community</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CodeBracketIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">API Documentation</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Complete API reference with AI-specific endpoints and examples.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center group">
                  <span>View APIs</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LifebuoyIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expert Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Get dedicated support from AI experts.
                </p>
                <button className="text-green-600 hover:text-green-800 font-semibold text-sm flex items-center group">
                  <span>Contact Support</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business with AI?
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Join thousands of organizations already using Cloud4India to harness the power of AI 
            and drive innovation across their business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all duration-300 shadow-lg">
              Start Your AI Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-indigo-900 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtificialIntelligence;

