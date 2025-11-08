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
    WHERE p.route IN ('acronis-m365-backup', 'acronis-google-workspace-backup')
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
      // Check which order_index values exist
      db.all(`
        SELECT order_index 
        FROM product_items 
        WHERE section_id = ? AND item_type = 'specification'
        ORDER BY order_index
      `, [section.section_id], (err, existing) => {
        if (err) {
          console.error('❌ Error:', err.message);
          completed++;
          if (completed === sections.length) db.close();
          return;
        }
        
        const existingOrders = existing.map(e => e.order_index);
        const allOrders = [1, 2, 3, 4, 5, 6];
        const missingOrders = allOrders.filter(o => !existingOrders.includes(o));
        
        if (missingOrders.length === 0) {
          console.log(`✓ ${section.route} already has all 6 items`);
          completed++;
          if (completed === sections.length) {
            console.log('\n✅ Done!\n');
            db.close();
          }
          return;
        }
        
        console.log(`⚠️  ${section.route} missing order_index: ${missingOrders.join(', ')}`);
        
        // Insert missing items based on route
        let itemsToAdd = [];
        if (section.route === 'acronis-m365-backup') {
          if (missingOrders.includes(1)) {
            itemsToAdd.push({
              order: 1,
              title: 'Microsoft 365 Coverage',
              description: 'Complete backup coverage for all Microsoft 365 services',
              content: '{"features": ["Full backup of Exchange Online mailboxes and calendars", "OneDrive for Business files and folders backup", "SharePoint Online sites and document libraries backup"]}',
              icon: 'ServerIcon'
            });
          }
          if (missingOrders.includes(2)) {
            itemsToAdd.push({
              order: 2,
              title: 'Data Protection & Security',
              description: 'Enterprise-grade encryption and security for M365 backups',
              content: '{"features": ["256-bit AES encryption for all backup data", "End-to-end encryption during backup and restore operations", "Compliance with GDPR, HIPAA, and SOC 2 standards"]}',
              icon: 'ShieldCheckIcon'
            });
          }
          if (missingOrders.includes(3)) {
            itemsToAdd.push({
              order: 3,
              title: 'Backup Frequency & Scheduling',
              description: 'Flexible backup scheduling and automation options',
              content: '{"features": ["Automated daily backups with customizable schedules", "Real-time backup for critical mailboxes and files", "On-demand backup creation at any time"]}',
              icon: 'ClockIcon'
            });
          }
          if (missingOrders.includes(4)) {
            itemsToAdd.push({
              order: 4,
              title: 'Recovery Options',
              description: 'Granular and flexible recovery capabilities',
              content: '{"features": ["Point-in-time recovery for emails, files, and folders", "Granular item-level recovery without full restore", "Export to PST, MSG, or original format"]}',
              icon: 'ArrowPathIcon'
            });
          }
          if (missingOrders.includes(5)) {
            itemsToAdd.push({
              order: 5,
              title: 'Storage & Retention',
              description: 'Flexible storage and retention management',
              content: '{"features": ["Unlimited cloud storage for backup data", "Configurable retention policies for compliance", "Automatic cleanup of expired backups"]}',
              icon: 'CircleStackIcon'
            });
          }
          if (missingOrders.includes(6)) {
            itemsToAdd.push({
              order: 6,
              title: 'Management & Monitoring',
              description: 'Centralized management and monitoring tools',
              content: '{"features": ["Centralized web-based management console", "Real-time backup monitoring and status alerts", "Automated reporting and email notifications"]}',
              icon: 'UsersIcon'
            });
          }
        } else if (section.route === 'acronis-google-workspace-backup') {
          if (missingOrders.includes(1)) {
            itemsToAdd.push({
              order: 1,
              title: 'Google Workspace Coverage',
              description: 'Complete backup coverage for all Google Workspace services',
              content: '{"features": ["Full backup of Gmail messages, labels, and attachments", "Google Drive files and folders backup", "Google Calendar events and contacts backup"]}',
              icon: 'ServerIcon'
            });
          }
          if (missingOrders.includes(2)) {
            itemsToAdd.push({
              order: 2,
              title: 'Data Protection & Security',
              description: 'Enterprise-grade encryption and security for Google Workspace backups',
              content: '{"features": ["256-bit AES encryption for all backup data", "End-to-end encryption during backup and restore operations", "Compliance with GDPR, HIPAA, and SOC 2 standards"]}',
              icon: 'ShieldCheckIcon'
            });
          }
          if (missingOrders.includes(3)) {
            itemsToAdd.push({
              order: 3,
              title: 'Backup Frequency & Scheduling',
              description: 'Flexible backup scheduling and automation options',
              content: '{"features": ["Automated daily backups with customizable schedules", "Real-time backup for critical mailboxes and files", "On-demand backup creation at any time"]}',
              icon: 'ClockIcon'
            });
          }
          if (missingOrders.includes(4)) {
            itemsToAdd.push({
              order: 4,
              title: 'Recovery Options',
              description: 'Granular and flexible recovery capabilities',
              content: '{"features": ["Point-in-time recovery for emails, files, and folders", "Granular item-level recovery without full restore", "Export to MBOX, PST, or original format"]}',
              icon: 'ArrowPathIcon'
            });
          }
          if (missingOrders.includes(5)) {
            itemsToAdd.push({
              order: 5,
              title: 'Storage & Retention',
              description: 'Flexible storage and retention management',
              content: '{"features": ["Unlimited cloud storage for backup data", "Configurable retention policies for compliance", "Automatic cleanup of expired backups"]}',
              icon: 'CircleStackIcon'
            });
          }
          if (missingOrders.includes(6)) {
            itemsToAdd.push({
              order: 6,
              title: 'Management & Monitoring',
              description: 'Centralized management and monitoring tools',
              content: '{"features": ["Centralized web-based management console", "Real-time backup monitoring and status alerts", "Automated reporting and email notifications"]}',
              icon: 'UsersIcon'
            });
          }
        }
        
        if (itemsToAdd.length === 0) {
          completed++;
          if (completed === sections.length) {
            console.log('\n✅ Done!\n');
            db.close();
          }
          return;
        }
        
        let itemCompleted = 0;
        itemsToAdd.forEach(item => {
          db.run(`
            INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
            VALUES (?, ?, ?, ?, 'specification', ?, ?, 1)
          `, [section.section_id, item.title, item.description, item.content, item.icon, item.order], function(err) {
            itemCompleted++;
            
            if (err) {
              console.error(`❌ Error inserting ${section.route} order ${item.order}:`, err.message);
            } else {
              console.log(`✅ Added ${section.route} - ${item.title} (order: ${item.order})`);
            }
            
            if (itemCompleted === itemsToAdd.length) {
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
  });
});



