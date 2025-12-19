import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import AdminSidebar from './AdminSidebar';
import ErrorBoundary from './ErrorBoundary';

const UnifiedAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/admin':
        return 'Home Page Management';
      case '/admin/marketplace':
        return 'Marketplace Management';
      case '/admin/marketplace-main':
        return 'Marketplace Main Page';
      case '/admin/products':
        return 'Products Management';
      case '/admin/products-main':
        return 'Products Main Page';
      case '/admin/pricing':
        return 'Pricing Management';
      case '/admin/about-us':
        return 'About Us Management';
      case '/admin/contact-us':
        return 'Contact Us Management';
      case '/admin/contact-dashboard':
        return 'Contact Dashboard';
      default:
        return 'Admin Panel';
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex text-gray-900 font-inter">
      {/* Unified Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/60 backdrop-blur-xl border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
              {getTitle()}
            </h2>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAdminLayout;

