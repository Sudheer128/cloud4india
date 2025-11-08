import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const AppsDropdown = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('Frameworks')
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  
  // Static apps data based on provided images
  const appsData = {
    'Frameworks': [
      {
        id: 'openlitespeed',
        name: 'OpenLiteSpeed',
        description: 'OpenLiteSpeed combines speed, security, scalability, optimization and simplicity in one friendly open-source package.',
        buttonText: 'Deploy'
      },
      {
        id: 'nodejs',
        name: 'Node.js',
        description: 'Node.js® is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.',
        buttonText: 'Deploy'
      },
      {
        id: 'lamp',
        name: 'LAMP',
        description: 'Quickly deploy a cloud server with Apache, MySQL, and PHP pre-installed—the foundation for hosting robust web applications. The LAMP stack is widely used for hosting websites and web apps, offering a flexible, scalable, and reliable solution.',
        buttonText: 'Deploy'
      },
      {
        id: 'lemp',
        name: 'LEMP',
        description: 'Quickly deploy a cloud server with Nginx, MySQL, and PHP pre-installed—the essential components for hosting high-performance, scalable web applications. The LEMP stack is popular for modern websites and web apps.',
        buttonText: 'Deploy'
      },
      {
        id: 'laravel',
        name: 'Laravel',
        description: 'Laravel provides a complete ecosystem for web artisans. Our open source PHP framework, products, packages, and starter kits offer everything you need to build, deploy, and monitor web applications.',
        buttonText: 'Deploy'
      }
    ],
    'Content Management Systems': [
      {
        id: 'wordpress',
        name: 'WordPress',
        description: 'Everything you need to build and grow any website—all in one place.',
        buttonText: 'Deploy'
      },
      {
        id: 'nextcloud',
        name: 'Nextcloud Hub',
        description: 'Nextcloud Hub combines key Nextcloud products — Files, Talk, Groupware, Office and Assistant — into a single platform, optimizing the flow of collaboration.',
        buttonText: 'Deploy'
      },
      {
        id: 'mediawiki',
        name: 'MediaWiki',
        description: 'The MediaWiki software is used by tens of thousands of websites and thousands of companies and organisations. It powers Wikipedia and also this website. MediaWiki helps you collect and organise knowledge and make it available to people.',
        buttonText: 'Deploy'
      }
    ],
    'Databases': [
      {
        id: 'mariadb',
        name: 'MariaDB',
        description: 'MariaDB is a widely used, open-source relational database management system (RDBMS). It\'s known for being a drop-in replacement for MySQL, meaning it can often be used seamlessly where MySQL is already in use, but with some additional features and improvements.',
        buttonText: 'Deploy'
      },
      {
        id: 'mongodb',
        name: 'MongoDB',
        description: 'MongoDB is a source-available, cross-platform document-oriented database program. Classified as a NoSQL database product, MongoDB uses JSON-like documents with optional schemas.',
        buttonText: 'Deploy'
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        description: 'PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.',
        buttonText: 'Deploy'
      },
      {
        id: 'influxdb',
        name: 'InfluxDB',
        description: 'InfluxDB is an open-source time series database designed to handle high write and query loads. It is purpose-built for storing, querying, and visualizing time-stamped data, including metrics, events, and real-time analytics.',
        buttonText: 'Deploy'
      },
      {
        id: 'rethinkdb',
        name: 'RethinkDB',
        description: 'RethinkDB is an open-source, document database that stores information in JSON format. It makes it easy to build and scale realtime apps with push architecture that instantly updates queries and pushes updates to applications.',
        buttonText: 'Deploy'
      },
      {
        id: 'mysql',
        name: 'MySQL',
        description: 'MySQL is the world\'s most popular open source relational database. Trusted by millions of developers and thousands of companies worldwide, MySQL delivers proven performance, reliability, and ease-of-use for web applications at any scale.',
        buttonText: 'Deploy'
      },
      {
        id: 'kafka',
        name: 'Apache Kafka',
        description: 'Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.',
        buttonText: 'Deploy'
      },
      {
        id: 'opensearch',
        name: 'OpenSearch',
        description: 'OpenSearch is an open-source, enterprise-grade search and observability suite that brings order to unstructured data at scale',
        buttonText: 'Deploy'
      }
    ],
    'Developer Tools': [
      {
        id: 'docker',
        name: 'Docker',
        description: 'Docker helps developers build, share, run, and verify applications anywhere — without tedious environment configuration or management.',
        buttonText: 'Deploy'
      },
      {
        id: 'gitlab',
        name: 'GitLab',
        description: 'GitLab is a web-based Git repository that provides free and private repositories, issue-following capabilities, and wikis.',
        buttonText: 'Deploy'
      },
      {
        id: 'rabbitmq',
        name: 'RabbitMQ',
        description: 'RabbitMQ is a reliable and mature messaging and streaming broker, which is easy to deploy on cloud environments, on-premises, and on your local machine. It is currently used by millions worldwide.',
        buttonText: 'Deploy'
      },
      {
        id: 'jenkins',
        name: 'Jenkins',
        description: 'The leading open source automation server, Jenkins provides hundreds of plugins to support building, deploying and automating any project.',
        buttonText: 'Deploy'
      }
    ],
    'Media': [
      {
        id: 'ant-media',
        name: 'Ant Media Server',
        description: 'Ant Media Server is a real-time streaming engine software that provides adaptive, ultra low latency streaming by using WebRTC technology with ~0.5 seconds',
        buttonText: 'Deploy'
      }
    ],
    'E Commerce': [
      {
        id: 'magento',
        name: 'Magento 2',
        description: 'Magento 2 is an open-source e-commerce platform, known for its flexibility and robust features, enabling businesses to build and manage online stores.',
        buttonText: 'Deploy'
      }
    ],
    'Business Applications': [
      {
        id: 'guacamole',
        name: 'Apache Guacamole',
        description: 'Apache Guacamole is a clientless remote desktop gateway. It supports standard protocols like VNC, RDP, and SSH.',
        buttonText: 'Deploy'
      },
      {
        id: 'owncloud',
        name: 'ownCloud',
        description: 'ownCloud is an open-source file sync, share and content collaboration software that lets teams work on data easily from anywhere, on any device.',
        buttonText: 'Deploy'
      }
    ],
    'Monitoring Applications': [
      {
        id: 'prometheus',
        name: 'Prometheus',
        description: 'Open source metrics and monitoring for your systems and services Monitor your applications, systems, and services with the leading open source monitoring solution. Instrument, collect, store, and query your metrics for alerting, dashboarding, and other use cases',
        buttonText: 'Deploy'
      },
      {
        id: 'activemq',
        name: 'Apache ActiveMQ',
        description: 'Apache ActiveMQ® is the most popular open source, multi-protocol, Java-based message broker. It supports industry standard protocols so users get the benefits of client choices across a broad range of languages and platforms.',
        buttonText: 'Deploy'
      },
      {
        id: 'anaconda',
        name: 'Anaconda',
        description: 'Advance AI with Clarity and Confidence Simplify, safeguard, and accelerate AI value with open source.',
        buttonText: 'Deploy'
      }
    ]
  }

  // Category mapping based on the images provided
  const categories = [
    { id: 'Frameworks', label: 'Frameworks' },
    { id: 'Content Management Systems', label: 'Content Management Systems' },
    { id: 'Databases', label: 'Databases' },
    { id: 'Developer Tools', label: 'Developer Tools' },
    { id: 'Media', label: 'Media' },
    { id: 'E Commerce', label: 'E Commerce' },
    { id: 'Business Applications', label: 'Business Applications' },
    { id: 'Monitoring Applications', label: 'Monitoring Applications' }
  ]

  // Get apps for active category
  const displayApps = appsData[activeCategory] || []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if click is not on the apps link itself
        if (!event.target.closest('[data-apps-link]')) {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        ref={dropdownRef}
        className="fixed top-16 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50 max-h-[85vh] overflow-hidden rounded-b-xl"
      >
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex gap-8">
            
            {/* Left Sidebar - Categories */}
            <div className="w-72 flex-shrink-0">
              <div className="border-r border-gray-200 pr-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Explore Apps</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className="space-y-0.5">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/solutions"
                    onClick={onClose}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group"
                  >
                    View all apps
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Content Area - Apps */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find(c => c.id === activeCategory)?.label || 'Apps'}
                </h2>
                {displayApps.length === 0 && (
                  <p className="text-gray-500 text-sm mt-2">No apps available in this category.</p>
                )}
              </div>
              
              {displayApps.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayApps.map((app) => {
                      // Check if app has a dedicated page
                      const appRoutes = {
                        'openlitespeed': '/solutions/9',
                        'nodejs': '/solutions/1',
                        'lamp': '/solutions/2',
                        'lemp': '/solutions/3',
                        'laravel': '/solutions/4',
                        'wordpress': '/solutions/26',
                        'nextcloud': '/solutions/27',
                        'mediawiki': '/solutions/28',
                        'mariadb': '/solutions/29',
                        'mongodb': '/solutions/30',
                        'postgresql': '/solutions/31',
                        'influxdb': '/solutions/32',
                        'rethinkdb': '/solutions/33',
                        'mysql': '/solutions/34',
                        'kafka': '/solutions/35',
                        'opensearch': '/solutions/36',
                        'docker': '/solutions/37',
                        'gitlab': '/solutions/38',
                        'rabbitmq': '/solutions/39',
                        'jenkins': '/solutions/40',
                        'ant-media': '/solutions/41',
                        'magento': '/solutions/42',
                        'guacamole': '/solutions/43',
                        'owncloud': '/solutions/44',
                        'prometheus': '/solutions/45',
                        'activemq': '/solutions/46',
                        'anaconda': '/solutions/47'
                      };
                      const hasPage = appRoutes[app.id];
                      
                      const cardContent = (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                              {app.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3">{app.description}</p>
                          </div>
                          <ArrowRightIcon className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-600 transition-all duration-200 ml-2 flex-shrink-0" />
                        </div>
                      );

                      return hasPage ? (
                        <div
                          key={app.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            navigate(hasPage);
                          }}
                          className="group rounded-lg p-6 border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm cursor-pointer block"
                        >
                          {cardContent}
                        </div>
                      ) : (
                        <div
                          key={app.id}
                          className="group rounded-lg p-6 border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
                        >
                          {cardContent}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>No apps available in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppsDropdown

