const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('cms.db');

// Implementation Journey timeline phases (section_id = 28)
const journeyPhases = [
  {
    section_id: 28,
    item_type: 'timeline_phase',
    title: 'Assessment & Planning',
    description: 'Comprehensive assessment of your current financial infrastructure, compliance requirements, and operational workflows. We analyze your existing systems, identify opportunities for optimization, and create a detailed roadmap for your digital transformation.',
    icon: 'LightBulbIcon',
    value: '2-4 weeks',
    label: 'Duration',
    features: '["System analysis", "Compliance review", "Roadmap creation", "Stakeholder alignment"]',
    order_index: 0
  },
  {
    section_id: 28,
    item_type: 'timeline_phase',
    title: 'System Design & Integration',
        description: 'Architectural design and system integration planning with focus on scalability, security, and compliance. We design custom Apps tailored to your specific financial services requirements and integrate with your existing infrastructure.',
    icon: 'CogIcon',
    value: '4-8 weeks',
    label: 'Duration',
    features: '["Architecture design", "Security planning", "Integration mapping", "Compliance framework"]',
    order_index: 1
  },
  {
    section_id: 28,
    item_type: 'timeline_phase',
    title: 'Implementation & Testing',
        description: 'Phased implementation with continuous testing, validation, and optimization throughout the process. We ensure minimal disruption to your operations while delivering a robust, scalable financial App.',
    icon: 'RocketLaunchIcon',
    value: '8-16 weeks',
    label: 'Duration',
    features: '["Phased deployment", "Continuous testing", "Performance optimization", "User training"]',
    order_index: 2
  },
  {
    section_id: 28,
    item_type: 'timeline_phase',
    title: 'Go-Live & Support',
    description: 'Smooth transition to production with 24/7 financial services support, training, and ongoing optimization services. Our dedicated team ensures your success with continuous monitoring and improvement.',
    icon: 'HandRaisedIcon',
    value: 'Ongoing',
    label: 'Duration',
    features: '["24/7 support", "Performance monitoring", "Continuous optimization", "Training & documentation"]',
    order_index: 3
  }
];

console.log('Adding Implementation Journey timeline phases...');

journeyPhases.forEach((phase, index) => {
  db.run(
    `INSERT INTO section_items (section_id, item_type, title, description, icon, value, label, features, order_index, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [phase.section_id, phase.item_type, phase.title, phase.description, phase.icon, phase.value, phase.label, phase.features, phase.order_index],
    function(err) {
      if (err) {
        console.error('Error inserting phase:', err);
      } else {
        console.log(`✓ Added phase ${index + 1}: ${phase.title}`);
      }
    }
  );
});

// Close database after a short delay to allow inserts to complete
setTimeout(() => {
  db.close();
  console.log('✓ Implementation Journey migration completed!');
}, 1000);


