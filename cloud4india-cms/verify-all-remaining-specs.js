const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  db.all(`
    SELECT p.name, p.route, pi.title, pi.order_index, pi.content
    FROM products p
    JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
    JOIN product_items pi ON ps.id = pi.section_id AND pi.item_type = 'specification'
    WHERE p.route IN ('acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus')
    ORDER BY p.route, pi.order_index
  `, [], (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    console.log('✅ Verification: Technical Specifications for Remaining Products\n');
    console.log('─────────────────────────────────────────────────────────────\n');
    
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.route]) {
        grouped[row.route] = {
          name: row.name,
          route: row.route,
          specs: []
        };
      }
      grouped[row.route].specs.push({
        title: row.title,
        order: row.order_index,
        content: row.content
      });
    });
    
    Object.values(grouped).forEach(product => {
      console.log(`📦 ${product.name} (${product.route})`);
      console.log(`   Total Specifications: ${product.specs.length}\n`);
      
      product.specs.sort((a, b) => a.order - b.order).forEach((spec, idx) => {
        const content = JSON.parse(spec.content);
        const pointCount = content.features ? content.features.length : 0;
        
        console.log(`   ${idx + 1}. ${spec.title} (Order: ${spec.order})`);
        console.log(`      Points: ${pointCount} ${pointCount === 3 ? '✅' : '❌'}`);
        console.log('');
      });
      
      console.log('─────────────────────────────────────────────────────────────\n');
    });
    
    // Final summary
    const allHaveSix = Object.values(grouped).every(p => p.specs.length === 6);
    const allHaveThreePoints = rows.every(row => {
      const content = JSON.parse(row.content);
      return content.features && content.features.length === 3;
    });
    
    if (allHaveSix && allHaveThreePoints) {
      console.log('✅ All products have 6 specifications with 3 points each!\n');
    } else {
      console.log('⚠️  Some products need attention:\n');
      if (!allHaveSix) {
        Object.values(grouped).forEach(product => {
          if (product.specs.length !== 6) {
            console.log(`   ❌ ${product.name}: ${product.specs.length}/6 specifications`);
          }
        });
      }
      if (!allHaveThreePoints) {
        console.log('   ❌ Some specifications do not have 3 points');
      }
      console.log('');
    }
    
    db.close();
  });
});



