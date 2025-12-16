const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

console.log('=== Checking integrity_pages table ===\n');

// Get schema
db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='integrity_pages'", (err, rows) => {
  if (err) {
    console.error('Error getting schema:', err);
    return;
  }
  console.log('Table schema:');
  console.log(rows[0]?.sql);
  console.log('\n');
});

// Get current data for privacy page
setTimeout(() => {
  db.get("SELECT id, slug, title, description, eyebrow, LENGTH(description) as desc_len FROM integrity_pages WHERE slug = 'privacy'", (err, row) => {
    if (err) {
      console.error('Error getting data:', err);
      return;
    }
    console.log('Current privacy page data:');
    console.log(JSON.stringify(row, null, 2));
    console.log('\n');
  });
}, 100);

// Try to update and see if it works
setTimeout(() => {
  const testValue = `TEST_UPDATE_${Date.now()}`;
  console.log(`Attempting to update description to: "${testValue}"`);
  
  db.run('UPDATE integrity_pages SET description = ? WHERE slug = ?', [testValue, 'privacy'], function(err) {
    if (err) {
      console.error('Update error:', err);
      db.close();
      return;
    }
    
    console.log('Update succeeded, changes:', this.changes);
    
    // Verify the update
    setTimeout(() => {
      db.get("SELECT description FROM integrity_pages WHERE slug = 'privacy'", (err, row) => {
        if (err) {
          console.error('Verification error:', err);
          db.close();
          return;
        }
        console.log('Verified description after update:', row?.description);
        console.log('Match:', row?.description === testValue ? 'YES' : 'NO');
        
        db.close();
      });
    }, 100);
  });
}, 200);

