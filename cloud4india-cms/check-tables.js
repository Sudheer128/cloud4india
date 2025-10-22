const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

console.log('📊 Checking database tables...\n');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('❌ Error:', err.message);
  } else {
    console.log('📋 Available tables:');
    console.table(tables);
    
    // Check if section_items table exists
    const hasSection_items = tables.some(t => t.name === 'section_items');
    console.log(`\n🔍 section_items table exists: ${hasSection_items ? '✅ Yes' : '❌ No'}`);
    
    if (!hasSection_items) {
      console.log('\n💡 The section_items table is missing. This table should be created by server.js');
      console.log('   Run the server first to create all required tables.');
    }
  }
  
  db.close();
});
