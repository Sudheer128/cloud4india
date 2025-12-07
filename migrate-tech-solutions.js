const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cms.db');

// Advanced Technology Apps content (section_id = 25)
const techAppsItems = [
  {
    section_id: 25,
    item_type: 'ai_ml_section',
    title: 'AI & Machine Learning for Financial Services',
        description: 'Transform your financial operations with AI-powered Apps for fraud detection, risk assessment, algorithmic trading, and personalized financial recommendations. Our ML platform is designed to meet the unique requirements of financial institutions.',
        icon: 'CpuChipIcon',
        value: 'Explore AI Apps',
        label: 'AI Apps',
    features: '["Advanced fraud detection and prevention", "Real-time risk assessment and monitoring", "Algorithmic trading and portfolio optimization", "Personalized financial recommendations"]',
    order_index: 0
  },
  {
    section_id: 25,
    item_type: 'analytics_card',
    title: 'AI-Powered Financial Analytics',
    description: 'Advanced machine learning models trained specifically for financial data patterns and risk assessment requirements.',
    icon: 'ChartBarIcon',
    value: 'Analytics Platform',
    label: 'Analytics',
    features: '["Real-time data processing", "Predictive analytics", "Risk modeling", "Compliance monitoring"]',
    order_index: 1
  }
];

console.log('Adding Advanced Technology Apps content...');

techAppsItems.forEach((item, index) => {
  db.run(
    `INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [item.section_id, item.item_type, item.title, item.description, item.icon, item.value, item.label, item.features, item.order_index],
    function(err) {
      if (err) {
        console.error('Error inserting item:', err);
      } else {
        console.log(`✓ Added item ${index + 1}: ${item.title}`);
      }
    }
  );
});

// Close database after a short delay to allow inserts to complete
setTimeout(() => {
  db.close();
  console.log('✓ Advanced Technology Apps migration completed!');
}, 1000);

