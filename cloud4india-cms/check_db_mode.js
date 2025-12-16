const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

console.log('=== Checking database configuration ===\n');

// Check journal mode
db.get("PRAGMA journal_mode", (err, row) => {
  if (err) {
    console.error('Error getting journal_mode:', err);
  } else {
    console.log('Journal mode:', row);
  }
});

// Check synchronous mode
db.get("PRAGMA synchronous", (err, row) => {
  if (err) {
    console.error('Error getting synchronous:', err);
  } else {
    console.log('Synchronous mode:', row);
  }
});

// Check if there are WAL files
const fs = require('fs');
setTimeout(() => {
  console.log('\nDatabase files:');
  const files = fs.readdirSync('.').filter(f => f.startsWith('cms.db'));
  files.forEach(f => {
    const stats = fs.statSync(f);
    console.log(`  ${f}: ${stats.size} bytes, modified: ${stats.mtime}`);
  });
  
  db.close();
}, 200);

