/**
 * Migration script to add title_after and is_visible fields to About Us sections
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'cms.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Add columns to existing tables
const migrations = [
  {
    table: 'about_hero_section',
    columns: [
      { name: 'title_after', type: 'TEXT DEFAULT "Control"' },
      { name: 'is_visible', type: 'INTEGER DEFAULT 1' }
    ]
  },
  {
    table: 'about_story_section',
    columns: [
      { name: 'is_visible', type: 'INTEGER DEFAULT 1' }
    ]
  },
  {
    table: 'about_legacy_section',
    columns: [
      { name: 'is_visible', type: 'INTEGER DEFAULT 1' }
    ]
  },
  {
    table: 'about_testimonials_section',
    columns: [
      { name: 'is_visible', type: 'INTEGER DEFAULT 1' }
    ]
  },
  {
    table: 'about_approach_section',
    columns: [
      { name: 'is_visible', type: 'INTEGER DEFAULT 1' }
    ]
  }
];

async function runMigrations() {
  return new Promise((resolve, reject) => {
    let completed = 0;
    const total = migrations.reduce((sum, m) => sum + m.columns.length, 0);

    migrations.forEach(({ table, columns }) => {
      columns.forEach(({ name, type }) => {
        // Check if column exists first
        db.all(`PRAGMA table_info(${table})`, (err, rows) => {
          if (err) {
            console.error(`❌ Error checking table ${table}:`, err.message);
            reject(err);
            return;
          }

          const columnExists = rows.some(row => row.name === name);

          if (columnExists) {
            console.log(`⏭️  Column ${name} already exists in ${table}, skipping...`);
            completed++;
            if (completed === total) {
              resolve();
            }
          } else {
            db.run(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`, (err) => {
              if (err) {
                console.error(`❌ Error adding column ${name} to ${table}:`, err.message);
                reject(err);
              } else {
                console.log(`✅ Added column ${name} to ${table}`);
                completed++;
                if (completed === total) {
                  resolve();
                }
              }
            });
          }
        });
      });
    });
  });
}

// Run migrations
runMigrations()
  .then(() => {
    console.log('\n✅ All migrations completed successfully!');
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
        process.exit(1);
      }
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    db.close();
    process.exit(1);
  });

