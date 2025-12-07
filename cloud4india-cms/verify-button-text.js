// Script to verify button_text updates
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database\n');
});

console.log('🔍 Checking button_text values in main_marketplaces_sections...\n');

db.all(`SELECT id, title, button_text FROM main_marketplaces_sections`, [], (err, rows) => {
    if (err) {
      console.error('❌ Error querying main_marketplaces_sections:', err.message);
    } else if (rows.length === 0) {
      console.log('ℹ️  No records found in main_marketplaces_sections');
  } else {
    console.log('📊 Current button_text values:');
    console.table(rows);
    
    const exploreAppCount = rows.filter(r => r.button_text === 'Explore App').length;
    const exploreSolutionCount = rows.filter(r => r.button_text === 'Explore Solution').length; // Legacy value check
    
    console.log(`\n✅ Records with "Explore App": ${exploreAppCount}`);
    console.log(`❌ Records with legacy "Explore Solution": ${exploreSolutionCount}`);
    
    if (exploreSolutionCount === 0) {
      console.log('\n🎉 All button_text values have been successfully updated!');
    } else {
      console.log('\n⚠️  Some records still have legacy "Explore Solution" value');
    }
  }
  
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('\n✅ Database connection closed');
    }
  });
});

