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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Cloud4India CMS is running' });
});

// Solutions API Routes

// Get all solutions
app.get('/api/solutions', (req, res) => {
  db.all('SELECT * FROM solutions ORDER BY order_index ASC', (err, solutions) => {
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
  
  // Get the next order index
  db.get('SELECT MAX(order_index) as max_order FROM solutions', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const nextOrder = (result.max_order || -1) + 1;
    
    db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [name, description, category, color, border_color, route, nextOrder], 
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ 
          message: 'Solution created successfully', 
          id: this.lastID,
          changes: this.changes 
        });
      });
  });
});

// Update solution
app.put('/api/solutions/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, color, border_color, route } = req.body;
  
  db.run(`UPDATE solutions SET 
    name = ?, 
    description = ?, 
    category = ?, 
    color = ?, 
    border_color = ?, 
    route = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`, 
    [name, description, category, color, border_color, route, id], 
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
  
  // First delete all sections for this solution
  db.run(`DELETE FROM solution_sections WHERE solution_id = ?`, [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Then delete the solution
    db.run(`DELETE FROM solutions WHERE id = ?`, [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Solution deleted successfully', changes: this.changes });
    });
  });
});

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
      
      // Create the duplicate solution
      db.run(`INSERT INTO solutions (name, description, category, color, border_color, route, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [newName || `${originalSolution.name} (Copy)`, originalSolution.description, originalSolution.category, originalSolution.color, originalSolution.border_color, newRoute, nextOrder], 
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
            sections.forEach((section, index) => {
              db.run(`INSERT INTO solution_sections (solution_id, section_type, title, content, order_index) VALUES (?, ?, ?, ?, ?)`, 
                [newSolutionId, section.section_type, section.title, section.content, section.order_index], 
                (err) => {
                  if (err) {
                    console.error('Error duplicating section:', err.message);
                  }
                  completed++;
                  if (completed === sections.length) {
                    res.json({ 
                      message: 'Solution duplicated successfully', 
                      id: newSolutionId,
                      changes: this.changes 
                    });
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
  const { section_type, title, content } = req.body;
  
  db.run(`UPDATE solution_sections SET 
    section_type = ?, 
    title = ?, 
    content = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND solution_id = ?`, 
    [section_type, title, content, sectionId, id], 
    function(err) {
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cloud4India CMS Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin API available at http://localhost:${PORT}/api/homepage`);
  console.log(`❤️  Health check at http://localhost:${PORT}/api/health`);
});

module.exports = app;
