const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = './cms.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`❌ Error connecting to database: ${err.message}`);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});

// All section items extracted from FinancialServices.jsx
const allSectionItems = {
  // Benefits section (section_type: 'benefits')
  benefits: [
    {
      item_type: 'benefit',
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption, multi-factor authentication, and compliance with global financial regulations.',
      icon: 'ShieldCheckIcon'
    },
    {
      item_type: 'benefit',
      title: 'Advanced Analytics',
      description: 'Real-time insights and predictive analytics to optimize operations, reduce risk, and drive informed decision-making.',
      icon: 'ChartBarIcon'
    },
    {
      item_type: 'benefit',
      title: 'Scalable Infrastructure',
      description: 'Auto-scaling infrastructure that grows with your business, ensuring optimal performance during peak times.',
      icon: 'CogIcon'
    },
    {
      item_type: 'benefit',
      title: '24/7 Support',
      description: 'Dedicated financial services support team with deep industry expertise and round-the-clock assistance.',
      icon: 'UsersIcon'
    },
    {
      item_type: 'benefit',
      title: 'Compliance Ready',
      description: 'Built-in compliance tools for GDPR, PCI DSS, SOX, and other regulatory requirements specific to financial services.',
      icon: 'LockClosedIcon'
    },
    {
      item_type: 'benefit',
      title: 'Cloud Native',
      description: 'Fully cloud-native architecture designed for modern financial applications with microservices and API-first approach.',
      icon: 'CloudIcon'
    }
  ],

  // Segments section (section_type: 'segments')
  segments: [
    {
      item_type: 'segment',
      title: 'Banking',
      description: 'Complete digital transformation for retail and commercial banking with core banking systems, regulatory compliance, and customer experience solutions.',
      icon: 'CurrencyDollarIcon',
      features: '["Core Banking Systems", "Digital Transformation", "Regulatory Compliance", "Mobile Banking", "API Integration", "Real-time Processing", "Fraud Detection"]',
      value: '500+',
      label: 'Institutions'
    },
    {
      item_type: 'segment',
      title: 'Capital Markets',
      description: 'Trading platforms, risk management, and real-time market data solutions.',
      icon: 'ChartPieIcon',
      features: '["Trading Platforms", "Risk Management", "Market Data"]',
      value: '200+',
      label: 'Firms'
    },
    {
      item_type: 'segment',
      title: 'Insurance',
      description: 'Policy management, claims processing, and actuarial analytics platforms.',
      icon: 'ShieldCheckIcon',
      features: '["Policy Management", "Claims Processing", "Analytics"]',
      value: '300+',
      label: 'Companies'
    },
    {
      item_type: 'segment',
      title: 'Payments',
      description: 'Payment processing, digital wallets, and cross-border transaction solutions with fraud detection and compliance.',
      icon: 'CogIcon',
      features: '["Payment Processing", "Digital Wallets", "Cross-border Solutions"]',
      value: '150+',
      label: 'Providers'
    }
  ],

  // Stats section (for the bottom stats)
  stats: [
    {
      item_type: 'stat',
      title: 'Banking Institutions',
      value: '500+',
      label: 'Institutions'
    },
    {
      item_type: 'stat',
      title: 'Capital Market Firms',
      value: '200+',
      label: 'Firms'
    },
    {
      item_type: 'stat',
      title: 'Insurance Companies',
      value: '300+',
      label: 'Companies'
    },
    {
      item_type: 'stat',
      title: 'Payment Providers',
      value: '150+',
      label: 'Providers'
    }
  ]
};

db.serialize(() => {
  db.get("SELECT id FROM solutions WHERE name LIKE '%Financial Services%'", (err, row) => {
    if (err) {
      console.error(`❌ Error finding Financial Services solution: ${err.message}`);
      db.close();
      return;
    }

    if (!row) {
      console.error('❌ Financial Services solution not found in the database. Please ensure it exists.');
      db.close();
      return;
    }

    const solutionId = row.id;
    console.log(`✅ Found Financial Services solution with ID: ${solutionId}`);

    // Get all sections for this solution
    db.all("SELECT id, section_type FROM solution_sections WHERE solution_id = ? ORDER BY order_index ASC", [solutionId], (err, sections) => {
      if (err) {
        console.error(`❌ Error getting sections: ${err.message}`);
        db.close();
        return;
      }

      console.log(`📋 Found ${sections.length} sections to populate`);

      let processedSections = 0;
      const totalSections = sections.length;

      sections.forEach(section => {
        console.log(`\n🔄 Processing section: ${section.section_type} (ID: ${section.id})`);

        // Clear existing items for this section
        db.run("DELETE FROM section_items WHERE section_id = ?", [section.id], function(err) {
          if (err) {
            console.error(`❌ Error clearing existing items for section ${section.id}: ${err.message}`);
            processedSections++;
            if (processedSections === totalSections) {
              console.log('\n🎉 Migration completed!');
              db.close();
            }
            return;
          }

          console.log(`🗑️ Cleared ${this.changes} existing items for section ${section.id}`);

          // Get items to insert based on section type
          let itemsToInsert = [];
          if (section.section_type === 'benefits') {
            itemsToInsert = allSectionItems.benefits;
          } else if (section.section_type === 'segments') {
            itemsToInsert = allSectionItems.segments;
          } else if (section.section_type === 'roi') {
            itemsToInsert = allSectionItems.stats;
          }

          if (itemsToInsert.length === 0) {
            console.log(`ℹ️ No items defined for section type: ${section.section_type}`);
            processedSections++;
            if (processedSections === totalSections) {
              console.log('\n🎉 Migration completed!');
              db.close();
            }
            return;
          }

          console.log(`📝 Inserting ${itemsToInsert.length} items for ${section.section_type} section...`);

          // Insert items
          const stmt = db.prepare(`INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

          let insertedCount = 0;
          itemsToInsert.forEach((item, index) => {
            stmt.run(
              section.id,
              item.item_type,
              item.title,
              item.description,
              item.icon || null,
              item.value || null,
              item.label || null,
              item.features || null,
              index,
              function(err) {
                if (err) {
                  console.error(`❌ Error inserting item ${index + 1}: ${err.message}`);
                } else {
                  console.log(`✅ Inserted item ${index + 1}/${itemsToInsert.length}: ${item.title}`);
                }
                insertedCount++;
                
                if (insertedCount === itemsToInsert.length) {
                  stmt.finalize();
                  processedSections++;
                  if (processedSections === totalSections) {
                    console.log('\n🎉 Migration completed!');
                    console.log('💡 All section items have been populated with real content from FinancialServices.jsx');
                    console.log('🚀 You can now test the admin interface to see all the detailed content!');
                    db.close();
                  }
                }
              }
            );
          });
        });
      });
    });
  });
});
