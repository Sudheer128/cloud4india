#!/usr/bin/env node

/**
 * Create database tables for About Us page CMS
 * This script creates tables for all About Us sections
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path - use environment variable or default to container path
const DB_PATH = process.env.DB_PATH || '/app/data/cms.db';

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
      // 1. About Hero Section
      db.run(`CREATE TABLE IF NOT EXISTS about_hero_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge_text TEXT DEFAULT 'About Cloud 4 India',
        title TEXT NOT NULL,
        highlighted_text TEXT DEFAULT 'Next-generation',
        description TEXT NOT NULL,
        button_text TEXT DEFAULT 'Explore Our Services',
        button_link TEXT,
        image_url TEXT,
        stat_value TEXT,
        stat_label TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_hero_section table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_hero_section table');
        }
      });

      // 2. Our Story Section
      db.run(`CREATE TABLE IF NOT EXISTS about_story_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        header_title TEXT NOT NULL DEFAULT 'Our Story',
        header_description TEXT,
        founding_year TEXT DEFAULT '2010',
        story_items TEXT NOT NULL,
        image_url TEXT,
        badge_icon TEXT,
        badge_value TEXT,
        badge_label TEXT,
        top_badge_icon TEXT,
        top_badge_value TEXT,
        top_badge_label TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_story_section table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_story_section table');
        }
      });

      // 3. Our Legacy Section
      db.run(`CREATE TABLE IF NOT EXISTS about_legacy_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        header_title TEXT NOT NULL DEFAULT 'Our Legacy',
        header_description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_legacy_section table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_legacy_section table');
        }
      });

      // 4. Legacy Milestones (timeline items)
      db.run(`CREATE TABLE IF NOT EXISTS about_legacy_milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_legacy_milestones table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_legacy_milestones table');
        }
      });

      // 5. Legacy Stats
      db.run(`CREATE TABLE IF NOT EXISTS about_legacy_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_legacy_stats table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_legacy_stats table');
        }
      });

      // 6. Testimonials Section
      db.run(`CREATE TABLE IF NOT EXISTS about_testimonials_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        header_title TEXT NOT NULL DEFAULT 'Hear from Our Satisfied Customers',
        header_description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_testimonials_section table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_testimonials_section table');
        }
      });

      // 7. Testimonials
      db.run(`CREATE TABLE IF NOT EXISTS about_testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote TEXT NOT NULL,
        company TEXT,
        author TEXT,
        page_index INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_testimonials table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_testimonials table');
        }
      });

      // 8. Testimonial Ratings
      db.run(`CREATE TABLE IF NOT EXISTS about_testimonial_ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        rating_value TEXT NOT NULL,
        platform_icon TEXT,
        order_index INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_testimonial_ratings table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_testimonial_ratings table');
        }
      });

      // 9. Our Approach Section
      db.run(`CREATE TABLE IF NOT EXISTS about_approach_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        header_title TEXT NOT NULL DEFAULT 'Our Approach',
        header_description TEXT,
        cta_button_text TEXT DEFAULT 'Talk to a Specialist',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_approach_section table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_approach_section table');
        }
      });

      // 10. Approach Items
      db.run(`CREATE TABLE IF NOT EXISTS about_approach_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon_type TEXT,
        order_index INTEGER DEFAULT 0,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating about_approach_items table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created about_approach_items table');
        }
      });

      // Insert default data
      db.run(`INSERT OR IGNORE INTO about_hero_section (id, badge_text, title, highlighted_text, description, button_text, image_url, stat_value, stat_label) 
        VALUES (1, 'About Cloud 4 India', 'The Power of', 'Next-generation', 
        'From small businesses to large enterprises, and from individual webmasters to online entrepreneurs, Cloud 4 India has been the trusted partner for cost-effective managed IT Apps. We specialise in empowering your online presence with reliable, tailored services designed to meet your unique needs.',
        'Explore Our Services', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', '14+', 'Years Experience')`, (err) => {
        if (err) console.error('Error inserting default hero:', err.message);
        else console.log('✅ Inserted default about_hero_section data');
      });

      db.run(`INSERT OR IGNORE INTO about_story_section (id, header_title, header_description, founding_year, story_items, image_url, badge_icon, badge_value, badge_label, top_badge_icon, top_badge_value, top_badge_label) 
        VALUES (1, 'Our Story', 'A journey of innovation, trust, and excellence spanning over a decade', '2010',
        '["Founded in 2010, Cloud 4 India was established to address the growing demand for secure, reliable data centres and managed IT services.", "Over the past 14 years, we have become a trusted partner for organisations and webmasters, delivering dependable cloud and managed hosting Apps at competitive prices.", "With a commitment to innovation and customer satisfaction, we offer comprehensive managed IT services, catering to businesses of all sizes — from ambitious startups to established enterprises."]',
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=600&fit=crop', 'clock', '24H', 'Support', 'users', '1M+', 'Happy Customers')`, (err) => {
        if (err) console.error('Error inserting default story:', err.message);
        else console.log('✅ Inserted default about_story_section data');
      });

      db.run(`INSERT OR IGNORE INTO about_legacy_section (id, header_title, header_description) 
        VALUES (1, 'Our Legacy', 
        'With strategically located global data centres, we empower you to host your VPS exactly where it\'s needed most. Partner with a hosting provider that not only delivers excellence but also champions sustainability for a better future.')`, (err) => {
        if (err) console.error('Error inserting default legacy:', err.message);
        else console.log('✅ Inserted default about_legacy_section data');
      });

      // Insert default milestones
      const milestones = [
        { year: '2010', title: 'Inception and Start of services', description: 'Cloud 4 India was founded with a vision to provide reliable and affordable cloud infrastructure Apps.', order_index: 0 },
        { year: '2015', title: 'Remote Infrastructure management services', description: 'Expanded our offerings to include comprehensive remote infrastructure management for enterprises.', order_index: 1 },
        { year: '2019', title: 'Launched Tally On Cloud + Application As A Service and serving over 1+ million users', description: 'Successfully launched cloud-based Tally Apps and reached a milestone of 1+ million satisfied users.', order_index: 2 },
        { year: '2022', title: 'Launch of Self Service portal, Cloud Automation, Market Place and complete SDN stack', description: 'Introduced cutting-edge automation tools and a comprehensive SDN infrastructure for enhanced customer experience.', order_index: 3 },
        { year: '2024', title: 'Started operations in USA', description: 'Expanded our global footprint by establishing operations in the United States market.', order_index: 4 }
      ];

      const insertMilestones = db.prepare(`INSERT OR IGNORE INTO about_legacy_milestones (year, title, description, order_index) VALUES (?, ?, ?, ?)`);
      milestones.forEach(m => {
        insertMilestones.run(m.year, m.title, m.description, m.order_index);
      });
      insertMilestones.finalize((err) => {
        if (err) console.error('Error inserting milestones:', err.message);
        else console.log('✅ Inserted default legacy milestones');
      });

      // Insert default stats
      const stats = [
        { label: 'Support Given', value: '2M+', order_index: 0 },
        { label: 'Clients Rating', value: '254+', order_index: 1 },
        { label: 'Money Saved', value: '20M+', order_index: 2 },
        { label: 'Connected Device', value: '50K+', order_index: 3 }
      ];

      const insertStats = db.prepare(`INSERT OR IGNORE INTO about_legacy_stats (label, value, order_index) VALUES (?, ?, ?)`);
      stats.forEach(s => {
        insertStats.run(s.label, s.value, s.order_index);
      });
      insertStats.finalize((err) => {
        if (err) console.error('Error inserting stats:', err.message);
        else console.log('✅ Inserted default legacy stats');
      });

      db.run(`INSERT OR IGNORE INTO about_testimonials_section (id, header_title, header_description) 
        VALUES (1, 'Hear from Our Satisfied Customers', 'See what our clients say about working with Cloud 4 India')`, (err) => {
        if (err) console.error('Error inserting default testimonials section:', err.message);
        else console.log('✅ Inserted default about_testimonials_section data');
      });

      // Insert default testimonials
      const testimonials = [
        { quote: 'A reliable company to host cloud servers and have good expertise and command over remote access tools.', company: 'Cevious Technologies', author: '', page_index: 0, order_index: 0 },
        { quote: "As the Head of IT at Trustline Securities Ltd., I highly recommend Cloud 4 India Private Limited for their exceptional email services. For over 15 years, we've relied on their 99.99% uptime and outstanding support, critical to our operations.\n\nWhat sets them apart is their personalised approach — promptly addressing challenges and making us feel valued as customers. Cloud 4 India is more than a service provider; they are a trusted partner in our success.", company: '', author: 'Rohit Kumar – Head – IT – Trustline Securities Ltd.', page_index: 0, order_index: 1 },
        { quote: 'I have received 99.95% uptime on my Smart Dedicated server and have been satisfied with the support services received from Cloud 4 India. They have been cost effective and the gold processors are best in performance.', company: 'Furacle Pvt Ltd', author: '', page_index: 1, order_index: 0 },
        { quote: 'We use cloud servers from Cloud 4 India and we provide ERP services to various customers over their platform. They have provided us 100% uptime in past 2 years.', company: 'Abhinav IT Solution', author: '', page_index: 1, order_index: 1 }
      ];

      const insertTestimonials = db.prepare(`INSERT OR IGNORE INTO about_testimonials (quote, company, author, page_index, order_index) VALUES (?, ?, ?, ?, ?)`);
      testimonials.forEach(t => {
        insertTestimonials.run(t.quote, t.company, t.author, t.page_index, t.order_index);
      });
      insertTestimonials.finalize((err) => {
        if (err) console.error('Error inserting testimonials:', err.message);
        else console.log('✅ Inserted default testimonials');
      });

      // Insert default ratings
      const ratings = [
        { platform: 'Google', rating_value: '4.7/5', platform_icon: 'G', order_index: 0 },
        { platform: 'Trustpilot', rating_value: '4.7/5', platform_icon: 'star', order_index: 1 }
      ];

      const insertRatings = db.prepare(`INSERT OR IGNORE INTO about_testimonial_ratings (platform, rating_value, platform_icon, order_index) VALUES (?, ?, ?, ?)`);
      ratings.forEach(r => {
        insertRatings.run(r.platform, r.rating_value, r.platform_icon, r.order_index);
      });
      insertRatings.finalize((err) => {
        if (err) console.error('Error inserting ratings:', err.message);
        else console.log('✅ Inserted default ratings');
      });

      db.run(`INSERT OR IGNORE INTO about_approach_section (id, header_title, header_description, cta_button_text) 
        VALUES (1, 'Our Approach', 
        'At Cloud 4 India, we are committed to providing secure, reliable, and customised data centre Apps designed to empower your business growth.',
        'Talk to a Specialist')`, (err) => {
        if (err) console.error('Error inserting default approach section:', err.message);
        else console.log('✅ Inserted default about_approach_section data');
      });

      // Insert default approach items
      const approaches = [
        { title: 'TIER 4 DATA CENTRES', description: 'Optimized for speed, security, and resilience', icon_type: 'database', order_index: 0 },
        { title: '99.99% UPTIME', description: 'Ensuring uninterrupted business operations', icon_type: 'clock', order_index: 1 },
        { title: 'HYPERCONVERGED INFRASTRUCTURE', description: 'Seamless integration and resource optimization', icon_type: 'sun', order_index: 2 },
        { title: '24/7 SUPPORT', description: 'Dedicated experts, always ready to assist', icon_type: 'phone', order_index: 3 }
      ];

      const insertApproaches = db.prepare(`INSERT OR IGNORE INTO about_approach_items (title, description, icon_type, order_index) VALUES (?, ?, ?, ?)`);
      approaches.forEach(a => {
        insertApproaches.run(a.title, a.description, a.icon_type, a.order_index);
      });
      insertApproaches.finalize((err) => {
        if (err) console.error('Error inserting approaches:', err.message);
        else {
          console.log('✅ Inserted default approach items');
          console.log('\n🎉 All About Us tables created and populated with default data!');
          resolve();
        }
      });
    });
  });
};

// Run migrations
createTables()
  .then(() => {
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
    console.error('❌ Migration failed:', err.message);
    db.close();
    process.exit(1);
  });

