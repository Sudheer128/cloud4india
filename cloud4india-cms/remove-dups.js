// Script to remove duplicate sections from products
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Finding duplicate sections...');

db.all(`
  SELECT product_id, section_type, COUNT(*) as count
  FROM product_sections
  GROUP BY product_id, section_type
  HAVING COUNT(*) > 1
`, [], (err, duplicates) => {
  if (err) {
    console.error('Error finding duplicates:', err);
    db.close();
    return;
  }

  if (duplicates.length === 0) {
    console.log('✅ No duplicate sections found');
    db.close();
    return;
  }

  console.log(`Found ${duplicates.length} duplicate section types across products`);
  
  let processed = 0;
  
  duplicates.forEach((dup) => {
    // Get all sections of this type for this product, ordered by ID (keep the first one)
    db.all(
      `SELECT id FROM product_sections 
       WHERE product_id = ? AND section_type = ? 
       ORDER BY id ASC`,
      [dup.product_id, dup.section_type],
      (err, sections) => {
        if (err) {
          console.error(`Error fetching sections:`, err);
          processed++;
          if (processed === duplicates.length) {
            db.close();
          }
          return;
        }

        if (sections.length <= 1) {
          processed++;
          if (processed === duplicates.length) {
            db.close();
          }
          return;
        }

        const keepId = sections[0].id;
        const deleteIds = sections.slice(1).map(s => s.id);

        console.log(`Keeping section ID ${keepId}, deleting IDs: ${deleteIds.join(', ')}`);

        // Delete items for duplicate sections
        const placeholders = deleteIds.map(() => '?').join(',');
        db.run(
          `DELETE FROM product_items WHERE section_id IN (${placeholders})`,
          deleteIds,
          (err) => {
            if (err) {
              console.error(`Error deleting items:`, err);
            } else {
              console.log(`  Deleted items for ${deleteIds.length} duplicate sections`);
            }

            // Delete duplicate sections
            db.run(
              `DELETE FROM product_sections WHERE id IN (${placeholders})`,
              deleteIds,
              (err) => {
                if (err) {
                  console.error(`Error deleting sections:`, err);
                } else {
                  console.log(`  Deleted ${deleteIds.length} duplicate sections`);
                }

                processed++;
                if (processed === duplicates.length) {
                  console.log('✅ Duplicate removal completed');
                  db.close();
                }
              }
            );
          }
        );
      }
    );
  });
});

