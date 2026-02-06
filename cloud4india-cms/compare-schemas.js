const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db1Path = path.join(__dirname, 'cms.db');
const db2Path = path.join(__dirname, 'cms server 149.db');

const db1 = new sqlite3.Database(db1Path);
const db2 = new sqlite3.Database(db2Path);

// Get all table names
function getTables(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(r => r.name));
    });
  });
}

// Get table schema with column details
function getTableSchema(db, tableName) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function compareSchemas() {
  console.log('='.repeat(80));
  console.log('🔍 DETAILED SCHEMA COMPARISON');
  console.log('='.repeat(80));
  console.log('\n📁 Databases:');
  console.log('   1. cms.db');
  console.log('   2. cms server 149.db\n');
  
  try {
    const tables1 = await getTables(db1);
    const tables2 = await getTables(db2);
    
    console.log(`📊 Total Tables: ${tables1.length} in both databases\n`);
    
    const allTables = [...new Set([...tables1, ...tables2])].sort();
    let schemaDifferences = 0;
    let columnCountDifferences = 0;
    let columnNameDifferences = 0;
    let columnTypeDifferences = 0;
    
    for (const tableName of allTables) {
      const schema1 = await getTableSchema(db1, tableName);
      const schema2 = await getTableSchema(db2, tableName);
      
      // Check if table exists in both
      if (schema1.length === 0 && schema2.length === 0) continue;
      if (schema1.length === 0) {
        console.log(`❌ Table "${tableName}" exists only in cms server 149.db`);
        schemaDifferences++;
        continue;
      }
      if (schema2.length === 0) {
        console.log(`❌ Table "${tableName}" exists only in cms.db`);
        schemaDifferences++;
        continue;
      }
      
      // Compare column count
      if (schema1.length !== schema2.length) {
        console.log(`\n⚠️  Table: ${tableName}`);
        console.log(`   Column count difference:`);
        console.log(`   cms.db: ${schema1.length} columns`);
        console.log(`   cms server 149.db: ${schema2.length} columns`);
        columnCountDifferences++;
        schemaDifferences++;
      }
      
      // Compare each column
      const maxCols = Math.max(schema1.length, schema2.length);
      let hasColumnDiff = false;
      
      for (let i = 0; i < maxCols; i++) {
        const col1 = schema1[i];
        const col2 = schema2[i];
        
        if (!col1 || !col2) {
          if (!hasColumnDiff) {
            console.log(`\n⚠️  Table: ${tableName}`);
            hasColumnDiff = true;
          }
          if (!col1) {
            console.log(`   ❌ Column missing in cms.db: ${col2.name} (${col2.type})`);
          } else {
            console.log(`   ❌ Column missing in cms server 149.db: ${col1.name} (${col1.type})`);
          }
          columnNameDifferences++;
          schemaDifferences++;
          continue;
        }
        
        // Compare column name
        if (col1.name !== col2.name) {
          if (!hasColumnDiff) {
            console.log(`\n⚠️  Table: ${tableName}`);
            hasColumnDiff = true;
          }
          console.log(`   ❌ Column name difference at position ${i}:`);
          console.log(`      cms.db: ${col1.name}`);
          console.log(`      cms server 149.db: ${col2.name}`);
          columnNameDifferences++;
          schemaDifferences++;
        }
        
        // Compare column type
        if (col1.type !== col2.type) {
          if (!hasColumnDiff) {
            console.log(`\n⚠️  Table: ${tableName}`);
            hasColumnDiff = true;
          }
          console.log(`   ⚠️  Column type difference for "${col1.name}":`);
          console.log(`      cms.db: ${col1.type}`);
          console.log(`      cms server 149.db: ${col2.type}`);
          columnTypeDifferences++;
          schemaDifferences++;
        }
        
        // Compare other properties
        if (col1.notnull !== col2.notnull) {
          if (!hasColumnDiff) {
            console.log(`\n⚠️  Table: ${tableName}`);
            hasColumnDiff = true;
          }
          console.log(`   ⚠️  NOT NULL difference for "${col1.name}":`);
          console.log(`      cms.db: ${col1.notnull}`);
          console.log(`      cms server 149.db: ${col2.notnull}`);
          schemaDifferences++;
        }
        
        if (col1.pk !== col2.pk) {
          if (!hasColumnDiff) {
            console.log(`\n⚠️  Table: ${tableName}`);
            hasColumnDiff = true;
          }
          console.log(`   ⚠️  PRIMARY KEY difference for "${col1.name}":`);
          console.log(`      cms.db: ${col1.pk}`);
          console.log(`      cms server 149.db: ${col2.pk}`);
          schemaDifferences++;
        }
        
        // Compare default values (handle null)
        const dflt1 = col1.dflt_value === null ? 'NULL' : col1.dflt_value;
        const dflt2 = col2.dflt_value === null ? 'NULL' : col2.dflt_value;
        if (dflt1 !== dflt2) {
          if (!hasColumnDiff) {
            console.log(`\n⚠️  Table: ${tableName}`);
            hasColumnDiff = true;
          }
          console.log(`   ⚠️  Default value difference for "${col1.name}":`);
          console.log(`      cms.db: ${dflt1}`);
          console.log(`      cms server 149.db: ${dflt2}`);
          schemaDifferences++;
        }
      }
    }
    
    // Summary
    console.log('\n\n' + '='.repeat(80));
    console.log('📊 SCHEMA COMPARISON SUMMARY');
    console.log('='.repeat(80));
    console.log(`\n✅ Total Tables Compared: ${allTables.length}`);
    console.log(`\n📋 Differences Found:`);
    console.log(`   - Schema differences: ${schemaDifferences}`);
    console.log(`   - Column count differences: ${columnCountDifferences}`);
    console.log(`   - Column name differences: ${columnNameDifferences}`);
    console.log(`   - Column type differences: ${columnTypeDifferences}`);
    
    if (schemaDifferences === 0) {
      console.log(`\n✅ PERFECT MATCH! All schemas, column names, and column counts are IDENTICAL!`);
    } else {
      console.log(`\n❌ Differences found in schemas!`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    db1.close();
    db2.close();
  }
}

compareSchemas();


