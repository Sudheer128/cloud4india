const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = process.env.DB_PATH || './cms.db';
const db = new sqlite3.Database(dbPath);

console.log('🏗️  Adding subcategories and plans for remaining categories...');

db.serialize(() => {
  // Storage subcategories (category_id = 2)
  const storageSubcategories = [
    { name: 'Block Storage', slug: 'block-storage', description: 'High-performance SSD storage for your applications', header_color: 'blue-100' },
    { name: 'Object Storage', slug: 'object-storage', description: 'Scalable storage for files, images, and backups', header_color: 'blue-200' },
    { name: 'Archive Storage', slug: 'archive-storage', description: 'Cost-effective long-term data archival', header_color: 'blue-300' }
  ];

  storageSubcategories.forEach((subcategory, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_subcategories (category_id, name, slug, description, header_color, order_index) VALUES (2, ?, ?, ?, ?, ?)`,
      [subcategory.name, subcategory.slug, subcategory.description, subcategory.header_color, index]);
  });

  // Networking subcategories (category_id = 3)
  const networkingSubcategories = [
    { name: 'Load Balancer', slug: 'load-balancer', description: 'Distribute traffic across multiple servers for high availability', header_color: 'purple-100' },
    { name: 'CDN', slug: 'cdn', description: 'Global content delivery network for faster loading times', header_color: 'purple-200' },
    { name: 'VPN Gateway', slug: 'vpn-gateway', description: 'Secure private network connections', header_color: 'purple-300' },
    { name: 'Firewall', slug: 'firewall', description: 'Advanced network security and traffic filtering', header_color: 'purple-400' }
  ];

  networkingSubcategories.forEach((subcategory, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_subcategories (category_id, name, slug, description, header_color, order_index) VALUES (3, ?, ?, ?, ?, ?)`,
      [subcategory.name, subcategory.slug, subcategory.description, subcategory.header_color, index]);
  });

  // Database subcategories (category_id = 4)
  const databaseSubcategories = [
    { name: 'MySQL', slug: 'mysql', description: 'Managed MySQL database with automatic backups and scaling', header_color: 'indigo-100' },
    { name: 'PostgreSQL', slug: 'postgresql', description: 'Advanced PostgreSQL database with high availability', header_color: 'indigo-200' },
    { name: 'MongoDB', slug: 'mongodb', description: 'NoSQL document database for modern applications', header_color: 'indigo-300' },
    { name: 'Redis', slug: 'redis', description: 'In-memory data structure store for caching and sessions', header_color: 'indigo-400' }
  ];

  databaseSubcategories.forEach((subcategory, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_subcategories (category_id, name, slug, description, header_color, order_index) VALUES (4, ?, ?, ?, ?, ?)`,
      [subcategory.name, subcategory.slug, subcategory.description, subcategory.header_color, index]);
  });

  // Security subcategories (category_id = 5)
  const securitySubcategories = [
    { name: 'SSL Certificates', slug: 'ssl-certificates', description: 'Secure your websites with trusted SSL certificates', header_color: 'red-100' },
    { name: 'DDoS Protection', slug: 'ddos-protection', description: 'Advanced protection against distributed denial of service attacks', header_color: 'red-200' },
    { name: 'Web Application Firewall', slug: 'waf', description: 'Protect web applications from common security threats', header_color: 'red-300' },
    { name: 'Security Monitoring', slug: 'security-monitoring', description: '24/7 security monitoring and threat detection', header_color: 'red-400' }
  ];

  securitySubcategories.forEach((subcategory, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_subcategories (category_id, name, slug, description, header_color, order_index) VALUES (5, ?, ?, ?, ?, ?)`,
      [subcategory.name, subcategory.slug, subcategory.description, subcategory.header_color, index]);
  });

  // Management subcategories (category_id = 6)
  const managementSubcategories = [
    { name: 'Server Monitoring', slug: 'server-monitoring', description: 'Comprehensive server performance monitoring and alerts', header_color: 'yellow-100' },
    { name: 'Backup Services', slug: 'backup-services', description: 'Automated backup Apps for your data protection', header_color: 'yellow-200' },
    { name: 'Migration Services', slug: 'migration-services', description: 'Professional migration services for seamless transitions', header_color: 'yellow-300' },
    { name: 'Support Plans', slug: 'support-plans', description: 'Premium support plans with dedicated assistance', header_color: 'yellow-400' }
  ];

  managementSubcategories.forEach((subcategory, index) => {
    db.run(`INSERT OR IGNORE INTO pricing_subcategories (category_id, name, slug, description, header_color, order_index) VALUES (6, ?, ?, ?, ?, ?)`,
      [subcategory.name, subcategory.slug, subcategory.description, subcategory.header_color, index]);
  });

  console.log('✅ Subcategories added for all categories!');
});

// Add sample pricing plans for each subcategory
setTimeout(() => {
  db.serialize(() => {
    console.log('📊 Adding sample pricing plans...');

    // Block Storage plans (subcategory_id = 5)
    const blockStoragePlans = [
      { ram: 'N/A', vcpu: 'N/A', storage: '100 GB', bandwidth: 'Unlimited', discount: '10%', hourly: '₹0.15', monthly: '₹100', yearly: '₹1,080' },
      { ram: 'N/A', vcpu: 'N/A', storage: '500 GB', bandwidth: 'Unlimited', discount: '15%', hourly: '₹0.70', monthly: '₹450', yearly: '₹4,590', popular: 1 },
      { ram: 'N/A', vcpu: 'N/A', storage: '1 TB', bandwidth: 'Unlimited', discount: '20%', hourly: '₹1.30', monthly: '₹800', yearly: '₹8,640' }
    ];

    blockStoragePlans.forEach((plan, index) => {
      db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (5, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.ram, plan.vcpu, plan.storage, plan.bandwidth, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
    });

    // Object Storage plans (subcategory_id = 6)
    const objectStoragePlans = [
      { ram: 'N/A', vcpu: 'N/A', storage: '1 TB', bandwidth: '100 GB Transfer', discount: '0%', hourly: '₹0.08', monthly: '₹60', yearly: '₹648' },
      { ram: 'N/A', vcpu: 'N/A', storage: '5 TB', bandwidth: '500 GB Transfer', discount: '10%', hourly: '₹0.35', monthly: '₹270', yearly: '₹2,916', popular: 1 },
      { ram: 'N/A', vcpu: 'N/A', storage: '10 TB', bandwidth: '1 TB Transfer', discount: '15%', hourly: '₹0.65', monthly: '₹510', yearly: '₹5,202' }
    ];

    objectStoragePlans.forEach((plan, index) => {
      db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (6, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.ram, plan.vcpu, plan.storage, plan.bandwidth, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
    });

    // Load Balancer plans (subcategory_id = 9)
    const loadBalancerPlans = [
      { ram: '2 GB', vcpu: '1 vCPU', storage: '25 GB SSD', bandwidth: '1 TB', discount: '0%', hourly: '₹2.50', monthly: '₹1,800', yearly: '₹19,440' },
      { ram: '4 GB', vcpu: '2 vCPU', storage: '50 GB SSD', bandwidth: '2 TB', discount: '10%', hourly: '₹4.50', monthly: '₹3,240', yearly: '₹34,992', popular: 1 },
      { ram: '8 GB', vcpu: '4 vCPU', storage: '100 GB SSD', bandwidth: '5 TB', discount: '15%', hourly: '₹8.50', monthly: '₹6,120', yearly: '₹62,424' }
    ];

    loadBalancerPlans.forEach((plan, index) => {
      db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (9, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.ram, plan.vcpu, plan.storage, plan.bandwidth, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
    });

    // MySQL plans (subcategory_id = 13)
    const mysqlPlans = [
      { ram: '1 GB', vcpu: '1 vCPU', storage: '20 GB SSD', bandwidth: 'Unlimited', discount: '0%', hourly: '₹1.80', monthly: '₹1,296', yearly: '₹13,996.80' },
      { ram: '2 GB', vcpu: '2 vCPU', storage: '40 GB SSD', bandwidth: 'Unlimited', discount: '10%', hourly: '₹3.24', monthly: '₹2,332.80', yearly: '₹25,194.24', popular: 1 },
      { ram: '4 GB', vcpu: '4 vCPU', storage: '80 GB SSD', bandwidth: 'Unlimited', discount: '15%', hourly: '₹5.94', monthly: '₹4,276.80', yearly: '₹43,588.32' }
    ];

    mysqlPlans.forEach((plan, index) => {
      db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (13, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.ram, plan.vcpu, plan.storage, plan.bandwidth, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
    });

    // SSL Certificate plans (subcategory_id = 17)
    const sslPlans = [
      { ram: 'N/A', vcpu: 'N/A', storage: 'Single Domain', bandwidth: 'N/A', discount: '0%', hourly: 'N/A', monthly: '₹500', yearly: '₹5,400' },
      { ram: 'N/A', vcpu: 'N/A', storage: 'Wildcard', bandwidth: 'N/A', discount: '10%', hourly: 'N/A', monthly: '₹2,700', yearly: '₹29,160', popular: 1 },
      { ram: 'N/A', vcpu: 'N/A', storage: 'Multi-Domain', bandwidth: 'N/A', discount: '15%', hourly: 'N/A', monthly: '₹4,250', yearly: '₹43,350' }
    ];

    sslPlans.forEach((plan, index) => {
      db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (17, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.ram, plan.vcpu, plan.storage, plan.bandwidth, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
    });

    // Server Monitoring plans (subcategory_id = 21)
    const monitoringPlans = [
      { ram: 'Up to 5 Servers', vcpu: 'Basic Metrics', storage: '30 Days History', bandwidth: 'Email Alerts', discount: '0%', hourly: 'N/A', monthly: '₹999', yearly: '₹10,789' },
      { ram: 'Up to 25 Servers', vcpu: 'Advanced Metrics', storage: '90 Days History', bandwidth: 'SMS + Email Alerts', discount: '15%', hourly: 'N/A', monthly: '₹2,549', yearly: '₹26,019', popular: 1 },
      { ram: 'Unlimited Servers', vcpu: 'Custom Metrics', storage: '1 Year History', bandwidth: 'Multi-channel Alerts', discount: '20%', hourly: 'N/A', monthly: '₹4,999', yearly: '₹47,990' }
    ];

    monitoringPlans.forEach((plan, index) => {
      db.run(`INSERT OR IGNORE INTO pricing_plans (subcategory_id, ram, vcpu, storage, bandwidth, discount, hourly_price, monthly_price, yearly_price, is_popular, order_index) VALUES (21, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.ram, plan.vcpu, plan.storage, plan.bandwidth, plan.discount, plan.hourly, plan.monthly, plan.yearly, plan.popular || 0, index]);
    });

    console.log('✅ Sample pricing plans added for all subcategories!');
  });
}, 1000);

setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('🎉 All categories data setup completed successfully!');
    }
  });
}, 2000);
