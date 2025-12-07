const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Determine the correct database path based on where we're running from
let dbPath;
if (__dirname.includes('scripts')) {
  // Running from scripts directory, database is in cloud4india-cms
  dbPath = path.join(__dirname, '../cloud4india-cms/cms.db');
} else {
  // Running from cloud4india-cms directory
  dbPath = path.resolve('./cms.db');
}

// Use environment variable if provided (for migration runner)
if (process.env.DB_PATH) {
  dbPath = path.resolve(process.env.DB_PATH);
}

// Financial Services sections based on the existing React component
const financialServicesSections = [
  {
    section_type: 'hero',
    title: 'Transform Your Financial Future',
    content: 'Accelerate innovation, enhance security, and scale with confidence using Cloud4India\'s comprehensive financial services platform trusted by leading institutions worldwide.',
    order_index: 0
  },
  {
    section_type: 'benefits',
    title: 'Key Benefits for Financial Institutions',
    content: 'Enhanced Security & Compliance: Bank-grade security with SOC 2, PCI DSS, and ISO 27001 certifications. Real-time Fraud Detection: AI-powered fraud detection and prevention systems. Scalable Infrastructure: Auto-scaling capabilities to handle peak trading volumes. Regulatory Compliance: Built-in compliance tools for GDPR, SOX, and Basel III.',
    order_index: 1
  },
  {
    section_type: 'segments',
    title: 'Industry Segments We Serve',
    content: 'Retail Banking: Digital banking Apps, mobile apps, and customer portals. Investment Banking: High-frequency trading platforms and risk management systems. Insurance: Claims processing, underwriting automation, and customer management. Fintech: Payment processing, lending platforms, and digital wallets.',
    order_index: 2
  },
  {
    section_type: 'use_cases',
    title: 'Real-World Financial Use Cases',
    content: 'Digital Banking Transformation: Modernize legacy systems with cloud-native architecture. Risk Management: Real-time risk assessment and regulatory reporting. Payment Processing: Secure, scalable payment gateway Apps. Trading Platforms: Low-latency trading systems with 99.99% uptime.',
    order_index: 3
  },
  {
    section_type: 'technology',
    title: 'Advanced Financial Technology Stack',
    content: 'Blockchain Integration: Secure transaction processing and smart contracts. AI & Machine Learning: Predictive analytics and automated decision making. API-First Architecture: Seamless integration with existing financial systems. Microservices: Modular, scalable application architecture.',
    order_index: 4
  },
  {
    section_type: 'success_story',
    title: 'Customer Success Stories',
    content: 'Leading banks have reduced operational costs by 40% and improved customer satisfaction by 60% using our platform. Case studies include major implementations at HSBC, Goldman Sachs, and JP Morgan.',
    order_index: 5
  },
  {
    section_type: 'stats',
    title: 'Financial Services Statistics',
    content: '99.99% Uptime SLA, $2.5T+ Transactions Processed, 500+ Financial Institutions Trust Us, 40% Average Cost Reduction, 60% Faster Time to Market, 24/7 Global Support Coverage.',
    order_index: 6
  },
  {
    section_type: 'implementation',
    title: 'Implementation Timeline',
    content: 'Week 1-2: Assessment and Planning. Week 3-4: Infrastructure Setup. Week 5-8: Application Migration. Week 9-10: Testing and Validation. Week 11-12: Go-Live and Support.',
    order_index: 7
  },
  {
    section_type: 'resources',
    title: 'Resources and Support',
    content: 'Comprehensive documentation, 24/7 technical support, dedicated customer success manager, training programs, and certification courses available.',
    order_index: 8
  },
  {
    section_type: 'cta',
    title: 'Ready to Transform Your Financial Services?',
    content: 'Contact our financial services specialists today to discuss your specific requirements and get a customized App proposal.',
    order_index: 9
  }
];

async function migrateFinancialServicesSections() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to the SQLite database.');
    });

    // First, find the Financial Services marketplace ID
    db.get("SELECT id FROM marketplaces WHERE name = 'Financial Services' OR name = 'Financial services' OR name LIKE '%Financial%'", (err, marketplace) => {
      if (err) {
        console.error('Error finding Financial Services marketplace:', err.message);
        reject(err);
        return;
      }

      if (!marketplace) {
        console.error('Financial Services marketplace not found in database');
        reject(new Error('Financial Services marketplace not found'));
        return;
      }

      console.log(`Found Financial Services marketplace with ID: ${marketplace.id}`);

      // Check if sections already exist
      db.get("SELECT COUNT(*) as count FROM marketplace_sections WHERE marketplace_id = ?", [marketplace.id], (err, result) => {
        if (err) {
          console.error('Error checking existing sections:', err.message);
          reject(err);
          return;
        }

        if (result.count > 0) {
          console.log(`Financial Services already has ${result.count} sections. Skipping migration.`);
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
            } else {
              console.log('Database connection closed.');
            }
            resolve();
          });
          return;
        }

        // Insert sections
        let completed = 0;
        const total = financialServicesSections.length;

        console.log(`Inserting ${total} sections for Financial Services...`);

        financialServicesSections.forEach((section, index) => {
          db.run(
            `INSERT INTO marketplace_sections (marketplace_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`,
            [marketplace.id, section.section_type, section.title, section.content, section.order_index],
            function(err) {
              if (err) {
                console.error(`Error inserting section ${index + 1}:`, err.message);
                reject(err);
                return;
              }

              completed++;
              console.log(`✓ Inserted section ${completed}/${total}: ${section.title}`);

              if (completed === total) {
                console.log('✅ All Financial Services sections migrated successfully!');
                db.close((err) => {
                  if (err) {
                    console.error('Error closing database:', err.message);
                  } else {
                    console.log('Database connection closed.');
                  }
                  resolve();
                });
              }
            }
          );
        });
      });
    });
  });
}

// Run the migration
if (require.main === module) {
  migrateFinancialServicesSections()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateFinancialServicesSections };