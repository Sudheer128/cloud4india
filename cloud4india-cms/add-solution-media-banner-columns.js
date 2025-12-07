const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './cms.db';
const db = new sqlite3.Database(DB_PATH);

console.log('🚀 Adding Media Banner columns to marketplace_sections table...');

db.serialize(() => {
  const columns = [
    { name: 'media_type', sql: "ALTER TABLE marketplace_sections ADD COLUMN media_type TEXT;" },
    { name: 'media_source', sql: "ALTER TABLE marketplace_sections ADD COLUMN media_source TEXT;" },
    { name: 'media_url', sql: "ALTER TABLE marketplace_sections ADD COLUMN media_url TEXT;" }
  ];

  let completed = 0;
  columns.forEach((col) => {
    db.run(col.sql, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`   ⏭️  Column ${col.name} already exists`);
        } else {
          console.error(`   ❌ Error adding column ${col.name}: ${err.message}`);
        }
      } else {
        console.log(`   ✅ Added column ${col.name}`);
      }
      completed++;
      if (completed === columns.length) {
        console.log('\n✅ All media banner columns are present:');
        db.all("PRAGMA table_info(marketplace_sections)", (err, info) => {
          if (err) {
            console.error('Error getting table info:', err.message);
            db.close();
            return;
          }
          columns.forEach(col => {
            const exists = info.some(c => c.name === col.name);
            console.log(`   ${exists ? '✓' : '✗'} ${col.name}`);
          });
          db.close();
          console.log('\n🎉 Migration completed successfully!');
        });
      }
    });
  });
});

