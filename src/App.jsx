import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import FinancialServices from './pages/FinancialServices'
import Healthcare from './pages/Healthcare'
import Retail from './pages/Retail'
import ArtificialIntelligence from './pages/ArtificialIntelligence'
import Migration from './pages/Migration'
import Analytics from './pages/Analytics'
import ServerlessComputing from './pages/ServerlessComputing'
import Compute from './pages/Compute'
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
            <Route path="/solutions/financial-services" element={<FinancialServices />} />
            <Route path="/solutions/healthcare" element={<Healthcare />} />
            <Route path="/solutions/retail" element={<Retail />} />
            <Route path="/solutions/artificial-intelligence" element={<ArtificialIntelligence />} />
            <Route path="/solutions/migration" element={<Migration />} />
            <Route path="/solutions/analytics" element={<Analytics />} />
            <Route path="/solutions/serverless" element={<ServerlessComputing />} />
            <Route path="/solutions/compute" element={<Compute />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
