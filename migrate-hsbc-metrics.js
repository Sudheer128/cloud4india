const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cms.db');

// HSBC Success Story metrics (section_id = 24)
const hsbcMetrics = [
  {
    section_id: 24,
    item_type: 'metric',
    title: 'Faster Product Delivery',
    description: 'Accelerated development cycles and faster time-to-market',
    icon: 'RocketLaunchIcon',
    value: '40%',
    label: 'Faster Product Delivery',
    order_index: 0
  },
  {
    section_id: 24,
    item_type: 'metric',
    title: 'Uptime Achieved',
    description: 'Reliable platform performance with minimal downtime',
    icon: 'ChartBarIcon',
    value: '99.9%',
    label: 'Uptime Achieved',
    order_index: 1
  },
  {
    section_id: 24,
    item_type: 'metric',
    title: 'Security Compliance',
    description: 'Full compliance with financial industry security standards',
    icon: 'ShieldCheckIcon',
    value: '100%',
    label: 'Security Compliance',
    order_index: 2
  },
  {
    section_id: 24,
    item_type: 'metric',
    title: 'Institutions Served',
    description: 'Number of financial institutions using our platform',
    icon: 'BuildingOfficeIcon',
    value: '500+',
    label: 'Institutions Served',
    order_index: 3
  }
];

console.log('Adding HSBC Success Story metrics...');

hsbcMetrics.forEach((metric, index) => {
  db.run(
    `INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, order_index, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [metric.section_id, metric.item_type, metric.title, metric.description, metric.icon, metric.value, metric.label, metric.order_index],
    function(err) {
      if (err) {
        console.error('Error inserting metric:', err);
      } else {
        console.log(`✓ Added metric ${index + 1}: ${metric.title} (${metric.value})`);
      }
    }
  );
});

// Close database after a short delay to allow inserts to complete
setTimeout(() => {
  db.close();
  console.log('✓ HSBC Success Story metrics migration completed!');
}, 1000);

