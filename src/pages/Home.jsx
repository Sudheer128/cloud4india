import React from 'react'
import HeroSectionNew from '../components/HeroSectionNew'
import ComprehensiveSectionNew from '../components/ComprehensiveSectionNew'
import WhySectionNew from '../components/WhySectionNew'
import FeatureBannersSection from '../components/FeatureBannersSection'
import SolutionsSectionNew from '../components/SolutionsSectionNew'
import ProductsSectionNew from '../components/ProductsSectionNew'
// import InfrastructureSection from '../components/InfrastructureSection'

const Home = () => {
  return (
    <div>
      <HeroSectionNew />
      <ComprehensiveSectionNew />
      <WhySectionNew />
      <FeatureBannersSection />
      <SolutionsSectionNew />
      <ProductsSectionNew />
      {/* <InfrastructureSection /> */}
    </div>
  )
}

export default Home
