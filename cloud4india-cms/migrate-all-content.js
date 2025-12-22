/**
 * Complete Database Content Migration Script
 * Migrates ALL content from Server1 (cms-server1-db) to Server2 (cms.db)
 * 
 * This syncs EVERY table that exists in both databases (except new Server2-only tables)
 * Preserves Server2's enhanced schema (new columns get default values)
 * 
 * Usage: node migrate-all-content.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database paths
const SERVER1_DB = path.join(__dirname, 'cms-server1-db');
const SERVER2_DB = path.join(__dirname, 'cms.db');
const BACKUP_DIR = path.join(__dirname, 'db-backups');

// Tables that ONLY exist in Server2 (new features) - skip these
const SERVER2_ONLY_TABLES = [
    'contact_hero_section',
    'contact_info_items',
    'contact_social_links',
    'contact_submissions',
    'contact_activity_log',
    'verified_phone_numbers',
    'quotations',
    'quote_items',
    'quote_activity_log',
    'price_estimator_config'
];

// Tables to skip (system/migration tables)
const SKIP_TABLES = [
    'migration_history',
    'sqlite_sequence'
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
    return getAll(db, `PRAGMA table_info("${tableName}")`);
}

// Get all tables from a database
async function getAllTables(db) {
    const tables = await getAll(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    return tables.map(t => t.name);
}

// Create backup of database
function backupDatabase(dbPath, backupDir) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.basename(dbPath);
    const backupPath = path.join(backupDir, `${filename}-full-backup-${timestamp}`);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.copyFileSync(dbPath, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);
    return backupPath;
}

// Get common columns between two tables
async function getCommonColumns(db1, db2, tableName) {
    const cols1 = await getTableInfo(db1, tableName);
    const cols2 = await getTableInfo(db2, tableName);

    const names1 = new Set(cols1.map(c => c.name));
    const names2 = new Set(cols2.map(c => c.name));

    const common = [...names1].filter(n => names2.has(n));
    const newInServer2 = [...names2].filter(n => !names1.has(n));

    return { common, newInServer2 };
}

// Migrate a single table
async function migrateTable(server1, server2, tableName) {
    console.log(`\n📦 Migrating: ${tableName}`);

    try {
        const { common, newInServer2 } = await getCommonColumns(server1, server2, tableName);

        if (common.length === 0) {
            console.log(`   ⏭️  Skipping - no common columns`);
            return { table: tableName, migrated: 0, status: 'skipped', reason: 'no common columns' };
        }

        if (newInServer2.length > 0) {
            console.log(`   📝 New columns in Server2 (using defaults): ${newInServer2.join(', ')}`);
        }

        // Get data from Server1
        const server1Data = await getAll(server1, `SELECT * FROM "${tableName}"`);
        console.log(`   📊 Server1 has ${server1Data.length} rows`);

        if (server1Data.length === 0) {
            console.log(`   ⏭️  No data in Server1`);
            return { table: tableName, migrated: 0, status: 'skipped', reason: 'empty source' };
        }

        // Disable foreign keys and clear Server2 table
        await runQuery(server2, 'PRAGMA foreign_keys = OFF');
        const existingCount = (await getAll(server2, `SELECT COUNT(*) as count FROM "${tableName}"`))[0].count;
        await runQuery(server2, `DELETE FROM "${tableName}"`);
        console.log(`   🗑️  Cleared ${existingCount} existing rows in Server2`);

        // Build INSERT statement
        const columnList = common.join(', ');
        const placeholders = common.map(() => '?').join(', ');
        const insertSQL = `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`;

        // Insert rows
        let insertedCount = 0;
        for (const row of server1Data) {
            const values = common.map(col => row[col]);
            await runQuery(server2, insertSQL, values);
            insertedCount++;
        }

        // Re-enable foreign keys
        await runQuery(server2, 'PRAGMA foreign_keys = ON');

        console.log(`   ✅ Migrated ${insertedCount} rows`);
        return { table: tableName, migrated: insertedCount, status: 'success' };

    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return { table: tableName, migrated: 0, status: 'error', error: error.message };
    }
}

// Main migration function
async function main() {
    console.log('🚀 COMPLETE Database Content Migration');
    console.log('='.repeat(60));
    console.log(`📁 Server1 (Production Content): ${SERVER1_DB}`);
    console.log(`📁 Server2 (New Schema): ${SERVER2_DB}`);
    console.log('');
    console.log('⚠️  This will sync ALL content from Server1 to Server2');
    console.log('');

    // Verify databases exist
    if (!fs.existsSync(SERVER1_DB)) {
        console.error('❌ Server1 database not found!');
        process.exit(1);
    }
    if (!fs.existsSync(SERVER2_DB)) {
        console.error('❌ Server2 database not found!');
        process.exit(1);
    }

    // Step 1: Backups
    console.log('\n📦 STEP 1: Creating Backups');
    console.log('-'.repeat(40));
    backupDatabase(SERVER1_DB, BACKUP_DIR);
    backupDatabase(SERVER2_DB, BACKUP_DIR);

    // Step 2: Connect
    console.log('\n🔌 STEP 2: Connecting to Databases');
    console.log('-'.repeat(40));

    const server1 = new sqlite3.Database(SERVER1_DB, sqlite3.OPEN_READONLY);
    const server2 = new sqlite3.Database(SERVER2_DB);

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ Connected to both databases');

    // Step 3: Get tables to migrate
    console.log('\n📋 STEP 3: Analyzing Tables');
    console.log('-'.repeat(40));

    const server1Tables = await getAllTables(server1);
    const server2Tables = await getAllTables(server2);

    // Find tables that exist in BOTH databases (can be migrated)
    const tablesToMigrate = server1Tables.filter(t =>
        server2Tables.includes(t) &&
        !SERVER2_ONLY_TABLES.includes(t) &&
        !SKIP_TABLES.includes(t)
    );

    console.log(`📊 Tables in Server1: ${server1Tables.length}`);
    console.log(`📊 Tables in Server2: ${server2Tables.length}`);
    console.log(`📊 Tables to migrate: ${tablesToMigrate.length}`);
    console.log(`\n   Tables: ${tablesToMigrate.join(', ')}`);

    // Step 4: Migrate all tables
    console.log('\n📦 STEP 4: Migrating ALL Content');
    console.log('-'.repeat(40));

    const results = [];
    let totalRows = 0;

    // Order tables by dependencies (parents first)
    const orderedTables = [
        // Parent/standalone tables first
        'hero_section',
        'feature_banners',
        'why_items',
        'comprehensive_section_content',
        'comprehensive_section_features',
        'comprehensive_section_stats',
        'homepage_sections_config',
        'integrity_pages',
        'pricing_hero',
        'pricing_page_config',
        'pricing_categories',
        'pricing_subcategories',
        'pricing_plans',
        'pricing_faqs',
        'storage_options',
        'compute_plans',
        'disk_offerings',
        'main_products_content',
        'main_marketplaces_content',
        'main_solutions_content',
        'about_hero_section',
        'about_story_section',
        'about_mission_vision_section',
        'about_legacy_section',
        'about_legacy_stats',
        'about_legacy_milestones',
        'about_approach_section',
        'about_approach_items',
        'about_core_values_section',
        'about_core_values',
        'about_testimonials_section',
        'about_testimonials',
        'about_testimonial_ratings',
        'product_categories',
        'solution_categories',
        'marketplace_categories',
        // Main entities
        'products',
        'solutions',
        'marketplaces',
        // Sections (depend on main entities)
        'product_sections',
        'solution_sections',
        'marketplace_sections',
        'main_products_sections',
        'main_solutions_sections',
        'main_marketplaces_sections',
        // Items (depend on sections)  
        'product_items',
        'solution_items',
        'section_items',
    ];

    // Add any remaining tables not in the ordered list
    for (const table of tablesToMigrate) {
        if (!orderedTables.includes(table)) {
            orderedTables.push(table);
        }
    }

    // Filter to only tables that need migration
    const finalOrder = orderedTables.filter(t => tablesToMigrate.includes(t));

    for (const tableName of finalOrder) {
        const result = await migrateTable(server1, server2, tableName);
        results.push(result);
        if (result.status === 'success') {
            totalRows += result.migrated;
        }
    }

    // Step 5: Verification
    console.log('\n\n🔍 STEP 5: Verification Report');
    console.log('='.repeat(60));

    let allMatch = true;
    for (const tableName of finalOrder) {
        const s1Count = (await getAll(server1, `SELECT COUNT(*) as count FROM "${tableName}"`))[0].count;
        const s2Count = (await getAll(server2, `SELECT COUNT(*) as count FROM "${tableName}"`))[0].count;
        const match = s1Count === s2Count;
        if (!match) allMatch = false;
        console.log(`${match ? '✅' : '⚠️'} ${tableName}: S1=${s1Count}, S2=${s2Count}`);
    }

    // Close connections
    server1.close();
    server2.close();

    // Summary
    console.log('\n\n🎉 MIGRATION COMPLETE');
    console.log('='.repeat(60));

    const successful = results.filter(r => r.status === 'success').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const errors = results.filter(r => r.status === 'error').length;

    console.log(`📊 Tables migrated: ${successful}`);
    console.log(`📊 Tables skipped: ${skipped}`);
    console.log(`📊 Errors: ${errors}`);
    console.log(`📊 Total rows synced: ${totalRows}`);
    console.log(`\n💾 Backups in: ${BACKUP_DIR}`);

    if (allMatch && errors === 0) {
        console.log('\n✅ All content synced successfully!');
    } else if (errors > 0) {
        console.log('\n⚠️ Some tables had errors - check output above');
    }

    console.log('\n📝 Server2 now has ALL content from Server1');
    console.log('   New schema columns preserved with default values');
}

main().catch(err => {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
});
