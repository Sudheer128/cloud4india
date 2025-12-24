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
  // Section visibility flags - set to true to show, false to hide
  const SHOW_MARKETPLACES_SECTION = false

  return (
    <div>
      <HeroSectionNew />
      <ComprehensiveSectionNew />
      <WhySectionNew />
      <FeatureBannersSection />
      <ProductsSectionNew />
      {SHOW_MARKETPLACES_SECTION && <MarketplacesSectionNew />}
      <SolutionsSectionNew />
      {/* <InfrastructureSection /> */}
    </div>
  )
}

export default Home
