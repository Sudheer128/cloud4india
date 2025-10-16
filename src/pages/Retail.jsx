import React from 'react';
import { 
  ShoppingBagIcon, 
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
  CpuChipIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  ChartPieIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Retail = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 overflow-hidden">
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
              <ShoppingBagIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Retail Solutions
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 max-w-4xl mx-auto leading-relaxed mb-8">
              Create exceptional experiences built for the future of retail. 
              Transform your business with omnichannel commerce, AI-powered insights, and seamless customer journeys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-50 transition-all duration-300 shadow-lg">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all duration-300">
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
              Why Choose Cloud4India for Retail?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built specifically for retail organizations with customer experience, 
              operational efficiency, and growth at the forefront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Omnichannel Commerce</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamless integration across online, mobile, and physical stores with 
                unified inventory, pricing, and customer data management.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-pink-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced analytics and machine learning to optimize inventory, 
                personalize customer experiences, and predict demand patterns.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Scalable Infrastructure</h3>
              <p className="text-gray-600 leading-relaxed">
                Cloud-native infrastructure that scales automatically during peak seasons, 
                ensuring optimal performance and cost efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Segments Section - Retail Focus */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Serving Every Retail Segment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From e-commerce to brick-and-mortar, we provide specialized solutions 
              tailored to your retail business's unique requirements.
            </p>
          </div>

          {/* Retail Segments Grid */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-purple-300 rounded-full"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-pink-300 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-28 h-28 border-2 border-red-300 rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-2 border-orange-300 rounded-full"></div>
            </div>

            {/* Segments Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* E-commerce - Large Feature */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="group relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-6 lg:p-8 h-full min-h-[350px] overflow-hidden hover:shadow-2xl transition-all duration-500">
                  {/* Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ShoppingBagIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">E-commerce</h3>
                      <p className="text-purple-100 text-base leading-relaxed mb-4">
                        Complete e-commerce platform with advanced features, mobile optimization, 
                        and seamless payment processing for online retail success.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-purple-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Online Store</span>
                        </div>
                        <div className="flex items-center text-purple-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Mobile Commerce</span>
                        </div>
                        <div className="flex items-center text-purple-100">
                          <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">Payment Processing</span>
                        </div>
                      </div>
                      
                      {/* Additional Features */}
                      <div className="bg-white/10 rounded-xl p-5 mb-4">
                        <div className="text-white font-semibold text-base mb-3">Key Capabilities</div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-purple-100">
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Product Catalog</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Inventory Management</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Order Management</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                            <span>Customer Analytics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-purple-100 text-sm font-medium mb-1">Trusted by</div>
                      <div className="text-white font-bold text-base">500+ Online Stores</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brick & Mortar */}
              <div className="group relative bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <BuildingLibraryIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Brick & Mortar</h3>
                    <p className="text-pink-100 text-sm leading-relaxed mb-3">
                      Point-of-sale systems and in-store technology solutions 
                      for physical retail locations.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-pink-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>POS Systems</span>
                      </div>
                      <div className="flex items-center text-pink-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Inventory Tracking</span>
                      </div>
                      <div className="flex items-center text-pink-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Customer Service</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">200+ Stores</div>
                  </div>
                </div>
              </div>

              {/* Fashion & Apparel */}
              <div className="group relative bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UserIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Fashion & Apparel</h3>
                    <p className="text-red-100 text-sm leading-relaxed mb-3">
                      Specialized solutions for fashion retailers with size guides, 
                      virtual try-on, and trend analytics.
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center text-red-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Virtual Try-On</span>
                      </div>
                      <div className="flex items-center text-red-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Size Guides</span>
                      </div>
                      <div className="flex items-center text-red-100 text-sm">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                        <span>Trend Analytics</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                    <div className="text-white font-semibold text-sm">300+ Brands</div>
                  </div>
                </div>
              </div>

              {/* Supply Chain - Spans bottom row */}
              <div className="md:col-span-2 lg:col-span-2">
                <div className="group relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-5 lg:p-6 h-full min-h-[200px] overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10 h-full flex items-center justify-between">
                    <div className="flex-1">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <TruckIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Supply Chain</h3>
                      <p className="text-orange-100 leading-relaxed mb-3 text-sm">
                        End-to-end supply chain management with logistics optimization, 
                        vendor management, and real-time tracking.
                      </p>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Logistics Optimization</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Vendor Management</span>
                        </div>
                        <div className="flex items-center text-orange-100 text-sm">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2 flex-shrink-0"></div>
                          <span>Real-time Tracking</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-white/60 text-xs font-medium mb-1">Trusted by</div>
                        <div className="text-white font-semibold text-sm">150+ Companies</div>
                      </div>
                    </div>
                    <div className="hidden lg:block ml-6">
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                        <div className="w-18 h-18 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                            <TruckIcon className="w-6 h-6 text-white" />
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
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Online Stores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">200+</div>
              <div className="text-gray-600">Physical Stores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">300+</div>
              <div className="text-gray-600">Fashion Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
              <div className="text-gray-600">Supply Chain Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-semibold mb-6">
                  <ShoppingBagIcon className="w-4 h-4 mr-2" />
                  Success Story
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Transforming Retail with Digital Innovation
                </h2>
                <p className="text-xl text-purple-100 leading-relaxed mb-8">
                  "Cloud4India's retail solutions enabled us to increase online sales by 150%, 
                  reduce inventory costs by 30%, and improve customer satisfaction by 40%. 
                  The omnichannel platform seamlessly connected all our touchpoints."
                </p>
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-bold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold">Maria Johnson</div>
                    <div className="text-purple-200 text-sm">CEO, Fashion Forward Retail</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">150%</div>
                      <div className="text-purple-200 text-sm">Increase in Online Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">30%</div>
                      <div className="text-purple-200 text-sm">Reduction in Inventory Costs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">40%</div>
                      <div className="text-purple-200 text-sm">Improved Customer Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                      <div className="text-purple-200 text-sm">Platform Uptime</div>
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
              Leverage cutting-edge technologies designed specifically for retail organizations 
              to drive innovation and competitive advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                AI & Machine Learning for Retail
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Transform your retail operations with AI-powered solutions for customer personalization, 
                demand forecasting, inventory optimization, and omnichannel experiences. 
                Our ML platform is designed to meet the unique requirements of retail businesses.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Personalized customer experiences and recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Demand forecasting and inventory optimization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Omnichannel customer journey optimization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Dynamic pricing and promotional strategies</span>
                </div>
              </div>
              
              <button className="text-purple-600 hover:text-purple-800 font-semibold text-lg flex items-center group">
                Explore AI Solutions
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center">
                  <ChartBarSquareIcon className="w-16 h-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Retail Analytics</h4>
                <p className="text-gray-600 leading-relaxed">
                  Advanced machine learning models trained specifically for retail data patterns 
                  and customer behavior analysis requirements.
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
              Real-World Retail Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how leading retail organizations are leveraging Cloud4India 
              to solve complex business challenges and drive growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Omnichannel Commerce</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Seamless integration across online, mobile, and physical stores 
                with unified inventory and customer data management.
              </p>
              <div className="text-left mt-auto">
                <div className="text-purple-600 text-sm font-medium mb-1">Key Features</div>
                <div className="text-gray-500 text-sm">Seamless Integration • Unified Inventory • Customer Data</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-pink-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Predictive Analytics</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                AI-powered demand forecasting and inventory optimization 
                with machine learning models and real-time insights.
              </p>
              <div className="text-left mt-auto">
                <div className="text-pink-600 text-sm font-medium mb-1">Key Features</div>
                <div className="text-gray-500 text-sm">AI-powered • Demand Forecasting • Real-time Insights</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Inventory</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Intelligent inventory management with automated reordering, 
                real-time tracking, and demand-based optimization.
              </p>
              <div className="text-left mt-auto">
                <div className="text-red-600 text-sm font-medium mb-1">Key Features</div>
                <div className="text-gray-500 text-sm">Automated Reordering • Real-time Tracking • Demand Optimization</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DevicePhoneMobileIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile-First Experience</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Mobile-optimized shopping experience with progressive web apps, 
                mobile payments, and location-based services.
              </p>
              <div className="text-left mt-auto">
                <div className="text-orange-600 text-sm font-medium mb-1">Key Features</div>
                <div className="text-gray-500 text-sm">Progressive Web Apps • Mobile Payments • Location Services</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-teal-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Shopping</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                AI-driven personalization with recommendation engines, 
                dynamic pricing, and targeted marketing campaigns.
              </p>
              <div className="text-left mt-auto">
                <div className="text-teal-600 text-sm font-medium mb-1">Key Features</div>
                <div className="text-gray-500 text-sm">Recommendation Engines • Dynamic Pricing • Targeted Marketing</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TruckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Supply Chain Optimization</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                End-to-end supply chain visibility with logistics optimization, 
                vendor management, and delivery tracking.
              </p>
              <div className="text-left mt-auto">
                <div className="text-indigo-600 text-sm font-medium mb-1">Key Features</div>
                <div className="text-gray-500 text-sm">Logistics Optimization • Vendor Management • Delivery Tracking</div>
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
              Measurable Retail Impact (ROI)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Quantifiable results that demonstrate the value of Cloud4India's retail solutions 
              in improving customer experience and operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">150%</div>
              <div className="text-gray-600 font-semibold mb-2">Increase in Online Sales</div>
              <p className="text-gray-500 text-sm">Omnichannel platform and mobile optimization</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-pink-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ChartBarSquareIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-pink-600 mb-2">30%</div>
              <div className="text-gray-600 font-semibold mb-2">Reduction in Inventory Costs</div>
              <p className="text-gray-500 text-sm">AI-powered demand forecasting and optimization</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-red-600 mb-2">40%</div>
              <div className="text-gray-600 font-semibold mb-2">Improvement in Customer Satisfaction</div>
              <p className="text-gray-500 text-sm">Personalized experiences and seamless omnichannel</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TruckIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">25%</div>
              <div className="text-gray-600 font-semibold mb-2">Faster Order Fulfillment</div>
              <p className="text-gray-500 text-sm">Optimized supply chain and logistics automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Journey Roadmap */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Retail Implementation Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A structured approach to retail digital transformation with dedicated support 
              at every step of your Cloud4India journey.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 via-red-500 to-orange-500 rounded-full hidden lg:block"></div>
            
            {/* Timeline Items */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8 text-right">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-end mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <LightBulbIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-purple-600 mb-1">PHASE 1</div>
                        <h3 className="text-2xl font-bold text-gray-900">Discovery & Strategy</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Comprehensive assessment of your current retail operations, customer touchpoints, 
                      and business objectives. We analyze your existing systems, identify opportunities 
                      for optimization, and create a detailed roadmap for your digital transformation.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 2-4 weeks
                    </div>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                
                <div className="flex-1 lg:pl-8"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center">
                <div className="flex-1 lg:pr-8"></div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                
                <div className="flex-1 lg:pl-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                        <CogIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-pink-600 mb-1">PHASE 2</div>
                        <h3 className="text-2xl font-bold text-gray-900">Platform Design & Integration</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Custom retail platform architecture design with omnichannel capabilities, 
                      scalability, and performance optimization. Our experts create a robust foundation 
                      that meets your specific retail requirements and customer expectations.
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
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                        <RocketLaunchIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-red-600 mb-1">PHASE 3</div>
                        <h3 className="text-2xl font-bold text-gray-900">Implementation & Testing</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Phased implementation with continuous testing, user acceptance testing, and optimization 
                      throughout the process. We ensure minimal disruption to your operations while delivering 
                      a robust, scalable retail solution.
                    </p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Duration: 8-16 weeks
                    </div>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
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
                      Smooth transition to production with 24/7 retail support, staff training, 
                      and ongoing optimization services. Our dedicated team ensures your success with 
                      continuous monitoring and improvement.
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
              maximize the value of your Cloud4India retail platform.
            </p>
          </div>

          {/* Featured Resource - Large Card */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 mb-6">
                    <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-purple-700 text-sm font-medium">Featured Resource</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Retail Implementation Guide
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Our comprehensive 200-page guide covers everything you need to know about 
                    implementing Cloud4India for retail, including omnichannel strategies, 
                    customer experience optimization, and real-world case studies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Download PDF Guide
                    </button>
                    <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Watch Overview
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <DocumentTextIcon className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h4>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Omnichannel strategy guide</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Customer experience templates</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Performance optimization guide</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">Integration best practices</span>
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
              <div className="group bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-purple-200">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                    <PlayIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Video Learning Center</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive video library with 60+ tutorials covering retail implementation, 
                      omnichannel strategies, and advanced features.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">60+ Videos</span> • 15+ Hours Content
                      </div>
                      <button className="text-purple-600 hover:text-purple-800 font-semibold flex items-center group">
                        <span>Browse Videos</span>
                        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-pink-200">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Retail Training Programs</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Comprehensive training programs including certification courses, 
                      hands-on workshops, and specialized tracks for retail roles.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold">20+ Courses</span> • 4 Certification Tracks
                      </div>
                      <button className="text-pink-600 hover:text-pink-800 font-semibold flex items-center group">
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
              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-red-300">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Retail Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Connect with 8,000+ retail professionals and get expert advice.
                </p>
                <button className="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center group">
                  <span>Join Community</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CodeBracketIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">API Documentation</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Complete API reference with retail-specific endpoints and examples.
                </p>
                <button className="text-orange-600 hover:text-orange-800 font-semibold text-sm flex items-center group">
                  <span>View APIs</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-teal-300">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LifebuoyIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expert Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Get dedicated support from retail experts.
                </p>
                <button className="text-teal-600 hover:text-teal-800 font-semibold text-sm flex items-center group">
                  <span>Contact Support</span>
                  <ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Retail Business?
          </h2>
          <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Join thousands of retail organizations already using Cloud4India to deliver 
            exceptional customer experiences and achieve operational excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-50 transition-all duration-300 shadow-lg">
              Start Your Retail Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Retail;
