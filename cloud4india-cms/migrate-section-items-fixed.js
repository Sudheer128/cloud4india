const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

console.log('🚀 Migrating section items with dynamic section lookup...');

// Function to get section ID by type
const getSectionIdByType = (sectionType) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM solution_sections WHERE section_type = ? ORDER BY id DESC LIMIT 1',
      [sectionType],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(row.id);
        } else {
          reject(new Error(`Section type '${sectionType}' not found`));
        }
      }
    );
  });
};

// Function to insert section items
const insertSectionItems = async (sectionType, items) => {
  try {
    const sectionId = await getSectionIdByType(sectionType);
    console.log(`📍 Found section '${sectionType}' with ID: ${sectionId}`);
    
    for (const item of items) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [sectionId, item.item_type, item.title, item.description, item.icon, item.value, item.label, item.features, item.order_index],
          function(err) {
            if (err) {
              reject(err);
            } else {
              console.log(`✅ Added ${item.item_type}: ${item.title}`);
              resolve();
            }
          }
        );
      });
    }
  } catch (error) {
    console.error(`❌ Error processing section '${sectionType}':`, error.message);
  }
};

// Main migration function
const runMigration = async () => {
  try {
    // HSBC Success Story metrics (for success_story section)
    const hsbcMetrics = [
      {
        item_type: 'metric',
        title: 'Faster Product Delivery',
        description: 'Accelerated development cycles and faster time-to-market',
        icon: 'RocketLaunchIcon',
        value: '40%',
        label: 'Faster Product Delivery',
        order_index: 0
      },
      {
        item_type: 'metric',
        title: 'Uptime Achieved',
        description: 'Reliable platform performance with minimal downtime',
        icon: 'ChartBarIcon',
        value: '99.9%',
        label: 'Uptime Achieved',
        order_index: 1
      },
      {
        item_type: 'metric',
        title: 'Security Compliance',
        description: 'Full compliance with financial industry security standards',
        icon: 'ShieldCheckIcon',
        value: '100%',
        label: 'Security Compliance',
        order_index: 2
      },
      {
        item_type: 'metric',
        title: 'Institutions Served',
        description: 'Number of financial institutions using our platform',
        icon: 'BuildingOfficeIcon',
        value: '500+',
        label: 'Institutions Served',
        order_index: 3
      }
    ];

    // Implementation Journey timeline phases (for implementation section)
    const journeyPhases = [
      {
        item_type: 'timeline_phase',
        title: 'Assessment & Planning',
        description: 'Comprehensive assessment of your current financial infrastructure, compliance requirements, and operational workflows. We analyze your existing systems, identify opportunities for optimization, and create a detailed roadmap for your digital transformation.',
        icon: 'LightBulbIcon',
        value: '2-4 weeks',
        label: 'Duration',
        features: '["System analysis", "Compliance review", "Roadmap creation", "Stakeholder alignment"]',
        order_index: 0
      },
      {
        item_type: 'timeline_phase',
        title: 'System Design & Integration',
        description: 'Architectural design and system integration planning with focus on scalability, security, and compliance. We design custom solutions tailored to your specific financial services requirements and integrate with your existing infrastructure.',
        icon: 'CogIcon',
        value: '4-8 weeks',
        label: 'Duration',
        features: '["Architecture design", "Security planning", "Integration mapping", "Compliance framework"]',
        order_index: 1
      },
      {
        item_type: 'timeline_phase',
        title: 'Implementation & Testing',
        description: 'Phased implementation with continuous testing, validation, and optimization throughout the process. We ensure minimal disruption to your operations while delivering a robust, scalable financial solution.',
        icon: 'RocketLaunchIcon',
        value: '8-16 weeks',
        label: 'Duration',
        features: '["Phased deployment", "Continuous testing", "Performance optimization", "User training"]',
        order_index: 2
      },
      {
        item_type: 'timeline_phase',
        title: 'Go-Live & Support',
        description: 'Smooth transition to production with 24/7 financial services support, training, and ongoing optimization services. Our dedicated team ensures your success with continuous monitoring and improvement.',
        icon: 'HandRaisedIcon',
        value: 'Ongoing',
        label: 'Duration',
        features: '["24/7 support", "Performance monitoring", "Continuous optimization", "Training & documentation"]',
        order_index: 3
      }
    ];

    // Advanced Technology Solutions content (for technology section)
    const techSolutionsItems = [
      {
        item_type: 'ai_ml_section',
        title: 'AI & Machine Learning for Financial Services',
        description: 'Transform your financial operations with AI-powered solutions for fraud detection, risk assessment, algorithmic trading, and personalized financial recommendations. Our ML platform is designed to meet the unique requirements of financial institutions.',
        icon: 'CpuChipIcon',
        value: 'Explore AI Solutions',
        label: 'AI Solutions',
        features: '["Advanced fraud detection and prevention", "Real-time risk assessment and monitoring", "Algorithmic trading and portfolio optimization", "Personalized financial recommendations"]',
        order_index: 0
      },
      {
        item_type: 'analytics_card',
        title: 'AI-Powered Financial Analytics',
        description: 'Advanced machine learning models trained specifically for financial data patterns and risk assessment requirements.',
        icon: 'ChartBarIcon',
        value: 'Analytics Platform',
        label: 'Analytics',
        features: '["Real-time data processing", "Predictive analytics", "Risk modeling", "Compliance monitoring"]',
        order_index: 1
      }
    ];

    // Real-World Use Cases content (for use_cases section)
    const useCasesItems = [
      {
        item_type: 'use_case_card',
        title: 'Digital Banking Platform',
        description: 'Complete digital transformation for retail banking with mobile-first design, real-time processing, and personalized customer experiences.',
        icon: 'BanknotesIcon',
        value: 'Mobile Banking • Real-time • Personalized',
        label: 'Digital Banking',
        features: '["Mobile-first design", "Real-time processing", "Personalized experiences", "24/7 availability"]',
        order_index: 0
      },
      {
        item_type: 'use_case_card',
        title: 'Advanced Risk Management',
        description: 'AI-powered risk assessment and fraud detection systems that provide real-time monitoring and automated decision-making capabilities.',
        icon: 'ShieldCheckIcon',
        value: 'AI-powered • Real-time • Automated',
        label: 'Risk Management',
        features: '["AI-powered assessment", "Real-time monitoring", "Automated decisions", "Fraud detection"]',
        order_index: 1
      },
      {
        item_type: 'use_case_card',
        title: 'Payment Processing Platform',
        description: 'High-performance payment processing with support for multiple currencies, payment methods, and cross-border transactions.',
        icon: 'CreditCardIcon',
        value: 'Multi-currency • Cross-border • High-performance',
        label: 'Payment Processing',
        features: '["Multi-currency support", "Cross-border transactions", "High-performance", "Multiple payment methods"]',
        order_index: 2
      }
    ];

    // Resources & Documentation content (for resources section)
    const resourcesItems = [
      {
        item_type: 'featured_resource',
        title: 'Financial Services Implementation Guide',
        description: 'Our comprehensive 150-page guide covers everything you need to know about implementing Cloud4India for financial services, including compliance, security best practices, and real-world case studies.',
        icon: 'DocumentTextIcon',
        value: 'Download PDF Guide',
        label: 'Featured Resource',
        features: '["Compliance checklist", "Financial workflow templates", "Security configuration guide", "Integration best practices"]',
        order_index: 0
      },
      {
        item_type: 'resource_category',
        title: 'Video Learning Center',
        description: 'Comprehensive video library with 50+ tutorials covering financial services implementation, compliance workflows, and advanced features.',
        icon: 'PlayIcon',
        value: '50+ Videos • 12+ Hours Content',
        label: 'Browse Videos',
        features: '["Implementation tutorials", "Compliance workflows", "Advanced features", "Best practices"]',
        order_index: 1
      },
      {
        item_type: 'resource_category',
        title: 'API Documentation',
        description: 'Complete API reference with interactive examples, SDKs, and integration guides for building custom financial applications.',
        icon: 'CodeBracketIcon',
        value: 'Complete API Reference',
        label: 'View Docs',
        features: '["Interactive examples", "SDKs", "Integration guides", "Custom applications"]',
        order_index: 2
      },
      {
        item_type: 'resource_category',
        title: 'Community Forum',
        description: 'Connect with other financial services professionals, share best practices, and get expert support from our community.',
        icon: 'UsersIcon',
        value: 'Expert Community',
        label: 'Join Forum',
        features: '["Professional network", "Best practices", "Expert support", "Knowledge sharing"]',
        order_index: 3
      }
    ];

    // Insert all section items
    console.log('\n📝 Inserting HSBC Success Story metrics...');
    await insertSectionItems('success_story', hsbcMetrics);

    console.log('\n📝 Inserting Implementation Journey phases...');
    await insertSectionItems('implementation', journeyPhases);

    console.log('\n📝 Inserting Technology Solutions items...');
    await insertSectionItems('technology', techSolutionsItems);

    console.log('\n📝 Inserting Use Cases items...');
    await insertSectionItems('use_cases', useCasesItems);

    console.log('\n📝 Inserting Resources & Documentation items...');
    await insertSectionItems('resources', resourcesItems);

    console.log('\n🎉 All section items migrated successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    db.close();
  }
};

// Run the migration
runMigration();
