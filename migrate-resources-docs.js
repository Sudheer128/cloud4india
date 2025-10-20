const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cms.db');

// Resources & Documentation content (section_id = 29)
const resourcesItems = [
  {
    section_id: 29,
    item_type: 'featured_resource',
    title: 'Financial Services Implementation Guide',
    description: 'Our comprehensive 150-page guide covers everything you need to know about implementing Cloud4India for financial services, including compliance, security best practices, and real-world case studies.',
    icon: 'DocumentTextIcon',
    value: 'Download PDF Guide',
    label: 'Featured Resource',
    features: '["Compliance checklist", "Financial workflow templates", "Security configuration guide", "Integration best practices"]',
    order_index: 0
  },
  {
    section_id: 29,
    item_type: 'resource_category',
    title: 'Video Learning Center',
    description: 'Comprehensive video library with 50+ tutorials covering financial services implementation, compliance workflows, and advanced features.',
    icon: 'PlayIcon',
    value: '50+ Videos • 12+ Hours Content',
    label: 'Browse Videos',
    features: '["Implementation tutorials", "Compliance workflows", "Advanced features", "Best practices"]',
    order_index: 1
  },
  {
    section_id: 29,
    item_type: 'resource_category',
    title: 'API Documentation',
    description: 'Complete API reference with interactive examples, SDKs, and integration guides for building custom financial applications.',
    icon: 'CodeBracketIcon',
    value: 'Complete API Reference',
    label: 'View Docs',
    features: '["Interactive examples", "SDKs", "Integration guides", "Custom applications"]',
    order_index: 2
  },
  {
    section_id: 29,
    item_type: 'resource_category',
    title: 'Community Forum',
    description: 'Connect with other financial services professionals, share best practices, and get expert support from our community.',
    icon: 'UsersIcon',
    value: 'Expert Community',
    label: 'Join Forum',
    features: '["Professional network", "Best practices", "Expert support", "Knowledge sharing"]',
    order_index: 3
  }
];

console.log('Adding Resources & Documentation content...');

resourcesItems.forEach((item, index) => {
  db.run(
    `INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [item.section_id, item.item_type, item.title, item.description, item.icon, item.value, item.label, item.features, item.order_index],
    function(err) {
      if (err) {
        console.error('Error inserting item:', err);
      } else {
        console.log(`✓ Added resource ${index + 1}: ${item.title}`);
      }
    }
  );
});

// Close database after a short delay to allow inserts to complete
setTimeout(() => {
  db.close();
  console.log('✓ Resources & Documentation migration completed!');
}, 1000);


