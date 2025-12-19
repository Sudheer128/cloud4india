#!/usr/bin/env node

/**
 * Create database tables for Contact Us page CMS
 * This script creates tables for Contact Us page content
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path - use environment variable or default to container path
const DB_PATH = process.env.DB_PATH || './cms.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Contact Hero Section
      db.run(`CREATE TABLE IF NOT EXISTS contact_hero_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL DEFAULT 'Get in Touch',
        highlighted_text TEXT DEFAULT 'Touch',
        description TEXT NOT NULL DEFAULT 'Have questions? We''d love to hear from you. Send us a message and we''ll respond as soon as possible.',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating contact_hero_section table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created contact_hero_section table');
        }
      });

      // 2. Contact Information Items
      db.run(`CREATE TABLE IF NOT EXISTS contact_info_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon_type TEXT NOT NULL DEFAULT 'map',
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        sub_content TEXT,
        order_index INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating contact_info_items table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created contact_info_items table');
        }
      });

      // 3. Social Media Links
      db.run(`CREATE TABLE IF NOT EXISTS contact_social_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL UNIQUE,
        url TEXT NOT NULL,
        icon_name TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating contact_social_links table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created contact_social_links table');
        }
      });

      // Insert default data
      db.serialize(() => {
        // Insert default hero section
        db.run(`INSERT OR IGNORE INTO contact_hero_section (id, title, highlighted_text, description) 
          VALUES (1, 'Get in Touch', 'Touch', 'Have questions? We''d love to hear from you. Send us a message and we''ll respond as soon as possible.')`, (err) => {
          if (err) {
            console.error('❌ Error inserting default hero section:', err.message);
          } else {
            console.log('✅ Inserted default hero section');
          }
        });

        // Insert default contact info items
        const defaultItems = [
          {
            icon_type: 'map',
            title: 'Address',
            content: '3052 "Prestige Finsbury Park Hyde" Aerospace Park, Bagalur KIADB, Bengaluru, 562149, India',
            sub_content: 'Datacenter: H223, Rasoolpur, Sector 63, Noida, Uttar Pradesh 201301',
            order_index: 0
          },
          {
            icon_type: 'phone',
            title: 'Phone',
            content: '+91-XXXXXXXXXX',
            sub_content: 'Mon - Fri: 9:00 AM - 6:00 PM IST',
            order_index: 1
          },
          {
            icon_type: 'email',
            title: 'Email',
            content: 'info@cloud4india.com',
            sub_content: 'support@cloud4india.com',
            order_index: 2
          },
          {
            icon_type: 'clock',
            title: 'Business Hours',
            content: 'Monday - Friday: 9:00 AM - 6:00 PM',
            sub_content: 'Saturday: 10:00 AM - 2:00 PM (IST)',
            order_index: 3
          }
        ];

        defaultItems.forEach((item, index) => {
          db.run(`INSERT OR IGNORE INTO contact_info_items (id, icon_type, title, content, sub_content, order_index) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [index + 1, item.icon_type, item.title, item.content, item.sub_content, item.order_index],
            (err) => {
              if (err) {
                console.error(`❌ Error inserting contact info item ${index + 1}:`, err.message);
              } else {
                console.log(`✅ Inserted contact info item: ${item.title}`);
              }
            }
          );
        });

        // Insert default social media links
        const defaultSocialLinks = [
          {
            platform: 'linkedin',
            url: 'https://www.linkedin.com/company/cloud4india',
            icon_name: 'linkedin',
            order_index: 0
          },
          {
            platform: 'instagram',
            url: 'https://www.instagram.com/cloud4india',
            icon_name: 'instagram',
            order_index: 1
          },
          {
            platform: 'youtube',
            url: 'https://www.youtube.com/@cloud4india',
            icon_name: 'youtube',
            order_index: 2
          },
          {
            platform: 'whatsapp',
            url: 'https://wa.me/91XXXXXXXXXX',
            icon_name: 'whatsapp',
            order_index: 3
          }
        ];

        defaultSocialLinks.forEach((link, index) => {
          db.run(`INSERT OR IGNORE INTO contact_social_links (id, platform, url, icon_name, order_index) 
            VALUES (?, ?, ?, ?, ?)`,
            [index + 1, link.platform, link.url, link.icon_name, link.order_index],
            (err) => {
              if (err) {
                console.error(`❌ Error inserting social link ${index + 1}:`, err.message);
              } else {
                console.log(`✅ Inserted social link: ${link.platform}`);
              }
            }
          );
        });

        resolve();
      });
    });
  });
};

// Run the migration
createTables()
  .then(() => {
    console.log('\n✅ Contact Us tables created successfully!');
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
    console.error('❌ Error creating tables:', err);
    db.close();
    process.exit(1);
  });

