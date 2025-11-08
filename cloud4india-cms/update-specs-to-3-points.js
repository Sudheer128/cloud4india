const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🔄 Updating specifications to 3 points each...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  // Updated content with only 3 points each
  const updates = {
    'microsoft-365-licenses': [
      {
        title: 'Mailbox & Email Storage',
        content: '{"features": ["50GB mailbox storage per user included with all plans", "Expandable to 100GB with In-Place Archiving feature", "Support for email attachments up to 150MB in size"]}'
      },
      {
        title: 'OneDrive Cloud Storage',
        content: '{"features": ["1TB OneDrive cloud storage per user included", "Real-time file synchronization across all devices", "Offline access to files when internet is unavailable"]}'
      },
      {
        title: 'User Management & Licensing',
        content: '{"features": ["Support for up to 300 users per business subscription", "Flexible license assignment and reassignment options", "Easy user addition and removal through admin portal"]}'
      },
      {
        title: 'Microsoft Teams & Collaboration',
        content: '{"features": ["Unlimited video calls and meetings with up to 300 participants", "Screen sharing, file sharing, and live document collaboration", "Integration with Outlook calendar and email"]}'
      },
      {
        title: 'System Requirements & Compatibility',
        content: '{"features": ["Windows 10 or later, macOS 10.14 or later for desktop apps", "Mobile apps available for iOS 13+ and Android 8+", "Web browser access from any device with modern browser"]}'
      },
      {
        title: 'Service Level & Support',
        content: '{"features": ["99.9% uptime SLA guarantee with financial credits for downtime", "24/7 service availability worldwide with global data centers", "Phone, chat, and web-based support channels included"]}'
      }
    ],
    'acronis-server-backup': [
      {
        title: 'Storage & Backup Capacity',
        content: '{"features": ["Unlimited backup storage capacity with no size restrictions", "Advanced compression reduces storage usage by up to 50%", "Cloud storage, local storage, and hybrid backup options"]}'
      },
      {
        title: 'Data Protection & Security',
        content: '{"features": ["256-bit AES encryption for data at rest and in transit", "Advanced ransomware protection with AI-powered detection", "Compliance with GDPR, HIPAA, and SOC 2 standards"]}'
      },
      {
        title: 'Supported Operating Systems',
        content: '{"features": ["Windows Server 2008 R2 through Windows Server 2022", "All major Linux distributions (Ubuntu, CentOS, RHEL, Debian, SUSE)", "VMware ESXi and Microsoft Hyper-V virtual machines"]}'
      },
      {
        title: 'Backup Scheduling & Frequency',
        content: '{"features": ["Continuous Data Protection (CDP) for real-time backup", "Customizable scheduled backups with hourly, daily, weekly options", "On-demand manual backup creation at any time"]}'
      },
      {
        title: 'Performance & Optimization',
        content: '{"features": ["Fast incremental backups saving time and bandwidth", "Parallel backup processing for multiple machines simultaneously", "Minimal CPU and memory usage during backup operations"]}'
      },
      {
        title: 'Management & Monitoring',
        content: '{"features": ["Centralized web-based management console for all backups", "Automated reporting and email alerting system", "Real-time backup monitoring and status dashboard"]}'
      }
    ]
  };
  
  let totalUpdated = 0;
  let completed = 0;
  
  Object.keys(updates).forEach(route => {
    // Get section ID
    db.get(`
      SELECT ps.id as section_id
      FROM products p
      JOIN product_sections ps ON p.id = ps.product_id
      WHERE p.route = ? AND ps.section_type = 'specifications'
    `, [route], (err, section) => {
      if (err) {
        console.error(`❌ Error getting section for ${route}:`, err.message);
        completed++;
        if (completed === Object.keys(updates).length) {
          db.close();
          console.log(`\n✅ Updated ${totalUpdated} specifications\n`);
        }
        return;
      }
      
      if (!section) {
        console.log(`⚠️  No section found for ${route}`);
        completed++;
        if (completed === Object.keys(updates).length) {
          db.close();
          console.log(`\n✅ Updated ${totalUpdated} specifications\n`);
        }
        return;
      }
      
      const itemsToUpdate = updates[route];
      let itemCompleted = 0;
      
      itemsToUpdate.forEach(item => {
        db.run(`
          UPDATE product_items
          SET content = ?, updated_at = CURRENT_TIMESTAMP
          WHERE section_id = ? AND title = ? AND item_type = 'specification'
        `, [item.content, section.section_id, item.title], function(err) {
          itemCompleted++;
          
          if (err) {
            console.error(`❌ Error updating ${route} - ${item.title}:`, err.message);
          } else if (this.changes > 0) {
            console.log(`✅ Updated ${route} - ${item.title}`);
            totalUpdated++;
          }
          
          if (itemCompleted === itemsToUpdate.length) {
            completed++;
            if (completed === Object.keys(updates).length) {
              db.close();
              console.log(`\n✅ Updated ${totalUpdated} specifications\n`);
            }
          }
        });
      });
    });
  });
});



