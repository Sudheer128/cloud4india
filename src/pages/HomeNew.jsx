import React from 'react'
import HeroSectionNew from '../components/HeroSectionNew'
import ComprehensiveSectionNew from '../components/ComprehensiveSectionNew'
import WhySectionNew from '../components/WhySectionNew'
import MarketplacesSectionNew from '../components/MarketplacesSectionNew'

const HomeNew = () => {
  // Section visibility flags - set to true to show, false to hide
  const SHOW_MARKETPLACES_SECTION = false

  return (
    <div>
      <HeroSectionNew />
      <ComprehensiveSectionNew />
      <WhySectionNew />
      {SHOW_MARKETPLACES_SECTION && <MarketplacesSectionNew />}
    </div>
  )
}

export default HomeNew


