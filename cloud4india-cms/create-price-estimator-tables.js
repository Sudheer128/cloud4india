/**
 * Price Estimator & Quotation System - Database Migration
 * Creates tables: quotations, quote_items, price_estimator_config
 * Also adds quarterly_price and yearly_price columns to existing pricing tables
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Starting Price Estimator & Quotation System migration...\n');

db.serialize(() => {
    // ============================================================
    // 1. CREATE QUOTATIONS TABLE
    // ============================================================
    console.log('📋 Creating quotations table...');
    db.run(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_number TEXT UNIQUE NOT NULL,
      version INTEGER DEFAULT 1,
      parent_quote_id INTEGER,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending_approval', 'approved', 'sent', 'rejected', 'expired')),
      
      -- Customer Details
      customer_name TEXT,
      customer_company TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      customer_address TEXT,
      customer_gst TEXT,
      
      -- Validity
      validity_days INTEGER DEFAULT 30,
      valid_until DATE,
      
      -- Notes
      internal_notes TEXT,
      rejection_reason TEXT,
      
      -- Totals
      subtotal DECIMAL(12,2) DEFAULT 0,
      tax_rate DECIMAL(5,2) DEFAULT 18,
      tax_amount DECIMAL(12,2) DEFAULT 0,
      discount_amount DECIMAL(12,2) DEFAULT 0,
      grand_total DECIMAL(12,2) DEFAULT 0,
      currency TEXT DEFAULT 'INR',
      
      -- Sharing
      share_token TEXT UNIQUE,
      share_enabled BOOLEAN DEFAULT 0,
      
      -- Workflow
      created_by TEXT,
      approved_by TEXT,
      approved_at DATETIME,
      sent_at DATETIME,
      
      -- Timestamps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (parent_quote_id) REFERENCES quotations(id) ON DELETE SET NULL
    )
  `, (err) => {
        if (err) {
            console.error('❌ Error creating quotations table:', err.message);
        } else {
            console.log('✅ quotations table created/verified');
        }
    });

    // ============================================================
    // 2. CREATE QUOTE_ITEMS TABLE
    // ============================================================
    console.log('📋 Creating quote_items table...');
    db.run(`
    CREATE TABLE IF NOT EXISTS quote_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_id INTEGER NOT NULL,
      
      -- Item Reference
      item_id INTEGER NOT NULL,
      item_type TEXT NOT NULL CHECK(item_type IN ('marketplace', 'product', 'solution', 'compute_plan', 'disk_offering', 'storage_option')),
      
      -- Item Details
      item_name TEXT NOT NULL,
      item_description TEXT,
      plan_name TEXT,
      
      -- Pricing
      duration TEXT NOT NULL CHECK(duration IN ('hourly', 'monthly', 'quarterly', 'yearly')),
      unit_price DECIMAL(12,2) NOT NULL,
      quantity INTEGER DEFAULT 1,
      total_price DECIMAL(12,2) NOT NULL,
      
      -- Additional Info (JSON strings)
      specifications TEXT,
      features TEXT,
      metadata TEXT,
      
      -- Ordering
      order_index INTEGER DEFAULT 0,
      
      -- Timestamps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (quote_id) REFERENCES quotations(id) ON DELETE CASCADE
    )
  `, (err) => {
        if (err) {
            console.error('❌ Error creating quote_items table:', err.message);
        } else {
            console.log('✅ quote_items table created/verified');
        }
    });

    // ============================================================
    // 3. CREATE PRICE_ESTIMATOR_CONFIG TABLE
    // ============================================================
    console.log('📋 Creating price_estimator_config table...');
    db.run(`
    CREATE TABLE IF NOT EXISTS price_estimator_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      
      -- Page Content
      page_title TEXT DEFAULT 'Price Estimator',
      page_subtitle TEXT DEFAULT 'Build your custom cloud solution',
      page_description TEXT DEFAULT 'Select the services you need and get an instant price estimate.',
      
      -- Section Titles
      marketplace_section_title TEXT DEFAULT 'Marketplace Applications',
      marketplace_section_description TEXT DEFAULT 'Enterprise applications ready to deploy',
      products_section_title TEXT DEFAULT 'Cloud Products',
      products_section_description TEXT DEFAULT 'Infrastructure and platform services',
      solutions_section_title TEXT DEFAULT 'Enterprise Solutions',
      solutions_section_description TEXT DEFAULT 'Complete solution packages for your business',
      
      -- Workflow Settings
      enable_approval_workflow BOOLEAN DEFAULT 1,
      approval_notification_email TEXT,
      
      -- Quote Settings
      default_validity_days INTEGER DEFAULT 30,
      quote_prefix TEXT DEFAULT 'C4I-Q',
      tax_rate DECIMAL(5,2) DEFAULT 18,
      tax_name TEXT DEFAULT 'GST',
      
      -- Display Settings
      show_hourly_pricing BOOLEAN DEFAULT 1,
      show_monthly_pricing BOOLEAN DEFAULT 1,
      show_quarterly_pricing BOOLEAN DEFAULT 1,
      show_yearly_pricing BOOLEAN DEFAULT 1,
      default_duration TEXT DEFAULT 'monthly',
      
      -- Styling
      cart_bar_background_color TEXT DEFAULT '#1a365d',
      cart_bar_text_color TEXT DEFAULT '#ffffff',
      add_button_color TEXT DEFAULT '#38a169',
      
      -- Footer Text
      assumptions_text TEXT DEFAULT 'All prices are exclusive of applicable taxes unless otherwise stated. Actual pricing may vary based on usage and specific requirements.',
      terms_text TEXT DEFAULT 'This quotation is valid for the period specified. Prices are subject to change without prior notice.',
      
      -- Timestamps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('❌ Error creating price_estimator_config table:', err.message);
        } else {
            console.log('✅ price_estimator_config table created/verified');

            // Insert default config if not exists
            db.get('SELECT COUNT(*) as count FROM price_estimator_config', (err, row) => {
                if (!err && row && row.count === 0) {
                    db.run('INSERT INTO price_estimator_config (id) VALUES (1)', (err) => {
                        if (!err) {
                            console.log('✅ Default price_estimator_config inserted');
                        }
                    });
                }
            });
        }
    });

    // ============================================================
    // 4. ADD QUARTERLY & YEARLY COLUMNS TO EXISTING TABLES
    // ============================================================
    console.log('\n📋 Adding quarterly_price and yearly_price columns to existing tables...');

    // Tables to update
    const tablesToUpdate = [
        'compute_plans',
        'disk_offerings',
        'pricing_plans'
    ];

    tablesToUpdate.forEach(table => {
        // Add quarterly_price column
        db.run(`ALTER TABLE ${table} ADD COLUMN quarterly_price TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
                console.error(`❌ Error adding quarterly_price to ${table}:`, err.message);
            } else if (!err) {
                console.log(`✅ Added quarterly_price column to ${table}`);
            }
        });

        // Add yearly_price column
        db.run(`ALTER TABLE ${table} ADD COLUMN yearly_price TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column')) {
                console.error(`❌ Error adding yearly_price to ${table}:`, err.message);
            } else if (!err) {
                console.log(`✅ Added yearly_price column to ${table}`);
            }
        });
    });

    // ============================================================
    // 5. CREATE INDEXES FOR PERFORMANCE
    // ============================================================
    console.log('\n📋 Creating indexes...');

    db.run('CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quotations_customer_email ON quotations(customer_email)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quotations_share_token ON quotations(share_token)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quote_items_item_type ON quote_items(item_type)');

    console.log('✅ Indexes created/verified');

    // ============================================================
    // 6. CREATE QUOTE ACTIVITY LOG TABLE
    // ============================================================
    console.log('\n📋 Creating quote_activity_log table...');
    db.run(`
    CREATE TABLE IF NOT EXISTS quote_activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      old_status TEXT,
      new_status TEXT,
      user_name TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quote_id) REFERENCES quotations(id) ON DELETE CASCADE
    )
  `, (err) => {
        if (err) {
            console.error('❌ Error creating quote_activity_log table:', err.message);
        } else {
            console.log('✅ quote_activity_log table created/verified');
        }
    });

});

// Close database after all operations
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err.message);
        } else {
            console.log('\n✅ Migration completed successfully!');
            console.log('📊 Created tables: quotations, quote_items, price_estimator_config, quote_activity_log');
            console.log('📊 Added columns: quarterly_price, yearly_price to compute_plans, disk_offerings, pricing_plans');
        }
    });
}, 1000);
