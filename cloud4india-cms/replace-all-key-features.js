const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🔄 Replacing all Key Features content...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  const productsContent = {
    'microsoft-365-licenses': [
      { title: 'Office 365 Apps', description: 'Access to full suite of Microsoft Office applications including Word, Excel, PowerPoint, Outlook, and Teams on desktop, web, and mobile.', icon: 'DocumentTextIcon' },
      { title: 'Cloud Storage', description: '1TB OneDrive cloud storage per user for secure file storage, sharing, and collaboration with advanced versioning and recovery.', icon: 'CloudIcon' },
      { title: 'Email & Calendar', description: 'Professional business email with 50GB mailbox, calendar scheduling, and seamless integration with Outlook and other email clients.', icon: 'EnvelopeIcon' },
      { title: 'Microsoft Teams', description: 'Integrated collaboration platform with video conferencing, chat, file sharing, and team workspaces for seamless communication.', icon: 'UserGroupIcon' },
      { title: 'Security & Compliance', description: 'Enterprise-grade security with advanced threat protection, data loss prevention, and compliance tools for GDPR and industry standards.', icon: 'ShieldCheckIcon' },
      { title: '24/7 Support', description: 'Round-the-clock Microsoft support with guaranteed 99.9% uptime SLA, phone support, and comprehensive knowledge base access.', icon: 'ClockIcon' }
    ],
    'acronis-server-backup': [
      { title: 'Universal Backup', description: 'Complete backup App for Windows, Linux, VMware, and Hyper-V with support for physical and virtual machines.', icon: 'ServerIcon' },
      { title: 'Ransomware Protection', description: 'Advanced AI-powered ransomware detection and prevention with blockchain-based data authentication and recovery.', icon: 'ShieldCheckIcon' },
      { title: 'Instant Recovery', description: 'Fast recovery with instant VM recovery, granular file restore, and bare metal recovery capabilities.', icon: 'ArrowPathIcon' },
      { title: 'Unlimited Storage', description: 'Unlimited cloud and local backup storage with advanced compression and deduplication for optimal efficiency.', icon: 'CircleStackIcon' },
      { title: 'Centralized Management', description: 'Web-based management console for multi-tenant environments with automated reporting and monitoring.', icon: 'UsersIcon' },
      { title: 'Enterprise Security', description: '256-bit AES encryption, secure key management, and compliance with GDPR, HIPAA, and SOC 2 standards.', icon: 'LockClosedIcon' }
    ],
    'acronis-m365-backup': [
      { title: 'Complete M365 Backup', description: 'Full backup coverage for Exchange Online, OneDrive, SharePoint, and Teams with automated daily backups.', icon: 'ServerIcon' },
      { title: 'Granular Recovery', description: 'Point-in-time recovery for emails, files, and folders with granular item-level restore without full recovery.', icon: 'ArrowPathIcon' },
      { title: 'Data Protection', description: 'End-to-end encryption with 256-bit AES, secure cloud storage, and compliance with GDPR and HIPAA standards.', icon: 'ShieldCheckIcon' },
      { title: 'Flexible Export', description: 'Export backed-up data to PST, MSG, or original format for easy migration and compliance requirements.', icon: 'ArrowDownTrayIcon' },
      { title: 'Unlimited Storage', description: 'Unlimited cloud storage for backup data with configurable retention policies and automatic cleanup.', icon: 'CircleStackIcon' },
      { title: 'Easy Management', description: 'Centralized web console for managing all backups with real-time monitoring and automated reporting.', icon: 'UsersIcon' }
    ],
    'acronis-google-workspace-backup': [
      { title: 'Complete Workspace Backup', description: 'Full backup coverage for Gmail, Google Drive, Google Calendar, and Contacts with automated daily backups.', icon: 'ServerIcon' },
      { title: 'Granular Recovery', description: 'Point-in-time recovery for emails, files, and calendar events with granular item-level restore capabilities.', icon: 'ArrowPathIcon' },
      { title: 'Data Protection', description: 'End-to-end encryption with 256-bit AES, secure cloud storage, and compliance with GDPR and HIPAA standards.', icon: 'ShieldCheckIcon' },
      { title: 'Flexible Export', description: 'Export backed-up data to MBOX, PST, or original format for easy migration and compliance requirements.', icon: 'ArrowDownTrayIcon' },
      { title: 'Unlimited Storage', description: 'Unlimited cloud storage for backup data with configurable retention policies and automatic cleanup.', icon: 'CircleStackIcon' },
      { title: 'Easy Management', description: 'Centralized web console for managing all backups with real-time monitoring and automated reporting.', icon: 'UsersIcon' }
    ],
    'anti-virus': [
      { title: 'Real-Time Protection', description: 'Continuous scanning and protection against viruses, malware, ransomware, and zero-day threats with AI-powered detection.', icon: 'ShieldCheckIcon' },
      { title: 'Multi-Platform Support', description: 'Protection for Windows, macOS, and Linux with consistent security across all platforms and devices.', icon: 'ServerIcon' },
      { title: 'Firewall & Network Security', description: 'Built-in firewall with intrusion detection, network monitoring, and VPN kill switch for comprehensive network protection.', icon: 'LockClosedIcon' },
      { title: 'Lightweight Performance', description: 'Minimal system resource usage with optimized scanning that runs in background without impacting system performance.', icon: 'CpuChipIcon' },
      { title: 'Centralized Management', description: 'Unified management console for all devices with remote deployment, automatic updates, and comprehensive reporting.', icon: 'UsersIcon' },
      { title: 'Enterprise Support', description: '24/7 technical support, compliance with industry standards, and detailed audit trails for enterprise requirements.', icon: 'ClockIcon' }
    ]
  };
  
  let completed = 0;
  const totalProducts = Object.keys(productsContent).length;
  
  Object.keys(productsContent).forEach(route => {
    // Get section ID
    db.get(`
      SELECT ps.id as section_id
      FROM products p
      JOIN product_sections ps ON p.id = ps.product_id
      WHERE p.route = ? AND ps.section_type = 'features'
    `, [route], (err, section) => {
      if (err) {
        console.error(`❌ Error for ${route}:`, err.message);
        completed++;
        if (completed === totalProducts) db.close();
        return;
      }
      
      if (!section) {
        console.log(`⚠️  No section found for ${route}`);
        completed++;
        if (completed === totalProducts) db.close();
        return;
      }
      
      // Delete all existing items
      db.run(`
        DELETE FROM product_items
        WHERE section_id = ? AND item_type = 'feature_card'
      `, [section.section_id], function(err) {
        if (err) {
          console.error(`❌ Error deleting items for ${route}:`, err.message);
          completed++;
          if (completed === totalProducts) db.close();
          return;
        }
        
        console.log(`✅ Deleted ${this.changes} existing items from ${route}`);
        
        // Insert new items
        const items = productsContent[route];
        let itemCompleted = 0;
        
        items.forEach((item, index) => {
          db.run(`
            INSERT INTO product_items (section_id, title, description, item_type, icon, order_index, is_visible)
            VALUES (?, ?, ?, 'feature_card', ?, ?, 1)
          `, [section.section_id, item.title, item.description, item.icon, index + 1], function(err) {
            itemCompleted++;
            
            if (err) {
              console.error(`❌ Error inserting ${route} - ${item.title}:`, err.message);
            }
            
            if (itemCompleted === items.length) {
              console.log(`✅ Added ${items.length} features for ${route}\n`);
              completed++;
              if (completed === totalProducts) {
                console.log('✅ All Key Features updated successfully!\n');
                db.close();
              }
            }
          });
        });
      });
    });
  });
});



