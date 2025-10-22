const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./cms.db', (err) => {
  if (err) {
    console.error(`❌ Error connecting to database: ${err.message}`);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});

// Check if section_items table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='section_items'", (err, row) => {
  if (err) {
    console.error(`❌ Error checking table: ${err.message}`);
  } else if (row) {
    console.log('✅ section_items table exists!');
    
    // Get table schema
    db.all("PRAGMA table_info(section_items)", (err, columns) => {
      if (err) {
        console.error(`❌ Error getting table info: ${err.message}`);
      } else {
        console.log('📋 Table columns:');
        columns.forEach(col => {
          console.log(`  - ${col.name}: ${col.type}`);
        });
      }
      db.close();
    });
  } else {
    console.log('❌ section_items table does not exist');
    db.close();
  }
});
