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
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-phulkari-turquoise via-saree-teal to-saree-teal-dark">
      {/* Different Background Patterns - Inspired but unique */}
      <div className="absolute inset-0">
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
        }}></div>
        
        {/* Hexagon shapes instead of circles */}
        <div className="absolute top-20 right-10 w-48 h-48 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-20 w-64 h-64 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="white" strokeWidth="3"/>
          </svg>
        </div>
        
        {/* Curved wave overlays */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-saree-amber/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {badgeItem && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-saree-amber text-gray-900 text-sm font-bold mb-6 rounded-lg shadow-xl">
                <ServerIcon className="w-5 h-5" />
                {badgeItem.title}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {section.title || titleItem?.title || 'Product Name'}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
              {section.description || descriptionItem?.title || 'Product description goes here'}
            </p>
            
            {/* Feature list with icons */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-saree-amber rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-4 h-4 text-gray-900" />
                </div>
                <span className="text-base font-medium">Instant deployment in seconds</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-saree-amber rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-4 h-4 text-gray-900" />
                </div>
                <span className="text-base font-medium">24/7 expert support included</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 bg-saree-amber rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-4 h-4 text-gray-900" />
                </div>
                <span className="text-base font-medium">Enterprise-grade security</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCTAItem && (
                <button className="px-8 py-4 bg-saree-amber text-gray-900 text-base font-bold rounded-lg hover:bg-saree-amber-dark transition-all duration-300 shadow-2xl hover:scale-105 transform">
                  {primaryCTAItem.title}
                </button>
              )}
              {secondaryCTAItem && (
                <button className="px-8 py-4 bg-transparent text-white text-base font-bold rounded-lg border-2 border-white hover:bg-white hover:text-saree-teal-dark transition-all duration-300 shadow-xl">
                  {secondaryCTAItem.title}
                </button>
              )}
            </div>
          </div>

          {/* Right Card - Different design with feature cards stacked */}
          <div className="space-y-4">
            {/* Main CTA Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-saree-teal to-phulkari-turquoise rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ServerIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Try It Now</h3>
                  <p className="text-sm text-gray-600">Start in 60 seconds</p>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-saree-teal to-phulkari-turquoise text-white px-6 py-3.5 rounded-lg font-bold text-base hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Launch Console →
              </button>
            </div>

            {/* Stats Cards in a row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
                <div className="text-2xl font-bold text-saree-teal mb-1">99.9%</div>
                <div className="text-xs text-gray-600 font-semibold">Uptime</div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
                <div className="text-2xl font-bold text-saree-amber mb-1">24/7</div>
                <div className="text-xs text-gray-600 font-semibold">Support</div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
                <div className="text-2xl font-bold text-saree-lime mb-1">Free</div>
                <div className="text-xs text-gray-600 font-semibold">Trial</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top diagonal accent instead of bottom wave */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = ({ section, items }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-saree-teal-light/30 via-white to-saree-amber-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Key Features'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Discover the key features that make this product special'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || CpuChipIcon;
            // 6 colors to avoid same pattern in 3-column grid
            const colors = [
              { bg: 'from-saree-teal-light to-white', border: 'border-saree-teal', iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-light hover:border-saree-teal-dark' },
              { bg: 'from-saree-amber-light to-white', border: 'border-saree-amber', iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-light hover:border-saree-amber-dark' },
              { bg: 'from-saree-lime-light to-white', border: 'border-saree-lime', iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-light hover:border-saree-lime-dark' },
              { bg: 'from-saree-rose-light to-white', border: 'border-saree-rose', iconBg: 'bg-saree-rose', hover: 'hover:bg-saree-rose-light hover:border-saree-rose-dark' },
              { bg: 'from-phulkari-turquoise-light to-white', border: 'border-phulkari-turquoise', iconBg: 'bg-phulkari-turquoise', hover: 'hover:bg-phulkari-turquoise-light hover:border-phulkari-turquoise-dark' },
              { bg: 'from-saree-coral-light to-white', border: 'border-saree-coral', iconBg: 'bg-saree-coral', hover: 'hover:bg-saree-coral-light hover:border-saree-coral-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className={`bg-gradient-to-br ${color.bg} p-8 rounded-xl border-2 ${color.border} hover:shadow-2xl ${color.hover} hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
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
    <section className="py-20 bg-gradient-to-br from-saree-amber-light/20 via-white to-saree-lime-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Pricing'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Choose the perfect plan for your needs'}
          </p>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-saree-teal to-saree-amber text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Plan</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Specifications</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Features</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm">Pricing</th>
                  <th className="px-6 py-4 text-center font-semibold text-sm">Action</th>
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
                    <tr key={item.id} className="hover:bg-saree-teal-light transition-colors duration-300 group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm group-hover:text-saree-teal-dark transition-colors duration-300">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-700">
                          {content.specifications?.map((spec, index) => (
                            <div key={index}>{spec}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-700">
                          {content.features?.map((feature, index) => (
                            <div key={index}>{feature}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-base font-bold ${content.price === 'Absolutely Free' ? 'text-saree-lime' : 'text-saree-amber-dark'}`}>
                          {content.price || item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className={`${content.buttonColor === 'green' ? 'bg-saree-teal hover:bg-saree-teal-dark' : 'bg-saree-amber hover:bg-saree-amber-dark'} text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg`}>
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
    <section className="py-20 bg-gradient-to-br from-saree-lime-light/30 via-white to-phulkari-turquoise-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Technical Specifications'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Detailed technical specifications and requirements'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || CpuChipIcon;
            // 6 colors to avoid same pattern in 3-column grid
            const colors = [
              { bg: 'from-saree-teal-light to-white', border: 'border-saree-teal', iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-light hover:border-saree-teal-dark' },
              { bg: 'from-saree-amber-light to-white', border: 'border-saree-amber', iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-light hover:border-saree-amber-dark' },
              { bg: 'from-saree-lime-light to-white', border: 'border-saree-lime', iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-light hover:border-saree-lime-dark' },
              { bg: 'from-phulkari-turquoise-light to-white', border: 'border-phulkari-turquoise', iconBg: 'bg-phulkari-turquoise', hover: 'hover:bg-phulkari-turquoise-light hover:border-phulkari-turquoise-dark' },
              { bg: 'from-saree-rose-light to-white', border: 'border-saree-rose', iconBg: 'bg-saree-rose', hover: 'hover:bg-saree-rose-light hover:border-saree-rose-dark' },
              { bg: 'from-saree-coral-light to-white', border: 'border-saree-coral', iconBg: 'bg-saree-coral', hover: 'hover:bg-saree-coral-light hover:border-saree-coral-dark' }
            ];
            const color = colors[index % colors.length];
            
            let content = {};
            try {
              content = item.content ? JSON.parse(item.content) : {};
            } catch (e) {
              console.error('Error parsing spec content:', e);
            }
            
            return (
              <div key={item.id} className={`bg-gradient-to-br ${color.bg} p-8 rounded-xl border-2 ${color.border} hover:shadow-2xl ${color.hover} hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.title}</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {content.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
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
    <section className="py-20 bg-gradient-to-br from-phulkari-turquoise-light/20 via-white to-saree-teal-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Security & Compliance'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Enterprise-grade security features'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              {items.filter(item => item.is_visible).map((item, index) => {
                const IconComponent = iconMap[item.icon] || ShieldCheckIcon;
                const colors = [
                  { iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-dark' },
                  { iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-dark' },
                  { iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-dark' }
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={item.id} className="flex items-start group cursor-pointer">
                    <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${color.hover} transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                      <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:shadow-2xl hover:border-saree-teal transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Security Features</h3>
            <div className="space-y-4">
              {['DDoS Protection', 'Intrusion Detection', 'Regular Security Updates', 'Access Control', 'Audit Logging', 'Backup & Recovery'].map((feature, index) => (
                <div key={index} className="flex items-center group">
                  <CheckIcon className="w-5 h-5 text-saree-lime mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{feature}</span>
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
    <section className="py-20 bg-gradient-to-br from-saree-rose-light/20 via-white to-saree-amber-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Support & Service Level Agreement'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Round-the-clock support and guaranteed uptime'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || ClockIcon;
            const colors = [
              { iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-dark' },
              { iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-dark' },
              { iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-dark' },
              { iconBg: 'bg-saree-rose', hover: 'hover:bg-saree-rose-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className="text-center group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 ${color.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 ${color.hover} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
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
    <section className="py-20 bg-gradient-to-br from-saree-teal-light via-white to-saree-amber-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Easy Migration & Onboarding'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Seamless migration with expert guidance'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const colors = [
              { iconBg: 'bg-saree-teal', hover: 'hover:bg-saree-teal-dark' },
              { iconBg: 'bg-saree-amber', hover: 'hover:bg-saree-amber-dark' },
              { iconBg: 'bg-saree-lime', hover: 'hover:bg-saree-lime-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:border-saree-teal hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className={`w-12 h-12 ${color.iconBg} rounded-lg flex items-center justify-center mb-6 ${color.hover} group-hover:scale-110 transition-all duration-300`}>
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
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
    <section className="py-20 bg-gradient-to-br from-saree-coral-light/20 via-white to-saree-lime-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Perfect For'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'See how this product perfectly matches different business needs'}
          </p>
        </div>

        <div className="space-y-12">
          {items.filter(item => item.is_visible).map((item, index) => {
            const IconComponent = iconMap[item.icon] || GlobeAltIcon;
            const colors = [
              { bg: 'from-saree-teal-light to-white', border: 'border-saree-teal', iconBg: 'bg-saree-teal', dotBg: 'bg-saree-teal', hover: 'hover:border-saree-teal-dark' },
              { bg: 'from-saree-amber-light to-white', border: 'border-saree-amber', iconBg: 'bg-saree-amber', dotBg: 'bg-saree-amber', hover: 'hover:border-saree-amber-dark' },
              { bg: 'from-saree-lime-light to-white', border: 'border-saree-lime', iconBg: 'bg-saree-lime', dotBg: 'bg-saree-lime', hover: 'hover:border-saree-lime-dark' }
            ];
            const color = colors[index % colors.length];
            
            let content = {};
            try {
              content = item.content ? JSON.parse(item.content) : {};
            } catch (e) {
              console.error('Error parsing use case content:', e);
            }
            
            return (
              <div key={item.id} className={`bg-gradient-to-r ${color.bg} rounded-2xl p-8 border-2 ${color.border} ${color.hover} hover:shadow-2xl transition-all duration-300 group`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <div className={`w-20 h-20 ${color.iconBg} rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl mb-4">→</div>
                    <div className="text-xs text-gray-500 font-medium">PERFECT MATCH</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 group-hover:border-saree-teal transition-colors duration-300">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Why It's Perfect:</h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {content.benefits?.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center">
                          <div className={`w-2 h-2 ${color.dotBg} rounded-full mr-3`}></div>
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
    <section className="py-20 bg-gradient-to-br from-saree-teal-light via-white to-saree-amber-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {titleItem?.title || section.title || 'Ready to Get Started?'}
        </h2>
        <p className="text-base text-gray-700 mb-8">
          {descriptionItem?.title || section.description || 'Join thousands of businesses already using our products'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTAItem && (
            <button className="bg-saree-teal text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-saree-teal-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              {primaryCTAItem.title}
            </button>
          )}
          {secondaryCTAItem && (
            <button className="border-2 border-saree-amber text-saree-amber-dark px-8 py-3 rounded-lg font-semibold text-base hover:border-saree-amber-dark hover:bg-saree-amber-light transition-all duration-300">
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
    <section className="py-20 bg-gradient-to-br from-saree-teal-light/20 via-white to-saree-amber-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title || 'Section'}
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {section.description || 'Section description'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.filter(item => item.is_visible).map((item, index) => {
            const colors = [
              { bg: 'bg-saree-teal-light', border: 'border-saree-teal', hover: 'hover:bg-saree-teal-light hover:border-saree-teal-dark' },
              { bg: 'bg-saree-amber-light', border: 'border-saree-amber', hover: 'hover:bg-saree-amber-light hover:border-saree-amber-dark' },
              { bg: 'bg-saree-lime-light', border: 'border-saree-lime', hover: 'hover:bg-saree-lime-light hover:border-saree-lime-dark' }
            ];
            const color = colors[index % colors.length];
            
            return (
              <div key={item.id} className={`${color.bg} p-8 rounded-xl border-2 ${color.border} hover:shadow-2xl ${color.hover} hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-saree-teal transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DynamicProductSection;

