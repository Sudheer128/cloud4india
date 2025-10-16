import React from 'react'
import HeroSection from '../components/HeroSection'
import ComprehensiveSection from '../components/ComprehensiveSection'
import WhySection from '../components/WhySection'
import SolutionsSection from '../components/SolutionsSection'
import ProductsSection from '../components/ProductsSection'
// import InfrastructureSection from '../components/InfrastructureSection'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <ComprehensiveSection />
      <WhySection />
      <SolutionsSection />
      <ProductsSection />
      {/* <InfrastructureSection /> */}
    </div>
  )
}

export default Home
