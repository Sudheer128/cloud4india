import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getMarketplaces, getMarketplaceCategories } from '../services/cmsApi'
import { toSlug } from '../utils/slugUtils'

const AppsDropdown = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(null)
  const [marketplaces, setMarketplaces] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  
  // Reset active category when popup closes
  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null)
    }
  }, [isOpen])

  // Fetch marketplaces and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [marketplacesData, categoriesData] = await Promise.all([
          getMarketplaces(),
          getMarketplaceCategories()
        ])
        setMarketplaces(marketplacesData)
        // Map categories to the format expected by the component
        const formattedCategories = categoriesData.map(cat => ({
          id: cat.name,
          label: cat.name,
          order_index: cat.order_index
        }))
        setCategories(formattedCategories)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
        // Fallback: if categories API fails, extract from marketplaces
        try {
          const marketplacesData = await getMarketplaces()
          setMarketplaces(marketplacesData)
        } catch (marketplacesErr) {
          console.error('Error fetching marketplaces:', marketplacesErr)
        }
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  // Group marketplaces by category
  const appsData = marketplaces.reduce((acc, marketplace) => {
    const category = marketplace.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    
    // Generate app ID from route (e.g., '/marketplaces/1' -> '1', then map to known IDs)
    // For now, we'll use a simple approach: extract ID from route
    let appId = marketplace.route?.replace('/marketplaces/', '') || marketplace.id?.toString()
    
    // Map to known app IDs if possible (for backward compatibility with existing routes)
    const routeToIdMap = {
      '/marketplaces/1': 'nodejs',
      '/marketplaces/2': 'lamp',
      '/marketplaces/3': 'lemp',
      '/marketplaces/4': 'laravel',
      '/marketplaces/9': 'openlitespeed',
      '/marketplaces/26': 'wordpress',
      '/marketplaces/27': 'nextcloud',
      '/marketplaces/28': 'mediawiki',
      '/marketplaces/29': 'mariadb',
      '/marketplaces/30': 'mongodb',
      '/marketplaces/31': 'postgresql',
      '/marketplaces/32': 'influxdb',
      '/marketplaces/33': 'rethinkdb',
      '/marketplaces/34': 'mysql',
      '/marketplaces/35': 'kafka',
      '/marketplaces/36': 'opensearch',
      '/marketplaces/37': 'docker',
      '/marketplaces/38': 'gitlab',
      '/marketplaces/39': 'rabbitmq',
      '/marketplaces/40': 'jenkins',
      '/marketplaces/41': 'ant-media',
      '/marketplaces/42': 'magento',
      '/marketplaces/43': 'guacamole',
      '/marketplaces/44': 'owncloud',
      '/marketplaces/45': 'prometheus',
      '/marketplaces/46': 'activemq',
      '/marketplaces/47': 'anaconda'
    }
    
    appId = routeToIdMap[marketplace.route] || appId
    
    acc[category].push({
      id: appId,
      name: marketplace.name,
      description: marketplace.description,
      buttonText: 'Deploy',
      route: marketplace.route,
      enable_single_page: marketplace.enable_single_page,
      redirect_url: marketplace.redirect_url,
      color: marketplace.color
    })
    
    return acc
  }, {})

  // Get available categories from localStorage (categories that exist but have no apps yet)
  const getAvailableCategories = () => {
    try {
      const stored = localStorage.getItem('availableCategories');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const availableCategories = getAvailableCategories();
  
  // Use categories from API if available, otherwise fallback to extracting from marketplaces
  const displayCategories = useMemo(() => {
    let finalCategories = [];
    
    if (categories.length > 0) {
      // Use categories from API - they should already be sorted by order_index from the API
      // But we'll sort again to be sure
      finalCategories = [...categories].sort((a, b) => {
        if (a.order_index !== undefined && b.order_index !== undefined) {
          return a.order_index - b.order_index;
        }
        return 0;
      });
      
      // Add any categories from marketplaces that aren't in the API list
      const categoriesFromMarketplaces = Object.keys(appsData).filter(cat => cat !== 'Uncategorized');
      const existingCategoryNames = new Set(categories.map(c => c.id));
      const missingCategories = categoriesFromMarketplaces.filter(cat => !existingCategoryNames.has(cat));
      
      if (missingCategories.length > 0) {
        // Add missing categories at the end, sorted alphabetically
        const missingFormatted = missingCategories
          .sort()
          .map(cat => ({ id: cat, label: cat, order_index: 9999 }));
        finalCategories = [...finalCategories, ...missingFormatted];
      }
    } else {
      // Fallback: extract unique categories from marketplaces and merge with available categories
      // Use a predefined order
      const predefinedOrder = [
        'Frameworks',
        'Content Management Systems',
        'Databases',
        'Developer Tools',
        'Media',
        'E Commerce',
        'Business Applications',
        'Monitoring Applications'
      ];
      
  const categoriesFromMarketplaces = Object.keys(appsData).filter(cat => cat !== 'Uncategorized');
  const allCategories = Array.from(new Set([
    ...categoriesFromMarketplaces,
    ...availableCategories.filter(cat => !categoriesFromMarketplaces.includes(cat))
      ]));
      
      // Create a map of all categories with their order_index
      const categoryMap = new Map();
      allCategories.forEach(cat => {
        const orderIndex = predefinedOrder.indexOf(cat);
        categoryMap.set(cat, {
          id: cat,
          label: cat,
          order_index: orderIndex !== -1 ? orderIndex : 9999
        });
      });
      
      // First, add categories in predefined order
      predefinedOrder.forEach(catName => {
        if (categoryMap.has(catName)) {
          finalCategories.push(categoryMap.get(catName));
          categoryMap.delete(catName);
        }
      });
      
      // Then add any remaining categories (not in predefined order) sorted alphabetically
      const remainingCategories = Array.from(categoryMap.values())
        .sort((a, b) => a.label.localeCompare(b.label));
      finalCategories = [...finalCategories, ...remainingCategories];
    }
    
    return finalCategories;
  }, [categories, appsData, availableCategories]);

  // Set active category to first category with apps when data loads
  useEffect(() => {
    if (displayCategories.length > 0 && !activeCategory && !loading) {
      // Find the first category that has apps
      const firstCategoryWithApps = displayCategories.find(category => {
        return appsData[category.id] && appsData[category.id].length > 0
      })
      
      // If found, set it; otherwise set the first category
      if (firstCategoryWithApps) {
        setActiveCategory(firstCategoryWithApps.id)
      } else if (displayCategories.length > 0) {
        setActiveCategory(displayCategories[0].id)
      }
    }
  }, [displayCategories, activeCategory, loading, appsData])
  
  // Static apps data based on provided images (fallback - will be removed)
  const staticAppsData = {
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
        description: 'Quickly deploy a cloud server with Apache, MySQL, and PHP pre-installed—the foundation for hosting robust web applications. The LAMP stack is widely used for hosting websites and web apps, offering a flexible, scalable, and reliable marketplace.',
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
        description: 'Open source metrics and monitoring for your systems and services Monitor your applications, systems, and services with the leading open source monitoring marketplace. Instrument, collect, store, and query your metrics for alerting, dashboarding, and other use cases',
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

  // Get apps for active category
  const displayApps = activeCategory ? (appsData[activeCategory] || []) : []

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        
        onClick={onClose}
      />
      
      {/* Dropdown - Top positioned with reasonable height */}
      <div 
        ref={dropdownRef}
        className="fixed top-16 left-0 right-0 bg-white z-[80] shadow-2xl border-t border-gray-200
                   max-h-[75vh] sm:max-h-[80vh] md:max-h-[85vh]
                   overflow-hidden rounded-b-xl
                   mx-2 sm:mx-4 md:mx-auto
                   max-w-7xl
                   flex flex-col
                   pointer-events-auto"
      >
        <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 pb-4 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Explore Apps</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0 overflow-hidden">
            
            {/* Left Sidebar - Categories (Desktop Only) */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="border-r border-gray-200 pr-4 h-full overflow-y-auto">
                {/* Desktop Category List */}
                <nav className="space-y-0.5">
                  {loading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">Loading categories...</div>
                  ) : error ? (
                    <div className="px-3 py-2 text-sm text-red-600">Error loading categories</div>
                  ) : displayCategories.length > 0 ? (
                    displayCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                          activeCategory === category.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No categories available</div>
                  )}
                </nav>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to="/marketplace"
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

            {/* Mobile/Tablet Category Selector */}
            <div className="lg:hidden flex-shrink-0">
              <select
                value={activeCategory || ''}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {displayCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Content Area - Apps */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="mb-3 md:mb-4 flex-shrink-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {displayCategories.find(c => c.id === activeCategory)?.label || 'Apps'}
                </h2>
                {!loading && displayApps.length === 0 && (
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">No apps available in this category.</p>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center flex-1 min-h-[150px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Loading apps...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center flex-1 min-h-[150px] text-red-600 text-sm">
                  <p>Error loading apps: {error}</p>
                </div>
              ) : displayApps.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-0 md:pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {displayApps.map((app) => {
                      // Determine navigation URL based on enable_single_page flag
                      const shouldUseSinglePage = app.enable_single_page !== undefined ? Boolean(app.enable_single_page) : true;
                      const navigationUrl = !shouldUseSinglePage && app.redirect_url 
                        ? app.redirect_url 
                        : `/marketplace/${toSlug(app.name)}`;
                      
                      const isExternalUrl = navigationUrl.startsWith('http://') || navigationUrl.startsWith('https://');
                      
                      const cardContent = (
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                              {app.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">{app.description}</p>
                          </div>
                          <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-600 transition-all duration-200 ml-2 flex-shrink-0 mt-0.5" />
                        </div>
                      );

                      // Handle navigation based on URL type
                      if (isExternalUrl) {
                        return (
                          <a
                            key={app.id}
                            href={navigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                            }}
                            className="group rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 hover:shadow-sm cursor-pointer block"
                          >
                            {cardContent}
                          </a>
                        );
                      }

                      return (
                        <div
                          key={app.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            navigate(navigationUrl);
                          }}
                          className="group rounded-lg p-3 sm:p-4 md:p-5 border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 hover:shadow-sm cursor-pointer block"
                        >
                          {cardContent}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-1 min-h-[150px] text-gray-500 text-sm">
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

