const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Adding eyebrow column to integrity_pages table...');

db.serialize(() => {
  db.run("ALTER TABLE integrity_pages ADD COLUMN eyebrow TEXT;", (err) => {
    if (err) {
      if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
        console.log('✅ Column eyebrow already exists in integrity_pages');
      } else {
        console.error('❌ Error adding column eyebrow:', err.message);
      }
    } else {
      console.log('✅ Successfully added eyebrow column to integrity_pages');
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed');
      }
    });
  });
});

