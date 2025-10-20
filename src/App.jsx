import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import BasicCloudServers from './pages/BasicCloudServers'
import UniversalSolutionPage from './pages/UniversalSolutionPage'
import UniversalProductPage from './pages/UniversalProductPage'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/solutions/:solutionId" element={<UniversalSolutionPage />} />
            {/* Product pages */}
            <Route path="/products/basic-cloud-servers" element={<BasicCloudServers />} />
            <Route path="/products/:productId" element={<UniversalProductPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
