const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'cms.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to database');
});

const columns = [
  { table: 'about_hero_section', name: 'title_after', sql: "ALTER TABLE about_hero_section ADD COLUMN title_after TEXT DEFAULT 'Control';" },
  { table: 'about_hero_section', name: 'is_visible', sql: 'ALTER TABLE about_hero_section ADD COLUMN is_visible INTEGER DEFAULT 1;' },
  { table: 'about_story_section', name: 'is_visible', sql: 'ALTER TABLE about_story_section ADD COLUMN is_visible INTEGER DEFAULT 1;' },
  { table: 'about_legacy_section', name: 'is_visible', sql: 'ALTER TABLE about_legacy_section ADD COLUMN is_visible INTEGER DEFAULT 1;' },
  { table: 'about_testimonials_section', name: 'is_visible', sql: 'ALTER TABLE about_testimonials_section ADD COLUMN is_visible INTEGER DEFAULT 1;' },
  { table: 'about_approach_section', name: 'is_visible', sql: 'ALTER TABLE about_approach_section ADD COLUMN is_visible INTEGER DEFAULT 1;' }
];

let completed = 0;

columns.forEach(({ table, name, sql }) => {
  db.run(sql, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error(`Error adding ${name} to ${table}:`, err.message);
    } else if (!err) {
      console.log(`✅ Added ${name} to ${table}`);
    } else {
      console.log(`⏭️  ${name} already exists in ${table}`);
    }
    completed++;
    if (completed === columns.length) {
      // Set default values
      db.run("UPDATE about_hero_section SET title_after = 'Control' WHERE title_after IS NULL", () => {});
      db.run('UPDATE about_hero_section SET is_visible = 1 WHERE is_visible IS NULL', () => {});
      db.run('UPDATE about_story_section SET is_visible = 1 WHERE is_visible IS NULL', () => {});
      db.run('UPDATE about_legacy_section SET is_visible = 1 WHERE is_visible IS NULL', () => {});
      db.run('UPDATE about_testimonials_section SET is_visible = 1 WHERE is_visible IS NULL', () => {});
      db.run('UPDATE about_approach_section SET is_visible = 1 WHERE is_visible IS NULL', () => {
        console.log('✅ All columns added and defaults set');
        db.close();
        process.exit(0);
      });
    }
  });
});

