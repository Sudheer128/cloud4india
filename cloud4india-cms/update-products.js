const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

// Real Cloud4India products based on their website
const realProducts = [
  {
    id: 1,
    name: 'Basic Cloud Servers',
    description: 'Balanced CPU and RAM ratio perfect for general workloads, web applications, and development environments',
    category: 'Cloud Servers',
    color: 'from-green-50 to-green-100',
    border_color: 'border-green-200',
    order_index: 0
  },
  {
    id: 2,
    name: 'CPU Intensive Servers',
    description: 'High-performance CPU cores optimized for compute-intensive tasks, data processing, and analytics workloads',
    category: 'Cloud Servers',
    color: 'from-orange-50 to-orange-100',
    border_color: 'border-orange-200',
    order_index: 1
  },
  {
    id: 3,
    name: 'Memory Intensive Servers',
    description: 'High-memory configurations ideal for databases, caching, and memory-demanding applications',
    category: 'Cloud Servers',
    color: 'from-blue-50 to-blue-100',
    border_color: 'border-blue-200',
    order_index: 2
  },
  {
    id: 4,
    name: 'Acronis Cloud Backup',
    description: 'Secure your online presence with enterprise-grade cloud backup solutions',
    category: 'Backup Services',
    color: 'from-purple-50 to-purple-100',
    border_color: 'border-purple-200',
    order_index: 3
  }
];

console.log('Updating products with real Cloud4India products...');

// Clear existing products
db.run('DELETE FROM products', (err) => {
  if (err) {
    console.error('Error clearing products:', err);
    return;
  }
  
  console.log('Cleared existing products');
  
  // Insert real products
  const stmt = db.prepare('INSERT INTO products (id, name, description, category, color, border_color, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
  
  realProducts.forEach((product, index) => {
    stmt.run(product.id, product.name, product.description, product.category, product.color, product.border_color, product.order_index, (err) => {
      if (err) {
        console.error(`Error inserting product ${product.name}:`, err);
      } else {
        console.log(`✅ Inserted: ${product.name}`);
      }
      
      if (index === realProducts.length - 1) {
        stmt.finalize();
        
        // Verify the update
        db.all('SELECT * FROM products ORDER BY order_index', (err, rows) => {
          if (err) {
            console.error('Error verifying products:', err);
          } else {
            console.log('\n📋 Updated products in database:');
            console.table(rows);
          }
          db.close();
        });
      }
    });
  });
});


