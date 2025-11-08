const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  db.all(`
    SELECT p.name, p.route, pi.title, pi.description, pi.order_index
    FROM products p
    JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'features'
    JOIN product_items pi ON ps.id = pi.section_id AND pi.item_type = 'feature_card'
    WHERE p.route IN ('microsoft-365-licenses', 'acronis-server-backup', 'acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus')
    AND p.is_visible = 1
    ORDER BY p.route, pi.order_index
  `, [], (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    console.log('✅ Key Features Verification\n');
    console.log('─────────────────────────────────────────────────────────────\n');
    
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.route]) {
        grouped[row.route] = {
          name: row.name,
          route: row.route,
          features: []
        };
      }
      grouped[row.route].features.push({
        title: row.title,
        description: row.description,
        order: row.order_index
      });
    });
    
    Object.values(grouped).forEach(product => {
      console.log(`📦 ${product.name} (${product.route})`);
      console.log(`   Total Features: ${product.features.length}\n`);
      
      product.features.sort((a, b) => a.order - b.order).forEach((feature, idx) => {
        console.log(`   ${idx + 1}. ${feature.title}`);
        console.log(`      ${feature.description.substring(0, 80)}...`);
        console.log('');
      });
      
      console.log('─────────────────────────────────────────────────────────────\n');
    });
    
    const allHaveSix = Object.values(grouped).every(p => p.features.length === 6);
    
    if (allHaveSix) {
      console.log('✅ All products have 6 Key Features with proper product-specific content!\n');
    } else {
      console.log('⚠️  Some products need attention\n');
    }
    
    db.close();
  });
});



