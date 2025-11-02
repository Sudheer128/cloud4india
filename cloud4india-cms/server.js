const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    
    // Add new columns to main_products_sections if they don't exist
    await addMainProductsSectionColumns();
    
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.log('⚠️  Continuing with existing database...');
  }
};

// Add new columns to main_products_sections table
const addMainProductsSectionColumns = () => {
  return new Promise((resolve) => {
    const columns = [
      { name: 'popular_tag', sql: "ALTER TABLE main_products_sections ADD COLUMN popular_tag TEXT DEFAULT 'Most Popular';" },
      { name: 'category', sql: "ALTER TABLE main_products_sections ADD COLUMN category TEXT;" },
      { name: 'features', sql: "ALTER TABLE main_products_sections ADD COLUMN features TEXT DEFAULT '[]';" },
      { name: 'price', sql: "ALTER TABLE main_products_sections ADD COLUMN price TEXT DEFAULT '₹2,999';" },
      { name: 'price_period', sql: "ALTER TABLE main_products_sections ADD COLUMN price_period TEXT DEFAULT '/month';" },
      { name: 'free_trial_tag', sql: "ALTER TABLE main_products_sections ADD COLUMN free_trial_tag TEXT DEFAULT 'Free Trial';" },
      { name: 'button_text', sql: "ALTER TABLE main_products_sections ADD COLUMN button_text TEXT DEFAULT 'Explore Solution';" }
    ];
    
    let completed = 0;
    columns.forEach((col) => {
      db.run(col.sql, (err) => {
        if (err) {
          // Column might already exist, that's okay
          if (err.message.includes('duplicate column')) {
            console.log(`   ⏭️  Column ${col.name} already exists`);
          } else {
            console.log(`   ⚠️  Error adding column ${col.name}: ${err.message}`);
          }
        } else {
          console.log(`   ✅ Added column ${col.name}`);
        }
        completed++;
        if (completed === columns.length) {
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
              console.log(`   ⚠️  Error updating defaults: ${err.message}`);
            } else {
              console.log('   ✅ Updated existing rows with default values');
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
                console.log(`   ⚠️  Error copying categories: ${err.message}`);
              } else {
                console.log('   ✅ Copied categories from products table');
              }
              resolve();
            });
          });
        }
      });
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

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    border_color TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Solutions table
  db.run(`CREATE TABLE IF NOT EXISTS solutions (
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
    FOREIGN KEY (solution_id) REFERENCES solutions (id)
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
    FOREIGN KEY (section_id) REFERENCES solution_sections (id) ON DELETE CASCADE
  )`);

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

  // Insert default products only if table is empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error('Error checking products count:', err.message);
      return;
    }
    
    if (row.count === 0) {
      console.log('Inserting default products...');
      const products = [
        {
          name: 'Cloud4India Q Developer',
          description: 'The most capable generative AI–powered assistant for software development',
          category: 'Generative AI',
          color: 'from-purple-100 to-purple-50',
          borderColor: 'border-purple-200'
        },
        {
          name: 'Cloud4India SageMaker',
          description: 'Build, train, and deploy machine learning models at scale',
          category: 'Artificial Intelligence (AI)',
          color: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200'
        },
        {
          name: 'Cloud4India Elastic Compute Cloud (EC2)',
          description: 'Virtual servers in the cloud',
          category: 'Compute',
          color: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-200'
        },
        {
          name: 'Cloud4India S3',
          description: 'Object storage built to retrieve any amount of data from anywhere',
          category: 'Storage',
          color: 'from-green-50 to-green-100',
          borderColor: 'border-green-200'
        }
      ];

      products.forEach((product, index) => {
        db.run(`INSERT INTO products (name, description, category, color, border_color, order_index) VALUES (?, ?, ?, ?, ?, ?)`,
          [product.name, product.description, product.category, product.color, product.borderColor, index], (err) => {
            if (err) console.error('Error inserting product:', err.message);
          });
      });
      console.log('Default products inserted.');
    } else {
      console.log(`Products table already has ${row.count} items, skipping default insert.`);
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
      const solutions = [
        {
          name: 'Financial services',
          description: 'Reimagine your business and enable security and compliance at scale',
          category: 'Industry',
          color: 'from-gray-50 to-gray-100',
          border_color: 'border-gray-200',
          route: '/solutions/financial-services'
        },
        {
          name: 'Healthcare and life sciences',
          description: 'Innovate faster for clinicians and patients with unmatched reliability, security, and data privacy',
          category: 'Industry',
          color: 'from-blue-50 to-blue-100',
          border_color: 'border-blue-200',
          route: '/solutions/healthcare'
        },
        {
          name: 'Retail',
          description: 'Create exceptional experiences built for the future of retail',
          category: 'Industry',
          color: 'from-purple-50 to-purple-100',
          border_color: 'border-purple-200',
          route: '/solutions/retail'
        },
        {
          name: 'Artificial intelligence',
          description: 'Find curated solutions for use cases like language understanding and MLOps',
          category: 'Technology',
          color: 'from-green-50 to-green-100',
          border_color: 'border-green-200',
          route: '/solutions/artificial-intelligence'
        },
        {
          name: 'Migration and modernization',
          description: 'Plan your migrations and modernize your applications and mainframes',
          category: 'Technology',
          color: 'from-orange-50 to-orange-100',
          border_color: 'border-orange-200',
          route: '/solutions/migration'
        },
        {
          name: 'Analytics and data lakes',
          description: 'Get solutions for advanced analytics, data management, and predictive analytics with ML',
          category: 'Technology',
          color: 'from-teal-50 to-teal-100',
          border_color: 'border-teal-200',
          route: '/solutions/analytics'
        },
        {
          name: 'Serverless computing',
          description: 'Run code, manage data, and integrate applications—all without managing servers',
          category: 'Technology',
          color: 'from-blue-50 to-blue-100',
          border_color: 'border-blue-200',
          route: '/solutions/serverless'
        },
        {
          name: 'Compute',
          description: 'Develop cloud-centered applications and manage high performance computing (HPC) workloads',
          category: 'Technology',
          color: 'from-pink-50 to-pink-100',
          border_color: 'border-pink-200',
          route: '/solutions/compute'
        }
      ];

      solutions.forEach((solution, index) => {
        db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [solution.name, solution.description, solution.category, solution.color, solution.border_color, solution.route, index], (err) => {
            if (err) console.error('Error inserting solution:', err.message);
          });
      });
      console.log('Default solutions inserted.');
    } else {
      console.log(`Solutions table already has ${row.count} items, skipping default insert.`);
    }
  });

  // Migration: Update to new products structure
  // Ensure route and is_visible columns exist
  db.run(`ALTER TABLE products ADD COLUMN is_visible INTEGER DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding is_visible column:', err.message);
    }
  });

  db.run(`ALTER TABLE products ADD COLUMN route TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding route column:', err.message);
    }
  });

  // Check if migration to new products has been done
  // Check specifically for our new product routes
  db.get("SELECT COUNT(*) as count FROM products WHERE route IN ('microsoft-365-licenses', 'acronis-server-backup', 'acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus')", (err, row) => {
    if (err) {
      console.error('Error checking new products:', err.message);
      return;
    }
    
    // If new products don't exist, perform migration
    if (row.count === 0) {
      console.log('🔄 Starting migration to new products...');
      
      // Step 1: Mark existing products as hidden
      db.run(`UPDATE products SET is_visible = 0 WHERE is_visible = 1 OR is_visible IS NULL`, function(updateErr) {
        if (updateErr) {
          console.error('Error hiding old products:', updateErr.message);
        } else {
          console.log(`✅ Hidden ${this.changes} existing product(s)`);
        }

        // Step 2: Add new products
        const newProducts = [
          {
            name: 'Microsoft 365 Licenses',
            description: 'Comprehensive Microsoft 365 licensing solutions for businesses of all sizes. Choose from Business Basic, Standard, Premium plans with or without Teams.',
            category: 'Software Licenses',
            color: '#0078D4',
            border_color: '#005A9E',
            route: 'microsoft-365-licenses',
            gradient_start: 'blue',
            gradient_end: 'blue-100'
          },
          {
            name: 'Acronis Server Backup',
            description: 'Secure and reliable server backup solutions with flexible storage options. Protect your critical data with enterprise-grade backup services.',
            category: 'Backup Services',
            color: '#0066CC',
            border_color: '#004499',
            route: 'acronis-server-backup',
            gradient_start: 'indigo',
            gradient_end: 'indigo-100'
          },
          {
            name: 'Acronis M365 Backup',
            description: 'Dedicated backup solution for Microsoft 365 data. Ensure your emails, contacts, and files are securely backed up and easily recoverable.',
            category: 'Backup Services',
            color: '#0066CC',
            border_color: '#004499',
            route: 'acronis-m365-backup',
            gradient_start: 'cyan',
            gradient_end: 'cyan-100'
          },
          {
            name: 'Acronis Google Workspace Backup',
            description: 'Comprehensive backup solution for Google Workspace. Protect Gmail, Drive, Contacts, and Calendar data with automated backups.',
            category: 'Backup Services',
            color: '#0066CC',
            border_color: '#004499',
            route: 'acronis-google-workspace-backup',
            gradient_start: 'teal',
            gradient_end: 'teal-100'
          },
          {
            name: 'Anti Virus',
            description: 'Enterprise-grade antivirus and endpoint protection. Keep your systems safe from malware, ransomware, and other cyber threats.',
            category: 'Security',
            color: '#DC2626',
            border_color: '#991B1B',
            route: 'anti-virus',
            gradient_start: 'red',
            gradient_end: 'red-100'
          }
        ];

        let insertedCount = 0;
        const totalProducts = newProducts.length;

        newProducts.forEach((product, index) => {
          // Check if route column exists, if not use NULL
          db.run(
            `INSERT INTO products (name, description, category, color, border_color, route, gradient_start, gradient_end, is_visible, order_index) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [product.name, product.description, product.category, product.color, product.border_color, 
             product.route, product.gradient_start, product.gradient_end, index],
            function(insertErr) {
              if (insertErr) {
                console.error(`Error inserting ${product.name}:`, insertErr.message);
              } else {
                insertedCount++;
                console.log(`✅ Added: ${product.name} (ID: ${this.lastID})`);
              }

              if (insertedCount === totalProducts) {
                console.log(`✅ Migration completed! Added ${insertedCount} new products.`);
              }
            }
          );
        });
      });
    } else {
      console.log(`✅ Migration already completed (${row.count} products with routes found).`);
    }
  });

});

// API Routes

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
      
      // Get products
      db.all('SELECT * FROM products ORDER BY order_index ASC', (err, products) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        homepageData.products = products;
        
        res.json(homepageData);
      });
    });
  });
});

// Update hero section
app.put('/api/hero', (req, res) => {
  const { title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link } = req.body;
  
  db.run(`UPDATE hero_section SET 
    title = ?, 
    description = ?, 
    primary_button_text = ?, 
    primary_button_link = ?, 
    secondary_button_text = ?, 
    secondary_button_link = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = 1`, 
    [title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Hero section updated successfully', changes: this.changes });
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
      function(err) {
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
    function(err) {
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
  
  db.run(`DELETE FROM why_items WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Why item deleted successfully', changes: this.changes });
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
  `, function(err) {
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

// Clean up duplicate products
app.post('/api/cleanup-product-duplicates', (req, res) => {
  // Remove duplicate products based on name
  db.run(`
    DELETE FROM products 
    WHERE id NOT IN (
      SELECT MIN(id) 
      FROM products 
      GROUP BY name
    )
  `, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: 'Duplicate products cleaned up successfully', 
      changes: this.changes 
    });
  });
});

// Update products
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, color, border_color } = req.body;
  
  db.run(`UPDATE products SET 
    name = ?, 
    description = ?, 
    category = ?, 
    color = ?, 
    border_color = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, 
    [name, description, category, color, border_color, id], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Product updated successfully', changes: this.changes });
    });
});

// Create new product
app.post('/api/products', (req, res) => {
  const { name, description, category, color, border_color } = req.body;
  
  // Get the next order index
  db.get('SELECT MAX(order_index) as max_order FROM products', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = (result.max_order || -1) + 1;
    
    db.run(`INSERT INTO products (name, description, category, color, border_color, order_index) VALUES (?, ?, ?, ?, ?, ?)`, 
      [name, description, category, color, border_color, nextOrder], 
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ 
          message: 'Product created successfully', 
          id: this.lastID,
          changes: this.changes 
        });
      });
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM products WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product deleted successfully', changes: this.changes });
  });
});

// Manual migration endpoint for new products
app.post('/api/admin/migrate-products', (req, res) => {
  console.log('🔄 Manual migration triggered...');
  
  // Check if new products already exist
  db.get("SELECT COUNT(*) as count FROM products WHERE route IN ('microsoft-365-licenses', 'acronis-server-backup', 'acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus')", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row.count > 0) {
      res.json({ message: 'Migration already completed', existingCount: row.count });
      return;
    }

    // Step 1: Mark existing products as hidden
    db.run(`UPDATE products SET is_visible = 0 WHERE is_visible = 1 OR is_visible IS NULL`, function(updateErr) {
      if (updateErr) {
        res.status(500).json({ error: updateErr.message });
        return;
      }

      const hiddenCount = this.changes;

      // Step 2: Add new products
      const newProducts = [
        {
          name: 'Microsoft 365 Licenses',
          description: 'Comprehensive Microsoft 365 licensing solutions for businesses of all sizes. Choose from Business Basic, Standard, Premium plans with or without Teams.',
          category: 'Software Licenses',
          color: '#0078D4',
          border_color: '#005A9E',
          route: 'microsoft-365-licenses',
          gradient_start: 'blue',
          gradient_end: 'blue-100'
        },
        {
          name: 'Acronis Server Backup',
          description: 'Secure and reliable server backup solutions with flexible storage options. Protect your critical data with enterprise-grade backup services.',
          category: 'Backup Services',
          color: '#0066CC',
          border_color: '#004499',
          route: 'acronis-server-backup',
          gradient_start: 'indigo',
          gradient_end: 'indigo-100'
        },
        {
          name: 'Acronis M365 Backup',
          description: 'Dedicated backup solution for Microsoft 365 data. Ensure your emails, contacts, and files are securely backed up and easily recoverable.',
          category: 'Backup Services',
          color: '#0066CC',
          border_color: '#004499',
          route: 'acronis-m365-backup',
          gradient_start: 'cyan',
          gradient_end: 'cyan-100'
        },
        {
          name: 'Acronis Google Workspace Backup',
          description: 'Comprehensive backup solution for Google Workspace. Protect Gmail, Drive, Contacts, and Calendar data with automated backups.',
          category: 'Backup Services',
          color: '#0066CC',
          border_color: '#004499',
          route: 'acronis-google-workspace-backup',
          gradient_start: 'teal',
          gradient_end: 'teal-100'
        },
        {
          name: 'Anti Virus',
          description: 'Enterprise-grade antivirus and endpoint protection. Keep your systems safe from malware, ransomware, and other cyber threats.',
          category: 'Security',
          color: '#DC2626',
          border_color: '#991B1B',
          route: 'anti-virus',
          gradient_start: 'red',
          gradient_end: 'red-100'
        }
      ];

      let insertedCount = 0;
      let insertedIds = [];

      newProducts.forEach((product, index) => {
        db.run(
          `INSERT INTO products (name, description, category, color, border_color, route, gradient_start, gradient_end, is_visible, order_index) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
          [product.name, product.description, product.category, product.color, product.border_color, 
           product.route, product.gradient_start, product.gradient_end, index],
          function(insertErr) {
            if (insertErr) {
              console.error(`Error inserting ${product.name}:`, insertErr.message);
            } else {
              insertedCount++;
              insertedIds.push({ id: this.lastID, name: product.name, route: product.route });
            }

            if (insertedCount === newProducts.length) {
              res.json({ 
                message: 'Migration completed successfully',
                hiddenCount: hiddenCount,
                insertedCount: insertedCount,
                products: insertedIds
              });
            }
          }
        );
      });
    });
  });
});

// Update homepage products - hide old ones and create entries for new products
app.post('/api/admin/update-homepage-products', (req, res) => {
  console.log('🔄 Updating homepage products...');
  
  // Step 1: Hide all existing homepage product sections
  db.run('UPDATE main_products_sections SET is_visible = 0', function(updateErr) {
    if (updateErr) {
      res.status(500).json({ error: updateErr.message });
      return;
    }

    console.log(`Hidden ${this.changes} existing homepage product sections`);

    // Step 2: Get the 5 new products by route
    db.all('SELECT id, name, description, category, route FROM products WHERE route IN (?, ?, ?, ?, ?) AND is_visible = 1 ORDER BY order_index ASC',
      ['microsoft-365-licenses', 'acronis-server-backup', 'acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus'],
      (err, products) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        if (products.length === 0) {
          res.json({ message: 'No new products found. Please run migration first.' });
          return;
        }

        let insertedCount = 0;
        const totalProducts = products.length;

        products.forEach((product, index) => {
          db.run(
            `INSERT INTO main_products_sections (product_id, title, description, category, is_visible, order_index, button_text)
             VALUES (?, ?, ?, ?, 1, ?, 'Explore Product')`,
            [product.id, product.name, product.description, product.category, index],
            function(insertErr) {
              if (insertErr) {
                console.error(`Error creating homepage section for ${product.name}:`, insertErr.message);
              } else {
                insertedCount++;
                console.log(`✅ Added ${product.name} to homepage`);
              }

              if (insertedCount === totalProducts) {
                res.json({
                  message: 'Homepage products updated successfully',
                  oldSectionsHidden: this.changes,
                  newSectionsCreated: insertedCount,
                  products: products.map(p => ({ id: p.id, name: p.name, route: p.route }))
                });
              }
            }
          );
        });
      }
    );
  });
});

// Seed initial content for new products (sections and items)
app.post('/api/admin/seed-product-content', (req, res) => {
  console.log('🌱 Seeding product content...');
  
  // Product content definitions
  const productContent = {
    'microsoft-365-licenses': {
      hero: {
        title: 'Microsoft 365 Licenses',
        description: 'Comprehensive Microsoft 365 licensing solutions for businesses of all sizes. Choose from Business Basic, Standard, Premium plans with or without Teams.',
        section_type: 'hero'
      },
      features: [
        { title: 'Email & Calendar', description: 'Professional business email with 50GB mailbox and shared calendars', icon: 'GlobeAltIcon' },
        { title: 'Office Apps', description: 'Access to Word, Excel, PowerPoint, and other Office applications', icon: 'DocumentTextIcon' },
        { title: 'Cloud Storage', description: '1TB OneDrive cloud storage per user for secure file access', icon: 'CircleStackIcon' },
        { title: 'Microsoft Teams', description: 'Video conferencing, chat, and collaboration tools (where applicable)', icon: 'UsersIcon' },
        { title: 'Security & Compliance', description: 'Advanced threat protection and data loss prevention', icon: 'ShieldCheckIcon' },
        { title: 'Mobile Apps', description: 'Access your work from anywhere with mobile Office apps', icon: 'DevicePhoneMobileIcon' }
      ],
      specifications: [
        { title: 'Mailbox Size', description: '50GB per user mailbox' },
        { title: 'OneDrive Storage', description: '1TB cloud storage per user' },
        { title: 'User Limit', description: 'Up to 300 users per subscription' },
        { title: 'Support', description: '24/7 Microsoft support included' }
      ],
      security: [
        { title: 'Advanced Threat Protection', description: 'Protection against phishing, malware, and ransomware' },
        { title: 'Data Loss Prevention', description: 'Prevent sensitive data from being shared inappropriately' },
        { title: 'Encryption', description: 'Email and files encrypted at rest and in transit' },
        { title: 'Compliance', description: 'Meet industry compliance standards including GDPR' }
      ],
      support: [
        { title: '24/7 Support', description: 'Round-the-clock technical support from Microsoft' },
        { title: 'Online Documentation', description: 'Comprehensive guides and tutorials' },
        { title: 'Training Resources', description: 'Free training materials and webinars' },
        { title: 'Community Forums', description: 'Access to user community and expert advice' }
      ],
      use_cases: [
        { title: 'Small Businesses', description: 'Perfect for small teams needing professional email and Office apps' },
        { title: 'Remote Work', description: 'Enable seamless collaboration for distributed teams' },
        { title: 'Enterprise', description: 'Scalable solution for large organizations with advanced security' }
      ],
      variants: [
        { title: 'Microsoft 365 Business Standard', price: '₹775', period: '/month' },
        { title: 'Microsoft 365 Business Standard (no Teams)', price: '₹675', period: '/month' },
        { title: 'Microsoft 365 Business Premium', price: '₹1,900', period: '/month' },
        { title: 'Microsoft 365 Business Premium (no Teams)', price: '₹650', period: '/month' },
        { title: 'Microsoft 365 Business Basic', price: '₹145', period: '/month' },
        { title: 'Microsoft 365 Business Basic (no Teams)', price: '₹120', period: '/month' }
      ]
    },
    'acronis-server-backup': {
      hero: {
        title: 'Acronis Server Backup',
        description: 'Secure and reliable server backup solutions with flexible storage options. Protect your critical data with enterprise-grade backup services.',
        section_type: 'hero'
      },
      variants: [
        { title: '500 GB Server Backup', price: '₹3,500', period: '/month' },
        { title: '250 GB Server Backup', price: '₹1,750', period: '/month' },
        { title: '100 GB Server Backup', price: '₹700', period: '/month' },
        { title: '50 GB Server Backup', price: '₹350', period: '/month' }
      ]
    },
    'acronis-m365-backup': {
      hero: {
        title: 'Acronis M365 Backup',
        description: 'Dedicated backup solution for Microsoft 365 data. Ensure your emails, contacts, and files are securely backed up and easily recoverable.',
        section_type: 'hero'
      },
      variants: [
        { title: 'Acronis M365 Backup Per Seat', price: '₹200', period: '/month' }
      ]
    },
    'acronis-google-workspace-backup': {
      hero: {
        title: 'Acronis Google Workspace Backup',
        description: 'Comprehensive backup solution for Google Workspace. Protect Gmail, Drive, Contacts, and Calendar data with automated backups.',
        section_type: 'hero'
      },
      variants: [
        { title: 'Acronis Google Workspace Backup per Seat', price: '₹200', period: '/month' }
      ]
    },
    'anti-virus': {
      hero: {
        title: 'Anti Virus',
        description: 'Enterprise-grade antivirus and endpoint protection. Keep your systems safe from malware, ransomware, and other cyber threats.',
        section_type: 'hero'
      },
      variants: [
        { title: 'Acronis EDR Anti Virus', price: '₹300', period: '/month' }
      ]
    }
  };

  // Get product IDs by route
  db.all('SELECT id, route FROM products WHERE route IN (?, ?, ?, ?, ?) AND is_visible = 1', 
    ['microsoft-365-licenses', 'acronis-server-backup', 'acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus'],
    (err, products) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (products.length === 0) {
        res.status(404).json({ error: 'Products not found. Please run migration first.' });
        return;
      }

      let processedCount = 0;
      let totalSections = 0;
      let totalItems = 0;

      products.forEach((product) => {
        const content = productContent[product.route];
        if (!content) {
          processedCount++;
          if (processedCount === products.length) {
            res.json({ 
              message: 'Content seeding completed',
              sectionsCreated: totalSections,
              itemsCreated: totalItems
            });
          }
          return;
        }

        // Create hero section
        db.run(
          `INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
           VALUES (?, ?, ?, ?, 0, 1)`,
          [product.id, content.hero.title, content.hero.description, content.hero.section_type],
          function(heroErr) {
            if (heroErr) {
              console.error(`Error creating hero section for ${product.route}:`, heroErr.message);
              processedCount++;
              if (processedCount === products.length) {
                res.json({ 
                  message: 'Content seeding completed with some errors',
                  sectionsCreated: totalSections,
                  itemsCreated: totalItems
                });
              }
              return;
            }

            const heroSectionId = this.lastID;
            totalSections++;

            // Create hero section items (title and description)
            db.run(
              `INSERT INTO product_items (section_id, title, description, item_type, order_index, is_visible)
               VALUES (?, ?, ?, 'title', 0, 1)`,
              [heroSectionId, content.hero.title, content.hero.description],
              (titleErr) => {
                if (titleErr) console.error('Error creating title item:', titleErr.message);
                else totalItems++;
              }
            );

            db.run(
              `INSERT INTO product_items (section_id, title, description, item_type, order_index, is_visible)
               VALUES (?, ?, ?, 'description', 1, 1)`,
              [heroSectionId, '', content.hero.description, 'description'],
              (descErr) => {
                if (descErr) console.error('Error creating description item:', descErr.message);
                else totalItems++;
              }
            );

            // Create pricing section with variants
            db.run(
              `INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
               VALUES (?, 'Available Plans', 'Choose the plan that best fits your needs', 'pricing', 1, 1)`,
              [product.id],
              function(pricingErr) {
                if (pricingErr) {
                  console.error(`Error creating pricing section for ${product.route}:`, pricingErr.message);
                  processedCount++;
                  if (processedCount === products.length) {
                    res.json({ 
                      message: 'Content seeding completed',
                      sectionsCreated: totalSections,
                      itemsCreated: totalItems
                    });
                  }
                  return;
                }

                const pricingSectionId = this.lastID;
                totalSections++;

                // Create pricing plan items for each variant
                let itemsCreated = 0;
                content.variants.forEach((variant, index) => {
                  db.run(
                    `INSERT INTO product_items (section_id, title, description, content, item_type, order_index, is_visible)
                     VALUES (?, ?, ?, ?, 'pricing_plan', ?, 1)`,
                    [pricingSectionId, variant.title, `${variant.price}${variant.period}`, JSON.stringify({ price: variant.price, period: variant.period }), index],
                    (itemErr) => {
                      if (itemErr) {
                        console.error(`Error creating item for ${variant.title}:`, itemErr.message);
                      } else {
                        totalItems++;
                        itemsCreated++;
                      }

                      // When all items are created for this product
                      if (itemsCreated === content.variants.length) {
                        processedCount++;
                        if (processedCount === products.length) {
                          res.json({ 
                            message: 'Content seeding completed successfully',
                            sectionsCreated: totalSections,
                            itemsCreated: totalItems,
                            productsProcessed: products.length
                          });
                        }
                      }
                    }
                  );
                });

                // Handle case where variants array is empty
                if (content.variants.length === 0) {
                  processedCount++;
                  if (processedCount === products.length) {
                    res.json({ 
                      message: 'Content seeding completed',
                      sectionsCreated: totalSections,
                      itemsCreated: totalItems
                    });
                  }
                }
              }
            );
          }
        );
      });
    }
  );
});

// Add missing content sections to existing products (features, specifications, security, support, use_cases)
app.post('/api/admin/add-product-sections', (req, res) => {
  console.log('➕ Adding missing sections to products...');
  
  // Extended product content definitions with all sections
  const productSections = {
    'microsoft-365-licenses': {
      features: [
        { title: 'Email & Calendar', description: 'Professional business email with 50GB mailbox and shared calendars', item_type: 'feature_card' },
        { title: 'Office Apps', description: 'Access to Word, Excel, PowerPoint, and other Office applications', item_type: 'feature_card' },
        { title: 'Cloud Storage', description: '1TB OneDrive cloud storage per user for secure file access', item_type: 'feature_card' },
        { title: 'Microsoft Teams', description: 'Video conferencing, chat, and collaboration tools (where applicable)', item_type: 'feature_card' },
        { title: 'Security & Compliance', description: 'Advanced threat protection and data loss prevention', item_type: 'feature_card' },
        { title: 'Mobile Apps', description: 'Access your work from anywhere with mobile Office apps', item_type: 'feature_card' }
      ],
      specifications: [
        { title: 'Mailbox Size', description: '50GB per user mailbox', item_type: 'spec_card' },
        { title: 'OneDrive Storage', description: '1TB cloud storage per user', item_type: 'spec_card' },
        { title: 'User Limit', description: 'Up to 300 users per subscription', item_type: 'spec_card' },
        { title: 'Support', description: '24/7 Microsoft support included', item_type: 'spec_card' }
      ],
      security: [
        { title: 'Advanced Threat Protection', description: 'Protection against phishing, malware, and ransomware', item_type: 'security_feature' },
        { title: 'Data Loss Prevention', description: 'Prevent sensitive data from being shared inappropriately', item_type: 'security_feature' },
        { title: 'Encryption', description: 'Email and files encrypted at rest and in transit', item_type: 'security_feature' },
        { title: 'Compliance', description: 'Meet industry compliance standards including GDPR', item_type: 'security_feature' }
      ],
      support: [
        { title: '24/7 Support', description: 'Round-the-clock technical support from Microsoft', item_type: 'support_feature' },
        { title: 'Online Documentation', description: 'Comprehensive guides and tutorials', item_type: 'support_feature' },
        { title: 'Training Resources', description: 'Free training materials and webinars', item_type: 'support_feature' },
        { title: 'Community Forums', description: 'Access to user community and expert advice', item_type: 'support_feature' }
      ],
      use_cases: [
        { title: 'Small Businesses', description: 'Perfect for small teams needing professional email and Office apps', item_type: 'use_case' },
        { title: 'Remote Work', description: 'Enable seamless collaboration for distributed teams', item_type: 'use_case' },
        { title: 'Enterprise', description: 'Scalable solution for large organizations with advanced security', item_type: 'use_case' }
      ]
    },
    'acronis-server-backup': {
      features: [
        { title: 'Automated Backups', description: 'Schedule automatic backups with flexible retention policies', item_type: 'feature_card' },
        { title: 'Fast Recovery', description: 'Quick restore of files, folders, or entire systems', item_type: 'feature_card' },
        { title: 'Incremental Backups', description: 'Efficient storage with incremental backup technology', item_type: 'feature_card' },
        { title: 'Cloud Storage', description: 'Secure cloud storage with encryption and redundancy', item_type: 'feature_card' },
        { title: 'Centralized Management', description: 'Manage all backups from a single console', item_type: 'feature_card' },
        { title: 'Cross-Platform Support', description: 'Backup Windows, Linux, and virtual machines', item_type: 'feature_card' }
      ],
      specifications: [
        { title: 'Storage Options', description: '50GB to 500GB flexible storage plans', item_type: 'spec_card' },
        { title: 'Retention Policy', description: 'Customizable retention periods', item_type: 'spec_card' },
        { title: 'Backup Frequency', description: 'Daily, weekly, or custom schedules', item_type: 'spec_card' },
        { title: 'Recovery Time', description: 'Fast recovery within minutes', item_type: 'spec_card' }
      ],
      security: [
        { title: 'Encryption', description: 'End-to-end encryption with AES-256', item_type: 'security_feature' },
        { title: 'Secure Transfer', description: 'SSL/TLS encrypted data transfer', item_type: 'security_feature' },
        { title: 'Access Control', description: 'Role-based access control and authentication', item_type: 'security_feature' },
        { title: 'Compliance', description: 'Compliant with industry standards', item_type: 'security_feature' }
      ],
      support: [
        { title: '24/7 Support', description: 'Round-the-clock technical support', item_type: 'support_feature' },
        { title: 'Expert Team', description: 'Dedicated backup specialists', item_type: 'support_feature' },
        { title: 'Documentation', description: 'Comprehensive guides and best practices', item_type: 'support_feature' },
        { title: 'Monitoring', description: 'Proactive monitoring and alerts', item_type: 'support_feature' }
      ],
      use_cases: [
        { title: 'Server Protection', description: 'Protect critical server data and applications', item_type: 'use_case' },
        { title: 'Disaster Recovery', description: 'Ensure business continuity with reliable backups', item_type: 'use_case' },
        { title: 'Compliance', description: 'Meet regulatory requirements for data retention', item_type: 'use_case' }
      ]
    },
    'acronis-m365-backup': {
      features: [
        { title: 'Email Backup', description: 'Complete backup of Exchange Online mailboxes', item_type: 'feature_card' },
        { title: 'OneDrive Backup', description: 'Protect OneDrive for Business files', item_type: 'feature_card' },
        { title: 'SharePoint Backup', description: 'Backup SharePoint sites and documents', item_type: 'feature_card' },
        { title: 'Teams Backup', description: 'Backup Microsoft Teams conversations and files', item_type: 'feature_card' },
        { title: 'Granular Recovery', description: 'Restore individual items or entire mailboxes', item_type: 'feature_card' },
        { title: 'Point-in-Time Recovery', description: 'Restore data to any point in time', item_type: 'feature_card' }
      ],
      specifications: [
        { title: 'Per Seat Pricing', description: 'Simple per-user pricing model', item_type: 'spec_card' },
        { title: 'Retention', description: 'Flexible retention policies', item_type: 'spec_card' },
        { title: 'Backup Frequency', description: 'Multiple backups per day', item_type: 'spec_card' },
        { title: 'Storage', description: 'Unlimited cloud storage included', item_type: 'spec_card' }
      ],
      security: [
        { title: 'End-to-End Encryption', description: 'Data encrypted at rest and in transit', item_type: 'security_feature' },
        { title: 'Secure Authentication', description: 'OAuth 2.0 and multi-factor authentication', item_type: 'security_feature' },
        { title: 'Data Residency', description: 'Control where your backup data is stored', item_type: 'security_feature' },
        { title: 'Compliance', description: 'GDPR, HIPAA, and SOC 2 compliant', item_type: 'security_feature' }
      ],
      support: [
        { title: '24/7 Support', description: 'Round-the-clock technical support', item_type: 'support_feature' },
        { title: 'Setup Assistance', description: 'Free setup and configuration help', item_type: 'support_feature' },
        { title: 'Training', description: 'Training resources and webinars', item_type: 'support_feature' },
        { title: 'Documentation', description: 'Comprehensive guides and FAQs', item_type: 'support_feature' }
      ],
      use_cases: [
        { title: 'Email Protection', description: 'Protect against accidental deletion and retention policies', item_type: 'use_case' },
        { title: 'Compliance', description: 'Meet email retention and compliance requirements', item_type: 'use_case' },
        { title: 'Migration Support', description: 'Safe migration between tenants or accounts', item_type: 'use_case' }
      ]
    },
    'acronis-google-workspace-backup': {
      features: [
        { title: 'Gmail Backup', description: 'Complete backup of Gmail messages and attachments', item_type: 'feature_card' },
        { title: 'Drive Backup', description: 'Protect Google Drive files and folders', item_type: 'feature_card' },
        { title: 'Contacts Backup', description: 'Backup Google Contacts data', item_type: 'feature_card' },
        { title: 'Calendar Backup', description: 'Backup Google Calendar events', item_type: 'feature_card' },
        { title: 'Granular Recovery', description: 'Restore individual items or entire accounts', item_type: 'feature_card' },
        { title: 'Automated Backups', description: 'Set-and-forget automated backup schedules', item_type: 'feature_card' }
      ],
      specifications: [
        { title: 'Per Seat Pricing', description: 'Simple per-user pricing model', item_type: 'spec_card' },
        { title: 'Retention', description: 'Flexible retention policies', item_type: 'spec_card' },
        { title: 'Backup Frequency', description: 'Multiple backups per day', item_type: 'spec_card' },
        { title: 'Storage', description: 'Unlimited cloud storage included', item_type: 'spec_card' }
      ],
      security: [
        { title: 'End-to-End Encryption', description: 'Data encrypted at rest and in transit', item_type: 'security_feature' },
        { title: 'Secure Authentication', description: 'OAuth 2.0 and API-based access', item_type: 'security_feature' },
        { title: 'Data Residency', description: 'Control where your backup data is stored', item_type: 'security_feature' },
        { title: 'Compliance', description: 'GDPR and SOC 2 compliant', item_type: 'security_feature' }
      ],
      support: [
        { title: '24/7 Support', description: 'Round-the-clock technical support', item_type: 'support_feature' },
        { title: 'Setup Assistance', description: 'Free setup and configuration help', item_type: 'support_feature' },
        { title: 'Training', description: 'Training resources and webinars', item_type: 'support_feature' },
        { title: 'Documentation', description: 'Comprehensive guides and FAQs', item_type: 'support_feature' }
      ],
      use_cases: [
        { title: 'Data Protection', description: 'Protect against accidental deletion and data loss', item_type: 'use_case' },
        { title: 'Compliance', description: 'Meet email and data retention requirements', item_type: 'use_case' },
        { title: 'Migration', description: 'Safe migration between Google Workspace accounts', item_type: 'use_case' }
      ]
    },
    'anti-virus': {
      features: [
        { title: 'Real-Time Protection', description: 'Continuous monitoring and threat detection', item_type: 'feature_card' },
        { title: 'Advanced Threat Detection', description: 'AI-powered detection of unknown threats', item_type: 'feature_card' },
        { title: 'Endpoint Detection & Response', description: 'EDR capabilities for advanced threat hunting', item_type: 'feature_card' },
        { title: 'Behavioral Analysis', description: 'Detect suspicious behavior patterns', item_type: 'feature_card' },
        { title: 'Centralized Management', description: 'Manage all endpoints from one console', item_type: 'feature_card' },
        { title: 'Zero-Day Protection', description: 'Protect against new and unknown threats', item_type: 'feature_card' }
      ],
      specifications: [
        { title: 'Platform Support', description: 'Windows, Mac, Linux, and mobile support', item_type: 'spec_card' },
        { title: 'Deployment', description: 'Easy deployment and management', item_type: 'spec_card' },
        { title: 'Performance', description: 'Low system impact and resource usage', item_type: 'spec_card' },
        { title: 'Updates', description: 'Automatic threat definition updates', item_type: 'spec_card' }
      ],
      security: [
        { title: 'Multi-Layer Protection', description: 'Combines signature, behavioral, and AI detection', item_type: 'security_feature' },
        { title: 'Threat Intelligence', description: 'Global threat intelligence network', item_type: 'security_feature' },
        { title: 'Incident Response', description: 'Automated response and remediation', item_type: 'security_feature' },
        { title: 'Compliance', description: 'Meet security and compliance standards', item_type: 'security_feature' }
      ],
      support: [
        { title: '24/7 Support', description: 'Round-the-clock security support', item_type: 'support_feature' },
        { title: 'Security Experts', description: 'Dedicated security specialists', item_type: 'support_feature' },
        { title: 'Threat Intelligence', description: 'Regular threat reports and updates', item_type: 'support_feature' },
        { title: 'Training', description: 'Security awareness training resources', item_type: 'support_feature' }
      ],
      use_cases: [
        { title: 'Enterprise Protection', description: 'Protect enterprise endpoints from threats', item_type: 'use_case' },
        { title: 'Ransomware Protection', description: 'Specialized protection against ransomware attacks', item_type: 'use_case' },
        { title: 'Compliance', description: 'Meet security compliance requirements', item_type: 'use_case' }
      ]
    }
  };

  // Helper function to create a section and its items
  function createSectionWithItems(productId, sectionType, sectionTitle, sectionDesc, orderIndex, items, callback) {
    db.run(
      `INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [productId, sectionTitle, sectionDesc, sectionType, orderIndex],
      function(err) {
        if (err) {
          console.error(`Error creating ${sectionType} section:`, err.message);
          callback(err, null);
          return;
        }

        const sectionId = this.lastID;
        let itemsCreated = 0;
        let itemErrors = 0;

        if (!items || items.length === 0) {
          callback(null, { sectionId, itemsCount: 0 });
          return;
        }

        items.forEach((item, index) => {
          db.run(
            `INSERT INTO product_items (section_id, title, description, item_type, order_index, is_visible)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [sectionId, item.title, item.description, item.item_type, index],
            (itemErr) => {
              if (itemErr) {
                console.error(`Error creating item ${item.title}:`, itemErr.message);
                itemErrors++;
              } else {
                itemsCreated++;
              }

              if (itemsCreated + itemErrors === items.length) {
                callback(null, { sectionId, itemsCount: itemsCreated });
              }
            }
          );
        });
      }
    );
  }

  // Get all products with routes
  db.all('SELECT id, route FROM products WHERE route IN (?, ?, ?, ?, ?) AND is_visible = 1',
    ['microsoft-365-licenses', 'acronis-server-backup', 'acronis-m365-backup', 'acronis-google-workspace-backup', 'anti-virus'],
    (err, products) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (products.length === 0) {
        res.json({ message: 'No products found' });
        return;
      }

      let processedCount = 0;
      let totalSections = 0;
      let totalItems = 0;
      const sectionOrderMap = {
        'features': 2,
        'specifications': 3,
        'security': 4,
        'support': 5,
        'use_cases': 6
      };

      products.forEach((product) => {
        const sections = productSections[product.route];
        if (!sections) {
          processedCount++;
          if (processedCount === products.length) {
            res.json({
              message: 'Sections added successfully',
              sectionsCreated: totalSections,
              itemsCreated: totalItems
            });
          }
          return;
        }

        let sectionsCreated = 0;
        const sectionTypes = ['features', 'specifications', 'security', 'support', 'use_cases'];

        sectionTypes.forEach((sectionType) => {
          const items = sections[sectionType];
          if (!items) return;

          const sectionTitles = {
            'features': 'Key Features',
            'specifications': 'Technical Specifications',
            'security': 'Security & Compliance',
            'support': 'Support & Documentation',
            'use_cases': 'Use Cases'
          };

          const sectionDescs = {
            'features': 'Discover the powerful features that make this solution perfect for your needs',
            'specifications': 'Detailed technical specifications and requirements',
            'security': 'Enterprise-grade security features and compliance',
            'support': 'Comprehensive support options and resources',
            'use_cases': 'Perfect for these business scenarios'
          };

          createSectionWithItems(
            product.id,
            sectionType,
            sectionTitles[sectionType],
            sectionDescs[sectionType],
            sectionOrderMap[sectionType],
            items,
            (err, result) => {
              if (!err && result) {
                totalSections++;
                totalItems += result.itemsCount;
              }

              sectionsCreated++;
              if (sectionsCreated === sectionTypes.length) {
                processedCount++;
                if (processedCount === products.length) {
                  res.json({
                    message: 'Sections added successfully',
                    sectionsCreated: totalSections,
                    itemsCreated: totalItems,
                    productsProcessed: products.length
                  });
                }
              }
            }
          );
        });
      });
    }
  );
});

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

// Get visible products only - for frontend
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products WHERE is_visible = 1 ORDER BY order_index ASC', (err, products) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(products);
  });
});

// Get product by route slug
app.get('/api/products/by-route/:route', (req, res) => {
  const { route } = req.params;
  
  db.get('SELECT * FROM products WHERE route = ? AND is_visible = 1', [route], (err, product) => {
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

// Get product sections by route slug
app.get('/api/products/by-route/:route/sections', (req, res) => {
  const { route } = req.params;
  
  // First get the product ID from route
  db.get('SELECT id FROM products WHERE route = ? AND is_visible = 1', [route], (err, product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    // Then get sections for this product
    db.all(`
      SELECT * FROM product_sections 
      WHERE product_id = ? AND is_visible = 1 
      ORDER BY order_index ASC
    `, [product.id], (err, sections) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(sections);
    });
  });
});

// Get product items for a section by route slug
app.get('/api/products/by-route/:route/sections/:sectionId/items', (req, res) => {
  const { route, sectionId } = req.params;
  
  // First get the product ID from route
  db.get('SELECT id FROM products WHERE route = ? AND is_visible = 1', [route], (err, product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    // Then get items for this section
    db.all(`
      SELECT pi.* FROM product_items pi
      JOIN product_sections ps ON pi.section_id = ps.id
      WHERE ps.id = ? AND ps.product_id = ? AND pi.is_visible = 1
      ORDER BY pi.order_index ASC
    `, [sectionId, product.id], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(items);
    });
  });
});

// Get product variants (pricing items) by product route - for popup dropdown
app.get('/api/products/by-route/:route/variants', (req, res) => {
  const { route } = req.params;
  
  // Get product ID from route
  db.get('SELECT id, route FROM products WHERE route = ? AND is_visible = 1', [route], (err, product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    // Get pricing section for this product
    db.get(`
      SELECT id FROM product_sections 
      WHERE product_id = ? AND section_type = 'pricing' AND is_visible = 1 
      ORDER BY order_index ASC 
      LIMIT 1
    `, [product.id], (err, pricingSection) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (!pricingSection) {
        // No pricing section found, return empty array
        res.json([]);
        return;
      }
      
      // Get all pricing plan items from this section
      db.all(`
        SELECT pi.* FROM product_items pi
        WHERE pi.section_id = ? AND pi.item_type = 'pricing_plan' AND pi.is_visible = 1
        ORDER BY pi.order_index ASC
      `, [pricingSection.id], (err, items) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Parse content JSON and format items
        const variants = items.map(item => {
          let price = item.description || '';
          let parsedContent = {};
          
          if (item.content) {
            try {
              parsedContent = JSON.parse(item.content);
              price = parsedContent.price ? `${parsedContent.price}${parsedContent.period || '/month'}` : price;
            } catch (e) {
              // If parsing fails, use description as price
            }
          }
          
          return {
            id: item.id,
            name: item.title,
            price: price,
            route: product.route
          };
        });
        
        res.json(variants);
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
    db.run('UPDATE products SET is_visible = ? WHERE id = ?', [newVisibility, id], function(err) {
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

// Duplicate product with all sections and items
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
      INSERT INTO main_products_sections (product_id, title, description, is_visible, order_index) 
      VALUES (?, ?, ?, 1, ?)
    `, [productId, productName, productDescription, nextOrder], function(err) {
      if (err) {
        console.error('Error creating main products section:', err.message);
      } else {
        console.log(`✅ Created main products section for: ${productName}`);
      }
      callback(); // Always call callback to continue
    });
  });
}

// Helper function to create main page section for duplicated solution
function createMainSolutionSection(solutionId, solutionName, solutionDescription, callback) {
  // Get the next order index for main solutions sections
  db.get('SELECT MAX(order_index) as max_order FROM main_solutions_sections', (err, result) => {
    if (err) {
      console.error('Error getting max order for main solutions sections:', err.message);
      callback(); // Continue even if this fails
      return;
    }
    
    const nextOrder = (result.max_order || 0) + 1;
    
    // Insert new main page section
    db.run(`
      INSERT INTO main_solutions_sections (solution_id, title, description, is_visible, order_index) 
      VALUES (?, ?, ?, 1, ?)
    `, [solutionId, solutionName, solutionDescription, nextOrder], function(err) {
      if (err) {
        console.error('Error creating main solutions section:', err.message);
      } else {
        console.log(`✅ Created main solutions section for: ${solutionName}`);
      }
      callback(); // Always call callback to continue
    });
  });
}

app.post('/api/products/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const { newName, newRoute } = req.body;
  
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
      
      // Generate a proper route for the duplicate
      const duplicateName = newName || `${originalProduct.name} (Copy)`;
      const duplicateRoute = newRoute || duplicateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      // Create the duplicate product
      db.run(`INSERT INTO products (name, description, category, color, border_color, order_index, gradient_start, gradient_end, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [duplicateName, originalProduct.description, originalProduct.category, originalProduct.color, originalProduct.border_color, nextOrder, originalProduct.gradient_start, originalProduct.gradient_end, 1], 
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          const duplicateProductId = this.lastID;
          
          // Duplicate all sections
          db.all('SELECT * FROM product_sections WHERE product_id = ?', [id], (err, sections) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            
            let sectionsProcessed = 0;
            const sectionMapping = {}; // Map original section ID to new section ID
            
            if (sections.length === 0) {
              // Create main page section even if no sections exist
              createMainProductSection(duplicateProductId, duplicateName, originalProduct.description, () => {
                res.json({ 
                  message: 'Product duplicated successfully', 
                  id: duplicateProductId,
                  sectionsDuplicated: 0,
                  itemsDuplicated: 0
                });
              });
              return;
            }
            
            sections.forEach((section) => {
              db.run(`INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?)`, 
                [duplicateProductId, section.title, section.description, section.section_type, section.order_index, section.is_visible], 
                function(err) {
                  if (err) {
                    console.error('Error duplicating section:', err.message);
                    return;
                  }
                  
                  sectionMapping[section.id] = this.lastID;
                  sectionsProcessed++;
                  
                  if (sectionsProcessed === sections.length) {
                    // All sections duplicated, now duplicate items
                    duplicateSectionItems(sectionMapping, duplicateProductId, duplicateName, originalProduct.description);
                  }
                });
            });
          });
        });
    });
  });
  
  function duplicateSectionItems(sectionMapping, duplicateProductId, productName, productDescription) {
    let totalItems = 0;
    let itemsProcessed = 0;
    
    // Count total items to duplicate
    Object.keys(sectionMapping).forEach((originalSectionId) => {
      db.all('SELECT COUNT(*) as count FROM product_items WHERE section_id = ?', [originalSectionId], (err, result) => {
        if (err) {
          console.error('Error counting items:', err.message);
          return;
        }
        totalItems += result[0].count;
        
        // If this is the last section, start duplicating items
        if (Object.keys(sectionMapping).indexOf(originalSectionId) === Object.keys(sectionMapping).length - 1) {
          duplicateItems();
        }
      });
    });
    
    function duplicateItems() {
      Object.keys(sectionMapping).forEach((originalSectionId) => {
        const newSectionId = sectionMapping[originalSectionId];
        
        // Get the original section to check its type
        db.get('SELECT section_type FROM product_sections WHERE id = ?', [originalSectionId], (err, sectionInfo) => {
          if (err) {
            console.error('Error getting section info:', err.message);
            return;
          }
          
          const isHeroSection = sectionInfo && sectionInfo.section_type === 'hero';
          
          db.all('SELECT * FROM product_items WHERE section_id = ?', [originalSectionId], (err, items) => {
            if (err) {
              console.error('Error getting items:', err.message);
              return;
            }
            
            items.forEach((item) => {
              // Skip title and description items in hero sections to prevent conflicts
              // The hero component will use section-level data instead
              if (isHeroSection && (item.item_type === 'title' || item.item_type === 'description')) {
                itemsProcessed++;
                
                if (itemsProcessed === totalItems) {
                  // Create main page section for the duplicated product
                  createMainProductSection(duplicateProductId, productName, productDescription, () => {
                    res.json({
                      message: 'Product duplicated successfully',
                      id: duplicateProductId,
                      sectionsDuplicated: Object.keys(sectionMapping).length,
                      itemsDuplicated: totalItems
                    });
                  });
                }
                return;
              }
              
              db.run(`INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                [newSectionId, item.title, item.description, item.content, item.item_type, item.icon, item.order_index, item.is_visible], 
                function(err) {
                  if (err) {
                    console.error('Error duplicating item:', err.message);
                    return;
                  }
                  
                  itemsProcessed++;
                  
                  if (itemsProcessed === totalItems) {
                    // Create main page section for the duplicated product
                    createMainProductSection(duplicateProductId, productName, productDescription, () => {
                      res.json({ 
                        message: 'Product duplicated successfully', 
                        id: duplicateProductId,
                        sectionsDuplicated: Object.keys(sectionMapping).length,
                        itemsDuplicated: totalItems
                      });
                    });
                  }
                });
            });
          });
        });
      });
    }
  }
});

// Product Sections API Routes

// Get all product sections for a specific product
app.get('/api/products/:productId/sections', (req, res) => {
  const { productId } = req.params;
  
  db.all(`
    SELECT * FROM product_sections 
    WHERE product_id = ? AND is_visible = 1 
    ORDER BY order_index ASC
  `, [productId], (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(sections);
  });
});

// Get all product sections for admin (including hidden)
app.get('/api/admin/products/:productId/sections', (req, res) => {
  const { productId } = req.params;
  
  db.all(`
    SELECT * FROM product_sections 
    WHERE product_id = ? 
    ORDER BY order_index ASC
  `, [productId], (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(sections);
  });
});

// Get single product section
app.get('/api/products/:productId/sections/:sectionId', (req, res) => {
  const { productId, sectionId } = req.params;
  
  db.get(`
    SELECT * FROM product_sections 
    WHERE id = ? AND product_id = ?
  `, [sectionId, productId], (err, section) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!section) {
      res.status(404).json({ error: 'Product section not found' });
      return;
    }
    res.json(section);
  });
});

// Create new product section
app.post('/api/products/:productId/sections', (req, res) => {
  const { productId } = req.params;
  const { title, description, section_type, order_index } = req.body;
  
  // Get the next order index if not provided
  const getNextOrder = () => {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT MAX(order_index) as max_order 
        FROM product_sections 
        WHERE product_id = ?
      `, [productId], (err, result) => {
        if (err) reject(err);
        else resolve((result.max_order || -1) + 1);
      });
    });
  };
  
  const finalOrderIndex = order_index !== undefined ? order_index : getNextOrder();
  
  db.run(`
    INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible)
    VALUES (?, ?, ?, ?, ?, 1)
  `, [productId, title, description, section_type, finalOrderIndex], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ 
      id: this.lastID, 
      message: 'Product section created successfully' 
    });
  });
});

// Update product section
app.put('/api/products/:productId/sections/:sectionId', (req, res) => {
  const { productId, sectionId } = req.params;
  const { title, description, section_type, order_index, is_visible } = req.body;
  
  db.run(`
    UPDATE product_sections SET 
      title = ?, 
      description = ?, 
      section_type = ?, 
      order_index = ?,
      is_visible = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND product_id = ?
  `, [title, description, section_type, order_index, is_visible, sectionId, productId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product section updated successfully', changes: this.changes });
  });
});

// Delete product section
app.delete('/api/products/:productId/sections/:sectionId', (req, res) => {
  const { productId, sectionId } = req.params;
  
  db.run(`
    DELETE FROM product_sections 
    WHERE id = ? AND product_id = ?
  `, [sectionId, productId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product section deleted successfully', changes: this.changes });
  });
});

// Toggle product section visibility
app.patch('/api/products/:productId/sections/:sectionId/toggle-visibility', (req, res) => {
  const { productId, sectionId } = req.params;
  
  db.run(`
    UPDATE product_sections 
    SET is_visible = NOT is_visible, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND product_id = ?
  `, [sectionId, productId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product section visibility toggled successfully', changes: this.changes });
  });
});

// Product Items API Routes

// Get all items for a specific product section
app.get('/api/products/:productId/sections/:sectionId/items', (req, res) => {
  const { productId, sectionId } = req.params;
  
  db.all(`
    SELECT pi.* FROM product_items pi
    JOIN product_sections ps ON pi.section_id = ps.id
    WHERE ps.id = ? AND ps.product_id = ? AND pi.is_visible = 1
    ORDER BY pi.order_index ASC
  `, [sectionId, productId], (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items);
  });
});

// Get all items for admin (including hidden)
app.get('/api/admin/products/:productId/sections/:sectionId/items', (req, res) => {
  const { productId, sectionId } = req.params;
  
  db.all(`
    SELECT pi.* FROM product_items pi
    JOIN product_sections ps ON pi.section_id = ps.id
    WHERE ps.id = ? AND ps.product_id = ?
    ORDER BY pi.order_index ASC
  `, [sectionId, productId], (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items);
  });
});

// Get single product item
app.get('/api/products/:productId/sections/:sectionId/items/:itemId', (req, res) => {
  const { productId, sectionId, itemId } = req.params;
  
  db.get(`
    SELECT pi.* FROM product_items pi
    JOIN product_sections ps ON pi.section_id = ps.id
    WHERE pi.id = ? AND ps.id = ? AND ps.product_id = ?
  `, [itemId, sectionId, productId], (err, item) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!item) {
      res.status(404).json({ error: 'Product item not found' });
      return;
    }
    res.json(item);
  });
});

// Create new product item
app.post('/api/products/:productId/sections/:sectionId/items', (req, res) => {
  const { productId, sectionId } = req.params;
  const { title, description, content, item_type, icon, order_index } = req.body;
  
  // Get the next order index if not provided
  const getNextOrder = () => {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT MAX(order_index) as max_order 
        FROM product_items 
        WHERE section_id = ?
      `, [sectionId], (err, result) => {
        if (err) reject(err);
        else resolve((result.max_order || -1) + 1);
      });
    });
  };
  
  const finalOrderIndex = order_index !== undefined ? order_index : getNextOrder();
  
  db.run(`
    INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `, [sectionId, title, description, content, item_type, icon, finalOrderIndex], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ 
      id: this.lastID, 
      message: 'Product item created successfully' 
    });
  });
});

// Update product item
app.put('/api/products/:productId/sections/:sectionId/items/:itemId', (req, res) => {
  const { productId, sectionId, itemId } = req.params;
  const { title, description, content, item_type, icon, order_index, is_visible } = req.body;
  
  db.run(`
    UPDATE product_items SET 
      title = ?, 
      description = ?, 
      content = ?, 
      item_type = ?, 
      icon = ?, 
      order_index = ?,
      is_visible = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND section_id = ?
  `, [title, description, content, item_type, icon, order_index, is_visible, itemId, sectionId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product item updated successfully', changes: this.changes });
  });
});

// Delete product item
app.delete('/api/products/:productId/sections/:sectionId/items/:itemId', (req, res) => {
  const { productId, sectionId, itemId } = req.params;
  
  db.run(`
    DELETE FROM product_items 
    WHERE id = ? AND section_id = ?
  `, [itemId, sectionId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product item deleted successfully', changes: this.changes });
  });
});

// Toggle product item visibility
app.patch('/api/products/:productId/sections/:sectionId/items/:itemId/toggle-visibility', (req, res) => {
  const { productId, sectionId, itemId } = req.params;
  
  db.run(`
    UPDATE product_items 
    SET is_visible = CASE 
      WHEN is_visible = 1 THEN 0 
      ELSE 1 
    END, 
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND section_id = ?
  `, [itemId, sectionId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product item visibility toggled successfully', changes: this.changes });
  });
});

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

// Solutions API Routes

// Get all solutions
// Get all solutions (including hidden) - for admin panel
app.get('/api/admin/solutions', (req, res) => {
  db.all('SELECT * FROM solutions ORDER BY order_index ASC', (err, solutions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(solutions);
  });
});

app.get('/api/solutions', (req, res) => {
  db.all('SELECT * FROM solutions WHERE is_visible = 1 ORDER BY order_index ASC', (err, solutions) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(solutions);
  });
});

// Get single solution
app.get('/api/solutions/:id', (req, res) => {
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
  const { name, description, category, color, border_color, route } = req.body;
  
  // Your 4 perfect colors (only these will be used)
  const gradientColors = [
    { start: 'blue', end: 'blue-100' },      // Financial Services
    { start: 'purple', end: 'purple-100' },  // Financial Services (Copy)
    { start: 'green', end: 'green-100' },    // Retail
    { start: 'orange', end: 'orange-100' }   // Healthcare
  ];
  
  // Get the next order index and count existing solutions for gradient assignment
  db.get('SELECT MAX(order_index) as max_order, COUNT(*) as total_count FROM solutions', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = (result.max_order || -1) + 1;
    const totalCount = result.total_count || 0;
    
    // Assign gradient color based on total count (cycles through palette)
    const gradientIndex = totalCount % gradientColors.length;
    const gradient = gradientColors[gradientIndex];
    
    db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index, gradient_start, gradient_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [name, description, category, color, border_color, route, nextOrder, gradient.start, gradient.end], 
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ 
          message: 'Solution created successfully', 
          id: this.lastID,
          changes: this.changes,
          gradient: gradient
        });
      });
  });
});

// Update solution
app.put('/api/solutions/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, color, border_color, route, gradient_start, gradient_end } = req.body;
  
  db.run(`UPDATE solutions SET 
    name = ?, 
    description = ?, 
    category = ?, 
    color = ?, 
    border_color = ?, 
    route = ?,
    gradient_start = ?,
    gradient_end = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, 
    [name, description, category, color, border_color, route, gradient_start, gradient_end, id], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Solution updated successfully', changes: this.changes });
    });
});

// Delete solution
app.delete('/api/solutions/:id', (req, res) => {
  const { id } = req.params;
  
  // First delete all section items for this solution's sections
  db.run(`DELETE FROM section_items WHERE section_id IN (SELECT id FROM solution_sections WHERE solution_id = ?)`, [id], (err) => {
    if (err) {
      console.error('Error deleting section items:', err.message);
      // Continue with deletion even if section items fail
    }
    
    // Then delete all sections for this solution
    db.run(`DELETE FROM solution_sections WHERE solution_id = ?`, [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Finally delete the solution
      db.run(`DELETE FROM solutions WHERE id = ?`, [id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Solution deleted successfully', changes: this.changes });
      });
    });
  });
});

// Toggle solution visibility
app.put('/api/solutions/:id/toggle-visibility', (req, res) => {
  const { id } = req.params;
  
  // Get current visibility status
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
    
    // Update visibility
    db.run('UPDATE solutions SET is_visible = ? WHERE id = ?', [newVisibility, id], function(err) {
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

// Helper function to duplicate section items
function duplicateSectionItems(originalSolutionId, sectionIdMap, newSolutionId, solutionName, solutionDescription, res) {
  // Get all section items for the original solution
  const originalSectionIds = Array.from(sectionIdMap.keys());
  const placeholders = originalSectionIds.map(() => '?').join(',');
  
  db.all(`SELECT * FROM section_items WHERE section_id IN (${placeholders}) ORDER BY section_id, order_index`, originalSectionIds, (err, items) => {
    if (err) {
      console.error('Error fetching section items:', err.message);
      res.json({ 
        message: 'Solution duplicated successfully (sections only)', 
        id: newSolutionId,
        warning: 'Section items could not be duplicated'
      });
      return;
    }
    
    if (items.length === 0) {
      // Create main page section for the duplicated solution
      createMainSolutionSection(newSolutionId, solutionName, solutionDescription, () => {
        res.json({ 
          message: 'Solution duplicated successfully', 
          id: newSolutionId
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
            message: 'Solution duplicated successfully', 
            id: newSolutionId,
            warning: 'Some section items could not be duplicated'
          });
        }
        return;
      }
      
      db.run(`INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [newSectionId, item.item_type, item.title, item.description, item.icon, item.value, item.label, item.features, item.order_index], 
        function(err) {
          if (err) {
            console.error('Error duplicating section item:', err.message);
          }
          completed++;
          if (completed === items.length) {
            // Create main page section for the duplicated solution
            createMainSolutionSection(newSolutionId, solutionName, solutionDescription, () => {
              res.json({ 
                message: 'Solution duplicated successfully', 
                id: newSolutionId
              });
            });
          }
        });
    });
  });
}

// Duplicate solution
app.post('/api/solutions/:id/duplicate', (req, res) => {
  const { id } = req.params;
  const { newName, newRoute } = req.body;
  
  // Get the original solution
  db.get('SELECT * FROM solutions WHERE id = ?', [id], (err, originalSolution) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!originalSolution) {
      res.status(404).json({ error: 'Solution not found' });
      return;
    }
    
    // Get the next order index
    db.get('SELECT MAX(order_index) as max_order FROM solutions', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const nextOrder = (result.max_order || -1) + 1;
      
      // Generate a proper route for the duplicate
      const duplicateName = newName || `${originalSolution.name} (Copy)`;
      const duplicateRoute = newRoute || duplicateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      // Create the duplicate solution
      db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index, gradient_start, gradient_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [duplicateName, originalSolution.description, originalSolution.category, originalSolution.color, originalSolution.border_color, duplicateRoute, nextOrder, originalSolution.gradient_start, originalSolution.gradient_end], 
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          const newSolutionId = this.lastID;
          
          // Duplicate all sections
          db.all('SELECT * FROM solution_sections WHERE solution_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            
            if (sections.length === 0) {
              // Create main page section even if no sections exist
              createMainSolutionSection(newSolutionId, duplicateName, originalSolution.description, () => {
                res.json({ 
                  message: 'Solution duplicated successfully', 
                  id: newSolutionId,
                  changes: this.changes 
                });
              });
              return;
            }
            
            let completed = 0;
            const sectionIdMap = new Map(); // Map old section IDs to new section IDs
            
            sections.forEach((section, index) => {
              db.run(`INSERT INTO solution_sections (solution_id, section_type, title, content, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?)`, 
                [newSolutionId, section.section_type, section.title, section.content, section.order_index, section.is_visible], 
                function(err) {
                  if (err) {
                    console.error('Error duplicating section:', err.message);
                    completed++;
                    if (completed === sections.length) {
                      res.json({ 
                        message: 'Solution duplicated successfully', 
                        id: newSolutionId,
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
                    duplicateSectionItems(id, sectionIdMap, newSolutionId, duplicateName, originalSolution.description, res);
                  }
                });
            });
          });
        });
    });
  });
});

// Solution Sections API Routes

// Get all sections for a solution
app.get('/api/solutions/:id/sections', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM solution_sections WHERE solution_id = ? ORDER BY order_index ASC', [id], (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(sections);
  });
});

// Get single section
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

// Create new section
app.post('/api/solutions/:id/sections', (req, res) => {
  const { id } = req.params;
  const { section_type, title, content } = req.body;
  
  // Get the next order index for this solution
  db.get('SELECT MAX(order_index) as max_order FROM solution_sections WHERE solution_id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = (result.max_order || -1) + 1;
    
    db.run(`INSERT INTO solution_sections (solution_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`, 
      [id, section_type, title, content, nextOrder], 
      function(err) {
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

// Update section
app.put('/api/solutions/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  const { section_type, title, content, is_visible } = req.body;
  
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
  
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(sectionId, id);
  
  const query = `UPDATE solution_sections SET ${updateFields.join(', ')} WHERE id = ? AND solution_id = ?`;
  
  db.run(query, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section updated successfully', changes: this.changes });
  });
});

// Delete section
app.delete('/api/solutions/:id/sections/:sectionId', (req, res) => {
  const { id, sectionId } = req.params;
  
  db.run(`DELETE FROM solution_sections WHERE id = ? AND solution_id = ?`, [sectionId, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section deleted successfully', changes: this.changes });
  });
});

// Section Items API Routes

// Get all items for a specific section
app.get('/api/solutions/:id/sections/:sectionId/items', (req, res) => {
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
app.post('/api/solutions/:id/sections/:sectionId/items', (req, res) => {
  const { sectionId } = req.params;
  const { item_type, title, description, icon, value, label, features } = req.body;
  
  // Get next order index
  db.get('SELECT MAX(order_index) as max_order FROM section_items WHERE section_id = ?', [sectionId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = (result.max_order || -1) + 1;
    
    db.run(`INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [sectionId, item_type, title, description, icon, value, label, features, nextOrder], 
      function(err) {
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
app.put('/api/solutions/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { itemId, sectionId } = req.params;
  const { item_type, title, description, icon, value, label, features } = req.body;
  
  db.run(`UPDATE section_items SET 
    item_type = ?, 
    title = ?, 
    description = ?,
    icon = ?,
    value = ?,
    label = ?,
    features = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND section_id = ?`, 
    [item_type, title, description, icon, value, label, features, itemId, sectionId], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Section item updated successfully', changes: this.changes });
    });
});

// Delete section item
app.delete('/api/solutions/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const { itemId, sectionId } = req.params;
  
  db.run(`DELETE FROM section_items WHERE id = ? AND section_id = ?`, [itemId, sectionId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Section item deleted successfully', changes: this.changes });
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
  const { title, description } = req.body;
  
  db.run('UPDATE pricing_hero SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, id], function(err) {
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
      function(err) {
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
    function(err) {
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
  
  db.run('UPDATE pricing_categories SET is_active = 0 WHERE id = ?', [id], function(err) {
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
      function(err) {
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
    function(err) {
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
  
  db.run('UPDATE pricing_subcategories SET is_active = 0 WHERE id = ?', [id], function(err) {
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
      
      [...basicPlans.map(p => ({...p, plan_type: 'basic'})),
       ...cpuIntensivePlans.map(p => ({...p, plan_type: 'cpuIntensive'})),
       ...memoryIntensivePlans.map(p => ({...p, plan_type: 'memoryIntensive'}))].forEach((plan, index) => {
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
  const { plan_type, name, vcpu, memory, monthly_price, hourly_price, order_index } = req.body;
  
  db.get('SELECT MAX(order_index) as max_order FROM compute_plans WHERE plan_type = ?', [plan_type], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = order_index !== undefined ? order_index : ((result?.max_order || -1) + 1);
    
    db.run(`INSERT INTO compute_plans (plan_type, name, vcpu, memory, monthly_price, hourly_price, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [plan_type, name, vcpu, memory, monthly_price, hourly_price, nextOrder],
      function(err) {
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
  const { plan_type, name, vcpu, memory, monthly_price, hourly_price, order_index } = req.body;
  
  db.run(`UPDATE compute_plans SET
          plan_type = ?, name = ?, vcpu = ?, memory = ?, monthly_price = ?, hourly_price = ?,
          order_index = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [plan_type, name, vcpu, memory, monthly_price, hourly_price, order_index || 0, id],
    function(err) {
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
  
  db.run('UPDATE compute_plans SET is_active = 0 WHERE id = ?', [id], function(err) {
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
  const { name, storage_type, size, monthly_price, hourly_price, order_index } = req.body;
  
  db.get('SELECT MAX(order_index) as max_order FROM disk_offerings', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = order_index !== undefined ? order_index : ((result?.max_order || -1) + 1);
    
    db.run(`INSERT INTO disk_offerings (name, storage_type, size, monthly_price, hourly_price, order_index)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [name, storage_type, size, monthly_price, hourly_price, nextOrder],
      function(err) {
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
  const { name, storage_type, size, monthly_price, hourly_price, order_index } = req.body;
  
  db.run(`UPDATE disk_offerings SET
          name = ?, storage_type = ?, size = ?, monthly_price = ?, hourly_price = ?,
          order_index = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [name, storage_type, size, monthly_price, hourly_price, order_index || 0, id],
    function(err) {
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
  
  db.run('UPDATE disk_offerings SET is_active = 0 WHERE id = ?', [id], function(err) {
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

// Create pricing plan
app.post('/api/pricing/subcategories/:subcategoryId/plans', (req, res) => {
  const { subcategoryId } = req.params;
  const { ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular } = req.body;
  
  db.run(`INSERT INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [subcategoryId, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, instance_type, nodes, is_popular || 0],
    function(err) {
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
    function(err) {
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
  
  db.run('UPDATE pricing_plans SET is_active = 0 WHERE id = ?', [id], function(err) {
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
    [name, description, price_per_gb, JSON.stringify(features)], function(err) {
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
    [name, description, price_per_gb, JSON.stringify(features), id], function(err) {
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
    [question, answer], function(err) {
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
    [question, answer, id], function(err) {
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
  
  db.run('UPDATE pricing_faqs SET is_active = 0 WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'FAQ deleted successfully', changes: this.changes });
  });
});

// ===== MAIN PAGES API ENDPOINTS =====

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
      description: 'Discover our comprehensive suite of cloud computing services designed to power your business transformation.'
    };
    
    // Get product sections - show all if "all" query param is present (for admin)
    // Include all new fields: popular_tag, category, features, price, price_period, free_trial_tag, button_text
    // Also include product route for URL generation
    const sectionsQuery = all === 'true' 
      ? `
        SELECT 
          mps.*, 
          COALESCE(p.name, mps.title) as product_name, 
          COALESCE(p.description, mps.description) as product_description,
          COALESCE(mps.category, p.category) as category,
          p.route as product_route,
          COALESCE(mps.popular_tag, 'Most Popular') as popular_tag,
          COALESCE(mps.features, '[]') as features,
          COALESCE(mps.price, '₹2,999') as price,
          COALESCE(mps.price_period, '/month') as price_period,
          COALESCE(mps.free_trial_tag, 'Free Trial') as free_trial_tag,
          COALESCE(mps.button_text, 'Explore Solution') as button_text
        FROM main_products_sections mps
        LEFT JOIN products p ON mps.product_id = p.id
        ORDER BY mps.order_index ASC
      `
      : `
        SELECT 
          mps.*, 
          COALESCE(p.name, mps.title) as product_name, 
          COALESCE(p.description, mps.description) as product_description,
          COALESCE(mps.category, p.category) as category,
          p.route as product_route,
          COALESCE(mps.popular_tag, 'Most Popular') as popular_tag,
          COALESCE(mps.features, '[]') as features,
          COALESCE(mps.price, '₹2,999') as price,
          COALESCE(mps.price_period, '/month') as price_period,
          COALESCE(mps.free_trial_tag, 'Free Trial') as free_trial_tag,
          COALESCE(mps.button_text, 'Explore Solution') as button_text
        FROM main_products_sections mps
        LEFT JOIN products p ON mps.product_id = p.id
        WHERE mps.is_visible = 1 AND (p.is_visible = 1 OR p.id IS NULL)
        ORDER BY mps.order_index ASC
      `;
    
    db.all(sectionsQuery, (err, sections) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Parse features JSON for each section
      const parsedSections = (sections || []).map(section => {
        try {
          section.features = typeof section.features === 'string' 
            ? JSON.parse(section.features) 
            : (Array.isArray(section.features) ? section.features : []);
        } catch (e) {
          section.features = [];
        }
        return section;
      });
      
      mainPageData.sections = parsedSections;
      res.json(mainPageData);
    });
  });
});

// Get main solutions page content
app.get('/api/main-solutions', (req, res) => {
  const mainPageData = {};
  const { all } = req.query; // For admin view, show all sections including hidden
  
  // Get hero content
  db.get('SELECT * FROM main_solutions_content WHERE id = 1', (err, heroContent) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    mainPageData.hero = heroContent || {
      title: 'Our Solutions',
      subtitle: 'Enterprise Solutions - Made in India',
      description: 'Explore our enterprise-grade solutions designed to transform your business operations.',
      stat1_label: 'Global Customers',
      stat1_value: '10K+',
      stat2_label: 'Uptime SLA', 
      stat2_value: '99.9%',
      stat3_label: 'Data Centers',
      stat3_value: '15+',
      stat4_label: 'Support Rating',
      stat4_value: '4.9★'
    };
    
    // Get solution sections - show all if "all" query param is present (for admin)
    // Include all new fields: popular_tag, category, features, price, price_period, free_trial_tag, button_text
    const sectionsQuery = all === 'true' 
      ? `
        SELECT 
          mss.*, 
          COALESCE(s.name, mss.title) as solution_name, 
          COALESCE(s.description, mss.description) as solution_description,
          COALESCE(mss.category, s.category) as category,
          COALESCE(mss.popular_tag, 'Most Popular') as popular_tag,
          COALESCE(mss.features, '[]') as features,
          COALESCE(mss.price, '₹2,999') as price,
          COALESCE(mss.price_period, '/month') as price_period,
          COALESCE(mss.free_trial_tag, 'Free Trial') as free_trial_tag,
          COALESCE(mss.button_text, 'Explore Solution') as button_text
        FROM main_solutions_sections mss
        LEFT JOIN solutions s ON mss.solution_id = s.id
        ORDER BY mss.order_index ASC
      `
      : `
        SELECT 
          mss.*, 
          COALESCE(s.name, mss.title) as solution_name, 
          COALESCE(s.description, mss.description) as solution_description,
          COALESCE(mss.category, s.category) as category,
          COALESCE(mss.popular_tag, 'Most Popular') as popular_tag,
          COALESCE(mss.features, '[]') as features,
          COALESCE(mss.price, '₹2,999') as price,
          COALESCE(mss.price_period, '/month') as price_period,
          COALESCE(mss.free_trial_tag, 'Free Trial') as free_trial_tag,
          COALESCE(mss.button_text, 'Explore Solution') as button_text
        FROM main_solutions_sections mss
        LEFT JOIN solutions s ON mss.solution_id = s.id
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
  ], function(err) {
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
      ], function(err) {
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
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      // Insert if doesn't exist
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
      ], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Main solutions hero content created successfully' });
      });
    } else {
      res.json({ message: 'Main solutions hero content updated successfully' });
    }
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
    UPDATE main_products_sections 
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
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Main products section updated successfully', changes: this.changes });
  });
});

// Add main solutions sections columns if they don't exist
function addMainSolutionsSectionColumns() {
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
    db.run(`ALTER TABLE main_solutions_sections ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName} to main_solutions_sections:`, err.message);
      } else if (!err) {
        console.log(`✅ Added column ${columnName} to main_solutions_sections`);
      }
    });
  });

  // Set default values for existing records
  setTimeout(() => {
    db.run(`
      UPDATE main_solutions_sections 
      SET 
        popular_tag = CASE WHEN popular_tag IS NULL THEN 'Most Popular' ELSE popular_tag END,
        features = CASE WHEN features IS NULL THEN '[]' ELSE features END,
        price = CASE WHEN price IS NULL THEN '₹2,999' ELSE price END,
        price_period = CASE WHEN price_period IS NULL THEN '/month' ELSE price_period END,
        free_trial_tag = CASE WHEN free_trial_tag IS NULL THEN 'Free Trial' ELSE free_trial_tag END,
        button_text = CASE WHEN button_text IS NULL THEN 'Explore Solution' ELSE button_text END
      WHERE popular_tag IS NULL OR features IS NULL OR price IS NULL OR price_period IS NULL OR free_trial_tag IS NULL OR button_text IS NULL
    `, (err) => {
      if (err) {
        console.error('Error setting default values for main_solutions_sections:', err.message);
      } else {
        console.log('✅ Set default values for main_solutions_sections');
      }
    });
  }, 1000);
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
  
  // Convert features array to JSON string if it's an array
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
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Main solutions section updated successfully', changes: this.changes });
  });
});

// Get all main products sections (including hidden ones for admin)
app.get('/api/main-products/sections/all', (req, res) => {
  db.all(`
    SELECT mps.*, p.name as product_name, p.description as product_description, p.category
    FROM main_products_sections mps
    JOIN products p ON mps.product_id = p.id
    ORDER BY mps.order_index ASC
  `, (err, sections) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(sections || []);
  });
});

// Duplicate main products section
app.post('/api/main-products/sections/:sectionId/duplicate', (req, res) => {
  const { sectionId } = req.params;
  
  // Get the original section with all fields
  db.get(`
    SELECT mps.*, p.name as product_name, p.description as product_description 
    FROM main_products_sections mps
    JOIN products p ON mps.product_id = p.id
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
      
      // Create duplicate section with all fields
      db.run(`
        INSERT INTO main_products_sections (
          product_id, title, description, is_visible, order_index,
          popular_tag, category, features, price, price_period, free_trial_tag, button_text
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        originalSection.product_id, 
        `${originalSection.title} (Copy)`, 
        originalSection.description || null, 
        originalSection.is_visible !== undefined ? originalSection.is_visible : 1, 
        nextOrder,
        originalSection.popular_tag || null,
        originalSection.category || null,
        originalSection.features || '[]',
        originalSection.price || null,
        originalSection.price_period || null,
        originalSection.free_trial_tag || null,
        originalSection.button_text || null
      ], function(err) {
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

// Delete main products section
app.delete('/api/main-products/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;
  
  db.run('DELETE FROM main_products_sections WHERE id = ?', [sectionId], function(err) {
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
app.patch('/api/main-products/sections/:sectionId/toggle-visibility', (req, res) => {
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
    
    const newVisibility = section.is_visible === 1 ? 0 : 1;
    
    db.run(`
      UPDATE main_products_sections 
      SET is_visible = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [newVisibility, sectionId], function(err) {
      if (err) {
        console.error('Error toggling visibility:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({ 
        message: `Section ${newVisibility === 1 ? 'shown' : 'hidden'} successfully`, 
        is_visible: newVisibility,
        changes: this.changes 
      });
    });
  });
});

// Get all main solutions sections (including hidden ones for admin)
app.get('/api/main-solutions/sections/all', (req, res) => {
  db.all(`
    SELECT 
      mss.*, 
      COALESCE(s.name, mss.title) as solution_name, 
      COALESCE(s.description, mss.description) as solution_description,
      COALESCE(mss.category, s.category) as category,
      COALESCE(mss.popular_tag, 'Most Popular') as popular_tag,
      COALESCE(mss.features, '[]') as features,
      COALESCE(mss.price, '₹2,999') as price,
      COALESCE(mss.price_period, '/month') as price_period,
      COALESCE(mss.free_trial_tag, 'Free Trial') as free_trial_tag,
      COALESCE(mss.button_text, 'Explore Solution') as button_text
    FROM main_solutions_sections mss
    LEFT JOIN solutions s ON mss.solution_id = s.id
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

// Duplicate main solutions section
app.post('/api/main-solutions/sections/:sectionId/duplicate', (req, res) => {
  const { sectionId } = req.params;
  
  // Get the original section with all fields
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
    
    // Get the next order index
    db.get('SELECT MAX(order_index) as max_order FROM main_solutions_sections', (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const nextOrder = (result.max_order || 0) + 1;
      
      // Create duplicate section with all fields
      db.run(`
        INSERT INTO main_solutions_sections (
          solution_id, title, description, is_visible, order_index,
          popular_tag, category, features, price, price_period, free_trial_tag, button_text
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        originalSection.solution_id || null,
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
      ], function(err) {
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

// Delete main solutions section
app.delete('/api/main-solutions/sections/:sectionId', (req, res) => {
  const { sectionId } = req.params;
  
  db.run('DELETE FROM main_solutions_sections WHERE id = ?', [sectionId], function(err) {
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

// Toggle visibility of main solutions section
app.patch('/api/main-solutions/sections/:sectionId/toggle-visibility', (req, res) => {
  const { sectionId } = req.params;
  
  // Get current visibility
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
    
    // Toggle visibility
    const newVisibility = section.is_visible ? 0 : 1;
    
    db.run('UPDATE main_solutions_sections SET is_visible = ? WHERE id = ?', [newVisibility, sectionId], function(err) {
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

// Create new main solutions section (standalone)
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
  
  // Get the next order index
  db.get('SELECT MAX(order_index) as max_order FROM main_solutions_sections', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = (result.max_order || 0) + 1;
    
    // Convert features array to JSON string if it's an array
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
    ], function(err) {
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

// Create new main products section (standalone)
app.post('/api/main-products/sections', (req, res) => {
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
  db.get('SELECT MAX(order_index) as max_order FROM main_products_sections', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = (result.max_order || 0) + 1;
    
    // Convert features array to JSON string if it's an array
    const featuresJson = Array.isArray(features) ? JSON.stringify(features) : (features || '[]');
    
    db.run(`
      INSERT INTO main_products_sections (
        product_id, title, description, is_visible, order_index,
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
    ], function(err) {
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

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Cloud4India CMS Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin API available at http://localhost:${PORT}/api/homepage`);
  console.log(`💰 Pricing API available at http://localhost:${PORT}/api/pricing`);
  console.log(`❤️  Health check at http://localhost:${PORT}/api/health`);
  
  // Run migrations after server starts
  await runMigrations();
  
  // Add missing columns to solutions tables
  setTimeout(() => {
    addMainSolutionsSectionColumns();
    addMainSolutionsContentColumns();
  }, 2000);
});

module.exports = app;
