#!/usr/bin/env node

/**
 * Contact Dashboard Enhancement Migration Script
 * 
 * This script enhances the contact_submissions table with production-ready CRM features:
 * - Priority field (low, medium, high, urgent)
 * - Follow-up scheduling (date + notes)
 * - Contact attempts counter
 * - Lead source tracking
 * - Agent assignment
 * - Activity log table for audit trail
 * - Enhanced status values
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const DB_PATH = process.env.DB_PATH || './cms.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database at:', DB_PATH);
});

// Helper function to check if column exists
const columnExists = (tableName, columnName) => {
    return new Promise((resolve, reject) => {
        db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
            if (err) {
                reject(err);
                return;
            }
            const exists = columns.some(col => col.name === columnName);
            resolve(exists);
        });
    });
};

// Helper function to add column if not exists
const addColumnIfNotExists = async (tableName, columnName, columnDef) => {
    try {
        const exists = await columnExists(tableName, columnName);
        if (!exists) {
            return new Promise((resolve, reject) => {
                db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`, (err) => {
                    if (err) {
                        console.error(`❌ Error adding column ${columnName}:`, err.message);
                        reject(err);
                    } else {
                        console.log(`✅ Added column: ${columnName}`);
                        resolve();
                    }
                });
            });
        } else {
            console.log(`⏭️  Column ${columnName} already exists, skipping`);
            return Promise.resolve();
        }
    } catch (err) {
        console.error(`❌ Error checking column ${columnName}:`, err.message);
        throw err;
    }
};

// Main migration function
const runMigration = async () => {
    console.log('\n🚀 Starting Contact Dashboard Enhancement Migration...\n');

    try {
        // Phase 1: Add new columns to contact_submissions
        console.log('📦 Phase 1: Adding new columns to contact_submissions table...\n');

        await addColumnIfNotExists('contact_submissions', 'priority', "TEXT DEFAULT 'medium'");
        await addColumnIfNotExists('contact_submissions', 'follow_up_date', 'DATETIME');
        await addColumnIfNotExists('contact_submissions', 'follow_up_notes', 'TEXT');
        await addColumnIfNotExists('contact_submissions', 'contact_attempts', 'INTEGER DEFAULT 0');
        await addColumnIfNotExists('contact_submissions', 'source', "TEXT DEFAULT 'website'");
        await addColumnIfNotExists('contact_submissions', 'assigned_to', 'TEXT');

        // Phase 2: Create activity log table
        console.log('\n📦 Phase 2: Creating contact_activity_log table...\n');

        await new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS contact_activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        submission_id INTEGER NOT NULL,
        action_type TEXT NOT NULL,
        old_value TEXT,
        new_value TEXT,
        performed_by TEXT DEFAULT 'Admin',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (submission_id) REFERENCES contact_submissions(id) ON DELETE CASCADE
      )`, (err) => {
                if (err) {
                    console.error('❌ Error creating contact_activity_log table:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Created contact_activity_log table');
                    resolve();
                }
            });
        });

        // Create indexes for activity log
        await new Promise((resolve, reject) => {
            db.run(`CREATE INDEX IF NOT EXISTS idx_activity_log_submission_id ON contact_activity_log(submission_id)`, (err) => {
                if (err) {
                    console.error('❌ Error creating index:', err.message);
                } else {
                    console.log('✅ Created index on contact_activity_log.submission_id');
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON contact_activity_log(created_at)`, (err) => {
                if (err) {
                    console.error('❌ Error creating index:', err.message);
                } else {
                    console.log('✅ Created index on contact_activity_log.created_at');
                }
                resolve();
            });
        });

        // Phase 3: Create indexes for new columns
        console.log('\n📦 Phase 3: Creating indexes for new columns...\n');

        await new Promise((resolve, reject) => {
            db.run(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_priority ON contact_submissions(priority)`, (err) => {
                if (err) {
                    console.error('❌ Error creating index:', err.message);
                } else {
                    console.log('✅ Created index on contact_submissions.priority');
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_follow_up ON contact_submissions(follow_up_date)`, (err) => {
                if (err) {
                    console.error('❌ Error creating index:', err.message);
                } else {
                    console.log('✅ Created index on contact_submissions.follow_up_date');
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_source ON contact_submissions(source)`, (err) => {
                if (err) {
                    console.error('❌ Error creating index:', err.message);
                } else {
                    console.log('✅ Created index on contact_submissions.source');
                }
                resolve();
            });
        });

        // Phase 4: Migrate existing re_contact status to follow_up
        console.log('\n📦 Phase 4: Migrating re_contact status to follow_up...\n');

        await new Promise((resolve, reject) => {
            db.run(`UPDATE contact_submissions SET status = 'follow_up' WHERE status = 're_contact'`, function (err) {
                if (err) {
                    console.error('❌ Error migrating status:', err.message);
                    reject(err);
                } else {
                    console.log(`✅ Migrated ${this.changes} records from 're_contact' to 'follow_up'`);
                    resolve();
                }
            });
        });

        // Phase 5: Set default priority for existing records without priority
        console.log('\n📦 Phase 5: Setting default values for existing records...\n');

        await new Promise((resolve, reject) => {
            db.run(`UPDATE contact_submissions SET priority = 'medium' WHERE priority IS NULL`, function (err) {
                if (err) {
                    console.error('❌ Error setting default priority:', err.message);
                } else {
                    console.log(`✅ Set default priority for ${this.changes} records`);
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`UPDATE contact_submissions SET source = 'website' WHERE source IS NULL`, function (err) {
                if (err) {
                    console.error('❌ Error setting default source:', err.message);
                } else {
                    console.log(`✅ Set default source for ${this.changes} records`);
                }
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`UPDATE contact_submissions SET contact_attempts = 0 WHERE contact_attempts IS NULL`, function (err) {
                if (err) {
                    console.error('❌ Error setting default contact_attempts:', err.message);
                } else {
                    console.log(`✅ Set default contact_attempts for ${this.changes} records`);
                }
                resolve();
            });
        });

        console.log('\n✅ ========================================');
        console.log('✅ Contact Dashboard Enhancement Complete!');
        console.log('✅ ========================================\n');

        // Print current schema
        console.log('📋 Current contact_submissions schema:');
        db.all(`PRAGMA table_info(contact_submissions)`, (err, columns) => {
            if (!err) {
                columns.forEach(col => {
                    console.log(`   - ${col.name}: ${col.type} ${col.dflt_value ? `(default: ${col.dflt_value})` : ''}`);
                });
            }

            console.log('\n📋 Current contact_activity_log schema:');
            db.all(`PRAGMA table_info(contact_activity_log)`, (err, columns) => {
                if (!err) {
                    columns.forEach(col => {
                        console.log(`   - ${col.name}: ${col.type}`);
                    });
                }

                // Close database
                db.close((err) => {
                    if (err) {
                        console.error('❌ Error closing database:', err.message);
                        process.exit(1);
                    }
                    console.log('\n✅ Database connection closed');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        db.close();
        process.exit(1);
    }
};

// Run the migration
runMigration();
