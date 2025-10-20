import React from 'react'
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
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const BasicCloudServers = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6 border border-green-200">
                <ServerIcon className="w-4 h-4 mr-2" />
                Cloud Servers - Made in India
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Basic Cloud Servers
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Balanced CPU and RAM ratio perfect for general workloads, web applications, and development environments. 
                Built with Indian precision and reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start Free Trial
                </button>
                <button className="border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-300">
                  View Pricing
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-200 shadow-xl">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
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

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Basic Cloud Servers?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Perfect balance of performance and cost for your everyday computing needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Balanced Performance</h3>
              <p className="text-gray-700 leading-relaxed">
                Optimal CPU and RAM ratio designed for general workloads, web applications, and development environments.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-700 leading-relaxed">
                Built-in security features with encryption, firewalls, and compliance with Indian data protection standards.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Deployment</h3>
              <p className="text-gray-700 leading-relaxed">
                Deploy your servers in seconds with our automated provisioning and configuration management.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cost Effective</h3>
              <p className="text-gray-700 leading-relaxed">
                Pay only for what you use with transparent pricing and no hidden costs. Perfect for startups and SMEs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Scalable Resources</h3>
              <p className="text-gray-700 leading-relaxed">
                Easily scale up or down based on your needs with our flexible resource allocation system.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Indian Data Centers</h3>
              <p className="text-gray-700 leading-relaxed">
                Hosted in secure Indian data centers ensuring low latency and compliance with local regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Elevate Your Business with High-Performance Servers!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our range of Basic Cloud Server plans with transparent hourly pricing
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
                  {/* BP_1vC-1GB - Free Plan */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">BP_1vC-1GB</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>1 vCPUs</div>
                        <div>1 GB vRAM</div>
                        <div>NVMe Storage</div>
                        <div>Snapshot Options</div>
                        <div>Console Access</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>Self Service Portal</div>
                        <div>Scheduled Backup & Restore Options</div>
                        <div>Dedicated Firewall & VPN with VPC</div>
                        <div>Private ISOLATED Network</div>
                        <div>Unlimited Data Transfer*</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-2xl font-bold text-green-600">Absolutely Free</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300">
                        Order Now
                      </button>
                    </td>
                  </tr>

                  {/* BP_2vC-4GB */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">BP_2vC-4GB</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>2 vCPUs</div>
                        <div>4 GB vRAM</div>
                        <div>NVMe Storage</div>
                        <div>Snapshot Options</div>
                        <div>Console Access</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>Self Service Portal</div>
                        <div>Scheduled Backup & Restore Options</div>
                        <div>Dedicated Firewall & VPN with VPC</div>
                        <div>Private ISOLATED Network</div>
                        <div>Unlimited Data Transfer*</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-orange-600">Rs. 2.0546/Hour</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300">
                        Order Now
                      </button>
                    </td>
                  </tr>

                  {/* BP_4vC-8GB */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">BP_4vC-8GB</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>4 vCPUs</div>
                        <div>8 GB vRAM</div>
                        <div>NVMe Storage</div>
                        <div>Snapshot Options</div>
                        <div>Console Access</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>Self Service Portal</div>
                        <div>Scheduled Backup & Restore Options</div>
                        <div>Dedicated Firewall & VPN with VPC</div>
                        <div>Private ISOLATED Network</div>
                        <div>Unlimited Data Transfer*</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-orange-600">Rs. 4.1093/Hour</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300">
                        Order Now
                      </button>
                    </td>
                  </tr>

                  {/* BP_8vC-16GB */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">BP_8vC-16GB</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>8 vCPUs</div>
                        <div>16 GB vRAM</div>
                        <div>NVMe Storage</div>
                        <div>Snapshot Options</div>
                        <div>Console Access</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>Self Service Portal</div>
                        <div>Scheduled Backup & Restore Options</div>
                        <div>Dedicated Firewall & VPN with VPC</div>
                        <div>Private ISOLATED Network</div>
                        <div>Unlimited Data Transfer*</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-orange-600">Rs. 8.2186/Hour</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300">
                        Order Now
                      </button>
                    </td>
                  </tr>

                  {/* BP_8vC-32GB */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">BP_8vC-32GB</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>8 vCPUs</div>
                        <div>32 GB vRAM</div>
                        <div>NVMe Storage</div>
                        <div>Snapshot Options</div>
                        <div>Console Access</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>Self Service Portal</div>
                        <div>Scheduled Backup & Restore Options</div>
                        <div>Dedicated Firewall & VPN with VPC</div>
                        <div>Private ISOLATED Network</div>
                        <div>Unlimited Data Transfer*</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-orange-600">Rs. 13.4645/Hour</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300">
                        Order Now
                      </button>
                    </td>
                  </tr>

                  {/* BP_16vC-32GB */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">BP_16vC-32GB</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>16 vCPUs</div>
                        <div>32 GB vRAM</div>
                        <div>NVMe Storage</div>
                        <div>Snapshot Options</div>
                        <div>Console Access</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>Self Service Portal</div>
                        <div>Scheduled Backup & Restore Options</div>
                        <div>Dedicated Firewall & VPN with VPC</div>
                        <div>Private ISOLATED Network</div>
                        <div>Unlimited Data Transfer*</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-orange-600">Rs. 16.4372/Hour</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300">
                        Order Now
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              *Unlimited Data Transfer subject to fair usage policy
            </p>
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed technical information about our Basic Cloud Server infrastructure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <CpuChipIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">CPU Performance</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Intel Xeon processors</li>
                <li>• High-frequency cores</li>
                <li>• Burstable performance</li>
                <li>• CPU credits system</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
                <CircleStackIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Memory & Storage</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• DDR4 RAM technology</li>
                <li>• NVMe SSD storage</li>
                <li>• High IOPS performance</li>
                <li>• Snapshot capabilities</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Network & Connectivity</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• High-speed network</li>
                <li>• Low latency connections</li>
                <li>• Private networking</li>
                <li>• Load balancer support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Security & Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade security features to protect your data and applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Encryption</h3>
                    <p className="text-gray-700">End-to-end encryption for data at rest and in transit using industry-standard AES-256 encryption.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <ServerIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Firewall & VPN</h3>
                    <p className="text-gray-700">Dedicated firewall protection and VPN access with VPC for secure network isolation.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance Standards</h3>
                    <p className="text-gray-700">Compliant with Indian data protection regulations and international security standards.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Security Features</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">DDoS Protection</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Intrusion Detection</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Regular Security Updates</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Access Control</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Audit Logging</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Backup & Recovery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & SLA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Support & Service Level Agreement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Round-the-clock support and guaranteed uptime for your peace of mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock technical support via phone, email, and live chat.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-gray-600">Guaranteed service availability with SLA-backed uptime commitment.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">Certified cloud engineers and DevOps specialists at your service.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CircleStackIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-600">Rapid response times with priority support for critical issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration & Onboarding Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Easy Migration & Onboarding
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamless migration from your current infrastructure with expert guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment</h3>
              <p className="text-gray-700">Our experts analyze your current infrastructure and requirements to recommend the best configuration.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Migration</h3>
              <p className="text-gray-700">Seamless migration of your applications and data with minimal downtime and zero data loss.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimization</h3>
              <p className="text-gray-700">Continuous monitoring and optimization to ensure optimal performance and cost efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Basic Cloud Servers perfectly match different business needs and use cases
            </p>
          </div>

          {/* Problem-Solution Layout */}
          <div className="space-y-16">
            {/* Use Case 1 - Web Applications */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4">
                    <GlobeAltIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Web Applications</h3>
                  <p className="text-gray-600">E-commerce, Corporate Sites, APIs</p>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl mb-4">→</div>
                  <div className="text-sm text-gray-500 font-medium">PERFECT MATCH</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Why It's Perfect:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      High availability hosting
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Auto-scaling for traffic spikes
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      SSL certificate support
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      CDN integration ready
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Use Case 2 - Development & Testing */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4">
                    <CpuChipIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Development & Testing</h3>
                  <p className="text-gray-600">Dev Environments, Staging, CI/CD</p>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl mb-4">→</div>
                  <div className="text-sm text-gray-500 font-medium">PERFECT MATCH</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Why It's Perfect:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      Isolated development environments
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      Quick deployment and rollback
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      Version control integration
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      Docker container support
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Use Case 3 - Small Business */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4">
                    <UsersIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Small Business</h3>
                  <p className="text-gray-600">Startups, SMEs, Growing Companies</p>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl mb-4">→</div>
                  <div className="text-sm text-gray-500 font-medium">PERFECT MATCH</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Why It's Perfect:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Cost-effective solutions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Easy scalability as you grow
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      24/7 support included
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      No upfront investment
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of Indian businesses already using Cloud4India Basic Cloud Servers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start Free Trial
            </button>
            <button className="border-2 border-orange-300 text-orange-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BasicCloudServers
