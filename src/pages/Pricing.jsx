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

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('compute')
  const [activeComputeSection, setActiveComputeSection] = useState('shared-cpu')
  const [billingCycle, setBillingCycle] = useState('monthly')

  const categories = [
    { id: 'compute', name: 'Compute', icon: CpuChipIcon },
    { id: 'storage', name: 'Storage', icon: CircleStackIcon },
    { id: 'networking', name: 'Networking', icon: CloudIcon },
    { id: 'databases', name: 'Databases', icon: ServerIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'management', name: 'Management', icon: CogIcon }
  ]

  const computeSections = [
    { id: 'shared-cpu', name: 'Shared CPU' },
    { id: 'dedicated-cpu', name: 'Dedicated CPU' },
    { id: 'high-memory', name: 'High Memory' },
    { id: 'kubernetes', name: 'Kubernetes' }
  ]

  const storageSections = [
    { id: 'block-storage', name: 'Block Storage' },
    { id: 'object-storage', name: 'Object Storage' },
    { id: 'archive-storage', name: 'Archive Storage' }
  ]

  const networkingSections = [
    { id: 'load-balancer', name: 'Load Balancer' },
    { id: 'cdn', name: 'CDN' },
    { id: 'firewall', name: 'Firewall' }
  ]

  const databaseSections = [
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

  const storageOptions = [
    {
      name: 'Block Storage',
      description: 'High-performance SSD storage for your applications',
      pricePerGB: '₹2.50',
      features: ['99.9% Uptime SLA', 'Automatic Backups', 'Instant Provisioning']
    },
    {
      name: 'Object Storage',
      description: 'Scalable storage for files, images, and backups',
      pricePerGB: '₹1.80',
      features: ['Unlimited Scalability', 'CDN Integration', 'API Access']
    },
    {
      name: 'Archive Storage',
      description: 'Cost-effective long-term data archival',
      pricePerGB: '₹0.50',
      features: ['Low-cost Storage', 'Data Durability', 'Compliance Ready']
    }
  ]

  const PricingCard = ({ plan, isPopular = false, isFirst = false, isLast = false }) => {
    let roundedClass = '';
    if (isLast) {
      roundedClass = 'rounded-b-2xl'; // Only last item gets bottom rounded corners
    } else {
      roundedClass = ''; // All other items - no rounding (including first item)
    }

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
        <div className="grid grid-cols-6 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900 mb-1">{plan.ram}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 mb-1">{plan.vcpu}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 mb-1">{plan.storage}</div>
          </div>
          {plan.bandwidth && (
            <div className="text-center">
              <div className="font-semibold text-gray-900 mb-1">{plan.bandwidth}</div>
            </div>
          )}
          {plan.discount && (
            <div className="text-center">
              <div className="font-semibold text-green-500 mb-1">{plan.discount}</div>
            </div>
          )}
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900 mb-1">
              {billingCycle === 'hourly' ? plan.hourlyPrice : 
               billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
            </div>
            <div className="text-xs text-gray-500">
              /{billingCycle === 'hourly' ? 'hour' : billingCycle}
            </div>
          </div>
          <div className="text-center">
            <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }

  const StorageCard = ({ storage }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-green-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{storage.name}</h3>
        <p className="text-gray-600 mb-4">{storage.description}</p>
        <div className="text-3xl font-bold text-green-500 mb-2">{storage.pricePerGB}</div>
        <div className="text-sm text-gray-500">per GB/month</div>
      </div>
      
      <ul className="space-y-3 mb-8">
        {storage.features.map((feature, index) => (
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Cloud Server Pricing for Startups, SMEs and Enterprises
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience the perfect balance of performance and affordability with Cloud4India's cloud server pricing. 
            Our bundled packages are designed to provide you with high-performance cloud solutions while optimizing 
            cloud cost savings. Whether you're looking for scalable storage or powerful servers, our cloud server 
            cost options ensure you get maximum value without compromising on quality or efficiency.
          </p>
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
                {categories.map((category) => {
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
                  {/* Shared CPU */}
                  {activeComputeSection === 'shared-cpu' && (
                    <div>
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Shared CPU Pricing and Plans</h3>
                        <p className="text-gray-600">Enjoy a reliable and cost-effective hosting solution with a wide range of Shared CPU Plans.</p>
                      </div>

                      {/* Table Header */}
                      <div className="bg-green-100 rounded-t-2xl p-6 text-gray-900">
                        <div className="grid grid-cols-6 gap-4 text-sm font-semibold">
                          <div className="text-center">RAM</div>
                          <div className="text-center">vCPU</div>
                          <div className="text-center">SSD Disk</div>
                          <div className="text-center">Bandwidth</div>
                          <div className="text-center">Discount</div>
                          <div className="text-center">Price</div>
                        </div>
                      </div>

                      {/* Pricing Cards */}
                      <div className="space-y-0">
                        {computePlans.shared.map((plan, index) => (
                          <PricingCard 
                            key={index} 
                            plan={plan} 
                            isPopular={index === 2} 
                            isFirst={index === 0}
                            isLast={index === computePlans.shared.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dedicated CPU */}
                  {activeComputeSection === 'dedicated-cpu' && (
                    <div>
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Dedicated CPU Pricing and Plans</h3>
                        <p className="text-gray-600">Experience exceptional performance and unleash the full power of your applications with Dedicated CPU Plans.</p>
                      </div>

                      {/* Table Header */}
                      <div className="bg-green-200 rounded-t-2xl p-6 text-gray-900">
                        <div className="grid grid-cols-6 gap-4 text-sm font-semibold">
                          <div className="text-center">RAM</div>
                          <div className="text-center">vCPU</div>
                          <div className="text-center">SSD Disk</div>
                          <div className="text-center">Bandwidth</div>
                          <div className="text-center">Discount</div>
                          <div className="text-center">Price</div>
                        </div>
                      </div>

                      <div className="space-y-0">
                        {computePlans.dedicated.map((plan, index) => (
                          <PricingCard 
                            key={index} 
                            plan={plan} 
                            isPopular={index === 1} 
                            isFirst={index === 0}
                            isLast={index === computePlans.dedicated.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* High Memory */}
                  {activeComputeSection === 'high-memory' && (
                    <div>
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">High Memory Pricing and Plans</h3>
                        <p className="text-gray-600">Lightning-fast performance with High Memory Plans. Optimize your workloads with dedicated resources and massive RAM.</p>
                      </div>

                      {/* Table Header */}
                      <div className="bg-green-300 rounded-t-2xl p-6 text-gray-900">
                        <div className="grid grid-cols-6 gap-4 text-sm font-semibold">
                          <div className="text-center">RAM</div>
                          <div className="text-center">vCPU</div>
                          <div className="text-center">SSD Disk</div>
                          <div className="text-center">Bandwidth</div>
                          <div className="text-center">Discount</div>
                          <div className="text-center">Price</div>
                        </div>
                      </div>

                      <div className="space-y-0">
                        {computePlans.dedicated.map((plan, index) => (
                          <PricingCard 
                            key={index} 
                            plan={{...plan, ram: `${parseInt(plan.ram) * 2} GB`}} 
                            isPopular={index === 1} 
                            isFirst={index === 0}
                            isLast={index === computePlans.dedicated.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kubernetes */}
                  {activeComputeSection === 'kubernetes' && (
                    <div>
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Kubernetes Pricing and Plans</h3>
                        <p className="text-gray-600">Effortlessly manage your containerized apps, simplify your deployment process today.</p>
                      </div>

                      <div className="bg-orange-100 rounded-t-2xl p-6 text-gray-900">
                        <div className="grid grid-cols-6 gap-4 text-sm font-semibold">
                          <div className="text-center">Instance Type</div>
                          <div className="text-center">Nodes</div>
                          <div className="text-center">RAM</div>
                          <div className="text-center">vCPU</div>
                          <div className="text-center">Hourly Price</div>
                          <div className="text-center">Monthly Price</div>
                        </div>
                      </div>

                      <div className="space-y-0">
                        {computePlans.kubernetes.map((plan, index) => {
                          const isLast = index === computePlans.kubernetes.length - 1;
                          let roundedClass = '';
                          if (isLast) {
                            roundedClass = 'rounded-b-2xl'; // Only last item gets bottom rounded corners
                          }
                          
                          return (
                            <div key={index} className={`bg-white border-b border-gray-200 last:border-b-0 ${roundedClass} p-6 hover:bg-gray-50 transition-colors`}>
                            <div className="grid grid-cols-6 gap-4 text-sm items-center">
                              <div className="text-center font-semibold text-blue-600">{plan.type}</div>
                              <div className="text-center">{plan.nodes}</div>
                              <div className="text-center">{plan.ram}</div>
                              <div className="text-center">{plan.vcpu}</div>
                              <div className="text-center font-bold text-gray-900">{plan.hourlyPrice}</div>
                              <div className="text-center">
                                <div className="font-bold text-lg text-gray-900">{plan.monthlyPrice}</div>
                                <button className="mt-2 bg-orange-200 hover:bg-orange-300 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                                  <ArrowRightIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Storage Section */}
              {activeTab === 'storage' && (
                <div>
                  <div className="mb-12 text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Storage Pricing and Plans</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">Choose from our flexible storage options designed to meet your specific needs and budget requirements.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    {storageOptions.map((storage, index) => (
                      <StorageCard key={index} storage={storage} />
                    ))}
                  </div>
                </div>
              )}

              {/* Networking Section */}
              {activeTab === 'networking' && (
                <div className="text-center py-20">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Networking Pricing and Plans</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Advanced networking solutions to connect and secure your cloud infrastructure with enterprise-grade performance.</p>
                  <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Contact Sales
                  </button>
                </div>
              )}

              {/* Databases Section */}
              {activeTab === 'databases' && (
                <div className="text-center py-20">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Database Pricing and Plans</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Managed database solutions with high availability, automatic backups, and seamless scaling capabilities.</p>
                  <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Contact Sales
                  </button>
                </div>
              )}

              {/* Security Section */}
              {activeTab === 'security' && (
                <div className="text-center py-20">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Security Pricing and Plans</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Comprehensive security solutions to protect your applications and data with advanced threat detection and prevention.</p>
                  <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Contact Sales
                  </button>
                </div>
              )}

              {/* Management Section */}
              {activeTab === 'management' && (
                <div className="text-center py-20">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Management Pricing and Plans</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Powerful management tools and services to monitor, optimize, and automate your cloud infrastructure operations.</p>
                  <button className="bg-green-200 hover:bg-green-300 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Contact Sales
                  </button>
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
            {[
              {
                question: "When will my card be charged?",
                answer: "Cloud4India billing cycles are monthly, typically starting on the first day of the month for the previous month's usage. Your card will only be charged at the end of the billing cycle or if you exceed a usage threshold."
              },
              {
                question: "Am I charged when I enter my credit card?",
                answer: "No, your card is not charged when you add it to your Cloud4India account. Charges are only applied at the end of the billing cycle or when your usage surpasses a certain threshold."
              },
              {
                question: "Why am I billed for powered-off servers?",
                answer: "Even when your server is powered off, you're still billed because resources like disk space, CPU, RAM, and IP addresses are reserved for your use. These resources are part of your overall cloud server pricing plan."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors">
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
