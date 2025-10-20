const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('🚀 Migrating Basic Cloud Servers sections and items...\n');

// First, get the Basic Cloud Servers product ID
db.get("SELECT id FROM products WHERE name = 'Basic Cloud Servers'", (err, product) => {
  if (err) {
    console.error('❌ Error finding Basic Cloud Servers:', err.message);
    return;
  }
  
  if (!product) {
    console.error('❌ Basic Cloud Servers product not found!');
    return;
  }
  
  const productId = product.id;
  console.log(`✅ Found Basic Cloud Servers with ID: ${productId}\n`);
  
  // Define sections based on the template
  const sections = [
    {
      title: 'Hero Section',
      description: 'Main hero section with title, description, and CTA buttons',
      section_type: 'hero',
      order_index: 0
    },
    {
      title: 'Key Features',
      description: 'Why Choose Basic Cloud Servers - 6 feature cards',
      section_type: 'features',
      order_index: 1
    },
    {
      title: 'Pricing',
      description: 'Pricing table with all Basic Cloud Server plans',
      section_type: 'pricing',
      order_index: 2
    },
    {
      title: 'Technical Specifications',
      description: 'Detailed technical information about infrastructure',
      section_type: 'specifications',
      order_index: 3
    },
    {
      title: 'Security & Compliance',
      description: 'Enterprise-grade security features',
      section_type: 'security',
      order_index: 4
    },
    {
      title: 'Support & SLA',
      description: 'Support features and service level agreement',
      section_type: 'support',
      order_index: 5
    },
    {
      title: 'Migration & Onboarding',
      description: '3-step migration and onboarding process',
      section_type: 'migration',
      order_index: 6
    },
    {
      title: 'Perfect For',
      description: 'Use cases and perfect match scenarios',
      section_type: 'use_cases',
      order_index: 7
    },
    {
      title: 'CTA Section',
      description: 'Final call-to-action section',
      section_type: 'cta',
      order_index: 8
    }
  ];
  
  // Insert sections
  const sectionStmt = db.prepare(`
    INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  
  let sectionIds = {};
  
  sections.forEach((section, index) => {
    sectionStmt.run(productId, section.title, section.description, section.section_type, section.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting section ${section.title}:`, err.message);
        return;
      }
      sectionIds[section.section_type] = this.lastID;
      console.log(`✅ Inserted section: ${section.title} (ID: ${this.lastID})`);
      
      // If this is the last section, start inserting items
      if (index === sections.length - 1) {
        sectionStmt.finalize();
        insertSectionItems(sectionIds);
      }
    });
  });
});

function insertSectionItems(sectionIds) {
  console.log('\n📝 Inserting section items...\n');
  
  // Key Features items (6 feature cards)
  const featuresItems = [
    {
      title: 'Balanced Performance',
      description: 'Optimal CPU and RAM ratio designed for general workloads, web applications, and development environments.',
      item_type: 'feature_card',
      icon: 'CpuChipIcon',
      order_index: 0
    },
    {
      title: 'Enterprise Security',
      description: 'Built-in security features with encryption, firewalls, and compliance with Indian data protection standards.',
      item_type: 'feature_card',
      icon: 'ShieldCheckIcon',
      order_index: 1
    },
    {
      title: 'Instant Deployment',
      description: 'Deploy your servers in seconds with our automated provisioning and configuration management.',
      item_type: 'feature_card',
      icon: 'ClockIcon',
      order_index: 2
    },
    {
      title: 'Cost Effective',
      description: 'Pay only for what you use with transparent pricing and no hidden costs. Perfect for startups and SMEs.',
      item_type: 'feature_card',
      icon: 'CurrencyDollarIcon',
      order_index: 3
    },
    {
      title: 'Scalable Resources',
      description: 'Easily scale up or down based on your needs with our flexible resource allocation system.',
      item_type: 'feature_card',
      icon: 'ChartBarIcon',
      order_index: 4
    },
    {
      title: 'Indian Data Centers',
      description: 'Hosted in secure Indian data centers ensuring low latency and compliance with local regulations.',
      item_type: 'feature_card',
      icon: 'GlobeAltIcon',
      order_index: 5
    }
  ];
  
  // Pricing items (6 pricing plans)
  const pricingItems = [
    {
      title: 'BP_1vC-1GB',
      description: 'Free Plan',
      content: JSON.stringify({
        specifications: ['1 vCPUs', '1 GB vRAM', 'NVMe Storage', 'Snapshot Options', 'Console Access'],
        features: ['Self Service Portal', 'Scheduled Backup & Restore Options', 'Dedicated Firewall & VPN with VPC', 'Private ISOLATED Network', 'Unlimited Data Transfer*'],
        price: 'Absolutely Free',
        buttonText: 'Order Now',
        buttonColor: 'green'
      }),
      item_type: 'pricing_plan',
      order_index: 0
    },
    {
      title: 'BP_2vC-4GB',
      description: 'Starter Plan',
      content: JSON.stringify({
        specifications: ['2 vCPUs', '4 GB vRAM', 'NVMe Storage', 'Snapshot Options', 'Console Access'],
        features: ['Self Service Portal', 'Scheduled Backup & Restore Options', 'Dedicated Firewall & VPN with VPC', 'Private ISOLATED Network', 'Unlimited Data Transfer*'],
        price: 'Rs. 2.0546/Hour',
        buttonText: 'Order Now',
        buttonColor: 'orange'
      }),
      item_type: 'pricing_plan',
      order_index: 1
    },
    {
      title: 'BP_4vC-8GB',
      description: 'Professional Plan',
      content: JSON.stringify({
        specifications: ['4 vCPUs', '8 GB vRAM', 'NVMe Storage', 'Snapshot Options', 'Console Access'],
        features: ['Self Service Portal', 'Scheduled Backup & Restore Options', 'Dedicated Firewall & VPN with VPC', 'Private ISOLATED Network', 'Unlimited Data Transfer*'],
        price: 'Rs. 4.1093/Hour',
        buttonText: 'Order Now',
        buttonColor: 'orange'
      }),
      item_type: 'pricing_plan',
      order_index: 2
    },
    {
      title: 'BP_8vC-16GB',
      description: 'Business Plan',
      content: JSON.stringify({
        specifications: ['8 vCPUs', '16 GB vRAM', 'NVMe Storage', 'Snapshot Options', 'Console Access'],
        features: ['Self Service Portal', 'Scheduled Backup & Restore Options', 'Dedicated Firewall & VPN with VPC', 'Private ISOLATED Network', 'Unlimited Data Transfer*'],
        price: 'Rs. 8.2186/Hour',
        buttonText: 'Order Now',
        buttonColor: 'orange'
      }),
      item_type: 'pricing_plan',
      order_index: 3
    },
    {
      title: 'BP_8vC-32GB',
      description: 'Enterprise Plan',
      content: JSON.stringify({
        specifications: ['8 vCPUs', '32 GB vRAM', 'NVMe Storage', 'Snapshot Options', 'Console Access'],
        features: ['Self Service Portal', 'Scheduled Backup & Restore Options', 'Dedicated Firewall & VPN with VPC', 'Private ISOLATED Network', 'Unlimited Data Transfer*'],
        price: 'Rs. 13.4645/Hour',
        buttonText: 'Order Now',
        buttonColor: 'orange'
      }),
      item_type: 'pricing_plan',
      order_index: 4
    },
    {
      title: 'BP_16vC-32GB',
      description: 'Premium Plan',
      content: JSON.stringify({
        specifications: ['16 vCPUs', '32 GB vRAM', 'NVMe Storage', 'Snapshot Options', 'Console Access'],
        features: ['Self Service Portal', 'Scheduled Backup & Restore Options', 'Dedicated Firewall & VPN with VPC', 'Private ISOLATED Network', 'Unlimited Data Transfer*'],
        price: 'Rs. 16.4372/Hour',
        buttonText: 'Order Now',
        buttonColor: 'orange'
      }),
      item_type: 'pricing_plan',
      order_index: 5
    }
  ];
  
  // Technical Specifications items (3 spec cards)
  const specsItems = [
    {
      title: 'CPU Performance',
      description: 'Intel Xeon processors with high-frequency cores and burstable performance',
      content: JSON.stringify({
        features: ['Intel Xeon processors', 'High-frequency cores', 'Burstable performance', 'CPU credits system']
      }),
      item_type: 'spec_card',
      icon: 'CpuChipIcon',
      order_index: 0
    },
    {
      title: 'Memory & Storage',
      description: 'DDR4 RAM technology with NVMe SSD storage and high IOPS performance',
      content: JSON.stringify({
        features: ['DDR4 RAM technology', 'NVMe SSD storage', 'High IOPS performance', 'Snapshot capabilities']
      }),
      item_type: 'spec_card',
      icon: 'CircleStackIcon',
      order_index: 1
    },
    {
      title: 'Network & Connectivity',
      description: 'High-speed network with low latency connections and private networking',
      content: JSON.stringify({
        features: ['High-speed network', 'Low latency connections', 'Private networking', 'Load balancer support']
      }),
      item_type: 'spec_card',
      icon: 'GlobeAltIcon',
      order_index: 2
    }
  ];
  
  // Security items (3 security features)
  const securityItems = [
    {
      title: 'Data Encryption',
      description: 'End-to-end encryption for data at rest and in transit using industry-standard AES-256 encryption.',
      item_type: 'security_feature',
      icon: 'ShieldCheckIcon',
      order_index: 0
    },
    {
      title: 'Firewall & VPN',
      description: 'Dedicated firewall protection and VPN access with VPC for secure network isolation.',
      item_type: 'security_feature',
      icon: 'ServerIcon',
      order_index: 1
    },
    {
      title: 'Compliance Standards',
      description: 'Compliant with Indian data protection regulations and international security standards.',
      item_type: 'security_feature',
      icon: 'ChartBarIcon',
      order_index: 2
    }
  ];
  
  // Support items (4 support features)
  const supportItems = [
    {
      title: '24/7 Support',
      description: 'Round-the-clock technical support via phone, email, and live chat.',
      item_type: 'support_feature',
      icon: 'ClockIcon',
      order_index: 0
    },
    {
      title: '99.9% Uptime',
      description: 'Guaranteed service availability with SLA-backed uptime commitment.',
      item_type: 'support_feature',
      icon: 'ChartBarIcon',
      order_index: 1
    },
    {
      title: 'Expert Team',
      description: 'Certified cloud engineers and DevOps specialists at your service.',
      item_type: 'support_feature',
      icon: 'UsersIcon',
      order_index: 2
    },
    {
      title: 'Quick Response',
      description: 'Rapid response times with priority support for critical issues.',
      item_type: 'support_feature',
      icon: 'CircleStackIcon',
      order_index: 3
    }
  ];
  
  // Migration steps (3 steps)
  const migrationItems = [
    {
      title: 'Assessment',
      description: 'Our experts analyze your current infrastructure and requirements to recommend the best configuration.',
      item_type: 'migration_step',
      order_index: 0
    },
    {
      title: 'Migration',
      description: 'Seamless migration of your applications and data with minimal downtime and zero data loss.',
      item_type: 'migration_step',
      order_index: 1
    },
    {
      title: 'Optimization',
      description: 'Continuous monitoring and optimization to ensure optimal performance and cost efficiency.',
      item_type: 'migration_step',
      order_index: 2
    }
  ];
  
  // Use cases (3 use case scenarios)
  const useCaseItems = [
    {
      title: 'Web Applications',
      description: 'E-commerce, Corporate Sites, APIs',
      content: JSON.stringify({
        benefits: ['High availability hosting', 'Auto-scaling for traffic spikes', 'SSL certificate support', 'CDN integration ready']
      }),
      item_type: 'use_case',
      icon: 'GlobeAltIcon',
      order_index: 0
    },
    {
      title: 'Development & Testing',
      description: 'Dev Environments, Staging, CI/CD',
      content: JSON.stringify({
        benefits: ['Isolated development environments', 'Quick deployment and rollback', 'Version control integration', 'Docker container support']
      }),
      item_type: 'use_case',
      icon: 'CpuChipIcon',
      order_index: 1
    },
    {
      title: 'Small Business',
      description: 'Startups, SMEs, Growing Companies',
      content: JSON.stringify({
        benefits: ['Cost-effective solutions', 'Easy scalability as you grow', '24/7 support included', 'No upfront investment']
      }),
      item_type: 'use_case',
      icon: 'UsersIcon',
      order_index: 2
    }
  ];
  
  // Insert all items
  const itemStmt = db.prepare(`
    INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  
  let totalItems = 0;
  let completedItems = 0;
  
  // Count total items
  totalItems = featuresItems.length + pricingItems.length + specsItems.length + 
              securityItems.length + supportItems.length + migrationItems.length + useCaseItems.length;
  
  // Insert features items
  featuresItems.forEach(item => {
    itemStmt.run(sectionIds.features, item.title, item.description, null, item.item_type, item.icon, item.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting feature item ${item.title}:`, err.message);
        return;
      }
      completedItems++;
      console.log(`✅ Inserted feature item: ${item.title}`);
      checkCompletion();
    });
  });
  
  // Insert pricing items
  pricingItems.forEach(item => {
    itemStmt.run(sectionIds.pricing, item.title, item.description, item.content, item.item_type, null, item.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting pricing item ${item.title}:`, err.message);
        return;
      }
      completedItems++;
      console.log(`✅ Inserted pricing item: ${item.title}`);
      checkCompletion();
    });
  });
  
  // Insert specs items
  specsItems.forEach(item => {
    itemStmt.run(sectionIds.specifications, item.title, item.description, item.content, item.item_type, item.icon, item.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting spec item ${item.title}:`, err.message);
        return;
      }
      completedItems++;
      console.log(`✅ Inserted spec item: ${item.title}`);
      checkCompletion();
    });
  });
  
  // Insert security items
  securityItems.forEach(item => {
    itemStmt.run(sectionIds.security, item.title, item.description, null, item.item_type, item.icon, item.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting security item ${item.title}:`, err.message);
        return;
      }
      completedItems++;
      console.log(`✅ Inserted security item: ${item.title}`);
      checkCompletion();
    });
  });
  
  // Insert support items
  supportItems.forEach(item => {
    itemStmt.run(sectionIds.support, item.title, item.description, null, item.item_type, item.icon, item.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting support item ${item.title}:`, err.message);
        return;
      }
      completedItems++;
      console.log(`✅ Inserted support item: ${item.title}`);
      checkCompletion();
    });
  });
  
  // Insert migration items
  migrationItems.forEach(item => {
    itemStmt.run(sectionIds.migration, item.title, item.description, null, item.item_type, null, item.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting migration item ${item.title}:`, err.message);
        return;
      }
      completedItems++;
      console.log(`✅ Inserted migration item: ${item.title}`);
      checkCompletion();
    });
  });
  
  // Insert use case items
  useCaseItems.forEach(item => {
    itemStmt.run(sectionIds.use_cases, item.title, item.description, item.content, item.item_type, item.icon, item.order_index, function(err) {
      if (err) {
        console.error(`❌ Error inserting use case item ${item.title}:`, err.message);
        return;
      }
      completedItems++;
      console.log(`✅ Inserted use case item: ${item.title}`);
      checkCompletion();
    });
  });
  
  function checkCompletion() {
    if (completedItems === totalItems) {
      itemStmt.finalize();
      console.log(`\n🎉 Migration completed! Inserted ${totalItems} items across 9 sections.`);
      
      // Show summary
      db.all(`
        SELECT ps.title as section_title, COUNT(pi.id) as item_count
        FROM product_sections ps
        LEFT JOIN product_items pi ON ps.id = pi.section_id
        WHERE ps.product_id = (SELECT id FROM products WHERE name = 'Basic Cloud Servers')
        GROUP BY ps.id, ps.title
        ORDER BY ps.order_index
      `, (err, summary) => {
        if (err) {
          console.error('Error getting summary:', err.message);
          return;
        }
        
        console.log('\n📊 Migration Summary:');
        console.table(summary);
        
        db.close();
      });
    }
  }
}


