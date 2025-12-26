const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { initPriceEstimatorRoutes } = require('./price-estimator-routes');
const { initExportRoutes } = require('./export-routes');

const app = express();
const PORT = process.env.PORT || 4002;

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught Exception:', error);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create upload directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');

[uploadsDir, imagesDir, videosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, imagesDir);
    } else if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(new Error('Invalid field name'));
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  }
});

// File filter for images (includes SVG for icons)
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and SVG images are allowed.'), false);
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4 videos are allowed.'), false);
  }
};

// Configure multer instances
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for images
  }
});

const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// ===== FILE UPLOAD ENDPOINTS =====

// Upload image endpoint
app.post('/api/upload/image', uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Return the file path relative to server
    const filePath = `/uploads/images/${req.file.filename}`;
    res.json({
      success: true,
      filePath: filePath,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
});

// Upload video endpoint
app.post('/api/upload/video', uploadVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Return the file path relative to server
    const filePath = `/uploads/videos/${req.file.filename}`;
    res.json({
      success: true,
      filePath: filePath,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video: ' + error.message });
  }
});

// ===== END FILE UPLOAD ENDPOINTS =====

// Initialize SQLite database
const dbPath = process.env.DB_PATH || './cms.db';
console.log(`📊 Initializing SQLite database at: ${dbPath}`);
const db = new sqlite3.Database(dbPath);

// Run migrations on startup
const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');
    const { runAllMigrations } = require('./migration-runner');
    await runAllMigrations();

    // Add media banner columns to marketplace_sections if they don't exist
    await addMarketplaceMediaBannerColumns();

    // Add content and media banner columns to product_sections if they don't exist
    await addProductMediaBannerColumns();

    // Add content and is_visible columns to section_items if they don't exist
    await addSectionItemsVisibilityColumn();

    // Add eyebrow column to integrity_pages if it doesn't exist
    await addIntegrityPagesEyebrowColumn();

    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.log('⚠️  Continuing with existing database...');
  }
};

// Add media banner columns to marketplace_sections table
const addMarketplaceMediaBannerColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      {
        name: 'is_visible',
        sql: "ALTER TABLE marketplace_sections ADD COLUMN is_visible INTEGER DEFAULT 1;"
      },
      {
        name: 'media_type',
        sql: "ALTER TABLE marketplace_sections ADD COLUMN media_type TEXT;"
      },
      {
        name: 'media_source',
        sql: "ALTER TABLE marketplace_sections ADD COLUMN media_source TEXT;"
      },
      {
        name: 'media_url',
        sql: "ALTER TABLE marketplace_sections ADD COLUMN media_url TEXT;"
      },
      {
        name: 'icon',
        sql: "ALTER TABLE marketplace_sections ADD COLUMN icon TEXT;"
      }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          // Column might already exist, that's okay
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in marketplace_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to marketplace_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to marketplace_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add media banner columns to product_sections table (for backward compatibility if needed)
const addProductMediaBannerColumns = () => {
  return new Promise((resolve) => {
    // Note: These columns are already included in CREATE TABLE, but this function exists
    // for backward compatibility if tables were created before the columns were added
    const columns = [
      {
        name: 'content',
        sql: "ALTER TABLE product_sections ADD COLUMN content TEXT;"
      },
      {
        name: 'media_type',
        sql: "ALTER TABLE product_sections ADD COLUMN media_type TEXT;"
      },
      {
        name: 'media_source',
        sql: "ALTER TABLE product_sections ADD COLUMN media_source TEXT;"
      },
      {
        name: 'media_url',
        sql: "ALTER TABLE product_sections ADD COLUMN media_url TEXT;"
      }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          // Column might already exist, that's okay
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in product_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to product_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to product_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add description column to product_sections if it doesn't exist
const addDescriptionColumnToProductSections = () => {
  return new Promise((resolve) => {
    db.run("ALTER TABLE product_sections ADD COLUMN description TEXT;", (err) => {
      if (err) {
        if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
          console.log(`   ⏭️  Column description already exists in product_sections`);
        } else {
          console.log(`   ⚠️  Error adding column description to product_sections: ${err.message}`);
        }
      } else {
        console.log(`   ✅ Added column description to product_sections`);
      }
      resolve();
    });
  });
};

// Add pricing table header columns to product_sections if they don't exist
const addPricingTableHeaderColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { name: 'pricing_table_header_plan', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_plan TEXT DEFAULT 'Plan';" },
      { name: 'pricing_table_header_specs', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_specs TEXT DEFAULT 'Specifications';" },
      { name: 'pricing_table_header_features', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_features TEXT DEFAULT 'Features';" },
      { name: 'pricing_table_header_hourly', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_hourly TEXT DEFAULT 'Price Hourly';" },
      { name: 'pricing_table_header_monthly', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_monthly TEXT DEFAULT 'Price Monthly';" },
      { name: 'pricing_table_header_quarterly', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_quarterly TEXT DEFAULT 'Price Quarterly';" },
      { name: 'pricing_table_header_yearly', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_yearly TEXT DEFAULT 'Price Yearly';" },
      { name: 'pricing_table_header_action', sql: "ALTER TABLE product_sections ADD COLUMN pricing_table_header_action TEXT DEFAULT 'Action';" }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in product_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to product_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to product_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add pricing column visibility columns to product_sections if they don't exist
const addProductPricingColumnVisibilityColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { name: 'show_hourly_column', sql: "ALTER TABLE product_sections ADD COLUMN show_hourly_column INTEGER DEFAULT 1;" },
      { name: 'show_monthly_column', sql: "ALTER TABLE product_sections ADD COLUMN show_monthly_column INTEGER DEFAULT 1;" },
      { name: 'show_quarterly_column', sql: "ALTER TABLE product_sections ADD COLUMN show_quarterly_column INTEGER DEFAULT 1;" },
      { name: 'show_yearly_column', sql: "ALTER TABLE product_sections ADD COLUMN show_yearly_column INTEGER DEFAULT 1;" }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in product_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to product_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to product_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add pricing table header columns to marketplace_sections if they don't exist
const addMarketplacePricingTableHeaderColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { name: 'pricing_table_header_app_name', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_app_name TEXT DEFAULT 'App Name';" },
      { name: 'pricing_table_header_specs', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_specs TEXT DEFAULT 'Specifications';" },
      { name: 'pricing_table_header_features', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_features TEXT DEFAULT 'Features';" },
      { name: 'pricing_table_header_hourly', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_hourly TEXT DEFAULT 'Price Hourly';" },
      { name: 'pricing_table_header_monthly', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_monthly TEXT DEFAULT 'Price Monthly';" },
      { name: 'pricing_table_header_quarterly', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_quarterly TEXT DEFAULT 'Price Quarterly';" },
      { name: 'pricing_table_header_yearly', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_yearly TEXT DEFAULT 'Price Yearly';" },
      { name: 'pricing_table_header_action', sql: "ALTER TABLE marketplace_sections ADD COLUMN pricing_table_header_action TEXT DEFAULT 'Action';" }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in marketplace_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to marketplace_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to marketplace_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add pricing column visibility columns to marketplace_sections if they don't exist
const addMarketplacePricingColumnVisibilityColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { name: 'show_hourly_column', sql: "ALTER TABLE marketplace_sections ADD COLUMN show_hourly_column INTEGER DEFAULT 1;" },
      { name: 'show_monthly_column', sql: "ALTER TABLE marketplace_sections ADD COLUMN show_monthly_column INTEGER DEFAULT 1;" },
      { name: 'show_quarterly_column', sql: "ALTER TABLE marketplace_sections ADD COLUMN show_quarterly_column INTEGER DEFAULT 1;" },
      { name: 'show_yearly_column', sql: "ALTER TABLE marketplace_sections ADD COLUMN show_yearly_column INTEGER DEFAULT 1;" }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in marketplace_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to marketplace_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to marketplace_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add pricing table header columns to solution_sections if they don't exist
const addSolutionPricingTableHeaderColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { name: 'pricing_table_header_plan', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_plan TEXT DEFAULT 'Plan';" },
      { name: 'pricing_table_header_specs', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_specs TEXT DEFAULT 'Specifications';" },
      { name: 'pricing_table_header_features', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_features TEXT DEFAULT 'Features';" },
      { name: 'pricing_table_header_hourly', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_hourly TEXT DEFAULT 'Price Hourly';" },
      { name: 'pricing_table_header_monthly', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_monthly TEXT DEFAULT 'Price Monthly';" },
      { name: 'pricing_table_header_quarterly', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_quarterly TEXT DEFAULT 'Price Quarterly';" },
      { name: 'pricing_table_header_yearly', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_yearly TEXT DEFAULT 'Price Yearly';" },
      { name: 'pricing_table_header_action', sql: "ALTER TABLE solution_sections ADD COLUMN pricing_table_header_action TEXT DEFAULT 'Action';" }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in solution_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to solution_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to solution_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add pricing column visibility columns to solution_sections if they don't exist
const addSolutionPricingColumnVisibilityColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { name: 'show_hourly_column', sql: "ALTER TABLE solution_sections ADD COLUMN show_hourly_column INTEGER DEFAULT 1;" },
      { name: 'show_monthly_column', sql: "ALTER TABLE solution_sections ADD COLUMN show_monthly_column INTEGER DEFAULT 1;" },
      { name: 'show_quarterly_column', sql: "ALTER TABLE solution_sections ADD COLUMN show_quarterly_column INTEGER DEFAULT 1;" },
      { name: 'show_yearly_column', sql: "ALTER TABLE solution_sections ADD COLUMN show_yearly_column INTEGER DEFAULT 1;" }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in solution_sections`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to solution_sections: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to solution_sections`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add missing columns to product_items table (for backward compatibility)
const addProductItemsColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      {
        name: 'content',
        sql: "ALTER TABLE product_items ADD COLUMN content TEXT;"
      },
      {
        name: 'value',
        sql: "ALTER TABLE product_items ADD COLUMN value TEXT;"
      },
      {
        name: 'label',
        sql: "ALTER TABLE product_items ADD COLUMN label TEXT;"
      },
      {
        name: 'features',
        sql: "ALTER TABLE product_items ADD COLUMN features TEXT;"
      }
    ];

    let completed = 0;
    const total = columns.length;

    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          // Column might already exist, that's okay
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column ${col.name} already exists in product_items`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name} to product_items: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name} to product_items`);
        }

        completed++;
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Add is_visible column to section_items table (for backward compatibility)
const addSectionItemsVisibilityColumn = () => {
  return new Promise((resolve) => {
    db.run("ALTER TABLE section_items ADD COLUMN is_visible INTEGER DEFAULT 1;", (err) => {
      if (err) {
        if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
          console.log(`   ⏭️  Column is_visible already exists in section_items`);
        } else {
          console.log(`   ⚠️  Error adding column is_visible to section_items: ${err.message}`);
        }
      } else {
        console.log(`   ✅ Added column is_visible to section_items`);
      }

      // Add content column to section_items table (for media items)
      db.run("ALTER TABLE section_items ADD COLUMN content TEXT;", (err) => {
        if (err) {
          if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
            console.log(`   ⏭️  Column content already exists in section_items`);
          } else {
            console.log(`   ⚠️  Error adding column content to section_items: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column content to section_items`);
        }
        resolve();
      });
    });
  });
};

// Add eyebrow column to integrity_pages table
const addIntegrityPagesEyebrowColumn = () => {
  return new Promise((resolve) => {
    db.run("ALTER TABLE integrity_pages ADD COLUMN eyebrow TEXT;", (err) => {
      if (err) {
        if (err.message.includes('duplicate column') || err.message.includes('duplicate column name')) {
          console.log(`   ⏭️  Column eyebrow already exists in integrity_pages`);
        } else {
          console.log(`   ⚠️  Error adding column eyebrow to integrity_pages: ${err.message}`);
        }
      } else {
        console.log(`   ✅ Added column eyebrow to integrity_pages`);
      }
      resolve();
    });
  });
};

// Create tables
db.serialize(() => {
  // Hero Section table
  db.run(`CREATE TABLE IF NOT EXISTS hero_section (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    primary_button_text TEXT NOT NULL,
    primary_button_link TEXT NOT NULL,
    secondary_button_text TEXT NOT NULL,
    secondary_button_link TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Why Items table
  db.run(`CREATE TABLE IF NOT EXISTS why_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Client Logos table
  db.run(`CREATE TABLE IF NOT EXISTS client_logos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    logo_path TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Marketplaces table
  db.run(`CREATE TABLE IF NOT EXISTS marketplaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    border_color TEXT NOT NULL,
    route TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Marketplace categories table for managing category order
  db.run(`CREATE TABLE IF NOT EXISTS marketplace_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Marketplace sections table
  db.run(`CREATE TABLE IF NOT EXISTS marketplace_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marketplace_id INTEGER NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    media_type TEXT,
    media_source TEXT,
    media_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (marketplace_id) REFERENCES marketplaces (id)
  )`);

  // Section Items table (for detailed content within each section like cards, stats, features)
  db.run(`CREATE TABLE IF NOT EXISTS section_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    title TEXT,
    description TEXT,
    icon TEXT,
    value TEXT,
    label TEXT,
    features TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES marketplace_sections (id) ON DELETE CASCADE
  )`);

  // ========== SOLUTIONS TABLES (Mirroring Marketplaces Structure) ==========

  // Solutions table (mirrors marketplaces table)
  db.run(`CREATE TABLE IF NOT EXISTS solutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    border_color TEXT NOT NULL,
    route TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    enable_single_page INTEGER DEFAULT 1,
    redirect_url TEXT,
    gradient_start TEXT,
    gradient_end TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Solution categories table for managing category order
  db.run(`CREATE TABLE IF NOT EXISTS solution_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Solution sections table
  db.run(`CREATE TABLE IF NOT EXISTS solution_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solution_id INTEGER NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solution_id) REFERENCES solutions (id) ON DELETE CASCADE
  )`);

  // Solution Items table (for detailed content within each section like cards, stats, features)
  db.run(`CREATE TABLE IF NOT EXISTS solution_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    title TEXT,
    description TEXT,
    icon TEXT,
    value TEXT,
    label TEXT,
    features TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES solution_sections (id) ON DELETE CASCADE
  )`);

  // Main Solutions page hero content
  db.run(`CREATE TABLE IF NOT EXISTS main_solutions_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Our Solutions',
    subtitle TEXT DEFAULT 'Cloud Solutions - Made in India',
    description TEXT DEFAULT 'Explore our comprehensive cloud solutions designed to transform your business operations.',
    stat1_label TEXT DEFAULT 'Global Customers',
    stat1_value TEXT DEFAULT '10K+',
    stat2_label TEXT DEFAULT 'Uptime SLA',
    stat2_value TEXT DEFAULT '99.9%',
    stat3_label TEXT DEFAULT 'Data Centers',
    stat3_value TEXT DEFAULT '15+',
    stat4_label TEXT DEFAULT 'Support Rating',
    stat4_value TEXT DEFAULT '4.9★',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Individual solution sections on main solutions page
  db.run(`CREATE TABLE IF NOT EXISTS main_solutions_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solution_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    is_visible INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    popular_tag TEXT,
    category TEXT,
    features TEXT,
    price TEXT,
    price_period TEXT,
    free_trial_tag TEXT,
    button_text TEXT DEFAULT 'Explore Product',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solution_id) REFERENCES solutions (id) ON DELETE SET NULL
  )`);

  // Add icon column to solutions table (for hero section icon)
  db.run(`ALTER TABLE solutions ADD COLUMN icon TEXT DEFAULT NULL`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding icon column to solutions:', err);
    }
  });

  // ========== PRODUCTS TABLES (Mirroring Marketplaces Structure) ==========

  // Products table (mirrors marketplaces table)
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    border_color TEXT NOT NULL,
    route TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Product categories table for managing category order
  db.run(`CREATE TABLE IF NOT EXISTS product_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating product_categories table:', err);
    } else {
      // Insert default categories if table is empty
      db.get('SELECT COUNT(*) as count FROM product_categories', (err, row) => {
        if (!err && row.count === 0) {
          db.run(`INSERT INTO product_categories (name, order_index) VALUES 
            ('Compute', 0),
            ('Storage', 1),
            ('Network', 2),
            ('Database', 3),
            ('Security', 4),
            ('Analytics', 5)`);
          console.log('✓ Default product categories initialized');
        }
      });
    }
  });

  // Product sections table
  db.run(`CREATE TABLE IF NOT EXISTS product_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    media_type TEXT,
    media_source TEXT,
    media_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
  )`);

  // Product Items table (for detailed content within each section like cards, stats, features)
  db.run(`CREATE TABLE IF NOT EXISTS product_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    title TEXT,
    description TEXT,
    icon TEXT,
    value TEXT,
    label TEXT,
    features TEXT,
    order_index INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES product_sections (id) ON DELETE CASCADE
  )`);

  // Main Products page hero content
  db.run(`CREATE TABLE IF NOT EXISTS main_products_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Our Products',
    subtitle TEXT DEFAULT 'Cloud Services - Made in India',
    description TEXT DEFAULT 'Discover our comprehensive suite of cloud computing services designed to power your business transformation. From basic cloud servers to specialized computing marketplaces, we have everything you need to scale your operations.',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Individual product sections on main products page
  db.run(`CREATE TABLE IF NOT EXISTS main_products_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_visible INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
  )`);

  // Add navigation options columns to products table (Migration)
  db.run(`ALTER TABLE products ADD COLUMN enable_single_page BOOLEAN DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding enable_single_page column to products:', err);
    }
  });

  db.run(`ALTER TABLE products ADD COLUMN redirect_url TEXT DEFAULT NULL`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding redirect_url column to products:', err);
    }
  });

  // Add icon column to products table (for hero section icon)
  db.run(`ALTER TABLE products ADD COLUMN icon TEXT DEFAULT NULL`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding icon column to products:', err);
    }
  });

  // ========== END PRODUCTS TABLES ==========

  // Add navigation options columns to marketplaces table (Migration)
  db.run(`ALTER TABLE marketplaces ADD COLUMN enable_single_page BOOLEAN DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding enable_single_page column:', err);
    }
  });

  db.run(`ALTER TABLE marketplaces ADD COLUMN redirect_url TEXT DEFAULT NULL`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding redirect_url column:', err);
    }
  });

  // Insert default data
  // Insert default hero data only if table is empty
  db.get("SELECT COUNT(*) as count FROM hero_section", (err, row) => {
    if (err) {
      console.error('Error checking hero_section count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting default hero data...');
      db.run(`INSERT INTO hero_section (
        title, description, primary_button_text, primary_button_link, 
        secondary_button_text, secondary_button_link
      ) VALUES (
        'Start building on Cloud4India today',
        'Whether you''re looking for generative AI, compute power, database storage, content delivery, or other functionality, Cloud4India has the services to help you build sophisticated applications with increased flexibility, scalability, and reliability',
        'Get started for free',
        '/signup',
        'Contact a Cloud4India specialist',
        '/contact'
      )`, (err) => {
        if (err) console.error('Error inserting hero data:', err.message);
        else console.log('Default hero data inserted.');
      });
    } else {
      console.log(`Hero section table already has ${row.count} items, skipping default insert.`);
    }
  });

  // Insert default why items only if table is empty
  db.get("SELECT COUNT(*) as count FROM why_items", (err, row) => {
    if (err) {
      console.error('Error checking why_items count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting default why items...');
      const whyItems = [
        {
          title: 'Broadest and deepest set of cloud capabilities',
          content: 'Cloud4India gives you greatest choice and flexibility to meet your specific needs so you can choose the right tool for the job. Cloud4India offers the widest variety of compute instances, storage classes, databases, and analytics, all purpose-built to deliver the best cost and performance.',
          link: 'Learn more about our capabilities'
        },
        {
          title: 'Largest community of customers and partners',
          content: 'Cloud4India has the largest community, with millions of active customers and over 130,000 Cloud4India Partners globally from more than 200 countries.',
          link: 'Learn more about our partners'
        },
        {
          title: 'Security you can trust',
          content: 'Security is our top priority. Cloud4India is architected to be the most flexible and secure cloud computing environment available today.',
          link: 'Learn more about our security'
        },
        {
          title: 'Innovation that accelerates transformation',
          content: 'Cloud4India works backwards from our customers\' needs, innovating continuously to help you move ideas to reality and accelerate transformation.',
          link: 'Learn more about how Cloud4India can help you innovate'
        },
        {
          title: 'Most proven operational expertise',
          content: 'Cloud4India has unmatched experience, reliability, security, and performance your business can depend on.',
          link: 'Learn more about our infrastructure'
        }
      ];

      whyItems.forEach((item, index) => {
        db.run(`INSERT INTO why_items (title, content, link, order_index) VALUES (?, ?, ?, ?)`,
          [item.title, item.content, item.link, index], (err) => {
            if (err) console.error('Error inserting why item:', err.message);
          });
      });
      console.log('Default why items inserted.');
    } else {
      console.log(`Why items table already has ${row.count} items, skipping default insert.`);
    }
  });

  // Insert default solutions only if table is empty
  db.get("SELECT COUNT(*) as count FROM solutions", (err, row) => {
    if (err) {
      console.error('Error checking solutions count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting default solutions...');
      const defaultSolutions = [
        // Industry Solutions
        { name: 'Startups Cloud', description: 'Cost-efficient cloud built for scaling new products', category: 'Industry Solutions', color: 'blue', border_color: 'blue-200', route: '/solutions/startups-cloud', order_index: 0 },
        { name: 'Enterprise Cloud', description: 'Hybrid cloud & modernization solutions for enterprises', category: 'Industry Solutions', color: 'purple', border_color: 'purple-200', route: '/solutions/enterprise-cloud', order_index: 1 },
        { name: 'BFSI Cloud', description: 'Secure hosting aligned to financial regulations', category: 'Industry Solutions', color: 'green', border_color: 'green-200', route: '/solutions/bfsi-cloud', order_index: 2 },
        { name: 'Government Cloud', description: 'India sovereign cloud for government workloads', category: 'Industry Solutions', color: 'orange', border_color: 'orange-200', route: '/solutions/government-cloud', order_index: 3 },
        { name: 'SaaS Hosting', description: 'Auto-scaling cloud for SaaS businesses', category: 'Industry Solutions', color: 'teal', border_color: 'teal-200', route: '/solutions/saas-hosting', order_index: 4 },
        // Use Case Solutions
        { name: 'AI/ML Cloud', description: 'GPU-powered cloud for AI model training & inference', category: 'Use Case Solutions', color: 'indigo', border_color: 'indigo-200', route: '/solutions/ai-ml-cloud', order_index: 5 },
        { name: 'E-commerce Hosting', description: 'High-speed hosting for online stores', category: 'Use Case Solutions', color: 'pink', border_color: 'pink-200', route: '/solutions/ecommerce-hosting', order_index: 6 },
        { name: 'High Availability Architecture', description: 'Multi-zone deployments ensuring zero downtime', category: 'Use Case Solutions', color: 'cyan', border_color: 'cyan-200', route: '/solutions/high-availability', order_index: 7 },
        { name: 'Video Streaming', description: 'Optimized delivery for video-heavy platforms', category: 'Use Case Solutions', color: 'red', border_color: 'red-200', route: '/solutions/video-streaming', order_index: 8 },
        { name: 'Disaster Recovery (DRaaS)', description: 'Cross-region replication & failover readiness', category: 'Use Case Solutions', color: 'amber', border_color: 'amber-200', route: '/solutions/disaster-recovery', order_index: 9 }
      ];

      const gradientColors = [
        { start: 'blue', end: 'blue-100' },
        { start: 'purple', end: 'purple-100' },
        { start: 'green', end: 'green-100' },
        { start: 'orange', end: 'orange-100' },
        { start: 'teal', end: 'teal-100' },
        { start: 'indigo', end: 'indigo-100' },
        { start: 'pink', end: 'pink-100' },
        { start: 'cyan', end: 'cyan-100' },
        { start: 'red', end: 'red-100' },
        { start: 'amber', end: 'amber-100' }
      ];

      defaultSolutions.forEach((solution, index) => {
        const gradient = gradientColors[index % gradientColors.length];
        db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index, gradient_start, gradient_end, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [solution.name, solution.description, solution.category, solution.color, solution.border_color, solution.route, solution.order_index, gradient.start, gradient.end],
          function (err) {
            if (err) {
              console.error('Error inserting solution:', err.message);
            } else {
              // Add sample sections for first 3 solutions
              const solutionId = this.lastID;
              if (index < 3) {
                addSampleSolutionContent(solutionId, solution.name);
              }
              // Auto-create main solutions section
              createMainSolutionSection(solutionId, solution.name, solution.description, solution.category, () => { });
            }
          });
      });
      console.log('Default solutions inserted.');
    } else {
      console.log(`Solutions table already has ${row.count} items, skipping default insert.`);

      // Create main_solutions_sections entries for existing solutions that don't have them
      console.log('Checking for existing solutions without main_solutions_sections entries...');
      db.all('SELECT id, name, description, category, is_visible FROM solutions WHERE is_visible = 1', (err, solutions) => {
        if (err) {
          console.error('Error fetching existing solutions:', err.message);
          return;
        }

        if (solutions && solutions.length > 0) {
          let processed = 0;
          solutions.forEach((solution) => {
            db.get('SELECT id FROM main_solutions_sections WHERE solution_id = ?', [solution.id], (checkErr, existing) => {
              if (checkErr) {
                console.error(`Error checking main_solutions_sections for solution ${solution.id}:`, checkErr.message);
                processed++;
                if (processed === solutions.length) {
                  console.log('✅ Finished checking existing solutions.');
                }
                return;
              }

              if (!existing) {
                // Create missing entry
                createMainSolutionSection(solution.id, solution.name, solution.description, solution.category, () => {
                  processed++;
                  if (processed === solutions.length) {
                    console.log('✅ Finished creating main_solutions_sections for existing solutions.');
                  }
                });
              } else {
                processed++;
                if (processed === solutions.length) {
                  console.log('✅ All existing solutions already have main_solutions_sections entries.');
                }
              }
            });
          });
        }
      });
    }
  });

  // Helper function to add sample solution content
  function addSampleSolutionContent(solutionId, solutionName) {
    // Hero section
    db.run(`INSERT INTO solution_sections (solution_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`,
      [solutionId, 'hero', `Welcome to ${solutionName}`, `Transform your business with ${solutionName}. ${getSolutionDescription(solutionName)}`, 0],
      function (err) {
        if (err) console.error('Error inserting hero section:', err.message);
        const heroSectionId = this.lastID;

        // Benefits section
        db.run(`INSERT INTO solution_sections (solution_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`,
          [solutionId, 'benefits', 'Key Benefits', 'Discover the advantages of choosing our solution for your business needs.', 1],
          function (err) {
            if (err) console.error('Error inserting benefits section:', err.message);
            const benefitsSectionId = this.lastID;
            addSampleBenefitsItems(benefitsSectionId, solutionId, solutionName);
          });

        // Use cases section
        db.run(`INSERT INTO solution_sections (solution_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`,
          [solutionId, 'use_cases', 'Use Cases', 'Explore real-world applications and scenarios where our solution delivers value.', 2],
          function (err) {
            if (err) console.error('Error inserting use cases section:', err.message);
            const useCasesSectionId = this.lastID;
            addSampleUseCaseItems(useCasesSectionId, solutionId, solutionName);
          });

        // CTA section
        db.run(`INSERT INTO solution_sections (solution_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`,
          [solutionId, 'cta', 'Ready to Get Started?', 'Start your journey with us today and experience the difference.', 3],
          function (err) {
            if (err) console.error('Error inserting CTA section:', err.message);
          });
      });
  }

  function getSolutionDescription(name) {
    const descriptions = {
      'Startups Cloud': 'Perfect for early-stage companies looking to scale quickly without breaking the bank. Our cost-efficient infrastructure grows with your business.',
      'Enterprise Cloud': 'Enterprise-grade cloud solutions designed for large organizations. Hybrid cloud capabilities and modernization services to transform your IT infrastructure.',
      'BFSI Cloud': 'Banking, Financial Services, and Insurance cloud solutions built with security and compliance at the core. Meet regulatory requirements while scaling your operations.'
    };
    return descriptions[name] || 'A comprehensive solution designed to meet your business needs.';
  }

  function addSampleBenefitsItems(sectionId, solutionId, solutionName) {
    const benefits = {
      'Startups Cloud': [
        { title: 'Cost-Effective Scaling', description: 'Pay only for what you use with flexible pricing that grows with your business.', icon: 'BanknotesIcon', features: ['Pay-as-you-go pricing', 'No upfront costs', 'Automatic scaling'] },
        { title: 'Fast Deployment', description: 'Get up and running in minutes with our streamlined setup process.', icon: 'RocketLaunchIcon', features: ['Quick setup', 'Pre-configured templates', 'Instant provisioning'] },
        { title: 'Developer-Friendly', description: 'Built for developers with comprehensive APIs and documentation.', icon: 'CodeBracketIcon', features: ['RESTful APIs', 'SDK support', 'Extensive docs'] }
      ],
      'Enterprise Cloud': [
        { title: 'Hybrid Cloud Support', description: 'Seamlessly integrate on-premises infrastructure with cloud resources.', icon: 'CloudIcon', features: ['Hybrid connectivity', 'Data sovereignty', 'Flexible deployment'] },
        { title: 'Enterprise Security', description: 'Bank-level security with compliance certifications and advanced threat protection.', icon: 'ShieldCheckIcon', features: ['SOC 2 certified', 'End-to-end encryption', '24/7 monitoring'] },
        { title: 'Dedicated Support', description: 'Round-the-clock support from our enterprise team of cloud experts.', icon: 'UsersIcon', features: ['Dedicated account manager', 'Priority support', 'SLA guarantees'] }
      ],
      'BFSI Cloud': [
        { title: 'Regulatory Compliance', description: 'Built to meet RBI, SEBI, and IRDAI compliance requirements.', icon: 'ScaleIcon', features: ['RBI guidelines', 'Data localization', 'Audit trails'] },
        { title: 'Financial-Grade Security', description: 'Multi-layered security with encryption, access controls, and monitoring.', icon: 'LockClosedIcon', features: ['AES-256 encryption', 'MFA support', 'Intrusion detection'] },
        { title: 'High Availability', description: '99.99% uptime SLA with redundant infrastructure and disaster recovery.', icon: 'CheckCircleIcon', features: ['Multi-zone deployment', 'Auto-failover', 'Backup & recovery'] }
      ]
    };

    const solutionBenefits = benefits[solutionName] || benefits['Startups Cloud'];
    solutionBenefits.forEach((benefit, index) => {
      db.run(`INSERT INTO solution_items (section_id, item_type, title, description, icon, features, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sectionId, 'benefit', benefit.title, benefit.description, benefit.icon, JSON.stringify(benefit.features), index],
        (err) => {
          if (err) console.error('Error inserting benefit item:', err.message);
        });
    });
  }

  function addSampleUseCaseItems(sectionId, solutionId, solutionName) {
    const useCases = {
      'Startups Cloud': [
        { title: 'MVP Development', description: 'Build and deploy your minimum viable product quickly and cost-effectively.', icon: 'LightBulbIcon', features: ['Rapid prototyping', 'Quick iteration', 'Low cost'] },
        { title: 'SaaS Applications', description: 'Host your SaaS platform with auto-scaling infrastructure.', icon: 'CogIcon', features: ['Auto-scaling', 'Multi-tenant support', 'API integration'] }
      ],
      'Enterprise Cloud': [
        { title: 'Digital Transformation', description: 'Modernize legacy systems and migrate to cloud-native architecture.', icon: 'RocketLaunchIcon', features: ['Legacy migration', 'Cloud-native apps', 'Modern architecture'] },
        { title: 'Hybrid IT Infrastructure', description: 'Connect on-premises data centers with cloud resources seamlessly.', icon: 'CloudIcon', features: ['Hybrid connectivity', 'Data sync', 'Unified management'] }
      ],
      'BFSI Cloud': [
        { title: 'Core Banking Systems', description: 'Host mission-critical core banking applications with high availability.', icon: 'BuildingLibraryIcon', features: ['High availability', 'Data replication', 'Disaster recovery'] },
        { title: 'Payment Processing', description: 'Secure payment gateway infrastructure for financial transactions.', icon: 'CreditCardIcon', features: ['PCI DSS compliant', 'Real-time processing', 'Fraud detection'] }
      ]
    };

    const solutionUseCases = useCases[solutionName] || useCases['Startups Cloud'];
    solutionUseCases.forEach((useCase, index) => {
      db.run(`INSERT INTO solution_items (section_id, item_type, title, description, icon, features, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sectionId, 'use_case', useCase.title, useCase.description, useCase.icon, JSON.stringify(useCase.features), index],
        (err) => {
          if (err) console.error('Error inserting use case item:', err.message);
        });
    });
  }

  // Insert default solution categories only if table is empty
  db.get("SELECT COUNT(*) as count FROM solution_categories", (err, row) => {
    if (err) {
      console.error('Error checking solution_categories count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting default solution categories...');
      const categories = [
        { name: 'Industry Solutions', order_index: 0 },
        { name: 'Use Case Solutions', order_index: 1 }
      ];

      categories.forEach((cat) => {
        db.run(`INSERT INTO solution_categories (name, order_index) VALUES (?, ?)`,
          [cat.name, cat.order_index], (err) => {
            if (err) console.error('Error inserting solution category:', err.message);
          });
      });
      console.log('Default solution categories inserted.');
    } else {
      console.log(`Solution categories table already has ${row.count} items, skipping default insert.`);
    }
  });

  // Insert default main solutions content only if table is empty
  db.get("SELECT COUNT(*) as count FROM main_solutions_content", (err, row) => {
    if (err) {
      console.error('Error checking main_solutions_content count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting default main solutions content...');
      db.run(`INSERT INTO main_solutions_content (id, title, subtitle, description) VALUES (1, 'Our Solutions', 'Cloud Solutions - Made in India', 'Explore our comprehensive cloud solutions designed to transform your business operations.')`, (err) => {
        if (err) console.error('Error inserting main solutions content:', err.message);
        else console.log('Default main solutions content inserted.');
      });
    } else {
      console.log(`Main solutions content table already has ${row.count} items, skipping default insert.`);
    }
  });

  // Insert default marketplaces only if table is empty
  db.get("SELECT COUNT(*) as count FROM marketplaces", (err, row) => {
    if (err) {
      console.error('Error checking marketplaces count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting default marketplaces...');
      const marketplaces = [
        {
          name: 'Financial services',
          description: 'Reimagine your business and enable security and compliance at scale',
          category: 'Industry',
          color: 'from-gray-50 to-gray-100',
          border_color: 'border-gray-200',
          route: '/marketplaces/financial-services'
        },
        {
          name: 'Healthcare and life sciences',
          description: 'Innovate faster for clinicians and patients with unmatched reliability, security, and data privacy',
          category: 'Industry',
          color: 'from-blue-50 to-blue-100',
          border_color: 'border-blue-200',
          route: '/marketplaces/healthcare'
        },
        {
          name: 'Retail',
          description: 'Create exceptional experiences built for the future of retail',
          category: 'Industry',
          color: 'from-purple-50 to-purple-100',
          border_color: 'border-purple-200',
          route: '/marketplaces/retail'
        },
        {
          name: 'Artificial intelligence',
          description: 'Find curated marketplaces for use cases like language understanding and MLOps',
          category: 'Technology',
          color: 'from-green-50 to-green-100',
          border_color: 'border-green-200',
          route: '/marketplaces/artificial-intelligence'
        },
        {
          name: 'Migration and modernization',
          description: 'Plan your migrations and modernize your applications and mainframes',
          category: 'Technology',
          color: 'from-orange-50 to-orange-100',
          border_color: 'border-orange-200',
          route: '/marketplaces/migration'
        },
        {
          name: 'Analytics and data lakes',
          description: 'Get marketplaces for advanced analytics, data management, and predictive analytics with ML',
          category: 'Technology',
          color: 'from-teal-50 to-teal-100',
          border_color: 'border-teal-200',
          route: '/marketplaces/analytics'
        },
        {
          name: 'Serverless computing',
          description: 'Run code, manage data, and integrate applications—all without managing servers',
          category: 'Technology',
          color: 'from-blue-50 to-blue-100',
          border_color: 'border-blue-200',
          route: '/marketplaces/serverless'
        },
        {
          name: 'Compute',
          description: 'Develop cloud-centered applications and manage high performance computing (HPC) workloads',
          category: 'Technology',
          color: 'from-pink-50 to-pink-100',
          border_color: 'border-pink-200',
          route: '/marketplaces/compute'
        }
      ];

      marketplaces.forEach((marketplace, index) => {
        db.run(`INSERT INTO marketplaces (name, description, category, color, border_color, route, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [marketplace.name, marketplace.description, marketplace.category, marketplace.color, marketplace.border_color, marketplace.route, index], (err) => {
            if (err) console.error('Error inserting marketplace:', err.message);
          });
      });
      console.log('Default marketplaces inserted.');
    } else {
      console.log(`Marketplaces table already has ${row.count} items, skipping default insert.`);
    }
  });

  // Insert default marketplace categories with order
  db.get("SELECT COUNT(*) as count FROM marketplace_categories", (err, row) => {
    if (err) {
      console.error('Error checking marketplace_categories count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Inserting default marketplace categories...');
      const categories = [
        { name: 'Frameworks', order_index: 0 },
        { name: 'Content Management Systems', order_index: 1 },
        { name: 'Databases', order_index: 2 },
        { name: 'Developer Tools', order_index: 3 },
        { name: 'Media', order_index: 4 },
        { name: 'E Commerce', order_index: 5 },
        { name: 'Business Applications', order_index: 6 },
        { name: 'Monitoring Applications', order_index: 7 }
      ];

      categories.forEach((category) => {
        db.run(`INSERT INTO marketplace_categories (name, order_index) VALUES (?, ?)`,
          [category.name, category.order_index], (err) => {
            if (err) console.error('Error inserting category:', err.message);
          });
      });
      console.log('Default marketplace categories inserted.');
    } else {
      console.log('Marketplace categories table already has data, skipping default insert.');
    }
  });

});

// API Routes

// ============================================
// Helper Functions for Media Banner
// ============================================

// Extract YouTube video ID from various URL formats
const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*&v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Validate and normalize YouTube URL
const validateYouTubeUrl = (url) => {
  if (!url) return { valid: false, error: 'YouTube URL is required' };

  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return { valid: false, error: 'Invalid YouTube URL format' };
  }

  // Return normalized embed URL
  return {
    valid: true,
    videoId: videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    originalUrl: url
  };
};

// Delete uploaded file helper
const deleteUploadedFile = (filePath) => {
  return new Promise((resolve) => {
    if (!filePath || !filePath.startsWith('/uploads/')) {
      resolve({ success: true, message: 'No file to delete' });
      return;
    }

    // Remove leading slash and get relative path
    const relativePath = filePath.replace(/^\//, '');
    const fullPath = path.join(__dirname, relativePath);

    // Security check: ensure path is within uploads directory
    const uploadsPath = path.join(__dirname, 'uploads');
    if (!fullPath.startsWith(uploadsPath)) {
      resolve({ success: false, error: 'Invalid file path' });
      return;
    }

    fs.unlink(fullPath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File doesn't exist, that's okay
          resolve({ success: true, message: 'File already deleted' });
        } else {
          resolve({ success: false, error: err.message });
        }
      } else {
        resolve({ success: true, message: 'File deleted successfully' });
      }
    });
  });
};

// Get order index for media_banner section in marketplaces (always 1, right after hero)
const getMarketplaceMediaBannerOrderIndex = (marketplaceId) => {
  return new Promise((resolve, reject) => {
    // Check if hero section exists (should be at order_index 0)
    db.get(`
      SELECT MAX(order_index) as max_order 
      FROM marketplace_sections 
      WHERE marketplace_id = ? AND section_type = 'hero'
    `, [marketplaceId], (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      // Hero should be at 0, so media_banner should be at 1
      // But if sections exist after hero, we need to shift them
      const targetOrder = 1;

      // Check if order_index 1 is already taken
      db.get(`
        SELECT id FROM marketplace_sections 
        WHERE marketplace_id = ? AND order_index = ?
      `, [marketplaceId, targetOrder], (err, existing) => {
        if (err) {
          reject(err);
          return;
        }

        if (existing) {
          // Shift all sections with order_index >= 1 by +1
          db.run(`
            UPDATE marketplace_sections 
            SET order_index = order_index + 1 
            WHERE marketplace_id = ? AND order_index >= ?
          `, [marketplaceId, targetOrder], (shiftErr) => {
            if (shiftErr) {
              reject(shiftErr);
            } else {
              resolve(targetOrder);
            }
          });
        } else {
          resolve(targetOrder);
        }
      });
    });
  });
};

const getProductMediaBannerOrderIndex = (productId) => {
  return new Promise((resolve, reject) => {
    // Check if hero section exists (should be at order_index 0)
    db.get(`
      SELECT MAX(order_index) as max_order 
      FROM product_sections 
      WHERE product_id = ? AND section_type = 'hero'
    `, [productId], (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      // Hero should be at 0, so media_banner should be at 1
      // But if sections exist after hero, we need to shift them
      const targetOrder = 1;

      // Check if order_index 1 is already taken
      db.get(`
        SELECT id FROM product_sections 
        WHERE product_id = ? AND order_index = ?
      `, [productId, targetOrder], (err, existing) => {
        if (err) {
          reject(err);
          return;
        }

        if (existing) {
          // Shift all sections with order_index >= 1 by +1
          db.run(`
            UPDATE product_sections 
            SET order_index = order_index + 1 
            WHERE product_id = ? AND order_index >= ?
          `, [productId, targetOrder], (shiftErr) => {
            if (shiftErr) {
              reject(shiftErr);
            } else {
              resolve(targetOrder);
            }
          });
        } else {
          resolve(targetOrder);
        }
      });
    });
  });
};

// ============================================
// File Upload Endpoints
// ============================================

// Upload image endpoint
app.post('/api/upload/image', uploadImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Return the file path relative to uploads directory
  const filePath = `/uploads/images/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    filePath: filePath,
    filename: req.file.filename,
    size: req.file.size
  });
});

// Upload video endpoint
app.post('/api/upload/video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  // Return the file path relative to uploads directory
  const filePath = `/uploads/videos/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Video uploaded successfully',
    filePath: filePath,
    filename: req.file.filename,
    size: req.file.size
  });
});

// Delete uploaded file endpoint
app.delete('/api/upload/:type/:filename', (req, res) => {
  const { type, filename } = req.params;

  if (type !== 'images' && type !== 'videos') {
    return res.status(400).json({ error: 'Invalid file type. Must be "images" or "videos"' });
  }

  const filePath = path.join(uploadsDir, type, filename);

  // Security: Prevent directory traversal
  if (!filePath.startsWith(path.join(uploadsDir, type))) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      }
      return res.status(500).json({ error: 'Error deleting file: ' + err.message });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  });
});

// Error handling for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Images: max 10MB, Videos: max 100MB' });
    }
    return res.status(400).json({ error: 'Upload error: ' + error.message });
  }
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

// ============================================
// Existing API Routes
// ============================================

// Get all homepage content
app.get('/api/homepage', (req, res) => {
  const homepageData = {};

  // Get hero section
  db.get('SELECT * FROM hero_section ORDER BY updated_at DESC LIMIT 1', (err, hero) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    homepageData.hero = hero;

    // Get why items
    db.all('SELECT * FROM why_items ORDER BY order_index ASC', (err, whyItems) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      homepageData.whyItems = whyItems;

      // Get homepage sections config
      db.all('SELECT * FROM homepage_sections_config ORDER BY id ASC', (err, sectionsConfig) => {
        if (err) {
          // If table doesn't exist yet, continue without it
          homepageData.sectionsConfig = null;
        } else {
          // Convert array to object keyed by section_name
          const configsObj = {};
          sectionsConfig.forEach(config => {
            configsObj[config.section_name] = config;
          });
          homepageData.sectionsConfig = configsObj;
        }

        // Get client logos (only visible ones for frontend)
        db.all('SELECT * FROM client_logos WHERE is_visible = 1 ORDER BY order_index ASC', (err, logos) => {
          if (err) {
            // If table doesn't exist yet, continue without it
            homepageData.clientLogos = [];
          } else {
            homepageData.clientLogos = logos || [];
          }
          
          res.json(homepageData);
        });
      });
    });
  });
});

// Update hero section
app.put('/api/hero', (req, res) => {
  const { title, description, primary_button_text, primary_button_link } = req.body;

  db.run(`UPDATE hero_section SET 
    title = ?, 
    description = ?, 
    primary_button_text = ?, 
    primary_button_link = ?, 
    secondary_button_text = '', 
    secondary_button_link = '',
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [title, description, primary_button_text, primary_button_link],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Hero section updated successfully', changes: this.changes });
    });
});

// Update homepage section configuration
app.put('/api/homepage/sections/:sectionName', (req, res) => {
  const { sectionName } = req.params;
  const { heading, description, button_text, filter_text, search_placeholder } = req.body;

  db.run(`
    UPDATE homepage_sections_config SET 
      heading = ?, 
      description = ?, 
      button_text = ?, 
      filter_text = ?,
      search_placeholder = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE section_name = ?
  `, [heading, description, button_text, filter_text, search_placeholder, sectionName], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      // Config doesn't exist, create it
      db.run(`
        INSERT INTO homepage_sections_config (section_name, heading, description, button_text, filter_text, search_placeholder)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [sectionName, heading, description, button_text, filter_text, search_placeholder], function (insertErr) {
        if (insertErr) {
          res.status(500).json({ error: insertErr.message });
          return;
        }
        res.json({ message: 'Section configuration created successfully' });
      });
    } else {
      res.json({ message: 'Section configuration updated successfully', changes: this.changes });
    }
  });
});

// Create new why item
app.post('/api/why-items', (req, res) => {
  const { title, content, link } = req.body;

  // Get the next order index
  db.get('SELECT MAX(order_index) as max_order FROM why_items', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || -1) + 1;

    db.run(`INSERT INTO why_items (title, content, link, order_index) VALUES (?, ?, ?, ?)`,
      [title, content, link, nextOrder],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Why item created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  });
});

// Update why items
app.put('/api/why-items/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, link } = req.body;

  db.run(`UPDATE why_items SET 
    title = ?, 
    content = ?, 
    link = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [title, content, link, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Why item updated successfully', changes: this.changes });
    });
});

// Delete why item
app.delete('/api/why-items/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM why_items WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Why item deleted successfully', changes: this.changes });
  });
});

// ========== CLIENT LOGOS API ENDPOINTS ==========

// Get all client logos (for admin - includes hidden)
app.get('/api/admin/client-logos', (req, res) => {
  db.all('SELECT * FROM client_logos ORDER BY order_index ASC', (err, logos) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(logos);
  });
});

// Get visible client logos (for frontend)
app.get('/api/client-logos', (req, res) => {
  db.all('SELECT * FROM client_logos WHERE is_visible = 1 ORDER BY order_index ASC', (err, logos) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(logos);
  });
});

// Create new client logo
app.post('/api/admin/client-logos', (req, res) => {
  const { logo_path, alt_text } = req.body;

  if (!logo_path || !alt_text) {
    res.status(400).json({ error: 'logo_path and alt_text are required' });
    return;
  }

  // Get the next order index
  db.get('SELECT MAX(order_index) as max_order FROM client_logos', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || -1) + 1;

    db.run(`INSERT INTO client_logos (logo_path, alt_text, order_index) VALUES (?, ?, ?)`,
      [logo_path, alt_text, nextOrder],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Client logo created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  });
});

// Update client logo
app.put('/api/admin/client-logos/:id', (req, res) => {
  const { id } = req.params;
  const { logo_path, alt_text, order_index } = req.body;

  const updateFields = [];
  const values = [];

  if (logo_path !== undefined) {
    updateFields.push('logo_path = ?');
    values.push(logo_path);
  }
  if (alt_text !== undefined) {
    updateFields.push('alt_text = ?');
    values.push(alt_text);
  }
  if (order_index !== undefined) {
    updateFields.push('order_index = ?');
    values.push(order_index);
  }

  if (updateFields.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.run(`UPDATE client_logos SET ${updateFields.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Client logo updated successfully', changes: this.changes });
    });
});

// Delete client logo
app.delete('/api/admin/client-logos/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM client_logos WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Client logo deleted successfully', changes: this.changes });
  });
});

// Toggle client logo visibility
app.put('/api/admin/client-logos/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;

  db.get('SELECT is_visible FROM client_logos WHERE id = ?', [id], (err, logo) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!logo) {
      res.status(404).json({ error: 'Client logo not found' });
      return;
    }

    const newVisibility = logo.is_visible === 1 ? 0 : 1;

    db.run('UPDATE client_logos SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Visibility toggled successfully',
          is_visible: newVisibility,
          changes: this.changes
        });
      });
  });
});

// Clean up duplicate why items
app.post('/api/cleanup-duplicates', (req, res) => {
  // Remove duplicate why items based on title
  db.run(`
    DELETE FROM why_items 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM why_items 
      GROUP BY title
    )
  `, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Duplicate why items cleaned up successfully',
      changes: this.changes
    });
  });
});

// Clean up duplicate marketplaces
app.post('/api/cleanup-marketplace-duplicates', (req, res) => {
  // Remove duplicate marketplaces based on name
  db.run(`
    DELETE FROM marketplaces 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM marketplaces 
      GROUP BY name
    )
  `, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Duplicate marketplaces cleaned up successfully',
      changes: this.changes
    });
  });
});

// Get marketplace by route slug
app.get('/api/marketplaces/by-route/:route', (req, res) => {
  const { route } = req.params;

  db.get('SELECT * FROM marketplaces WHERE route = ? AND is_visible = 1', [route], (err, marketplace) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!marketplace) {
      res.status(404).json({ error: 'Marketplace not found' });
      return;
    }
    res.json(marketplace);
  });
});

// Get marketplace sections by route slug
app.get('/api/marketplaces/by-route/:route/sections', (req, res) => {
  const { route } = req.params;

  // First get the marketplace ID from route
  db.get('SELECT id FROM marketplaces WHERE route = ? AND is_visible = 1', [route], (err, marketplace) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!marketplace) {
      res.status(404).json({ error: 'Marketplace not found' });
      return;
    }

    // Then get sections for this marketplace
    db.all(`
      SELECT * FROM marketplace_sections 
      WHERE marketplace_id = ? AND is_visible = 1 
      ORDER BY order_index ASC
    `, [marketplace.id], (err, sections) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(sections);
    });
  });
});

// Helper function to create main page section for duplicated marketplace
function createMainMarketplaceSection(marketplaceId, marketplaceName, marketplaceDescription, callback) {
  // Get the next order index for main marketplaces sections
  db.get('SELECT MAX(order_index) as max_order FROM main_marketplaces_sections', (err, result) => {
    if (err) {
      console.error('Error getting max order for main marketplaces sections:', err.message);
      callback(); // Continue even if this fails
      return;
    }

    const nextOrder = (result.max_order || 0) + 1;

    // Insert new main page section
    db.run(`
      INSERT INTO main_marketplaces_sections (marketplace_id, title, description, is_visible, order_index) 
      VALUES (?, ?, ?, 1, ?)
    `, [marketplaceId, marketplaceName, marketplaceDescription, nextOrder], function (err) {
      if (err) {
        console.error('Error creating main marketplaces section:', err.message);
      } else {
        console.log(`✅ Created main marketplaces section for: ${marketplaceName}`);
      }
      callback(); // Always call callback to continue
    });
  });
}

// Helper function to create main solutions section (similar to marketplaces)
function createMainSolutionSection(solutionId, solutionName, solutionDescription, solutionCategory, callback) {
  // Get the next order index for main solutions sections first
  db.get('SELECT MAX(order_index) as max_order FROM main_solutions_sections', (err, result) => {
    if (err) {
      console.error('[createMainSolutionSection] Error getting max order:', err.message);
      callback(); // Continue even if this fails
      return;
    }

    const nextOrder = (result.max_order || 0) + 1;

    // Use INSERT OR IGNORE to prevent duplicates (requires unique constraint on solution_id)
    // If a duplicate is attempted, it will be silently ignored
    db.run(`
      INSERT OR IGNORE INTO main_solutions_sections (solution_id, title, description, category, is_visible, order_index, button_text) 
        VALUES (?, ?, ?, ?, 1, ?, 'Explore Solution')
      `, [solutionId, solutionName, solutionDescription, solutionCategory || null, nextOrder], function (err) {
      if (err) {
        console.error('[createMainSolutionSection] Error creating main solutions section:', err.message);
      } else if (this.changes > 0) {
        console.log(`✅ Created main solutions section for: ${solutionName} (ID: ${solutionId})`);
      } else {
        console.log(`⏭️  Main solutions section already exists for: ${solutionName} (ID: ${solutionId})`);
      }
      callback(); // Always call callback to continue
    });
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Cloud4India CMS is running' });
});

// Migration status endpoint
app.get('/api/migrations', (req, res) => {
  db.all('SELECT * FROM migration_history ORDER BY executed_at DESC', (err, migrations) => {
    if (err) {
      res.status(500).json({ error: 'Migration table not found or error reading migrations' });
      return;
    }

    const stats = {
      total: migrations.length,
      completed: migrations.filter(m => m.status === 'completed').length,
      failed: migrations.filter(m => m.status === 'failed').length,
      last_migration: migrations[0] || null
    };

    res.json({
      status: 'success',
      statistics: stats,
      migrations: migrations
    });
  });
});

// Run migrations endpoint (for manual trigger)
app.post('/api/migrations/run', async (req, res) => {
  try {
    console.log('🔄 Manual migration trigger requested...');
    await runMigrations();
    res.json({ status: 'success', message: 'Migrations completed successfully' });
  } catch (error) {
    console.error('❌ Manual migration failed:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Migration failed',
      error: error.message
    });
  }
});

// Marketplaces API Routes

// Get all marketplaces
// Get all marketplaces (including hidden) - for admin panel
app.get('/api/admin/marketplaces', (req, res) => {
  db.all('SELECT * FROM marketplaces ORDER BY order_index ASC', (err, marketplaces) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(marketplaces);
  });
});

app.get('/api/marketplaces', (req, res) => {
  db.all('SELECT * FROM marketplaces WHERE is_visible = 1 ORDER BY order_index ASC', (err, marketplaces) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(marketplaces);
  });
});

// Get marketplace categories in order
app.get('/api/marketplaces/categories', (req, res) => {
  db.all('SELECT * FROM marketplace_categories ORDER BY order_index ASC', (err, categories) => {
    if (err) {
      // If table doesn't exist yet, return empty array (frontend will handle fallback)
      if (err.message.includes('no such table')) {
        console.log('marketplace_categories table does not exist yet, returning empty array');
        return res.json([]);
      }
      res.status(500).json({ error: err.message });
      return;
    }
    // If no categories exist, return empty array (frontend will handle fallback)
    res.json(categories || []);
  });
});

// Get single marketplace
app.get('/api/marketplaces/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM marketplaces WHERE id = ?', [id], (err, marketplace) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!marketplace) {
      res.status(404).json({ error: 'Marketplace not found' });
      return;
    }
    res.json(marketplace);
  });
});

// Create new marketplace
app.post('/api/marketplaces', (req, res) => {
  const { name, description, category, color, border_color, route, enable_single_page = 1, redirect_url = null } = req.body;

  // Your 4 perfect colors (only these will be used)
  const gradientColors = [
    { start: 'blue', end: 'blue-100' },      // Financial Services
    { start: 'purple', end: 'purple-100' },  // Financial Services (Copy)
    { start: 'green', end: 'green-100' },    // Retail
    { start: 'orange', end: 'orange-100' }   // Healthcare
  ];

  // Get the next order index and count existing marketplaces for gradient assignment
  db.get('SELECT MAX(order_index) as max_order, COUNT(*) as total_count FROM marketplaces', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || -1) + 1;
    const totalCount = result.total_count || 0;

    // Assign gradient color based on total count (cycles through palette)
    const gradientIndex = totalCount % gradientColors.length;
    const gradient = gradientColors[gradientIndex];

    db.run(`INSERT INTO marketplaces (name, description, category, color, border_color, route, order_index, gradient_start, gradient_end, enable_single_page, redirect_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category, color, border_color, route, nextOrder, gradient.start, gradient.end, enable_single_page, redirect_url],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Marketplace created successfully',
          id: this.lastID,
          changes: this.changes,
          gradient: gradient
        });
      });
  });
});

// Update marketplace
app.put('/api/marketplaces/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, color, border_color, route, gradient_start, gradient_end, enable_single_page, redirect_url } = req.body;

  // First update the marketplaces table
  db.run(`UPDATE marketplaces SET 
    name = ?, 
    description = ?, 
    category = ?, 
    color = ?, 
    border_color = ?, 
    route = COALESCE(?, route),
    gradient_start = COALESCE(?, gradient_start),
    gradient_end = COALESCE(?, gradient_end),
    enable_single_page = COALESCE(?, enable_single_page),
    redirect_url = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [name, description, category, color, border_color, route, gradient_start, gradient_end, enable_single_page, redirect_url, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Also update the related main_marketplaces_sections entry if it exists
      // This ensures the homepage shows updated data immediately
      db.run(`UPDATE main_marketplaces_sections SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        updated_at = CURRENT_TIMESTAMP
        WHERE marketplace_id = ?`,
        [name, description, category, id],
        function (updateErr) {
          if (updateErr) {
            console.error('Error updating main_marketplaces_sections:', updateErr);
            // Don't fail the request if this update fails, just log it
          }
          res.json({ message: 'Marketplace updated successfully', changes: this.changes });
        });
    });
});

// Delete marketplace
app.delete('/api/marketplaces/:id', (req, res) => {
  const { id } = req.params;

  // First delete all section items for this marketplace's sections
  db.run(`DELETE FROM section_items WHERE section_id IN (SELECT id FROM marketplace_sections WHERE marketplace_id = ?)`, [id], (err) => {
    if (err) {
      console.error('Error deleting section items:', err.message);
      // Continue with deletion even if section items fail
    }

    // Then delete all sections for this marketplace
    db.run(`DELETE FROM marketplace_sections WHERE marketplace_id = ?`, [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Delete the corresponding main_marketplaces_sections entry (card on marketplace main page)
      db.run(`DELETE FROM main_marketplaces_sections WHERE marketplace_id = ?`, [id], (deleteMainErr) => {
        if (deleteMainErr) {
          console.error('Error deleting main_marketplaces_sections entry:', deleteMainErr.message);
          // Continue with marketplace deletion even if main section deletion fails
        }

        // Finally delete the marketplace
        db.run(`DELETE FROM marketplaces WHERE id = ?`, [id], function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'Marketplace deleted successfully', changes: this.changes });
        });
      });
    });
  });
});

// Toggle marketplace visibility
app.put('/api/marketplaces/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;

  // Get current visibility status
  db.get('SELECT is_visible FROM marketplaces WHERE id = ?', [id], (err, marketplace) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!marketplace) {
      res.status(404).json({ error: 'Marketplace not found' });
      return;
    }

    const newVisibility = marketplace.is_visible ? 0 : 1;

    // Update visibility
    db.run('UPDATE marketplaces SET is_visible = ? WHERE id = ?', [newVisibility, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: `Marketplace ${newVisibility ? 'shown' : 'hidden'} successfully`,
        is_visible: newVisibility,
        changes: this.changes
      });
    });
  });
});

// Helper function to duplicate section items
function duplicateSectionItems(originalMarketplaceId, sectionIdMap, newMarketplaceId, marketplaceName, marketplaceDescription, res) {
  // Get all section items for the original marketplace
  const originalSectionIds = Array.from(sectionIdMap.keys());
  const placeholders = originalSectionIds.map(() => '?').join(',');

  db.all(`SELECT * FROM section_items WHERE section_id IN (${placeholders}) ORDER BY section_id, order_index`, originalSectionIds, (err, items) => {
    if (err) {
      console.error('Error fetching section items:', err.message);
      res.json({
        message: 'Marketplace duplicated successfully (sections only)',
        id: newMarketplaceId,
        warning: 'Section items could not be duplicated'
      });
      return;
    }

    if (items.length === 0) {
      // Create main page section for the duplicated marketplace
      createMainMarketplaceSection(newMarketplaceId, marketplaceName, marketplaceDescription, () => {
        res.json({
          message: 'Marketplace duplicated successfully',
          id: newMarketplaceId
        });
      });
      return;
    }

    let completed = 0;
    items.forEach((item) => {
      const newSectionId = sectionIdMap.get(item.section_id);
      if (!newSectionId) {
        console.error('Could not find new section ID for item:', item.id);
        completed++;
        if (completed === items.length) {
          res.json({
            message: 'Marketplace duplicated successfully',
            id: newMarketplaceId,
            warning: 'Some section items could not be duplicated'
          });
        }
        return;
      }

      db.run(`INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newSectionId, item.item_type, item.title, item.description, item.icon, item.value, item.label, item.features, item.order_index],
        function (err) {
          if (err) {
            console.error('Error duplicating section item:', err.message);
          }
          completed++;
          if (completed === items.length) {
            // Create main page section for the duplicated marketplace
            createMainMarketplaceSection(newMarketplaceId, marketplaceName, marketplaceDescription, () => {
              res.json({
                message: 'Marketplace duplicated successfully',
                id: newMarketplaceId
              });
            });
          }
        });
    });
  });
}

// Helper function to find a unique route
function findUniqueRoute(baseRoute, callback) {
  let attemptRoute = baseRoute;
  let attemptNumber = 1;

  function checkRoute() {
    db.get('SELECT id FROM marketplaces WHERE route = ?', [attemptRoute], (err, existing) => {
      if (err) {
        callback(err, null);
        return;
      }

      if (!existing) {
        // Route is available
        callback(null, attemptRoute);
      } else {
        // Route exists, try with a number suffix
        attemptNumber++;
        attemptRoute = `${baseRoute}-${attemptNumber}`;
        checkRoute();
      }
    });
  }

  checkRoute();
}

// Duplicate marketplace
app.post('/api/marketplaces/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const { newName, newRoute, name } = req.body; // Accept both 'name' and 'newName' for compatibility

  // Get the original marketplace
  db.get('SELECT * FROM marketplaces WHERE id = ?', [id], (err, originalMarketplace) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!originalMarketplace) {
      res.status(404).json({ error: 'Marketplace not found' });
      return;
    }

    // Get the next order index
    db.get('SELECT MAX(order_index) as max_order FROM marketplaces', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const nextOrder = (result.max_order || -1) + 1;

      // Generate a proper route for the duplicate (accept both 'name' and 'newName')
      const duplicateName = newName || name || `${originalMarketplace.name} (Copy)`;

      // Create the duplicate marketplace with a temporary route (will be updated after we get the ID)
      // Use a placeholder route that won't conflict
      const tempRoute = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      db.run(`INSERT INTO marketplaces (name, description, category, color, border_color, route, order_index, gradient_start, gradient_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [duplicateName, originalMarketplace.description, originalMarketplace.category, originalMarketplace.color, originalMarketplace.border_color, tempRoute, nextOrder, originalMarketplace.gradient_start, originalMarketplace.gradient_end],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const newMarketplaceId = this.lastID;

          // Update the route to the correct format: /marketplaces/{id}
          const correctRoute = `/marketplaces/${newMarketplaceId}`;
          db.run(`UPDATE marketplaces SET route = ? WHERE id = ?`, [correctRoute, newMarketplaceId], (updateErr) => {
            if (updateErr) {
              console.error('Error updating route:', updateErr.message);
              // Continue anyway - the marketplace was created successfully
            }

            // Duplicate all sections
            db.all('SELECT * FROM marketplace_sections WHERE marketplace_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              if (sections.length === 0) {
                // Create main page section even if no sections exist
                createMainMarketplaceSection(newMarketplaceId, duplicateName, originalMarketplace.description, () => {
                  res.json({
                    message: 'Marketplace duplicated successfully',
                    id: newMarketplaceId,
                    changes: this.changes
                  });
                });
                return;
              }

              let completed = 0;
              const sectionIdMap = new Map(); // Map old section IDs to new section IDs

              sections.forEach((section, index) => {
                db.run(`INSERT INTO marketplace_sections (marketplace_id, section_type, title, content, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?)`,
                  [newMarketplaceId, section.section_type, section.title, section.content, section.order_index, section.is_visible],
                  function (err) {
                    if (err) {
                      console.error('Error duplicating section:', err.message);
                      completed++;
                      if (completed === sections.length) {
                        res.json({
                          message: 'Marketplace duplicated successfully',
                          id: newMarketplaceId,
                          changes: this.changes
                        });
                      }
                      return;
                    }

                    const newSectionId = this.lastID;
                    sectionIdMap.set(section.id, newSectionId);

                    completed++;
                    if (completed === sections.length) {
                      // Now duplicate all section items
                      duplicateSectionItems(id, sectionIdMap, newMarketplaceId, duplicateName, originalMarketplace.description, res);
                    }
                  });
              });
            });
          });
        });
    });
  });
});

// Marketplace Sections API Routes

// Get all sections for a marketplace
app.get('/api/marketplaces/:id/sections', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM marketplace_sections WHERE marketplace_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(sections);
  });
});

// Get single section
app.get('/api/marketplaces/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  db.get('SELECT * FROM marketplace_sections WHERE id = ? AND marketplace_id = ?', [sectionId, id], (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }
    res.json(section);
  });
});

// Create new section
app.post('/api/marketplaces/:id/sections', (req, res) => {
  const { id } = req.params;
  const { section_type, title, content, media_type, media_source, media_url } = req.body;

  // Validate media fields if section_type is media_banner
  let finalMediaUrl = null;

  if (section_type === 'media_banner') {
    if (!media_type || (media_type !== 'video' && media_type !== 'image')) {
      return res.status(400).json({ error: 'media_type must be "video" or "image" for media_banner sections' });
    }

    if (!media_source || (media_source !== 'youtube' && media_source !== 'upload')) {
      return res.status(400).json({ error: 'media_source must be "youtube" or "upload" for media_banner sections' });
    }

    if (!media_url) {
      return res.status(400).json({ error: 'media_url is required for media_banner sections' });
    }

    // Validate YouTube URL if source is youtube
    if (media_source === 'youtube') {
      const youtubeValidation = validateYouTubeUrl(media_url);
      if (!youtubeValidation.valid) {
        return res.status(400).json({ error: youtubeValidation.error });
      }
      // Use the normalized embed URL
      finalMediaUrl = youtubeValidation.embedUrl;
    } else {
      finalMediaUrl = media_url;
    }
  } else {
    finalMediaUrl = media_url || null;
  }

  // Get the order index
  const getOrderIndex = () => {
    return new Promise((resolve, reject) => {
      if (section_type === 'media_banner') {
        // Media banner always goes after hero (order_index = 1)
        getMarketplaceMediaBannerOrderIndex(id)
          .then(resolve)
          .catch(reject);
      } else {
        // Get the next order index
        db.get(`
          SELECT MAX(order_index) as max_order 
          FROM marketplace_sections 
          WHERE marketplace_id = ?
        `, [id], (err, result) => {
          if (err) reject(err);
          else resolve((result.max_order || -1) + 1);
        });
      }
    });
  };

  getOrderIndex().then(finalOrderIndex => {
    db.run(`INSERT INTO marketplace_sections (marketplace_id, section_type, title, content, order_index, media_type, media_source, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, section_type, title, content, finalOrderIndex, media_type || null, media_source || null, finalMediaUrl],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Section created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Update section
app.put('/api/marketplaces/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  const {
    section_type, title, content, is_visible, media_type, media_source, media_url, icon,
    pricing_table_header_app_name, pricing_table_header_specs, pricing_table_header_features,
    pricing_table_header_hourly, pricing_table_header_monthly, pricing_table_header_quarterly,
    pricing_table_header_yearly, pricing_table_header_action,
    show_hourly_column, show_monthly_column, show_quarterly_column, show_yearly_column
  } = req.body;

  // First, get the existing section to check for file cleanup
  db.get('SELECT * FROM marketplace_sections WHERE id = ? AND marketplace_id = ?', [sectionId, id], (err, existingSection) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!existingSection) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Validate and process media fields if section_type is media_banner
    let finalMediaType = media_type;
    let finalMediaSource = media_source;
    let finalMediaUrl = media_url;
    let oldFileToDelete = null;

    if (section_type === 'media_banner') {
      if (!media_type || (media_type !== 'video' && media_type !== 'image')) {
        return res.status(400).json({ error: 'media_type must be "video" or "image" for media_banner sections' });
      }

      if (!media_source || (media_source !== 'youtube' && media_source !== 'upload')) {
        return res.status(400).json({ error: 'media_source must be "youtube" or "upload" for media_banner sections' });
      }

      if (!media_url) {
        return res.status(400).json({ error: 'media_url is required for media_banner sections' });
      }

      // If media_source changed from upload to youtube, or media_url changed for upload, delete old file
      if (existingSection.media_source === 'upload' && existingSection.media_url) {
        if (media_source !== 'upload' || media_url !== existingSection.media_url) {
          oldFileToDelete = existingSection.media_url;
        }
      }

      // Validate YouTube URL if source is youtube
      if (media_source === 'youtube') {
        const youtubeValidation = validateYouTubeUrl(media_url);
        if (!youtubeValidation.valid) {
          return res.status(400).json({ error: youtubeValidation.error });
        }
        // Use the normalized embed URL
        finalMediaUrl = youtubeValidation.embedUrl;
      }
    } else {
      // If section type changed from media_banner to something else, delete old file
      if (existingSection.section_type === 'media_banner' && existingSection.media_source === 'upload' && existingSection.media_url) {
        oldFileToDelete = existingSection.media_url;
      }
      finalMediaType = null;
      finalMediaSource = null;
      finalMediaUrl = null;
    }

    // Delete old file if needed
    const deleteOldFile = () => {
      if (oldFileToDelete) {
        return deleteUploadedFile(oldFileToDelete);
      }
      return Promise.resolve({ success: true });
    };

    // Build dynamic query based on provided fields
    let updateFields = [];
    let values = [];

    if (section_type !== undefined) {
      updateFields.push('section_type = ?');
      values.push(section_type);
    }
    if (title !== undefined) {
      updateFields.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      values.push(content);
    }
    if (is_visible !== undefined) {
      updateFields.push('is_visible = ?');
      values.push(is_visible);
    }
    // Update media fields if provided or if section_type is media_banner
    if (media_type !== undefined || (section_type !== undefined && section_type === 'media_banner')) {
      updateFields.push('media_type = ?');
      values.push(finalMediaType);
    }
    if (media_source !== undefined || (section_type !== undefined && section_type === 'media_banner')) {
      updateFields.push('media_source = ?');
      values.push(finalMediaSource);
    }
    if (media_url !== undefined || (section_type !== undefined && section_type === 'media_banner')) {
      updateFields.push('media_url = ?');
      values.push(finalMediaUrl);
    }
    if (icon !== undefined) {
      updateFields.push('icon = ?');
      values.push(icon);
    }
    // Update pricing table header fields if provided
    if (pricing_table_header_app_name !== undefined) {
      updateFields.push('pricing_table_header_app_name = ?');
      values.push(pricing_table_header_app_name);
    }
    if (pricing_table_header_specs !== undefined) {
      updateFields.push('pricing_table_header_specs = ?');
      values.push(pricing_table_header_specs);
    }
    if (pricing_table_header_features !== undefined) {
      updateFields.push('pricing_table_header_features = ?');
      values.push(pricing_table_header_features);
    }
    if (pricing_table_header_hourly !== undefined) {
      updateFields.push('pricing_table_header_hourly = ?');
      values.push(pricing_table_header_hourly);
    }
    if (pricing_table_header_monthly !== undefined) {
      updateFields.push('pricing_table_header_monthly = ?');
      values.push(pricing_table_header_monthly);
    }
    if (pricing_table_header_quarterly !== undefined) {
      updateFields.push('pricing_table_header_quarterly = ?');
      values.push(pricing_table_header_quarterly);
    }
    if (pricing_table_header_yearly !== undefined) {
      updateFields.push('pricing_table_header_yearly = ?');
      values.push(pricing_table_header_yearly);
    }
    if (pricing_table_header_action !== undefined) {
      updateFields.push('pricing_table_header_action = ?');
      values.push(pricing_table_header_action);
    }
    // Update pricing column visibility fields if provided
    if (show_hourly_column !== undefined) {
      updateFields.push('show_hourly_column = ?');
      values.push(show_hourly_column ? 1 : 0);
    }
    if (show_monthly_column !== undefined) {
      updateFields.push('show_monthly_column = ?');
      values.push(show_monthly_column ? 1 : 0);
    }
    if (show_quarterly_column !== undefined) {
      updateFields.push('show_quarterly_column = ?');
      values.push(show_quarterly_column ? 1 : 0);
    }
    if (show_yearly_column !== undefined) {
      updateFields.push('show_yearly_column = ?');
      values.push(show_yearly_column ? 1 : 0);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(sectionId, id);

    const query = `UPDATE marketplace_sections SET ${updateFields.join(', ')} WHERE id = ? AND marketplace_id = ?`;

    // Update the section
    deleteOldFile().then(() => {
      db.run(query, values, function (updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }
        res.json({ message: 'Section updated successfully', changes: this.changes });
      });
    }).catch(deleteErr => {
      console.error('Error deleting old file:', deleteErr);
      // Continue with update even if file deletion fails
      db.run(query, values, function (updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }
        res.json({ message: 'Section updated successfully (old file deletion failed)', changes: this.changes });
      });
    });
  });
});

// Delete section
app.delete('/api/marketplaces/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;

  // Get section info to delete associated file if it's an uploaded file
  db.get(`
    SELECT media_source, media_url, section_type
    FROM marketplace_sections 
    WHERE id = ? AND marketplace_id = ?
  `, [sectionId, id], (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Delete associated file if it's an uploaded file for media_banner section
    const deleteFilePromise = (section.section_type === 'media_banner' && section.media_source === 'upload' && section.media_url)
      ? deleteUploadedFile(section.media_url)
      : Promise.resolve({ success: true });

    // Delete the section
    deleteFilePromise.then(() => {
      db.run(`DELETE FROM marketplace_sections WHERE id = ? AND marketplace_id = ?`, [sectionId, id], function (deleteErr) {
        if (deleteErr) {
          res.status(500).json({ error: deleteErr.message });
          return;
        }
        res.json({ message: 'Section deleted successfully', changes: this.changes });
      });
    }).catch(deleteFileErr => {
      console.error('Error deleting file:', deleteFileErr);
      // Continue with section deletion even if file deletion fails
      db.run(`DELETE FROM marketplace_sections WHERE id = ? AND marketplace_id = ?`, [sectionId, id], function (deleteErr) {
        if (deleteErr) {
          res.status(500).json({ error: deleteErr.message });
          return;
        }
        res.json({ message: 'Section deleted successfully (file deletion failed)', changes: this.changes });
      });
    });
  });
});

// Section Items API Routes

// Get all items for a specific section
app.get('/api/marketplaces/:id/sections/:sectionId/items', (req, res) => {
  const { sectionId } = req.params;
  db.all('SELECT * FROM section_items WHERE section_id = ? ORDER BY order_index ASC', [sectionId], (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items);
  });
});

// Create new section item
app.post('/api/marketplaces/:id/sections/:sectionId/items', (req, res) => {
  const { sectionId } = req.params;
  const { item_type, title, description, icon, value, label, features, content, is_visible } = req.body;

  // Get next order index
  db.get('SELECT MAX(order_index) as max_order FROM section_items WHERE section_id = ?', [sectionId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || -1) + 1;
    const visibility = is_visible !== undefined ? is_visible : 1; // Default to visible

    db.run(`INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, content, is_visible, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sectionId, item_type, title, description, icon, value, label, features, content || null, visibility, nextOrder],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Section item created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  });
});

// Update section item
app.put('/api/marketplaces/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { itemId, sectionId } = req.params;
  const { item_type, title, description, icon, value, label, features, is_visible, content } = req.body;

  console.log(`[PUT /api/marketplaces/:id/sections/:sectionId/items/:itemId] Updating item ${itemId} in section ${sectionId}`);
  console.log('Request body:', { item_type, title, description, icon, value, label, features, is_visible, content: content ? (content.length > 100 ? content.substring(0, 100) + '...' : content) : null });

  // Build dynamic update query
  const updateFields = [];
  const values = [];

  if (item_type !== undefined) {
    updateFields.push('item_type = ?');
    values.push(item_type);
  }
  if (title !== undefined) {
    updateFields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    values.push(description);
  }
  if (icon !== undefined) {
    updateFields.push('icon = ?');
    values.push(icon);
  }
  if (value !== undefined) {
    updateFields.push('value = ?');
    values.push(value);
  }
  if (label !== undefined) {
    updateFields.push('label = ?');
    values.push(label);
  }
  if (features !== undefined) {
    updateFields.push('features = ?');
    values.push(features);
  }
  if (content !== undefined && content !== null) {
    updateFields.push('content = ?');
    values.push(content);
    console.log(`[PUT] Including content field in update: ${content.substring(0, 100)}...`);
  } else {
    console.log(`[PUT] Content field is ${content === null ? 'null' : 'undefined'}, not updating it`);
  }
  if (is_visible !== undefined) {
    updateFields.push('is_visible = ?');
    values.push(is_visible);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(itemId, sectionId);

  const query = `UPDATE section_items SET ${updateFields.join(', ')} WHERE id = ? AND section_id = ?`;
  console.log('[PUT] SQL Query:', query);
  console.log('[PUT] Values:', values.map((v, i) => i < values.length - 2 ? (typeof v === 'string' && v.length > 50 ? v.substring(0, 50) + '...' : v) : v));

  db.run(query, values, function (err) {
    if (err) {
      console.error('[PUT] Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(`[PUT] Update successful. Changes: ${this.changes}`);

    // Verify the content was saved by retrieving it
    db.get('SELECT content FROM section_items WHERE id = ?', [itemId], (err, row) => {
      if (!err && row) {
        console.log('[PUT] Verified saved content:', row.content ? (row.content.length > 100 ? row.content.substring(0, 100) + '...' : row.content) : 'NULL');
      }
    });

    res.json({ message: 'Section item updated successfully', changes: this.changes });
  });
});

// Delete section item
app.delete('/api/marketplaces/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { itemId, sectionId } = req.params;

  db.run(`DELETE FROM section_items WHERE id = ? AND section_id = ?`, [itemId, sectionId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section item deleted successfully', changes: this.changes });
  });
});

// Toggle section item visibility
app.put('/api/marketplaces/:id/sections/:sectionId/items/:itemId/toggle-visibility', (req, res) => {
  const { itemId, sectionId } = req.params;

  db.get('SELECT is_visible FROM section_items WHERE id = ? AND section_id = ?', [itemId, sectionId], (err, item) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!item) {
      res.status(404).json({ error: 'Section item not found' });
      return;
    }

    const newVisibility = item.is_visible === 1 ? 0 : 1;

    db.run('UPDATE section_items SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND section_id = ?',
      [newVisibility, itemId, sectionId], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Section item visibility toggled successfully',
          is_visible: newVisibility,
          changes: this.changes
        });
      });
  });
});

// ============================================================
// PRODUCTS API ROUTES (Mirroring Marketplaces Structure)
// ============================================================

// Get all products (including hidden) - for admin panel
app.get('/api/admin/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY order_index ASC', (err, products) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(products);
  });
});

// Get all products (visible only)
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products WHERE is_visible = 1 ORDER BY order_index ASC', (err, products) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(products);
  });
});

// Get all products with their card data (for ProductsMainAdmin)
// Auto-creates card entries if they don't exist
// IMPORTANT: This route must be defined BEFORE /api/products/:id to avoid route conflicts
app.get('/api/products/with-cards', (req, res) => {
  console.log('📦 Fetching products with cards...');
  // Get all visible products
  db.all('SELECT * FROM products WHERE is_visible = 1 ORDER BY order_index ASC, id ASC', (err, products) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!products || products.length === 0) {
      return res.json([]);
    }

    // Get all existing card entries
    db.all('SELECT * FROM main_products_sections', (err, cardEntries) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Create a map of product_id -> card entry
      const cardMap = new Map();
      cardEntries.forEach(card => {
        if (card.product_id) {
          cardMap.set(card.product_id, card);
        }
      });

      // Get max order index for new entries
      const maxOrder = cardEntries.length > 0
        ? Math.max(...cardEntries.map(c => c.order_index || 0))
        : -1;

      let processedCount = 0;
      const productsWithCards = [];
      const cardsToCreate = [];

      // Process each product
      products.forEach((product, index) => {
        let cardEntry = cardMap.get(product.id);

        // If card doesn't exist, prepare to create it
        if (!cardEntry) {
          const newOrder = maxOrder + index + 1;
          cardsToCreate.push({
            product_id: product.id,
            title: product.name,
            description: product.description || '',
            category: product.category || null,
            order_index: newOrder
          });

          // Use temporary card entry for response
          cardEntry = {
            id: null,
            product_id: product.id,
            title: product.name,
            description: product.description || '',
            category: product.category || null,
            features: null,
            is_visible: 1,
            order_index: newOrder,
            popular_tag: null,
            price: null,
            price_period: null,
            free_trial_tag: null,
            button_text: null
          };
        }

        // Parse features if it's a JSON string
        let features = [];
        if (cardEntry.features) {
          try {
            if (typeof cardEntry.features === 'string') {
              features = JSON.parse(cardEntry.features);
            } else if (Array.isArray(cardEntry.features)) {
              features = cardEntry.features;
            }
          } catch (e) {
            features = [];
          }
        }

        productsWithCards.push({
          product: product,
          card: {
            id: cardEntry.id,
            product_id: cardEntry.product_id,
            title: cardEntry.title,
            description: cardEntry.description,
            category: cardEntry.category,
            features: features,
            is_visible: cardEntry.is_visible,
            order_index: cardEntry.order_index,
            popular_tag: cardEntry.popular_tag,
            price: cardEntry.price,
            price_period: cardEntry.price_period,
            free_trial_tag: cardEntry.free_trial_tag,
            button_text: cardEntry.button_text
          }
        });

        processedCount++;
      });

      // Create missing card entries
      if (cardsToCreate.length > 0) {
        let createdCount = 0;
        cardsToCreate.forEach(cardData => {
          db.run(`
            INSERT INTO main_products_sections (product_id, title, description, category, is_visible, order_index)
            VALUES (?, ?, ?, ?, 1, ?)
          `, [
            cardData.product_id,
            cardData.title,
            cardData.description,
            cardData.category,
            cardData.order_index
          ], function (createErr) {
            if (createErr) {
              console.error('Error auto-creating card entry:', createErr);
            } else {
              // Update the card id in the response
              const matchingItem = productsWithCards.find(item =>
                item.card.product_id === cardData.product_id && item.card.id === null
              );
              if (matchingItem) {
                matchingItem.card.id = this.lastID;
              }
            }
            createdCount++;
            if (createdCount === cardsToCreate.length) {
              // All created, fetch updated cards to get their IDs
              const productIds = cardsToCreate.map(c => c.product_id);
              const placeholders = productIds.map(() => '?').join(',');
              db.all(`SELECT * FROM main_products_sections WHERE product_id IN (${placeholders})`,
                productIds,
                (fetchErr, newCards) => {
                  if (!fetchErr && newCards) {
                    newCards.forEach(newCard => {
                      const matchingItem = productsWithCards.find(item =>
                        item.card.product_id === newCard.product_id && item.card.id === null
                      );
                      if (matchingItem) {
                        matchingItem.card.id = newCard.id;
                        // Parse features if needed
                        let features = [];
                        if (newCard.features) {
                          try {
                            if (typeof newCard.features === 'string') {
                              features = JSON.parse(newCard.features);
                            } else if (Array.isArray(newCard.features)) {
                              features = newCard.features;
                            }
                          } catch (e) {
                            features = [];
                          }
                        }
                        matchingItem.card.features = features;
                      }
                    });
                  }
                  res.json(productsWithCards);
                }
              );
            }
          });
        });
      } else {
        res.json(productsWithCards);
      }
    });
  });
});

// Get product categories in order
// Get all product categories
app.get('/api/products/categories', (req, res) => {
  db.all('SELECT * FROM product_categories ORDER BY order_index ASC', (err, categories) => {
    if (err) {
      if (err.message.includes('no such table')) {
        console.log('product_categories table does not exist yet, returning empty array');
        return res.json([]);
      }
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(categories || []);
  });
});

// Add new product category
app.post('/api/products/categories', (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  // Get max order_index
  db.get('SELECT MAX(order_index) as max_order FROM product_categories', (err, row) => {
    const nextOrder = (row?.max_order || -1) + 1;

    db.run(
      'INSERT INTO product_categories (name, order_index) VALUES (?, ?)',
      [name.trim(), nextOrder],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Category already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Category created', id: this.lastID, order_index: nextOrder });
      }
    );
  });
});

// Delete product category
app.delete('/api/products/categories/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM product_categories WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Category deleted', changes: this.changes });
  });
});

// Rename product category
app.put('/api/products/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  db.run(
    'UPDATE product_categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name.trim(), id],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Category name already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Category updated', changes: this.changes });
    }
  );
});

// Get single product
// IMPORTANT: This route must be defined AFTER /api/products/with-cards to avoid route conflicts
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;

  // Skip if id is a special route keyword (should be handled by other routes)
  if (id === 'with-cards' || id === 'categories' || id === 'by-route') {
    // This shouldn't happen if routes are in correct order, but just in case
    return res.status(404).json({ error: 'Route not found' });
  }

  // Check if id is numeric (product ID) or not
  if (isNaN(id)) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  });
});

// Get product by route slug
app.get('/api/products/by-route/:route', (req, res) => {
  // Decode the route parameter (Express should do this automatically, but be safe)
  let route = decodeURIComponent(req.params.route);

  // Try multiple route formats
  const routeVariations = [
    route, // Exact match
    route.startsWith('/') ? route.substring(1) : route, // Without leading slash
    route.startsWith('/products/') ? route.substring('/products/'.length) : route, // Without /products/ prefix
    `/products/${route}`, // With /products/ prefix
    route.startsWith('/') ? `/products${route}` : `/products/${route}` // Add /products/ if missing
  ];

  // Remove duplicates
  const uniqueRoutes = [...new Set(routeVariations)];

  let attempts = 0;
  const maxAttempts = uniqueRoutes.length;

  function tryRoute(routeToTry) {
    db.get('SELECT * FROM products WHERE route = ? AND is_visible = 1', [routeToTry], (err, product) => {
      if (err) {
        console.error(`Error fetching product by route (attempt ${attempts + 1}):`, err);
        attempts++;
        if (attempts >= maxAttempts) {
          res.status(500).json({ error: err.message });
          return;
        }
        tryRoute(uniqueRoutes[attempts]);
        return;
      }

      if (product) {
        res.json(product);
        return;
      }

      // Product not found with this route variation
      attempts++;
      if (attempts >= maxAttempts) {
        console.log(`Product not found for route: ${route} (tried: ${uniqueRoutes.join(', ')})`);
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      // Try next variation
      tryRoute(uniqueRoutes[attempts]);
    });
  }

  // Start with first route variation
  tryRoute(uniqueRoutes[0]);
});

// Get product sections by route slug
app.get('/api/products/by-route/:route/sections', (req, res) => {
  // Decode the route parameter
  let route = decodeURIComponent(req.params.route);

  // Try multiple route formats
  const routeVariations = [
    route, // Exact match
    route.startsWith('/') ? route.substring(1) : route, // Without leading slash
    route.startsWith('/products/') ? route.substring('/products/'.length) : route, // Without /products/ prefix
    `/products/${route}`, // With /products/ prefix
    route.startsWith('/') ? `/products${route}` : `/products/${route}` // Add /products/ if missing
  ];

  // Remove duplicates
  const uniqueRoutes = [...new Set(routeVariations)];

  let attempts = 0;
  const maxAttempts = uniqueRoutes.length;

  function tryRoute(routeToTry) {
    db.get('SELECT id FROM products WHERE route = ? AND is_visible = 1', [routeToTry], (err, product) => {
      if (err) {
        console.error(`Error fetching product by route (sections, attempt ${attempts + 1}):`, err);
        attempts++;
        if (attempts >= maxAttempts) {
          res.status(500).json({ error: err.message });
          return;
        }
        tryRoute(uniqueRoutes[attempts]);
        return;
      }

      if (product) {
        // Then get sections for this product
        db.all(`
          SELECT * FROM product_sections 
          WHERE product_id = ? AND is_visible = 1 
          ORDER BY order_index ASC
        `, [product.id], (err2, sections) => {
          if (err2) {
            res.status(500).json({ error: err2.message });
            return;
          }
          res.json(sections);
        });
        return;
      }

      // Product not found with this route variation
      attempts++;
      if (attempts >= maxAttempts) {
        console.log(`Product not found for route (sections): ${route} (tried: ${uniqueRoutes.join(', ')})`);
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      // Try next variation
      tryRoute(uniqueRoutes[attempts]);
    });
  }

  // Start with first route variation
  tryRoute(uniqueRoutes[0]);
});

// Helper function to create main page section for duplicated product
function createMainProductSection(productId, productName, productDescription, callback) {
  // Get the next order index for main products sections
  db.get('SELECT MAX(order_index) as max_order FROM main_products_sections', (err, result) => {
    if (err) {
      console.error('Error getting max order for main products sections:', err.message);
      callback(); // Continue even if this fails
      return;
    }

    const nextOrder = (result.max_order || 0) + 1;

    // Insert new main page section
    db.run(`
      INSERT INTO main_products_sections (product_id, title, description, is_visible, order_index, button_text) 
      VALUES (?, ?, ?, 1, ?, 'Explore Product')
    `, [productId, productName, productDescription, nextOrder], function (err) {
      if (err) {
        console.error('Error creating main products section:', err.message);
      } else {
        console.log(`✅ Created main products section for: ${productName}`);
      }
      callback(); // Always call callback to continue
    });
  });
}

// Create new product
app.post('/api/products', (req, res) => {
  const { name, description, category, color, border_color, route, enable_single_page = 1, redirect_url = null, icon = null } = req.body;

  // Your 4 perfect colors (only these will be used)
  const gradientColors = [
    { start: 'blue', end: 'blue-100' },      // Financial Services
    { start: 'purple', end: 'purple-100' },  // Financial Services (Copy)
    { start: 'green', end: 'green-100' },    // Retail
    { start: 'orange', end: 'orange-100' }   // Healthcare
  ];

  // Get the next order index and count existing products for gradient assignment
  db.get('SELECT MAX(order_index) as max_order, COUNT(*) as total_count FROM products', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || -1) + 1;
    const totalCount = result.total_count || 0;

    // Assign gradient color based on total count (cycles through palette)
    const gradientIndex = totalCount % gradientColors.length;
    const gradient = gradientColors[gradientIndex];

    db.run(`INSERT INTO products (name, description, category, color, border_color, route, order_index, enable_single_page, redirect_url, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category, color, border_color, route, nextOrder, enable_single_page, redirect_url, icon],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const newProductId = this.lastID;

        // Auto-create corresponding entry in main_products_sections to keep them interlinked
        createMainProductSection(newProductId, name, description, () => {
          res.json({
            message: 'Product created successfully',
            id: newProductId,
            changes: this.changes
          });
        });
      });
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, color, border_color, route, enable_single_page, redirect_url, icon } = req.body;

  // Get current product to check if name changed
  db.get('SELECT name, route FROM products WHERE id = ?', [id], (err, currentProduct) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!currentProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Sanitize route if provided - remove /products/ prefix and leading/trailing slashes
    // Only update route if explicitly provided (not undefined and not missing from request)
    // If route is not in req.body at all, preserve existing route
    let sanitizedRoute = undefined;
    if (route !== undefined && route !== null && route !== '' && String(route).trim() !== '') {
      sanitizedRoute = String(route).replace(/^\/products\//, '').replace(/^\/+|\/+$/g, '');
      // Only allow alphanumeric, hyphens, and underscores
      sanitizedRoute = sanitizedRoute.replace(/[^a-z0-9\-_]/gi, '-').toLowerCase();
      // If after sanitization it's empty, set to undefined to preserve existing route
      if (sanitizedRoute === '' || sanitizedRoute === '-') {
        sanitizedRoute = undefined;
      }

      // If route is provided, check if it's unique (unless it's the same as current route)
      if (sanitizedRoute && sanitizedRoute !== currentProduct.route) {
        db.get('SELECT id FROM products WHERE route = ? AND id != ?', [sanitizedRoute, id], (routeErr, existing) => {
          if (routeErr) {
            res.status(500).json({ error: routeErr.message });
            return;
          }

          if (existing) {
            // Route already exists, append a number to make it unique
            let attemptRoute = sanitizedRoute;
            let attemptNumber = 1;

            function findUniqueRoute() {
              db.get('SELECT id FROM products WHERE route = ? AND id != ?', [attemptRoute, id], (checkErr, checkExisting) => {
                if (checkErr) {
                  res.status(500).json({ error: checkErr.message });
                  return;
                }

                if (!checkExisting) {
                  // Route is unique, use it
                  sanitizedRoute = attemptRoute;
                  continueUpdate();
                } else {
                  // Route exists, try next number
                  attemptNumber++;
                  attemptRoute = `${sanitizedRoute}-${attemptNumber}`;
                  findUniqueRoute();
                }
              });
            }

            findUniqueRoute();
          } else {
            // Route is unique, continue
            continueUpdate();
          }
        });
      } else {
        // Route is same as current or undefined, continue
        continueUpdate();
      }
    } else {
      // No route provided, continue with update (preserve existing route)
      continueUpdate();
    }

    function continueUpdate() {
      // Only update route if explicitly provided (not undefined)
      // If route is undefined, preserve existing route (don't include in UPDATE)
      // First update the products table
      db.run(`UPDATE products SET 
        name = ?, 
        description = ?, 
        category = ?, 
        color = ?, 
        border_color = ?, 
        ${sanitizedRoute !== undefined ? 'route = ?,' : ''}
        enable_single_page = COALESCE(?, enable_single_page),
        redirect_url = ?,
        icon = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        sanitizedRoute !== undefined
          ? [name, description, category, color, border_color, sanitizedRoute, enable_single_page, redirect_url, icon, id]
          : [name, description, category, color, border_color, enable_single_page, redirect_url, icon, id],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          // Also update the related main_products_sections entry if it exists
          // This ensures the homepage shows updated data immediately
          db.run(`UPDATE main_products_sections SET 
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            updated_at = CURRENT_TIMESTAMP
            WHERE product_id = ?`,
            [name, description, id],
            function (updateErr) {
              if (updateErr) {
                console.error('Error updating main_products_sections:', updateErr);
                // Don't fail the request if this update fails, just log it
              }

              // Update hero section title item if product name changed
              // This ensures the hero section displays the updated product name
              db.get('SELECT id FROM product_sections WHERE product_id = ? AND section_type = ?', [id, 'hero'], (heroErr, heroSection) => {
                if (!heroErr && heroSection) {
                  // Update the title item in the hero section
                  db.run(`UPDATE product_items SET 
                    title = ?,
                    description = COALESCE(?, description)
                    WHERE section_id = ? AND item_type = ?`,
                    [name, description, heroSection.id, 'title'],
                    (itemErr) => {
                      if (itemErr) {
                        console.error('Error updating hero title item:', itemErr);
                        // Don't fail the request if this update fails
                      }
                    }
                  );

                  // Also update the hero section title
                  db.run(`UPDATE product_sections SET 
                    title = ?,
                    description = COALESCE(?, description)
                    WHERE id = ?`,
                    [name, description, heroSection.id],
                    (sectionErr) => {
                      if (sectionErr) {
                        console.error('Error updating hero section:', sectionErr);
                        // Don't fail the request if this update fails
                      }
                    }
                  );
                }

                res.json({ message: 'Product updated successfully', changes: this.changes });
              });
            });
        });
    }
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  // First delete all product items for this product's sections
  db.run(`DELETE FROM product_items WHERE section_id IN (SELECT id FROM product_sections WHERE product_id = ?)`, [id], (err) => {
    if (err) {
      console.error('Error deleting product items:', err.message);
      // Continue with deletion even if product items fail
    }

    // Then delete all sections for this product
    db.run(`DELETE FROM product_sections WHERE product_id = ?`, [id], (err) => {
      if (err) {
        console.error('Error deleting product sections:', err.message);
      }

      // Also delete from main_products_sections
      db.run(`DELETE FROM main_products_sections WHERE product_id = ?`, [id], (err) => {
        if (err) {
          console.error('Error deleting main_products_sections entry:', err.message);
        }

        // Finally delete the product
        db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'Product deleted successfully', changes: this.changes });
        });
      });
    });
  });
});

// Toggle product visibility
app.put('/api/products/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;

  // Get current visibility status
  db.get('SELECT is_visible FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const newVisibility = product.is_visible ? 0 : 1;

    // Update visibility
    db.run('UPDATE products SET is_visible = ? WHERE id = ?', [newVisibility, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: `Product ${newVisibility ? 'shown' : 'hidden'} successfully`,
        is_visible: newVisibility,
        changes: this.changes
      });
    });
  });
});

// Helper function to duplicate product items
function duplicateProductItems(originalProductId, sectionIdMap, newProductId, productName, productDescription, res) {
  // Get all product items for the original product
  const originalSectionIds = Array.from(sectionIdMap.keys());
  const placeholders = originalSectionIds.map(() => '?').join(',');

  db.all(`SELECT * FROM product_items WHERE section_id IN (${placeholders}) ORDER BY section_id, order_index`, originalSectionIds, (err, items) => {
    if (err) {
      console.error('Error fetching product items:', err.message);
      res.json({
        message: 'Product duplicated successfully (sections only)',
        id: newProductId,
        warning: 'Product items could not be duplicated'
      });
      return;
    }

    if (items.length === 0) {
      // Create main page section for the duplicated product
      createMainProductSection(newProductId, productName, productDescription, () => {
        res.json({
          message: 'Product duplicated successfully',
          id: newProductId
        });
      });
      return;
    }

    let completed = 0;
    items.forEach((item) => {
      const newSectionId = sectionIdMap.get(item.section_id);
      if (!newSectionId) {
        console.error('Could not find new section ID for item:', item.id);
        completed++;
        if (completed === items.length) {
          res.json({
            message: 'Product duplicated successfully',
            id: newProductId,
            warning: 'Some product items could not be duplicated'
          });
        }
        return;
      }

      db.run(`INSERT INTO product_items (section_id, item_type, title, description, content, icon, value, label, features, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newSectionId, item.item_type, item.title, item.description, item.content || null, item.icon, item.value, item.label, item.features, item.order_index, item.is_visible || 1],
        function (err) {
          if (err) {
            console.error('Error duplicating product item:', err.message);
          }
          completed++;
          if (completed === items.length) {
            // Create main page section for the duplicated product
            createMainProductSection(newProductId, productName, productDescription, () => {
              res.json({
                message: 'Product duplicated successfully',
                id: newProductId
              });
            });
          }
        });
    });
  });
}

// Helper function to find a unique route for products
function findUniqueProductRoute(baseRoute, callback) {
  let attemptRoute = baseRoute;
  let attemptNumber = 1;

  function checkRoute() {
    db.get('SELECT id FROM products WHERE route = ?', [attemptRoute], (err, existing) => {
      if (err) {
        callback(err, null);
        return;
      }

      if (!existing) {
        // Route is available
        callback(null, attemptRoute);
      } else {
        // Route exists, try with a number suffix
        attemptNumber++;
        attemptRoute = `${baseRoute}-${attemptNumber}`;
        checkRoute();
      }
    });
  }

  checkRoute();
}

// Duplicate product
app.post('/api/products/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const { newName, newRoute, name } = req.body; // Accept both 'name' and 'newName' for compatibility

  // Get the original product
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, originalProduct) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!originalProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Get the next order index
    db.get('SELECT MAX(order_index) as max_order FROM products', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const nextOrder = (result.max_order || -1) + 1;

      // Generate a proper route for the duplicate (accept both 'name' and 'newName')
      const duplicateName = newName || name || `${originalProduct.name} (Copy)`;

      // Create the duplicate product with a temporary route (will be updated after we get the ID)
      // Use a placeholder route that won't conflict
      const tempRoute = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      db.run(`INSERT INTO products (name, description, category, color, border_color, route, order_index, enable_single_page, redirect_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [duplicateName, originalProduct.description, originalProduct.category, originalProduct.color, originalProduct.border_color, tempRoute, nextOrder, originalProduct.enable_single_page, originalProduct.redirect_url],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const newProductId = this.lastID;

          // Generate a proper slug route from the product name
          const baseSlug = duplicateName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          // Find a unique route
          findUniqueProductRoute(baseSlug, (routeErr, uniqueRoute) => {
            if (routeErr) {
              console.error('Error finding unique route:', routeErr);
              // Fallback to ID-based route if slug generation fails
              const fallbackRoute = `${baseSlug}-${newProductId}`;
              db.run(`UPDATE products SET route = ? WHERE id = ?`, [fallbackRoute, newProductId], (updateErr) => {
                if (updateErr) {
                  console.error('Error updating route:', updateErr.message);
                }
                continueDuplication();
              });
              return;
            }

            // Update the route to the unique slug
            db.run(`UPDATE products SET route = ? WHERE id = ?`, [uniqueRoute, newProductId], (updateErr) => {
              if (updateErr) {
                console.error('Error updating route:', updateErr.message);
                // Continue anyway - the product was created successfully
              }

              // Continue with duplication
              continueDuplication();
            });
          });

          // Function to continue duplication after route is set
          function continueDuplication() {
            // Duplicate all sections
            db.all('SELECT * FROM product_sections WHERE product_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              if (sections.length === 0) {
                // Create main page section even if no sections exist
                createMainProductSection(newProductId, duplicateName, originalProduct.description, () => {
                  res.json({
                    message: 'Product duplicated successfully',
                    id: newProductId
                  });
                });
                return;
              }

              // Map old section IDs to new section IDs
              const sectionIdMap = new Map();
              let sectionsCompleted = 0;

              sections.forEach((section) => {
                // Include ALL fields including content and description
                db.run(`INSERT INTO product_sections (product_id, section_type, title, description, content, order_index, is_visible, media_type, media_source, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [newProductId, section.section_type, section.title || '', section.description || null, section.content || null, section.order_index, section.is_visible, section.media_type || null, section.media_source || null, section.media_url || null],
                  function (err) {
                    if (err) {
                      // If error is about content column, try without it
                      if (err.message.includes('no such column')) {
                        console.log('   ⚠️  Some column not found, trying basic insert...');
                        db.run(`INSERT INTO product_sections (product_id, section_type, title, description, content, order_index, is_visible, media_type, media_source, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                          [newProductId, section.section_type, section.title || '', section.description || null, section.content || null, section.order_index, section.is_visible, section.media_type || null, section.media_source || null, section.media_url || null],
                          function (err2) {
                            if (err2) {
                              console.error('Error duplicating section (retry):', err2.message);
                            } else {
                              sectionIdMap.set(section.id, this.lastID);
                            }

                            sectionsCompleted++;
                            if (sectionsCompleted === sections.length) {
                              duplicateProductItems(id, sectionIdMap, newProductId, duplicateName, originalProduct.description, res);
                            }
                          });
                      } else {
                        console.error('Error duplicating section:', err.message);
                        sectionsCompleted++;
                        if (sectionsCompleted === sections.length) {
                          duplicateProductItems(id, sectionIdMap, newProductId, duplicateName, originalProduct.description, res);
                        }
                      }
                    } else {
                      sectionIdMap.set(section.id, this.lastID);
                      sectionsCompleted++;
                      if (sectionsCompleted === sections.length) {
                        duplicateProductItems(id, sectionIdMap, newProductId, duplicateName, originalProduct.description, res);
                      }
                    }
                  });
              });
            });
          }
        });
    });
  });
});

// Product Sections API Routes

// Get all sections for a product
app.get('/api/products/:id/sections', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM product_sections WHERE product_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(sections);
  });
});

// Get single section
app.get('/api/products/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  db.get('SELECT * FROM product_sections WHERE id = ? AND product_id = ?', [sectionId, id], (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }
    res.json(section);
  });
});

// Create new section
app.post('/api/products/:id/sections', (req, res) => {
  const { id } = req.params;
  const { section_type, title, content, media_type, media_source, media_url } = req.body;

  // Validate media fields if section_type is media_banner
  let finalMediaUrl = null;

  if (section_type === 'media_banner') {
    if (!media_type || (media_type !== 'video' && media_type !== 'image')) {
      return res.status(400).json({ error: 'media_type must be "video" or "image" for media_banner sections' });
    }

    if (!media_source || (media_source !== 'youtube' && media_source !== 'upload')) {
      return res.status(400).json({ error: 'media_source must be "youtube" or "upload" for media_banner sections' });
    }

    if (!media_url) {
      return res.status(400).json({ error: 'media_url is required for media_banner sections' });
    }

    // Validate YouTube URL if source is youtube
    if (media_source === 'youtube') {
      const youtubeValidation = validateYouTubeUrl(media_url);
      if (!youtubeValidation.valid) {
        return res.status(400).json({ error: youtubeValidation.error });
      }
      // Use the normalized embed URL
      finalMediaUrl = youtubeValidation.embedUrl;
    } else {
      finalMediaUrl = media_url;
    }
  } else {
    finalMediaUrl = media_url || null;
  }

  // Get the order index
  const getOrderIndex = () => {
    return new Promise((resolve, reject) => {
      if (section_type === 'media_banner') {
        // Media banner always goes after hero (order_index = 1)
        getProductMediaBannerOrderIndex(id)
          .then(resolve)
          .catch(reject);
      } else {
        // Get the next order index
        db.get(`
          SELECT MAX(order_index) as max_order 
          FROM product_sections 
          WHERE product_id = ?
        `, [id], (err, result) => {
          if (err) reject(err);
          else resolve((result.max_order || -1) + 1);
        });
      }
    });
  };

  getOrderIndex().then(finalOrderIndex => {
    db.run(`INSERT INTO product_sections (product_id, section_type, title, content, order_index, media_type, media_source, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, section_type, title, content, finalOrderIndex, media_type || null, media_source || null, finalMediaUrl],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Section created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Update section
app.put('/api/products/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  const {
    section_type, title, content, description, is_visible, order_index,
    media_type, media_source, media_url,
    pricing_table_header_plan, pricing_table_header_specs, pricing_table_header_features,
    pricing_table_header_hourly, pricing_table_header_monthly, pricing_table_header_quarterly,
    pricing_table_header_yearly, pricing_table_header_action,
    show_hourly_column, show_monthly_column, show_quarterly_column, show_yearly_column
  } = req.body;

  // First, get the existing section to check for file cleanup
  db.get('SELECT * FROM product_sections WHERE id = ? AND product_id = ?', [sectionId, id], (err, existingSection) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!existingSection) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Validate and process media fields if section_type is media_banner
    let finalMediaType = media_type;
    let finalMediaSource = media_source;
    let finalMediaUrl = media_url;
    let oldFileToDelete = null;

    if (section_type === 'media_banner') {
      if (!media_type || (media_type !== 'video' && media_type !== 'image')) {
        return res.status(400).json({ error: 'media_type must be "video" or "image" for media_banner sections' });
      }

      if (!media_source || (media_source !== 'youtube' && media_source !== 'upload')) {
        return res.status(400).json({ error: 'media_source must be "youtube" or "upload" for media_banner sections' });
      }

      if (!media_url) {
        return res.status(400).json({ error: 'media_url is required for media_banner sections' });
      }

      // If media_source changed from upload to youtube, or media_url changed for upload, delete old file
      if (existingSection.media_source === 'upload' && existingSection.media_url) {
        if (media_source !== 'upload' || media_url !== existingSection.media_url) {
          oldFileToDelete = existingSection.media_url;
        }
      }

      // Validate YouTube URL if source is youtube
      if (media_source === 'youtube') {
        const youtubeValidation = validateYouTubeUrl(media_url);
        if (!youtubeValidation.valid) {
          return res.status(400).json({ error: youtubeValidation.error });
        }
        // Use the normalized embed URL
        finalMediaUrl = youtubeValidation.embedUrl;
      }
    } else {
      // If section type changed from media_banner to something else, delete old file
      if (existingSection.section_type === 'media_banner' && existingSection.media_source === 'upload' && existingSection.media_url) {
        oldFileToDelete = existingSection.media_url;
      }
      finalMediaType = null;
      finalMediaSource = null;
      finalMediaUrl = null;
    }

    // Delete old file if needed
    const deleteOldFile = () => {
      if (oldFileToDelete) {
        return deleteUploadedFile(oldFileToDelete);
      }
      return Promise.resolve({ success: true });
    };

    // Build dynamic query based on provided fields
    let updateFields = [];
    let values = [];

    if (section_type !== undefined) {
      updateFields.push('section_type = ?');
      values.push(section_type);
    }
    if (title !== undefined) {
      updateFields.push('title = ?');
      values.push(title);
    }
    // Handle content and description - always sync them
    if (content !== undefined || description !== undefined) {
      // Use content if provided, otherwise use description, otherwise use empty string
      const finalContent = content !== undefined ? content : (description !== undefined ? description : '');
      const finalDescription = description !== undefined ? description : (content !== undefined ? content : '');

      updateFields.push('content = ?');
      values.push(finalContent);
      updateFields.push('description = ?');
      values.push(finalDescription);
    }
    if (is_visible !== undefined) {
      updateFields.push('is_visible = ?');
      values.push(is_visible);
    }
    if (order_index !== undefined) {
      updateFields.push('order_index = ?');
      values.push(order_index);
    }
    // Update media fields if provided or if section_type is media_banner
    if (media_type !== undefined || (section_type !== undefined && section_type === 'media_banner')) {
      updateFields.push('media_type = ?');
      values.push(finalMediaType);
    }
    if (media_source !== undefined || (section_type !== undefined && section_type === 'media_banner')) {
      updateFields.push('media_source = ?');
      values.push(finalMediaSource);
    }
    if (media_url !== undefined || (section_type !== undefined && section_type === 'media_banner')) {
      updateFields.push('media_url = ?');
      values.push(finalMediaUrl);
    }
    // Update pricing table header fields if provided
    if (pricing_table_header_plan !== undefined) {
      updateFields.push('pricing_table_header_plan = ?');
      values.push(pricing_table_header_plan);
    }
    if (pricing_table_header_specs !== undefined) {
      updateFields.push('pricing_table_header_specs = ?');
      values.push(pricing_table_header_specs);
    }
    if (pricing_table_header_features !== undefined) {
      updateFields.push('pricing_table_header_features = ?');
      values.push(pricing_table_header_features);
    }
    if (pricing_table_header_hourly !== undefined) {
      updateFields.push('pricing_table_header_hourly = ?');
      values.push(pricing_table_header_hourly);
    }
    if (pricing_table_header_monthly !== undefined) {
      updateFields.push('pricing_table_header_monthly = ?');
      values.push(pricing_table_header_monthly);
    }
    if (pricing_table_header_quarterly !== undefined) {
      updateFields.push('pricing_table_header_quarterly = ?');
      values.push(pricing_table_header_quarterly);
    }
    if (pricing_table_header_yearly !== undefined) {
      updateFields.push('pricing_table_header_yearly = ?');
      values.push(pricing_table_header_yearly);
    }
    if (pricing_table_header_action !== undefined) {
      updateFields.push('pricing_table_header_action = ?');
      values.push(pricing_table_header_action);
    }
    // Update pricing column visibility fields if provided
    if (show_hourly_column !== undefined) {
      updateFields.push('show_hourly_column = ?');
      values.push(show_hourly_column ? 1 : 0);
    }
    if (show_monthly_column !== undefined) {
      updateFields.push('show_monthly_column = ?');
      values.push(show_monthly_column ? 1 : 0);
    }
    if (show_quarterly_column !== undefined) {
      updateFields.push('show_quarterly_column = ?');
      values.push(show_quarterly_column ? 1 : 0);
    }
    if (show_yearly_column !== undefined) {
      updateFields.push('show_yearly_column = ?');
      values.push(show_yearly_column ? 1 : 0);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(sectionId, id);

    const query = `UPDATE product_sections SET ${updateFields.join(', ')} WHERE id = ? AND product_id = ?`;

    // Update the section
    deleteOldFile().then(() => {
      db.run(query, values, function (updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }
        res.json({ message: 'Section updated successfully', changes: this.changes });
      });
    }).catch(deleteErr => {
      console.error('Error deleting old file:', deleteErr);
      // Continue with update even if file deletion fails
      db.run(query, values, function (updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }
        res.json({ message: 'Section updated successfully (old file deletion failed)', changes: this.changes });
      });
    });
  });
});

// Delete section
app.delete('/api/products/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;

  // Get section info to delete associated file if it's an uploaded file
  db.get(`
    SELECT media_source, media_url, section_type
    FROM product_sections 
    WHERE id = ? AND product_id = ?
  `, [sectionId, id], (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Delete associated file if it's an uploaded file for media_banner section
    const deleteFilePromise = (section.section_type === 'media_banner' && section.media_source === 'upload' && section.media_url)
      ? deleteUploadedFile(section.media_url)
      : Promise.resolve({ success: true });

    // Delete the section
    deleteFilePromise.then(() => {
      db.run(`DELETE FROM product_sections WHERE id = ? AND product_id = ?`, [sectionId, id], function (deleteErr) {
        if (deleteErr) {
          res.status(500).json({ error: deleteErr.message });
          return;
        }
        res.json({ message: 'Section deleted successfully', changes: this.changes });
      });
    }).catch(deleteFileErr => {
      console.error('Error deleting file:', deleteFileErr);
      // Continue with section deletion even if file deletion fails
      db.run(`DELETE FROM product_sections WHERE id = ? AND product_id = ?`, [sectionId, id], function (deleteErr) {
        if (deleteErr) {
          res.status(500).json({ error: deleteErr.message });
          return;
        }
        res.json({ message: 'Section deleted successfully (file deletion failed)', changes: this.changes });
      });
    });
  });
});

// Product Items API Routes

// Get all items for a specific section
app.get('/api/products/:id/sections/:sectionId/items', (req, res) => {
  const { sectionId } = req.params;
  db.all('SELECT * FROM product_items WHERE section_id = ? ORDER BY order_index ASC', [sectionId], (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items);
  });
});

// Create new section item
app.post('/api/products/:id/sections/:sectionId/items', (req, res) => {
  const { sectionId } = req.params;
  const { item_type, title, description, content, icon, value, label, features, is_visible, order_index } = req.body;

  // Use provided order_index if available, otherwise get next order
  if (order_index !== undefined) {
    const visibility = is_visible !== undefined ? is_visible : 1;

    db.run(`INSERT INTO product_items (section_id, item_type, title, description, content, icon, value, label, features, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sectionId, item_type, title, description, content || null, icon, value, label, features, order_index, visibility],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Section item created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  } else {
    // Get next order index
    db.get('SELECT MAX(order_index) as max_order FROM product_items WHERE section_id = ?', [sectionId], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const nextOrder = (result.max_order || -1) + 1;
      const visibility = is_visible !== undefined ? is_visible : 1;

      db.run(`INSERT INTO product_items (section_id, item_type, title, description, content, icon, value, label, features, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [sectionId, item_type, title, description, content || null, icon, value, label, features, nextOrder, visibility],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({
            message: 'Section item created successfully',
            id: this.lastID,
            changes: this.changes
          });
        });
    });
  }
});

// Update section item
app.put('/api/products/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { itemId, sectionId } = req.params;
  const { item_type, title, description, content, icon, value, label, features, is_visible, order_index } = req.body;

  // Build dynamic query based on provided fields
  let updateFields = [];
  let values = [];

  if (item_type !== undefined) {
    updateFields.push('item_type = ?');
    values.push(item_type);
  }
  if (title !== undefined) {
    updateFields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    values.push(description);
  }
  if (content !== undefined) {
    updateFields.push('content = ?');
    values.push(content);
  }
  if (icon !== undefined) {
    updateFields.push('icon = ?');
    values.push(icon);
  }
  if (value !== undefined) {
    updateFields.push('value = ?');
    values.push(value);
  }
  if (label !== undefined) {
    updateFields.push('label = ?');
    values.push(label);
  }
  if (features !== undefined) {
    updateFields.push('features = ?');
    values.push(features);
  }
  if (is_visible !== undefined) {
    updateFields.push('is_visible = ?');
    values.push(is_visible);
  }
  if (order_index !== undefined) {
    updateFields.push('order_index = ?');
    values.push(order_index);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(itemId, sectionId);

  const query = `UPDATE product_items SET ${updateFields.join(', ')} WHERE id = ? AND section_id = ?`;

  db.run(query, values, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section item updated successfully', changes: this.changes });
  });
});

// Delete section item
app.delete('/api/products/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { itemId, sectionId } = req.params;

  db.run(`DELETE FROM product_items WHERE id = ? AND section_id = ?`, [itemId, sectionId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section item deleted successfully', changes: this.changes });
  });
});

// Toggle product section item visibility
app.put('/api/products/:id/sections/:sectionId/items/:itemId/toggle-visibility', (req, res) => {
  const { itemId, sectionId } = req.params;

  db.get('SELECT is_visible FROM product_items WHERE id = ? AND section_id = ?', [itemId, sectionId], (err, item) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!item) {
      res.status(404).json({ error: 'Product section item not found' });
      return;
    }

    const newVisibility = item.is_visible === 1 ? 0 : 1;

    db.run('UPDATE product_items SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND section_id = ?',
      [newVisibility, itemId, sectionId], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Product section item visibility toggled successfully',
          is_visible: newVisibility,
          changes: this.changes
        });
      });
  });
});

// ============================================================
// MAIN PRODUCTS PAGE API ROUTES (Mirroring Main Marketplaces)
// ============================================================

// Get main products page content
app.get('/api/main-products', (req, res) => {
  const mainPageData = {};
  const { all } = req.query; // For admin view, show all sections including hidden

  // Get hero content
  db.get('SELECT * FROM main_products_content WHERE id = 1', (err, heroContent) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    mainPageData.hero = heroContent || {
      title: 'Our Products',
      subtitle: 'Cloud Services - Made in India',
      description: 'Discover our comprehensive suite of cloud computing services designed to power your business transformation.',
      stat1_label: 'Global Customers',
      stat1_value: '10K+',
      stat2_label: 'Uptime SLA',
      stat2_value: '99.9%',
      stat3_label: 'Data Centers',
      stat3_value: '15+',
      stat4_label: 'Support Rating',
      stat4_value: '4.9★'
    };

    // Get product sections - show all if "all" query param is present (for admin)
    // Include button_text field similar to marketplaces
    const sectionsQuery = all === 'true'
      ? `
        SELECT 
          mps.*, 
          COALESCE(p.name, mps.title) as product_name, 
          COALESCE(p.description, mps.description) as product_description,
          COALESCE(mps.category, p.category) as category,
          p.route as product_route,
          COALESCE(mps.button_text, 'Explore Product') as button_text
        FROM main_products_sections mps
        LEFT JOIN products p ON mps.product_id = p.id
        WHERE (mps.product_id IS NULL AND mps.id IS NOT NULL) OR (mps.product_id IS NOT NULL AND p.id IS NOT NULL)
        ORDER BY mps.order_index ASC
      `
      : `
        SELECT 
          mps.*, 
          COALESCE(p.name, mps.title) as product_name, 
          COALESCE(p.description, mps.description) as product_description,
          COALESCE(mps.category, p.category) as category,
          p.route as product_route,
          COALESCE(mps.button_text, 'Explore Product') as button_text
        FROM main_products_sections mps
        INNER JOIN products p ON mps.product_id = p.id
        WHERE mps.is_visible = 1 AND p.is_visible = 1
        ORDER BY mps.order_index ASC
      `;

    db.all(sectionsQuery, (err, sections) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      mainPageData.sections = sections || [];
      res.json(mainPageData);
    });
  });
});

// Add main products content columns if they don't exist
function addMainProductsContentColumns() {
  const columnsToAdd = [
    'stat1_label TEXT DEFAULT "Global Customers"',
    'stat1_value TEXT DEFAULT "10K+"',
    'stat2_label TEXT DEFAULT "Uptime SLA"',
    'stat2_value TEXT DEFAULT "99.9%"',
    'stat3_label TEXT DEFAULT "Data Centers"',
    'stat3_value TEXT DEFAULT "15+"',
    'stat4_label TEXT DEFAULT "Support Rating"',
    'stat4_value TEXT DEFAULT "4.9★"'
  ];

  columnsToAdd.forEach(column => {
    const columnName = column.split(' ')[0];
    db.run(`ALTER TABLE main_products_content ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName} to main_products_content:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${columnName} to main_products_content`);
      }
    });
  });
}

// Update main products page hero content
app.put('/api/main-products/hero', (req, res) => {
  const {
    title,
    subtitle,
    description,
    stat1_label,
    stat1_value,
    stat2_label,
    stat2_value,
    stat3_label,
    stat3_value,
    stat4_label,
    stat4_value
  } = req.body;

  db.run(`
    UPDATE main_products_content 
    SET title = ?, subtitle = ?, description = ?, 
        stat1_label = ?, stat1_value = ?, stat2_label = ?, stat2_value = ?,
        stat3_label = ?, stat3_value = ?, stat4_label = ?, stat4_value = ?,
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = 1
  `, [
    title, subtitle, description,
    stat1_label, stat1_value, stat2_label, stat2_value,
    stat3_label, stat3_value, stat4_label, stat4_value
  ], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      // Insert if doesn't exist
      db.run(`
        INSERT INTO main_products_content (
          id, title, subtitle, description,
          stat1_label, stat1_value, stat2_label, stat2_value,
          stat3_label, stat3_value, stat4_label, stat4_value
        ) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        title, subtitle, description,
        stat1_label, stat1_value, stat2_label, stat2_value,
        stat3_label, stat3_value, stat4_label, stat4_value
      ], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Main products hero content created successfully' });
      });
    } else {
      res.json({ message: 'Main products hero content updated successfully' });
    }
  });
});

// Get all main products sections (including hidden ones for admin)
app.get('/api/main-products/sections/all', (req, res) => {
  db.all(`
    SELECT 
      mps.*, 
      COALESCE(p.name, mps.title) as product_name, 
      COALESCE(p.description, mps.description) as product_description,
      COALESCE(mps.category, p.category) as category
    FROM main_products_sections mps
    LEFT JOIN products p ON mps.product_id = p.id
    WHERE (mps.product_id IS NULL AND mps.id IS NOT NULL) OR (mps.product_id IS NOT NULL AND p.id IS NOT NULL)
    ORDER BY mps.order_index ASC
  `, (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(sections || []);
  });
});

// Update main products section
app.put('/api/main-products/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;
  const {
    title,
    description,
    is_visible,
    order_index,
    features,
    category,
    popular_tag,
    price,
    price_period,
    free_trial_tag,
    button_text
  } = req.body;

  // Handle features - convert array to JSON string if provided
  let featuresJson = null;
  if (features !== undefined) {
    if (Array.isArray(features)) {
      featuresJson = JSON.stringify(features.filter(f => f && f.trim()));
    } else if (typeof features === 'string') {
      featuresJson = features;
    }
  }

  db.run(`
    UPDATE main_products_sections 
    SET 
      title = ?, 
      description = ?, 
      is_visible = ?,
      features = COALESCE(?, features),
      category = COALESCE(?, category),
      popular_tag = COALESCE(?, popular_tag),
      price = COALESCE(?, price),
      price_period = COALESCE(?, price_period),
      free_trial_tag = COALESCE(?, free_trial_tag),
      button_text = COALESCE(?, button_text),
      order_index = ?,
      updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `, [
    title,
    description,
    is_visible,
    featuresJson,
    category || null,
    popular_tag || null,
    price || null,
    price_period || null,
    free_trial_tag || null,
    button_text || null,
    order_index || 0,
    sectionId
  ], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Main products section updated successfully', changes: this.changes });
  });
});

// Create new main products section (standalone)
app.post('/api/main-products/sections', (req, res) => {
  const {
    title,
    description,
    is_visible,
    product_id
  } = req.body;

  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  // Get the next order index
  db.get('SELECT MAX(order_index) as max_order FROM main_products_sections', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || 0) + 1;

    db.run(`
      INSERT INTO main_products_sections (
        product_id, title, description, is_visible, order_index
      ) 
      VALUES (?, ?, ?, ?, ?)
    `, [
      product_id || null,
      title,
      description || '',
      is_visible !== undefined ? is_visible : 1,
      nextOrder
    ], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: 'Section created successfully',
        id: this.lastID,
        changes: this.changes
      });
    });
  });
});

// Delete main products section
app.delete('/api/main-products/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;

  db.run('DELETE FROM main_products_sections WHERE id = ?', [sectionId], function (err) {
    if (err) {
      console.error('Error deleting section:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    res.json({ message: 'Section deleted successfully', changes: this.changes });
  });
});

// Toggle visibility of main products section
app.put('/api/main-products/sections/:sectionId/toggle-visibility', (req, res) => {
  const { sectionId } = req.params;

  // Get current visibility
  db.get('SELECT is_visible FROM main_products_sections WHERE id = ?', [sectionId], (err, section) => {
    if (err) {
      console.error('Error getting section visibility:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Toggle visibility
    const newVisibility = section.is_visible ? 0 : 1;

    db.run('UPDATE main_products_sections SET is_visible = ? WHERE id = ?', [newVisibility, sectionId], function (err) {
      if (err) {
        console.error('Error toggling section visibility:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: `Section ${newVisibility ? 'shown' : 'hidden'} successfully`,
        is_visible: newVisibility,
        changes: this.changes
      });
    });
  });
});

// Duplicate main products section
app.post('/api/main-products/sections/:sectionId/duplicate', (req, res) => {
  const { sectionId } = req.params;

  // Get the original section
  db.get(`
    SELECT 
      mps.*, 
      COALESCE(p.name, mps.title) as product_name, 
      COALESCE(p.description, mps.description) as product_description
    FROM main_products_sections mps
    LEFT JOIN products p ON mps.product_id = p.id
    WHERE mps.id = ?
  `, [sectionId], (err, originalSection) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!originalSection) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Get the next order index
    db.get('SELECT MAX(order_index) as max_order FROM main_products_sections', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const nextOrder = (result.max_order || 0) + 1;

      // Create duplicate section
      db.run(`
        INSERT INTO main_products_sections (
          product_id, title, description, is_visible, order_index
        ) 
        VALUES (?, ?, ?, ?, ?)
      `, [
        originalSection.product_id || null,
        `${originalSection.title} (Copy)`,
        originalSection.description || '',
        originalSection.is_visible || 1,
        nextOrder
      ], function (err) {
        if (err) {
          console.error('Error duplicating section:', err);
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          message: 'Section duplicated successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
    });
  });
});

// Get all products for a section
app.get('/api/main-products/sections/:sectionId/products', (req, res) => {
  const { sectionId } = req.params;

  // First get the section to find the product_id
  db.get('SELECT product_id FROM main_products_sections WHERE id = ?', [sectionId], (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // If section has a product_id, return that product, otherwise return all products
    if (section.product_id) {
      db.get('SELECT * FROM products WHERE id = ?', [section.product_id], (err, product) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json([product].filter(Boolean));
      });
    } else {
      // Return all visible products
      db.all('SELECT * FROM products WHERE is_visible = 1 ORDER BY order_index ASC', (err, products) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(products || []);
      });
    }
  });
});

// ============================================================
// PRICING API ENDPOINTS
// ============================================================

// Get pricing hero section
app.get('/api/pricing/hero', (req, res) => {
  db.get('SELECT * FROM pricing_hero WHERE is_active = 1 ORDER BY id DESC LIMIT 1', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {});
  });
});

// Update pricing hero section
app.put('/api/pricing/hero/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, redirect_url } = req.body;

  db.run('UPDATE pricing_hero SET title = ?, description = ?, redirect_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, redirect_url, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Hero section updated successfully', changes: this.changes });
    });
});

// Get all pricing categories
app.get('/api/pricing/categories', (req, res) => {
  db.all('SELECT * FROM pricing_categories WHERE is_active = 1 ORDER BY order_index', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new pricing category
app.post('/api/pricing/categories', (req, res) => {
  const { name, slug, icon, description, order_index } = req.body;

  // Get the next order index if not provided
  db.get('SELECT MAX(order_index) as max_order FROM pricing_categories', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = order_index !== undefined ? order_index : ((result?.max_order || -1) + 1);

    db.run(`INSERT INTO pricing_categories (name, slug, icon, description, order_index) 
            VALUES (?, ?, ?, ?, ?)`,
      [name, slug, icon || 'CpuChipIcon', description || '', nextOrder],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Category created successfully', id: this.lastID });
      });
  });
});

// Update pricing category
app.put('/api/pricing/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, slug, icon, description, order_index } = req.body;

  db.run(`UPDATE pricing_categories SET 
          name = ?, slug = ?, icon = ?, description = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?`,
    [name, slug, icon, description, order_index || 0, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Category updated successfully', changes: this.changes });
    });
});

// Delete pricing category (soft delete)
app.delete('/api/pricing/categories/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE pricing_categories SET is_active = 0 WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Category deleted successfully', changes: this.changes });
  });
});

// Get subcategories by category
app.get('/api/pricing/categories/:categoryId/subcategories', (req, res) => {
  const { categoryId } = req.params;
  db.all('SELECT * FROM pricing_subcategories WHERE category_id = ? AND is_active = 1 ORDER BY order_index',
    [categoryId], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
});

// Create new pricing subcategory
app.post('/api/pricing/categories/:categoryId/subcategories', (req, res) => {
  const { categoryId } = req.params;
  const { name, slug, description, header_color, order_index } = req.body;

  // Get the next order index if not provided
  db.get('SELECT MAX(order_index) as max_order FROM pricing_subcategories WHERE category_id = ?', [categoryId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = order_index !== undefined ? order_index : ((result?.max_order || -1) + 1);

    db.run(`INSERT INTO pricing_subcategories (category_id, name, slug, description, header_color, order_index) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      [categoryId, name, slug, description || '', header_color || 'green-100', nextOrder],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Subcategory created successfully', id: this.lastID });
      });
  });
});

// Update pricing subcategory
app.put('/api/pricing/subcategories/:id', (req, res) => {
  const { id } = req.params;
  const { name, slug, description, header_color, order_index } = req.body;

  db.run(`UPDATE pricing_subcategories SET 
          name = ?, slug = ?, description = ?, header_color = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?`,
    [name, slug, description, header_color, order_index || 0, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Subcategory updated successfully', changes: this.changes });
    });
});

// Delete pricing subcategory (soft delete)
app.delete('/api/pricing/subcategories/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE pricing_subcategories SET is_active = 0 WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Subcategory deleted successfully', changes: this.changes });
  });
});

// Get pricing plans by subcategory
app.get('/api/pricing/subcategories/:subcategoryId/plans', (req, res) => {
  const { subcategoryId } = req.params;
  db.all('SELECT * FROM pricing_plans WHERE subcategory_id = ? AND is_active = 1 ORDER BY order_index',
    [subcategoryId], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
});

// Create pricing_page_config table
db.run(`CREATE TABLE IF NOT EXISTS pricing_page_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  main_heading TEXT NOT NULL DEFAULT 'Affordable Cloud Server Pricing and Plans in India',
  compute_section_heading TEXT NOT NULL DEFAULT 'Compute Offering',
  compute_section_description TEXT NOT NULL DEFAULT 'Choose a plan based on the amount of CPU, memory, and storage required for your project. The cost will adjust according to the resources you select.',
  compute_tab_basic_label TEXT NOT NULL DEFAULT 'Basic Compute Plans',
  compute_tab_cpu_intensive_label TEXT NOT NULL DEFAULT 'CPU Intensive',
  compute_tab_memory_intensive_label TEXT NOT NULL DEFAULT 'Memory Intensive',
  compute_table_header_name TEXT NOT NULL DEFAULT 'Name',
  compute_table_header_vcpu TEXT NOT NULL DEFAULT 'vCPU',
  compute_table_header_memory TEXT NOT NULL DEFAULT 'Memory RAM',
  compute_table_header_hourly TEXT NOT NULL DEFAULT 'Price Hourly',
  compute_table_header_monthly TEXT NOT NULL DEFAULT 'Price Monthly',
  compute_table_header_quarterly TEXT NOT NULL DEFAULT 'Price Quarterly',
  compute_table_header_yearly TEXT NOT NULL DEFAULT 'Price Yearly',
  disk_section_heading TEXT NOT NULL DEFAULT 'Disk Offering',
  disk_section_description TEXT NOT NULL DEFAULT 'Choose the disk storage size that best fits your requirements. All storage options use high-performance NVMe technology.',
  disk_table_header_name TEXT NOT NULL DEFAULT 'Name',
  disk_table_header_type TEXT NOT NULL DEFAULT 'Storage Type',
  disk_table_header_size TEXT NOT NULL DEFAULT 'Size',
  storage_section_heading TEXT NOT NULL DEFAULT 'Storage Pricing and Plans',
  storage_section_description TEXT NOT NULL DEFAULT 'Choose from our flexible storage options designed to meet your specific needs and budget requirements.',
  storage_table_header_type TEXT NOT NULL DEFAULT 'Storage Type',
  storage_table_header_description TEXT NOT NULL DEFAULT 'Description',
  storage_table_header_price TEXT NOT NULL DEFAULT 'Price',
  storage_table_header_action TEXT NOT NULL DEFAULT 'Action',
  service_table_header_service TEXT NOT NULL DEFAULT 'Service',
  service_table_header_type TEXT NOT NULL DEFAULT 'Type',
  service_table_header_features TEXT NOT NULL DEFAULT 'Features',
  service_table_header_bandwidth TEXT NOT NULL DEFAULT 'Bandwidth',
  service_table_header_discount TEXT NOT NULL DEFAULT 'Discount',
  service_table_header_price TEXT NOT NULL DEFAULT 'Price',
  service_table_header_action TEXT NOT NULL DEFAULT 'Action',
  faq_section_heading TEXT NOT NULL DEFAULT 'Have Any Questions?',
  faq_section_subheading TEXT NOT NULL DEFAULT 'Don''t Worry, We''ve Got Answers!',
  button_get_started TEXT NOT NULL DEFAULT 'Get Started',
  button_contact_sales TEXT NOT NULL DEFAULT 'Contact Sales',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err && !err.message.includes('already exists')) {
    console.error('Error creating pricing_page_config table:', err.message);
  } else if (!err) {
    console.log('✅ Created pricing_page_config table');

    // Insert default config if it doesn't exist
    db.get('SELECT COUNT(*) as count FROM pricing_page_config', (err, row) => {
      if (!err && row && row.count === 0) {
        db.run(`INSERT INTO pricing_page_config (id) VALUES (1)`, (err) => {
          if (!err) {
            console.log('✅ Inserted default pricing page configuration');
          }
        });
      }
    });
  }
});

// Create compute_plans and disk_offerings tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS compute_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_type TEXT NOT NULL,
    name TEXT NOT NULL,
    vcpu TEXT NOT NULL,
    memory TEXT NOT NULL,
    monthly_price TEXT NOT NULL,
    hourly_price TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS disk_offerings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    storage_type TEXT NOT NULL,
    size TEXT NOT NULL,
    monthly_price TEXT NOT NULL,
    hourly_price TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed default compute plans data if table is empty
  db.get('SELECT COUNT(*) as count FROM compute_plans', (err, row) => {
    if (err) {
      console.error('Error checking compute_plans count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding default compute plans...');

      const basicPlans = [
        { name: 'BP_1vC-1GB', vcpu: '1 vCPU', memory: '1.0 GB', monthly_price: '₹512', hourly_price: '₹0.7' },
        { name: 'BP_2vC-4GB', vcpu: '2 vCPU', memory: '4.0 GB', monthly_price: '₹1,504', hourly_price: '₹2.05' },
        { name: 'BP_4vC-8GB', vcpu: '4 vCPU', memory: '8.0 GB', monthly_price: '₹3,008', hourly_price: '₹4.11' },
        { name: 'BP_8vC-16GB', vcpu: '8 vCPU', memory: '16.0 GB', monthly_price: '₹6,016', hourly_price: '₹8.22' },
        { name: 'BP_8vC-32GB', vcpu: '8 vCPU', memory: '32.0 GB', monthly_price: '₹9,856', hourly_price: '₹13.46' },
        { name: 'BP_16vC-32GB', vcpu: '16 vCPU', memory: '32.0 GB', monthly_price: '₹12,032', hourly_price: '₹16.44' },
        { name: 'BP_16vC-64GB', vcpu: '16 vCPU', memory: '64.0 GB', monthly_price: '₹19,712', hourly_price: '₹26.93' }
      ];

      const cpuIntensivePlans = [
        { name: 'CI_2vC-1GB', vcpu: '2 vCPU', memory: '1.0 GB', monthly_price: '₹784', hourly_price: '₹1.07' },
        { name: 'CI_2vC-2GB', vcpu: '2 vCPU', memory: '2.0 GB', monthly_price: '₹1,024', hourly_price: '₹1.4' },
        { name: 'CI_32vC-64GB', vcpu: '32 vCPU', memory: '64.0 GB', monthly_price: '₹24,064', hourly_price: '₹32.87' },
        { name: 'CI_48vC-96GB', vcpu: '48 vCPU', memory: '96.0 GB', monthly_price: '₹36,096', hourly_price: '₹49.31' }
      ];

      const memoryIntensivePlans = [
        { name: 'MI_1vC-4GB', vcpu: '1 vCPU', memory: '4.0 GB', monthly_price: '₹1,232', hourly_price: '₹1.68' },
        { name: 'MI_1vC-8GB', vcpu: '1 vCPU', memory: '8.0 GB', monthly_price: '₹2,192', hourly_price: '₹2.99' },
        { name: 'MI_2vC-16GB', vcpu: '2 vCPU', memory: '16.0 GB', monthly_price: '₹4,384', hourly_price: '₹5.99' },
        { name: 'MI_4vC-16GB', vcpu: '4 vCPU', memory: '16.0 GB', monthly_price: '₹4,928', hourly_price: '₹6.73' },
        { name: 'MI_4vC-32GB', vcpu: '4 vCPU', memory: '32.0 GB', monthly_price: '₹8,768', hourly_price: '₹11.98' },
        { name: 'MI_8vC-64GB', vcpu: '8 vCPU', memory: '64.0 GB', monthly_price: '₹17,536', hourly_price: '₹23.96' },
        { name: 'MI_16vC-128GB', vcpu: '16 vCPU', memory: '128.0 GB', monthly_price: '₹35,072', hourly_price: '₹47.91' }
      ];

      [...basicPlans.map(p => ({ ...p, plan_type: 'basic' })),
      ...cpuIntensivePlans.map(p => ({ ...p, plan_type: 'cpuIntensive' })),
      ...memoryIntensivePlans.map(p => ({ ...p, plan_type: 'memoryIntensive' }))].forEach((plan, index) => {
        db.run(`INSERT INTO compute_plans (plan_type, name, vcpu, memory, monthly_price, hourly_price, order_index)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [plan.plan_type, plan.name, plan.vcpu, plan.memory, plan.monthly_price, plan.hourly_price, index],
          (err) => {
            if (err) {
              console.error('Error inserting compute plan:', err.message);
            }
          });
      });

      console.log('✅ Default compute plans seeded successfully!');
    }
  });

  // Seed default disk offerings data if table is empty
  db.get('SELECT COUNT(*) as count FROM disk_offerings', (err, row) => {
    if (err) {
      console.error('Error checking disk_offerings count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding default disk offerings...');

      const diskOfferings = [
        { name: '20 GB', storage_type: 'NVMe', size: '20.0 GB', monthly_price: '₹160', hourly_price: '₹0.25' },
        { name: '50 GB', storage_type: 'NVMe', size: '50.0 GB', monthly_price: '₹400', hourly_price: '₹0.55' },
        { name: '100GB', storage_type: 'NVMe', size: '100.0 GB', monthly_price: '₹800', hourly_price: '₹1.09' },
        { name: '250 GB', storage_type: 'NVMe', size: '250.0 GB', monthly_price: '₹2,000', hourly_price: '₹2.73' },
        { name: '500 GB', storage_type: 'NVMe', size: '500.0 GB', monthly_price: '₹4,000', hourly_price: '₹5.46' },
        { name: '1 TB', storage_type: 'NVMe', size: '1.0 TB', monthly_price: '₹8,192', hourly_price: '₹11.19' },
        { name: '2 TB', storage_type: 'NVMe', size: '2.0 TB', monthly_price: '₹16,384', hourly_price: '₹22.38' }
      ];

      diskOfferings.forEach((offering, index) => {
        db.run(`INSERT INTO disk_offerings (name, storage_type, size, monthly_price, hourly_price, order_index)
                VALUES (?, ?, ?, ?, ?, ?)`,
          [offering.name, offering.storage_type, offering.size, offering.monthly_price, offering.hourly_price, index],
          (err) => {
            if (err) {
              console.error('Error inserting disk offering:', err.message);
            }
          });
      });

      console.log('✅ Default disk offerings seeded successfully!');
    }
  });
});

// Get all compute plans
app.get('/api/pricing/compute-plans', (req, res) => {
  const { plan_type } = req.query;
  let query = 'SELECT * FROM compute_plans WHERE is_active = 1';
  const params = [];

  if (plan_type) {
    query += ' AND plan_type = ?';
    params.push(plan_type);
  }

  query += ' ORDER BY plan_type, order_index';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create compute plan
app.post('/api/pricing/compute-plans', (req, res) => {
  const { plan_type, name, vcpu, memory, monthly_price, hourly_price, quarterly_price, yearly_price, order_index } = req.body;

  db.get('SELECT MAX(order_index) as max_order FROM compute_plans WHERE plan_type = ?', [plan_type], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = order_index !== undefined ? order_index : ((result?.max_order || -1) + 1);

    db.run(`INSERT INTO compute_plans (plan_type, name, vcpu, memory, monthly_price, hourly_price, quarterly_price, yearly_price, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plan_type, name, vcpu, memory, monthly_price, hourly_price, quarterly_price, yearly_price, nextOrder],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Compute plan created successfully', id: this.lastID });
      });
  });
});

// Update compute plan
app.put('/api/pricing/compute-plans/:id', (req, res) => {
  const { id } = req.params;
  const { plan_type, name, vcpu, memory, monthly_price, hourly_price, quarterly_price, yearly_price, order_index } = req.body;

  db.run(`UPDATE compute_plans SET
          plan_type = ?, name = ?, vcpu = ?, memory = ?, monthly_price = ?, hourly_price = ?,
          quarterly_price = ?, yearly_price = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [plan_type, name, vcpu, memory, monthly_price, hourly_price, quarterly_price, yearly_price, order_index || 0, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Compute plan updated successfully', changes: this.changes });
    });
});

// Delete compute plan
app.delete('/api/pricing/compute-plans/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE compute_plans SET is_active = 0 WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Compute plan deleted successfully', changes: this.changes });
  });
});

// Get all disk offerings
app.get('/api/pricing/disk-offerings', (req, res) => {
  db.all('SELECT * FROM disk_offerings WHERE is_active = 1 ORDER BY order_index', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create disk offering
app.post('/api/pricing/disk-offerings', (req, res) => {
  const { name, storage_type, size, monthly_price, hourly_price, quarterly_price, yearly_price, order_index } = req.body;

  db.get('SELECT MAX(order_index) as max_order FROM disk_offerings', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = order_index !== undefined ? order_index : ((result?.max_order || -1) + 1);

    db.run(`INSERT INTO disk_offerings (name, storage_type, size, monthly_price, hourly_price, quarterly_price, yearly_price, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, storage_type, size, monthly_price, hourly_price, quarterly_price, yearly_price, nextOrder],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Disk offering created successfully', id: this.lastID });
      });
  });
});

// Update disk offering
app.put('/api/pricing/disk-offerings/:id', (req, res) => {
  const { id } = req.params;
  const { name, storage_type, size, monthly_price, hourly_price, quarterly_price, yearly_price, order_index } = req.body;

  db.run(`UPDATE disk_offerings SET
          name = ?, storage_type = ?, size = ?, monthly_price = ?, hourly_price = ?,
          quarterly_price = ?, yearly_price = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [name, storage_type, size, monthly_price, hourly_price, quarterly_price, yearly_price, order_index || 0, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Disk offering updated successfully', changes: this.changes });
    });
});

// Delete disk offering
app.delete('/api/pricing/disk-offerings/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE disk_offerings SET is_active = 0 WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Disk offering deleted successfully', changes: this.changes });
  });
});

// Get all storage options
app.get('/api/pricing/storage', (req, res) => {
  db.all('SELECT * FROM storage_options WHERE is_active = 1 ORDER BY order_index', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all pricing FAQs
app.get('/api/pricing/faqs', (req, res) => {
  db.all('SELECT * FROM pricing_faqs WHERE is_active = 1 ORDER BY order_index', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get pricing page configuration
app.get('/api/pricing/page-config', (req, res) => {
  db.get('SELECT * FROM pricing_page_config WHERE id = 1', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {});
  });
});

// Update pricing page configuration
app.put('/api/pricing/page-config', (req, res) => {
  const config = req.body;

  db.run(`UPDATE pricing_page_config SET 
    main_heading = ?,
    compute_section_heading = ?,
    compute_section_description = ?,
    compute_tab_basic_label = ?,
    compute_tab_cpu_intensive_label = ?,
    compute_tab_memory_intensive_label = ?,
    compute_table_header_name = ?,
    compute_table_header_vcpu = ?,
    compute_table_header_memory = ?,
    compute_table_header_hourly = ?,
    compute_table_header_monthly = ?,
    compute_table_header_quarterly = ?,
    compute_table_header_yearly = ?,
    disk_section_heading = ?,
    disk_section_description = ?,
    disk_table_header_name = ?,
    disk_table_header_type = ?,
    disk_table_header_size = ?,
    storage_section_heading = ?,
    storage_section_description = ?,
    storage_table_header_type = ?,
    storage_table_header_description = ?,
    storage_table_header_price = ?,
    storage_table_header_action = ?,
    service_table_header_service = ?,
    service_table_header_type = ?,
    service_table_header_features = ?,
    service_table_header_bandwidth = ?,
    service_table_header_discount = ?,
    service_table_header_price = ?,
    service_table_header_action = ?,
    faq_section_heading = ?,
    faq_section_subheading = ?,
    button_get_started = ?,
    button_contact_sales = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [
      config.main_heading,
      config.compute_section_heading,
      config.compute_section_description,
      config.compute_tab_basic_label,
      config.compute_tab_cpu_intensive_label,
      config.compute_tab_memory_intensive_label,
      config.compute_table_header_name,
      config.compute_table_header_vcpu,
      config.compute_table_header_memory,
      config.compute_table_header_hourly,
      config.compute_table_header_monthly,
      config.compute_table_header_quarterly,
      config.compute_table_header_yearly,
      config.disk_section_heading,
      config.disk_section_description,
      config.disk_table_header_name,
      config.disk_table_header_type,
      config.disk_table_header_size,
      config.storage_section_heading,
      config.storage_section_description,
      config.storage_table_header_type,
      config.storage_table_header_description,
      config.storage_table_header_price,
      config.storage_table_header_action,
      config.service_table_header_service,
      config.service_table_header_type,
      config.service_table_header_features,
      config.service_table_header_bandwidth,
      config.service_table_header_discount,
      config.service_table_header_price,
      config.service_table_header_action,
      config.faq_section_heading,
      config.faq_section_subheading,
      config.button_get_started,
      config.button_contact_sales
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Pricing page configuration updated successfully', changes: this.changes });
    });
});

// Create pricing plan
app.post('/api/pricing/subcategories/:subcategoryId/plans', (req, res) => {
  const { subcategoryId } = req.params;
  const { ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular } = req.body;

  db.run(`INSERT INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [subcategoryId, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular || 0],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Pricing plan created successfully', id: this.lastID });
    });
});

// Update pricing plan
app.put('/api/pricing/plans/:id', (req, res) => {
  const { id } = req.params;
  const { ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular } = req.body;

  db.run(`UPDATE pricing_plans SET 
          ram = ?, vcpu = ?, storage = ?, bandwidth = ?, discount = ?, 
          hourly_price = ?, monthly_price = ?, yearly_price = ?, 
          instance_type = ?, nodes = ?, is_popular = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?`,
    [ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular || 0, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Pricing plan updated successfully', changes: this.changes });
    });
});

// Delete pricing plan
app.delete('/api/pricing/plans/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE pricing_plans SET is_active = 0 WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Pricing plan deleted successfully', changes: this.changes });
  });
});

// Create storage option
app.post('/api/pricing/storage', (req, res) => {
  const { name, description, price_per_gb, features } = req.body;

  db.run('INSERT INTO storage_options (name, description, price_per_gb, features) VALUES (?, ?, ?, ?)',
    [name, description, price_per_gb, JSON.stringify(features)], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Storage option created successfully', id: this.lastID });
    });
});

// Update storage option
app.put('/api/pricing/storage/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price_per_gb, features } = req.body;

  db.run('UPDATE storage_options SET name = ?, description = ?, price_per_gb = ?, features = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, price_per_gb, JSON.stringify(features), id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Storage option updated successfully', changes: this.changes });
    });
});

// Create FAQ
app.post('/api/pricing/faqs', (req, res) => {
  const { question, answer } = req.body;

  db.run('INSERT INTO pricing_faqs (question, answer) VALUES (?, ?)',
    [question, answer], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'FAQ created successfully', id: this.lastID });
    });
});

// Update FAQ
app.put('/api/pricing/faqs/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  db.run('UPDATE pricing_faqs SET question = ?, answer = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [question, answer, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'FAQ updated successfully', changes: this.changes });
    });
});

// Delete FAQ
app.delete('/api/pricing/faqs/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE pricing_faqs SET is_active = 0 WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'FAQ deleted successfully', changes: this.changes });
  });
});

// ===== MAIN PAGES API ENDPOINTS =====

// Get main marketplaces page content
app.get('/api/main-marketplaces', (req, res) => {
  const mainPageData = {};
  const { all } = req.query; // For admin view, show all sections including hidden

  // Get hero content
  db.get('SELECT * FROM main_marketplaces_content WHERE id = 1', (err, heroContent) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    mainPageData.hero = heroContent || {
      title: 'Our Marketplaces',
      subtitle: 'Enterprise Marketplaces - Made in India',
      description: 'Explore our enterprise-grade marketplaces designed to transform your business operations.',
      stat1_label: 'Global Customers',
      stat1_value: '10K+',
      stat2_label: 'Uptime SLA',
      stat2_value: '99.9%',
      stat3_label: 'Data Centers',
      stat3_value: '15+',
      stat4_label: 'Support Rating',
      stat4_value: '4.9★'
    };

    // Get marketplace sections - show all if "all" query param is present (for admin)
    // Include all new fields: popular_tag, category, features, price, price_period, free_trial_tag, button_text
    const sectionsQuery = all === 'true'
      ? `
        SELECT 
          mss.*, 
          COALESCE(s.name, mss.title) as marketplace_name, 
          COALESCE(s.description, mss.description) as marketplace_description,
          COALESCE(mss.category, s.category) as category,
          COALESCE(mss.popular_tag, 'Most Popular') as popular_tag,
          COALESCE(mss.features, '[]') as features,
          COALESCE(mss.price, '₹2,999') as price,
          COALESCE(mss.price_period, '/month') as price_period,
          COALESCE(mss.free_trial_tag, 'Free Trial') as free_trial_tag,
          COALESCE(mss.button_text, 'Explore Marketplace') as button_text
        FROM main_marketplaces_sections mss
        LEFT JOIN marketplaces s ON mss.marketplace_id = s.id
        WHERE (mss.marketplace_id IS NULL AND mss.id IS NOT NULL) OR (mss.marketplace_id IS NOT NULL AND s.id IS NOT NULL)
        ORDER BY mss.order_index ASC
      `
      : `
        SELECT 
          mss.*, 
          COALESCE(s.name, mss.title) as marketplace_name, 
          COALESCE(s.description, mss.description) as marketplace_description,
          COALESCE(mss.category, s.category) as category,
          COALESCE(mss.popular_tag, 'Most Popular') as popular_tag,
          COALESCE(mss.features, '[]') as features,
          COALESCE(mss.price, '₹2,999') as price,
          COALESCE(mss.price_period, '/month') as price_period,
          COALESCE(mss.free_trial_tag, 'Free Trial') as free_trial_tag,
          COALESCE(mss.button_text, 'Explore Marketplace') as button_text
        FROM main_marketplaces_sections mss
        LEFT JOIN marketplaces s ON mss.marketplace_id = s.id
        WHERE mss.is_visible = 1 AND (s.is_visible = 1 OR s.id IS NULL)
        ORDER BY mss.order_index ASC
      `;

    db.all(sectionsQuery, (err, sections) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Parse features JSON for each section
      const parsedSections = sections.map(section => ({
        ...section,
        features: (() => {
          try {
            return typeof section.features === 'string' ? JSON.parse(section.features) : (section.features || []);
          } catch (e) {
            return [];
          }
        })()
      }));

      mainPageData.sections = parsedSections || [];
      res.json(mainPageData);
    });
  });
});

// Add main marketplaces content columns if they don't exist
function addMainMarketplacesContentColumns() {
  const columnsToAdd = [
    'stat1_label TEXT DEFAULT "Global Customers"',
    'stat1_value TEXT DEFAULT "10K+"',
    'stat2_label TEXT DEFAULT "Uptime SLA"',
    'stat2_value TEXT DEFAULT "99.9%"',
    'stat3_label TEXT DEFAULT "Data Centers"',
    'stat3_value TEXT DEFAULT "15+"',
    'stat4_label TEXT DEFAULT "Support Rating"',
    'stat4_value TEXT DEFAULT "4.9★"'
  ];

  columnsToAdd.forEach(column => {
    const columnName = column.split(' ')[0];
    db.run(`ALTER TABLE main_marketplaces_content ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName} to main_marketplaces_content:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${columnName} to main_marketplaces_content`);
      }
    });
  });
}

// Update main marketplaces page hero content
app.put('/api/main-marketplaces/hero', (req, res) => {
  const {
    title,
    subtitle,
    description,
    stat1_label,
    stat1_value,
    stat2_label,
    stat2_value,
    stat3_label,
    stat3_value,
    stat4_label,
    stat4_value
  } = req.body;

  db.run(`
    UPDATE main_marketplaces_content 
    SET title = ?, subtitle = ?, description = ?, 
        stat1_label = ?, stat1_value = ?, stat2_label = ?, stat2_value = ?,
        stat3_label = ?, stat3_value = ?, stat4_label = ?, stat4_value = ?,
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = 1
  `, [
    title, subtitle, description,
    stat1_label, stat1_value, stat2_label, stat2_value,
    stat3_label, stat3_value, stat4_label, stat4_value
  ], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      // Insert if doesn't exist
      db.run(`
        INSERT INTO main_marketplaces_content (
          id, title, subtitle, description,
          stat1_label, stat1_value, stat2_label, stat2_value,
          stat3_label, stat3_value, stat4_label, stat4_value
        ) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        title, subtitle, description,
        stat1_label, stat1_value, stat2_label, stat2_value,
        stat3_label, stat3_value, stat4_label, stat4_value
      ], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Main marketplaces hero content created successfully' });
      });
    } else {
      res.json({ message: 'Main marketplaces hero content updated successfully' });
    }
  });
});

// Add main marketplaces sections columns if they don't exist
function addMainMarketplacesSectionColumns() {
  const columnsToAdd = [
    'popular_tag TEXT',
    'category TEXT',
    'features TEXT DEFAULT "[]"',
    'price TEXT',
    'price_period TEXT',
    'free_trial_tag TEXT',
    'button_text TEXT'
  ];

  columnsToAdd.forEach(column => {
    const columnName = column.split(' ')[0];
    db.run(`ALTER TABLE main_marketplaces_sections ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName} to main_marketplaces_sections:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${columnName} to main_marketplaces_sections`);
      }
    });
  });

  // Set default values for existing records
  setTimeout(() => {
    db.run(`
      UPDATE main_marketplaces_sections 
      SET 
        popular_tag = CASE WHEN popular_tag IS NULL THEN 'Most Popular' ELSE popular_tag END,
        features = CASE WHEN features IS NULL THEN '[]' ELSE features END,
        price = CASE WHEN price IS NULL THEN '₹2,999' ELSE price END,
        price_period = CASE WHEN price_period IS NULL THEN '/month' ELSE price_period END,
        free_trial_tag = CASE WHEN free_trial_tag IS NULL THEN 'Free Trial' ELSE free_trial_tag END,
        button_text = CASE WHEN button_text IS NULL THEN 'Explore App' ELSE button_text END
      WHERE popular_tag IS NULL OR features IS NULL OR price IS NULL OR price_period IS NULL OR free_trial_tag IS NULL OR button_text IS NULL
    `, (err) => {
      if (err) {
        console.error('Error setting default values for main_marketplaces_sections:', err.message);
      } else {
        console.log('✅ Set default values for main_marketplaces_sections');
      }
    });

    // Update existing records that have 'Explore Marketplace' to 'Explore App'
    db.run(`
      UPDATE main_marketplaces_sections 
      SET button_text = 'Explore App'
      WHERE button_text = 'Explore Marketplace'
    `, (err) => {
      if (err) {
        console.error('Error updating button_text from "Explore Marketplace" to "Explore App":', err.message);
      } else {
        console.log('✅ Updated button_text from "Explore Marketplace" to "Explore App"');
      }
    });
  }, 1000);
}

// Add main products sections columns if they don't exist
function addMainProductsSectionColumns() {
  const columnsToAdd = [
    'category TEXT',
    'button_text TEXT'
  ];

  columnsToAdd.forEach(column => {
    const columnName = column.split(' ')[0];
    db.run(`ALTER TABLE main_products_sections ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName} to main_products_sections:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${columnName} to main_products_sections`);
      }
    });
  });

  // Set default values for existing records
  setTimeout(() => {
    db.run(`
      UPDATE main_products_sections 
      SET 
        button_text = CASE WHEN button_text IS NULL THEN 'Explore Product' ELSE button_text END
      WHERE button_text IS NULL
    `, (err) => {
      if (err) {
        console.error('Error setting default values for main_products_sections:', err.message);
      } else {
        console.log('✅ Set default values for main_products_sections');
      }
    });
  }, 1000);
}

// Add columns to About Us sections
function addAboutUsSectionColumns() {
  const tables = [
    { name: 'about_hero_section', columns: ['title_after TEXT DEFAULT "Control"', 'is_visible INTEGER DEFAULT 1'] },
    { name: 'about_story_section', columns: ['is_visible INTEGER DEFAULT 1'] },
    { name: 'about_legacy_section', columns: ['is_visible INTEGER DEFAULT 1'] },
    { name: 'about_testimonials_section', columns: ['is_visible INTEGER DEFAULT 1'] },
    { name: 'about_approach_section', columns: ['is_visible INTEGER DEFAULT 1', 'cta_button_url TEXT'] },
    { name: 'about_mission_vision_section', columns: ['is_visible INTEGER DEFAULT 1'] },
    { name: 'about_core_values_section', columns: ['is_visible INTEGER DEFAULT 1'] }
  ];

  tables.forEach(({ name, columns }) => {
    columns.forEach(column => {
      const columnName = column.split(' ')[0];
      db.run(`ALTER TABLE ${name} ADD COLUMN ${column}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error(`Error adding column ${columnName} to ${name}:`, err.message);
        } else if (!err) {
          console.log(`✅ Added column ${columnName} to ${name}`);
        }
      });
    });
  });

  // Set default values for existing records
  setTimeout(() => {
    db.run(`UPDATE about_hero_section SET title_after = 'Control' WHERE title_after IS NULL`, (err) => {
      if (err) {
        console.error('Error setting default title_after:', err.message);
      } else {
        console.log('✅ Set default title_after for about_hero_section');
      }
    });

    db.run(`UPDATE about_hero_section SET is_visible = 1 WHERE is_visible IS NULL`, (err) => {
      if (err) {
        console.error('Error setting default is_visible for about_hero_section:', err.message);
      }
    });

    ['about_story_section', 'about_legacy_section', 'about_testimonials_section', 'about_approach_section'].forEach(table => {
      db.run(`UPDATE ${table} SET is_visible = 1 WHERE is_visible IS NULL`, (err) => {
        if (err) {
          console.error(`Error setting default is_visible for ${table}:`, err.message);
        }
      });
    });
  }, 1000);
}

// Update main marketplaces section
app.put('/api/main-marketplaces/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;
  const {
    title,
    description,
    is_visible,
    order_index,
    popular_tag,
    category,
    features,
    price,
    price_period,
    free_trial_tag,
    button_text
  } = req.body;

  // Convert features array to JSON string if it's an array
  const featuresJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');

  db.run(`
    UPDATE main_marketplaces_sections 
    SET 
      title = ?, 
      description = ?, 
      is_visible = ?, 
      order_index = ?,
      popular_tag = ?,
      category = ?,
      features = ?,
      price = ?,
      price_period = ?,
      free_trial_tag = ?,
      button_text = ?,
      updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `, [
    title,
    description,
    is_visible,
    order_index || 0,
    popular_tag || null,
    category || null,
    featuresJson,
    price || null,
    price_period || null,
    free_trial_tag || null,
    button_text || null,
    sectionId
  ], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Main marketplaces section updated successfully', changes: this.changes });
  });
});

// Get all main marketplaces sections (including hidden ones for admin)
app.get('/api/main-marketplaces/sections/all', (req, res) => {
  db.all(`
    SELECT 
      mss.*, 
      COALESCE(s.name, mss.title) as marketplace_name, 
      COALESCE(s.description, mss.description) as marketplace_description,
      COALESCE(mss.category, s.category) as category,
      COALESCE(mss.popular_tag, 'Most Popular') as popular_tag,
      COALESCE(mss.features, '[]') as features,
      COALESCE(mss.price, '₹2,999') as price,
      COALESCE(mss.price_period, '/month') as price_period,
      COALESCE(mss.free_trial_tag, 'Free Trial') as free_trial_tag,
      COALESCE(mss.button_text, 'Explore Marketplace') as button_text
    FROM main_marketplaces_sections mss
    LEFT JOIN marketplaces s ON mss.marketplace_id = s.id
    WHERE (mss.marketplace_id IS NULL AND mss.id IS NOT NULL) OR (mss.marketplace_id IS NOT NULL AND s.id IS NOT NULL)
    ORDER BY mss.order_index ASC
  `, (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Parse features JSON for each section
    const parsedSections = sections.map(section => ({
      ...section,
      features: (() => {
        try {
          return typeof section.features === 'string' ? JSON.parse(section.features) : (section.features || []);
        } catch (e) {
          return [];
        }
      })()
    }));

    res.json(parsedSections || []);
  });
});

// Duplicate main marketplaces section
app.post('/api/main-marketplaces/sections/:sectionId/duplicate', (req, res) => {
  const { sectionId } = req.params;

  // Get the original section with all fields
  db.get(`
    SELECT 
      mss.*, 
      COALESCE(s.name, mss.title) as marketplace_name, 
      COALESCE(s.description, mss.description) as marketplace_description
    FROM main_marketplaces_sections mss
    LEFT JOIN marketplaces s ON mss.marketplace_id = s.id
    WHERE mss.id = ?
  `, [sectionId], (err, originalSection) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!originalSection) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Get the next order index
    db.get('SELECT MAX(order_index) as max_order FROM main_marketplaces_sections', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const nextOrder = (result.max_order || 0) + 1;

      // Create duplicate section with all fields
      db.run(`
        INSERT INTO main_marketplaces_sections (
          marketplace_id, title, description, is_visible, order_index,
          popular_tag, category, features, price, price_period, free_trial_tag, button_text
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        originalSection.marketplace_id || null,
        `${originalSection.title} (Copy)`,
        originalSection.description || '',
        originalSection.is_visible || 1,
        nextOrder,
        originalSection.popular_tag || null,
        originalSection.category || null,
        originalSection.features || '[]',
        originalSection.price || null,
        originalSection.price_period || null,
        originalSection.free_trial_tag || null,
        originalSection.button_text || null
      ], function (err) {
        if (err) {
          console.error('Error duplicating section:', err);
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          message: 'Section duplicated successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
    });
  });
});

// Delete main marketplaces section
app.delete('/api/main-marketplaces/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;

  db.run('DELETE FROM main_marketplaces_sections WHERE id = ?', [sectionId], function (err) {
    if (err) {
      console.error('Error deleting section:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    res.json({ message: 'Section deleted successfully', changes: this.changes });
  });
});

// Toggle visibility of main marketplaces section
app.patch('/api/main-marketplaces/sections/:sectionId/toggle-visibility', (req, res) => {
  const { sectionId } = req.params;

  // Get current visibility
  db.get('SELECT is_visible FROM main_marketplaces_sections WHERE id = ?', [sectionId], (err, section) => {
    if (err) {
      console.error('Error getting section visibility:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    // Toggle visibility
    const newVisibility = section.is_visible ? 0 : 1;

    db.run('UPDATE main_marketplaces_sections SET is_visible = ? WHERE id = ?', [newVisibility, sectionId], function (err) {
      if (err) {
        console.error('Error toggling section visibility:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: `Section ${newVisibility ? 'shown' : 'hidden'} successfully`,
        is_visible: newVisibility,
        changes: this.changes
      });
    });
  });
});

// Create new main marketplaces section (standalone)
app.post('/api/main-marketplaces/sections', (req, res) => {
  const {
    title,
    description,
    is_visible,
    popular_tag,
    category,
    features,
    price,
    price_period,
    free_trial_tag,
    button_text
  } = req.body;

  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  // Get the next order index
  db.get('SELECT MAX(order_index) as max_order FROM main_marketplaces_sections', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || 0) + 1;

    // Convert features array to JSON string if it's an array
    const featuresJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');

    db.run(`
      INSERT INTO main_marketplaces_sections (
        marketplace_id, title, description, is_visible, order_index,
        popular_tag, category, features, price, price_period, free_trial_tag, button_text
      ) 
      VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || '',
      is_visible !== undefined ? is_visible : 1,
      nextOrder,
      popular_tag || null,
      category || null,
      featuresJson,
      price || null,
      price_period || null,
      free_trial_tag || null,
      button_text || null
    ], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: 'Section created successfully',
        id: this.lastID,
        changes: this.changes
      });
    });
  });
});

// ==================== Comprehensive Section API Endpoints ====================

// Get comprehensive section data (header, features, stats)
app.get('/api/comprehensive-section', (req, res) => {
  const comprehensiveData = {};

  // Get header content
  db.get('SELECT * FROM comprehensive_section_content WHERE id = 1', (err, headerContent) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    comprehensiveData.header = headerContent || {
      title: 'The most comprehensive cloud platform',
      description: 'From infrastructure technologies like compute, storage, and databases to emerging technologies like machine learning, artificial intelligence, and data analytics.'
    };

    // Get feature cards (only visible ones, ordered by order_index)
    db.all('SELECT * FROM comprehensive_section_features WHERE is_visible = 1 ORDER BY order_index ASC', (err, features) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      comprehensiveData.features = features || [];

      // Get statistics (only visible ones, ordered by order_index)
      db.all('SELECT * FROM comprehensive_section_stats WHERE is_visible = 1 ORDER BY order_index ASC', (err, stats) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        comprehensiveData.stats = stats || [];

        res.json(comprehensiveData);
      });
    });
  });
});

// Update comprehensive section header
app.put('/api/comprehensive-section/header', (req, res) => {
  const { title, description } = req.body;

  db.run(`
    UPDATE comprehensive_section_content 
    SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = 1
  `, [title, description], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      // Insert if doesn't exist
      db.run(`
        INSERT INTO comprehensive_section_content (id, title, description) 
        VALUES (1, ?, ?)
      `, [title, description], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Header updated successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
    } else {
      res.json({
        message: 'Header updated successfully',
        changes: this.changes
      });
    }
  });
});

// Update comprehensive section feature card
app.put('/api/comprehensive-section/features/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, button_text, icon_type, order_index, is_visible } = req.body;

  db.run(`
    UPDATE comprehensive_section_features 
    SET title = ?, description = ?, button_text = ?, icon_type = ?, 
        order_index = ?, is_visible = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `, [title, description, button_text, icon_type, order_index, is_visible !== undefined ? is_visible : 1, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'Feature updated successfully',
      changes: this.changes
    });
  });
});

// Update comprehensive section statistic
app.put('/api/comprehensive-section/stats/:id', (req, res) => {
  const { id } = req.params;
  const { value, label, order_index, is_visible } = req.body;

  db.run(`
    UPDATE comprehensive_section_stats 
    SET value = ?, label = ?, order_index = ?, is_visible = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `, [value, label, order_index, is_visible !== undefined ? is_visible : 1, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'Statistic updated successfully',
      changes: this.changes
    });
  });
});

// ==================== Feature Banners API Endpoints ====================

// Get all feature banners (only visible ones, ordered by order_index)
app.get('/api/feature-banners', (req, res) => {
  db.all('SELECT * FROM feature_banners WHERE is_visible = 1 ORDER BY order_index ASC', (err, banners) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Format banners to match frontend expectations
    const formattedBanners = banners.map(banner => {
      // Handle null gradient values - provide defaults if null
      const gradientStart = banner.gradient_start || 'phulkari-turquoise';
      const gradientMid = banner.gradient_mid || 'phulkari-blue-light';
      const gradientEnd = banner.gradient_end || 'saree-teal';
      const accentStart = banner.accent_gradient_start || 'phulkari-turquoise';
      const accentEnd = banner.accent_gradient_end || 'saree-teal';
      
      return {
        id: banner.id,
        category: banner.category,
        title: banner.title,
        subtitle: banner.subtitle,
        ctaText: banner.cta_text,
        ctaLink: banner.cta_link,
        gradient: `from-${gradientStart} via-${gradientMid} to-${gradientEnd}`,
        accentGradient: `from-${accentStart} to-${accentEnd}`
      };
    });

    res.json(formattedBanners);
  });
});

// Get all feature banners (including hidden) - for admin
app.get('/api/feature-banners/all', (req, res) => {
  db.all('SELECT * FROM feature_banners ORDER BY order_index ASC', (err, banners) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Format banners to match frontend expectations
    const formattedBanners = banners.map(banner => {
      // Handle null gradient values - provide defaults if null
      const gradientStart = banner.gradient_start || 'phulkari-turquoise';
      const gradientMid = banner.gradient_mid || 'phulkari-blue-light';
      const gradientEnd = banner.gradient_end || 'saree-teal';
      const accentStart = banner.accent_gradient_start || 'phulkari-turquoise';
      const accentEnd = banner.accent_gradient_end || 'saree-teal';
      
      return {
        id: banner.id,
        category: banner.category,
        title: banner.title,
        subtitle: banner.subtitle,
        ctaText: banner.cta_text,
        ctaLink: banner.cta_link,
        gradient: `from-${gradientStart} via-${gradientMid} to-${gradientEnd}`,
        accentGradient: `from-${accentStart} to-${accentEnd}`,
        gradient_start: banner.gradient_start,
        gradient_mid: banner.gradient_mid,
        gradient_end: banner.gradient_end,
        accent_gradient_start: banner.accent_gradient_start,
        accent_gradient_end: banner.accent_gradient_end,
        order_index: banner.order_index,
        is_visible: banner.is_visible
      };
    });

    res.json(formattedBanners);
  });
});

// Create new feature banner
app.post('/api/feature-banners', (req, res) => {
  const {
    category,
    title,
    subtitle,
    cta_text,
    cta_link,
    gradient_start,
    gradient_mid,
    gradient_end,
    accent_gradient_start,
    accent_gradient_end,
    order_index,
    is_visible
  } = req.body;

  if (!category || !title) {
    res.status(400).json({ error: 'category and title are required' });
    return;
  }

  // Get the next order index if not provided
  db.get('SELECT MAX(order_index) as max_order FROM feature_banners', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = order_index !== undefined ? order_index : ((result.max_order || 0) + 1);

    db.run(`
      INSERT INTO feature_banners (
        category, title, subtitle, cta_text, cta_link,
        gradient_start, gradient_mid, gradient_end,
        accent_gradient_start, accent_gradient_end,
        order_index, is_visible
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category, title, subtitle || '', cta_text || '', cta_link || '#',
      gradient_start || 'saree-teal', gradient_mid || 'phulkari-turquoise', gradient_end || 'saree-lime',
      accent_gradient_start || 'saree-teal', accent_gradient_end || 'phulkari-turquoise',
      nextOrder, is_visible !== undefined ? is_visible : 1
    ], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: 'Feature banner created successfully',
        id: this.lastID,
        changes: this.changes
      });
    });
  });
});

// Update feature banner
app.put('/api/feature-banners/:id', (req, res) => {
  const { id } = req.params;
  const {
    category,
    title,
    subtitle,
    cta_text,
    cta_link,
    gradient_start,
    gradient_mid,
    gradient_end,
    accent_gradient_start,
    accent_gradient_end,
    order_index,
    is_visible
  } = req.body;

  // First, get the current banner to preserve existing values
  db.get('SELECT * FROM feature_banners WHERE id = ?', [id], (err, existingBanner) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!existingBanner) {
      res.status(404).json({ error: 'Feature banner not found' });
      return;
    }

    // Use provided values or keep existing values
    const finalCategory = category !== undefined ? category : existingBanner.category;
    const finalTitle = title !== undefined ? title : existingBanner.title;
    const finalSubtitle = subtitle !== undefined ? subtitle : existingBanner.subtitle;
    const finalCtaText = cta_text !== undefined ? cta_text : existingBanner.cta_text;
    const finalCtaLink = cta_link !== undefined ? cta_link : existingBanner.cta_link;
    const finalGradientStart = gradient_start !== undefined ? gradient_start : existingBanner.gradient_start;
    const finalGradientMid = gradient_mid !== undefined ? gradient_mid : existingBanner.gradient_mid;
    const finalGradientEnd = gradient_end !== undefined ? gradient_end : existingBanner.gradient_end;
    const finalAccentStart = accent_gradient_start !== undefined ? accent_gradient_start : existingBanner.accent_gradient_start;
    const finalAccentEnd = accent_gradient_end !== undefined ? accent_gradient_end : existingBanner.accent_gradient_end;
    const finalOrderIndex = order_index !== undefined ? order_index : existingBanner.order_index;
    const finalIsVisible = is_visible !== undefined ? is_visible : existingBanner.is_visible;

    db.run(`
      UPDATE feature_banners 
      SET category = ?, title = ?, subtitle = ?, cta_text = ?, cta_link = ?,
          gradient_start = ?, gradient_mid = ?, gradient_end = ?,
          accent_gradient_start = ?, accent_gradient_end = ?,
          order_index = ?, is_visible = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [
      finalCategory, finalTitle, finalSubtitle, finalCtaText, finalCtaLink,
      finalGradientStart, finalGradientMid, finalGradientEnd,
      finalAccentStart, finalAccentEnd,
      finalOrderIndex, finalIsVisible, id
    ], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: 'Feature banner updated successfully',
        changes: this.changes
      });
    });
  });
});

// Delete feature banner
app.delete('/api/feature-banners/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM feature_banners WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'Feature banner deleted successfully',
      changes: this.changes
    });
  });
});

// Toggle feature banner visibility
app.patch('/api/feature-banners/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;

  // Get current visibility
  db.get('SELECT is_visible FROM feature_banners WHERE id = ?', [id], (err, banner) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!banner) {
      res.status(404).json({ error: 'Feature banner not found' });
      return;
    }

    const newVisibility = banner.is_visible === 1 ? 0 : 1;

    db.run('UPDATE feature_banners SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          message: 'Visibility toggled successfully',
          is_visible: newVisibility,
          changes: this.changes
        });
      });
  });
});

// ==================== About Us Page API Endpoints ====================

// Get all About Us page content
app.get('/api/about', (req, res) => {
  const { all } = req.query;
  const showAll = all === 'true';
  const aboutData = {};

  // Get hero section (only if visible, unless all=true)
  const heroQuery = showAll
    ? 'SELECT * FROM about_hero_section WHERE id = 1'
    : 'SELECT * FROM about_hero_section WHERE id = 1 AND (is_visible = 1 OR is_visible IS NULL)';
  db.get(heroQuery, (err, hero) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    aboutData.hero = hero || {};

    // Get story section (only if visible, unless all=true)
    const storyQuery = showAll
      ? 'SELECT * FROM about_story_section WHERE id = 1'
      : 'SELECT * FROM about_story_section WHERE id = 1 AND (is_visible = 1 OR is_visible IS NULL)';
    db.get(storyQuery, (err, story) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      aboutData.story = story || {};

      // Parse story_items JSON string
      if (aboutData.story.story_items) {
        try {
          aboutData.story.story_items = JSON.parse(aboutData.story.story_items);
        } catch (e) {
          aboutData.story.story_items = [];
        }
      }

      // Get legacy section (only if visible, unless all=true)
      const legacyQuery = showAll
        ? 'SELECT * FROM about_legacy_section WHERE id = 1'
        : 'SELECT * FROM about_legacy_section WHERE id = 1 AND (is_visible = 1 OR is_visible IS NULL)';
      db.get(legacyQuery, (err, legacy) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        aboutData.legacy = legacy || {};

        // Get stats
        db.all('SELECT * FROM about_legacy_stats WHERE is_visible = 1 ORDER BY order_index ASC', (err, stats) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          aboutData.legacy.stats = stats || [];

          // Get testimonials section (only if visible, unless all=true)
          const testimonialsSectionQuery = showAll
            ? 'SELECT * FROM about_testimonials_section WHERE id = 1'
            : 'SELECT * FROM about_testimonials_section WHERE id = 1 AND (is_visible = 1 OR is_visible IS NULL)';
          db.get(testimonialsSectionQuery, (err, testimonialsSection) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            aboutData.testimonialsSection = testimonialsSection || {};

            // Get testimonials
            db.all('SELECT * FROM about_testimonials WHERE is_visible = 1 ORDER BY page_index ASC, order_index ASC', (err, testimonials) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              aboutData.testimonials = testimonials || [];

              // Group testimonials by page_index
              const groupedTestimonials = {};
              testimonials.forEach(testimonial => {
                if (!groupedTestimonials[testimonial.page_index]) {
                  groupedTestimonials[testimonial.page_index] = [];
                }
                groupedTestimonials[testimonial.page_index].push(testimonial);
              });
              aboutData.testimonials = Object.values(groupedTestimonials);

              // Get ratings
              db.all('SELECT * FROM about_testimonial_ratings WHERE is_visible = 1 ORDER BY order_index ASC', (err, ratings) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }
                aboutData.ratings = ratings || [];

                // Get approach section (only if visible, unless all=true)
                const approachSectionQuery = showAll
                  ? 'SELECT * FROM about_approach_section WHERE id = 1'
                  : 'SELECT * FROM about_approach_section WHERE id = 1 AND (is_visible = 1 OR is_visible IS NULL)';
                db.get(approachSectionQuery, (err, approachSection) => {
                  if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                  }
                  aboutData.approachSection = approachSection || {};

                  // Get approach items
                  db.all('SELECT * FROM about_approach_items WHERE is_visible = 1 ORDER BY order_index ASC', (err, approachItems) => {
                    if (err) {
                      res.status(500).json({ error: err.message });
                      return;
                    }
                    aboutData.approachItems = approachItems || [];

                    // Get mission & vision section (only if visible, unless all=true)
                    const missionVisionQuery = showAll
                      ? 'SELECT * FROM about_mission_vision_section WHERE id = 1'
                      : 'SELECT * FROM about_mission_vision_section WHERE id = 1 AND (is_visible = 1 OR is_visible IS NULL)';
                    db.get(missionVisionQuery, (err, missionVision) => {
                      if (err) {
                        // Table might not exist yet, continue without it
                        aboutData.missionVision = {};
                      } else {
                        aboutData.missionVision = missionVision || {};
                      }

                      // Get core values section (only if visible, unless all=true)
                      const coreValuesSectionQuery = showAll
                        ? 'SELECT * FROM about_core_values_section WHERE id = 1'
                        : 'SELECT * FROM about_core_values_section WHERE id = 1 AND (is_visible = 1 OR is_visible IS NULL)';
                      db.get(coreValuesSectionQuery, (err, coreValuesSection) => {
                        if (err) {
                          // Table might not exist yet, continue without it
                          aboutData.coreValuesSection = {};
                          aboutData.coreValues = [];
                          res.json(aboutData);
                        } else {
                          aboutData.coreValuesSection = coreValuesSection || {};

                          // Get core values items
                          db.all('SELECT * FROM about_core_values WHERE is_visible = 1 ORDER BY order_index ASC', (err, coreValues) => {
                            if (err) {
                              aboutData.coreValues = [];
                            } else {
                              aboutData.coreValues = coreValues || [];
                            }

                            res.json(aboutData);
                          });
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Update About Hero Section
app.put('/api/about/hero', (req, res) => {
  const { badge_text, title, highlighted_text, title_after, description, button_text, button_link, image_url, stat_value, stat_label } = req.body;

  db.run(`UPDATE about_hero_section SET 
    badge_text = COALESCE(?, badge_text),
    title = COALESCE(?, title),
    highlighted_text = COALESCE(?, highlighted_text),
    title_after = COALESCE(?, title_after),
    description = COALESCE(?, description),
    button_text = COALESCE(?, button_text),
    button_link = COALESCE(?, button_link),
    image_url = COALESCE(?, image_url),
    stat_value = COALESCE(?, stat_value),
    stat_label = COALESCE(?, stat_label),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [badge_text, title, highlighted_text, title_after, description, button_text, button_link, image_url, stat_value, stat_label],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        db.run(`INSERT INTO about_hero_section (id, badge_text, title, highlighted_text, title_after, description, button_text, button_link, image_url, stat_value, stat_label) 
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [badge_text || 'About Cloud 4 India', title, highlighted_text, title_after || 'Control', description, button_text, button_link, image_url, stat_value, stat_label],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'About hero section created successfully' });
          });
      } else {
        res.json({ message: 'About hero section updated successfully', changes: this.changes });
      }
    });
});

// Update About Story Section
app.put('/api/about/story', (req, res) => {
  const { header_title, header_description, founding_year, story_items, image_url, badge_icon, badge_value, badge_label, top_badge_icon, top_badge_value, top_badge_label } = req.body;

  const storyItemsJson = Array.isArray(story_items) ? JSON.stringify(story_items) : story_items;

  db.run(`UPDATE about_story_section SET 
    header_title = COALESCE(?, header_title),
    header_description = COALESCE(?, header_description),
    founding_year = COALESCE(?, founding_year),
    story_items = COALESCE(?, story_items),
    image_url = COALESCE(?, image_url),
    badge_icon = COALESCE(?, badge_icon),
    badge_value = COALESCE(?, badge_value),
    badge_label = COALESCE(?, badge_label),
    top_badge_icon = COALESCE(?, top_badge_icon),
    top_badge_value = COALESCE(?, top_badge_value),
    top_badge_label = COALESCE(?, top_badge_label),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [header_title, header_description, founding_year, storyItemsJson, image_url, badge_icon, badge_value, badge_label, top_badge_icon, top_badge_value, top_badge_label],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        db.run(`INSERT INTO about_story_section (id, header_title, header_description, founding_year, story_items, image_url, badge_icon, badge_value, badge_label, top_badge_icon, top_badge_value, top_badge_label) 
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [header_title, header_description, founding_year, storyItemsJson, image_url, badge_icon, badge_value, badge_label, top_badge_icon, top_badge_value, top_badge_label],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'About story section created successfully' });
          });
      } else {
        res.json({ message: 'About story section updated successfully', changes: this.changes });
      }
    });
});

// Update About Legacy Section Header
app.put('/api/about/legacy', (req, res) => {
  const { header_title, header_description } = req.body;

  db.run(`UPDATE about_legacy_section SET 
    header_title = COALESCE(?, header_title),
    header_description = COALESCE(?, header_description),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [header_title, header_description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        db.run(`INSERT INTO about_legacy_section (id, header_title, header_description) VALUES (1, ?, ?)`,
          [header_title || 'Our Legacy', header_description],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'About legacy section created successfully' });
          });
      } else {
        res.json({ message: 'About legacy section updated successfully', changes: this.changes });
      }
    });
});

// Stats CRUD
app.get('/api/about/stats', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM about_legacy_stats ORDER BY order_index ASC'
    : 'SELECT * FROM about_legacy_stats WHERE is_visible = 1 ORDER BY order_index ASC';
  db.all(query, (err, stats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(stats || []);
  });
});

app.post('/api/about/stats', (req, res) => {
  const { label, value, order_index, is_visible } = req.body;
  db.run(`INSERT INTO about_legacy_stats (label, value, order_index, is_visible) VALUES (?, ?, ?, ?)`,
    [label, value, order_index || 0, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Stat created successfully' });
    });
});

app.put('/api/about/stats/:id', (req, res) => {
  const { id } = req.params;
  const { label, value, order_index, is_visible } = req.body;
  db.run(`UPDATE about_legacy_stats SET 
    label = COALESCE(?, label),
    value = COALESCE(?, value),
    order_index = COALESCE(?, order_index),
    is_visible = COALESCE(?, is_visible),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [label, value, order_index, is_visible, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Stat updated successfully', changes: this.changes });
    });
});

app.delete('/api/about/stats/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM about_legacy_stats WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Stat deleted successfully', changes: this.changes });
  });
});

// Testimonials Section Header
app.put('/api/about/testimonials-section', (req, res) => {
  const { header_title, header_description } = req.body;
  db.run(`UPDATE about_testimonials_section SET 
    header_title = COALESCE(?, header_title),
    header_description = COALESCE(?, header_description),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [header_title, header_description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        db.run(`INSERT INTO about_testimonials_section (id, header_title, header_description) VALUES (1, ?, ?)`,
          [header_title, header_description],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'Testimonials section created successfully' });
          });
      } else {
        res.json({ message: 'Testimonials section updated successfully', changes: this.changes });
      }
    });
});

// Testimonials CRUD
app.get('/api/about/testimonials', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM about_testimonials ORDER BY page_index ASC, order_index ASC'
    : 'SELECT * FROM about_testimonials WHERE is_visible = 1 ORDER BY page_index ASC, order_index ASC';
  db.all(query, (err, testimonials) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(testimonials || []);
  });
});

app.post('/api/about/testimonials', (req, res) => {
  const { quote, company, author, page_index, order_index, is_visible } = req.body;
  db.run(`INSERT INTO about_testimonials (quote, company, author, page_index, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?)`,
    [quote, company || null, author || null, page_index || 0, order_index || 0, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Testimonial created successfully' });
    });
});

app.put('/api/about/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { quote, company, author, page_index, order_index, is_visible } = req.body;
  db.run(`UPDATE about_testimonials SET 
    quote = COALESCE(?, quote),
    company = COALESCE(?, company),
    author = COALESCE(?, author),
    page_index = COALESCE(?, page_index),
    order_index = COALESCE(?, order_index),
    is_visible = COALESCE(?, is_visible),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [quote, company, author, page_index, order_index, is_visible, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Testimonial updated successfully', changes: this.changes });
    });
});

app.delete('/api/about/testimonials/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM about_testimonials WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Testimonial deleted successfully', changes: this.changes });
  });
});

// Ratings CRUD
app.get('/api/about/ratings', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM about_testimonial_ratings ORDER BY order_index ASC'
    : 'SELECT * FROM about_testimonial_ratings WHERE is_visible = 1 ORDER BY order_index ASC';
  db.all(query, (err, ratings) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(ratings || []);
  });
});

app.post('/api/about/ratings', (req, res) => {
  const { platform, rating_value, platform_icon, order_index, is_visible } = req.body;
  db.run(`INSERT INTO about_testimonial_ratings (platform, rating_value, platform_icon, order_index, is_visible) VALUES (?, ?, ?, ?, ?)`,
    [platform, rating_value, platform_icon || null, order_index || 0, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Rating created successfully' });
    });
});

app.put('/api/about/ratings/:id', (req, res) => {
  const { id } = req.params;
  const { platform, rating_value, platform_icon, order_index, is_visible } = req.body;
  db.run(`UPDATE about_testimonial_ratings SET 
    platform = COALESCE(?, platform),
    rating_value = COALESCE(?, rating_value),
    platform_icon = COALESCE(?, platform_icon),
    order_index = COALESCE(?, order_index),
    is_visible = COALESCE(?, is_visible),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [platform, rating_value, platform_icon, order_index, is_visible, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Rating updated successfully', changes: this.changes });
    });
});

app.delete('/api/about/ratings/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM about_testimonial_ratings WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Rating deleted successfully', changes: this.changes });
  });
});

// Approach Section Header
app.put('/api/about/approach-section', (req, res) => {
  const { header_title, header_description, cta_button_text, cta_button_url } = req.body;
  db.run(`UPDATE about_approach_section SET 
    header_title = COALESCE(?, header_title),
    header_description = COALESCE(?, header_description),
    cta_button_text = COALESCE(?, cta_button_text),
    cta_button_url = COALESCE(?, cta_button_url),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [header_title, header_description, cta_button_text, cta_button_url],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        db.run(`INSERT INTO about_approach_section (id, header_title, header_description, cta_button_text, cta_button_url) VALUES (1, ?, ?, ?, ?)`,
          [header_title || 'Our Approach', header_description, cta_button_text || 'Talk to a Specialist', cta_button_url || ''],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'Approach section created successfully' });
          });
      } else {
        res.json({ message: 'Approach section updated successfully', changes: this.changes });
      }
    });
});

// Approach Items CRUD
app.get('/api/about/approach-items', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM about_approach_items ORDER BY order_index ASC'
    : 'SELECT * FROM about_approach_items WHERE is_visible = 1 ORDER BY order_index ASC';
  db.all(query, (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items || []);
  });
});

app.post('/api/about/approach-items', (req, res) => {
  const { title, description, icon_type, order_index, is_visible } = req.body;
  db.run(`INSERT INTO about_approach_items (title, description, icon_type, order_index, is_visible) VALUES (?, ?, ?, ?, ?)`,
    [title, description, icon_type || null, order_index || 0, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Approach item created successfully' });
    });
});

app.put('/api/about/approach-items/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, icon_type, order_index, is_visible } = req.body;
  db.run(`UPDATE about_approach_items SET 
    title = COALESCE(?, title),
    description = COALESCE(?, description),
    icon_type = COALESCE(?, icon_type),
    order_index = COALESCE(?, order_index),
    is_visible = COALESCE(?, is_visible),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [title, description, icon_type, order_index, is_visible, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Approach item updated successfully', changes: this.changes });
    });
});

app.delete('/api/about/approach-items/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM about_approach_items WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Approach item deleted successfully', changes: this.changes });
  });
});

// Toggle visibility endpoints
app.put('/api/about/stats/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  db.get('SELECT is_visible FROM about_legacy_stats WHERE id = ?', [id], (err, stat) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!stat) {
      res.status(404).json({ error: 'Stat not found' });
      return;
    }
    const newVisibility = stat.is_visible === 1 ? 0 : 1;
    db.run('UPDATE about_legacy_stats SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

app.put('/api/about/testimonials/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  db.get('SELECT is_visible FROM about_testimonials WHERE id = ?', [id], (err, testimonial) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!testimonial) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    const newVisibility = testimonial.is_visible === 1 ? 0 : 1;
    db.run('UPDATE about_testimonials SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

app.put('/api/about/ratings/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  db.get('SELECT is_visible FROM about_testimonial_ratings WHERE id = ?', [id], (err, rating) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!rating) {
      res.status(404).json({ error: 'Rating not found' });
      return;
    }
    const newVisibility = rating.is_visible === 1 ? 0 : 1;
    db.run('UPDATE about_testimonial_ratings SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

app.put('/api/about/approach-items/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  db.get('SELECT is_visible FROM about_approach_items WHERE id = ?', [id], (err, item) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!item) {
      res.status(404).json({ error: 'Approach item not found' });
      return;
    }
    const newVisibility = item.is_visible === 1 ? 0 : 1;
    db.run('UPDATE about_approach_items SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

// Toggle visibility for main sections
app.put('/api/about/hero/toggle-visibility', (req, res) => {
  db.get('SELECT is_visible FROM about_hero_section WHERE id = 1', (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Hero section not found' });
      return;
    }
    const newVisibility = (section.is_visible === 1 || section.is_visible === null) ? 0 : 1;
    db.run('UPDATE about_hero_section SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newVisibility], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

app.put('/api/about/story/toggle-visibility', (req, res) => {
  db.get('SELECT is_visible FROM about_story_section WHERE id = 1', (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Story section not found' });
      return;
    }
    const newVisibility = (section.is_visible === 1 || section.is_visible === null) ? 0 : 1;
    db.run('UPDATE about_story_section SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newVisibility], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

app.put('/api/about/legacy/toggle-visibility', (req, res) => {
  db.get('SELECT is_visible FROM about_legacy_section WHERE id = 1', (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Legacy section not found' });
      return;
    }
    const newVisibility = (section.is_visible === 1 || section.is_visible === null) ? 0 : 1;
    db.run('UPDATE about_legacy_section SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newVisibility], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

app.put('/api/about/testimonials-section/toggle-visibility', (req, res) => {
  db.get('SELECT is_visible FROM about_testimonials_section WHERE id = 1', (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Testimonials section not found' });
      return;
    }
    const newVisibility = (section.is_visible === 1 || section.is_visible === null) ? 0 : 1;
    db.run('UPDATE about_testimonials_section SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newVisibility], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

app.put('/api/about/approach-section/toggle-visibility', (req, res) => {
  db.get('SELECT is_visible FROM about_approach_section WHERE id = 1', (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Approach section not found' });
      return;
    }
    const newVisibility = (section.is_visible === 1 || section.is_visible === null) ? 0 : 1;
    db.run('UPDATE about_approach_section SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newVisibility], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

// Update Mission & Vision Section
app.put('/api/about/mission-vision', (req, res) => {
  const { header_title, header_description, mission_title, mission_description, vision_title, vision_description } = req.body;
  db.run(`UPDATE about_mission_vision_section SET 
    header_title = COALESCE(?, header_title),
    header_description = COALESCE(?, header_description),
    mission_title = COALESCE(?, mission_title),
    mission_description = COALESCE(?, mission_description),
    vision_title = COALESCE(?, vision_title),
    vision_description = COALESCE(?, vision_description),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [header_title, header_description, mission_title, mission_description, vision_title, vision_description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        db.run(`INSERT INTO about_mission_vision_section (id, header_title, header_description, mission_title, mission_description, vision_title, vision_description) VALUES (1, ?, ?, ?, ?, ?, ?)`,
          [header_title, header_description, mission_title, mission_description, vision_title, vision_description],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'Mission & Vision section created successfully' });
          });
      } else {
        res.json({ message: 'Mission & Vision section updated successfully', changes: this.changes });
      }
    });
});

// Toggle Mission & Vision Section Visibility
app.put('/api/about/mission-vision/toggle-visibility', (req, res) => {
  db.get('SELECT is_visible FROM about_mission_vision_section WHERE id = 1', (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Mission & Vision section not found' });
      return;
    }
    const newVisibility = (section.is_visible === 1 || section.is_visible === null) ? 0 : 1;
    db.run('UPDATE about_mission_vision_section SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newVisibility], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

// Update Core Values Section Header
app.put('/api/about/core-values-section', (req, res) => {
  const { header_title, header_description } = req.body;
  db.run(`UPDATE about_core_values_section SET 
    header_title = COALESCE(?, header_title),
    header_description = COALESCE(?, header_description),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [header_title, header_description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        db.run(`INSERT INTO about_core_values_section (id, header_title, header_description) VALUES (1, ?, ?)`,
          [header_title, header_description],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'Core Values section created successfully' });
          });
      } else {
        res.json({ message: 'Core Values section updated successfully', changes: this.changes });
      }
    });
});

// Toggle Core Values Section Visibility
app.put('/api/about/core-values-section/toggle-visibility', (req, res) => {
  db.get('SELECT is_visible FROM about_core_values_section WHERE id = 1', (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Core Values section not found' });
      return;
    }
    const newVisibility = (section.is_visible === 1 || section.is_visible === null) ? 0 : 1;
    db.run('UPDATE about_core_values_section SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newVisibility], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

// Core Values CRUD
app.get('/api/about/core-values', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM about_core_values ORDER BY order_index ASC'
    : 'SELECT * FROM about_core_values WHERE is_visible = 1 ORDER BY order_index ASC';
  db.all(query, (err, values) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(values);
  });
});

app.post('/api/about/core-values', (req, res) => {
  const { title, description, icon_type, color, order_index, is_visible } = req.body;
  db.run(`INSERT INTO about_core_values (title, description, icon_type, color, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, icon_type || 'lightbulb', color || 'saree-teal', order_index || 0, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Core value created successfully', id: this.lastID });
    });
});

app.put('/api/about/core-values/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, icon_type, color, order_index, is_visible } = req.body;
  db.run(`UPDATE about_core_values SET 
    title = COALESCE(?, title),
    description = COALESCE(?, description),
    icon_type = COALESCE(?, icon_type),
    color = COALESCE(?, color),
    order_index = COALESCE(?, order_index),
    is_visible = COALESCE(?, is_visible),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [title, description, icon_type, color, order_index, is_visible, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Core value updated successfully', changes: this.changes });
    });
});

app.delete('/api/about/core-values/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM about_core_values WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Core value deleted successfully', changes: this.changes });
  });
});

app.put('/api/about/core-values/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  db.get('SELECT is_visible FROM about_core_values WHERE id = ?', [id], (err, value) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!value) {
      res.status(404).json({ error: 'Core value not found' });
      return;
    }
    const newVisibility = value.is_visible === 1 ? 0 : 1;
    db.run('UPDATE about_core_values SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

// Cleanup orphaned main_marketplaces_sections entries (where marketplace doesn't exist)
// Only removes entries where marketplace_id references a marketplace that was deleted
function cleanupOrphanedMainMarketplacesSections() {
  db.run(`
    DELETE FROM main_marketplaces_sections 
    WHERE marketplace_id IS NOT NULL 
    AND marketplace_id NOT IN (SELECT id FROM marketplaces)
  `, function (err) {
    if (err) {
      console.error('Error cleaning up orphaned main_marketplaces_sections:', err.message);
    } else if (this.changes > 0) {
      console.log(`🧹 Cleaned up ${this.changes} orphaned main_marketplaces_sections entries (deleted marketplaces only)`);
    }

    // Also clean up NULL marketplace_id entries (these are truly orphaned)
    db.run(`
      DELETE FROM main_marketplaces_sections 
      WHERE marketplace_id IS NULL
    `, function (err2) {
      if (!err2 && this.changes > 0) {
        console.log(`🧹 Cleaned up ${this.changes} entries with NULL marketplace_id`);
      }
    });
  });
}

// Cleanup orphaned main_solutions_sections entries (where solution doesn't exist)
// Only removes entries where solution_id references a solution that was deleted
function cleanupOrphanedMainSolutionsSections() {
  db.run(`
    DELETE FROM main_solutions_sections 
    WHERE solution_id IS NOT NULL 
    AND solution_id NOT IN (SELECT id FROM solutions)
  `, function (err) {
    if (err) {
      console.error('Error cleaning up orphaned main_solutions_sections:', err.message);
    } else if (this.changes > 0) {
      console.log(`🧹 Cleaned up ${this.changes} orphaned main_solutions_sections entries (deleted solutions only)`);
    }
  });
}

// Cleanup orphaned main_products_sections entries (where product doesn't exist)
// Only removes entries where product_id references a product that was deleted
function cleanupOrphanedMainProductsSections() {
  db.run(`
    DELETE FROM main_products_sections 
    WHERE product_id IS NOT NULL 
    AND product_id NOT IN (SELECT id FROM products)
  `, function (err) {
    if (err) {
      console.error('Error cleaning up orphaned main_products_sections:', err.message);
    } else if (this.changes > 0) {
      console.log(`🧹 Cleaned up ${this.changes} orphaned main_products_sections entries (deleted products only)`);
    }
  });
}

// ========== SOLUTIONS API ENDPOINTS ==========

// Get all solutions (visible only)
app.get('/api/solutions', (req, res) => {
  db.all('SELECT * FROM solutions WHERE is_visible = 1 ORDER BY order_index ASC', (err, solutions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(solutions);
  });
});

// Get all solutions (admin - includes hidden)
app.get('/api/admin/solutions', (req, res) => {
  db.all('SELECT * FROM solutions ORDER BY order_index ASC', (err, solutions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(solutions);
  });
});

// Get solution categories in order
app.get('/api/solutions/categories', (req, res) => {
  db.all('SELECT * FROM solution_categories ORDER BY order_index ASC', (err, categories) => {
    if (err) {
      if (err.message.includes('no such table')) {
        console.log('solution_categories table does not exist yet, returning empty array');
        return res.json([]);
      }
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(categories || []);
  });
});

// Get single solution
app.get('/api/solutions/:id', (req, res) => {
  // Set no-cache headers to prevent browser caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { id } = req.params;
  db.get('SELECT * FROM solutions WHERE id = ?', [id], (err, solution) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!solution) {
      res.status(404).json({ error: 'Solution not found' });
      return;
    }
    res.json(solution);
  });
});

// Create new solution
app.post('/api/solutions', (req, res) => {
  const { name, description, category, color, border_color, route, enable_single_page = 1, redirect_url = null, icon = null } = req.body;

  const gradientColors = [
    { start: 'blue', end: 'blue-100' },
    { start: 'purple', end: 'purple-100' },
    { start: 'green', end: 'green-100' },
    { start: 'orange', end: 'orange-100' }
  ];

  db.get('SELECT MAX(order_index) as max_order, COUNT(*) as total_count FROM solutions', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || -1) + 1;
    const totalCount = result.total_count || 0;
    const gradientIndex = totalCount % gradientColors.length;
    const gradient = gradientColors[gradientIndex];

    db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index, gradient_start, gradient_end, enable_single_page, redirect_url, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category, color, border_color, route, nextOrder, gradient.start, gradient.end, enable_single_page, redirect_url, icon],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const newSolutionId = this.lastID;

        // Auto-create main solutions section
        createMainSolutionSection(newSolutionId, name, description, category, () => {
          res.json({
            message: 'Solution created successfully',
            id: newSolutionId,
            changes: this.changes,
            gradient: gradient
          });
        });
      });
  });
});

// Update solution
app.put('/api/solutions/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, color, border_color, route, gradient_start, gradient_end, enable_single_page, redirect_url, icon } = req.body;

  db.run(`UPDATE solutions SET 
    name = ?, 
    description = ?, 
    category = ?, 
    color = ?, 
    border_color = ?, 
    route = COALESCE(?, route),
    gradient_start = COALESCE(?, gradient_start),
    gradient_end = COALESCE(?, gradient_end),
    enable_single_page = COALESCE(?, enable_single_page),
    redirect_url = ?,
    icon = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [name, description, category, color, border_color, route, gradient_start, gradient_end, enable_single_page, redirect_url, icon, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      db.run(`UPDATE main_solutions_sections SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        updated_at = CURRENT_TIMESTAMP
        WHERE solution_id = ?`,
        [name, description, category, id],
        function (updateErr) {
          if (updateErr) {
            console.error('Error updating main_solutions_sections:', updateErr);
          }
          res.json({ message: 'Solution updated successfully', changes: this.changes });
        });
    });
});

// Delete solution
app.delete('/api/solutions/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM solution_items WHERE section_id IN (SELECT id FROM solution_sections WHERE solution_id = ?)`, [id], (err) => {
    if (err) {
      console.error('Error deleting solution items:', err.message);
    }

    db.run(`DELETE FROM solution_sections WHERE solution_id = ?`, [id], (err) => {
      if (err) {
        console.error('Error deleting solution sections:', err.message);
      }

      // Also delete from main_solutions_sections
      db.run(`DELETE FROM main_solutions_sections WHERE solution_id = ?`, [id], (err) => {
        if (err) {
          console.error('Error deleting main_solutions_sections entry:', err.message);
        }

        db.run(`DELETE FROM solutions WHERE id = ?`, [id], function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'Solution deleted successfully', changes: this.changes });
        });
      });
    });
  });
});

// Toggle solution visibility
app.put('/api/solutions/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;

  db.get('SELECT is_visible FROM solutions WHERE id = ?', [id], (err, solution) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!solution) {
      res.status(404).json({ error: 'Solution not found' });
      return;
    }

    const newVisibility = solution.is_visible ? 0 : 1;

    db.run('UPDATE solutions SET is_visible = ? WHERE id = ?', [newVisibility, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: `Solution ${newVisibility ? 'shown' : 'hidden'} successfully`,
        is_visible: newVisibility,
        changes: this.changes
      });
    });
  });
});

// Duplicate solution
app.post('/api/solutions/:id/duplicate', async (req, res) => {
  console.log('[DUPLICATE] ========== ENDPOINT HIT ==========');
  console.log('[DUPLICATE] Request params:', req.params);
  console.log('[DUPLICATE] Request body:', req.body);

  // Set a longer timeout for this operation
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000);

  try {
    const { id } = req.params;
    const { newName, newRoute, name } = req.body;

    console.log(`[DUPLICATE] Starting duplication for solution ID: ${id}`);
    console.log(`[DUPLICATE] Request body:`, { newName, newRoute, name });

    db.get('SELECT * FROM solutions WHERE id = ?', [id], (err, originalSolution) => {
      if (err) {
        console.error('[DUPLICATE] Error fetching solution:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      if (!originalSolution) {
        console.error('[DUPLICATE] Solution not found:', id);
        if (!res.headersSent) {
          res.status(404).json({ error: 'Solution not found' });
        }
        return;
      }

      console.log(`[DUPLICATE] Found solution: ${originalSolution.name}`);

      db.get('SELECT MAX(order_index) as max_order FROM solutions', (err, result) => {
        if (err) {
          console.error('[DUPLICATE] Error getting max order:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: err.message });
          }
          return;
        }

        const nextOrder = (result.max_order || -1) + 1;
        const duplicateName = newName || name || `${originalSolution.name} (Copy)`;
        const tempRoute = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log(`[DUPLICATE] Creating new solution with name: ${duplicateName}, order: ${nextOrder}`);

        db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index, gradient_start, gradient_end, enable_single_page, redirect_url, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [duplicateName, originalSolution.description, originalSolution.category, originalSolution.color, originalSolution.border_color, tempRoute, nextOrder, originalSolution.gradient_start, originalSolution.gradient_end, originalSolution.enable_single_page, originalSolution.redirect_url, originalSolution.icon],
          function (err) {
            if (err) {
              console.error('[DUPLICATE] Error inserting new solution:', err);
              if (!res.headersSent) {
                res.status(500).json({ error: err.message });
              }
              return;
            }

            const newSolutionId = this.lastID;

            // Generate slug-based route from the solution name
            const slug = duplicateName.toLowerCase()
              .trim()
              .replace(/\s+/g, '-')           // Replace spaces with hyphens
              .replace(/[^a-z0-9-]/g, '')     // Remove special characters
              .replace(/--+/g, '-')           // Replace multiple hyphens with single
              .replace(/^-+|-+$/g, '');       // Trim hyphens from start/end

            const correctRoute = `/solutions/${slug}`;

            console.log(`[DUPLICATE] New solution created with ID: ${newSolutionId}`);
            console.log(`[DUPLICATE] Generated route: ${correctRoute} from name: ${duplicateName}`);

            db.run(`UPDATE solutions SET route = ? WHERE id = ?`, [correctRoute, newSolutionId], (updateErr) => {
              if (updateErr) {
                console.error('[DUPLICATE] Error updating route:', updateErr.message);
              } else {
                console.log(`[DUPLICATE] Route updated successfully to: ${correctRoute}`);
              }

              console.log(`[DUPLICATE] Fetching sections for original solution ${id}`);

              // Duplicate all sections
              db.all('SELECT * FROM solution_sections WHERE solution_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
                if (err) {
                  console.error('[DUPLICATE] Error fetching sections:', err.message);
                  if (!res.headersSent) {
                    res.json({
                      message: 'Solution duplicated successfully (sections could not be duplicated)',
                      id: newSolutionId
                    });
                  }
                  return;
                }

                console.log(`[DUPLICATE] Found ${sections.length} sections to duplicate`);

                if (sections.length === 0) {
                  if (!res.headersSent) {
                    res.json({
                      message: 'Solution duplicated successfully',
                      id: newSolutionId
                    });
                  }
                  return;
                }

                const sectionIdMap = new Map();
                let completed = 0;
                const total = sections.length;
                let hasError = false;

                sections.forEach((section, index) => {
                  console.log(`[DUPLICATE] Duplicating section ${index + 1}/${total}: ${section.section_type}`);

                  db.run(`INSERT INTO solution_sections (solution_id, section_type, title, description, content, order_index, is_visible, media_type, media_source, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [newSolutionId, section.section_type, section.title || null, section.description || null, section.content || null, section.order_index || 0, section.is_visible !== undefined ? section.is_visible : 1, section.media_type || null, section.media_source || null, section.media_url || null],
                    function (err) {
                      if (err) {
                        console.error('[DUPLICATE] Error duplicating section:', err.message);
                        console.error('[DUPLICATE] Section data:', JSON.stringify(section, null, 2));
                        hasError = true;
                      } else {
                        sectionIdMap.set(section.id, this.lastID);
                        console.log(`[DUPLICATE] Section duplicated: ${section.id} -> ${this.lastID}`);
                      }

                      completed++;
                      if (completed === total) {
                        console.log(`[DUPLICATE] All ${total} sections processed, now duplicating items...`);
                        // Duplicate section items
                        try {
                          duplicateSolutionItems(id, sectionIdMap, newSolutionId, duplicateName, originalSolution, res);
                        } catch (itemErr) {
                          console.error('[DUPLICATE] Error in duplicateSolutionItems:', itemErr);
                          if (!res.headersSent) {
                            res.status(500).json({ error: itemErr.message || 'Error duplicating items' });
                          }
                        }
                      }
                    });
                });
              });
            });
          });
      });
    });
  } catch (error) {
    console.error('[DUPLICATE] Unhandled error:', error);
    console.error('[DUPLICATE] Error stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
});

// Helper function to duplicate solution items
function duplicateSolutionItems(originalSolutionId, sectionIdMap, newSolutionId, duplicateName, originalSolution, res) {
  try {
    // Prevent multiple responses
    let responseSent = false;
    let responseTimeout = null;

    const sendResponse = (data) => {
      if (responseTimeout) {
        clearTimeout(responseTimeout);
        responseTimeout = null;
      }
      if (!responseSent && !res.headersSent) {
        responseSent = true;
        console.log('[DUPLICATE] Sending final response:', data);
        res.json(data);
      } else {
        console.log('[DUPLICATE] Response already sent, skipping duplicate response');
      }
    };

    // Safety timeout - send response after 30 seconds if nothing else does
    responseTimeout = setTimeout(() => {
      if (!responseSent && !res.headersSent) {
        console.log('[DUPLICATE] Timeout reached, sending response anyway');
        sendResponse({
          message: 'Solution duplication completed (timeout)',
          id: newSolutionId
        });
      }
    }, 30000);

    console.log(`[DUPLICATE] Starting item duplication for solution ${newSolutionId}`);
    console.log(`[DUPLICATE] Section ID map size: ${sectionIdMap.size}`);

    const originalSectionIds = Array.from(sectionIdMap.keys());
    if (originalSectionIds.length === 0) {
      console.log('[DUPLICATE] No sections to duplicate items from');
      try {
        createMainSolutionSection(newSolutionId, duplicateName, originalSolution.description, originalSolution.category, () => {
          sendResponse({
            message: 'Solution duplicated successfully',
            id: newSolutionId
          });
        });
      } catch (err) {
        console.error('[DUPLICATE] Error creating main solution section:', err);
        sendResponse({
          message: 'Solution duplicated (main section creation failed)',
          id: newSolutionId
        });
      }
      return;
    }

    const placeholders = originalSectionIds.map(() => '?').join(',');
    console.log(`[DUPLICATE] Querying items for ${originalSectionIds.length} sections`);

    db.all(`SELECT * FROM solution_items WHERE section_id IN (${placeholders}) ORDER BY section_id, order_index`, originalSectionIds, (err, items) => {
      if (err) {
        console.error('[DUPLICATE] Error fetching solution items:', err.message);
        sendResponse({
          message: 'Solution duplicated successfully (items could not be duplicated)',
          id: newSolutionId
        });
        return;
      }

      console.log(`[DUPLICATE] Found ${items.length} items to duplicate`);

      if (items.length === 0) {
        console.log('[DUPLICATE] No items to duplicate');
        try {
          createMainSolutionSection(newSolutionId, duplicateName, originalSolution.description, originalSolution.category, () => {
            sendResponse({
              message: 'Solution duplicated successfully',
              id: newSolutionId
            });
          });
        } catch (err) {
          console.error('[DUPLICATE] Error creating main solution section:', err);
          sendResponse({
            message: 'Solution duplicated (main section creation failed)',
            id: newSolutionId
          });
        }
        return;
      }

      let completed = 0;
      const total = items.length;

      items.forEach((item, index) => {
        const newSectionId = sectionIdMap.get(item.section_id);
        if (!newSectionId) {
          console.log(`[DUPLICATE] Warning: No new section ID found for original section ${item.section_id}`);
          completed++;
          if (completed === total) {
            try {
              createMainSolutionSection(newSolutionId, duplicateName, originalSolution.description, originalSolution.category, () => {
                sendResponse({
                  message: 'Solution duplicated successfully',
                  id: newSolutionId
                });
              });
            } catch (err) {
              console.error('[DUPLICATE] Error creating main solution section:', err);
              sendResponse({
                message: 'Solution duplicated (main section creation failed)',
                id: newSolutionId
              });
            }
          }
          return;
        }

        console.log(`[DUPLICATE] Duplicating item ${index + 1}/${total}: ${item.item_type || 'unknown'}`);

        db.run(`INSERT INTO solution_items (section_id, item_type, title, description, icon, value, label, features, order_index, content, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newSectionId, item.item_type || null, item.title || null, item.description || null, item.icon || null, item.value || null, item.label || null, item.features || null, item.order_index || 0, item.content || null, item.is_visible !== undefined ? item.is_visible : 1],
          function (err) {
            if (err) {
              console.error('[DUPLICATE] Error duplicating item:', err.message);
              console.error('[DUPLICATE] Item data:', JSON.stringify(item, null, 2));
            } else {
              console.log(`[DUPLICATE] Item ${index + 1} duplicated successfully`);
            }

            completed++;
            if (completed === total) {
              console.log(`[DUPLICATE] All ${total} items processed, creating main section...`);
              // Create main solutions section for duplicated solution
              try {
                createMainSolutionSection(newSolutionId, duplicateName, originalSolution.description, originalSolution.category, () => {
                  console.log(`[DUPLICATE] Solution ${newSolutionId} duplicated successfully!`);
                  sendResponse({
                    message: 'Solution duplicated successfully',
                    id: newSolutionId
                  });
                });
              } catch (err) {
                console.error('[DUPLICATE] Error creating main solution section:', err);
                sendResponse({
                  message: 'Solution duplicated (main section creation failed)',
                  id: newSolutionId
                });
              }
            }
          });
      });
    });
  } catch (error) {
    console.error('[DUPLICATE] Error in duplicateSolutionItems:', error);
    console.error('[DUPLICATE] Error stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Error duplicating items' });
    }
  }
}

// Endpoint to sync existing solutions to main_solutions_sections
app.post('/api/main-solutions/sync', (req, res) => {
  console.log('Syncing existing solutions to main_solutions_sections...');
  db.all('SELECT id, name, description, category, is_visible FROM solutions WHERE is_visible = 1', (err, solutions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!solutions || solutions.length === 0) {
      res.json({ message: 'No visible solutions found', created: 0 });
      return;
    }

    let processed = 0;
    let created = 0;

    solutions.forEach((solution) => {
      db.get('SELECT id FROM main_solutions_sections WHERE solution_id = ?', [solution.id], (checkErr, existing) => {
        if (checkErr) {
          console.error(`Error checking main_solutions_sections for solution ${solution.id}:`, checkErr.message);
          processed++;
          if (processed === solutions.length) {
            res.json({ message: 'Sync completed', created: created, total: solutions.length });
          }
          return;
        }

        if (!existing) {
          // Create missing entry
          createMainSolutionSection(solution.id, solution.name, solution.description, solution.category, () => {
            created++;
            processed++;
            if (processed === solutions.length) {
              res.json({ message: 'Sync completed', created: created, total: solutions.length });
            }
          });
        } else {
          processed++;
          if (processed === solutions.length) {
            res.json({ message: 'Sync completed', created: created, total: solutions.length });
          }
        }
      });
    });
  });
});

// Get main solutions page content
app.get('/api/main-solutions', (req, res) => {
  const mainPageData = {};
  const { all } = req.query;

  db.get('SELECT * FROM main_solutions_content WHERE id = 1', (err, heroContent) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    mainPageData.hero = heroContent || {
      title: 'Our Solutions',
      subtitle: 'Cloud Solutions - Made in India',
      description: 'Explore our comprehensive cloud solutions designed to transform your business operations.'
    };

    const sectionsQuery = all === 'true'
      ? `
        SELECT 
          mss.*, 
          COALESCE(s.name, mss.title) as solution_name, 
          COALESCE(s.description, mss.description) as solution_description,
          COALESCE(mss.category, s.category) as category
        FROM main_solutions_sections mss
        LEFT JOIN solutions s ON mss.solution_id = s.id
        WHERE (mss.solution_id IS NULL AND mss.id IS NOT NULL) OR (mss.solution_id IS NOT NULL AND s.id IS NOT NULL)
        ORDER BY mss.order_index ASC
      `
      : `
        SELECT 
          mss.*, 
          COALESCE(s.name, mss.title) as solution_name, 
          COALESCE(s.description, mss.description) as solution_description,
          COALESCE(mss.category, s.category) as category
        FROM main_solutions_sections mss
        LEFT JOIN solutions s ON mss.solution_id = s.id
        WHERE mss.is_visible = 1 AND (mss.solution_id IS NULL OR s.is_visible = 1)
        ORDER BY mss.order_index ASC
      `;

    db.all(sectionsQuery, (err, sections) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const parsedSections = (sections || []).map(section => ({
        ...section,
        features: (() => {
          try {
            return typeof section.features === 'string' ? JSON.parse(section.features) : (section.features || []);
          } catch (e) {
            return [];
          }
        })()
      }));

      mainPageData.sections = parsedSections;
      res.json(mainPageData);
    });
  });
});

// Add main solutions content columns if they don't exist
function addMainSolutionsContentColumns() {
  const columnsToAdd = [
    'stat1_label TEXT DEFAULT "Global Customers"',
    'stat1_value TEXT DEFAULT "10K+"',
    'stat2_label TEXT DEFAULT "Uptime SLA"',
    'stat2_value TEXT DEFAULT "99.9%"',
    'stat3_label TEXT DEFAULT "Data Centers"',
    'stat3_value TEXT DEFAULT "15+"',
    'stat4_label TEXT DEFAULT "Support Rating"',
    'stat4_value TEXT DEFAULT "4.9★"'
  ];

  columnsToAdd.forEach(column => {
    const columnName = column.split(' ')[0];
    db.run(`ALTER TABLE main_solutions_content ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName} to main_solutions_content:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${columnName} to main_solutions_content`);
      }
    });
  });
}

// Update main solutions page hero content
app.put('/api/main-solutions/hero', (req, res) => {
  const {
    title,
    subtitle,
    description,
    stat1_label,
    stat1_value,
    stat2_label,
    stat2_value,
    stat3_label,
    stat3_value,
    stat4_label,
    stat4_value
  } = req.body;

  addMainSolutionsContentColumns();

  db.get('SELECT * FROM main_solutions_content WHERE id = 1', (err, existing) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (existing) {
      db.run(`
        UPDATE main_solutions_content 
        SET title = ?, subtitle = ?, description = ?, 
            stat1_label = ?, stat1_value = ?, stat2_label = ?, stat2_value = ?,
            stat3_label = ?, stat3_value = ?, stat4_label = ?, stat4_value = ?,
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = 1
      `, [
        title, subtitle, description,
        stat1_label, stat1_value, stat2_label, stat2_value,
        stat3_label, stat3_value, stat4_label, stat4_value
      ], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Main solutions hero content updated successfully' });
      });
    } else {
      db.run(`
        INSERT INTO main_solutions_content (
          id, title, subtitle, description,
          stat1_label, stat1_value, stat2_label, stat2_value,
          stat3_label, stat3_value, stat4_label, stat4_value
        ) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        title, subtitle, description,
        stat1_label, stat1_value, stat2_label, stat2_value,
        stat3_label, stat3_value, stat4_label, stat4_value
      ], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Main solutions hero content created successfully' });
      });
    }
  });
});

// Add columns to main_solutions_sections if they don't exist
function addMainSolutionsSectionsColumns() {
  const columnsToAdd = [
    'popular_tag TEXT',
    'category TEXT',
    'features TEXT',
    'price TEXT',
    'price_period TEXT',
    'free_trial_tag TEXT',
    'button_text TEXT DEFAULT "Explore Solution"'
  ];

  columnsToAdd.forEach(column => {
    const columnName = column.split(' ')[0];
    db.run(`ALTER TABLE main_solutions_sections ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName} to main_solutions_sections:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${columnName} to main_solutions_sections`);
      }
    });
  });

  // Set default values for existing records
  db.run(`
    UPDATE main_solutions_sections 
    SET 
      popular_tag = CASE WHEN popular_tag IS NULL THEN 'Most Popular' ELSE popular_tag END,
      features = CASE WHEN features IS NULL THEN '[]' ELSE features END,
      price = CASE WHEN price IS NULL THEN '₹2,999' ELSE price END,
      price_period = CASE WHEN price_period IS NULL THEN '/month' ELSE price_period END,
      free_trial_tag = CASE WHEN free_trial_tag IS NULL THEN 'Free Trial' ELSE free_trial_tag END,
      button_text = CASE WHEN button_text IS NULL THEN 'Explore Solution' ELSE button_text END
  `, (err) => {
    if (err) {
      console.error('Error setting default values for main_solutions_sections:', err.message);
    } else {
      console.log('✅ Set default values for main_solutions_sections');
    }
  });
}

// Update main solutions section
app.put('/api/main-solutions/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;
  const {
    title,
    description,
    is_visible,
    order_index,
    popular_tag,
    category,
    features,
    price,
    price_period,
    free_trial_tag,
    button_text
  } = req.body;

  addMainSolutionsSectionsColumns();

  const featuresJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');

  db.run(`
    UPDATE main_solutions_sections 
    SET 
      title = ?, 
      description = ?, 
      is_visible = ?, 
      order_index = ?,
      popular_tag = ?,
      category = ?,
      features = ?,
      price = ?,
      price_period = ?,
      free_trial_tag = ?,
      button_text = ?,
      updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `, [
    title,
    description,
    is_visible,
    order_index || 0,
    popular_tag || null,
    category || null,
    featuresJson,
    price || null,
    price_period || null,
    free_trial_tag || null,
    button_text || null,
    sectionId
  ], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Main solutions section updated successfully', changes: this.changes });
  });
});

// Get all main solutions sections (including hidden ones for admin)
app.get('/api/main-solutions/sections/all', (req, res) => {
  db.all(`
    SELECT 
      mss.*, 
      COALESCE(s.name, mss.title) as solution_name, 
      COALESCE(s.description, mss.description) as solution_description,
      COALESCE(mss.category, s.category) as category
    FROM main_solutions_sections mss
    LEFT JOIN solutions s ON mss.solution_id = s.id
    ORDER BY mss.order_index ASC
  `, (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const parsedSections = sections.map(section => ({
      ...section,
      features: (() => {
        try {
          return typeof section.features === 'string' ? JSON.parse(section.features) : (section.features || []);
        } catch (e) {
          return [];
        }
      })()
    }));

    res.json(parsedSections || []);
  });
});

// Duplicate main solutions section
app.post('/api/main-solutions/sections/:sectionId/duplicate', (req, res) => {
  const { sectionId } = req.params;

  db.get(`
    SELECT 
      mss.*, 
      COALESCE(s.name, mss.title) as solution_name, 
      COALESCE(s.description, mss.description) as solution_description
    FROM main_solutions_sections mss
    LEFT JOIN solutions s ON mss.solution_id = s.id
    WHERE mss.id = ?
  `, [sectionId], (err, originalSection) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!originalSection) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    db.get('SELECT MAX(order_index) as max_order FROM main_solutions_sections', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const nextOrder = (result.max_order || 0) + 1;

      db.run(`
        INSERT INTO main_solutions_sections (
          solution_id, title, description, is_visible, order_index,
          popular_tag, category, features, price, price_period, free_trial_tag, button_text
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        originalSection.solution_id,
        `${originalSection.title} (Copy)`,
        originalSection.description,
        originalSection.is_visible,
        nextOrder,
        originalSection.popular_tag,
        originalSection.category,
        originalSection.features,
        originalSection.price,
        originalSection.price_period,
        originalSection.free_trial_tag,
        originalSection.button_text
      ], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Section duplicated successfully', id: this.lastID });
      });
    });
  });
});

// Delete main solutions section
app.delete('/api/main-solutions/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;

  db.run('DELETE FROM main_solutions_sections WHERE id = ?', [sectionId], function (err) {
    if (err) {
      console.error('Error deleting section:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section deleted successfully', changes: this.changes });
  });
});

// Toggle main solutions section visibility
app.patch('/api/main-solutions/sections/:sectionId/toggle-visibility', (req, res) => {
  const { sectionId } = req.params;

  db.get('SELECT is_visible FROM main_solutions_sections WHERE id = ?', [sectionId], (err, section) => {
    if (err) {
      console.error('Error getting section visibility:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }

    const newVisibility = section.is_visible ? 0 : 1;

    db.run('UPDATE main_solutions_sections SET is_visible = ? WHERE id = ?', [newVisibility, sectionId], function (err) {
      if (err) {
        console.error('Error toggling section visibility:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: `Section ${newVisibility ? 'shown' : 'hidden'} successfully`,
        is_visible: newVisibility,
        changes: this.changes
      });
    });
  });
});

// Create new main solutions section
app.post('/api/main-solutions/sections', (req, res) => {
  const {
    title,
    description,
    is_visible,
    popular_tag,
    category,
    features,
    price,
    price_period,
    free_trial_tag,
    button_text
  } = req.body;

  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  addMainSolutionsSectionsColumns();

  db.get('SELECT MAX(order_index) as max_order FROM main_solutions_sections', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nextOrder = (result.max_order || 0) + 1;
    const featuresJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');

    db.run(`
      INSERT INTO main_solutions_sections (
        solution_id, title, description, is_visible, order_index,
        popular_tag, category, features, price, price_period, free_trial_tag, button_text
      ) 
      VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || '',
      is_visible !== undefined ? is_visible : 1,
      nextOrder,
      popular_tag || null,
      category || null,
      featuresJson,
      price || null,
      price_period || null,
      free_trial_tag || null,
      button_text || null
    ], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Section created successfully', id: this.lastID });
    });
  });
});

// ========== SOLUTION SECTIONS API ENDPOINTS ==========

// Get all sections for a solution
app.get('/api/solutions/:id/sections', (req, res) => {
  // Set no-cache headers to prevent browser caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { id } = req.params;
  db.all('SELECT * FROM solution_sections WHERE solution_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(sections);
  });
});

// Get single solution section
app.get('/api/solutions/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  db.get('SELECT * FROM solution_sections WHERE id = ? AND solution_id = ?', [sectionId, id], (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Section not found' });
      return;
    }
    res.json(section);
  });
});

// Get solution by route
app.get('/api/solutions/by-route/:route', (req, res) => {
  // Set no-cache headers to prevent browser caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  let { route } = req.params;
  // Handle both full route (/solutions/startups-cloud) and slug (startups-cloud)
  if (!route.startsWith('/')) {
    route = `/solutions/${route}`;
  }
  db.get('SELECT * FROM solutions WHERE route = ? AND is_visible = 1', [route], (err, solution) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!solution) {
      res.status(404).json({ error: 'Solution not found' });
      return;
    }
    res.json(solution);
  });
});

// Get solution sections by route
app.get('/api/solutions/by-route/:route/sections', (req, res) => {
  // Set no-cache headers to prevent browser caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  let { route } = req.params;
  // Handle both full route (/solutions/startups-cloud) and slug (startups-cloud)
  if (!route.startsWith('/')) {
    route = `/solutions/${route}`;
  }

  // First get the solution ID from route
  db.get('SELECT id FROM solutions WHERE route = ? AND is_visible = 1', [route], (err, solution) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!solution) {
      res.status(404).json({ error: 'Solution not found' });
      return;
    }

    // Get sections for this solution
    db.all(`
      SELECT * FROM solution_sections 
      WHERE solution_id = ? 
      ORDER BY order_index ASC
    `, [solution.id], (err, sections) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(sections);
    });
  });
});

// Create new solution section
app.post('/api/solutions/:id/sections', (req, res) => {
  const { id } = req.params;
  const { section_type, title, description, content, media_type, media_source, media_url } = req.body;

  // Validate media fields if section_type is media_banner
  let finalMediaUrl = null;

  if (section_type === 'media_banner') {
    if (!media_type || (media_type !== 'video' && media_type !== 'image')) {
      return res.status(400).json({ error: 'media_type must be "video" or "image" for media_banner sections' });
    }

    if (!media_source || (media_source !== 'youtube' && media_source !== 'upload')) {
      return res.status(400).json({ error: 'media_source must be "youtube" or "upload" for media_banner sections' });
    }

    if (!media_url) {
      return res.status(400).json({ error: 'media_url is required for media_banner sections' });
    }

    // Validate YouTube URL if source is youtube
    if (media_source === 'youtube') {
      const youtubeValidation = validateYouTubeUrl(media_url);
      if (!youtubeValidation.valid) {
        return res.status(400).json({ error: youtubeValidation.error });
      }
      // Use the normalized embed URL
      finalMediaUrl = youtubeValidation.embedUrl;
    } else {
      finalMediaUrl = media_url;
    }
  } else {
    finalMediaUrl = media_url || null;
  }

  // Get the next order index
  db.get(`
    SELECT MAX(order_index) as max_order 
    FROM solution_sections 
    WHERE solution_id = ?
  `, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const finalOrderIndex = (result.max_order || -1) + 1;

    db.run(`INSERT INTO solution_sections (solution_id, section_type, title, description, content, order_index, media_type, media_source, media_url, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [id, section_type, title, description, content, finalOrderIndex, media_type || null, media_source || null, finalMediaUrl],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Section created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  });
});

// Update solution section
app.put('/api/solutions/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  const {
    section_type, title, description, content, order_index, is_visible,
    media_type, media_source, media_url,
    pricing_table_header_plan, pricing_table_header_specs, pricing_table_header_features,
    pricing_table_header_hourly, pricing_table_header_monthly, pricing_table_header_quarterly,
    pricing_table_header_yearly, pricing_table_header_action,
    show_hourly_column, show_monthly_column, show_quarterly_column, show_yearly_column
  } = req.body;

  // Build dynamic query based on provided fields
  let updateFields = [];
  let values = [];

  if (section_type !== undefined) {
    updateFields.push('section_type = ?');
    values.push(section_type);
  }
  if (title !== undefined) {
    updateFields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    values.push(description);
  }
  if (content !== undefined) {
    updateFields.push('content = ?');
    values.push(content);
  }
  if (order_index !== undefined) {
    updateFields.push('order_index = ?');
    values.push(order_index);
  }
  if (is_visible !== undefined) {
    updateFields.push('is_visible = ?');
    values.push(is_visible);
  }
  if (media_type !== undefined) {
    updateFields.push('media_type = ?');
    values.push(media_type);
  }
  if (media_source !== undefined) {
    updateFields.push('media_source = ?');
    values.push(media_source);
  }
  if (media_url !== undefined) {
    updateFields.push('media_url = ?');
    values.push(media_url);
  }
  // Update pricing table header fields if provided
  if (pricing_table_header_plan !== undefined) {
    updateFields.push('pricing_table_header_plan = ?');
    values.push(pricing_table_header_plan);
  }
  if (pricing_table_header_specs !== undefined) {
    updateFields.push('pricing_table_header_specs = ?');
    values.push(pricing_table_header_specs);
  }
  if (pricing_table_header_features !== undefined) {
    updateFields.push('pricing_table_header_features = ?');
    values.push(pricing_table_header_features);
  }
  if (pricing_table_header_hourly !== undefined) {
    updateFields.push('pricing_table_header_hourly = ?');
    values.push(pricing_table_header_hourly);
  }
  if (pricing_table_header_monthly !== undefined) {
    updateFields.push('pricing_table_header_monthly = ?');
    values.push(pricing_table_header_monthly);
  }
  if (pricing_table_header_quarterly !== undefined) {
    updateFields.push('pricing_table_header_quarterly = ?');
    values.push(pricing_table_header_quarterly);
  }
  if (pricing_table_header_yearly !== undefined) {
    updateFields.push('pricing_table_header_yearly = ?');
    values.push(pricing_table_header_yearly);
  }
  if (pricing_table_header_action !== undefined) {
    updateFields.push('pricing_table_header_action = ?');
    values.push(pricing_table_header_action);
  }
  // Update pricing column visibility fields if provided
  if (show_hourly_column !== undefined) {
    updateFields.push('show_hourly_column = ?');
    values.push(show_hourly_column ? 1 : 0);
  }
  if (show_monthly_column !== undefined) {
    updateFields.push('show_monthly_column = ?');
    values.push(show_monthly_column ? 1 : 0);
  }
  if (show_quarterly_column !== undefined) {
    updateFields.push('show_quarterly_column = ?');
    values.push(show_quarterly_column ? 1 : 0);
  }
  if (show_yearly_column !== undefined) {
    updateFields.push('show_yearly_column = ?');
    values.push(show_yearly_column ? 1 : 0);
  }

  // Always update updated_at
  updateFields.push('updated_at = CURRENT_TIMESTAMP');

  // Check if there are any fields to update
  if (updateFields.length === 1) {
    // Only updated_at, which means no actual fields were provided
    res.status(400).json({ error: 'No fields provided to update' });
    return;
  }

  values.push(sectionId, id);

  const query = `UPDATE solution_sections SET ${updateFields.join(', ')} WHERE id = ? AND solution_id = ?`;

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error updating solution section:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Section not found or no changes made' });
      return;
    }

    res.json({ message: 'Section updated successfully', changes: this.changes });
  });
});

// Delete solution section
app.delete('/api/solutions/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;

  db.run(`DELETE FROM solution_sections WHERE id = ? AND solution_id = ?`, [sectionId, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section deleted successfully', changes: this.changes });
  });
});

// ========== SOLUTION ITEMS API ENDPOINTS ==========

// Get all items for a specific solution section
app.get('/api/solutions/:id/sections/:sectionId/items', (req, res) => {
  // Set no-cache headers to prevent browser caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { sectionId } = req.params;
  db.all('SELECT * FROM solution_items WHERE section_id = ? ORDER BY order_index ASC', [sectionId], (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items);
  });
});

// Create new solution section item
app.post('/api/solutions/:id/sections/:sectionId/items', (req, res) => {
  const { id, sectionId } = req.params;
  const { item_type, title, description, icon, value, label, features, content } = req.body;

  // Get the next order index
  db.get(`
    SELECT MAX(order_index) as max_order 
    FROM solution_items 
    WHERE section_id = ?
  `, [sectionId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const finalOrderIndex = (result.max_order || -1) + 1;
    const featuresJson = features ? JSON.stringify(features) : null;

    db.run(`INSERT INTO solution_items (section_id, item_type, title, description, icon, value, label, features, content, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [sectionId, item_type, title, description, icon, value, label, featuresJson, content, finalOrderIndex],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Item created successfully',
          id: this.lastID,
          changes: this.changes
        });
      });
  });
});

// Update solution section item
app.put('/api/solutions/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { id, sectionId, itemId } = req.params;
  const { item_type, title, description, icon, value, label, features, content, is_visible, order_index } = req.body;

  // Build dynamic query
  let updateFields = [];
  let values = [];

  if (item_type !== undefined) {
    updateFields.push('item_type = ?');
    values.push(item_type);
  }
  if (title !== undefined) {
    updateFields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    values.push(description);
  }
  if (icon !== undefined) {
    updateFields.push('icon = ?');
    values.push(icon);
  }
  if (value !== undefined) {
    updateFields.push('value = ?');
    values.push(value);
  }
  if (label !== undefined) {
    updateFields.push('label = ?');
    values.push(label);
  }
  if (features !== undefined) {
    updateFields.push('features = ?');
    values.push(features ? JSON.stringify(features) : null);
  }
  if (content !== undefined) {
    updateFields.push('content = ?');
    values.push(content);
  }
  if (is_visible !== undefined) {
    updateFields.push('is_visible = ?');
    values.push(is_visible);
  }
  if (order_index !== undefined) {
    updateFields.push('order_index = ?');
    values.push(order_index);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(itemId, sectionId);

  const query = `UPDATE solution_items SET ${updateFields.join(', ')} WHERE id = ? AND section_id = ?`;

  db.run(query, values, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item updated successfully', changes: this.changes });
  });
});

// Delete solution section item
app.delete('/api/solutions/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { id, sectionId, itemId } = req.params;

  db.run(`DELETE FROM solution_items WHERE id = ? AND section_id = ?`, [itemId, sectionId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item deleted successfully', changes: this.changes });
  });
});

// ==================== Integrity Pages API Endpoints ====================

// Get all integrity pages
app.get('/api/integrity-pages', (req, res) => {
  const { all } = req.query;
  const showAll = all === 'true';

  const query = showAll
    ? 'SELECT * FROM integrity_pages ORDER BY id ASC'
    : 'SELECT * FROM integrity_pages WHERE is_visible = 1 ORDER BY id ASC';

  db.all(query, (err, pages) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(pages);
  });
});

// Get single integrity page by slug
app.get('/api/integrity-pages/:slug', (req, res) => {
  const { slug } = req.params;
  const { all } = req.query;
  const showAll = all === 'true';

  const query = showAll
    ? 'SELECT * FROM integrity_pages WHERE slug = ?'
    : 'SELECT * FROM integrity_pages WHERE slug = ? AND is_visible = 1';

  db.get(query, [slug], (err, page) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.json(page);
  });
});

// Create new integrity page
app.post('/api/integrity-pages', (req, res) => {
  const { slug, title, description, content, is_visible } = req.body;

  if (!slug || !title || !content) {
    res.status(400).json({ error: 'Slug, title, and content are required' });
    return;
  }

  db.run(`INSERT INTO integrity_pages (slug, title, description, content, is_visible) 
          VALUES (?, ?, ?, ?, ?)`,
    [slug, title, description || null, content, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          res.status(409).json({ error: 'Page with this slug already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      res.json({
        id: this.lastID,
        slug,
        title,
        description: description || null,
        content,
        is_visible: is_visible !== undefined ? is_visible : 1,
        message: 'Page created successfully'
      });
    });
});

// Update integrity page
app.put('/api/integrity-pages/:id', (req, res) => {
  const { id } = req.params;
  const { slug, title, description, content, is_visible, eyebrow } = req.body;

  console.log('🚀 ===== INTEGRITY PAGE UPDATE REQUEST =====');
  console.log('📥 Received update request for page ID:', id);
  console.log('📥 Request body:', { slug, title, description, content: content ? content.substring(0, 50) + '...' : null, is_visible, eyebrow });

  const updateFields = [];
  const values = [];

  if (slug !== undefined) {
    updateFields.push('slug = ?');
    values.push(slug);
  }
  if (title !== undefined) {
    updateFields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    // Always use the description value as-is (don't convert empty string to empty string)
    // If it's null, set to null; if it's empty string, set to empty string; otherwise use the value
    const descValue = description === null ? null : String(description);
    values.push(descValue);
    console.log('📝 Description update:', {
      original: description,
      type: typeof description,
      processed: descValue,
      length: descValue?.length
    });
  }
  if (eyebrow !== undefined) {
    updateFields.push('eyebrow = ?');
    // Allow empty strings, only set to null if explicitly null
    values.push(eyebrow === null ? null : (eyebrow || ''));
  }
  if (content !== undefined) {
    updateFields.push('content = ?');
    values.push(content);
  }
  if (is_visible !== undefined) {
    updateFields.push('is_visible = ?');
    values.push(is_visible);
  }

  if (updateFields.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE integrity_pages SET ${updateFields.join(', ')} WHERE id = ?`;

  console.log('🔧 Backend UPDATE query:', query);
  console.log('🔧 Backend UPDATE values:', values);

  // Execute the UPDATE query
  console.log('🔧 Executing UPDATE with query:', query);
  console.log('🔧 Values array:', JSON.stringify(values));
  console.log('🔧 Values count:', values.length);
  console.log('🔧 Placeholders in query:', (query.match(/\?/g) || []).length);

  db.run(query, values, function (err) {
    if (err) {
      console.error('❌ Backend UPDATE error:', err);
      console.error('❌ Error details:', err.message, err.stack);
      if (err.message.includes('UNIQUE constraint')) {
        res.status(409).json({ error: 'Page with this slug already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }

    console.log('✅ Backend UPDATE executed:', {
      changes: this.changes,
      lastID: this.lastID,
      'this.changes type': typeof this.changes
    });

    if (this.changes === 0) {
      console.warn('⚠️ Backend UPDATE: No rows changed - row might not exist');
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    // Verify the update by fetching the updated row immediately after UPDATE
    // Use a small delay to ensure SQLite has committed
    setTimeout(() => {
      db.get('SELECT id, slug, title, description, eyebrow, content FROM integrity_pages WHERE id = ?', [id], (verifyErr, updatedRow) => {
        if (verifyErr) {
          console.error('❌ Backend verification error:', verifyErr);
          res.json({ message: 'Page updated successfully', changes: this.changes, warning: 'Could not verify update' });
          return;
        }

        if (!updatedRow) {
          console.error('❌ Backend verification: Row not found after update!');
          res.json({ message: 'Page updated successfully', changes: this.changes, warning: 'Row not found after update' });
          return;
        }

        console.log('🔍 Backend verified updated row:', {
          id: updatedRow?.id,
          title: updatedRow?.title,
          description: updatedRow?.description,
          'description length': updatedRow?.description?.length,
          eyebrow: updatedRow?.eyebrow,
          'expected description': description,
          'description matches': updatedRow?.description === description,
          'description === check': updatedRow?.description === description,
          'description == check': updatedRow?.description == description
        });

        // If description doesn't match, log a detailed warning
        if (description !== undefined && updatedRow?.description !== description) {
          console.error('⚠️⚠️⚠️ CRITICAL: Description mismatch after update! ⚠️⚠️⚠️');
          console.error('  Sent description:', JSON.stringify(description));
          console.error('  Stored description:', JSON.stringify(updatedRow?.description));
          console.error('  Sent length:', description?.length);
          console.error('  Stored length:', updatedRow?.description?.length);
          console.error('  Sent type:', typeof description);
          console.error('  Stored type:', typeof updatedRow?.description);
          console.error('  Query was:', query);
          console.error('  Values were:', JSON.stringify(values));

          // Try to update again directly to see if it works
          db.run('UPDATE integrity_pages SET description = ? WHERE id = ?', [description, id], function (retryErr) {
            if (retryErr) {
              console.error('  Retry UPDATE also failed:', retryErr);
            } else {
              console.log('  Retry UPDATE succeeded:', { changes: this.changes });
              // Fetch again to verify
              db.get('SELECT description FROM integrity_pages WHERE id = ?', [id], (retryVerifyErr, retryRow) => {
                if (retryVerifyErr) {
                  console.error('  Retry verification failed:', retryVerifyErr);
                } else {
                  console.log('  Retry verification - description now:', JSON.stringify(retryRow?.description));
                }
              });
            }
          });
        }

        res.json({
          message: 'Page updated successfully',
          changes: this.changes,
          updated: updatedRow,
          descriptionMatch: updatedRow?.description === description
        });
      });
    }, 50);
  });
});

// Delete integrity page
app.delete('/api/integrity-pages/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM integrity_pages WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.json({ message: 'Page deleted successfully', changes: this.changes });
  });
});

// Toggle integrity page visibility
app.put('/api/integrity-pages/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;

  db.get('SELECT is_visible FROM integrity_pages WHERE id = ?', [id], (err, page) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const newVisibility = page.is_visible === 1 ? 0 : 1;

    db.run('UPDATE integrity_pages SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: 'Visibility toggled successfully',
          is_visible: newVisibility,
          changes: this.changes
        });
      });
  });
});

// Duplicate integrity page
app.post('/api/integrity-pages/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const { slug, title } = req.body;

  // Get original page
  db.get('SELECT * FROM integrity_pages WHERE id = ?', [id], (err, originalPage) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!originalPage) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    // Check if slug already exists
    const newSlug = slug || `${originalPage.slug}-copy`;
    const newTitle = title || `${originalPage.title} (Copy)`;

    db.get('SELECT id FROM integrity_pages WHERE slug = ?', [newSlug], (err, existing) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (existing) {
        res.status(409).json({ error: 'Page with this slug already exists' });
        return;
      }

      // Create duplicate
      db.run(`INSERT INTO integrity_pages (slug, title, description, content, is_visible) 
              VALUES (?, ?, ?, ?, ?)`,
        [newSlug, newTitle, originalPage.description || null, originalPage.content, 0], // Default to hidden
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({
            id: this.lastID,
            slug: newSlug,
            title: newTitle,
            message: 'Page duplicated successfully'
          });
        });
    });
  });
});

// ============================================
// CONTACT US PAGE API ENDPOINTS
// ============================================

// Get all contact page content
app.get('/api/contact', (req, res) => {
  const { all } = req.query;
  const showAll = all === 'true';
  const contactData = {};

  // Get hero section
  db.get('SELECT * FROM contact_hero_section WHERE id = 1', (err, hero) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    contactData.hero = hero || {};

    // Get contact info items
    const itemsQuery = showAll
      ? 'SELECT * FROM contact_info_items ORDER BY order_index ASC'
      : 'SELECT * FROM contact_info_items WHERE is_visible = 1 ORDER BY order_index ASC';

    db.all(itemsQuery, (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      contactData.items = items || [];

      // Get social media links
      const socialLinksQuery = showAll
        ? 'SELECT * FROM contact_social_links ORDER BY order_index ASC'
        : 'SELECT * FROM contact_social_links WHERE is_visible = 1 ORDER BY order_index ASC';

      db.all(socialLinksQuery, (err, socialLinks) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        contactData.socialLinks = socialLinks || [];
        res.json(contactData);
      });
    });
  });
});

// Update hero section
app.put('/api/contact/hero', (req, res) => {
  const {
    title, highlighted_text, description,
    contact_section_title, contact_section_description,
    form_section_title, follow_us_title,
    map_section_title, map_office_name,
    map_address_line1, map_address_line2, map_address_line3, map_url,
    success_message, phone_verification_text
  } = req.body;

  db.run(`UPDATE contact_hero_section SET 
    title = COALESCE(?, title),
    highlighted_text = COALESCE(?, highlighted_text),
    description = COALESCE(?, description),
    contact_section_title = COALESCE(?, contact_section_title),
    contact_section_description = COALESCE(?, contact_section_description),
    form_section_title = COALESCE(?, form_section_title),
    follow_us_title = COALESCE(?, follow_us_title),
    map_section_title = COALESCE(?, map_section_title),
    map_office_name = COALESCE(?, map_office_name),
    map_address_line1 = COALESCE(?, map_address_line1),
    map_address_line2 = COALESCE(?, map_address_line2),
    map_address_line3 = COALESCE(?, map_address_line3),
    map_url = COALESCE(?, map_url),
    success_message = COALESCE(?, success_message),
    phone_verification_text = COALESCE(?, phone_verification_text),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`,
    [title, highlighted_text, description,
      contact_section_title, contact_section_description,
      form_section_title, follow_us_title,
      map_section_title, map_office_name,
      map_address_line1, map_address_line2, map_address_line3, map_url,
      success_message, phone_verification_text],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        // Insert if doesn't exist
        db.run(`INSERT INTO contact_hero_section (id, title, highlighted_text, description) VALUES (1, ?, ?, ?)`,
          [title || 'Get in Touch', highlighted_text || 'Touch', description || 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            res.json({ message: 'Hero section created successfully', id: this.lastID });
          });
      } else {
        res.json({ message: 'Hero section updated successfully', changes: this.changes });
      }
    });
});

// Get all contact info items
app.get('/api/contact/items', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM contact_info_items ORDER BY order_index ASC'
    : 'SELECT * FROM contact_info_items WHERE is_visible = 1 ORDER BY order_index ASC';
  db.all(query, (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items || []);
  });
});

// Create contact info item
app.post('/api/contact/items', (req, res) => {
  const { icon_type, title, content, sub_content, order_index, is_visible } = req.body;
  db.run(`INSERT INTO contact_info_items (icon_type, title, content, sub_content, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?)`,
    [icon_type || 'map', title, content, sub_content || null, order_index || 0, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Contact info item created successfully' });
    });
});

// Update contact info item
app.put('/api/contact/items/:id', (req, res) => {
  const { id } = req.params;
  const { icon_type, title, content, sub_content, order_index, is_visible } = req.body;
  db.run(`UPDATE contact_info_items SET 
    icon_type = COALESCE(?, icon_type),
    title = COALESCE(?, title),
    content = COALESCE(?, content),
    sub_content = COALESCE(?, sub_content),
    order_index = COALESCE(?, order_index),
    is_visible = COALESCE(?, is_visible),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [icon_type, title, content, sub_content, order_index, is_visible, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Contact info item updated successfully', changes: this.changes });
    });
});

// Delete contact info item
app.delete('/api/contact/items/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM contact_info_items WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Contact info item deleted successfully', changes: this.changes });
  });
});

// Toggle contact info item visibility
app.put('/api/contact/items/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  db.get('SELECT is_visible FROM contact_info_items WHERE id = ?', [id], (err, item) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!item) {
      res.status(404).json({ error: 'Contact info item not found' });
      return;
    }
    const newVisibility = item.is_visible === 1 ? 0 : 1;
    db.run('UPDATE contact_info_items SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

// Social Media Links Endpoints
// Get all social media links
app.get('/api/contact/social-links', (req, res) => {
  const { all } = req.query;
  const query = all === 'true'
    ? 'SELECT * FROM contact_social_links ORDER BY order_index ASC'
    : 'SELECT * FROM contact_social_links WHERE is_visible = 1 ORDER BY order_index ASC';
  db.all(query, (err, links) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(links || []);
  });
});

// Update social media link
app.put('/api/contact/social-links/:id', (req, res) => {
  const { id } = req.params;
  const { platform, url, icon_name, order_index, is_visible } = req.body;
  db.run(`UPDATE contact_social_links SET 
    platform = COALESCE(?, platform),
    url = COALESCE(?, url),
    icon_name = COALESCE(?, icon_name),
    order_index = COALESCE(?, order_index),
    is_visible = COALESCE(?, is_visible),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [platform, url, icon_name, order_index, is_visible, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Social media link updated successfully', changes: this.changes });
    });
});

// Create social media link
app.post('/api/contact/social-links', (req, res) => {
  const { platform, url, icon_name, order_index, is_visible } = req.body;
  db.run(`INSERT INTO contact_social_links (platform, url, icon_name, order_index, is_visible) VALUES (?, ?, ?, ?, ?)`,
    [platform, url, icon_name || platform, order_index || 0, is_visible !== undefined ? is_visible : 1],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Social media link created successfully' });
    });
});

// Delete social media link
app.delete('/api/contact/social-links/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM contact_social_links WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Social media link deleted successfully', changes: this.changes });
  });
});

// Toggle social media link visibility
app.put('/api/contact/social-links/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  db.get('SELECT is_visible FROM contact_social_links WHERE id = ?', [id], (err, link) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!link) {
      res.status(404).json({ error: 'Social media link not found' });
      return;
    }
    const newVisibility = link.is_visible === 1 ? 0 : 1;
    db.run('UPDATE contact_social_links SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newVisibility, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Visibility toggled successfully', is_visible: newVisibility });
      });
  });
});

// ============================================
// CONTACT FORM SUBMISSIONS API ENDPOINTS
// ============================================

// Submit contact form (only verified submissions)
app.post('/api/contact/submit', (req, res) => {
  const { name, email, phone, subject, message, phone_verified, verification_timestamp, ip_address, user_agent } = req.body;

  // Only accept verified submissions
  if (!phone_verified) {
    res.status(400).json({ error: 'Phone number must be verified before submission' });
    return;
  }

  db.run(`INSERT INTO contact_submissions 
    (name, email, phone, subject, message, phone_verified, verification_timestamp, ip_address, user_agent, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'leads')`,
    [name, email, phone, subject, message, phone_verified ? 1 : 0, verification_timestamp, ip_address, user_agent],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        message: 'Contact form submitted successfully',
        submission_id: this.lastID
      });
    });
});

// Get all contact submissions with filters
app.get('/api/contact/submissions', (req, res) => {
  const {
    status,
    page = 1,
    limit = 20,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    priority,
    source,
    followUpFilter,
    assigned_to
  } = req.query;

  let query = 'SELECT * FROM contact_submissions WHERE 1=1';
  const params = [];

  // Status filter
  if (status && status !== 'all') {
    // Handle 'closed' which includes both not_interested and lost
    if (status === 'closed') {
      query += " AND (status = 'not_interested' OR status = 'lost')";
    } else {
      query += ' AND status = ?';
      params.push(status);
    }
  }

  // Priority filter
  if (priority && priority !== 'all') {
    query += ' AND priority = ?';
    params.push(priority);
  }

  // Source filter
  if (source && source !== 'all') {
    query += ' AND source = ?';
    params.push(source);
  }

  // Assigned to filter
  if (assigned_to && assigned_to !== 'all') {
    query += ' AND assigned_to = ?';
    params.push(assigned_to);
  }

  // Follow-up date filter
  if (followUpFilter && followUpFilter !== 'all') {
    const today = new Date().toISOString().split('T')[0];
    if (followUpFilter === 'overdue') {
      query += " AND follow_up_date < date('now') AND follow_up_date IS NOT NULL";
    } else if (followUpFilter === 'today') {
      query += " AND date(follow_up_date) = date('now')";
    } else if (followUpFilter === 'this_week') {
      query += " AND follow_up_date >= date('now') AND follow_up_date <= date('now', '+7 days')";
    } else if (followUpFilter === 'no_followup') {
      query += ' AND follow_up_date IS NULL';
    }
  }

  // Search filter
  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR admin_notes LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  // Validate sortBy to prevent SQL injection
  const allowedSortBy = ['created_at', 'name', 'email', 'phone', 'status', 'priority', 'follow_up_date', 'contact_attempts', 'source'];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : 'created_at';
  const sortDir = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Special sorting: priority should order as urgent > high > medium > low
  if (sortColumn === 'priority') {
    query += ` ORDER BY CASE priority 
      WHEN 'urgent' THEN 1 
      WHEN 'high' THEN 2 
      WHEN 'medium' THEN 3 
      WHEN 'low' THEN 4 
      ELSE 5 END ${sortDir}`;
  } else {
    query += ` ORDER BY ${sortColumn} ${sortDir}`;
  }

  // Get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total').replace(/ORDER BY.*$/i, '');
  db.get(countQuery, params, (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const total = countResult ? countResult.total : 0;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, submissions) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        submissions: submissions || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    });
  });
});

// Get statistics for dashboard (MUST be before /:id route)
app.get('/api/contact/submissions/stats', (req, res) => {
  // Get status counts
  db.all(`SELECT 
    status,
    COUNT(*) as count
    FROM contact_submissions
    GROUP BY status`, (err, statusStats) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Get priority counts
    db.all(`SELECT priority, COUNT(*) as count FROM contact_submissions GROUP BY priority`, (err, priorityStats) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Get follow-up stats
      db.get(`SELECT 
        SUM(CASE WHEN follow_up_date < date('now') AND follow_up_date IS NOT NULL THEN 1 ELSE 0 END) as overdue,
        SUM(CASE WHEN date(follow_up_date) = date('now') THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN follow_up_date > date('now') AND follow_up_date <= date('now', '+7 days') THEN 1 ELSE 0 END) as this_week
        FROM contact_submissions`, (err, followUpStats) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const statsObj = {
          // Status counts
          leads: 0,
          contacted: 0,
          qualified: 0,
          follow_up: 0,
          negotiation: 0,
          final_customer: 0,
          not_interested: 0,
          lost: 0,
          total: 0,
          // Priority counts
          priority: {
            urgent: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          // Follow-up stats
          followUp: {
            overdue: followUpStats?.overdue || 0,
            today: followUpStats?.today || 0,
            this_week: followUpStats?.this_week || 0
          }
        };

        statusStats.forEach(stat => {
          if (statsObj.hasOwnProperty(stat.status)) {
            statsObj[stat.status] = stat.count;
          }
          statsObj.total += stat.count;
        });

        priorityStats.forEach(stat => {
          if (stat.priority && statsObj.priority.hasOwnProperty(stat.priority)) {
            statsObj.priority[stat.priority] = stat.count;
          }
        });

        res.json(statsObj);
      });
    });
  });
});

// Get single contact submission
app.get('/api/contact/submissions/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM contact_submissions WHERE id = ?', [id], (err, submission) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!submission) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }
    res.json(submission);
  });
});

// Update contact submission status (with activity logging)
app.put('/api/contact/submissions/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  const allowedStatuses = ['leads', 'contacted', 'qualified', 'follow_up', 'negotiation', 'final_customer', 'not_interested', 'lost'];
  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status. Allowed: ' + allowedStatuses.join(', ') });
    return;
  }

  // First get the current status for activity logging
  db.get('SELECT status FROM contact_submissions WHERE id = ?', [id], (err, current) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!current) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    const oldStatus = current.status;
    let updateQuery = `UPDATE contact_submissions SET status = ?, updated_at = CURRENT_TIMESTAMP`;
    const params = [status];

    // Update timestamps based on status
    if (status === 'contacted' && !req.body.contacted_at) {
      updateQuery += ', contacted_at = CURRENT_TIMESTAMP';
    } else if (status === 'follow_up' && !req.body.re_contacted_at) {
      updateQuery += ', re_contacted_at = CURRENT_TIMESTAMP';
    } else if (status === 'final_customer' && !req.body.converted_at) {
      updateQuery += ', converted_at = CURRENT_TIMESTAMP';
    }

    if (admin_notes !== undefined) {
      updateQuery += ', admin_notes = ?';
      params.push(admin_notes);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    db.run(updateQuery, params, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Log the activity
      if (oldStatus !== status) {
        db.run(
          `INSERT INTO contact_activity_log (submission_id, action_type, old_value, new_value, performed_by) VALUES (?, 'status_change', ?, ?, 'Admin')`,
          [id, oldStatus, status]
        );
      }

      res.json({ message: 'Status updated successfully', changes: this.changes });
    });
  });
});

// Update admin notes (with activity logging)
app.put('/api/contact/submissions/:id/notes', (req, res) => {
  const { id } = req.params;
  const { admin_notes } = req.body;

  db.run('UPDATE contact_submissions SET admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [admin_notes, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Log the activity
      db.run(
        `INSERT INTO contact_activity_log (submission_id, action_type, new_value, performed_by) VALUES (?, 'note_added', ?, 'Admin')`,
        [id, admin_notes ? admin_notes.substring(0, 100) : '']
      );

      res.json({ message: 'Notes updated successfully', changes: this.changes });
    });
});

// Delete contact submission
app.delete('/api/contact/submissions/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM contact_submissions WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Submission deleted successfully', changes: this.changes });
  });
});

// ============================================
// NEW CRM ENHANCEMENT ENDPOINTS
// ============================================

// Update priority
app.put('/api/contact/submissions/:id/priority', (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  const allowedPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!allowedPriorities.includes(priority)) {
    res.status(400).json({ error: 'Invalid priority. Allowed: ' + allowedPriorities.join(', ') });
    return;
  }

  db.get('SELECT priority FROM contact_submissions WHERE id = ?', [id], (err, current) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const oldPriority = current?.priority;

    db.run('UPDATE contact_submissions SET priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [priority, id], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'Submission not found' });
          return;
        }

        // Log activity
        if (oldPriority !== priority) {
          db.run(
            `INSERT INTO contact_activity_log (submission_id, action_type, old_value, new_value, performed_by) VALUES (?, 'priority_change', ?, ?, 'Admin')`,
            [id, oldPriority, priority]
          );
        }

        res.json({ message: 'Priority updated successfully', changes: this.changes });
      });
  });
});

// Set follow-up date and notes
app.put('/api/contact/submissions/:id/follow-up', (req, res) => {
  const { id } = req.params;
  const { follow_up_date, follow_up_notes } = req.body;

  db.run(
    'UPDATE contact_submissions SET follow_up_date = ?, follow_up_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [follow_up_date, follow_up_notes, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Log activity
      db.run(
        `INSERT INTO contact_activity_log (submission_id, action_type, new_value, notes, performed_by) VALUES (?, 'follow_up_set', ?, ?, 'Admin')`,
        [id, follow_up_date, follow_up_notes || '']
      );

      res.json({ message: 'Follow-up set successfully', changes: this.changes });
    }
  );
});

// Clear follow-up
app.delete('/api/contact/submissions/:id/follow-up', (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE contact_submissions SET follow_up_date = NULL, follow_up_notes = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }
      res.json({ message: 'Follow-up cleared successfully', changes: this.changes });
    }
  );
});

// Update source
app.put('/api/contact/submissions/:id/source', (req, res) => {
  const { id } = req.params;
  const { source } = req.body;

  const allowedSources = ['website', 'referral', 'advertisement', 'social_media', 'direct', 'email_campaign', 'phone', 'other'];
  if (!allowedSources.includes(source)) {
    res.status(400).json({ error: 'Invalid source. Allowed: ' + allowedSources.join(', ') });
    return;
  }

  db.run('UPDATE contact_submissions SET source = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [source, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }
      res.json({ message: 'Source updated successfully', changes: this.changes });
    });
});

// Assign to agent
app.put('/api/contact/submissions/:id/assign', (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;

  db.run('UPDATE contact_submissions SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [assigned_to, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Log activity
      db.run(
        `INSERT INTO contact_activity_log (submission_id, action_type, new_value, performed_by) VALUES (?, 'assigned', ?, 'Admin')`,
        [id, assigned_to]
      );

      res.json({ message: 'Assignment updated successfully', changes: this.changes });
    });
});

// Increment contact attempts
app.post('/api/contact/submissions/:id/increment-contact', (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  db.run(
    'UPDATE contact_submissions SET contact_attempts = COALESCE(contact_attempts, 0) + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      // Log activity
      db.run(
        `INSERT INTO contact_activity_log (submission_id, action_type, notes, performed_by) VALUES (?, 'contact_attempt', ?, 'Admin')`,
        [id, notes || 'Contact attempt made']
      );

      // Get the new count
      db.get('SELECT contact_attempts FROM contact_submissions WHERE id = ?', [id], (err, row) => {
        res.json({
          message: 'Contact attempt recorded',
          contact_attempts: row ? row.contact_attempts : 1
        });
      });
    }
  );
});

// Get activity log for a submission
app.get('/api/contact/submissions/:id/activity', (req, res) => {
  const { id } = req.params;
  const { limit = 50 } = req.query;

  db.all(
    'SELECT * FROM contact_activity_log WHERE submission_id = ? ORDER BY created_at DESC LIMIT ?',
    [id, parseInt(limit)],
    (err, activities) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(activities || []);
    }
  );
});

// Add activity log entry
app.post('/api/contact/submissions/:id/activity', (req, res) => {
  const { id } = req.params;
  const { action_type, notes, performed_by = 'Admin' } = req.body;

  const allowedActions = ['call_made', 'email_sent', 'meeting_scheduled', 'document_sent', 'custom_note'];
  if (!allowedActions.includes(action_type)) {
    res.status(400).json({ error: 'Invalid action_type. Allowed: ' + allowedActions.join(', ') });
    return;
  }

  db.run(
    `INSERT INTO contact_activity_log (submission_id, action_type, notes, performed_by) VALUES (?, ?, ?, ?)`,
    [id, action_type, notes, performed_by],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Activity logged successfully', id: this.lastID });
    }
  );
});

// Get today's follow-ups
app.get('/api/contact/submissions/today-followups', (req, res) => {
  db.all(
    `SELECT * FROM contact_submissions 
     WHERE date(follow_up_date) = date('now') 
     ORDER BY follow_up_date ASC`,
    (err, submissions) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(submissions || []);
    }
  );
});

// Get overdue follow-ups
app.get('/api/contact/submissions/overdue-followups', (req, res) => {
  db.all(
    `SELECT * FROM contact_submissions 
     WHERE follow_up_date < date('now') AND follow_up_date IS NOT NULL
     ORDER BY follow_up_date ASC`,
    (err, submissions) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(submissions || []);
    }
  );
});

// Export submissions to CSV
app.get('/api/contact/submissions/export', (req, res) => {
  const { status, priority, source, startDate, endDate } = req.query;

  let query = 'SELECT * FROM contact_submissions WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    if (status === 'closed') {
      query += " AND (status = 'not_interested' OR status = 'lost')";
    } else {
      query += ' AND status = ?';
      params.push(status);
    }
  }

  if (priority && priority !== 'all') {
    query += ' AND priority = ?';
    params.push(priority);
  }

  if (source && source !== 'all') {
    query += ' AND source = ?';
    params.push(source);
  }

  if (startDate) {
    query += ' AND date(created_at) >= date(?)';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND date(created_at) <= date(?)';
    params.push(endDate);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, submissions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Generate CSV
    const headers = [
      'ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Priority',
      'Source', 'Contact Attempts', 'Follow-up Date', 'Follow-up Notes', 'Admin Notes',
      'Assigned To', 'Created At', 'Updated At'
    ];

    const csvRows = [headers.join(',')];

    submissions.forEach(s => {
      const row = [
        s.id,
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${(s.phone || '').replace(/"/g, '""')}"`,
        `"${(s.subject || '').replace(/"/g, '""')}"`,
        `"${(s.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        s.status,
        s.priority,
        s.source,
        s.contact_attempts || 0,
        s.follow_up_date || '',
        `"${(s.follow_up_notes || '').replace(/"/g, '""')}"`,
        `"${(s.admin_notes || '').replace(/"/g, '""')}"`,
        s.assigned_to || '',
        s.created_at,
        s.updated_at
      ];
      csvRows.push(row.join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=contact_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  });
});

// Bulk update status
app.put('/api/contact/submissions/bulk-update', (req, res) => {
  const { ids, status } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids array is required' });
    return;
  }

  const allowedStatuses = ['leads', 'contacted', 'qualified', 'follow_up', 'negotiation', 'final_customer', 'not_interested', 'lost'];
  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const placeholders = ids.map(() => '?').join(',');
  db.run(
    `UPDATE contact_submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`,
    [status, ...ids],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Log activities for each
      ids.forEach(id => {
        db.run(
          `INSERT INTO contact_activity_log (submission_id, action_type, new_value, performed_by, notes) VALUES (?, 'status_change', ?, 'Admin', 'Bulk update')`,
          [id, status]
        );
      });

      res.json({ message: `${this.changes} submissions updated`, changes: this.changes });
    }
  );
});

// Bulk delete
app.delete('/api/contact/submissions/bulk-delete', (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids array is required' });
    return;
  }

  const placeholders = ids.map(() => '?').join(',');

  // First delete activity logs
  db.run(
    `DELETE FROM contact_activity_log WHERE submission_id IN (${placeholders})`,
    ids,
    (err) => {
      if (err) {
        console.error('Error deleting activity logs:', err.message);
      }

      // Then delete submissions
      db.run(
        `DELETE FROM contact_submissions WHERE id IN (${placeholders})`,
        ids,
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: `${this.changes} submissions deleted`, changes: this.changes });
        }
      );
    }
  );
});

// ============================================
// OTP VERIFICATION (Phone.Email API)
// ============================================

// In-memory OTP storage (for testing - use Redis in production)
const otpStorage = {};

// Send OTP via Phone.Email API
app.post('/api/contact/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(400).json({ error: 'Phone number is required' });
    return;
  }

  try {
    // Check if phone is already verified (within last 24 hours)
    db.get(`SELECT * FROM verified_phone_numbers 
      WHERE phone = ? AND expires_at > datetime('now')`,
      [phone], async (err, verified) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        if (verified) {
          res.json({
            message: 'Phone number already verified',
            verified: true,
            expires_at: verified.expires_at
          });
          return;
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store OTP (valid for 1 minute as per requirement)
        otpStorage[sessionId] = {
          phone: phone,
          otp: otp,
          expiresAt: Date.now() + 60000, // 1 minute
          createdAt: Date.now()
        };

        // Clean up expired OTPs
        Object.keys(otpStorage).forEach(key => {
          if (otpStorage[key].expiresAt < Date.now()) {
            delete otpStorage[key];
          }
        });

        // TODO: Integrate Phone.Email API here
        // Uncomment and configure when you have Phone.Email API key
        /*
        const PHONE_EMAIL_API_KEY = process.env.PHONE_EMAIL_API_KEY;
        if (PHONE_EMAIL_API_KEY) {
          try {
            const phoneEmailResponse = await fetch('https://api.phone.email/send-otp', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PHONE_EMAIL_API_KEY}`
              },
              body: JSON.stringify({ 
                phone: phone,
                message: `Your OTP is ${otp}. Valid for 1 minute.`
              })
            });
            
            const phoneEmailData = await phoneEmailResponse.json();
            if (!phoneEmailResponse.ok) {
              throw new Error(phoneEmailData.error || 'Failed to send OTP via Phone.Email');
            }
            
            // Use Phone.Email session_id if provided
            if (phoneEmailData.session_id) {
              sessionId = phoneEmailData.session_id;
            }
          } catch (apiError) {
            console.error('Phone.Email API error:', apiError);
            // Fall back to test mode if API fails
          }
        }
        */

        // Log OTP for testing (REMOVE IN PRODUCTION!)
        console.log(`\n🔐 OTP for ${phone}: ${otp}`);
        console.log(`⏰ Valid for 1 minute. Session ID: ${sessionId}\n`);

        res.json({
          message: 'OTP sent successfully',
          phone: phone,
          session_id: sessionId,
          // Remove this in production - only for testing
          test_mode: !process.env.PHONE_EMAIL_API_KEY,
          test_otp: otp // Always return OTP in test mode for development
        });
      });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/contact/verify-otp', async (req, res) => {
  const { phone, otp, session_id } = req.body;

  if (!phone || !otp) {
    res.status(400).json({ error: 'Phone number and OTP are required' });
    return;
  }

  if (!session_id) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }

  try {
    let isValid = false;

    // Check stored OTP (test mode)
    const storedOTP = otpStorage[session_id];
    if (storedOTP) {
      // Check if OTP expired
      if (storedOTP.expiresAt < Date.now()) {
        delete otpStorage[session_id];
        res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        return;
      }

      // Verify phone matches
      if (storedOTP.phone !== phone) {
        res.status(400).json({ error: 'Phone number mismatch' });
        return;
      }

      // Verify OTP
      if (storedOTP.otp === otp) {
        isValid = true;
        // Remove OTP after successful verification
        delete otpStorage[session_id];
      }
    }

    // TODO: Verify with Phone.Email API if API key is configured
    /*
    const PHONE_EMAIL_API_KEY = process.env.PHONE_EMAIL_API_KEY;
    if (PHONE_EMAIL_API_KEY && !isValid) {
      try {
        const phoneEmailResponse = await fetch('https://api.phone.email/verify-otp', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PHONE_EMAIL_API_KEY}`
          },
          body: JSON.stringify({ 
            phone: phone,
            otp: otp,
            session_id: session_id
          })
        });
        
        const phoneEmailData = await phoneEmailResponse.json();
        if (phoneEmailResponse.ok && phoneEmailData.verified) {
          isValid = true;
        }
      } catch (apiError) {
        console.error('Phone.Email API error:', apiError);
      }
    }
    */

    if (!isValid) {
      res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
      return;
    }

    // Store verified phone number (valid for 24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    db.run(`INSERT OR REPLACE INTO verified_phone_numbers (phone, expires_at) VALUES (?, ?)`,
      [phone, expiresAt], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          verified: true,
          message: 'Phone number verified successfully',
          expires_at: expiresAt,
          verification_timestamp: new Date().toISOString()
        });
      });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Check if phone is verified
app.get('/api/contact/check-verification/:phone', (req, res) => {
  const { phone } = req.params;

  db.get(`SELECT * FROM verified_phone_numbers 
    WHERE phone = ? AND expires_at > datetime('now')`,
    [phone], (err, verified) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        verified: !!verified,
        expires_at: verified ? verified.expires_at : null
      });
    });
});

// Verify Phone.Email user_json_url
app.post('/api/contact/verify-phone-email', async (req, res) => {
  const { user_json_url } = req.body;

  if (!user_json_url) {
    res.status(400).json({ error: 'user_json_url is required' });
    return;
  }

  try {
    // Fetch user data from Phone.Email
    const https = require('https');
    const url = require('url');

    const parsedUrl = url.parse(user_json_url);

    const phoneEmailData = await new Promise((resolve, reject) => {
      https.get(user_json_url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseError) {
            reject(new Error('Failed to parse Phone.Email response'));
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });

    // Extract phone data
    const user_country_code = phoneEmailData.user_country_code || '';
    const user_phone_number = phoneEmailData.user_phone_number || '';
    const fullPhone = `${user_country_code}${user_phone_number}`;

    if (!user_phone_number) {
      res.status(400).json({ error: 'Invalid phone data from Phone.Email' });
      return;
    }

    // Store verified phone number (valid for 24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    db.run(`INSERT OR REPLACE INTO verified_phone_numbers (phone, expires_at) VALUES (?, ?)`,
      [fullPhone, expiresAt], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          verified: true,
          message: 'Phone number verified successfully via Phone.Email',
          expires_at: expiresAt,
          verification_timestamp: new Date().toISOString(),
          phone_data: {
            user_country_code: user_country_code,
            user_phone_number: user_phone_number,
            user_first_name: phoneEmailData.user_first_name || '',
            user_last_name: phoneEmailData.user_last_name || '',
            full_phone: fullPhone
          }
        });
      });
  } catch (error) {
    console.error('Error verifying Phone.Email:', error);
    res.status(500).json({ error: 'Failed to verify phone number. Please try again.' });
  }
});

// Initialize Price Estimator routes
initPriceEstimatorRoutes(app, db);

// Initialize Export routes
initExportRoutes(app, db);

// Start server

app.listen(PORT, async () => {
  console.log(`🚀 Cloud4India CMS Server running on http://localhost:${PORT}`);

  // Cleanup orphaned entries on server start
  setTimeout(() => {
    cleanupOrphanedMainMarketplacesSections();
    cleanupOrphanedMainSolutionsSections();
    cleanupOrphanedMainProductsSections();
  }, 3000);
  console.log(`📊 Admin API available at http://localhost:${PORT}/api/homepage`);
  console.log(`💰 Pricing API available at http://localhost:${PORT}/api/pricing`);
  console.log(`❤️  Health check at http://localhost:${PORT}/api/health`);

  // Always ensure media columns exist (critical for marketplace_sections)
  console.log('🔄 Ensuring media columns exist in marketplace_sections...');
  await addMarketplaceMediaBannerColumns();
  await addProductMediaBannerColumns();

  // Run migrations only if RUN_MIGRATIONS environment variable is set to true
  const shouldRunMigrations = process.env.RUN_MIGRATIONS === 'true';
  if (shouldRunMigrations) {
    console.log('🔄 RUN_MIGRATIONS=true - Running database migrations...');
    await runMigrations();
  } else {
    console.log('⏭️  RUN_MIGRATIONS=false - Skipping database migrations (using existing database)');
  }

  // Always ensure product_sections has required columns (critical for duplication)
  await addProductMediaBannerColumns();
  await addDescriptionColumnToProductSections();
  await addPricingTableHeaderColumns();
  await addProductPricingColumnVisibilityColumns();
  await addSolutionPricingTableHeaderColumns();
  await addSolutionPricingColumnVisibilityColumns();
  await addMarketplacePricingTableHeaderColumns();
  await addMarketplacePricingColumnVisibilityColumns();

  // Always ensure product_items has required columns (critical for item duplication)
  await addProductItemsColumns();

  // Always ensure section_items has is_visible column
  await addSectionItemsVisibilityColumn();

  // Add missing columns to marketplaces and products tables
  setTimeout(() => {
    addMainMarketplacesSectionColumns();
    addMainMarketplacesContentColumns();
    addMainProductsSectionColumns();
    addMainProductsContentColumns();
    addAboutUsSectionColumns();
  }, 2000);
});

module.exports = app;



