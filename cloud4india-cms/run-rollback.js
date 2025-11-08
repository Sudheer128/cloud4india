const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const sqlPath = path.join(__dirname, 'rollback-technical-specifications.sql');

console.log('🔄 Rolling back Technical Specifications...\n');

// Read the SQL file
const sql = fs.readFileSync(sqlPath, 'utf8');

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    return;
  }
  console.log('✅ Connected to database\n');
});

// Remove comments and split SQL into individual statements
const cleanSql = sql
  .split('\n')
  .filter(line => !line.trim().startsWith('--'))
  .join('\n');

const statements = cleanSql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

let completed = 0;

console.log(`📝 Executing ${statements.length} SQL statements...\n`);

// Execute each statement
db.serialize(() => {
  statements.forEach((statement, index) => {
    db.run(statement, function(err) {
      completed++;
      
      if (err) {
        console.error(`❌ Error in statement ${index + 1}:`, err.message);
      } else {
        // Show how many rows were affected for DELETE statements
        if (statement.trim().toUpperCase().startsWith('DELETE')) {
          console.log(`✅ Statement ${index + 1}: ${this.changes} rows deleted`);
        }
      }
      
      if (completed === statements.length) {
        console.log('\n');
        
        // Verification query
        db.all(`
          SELECT 
            p.name as product_name,
            p.route as product_route,
            COUNT(pi.id) as remaining_specs
          FROM products p
          LEFT JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
          LEFT JOIN product_items pi ON ps.id = pi.section_id
          GROUP BY p.id, p.name, p.route
          ORDER BY p.name
        `, (err, rows) => {
          if (err) {
            console.error('❌ Error verifying results:', err.message);
          } else {
            console.log('📊 VERIFICATION - Remaining Specifications:');
            console.log('═══════════════════════════════════════════════════════\n');
            
            rows.forEach(row => {
              const status = row.remaining_specs === 0 ? '✅' : '⚠️';
              console.log(`${status} ${row.product_name}`);
              console.log(`   Route: ${row.product_route}`);
              console.log(`   Remaining Specifications: ${row.remaining_specs}`);
              console.log('');
            });
            
            console.log('═══════════════════════════════════════════════════════');
            
            const totalProducts = rows.length;
            const productsWithNoSpecs = rows.filter(r => r.remaining_specs === 0).length;
            const productsWithSpecs = rows.filter(r => r.remaining_specs > 0).length;
            
            console.log(`\n✅ Rollback Summary:`);
            console.log(`   Total Products: ${totalProducts}`);
            console.log(`   Products with no specifications: ${productsWithNoSpecs}`);
            console.log(`   Products with remaining specifications: ${productsWithSpecs}`);
            console.log('\n🎉 Rollback completed!');
          }
          
          db.close();
        });
      }
    });
  });
});

