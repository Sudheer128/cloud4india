const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log('📊 Verifying Technical Specifications...\n');
  
  db.all(`
    SELECT 
      p.name as product_name,
      p.route as product_route,
      pi.title as spec_title,
      pi.order_index,
      pi.description,
      pi.icon
    FROM products p
    JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
    JOIN product_items pi ON ps.id = pi.section_id AND pi.item_type = 'specification'
    WHERE p.route IN ('microsoft-365-licenses', 'acronis-server-backup')
    ORDER BY p.route, pi.order_index
  `, [], (err, rows) => {
    if (err) {
      console.error('❌ Error querying database:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (rows.length === 0) {
      console.log('⚠️  No specifications found!\n');
      db.close();
      process.exit(1);
    }
    
    // Group by product
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.product_route]) {
        grouped[row.product_route] = {
          name: row.product_name,
          route: row.product_route,
          specs: []
        };
      }
      grouped[row.product_route].specs.push({
        title: row.spec_title,
        order: row.order_index,
        description: row.description,
        icon: row.icon
      });
    });
    
    console.log('✅ Technical Specifications Found:\n');
    console.log('─────────────────────────────────────────────────────────────────\n');
    
    Object.values(grouped).forEach(product => {
      console.log(`📦 ${product.name} (${product.route})`);
      console.log(`   Total Specifications: ${product.specs.length}\n`);
      
      product.specs.forEach((spec, idx) => {
        console.log(`   ${idx + 1}. ${spec.title}`);
        console.log(`      Order: ${spec.order} | Icon: ${spec.icon}`);
        console.log(`      Description: ${spec.description.substring(0, 60)}...`);
        console.log('');
      });
      
      console.log('─────────────────────────────────────────────────────────────────\n');
    });
    
    // Check if all products have 6 specs
    const allHaveSix = Object.values(grouped).every(p => p.specs.length === 6);
    
    if (allHaveSix) {
      console.log('✅ All products have 6 specifications!\n');
    } else {
      console.log('⚠️  Some products do not have 6 specifications:\n');
      Object.values(grouped).forEach(product => {
        if (product.specs.length !== 6) {
          console.log(`   ❌ ${product.name}: ${product.specs.length}/6`);
        }
      });
      console.log('');
    }
    
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      }
      process.exit(allHaveSix ? 0 : 1);
    });
  });
});



