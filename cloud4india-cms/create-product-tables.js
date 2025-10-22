const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('🚀 Creating Product CMS Tables...\n');

// Create product_sections table
db.run(`
  CREATE TABLE IF NOT EXISTS product_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    section_type TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('❌ Error creating product_sections:', err.message);
    return;
  }
  console.log('✅ Created product_sections table');
});

// Create product_items table
db.run(`
  CREATE TABLE IF NOT EXISTS product_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    item_type TEXT NOT NULL,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES product_sections (id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('❌ Error creating product_items:', err.message);
    return;
  }
  console.log('✅ Created product_items table');
});

// Add gradient fields to products table (if not exists)
db.run(`
  ALTER TABLE products ADD COLUMN gradient_start TEXT DEFAULT 'blue'
`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('❌ Error adding gradient_start:', err.message);
  } else {
    console.log('✅ Added gradient_start to products table');
  }
});

db.run(`
  ALTER TABLE products ADD COLUMN gradient_end TEXT DEFAULT 'blue-100'
`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('❌ Error adding gradient_end:', err.message);
  } else {
    console.log('✅ Added gradient_end to products table');
  }
});

// Add visibility field to products table
db.run(`
  ALTER TABLE products ADD COLUMN is_visible INTEGER DEFAULT 1
`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('❌ Error adding is_visible:', err.message);
  } else {
    console.log('✅ Added is_visible to products table');
  }
});

// Add route field to products table
db.run(`
  ALTER TABLE products ADD COLUMN route TEXT
`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('❌ Error adding route:', err.message);
  } else {
    console.log('✅ Added route to products table');
  }
});

// Verify tables were created
setTimeout(() => {
  console.log('\n📋 Verifying new tables...');
  
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'product_%'", (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    
    console.log('Product tables created:');
    console.table(rows);
    
    // Show product_sections structure
    db.all("PRAGMA table_info(product_sections)", (err, sectionInfo) => {
      if (err) {
        console.error('Error getting section info:', err.message);
        return;
      }
      
      console.log('\n📊 product_sections structure:');
      console.table(sectionInfo);
      
      // Show product_items structure
      db.all("PRAGMA table_info(product_items)", (err, itemInfo) => {
        if (err) {
          console.error('Error getting item info:', err.message);
          return;
        }
        
        console.log('\n📊 product_items structure:');
        console.table(itemInfo);
        
        db.close();
        console.log('\n🎉 Product CMS tables created successfully!');
      });
    });
  });
}, 1000);


