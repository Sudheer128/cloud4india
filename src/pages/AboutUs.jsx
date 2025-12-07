import React, { useEffect } from 'react'
import AboutHeroSection from '../components/AboutHeroSection'
import MissionVisionSection from '../components/MissionVisionSection'
import OurStorySection from '../components/OurStorySection'
import OurLegacySection from '../components/OurLegacySection'
import CoreValuesSection from '../components/CoreValuesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import OurApproachSection from '../components/OurApproachSection'

const AboutUs = () => {
  // Scroll to top on page load/reload
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <AboutHeroSection />
      <MissionVisionSection />
      <OurStorySection />
      <CoreValuesSection />
      <OurLegacySection />
      <TestimonialsSection />
      <OurApproachSection />
    </div>
  )
}

export default AboutUs

