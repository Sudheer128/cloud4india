const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🧹 Cleaning up duplicate specification items for Microsoft 365 Licenses...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  db.get('SELECT id FROM products WHERE route = ?', ['microsoft-365-licenses'], (err, product) => {
    if (err || !product) {
      console.error('❌ Product not found');
      db.close();
      process.exit(1);
    }
    
    db.all(`
      SELECT pi.id, pi.title, pi.content 
      FROM product_items pi 
      JOIN product_sections ps ON pi.section_id = ps.id 
      WHERE ps.product_id = ? AND ps.section_type = 'specifications'
    `, [product.id], (err, items) => {
      if (err) {
        console.error('❌ Error fetching items:', err.message);
        db.close();
        process.exit(1);
      }
      
      // Filter items with less than 3 points
      const oldItems = items.filter(item => {
        try {
          const content = item.content ? JSON.parse(item.content) : null;
          const points = content && content.features ? content.features.length : 0;
          return points < 3;
        } catch (e) {
          return true; // If content is not valid JSON or has issues, consider it old
        }
      });
      
      if (oldItems.length === 0) {
        console.log('✅ No old items to remove');
        db.close();
        return;
      }
      
      console.log(`🗑️  Removing ${oldItems.length} old specification items...\n`);
      
      let deleted = 0;
      oldItems.forEach(item => {
        db.run('DELETE FROM product_items WHERE id = ?', [item.id], function(err) {
          deleted++;
          if (err) {
            console.error(`❌ Error deleting "${item.title}":`, err.message);
          } else {
            console.log(`   ✅ Deleted: ${item.title}`);
          }
          
          if (deleted === oldItems.length) {
            console.log(`\n✅ Removed ${deleted} old items`);
            
            // Verify remaining items
            db.all(`
              SELECT COUNT(*) as count 
              FROM product_items 
              WHERE section_id IN (
                SELECT id FROM product_sections 
                WHERE product_id = ? AND section_type = 'specifications'
              )
            `, [product.id], (err, rows) => {
              if (err) {
                console.error('❌ Error counting remaining items:', err.message);
              } else {
                console.log(`✅ Remaining specifications: ${rows[0].count}`);
                
                // Verify all remaining have 3 points
                db.all(`
                  SELECT pi.title, pi.content 
                  FROM product_items pi 
                  JOIN product_sections ps ON pi.section_id = ps.id 
                  WHERE ps.product_id = ? AND ps.section_type = 'specifications'
                  ORDER BY pi.order_index
                `, [product.id], (err, remainingItems) => {
                  if (!err) {
                    console.log('\n📋 Remaining specifications:');
                    remainingItems.forEach((item, idx) => {
                      try {
                        const content = item.content ? JSON.parse(item.content) : null;
                        const points = content && content.features ? content.features.length : 0;
                        console.log(`   ${idx + 1}. ${item.title} - ${points} points`);
                      } catch (e) {
                        console.log(`   ${idx + 1}. ${item.title} - Error parsing content`);
                      }
                    });
                  }
                  
                  db.close();
                });
              }
            });
          }
        });
      });
    });
  });
});


