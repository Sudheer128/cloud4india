#!/usr/bin/env node

/**
 * Add Mission & Vision and Core Values sections to About Us
 */

const sqlite3 = require('sqlite3').verbose();

// Database path
const DB_PATH = process.env.DB_PATH || './cms.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database\n');
});

console.log('🔧 Adding Mission & Vision and Core Values tables...\n');

db.serialize(() => {
  // 1. Mission & Vision Section
  db.run(`CREATE TABLE IF NOT EXISTS about_mission_vision_section (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    header_title TEXT NOT NULL DEFAULT 'Our Mission & Vision',
    header_description TEXT DEFAULT 'Driving innovation and excellence in cloud computing',
    mission_title TEXT DEFAULT 'Our Mission',
    mission_description TEXT DEFAULT 'To empower businesses of all sizes with reliable, secure, and innovative cloud computing solutions that drive digital transformation and sustainable growth.',
    vision_title TEXT DEFAULT 'Our Vision',
    vision_description TEXT DEFAULT 'To be the leading cloud service provider in India, recognized globally for excellence, innovation, and customer-centric solutions that shape the future of cloud technology.',
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating about_mission_vision_section table:', err.message);
    } else {
      console.log('✅ Created about_mission_vision_section table');
    }
  });

  // 2. Core Values Section Header
  db.run(`CREATE TABLE IF NOT EXISTS about_core_values_section (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    header_title TEXT NOT NULL DEFAULT 'Our Core Values',
    header_description TEXT DEFAULT 'The principles that guide everything we do',
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating about_core_values_section table:', err.message);
    } else {
      console.log('✅ Created about_core_values_section table');
    }
  });

  // 3. Core Values Items
  db.run(`CREATE TABLE IF NOT EXISTS about_core_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_type TEXT DEFAULT 'lightbulb',
    color TEXT DEFAULT 'saree-teal',
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating about_core_values table:', err.message);
    } else {
      console.log('✅ Created about_core_values table');
    }
  });

  // Insert default data
  setTimeout(() => {
    db.run(`INSERT OR IGNORE INTO about_mission_vision_section (id) VALUES (1)`, (err) => {
      if (err) {
        console.error('❌ Error inserting default mission & vision:', err.message);
      } else {
        console.log('✅ Inserted default mission & vision section');
      }
    });

    db.run(`INSERT OR IGNORE INTO about_core_values_section (id) VALUES (1)`, (err) => {
      if (err) {
        console.error('❌ Error inserting default core values section:', err.message);
      } else {
        console.log('✅ Inserted default core values section');
      }
    });

    // Insert default core values
    const values = [
      { title: 'Innovation', description: 'Continuously pushing boundaries to deliver cutting-edge cloud solutions that drive business transformation.', icon_type: 'lightbulb', color: 'saree-teal', order_index: 0 },
      { title: 'Reliability', description: 'Ensuring 99.99% uptime and consistent performance you can count on, every single day.', icon_type: 'shield', color: 'saree-lime', order_index: 1 },
      { title: 'Customer First', description: 'Your success is our priority. We go above and beyond to deliver personalized support and solutions.', icon_type: 'heart', color: 'saree-rose', order_index: 2 },
      { title: 'Integrity', description: 'Operating with transparency, honesty, and ethical practices in all our business relationships.', icon_type: 'check', color: 'saree-amber', order_index: 3 },
      { title: 'Excellence', description: 'Striving for perfection in every service we deliver, from infrastructure to customer support.', icon_type: 'star', color: 'phulkari-fuchsia', order_index: 4 },
      { title: 'Security', description: 'Implementing industry-leading security measures to protect your data and ensure compliance.', icon_type: 'lock', color: 'saree-coral', order_index: 5 }
    ];

    const stmt = db.prepare(`INSERT OR IGNORE INTO about_core_values (title, description, icon_type, color, order_index) VALUES (?, ?, ?, ?, ?)`);
    values.forEach(v => {
      stmt.run(v.title, v.description, v.icon_type, v.color, v.order_index);
    });
    stmt.finalize((err) => {
      if (err) {
        console.error('❌ Error inserting default core values:', err.message);
      } else {
        console.log('✅ Inserted default core values');
        console.log('\n🎉 Mission & Vision and Core Values sections added successfully!\n');
        
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
          } else {
            console.log('✅ Database connection closed');
          }
        });
      }
    });
  }, 500);
});

