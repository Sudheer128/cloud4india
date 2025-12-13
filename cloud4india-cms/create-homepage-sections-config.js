const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('🏗️  Creating homepage sections configuration table...\n');

// Create table for homepage section configurations
db.run(`CREATE TABLE IF NOT EXISTS homepage_sections_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_name TEXT NOT NULL UNIQUE,
  heading TEXT NOT NULL,
  description TEXT,
  button_text TEXT,
  filter_text TEXT,
  search_placeholder TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('❌ Error creating table:', err.message);
    db.close();
    return;
  }
  
  console.log('✅ Table created successfully\n');
  
  // Insert default configurations
  const defaultConfigs = [
    {
      section_name: 'why',
      heading: 'Why Cloud4India?',
      description: 'Cloud4India is India\'s most comprehensive and broadly adopted cloud platform. Millions of customers—including the fastest-growing startups, largest enterprises, and leading government agencies—use Cloud4India to be more agile, lower costs, and innovate faster.',
      button_text: null,
      filter_text: null,
      search_placeholder: null
    },
    {
      section_name: 'products',
      heading: 'Explore our Products',
      description: null,
      button_text: 'View more Products',
      filter_text: 'Filter by category',
      search_placeholder: 'Search categories'
    },
    {
      section_name: 'marketplaces',
      heading: 'Explore our Apps',
      description: null,
      button_text: 'View more Apps',
      filter_text: 'Filter by category',
      search_placeholder: 'Search categories'
    },
    {
      section_name: 'solutions',
      heading: 'Explore our Solutions',
      description: null,
      button_text: 'View more Solutions',
      filter_text: 'Filter by category',
      search_placeholder: 'Search categories'
    }
  ];
  
  let inserted = 0;
  defaultConfigs.forEach((config, index) => {
    db.run(`
      INSERT OR IGNORE INTO homepage_sections_config (section_name, heading, description, button_text, filter_text, search_placeholder)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [config.section_name, config.heading, config.description, config.button_text, config.filter_text, config.search_placeholder], function(err) {
      if (err) {
        console.error(`❌ Error inserting ${config.section_name}:`, err.message);
      } else if (this.changes > 0) {
        console.log(`✅ Inserted config for: ${config.section_name}`);
      } else {
        console.log(`⏭️  Config already exists: ${config.section_name}`);
      }
      
      inserted++;
      if (inserted === defaultConfigs.length) {
        // Verify
        db.all('SELECT section_name, heading FROM homepage_sections_config ORDER BY id', [], (err, rows) => {
          if (!err) {
            console.log('\n📊 Final Configuration:');
            rows.forEach(r => console.log(`  - ${r.section_name}: "${r.heading}"`));
          }
          db.close();
        });
      }
    });
  });
});

