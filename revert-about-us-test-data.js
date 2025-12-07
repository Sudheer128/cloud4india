#!/usr/bin/env node

/**
 * Revert script to restore original About Us content
 * Restores data to original default values from components
 */

const CMS_URL = process.env.CMS_URL || 'http://localhost:4002';
const BASE_URL = `${CMS_URL}/api`;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function updateEndpoint(url, data) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const responseData = await response.json().catch(() => ({}));
    
    if (response.status === 200) {
      return { success: true, data: responseData };
    } else {
      return { 
        success: false, 
        error: `Status ${response.status}: ${responseData.error || responseData.message || 'Unknown error'}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Network error'
    };
  }
}

async function revertData() {
  log('\n🔄 Reverting About Us Test Data\n', 'cyan');
  log(`Base URL: ${BASE_URL}\n`, 'blue');

  // 1. Revert Hero Section
  log('🎯 Reverting Hero Section...', 'yellow');
  const heroData = {
    badge_text: 'About Cloud 4 India',
    title: 'The Power of',
    highlighted_text: 'Next-generation',
    description: 'From small businesses to large enterprises, and from individual webmasters to online entrepreneurs, Cloud 4 India has been the trusted partner for cost-effective managed IT Apps. We specialise in empowering your online presence with reliable, tailored services designed to meet your unique needs.',
    button_text: 'Explore Our Services',
    button_link: '',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    stat_value: '14+',
    stat_label: 'Years Experience'
  };
  const heroResult = await updateEndpoint('/about/hero', heroData);
  if (heroResult.success) {
    log('✓ Hero section reverted', 'green');
  } else {
    log(`✗ Hero section revert failed: ${heroResult.error}`, 'red');
  }

  // 2. Revert Story Section
  log('\n📖 Reverting Story Section...', 'yellow');
  const storyData = {
    header_title: 'Our Story',
    header_description: 'A journey of innovation, trust, and excellence spanning over a decade',
    founding_year: '2010',
    story_items: JSON.stringify([
      'Founded in 2010, Cloud 4 India was established to address the growing demand for secure, reliable data centres and managed IT services.',
      'Over the past 14 years, we have become a trusted partner for organisations and webmasters, delivering dependable cloud and managed hosting Apps at competitive prices.',
      'With a commitment to innovation and customer satisfaction, we offer comprehensive managed IT services, catering to businesses of all sizes — from ambitious startups to established enterprises.'
    ]),
    image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=600&fit=crop',
    badge_value: '24H',
    badge_label: 'Support',
    top_badge_value: '1M+',
    top_badge_label: 'Happy Customers'
  };
  const storyResult = await updateEndpoint('/about/story', storyData);
  if (storyResult.success) {
    log('✓ Story section reverted', 'green');
  } else {
    log(`✗ Story section revert failed: ${storyResult.error}`, 'red');
  }

  // 3. Revert Legacy Section
  log('\n🏛️ Reverting Legacy Section...', 'yellow');
  const legacyData = {
    header_title: 'Our Legacy',
    header_description: 'With strategically located global data centres, we empower you to host your VPS exactly where it\'s needed most. Partner with a hosting provider that not only delivers excellence but also champions sustainability for a better future.'
  };
  const legacyResult = await updateEndpoint('/about/legacy', legacyData);
  if (legacyResult.success) {
    log('✓ Legacy section reverted', 'green');
  } else {
    log(`✗ Legacy section revert failed: ${legacyResult.error}`, 'red');
  }

  // 4. Revert Testimonials Section
  log('\n💬 Reverting Testimonials Section...', 'yellow');
  const testimonialsSectionData = {
    header_title: 'Hear from Our Satisfied Customers',
    header_description: 'See what our clients say about working with Cloud 4 India'
  };
  const testimonialsSectionResult = await updateEndpoint('/about/testimonials-section', testimonialsSectionData);
  if (testimonialsSectionResult.success) {
    log('✓ Testimonials section reverted', 'green');
  } else {
    log(`✗ Testimonials section revert failed: ${testimonialsSectionResult.error}`, 'red');
  }

  // 5. Revert Approach Section
  log('\n🎯 Reverting Approach Section...', 'yellow');
  const approachSectionData = {
    header_title: 'Our Approach',
    header_description: 'At Cloud 4 India, we are committed to providing secure, reliable, and customised data centre Apps designed to empower your business growth.',
    cta_button_text: 'Talk to a Specialist'
  };
  const approachSectionResult = await updateEndpoint('/about/approach-section', approachSectionData);
  if (approachSectionResult.success) {
    log('✓ Approach section reverted', 'green');
  } else {
    log(`✗ Approach section revert failed: ${approachSectionResult.error}`, 'red');
  }

  log('\n✅ Revert process completed!', 'green');
  log('\nNote: The test script created and then deleted test milestones, stats, testimonials, ratings, and approach items,', 'blue');
  log('so those are already cleaned up. Only the section headers were reverted.', 'blue');
  log('\n', 'reset');
}

// Run revert
revertData().catch(error => {
  log(`\n💥 Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

