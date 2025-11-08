import React, { useState } from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const ChooseImageSection = () => {
  const [activeTab, setActiveTab] = useState('linux');
  const [selectedItems, setSelectedItems] = useState({});
  const [marketplacePage, setMarketplacePage] = useState(1);
  const itemsPerPage = 15;

  // Linux distributions data
  const linuxDistros = [
    { id: 'almalinux', name: 'AlmaLinux', logo: '🔷', logoClass: 'w-8 h-8', versions: ['AlmaLinux 8', 'AlmaLinux 9'] },
    { id: 'centos', name: 'CentOS', logo: '⭐', logoClass: 'w-8 h-8', versions: ['CentOS 7', 'CentOS 8', 'CentOS Stream 9'] },
    { id: 'cloudlinux', name: 'CloudLinux', logo: '☁️', logoClass: 'w-8 h-8', versions: ['CloudLinux 7', 'CloudLinux 8'] },
    { id: 'debian', name: 'Debian', logo: '🔴', logoClass: 'w-8 h-8', versions: ['Debian 10', 'Debian 11', 'Debian 12'] },
    { id: 'redhat', name: 'RedHat', logo: '🎩', logoClass: 'w-8 h-8', versions: ['RHEL 7', 'RHEL 8', 'RHEL 9'] },
    { id: 'rockylinux', name: 'RockyLinux', logo: '🏔️', logoClass: 'w-8 h-8', versions: ['RockyLinux 8', 'RockyLinux 9'] },
    { id: 'ubuntu', name: 'Ubuntu', logo: '🟠', logoClass: 'w-8 h-8', versions: ['Ubuntu 20.04', 'Ubuntu 22.04', 'Ubuntu 24.04'] }
  ];

  // Windows data
  const windowsVersions = [
    { id: 'windows', name: 'Windows', logo: '🪟', versions: ['Windows Server 2019', 'Windows Server 2022'] }
  ];

  // Marketplace Apps - Page 1
  const marketplaceAppsPage1 = [
    { id: 'activemq', name: 'ActiveMQ', logo: '📦', versions: ['Version 5.18.0'] },
    { id: 'anaconda', name: 'Anaconda', logo: '🐍', versions: ['Version 2023.09'] },
    { id: 'apachekafka', name: 'ApacheKafka', logo: '⚡', versions: ['Version 3.5.0'] },
    { id: 'antmedia', name: 'Ant Media Server', logo: '📺', versions: ['Version 2.8.0'] },
    { id: 'docker', name: 'Docker', logo: '🐳', versions: ['Version 24.0'] },
    { id: 'gitlab', name: 'Gitlab', logo: '🦊', versions: ['Version 16.2'] },
    { id: 'guacamole', name: 'Guacamole', logo: '🥑', versions: ['Version 1.5.0'] },
    { id: 'jenkins', name: 'Jenkins', logo: '🤖', versions: ['Version 2.426'] },
    { id: 'influxdb', name: 'InfluxDB', logo: '📊', versions: ['Version 2.7'] },
    { id: 'lamp', name: 'LAMP Stack', logo: '💡', versions: ['Version 8.2'] },
    { id: 'laravel', name: 'Laravel', logo: '🎨', versions: ['Version 10.0'] },
    { id: 'lemp', name: 'LEMP Stack', logo: '🔧', versions: ['Version 8.2'] },
    { id: 'magento2', name: 'Magento 2', logo: '🛒', versions: ['Version 2.4.6'] },
    { id: 'mariadb', name: 'MariaDB', logo: '🗄️', versions: ['Version 11.0'] },
    { id: 'mediawiki', name: 'MediaWiki', logo: '📚', versions: ['Version 1.41'] }
  ];

  // Marketplace Apps - Page 2
  const marketplaceAppsPage2 = [
    { id: 'mongodb', name: 'MongoDB', logo: '🍃', versions: ['Version 7.0'] },
    { id: 'mysql', name: 'MySQL', logo: '🐬', versions: ['Version 8.0'] },
    { id: 'nextcloud', name: 'NextCloud', logo: '☁️', versions: ['Version 28.0'] },
    { id: 'nodejs', name: 'NODEJS', logo: '🟢', versions: ['Version 20.0'] },
    { id: 'openlitespeed', name: 'OpenLiteSpeed', logo: '⚡', versions: ['Version 1.7'] },
    { id: 'opensearch', name: 'OpenSearch', logo: '🔍', versions: ['Version 2.11'] },
    { id: 'owncloud', name: 'OwnCloud', logo: '☁️', versions: ['Version 10.12'] },
    { id: 'postgresql', name: 'PostgreSQL', logo: '🐘', versions: ['Version 16.0'] },
    { id: 'prometheus', name: 'Prometheus', logo: '🔥', versions: ['Version 2.47'] },
    { id: 'rabbitmq', name: 'RabbitMQ', logo: '🐰', versions: ['Version 3.12'] },
    { id: 'rethinkdb', name: 'RethinkDB', logo: '💚', versions: ['Version 2.4'] },
    { id: 'wordpress', name: 'WordPress', logo: 'W', versions: ['Version 6.4'] }
  ];

  // ISOs data
  const isos = [
    { id: 'rockylinux-iso', name: 'RockyLinux', logo: '🏔️', versions: ['RockyLinux 8 ISO', 'RockyLinux 9 ISO'] },
    { id: 'acronis', name: 'Acronis Recovery Media', logo: '🛡️', versions: ['Version 2024'] }
  ];

  // Get current tab items
  const getCurrentItems = () => {
    if (activeTab === 'linux') return linuxDistros;
    if (activeTab === 'windows') return windowsVersions;
    if (activeTab === 'isos') return isos;
    if (activeTab === 'marketplace') {
      return marketplacePage === 1 ? marketplaceAppsPage1 : marketplaceAppsPage2;
    }
    return [];
  };

  // Handle item selection
  const handleItemSelect = (itemId, version) => {
    setSelectedItems({
      ...selectedItems,
      [activeTab]: { itemId, version }
    });
  };

  // Get selected version for an item
  const getSelectedVersion = (itemId) => {
    return selectedItems[activeTab]?.itemId === itemId ? selectedItems[activeTab]?.version : null;
  };

  // Check if item is selected
  const isItemSelected = (itemId) => {
    return selectedItems[activeTab]?.itemId === itemId;
  };

  const currentItems = getCurrentItems();

  return (
    <section className="py-16 pb-24 bg-gradient-to-br from-saree-teal-light/30 via-white to-phulkari-turquoise-light/30 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose Image</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Pick an operating system or application template to install on your server. You can also upload a custom ISO image for greater flexibility.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b-2 border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'linux', label: 'Linux' },
              { id: 'windows', label: 'Windows' },
              { id: 'marketplace', label: 'Marketplace Apps' },
              { id: 'isos', label: 'ISOs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMarketplacePage(1);
                }}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-saree-teal text-saree-teal-dark'
                    : 'border-transparent text-gray-500 hover:text-saree-teal hover:border-saree-teal-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Grid */}
        <div className={`grid gap-4 mb-8 ${
          activeTab === 'windows' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : activeTab === 'isos'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        }`}>
          {currentItems.map((item) => {
            const isSelected = isItemSelected(item.id);
            const selectedVersion = getSelectedVersion(item.id);

            return (
              <div
                key={item.id}
                className={`relative bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 group ${
                  isSelected
                    ? 'border-saree-teal shadow-lg ring-4 ring-saree-teal-light bg-saree-teal-light/20'
                    : 'border-gray-200 hover:border-saree-teal hover:bg-saree-teal-light/10'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-saree-teal rounded-full flex items-center justify-center z-10 shadow-lg">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Logo and Name */}
                <div className="flex items-center p-4 border-b-2 border-gray-200 group-hover:border-saree-teal transition-colors">
                  <div className={`${item.logoClass || 'w-8 h-8'} mr-3 flex items-center justify-center text-2xl`}>
                    {item.logo}
                  </div>
                  <div className="font-bold text-gray-900 text-sm flex-1 group-hover:text-saree-teal-dark transition-colors">{item.name}</div>
                </div>

                {/* Version Selector */}
                <div className="p-4">
                  <select
                    value={selectedVersion || ''}
                    onChange={(e) => handleItemSelect(item.id, e.target.value)}
                    className="w-full bg-white text-gray-900 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold appearance-none cursor-pointer hover:border-saree-teal hover:bg-saree-teal-light/10 focus:outline-none focus:ring-2 focus:ring-saree-teal focus:border-saree-teal transition-all"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2312A7A7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1rem',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="" disabled>
                      Select Version
                    </option>
                    {item.versions.map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination (only for Marketplace Apps) */}
        {activeTab === 'marketplace' && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setMarketplacePage(1)}
              disabled={marketplacePage === 1}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                marketplacePage === 1
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-gray-700 hover:text-saree-teal hover:bg-saree-teal-light/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            <button
              onClick={() => setMarketplacePage(1)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                marketplacePage === 1
                  ? 'bg-saree-teal text-white font-semibold border-2 border-saree-teal shadow-lg'
                  : 'text-gray-700 border-2 border-gray-200 hover:border-saree-teal hover:text-saree-teal hover:bg-saree-teal-light/20'
              }`}
            >
              1
            </button>

            <button
              onClick={() => setMarketplacePage(2)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                marketplacePage === 2
                  ? 'bg-saree-teal text-white font-semibold border-2 border-saree-teal shadow-lg'
                  : 'text-gray-700 border-2 border-gray-200 hover:border-saree-teal hover:text-saree-teal hover:bg-saree-teal-light/20'
              }`}
            >
              2
            </button>

            <button
              onClick={() => setMarketplacePage(2)}
              disabled={marketplacePage === 2}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                marketplacePage === 2
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-gray-700 hover:text-saree-teal hover:bg-saree-teal-light/20'
              }`}
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChooseImageSection;

