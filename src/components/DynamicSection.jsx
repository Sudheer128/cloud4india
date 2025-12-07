import React from 'react';
import { useSectionItems } from '../hooks/useSectionItems';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  CogIcon, 
  UsersIcon,
  LockClosedIcon,
  CloudIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Icon mapping for dynamic icon rendering
const iconMap = {
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  LockClosedIcon,
  CloudIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  CheckCircleIcon
};

const DynamicSection = ({ section, marketplaceId }) => {
  const { items, loading, error } = useSectionItems(marketplaceId, section.id);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading {section.title}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading {section.title}: {error}</p>
      </div>
    );
  }

  const renderSectionContent = () => {
    switch (section.section_type) {
      case 'benefits':
        return renderBenefitsSection();
      case 'segments':
        return renderSegmentsSection();
      case 'roi':
        return renderStatsSection();
      default:
        return renderDefaultSection();
    }
  };

  const renderBenefitsSection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {items.map((item, index) => {
          const IconComponent = iconMap[item.icon] || ShieldCheckIcon;
          const colorClasses = [
            'bg-blue-100 group-hover:bg-blue-200 text-blue-600',
            'bg-green-100 group-hover:bg-green-200 text-green-600',
            'bg-purple-100 group-hover:bg-purple-200 text-purple-600',
            'bg-orange-100 group-hover:bg-orange-200 text-orange-600',
            'bg-teal-100 group-hover:bg-teal-200 text-teal-600',
            'bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600'
          ];
          const colorClass = colorClasses[index % colorClasses.length];

          return (
            <div key={item.id} className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className={`w-16 h-16 ${colorClass} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSegmentsSection = () => {
    return (
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
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || CurrencyDollarIcon;
            const gradients = [
              'from-blue-500 to-blue-700',
              'from-purple-500 to-purple-700',
              'from-green-500 to-green-700',
              'from-orange-500 to-orange-700'
            ];
            const gradient = gradients[index % gradients.length];
            const isLarge = index === 0; // First item (Banking) is large
            const features = item.features ? JSON.parse(item.features) : [];

            return (
              <div key={item.id} className={isLarge ? "lg:col-span-2 lg:row-span-2" : "md:col-span-2 lg:col-span-2"}>
                <div className={`group relative bg-gradient-to-br ${gradient} rounded-3xl p-6 lg:p-8 h-full min-h-[350px] overflow-hidden hover:shadow-2xl transition-all duration-500`}>
                  {/* Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-blue-100 text-base leading-relaxed mb-4">
                        {item.description}
                      </p>
                      
                      {features.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {features.slice(0, 3).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-blue-100">
                              <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {features.length > 3 && (
                        <div className="bg-white/10 rounded-xl p-5 mb-4">
                          <div className="text-white font-semibold text-base mb-3">Key Capabilities</div>
                          <div className="grid grid-cols-2 gap-3 text-sm text-blue-100">
                            {features.slice(3).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3 flex-shrink-0"></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-blue-100 text-sm font-medium mb-1">Trusted by</div>
                      <div className="text-white font-bold text-base">{item.value} {item.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStatsSection = () => {
    return (
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, index) => {
          const colors = ['text-blue-600', 'text-purple-600', 'text-green-600', 'text-orange-600'];
          const color = colors[index % colors.length];

          return (
            <div key={item.id} className="text-center">
              <div className={`text-3xl font-bold ${color} mb-2`}>{item.value}</div>
              <div className="text-gray-600">{item.title}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDefaultSection = () => {
    return (
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: section.content }} />
      </div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {section.content}
          </p>
        </div>

        {renderSectionContent()}
      </div>
    </section>
  );
};

export default DynamicSection;
