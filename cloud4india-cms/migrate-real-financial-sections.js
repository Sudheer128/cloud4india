const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path (in CMS directory)
const dbPath = './cms.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`❌ Error connecting to database: ${err.message}`);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});

// Real Financial Services sections from the hardcoded page
const realFinancialServicesSections = [
  {
    section_type: 'hero',
    title: 'Transform Your Financial Future',
    content: 'Accelerate innovation, enhance security, and scale with confidence using Cloud4India\'s comprehensive financial services platform trusted by leading institutions worldwide.',
  },
  {
    section_type: 'benefits',
    title: 'Why Choose Cloud4India for Financial Services?',
    content: 'Built specifically for financial institutions, our platform delivers the security, compliance, and scalability you need to thrive in today\'s digital economy.',
  },
  {
    section_type: 'segments',
    title: 'Serving Every Financial Segment',
    content: 'From traditional banking to modern fintech, we provide specialized Apps tailored to your industry\'s unique requirements.',
  },
  {
    section_type: 'success_story',
    title: 'HSBC\'s Digital Transformation Journey with Cloud4India',
    content: 'HSBC Wealth and Personal Banking built a cloud-first engineering platform on Cloud4India, achieving unprecedented agility and innovation at scale. The transformation enabled them to deliver new financial products 40% faster while maintaining enterprise-grade security.',
  },
  {
    section_type: 'technology',
    title: 'Advanced Technology Apps',
    content: 'Leverage cutting-edge technologies designed specifically for financial services to drive innovation and competitive advantage.',
  },
  {
    section_type: 'use_cases',
    title: 'Real-World Use Cases & Apps',
    content: 'Discover how leading financial institutions are leveraging Cloud4India to solve complex business challenges and drive innovation.',
  },
  {
    section_type: 'roi',
    title: 'Measurable Business Impact',
    content: 'See the tangible results our financial services customers achieve with Cloud4India\'s comprehensive platform.',
  },
  {
    section_type: 'implementation',
    title: 'Your Implementation Journey',
    content: 'A structured approach to digital transformation with dedicated support at every step of your Cloud4India journey.',
  },
  {
    section_type: 'resources',
    title: 'Resources & Documentation',
    content: 'Access comprehensive resources, guides, and documentation to help you maximize the value of your Cloud4India financial services platform.',
  },
  {
    section_type: 'cta',
    title: 'Ready to Transform Your Financial Services?',
    content: 'Join thousands of financial institutions already leveraging Cloud4India\'s secure, scalable, and innovative platform to drive digital transformation.',
  },
];

db.serialize(() => {
  db.get("SELECT id FROM marketplaces WHERE name LIKE '%Financial%'", (err, row) => {
    if (err) {
      console.error(`❌ Error finding Financial Services marketplace: ${err.message}`);
      db.close();
      return;
    }

    if (!row) {
      console.error('❌ Financial Services marketplace not found in the database. Please ensure it exists.');
      db.close();
      return;
    }

    const marketplaceId = row.id;
    console.log(`✅ Found Financial Services marketplace with ID: ${marketplaceId}`);

    // First, delete all existing sections for this marketplace
    db.run("DELETE FROM marketplace_sections WHERE marketplace_id = ?", [marketplaceId], function(err) {
      if (err) {
        console.error(`❌ Error deleting existing sections: ${err.message}`);
        db.close();
        return;
      }

      console.log(`🗑️ Deleted ${this.changes} existing sections for Financial Services`);

      // Now insert the real sections
      console.log(`🚀 Inserting ${realFinancialServicesSections.length} real sections for Financial Services...`);
      const stmt = db.prepare(`INSERT INTO marketplace_sections (marketplace_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`);

      realFinancialServicesSections.forEach((section, index) => {
        stmt.run(marketplaceId, section.section_type, section.title, section.content, index, function(err) {
          if (err) {
            console.error(`❌ Error inserting section ${index + 1}: ${err.message}`);
          } else {
            console.log(`✅ Inserted section ${index + 1}/${realFinancialServicesSections.length}: ${section.title}`);
          }
        });
      });

      stmt.finalize(() => {
        console.log('🎉 All real Financial Services sections migrated successfully!');
        console.log('💡 Now the admin panel Page Sections will show the actual page content.');
        db.close();
      });
    });
  });
});
