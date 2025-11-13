// Script to check existing tables in the database
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

// List all tables
db.all(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`, [], (err, tables) => {
  if (err) {
    console.error('❌ Error getting tables:', err.message);
    db.close();
    process.exit(1);
  }
  
  console.log('📊 Available tables:');
  tables.forEach(table => console.log(`  - ${table.name}`));
  
  // Check for solutions-related tables
  const solutionsTables = tables.filter(t => t.name.toLowerCase().includes('solution'));
  
  if (solutionsTables.length > 0) {
    console.log('\n🔍 Solutions-related tables found:');
    solutionsTables.forEach(table => {
      console.log(`\n  Table: ${table.name}`);
      db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
        if (!err) {
          console.log('  Columns:', columns.map(c => c.name).join(', '));
          
          // If button_text column exists, check its values
          if (columns.some(c => c.name === 'button_text')) {
            db.all(`SELECT id, title, button_text FROM ${table.name} LIMIT 10`, [], (err, rows) => {
              if (!err) {
                console.log('  Sample data:');
                console.table(rows);
              }
            });
          }
        }
      });
    });
  }
  
  setTimeout(() => {
    db.close(() => {
      console.log('\n✅ Database connection closed');
    });
  }, 2000);
});
