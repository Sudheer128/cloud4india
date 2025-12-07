const sqlite3 = require('sqlite3').verbose();

const dbPath = '/app/data/cms.db';
console.log('🗑️  Removing WordPress from Database');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
});

(async () => {
  try {
    // Delete section items for WordPress
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM section_items WHERE section_id IN (SELECT id FROM marketplace_sections WHERE marketplace_id = 6)',
        function(err) {
          if (err) reject(err);
          else {
            console.log(`✅ Deleted ${this.changes} section items`);
            resolve();
          }
        }
      );
    });
    
    // Delete sections for WordPress
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM marketplace_sections WHERE marketplace_id = 6',
        function(err) {
          if (err) reject(err);
          else {
            console.log(`✅ Deleted ${this.changes} sections`);
            resolve();
          }
        }
      );
    });
    
    // Delete from main_marketplaces_sections
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM main_marketplaces_sections WHERE marketplace_id = 6',
        function(err) {
          if (err) reject(err);
          else {
            console.log(`✅ Deleted ${this.changes} main marketplaces entry`);
            resolve();
          }
        }
      );
    });
    
    // Delete WordPress marketplace
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM marketplaces WHERE id = 6',
        function(err) {
          if (err) reject(err);
          else {
            console.log(`✅ Deleted ${this.changes} marketplace\n`);
            resolve();
          }
        }
      );
    });
    
    console.log('🎉 WordPress completely removed from database');
    console.log('📊 Verifying...\n');
    
    // Verify
    const verify = await new Promise((resolve, reject) => {
      db.all(
        'SELECT id, name FROM marketplaces ORDER BY id',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    console.log('Current marketplaces:');
    console.table(verify);
    
    db.close();
  } catch (err) {
    console.error('\n❌ Failed:', err.message);
    db.close();
    process.exit(1);
  }
})();













