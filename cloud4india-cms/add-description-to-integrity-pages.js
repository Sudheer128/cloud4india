#!/usr/bin/env node

/**
 * Add description column to integrity_pages table
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
  console.log('✅ Connected to SQLite database');
});

// Add description column
db.run(`ALTER TABLE integrity_pages ADD COLUMN description TEXT`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column')) {
      console.log('✅ Description column already exists');
      db.close();
      process.exit(0);
    } else {
      console.error('❌ Error adding description column:', err.message);
      db.close();
      process.exit(1);
    }
  } else {
    console.log('✅ Added description column to integrity_pages table');
    
    // Update existing pages with descriptions extracted from content
    db.all('SELECT id, slug, title, content FROM integrity_pages', (err, pages) => {
      if (err) {
        console.error('❌ Error fetching pages:', err.message);
        db.close();
        process.exit(1);
      }
      
      pages.forEach((page) => {
        // Extract first meaningful paragraph as description
        let description = '';
        try {
          // Remove HTML tags and get first paragraph
          const textContent = page.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          const firstParagraph = textContent.split(/\n|\. /)[0];
          if (firstParagraph && firstParagraph.length > 20 && firstParagraph.length < 200) {
            description = firstParagraph;
          }
        } catch (e) {
          console.error(`Error processing page ${page.id}:`, e.message);
        }
        
        if (description) {
          db.run('UPDATE integrity_pages SET description = ? WHERE id = ?', [description, page.id], (err) => {
            if (err) {
              console.error(`Error updating page ${page.id}:`, err.message);
            } else {
              console.log(`✅ Updated description for ${page.title}`);
            }
          });
        }
      });
      
      setTimeout(() => {
        db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err.message);
            process.exit(1);
          }
          console.log('✅ Migration completed successfully');
          process.exit(0);
        });
      }, 1000);
    });
  }
});

