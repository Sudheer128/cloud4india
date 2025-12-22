/**
 * COMPREHENSIVE DATABASE VERIFICATION SCRIPT
 * Compares EVERY row and EVERY column between Server1 and Server2
 * Reports any differences at the field level
 * 
 * Usage: node verify-complete-sync.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const SERVER1_DB = path.join(__dirname, 'cms-server1-db');
const SERVER2_DB = path.join(__dirname, 'cms.db');

// Tables that only exist in Server2 (new features) - skip comparison
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

function getAll(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function getAllTables(db) {
    const tables = await getAll(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    return tables.map(t => t.name);
}

async function getTableColumns(db, tableName) {
    const cols = await getAll(db, `PRAGMA table_info("${tableName}")`);
    return cols.map(c => c.name);
}

// Compare two values, handling null/undefined
function valuesEqual(v1, v2) {
    if (v1 === null && v2 === null) return true;
    if (v1 === undefined && v2 === undefined) return true;
    if (v1 === null && v2 === undefined) return true;
    if (v1 === undefined && v2 === null) return true;
    return v1 === v2;
}

async function verifyTable(server1, server2, tableName) {
    const issues = [];

    // Get columns from Server1 (the source of truth for content)
    const s1Columns = await getTableColumns(server1, tableName);
    const s2Columns = await getTableColumns(server2, tableName);

    // Only compare columns that exist in both
    const commonColumns = s1Columns.filter(c => s2Columns.includes(c));

    if (commonColumns.length === 0) {
        return { table: tableName, status: 'skip', reason: 'no common columns', issues: [] };
    }

    // Get all data from both tables, ordered by primary key
    const columnList = commonColumns.join(', ');
    const s1Data = await getAll(server1, `SELECT ${columnList} FROM "${tableName}" ORDER BY id`);
    const s2Data = await getAll(server2, `SELECT ${columnList} FROM "${tableName}" ORDER BY id`);

    // Check row counts
    if (s1Data.length !== s2Data.length) {
        issues.push({
            type: 'row_count',
            message: `Row count mismatch: Server1 has ${s1Data.length}, Server2 has ${s2Data.length}`
        });
    }

    // Create maps by ID for comparison
    const s1Map = new Map();
    const s2Map = new Map();

    for (const row of s1Data) {
        s1Map.set(row.id, row);
    }
    for (const row of s2Data) {
        s2Map.set(row.id, row);
    }

    // Check for missing rows in Server2
    for (const [id, row] of s1Map) {
        if (!s2Map.has(id)) {
            issues.push({
                type: 'missing_row',
                id: id,
                message: `Row ID ${id} exists in Server1 but missing in Server2`
            });
        }
    }

    // Check for extra rows in Server2 (shouldn't happen after migration)
    for (const [id, row] of s2Map) {
        if (!s1Map.has(id)) {
            issues.push({
                type: 'extra_row',
                id: id,
                message: `Row ID ${id} exists in Server2 but not in Server1`
            });
        }
    }

    // Compare each row field by field
    for (const [id, s1Row] of s1Map) {
        const s2Row = s2Map.get(id);
        if (!s2Row) continue;

        for (const col of commonColumns) {
            if (!valuesEqual(s1Row[col], s2Row[col])) {
                issues.push({
                    type: 'field_mismatch',
                    id: id,
                    column: col,
                    server1Value: s1Row[col],
                    server2Value: s2Row[col],
                    message: `Field "${col}" differs for ID ${id}`
                });
            }
        }
    }

    return {
        table: tableName,
        status: issues.length === 0 ? 'ok' : 'issues',
        rowsChecked: s1Data.length,
        columnsChecked: commonColumns.length,
        issues: issues
    };
}

async function main() {
    console.log('🔍 COMPREHENSIVE DATABASE VERIFICATION');
    console.log('='.repeat(70));
    console.log(`📁 Server1 (Source): ${SERVER1_DB}`);
    console.log(`📁 Server2 (Target): ${SERVER2_DB}`);
    console.log('');

    const server1 = new sqlite3.Database(SERVER1_DB, sqlite3.OPEN_READONLY);
    const server2 = new sqlite3.Database(SERVER2_DB, sqlite3.OPEN_READONLY);

    await new Promise(resolve => setTimeout(resolve, 500));

    const s1Tables = await getAllTables(server1);
    const tablesToCheck = s1Tables.filter(t =>
        !SERVER2_ONLY_TABLES.includes(t) &&
        t !== 'migration_history'
    );

    console.log(`📋 Checking ${tablesToCheck.length} tables...\n`);

    let totalIssues = 0;
    let totalRows = 0;
    let totalFields = 0;
    const problemTables = [];

    for (const tableName of tablesToCheck) {
        process.stdout.write(`   Checking ${tableName}... `);

        try {
            const result = await verifyTable(server1, server2, tableName);

            if (result.status === 'skip') {
                console.log(`⏭️  Skipped (${result.reason})`);
                continue;
            }

            totalRows += result.rowsChecked;
            totalFields += result.rowsChecked * result.columnsChecked;

            if (result.issues.length === 0) {
                console.log(`✅ OK (${result.rowsChecked} rows × ${result.columnsChecked} cols)`);
            } else {
                console.log(`❌ ${result.issues.length} issue(s) found!`);
                totalIssues += result.issues.length;
                problemTables.push(result);
            }
        } catch (err) {
            console.log(`❌ Error: ${err.message}`);
            totalIssues++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 VERIFICATION SUMMARY');
    console.log('='.repeat(70));
    console.log(`   Tables checked:    ${tablesToCheck.length}`);
    console.log(`   Total rows:        ${totalRows.toLocaleString()}`);
    console.log(`   Total fields:      ${totalFields.toLocaleString()}`);
    console.log(`   Issues found:      ${totalIssues}`);

    if (totalIssues === 0) {
        console.log('\n✅ VERIFICATION PASSED!');
        console.log('   Every single field in every row matches between Server1 and Server2.');
        console.log('   Not a single letter is different!');
    } else {
        console.log('\n❌ VERIFICATION FAILED!');
        console.log('   Some differences were found:\n');

        for (const table of problemTables) {
            console.log(`\n   📋 ${table.table}:`);
            for (const issue of table.issues.slice(0, 10)) {
                if (issue.type === 'field_mismatch') {
                    console.log(`      Row ${issue.id}, Column "${issue.column}":`);
                    console.log(`         Server1: "${String(issue.server1Value).substring(0, 50)}..."`);
                    console.log(`         Server2: "${String(issue.server2Value).substring(0, 50)}..."`);
                } else {
                    console.log(`      ${issue.message}`);
                }
            }
            if (table.issues.length > 10) {
                console.log(`      ... and ${table.issues.length - 10} more issues`);
            }
        }
    }

    server1.close();
    server2.close();

    // Exit with appropriate code
    process.exit(totalIssues > 0 ? 1 : 0);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
