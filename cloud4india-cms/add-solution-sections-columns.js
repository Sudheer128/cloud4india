const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './cms.db';
const db = new sqlite3.Database(DB_PATH);

console.log('🚀 Adding missing columns to solution_sections and solution_items tables...');
console.log('📊 Database: ' + DB_PATH);
console.log('='.repeat(60));

db.serialize(() => {
  // Columns to add to solution_sections
  const sectionColumns = [
    { 
      name: 'is_visible', 
      sql: "ALTER TABLE solution_sections ADD COLUMN is_visible INTEGER DEFAULT 1;",
      description: "Visibility toggle for sections"
    },
    { 
      name: 'media_type', 
      sql: "ALTER TABLE solution_sections ADD COLUMN media_type TEXT;",
      description: "Media type (video/image) for media_banner sections"
    },
    { 
      name: 'media_source', 
      sql: "ALTER TABLE solution_sections ADD COLUMN media_source TEXT;",
      description: "Media source (youtube/upload) for media_banner sections"
    },
    { 
      name: 'media_url', 
      sql: "ALTER TABLE solution_sections ADD COLUMN media_url TEXT;",
      description: "Media URL for media_banner sections"
    }
  ];

  // Columns to add to solution_items
  const itemColumns = [
    { 
      name: 'is_visible', 
      sql: "ALTER TABLE solution_items ADD COLUMN is_visible INTEGER DEFAULT 1;",
      description: "Visibility toggle for items"
    },
    { 
      name: 'content', 
      sql: "ALTER TABLE solution_items ADD COLUMN content TEXT;",
      description: "JSON content for complex item data"
    }
  ];

  console.log('\n📋 Adding columns to solution_sections:');
  let sectionsCompleted = 0;
  
  sectionColumns.forEach((col) => {
    db.run(col.sql, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name') || err.message.includes('duplicate column')) {
          console.log(`   ⏭️  Column ${col.name} already exists - ${col.description}`);
        } else {
          console.error(`   ❌ Error adding column ${col.name}: ${err.message}`);
        }
      } else {
        console.log(`   ✅ Added column ${col.name} - ${col.description}`);
      }
      
      sectionsCompleted++;
      
      if (sectionsCompleted === sectionColumns.length) {
        console.log('\n📋 Adding columns to solution_items:');
        let itemsCompleted = 0;
        
        itemColumns.forEach((col) => {
          db.run(col.sql, (err) => {
            if (err) {
              if (err.message.includes('duplicate column name') || err.message.includes('duplicate column')) {
                console.log(`   ⏭️  Column ${col.name} already exists - ${col.description}`);
              } else {
                console.error(`   ❌ Error adding column ${col.name}: ${err.message}`);
              }
            } else {
              console.log(`   ✅ Added column ${col.name} - ${col.description}`);
            }
            
            itemsCompleted++;
            
            if (itemsCompleted === itemColumns.length) {
              // Verify columns
              console.log('\n✅ Verifying solution_sections columns:');
              db.all("PRAGMA table_info(solution_sections)", (err, info) => {
                if (err) {
                  console.error('Error getting table info:', err.message);
                } else {
                  const columnNames = info.map(c => c.name);
                  console.log('   Current columns:', columnNames.join(', '));
                  
                  sectionColumns.forEach(col => {
                    const exists = columnNames.includes(col.name);
                    console.log(`   ${exists ? '✓' : '✗'} ${col.name}`);
                  });
                }
                
                console.log('\n✅ Verifying solution_items columns:');
                db.all("PRAGMA table_info(solution_items)", (err, info) => {
                  if (err) {
                    console.error('Error getting table info:', err.message);
                  } else {
                    const columnNames = info.map(c => c.name);
                    console.log('   Current columns:', columnNames.join(', '));
                    
                    itemColumns.forEach(col => {
                      const exists = columnNames.includes(col.name);
                      console.log(`   ${exists ? '✓' : '✗'} ${col.name}`);
                    });
                  }
                  
                  db.close();
                  console.log('\n🎉 Migration completed successfully!');
                  console.log('✨ Solutions now support:');
                  console.log('   • Section visibility toggle');
                  console.log('   • Media banners (video/photo galleries)');
                  console.log('   • Item visibility control');
                  console.log('   • Complex JSON content for items');
                  console.log('=' .repeat(60));
                });
              });
            }
          });
        });
      }
    });
  });
});

