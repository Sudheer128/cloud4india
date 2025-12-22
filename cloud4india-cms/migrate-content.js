/**
 * Database Content Migration Script
 * Migrates content from Server1 (cms-server1-db) to Server2 (cms.db)
 * 
 * Strategy:
 * - Server2 has new schema columns (pricing headers, icon, etc.)
 * - Server1 has the real production content
 * - We copy content from Server1 to Server2, preserving Server2's schema
 * - New columns in Server2 will have default values after migration
 * 
 * Usage: node migrate-content.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database paths
const SERVER1_DB = path.join(__dirname, 'cms-server1-db');
const SERVER2_DB = path.join(__dirname, 'cms.db');
const BACKUP_DIR = path.join(__dirname, 'db-backups');

// Tables to migrate (in order - parent tables first, then children)
const MIGRATION_ORDER = [
    // Parent tables first
    { name: 'solutions', idColumn: 'id' },
    { name: 'products', idColumn: 'id' },
    { name: 'marketplaces', idColumn: 'id' },

    // Section tables (depend on parent tables)
    { name: 'solution_sections', idColumn: 'id', fk: 'solution_id' },
    { name: 'product_sections', idColumn: 'id', fk: 'product_id' },
    { name: 'marketplace_sections', idColumn: 'id', fk: 'marketplace_id' },

    // Item tables (depend on section tables)
    { name: 'solution_items', idColumn: 'id', fk: 'section_id' },
    { name: 'product_items', idColumn: 'id', fk: 'section_id' },
    { name: 'section_items', idColumn: 'id', fk: 'section_id' },

    // Main page sections
    { name: 'main_products_sections', idColumn: 'id', fk: 'product_id' },
    { name: 'main_solutions_sections', idColumn: 'id', fk: 'solution_id' },
];

// Helper to promisify sqlite3
function runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function getAll(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getTableInfo(db, tableName) {
    return getAll(db, `PRAGMA table_info(${tableName})`);
}

// Create backup of database
function backupDatabase(dbPath, backupDir) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.basename(dbPath);
    const backupPath = path.join(backupDir, `${filename}-backup-${timestamp}`);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.copyFileSync(dbPath, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);
    return backupPath;
}

// Get common columns between two tables (for safe migration)
async function getCommonColumns(db1, db2, tableName) {
    const cols1 = await getTableInfo(db1, tableName);
    const cols2 = await getTableInfo(db2, tableName);

    const names1 = new Set(cols1.map(c => c.name));
    const names2 = new Set(cols2.map(c => c.name));

    // Common columns (exist in both)
    const common = [...names1].filter(n => names2.has(n));

    // New columns in Server2 only
    const newInServer2 = [...names2].filter(n => !names1.has(n));

    return { common, newInServer2 };
}

// Migrate a single table
async function migrateTable(server1, server2, tableConfig) {
    const { name: tableName } = tableConfig;

    console.log(`\n📦 Migrating table: ${tableName}`);

    try {
        // Get column info
        const { common, newInServer2 } = await getCommonColumns(server1, server2, tableName);

        if (newInServer2.length > 0) {
            console.log(`   📝 New columns in Server2 (will use defaults): ${newInServer2.join(', ')}`);
        }

        // Get data from Server1
        const server1Data = await getAll(server1, `SELECT * FROM "${tableName}"`);
        console.log(`   📊 Found ${server1Data.length} rows in Server1`);

        if (server1Data.length === 0) {
            console.log(`   ⏭️  Skipping (no data in Server1)`);
            return { table: tableName, migrated: 0, skipped: true };
        }

        // Disable foreign keys temporarily and clear Server2 table
        await runQuery(server2, 'PRAGMA foreign_keys = OFF');
        await runQuery(server2, `DELETE FROM "${tableName}"`);
        console.log(`   🗑️  Cleared existing data in Server2`);

        // Build INSERT statement using only common columns
        const columnList = common.join(', ');
        const placeholders = common.map(() => '?').join(', ');
        const insertSQL = `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`;

        // Insert each row
        let insertedCount = 0;
        for (const row of server1Data) {
            const values = common.map(col => row[col]);
            await runQuery(server2, insertSQL, values);
            insertedCount++;
        }

        // Re-enable foreign keys
        await runQuery(server2, 'PRAGMA foreign_keys = ON');

        console.log(`   ✅ Migrated ${insertedCount} rows`);
        return { table: tableName, migrated: insertedCount, skipped: false };

    } catch (error) {
        console.error(`   ❌ Error migrating ${tableName}: ${error.message}`);
        throw error;
    }
}

// Verify migration
async function verifyMigration(server1, server2) {
    console.log('\n\n📋 VERIFICATION REPORT');
    console.log('='.repeat(60));

    const results = [];

    for (const tableConfig of MIGRATION_ORDER) {
        const tableName = tableConfig.name;
        const s1Count = (await getAll(server1, `SELECT COUNT(*) as count FROM "${tableName}"`))[0].count;
        const s2Count = (await getAll(server2, `SELECT COUNT(*) as count FROM "${tableName}"`))[0].count;

        const status = s1Count === s2Count ? '✅' : '⚠️';
        console.log(`${status} ${tableName}: Server1=${s1Count}, Server2=${s2Count}`);
        results.push({ table: tableName, server1: s1Count, server2: s2Count, match: s1Count === s2Count });
    }

    const allMatch = results.every(r => r.match);
    console.log('\n' + (allMatch ? '✅ All tables migrated successfully!' : '⚠️ Some tables have mismatched counts'));

    return allMatch;
}

// Main migration function
async function main() {
    console.log('🚀 Database Content Migration');
    console.log('='.repeat(60));
    console.log(`📁 Server1 (Source): ${SERVER1_DB}`);
    console.log(`📁 Server2 (Target): ${SERVER2_DB}`);
    console.log('');

    // Verify both databases exist
    if (!fs.existsSync(SERVER1_DB)) {
        console.error('❌ Server1 database not found!');
        process.exit(1);
    }
    if (!fs.existsSync(SERVER2_DB)) {
        console.error('❌ Server2 database not found!');
        process.exit(1);
    }

    // Step 1: Create backups
    console.log('\n📦 STEP 1: Creating Backups');
    console.log('-'.repeat(40));
    backupDatabase(SERVER1_DB, BACKUP_DIR);
    backupDatabase(SERVER2_DB, BACKUP_DIR);

    // Step 2: Open database connections
    console.log('\n🔌 STEP 2: Opening Database Connections');
    console.log('-'.repeat(40));

    const server1 = new sqlite3.Database(SERVER1_DB, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('❌ Failed to open Server1 database:', err.message);
            process.exit(1);
        }
        console.log('✅ Connected to Server1 database (read-only)');
    });

    const server2 = new sqlite3.Database(SERVER2_DB, (err) => {
        if (err) {
            console.error('❌ Failed to open Server2 database:', err.message);
            process.exit(1);
        }
        console.log('✅ Connected to Server2 database');
    });

    // Wait for connections
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 3: Migrate tables
    console.log('\n📦 STEP 3: Migrating Content');
    console.log('-'.repeat(40));

    const migrationResults = [];

    for (const tableConfig of MIGRATION_ORDER) {
        try {
            const result = await migrateTable(server1, server2, tableConfig);
            migrationResults.push(result);
        } catch (error) {
            console.error(`\n❌ Migration failed at table: ${tableConfig.name}`);
            console.error(`   Error: ${error.message}`);

            // Close databases
            server1.close();
            server2.close();
            process.exit(1);
        }
    }

    // Step 4: Verify migration
    console.log('\n🔍 STEP 4: Verifying Migration');
    console.log('-'.repeat(40));

    const verified = await verifyMigration(server1, server2);

    // Close databases
    server1.close(() => console.log('\n📤 Closed Server1 connection'));
    server2.close(() => console.log('📤 Closed Server2 connection'));

    // Final summary
    console.log('\n\n🎉 MIGRATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Tables migrated: ${migrationResults.filter(r => !r.skipped).length}`);
    console.log(`📊 Tables skipped: ${migrationResults.filter(r => r.skipped).length}`);
    console.log(`📊 Total rows migrated: ${migrationResults.reduce((sum, r) => sum + (r.migrated || 0), 0)}`);
    console.log(`\n💾 Backups stored in: ${BACKUP_DIR}`);

    if (verified) {
        console.log('\n✅ Migration verified successfully!');
        console.log('\n📝 Next steps:');
        console.log('   1. Test your application with the migrated database');
        console.log('   2. Verify content displays correctly');
        console.log('   3. If issues occur, restore from backup in db-backups/');
    }
}

// Run migration
main().catch(err => {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
});
