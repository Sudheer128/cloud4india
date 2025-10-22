import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import ProductsAdmin from './pages/ProductsAdmin'
import UniversalSolutionPage from './pages/UniversalSolutionPage'
import UniversalProductPage from './pages/UniversalProductPage'
import Pricing from './pages/Pricing'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/products" element={<ProductsAdmin />} />
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
