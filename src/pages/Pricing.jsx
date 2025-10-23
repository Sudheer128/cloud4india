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
  usePricingFAQs 
} from '../hooks/usePricingData'

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('compute')
  const [activeComputeSection, setActiveComputeSection] = useState('shared-cpu')
  const [billingCycle, setBillingCycle] = useState('monthly')

  // Fetch data from CMS
  const { hero, loading: heroLoading } = usePricingHero()
  const { categories, loading: categoriesLoading } = usePricingCategories()
  const { subcategories } = usePricingSubcategories(categories.find(cat => cat.slug === activeTab)?.id)
  const { plans } = usePricingPlans(subcategories.find(sub => sub.slug === activeComputeSection)?.id)
  const { storageOptions } = useStorageOptions()
  const { faqs } = usePricingFAQs()

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

  const computePlans = {
    shared: [
      {
        ram: '1 GB',
        vcpu: '1 vCPU',
        storage: '25 GB SSD',
        bandwidth: '1 TB',
        discount: '15%',
        hourlyPrice: '₹1.20',
        monthlyPrice: '₹850',
        yearlyPrice: '₹8,500'
      },
      {
        ram: '2 GB',
        vcpu: '2 vCPU',
        storage: '50 GB SSD',
        bandwidth: '2 TB',
        discount: '15%',
        hourlyPrice: '₹2.40',
        monthlyPrice: '₹1,700',
        yearlyPrice: '₹17,000'
      },
      {
        ram: '4 GB',
        vcpu: '2 vCPU',
        storage: '80 GB SSD',
        bandwidth: '3 TB',
        discount: '20%',
        hourlyPrice: '₹4.80',
        monthlyPrice: '₹3,400',
        yearlyPrice: '₹32,640'
      },
      {
        ram: '8 GB',
        vcpu: '4 vCPU',
        storage: '160 GB SSD',
        bandwidth: '4 TB',
        discount: '20%',
        hourlyPrice: '₹9.60',
        monthlyPrice: '₹6,800',
        yearlyPrice: '₹65,280'
      }
    ],
    dedicated: [
      {
        ram: '4 GB',
        vcpu: '2 vCPU',
        storage: '80 GB SSD',
        discount: '20%',
        hourlyPrice: '₹5.50',
        monthlyPrice: '₹3,900',
        yearlyPrice: '₹37,440'
      },
      {
        ram: '8 GB',
        vcpu: '4 vCPU',
        storage: '160 GB SSD',
        discount: '20%',
        hourlyPrice: '₹11.00',
        monthlyPrice: '₹7,800',
        yearlyPrice: '₹74,880'
      },
      {
        ram: '16 GB',
        vcpu: '8 vCPU',
        storage: '320 GB SSD',
        discount: '25%',
        hourlyPrice: '₹22.00',
        monthlyPrice: '₹15,600',
        yearlyPrice: '₹140,400'
      },
      {
        ram: '32 GB',
        vcpu: '16 vCPU',
        storage: '640 GB SSD',
        discount: '25%',
        hourlyPrice: '₹44.00',
        monthlyPrice: '₹31,200',
        yearlyPrice: '₹280,800'
      }
    ],
    kubernetes: [
      {
        type: 'Shared 80 GB',
        nodes: '1',
        ram: '4 GB',
        vcpu: '2 vCPU',
        hourlyPrice: '₹4.16',
        monthlyPrice: '₹2,995'
      },
      {
        type: 'Shared 160 GB',
        nodes: '1',
        ram: '8 GB',
        vcpu: '4 vCPU',
        hourlyPrice: '₹8.32',
        monthlyPrice: '₹5,990'
      },
      {
        type: 'Dedicated 320 GB',
        nodes: '2',
        ram: '16 GB',
        vcpu: '8 vCPU',
        hourlyPrice: '₹16.64',
        monthlyPrice: '₹11,980'
      }
    ]
  }

  // Storage options are now fetched from CMS via useStorageOptions hook

  const PricingCard = ({ plan, isPopular = false, isFirst = false, isLast = false, cardType = 'compute' }) => {
    let roundedClass = '';
    if (isLast) {
      roundedClass = 'rounded-b-2xl'; // Only last item gets bottom rounded corners
    } else {
      roundedClass = ''; // All other items - no rounding (including first item)
    }

    // Handle both CMS data format and hardcoded format
    const displayPrice = billingCycle === 'hourly' ? 
      (plan.hourly_price || plan.hourlyPrice) : 
      billingCycle === 'monthly' ? 
      (plan.monthly_price || plan.monthlyPrice) : 
      (plan.yearly_price || plan.yearlyPrice);

    return (
      <div className={`relative bg-white ${roundedClass} shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isPopular ? 'border-green-500 ring-4 ring-green-100' : 'border-gray-200 hover:border-green-300'
      }`}>
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-200 text-gray-900 px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
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
                <div className="font-bold text-gray-900 mb-1">{plan.hourly_price}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 mb-1">{plan.monthly_price}</div>
                <button className="mt-2 bg-orange-200 hover:bg-orange-300 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : cardType === 'storage' ? (
            // Storage format - 4 columns
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.name}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.description || 'High Performance'}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600 mb-1">
                  {plan.price_per_gb || plan.pricePerGB}
                </div>
                <div className="text-xs text-gray-500">/GB per month</div>
              </div>
              <div className="text-center">
                <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // Regular format - Fixed grid layout for compute and other services
            <div className="grid grid-cols-7 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.ram || plan.name || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.vcpu || plan.type || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.storage || plan.features || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-1">{plan.bandwidth || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-500 mb-1">
                  {plan.discount && plan.discount !== 0 ? (plan.discount.toString().includes('%') ? plan.discount : `${plan.discount}%`) : '0%'}
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 mb-1">
                  {displayPrice || 'Contact Sales'}
                </div>
                {displayPrice && (
                  <div className="text-xs text-gray-500">
                    /{billingCycle === 'hourly' ? 'hour' : billingCycle}
                  </div>
                )}
              </div>
              <div className="text-center">
                <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const StorageCard = ({ storage }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-green-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{storage.name}</h3>
        <p className="text-gray-600 mb-4">{storage.description}</p>
        <div className="text-3xl font-bold text-green-500 mb-2">{storage.price_per_gb || storage.pricePerGB}</div>
        <div className="text-sm text-gray-500">per GB/month</div>
      </div>
      
      <ul className="space-y-3 mb-8">
        {(storage.features || []).map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      
      <button className="w-full bg-green-200 hover:bg-green-300 text-gray-900 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
        Get Started
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {heroLoading ? (
            <div className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded max-w-4xl mx-auto"></div>
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                {hero?.title || 'Cloud Server Pricing for Startups, SMEs and Enterprises'}
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {hero?.description || 'Experience the perfect balance of performance and affordability with Cloud4India\'s cloud server pricing. Our bundled packages are designed to provide you with high-performance cloud solutions while optimizing cloud cost savings. Whether you\'re looking for scalable storage or powerful servers, our cloud server cost options ensure you get maximum value without compromising on quality or efficiency.'}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Main Pricing Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Affordable Cloud Server Pricing and Plans in India
          </h2>

          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {categoriesData.map((category) => {
                  const IconComponent = category.icon
                  const isActive = activeTab === category.id
                  
                  return (
                    <div key={category.id}>
                      <button
                        onClick={() => setActiveTab(category.id)}
                        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-green-50 border-r-4 border-green-300 text-green-700' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`w-5 h-5 ${isActive ? 'text-green-500' : 'text-gray-500'}`} />
                          <span className="font-semibold">{category.name}</span>
                        </div>
                        <span className={`text-2xl ${isActive ? 'text-green-500' : 'text-gray-400'}`}>
                          {isActive ? '−' : '+'}
                        </span>
                      </button>
                      
                      {/* Subsections */}
                      {isActive && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          {category.id === 'compute' && computeSections.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => setActiveComputeSection(section.id)}
                              className={`w-full text-left px-12 py-3 transition-colors ${
                                activeComputeSection === section.id
                                  ? 'bg-green-100 text-green-700 border-r-2 border-green-300'
                                  : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
                              }`}
                            >
                              {section.name}
                            </button>
                          ))}
                          {category.id === 'storage' && storageSections.map((section) => (
                            <button
                              key={section.id}
                              className="w-full text-left px-12 py-3 text-gray-600 hover:text-green-500 hover:bg-green-50 transition-colors"
                            >
                              {section.name}
                            </button>
                          ))}
                          {category.id === 'networking' && networkingSections.map((section) => (
                            <button
                              key={section.id}
                              className="w-full text-left px-12 py-3 text-gray-600 hover:text-green-500 hover:bg-green-50 transition-colors"
                            >
                              {section.name}
                            </button>
                          ))}
                          {category.id === 'databases' && databaseSections.map((section) => (
                            <button
                              key={section.id}
                              className="w-full text-left px-12 py-3 text-gray-600 hover:text-green-500 hover:bg-green-50 transition-colors"
                            >
                              {section.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Billing Toggle - Always visible */}
              <div className="flex justify-end mb-8">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {['hourly', 'monthly', 'yearly'].map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setBillingCycle(cycle)}
                      className={`px-6 py-2 rounded-lg font-semibold capitalize transition-all duration-200 ${
                        billingCycle === cycle
                          ? 'bg-white text-green-500 shadow-md'
                          : 'text-gray-600 hover:text-green-500'
                      }`}
                    >
                      {cycle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compute Section */}
              {activeTab === 'compute' && (
                <div>
                  {/* Dynamic Pricing Plans */}
                  {subcategories.find(sub => sub.slug === activeComputeSection) && (
                    <div>
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {subcategories.find(sub => sub.slug === activeComputeSection)?.name} Pricing and Plans
                        </h3>
                        <p className="text-gray-600">
                          {subcategories.find(sub => sub.slug === activeComputeSection)?.description}
                        </p>
                      </div>

                      {/* Table Header */}
                      <div className={`bg-${subcategories.find(sub => sub.slug === activeComputeSection)?.header_color || 'green-100'} rounded-t-2xl p-6 text-gray-900`}>
                        <div className={`grid gap-4 text-sm font-semibold ${activeComputeSection === 'kubernetes' ? 'grid-cols-6' : 'grid-cols-7'}`}>
                          {activeComputeSection === 'kubernetes' ? (
                            <>
                              <div className="text-center">Instance Type</div>
                              <div className="text-center">Nodes</div>
                              <div className="text-center">RAM</div>
                              <div className="text-center">vCPU</div>
                              <div className="text-center">Hourly</div>
                              <div className="text-center">Monthly</div>
                            </>
                          ) : (
                            <>
                              <div className="text-center">RAM</div>
                              <div className="text-center">vCPU</div>
                              <div className="text-center">SSD Disk</div>
                              <div className="text-center">Bandwidth</div>
                              <div className="text-center">Discount</div>
                              <div className="text-center">Price</div>
                              <div className="text-center">Action</div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Pricing Cards */}
                      <div className="space-y-0">
                        {plans.map((plan, index) => (
                          <PricingCard 
                            key={plan.id || index} 
                            plan={plan} 
                            isPopular={Boolean(plan.is_popular)} 
                            isFirst={index === 0}
                            isLast={index === plans.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback for hardcoded sections if no CMS data */}
                  {!subcategories.find(sub => sub.slug === activeComputeSection) && (
                    <div className="text-center py-20">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h3>
                      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">This pricing section is being updated. Please check back soon for detailed pricing information.</p>
                      <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                        Contact Sales
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Storage Section */}
              {activeTab === 'storage' && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Storage Pricing and Plans</h3>
                    <p className="text-gray-600">Choose from our flexible storage options designed to meet your specific needs and budget requirements.</p>
                  </div>

                  {/* Storage Table Header */}
                  <div className="bg-blue-100 rounded-t-2xl p-6 text-gray-900">
                    <div className="grid grid-cols-4 gap-4 text-sm font-semibold">
                      <div className="text-center">Storage Type</div>
                      <div className="text-center">Description</div>
                      <div className="text-center">Price</div>
                      <div className="text-center">Action</div>
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
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {categoriesData.find(cat => cat.id === activeTab)?.name} Pricing and Plans
                        </h3>
                        <p className="text-gray-600">
                          Choose from our comprehensive {activeTab} solutions designed to meet your specific needs.
                        </p>
                      </div>

                      {/* Table Header */}
                      <div className={`bg-${activeTab === 'networking' ? 'purple' : activeTab === 'databases' ? 'indigo' : activeTab === 'security' ? 'red' : 'gray'}-100 rounded-t-2xl p-6 text-gray-900`}>
                        <div className="grid grid-cols-7 gap-4 text-sm font-semibold">
                          <div className="text-center">Service</div>
                          <div className="text-center">Type</div>
                          <div className="text-center">Features</div>
                          <div className="text-center">Bandwidth</div>
                          <div className="text-center">Discount</div>
                          <div className="text-center">Price</div>
                          <div className="text-center">Action</div>
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
                  ) : (
                    <div className="text-center py-20">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {categoriesData.find(cat => cat.id === activeTab)?.name} Pricing and Plans
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Advanced {activeTab} solutions to enhance your cloud infrastructure.
                      </p>
                      <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                        Contact Sales
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Have Any Questions?</h2>
          <div className="text-center text-gray-600 mb-12">
            <p className="text-xl">Don't Worry, We've Got Answers!</p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={faq.id || index} className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing
