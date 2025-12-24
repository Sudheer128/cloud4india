#!/usr/bin/env node

/**
 * Create database tables for Contact Form Submissions
 * This script creates tables for managing contact form leads
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
      // Contact Form Submissions Table
      db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        phone_verified INTEGER DEFAULT 0,
        verification_timestamp DATETIME,
        status TEXT DEFAULT 'leads',
        admin_notes TEXT,
        contacted_at DATETIME,
        re_contacted_at DATETIME,
        converted_at DATETIME,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating contact_submissions table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created contact_submissions table');
        }
      });

      // Verified Phone Numbers (for caching)
      db.run(`CREATE TABLE IF NOT EXISTS verified_phone_numbers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL UNIQUE,
        verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating verified_phone_numbers table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created verified_phone_numbers table');
        }
      });

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status)`, (err) => {
        if (err) {
          console.error('❌ Error creating index:', err.message);
        } else {
          console.log('✅ Created index on contact_submissions.status');
        }
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at)`, (err) => {
        if (err) {
          console.error('❌ Error creating index:', err.message);
        } else {
          console.log('✅ Created index on contact_submissions.created_at');
        }
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_verified_phone_numbers_phone ON verified_phone_numbers(phone)`, (err) => {
        if (err) {
          console.error('❌ Error creating index:', err.message);
        } else {
          console.log('✅ Created index on verified_phone_numbers.phone');
        }
      });

      resolve();
    });
  });
};

// Run the migration
createTables()
  .then(() => {
    console.log('\n✅ Contact submissions tables created successfully!');
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







