const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get database path from environment or use default
const dbPath = process.env.DB_PATH || path.join(__dirname, 'cms.db');

console.log('🚀 Adding Media Banner columns to product_sections table...');
console.log(`📊 Database: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Add media banner columns to product_sections table
const addMediaBannerColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { 
        name: 'media_type', 
        sql: "ALTER TABLE product_sections ADD COLUMN media_type TEXT;" 
      },
      { 
        name: 'media_source', 
        sql: "ALTER TABLE product_sections ADD COLUMN media_source TEXT;" 
      },
      { 
        name: 'media_url', 
        sql: "ALTER TABLE product_sections ADD COLUMN media_url TEXT;" 
      }
    ];
    
    let completed = 0;
    const total = columns.length;
    
    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          // Column might already exist, that's okay
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists`);
          } else {
            console.error(`   ❌ Error adding column ${col.name}: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name}`);
        }
        
        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Verify columns were added
const verifyColumns = () => {
  return new Promise((resolve) => {
    db.all("PRAGMA table_info(product_sections)", (err, rows) => {
      if (err) {
        console.error('❌ Error verifying columns:', err.message);
        resolve();
        return;
      }
      
      const columnNames = rows.map(row => row.name);
      const requiredColumns = ['media_type', 'media_source', 'media_url'];
      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
      
      if (missingColumns.length === 0) {
        console.log('\n✅ All media banner columns are present:');
        requiredColumns.forEach(col => {
          console.log(`   ✓ ${col}`);
        });
      } else {
        console.log('\n⚠️  Some columns are missing:');
        missingColumns.forEach(col => {
          console.log(`   ✗ ${col}`);
        });
      }
      
      resolve();
    });
  });
};

// Main execution
db.serialize(async () => {
  try {
    await addMediaBannerColumns();
    await verifyColumns();
    
    console.log('\n🎉 Migration completed successfully!');
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        process.exit(1);
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    db.close();
    process.exit(1);
  }
});


