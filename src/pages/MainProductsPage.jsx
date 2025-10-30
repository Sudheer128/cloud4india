import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ServerIcon, 
  CpuChipIcon, 
  CircleStackIcon,
  ShieldCheckIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { useMainProductsContent } from '../hooks/useCMS';
import LoadingSpinner from '../components/LoadingSpinner';

const MainProductsPage = () => {
  const { data: mainPageData, loading, error } = useMainProductsContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6 border border-green-200">
            <ServerIcon className="w-4 h-4 mr-2" />
            {mainPageData?.hero?.subtitle || 'Cloud Services - Made in India'}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {mainPageData?.hero?.title || 'Our Products'}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            {mainPageData?.hero?.description || 'Discover our comprehensive suite of cloud computing services designed to power your business transformation. From basic cloud servers to specialized computing solutions, we have everything you need to scale your operations.'}
          </p>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {mainPageData?.sections && mainPageData.sections.map((section, index) => (
              <ProductSection key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Individual Product Section Component
const ProductSection = ({ section, index }) => {
  const isEven = index % 2 === 0;
  
  // Mock data for key features - this will come from CMS later
  const mockFeatures = [
    {
      icon: CpuChipIcon,
      title: "High Performance",
      description: "Optimized for maximum performance and reliability"
    },
    {
      icon: ShieldCheckIcon,
      title: "Enterprise Security", 
      description: "Built-in security features and compliance"
    },
    {
      icon: CircleStackIcon,
      title: "Scalable Resources",
      description: "Scale up or down based on your needs"
    }
  ];

  // Mock pricing data - this will come from CMS later
  const mockPricing = {
    startingPrice: "₹2,999",
    billingCycle: "per month",
    freeTrialAvailable: true
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Content Side */}
      <div className={`${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-4">
          {section.category}
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          {section.title}
        </h2>
        
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {section.description}
        </p>

        {/* Key Features */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {mockFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div> <br></br> <br></br>
          
          {/* Explore More Button - Under Key Features with proper spacing */}
          <div className="text-left mt-8">
          <Link 
            to={`/products/${section.product_id}`}
              className="inline-flex items-center bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore More
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Side - Always on the right */}
      <div className={`${!isEven ? 'lg:order-1' : 'lg:order-2'} flex flex-col space-y-4`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200 shadow-xl">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ServerIcon className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Try It Now</h3>
            <p className="text-gray-600 mb-6">Experience {section.title.toLowerCase()} in your browser</p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-md">
              Launch Console
            </button>
          </div>
        </div>
        
        {/* Pricing Overview - Under Try It Now card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            {mockPricing.freeTrialAvailable && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Free Trial Available
              </span>
            )}
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-green-600">{mockPricing.startingPrice}</span>
            <span className="text-gray-600">{mockPricing.billingCycle}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Starting price - multiple plans available</p>
        </div>
      </div>
    </div>
  );
};

export default MainProductsPage;
