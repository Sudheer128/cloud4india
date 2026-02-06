const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db1Path = path.join(__dirname, 'cms.db');
const db2Path = path.join(__dirname, 'cms server 149.db');

// Open both databases
const db1 = new sqlite3.Database(db1Path);
const db2 = new sqlite3.Database(db2Path);

const differences = {
  tables: {
    missingInDb2: [],
    missingInDb1: [],
    different: []
  },
  schemas: {},
  rowCounts: {},
  data: {}
};

// Get all table names from both databases
function getTables(db) {
  return new Promise((resolve, reject) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(r => r.name));
    });
  });
}

// Get table schema
function getTableSchema(db, tableName) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Get row count
function getRowCount(db, tableName) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.count : 0);
    });
  });
}

// Get all data from a table
function getTableData(db, tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName} ORDER BY rowid`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Compare two objects deeply
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

// Compare schemas
function compareSchemas(schema1, schema2) {
  if (schema1.length !== schema2.length) return false;
  
  for (let i = 0; i < schema1.length; i++) {
    const col1 = schema1[i];
    const col2 = schema2[i];
    
    if (col1.cid !== col2.cid ||
        col1.name !== col2.name ||
        col1.type !== col2.type ||
        col1.notnull !== col2.notnull ||
        col1.dflt_value !== col2.dflt_value ||
        col1.pk !== col2.pk) {
      return false;
    }
  }
  
  return true;
}

// Compare table data
function compareTableData(data1, data2, tableName) {
  const differences = [];
  
  if (data1.length !== data2.length) {
    differences.push({
      type: 'row_count',
      db1_count: data1.length,
      db2_count: data2.length
    });
  }
  
  const minLength = Math.min(data1.length, data2.length);
  
  for (let i = 0; i < minLength; i++) {
    const row1 = data1[i];
    const row2 = data2[i];
    
    if (!deepEqual(row1, row2)) {
      // Find specific field differences
      const fieldDiffs = {};
      const allKeys = new Set([...Object.keys(row1), ...Object.keys(row2)]);
      
      for (let key of allKeys) {
        const val1 = row1[key];
        const val2 = row2[key];
        
        if (val1 !== val2) {
          fieldDiffs[key] = {
            db1: val1,
            db2: val2
          };
        }
      }
      
      differences.push({
        type: 'row_data',
        row_index: i,
        rowid_db1: row1.rowid,
        rowid_db2: row2.rowid,
        field_differences: fieldDiffs
      });
    }
  }
  
  // Check for extra rows
  if (data1.length > data2.length) {
    for (let i = data2.length; i < data1.length; i++) {
      differences.push({
        type: 'extra_row_db1',
        row_index: i,
        row_data: data1[i]
      });
    }
  } else if (data2.length > data1.length) {
    for (let i = data1.length; i < data2.length; i++) {
      differences.push({
        type: 'extra_row_db2',
        row_index: i,
        row_data: data2[i]
      });
    }
  }
  
  return differences;
}

// Main comparison function
async function compareDatabases() {
  console.log('🔍 Starting database comparison...\n');
  
  try {
    // Get all tables from both databases
    const tables1 = await getTables(db1);
    const tables2 = await getTables(db2);
    
    console.log(`📊 Database 1 (cms.db): ${tables1.length} tables`);
    console.log(`📊 Database 2 (cms server 149.db): ${tables2.length} tables\n`);
    
    // Find missing tables
    const missingInDb2 = tables1.filter(t => !tables2.includes(t));
    const missingInDb1 = tables2.filter(t => !tables1.includes(t));
    
    if (missingInDb2.length > 0) {
      differences.tables.missingInDb2 = missingInDb2;
      console.log(`⚠️  Tables in db1 but not in db2: ${missingInDb2.join(', ')}`);
    }
    
    if (missingInDb1.length > 0) {
      differences.tables.missingInDb1 = missingInDb1;
      console.log(`⚠️  Tables in db2 but not in db1: ${missingInDb1.join(', ')}`);
    }
    
    // Get common tables
    const commonTables = tables1.filter(t => tables2.includes(t));
    console.log(`\n📋 Comparing ${commonTables.length} common tables...\n`);
    
    // Compare each common table
    for (const tableName of commonTables) {
      console.log(`\n🔸 Comparing table: ${tableName}`);
      
      // Compare schemas
      const schema1 = await getTableSchema(db1, tableName);
      const schema2 = await getTableSchema(db2, tableName);
      
      if (!compareSchemas(schema1, schema2)) {
        differences.schemas[tableName] = {
          db1: schema1,
          db2: schema2
        };
        console.log(`  ❌ Schema difference detected!`);
      } else {
        console.log(`  ✅ Schemas match`);
      }
      
      // Compare row counts
      const count1 = await getRowCount(db1, tableName);
      const count2 = await getRowCount(db2, tableName);
      
      differences.rowCounts[tableName] = {
        db1: count1,
        db2: count2
      };
      
      if (count1 !== count2) {
        console.log(`  ⚠️  Row count difference: db1=${count1}, db2=${count2}`);
      } else {
        console.log(`  ✅ Row counts match: ${count1} rows`);
      }
      
      // Compare data
      const data1 = await getTableData(db1, tableName);
      const data2 = await getTableData(db2, tableName);
      
      const dataDiffs = compareTableData(data1, data2, tableName);
      
      if (dataDiffs.length > 0) {
        differences.data[tableName] = dataDiffs;
        console.log(`  ❌ Data differences found: ${dataDiffs.length} issue(s)`);
        
        // Show summary of differences
        const rowCountDiffs = dataDiffs.filter(d => d.type === 'row_count').length;
        const rowDataDiffs = dataDiffs.filter(d => d.type === 'row_data').length;
        const extraRowsDb1 = dataDiffs.filter(d => d.type === 'extra_row_db1').length;
        const extraRowsDb2 = dataDiffs.filter(d => d.type === 'extra_row_db2').length;
        
        if (rowCountDiffs > 0) console.log(`     - Row count differences: ${rowCountDiffs}`);
        if (rowDataDiffs > 0) console.log(`     - Row data differences: ${rowDataDiffs}`);
        if (extraRowsDb1 > 0) console.log(`     - Extra rows in db1: ${extraRowsDb1}`);
        if (extraRowsDb2 > 0) console.log(`     - Extra rows in db2: ${extraRowsDb2}`);
      } else {
        console.log(`  ✅ All data matches`);
      }
    }
    
    // Generate summary report
    console.log('\n\n' + '='.repeat(80));
    console.log('📊 COMPARISON SUMMARY');
    console.log('='.repeat(80));
    
    const tablesWithSchemaDiffs = Object.keys(differences.schemas).length;
    const tablesWithRowCountDiffs = Object.keys(differences.rowCounts).filter(
      t => differences.rowCounts[t].db1 !== differences.rowCounts[t].db2
    ).length;
    const tablesWithDataDiffs = Object.keys(differences.data).length;
    
    console.log(`\n📋 Tables with schema differences: ${tablesWithSchemaDiffs}`);
    console.log(`📋 Tables with row count differences: ${tablesWithRowCountDiffs}`);
    console.log(`📋 Tables with data differences: ${tablesWithDataDiffs}`);
    
    if (tablesWithSchemaDiffs > 0 || tablesWithRowCountDiffs > 0 || tablesWithDataDiffs > 0) {
      console.log('\n❌ DIFFERENCES FOUND!');
      
      // Save detailed report to file
      const fs = require('fs');
      const reportPath = path.join(__dirname, 'database-comparison-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(differences, null, 2));
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    } else {
      console.log('\n✅ NO DIFFERENCES FOUND - Databases are identical!');
    }
    
  } catch (error) {
    console.error('❌ Error during comparison:', error);
  } finally {
    db1.close();
    db2.close();
  }
}

// Run comparison
compareDatabases().catch(console.error);


