import React, { useState } from 'react';
import {
  HomeIcon,
  Squares2X2Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PuzzlePieceIcon,
  DocumentTextIcon,
  CogIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children, activeSection = '', title = '', onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen for navigation events
  React.useEffect(() => {
    const handleNavigation = (event) => {
      if (onNavigate && event.detail) {
        onNavigate(event.detail.section);
      }
    };

    window.addEventListener('admin-navigate', handleNavigation);
    return () => window.removeEventListener('admin-navigate', handleNavigation);
  }, [onNavigate]);

  const navigationItems = [
    {
      id: 'home',
      label: 'Home Page',
      icon: HomeIcon,
      href: '/rohit',
      isActive: activeSection === 'home'
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Squares2X2Icon,
      href: '/rohit',
      isActive: activeSection === 'marketplace',
      onClick: () => {
        // This will be handled by the parent component
        if (window.location.pathname === '/rohit') {
          // If we're on the main admin page, trigger the marketplace section
          const event = new CustomEvent('admin-navigate', { detail: { section: 'marketplace' } });
          window.dispatchEvent(event);
        } else {
          // If we're on a different admin page, navigate to main admin
          window.location.href = '/rohit#marketplace';
        }
      }
    },
    {
      id: 'marketplace-main',
      label: 'Marketplace Main',
      icon: PuzzlePieceIcon,
      href: '/rohit/marketplace-main',
      isActive: activeSection === 'marketplace-main'
    },
    {
      id: 'quotations',
      label: 'Quotations',
      icon: DocumentTextIcon,
      href: '/rohit/quotations',
      isActive: activeSection === 'quotations'
    },
    {
      id: 'price-estimator-config',
      label: 'Price Estimator',
      icon: CalculatorIcon,
      href: '/rohit/price-estimator-config',
      isActive: activeSection === 'price-estimator-config'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex text-gray-900 font-inter">
      {/* Sidebar Navigation */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white/70 backdrop-blur-xl border-r border-gray-200 transition-all duration-200`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center p-4' : 'justify-between p-6'} border-b border-gray-200`}>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">Cloud4India CMS</h1>
              <p className="text-sm text-gray-600 mt-1">Content Management</p>
            </div>
          )}
          <button
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            {sidebarCollapsed ? (
              <ChevronDoubleRightIcon className="w-5 h-5" />
            ) : (
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="mt-6">
          <div className={`${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;

              if (item.onClick) {
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-xl mb-1 transition-colors ${item.isActive
                        ? 'bg-gray-100 text-gray-900 ring-1 ring-gray-200'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    title={item.label}
                  >
                    <IconComponent className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                    {!sidebarCollapsed && item.label}
                  </button>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-xl mb-1 transition-colors ${item.isActive
                      ? 'bg-gray-100 text-gray-900 ring-1 ring-gray-200'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  title={item.label}
                >
                  <IconComponent className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                  {!sidebarCollapsed && item.label}
                </a>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/60 backdrop-blur-xl border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
