import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowRightIcon,
  StarIcon,
  BuildingOfficeIcon,
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
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  ChartPieIcon,
  LockClosedIcon,
  CloudIcon,
  CheckCircleIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import { useSolutionSections } from '../hooks/useSolutionSections'
import { useSectionItems } from '../hooks/useSectionItems'
import { appThemeColors, getGradient, getTextColor, getHoverBorder } from '../utils/appThemeColors'

// Rupee Icon - displays ₹ symbol using Unicode character
const RupeeIconSimple = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="12"
      y="17"
      fontSize="20"
      fontWeight="bold"
      textAnchor="middle"
      fill="currentColor"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      ₹
    </text>
  </svg>
);

const UniversalSolutionPage = () => {
  const { solutionId } = useParams();
  const { sections, loading, error } = useSolutionSections(parseInt(solutionId));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-saree-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading solution content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Content</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="text-saree-teal hover:text-saree-teal-dark font-semibold">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Content Available</h1>
          <p className="text-gray-600 mb-4">This solution page doesn't have any content yet.</p>
          <Link to="/" className="text-saree-teal hover:text-saree-teal-dark font-semibold">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to get section by order
  const getSectionByOrder = (order) => {
    return sections.find(section => section.order_index === order);
  };

  // Component for dynamic benefit cards
  const DynamicBenefitCards = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No items found</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => {
          const colorClasses = [
            'hover:border-saree-teal',
            'hover:border-saree-amber',
            'hover:border-saree-lime'
          ];
          const gradientClasses = [
            'from-saree-teal to-saree-teal-dark',
            'from-saree-amber to-saree-amber-dark',
            'from-saree-lime to-saree-lime-dark'
          ];
          const textColorClasses = [
            'text-saree-teal',
            'text-saree-amber',
            'text-saree-lime'
          ];

          const colorClass = colorClasses[index % colorClasses.length];
          const gradientClass = gradientClasses[index % gradientClasses.length];
          const textColorClass = textColorClasses[index % textColorClasses.length];

          // Icon mapping
          const iconMap = {
            'ShieldCheckIcon': ShieldCheckIcon,
            'LockClosedIcon': LockClosedIcon,
            'ChartBarIcon': ChartBarIcon,
            'CogIcon': CogIcon,
            'CloudIcon': CloudIcon,
            'ScaleIcon': ScaleIcon
          };
          const IconComponent = iconMap[item.icon] || ShieldCheckIcon;

          // Parse features if they exist
          let featuresList = [];
          if (item.features) {
            try {
              featuresList = JSON.parse(item.features);
            } catch (e) {
              console.error('Error parsing features:', e);
              featuresList = [];
            }
          }

          return (
            <div key={item.id} className={`group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 ${colorClass} flex flex-col h-full`}>
              <div className={`w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>
              {featuresList.length > 0 && (
                <div className="text-left mt-auto">
                  <div className={`${textColorClass} text-sm font-medium mb-3`}>Key Features</div>
                  <div className="space-y-2">
                    {featuresList.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic financial segments
  const DynamicFinancialSegments = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No items found</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, index) => {
          const gradients = [
            'from-saree-teal to-saree-teal-dark',
            'from-saree-amber to-saree-amber-dark',
            'from-saree-lime to-saree-lime-dark',
            'from-saree-coral to-saree-coral-dark'
          ];
          const gradient = gradients[index % gradients.length];

          // Icon mapping
          const iconMap = {
            'CurrencyDollarIcon': RupeeIconSimple,
            'ChartPieIcon': ChartPieIcon,
            'ShieldCheckIcon': ShieldCheckIcon,
            'CogIcon': CogIcon
          };
          const IconComponent = iconMap[item.icon] || RupeeIconSimple;

          return (
            <div key={item.id} className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 h-full min-h-[350px]`}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/90 text-base leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="text-left">
                <div className="text-white/80 text-sm font-medium mb-1">Trusted by</div>
                <div className="text-white font-bold text-base">{item.value || '500+ Institutions'}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic ROI stats
  const DynamicROIStats = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No items found</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, index) => {
          const colorClasses = [
            'bg-saree-teal-light border-saree-teal',
            'bg-saree-amber-light border-saree-amber',
            'bg-saree-lime-light border-saree-lime',
            'bg-saree-coral-light border-saree-coral'
          ];
          const textColorClasses = [
            'text-saree-teal',
            'text-saree-amber',
            'text-saree-lime',
            'text-saree-coral'
          ];

          const colorClass = colorClasses[index % colorClasses.length];
          const textColorClass = textColorClasses[index % textColorClasses.length];

          return (
            <div key={item.id} className={`${colorClass} rounded-2xl p-8 text-center border-2`}>
              <div className={`text-4xl font-bold ${textColorClass} mb-2`}>{item.value || '40%'}</div>
              <div className="text-gray-600 font-semibold mb-2">{item.title}</div>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic HSBC success story metrics
  // const DynamicHSBCMetrics = ({ sectionId }) => {
  //   const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

  //   if (loading) return <div>Loading...</div>;
  //   if (error) return <div>Error loading items: {error}</div>;

  //   if (!items || items.length === 0) return <div>No metrics found</div>;

  //   return (
  //     <div className="grid grid-cols-2 gap-6">
  //       {items.map((item, index) => (
  //         <div key={item.id} className="text-center">
  //           <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
  //           <div className="text-blue-200 text-sm">{item.title}</div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // Component for dynamic Advanced Technology Solutions
  const DynamicTechSolutions = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No content found</div>;

    const aiMlItem = items.find(item => item.order_index === 0);
    const analyticsItem = items.find(item => item.order_index === 1);

    let aiMlFeatures = [];
    if (aiMlItem && aiMlItem.features) {
      try {
        aiMlFeatures = JSON.parse(aiMlItem.features);
      } catch (e) {
        console.error('Error parsing AI/ML features:', e);
        aiMlFeatures = [];
      }
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {aiMlItem?.title || 'AI & Machine Learning for Financial Services'}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {aiMlItem?.description || 'Transform your financial operations with AI-powered apps for fraud detection, risk assessment, algorithmic trading, and personalized financial recommendations. Our ML platform is designed to meet the unique requirements of financial institutions.'}
          </p>

          <div className="space-y-4 mb-8">
            {aiMlFeatures.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <button className="text-saree-teal hover:text-saree-teal-dark font-semibold text-lg flex items-center group">
            {aiMlItem?.value || 'Explore AI Apps'}
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-saree-teal-light to-saree-lime-light rounded-3xl p-8 lg:p-12">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-saree-teal to-saree-lime-dark rounded-3xl flex items-center justify-center">
              <ChartBarSquareIcon className="w-16 h-16 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              {analyticsItem?.title || 'AI-Powered Financial Analytics'}
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {analyticsItem?.description || 'Advanced machine learning models trained specifically for financial data patterns and risk assessment requirements.'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Component for dynamic Real-World Use Cases
  const DynamicUseCases = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No use cases found</div>;

    const colorClasses = [
      'hover:border-saree-teal',
      'hover:border-saree-coral',
      'hover:border-saree-lime'
    ];

    const gradientClasses = [
      'from-saree-teal to-saree-teal-dark',
      'from-saree-coral to-saree-coral-dark',
      'from-saree-lime to-saree-lime-dark'
    ];

    const textColorClasses = [
      'text-saree-teal',
      'text-saree-coral',
      'text-saree-lime'
    ];

    // Icon mapping
    const iconMap = {
      'BanknotesIcon': BanknotesIcon,
      'ShieldCheckIcon': ShieldExclamationIcon,
      'CreditCardIcon': CreditCardIcon
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {items.map((item, index) => {
          const colorClass = colorClasses[index % colorClasses.length];
          const gradientClass = gradientClasses[index % gradientClasses.length];
          const textColorClass = textColorClasses[index % textColorClasses.length];
          const IconComponent = iconMap[item.icon] || BanknotesIcon;

          // Parse features if they exist
          let featuresList = [];
          if (item.features) {
            try {
              featuresList = JSON.parse(item.features);
            } catch (e) {
              console.error('Error parsing features:', e);
              featuresList = [];
            }
          }

          return (
            <div key={item.id} className={`group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 ${colorClass} flex flex-col h-full`}>
              <div className={`w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>
              {featuresList.length > 0 && (
                <div className="text-left mt-auto">
                  <div className={`${textColorClass} text-sm font-medium mb-3`}>Key Features</div>
                  <div className="space-y-2">
                    {featuresList.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Component for dynamic Implementation Journey timeline
  const DynamicImplementationJourney = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No timeline phases found</div>;

    const colorClasses = [
      'from-saree-teal to-saree-teal-dark',
      'from-saree-amber to-saree-amber-dark',
      'from-saree-lime to-saree-lime-dark',
      'from-saree-coral to-saree-coral-dark'
    ];

    const nodeColors = [
      'bg-saree-teal',
      'bg-saree-amber',
      'bg-saree-lime',
      'bg-saree-coral'
    ];

    const textColors = [
      'text-saree-teal',
      'text-saree-amber',
      'text-saree-lime',
      'text-saree-coral'
    ];

    // Icon mapping
    const iconMap = {
      'LightBulbIcon': LightBulbIcon,
      'CogIcon': CogIcon,
      'RocketLaunchIcon': RocketLaunchIcon,
      'HandRaisedIcon': HandRaisedIcon
    };

    return (
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-saree-teal via-saree-amber via-saree-lime to-saree-coral rounded-full hidden lg:block"></div>

        {/* Timeline Items */}
        <div className="space-y-16">
          {items.map((item, index) => {
            const colorClass = colorClasses[index % colorClasses.length];
            const nodeColor = nodeColors[index % nodeColors.length];
            const textColor = textColors[index % textColors.length];
            const IconComponent = iconMap[item.icon] || LightBulbIcon;
            const isLeft = index % 2 === 0;

            return (
              <div key={item.id} className="relative flex items-center">
                {isLeft ? (
                  <>
                    <div className="flex-1 lg:pr-8 text-right">
                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-end mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mr-4`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${textColor} mb-1`}>PHASE {index + 1}</div>
                            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-end text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Duration: {item.value}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 ${nodeColor} rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>

                    <div className="flex-1 lg:pl-8"></div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 lg:pr-8"></div>

                    {/* Timeline Node */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 ${nodeColor} rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>

                    <div className="flex-1 lg:pl-8">
                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mr-4`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className={`text-sm font-semibold ${textColor} mb-1`}>PHASE {index + 1}</div>
                            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          Duration: {item.value}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Component for dynamic Resources & Documentation
  const DynamicResourcesDocs = ({ sectionId }) => {
    const { items, loading, error } = useSectionItems(parseInt(solutionId), sectionId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error}</div>;

    if (!items || items.length === 0) return <div>No resources found</div>;

    const featuredResource = items.find(item => item.order_index === 0);
    const resourceCategories = items.filter(item => item.order_index > 0 && !item.title.toLowerCase().includes('community forum'));

    let featuredFeatures = [];
    if (featuredResource && featuredResource.features) {
      try {
        featuredFeatures = JSON.parse(featuredResource.features);
      } catch (e) {
        console.error('Error parsing featured resource features:', e);
        featuredFeatures = [];
      }
    }

    // Icon mapping
    const iconMap = {
      'DocumentTextIcon': DocumentTextIcon,
      'PlayIcon': PlayIcon,
      'CodeBracketIcon': CodeBracketIcon,
      'UsersIcon': UsersIcon
    };

    return (
      <div>
        {/* Featured Resource - Large Card */}
        {featuredResource && (
          <div className="mb-16">
            <div className="bg-gradient-to-br from-saree-teal-light to-saree-lime-light rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-saree-teal/20 border border-saree-teal/30 mb-6">
                    <DocumentTextIcon className="h-5 w-5 text-saree-teal mr-2" />
                    <span className="text-saree-teal-dark text-sm font-medium">{featuredResource.label}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {featuredResource.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    {featuredResource.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-saree-teal hover:bg-saree-teal-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-saree-teal/25 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      {featuredResource.value}
                    </button>
                    <button className="border-2 border-saree-teal text-saree-teal hover:bg-saree-teal hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center">
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Watch Overview
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-saree-teal to-saree-teal-dark rounded-2xl flex items-center justify-center">
                      <DocumentTextIcon className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h4>
                    <div className="space-y-3 text-left">
                      {featuredFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-saree-teal mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resource Categories - Mixed Layout */}
        <div className="space-y-12">
          {/* Row 1: Two Large Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resourceCategories.slice(0, 2).map((item, index) => {
              const gradients = [
                'from-saree-lime-light to-saree-lime-light',
                'from-saree-amber-light to-saree-amber-light'
              ];
              const iconGradients = [
                'from-saree-lime to-saree-lime-dark',
                'from-saree-amber to-saree-amber-dark'
              ];
              const textColors = [
                'text-saree-lime',
                'text-saree-amber'
              ];
              const borderColors = [
                'border-saree-lime',
                'border-saree-amber'
              ];

              const gradient = gradients[index % gradients.length];
              const iconGradient = iconGradients[index % iconGradients.length];
              const textColor = textColors[index % textColors.length];
              const borderColor = borderColors[index % borderColors.length];
              const IconComponent = iconMap[item.icon] || PlayIcon;

              return (
                <div key={item.id} className={`group bg-gradient-to-br ${gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border ${borderColor} flex flex-col`}>
                  <div className="flex items-start mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    <button className={`${textColor} hover:opacity-80 font-semibold flex items-center group`}>
                      <span>{item.label}</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: Two Large Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resourceCategories.slice(2, 4).map((item, index) => {
              const gradients = [
                'from-saree-coral-light to-saree-coral-light',
                'from-saree-teal-light to-saree-teal-light'
              ];
              const iconGradients = [
                'from-saree-coral to-saree-coral-dark',
                'from-saree-teal to-saree-teal-dark'
              ];
              const textColors = [
                'text-saree-coral',
                'text-saree-teal'
              ];
              const borderColors = [
                'border-saree-coral',
                'border-saree-teal'
              ];

              const gradient = gradients[index % gradients.length];
              const iconGradient = iconGradients[index % iconGradients.length];
              const textColor = textColors[index % textColors.length];
              const borderColor = borderColors[index % borderColors.length];
              const IconComponent = iconMap[item.icon] || CodeBracketIcon;

              return (
                <div key={item.id} className={`group bg-gradient-to-br ${gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border ${borderColor} flex flex-col`}>
                  <div className="flex items-start mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    <button className={`${textColor} hover:opacity-80 font-semibold flex items-center group`}>
                      <span>{item.label}</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {getSectionByOrder(0) && (
        <section className="relative py-20 bg-gradient-to-br from-saree-teal via-saree-teal to-saree-teal-dark overflow-hidden">
          {/* Dot Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          ></div>
          
          {/* Hexagon Pattern Overlay (additional sophistication) */}
          <div 
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          ></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
                <BanknotesIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                {getSectionByOrder(0).title}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed mb-8">
                {getSectionByOrder(0).content}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-saree-teal px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg">
                  Get Started Today
                </button>
                <button className="border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Benefits Section */}
      {getSectionByOrder(1) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getSectionByOrder(1).title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getSectionByOrder(1).content}
              </p>
            </div>

            <DynamicBenefitCards sectionId={getSectionByOrder(1).id} />
          </div>
        </section>
      )}

      {/* Industry Segments Section - Financial Focus */}
      {getSectionByOrder(2) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getSectionByOrder(2).title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getSectionByOrder(2).content}
              </p>
            </div>

            <DynamicFinancialSegments sectionId={getSectionByOrder(2).id} />

            {/* Bottom Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-saree-teal mb-2">500+</div>
                <div className="text-gray-600">Banking Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-saree-amber mb-2">200+</div>
                <div className="text-gray-600">Capital Market Firms</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-saree-lime mb-2">300+</div>
                <div className="text-gray-600">Insurance Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-saree-coral mb-2">150+</div>
                <div className="text-gray-600">Payment Providers</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Success Story Section */}
      {/* {getSectionByOrder(3) && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-semibold mb-6">
                    <StarIcon className="w-4 h-4 mr-2" />
                    Success Story
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    {getSectionByOrder(3).title}nt h
                  </h2>
                  <p className="text-xl text-blue-100 leading-relaxed mb-8">
                    {getSectionByOrder(3).content}
                  </p>
                  <div className="flex items-center text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-bold">HS</span>
                    </div>
                    <div>
                      <div className="font-semibold">HSBC</div>
                      <div className="text-blue-200 text-sm">Global Banking and Financial Services</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <DynamicHSBCMetrics sectionId={getSectionByOrder(3).id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* Technology Solutions Section */}
      {getSectionByOrder(4) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getSectionByOrder(4).title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getSectionByOrder(4).content}
              </p>
            </div>

            <DynamicTechSolutions sectionId={getSectionByOrder(4).id} />
          </div>
        </section>
      )}

      {/* Real-World Use Cases & Solutions */}
      {getSectionByOrder(5) && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getSectionByOrder(5).title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getSectionByOrder(5).content}
              </p>
            </div>

            <DynamicUseCases sectionId={getSectionByOrder(5).id} />
          </div>
        </section>
      )}

      {/* Implementation Journey Roadmap */}
      {getSectionByOrder(7) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getSectionByOrder(7).title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getSectionByOrder(7).content}
              </p>
            </div>

            <DynamicImplementationJourney sectionId={getSectionByOrder(7).id} />
          </div>
        </section>
      )}

      {/* ROI & Business Impact Section */}
      {getSectionByOrder(6) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getSectionByOrder(6).title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getSectionByOrder(6).content}
              </p>
            </div>

            <DynamicROIStats sectionId={getSectionByOrder(6).id} />
          </div>
        </section>
      )}

      {/* Resources & Documentation Section - Mixed Layout */}
      {getSectionByOrder(8) && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {getSectionByOrder(8).title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {getSectionByOrder(8).content}
              </p>
            </div>

            <DynamicResourcesDocs sectionId={getSectionByOrder(8).id} />
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      {getSectionByOrder(9) && (
        <section className="relative py-20 bg-gradient-to-br from-saree-teal via-saree-teal to-saree-teal-dark overflow-hidden">
          {/* Dot Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          ></div>
          
          {/* Hexagon Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          ></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {getSectionByOrder(9).title}
            </h2>
            <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed mb-8">
              {getSectionByOrder(9).content}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-saree-teal px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg">
                Start Your Financial Journey
              </button>
              <button className="border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default UniversalSolutionPage


