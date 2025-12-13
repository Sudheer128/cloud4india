const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Adding content column to section_items table...\n');

db.serialize(() => {
  // Check if column exists
  db.all("PRAGMA table_info(section_items)", (err, columns) => {
    if (err) {
      console.error('❌ Error checking table structure:', err);
      db.close();
      return;
    }
    
    const hasContentColumn = columns.some(col => col.name === 'content');
    
    if (hasContentColumn) {
      console.log('✅ Content column already exists in section_items table');
      db.close();
      return;
    }
    
    // Add content column
    db.run("ALTER TABLE section_items ADD COLUMN content TEXT;", (err) => {
      if (err) {
        if (err.message.includes('duplicate column')) {
          console.log('✅ Content column already exists in section_items');
        } else {
          console.error('❌ Error adding content column:', err.message);
        }
      } else {
        console.log('✅ Successfully added content column to section_items table');
      }
      db.close();
    });
  });
});

