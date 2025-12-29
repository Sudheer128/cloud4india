import React from 'react'
import HeroSectionNew from '../components/HeroSectionNew'
import ClientLogosSection from '../components/ClientLogosSection'
import ComprehensiveSectionNew from '../components/ComprehensiveSectionNew'
import WhySectionNew from '../components/WhySectionNew'
import FeatureBannersSection from '../components/FeatureBannersSection'
import ProductsSectionNew from '../components/ProductsSectionNew'
import MarketplacesSectionNew from '../components/MarketplacesSectionNew'
import SolutionsSectionNew from '../components/SolutionsSectionNew'
// import InfrastructureSection from '../components/InfrastructureSection'

const Home = () => {
  // Section visibility flags - set to true to show, false to hide
  const SHOW_MARKETPLACES_SECTION = true
  const SHOW_SOLUTIONS_SECTION = true

  return (
    <div>
      <HeroSectionNew />
      <ClientLogosSection />
      <ComprehensiveSectionNew />
      <WhySectionNew />
      <FeatureBannersSection />
      <ProductsSectionNew />
      {SHOW_MARKETPLACES_SECTION && <MarketplacesSectionNew />}
      {SHOW_SOLUTIONS_SECTION && <SolutionsSectionNew />}
      {/* <InfrastructureSection /> */}
    </div>
  )
}

export default Home
