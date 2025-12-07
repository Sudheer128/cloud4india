#!/usr/bin/env node

/**
 * Populate Approach Section header if missing
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

console.log('🔧 Checking Approach Section data...\n');

db.get('SELECT * FROM about_approach_section WHERE id = 1', (err, section) => {
  if (err) {
    console.error('❌ Error checking approach section:', err.message);
    db.close();
    process.exit(1);
  }
  
  if (!section) {
    console.log('📝 No approach section found. Creating with default data...\n');
    db.run(`INSERT INTO about_approach_section (id, header_title, header_description, cta_button_text, is_visible) 
      VALUES (1, 'Our Approach', 
      'At Cloud 4 India, we are committed to providing secure, reliable, and customised data centre solutions designed to empower your business growth.',
      'Talk to a Specialist', 1)`, (err) => {
      if (err) {
        console.error('❌ Error inserting approach section:', err.message);
      } else {
        console.log('✅ Approach section created with header');
      }
      db.close();
    });
  } else if (!section.header_title || !section.header_description) {
    console.log('📝 Approach section exists but missing header data. Updating...\n');
    db.run(`UPDATE about_approach_section 
      SET header_title = 'Our Approach',
          header_description = 'At Cloud 4 India, we are committed to providing secure, reliable, and customised data centre solutions designed to empower your business growth.',
          cta_button_text = COALESCE(cta_button_text, 'Talk to a Specialist'),
          is_visible = COALESCE(is_visible, 1),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1`, (err) => {
      if (err) {
        console.error('❌ Error updating approach section:', err.message);
      } else {
        console.log('✅ Approach section updated with header data');
      }
      db.close();
    });
  } else {
    console.log('✅ Approach section already has complete data:');
    console.log(`   Header Title: ${section.header_title}`);
    console.log(`   Header Description: ${section.header_description ? section.header_description.substring(0, 50) + '...' : 'N/A'}`);
    console.log(`   CTA Button: ${section.cta_button_text || 'N/A'}`);
    console.log(`   Visible: ${section.is_visible !== 0 ? 'Yes' : 'No'}`);
    db.close();
  }
});

