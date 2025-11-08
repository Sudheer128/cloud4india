const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🔧 Fixing Key Features duplicates...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  const products = [
    'microsoft-365-licenses',
    'acronis-server-backup',
    'acronis-m365-backup',
    'acronis-google-workspace-backup',
    'anti-virus'
  ];
  
  let completed = 0;
  
  products.forEach(route => {
    // Get section ID
    db.get(`
      SELECT ps.id as section_id
      FROM products p
      JOIN product_sections ps ON p.id = ps.product_id
      WHERE p.route = ? AND ps.section_type = 'features'
    `, [route], (err, section) => {
      if (err) {
        console.error(`❌ Error for ${route}:`, err.message);
        completed++;
        if (completed === products.length) db.close();
        return;
      }
      
      if (!section) {
        console.log(`⚠️  No section found for ${route}`);
        completed++;
        if (completed === products.length) db.close();
        return;
      }
      
      // Get all items
      db.all(`
        SELECT id, title, order_index
        FROM product_items
        WHERE section_id = ? AND item_type = 'feature_card'
        ORDER BY order_index, id
      `, [section.section_id], (err, items) => {
        if (err) {
          console.error(`❌ Error getting items for ${route}:`, err.message);
          completed++;
          if (completed === products.length) db.close();
          return;
        }
        
        if (items.length <= 6) {
          console.log(`✓ ${route}: ${items.length} items (OK)`);
          completed++;
          if (completed === products.length) {
            console.log('\n✅ Done!\n');
            db.close();
          }
          return;
        }
        
        console.log(`⚠️  ${route}: ${items.length} items (should be 6)`);
        
        // Keep first 6 items (by order_index, then by id)
        const toKeep = items.slice(0, 6).map(i => i.id);
        const toDelete = items.slice(6).map(i => i.id);
        
        if (toDelete.length > 0) {
          db.run(`
            DELETE FROM product_items
            WHERE id IN (${toDelete.map(() => '?').join(',')})
          `, toDelete, function(err) {
            if (err) {
              console.error(`❌ Error deleting duplicates for ${route}:`, err.message);
            } else {
              console.log(`✅ Removed ${this.changes} duplicate items from ${route}`);
            }
            
            // Reorder remaining items to 1-6
            let reorderCompleted = 0;
            toKeep.forEach((id, index) => {
              db.run(`
                UPDATE product_items
                SET order_index = ?
                WHERE id = ?
              `, [index + 1, id], function(err) {
                reorderCompleted++;
                if (err) {
                  console.error(`❌ Error reordering for ${route}:`, err.message);
                }
                
                if (reorderCompleted === toKeep.length) {
                  console.log(`✅ Reordered ${route} items to 1-6`);
                  completed++;
                  if (completed === products.length) {
                    console.log('\n✅ Done!\n');
                    db.close();
                  }
                }
              });
            });
          });
        } else {
          completed++;
          if (completed === products.length) {
            console.log('\n✅ Done!\n');
            db.close();
          }
        }
      });
    });
  });
});



