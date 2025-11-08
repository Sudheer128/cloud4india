const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const sqlFile = path.join(__dirname, 'populate-key-features-all-products.sql');

console.log('🚀 Starting Key Features Population for All Products...\n');
console.log(`📊 Database: ${dbPath}`);
console.log(`📝 SQL File: ${sqlFile}\n`);

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.error('❌ Database file not found:', dbPath);
  process.exit(1);
}

// Check if SQL file exists
if (!fs.existsSync(sqlFile)) {
  console.error('❌ SQL file not found:', sqlFile);
  process.exit(1);
}

// Read SQL file
const sql = fs.readFileSync(sqlFile, 'utf8');

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) {
    console.error('❌ Error enabling foreign keys:', err.message);
    db.close();
    process.exit(1);
  }
});

// Split SQL into individual statements
const statements = sql
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => 
    stmt.length > 0 && 
    !stmt.startsWith('--') && 
    !stmt.startsWith('/*') &&
    stmt !== 'COMMIT'
  );

console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

let executedCount = 0;
let errorCount = 0;

// Execute statements sequentially
const executeStatements = () => {
  if (executedCount >= statements.length) {
    // Verify the data
    console.log('\n📊 Verifying inserted data...\n');
    
    db.all(`
      SELECT 
        p.name as product_name,
        p.route as product_route,
        ps.title as section_title,
        COUNT(pi.id) as feature_count
      FROM products p
      LEFT JOIN product_sections ps ON p.id = ps.product_id AND ps.section_type = 'features'
      LEFT JOIN product_items pi ON ps.id = pi.section_id AND pi.item_type = 'feature_card'
      WHERE p.route IN ('microsoft-365-licenses', 'acronis-server-backup', 'acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus')
      AND p.is_visible = 1
      GROUP BY p.id, p.name, p.route, ps.title
      ORDER BY p.name
    `, [], (err, rows) => {
      if (err) {
        console.error('❌ Error verifying data:', err.message);
      } else {
        console.log('✅ Verification Results:');
        console.log('─────────────────────────────────────────');
        rows.forEach(row => {
          console.log(`  ${row.product_name} (${row.product_route}):`);
          console.log(`    Section: ${row.section_title || 'N/A'}`);
          console.log(`    Features: ${row.feature_count}`);
          console.log('');
        });
        console.log('─────────────────────────────────────────\n');
      }
      
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message);
        } else {
          console.log('✅ Database connection closed');
        }
        
        if (errorCount > 0) {
          console.log(`\n⚠️  Completed with ${errorCount} error(s)`);
          process.exit(1);
        } else {
          console.log('\n✅ Key Features population completed successfully!');
          process.exit(0);
        }
      });
    });
    
    return;
  }
  
  const statement = statements[executedCount];
  
  // Skip empty statements and comments
  if (!statement || statement.trim().length === 0) {
    executedCount++;
    executeStatements();
    return;
  }
  
  db.run(statement, function(err) {
    executedCount++;
    
    if (err) {
      errorCount++;
      console.error(`❌ Error executing statement ${executedCount}:`, err.message);
      console.error(`   Statement: ${statement.substring(0, 100)}...`);
    } else {
      const changes = this.changes || 0;
      if (changes > 0 || statement.toUpperCase().includes('INSERT') || statement.toUpperCase().includes('UPDATE') || statement.toUpperCase().includes('DELETE')) {
        console.log(`✅ Statement ${executedCount}/${statements.length} executed (${changes} row(s) affected)`);
      }
    }
    
    // Continue with next statement
    executeStatements();
  });
};

// Start execution
console.log('🔄 Executing SQL statements...\n');
executeStatements();



