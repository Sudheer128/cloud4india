import React from 'react'
import HeroSectionNew from '../components/HeroSectionNew'
import ClientLogosSection from '../components/ClientLogosSection'
import ComprehensiveSectionNew from '../components/ComprehensiveSectionNew'
import WhySectionNew from '../components/WhySectionNew'
import FeatureBannersSection from '../components/FeatureBannersSection'
import ProductsSectionNew from '../components/ProductsSectionNew'
import MarketplacesSectionNew from '../components/MarketplacesSectionNew'
import SolutionsSectionNew from '../components/SolutionsSectionNew'
import LoadingSpinner from '../components/LoadingSpinner'
import { useGlobalFeatureVisibility } from '../hooks/useGlobalFeatureVisibility'
// import InfrastructureSection from '../components/InfrastructureSection'

const Home = () => {
  // Fetch global feature visibility settings from database
  const { features, loading } = useGlobalFeatureVisibility();

  // While loading, show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Feature visibility flags - now from database instead of hardcoded
  const SHOW_PRODUCTS = features.products
  const SHOW_MARKETPLACE = features.marketplace
  const SHOW_SOLUTIONS = features.solutions

  return (
    <div>
      <HeroSectionNew />
      <ClientLogosSection />
      <ComprehensiveSectionNew />
      <WhySectionNew />
      <FeatureBannersSection />
      {SHOW_PRODUCTS && <ProductsSectionNew />}
      {SHOW_MARKETPLACE && <MarketplacesSectionNew />}
      {SHOW_SOLUTIONS && <SolutionsSectionNew />}
      {/* <InfrastructureSection /> */}
    </div>
  )
}

export default Home
