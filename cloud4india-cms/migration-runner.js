#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Configuration
const DB_PATH = process.env.DB_PATH || './cms.db';
const MIGRATIONS_DIR = __dirname;

console.log('🚀 Starting Cloud4India CMS Migration System');
console.log(`📊 Database: ${DB_PATH}`);
console.log(`📁 Migrations Directory: ${MIGRATIONS_DIR}`);
console.log('=' .repeat(60));

// List of migration files in order of execution
const MIGRATION_FILES = [
  // Core product migrations
  'migrate-basic-cloud-servers.js',
  'create-product-tables.js',
  
  // Financial services migrations
  'migrate-financial-sections.js',
  'migrate-real-financial-sections.js',
  '../scripts/migrate-financial-services-sections.js',
  
  // Content migrations
  '../migrate-hsbc-metrics.js',
  '../migrate-implementation-journey.js',
  '../migrate-tech-solutions.js',
  '../migrate-use-cases.js',
  '../migrate-resources-docs.js',
  
  // Section items migrations
  'migrate-all-section-items.js',
  
  // Update scripts
  'update-products.js'
];

// Migration tracking table
const createMigrationTable = (db) => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS migration_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT UNIQUE NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'completed',
        error_message TEXT
      )
    `, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Migration tracking table ready');
        resolve();
      }
    });
  });
};

// Check if migration was already executed
const isMigrationExecuted = (db, filename) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM migration_history WHERE filename = ? AND status = "completed"',
      [filename],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      }
    );
  });
};

// Record migration execution
const recordMigration = (db, filename, status = 'completed', errorMessage = null) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO migration_history (filename, status, error_message, executed_at) VALUES (?, ?, ?, datetime("now"))',
      [filename, status, errorMessage],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

// Execute a single migration file using child process
const executeMigration = async (db, filename) => {
  const fullPath = path.resolve(MIGRATIONS_DIR, filename);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Migration file not found: ${filename}`);
    return false;
  }

  // Check if already executed
  const alreadyExecuted = await isMigrationExecuted(db, filename);
  if (alreadyExecuted) {
    console.log(`⏭️  Skipping already executed migration: ${filename}`);
    return true;
  }

  console.log(`🔄 Executing migration: ${filename}`);

  return new Promise((resolve) => {
    // Create a temporary modified version of the migration file
    let migrationContent = fs.readFileSync(fullPath, 'utf8');
    
    // Update database path in the migration
    migrationContent = migrationContent.replace(
      /['"`]\.?\/?(cms|cloud4india|database)\.db['"`]/g,
      `"${DB_PATH}"`
    );
    
    // Create temporary file
    const tempFile = path.join(MIGRATIONS_DIR, `temp_${Date.now()}_${path.basename(filename)}`);
    fs.writeFileSync(tempFile, migrationContent);
    
    // Execute migration in child process
    const migrationProcess = spawn('node', [tempFile], {
      cwd: path.dirname(fullPath),
      env: {
        ...process.env,
        DB_PATH: path.resolve(MIGRATIONS_DIR, DB_PATH)
      }
    });

    let output = '';
    let errorOutput = '';

    migrationProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });

    migrationProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      process.stderr.write(data);
    });

    migrationProcess.on('close', async (code) => {
      // Clean up temporary file
      try {
        fs.unlinkSync(tempFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      if (code === 0) {
        try {
          await recordMigration(db, filename, 'completed');
          console.log(`✅ Successfully executed: ${filename}`);
          resolve(true);
        } catch (err) {
          console.error(`❌ Error recording migration ${filename}:`, err.message);
          resolve(false);
        }
      } else {
        try {
          await recordMigration(db, filename, 'failed', errorOutput || `Exit code: ${code}`);
          console.error(`❌ Migration failed: ${filename} (exit code: ${code})`);
          resolve(false);
        } catch (err) {
          console.error(`❌ Error recording failed migration ${filename}:`, err.message);
          resolve(false);
        }
      }
    });

    migrationProcess.on('error', async (error) => {
      // Clean up temporary file
      try {
        fs.unlinkSync(tempFile);
      } catch (err) {
        // Ignore cleanup errors
      }

      try {
        await recordMigration(db, filename, 'failed', error.message);
        console.error(`❌ Error executing migration ${filename}:`, error.message);
        resolve(false);
      } catch (err) {
        console.error(`❌ Error recording failed migration ${filename}:`, err.message);
        resolve(false);
      }
    });
  });
};

// Main migration function
const runAllMigrations = async () => {
  let db;
  
  try {
    // Connect to database
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Error connecting to database:', err.message);
        if (require.main === module) {
          process.exit(1);
        } else {
          throw err;
        }
      }
      console.log('✅ Connected to SQLite database');
    });

    // Create migration tracking table
    await createMigrationTable(db);

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    // Execute each migration
    for (const filename of MIGRATION_FILES) {
      try {
        const result = await executeMigration(db, filename);
        if (result === true) {
          successCount++;
        } else if (result === false) {
          failCount++;
        }
      } catch (error) {
        console.error(`❌ Critical error with migration ${filename}:`, error.message);
        failCount++;
      }
    }

    // Show summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📁 Total: ${MIGRATION_FILES.length}`);

    // Show migration history
    console.log('\n📋 Migration History:');
    db.all(
      'SELECT filename, status, executed_at FROM migration_history ORDER BY executed_at DESC LIMIT 10',
      (err, rows) => {
        if (err) {
          console.error('Error fetching migration history:', err.message);
        } else {
          console.table(rows);
        }
        
        // Close database
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('📝 Database connection closed');
          }
          
          if (failCount > 0) {
            console.log('\n⚠️  Some migrations failed. Check the logs above.');
            if (require.main === module) {
              process.exit(1);
            }
          } else {
            console.log('\n🎉 All migrations completed successfully!');
            if (require.main === module) {
              process.exit(0);
            }
          }
        });
      }
    );

  } catch (error) {
    console.error('❌ Critical migration error:', error.message);
    if (db) {
      db.close();
    }
    
    // Only exit if running as main module, otherwise throw error for caller to handle
    if (require.main === module) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

// Handle process signals (only when running as main module)
if (require.main === module) {
  process.on('SIGINT', () => {
    console.log('\n⚠️  Migration interrupted by user');
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('\n⚠️  Migration terminated');
    process.exit(1);
  });
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runAllMigrations();
}

module.exports = {
  runAllMigrations,
  executeMigration,
  MIGRATION_FILES
};
