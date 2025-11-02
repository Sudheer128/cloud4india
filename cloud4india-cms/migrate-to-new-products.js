const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Starting migration to new products...\n');

db.serialize(() => {
  // Step 1: Ensure route and is_visible columns exist
  console.log('📋 Step 1: Ensuring required columns exist...');
  
  db.run(`ALTER TABLE products ADD COLUMN is_visible INTEGER DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Error adding is_visible:', err.message);
    } else {
      console.log('✅ is_visible column verified');
    }
  });

  db.run(`ALTER TABLE products ADD COLUMN route TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Error adding route:', err.message);
    } else {
      console.log('✅ route column verified');
    }
  });

  // Step 2: Mark existing products as hidden (is_visible = 0)
  setTimeout(() => {
    console.log('\n📋 Step 2: Marking existing products as hidden...');
    
    db.run(`UPDATE products SET is_visible = 0 WHERE is_visible = 1 OR is_visible IS NULL`, function(err) {
      if (err) {
        console.error('❌ Error hiding old products:', err.message);
      } else {
        console.log(`✅ Hidden ${this.changes} existing product(s)`);
      }

      // Step 3: Add new products
      setTimeout(() => {
        console.log('\n📋 Step 3: Adding new products...');
        
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
          db.run(
            `INSERT INTO products (name, description, category, color, border_color, route, gradient_start, gradient_end, is_visible, order_index) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [product.name, product.description, product.category, product.color, product.border_color, 
             product.route, product.gradient_start, product.gradient_end, index],
            function(err) {
              if (err) {
                console.error(`❌ Error inserting ${product.name}:`, err.message);
              } else {
                insertedCount++;
                console.log(`✅ Added: ${product.name} (ID: ${this.lastID})`);
              }

              // Check if all products are inserted
              if (insertedCount === totalProducts) {
                console.log(`\n✅ Successfully added ${insertedCount} new products!`);
                
                // Step 4: Verify the changes
                setTimeout(() => {
                  console.log('\n📋 Step 4: Verifying changes...');
                  
                  db.all(`SELECT id, name, route, is_visible FROM products ORDER BY id`, (err, products) => {
                    if (err) {
                      console.error('❌ Error fetching products:', err.message);
                      db.close();
                      return;
                    }

                    console.log('\n📊 Current Products:');
                    console.table(products);
                    
                    console.log('\n✅ Migration completed successfully!');
                    console.log('\n📝 Summary:');
                    console.log('   - Old products marked as hidden (is_visible = 0)');
                    console.log('   - 5 new products added and visible');
                    console.log('   - Routes configured for new products');
                    
                    db.close();
                  });
                }, 500);
              }
            }
          );
        });
      }, 500);
    });
  }, 500);
});




