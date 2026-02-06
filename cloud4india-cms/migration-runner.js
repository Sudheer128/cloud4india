/**
 * Migration Runner for Cloud4India CMS
 * Manages database schema migrations
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path - same as server.js
const dbPath = process.env.DB_PATH || path.join(__dirname, 'cms.db');

/**
 * Get database connection
 */
function getDatabase() {
  return new sqlite3.Database(dbPath);
}

/**
 * Run a single SQL statement
 */
function runSql(db, sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Execute multiple SQL statements (separated by semicolons)
 */
async function runMultipleSql(db, sql) {
  // Split by semicolons, but preserve them for execution
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await runSql(db, stmt);
    } catch (err) {
      // Ignore "already exists" errors for CREATE TABLE IF NOT EXISTS
      if (!err.message.includes('already exists') &&
          !err.message.includes('duplicate column')) {
        throw err;
      }
    }
  }
}

/**
 * Get all rows from a query
 */
function getAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Ensure migration_history table exists
 * Uses 'filename' column to be compatible with existing schema
 */
async function ensureMigrationTable(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS migration_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT UNIQUE NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'completed',
      error_message TEXT
    )
  `;
  await runSql(db, sql);
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations(db) {
  const rows = await getAll(db, 'SELECT filename FROM migration_history ORDER BY id');
  return rows.map(r => r.filename);
}

/**
 * Record a migration as executed
 */
async function recordMigration(db, migrationName) {
  await runSql(db, `INSERT INTO migration_history (filename, status) VALUES ('${migrationName}', 'completed')`);
}

/**
 * Get all migration files from migrations folder
 */
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.log('   No migrations folder found');
    return [];
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.js'))
    .sort(); // Sort alphabetically (001_, 002_, etc.)

  return files;
}

/**
 * Run all pending migrations
 */
async function runAllMigrations() {
  const db = getDatabase();

  try {
    console.log('   Checking for pending migrations...');

    // Ensure migration table exists
    await ensureMigrationTable(db);

    // Get executed migrations
    const executed = await getExecutedMigrations(db);

    // Get migration files
    const migrationFiles = getMigrationFiles();

    if (migrationFiles.length === 0) {
      console.log('   No migration files found');
      return;
    }

    // Find pending migrations
    const pending = migrationFiles.filter(f => !executed.includes(f));

    if (pending.length === 0) {
      console.log('   All migrations are up to date');
      return;
    }

    console.log(`   Found ${pending.length} pending migration(s)`);

    // Run each pending migration
    for (const migrationFile of pending) {
      console.log(`   Running migration: ${migrationFile}`);

      try {
        const migration = require(path.join(__dirname, 'migrations', migrationFile));

        if (migration.up) {
          await runMultipleSql(db, migration.up);
          await recordMigration(db, migrationFile);
          console.log(`   ✅ Completed: ${migrationFile}`);
        } else {
          console.log(`   ⚠️  No 'up' export found in ${migrationFile}`);
        }
      } catch (err) {
        console.error(`   ❌ Error in migration ${migrationFile}:`, err.message);
        throw err;
      }
    }

    console.log('   All migrations completed successfully');
  } finally {
    db.close();
  }
}

/**
 * Rollback the last migration
 */
async function rollbackLastMigration() {
  const db = getDatabase();

  try {
    await ensureMigrationTable(db);

    // Get the last executed migration
    const rows = await getAll(db, 'SELECT filename FROM migration_history ORDER BY id DESC LIMIT 1');

    if (rows.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    const lastMigration = rows[0].filename;
    console.log(`Rolling back: ${lastMigration}`);

    const migration = require(path.join(__dirname, 'migrations', lastMigration));

    if (migration.down) {
      await runMultipleSql(db, migration.down);
      await runSql(db, `DELETE FROM migration_history WHERE filename = '${lastMigration}'`);
      console.log(`✅ Rolled back: ${lastMigration}`);
    } else {
      console.log(`⚠️  No 'down' export found in ${lastMigration}`);
    }
  } finally {
    db.close();
  }
}

// Export for use in server.js
module.exports = {
  runAllMigrations,
  rollbackLastMigration,
};

// Allow running directly from command line
if (require.main === module) {
  const command = process.argv[2] || 'migrate';

  if (command === 'migrate' || command === 'up') {
    console.log('Running migrations...');
    runAllMigrations()
      .then(() => {
        console.log('Done!');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Migration failed:', err);
        process.exit(1);
      });
  } else if (command === 'rollback' || command === 'down') {
    console.log('Rolling back last migration...');
    rollbackLastMigration()
      .then(() => {
        console.log('Done!');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Rollback failed:', err);
        process.exit(1);
      });
  } else {
    console.log('Usage: node migration-runner.js [migrate|rollback]');
    process.exit(1);
  }
}
