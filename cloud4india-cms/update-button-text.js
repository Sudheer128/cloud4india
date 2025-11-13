// Script to update button_text from "Explore Solution" to "Explore App" in main_solutions_sections
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cloud4india.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database\n');
});

console.log('🔄 Updating button_text from "Explore Solution" to "Explore App"...\n');

// Update all records that have 'Explore Solution' as button_text
db.run(`
  UPDATE main_solutions_sections 
  SET button_text = 'Explore App'
  WHERE button_text = 'Explore Solution'
`, function(err) {
  if (err) {
    console.error('❌ Error updating button_text:', err.message);
    db.close();
    process.exit(1);
  }
  
  console.log(`✅ Successfully updated ${this.changes} record(s)`);
  
  // Verify the changes
  db.all(`SELECT id, title, button_text FROM main_solutions_sections`, [], (err, rows) => {
    if (err) {
      console.error('❌ Error verifying changes:', err.message);
    } else {
      console.log('\n📊 Current button_text values:');
      console.table(rows);
    }
    
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('\n✅ Database connection closed');
      }
    });
  });
});

