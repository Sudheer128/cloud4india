import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import ProductsAdmin from './pages/ProductsAdmin'
import ProductsMainAdmin from './pages/ProductsMainAdmin'
import SolutionsMainAdmin from './pages/SolutionsMainAdmin'
import UniversalSolutionPage from './pages/UniversalSolutionPage'
import UniversalProductPage from './pages/UniversalProductPage'
import MainProductsPage from './pages/MainProductsPage'
import MainSolutionsPage from './pages/MainSolutionsPage'
import Pricing from './pages/Pricing'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/products" element={<MainProductsPage />} />
            <Route path="/solutions" element={<MainSolutionsPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/products" element={<ProductsAdmin />} />
            <Route path="/admin/products-main" element={<ProductsMainAdmin />} />
            <Route path="/admin/solutions-main" element={<SolutionsMainAdmin />} />
            <Route path="/solutions/:solutionId" element={<UniversalSolutionPage />} />
            {/* Product pages - all products use dynamic CMS system */}
            <Route path="/products/:productId" element={<UniversalProductPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
