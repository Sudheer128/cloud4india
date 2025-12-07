const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🔄 Adding Key Features and Technical Specifications content for Microsoft 365 Licenses...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  // Get product ID
  db.get('SELECT id FROM products WHERE route = ?', ['microsoft-365-licenses'], (err, product) => {
    if (err) {
      console.error('❌ Error fetching product:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (!product) {
      console.error('❌ Microsoft 365 Licenses product not found');
      db.close();
      process.exit(1);
    }
    
    const productId = product.id;
    console.log(`✅ Found product ID: ${productId}\n`);
    
    // Step 1: Update Key Features section
    console.log('📝 Updating Key Features section...');
    
    db.run(`
      UPDATE product_sections 
      SET 
        title = 'Key Features',
        description = 'Discover the powerful features of Microsoft 365',
        order_index = 2,
        is_visible = 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ? AND section_type = 'features'
    `, [productId], function(err) {
      if (err) {
        console.error('❌ Error updating features section:', err.message);
      } else {
        console.log(`   ✅ Updated features section`);
      }
      
      // Get features section ID
      db.get('SELECT id FROM product_sections WHERE product_id = ? AND section_type = ?', [productId, 'features'], (err, section) => {
        if (err || !section) {
          console.error('❌ Error getting features section:', err.message);
          db.close();
          process.exit(1);
        }
        
        const featuresSectionId = section.id;
        
        // Delete existing feature items
        db.run('DELETE FROM product_items WHERE section_id = ?', [featuresSectionId], function(err) {
          if (err) {
            console.error('❌ Error deleting existing features:', err.message);
          } else {
            console.log(`   🗑️  Deleted ${this.changes} existing feature items`);
          }
          
          // Insert Key Features
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
                console.error(`❌ Error inserting feature "${feature.title}":`, err.message);
              } else {
                console.log(`   ✅ Added: ${feature.title}`);
              }
              
              if (featuresCompleted === features.length) {
                console.log(`\n✅ Added ${features.length} Key Features\n`);
                
                // Step 2: Update Technical Specifications section
                console.log('📝 Updating Technical Specifications section...');
                
                db.run(`
                  UPDATE product_sections 
                  SET 
                    title = 'Technical Specifications',
                    description = 'Comprehensive technical specifications and system requirements for Microsoft 365 business Apps',
                    order_index = 3,
                    is_visible = 1,
                    updated_at = CURRENT_TIMESTAMP
                  WHERE product_id = ? AND section_type = 'specifications'
                `, [productId], function(err) {
                  if (err) {
                    console.error('❌ Error updating specifications section:', err.message);
                  } else {
                    console.log(`   ✅ Updated specifications section`);
                  }
                  
                  // Get specifications section ID
                  db.get('SELECT id FROM product_sections WHERE product_id = ? AND section_type = ?', [productId, 'specifications'], (err, section) => {
                    if (err || !section) {
                      console.error('❌ Error getting specifications section:', err.message);
                      db.close();
                      process.exit(1);
                    }
                    
                    const specsSectionId = section.id;
                    
                    // Delete existing specification items
                    db.run('DELETE FROM product_items WHERE section_id = ? AND item_type = ?', [specsSectionId, 'specification'], function(err) {
                      if (err) {
                        console.error('❌ Error deleting existing specifications:', err.message);
                      } else {
                        console.log(`   🗑️  Deleted ${this.changes} existing specification items`);
                      }
                      
                      // Insert Technical Specifications (each with 3 points)
                      const specifications = [
                        { 
                          title: 'Mailbox & Email Storage', 
                          description: 'Enterprise-grade email storage and management capabilities', 
                          content: '{"features": ["50GB mailbox storage per user included with all plans", "Expandable to 100GB with In-Place Archiving feature", "Support for email attachments up to 150MB in size"]}', 
                          icon: 'ServerIcon', 
                          order: 1 
                        },
                        { 
                          title: 'OneDrive Cloud Storage', 
                          description: 'Secure cloud storage for files, documents, and collaboration', 
                          content: '{"features": ["1TB OneDrive cloud storage per user included", "Real-time file synchronization across all devices", "Offline access to files when internet is unavailable"]}', 
                          icon: 'CircleStackIcon', 
                          order: 2 
                        },
                        { 
                          title: 'User Management & Licensing', 
                          description: 'Flexible user management and scalable licensing options', 
                          content: '{"features": ["Support for up to 300 users per business subscription", "Flexible license assignment and reassignment options", "Easy user addition and removal through admin portal"]}', 
                          icon: 'UsersIcon', 
                          order: 3 
                        },
                        { 
                          title: 'Microsoft Teams & Collaboration', 
                          description: 'Integrated collaboration tools and video conferencing', 
                          content: '{"features": ["Unlimited video calls and meetings with up to 300 participants", "Screen sharing, file sharing, and live document collaboration", "Integration with Outlook calendar and email"]}', 
                          icon: 'GlobeAltIcon', 
                          order: 4 
                        },
                        { 
                          title: 'System Requirements & Compatibility', 
                          description: 'Supported devices, operating systems, and browser compatibility', 
                          content: '{"features": ["Windows 10 or later, macOS 10.14 or later for desktop apps", "Mobile apps available for iOS 13+ and Android 8+", "Web browser access from any device with modern browser"]}', 
                          icon: 'CpuChipIcon', 
                          order: 5 
                        },
                        { 
                          title: 'Service Level & Support', 
                          description: 'Guaranteed uptime and comprehensive support options', 
                          content: '{"features": ["99.9% uptime SLA guarantee with financial credits for downtime", "24/7 service availability worldwide with global data centers", "Phone, chat, and web-based support channels included"]}', 
                          icon: 'ClockIcon', 
                          order: 6 
                        }
                      ];
                      
                      let specsCompleted = 0;
                      specifications.forEach(spec => {
                        db.run(`
                          INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible, created_at, updated_at)
                          VALUES (?, ?, ?, ?, 'specification', ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        `, [specsSectionId, spec.title, spec.description, spec.content, spec.icon, spec.order], function(err) {
                          specsCompleted++;
                          if (err) {
                            console.error(`❌ Error inserting spec "${spec.title}":`, err.message);
                          } else {
                            console.log(`   ✅ Added: ${spec.title}`);
                          }
                          
                          if (specsCompleted === specifications.length) {
                            console.log(`\n✅ Added ${specifications.length} Technical Specifications (3 points each)\n`);
                            console.log('✅ Microsoft 365 Licenses content updated successfully!');
                            console.log(`   Product ID: ${productId}`);
                            console.log(`   Key Features: ${features.length} items`);
                            console.log(`   Technical Specifications: ${specifications.length} items (3 points each)\n`);
                            
                            db.close();
                          }
                        });
                      });
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


