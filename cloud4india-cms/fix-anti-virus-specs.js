const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');

console.log('🔧 Fixing Anti-Virus specifications...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  
  // Get section ID
  db.get(`
    SELECT ps.id as section_id
    FROM products p
    JOIN product_sections ps ON p.id = ps.product_id
    WHERE p.route = 'anti-virus' AND ps.section_type = 'specifications'
  `, [], (err, section) => {
    if (err) {
      console.error('❌ Error:', err.message);
      db.close();
      process.exit(1);
    }
    
    if (!section) {
      console.log('❌ No section found for anti-virus');
      db.close();
      process.exit(1);
    }
    
    // Delete all existing items
    db.run(`
      DELETE FROM product_items
      WHERE section_id = ? AND item_type = 'specification'
    `, [section.section_id], function(err) {
      if (err) {
        console.error('❌ Error deleting existing items:', err.message);
        db.close();
        process.exit(1);
      }
      
      console.log(`✅ Deleted ${this.changes} existing items`);
      
      // Insert correct items with 3 points each
      const items = [
        {
          title: 'Protection Features',
          description: 'Comprehensive malware and threat protection',
          content: '{"features": ["Real-time scanning and protection against viruses, malware, and ransomware", "Advanced threat detection with AI and machine learning", "Behavioral analysis to detect zero-day threats"]}',
          icon: 'ShieldCheckIcon',
          order: 1
        },
        {
          title: 'Supported Platforms',
          description: 'Multi-platform protection coverage',
          content: '{"features": ["Windows 10, 11, and Windows Server 2016-2022", "macOS 10.14 and later versions", "Linux distributions (Ubuntu, CentOS, RHEL, Debian)"]}',
          icon: 'ServerIcon',
          order: 2
        },
        {
          title: 'Firewall & Network Protection',
          description: 'Advanced network security features',
          content: '{"features": ["Built-in firewall with intrusion detection and prevention", "Network traffic monitoring and blocking of suspicious activities", "VPN kill switch and secure connection protection"]}',
          icon: 'LockClosedIcon',
          order: 3
        },
        {
          title: 'Performance & Optimization',
          description: 'Lightweight and efficient protection',
          content: '{"features": ["Minimal system resource usage with optimized scanning", "Background scanning without impacting system performance", "Automatic updates with minimal bandwidth usage"]}',
          icon: 'CpuChipIcon',
          order: 4
        },
        {
          title: 'Management & Updates',
          description: 'Centralized management and automatic updates',
          content: '{"features": ["Centralized management console for all devices", "Automatic virus definition and engine updates", "Remote management and deployment capabilities"]}',
          icon: 'UsersIcon',
          order: 5
        },
        {
          title: 'Support & Compliance',
          description: 'Enterprise support and compliance features',
          content: '{"features": ["24/7 technical support and assistance", "Compliance with industry standards and regulations", "Detailed reporting and audit trail capabilities"]}',
          icon: 'ClockIcon',
          order: 6
        }
      ];
      
      let completed = 0;
      
      items.forEach(item => {
        db.run(`
          INSERT INTO product_items (section_id, title, description, content, item_type, icon, order_index, is_visible)
          VALUES (?, ?, ?, ?, 'specification', ?, ?, 1)
        `, [section.section_id, item.title, item.description, item.content, item.icon, item.order], function(err) {
          completed++;
          
          if (err) {
            console.error(`❌ Error inserting ${item.title}:`, err.message);
          } else {
            console.log(`✅ Added ${item.title} (order: ${item.order})`);
          }
          
          if (completed === items.length) {
            console.log('\n✅ Anti-Virus specifications fixed!\n');
            db.close();
          }
        });
      });
    });
  });
});



