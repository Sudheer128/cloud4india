import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  Squares2X2Icon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
  PuzzlePieceIcon,
  InformationCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home Page',
      icon: HomeIcon,
      path: '/admin',
      matchPaths: ['/admin']
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Squares2X2Icon,
      path: '/admin/marketplace',
      matchPaths: ['/admin/marketplace']
    },
    {
      id: 'marketplace-main',
      label: 'Marketplace Main',
      icon: PuzzlePieceIcon,
      path: '/admin/marketplace-main',
      matchPaths: ['/admin/marketplace-main']
    },
    {
      id: 'products',
      label: 'Products',
      icon: Squares2X2Icon,
      path: '/admin/products',
      matchPaths: ['/admin/products']
    },
    {
      id: 'products-main',
      label: 'Products Main',
      icon: PuzzlePieceIcon,
      path: '/admin/products-main',
      matchPaths: ['/admin/products-main']
    },
    {
      id: 'solutions',
      label: 'Solutions',
      icon: Squares2X2Icon,
      path: '/admin/solutions',
      matchPaths: ['/admin/solutions']
    },
    {
      id: 'solutions-main',
      label: 'Solutions Main',
      icon: PuzzlePieceIcon,
      path: '/admin/solutions-main',
      matchPaths: ['/admin/solutions-main']
    },
    {
      id: 'pricing',
      label: 'Pricing',
      icon: CurrencyDollarIcon,
      path: '/admin/pricing',
      matchPaths: ['/admin/pricing']
    },
    {
      id: 'about-us',
      label: 'About Us',
      icon: InformationCircleIcon,
      path: '/admin/about-us',
      matchPaths: ['/admin/about-us']
    }
  ];

  const isActive = (item) => {
    const pathname = location.pathname;
    return item.matchPaths.some(path => pathname === path);
  };

  const handleNavigation = (item) => {
    navigate(item.path);
  };

  return (
    <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white/70 backdrop-blur-xl border-r border-gray-200 transition-all duration-200 flex-shrink-0`}>
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
            const active = isActive(item);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-xl mb-1 transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900 ring-1 ring-gray-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={item.label}
              >
                <IconComponent className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;

