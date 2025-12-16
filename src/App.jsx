import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import HomeNew from './pages/HomeNew'
import AboutUs from './pages/AboutUs'
import Login from './pages/Login'
import UnifiedAdminLayout from './components/UnifiedAdminLayout'
import AdminPanel from './pages/AdminPanel'
import MarketplacesAdmin from './pages/MarketplacesAdmin'
import MarketplacesAdminNew from './pages/MarketplacesAdminNew'
import MarketplacesMainAdmin from './pages/MarketplacesMainAdmin'
import ProductsAdmin from './pages/ProductsAdmin'
import ProductsAdminNew from './pages/ProductsAdminNew'
import ProductsMainAdmin from './pages/ProductsMainAdmin'
import SolutionsAdmin from './pages/SolutionsAdmin'
import SolutionsAdminNew from './pages/SolutionsAdminNew'
import SolutionsMainAdmin from './pages/SolutionsMainAdmin'
import AboutUsAdmin from './pages/AboutUsAdmin'
import PricingAdmin from './pages/PricingAdmin'
import IntegrityAdmin from './pages/IntegrityAdmin'
import IntegrityPage from './pages/IntegrityPage'
import UniversalMarketplacePage from './pages/UniversalMarketplacePage'
import UniversalProductPage from './pages/UniversalProductPage'
import UniversalSolutionPage from './pages/UniversalSolutionPage'
import MainMarketplacesPage from './pages/MainMarketplacesPage'
import MainProductsPage from './pages/MainProductsPage'
import MainSolutionsPage from './pages/MainSolutionsPage'
import Pricing from './pages/Pricing'
import Footer from './components/Footer'

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';
  const showHeaderFooter = !isAdminRoute && !isLoginRoute;

  return (
    <div className="min-h-screen bg-white">
      {showHeaderFooter && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home-new" element={<HomeNew />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/integrity/:slug" element={<IntegrityPage />} />
          <Route path="/marketplace" element={<MainMarketplacesPage />} />
          <Route path="/products" element={<MainProductsPage />} />
          <Route path="/solutions" element={<MainSolutionsPage />} />
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          {/* Admin routes with unified layout - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <UnifiedAdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminPanel />} />
            <Route path="marketplace" element={<MarketplacesAdmin />} />
            <Route path="marketplaces-new/:marketplaceId" element={<MarketplacesAdminNew />} />
            <Route path="marketplace-main" element={<MarketplacesMainAdmin />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products-new/:productId" element={<ProductsAdminNew />} />
            <Route path="products-main" element={<ProductsMainAdmin />} />
            <Route path="solutions" element={<SolutionsAdmin />} />
            <Route path="solutions-new/:solutionId" element={<SolutionsAdminNew />} />
            <Route path="solutions-main" element={<SolutionsMainAdmin />} />
            <Route path="pricing" element={<PricingAdmin />} />
            <Route path="about-us" element={<AboutUsAdmin />} />
            <Route path="integrity" element={<IntegrityAdmin />} />
          </Route>
          <Route path="/marketplace/:appName" element={<UniversalMarketplacePage />} />
          <Route path="/products/:productId" element={<UniversalProductPage />} />
          <Route path="/solutions/:solutionName" element={<UniversalSolutionPage />} />
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}

export default App
