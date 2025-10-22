const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cms.db');

// Real-World Use Cases content (section_id = 26)
const useCasesItems = [
  {
    section_id: 26,
    item_type: 'use_case_card',
    title: 'Digital Banking Platform',
    description: 'Complete digital transformation for retail banking with mobile-first design, real-time processing, and personalized customer experiences.',
    icon: 'BanknotesIcon',
    value: 'Mobile Banking • Real-time • Personalized',
    label: 'Digital Banking',
    features: '["Mobile-first design", "Real-time processing", "Personalized experiences", "24/7 availability"]',
    order_index: 0
  },
  {
    section_id: 26,
    item_type: 'use_case_card',
    title: 'Advanced Risk Management',
    description: 'AI-powered risk assessment and fraud detection systems that provide real-time monitoring and automated decision-making capabilities.',
    icon: 'ShieldCheckIcon',
    value: 'AI-powered • Real-time • Automated',
    label: 'Risk Management',
    features: '["AI-powered assessment", "Real-time monitoring", "Automated decisions", "Fraud detection"]',
    order_index: 1
  },
  {
    section_id: 26,
    item_type: 'use_case_card',
    title: 'Payment Processing Platform',
    description: 'High-performance payment processing with support for multiple currencies, payment methods, and cross-border transactions.',
    icon: 'CreditCardIcon',
    value: 'Multi-currency • Cross-border • High-performance',
    label: 'Payment Processing',
    features: '["Multi-currency support", "Cross-border transactions", "High-performance", "Multiple payment methods"]',
    order_index: 2
  }
];

console.log('Adding Real-World Use Cases content...');

useCasesItems.forEach((item, index) => {
  db.run(
    `INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [item.section_id, item.item_type, item.title, item.description, item.icon, item.value, item.label, item.features, item.order_index],
    function(err) {
      if (err) {
        console.error('Error inserting item:', err);
      } else {
        console.log(`✓ Added card ${index + 1}: ${item.title}`);
      }
    }
  );
});

// Close database after a short delay to allow inserts to complete
setTimeout(() => {
  db.close();
  console.log('✓ Real-World Use Cases migration completed!');
}, 1000);


