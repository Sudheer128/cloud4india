const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const sqlPath = path.join(__dirname, 'populate-technical-specifications.sql');

console.log('📊 Populating Technical Specifications...\n');

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

// Split SQL into individual statements (by semicolon followed by newline)
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && s !== '');

let completed = 0;
let errors = 0;

console.log(`📝 Executing ${statements.length} SQL statements...\n`);

// Execute each statement
db.serialize(() => {
  statements.forEach((statement, index) => {
    db.run(statement, (err) => {
      completed++;
      
      if (err) {
        errors++;
        // Only show errors that aren't "already exists" type errors
        if (!err.message.includes('UNIQUE constraint failed') && 
            !err.message.includes('already exists')) {
          console.error(`❌ Error in statement ${index + 1}:`, err.message);
        }
      }
      
      // Show progress
      if (completed % 10 === 0 || completed === statements.length) {
        process.stdout.write(`\r⏳ Progress: ${completed}/${statements.length} statements executed`);
      }
      
      if (completed === statements.length) {
        console.log('\n');
        
        // Verification query
        db.all(`
          SELECT 
            p.name as product_name,
            p.route as product_route,
            COUNT(pi.id) as specification_count
          FROM products p
          LEFT JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'specifications'
          LEFT JOIN product_items pi ON ps.id = pi.section_id
          GROUP BY p.id, p.name, p.route
          ORDER BY p.name
        `, (err, rows) => {
          if (err) {
            console.error('❌ Error verifying results:', err.message);
          } else {
            console.log('📊 VERIFICATION RESULTS:');
            console.log('═══════════════════════════════════════════════════════\n');
            
            rows.forEach(row => {
              const status = row.specification_count === 6 ? '✅' : 
                           row.specification_count > 0 ? '⚠️' : '❌';
              console.log(`${status} ${row.product_name}`);
              console.log(`   Route: ${row.product_route}`);
              console.log(`   Specifications: ${row.specification_count}/6`);
              console.log('');
            });
            
            console.log('═══════════════════════════════════════════════════════');
            
            const totalProducts = rows.length;
            const productsWithSpecs = rows.filter(r => r.specification_count > 0).length;
            const productsWithAllSpecs = rows.filter(r => r.specification_count === 6).length;
            
            console.log(`\n✅ Summary:`);
            console.log(`   Total Products: ${totalProducts}`);
            console.log(`   Products with Specifications: ${productsWithSpecs}`);
            console.log(`   Products with 6 Specifications: ${productsWithAllSpecs}`);
            
            if (errors > 0) {
              console.log(`\n⚠️  ${errors} warnings (likely duplicate entries - this is normal)`);
            }
          }
          
          db.close();
        });
      }
    });
  });
});

