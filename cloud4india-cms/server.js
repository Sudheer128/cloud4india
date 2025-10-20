const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database('./cms.db');

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
              res.json({ 
                message: 'Product duplicated successfully', 
                id: duplicateProductId,
                sectionsDuplicated: 0,
                itemsDuplicated: 0
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
                    duplicateSectionItems(sectionMapping, duplicateProductId);
                  }
                });
            });
          });
        });
    });
  });
  
  function duplicateSectionItems(sectionMapping, duplicateProductId) {
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
        
        db.all('SELECT * FROM product_items WHERE section_id = ?', [originalSectionId], (err, items) => {
          if (err) {
            console.error('Error getting items:', err.message);
            return;
          }
          
          items.forEach((item) => {
            db.run(`INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
              [newSectionId, item.title, item.description, item.content, item.item_type, item.icon, item.order_index, item.is_visible], 
              function(err) {
                if (err) {
                  console.error('Error duplicating item:', err.message);
                  return;
                }
                
                itemsProcessed++;
                
                if (itemsProcessed === totalItems) {
                  res.json({ 
                    message: 'Product duplicated successfully', 
                    id: duplicateProductId,
                    sectionsDuplicated: Object.keys(sectionMapping).length,
                    itemsDuplicated: totalItems
                  });
                }
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
function duplicateSectionItems(originalSolutionId, sectionIdMap, newSolutionId, res) {
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
      res.json({ 
        message: 'Solution duplicated successfully', 
        id: newSolutionId
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
            res.json({ 
              message: 'Solution duplicated successfully', 
              id: newSolutionId
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
              res.json({ 
                message: 'Solution duplicated successfully', 
                id: newSolutionId,
                changes: this.changes 
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
                    duplicateSectionItems(id, sectionIdMap, newSolutionId, res);
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cloud4India CMS Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin API available at http://localhost:${PORT}/api/homepage`);
  console.log(`❤️  Health check at http://localhost:${PORT}/api/health`);
});

module.exports = app;
