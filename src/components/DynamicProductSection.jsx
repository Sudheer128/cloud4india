import React from 'react';
import { 
  CheckIcon, 
  StarIcon, 
  ServerIcon, 
  CpuChipIcon, 
  CircleStackIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

// Icon mapping for dynamic rendering
const iconMap = {
  'CpuChipIcon': CpuChipIcon,
  'ShieldCheckIcon': ShieldCheckIcon,
  'ClockIcon': ClockIcon,
  'CurrencyDollarIcon': CurrencyDollarIcon,
  'ChartBarIcon': ChartBarIcon,
  'GlobeAltIcon': GlobeAltIcon,
  'UsersIcon': UsersIcon,
  'ServerIcon': ServerIcon,
  'CircleStackIcon': CircleStackIcon,
  'CheckIcon': CheckIcon,
  'StarIcon': StarIcon,
  'ArrowRightIcon': ArrowRightIcon,
  'EyeIcon': EyeIcon,
  'EyeSlashIcon': EyeSlashIcon
};

const DynamicProductSection = ({ section, items }) => {
  // Don't render if section is hidden
  if (!section.is_visible) {
    return null;
  }

  // Render different section types
  switch (section.section_type) {
    case 'hero':
      return <HeroSection section={section} items={items} />;
    case 'features':
      return <FeaturesSection section={section} items={items} />;
    case 'pricing':
      return <PricingSection section={section} items={items} />;
    case 'specifications':
      return <SpecificationsSection section={section} items={items} />;
    case 'security':
      return <SecuritySection section={section} items={items} />;
    case 'support':
      return <SupportSection section={section} items={items} />;
    case 'migration':
      return <MigrationSection section={section} items={items} />;
    case 'use_cases':
      return <UseCasesSection section={section} items={items} />;
    case 'cta':
      return <CTASection section={section} items={items} />;
    default:
      return <DefaultSection section={section} items={items} />;
  }
};

// Hero Section Component
const HeroSection = ({ section, items }) => {
  // Get items by type for dynamic rendering
  const badgeItem = items.find(item => item.item_type === 'badge' && item.is_visible);
  const titleItem = items.find(item => item.item_type === 'title' && item.is_visible);
  const descriptionItem = items.find(item => item.item_type === 'description' && item.is_visible);
  const primaryCTAItem = items.find(item => item.item_type === 'cta_primary' && item.is_visible);
  const secondaryCTAItem = items.find(item => item.item_type === 'cta_secondary' && item.is_visible);
  const heroImageItem = items.find(item => item.item_type === 'image' && item.is_visible);

  return (
    <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {badgeItem && (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6 border border-green-200">
                <ServerIcon className="w-4 h-4 mr-2" />
                {badgeItem.title}
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {titleItem?.title || section.title || 'Product Name'}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {descriptionItem?.title || section.description || 'Product description goes here'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCTAItem && (
                <button className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  {primaryCTAItem.title}
                </button>
              )}
              {secondaryCTAItem && (
                <button className="border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-300">
                  {secondaryCTAItem.title}
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200 shadow-xl">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ServerIcon className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Try It Now</h3>
                <p className="text-gray-600 mb-6">Experience cloud computing in your browser</p>
                <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 shadow-md">
                  Launch Console
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Key Features'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Discover the key features that make this product special'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || CpuChipIcon;
            const isOrange = index % 2 === 0;
            
            return (
              <div key={item.id} className={`bg-gradient-to-br ${isOrange ? 'from-orange-50 to-orange-100' : 'from-green-50 to-green-100'} p-8 rounded-xl border ${isOrange ? 'border-orange-200' : 'border-green-200'} hover:shadow-lg transition-all duration-300`}>
                <div className={`w-12 h-12 ${isOrange ? 'bg-orange-500' : 'bg-green-500'} rounded-lg flex items-center justify-center mb-6`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Pricing'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Choose the perfect plan for your needs'}
          </p>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-500 to-orange-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Plan</th>
                  <th className="px-6 py-4 text-left font-semibold">Specifications</th>
                  <th className="px-6 py-4 text-left font-semibold">Features</th>
                  <th className="px-6 py-4 text-left font-semibold">Pricing</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.filter(item => item.is_visible).map((item) => {
                  let content = {};
                  try {
                    content = item.content ? JSON.parse(item.content) : {};
                  } catch (e) {
                    console.error('Error parsing pricing content:', e);
                  }
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {content.specifications?.map((spec, index) => (
                            <div key={index}>{spec}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {content.features?.map((feature, index) => (
                            <div key={index}>{feature}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-lg font-bold ${content.price === 'Absolutely Free' ? 'text-green-600' : 'text-orange-600'}`}>
                          {content.price || item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className={`${content.buttonColor === 'green' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300`}>
                          {content.buttonText || 'Order Now'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// Specifications Section Component
const SpecificationsSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Technical Specifications'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Detailed technical information'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || CpuChipIcon;
            const isGreen = index % 2 === 0;
            
            let content = {};
            try {
              content = item.content ? JSON.parse(item.content) : {};
            } catch (e) {
              console.error('Error parsing spec content:', e);
            }
            
            return (
              <div key={item.id} className={`bg-gradient-to-br ${isGreen ? 'from-green-50 to-green-100' : 'from-orange-50 to-orange-100'} p-8 rounded-xl border ${isGreen ? 'border-green-200' : 'border-orange-200'}`}>
                <div className={`w-12 h-12 ${isGreen ? 'bg-green-500' : 'bg-orange-500'} rounded-lg flex items-center justify-center mb-6`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <ul className="space-y-2 text-gray-700">
                  {content.features?.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Security Section Component
const SecuritySection = ({ section, items }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Security & Compliance'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Enterprise-grade security features'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              {items.filter(item => item.is_visible).map((item, index) => {
                const IconComponent = iconMap[item.icon] || ShieldCheckIcon;
                const isGreen = index % 2 === 0;
                
                return (
                  <div key={item.id} className="flex items-start">
                    <div className={`w-12 h-12 ${isGreen ? 'bg-green-500' : 'bg-orange-500'} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Security Features</h3>
            <div className="space-y-4">
              {['DDoS Protection', 'Intrusion Detection', 'Regular Security Updates', 'Access Control', 'Audit Logging', 'Backup & Recovery'].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Support Section Component
const SupportSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Support & Service Level Agreement'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Round-the-clock support and guaranteed uptime'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || ClockIcon;
            const isGreen = index % 2 === 0;
            
            return (
              <div key={item.id} className="text-center">
                <div className={`w-16 h-16 ${isGreen ? 'bg-green-500' : 'bg-orange-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Migration Section Component
const MigrationSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Easy Migration & Onboarding'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Seamless migration with expert guidance'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const isGreen = index % 2 === 0;
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className={`w-12 h-12 ${isGreen ? 'bg-green-500' : 'bg-orange-500'} rounded-lg flex items-center justify-center mb-6`}>
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Use Cases Section Component
const UseCasesSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Perfect For'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'See how this product perfectly matches different business needs'}
          </p>
        </div>

        <div className="space-y-16">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || GlobeAltIcon;
            const isGreen = index % 2 === 0;
            
            let content = {};
            try {
              content = item.content ? JSON.parse(item.content) : {};
            } catch (e) {
              console.error('Error parsing use case content:', e);
            }
            
            return (
              <div key={item.id} className={`bg-gradient-to-r ${isGreen ? 'from-green-50 to-green-100' : 'from-orange-50 to-orange-100'} rounded-2xl p-8 border ${isGreen ? 'border-green-200' : 'border-orange-200'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <div className={`w-20 h-20 ${isGreen ? 'bg-green-500' : 'bg-orange-500'} rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-6xl mb-4">→</div>
                    <div className="text-sm text-gray-500 font-medium">PERFECT MATCH</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Why It's Perfect:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {content.benefits?.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center">
                          <div className={`w-2 h-2 ${isGreen ? 'bg-green-500' : 'bg-orange-500'} rounded-full mr-3`}></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


// CTA Section Component
const CTASection = ({ section, items }) => {
  // Get items by type for dynamic rendering
  const titleItem = items.find(item => item.item_type === 'title' && item.is_visible);
  const descriptionItem = items.find(item => item.item_type === 'description' && item.is_visible);
  const primaryCTAItem = items.find(item => item.item_type === 'cta_primary' && item.is_visible);
  const secondaryCTAItem = items.find(item => item.item_type === 'cta_secondary' && item.is_visible);

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          {titleItem?.title || section.title || 'Ready to Get Started?'}
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          {descriptionItem?.title || section.description || 'Join thousands of businesses already using our products'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTAItem && (
            <button className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {primaryCTAItem.title}
            </button>
          )}
          {secondaryCTAItem && (
            <button className="border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-300">
              {secondaryCTAItem.title}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// Default Section Component (fallback)
const DefaultSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Section'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Section description'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item) => (
            <div key={item.id} className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicProductSection;

