import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  Squares2X2Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PuzzlePieceIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  // Navigation visibility flags - set to true to show, false to hide
  const SHOW_MARKETPLACE = false
  const SHOW_MARKETPLACE_MAIN = false
  const SHOW_SOLUTIONS = false
  const SHOW_SOLUTIONS_MAIN = false

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
    },
    {
      id: 'contact-us',
      label: 'Contact Us',
      icon: EnvelopeIcon,
      path: '/admin/contact-us',
      matchPaths: ['/admin/contact-us']
    },
    {
      id: 'contact-dashboard',
      label: 'Contact (Advanced)',
      icon: ChartBarIcon,
      path: '/admin/contact-dashboard',
      matchPaths: ['/admin/contact-dashboard']
    },
    {
      id: 'contact-dashboard-simple',
      label: 'Contact (Simple)',
      icon: ChartBarIcon,
      path: '/admin/contact-dashboard-simple',
      matchPaths: ['/admin/contact-dashboard-simple']
    },
    {
      id: 'quotations',
      label: 'Quotations',
      icon: DocumentTextIcon,
      path: '/admin/quotations',
      matchPaths: ['/admin/quotations']
    },
    {
      id: 'integrity',
      label: 'Integrity',
      icon: ShieldCheckIcon,
      path: '/admin/integrity',
      matchPaths: ['/admin/integrity']
    }
  ].filter(item => {
    // Filter out marketplace items if they should be hidden
    if (item.id === 'marketplace' && !SHOW_MARKETPLACE) return false;
    if (item.id === 'marketplace-main' && !SHOW_MARKETPLACE_MAIN) return false;
    // Filter out solutions items if they should be hidden
    if (item.id === 'solutions' && !SHOW_SOLUTIONS) return false;
    if (item.id === 'solutions-main' && !SHOW_SOLUTIONS_MAIN) return false;
    return true;
  });

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
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-xl mb-1 transition-colors ${active
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

