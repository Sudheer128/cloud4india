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
import ProductsAdmin from './pages/ProductsAdmin'
import ProductsMainAdmin from './pages/ProductsMainAdmin'
import SolutionsAdmin from './pages/SolutionsAdmin'
import SolutionsMainAdmin from './pages/SolutionsMainAdmin'
import AboutUsAdmin from './pages/AboutUsAdmin'
import PricingAdmin from './pages/PricingAdmin'
import UniversalSolutionPage from './pages/UniversalSolutionPage'
import UniversalProductPage from './pages/UniversalProductPage'
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
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products-main" element={<ProductsMainAdmin />} />
            <Route path="solutions" element={<SolutionsAdmin />} />
            <Route path="solutions-main" element={<SolutionsMainAdmin />} />
            <Route path="pricing" element={<PricingAdmin />} />
            <Route path="about-us" element={<AboutUsAdmin />} />
          </Route>
          <Route path="/solutions/:solutionId" element={<UniversalSolutionPage />} />
          {/* Product pages - all products use dynamic CMS system */}
          <Route path="/products/:productId" element={<UniversalProductPage />} />
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
