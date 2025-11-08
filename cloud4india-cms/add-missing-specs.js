const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🔧 Adding missing specification items...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  // Get section IDs
  db.all(`
    SELECT p.route, ps.id as section_id
    FROM products p
    JOIN product_sections ps ON p.id = ps.product_id
    WHERE p.route IN ('microsoft-365-licenses', 'acronis-server-backup')
    AND ps.section_type = 'specifications'
  `, [], (err, sections) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (sections.length === 0) {
      console.log('❌ No sections found');
      db.close();
      process.exit(1);
    }
    
    let completed = 0;
    
    sections.forEach(section => {
      // Check if order_index 1 exists
      db.get(`
        SELECT COUNT(*) as count 
        FROM product_items 
        WHERE section_id = ? AND order_index = 1 AND item_type = 'specification'
      `, [section.section_id], (err, row) => {
        if (err) {
          console.error('❌ Error:', err.message);
          completed++;
          if (completed === sections.length) db.close();
          return;
        }
        
        if (row.count === 0) {
          // Insert missing item
          let insertData;
          if (section.route === 'microsoft-365-licenses') {
            insertData = {
              title: 'Mailbox & Email Storage',
              description: 'Enterprise-grade email storage and management capabilities',
              content: '{"features": ["50GB mailbox storage per user included with all plans", "Expandable to 100GB with In-Place Archiving feature", "Unlimited archive storage for compliance and legal requirements", "Support for email attachments up to 150MB in size", "Advanced email filtering and anti-spam protection", "Integration with Outlook, Gmail, and other email clients"]}',
              icon: 'ServerIcon'
            };
          } else if (section.route === 'acronis-server-backup') {
            insertData = {
              title: 'Storage & Backup Capacity',
              description: 'Flexible and scalable backup storage solutions',
              content: '{"features": ["Unlimited backup storage capacity with no size restrictions", "Advanced compression reduces storage usage by up to 50%", "Incremental and differential backup support for efficiency", "Cloud storage, local storage, and hybrid backup options", "Network-attached storage (NAS) and SAN support", "Automatic storage management and cleanup policies"]}',
              icon: 'CircleStackIcon'
            };
          }
          
          if (insertData) {
            db.run(`
              INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
              VALUES (?, ?, ?, ?, 'specification', ?, 1, 1)
            `, [section.section_id, insertData.title, insertData.description, insertData.content, insertData.icon], function(err) {
              if (err) {
                console.error(`❌ Error inserting for ${section.route}:`, err.message);
              } else {
                console.log(`✅ Added missing item for ${section.route} (order_index: 1)`);
              }
              
              completed++;
              if (completed === sections.length) {
                console.log('\n✅ Done!\n');
                db.close();
              }
            });
          } else {
            completed++;
            if (completed === sections.length) {
              console.log('\n✅ Done!\n');
              db.close();
            }
          }
        } else {
          console.log(`✓ ${section.route} already has order_index 1`);
          completed++;
          if (completed === sections.length) {
            console.log('\n✅ Done!\n');
            db.close();
          }
        }
      });
    });
  });
});



