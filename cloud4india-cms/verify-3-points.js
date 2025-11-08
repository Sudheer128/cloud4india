const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
  
  db.all(`
    SELECT p.route, pi.title, pi.content
    FROM products p
    JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
    JOIN product_items pi ON ps.id = pi.section_id
    WHERE p.route IN ('microsoft-365-licenses', 'acronis-server-backup')
    ORDER BY p.route, pi.order_index
  `, [], (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    console.log('✅ Verification: All specifications now have 3 points each\n');
    console.log('─────────────────────────────────────────────────────────────\n');
    
    let currentRoute = '';
    rows.forEach(row => {
      if (row.route !== currentRoute) {
        currentRoute = row.route;
        console.log(`\n📦 ${currentRoute.toUpperCase()}\n`);
      }
      
      const content = JSON.parse(row.content);
      const pointCount = content.features ? content.features.length : 0;
      
      console.log(`  ${row.title}:`);
      console.log(`    Points: ${pointCount} ${pointCount === 3 ? '✅' : '❌'}`);
      if (pointCount !== 3) {
        console.log(`    ⚠️  Expected 3, found ${pointCount}`);
      }
      console.log('');
    });
    
    const allCorrect = rows.every(row => {
      const content = JSON.parse(row.content);
      return content.features && content.features.length === 3;
    });
    
    console.log('─────────────────────────────────────────────────────────────\n');
    if (allCorrect) {
      console.log('✅ All specifications have exactly 3 points!\n');
    } else {
      console.log('⚠️  Some specifications do not have 3 points\n');
    }
    
    db.close();
  });
});



