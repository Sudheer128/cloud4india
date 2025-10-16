const path = require('path');
const { spawn } = require('child_process');

// Check if we're running from the main project directory
const isMainProject = __dirname.includes('scripts');

if (isMainProject) {
  // If running from main project, execute the script from CMS directory
  console.log('Switching to CMS directory to run migration...');
  
  const cmsDir = path.join(__dirname, '../cloud4india-cms');
  const scriptPath = path.join(__dirname, 'migrate-financial-services-sections.js');
  
  // Copy this script to CMS directory and run it there
  const fs = require('fs');
  const cmsScriptPath = path.join(cmsDir, 'migrate-financial-services.js');
  
  // Create the CMS version of the script
  const cmsScript = `const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path (in CMS directory)
const dbPath = './cms.db';

${fs.readFileSync(__filename, 'utf8').split('// Financial Services sections')[1]}`;
  
  fs.writeFileSync(cmsScriptPath, cmsScript);
  
  // Run the script from CMS directory
  const child = spawn('node', ['migrate-financial-services.js'], {
    cwd: cmsDir,
    stdio: 'inherit'
  });
  
  child.on('close', (code) => {
    // Clean up the temporary script
    fs.unlinkSync(cmsScriptPath);
    process.exit(code);
  });
  
  return;
}

const sqlite3 = require('sqlite3').verbose();

// Database path (when running from CMS directory)
const dbPath = './cms.db';

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
    content: 'Retail Banking: Digital banking solutions, mobile apps, and customer portals. Investment Banking: High-frequency trading platforms and risk management systems. Insurance: Claims processing, underwriting automation, and customer management. Fintech: Payment processing, lending platforms, and digital wallets.',
    order_index: 2
  },
  {
    section_type: 'use_cases',
    title: 'Real-World Financial Use Cases',
    content: 'Digital Banking Transformation: Modernize legacy systems with cloud-native architecture. Risk Management: Real-time risk assessment and regulatory reporting. Payment Processing: Secure, scalable payment gateway solutions. Trading Platforms: Low-latency trading systems with 99.99% uptime.',
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
    content: 'Contact our financial services specialists today to discuss your specific requirements and get a customized solution proposal.',
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

    // First, find the Financial Services solution ID
    db.get("SELECT id FROM solutions WHERE name = 'Financial services' OR name LIKE '%Financial%'", (err, solution) => {
      if (err) {
        console.error('Error finding Financial Services solution:', err.message);
        reject(err);
        return;
      }

      if (!solution) {
        console.error('Financial Services solution not found in database');
        reject(new Error('Financial Services solution not found'));
        return;
      }

      console.log(`Found Financial Services solution with ID: ${solution.id}`);

      // Check if sections already exist
      db.get("SELECT COUNT(*) as count FROM solution_sections WHERE solution_id = ?", [solution.id], (err, result) => {
        if (err) {
          console.error('Error checking existing sections:', err.message);
          reject(err);
          return;
        }

        if (result.count > 0) {
          console.log(`Financial Services already has ${result.count} sections. Skipping migration.`);
          resolve();
          return;
        }

        // Insert sections
        let completed = 0;
        const total = financialServicesSections.length;

        console.log(`Inserting ${total} sections for Financial Services...`);

        financialServicesSections.forEach((section, index) => {
          db.run(
            `INSERT INTO solution_sections (solution_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`,
            [solution.id, section.section_type, section.title, section.content, section.order_index],
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
