const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Migrating main_products_sections table to add new fields...\n');

// Add new columns to main_products_sections table
const migrations = [
  // Add popular_tag field
  `ALTER TABLE main_products_sections ADD COLUMN popular_tag TEXT DEFAULT 'Most Popular';`,
  
  // Add category field (override from products table)
  `ALTER TABLE main_products_sections ADD COLUMN category TEXT;`,
  
  // Add features field (JSON array of feature texts)
  `ALTER TABLE main_products_sections ADD COLUMN features TEXT DEFAULT '[]';`,
  
  // Add price field
  `ALTER TABLE main_products_sections ADD COLUMN price TEXT DEFAULT '₹2,999';`,
  
  // Add price_period field
  `ALTER TABLE main_products_sections ADD COLUMN price_period TEXT DEFAULT '/month';`,
  
  // Add free_trial_tag field
  `ALTER TABLE main_products_sections ADD COLUMN free_trial_tag TEXT DEFAULT 'Free Trial';`,
  
  // Add button_text field
  `ALTER TABLE main_products_sections ADD COLUMN button_text TEXT DEFAULT 'Explore Solution';`
];

// Run migrations one by one
let completed = 0;
migrations.forEach((sql, index) => {
  db.run(sql, (err) => {
    if (err) {
      // Column might already exist, that's okay
      if (err.message.includes('duplicate column')) {
        console.log(`⚠️  Column ${index + 1} already exists, skipping...`);
      } else {
        console.error(`❌ Error adding column ${index + 1}:`, err.message);
      }
    } else {
      console.log(`✅ Added column ${index + 1}`);
    }
    
    completed++;
    if (completed === migrations.length) {
      // Populate default values for existing rows
      db.run(`
        UPDATE main_products_sections 
        SET 
          popular_tag = COALESCE(popular_tag, 'Most Popular'),
          features = COALESCE(features, '["High Performance Computing", "Enterprise Security", "99.9% Uptime SLA"]'),
          price = COALESCE(price, '₹2,999'),
          price_period = COALESCE(price_period, '/month'),
          free_trial_tag = COALESCE(free_trial_tag, 'Free Trial'),
          button_text = COALESCE(button_text, 'Explore Solution')
        WHERE 
          popular_tag IS NULL 
          OR features IS NULL 
          OR price IS NULL
      `, (err) => {
        if (err) {
          console.error('❌ Error updating existing rows:', err.message);
        } else {
          console.log('✅ Updated existing rows with default values');
        }
        
        // Copy category from products table
        db.run(`
          UPDATE main_products_sections 
          SET category = (
            SELECT category FROM products WHERE products.id = main_products_sections.product_id
          )
          WHERE category IS NULL
        `, (err) => {
          if (err) {
            console.error('❌ Error copying categories:', err.message);
          } else {
            console.log('✅ Copied categories from products table');
          }
          
          console.log('\n✨ Migration completed!');
          db.close();
        });
      });
    }
  });
});

