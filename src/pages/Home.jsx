import React from 'react'
import HeroSectionNew from '../components/HeroSectionNew'
import ComprehensiveSectionNew from '../components/ComprehensiveSectionNew'
import WhySectionNew from '../components/WhySectionNew'
import FeatureBannersSection from '../components/FeatureBannersSection'
import ProductsSectionNew from '../components/ProductsSectionNew'
import MarketplacesSectionNew from '../components/MarketplacesSectionNew'
import SolutionsSectionNew from '../components/SolutionsSectionNew'
// import InfrastructureSection from '../components/InfrastructureSection'

const Home = () => {
  return (
    <div>
      <HeroSectionNew />
      <ComprehensiveSectionNew />
      <WhySectionNew />
      <FeatureBannersSection />
      <ProductsSectionNew />
      <MarketplacesSectionNew />
      <SolutionsSectionNew />
      {/* <InfrastructureSection /> */}
    </div>
  )
}

export default Home
