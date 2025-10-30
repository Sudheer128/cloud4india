import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BanknotesIcon,
  ShoppingBagIcon, 
  HeartIcon,
  CpuChipIcon,
  ServerIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { useMainSolutionsContent } from '../hooks/useCMS';
import LoadingSpinner from '../components/LoadingSpinner';

const MainSolutionsPage = () => {
  const { data: mainPageData, loading, error } = useMainSolutionsContent();

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Solutions</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-6 border border-gray-300">
            <CpuChipIcon className="w-4 h-4 mr-2" />
            {mainPageData?.hero?.subtitle || 'Industry Solutions'}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {mainPageData?.hero?.title || 'Our Solutions'}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            {mainPageData?.hero?.description || 'Discover industry-specific cloud solutions tailored for your business needs. From financial services to healthcare, our specialized solutions drive digital transformation across various sectors.'}
          </p>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {mainPageData?.sections && mainPageData.sections.map((section, index) => (
              <SolutionSection key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Individual Solution Section Component
const SolutionSection = ({ section, index }) => {
  const isEven = index % 2 === 0;
  
  // Get solution color scheme based on category/color
  const getColorScheme = (color) => {
    const colorSchemes = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        button: 'bg-blue-500 hover:bg-blue-600',
        accent: 'bg-blue-100 text-blue-800',
        iconBg: 'from-blue-500 to-blue-600'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        button: 'bg-purple-500 hover:bg-purple-600',
        accent: 'bg-purple-100 text-purple-800',
        iconBg: 'from-purple-500 to-purple-600'
      },
      green: {
        bg: 'from-green-50 to-green-100',
        border: 'border-green-200',
        button: 'bg-green-500 hover:bg-green-600',
        accent: 'bg-green-100 text-green-800',
        iconBg: 'from-green-500 to-green-600'
      },
      orange: {
        bg: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        button: 'bg-orange-500 hover:bg-orange-600',
        accent: 'bg-orange-100 text-orange-800',
        iconBg: 'from-orange-500 to-orange-600'
      }
    };
    return colorSchemes[color] || colorSchemes.blue;
  };

  const colorScheme = getColorScheme('blue'); // Default to blue for now
  
  // Get appropriate icon based on solution name
  const getIcon = (name) => {
    if (name.toLowerCase().includes('financial')) return BanknotesIcon;
    if (name.toLowerCase().includes('retail')) return ShoppingBagIcon;
    if (name.toLowerCase().includes('healthcare')) return HeartIcon;
    if (name.toLowerCase().includes('compute') || name.toLowerCase().includes('ai')) return CpuChipIcon;
    return ServerIcon;
  };

  const IconComponent = getIcon(section.title);

  // Mock data for key features - this will come from CMS later
  const mockFeatures = [
    {
      title: "Industry Compliance",
      description: "Built-in compliance for industry regulations"
    },
    {
      title: "Specialized Tools", 
      description: "Industry-specific tools and integrations"
    },
    {
      title: "Expert Support",
      description: "Dedicated support from industry experts"
    }
  ];

  // Mock benefits data - this will come from CMS later
  const mockBenefits = {
    efficiency: "40% faster deployment",
    cost: "30% cost reduction",
    compliance: "100% regulatory compliance"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Content Side */}
      <div className={`${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className={`inline-flex items-center px-3 py-1 ${colorScheme.accent} rounded-full text-sm font-medium mb-4`}>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Capabilities</h3>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {mockFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 ${colorScheme.button.split(' ')[0]} rounded-full mt-3`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div> <br></br> <br></br>
          
          {/* Explore More Button - Under Key Capabilities with proper spacing */}
          <div className="text-left mt-8">
          <Link 
            to={`/solutions/${section.solution_id}`}
              className={`inline-flex items-center ${colorScheme.button} text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              Explore More
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Side - Always on the right */}
      <div className={`${!isEven ? 'lg:order-1' : 'lg:order-2'} flex flex-col space-y-4`}>
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 border ${colorScheme.border} shadow-xl`}>
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${colorScheme.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Learn More</h3>
            <p className="text-gray-600 mb-6">Discover how {section.title.toLowerCase()} can transform your business</p>
            <button className={`${colorScheme.button} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md`}>
              Get Started
            </button>
          </div>
        </div>
        
        {/* Benefits Overview - Under Learn More card */}
        <div className={`bg-gradient-to-br ${colorScheme.bg} rounded-xl p-6 border ${colorScheme.border}`}>
          <h3 className={`text-lg font-semibold mb-4 ${colorScheme.button.includes('blue') ? 'text-blue-600' : colorScheme.button.includes('purple') ? 'text-purple-600' : colorScheme.button.includes('green') ? 'text-green-600' : 'text-orange-600'}`}>Key Benefits</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">40% faster deployment</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">30% cost reduction</div>
            </div>
            <div className="text-center col-span-2">
              <div className="text-xl font-bold text-gray-900">100% regulatory compliance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSolutionsPage;
