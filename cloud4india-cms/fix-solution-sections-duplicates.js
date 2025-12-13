#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuration
const DB_PATH = process.env.DB_PATH || './cms.db';

console.log('🔧 Fixing duplicate solution sections and adding unique constraint...');
console.log(`📊 Database: ${DB_PATH}`);
console.log('=' .repeat(60));

// Connect to database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Function to execute a SQL statement
const runSQL = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Function to get all rows
const allSQL = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Main migration function
const migrate = async () => {
  try {
    console.log('\n📋 Step 1: Checking for duplicate solution sections...');
    
    // Find duplicate solution_ids
    const duplicates = await allSQL(`
      SELECT solution_id, COUNT(*) as count
      FROM main_solutions_sections
      GROUP BY solution_id
      HAVING count > 1
    `);
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicates found in main_solutions_sections');
    } else {
      console.log(`⚠️  Found ${duplicates.length} solution(s) with duplicate entries:`);
      console.table(duplicates);
      
      console.log('\n🧹 Step 2: Removing duplicate entries (keeping the oldest one)...');
      
      for (const dup of duplicates) {
        // Get all entries for this solution_id, ordered by id (oldest first)
        const entries = await allSQL(`
          SELECT id FROM main_solutions_sections
          WHERE solution_id = ?
          ORDER BY id ASC
        `, [dup.solution_id]);
        
        // Keep the first entry, delete the rest
        const toDelete = entries.slice(1).map(e => e.id);
        
        if (toDelete.length > 0) {
          console.log(`   Deleting ${toDelete.length} duplicate(s) for solution_id ${dup.solution_id}...`);
          for (const id of toDelete) {
            await runSQL('DELETE FROM main_solutions_sections WHERE id = ?', [id]);
          }
          console.log(`   ✅ Cleaned up solution_id ${dup.solution_id}`);
        }
      }
      
      console.log('✅ All duplicates removed');
    }
    
    console.log('\n🔒 Step 3: Checking for unique index on solution_id...');
    
    // Check if unique index already exists
    const indexes = await allSQL(`
      SELECT name FROM sqlite_master
      WHERE type = 'index'
      AND tbl_name = 'main_solutions_sections'
      AND sql LIKE '%solution_id%'
      AND sql LIKE '%UNIQUE%'
    `);
    
    if (indexes.length > 0) {
      console.log('✅ Unique index already exists on solution_id');
    } else {
      console.log('   Creating unique index on solution_id...');
      await runSQL(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_main_solutions_sections_solution_id
        ON main_solutions_sections(solution_id)
      `);
      console.log('✅ Unique index created successfully');
    }
    
    console.log('\n📊 Step 4: Verifying the fix...');
    
    // Count total entries
    const totalResult = await allSQL('SELECT COUNT(*) as total FROM main_solutions_sections');
    const total = totalResult[0].total;
    
    // Count unique solution_ids
    const uniqueResult = await allSQL('SELECT COUNT(DISTINCT solution_id) as unique_count FROM main_solutions_sections');
    const uniqueCount = uniqueResult[0].unique_count;
    
    console.log(`   Total entries: ${total}`);
    console.log(`   Unique solution_ids: ${uniqueCount}`);
    
    if (total === uniqueCount) {
      console.log('✅ Verification passed: No duplicates remain');
    } else {
      console.log('⚠️  Warning: Mismatch detected, some entries might have NULL solution_id');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration completed successfully!');
    console.log('   - Duplicates removed');
    console.log('   - Unique constraint added');
    console.log('   - Future duplicates will be prevented');
    
  } catch (error) {
    console.error('\n❌ Migration error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        process.exit(1);
      } else {
        console.log('\n📝 Database connection closed');
        process.exit(0);
      }
    });
  }
};

// Run migration
migrate();

