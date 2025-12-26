import React, { useState } from 'react'
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { 
  CpuChipIcon, 
  ServerIcon, 
  CircleStackIcon, 
  CloudIcon,
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/24/solid'
import { 
  usePricingHero, 
  usePricingCategories, 
  usePricingSubcategories, 
  usePricingPlans, 
  useStorageOptions, 
  usePricingFAQs,
  useComputePlans,
  useDiskOfferings,
  usePricingPageConfig
} from '../hooks/usePricingData'
import ChooseImageSection from '../components/ChooseImageSection'

// Global flag to hide/show quarterly column in pricing tables
const SHOW_QUARTERLY_COLUMN = false

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('compute')
  const [activeComputeSection, setActiveComputeSection] = useState('shared-cpu')
  const [activeComputePlanTab, setActiveComputePlanTab] = useState('basic')

  // Fetch data from CMS
  const { hero, loading: heroLoading } = usePricingHero()
  const { categories, loading: categoriesLoading } = usePricingCategories()
  const { subcategories } = usePricingSubcategories(categories.find(cat => cat.slug === activeTab)?.id)
  const { plans } = usePricingPlans(subcategories.find(sub => sub.slug === activeComputeSection)?.id)
  const { storageOptions } = useStorageOptions()
  const { faqs } = usePricingFAQs()
  const { computePlans: computePlansData } = useComputePlans()
  const { diskOfferings: diskOfferingsData } = useDiskOfferings()
  const { config: pageConfig } = usePricingPageConfig()

  // Icon mapping for categories from CMS
  const iconMap = {
    'CpuChipIcon': CpuChipIcon,
    'CircleStackIcon': CircleStackIcon,
    'CloudIcon': CloudIcon,
    'ServerIcon': ServerIcon,
    'ShieldCheckIcon': ShieldCheckIcon,
    'CogIcon': CogIcon
  }

  // Use CMS categories or fallback to hardcoded
  const categoriesData = categories.length > 0 ? categories.map(cat => ({
    id: cat.slug,
    name: cat.name,
    icon: iconMap[cat.icon] || CpuChipIcon
  })) : [
    { id: 'compute', name: 'Compute', icon: CpuChipIcon },
    { id: 'storage', name: 'Storage', icon: CircleStackIcon },
    { id: 'networking', name: 'Networking', icon: CloudIcon },
    { id: 'databases', name: 'Databases', icon: ServerIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'management', name: 'Management', icon: CogIcon }
  ]

  // Use CMS subcategories or fallback to hardcoded
  const computeSections = subcategories.length > 0 && activeTab === 'compute' ? 
    subcategories.map(sub => ({ id: sub.slug, name: sub.name })) : [
      { id: 'shared-cpu', name: 'Shared CPU' },
      { id: 'dedicated-cpu', name: 'Dedicated CPU' },
      { id: 'high-memory', name: 'High Memory' },
      { id: 'kubernetes', name: 'Kubernetes' }
    ]

  const storageSections = subcategories.length > 0 && activeTab === 'storage' ? 
    subcategories.map(sub => ({ id: sub.slug, name: sub.name })) : [
      { id: 'block-storage', name: 'Block Storage' },
      { id: 'object-storage', name: 'Object Storage' },
      { id: 'archive-storage', name: 'Archive Storage' }
    ]

  const networkingSections = subcategories.length > 0 && activeTab === 'networking' ? 
    subcategories.map(sub => ({ id: sub.slug, name: sub.name })) : [
      { id: 'load-balancer', name: 'Load Balancer' },
      { id: 'cdn', name: 'CDN' },
      { id: 'firewall', name: 'Firewall' }
    ]

  const databaseSections = subcategories.length > 0 && activeTab === 'databases' ? 
    subcategories.map(sub => ({ id: sub.slug, name: sub.name })) : [
      { id: 'mongodb', name: 'MongoDB' },
      { id: 'mysql', name: 'MySQL' },
      { id: 'postgresql', name: 'PostgreSQL' }
    ]

  // All compute plans are now fetched from CMS via useComputePlans hook
  // Storage options are now fetched from CMS via useStorageOptions hook

  // Transform compute plans data from API
  const computePlanTabs = {
    basic: computePlansData.filter(p => p.plan_type === 'basic').map(p => ({
      name: p.name,
      vcpu: p.vcpu,
      memory: p.memory,
      monthlyPrice: p.monthly_price,
      hourlyPrice: p.hourly_price,
      quarterlyPrice: p.quarterly_price || 'N/A',
      yearlyPrice: p.yearly_price || 'N/A'
    })),
    cpuIntensive: computePlansData.filter(p => p.plan_type === 'cpuIntensive').map(p => ({
      name: p.name,
      vcpu: p.vcpu,
      memory: p.memory,
      monthlyPrice: p.monthly_price,
      hourlyPrice: p.hourly_price,
      quarterlyPrice: p.quarterly_price || 'N/A',
      yearlyPrice: p.yearly_price || 'N/A'
    })),
    memoryIntensive: computePlansData.filter(p => p.plan_type === 'memoryIntensive').map(p => ({
      name: p.name,
      vcpu: p.vcpu,
      memory: p.memory,
      monthlyPrice: p.monthly_price,
      hourlyPrice: p.hourly_price,
      quarterlyPrice: p.quarterly_price || 'N/A',
      yearlyPrice: p.yearly_price || 'N/A'
    }))
  }

  // Transform disk offerings data from API
  const diskOfferings = diskOfferingsData.map(offering => ({
    name: offering.name,
    storageType: offering.storage_type,
    size: offering.size,
    monthlyPrice: offering.monthly_price,
    hourlyPrice: offering.hourly_price,
    quarterlyPrice: offering.quarterly_price || 'N/A',
    yearlyPrice: offering.yearly_price || 'N/A'
  }))

  const PricingCard = ({ plan, isPopular = false, isFirst = false, isLast = false, cardType = 'compute' }) => {
    let roundedClass = '';
    if (isLast) {
      roundedClass = 'rounded-b-2xl'; // Only last item gets bottom rounded corners
    } else {
      roundedClass = ''; // All other items - no rounding (including first item)
    }

    // No longer needed - we show both hourly and monthly

    return (
      <div className={`relative bg-white ${roundedClass} shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${
        isPopular ? 'border-saree-teal ring-4 ring-saree-teal-light hover:bg-saree-teal-light/20' : 'border-gray-200 hover:border-saree-teal hover:bg-saree-teal-light/10'
      }`}>
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-saree-teal text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Most Popular
            </span>
          </div>
        )}
        
        <div className="p-8">
          {plan.instance_type ? (
            // Kubernetes format
            <div className="grid grid-cols-6 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600 mb-1">{plan.instance_type}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.nodes}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.ram}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.vcpu}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 mb-1">{plan.hourly_price}</div>
                <div className="text-xs text-gray-500">/hour</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 mb-1">{plan.monthly_price}</div>
                <div className="text-xs text-gray-500">/month</div>
              </div>
            </div>
          ) : cardType === 'storage' ? (
            // Storage format - 4 columns
            <div className="grid grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
              <div className="text-center min-w-[120px]">
                <div className="font-semibold text-gray-900 mb-1 break-words">{plan.name}</div>
              </div>
              <div className="text-center min-w-[150px]">
                <div className="font-semibold text-gray-900 mb-1 break-words">{plan.description || 'High Performance'}</div>
              </div>
              <div className="text-center min-w-[100px]">
                <div className="font-bold text-base md:text-lg text-saree-teal mb-1">
                  {plan.price_per_gb || plan.pricePerGB}
                </div>
                <div className="text-xs text-gray-500">/GB per month</div>
              </div>
              <div className="text-center min-w-[100px]">
                <button className="bg-saree-teal hover:bg-saree-teal-dark text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // Regular format - Fixed grid layout for compute and other services
            <div className="grid grid-cols-7 gap-2 md:gap-4 text-xs md:text-sm">
              <div className="text-center min-w-[100px]">
                <div className="font-semibold text-gray-900 mb-1 break-words">{plan.ram || plan.name || 'N/A'}</div>
              </div>
              <div className="text-center min-w-[80px]">
                <div className="font-semibold text-gray-900 mb-1 break-words">{plan.vcpu || plan.type || 'N/A'}</div>
              </div>
              <div className="text-center min-w-[120px]">
                <div className="font-semibold text-gray-900 mb-1 break-words">{plan.storage || plan.features || 'N/A'}</div>
              </div>
              <div className="text-center min-w-[100px]">
                <div className="font-semibold text-gray-900 mb-1 break-words">{plan.bandwidth || 'N/A'}</div>
              </div>
              <div className="text-center min-w-[80px]">
                <div className="font-semibold text-saree-teal mb-1">
                  {plan.discount && plan.discount !== 0 ? (plan.discount.toString().includes('%') ? plan.discount : `${plan.discount}%`) : '0%'}
                </div>
              </div>
              <div className="text-center min-w-[100px]">
                <div className="font-bold text-base md:text-lg text-gray-900 mb-1">
                  {plan.hourly_price || plan.hourlyPrice || 'Contact Sales'}
                </div>
                {(plan.hourly_price || plan.hourlyPrice) && (
                  <div className="text-xs text-gray-500">/hour</div>
                )}
              </div>
              <div className="text-center min-w-[100px]">
                <div className="font-bold text-base md:text-lg text-gray-900 mb-1">
                  {plan.monthly_price || plan.monthlyPrice || 'Contact Sales'}
                </div>
                {(plan.monthly_price || plan.monthlyPrice) && (
                  <div className="text-xs text-gray-500">/month</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const StorageCard = ({ storage }) => (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-saree-teal hover:bg-saree-teal-light/20 group">
      <div className="text-center mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-saree-teal-dark transition-colors">{storage.name}</h3>
        <p className="text-sm md:text-base text-gray-600 mb-4">{storage.description}</p>
        <div className="text-2xl md:text-3xl font-bold text-saree-teal mb-2 group-hover:scale-110 transition-transform">{storage.price_per_gb || storage.pricePerGB}</div>
        <div className="text-xs md:text-sm text-gray-500">per GB/month</div>
      </div>
      
      <ul className="space-y-3 mb-8">
        {(storage.features || []).map((feature, index) => (
          <li key={index} className="flex items-center text-sm md:text-base text-gray-700">
            <CheckIcon className="w-5 h-5 text-saree-teal mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
            {feature}
          </li>
        ))}
      </ul>
      
      <button className="w-full bg-saree-teal hover:bg-saree-teal-dark text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
        {pageConfig?.button_get_started || 'Get Started'}
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-saree-teal-light/30 via-white to-saree-amber-light/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-saree-teal via-saree-teal-dark to-phulkari-turquoise py-20">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Geometric Patterns */}
            <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white/30 rounded-full"></div>
            <div className="absolute top-20 right-20 w-60 h-60 border-4 border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-white/20 rounded-lg rotate-45"></div>
            <div className="absolute bottom-20 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {heroLoading ? (
            <div className="animate-pulse">
              <div className="h-16 bg-white/20 rounded mb-6"></div>
              <div className="h-6 bg-white/20 rounded max-w-4xl mx-auto"></div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
                {hero?.title || ''}
              </h1>
              <p className="text-base md:text-lg text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                {hero?.description || ''}
              </p>
            </>
          )}
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </div>
      </section>

      {/* Choose Image Section */}
      <ChooseImageSection />

      {/* Main Pricing Section */}
      <section className="pb-20 bg-gradient-to-br from-saree-lime-light/20 via-white to-saree-rose-light/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            {pageConfig?.main_heading || 'Affordable Cloud Server Pricing and Plans in India'}
          </h2>

          {/* Main Content Area - Centered */}
          <div className="max-w-6xl mx-auto">

              {/* Compute Section */}
              {activeTab === 'compute' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{pageConfig?.compute_section_heading || 'Compute Offering'}</h3>
                    <p className="text-sm md:text-base text-gray-600">
                      {pageConfig?.compute_section_description || 'Choose a plan based on the amount of CPU, memory, and storage required for your project. The cost will adjust according to the resources you select.'}
                    </p>
                  </div>

                  {/* Tab Navigation */}
                  <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                      {[
                        { id: 'basic', label: pageConfig?.compute_tab_basic_label || 'Basic Compute Plans' },
                        { id: 'cpuIntensive', label: pageConfig?.compute_tab_cpu_intensive_label || 'CPU Intensive' },
                        { id: 'memoryIntensive', label: pageConfig?.compute_tab_memory_intensive_label || 'Memory Intensive' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveComputePlanTab(tab.id)}
                          className={`py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                            activeComputePlanTab === tab.id
                              ? 'border-saree-teal text-saree-teal-dark'
                              : 'border-transparent text-gray-500 hover:text-saree-teal hover:border-saree-teal-light'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Table Container with Horizontal Scroll on Mobile */}
                  <div className="overflow-x-auto -mx-6 px-6">
                    <div className="min-w-[800px]">
                      {/* Table Header */}
                      <div className="bg-gradient-to-r from-saree-teal-light to-saree-amber-light rounded-t-2xl p-4 md:p-6 text-gray-900 shadow-md">
                        <div className={`grid gap-2 md:gap-4 text-xs md:text-sm font-semibold ${SHOW_QUARTERLY_COLUMN ? 'grid-cols-7' : 'grid-cols-6'}`}>
                          <div className="text-center min-w-[100px]">{pageConfig?.compute_table_header_name || 'Name'}</div>
                          <div className="text-center min-w-[80px]">{pageConfig?.compute_table_header_vcpu || 'vCPU'}</div>
                          <div className="text-center min-w-[100px]">{pageConfig?.compute_table_header_memory || 'Memory RAM'}</div>
                          <div className="text-center min-w-[110px]">{pageConfig?.compute_table_header_hourly || 'Price Hourly'}</div>
                          <div className="text-center min-w-[110px]">{pageConfig?.compute_table_header_monthly || 'Price Monthly'}</div>
                          {SHOW_QUARTERLY_COLUMN && <div className="text-center min-w-[120px]">{pageConfig?.compute_table_header_quarterly || 'Price Quarterly'}</div>}
                          <div className="text-center min-w-[110px]">{pageConfig?.compute_table_header_yearly || 'Price Yearly'}</div>
                        </div>
                      </div>

                      {/* Pricing Table Rows */}
                      <div className="space-y-0">
                        {computePlanTabs[activeComputePlanTab]?.map((plan, index) => (
                          <div
                            key={plan.name}
                            onClick={() => window.location.href = hero?.redirect_url || 'https://portal.cloud4india.com/register'}
                            className={`bg-white border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-saree-teal hover:bg-saree-teal-light/20 cursor-pointer group ${
                              index === computePlanTabs[activeComputePlanTab].length - 1 
                                ? 'rounded-b-2xl border-gray-200' 
                                : 'border-gray-200 border-b-0'
                            }`}
                          >
                            <div className="p-4 md:p-6">
                              <div className={`grid gap-2 md:gap-4 text-xs md:text-sm items-center ${SHOW_QUARTERLY_COLUMN ? 'grid-cols-7' : 'grid-cols-6'}`}>
                                <div className="text-center min-w-[100px]">
                                  <div className="font-semibold text-gray-900 break-words">{plan.name}</div>
                                </div>
                                <div className="text-center min-w-[80px]">
                                  <div className="font-semibold text-gray-900">{plan.vcpu}</div>
                                </div>
                                <div className="text-center min-w-[100px]">
                                  <div className="font-semibold text-gray-900">{plan.memory}</div>
                                </div>
                                <div className="text-center min-w-[110px]">
                                  <div className="font-bold text-base md:text-lg text-gray-900">{plan.hourlyPrice}</div>
                                  <div className="text-xs text-gray-500">/Hour</div>
                                </div>
                                <div className="text-center min-w-[110px]">
                                  <div className="font-bold text-base md:text-lg text-gray-900">{plan.monthlyPrice}</div>
                                  <div className="text-xs text-gray-500">/Month</div>
                                </div>
                                {SHOW_QUARTERLY_COLUMN && (
                                  <div className="text-center min-w-[120px]">
                                    <div className="font-bold text-base md:text-lg text-gray-900">{plan.quarterlyPrice}</div>
                                    <div className="text-xs text-gray-500">/Quarter</div>
                                  </div>
                                )}
                                <div className="text-center min-w-[110px]">
                                  <div className="font-bold text-base md:text-lg text-gray-900">{plan.yearlyPrice}</div>
                                  <div className="text-xs text-gray-500">/Year</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Disk Offering Section */}
              <div className="mt-16">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{pageConfig?.disk_section_heading || 'Disk Offering'}</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {pageConfig?.disk_section_description || 'Choose the disk storage size that best fits your requirements. All storage options use high-performance NVMe technology.'}
                  </p>
                </div>

                {/* Table Container with Horizontal Scroll on Mobile */}
                <div className="overflow-x-auto -mx-6 px-6">
                  <div className="min-w-[800px]">
                    {/* Table Header */}
                    <div className="bg-gradient-to-r from-saree-lime-light to-saree-rose-light rounded-t-2xl p-4 md:p-6 text-gray-900 shadow-md">
                      <div className={`grid gap-2 md:gap-4 text-xs md:text-sm font-semibold ${SHOW_QUARTERLY_COLUMN ? 'grid-cols-7' : 'grid-cols-6'}`}>
                        <div className="text-center min-w-[100px]">{pageConfig?.disk_table_header_name || 'Name'}</div>
                        <div className="text-center min-w-[110px]">{pageConfig?.disk_table_header_type || 'Storage Type'}</div>
                        <div className="text-center min-w-[80px]">{pageConfig?.disk_table_header_size || 'Size'}</div>
                        <div className="text-center min-w-[110px]">{pageConfig?.compute_table_header_hourly || 'Price Hourly'}</div>
                        <div className="text-center min-w-[110px]">{pageConfig?.compute_table_header_monthly || 'Price Monthly'}</div>
                        {SHOW_QUARTERLY_COLUMN && <div className="text-center min-w-[120px]">{pageConfig?.compute_table_header_quarterly || 'Price Quarterly'}</div>}
                        <div className="text-center min-w-[110px]">{pageConfig?.compute_table_header_yearly || 'Price Yearly'}</div>
                      </div>
                    </div>

                    {/* Disk Offering Table Rows */}
                    <div className="space-y-0">
                      {diskOfferings.map((disk, index) => (
                        <div
                          key={disk.name}
                          onClick={() => window.location.href = hero?.redirect_url || 'https://portal.cloud4india.com/register'}
                          className={`bg-white border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-saree-amber hover:bg-saree-amber-light/20 cursor-pointer group ${
                            index === diskOfferings.length - 1 
                              ? 'rounded-b-2xl border-gray-200' 
                              : 'border-gray-200 border-b-0'
                          }`}
                        >
                          <div className="p-4 md:p-6">
                            <div className={`grid gap-2 md:gap-4 text-xs md:text-sm items-center ${SHOW_QUARTERLY_COLUMN ? 'grid-cols-7' : 'grid-cols-6'}`}>
                              <div className="text-center min-w-[100px]">
                                <div className="font-semibold text-gray-900 break-words">{disk.name}</div>
                              </div>
                              <div className="text-center min-w-[110px]">
                                <div className="font-semibold text-gray-900 break-words">{disk.storageType}</div>
                              </div>
                              <div className="text-center min-w-[80px]">
                                <div className="font-semibold text-gray-900">{disk.size}</div>
                              </div>
                              <div className="text-center min-w-[110px]">
                                <div className="font-bold text-base md:text-lg text-gray-900">{disk.hourlyPrice}</div>
                                <div className="text-xs text-gray-500">/Hour</div>
                              </div>
                              <div className="text-center min-w-[110px]">
                                <div className="font-bold text-base md:text-lg text-gray-900">{disk.monthlyPrice}</div>
                                <div className="text-xs text-gray-500">/Month</div>
                              </div>
                              {SHOW_QUARTERLY_COLUMN && (
                                <div className="text-center min-w-[120px]">
                                  <div className="font-bold text-base md:text-lg text-gray-900">{disk.quarterlyPrice}</div>
                                  <div className="text-xs text-gray-500">/Quarter</div>
                                </div>
                              )}
                              <div className="text-center min-w-[110px]">
                                <div className="font-bold text-base md:text-lg text-gray-900">{disk.yearlyPrice}</div>
                                <div className="text-xs text-gray-500">/Year</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

          {/* Storage Section */}
          {activeTab === 'storage' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{pageConfig?.storage_section_heading || 'Storage Pricing and Plans'}</h3>
                    <p className="text-sm md:text-base text-gray-600">{pageConfig?.storage_section_description || 'Choose from our flexible storage options designed to meet your specific needs and budget requirements.'}</p>
                  </div>

                  {/* Storage Table Header */}
                  <div className="overflow-x-auto -mx-6 px-6">
                    <div className="min-w-[600px]">
                      <div className="bg-gradient-to-r from-phulkari-turquoise-light to-saree-coral-light rounded-t-2xl p-4 md:p-6 text-gray-900 shadow-md">
                        <div className="grid grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm font-semibold">
                          <div className="text-center min-w-[120px]">{pageConfig?.storage_table_header_type || 'Storage Type'}</div>
                          <div className="text-center min-w-[150px]">{pageConfig?.storage_table_header_description || 'Description'}</div>
                          <div className="text-center min-w-[100px]">{pageConfig?.storage_table_header_price || 'Price'}</div>
                          <div className="text-center min-w-[100px]">{pageConfig?.storage_table_header_action || 'Action'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Storage Pricing Cards */}
                  <div className="space-y-0">
                    {storageOptions.map((storage, index) => (
                      <PricingCard 
                        key={storage.id || index} 
                        plan={storage} 
                        cardType="storage"
                        isFirst={index === 0}
                        isLast={index === storageOptions.length - 1}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Categories with Dynamic Subcategories */}
              {(activeTab === 'networking' || activeTab === 'databases' || activeTab === 'security' || activeTab === 'management') && (
                <div>
                  {subcategories.length > 0 ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          {categoriesData.find(cat => cat.id === activeTab)?.name} Pricing and Plans
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">
                          Choose from our comprehensive {activeTab} Apps designed to meet your specific needs.
                        </p>
                      </div>

                      {/* Table Container with Horizontal Scroll on Mobile */}
                      <div className="overflow-x-auto -mx-6 px-6">
                        <div className="min-w-[800px]">
                          {/* Table Header */}
                          <div className={`rounded-t-2xl p-4 md:p-6 text-gray-900 shadow-md ${
                            activeTab === 'networking' ? 'bg-gradient-to-r from-phulkari-fuchsia-light to-phulkari-peach-light' :
                            activeTab === 'databases' ? 'bg-gradient-to-r from-phulkari-blue-light to-phulkari-gold-light' :
                            activeTab === 'security' ? 'bg-gradient-to-r from-saree-rose-light to-phulkari-red-light' :
                            'bg-gradient-to-r from-saree-teal-light to-saree-lime-light'
                          }`}>
                            <div className="grid grid-cols-7 gap-2 md:gap-4 text-xs md:text-sm font-semibold">
                              <div className="text-center min-w-[100px]">{pageConfig?.service_table_header_service || 'Service'}</div>
                              <div className="text-center min-w-[80px]">{pageConfig?.service_table_header_type || 'Type'}</div>
                              <div className="text-center min-w-[120px]">{pageConfig?.service_table_header_features || 'Features'}</div>
                              <div className="text-center min-w-[100px]">{pageConfig?.service_table_header_bandwidth || 'Bandwidth'}</div>
                              <div className="text-center min-w-[80px]">{pageConfig?.service_table_header_discount || 'Discount'}</div>
                              <div className="text-center min-w-[100px]">{pageConfig?.service_table_header_price || 'Price'}</div>
                              <div className="text-center min-w-[100px]">{pageConfig?.service_table_header_action || 'Action'}</div>
                            </div>
                          </div>

                          {/* Service Cards */}
                          <div className="space-y-0">
                            {subcategories.map((subcategory, index) => (
                              <PricingCard 
                                key={subcategory.id} 
                                plan={{
                                  name: subcategory.name,
                                  type: 'Enterprise',
                                  features: subcategory.description || 'Advanced Features',
                                  bandwidth: 'Unlimited',
                                  discount: '10%',
                                  monthly_price: 'Contact Sales'
                                }}
                                cardType="service"
                                isFirst={index === 0}
                                isLast={index === subcategories.length - 1}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {categoriesData.find(cat => cat.id === activeTab)?.name} Pricing and Plans
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-8 max-w-2xl mx-auto">
                        Advanced {activeTab} Apps to enhance your cloud infrastructure.
                      </p>
                      <button className="bg-saree-teal hover:bg-saree-teal-dark text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        {pageConfig?.button_contact_sales || 'Contact Sales'}
                      </button>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-phulkari-peach-light via-white to-phulkari-turquoise-light py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">{pageConfig?.faq_section_heading || 'Have Any Questions?'}</h2>
          <div className="text-center text-gray-600 mb-12">
            <p className="text-base md:text-lg">{pageConfig?.faq_section_subheading || 'Don\'t Worry, We\'ve Got Answers!'}</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={faq.id || index} className="bg-white rounded-xl p-6 md:p-8 border-2 border-gray-200 hover:border-saree-teal hover:bg-saree-teal-light/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 group-hover:text-saree-teal-dark transition-colors">{faq.question}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing
