const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🔄 Restoring Microsoft 365 Licenses product...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  // Product data
  const productData = {
    name: 'Microsoft 365 Licenses',
    description: 'Comprehensive Microsoft 365 licensing solutions for businesses of all sizes. Choose from Business Basic, Standard, Premium plans with or without Teams.',
    category: 'Software Licenses',
    color: '#0078D4',
    border_color: '#005A9E',
    route: 'microsoft-365-licenses',
    gradient_start: 'blue',
    gradient_end: 'blue-100',
    is_visible: 1,
    order_index: 0
  };
  
  // Step 1: Insert the product
  db.run(`
    INSERT INTO products (name, description, category, color, border_color, route, gradient_start, gradient_end, is_visible, order_index, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `, [
    productData.name,
    productData.description,
    productData.category,
    productData.color,
    productData.border_color,
    productData.route,
    productData.gradient_start,
    productData.gradient_end,
    productData.is_visible,
    productData.order_index
  ], function(err) {
    if (err) {
      console.error('❌ Error inserting product:', err.message);
      db.close();
      process.exit(1);
    }
    
    const productId = this.lastID;
    console.log(`✅ Created product with ID: ${productId}`);
    
    // Step 2: Create hero section
    db.run(`
      INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible, created_at, updated_at)
      VALUES (?, ?, ?, 'hero', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [productId, 'Microsoft 365 Licenses', productData.description], function(err) {
      if (err) {
        console.error('❌ Error creating hero section:', err.message);
      } else {
        console.log(`✅ Created hero section (ID: ${this.lastID})`);
      }
      
      // Step 3: Create features section
      db.run(`
        INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible, created_at, updated_at)
        VALUES (?, 'Key Features', 'Discover the powerful features of Microsoft 365', 'features', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [productId], (err, result) => {
        if (err) {
          console.error('❌ Error creating features section:', err.message);
          db.close();
          return;
        }
        
        db.get('SELECT last_insert_rowid() as id', [], (err, row) => {
          if (err) {
            console.error('❌ Error getting features section ID:', err.message);
            db.close();
            return;
          }
          
          const featuresSectionId = row.id;
          console.log(`✅ Created features section (ID: ${featuresSectionId})`);
          
          // Insert feature items
          const features = [
            { title: 'Office 365 Apps', description: 'Access to full suite of Microsoft Office applications including Word, Excel, PowerPoint, Outlook, and Teams on desktop, web, and mobile.', icon: 'DocumentTextIcon', order: 1 },
            { title: 'Cloud Storage', description: '1TB OneDrive cloud storage per user for secure file storage, sharing, and collaboration with advanced versioning and recovery.', icon: 'CloudIcon', order: 2 },
            { title: 'Email & Calendar', description: 'Professional business email with 50GB mailbox, calendar scheduling, and seamless integration with Outlook and other email clients.', icon: 'EnvelopeIcon', order: 3 },
            { title: 'Microsoft Teams', description: 'Integrated collaboration platform with video conferencing, chat, file sharing, and team workspaces for seamless communication.', icon: 'UserGroupIcon', order: 4 },
            { title: 'Security & Compliance', description: 'Enterprise-grade security with advanced threat protection, data loss prevention, and compliance tools for GDPR and industry standards.', icon: 'ShieldCheckIcon', order: 5 },
            { title: '24/7 Support', description: 'Round-the-clock Microsoft support with guaranteed 99.9% uptime SLA, phone support, and comprehensive knowledge base access.', icon: 'ClockIcon', order: 6 }
          ];
          
          let featuresCompleted = 0;
          features.forEach(feature => {
            db.run(`
              INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible, created_at, updated_at)
              VALUES (?, ?, ?, 'feature_card', ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [featuresSectionId, feature.title, feature.description, feature.icon, feature.order], function(err) {
              featuresCompleted++;
              if (err) {
                console.error(`❌ Error inserting feature ${feature.title}:`, err.message);
              }
              
              if (featuresCompleted === features.length) {
                console.log(`✅ Inserted ${features.length} feature items`);
                
                // Step 4: Create specifications section
                db.run(`
                  INSERT INTO product_sections (product_id, title, description, section_type, order_index, is_visible, created_at, updated_at)
                  VALUES (?, 'Technical Specifications', 'Comprehensive technical specifications and system requirements for Microsoft 365 business solutions', 'specifications', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `, [productId], function(err) {
                  if (err) {
                    console.error('❌ Error creating specifications section:', err.message);
                    db.close();
                    return;
                  }
                  
                  const specsSectionId = this.lastID;
                  console.log(`✅ Created specifications section (ID: ${specsSectionId})`);
                  
                  // Insert specification items (with 3 points each)
                  const specifications = [
                    { title: 'Mailbox & Email Storage', description: 'Enterprise-grade email storage and management capabilities', content: '{"features": ["50GB mailbox storage per user included with all plans", "Expandable to 100GB with In-Place Archiving feature", "Support for email attachments up to 150MB in size"]}', icon: 'ServerIcon', order: 1 },
                    { title: 'OneDrive Cloud Storage', description: 'Secure cloud storage for files, documents, and collaboration', content: '{"features": ["1TB OneDrive cloud storage per user included", "Real-time file synchronization across all devices", "Offline access to files when internet is unavailable"]}', icon: 'CircleStackIcon', order: 2 },
                    { title: 'User Management & Licensing', description: 'Flexible user management and scalable licensing options', content: '{"features": ["Support for up to 300 users per business subscription", "Flexible license assignment and reassignment options", "Easy user addition and removal through admin portal"]}', icon: 'UsersIcon', order: 3 },
                    { title: 'Microsoft Teams & Collaboration', description: 'Integrated collaboration tools and video conferencing', content: '{"features": ["Unlimited video calls and meetings with up to 300 participants", "Screen sharing, file sharing, and live document collaboration", "Integration with Outlook calendar and email"]}', icon: 'GlobeAltIcon', order: 4 },
                    { title: 'System Requirements & Compatibility', description: 'Supported devices, operating systems, and browser compatibility', content: '{"features": ["Windows 10 or later, macOS 10.14 or later for desktop apps", "Mobile apps available for iOS 13+ and Android 8+", "Web browser access from any device with modern browser"]}', icon: 'CpuChipIcon', order: 5 },
                    { title: 'Service Level & Support', description: 'Guaranteed uptime and comprehensive support options', content: '{"features": ["99.9% uptime SLA guarantee with financial credits for downtime", "24/7 service availability worldwide with global data centers", "Phone, chat, and web-based support channels included"]}', icon: 'ClockIcon', order: 6 }
                  ];
                  
                  let specsCompleted = 0;
                  specifications.forEach(spec => {
                    db.run(`
                      INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible, created_at, updated_at)
                      VALUES (?, ?, ?, ?, 'specification', ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    `, [specsSectionId, spec.title, spec.description, spec.content, spec.icon, spec.order], function(err) {
                      specsCompleted++;
                      if (err) {
                        console.error(`❌ Error inserting spec ${spec.title}:`, err.message);
                      }
                      
                      if (specsCompleted === specifications.length) {
                        console.log(`✅ Inserted ${specifications.length} specification items`);
                        
                        // Step 5: Create main_products_sections entry
                        db.run(`
                          INSERT OR IGNORE INTO main_products_sections (product_id, title, description, is_visible, order_index, created_at, updated_at)
                          VALUES (?, ?, ?, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        `, [productId, productData.name, productData.description], function(err) {
                          if (err) {
                            console.error('❌ Error creating main_products_sections entry:', err.message);
                          } else {
                            console.log(`✅ Created main_products_sections entry`);
                          }
                          
                          console.log('\n✅ Microsoft 365 Licenses product restored successfully!');
                          console.log(`   Product ID: ${productId}`);
                          console.log(`   Route: ${productData.route}`);
                          console.log(`   Sections: Hero, Features, Specifications`);
                          console.log(`   Items: 6 Features, 6 Specifications\n`);
                          
                          db.close();
                        });
                      }
                    });
                  });
                });
              }
            });
          });
        });
      });
    });
  });
});
