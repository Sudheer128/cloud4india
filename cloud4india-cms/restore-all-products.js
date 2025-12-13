const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('🔄 Restoring all products...\n');

// All products to restore
const productsToRestore = [
  // Compute Category
  {
    name: 'Cloud Compute Instances',
    description: 'Scalable virtual machines for general workloads',
    category: 'Compute',
    color: '#3B82F6',
    border_color: '#2563EB',
    route: 'cloud-compute-instances',
    order_index: 0
  },
  
  // Storage Category
  {
    name: 'Block Storage',
    description: 'High IOPS SSD-backed block storage',
    category: 'Storage',
    color: '#10B981',
    border_color: '#059669',
    route: 'block-storage',
    order_index: 1
  },
  
  // Networking Category
  {
    name: 'VPC (Virtual Private Cloud)',
    description: 'Isolated virtual cloud network',
    category: 'Networking',
    color: '#8B5CF6',
    border_color: '#7C3AED',
    route: 'vpc-virtual-private-cloud',
    order_index: 2
  },
  
  // Software Licenses
  {
    name: 'Microsoft 365 Licenses',
    description: 'Comprehensive Microsoft 365 licensing solutions for businesses of all sizes',
    category: 'Software Licenses',
    color: '#0078D4',
    border_color: '#005A9E',
    route: 'microsoft-365-licenses',
    order_index: 3
  },
  
  // Backup Solutions
  {
    name: 'Acronis Server Backup',
    description: 'Enterprise-grade backup and disaster recovery solution for servers',
    category: 'Backup Solutions',
    color: '#F59E0B',
    border_color: '#D97706',
    route: 'acronis-server-backup',
    order_index: 4
  },
  {
    name: 'Acronis M365 Backup',
    description: 'Complete backup solution for Microsoft 365',
    category: 'Backup Solutions',
    color: '#EF4444',
    border_color: '#DC2626',
    route: 'acronis-m365-backup',
    order_index: 5
  },
  {
    name: 'Acronis Google Workspace Backup',
    description: 'Comprehensive backup solution for Google Workspace',
    category: 'Backup Solutions',
    color: '#EC4899',
    border_color: '#DB2777',
    route: 'acronis-google-workspace-backup',
    order_index: 6
  },
  
  // Security
  {
    name: 'Anti Virus',
    description: 'Advanced antivirus and malware protection for your infrastructure',
    category: 'Security',
    color: '#6366F1',
    border_color: '#4F46E5',
    route: 'anti-virus',
    order_index: 7
  }
];

let completed = 0;
const total = productsToRestore.length;

productsToRestore.forEach((productData, index) => {
  // Check if product already exists
  db.get("SELECT id FROM products WHERE route = ?", [productData.route], (err, existing) => {
    if (err) {
      console.error(`❌ Error checking product ${productData.name}:`, err.message);
      completed++;
      if (completed === total) {
        db.close();
      }
      return;
    }
    
    if (existing) {
      console.log(`⏭️  Product "${productData.name}" already exists (ID: ${existing.id})`);
      completed++;
      if (completed === total) {
        console.log('\n✅ All products checked!');
        db.close();
      }
      return;
    }
    
    // Insert product
    db.run(`
      INSERT INTO products (name, description, category, color, border_color, route, order_index, is_visible, enable_single_page, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      productData.name,
      productData.description,
      productData.category,
      productData.color,
      productData.border_color,
      productData.route,
      productData.order_index
    ], function(err) {
      if (err) {
        console.error(`❌ Error inserting product ${productData.name}:`, err.message);
        completed++;
        if (completed === total) {
          db.close();
        }
        return;
      }
      
      const productId = this.lastID;
      console.log(`✅ Created product: ${productData.name} (ID: ${productId}, Route: ${productData.route})`);
      
      // Create main_products_sections entry
      db.get('SELECT MAX(order_index) as max_order FROM main_products_sections', (err, result) => {
        if (err) {
          console.error(`❌ Error getting max order:`, err.message);
        }
        
        const nextOrder = (result?.max_order || 0) + 1;
        
        db.run(`
          INSERT INTO main_products_sections (product_id, title, description, is_visible, order_index, created_at, updated_at)
          VALUES (?, ?, ?, 1, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [productId, productData.name, productData.description, nextOrder], (err) => {
          if (err) {
            console.error(`❌ Error creating main_products_sections entry:`, err.message);
          } else {
            console.log(`   ✅ Created main_products_sections entry`);
          }
          
          completed++;
          if (completed === total) {
            console.log('\n✅ All products restored successfully!');
            console.log(`\n📊 Summary: ${productsToRestore.length} products processed`);
            db.close();
          }
        });
      });
    });
  });
});

